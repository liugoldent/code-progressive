---
sidebar_position: 16
title: "Day 16｜差異化打包與檔案壓縮"
description: "前端效能優化第 16 堂：差異化打包與檔案壓縮 的觀念、實作、驗證與常見誤區。"
---

# Day 16｜差異化打包與檔案壓縮

> 本篇是對 2021 年原系列第 16 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 現代瀏覽器不需要為舊環境下載所有 polyfill 與轉譯結果。差異化輸出可避免不必要的程式碼；Brotli/Gzip 則壓縮實際傳輸內容。

**解答：** 先定義瀏覽器支援矩陣，再由 browserslist/Babel 決定轉譯與按需 polyfill；不要無條件載入完整 polyfill 套件。靜態文字資源在 CDN/伺服器開 Brotli，並保留 Gzip fallback。

**實務：** 依 browserslist 與產品支援矩陣決定目標；伺服器提供壓縮並搭配正確 `Content-Encoding`，不要重複壓縮本來就高度壓縮的格式。

## 深入理解

目標瀏覽器決定轉譯與 polyfill 量。差異化交付的核心是避免所有使用者下載最舊環境的相容程式碼，而 Brotli/Gzip 是 HTTP 傳輸層壓縮。

## 實作與驗證

先確認產品支援矩陣與實際瀏覽器流量，再檢查 browserslist、Babel／build 設定。用 Network 比較不同環境所收到的 JS 大小，確認 CDN 回應包含正確 Content-Encoding 和 Vary。

## 常見誤區與取捨

不要只看壓縮後 KB；同樣大小的 JS 與圖片對 CPU 的成本不同。現代／舊版雙輸出也增加測試與部署複雜度。

## 延伸閱讀

- [原系列第 16 篇](https://ithelp.ithome.com.tw/articles/10275720)
- [返回課程總覽](./index.md)
