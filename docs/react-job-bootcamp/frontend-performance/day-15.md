---
sidebar_position: 15
title: "Day 15｜Tree Shaking"
description: "前端效能優化第 15 堂：Tree Shaking 的觀念、實作、驗證與常見誤區。"
---

# Day 15｜Tree Shaking

> 本篇是對 2021 年原系列第 15 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 打包器透過 ES module 的靜態結構移除未使用輸出。它依賴 production optimization、可分析的 import/export，以及正確的 side-effects 標記。

**解答：** 使用 ESM 的具名匯入，避免引入整個大型函式庫；套件若沒有頂層副作用，在 `package.json` 正確標示 `sideEffects`。最後用 bundle analyzer 確認未使用模組確實消失。

**實務：** 避免整包匯入大型函式庫；用 bundle analyzer 驗證，而不是只因為程式碼「沒有呼叫」便假設它已被移除。

## 深入理解

Tree shaking 依賴可靜態分析的 ESM 匯入與副作用資訊。即使程式碼未呼叫，套件頂層的執行、副作用樣式或動態 require 也可能阻止移除。

## 實作與驗證

在 production build 前後比較 bundle analyzer 的模組樹與實際 gzip/brotli bytes。從單一大型依賴檢查入口匯入、sideEffects 標記及是否有替代的輕量模組。

## 常見誤區與取捨

不要盲目設 sideEffects:false；若套件有全域註冊、polyfill 或 CSS 匯入，錯誤標記會導致功能在正式環境消失。

## 延伸閱讀

- [原系列第 15 篇](https://ithelp.ithome.com.tw/articles/10274978)
- [返回課程總覽](./index.md)
