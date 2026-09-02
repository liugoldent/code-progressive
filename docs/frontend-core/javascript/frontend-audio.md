---
slug: "/Frontend/JavaScript/audio"
title: "前端 Audio 音訊處理入門"
description: "從音訊播放、麥克風、MediaRecorder 與 Web Audio，到 mono 16 kHz、STT 與時間戳的完整入門。"
tags:
  - JavaScript
  - Web API
  - Audio
keywords: ["Audio", "MediaRecorder", "getUserMedia", "Web Audio", "STT", "16 kHz", "錄音"]
---

# 前端 Audio 音訊處理入門

本篇專注在音訊。建議先讀 [Media 基礎](./frontend-media.md)，理解 `File`、`Blob`、`MediaStream`、容器與 codec；影片相關內容則見 [Video 入門](./frontend-video.md)。

## 1. 數位音訊的四個重要數字

| 名稱 | 意義 | 對語音的影響 |
| --- | --- | --- |
| sample rate | 每秒取樣次數，例如 16 kHz、48 kHz | 越高可表示的頻率越多，資料通常也越大 |
| channel | 聲道數，例如 mono 1、stereo 2 | 純語音辨識常只需要 mono |
| bit depth | 每個 PCM sample 的精度，例如 16-bit | 影響未壓縮音訊的動態範圍與大小 |
| bitrate | 壓縮資料每秒使用多少 bit，例如 64 kbps | 通常越高品質越好、檔案也越大 |

不要混淆 **bit depth** 和 **bitrate**。前者描述 PCM sample 精度；後者描述編碼後每秒資料量。

### PCM 與壓縮音訊

麥克風原始訊號數位化後，可以表示為一連串 PCM samples。PCM 適合處理，但體積較大；AAC、Opus、MP3 則會壓縮資料，適合儲存與傳輸。

未壓縮 PCM 大小可粗估為：

```text
檔案大小（bit）≈ sample rate × bit depth × channel × 秒數

16 kHz × 16 bit × 1 channel × 60 秒
= 15,360,000 bit
≈ 1.92 MB（未包含 WAV header）
```

### codec 是什麼？Opus 又是什麼？

**codec（編解碼器）**是 coder-decoder／compressor-decompressor 的縮寫，可以把原始音訊編碼成較小的資料，也能在播放時把資料解碼回可播放的音訊。它描述的是「如何壓縮與還原內容」，不是副檔名或檔案容器。

**Opus** 是一種開放、免權利金的有損音訊 codec，特色是低延遲，並且能依內容與 bitrate 兼顧人聲和音樂。因此它常用在：

- 瀏覽器 `MediaRecorder` 錄音；
- WebRTC 語音／視訊通話；
- Discord 類型的即時語音；
- 網路音訊串流。

Opus 編碼後的資料通常放在 **WebM** 或 **Ogg** 容器中：

```text
demo.webm
└── WebM：容器
    └── Opus：音訊 codec
```

因此 `audio/webm;codecs=opus` 的意思是：「這是 WebM 容器，其中的音訊使用 Opus 編碼」。把 `.webm` 改名成 `.wav` 不會將 Opus 變成 PCM；若語音辨識 API 要求 PCM WAV，仍需要先解碼並轉換格式。

### 常見音訊格式

| 格式 | 常見內容 | 適合用途 |
| --- | --- | --- |
| WAV | PCM，也能放其他 codec | 編輯、中間檔、某些 STT 輸入 |
| MP3 | MP3 codec | 廣泛播放與下載 |
| M4A／MP4 | 常見 AAC 或 ALAC | Apple 裝置與一般播放 |
| WebM | 常見 Opus | 瀏覽器錄音與 Web 傳輸 |
| Ogg | 常見 Opus 或 Vorbis | 開放格式音訊 |

副檔名只描述外觀。若 API 要求「16 kHz mono PCM WAV」，只把 `.webm` 改成 `.wav` 並不會符合要求。

## 2. 使用 `<audio>` 播放

```html
<audio id="player" controls preload="metadata">
  <source src="/audio/demo.opus.ogg" type='audio/ogg; codecs="opus"' />
  <source src="/audio/demo.mp3" type="audio/mpeg" />
  你的瀏覽器無法播放這段音訊。
</audio>
```

`<audio>` 和 `<video>` 都繼承 `HTMLMediaElement`，常用能力有：

- `play()`、`pause()`、`load()`；
- `currentTime`、`duration`、`volume`、`muted`、`playbackRate`；
- `loadedmetadata`、`timeupdate`、`ended`、`error` 等事件。

```js
const player = document.querySelector("#player");

player.addEventListener("loadedmetadata", () => {
  console.log("秒數", player.duration);
});

player.addEventListener("timeupdate", () => {
  console.log("播放到", player.currentTime);
});
```

### 自動播放限制

