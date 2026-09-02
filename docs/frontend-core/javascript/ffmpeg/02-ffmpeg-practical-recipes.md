---
sidebar_position: 2
slug: "/Frontend/JavaScript/ffmpeg/practical-recipes"
title: "FFmpeg 02：轉檔、剪輯、音訊、字幕與 HLS 實戰"
description: "整理可直接理解與調整的 FFmpeg 常用配方，涵蓋 MP4、縮圖、剪輯、音訊、字幕、合成與 HLS。"
tags:
  - JavaScript
  - FFmpeg
  - Media
keywords: ["FFmpeg 指令", "MP4", "HLS", "m3u8", "字幕", "縮圖", "音訊轉檔"]
---

# FFmpeg 02：轉檔、剪輯、音訊、字幕與 HLS 實戰

這篇不是只收集可複製的指令，也會說明每個選項在控制什麼。執行前先用 `ffprobe` 檢查輸入，並在測試資料確認影音、字幕與時間軸都正確。

## 1. WebM 轉成相容性較廣的 MP4

```bash
ffmpeg -i input.webm \
  -map 0:v:0 -map 0:a:0? \
  -c:v libx264 -preset medium -crf 23 \
  -pix_fmt yuv420p \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  output.mp4
```

- `-map 0:a:0?`：保留第一條音軌；沒有音訊也能繼續；
- `libx264` + AAC：常見 Web MP4 組合；
- `yuv420p`：提高一般播放器相容性；
- `+faststart`：將 MP4 metadata 移到前面，改善漸進式下載起播。

若來源本來就是可放進 MP4 的 H.264 + AAC，可先嘗試不重新編碼：

```bash
ffmpeg -i input.mov -map 0:v:0 -map 0:a:0? -c copy -movflags +faststart output.mp4
```

## 2. 改變解析度並保留比例

限制寬度為 1280，高度依比例計算並確保是偶數：

```bash
ffmpeg -i input.mp4 \
  -vf "scale=1280:-2" \
  -c:v libx264 -crf 23 -preset medium \
  -c:a copy \
  output-720p.mp4
```

只縮小、不放大：

```bash
ffmpeg -i input.mp4 \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -crf 23 \
  -c:a copy \
  output.mp4
```

`iw` 是 input width。含逗號或運算式時要注意 shell quoting。

## 3. 截取片段

### 快速剪輯：不重新編碼

```bash
ffmpeg -ss 00:01:20 -i input.mp4 -t 10 -c copy clip-fast.mp4
```

速度快，但切點可能受 keyframe 影響，無法保證 frame-accurate。

### 精準剪輯：重新編碼

```bash
ffmpeg -i input.mp4 \
  -ss 00:01:20 -t 10 \
  -c:v libx264 -crf 21 \
  -c:a aac \
  clip-accurate.mp4
```

是否需要精準到 frame、能否接受重新壓縮，以及來源是否有合理 keyframe 間距，會決定採用哪一種。

## 4. 產生影片縮圖

擷取第 5 秒的一張圖片：

```bash
ffmpeg -ss 5 -i input.mp4 -frames:v 1 -vf "scale=640:-2" thumbnail.jpg
```

每 10 秒產生一張：

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-2" thumbnails/thumb-%04d.jpg
```

輸出資料夾要先存在。正式服務還要限制圖片數量，避免異常長影片產生大量檔案。

## 5. 抽出與標準化音訊

只抽出原音軌，不重新編碼：

```bash
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a
```

轉成語音辨識常見的 16 kHz、mono、16-bit PCM WAV：

```bash
ffmpeg -i input.webm \
  -vn \
  -ac 1 \
  -ar 16000 \
  -c:a pcm_s16le \
  speech.wav
```

音量正規化可使用 loudness normalization filter。兩階段分析能得到較可控的輸出；以下單次處理適合先理解與試做：

```bash
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" normalized.wav
```

## 6. 合併影片與外部音訊

```bash
ffmpeg \
  -i video.mp4 \
  -i narration.m4a \
  -map 0:v:0 \
  -map 1:a:0 \
  -c:v copy \
  -c:a aac \
  -shortest \
  output.mp4
