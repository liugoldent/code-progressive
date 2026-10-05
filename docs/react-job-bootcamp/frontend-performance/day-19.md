---
sidebar_position: 19
title: "Day 19｜Application Shell Architecture"
description: "前端效能優化第 19 堂：Application Shell Architecture 的觀念、實作、驗證與常見誤區。"
---

# Day 19｜Application Shell Architecture

> 本篇是對 2021 年原系列第 19 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 先快取並呈現應用程式固定骨架，再載入動態內容，讓使用者更早看到可辨識的 UI。常與 PWA、Service Worker 及 client-side routing 結合。

**解答：** 將 header、navigation、基礎 CSS 與路由外框做成小型 shell 並 precache；啟動後立即顯示骨架，再請求頁面資料。骨架尺寸貼近內容，失敗時呈現離線或重試狀態，而不是空白頁。

**取捨：** Shell 不能大到變成另一個阻塞 bundle；骨架與真實內容尺寸要接近，避免跳動。

## 深入理解

Application Shell 是先交付穩定外框，讓使用者及早看到導航與載入狀態；真正內容是否快，仍取決於資料請求及渲染。骨架的視覺完成時間不等於任務可用時間。

## 實作與驗證

將固定版面、關鍵 CSS 與路由外框最小化；資料區域保留與實際內容接近的尺寸。記錄 shell 出現、資料出現、可互動三個時間點，並測試離線與失敗畫面。

## 常見誤區與取捨

不要用永遠旋轉的 spinner 掩蓋慢 API。若 shell 自身依賴巨大的 client bundle，首屏仍會等待。

## 延伸閱讀

- [原系列第 19 篇](https://ithelp.ithome.com.tw/articles/10277153)
- [返回課程總覽](./index.md)
