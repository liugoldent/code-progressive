---
slug: "/Frontend/JavaScript/video"
title: "前端 Video 影片處理入門"
description: "從影片播放、相機錄影與螢幕擷取，到 WebVTT、SRT、轉碼、字幕壓製與 MP4 輸出。"
tags:
  - JavaScript
  - Web API
  - Video
keywords: ["Video", "getUserMedia", "MediaRecorder", "WebVTT", "SRT", "FFmpeg", "字幕"]
---

# 前端 Video 影片處理入門

本篇專注在影片、相機與字幕。建議先讀 [Media 基礎](./frontend-media.md)，音訊錄製與 STT 則見 [Audio 入門](./frontend-audio.md)。

## 1. 影片檔裡有什麼

一支影片通常不是單一資料，而是一個容器裡的多條軌道：

```text
MP4 / WebM 容器
├── video track：H.264 / VP9 / AV1
├── audio track：AAC / Opus
├── subtitle track（可選）
└── metadata：時長、尺寸、旋轉方向等
```

### 常見 Web 影片組合

| 容器 | 視訊 codec | 音訊 codec | 特性 |
| --- | --- | --- | --- |
| MP4 | H.264 | AAC | 相容性通常較廣 |
| WebM | VP9 | Opus | 開放格式、Web 使用常見 |
| WebM | AV1 | Opus | 壓縮效率較高，但要確認裝置解碼能力 |

是否能播放取決於完整組合，不只是 `.mp4` 副檔名。

### 影響影片體積與品質的因素

- resolution：例如 1280×720、1920×1080；
- frame rate：例如 24、30、60 fps；
- video bitrate：每秒分配多少影像資料；
- codec 與編碼 preset；
- 畫面複雜度：快速運動、雜訊多的畫面更難壓縮；
- audio bitrate 與聲道；
- 影片長度。

解析度加倍不代表資料只加倍。寬和高都加倍時，像素數會變成四倍。

## 2. 使用 `<video>` 播放

```html
<video
  id="player"
  controls
  playsinline
  preload="metadata"
  poster="/img/video-cover.jpg"
>
  <source src="/video/demo.webm" type='video/webm; codecs="vp9, opus"' />
  <source
    src="/video/demo.mp4"
    type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
  />
  <track
    kind="subtitles"
    src="/video/demo.zh-TW.vtt"
    srclang="zh-TW"
    label="繁體中文"
    default
  />
  你的瀏覽器無法播放這支影片。
</video>
```

### 常用屬性

- `controls`：使用瀏覽器原生控制列；
- `preload="none"`：先不要下載，適合很多影片的清單；
- `preload="metadata"`：先讀時長、尺寸等資料，是常見預設；
- `preload="auto"`：允許預載更多，但只是提示；
- `poster`：開始播放前顯示的封面；
- `playsinline`：行動裝置上傾向留在頁面內播放；
- `muted`：靜音，也會影響 autoplay 是否可能被允許。

### 常用 JavaScript API

```js
const video = document.querySelector("#player");

await video.play();
video.pause();
video.currentTime = 30;
video.playbackRate = 1.25;

video.addEventListener("loadedmetadata", () => {
  console.log({
    duration: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
  });
});
```

有聲自動播放可能被阻擋，要捕捉 `play()` 的 rejection，顯示讓使用者點擊的播放按鈕。

### 播放事件不是逐幀事件

`timeupdate` 適合更新一般進度 UI，但觸發頻率不固定。需要跟實際影片 frame 同步繪圖時，可以評估：

```js
function onFrame(now, metadata) {
  console.log(metadata.mediaTime);
  video.requestVideoFrameCallback(onFrame);
}

video.requestVideoFrameCallback(onFrame);
```

一般字幕優先使用 `<track>`，不要自行用 `setInterval()` 猜時間。

## 3. 本機影片預覽

```html
<input id="video-file" type="file" accept="video/*" />
<video id="preview" controls playsinline></video>
```

```js
const input = document.querySelector("#video-file");
const preview = document.querySelector("#preview");
let objectUrl;

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (!file) return;

  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  preview.src = objectUrl;
  preview.load();
});
```

大影片不要為了預覽而轉 Base64。用完 object URL 要釋放。

## 4. 取得相機畫面

```js
async function openCamera(videoElement) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30, max: 30 },
      facingMode: "user",
    },
  });

  videoElement.srcObject = stream;
  videoElement.muted = true;
  await videoElement.play();

  const [videoTrack] = stream.getVideoTracks();
  console.log("實際相機設定", videoTrack.getSettings());
  return stream;
}
```

