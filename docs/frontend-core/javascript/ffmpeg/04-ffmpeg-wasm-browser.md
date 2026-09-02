---
sidebar_position: 4
slug: "/Frontend/JavaScript/ffmpeg/wasm-browser"
title: "FFmpeg 04：ffmpeg.wasm 瀏覽器實作與取捨"
description: "理解 ffmpeg.wasm 的架構、載入與檔案流程，並判斷哪些影音工作適合放在瀏覽器、哪些應交給後端。"
tags:
  - JavaScript
  - WebAssembly
  - FFmpeg
keywords: ["ffmpeg.wasm", "WebAssembly", "Web Worker", "瀏覽器轉檔", "前端影片處理"]
---

# FFmpeg 04：ffmpeg.wasm 瀏覽器實作與取捨

`ffmpeg.wasm` 是 FFmpeg 的 WebAssembly／JavaScript port，可在瀏覽器內執行影音處理。它不是瀏覽器原生 FFmpeg，也不等於安裝在伺服器上的 native FFmpeg。

```text
File / Blob
   │ writeFile
   ▼
ffmpeg.wasm virtual file system
   │
   ▼
Web Worker → WebAssembly core → exec([...args])
   │
   ▼
virtual output file
   │ readFile
   ▼
Uint8Array → Blob → object URL / upload
```

## 1. 什麼情境適合放在瀏覽器

適合考慮：

- 短影音的小型裁切、轉檔或擷取縮圖；
- 敏感檔案不希望先上傳伺服器；
- 離線工具；
- 上傳前先做有限度的預處理；
- demo、內部工具或可接受裝置性能差異的功能。

通常不適合：

- 長影片、4K、大量批次轉碼；
- 需要穩定 SLA 與一致輸出的正式媒體管線；
- 行動裝置上高 CPU、memory、耗電的工作；
- 必須依賴特定 native build、GPU encoder 或完整 filter 的流程；
- 多使用者都要重複下載大型 Wasm core 的一般頁面。

官方效能比較也提醒：即使 multi-thread 版本，WebAssembly 版本仍可能明顯慢於 native FFmpeg。應用自己的素材、目標裝置與瀏覽器實測，不要只在開發機測一次。

## 2. 安裝與初始化

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

以下示範單執行緒 core；實際版本請固定在專案 dependency 與自己控制的靜態資源位置：

```js
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

export async function loadFFmpeg() {
  if (ffmpeg.loaded) return;

  const coreBaseUrl = "/vendor/ffmpeg-core";

  ffmpeg.on("log", ({ message }) => {
    console.debug("[ffmpeg]", message);
  });

  await ffmpeg.load({
    coreURL: await toBlobURL(
      `${coreBaseUrl}/ffmpeg-core.js`,
      "text/javascript",
    ),
    wasmURL: await toBlobURL(
      `${coreBaseUrl}/ffmpeg-core.wasm`,
      "application/wasm",
    ),
  });
}
```

`@ffmpeg/ffmpeg` 會使用 Web Worker。官方文件建議以 package manager 安裝，core 資源通常應自行託管；若用第三方 CDN，還要處理版本固定、CORS、可用性與供應鏈風險。

## 3. WebM 轉 MP4

```js
import { fetchFile } from "@ffmpeg/util";

export async function convertWebMToMp4(file) {
  await loadFFmpeg();

  const jobId = crypto.randomUUID();
  const inputName = `${jobId}.webm`;
  const outputName = `${jobId}.mp4`;

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const exitCode = await ffmpeg.exec([
      "-i",
      inputName,
      "-c:v",
      "libx264",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      outputName,
    ]);

    if (exitCode !== 0) {
      throw new Error(`FFmpeg failed with exit code ${exitCode}`);
    }

    const data = await ffmpeg.readFile(outputName);
    return new Blob([data.buffer], { type: "video/mp4" });
  } finally {
    await Promise.allSettled([
      ffmpeg.deleteFile(inputName),
      ffmpeg.deleteFile(outputName),
    ]);
  }
}
```

預覽並釋放 object URL：

```js
const outputBlob = await convertWebMToMp4(file);
const previewUrl = URL.createObjectURL(outputBlob);

video.src = previewUrl;

function cleanupPreview() {
  URL.revokeObjectURL(previewUrl);
}
```

## 4. 進度、取消與 UI 狀態

```js
ffmpeg.on("progress", ({ progress, time }) => {
  console.log({ progress, time });
});
```

進度值對所有指令都不一定準確，尤其是輸出時間軸與輸入不同、串流沒有固定長度或 filter 很複雜時。UI 可以呈現：

