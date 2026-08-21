---
slug: "/Frontend/JavaScript/media"
title: "前端 Media 基礎與影音資料處理"
description: "理解前端影音共通的容器、codec、File、Blob、MediaStream、上傳流程與前後端分工。"
tags:
  - JavaScript
  - Web API
  - Media
keywords: ["Media", "Blob", "File", "MediaStream", "codec", "影音上傳"]
---

# 前端 Media 基礎與影音資料處理

這一篇先建立 Audio 和 Video 共用的底層觀念。讀完後可繼續：

- [前端 Audio 音訊處理](./frontend-audio.md)：播放、麥克風、錄音、Web Audio、STT。
- [前端 Video 影片處理](./frontend-video.md)：影片播放、相機、字幕、轉碼與 MP4 輸出。

## 1. Media 不只是上傳檔案

一個完整的前端影音功能通常包含：

1. **取得資料**：選擇本機檔案、讀取麥克風、相機或螢幕。
2. **在瀏覽器中表示資料**：`File`、`Blob`、`ArrayBuffer`、`MediaStream`。
3. **預覽與播放**：`<audio>`、`<video>` 與 `HTMLMediaElement`。
4. **錄製或處理**：`MediaRecorder`、Web Audio、Canvas 等 API。
5. **傳輸與儲存**：直接上傳、分片上傳或串流傳送。
6. **後端媒體工作**：格式驗證、轉碼、STT、字幕與影片合成。

最重要的工程邊界是：

> 瀏覽器適合擷取、預覽、互動、輕量處理與上傳；穩定且大量的轉碼、字幕壓製和成品輸出，通常交給後端與 FFmpeg。

## 2. 一張圖看懂資料流

```text
使用者選檔                    麥克風 / 相機 / 螢幕
    │                                │
    ▼                                ▼
  File                           MediaStream
    │                                │
    ├── object URL ──> 預覽           ├── srcObject ──> 即時預覽
    │                                └── MediaRecorder
    │                                        │
    └───────────────> Blob <─────────────────┘
                         │
                         ▼
                     上傳到後端
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           原檔儲存     轉碼       STT / 字幕
```

## 3. 容器、codec 與 MIME type

### 容器不是編碼格式

`.mp4`、`.webm`、`.wav` 通常代表**容器（container）**。容器像一個盒子，可以放入：

- 一條或多條視訊軌；
- 一條或多條音訊軌；
- 字幕軌；
- 時長、尺寸、語言等 metadata。

真正壓縮內容的是**編解碼器（codec）**：

| 內容 | 常見 codec | 常見容器 |
| --- | --- | --- |
| 語音／音訊 | AAC、Opus、MP3、PCM | MP4/M4A、WebM、MP3、WAV |
| 視訊 | H.264、VP9、AV1 | MP4、WebM |

所以「這是 MP4」不代表所有裝置一定能播放；還要看容器裡面的 codec、profile 與裝置解碼能力。

### 副檔名、MIME type、codec 各自回答不同問題

```text
demo.mp4
     └── 副檔名：給作業系統與人類辨識

video/mp4
     └── MIME type：HTTP 或 Blob 描述的媒體類型

video/mp4; codecs="avc1.42E01E, mp4a.40.2"
     └── 更完整：MP4 容器、H.264 視訊、AAC 音訊
```

可用 `canPlayType()` 取得播放能力提示，但仍要處理實際載入或解碼失敗：

```js
const video = document.createElement("video");

const support = video.canPlayType(
  'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
);

console.log(support); // "probably"、"maybe" 或空字串
```

### 改副檔名不等於轉檔

把 `recording.webm` 改名為 `recording.wav`，裡面的資料仍然是 WebM。真正轉檔至少包含其中一種工作：

- **remux**：換容器、不重新壓縮影音軌；
- **transcode**：解碼後使用另一個 codec 重新編碼；
- **resample**：改變音訊 sample rate；
- **resize**：改變畫面尺寸；
- **downmix**：例如 stereo 轉成 mono。

## 4. 瀏覽器裡的媒體資料型別