constraints 中的普通值或 `ideal` 是偏好。瀏覽器可能回傳不同的尺寸或 frame rate，要以 `track.getSettings()` 為準。

### 前鏡頭與後鏡頭

```js
const frontCamera = { video: { facingMode: "user" } };
const rearCamera = { video: { facingMode: { exact: "environment" } } };
```

切換相機前，行動裝置上可能需要先停止舊 video track：

```js
stream.getVideoTracks().forEach((track) => track.stop());
```

### 權限與資源釋放

- 相機通常只能在 HTTPS 或 `localhost` 使用；
- 由使用者操作後再請求權限；
- 清楚顯示相機正在使用；
- 停止錄影、元件卸載或離開頁面時停止所有 tracks；
- 處理拒絕權限、無相機、裝置占用等錯誤。

## 5. 使用 `MediaRecorder` 錄影

瀏覽器可用 `MediaRecorder` 把相機 `MediaStream` 編碼成影片。先選擇實際支援的 MIME type：

```js
function chooseVideoMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}
```

```js
async function startCameraRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: true,
  });

  const mimeType = chooseVideoMimeType();
  const recorder = new MediaRecorder(
    stream,
    mimeType ? { mimeType, videoBitsPerSecond: 2_500_000 } : undefined,
  );
  const chunks = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const result = new Promise((resolve, reject) => {
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      stream.getTracks().forEach((track) => track.stop());
      resolve(blob);
    });

    recorder.addEventListener("error", (event) => {
      stream.getTracks().forEach((track) => track.stop());
      reject(event.error);
    });
  });

  recorder.start(1000);
  return { recorder, stream, result };
}
```

不要假設所有瀏覽器都能錄成 MP4，應上傳實際產生的格式，再由後端統一轉成產品需要的成品格式。

## 6. 螢幕錄影

螢幕分享使用 `getDisplayMedia()`，仍會由瀏覽器讓使用者選擇畫面：

```js
const displayStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true,
});
```

注意事項：

- 不同 OS 與瀏覽器對「系統音訊」支援不同；
- 使用者可能分享分頁、視窗或整個螢幕；
- 使用者可透過瀏覽器 UI 隨時停止分享；
- 要監聽 track 的 `ended` 事件更新自己的 UI；
- 若要混合系統聲音與麥克風，通常需要 Web Audio 建立新的 audio track。

```js
const [screenTrack] = displayStream.getVideoTracks();
screenTrack.addEventListener("ended", () => {
  console.log("使用者停止螢幕分享");
});
```

## 7. WebVTT 與 SRT

### WebVTT：Web 原生字幕

```vtt
WEBVTT

00:00:00.000 --> 00:00:02.180
今天來介紹前端影片處理。

00:00:02.500 --> 00:00:05.320
先從播放與字幕開始。
```

WebVTT 使用句點分隔毫秒，可以透過 `<track>` 使用。字幕檔從另一個網域載入時，也要正確設定 CORS。

```html
<track
  kind="subtitles"
  src="/subtitles/demo.zh-TW.vtt"
  srclang="zh-TW"
  label="繁體中文"
  default
/>
```

### SRT：影音工具常見交換格式

```srt
1
00:00:00,000 --> 00:00:02,180
今天來介紹前端影片處理。

2
00:00:02,500 --> 00:00:05,320
先從播放與字幕開始。
```

SRT 通常有流水號，使用逗號分隔毫秒。瀏覽器 `<track>` 原生使用 WebVTT，不要直接把 SRT 改副檔名當成 VTT。

### 字幕資料不要只保留輸出檔

校稿系統應保存結構化資料，例如：

```json
{
  "mediaVersion": "video-v1",
  "segments": [
    {
      "id": "segment-1",
      "startMs": 0,
      "endMs": 2180,
      "text": "今天來介紹前端影片處理。"
    }
  ]
}
```

編輯完成後再輸出 VTT 和 SRT。若影片剪掉片頭、改速或重新拼接，要同步調整時間戳或重新辨識。

## 8. 外掛字幕與壓製字幕

| 方式 | 優點 | 缺點 |
| --- | --- | --- |
| 外掛／soft subtitle | 可開關、搜尋、切換語言，無須重編影片 | 播放器與分享平台要支援 |
| 壓製／burn-in subtitle | 在任何能播放影片的地方都看得到 | 無法關閉或修改，且要重新編碼 |