```text
idle → loading-core → reading-file → processing → reading-output → done
                                          └───────────────→ error / cancelled
```

官方 API 可讓 `exec()` 接收 `AbortSignal`：

```js
const controller = new AbortController();

const task = ffmpeg.exec(
  ["-i", inputName, "-c:v", "libx264", outputName],
  undefined,
  { signal: controller.signal },
);

cancelButton.addEventListener("click", () => controller.abort());

await task;
```

取消後仍要清理虛擬檔案，並讓 UI 回到可再次操作的狀態。

## 5. Single-thread 與 multi-thread

`ffmpeg.wasm` 提供 single-thread 與 multi-thread cores。multi-thread 可能更快，但需要更多 worker、CPU 與 memory，也會牽涉 cross-origin isolation。

要在瀏覽器使用 `SharedArrayBuffer` 類能力，頁面通常需要正確設定：

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

這些 header 會影響第三方 iframe、script、image 等資源如何載入，不能只為了開 multi-thread 就直接上線。先盤點所有跨來源資源，確認它們能配合 CORS 或 CORP。

選擇原則：

| 選項 | 優點 | 代價 |
| --- | --- | --- |
| single-thread | 部署限制較少、行為較單純 | 處理通常較慢 |
| multi-thread | 可利用多核心 | 更高 CPU／memory、需要 cross-origin isolation |
| native backend | 通常效能與可控性最好 | 需要上傳、worker、儲存與伺服器成本 |

## 6. 記憶體與大檔案問題

最基本的流程可能同時存在：

1. 使用者選取的 `File`；
2. `fetchFile()` 讀出的 bytes；
3. Wasm 虛擬檔案系統中的 input；
4. 解碼與編碼工作記憶體；
5. Wasm 虛擬檔案系統中的 output；
6. `readFile()` 回傳資料與最後的 `Blob`。

所以一個 500 MB 檔案不代表只使用 500 MB 記憶體。處理前應：

- 限制檔案大小、時長、解析度與允許的格式；
- 提示行動裝置風險；
- 用真實最差素材測試 peak memory；
- 完成後 `deleteFile()` 並 revoke object URL；
- 避免同時啟動多個重型 job；
- 不要讓使用者離開頁面時仍誤以為背景會可靠完成。

## 7. 常見整合陷阱

### core 載入失敗

檢查資源 URL、版本是否匹配、CORS、CSP、MIME type，以及 bundler 使用 ESM 還是 UMD 路徑。

### 開發環境能跑，部署後失敗

常見原因是 base path、CDN header、worker URL、CSP 或 cross-origin isolation 不同。應從部署後頁面的 Network 與 Console 檢查每個 core 資源。

### UI 卡頓或裝置過熱

主要轉碼在 worker 不代表沒有資源成本。大量 CPU、memory 與檔案複製仍會影響頁面及整台裝置。

### 把 ffmpeg.wasm 用在 Node.js

目前官方文件指出 0.12.0 起不再支援 Node.js。伺服器環境通常應直接執行 native FFmpeg；不要為了共用前端套件而犧牲效能與維護性。

## 8. 前端或後端：決策表

| 問題 | 偏向 ffmpeg.wasm | 偏向後端 FFmpeg |
| --- | --- | --- |
| 檔案很小、處理很短 | ✓ | |
| 原檔不能離開裝置 | ✓ | |
| 要離線工作 | ✓ | |
| 長影片／4K／大量批次 | | ✓ |
| 要一致 codec 與品質 | | ✓ |
| 需要背景可靠完成 | | ✓ |
| 需要 GPU 或特定 build | | ✓ |
| 不希望負擔伺服器運算 | ✓，但成本轉到使用者裝置 | |

真正的選擇通常不是「能不能跑」，而是：**在最差裝置、最大允許輸入與真實網路條件下，能否穩定完成，並提供可理解的失敗與恢復流程。**

回到系列起點：[FFmpeg 01：核心觀念與指令模型](./01-ffmpeg-core-concepts.md)。

## 官方資料

- [ffmpeg.wasm：Overview](https://ffmpegwasm.netlify.app/docs/overview/)
- [ffmpeg.wasm：Installation](https://ffmpegwasm.netlify.app/docs/getting-started/installation/)
- [ffmpeg.wasm：Usage](https://ffmpegwasm.netlify.app/docs/getting-started/usage/)
- [ffmpeg.wasm：API](https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/ffmpeg/)
- [ffmpeg.wasm：Performance](https://ffmpegwasm.netlify.app/docs/performance/)