有聲音的 autoplay 通常會被阻擋。`play()` 會回傳 Promise，要準備替代 UI：

```js
async function tryPlay(audio) {
  try {
    await audio.play();
  } catch {
    // 顯示播放按鈕，讓使用者點擊後再次呼叫 play()。
  }
}
```

不要把 `timeupdate` 當精準計時器；它的觸發頻率由瀏覽器決定。

## 3. 選擇音檔並試聽

```html
<input id="audio-file" type="file" accept="audio/*" />
<audio id="audio-preview" controls></audio>
```

```js
const input = document.querySelector("#audio-file");
const preview = document.querySelector("#audio-preview");
let objectUrl;

input.addEventListener("change", () => {
  const file = input.files?.[0];
  if (!file) return;

  if (objectUrl) URL.revokeObjectURL(objectUrl);
  objectUrl = URL.createObjectURL(file);
  preview.src = objectUrl;
});
```

`accept="audio/*"` 只是選檔提示，不是安全驗證。後端仍要檢查大小與實際格式。

## 4. 取得麥克風 `MediaStream`

`getUserMedia()` 通常只能在 HTTPS 或 `localhost` 使用，而且需要使用者授權。

```js
let stream;

async function openMicrophone() {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: { ideal: 1 },
      sampleRate: { ideal: 16000 },
      echoCancellation: true,
      noiseSuppression: true,
    },
    video: false,
  });

  const [track] = stream.getAudioTracks();
  console.log("實際設定", track.getSettings());
  return stream;
}

function closeMicrophone() {
  stream?.getTracks().forEach((track) => track.stop());
  stream = undefined;
}
```

### constraints 是協商，不是轉碼命令

`ideal: 16000` 表示偏好 16 kHz，不保證一定取得 16 kHz。瀏覽器可能仍提供 44.1 kHz 或 48 kHz。

若使用 `exact: 16000`，不支援時通常只會得到 `OverconstrainedError`，不會自動替你 resample。要以 `track.getSettings()`、實際錄製格式與 STT 規格為準。

### 麥克風 UX

- 點擊「開始錄音」後才請求權限，並先說明用途；
- 清楚顯示正在錄音、經過時間與音量；
- 提供停止、暫停、重錄和刪除；
- 頁面離開或元件卸載時停止 track；
- 分別處理拒絕權限、找不到裝置、裝置被占用等錯誤。

## 5. 使用 `MediaRecorder` 錄音

`MediaRecorder` 會把 `MediaStream` 編碼成一批 `Blob`。不同瀏覽器支援的輸出格式不同，應先檢查能力。

```js
function chooseAudioMimeType() {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];

  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}
```

完整錄音範例：

```js
async function recordAudio() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = chooseAudioMimeType();
  const chunks = [];

  const options = mimeType
    ? { mimeType, audioBitsPerSecond: 64_000 }
    : undefined;
  const recorder = new MediaRecorder(stream, options);

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const result = new Promise((resolve, reject) => {
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, {
        type: recorder.mimeType || mimeType || "application/octet-stream",
      });

      stream.getTracks().forEach((track) => track.stop());
      resolve(blob);
    });

    recorder.addEventListener("error", (event) => {
      stream.getTracks().forEach((track) => track.stop());
      reject(event.error);
    });
  });

  recorder.start(1000);

  return {
    stop: () => recorder.stop(),
    pause: () => recorder.pause(),
    resume: () => recorder.resume(),
    result,
  };
}
```

使用方式：

```js
const recording = await recordAudio();

// 使用者稍後按下停止
recording.stop();
const audioBlob = await recording.result;

const previewUrl = URL.createObjectURL(audioBlob);
audioElement.src = previewUrl;
```

`recorder.start(1000)` 表示大約每秒要求一個 `dataavailable` chunk，並不是精準的一秒計時器。若要顯示錄音時間，應另外依 monotonic clock 計算，不要累加 chunk 數量。

### 根據實際 MIME type 決定檔名

```js
function extensionForAudio(blob) {
  if (blob.type.includes("webm")) return "webm";
  if (blob.type.includes("ogg")) return "ogg";
  if (blob.type.includes("mp4")) return "m4a";
  return "bin";
}

const extension = extensionForAudio(audioBlob);
const body = new FormData();
body.append("audio", audioBlob, `recording.${extension}`);
```

### 長錄音的記憶體問題

上例把所有 chunks 留在記憶體，適合短錄音。長時間錄音可考慮在 `dataavailable` 時逐片上傳，再由後端依 session 與順序組合；仍要實際測試各瀏覽器輸出的 chunks 能否被目標處理器正確組合與解析。

## 6. Web Audio API

Web Audio 適合：

- 畫音量表、波形與頻譜；
- 混合多個音訊來源；
- 套用 gain、filter、compressor 等節點；
- 取得解碼後的 samples 做進一步處理。

