---
sidebar_position: 3
slug: "/Frontend/JavaScript/ffmpeg/node-production"
title: "FFmpeg 03：Node.js 後端整合與正式環境"
description: "使用 Node.js 安全執行 FFmpeg 與 ffprobe，設計非同步 job、進度、取消、資源限制與正式環境影音管線。"
tags:
  - JavaScript
  - Node.js
  - FFmpeg
keywords: ["Node.js FFmpeg", "child_process spawn", "ffprobe JSON", "轉碼佇列", "影音後端"]
---

# FFmpeg 03：Node.js 後端整合與正式環境

後端接到影音上傳後，不應在 HTTP request 內同步等完整轉碼結束。較穩定的架構是：保存原檔、建立背景 job、由 worker 執行 FFmpeg，再更新狀態與成品位置。

```text
Browser
  │ 1. upload
  ▼
Object storage / temp file
  │ 2. create job
  ▼
Queue → media worker → ffprobe → ffmpeg → validate output
                         │                    │
                         └── progress ────────┘
                                  │
                                  ▼
                         DB / event / polling
```

## 1. 為什麼使用 `spawn()` 而不是拼 shell 字串

Node.js 內建的 `child_process.spawn()` 可把每個參數分開傳給 process，不需要讓 shell 重新解析整段字串：

```js
import { spawn } from "node:child_process";

const child = spawn("ffmpeg", [
  "-hide_banner",
  "-nostdin",
  "-y",
  "-i",
  inputPath,
  "-c:v",
  "libx264",
  "-crf",
  "23",
  "-c:a",
  "aac",
  outputPath,
], {
  shell: false,
  stdio: ["ignore", "ignore", "pipe"],
});
```

避免以下寫法：

```js
// 不要把使用者檔名直接插入 shell command。
exec(`ffmpeg -i "${userFilename}" "${outputPath}"`);
```

檔名可能含 shell metacharacters，字串 escaping 也很容易漏掉。即使使用 `spawn()`，仍要限制可接受的操作與參數；不要讓 API 呼叫者任意傳入 FFmpeg arguments。

## 2. 封裝一個可取消、可限制時間的 runner

```js
import { spawn } from "node:child_process";

export function runProcess(command, args, { signal, timeoutMs = 15 * 60_000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      signal,
    });

    let stdout = "";
    let stderr = "";
    const maxLogChars = 200_000;

    const append = (current, chunk) =>
      (current + chunk.toString()).slice(-maxLogChars);

    child.stdout.on("data", (chunk) => {
      stdout = append(stdout, chunk);
    });

    child.stderr.on("data", (chunk) => {
      stderr = append(stderr, chunk);
    });

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
    }, timeoutMs);

    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.once("close", (code, terminationSignal) => {
      clearTimeout(timer);

      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          `${command} failed: code=${code}, signal=${terminationSignal}\n${stderr}`,
        ),
      );
    });
  });
}
```

這是示意骨架，正式系統還要處理：

- `SIGTERM` 後仍未結束的 process 如何升級終止；
- worker 異常重啟後，如何找回或重試 job；
- log 上限與敏感資料遮蔽；
- 輸出檔只完成一半時的清理策略；
- Linux container 中 process tree 與 signal 傳遞方式。

## 3. 使用 ffprobe JSON 驗證輸入

```js
export async function probeMedia(inputPath, options = {}) {
  const { stdout } = await runProcess(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_format",
      "-show_streams",
      "-of",
      "json",
      inputPath,
    ],
    options,
  );

  return JSON.parse(stdout);
}
```

檢查範例：

```js
export function validateMedia(metadata) {
  const video = metadata.streams.find((stream) => stream.codec_type === "video");
  const duration = Number(metadata.format?.duration);

  if (!video) throw new Error("找不到 video stream");
  if (!Number.isFinite(duration) || duration <= 0 || duration > 60 * 60) {
    throw new Error("影片時長不符合限制");
  }
  if (video.width > 3840 || video.height > 2160) {
    throw new Error("影片解析度超過 4K 限制");
  }
}
```

這只是第一層驗證。攻擊者可偽造 metadata 或提供會大量消耗 decoder 資源的內容，因此還需要檔案大小、timeout、CPU、memory、disk 與輸出大小限制。

## 4. 取得機器可解析的進度

與其解析一般 stderr 的 `time=...` 顯示，可以使用 `-progress pipe:1`：

