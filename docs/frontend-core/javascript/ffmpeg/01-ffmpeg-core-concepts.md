---
sidebar_position: 1
slug: "/Frontend/JavaScript/ffmpeg/core-concepts"
title: "FFmpeg 01：核心觀念與指令模型"
description: "認識 FFmpeg、ffprobe、容器、codec、stream、轉碼流程，以及讀懂 FFmpeg 指令的正確方式。"
tags:
  - JavaScript
  - FFmpeg
  - Media
keywords: ["FFmpeg", "ffprobe", "codec", "container", "stream", "transcode", "影音轉碼"]
---

# FFmpeg 01：核心觀念與指令模型

FFmpeg 不只是一個「影片轉檔工具」，而是一套處理影音資料的工具鏈。前端工程常在以下情境遇到它：

- 將瀏覽器錄下的 WebM 轉成 MP4；
- 為語音辨識輸出 16 kHz、mono、PCM WAV；
- 產生縮圖、預覽片段、字幕成品；
- 把影片切成 HLS segments；
- 在後端統一不同瀏覽器與裝置上傳的格式。

開始前建議先讀 [Media 基礎](../frontend-media.md)，釐清容器、codec、`File`、`Blob` 與 `MediaStream`。

## 1. FFmpeg 工具家族

| 工具 | 用途 | 常見情境 |
| --- | --- | --- |
| `ffmpeg` | 讀取、處理、編碼、封裝與輸出影音 | 轉檔、剪輯、濾鏡、抽音訊、產生 HLS |
| `ffprobe` | 檢查容器、stream、codec 與 metadata | 上傳驗證、取得時長、解析度、聲道 |
| `ffplay` | 簡易播放器 | 本機快速預覽與除錯 |

三者會依安裝方式與建置選項支援不同的 codec、filter 與硬體加速器。遇到「別人的指令能跑，我的不能跑」時，先看目前這一份 binary 的能力：

```bash
ffmpeg -version
ffmpeg -formats
ffmpeg -codecs
ffmpeg -encoders
ffmpeg -filters
```

`ffmpeg -codecs` 顯示 FFmpeg 知道哪些 codec；是否真的能輸出某個格式，還要確認 `ffmpeg -encoders` 中存在對應 encoder。

## 2. 先分清楚 container、codec 與 stream

```text
input.mp4（container）
├── stream 0: video / H.264
├── stream 1: audio / AAC
├── stream 2: subtitle / mov_text
└── metadata
```

- **container／format**：MP4、WebM、MOV、Matroska 等「裝資料的盒子」；
- **codec**：H.264、VP9、AAC、Opus 等壓縮與解壓縮規則；
- **stream**：容器裡的一條 video、audio、subtitle 或 data 軌；
- **mux／demux**：把 streams 封裝進容器，或從容器拆出 streams；
- **encode／decode**：把未壓縮資料編碼，或把壓縮資料解碼；
- **filter**：對已解碼的影像 frame 或 audio sample 做縮放、裁切、混音等處理。

因此，將 `.webm` 直接改名成 `.mp4` 不會改變內容。要根據來源與目標決定是 remux 還是 transcode。

## 3. Remux 與 transcode

### Remux：只換容器

```bash
ffmpeg -i input.mov -map 0 -c copy output.mp4
```

`-c copy` 代表 stream copy：不解碼、不重新編碼，通常速度快且沒有重新壓縮的品質損失。但原本的 codec 必須能放進目標容器，否則會失敗。

```text
input container ──demux──> compressed streams ──mux──> output container
                             不經 decode / encode
```

### Transcode：重新編碼

```bash
ffmpeg -i input.webm \
  -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4
```

```text
compressed input
  → decode
  → raw frame / sample
  → filter（可選）
  → encode
  → mux
  → output file
```

重新編碼較耗 CPU／GPU，也可能有 generation loss。若只是換容器，優先確認能否使用 `-c copy`。

## 4. 讀懂指令：選項屬於下一個檔案

FFmpeg 的基本語法是：

```text
ffmpeg [global options] {[input options] -i input}... {[output options] output}...
```

選項順序非常重要。輸入選項要放在對應的 `-i` 前，輸出選項要放在對應輸出檔前：