| 型別 | 可以把它想成 | 常見用途 |
| --- | --- | --- |
| `File` | 有檔名與修改時間的 `Blob` | `<input type="file">`、拖放上傳 |
| `Blob` | 不可變的二進位資料包 | 錄製結果、下載內容、建立預覽 URL |
| `ArrayBuffer` | 一段原始記憶體 | 解析檔案、解碼器、二進位協定 |
| `Uint8Array` | 用 byte 角度查看 `ArrayBuffer` | 讀寫個別 byte |
| `MediaStream` | 正在流動的影音軌集合 | 麥克風、相機、螢幕分享 |
| `MediaStreamTrack` | stream 中的一條 audio 或 video 軌 | 靜音、停止、讀取實際設定 |
| object URL | 指向目前 `Blob` 的暫時 URL | 本機影音預覽 |

常見轉換關係：

```text
File ──繼承──> Blob ──arrayBuffer()──> ArrayBuffer
                  │
                  └── URL.createObjectURL() ──> blob: URL

MediaStream ──MediaRecorder──> Blob chunks ──合併──> Blob
```

### `File` 與 `Blob`

`File` 繼承自 `Blob`，因此有 `size`、`type`、`slice()`、`arrayBuffer()` 等能力；另外還有 `name`、`lastModified` 等檔案資訊。

```js
function inspectFile(file) {
  console.log({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  });
}
```

`Blob` 只代表資料，不一定來自實體檔案：

```js
const blob = new Blob(["hello"], { type: "text/plain" });
const file = new File([blob], "hello.txt", { type: blob.type });
```

### `MediaStream` 不是已完成的檔案

`MediaStream` 表示「目前正在流動」的軌道。它可以直接接到媒體元素預覽，也可以交給 `MediaRecorder` 編碼成 Blob：

```js
video.srcObject = stream;

const audioTracks = stream.getAudioTracks();
const videoTracks = stream.getVideoTracks();
```

功能結束時要停止硬體資源：

```js
stream.getTracks().forEach((track) => track.stop());
```

## 5. 選檔後使用 object URL 預覽

大型影音只為了預覽時，不需要先轉 Base64。Base64 會增加體積，也會建立一大段字串；object URL 更合適。

```html
<input id="media-input" type="file" accept="audio/*,video/*" />
<video id="preview" controls playsinline></video>
```

```js
const input = document.querySelector("#media-input");
const preview = document.querySelector("#preview");
let previousUrl = null;

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (!file) return;

  if (previousUrl) URL.revokeObjectURL(previousUrl);

  previousUrl = URL.createObjectURL(file);
  preview.src = previousUrl;
  preview.load();
});

window.addEventListener("beforeunload", () => {
  if (previousUrl) URL.revokeObjectURL(previousUrl);
});
```

不再使用 object URL 時要呼叫 `URL.revokeObjectURL()`，否則大量操作檔案時可能持續占用記憶體。

## 6. 上傳媒體

### 基本上傳

```js
async function uploadMedia(file, signal) {
  const maxBytes = 200 * 1024 * 1024;

  if (!(file instanceof File)) throw new Error("沒有選擇檔案");
  if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
    throw new Error("只接受音訊或影片");
  }
  if (file.size > maxBytes) throw new Error("檔案超過 200 MB");

  const body = new FormData();
  body.append("media", file, file.name);

  const response = await fetch("/api/media", {
    method: "POST",
    body,
    signal,
  });

  if (!response.ok) throw new Error(`上傳失敗：${response.status}`);
  return response.json();
}
```

使用 `FormData` 時不要手動設定 `Content-Type: multipart/form-data`，瀏覽器會連同必要的 boundary 自動產生。

### 前端檢查不是安全驗證

`accept`、副檔名與 `file.type` 都只能改善 UX。攻擊者可以偽造它們，所以後端仍要：

- 限制檔案大小與數量；
- 檢查實際檔案 header、容器與 codec；
- 不使用使用者檔名當儲存路徑；
- 隔離原始檔並限制公開存取；
- 視需求掃描惡意內容；
- 對轉碼工作設定 CPU、記憶體與時間限制。

### 大檔案與分片上傳

影音檔很大、網路可能中斷時，可以：

1. 建立 upload session；
2. 使用 `Blob.slice()` 分片；
3. 每片直接傳到物件儲存或後端；
4. 保存已成功 part，失敗時只重傳該片；
5. 完成後通知後端合併；
6. 驗證總大小與 checksum，再啟動轉碼 job。