```

`-shortest` 會在較短的輸出 stream 結束時停止。若需要混合原音與旁白，不是用兩個 `-map` 就完成，而要使用 `amix`：

```bash
ffmpeg -i video.mp4 -i narration.wav \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=first[aout]" \
  -map 0:v:0 -map "[aout]" \
  -c:v copy -c:a aac \
  output-with-mix.mp4
```

## 7. 字幕：外掛、內嵌與燒錄

### 將 SRT 轉為 WebVTT

```bash
ffmpeg -i subtitle.srt subtitle.vtt
```

Web 播放器通常優先以 `<track>` 載入 VTT，使用者可以切換字幕，也不必重新編碼影片。

### 把字幕做成 MP4 內的可切換字幕軌

```bash
ffmpeg -i input.mp4 -i subtitle.srt \
  -map 0:v -map 0:a? -map 1:0 \
  -c:v copy -c:a copy -c:s mov_text \
  -metadata:s:s:0 language=zho \
  output-with-subtitle.mp4
```

### 將字幕燒進畫面

```bash
ffmpeg -i input.mp4 \
  -vf "subtitles=subtitle.srt" \
  -c:v libx264 -crf 21 \
  -c:a copy \
  output-burned.mp4
```

燒錄字幕一定會改變影像 frame，因此 video 需要重新編碼。遇到中文字型找不到、路徑含特殊字元或容器環境缺字型時，要先處理 fonts 與 filter escaping。

## 8. 疊加浮水印

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=160:-1[logo];[0:v][logo]overlay=W-w-24:H-h-24" \
  -c:v libx264 -crf 21 \
  -c:a copy \
  output-watermarked.mp4
```

- `scale=160:-1`：調整 logo 寬度並保留比例；
- `W-w-24:H-h-24`：放在右下角，保留 24 px 邊距；
- `W`、`H` 是主畫面尺寸，`w`、`h` 是 overlay 尺寸。

## 9. 產生單一品質 HLS

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset medium -crf 21 \
  -c:a aac -b:a 128k \
  -force_key_frames "expr:gte(t,n_forced*6)" \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "hls/segment-%05d.ts" \
  hls/index.m3u8
```

這會產生一份 media playlist 與多個 segments。正式的 adaptive bitrate HLS 還需要：

- 產生多組解析度與 bitrate；
- 讓不同 variant 的 keyframe／segment 邊界對齊；
- 產生 master playlist；
- 配置正確 MIME type、CORS、cache 與 CDN；
- 實際用 Safari、hls.js 與目標裝置驗證切換。

只產生一個 m3u8 不代表已經具備 ABR。

## 10. 常見失敗與檢查方向

| 症狀 | 優先檢查 |
| --- | --- |
| `Unknown encoder` | 目前 binary 是否包含該 encoder；看 `ffmpeg -encoders` |
| `Invalid data found` | 輸入是否完整、container 是否被辨識、URL 是否真的回傳影音 |
| `Could not find tag for codec` | 目標 container 是否支援該 codec；可能要改 container 或 transcode |
| 有聲音但黑畫面 | pixel format、codec/profile、播放器支援與影像 stream mapping |
| 聲畫不同步 | timestamp、variable frame rate、錯誤剪接、輸入檔時間基準 |
| 檔案比預期大 | CRF／bitrate、解析度、fps、音訊 bitrate 與來源複雜度 |
| 字幕亂碼 | 輸入文字編碼、字型、字幕格式與語言 metadata |

不要只保留最後一行錯誤。實務上應保存完整 stderr、exit code、實際執行參數、FFmpeg 版本與輸入 probe 摘要，但要遮蔽簽名 URL、token 與使用者敏感路徑。

下一篇：[FFmpeg 03：Node.js 後端整合與正式環境](./03-ffmpeg-node-production.md)。

## 官方資料

- [FFmpeg：Main Options 與 Stream Selection](https://ffmpeg.org/ffmpeg.html)
- [FFmpeg：Video Filters](https://ffmpeg.org/ffmpeg-filters.html)
- [FFmpeg：HLS muxer](https://ffmpeg.org/ffmpeg-formats.html#hls-2)
- [FFmpeg：Resampler Documentation](https://ffmpeg.org/ffmpeg-resampler.html)
