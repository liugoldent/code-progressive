---
sidebar_position: 6
title: "Day 06｜圖片最佳化"
description: "前端效能優化第 6 堂：圖片最佳化 的觀念、實作、驗證與常見誤區。"
---

# Day 06｜圖片最佳化

> 本篇是對 2021 年原系列第 6 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 圖片通常是頁面最大宗資源。正確格式、尺寸、壓縮率與響應式圖片，比單純把原圖塞進 CSS 縮小有效得多。

**解答：** 照片輸出 WebP/AVIF 並保留相容 fallback，圖示優先 SVG；依顯示尺寸產生多個版本，用 `srcset`/`sizes` 讓瀏覽器選擇。首屏主圖正常或高優先載入，其餘 `loading="lazy"`，所有圖片指定寬高避免 CLS。

**實務清單：**

- 依用途選 SVG、WebP/AVIF、JPEG 或 PNG。
- 使用 `srcset`、`sizes` 提供適合裝置的尺寸。
- 指定寬高或 aspect ratio，預留版面空間。
- 首屏關鍵圖優先載入，非首屏圖片延遲載入。

## 深入理解

圖片的資源選擇分三層：格式、實際像素尺寸、品質。顯示寬度 400 CSS px 的圖片在 DPR 2 裝置可能需要約 800 實際像素；輸出遠大於需求的原圖會浪費頻寬與解碼時間。

## 實作與驗證

在 Network 找最大圖片與 LCP 圖。為內容圖產生多個尺寸，填寫 srcset/sizes，並設定 width/height；裝飾圖可用 CSS aspect-ratio。首屏 LCP 圖應讓 HTML 及早發現，必要時加 fetchpriority='high'，不要 lazy load。

## 常見誤區與取捨

AVIF／WebP 仍要比較實際品質與位元組，不是格式越新一定越小。過度壓縮會傷畫質；圖片解碼與 resize 也會花 CPU。

## 範例：內容圖片與首屏主圖

```html
<!-- 一般內容圖：瀏覽器依版面寬度與 DPR 選擇候選圖。 -->
<img
  src="article-800.webp"
  srcset="article-400.webp 400w, article-800.webp 800w, article-1200.webp 1200w"
  sizes="(max-width: 640px) 100vw, 600px"
  width="1200"
  height="800"
  loading="lazy"
  alt="文章示意圖"
/>

<!-- 首屏主圖：不要延遲載入，並確認它確實是 LCP 候選元素。 -->
<img src="hero-1200.webp" width="1200" height="600" fetchpriority="high" alt="首頁主視覺" />
```

`width`／`height` 提供原始比例，CSS 仍可設定 `max-width: 100%; height: auto`。檢查 Network 的實際選用來源、傳輸大小與 LCP element，避免只看檔案副檔名。

## 延伸閱讀

- [原系列第 6 篇](https://ithelp.ithome.com.tw/articles/10268776)
- [返回課程總覽](./index.md)