自己的 Web 播放器通常優先使用 VTT 外掛字幕。要輸出到不保證支援字幕軌的平台時，再由後端用 FFmpeg 壓製新影片。

概念上的壓字幕指令：

```bash
ffmpeg -i input.mp4 -vf "subtitles=subtitle.srt" -c:a copy output.mp4
```

`-vf` 會改動畫面，因此視訊必須重新編碼；`-c:a copy` 則表示音訊軌若相容就直接複製。正式使用還要處理字型、中文字幕、路徑跳脫、codec 與品質參數。

## 9. 轉成 Web 常用 MP4

概念上的 H.264 + AAC 輸出：

```bash
ffmpeg \
  -i input.webm \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -c:a aac \
  -movflags +faststart \
  output.mp4
```

- `libx264`：把視訊編成 H.264；
- `yuv420p`：常見且相容性較廣的 pixel format；
- `aac`：把音訊編成 AAC；
- `faststart`：把 MP4 metadata 移到較前面，方便下載尚未完成時開始播放。

這些參數不是所有情況的唯一答案。還要根據來源尺寸、frame rate、品質、授權與目標裝置決定。

## 10. 從 STT 到新 MP4 的完整流程

截圖中的「取得時間軸 → 校稿、斷句、字幕 → 新 MP4」可拆成：

1. 上傳影片或由瀏覽器完成錄影。
2. 後端保存原始檔並建立 media version。
3. FFmpeg 抽出音訊，轉為 STT 要求格式。
4. STT 回傳文字與 segment／word timestamps。
5. 保存原始 STT JSON。
6. 前端校稿器提供逐句播放、文字修正、切分與合併。
7. 後端根據確認資料產生 VTT 與 SRT。
8. Web 預覽以 `<track>` 掛載 VTT。
9. 真的需要固定字幕時，建立 burn-in job。
10. FFmpeg 輸出新 MP4，完成後通知前端。

```text
uploaded
   │
   ▼
extracting_audio → transcribing → reviewing
                                      │
                    ┌─────────────────┴──────────────┐
                    ▼                                ▼
              VTT / SRT ready                  rendering_mp4
                                                     │
                                                     ▼
                                                   ready
```

不要用一個長 HTTP request 等完整流程跑完。每個背景 job 都要保存狀態、錯誤原因與可否重試。

## 11. 影片效能與 UX

### 網路與播放

- 一般 MP4 伺服器應支援 HTTP Range，讓使用者 seek。
- 大量長影片可評估 HLS／DASH 自適應串流。
- 列表頁用 `preload="none"` 或 `metadata`，不要同時下載所有影片。
- 先顯示封面、時長、解析度與檔案大小。
- 區分上傳進度、轉碼進度與字幕產生狀態。

### 無障礙

- 提供字幕與逐字稿；
- 播放控制可以使用鍵盤操作；
- 不要自動播放有聲影片；
- 不要只用聲音傳達重要資訊；
- 自製控制列要有可辨識的按鈕名稱與 focus 樣式。

### Canvas 與 CORS

若把跨網域影片畫進 `<canvas>` 後還要呼叫 `getImageData()` 或輸出圖片，媒體伺服器必須允許 CORS，且 `<video>` 要設定正確的 `crossorigin`。否則 canvas 會被標記為 tainted，無法讀回像素。

## 12. Video 常見誤解

| 誤解 | 正確觀念 |
| --- | --- |
| MP4 就是 H.264 | MP4 是容器，裡面可以是不同 codec |
| `timeupdate` 每一 frame 都會觸發 | 它不是逐幀 API，頻率也不固定 |
| `getUserMedia()` 要求 720p 就一定拿到 720p | 普通值和 `ideal` 是偏好，要看實際 settings |
| 瀏覽器錄影一定能輸出 MP4 | `MediaRecorder` 格式支援依瀏覽器而異 |
| SRT 可以直接放進 `<track>` | Web 原生字幕格式是 WebVTT |
| 壓字幕只是把文字附加到 MP4 | burn-in 會改動畫面，需要重新編碼視訊 |
| 上傳 100% 就完成了 | 後面可能還有抽音訊、STT、校稿與輸出 job |

## 參考資料

- [MDN：HTML video and audio](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_video_and_audio)
- [MDN：Web video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)
- [MDN：`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)
- [MDN：getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN：getDisplayMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [MDN：MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [W3C：WebVTT](https://www.w3.org/TR/webvtt1/)