```js
const args = [
  "-hide_banner",
  "-nostdin",
  "-y",
  "-i",
  inputPath,
  "-c:v",
  "libx264",
  "-c:a",
  "aac",
  "-progress",
  "pipe:1",
  "-nostats",
  outputPath,
];

const child = spawn("ffmpeg", args, { shell: false });

let buffer = "";

child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";

  for (const line of lines) {
    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator);
    const value = line.slice(separator + 1);

    if (key === "out_time_us") {
      const processedSeconds = Number(value) / 1_000_000;
      console.log({ processedSeconds });
    }
  }
});
```

先用 ffprobe 取得總時長，才可用 `processedSeconds / duration` 估算百分比。注意：

- 輸入是直播時沒有固定總時長；
- filter、concat、改變速度時，輸出時間軸可能與來源不同；
- 進度不應假裝精準，UI 可顯示階段與近似百分比；
- `progress=end` 才代表 FFmpeg 回報結束，最終仍要檢查 exit code 與輸出檔。

## 5. Job 狀態與冪等性

可將媒體 job 設計為：

```text
queued
  → probing
  → transcoding
  → validating
  → uploading
  → completed

任一階段 → failed / cancelled
```

實務原則：

- 為 job 建立唯一 ID，不用原始檔名當識別；
- 輸出先寫到暫存名稱，驗證成功後再發布；
- 同一個 job 重試時，使用可預測且隔離的工作目錄；
- 資料庫狀態與 object storage 上傳不可能天然是同一個 transaction，要設計補償；
- retry 只適合暫時性錯誤；輸入格式不支援不應無限重試；
- 記錄 FFmpeg version、命令參數摘要與來源 hash，方便重現。

## 6. 資源隔離與安全邊界

影音轉碼是高資源、處理不可信二進位輸入的工作，不宜與主要 Web API process 混在一起。

至少考慮：

- **檔案限制**：上傳大小、stream 數量、時長、解析度、frame rate；
- **時間限制**：probe 與 transcode 各自 timeout；
- **資源限制**：container CPU、memory、temporary disk、process 數；
- **網路限制**：如果不需要 FFmpeg 自己抓遠端 URL，就不要開放任意 URL；
- **路徑隔離**：每個 job 使用自己的暫存目錄，輸出不可逃出該目錄；
- **版本維護**：固定可重現版本，持續更新安全修補；
- **併發控制**：worker concurrency 依 CPU、memory 與 codec 壓力設定，不依 request 量無限擴張。

使用者提供 URL 時還會增加 SSRF、redirect、內網存取、無限串流與下載炸彈等風險。較安全的做法通常是由受控下載器先取得檔案、驗證大小與目的地，再交給 FFmpeg 處理本機檔案。

## 7. 部署時不要假設每台 FFmpeg 都一樣

不同 OS package、Docker image 或自行編譯版本，可能有不同：

- encoder／decoder；
- GPL 或非自由函式庫；
- font 與字幕渲染能力；
- GPU driver 與硬體 encoder；
- 預設 protocol、filter 與 build configuration。

在 CI 或 worker 啟動時可記錄：

```bash
ffmpeg -version
ffmpeg -hide_banner -encoders
ffmpeg -hide_banner -filters
```

並用一小段固定測試素材做 smoke test。只檢查 binary 存在，不代表正式指令需要的所有能力都存在。

## 8. API 應回傳 job，不要長時間卡住 request

```http
POST /api/media-jobs
→ 202 Accepted
{
  "jobId": "media_01...",
  "status": "queued"
}
```

前端可透過 polling、SSE 或 WebSocket 接收：

```json
{
  "jobId": "media_01...",
  "status": "transcoding",
  "progress": 0.42
}
```

完成後再取得播放 URL。signed URL、CDN cache、Range request 與輸出 MIME type 是交付層的責任，不要把「FFmpeg 成功結束」當成整條影音功能已完成。

下一篇：[FFmpeg 04：ffmpeg.wasm 瀏覽器實作與取捨](./04-ffmpeg-wasm-browser.md)。

## 官方資料

- [Node.js：Child process](https://nodejs.org/api/child_process.html)
- [FFmpeg：`-progress` 與通用選項](https://ffmpeg.org/ffmpeg.html)
- [FFmpeg：ffprobe Documentation](https://ffmpeg.org/ffprobe.html)
- [FFmpeg：Security](https://ffmpeg.org/security.html)
