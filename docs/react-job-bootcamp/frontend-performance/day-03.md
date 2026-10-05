---
sidebar_position: 3
title: "Day 03｜Lighthouse 與自動化效能檢測"
description: "前端效能優化第 3 堂：Lighthouse 與自動化效能檢測 的觀念、實作、驗證與常見誤區。"
---

# Day 03｜Lighthouse 與自動化效能檢測

> 本篇是對 2021 年原系列第 3 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** Lighthouse 等工具把「感覺很快」轉成可追蹤的指標。Lab data 適合重現與除錯，真實使用者資料則反映實際環境，兩者不能互相取代。

**解答：** 本機用 Lighthouse 找問題與重現；CI 用 Lighthouse CI 設定門檻阻止退化；正式環境以 RUM 蒐集使用者資料。三者分別負責診斷、守門與驗證，不應只看一次 Lighthouse 分數。

**實務：** 在 CI 設定 performance budget，避免 bundle、圖片或關鍵指標在每次改版中悄悄退化。

## 深入理解

Lighthouse 是可重現的實驗室檢測；RUM 是實際使用者分布。Lighthouse 的 TBT 可提示主執行緒阻塞，但不能直接代替真實互動的 INP。分數受版本、設備、網路及第三方內容影響。

## 實作與驗證

固定測試 URL、登入與快取狀態，連跑數次看中位數與波動。從報告定位 LCP element、render blocking、未使用 JS；再用 Performance trace 找根因。CI 的預算可先守住 JS bytes、圖片 bytes 和關鍵頁面指標。

## 常見誤區與取捨

不要把單次 100 分當成目標。門檻應建立在可重現的環境與具代表性的頁面，第三方腳本變動要另行追蹤。

## 延伸閱讀

- [原系列第 3 篇](https://ithelp.ithome.com.tw/articles/10266656)
- [返回課程總覽](./index.md)
