---
sidebar_position: 24
title: "Day 24｜Web Rendering Architectures"
description: "前端效能優化第 24 堂：Web Rendering Architectures 的觀念、實作、驗證與常見誤區。"
---

# Day 24｜Web Rendering Architectures

> 本篇是對 2021 年原系列第 24 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** CSR、SSR、SSG、hydration 各自在首屏速度、互動時間、伺服器成本、快取與資料新鮮度間取捨。

**解答：** 靜態且可預先生成的內容用 SSG；需要 SEO 與即時個人化首屏可用 SSR；登入後高度互動、SEO 不重要的區域可 CSR。不要整站只用一種模式，並控制 hydration 所需 JavaScript。

**選擇方式：** 依頁面類型混用，而不是整站信仰同一模式：行銷內容偏靜態，個人化頁面可能 SSR，登入後高度互動區域可偏 CSR。

## 深入理解

CSR 讓瀏覽器下載 JS 後建立畫面；SSR 先在伺服器產生 HTML；SSG 在建置時產生 HTML。SSR／SSG 可提早看到內容，但 hydration 仍可能阻塞互動。

## 實作與驗證

以頁面為單位比較 HTML 到達、LCP、JS bytes、hydration 時間、資料新鮮度和伺服器成本。行銷／文章適合靜態化；個人化即時內容可評估 SSR；登入後複雜互動頁也可能用 CSR。

## 常見誤區與取捨

不要只用 SEO 一項判斷架構。SSR 的慢 TTFB、重複資料抓取或大型 hydration bundle 也可能讓體驗變差。

## 延伸閱讀

- [原系列第 24 篇](https://ithelp.ithome.com.tw/articles/10279519)
- [返回課程總覽](./index.md)