```js
function splitBlob(blob, chunkSize = 5 * 1024 * 1024) {
  const chunks = [];

  for (let start = 0; start < blob.size; start += chunkSize) {
    chunks.push(blob.slice(start, Math.min(start + chunkSize, blob.size)));
  }

  return chunks;
}
```

`fetch` 沒有傳統 XHR 那種通用 upload progress event。需要可靠百分比時，可使用 XHR、成熟上傳套件，或用已完成分片數計算進度。

## 7. 前端與後端怎麼分工

| 工作 | 通常放在哪裡 | 原因 |
| --- | --- | --- |
| 選檔、權限、即時預覽 | 前端 | 與使用者和本機裝置直接互動 |
| 短錄音、相機錄製 | 前端 | `MediaRecorder` 可直接取得結果 |
| 音量表、簡單濾波 | 前端 | Web Audio 適合即時互動 |
| 格式與安全驗證 | 後端 | 前端資料不可信任 |
| 大量轉碼、resize、resample | 後端 | 資源與輸出格式較可控 |
| STT、字幕產生 | 後端 job | 耗時、需金鑰、需要重試 |
| 字幕壓製與成品輸出 | 後端 job | 通常需要 FFmpeg 並重新編碼 |

不建議把「上傳 → 轉碼 → STT → 壓片」全部包在一個長 HTTP request。較穩定的方式是背景 job：

```text
uploading → uploaded → validating → processing → ready
                                      │
                                      └── failed（可重試或顯示原因）
```

前端要分開顯示上傳與處理狀態；上傳 100% 不代表媒體已經可以使用。

## 8. 效能、網路、安全與 UX

### 效能與記憶體

- 大檔預覽優先使用 object URL，不要 Base64。
- 用完 object URL 要 `revokeObjectURL()`。
- 不要把整支長影片讀入 `ArrayBuffer`，除非真的需要分析全部內容。
- 長時間錄製不要永久把所有 chunk 留在記憶體。
- 元件卸載時停止 track、動畫與 `AudioContext`。

### 傳輸與跨網域

- 媒體伺服器應支援 HTTP Range，讓播放器能 seek 與載入需要的區段。
- 很長的影片或多種網路品質可評估 HLS／DASH 自適應串流。
- 跨網域載入媒體、字幕，或把影片畫到 canvas 後讀取像素時，要正確設定 CORS。
- 行動網路避免無意義預載，先呈現封面、大小與時長。

### 隱私與安全

- 只在使用者操作後請求麥克風或相機權限。
- 使用結束立即停止所有 track。
- 影音與逐字稿可能含個資，要定義保存期限、刪除方式與存取權限。
- 若交給第三方 STT 或轉碼服務，要確認資料傳輸與保存政策。

## 9. 共通常見誤解

| 誤解 | 正確觀念 |
| --- | --- |
| 改副檔名就是轉檔 | rename 不會改變容器或 codec |
| MP4 在所有瀏覽器都一定能播 | 還要看 codec、profile 與裝置能力 |
| `accept="video/*"` 已經完成驗證 | 它只是檔案選擇提示，後端仍需驗證 |
| Blob 就是上傳後的遠端檔案 | Blob 是目前 JS 環境中的二進位資料物件 |
| MediaStream 是一個影片檔 | 它是正在流動的一組軌道，要錄製後才成為 Blob |
| 上傳完成就代表影片可用 | 後面可能還有驗證、轉碼、STT 或壓片 |

## 10. 建議學習順序

1. 先理解本篇的容器、codec、File、Blob、MediaStream。
2. 用選檔、object URL 與 `FormData` 完成預覽和上傳。
3. 依需求閱讀 [Audio](./frontend-audio.md) 或 [Video](./frontend-video.md)。
4. 最後再學分片上傳、背景 job、FFmpeg 與自適應串流。

## 參考資料

- [MDN：Media technologies on the web](https://developer.mozilla.org/en-US/docs/Web/Media)
- [MDN：Media container formats](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers)
- [MDN：Codecs in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/codecs_parameter)
- [MDN：Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [MDN：MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream)
- [MDN：URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)

