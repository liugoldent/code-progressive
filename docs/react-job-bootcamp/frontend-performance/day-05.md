---
sidebar_position: 5
title: "Day 05｜Minify 與 Uglify"
description: "前端效能優化第 5 堂：Minify 與 Uglify 的觀念、實作、驗證與常見誤區。"
---

# Day 05｜Minify 與 Uglify

> 本篇是對 2021 年原系列第 5 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 移除空白、註解、冗長名稱可降低 JavaScript/CSS 傳輸量；混淆名稱主要是體積與可讀性處理，不等於安全保護。

**解答：** 啟用打包器 production mode，對 JavaScript/CSS minify，伺服器再啟用 Brotli 或 Gzip。部署 source map 到錯誤追蹤服務而非公開暴露敏感原始碼；密鑰與商業機密不能靠 uglify 保護。

**實務：** 由 production build 自動完成，保留 source map 供錯誤追蹤，並比較壓縮前後的 transfer size。

## 深入理解

Minify 降低檔案內容，Brotli／Gzip 降低傳輸位元組；兩者發生在不同層。下載之後還要解析、編譯及執行，所以 JS 即使壓縮率高，也可能在低階裝置上很貴。

## 實作與驗證

比較 build 產物的原始大小、傳輸大小與執行成本。在 Network 檢查 Content-Encoding 與 transferred size，在 Coverage 或 bundle analyzer 找未使用程式碼。先刪依賴與拆載入，再評估壓縮。

## 常見誤區與取捨

不要把 uglify 當成保護秘密的手段；任何送到瀏覽器的 token、金鑰或商業規則都可能被取得。

## 延伸閱讀

- [原系列第 5 篇](https://ithelp.ithome.com.tw/articles/10268059)
- [返回課程總覽](./index.md)