```bash
ffmpeg \
  -ss 00:00:10 -i input.mp4 \
  -t 5 \
  -c:v libx264 -c:a aac \
  clip.mp4
```

這裡：

- `-ss 00:00:10` 放在 `-i` 前，是輸入 seek；
- `-i input.mp4` 宣告輸入；
- `-t 5` 限制輸出時長；
- `-c:v`、`-c:a` 選擇輸出 encoder；
- `clip.mp4` 是輸出。

不要把 FFmpeg 指令當成「所有 flags 都放哪裡都一樣」的一般 CLI。

## 5. Stream specifier 與 `-map`

有多條音軌或字幕時，不應只依賴自動選軌。先用 `ffprobe` 找到 stream，再明確指定：

```bash
ffmpeg -i input.mkv \
  -map 0:v:0 \
  -map 0:a:0 \
  -map 0:s? \
  -c:v libx264 \
  -c:a aac \
  -c:s mov_text \
  output.mp4
```

- `0:v:0`：第 0 個 input 的第 0 條 video stream；
- `0:a:0`：第 0 個 input 的第 0 條 audio stream；
- `0:s?`：第 0 個 input 的 subtitle streams；`?` 表示不存在時不要報錯；
- `-vn`、`-an`、`-sn`：排除 video、audio、subtitle。

`-map` 是正式影音流程中很重要的防呆：輸入檔多一條 commentary 音軌時，輸出不會默默選錯。

## 6. 使用 ffprobe 取得可解析的資料

查看人類容易閱讀的資訊：

```bash
ffprobe -hide_banner input.mp4
```

後端程式應使用 JSON，而不是以正規表示式解析一般 log：

```bash
ffprobe \
  -v error \
  -show_format \
  -show_streams \
  -of json \
  input.mp4
```

只取需要欄位：

```bash
ffprobe \
  -v error \
  -select_streams v:0 \
  -show_entries stream=codec_name,width,height,r_frame_rate,duration \
  -of json \
  input.mp4
```

注意：

- `duration` 可能不存在、位於 format，或只是估算值；
- `r_frame_rate` 是分數字串，例如 `30000/1001`；
- 使用者提供的副檔名與 MIME type 都不能取代實際 probe；
- probe 成功也不表示內容安全，仍要限制檔案大小、處理時間與資源用量。

## 7. 品質控制：CRF、bitrate 與 preset

以常見的 x264 編碼為例：

- `-crf`：constant rate factor；數字越小通常品質越高、檔案越大；
- `-preset`：編碼速度與壓縮效率取捨；較慢通常能以相近品質產生較小檔案；
- `-b:v`：指定目標 video bitrate；
- `-maxrate`、`-bufsize`：限制 bitrate 波動，常用於串流交付；
- `-pix_fmt yuv420p`：常見的廣相容 pixel format。

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  output.mp4
```

CRF 沒有跨 codec 的共同刻度；不要把 x264 的 CRF 數值直接套到 AV1、VP9 或其他 encoder 後期待相同品質。

## 8. 一次建立正確心智模型

```text
                  ┌── map / stream selection ──┐
input URL/file                                   output URL/file
      │                                                ▲
      ▼                                                │
   demuxer → decoder → filtergraph → encoder → muxer
                 ▲           ▲
                 │           └── scale、fps、overlay、subtitles⋯
                 └── 若使用 -c copy，會繞過 decode/filter/encode
```

排查錯誤時依序問：

1. demuxer 能否讀懂輸入 container？
2. decoder 是否支援輸入 codec？
3. `-map` 是否選到正確 stream？
4. filter 接收到的 pixel/sample format 是否正確？
5. encoder 是否存在，參數是否適用？
6. muxer 能否容納輸出的 codec？
7. 目標播放器是否支援完整的 container + codec + profile 組合？

下一篇：[FFmpeg 02：轉檔、剪輯、音訊、字幕與 HLS 實戰](./02-ffmpeg-practical-recipes.md)。

## 官方資料

- [FFmpeg：ffmpeg Documentation](https://ffmpeg.org/ffmpeg.html)
- [FFmpeg：ffprobe Documentation](https://ffmpeg.org/ffprobe.html)
- [FFmpeg：Formats Documentation](https://ffmpeg.org/ffmpeg-formats.html)
- [FFmpeg：Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html)
