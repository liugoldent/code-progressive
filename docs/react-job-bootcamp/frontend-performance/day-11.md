---
sidebar_position: 11
title: "Day 11｜Lazy Loading"
description: "前端效能優化第 11 堂：Lazy Loading 的觀念、實作、驗證與常見誤區。"
---

# Day 11｜Lazy Loading

> 本篇是對 2021 年原系列第 11 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 「等到真的需要才載入」可套用到圖片、iframe、資料及程式碼。Infinite scroll 解決資料下載量，virtualization 解決已下載資料造成的 DOM 與記憶體成本，兩者互補。

**解答：** 非首屏圖片使用 `loading="lazy"`；需要自訂提前量時以 Intersection Observer 監看 sentinel，接近 viewport 時抓下一頁。請求進行中與沒有下一頁時禁止重複觸發，卸載時取消 observer 與過期請求。

**實務：** 使用 `loading="lazy"` 或 Intersection Observer；不要延遲首屏關鍵圖，並用尺寸或 placeholder 避免版面位移。

## 深入理解

延遲載入要同時考慮資源何時被發現、距離 viewport 多遠，以及使用者是否需要等待。懶載入過晚會出現空白，過早則失去節省效果。

## 實作與驗證

對非首屏圖片／iframe 先用原生 loading='lazy'；可控資料請求再使用 IntersectionObserver 監看 sentinel。觀察 loading、error、empty、end 四種狀態，加入請求去重與取消機制。

## 常見誤區與取捨

首屏 LCP 資源不應 lazy load。無限捲動需提供可到達的頁尾、載入狀態與替代導覽，避免可用性變差。

## 延伸閱讀

- [原系列第 11 篇](https://ithelp.ithome.com.tw/articles/10272251)
- [返回課程總覽](./index.md)