```text
MediaStreamSource → AnalyserNode → 視覺化
                  → GainNode → AudioDestination
```

簡化的波形資料讀取：

```js
const context = new AudioContext();
const source = context.createMediaStreamSource(stream);
const analyser = context.createAnalyser();

analyser.fftSize = 2048;
source.connect(analyser);

const samples = new Uint8Array(analyser.fftSize);

function draw() {
  analyser.getByteTimeDomainData(samples);
  // 將 samples 畫到 canvas。
  requestAnimationFrame(draw);
}

draw();
```

瀏覽器也可能要求使用者手勢後才能讓 `AudioContext` 進入 running 狀態：

```js
await context.resume();
```

### Web Audio 不會自動輸出 WAV

Web Audio 中處理的是解碼後 sample。要產生「16 kHz、mono、PCM WAV」，仍要完成：

1. stereo downmix 成 mono；
2. 從實際 sample rate resample 到 16 kHz；
3. 把浮點 sample 量化成 16-bit PCM；
4. 寫入正確 WAV header。

正式服務通常交給後端 FFmpeg 統一處理，比較容易讓所有瀏覽器輸入得到一致結果。

## 7. 為什麼 STT 常提到 mono、16 kHz

語音辨識關注人聲，不一定需要音樂等級的 stereo 48 kHz。標準化輸入可以：

- 減少傳輸與推論資料量；
- 避免左右聲道造成不必要差異；
- 讓不同瀏覽器與裝置進入相同後續流程。

但 16 kHz 並不是所有 STT API 的共同硬規則。有些服務接受多種壓縮格式並自行轉碼，有些即時串流要求特定 PCM。要先查看實際 API 規格。

概念上的 FFmpeg 指令：

```bash
ffmpeg -i input.webm -vn -ac 1 -ar 16000 -c:a pcm_s16le output.wav
```

- `-vn`：移除視訊軌；
- `-ac 1`：轉成單聲道；
- `-ar 16000`：重取樣為 16 kHz；
- `pcm_s16le`：16-bit little-endian PCM。

不要對已壓縮音訊重複進行多次 lossy 編碼，每次重新壓縮都可能再次損失資訊。

## 8. STT 時間戳資料設計

STT 常見兩種時間戳：

- **segment timestamp**：一段話的開始與結束，適合產生字幕；
- **word timestamp**：每個詞的時間，適合逐字高亮與重新斷句。

建議保存中立 JSON，不要只存最後的 SRT：

```json
{
  "language": "zh-TW",
  "durationMs": 5320,
  "segments": [
    {
      "startMs": 0,
      "endMs": 2180,
      "text": "今天來介紹前端音訊處理。",
      "words": [
        { "startMs": 0, "endMs": 420, "text": "今天" }
      ]
    }
  ]
}
```

內部時間使用整數毫秒，通常比浮點秒數更好處理。保存 JSON 後，才能在校稿或重新斷句後再次輸出 VTT、SRT 或其他格式。

還要記錄逐字稿對應的媒體版本。如果剪掉片頭或改變播放速度，舊時間戳就不再對得上新檔案。

## 9. 截圖案例的音訊處理流程

「瀏覽器錄音 → mono 16 kHz → STT timestamp」可拆成：

1. 使用者點擊錄音後才請求麥克風。
2. 前端以 `MediaRecorder` 錄成瀏覽器實際支援的格式。
3. 建立 object URL 讓使用者試聽、重錄。
4. 上傳原始 Blob，不假設 constraints 已保證 16 kHz。
5. 後端保存原檔，以 FFmpeg 轉為 STT 規定的格式。
6. 呼叫 STT 並要求 segment 或 word timestamps。
7. 保存原始辨識 JSON，讓前端進行校稿與斷句。
8. 把確認後的資料交給影片字幕流程。

轉碼與 STT 適合背景 job，不應讓一個 HTTP request 一直等待到全部完成。

## 10. Audio 常見誤解

| 誤解 | 正確觀念 |
| --- | --- |
| `ideal: 16000` 保證錄到 16 kHz | 它只是偏好，需檢查實際設定或另外轉碼 |
| `MediaRecorder` 都會輸出 WebM | MIME type 支援依瀏覽器而異 |
| Web Audio 可以直接存成任何格式 | 它處理 samples，封裝與編碼是另一層工作 |
| 把 WebM 改名 WAV 就能給 STT | rename 不會轉換資料格式 |
| `timeslice: 1000` 是精準計時 | chunk 可能延遲，不應拿來建立精準時間軸 |
| STT 文字就是完成的字幕 | 還需要校稿、斷句、閱讀速度與時間邊界調整 |

## 參考資料

- [MDN：Web audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Audio_codecs)
- [MDN：`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio)
- [MDN：getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN：MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [MDN：Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
