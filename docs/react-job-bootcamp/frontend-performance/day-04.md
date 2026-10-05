---
sidebar_position: 4
title: "Day 04｜Core Web Vitals 與 RAIL"
description: "前端效能優化第 4 堂：Core Web Vitals 與 RAIL 的觀念、實作、驗證與常見誤區。"
---

# Day 04｜Core Web Vitals 與 RAIL

> 本篇是對 2021 年原系列第 4 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 指標應對應使用者感受：內容何時出現、互動是否即時、畫面是否穩定。RAIL 從 Response、Animation、Idle、Load 四個面向分配時間預算。

**解答：** 載入慢先檢查關鍵資源與伺服器回應；互動慢找主執行緒 long task；動畫卡頓減少每幀工作；CLS 高則為圖片、廣告與動態內容預留尺寸。依症狀處理對應階段，而不是為了總分亂改。

**複習：** 不要只追總分；先找出使用者正在等待、卡頓或被版面位移打斷的場景。

## 深入理解

現行 Core Web Vitals 是 LCP、INP、CLS，建議以真實使用者資料的第 75 百分位看行動版與桌面版。良好門檻依序是 ≤2.5 秒、≤200 毫秒、≤0.1。LCP 涵蓋最大內容何時呈現；INP 包含互動後直到下一次繪製的延遲；CLS 累積非預期位移。

## 實作與驗證

LCP 差：看 TTFB、資源發現與下載、渲染延遲。INP 差：錄製該操作，拆成輸入延遲、事件處理和呈現延遲。CLS 差：用 Performance 的 Layout Shifts 找發生位移的元素並預留空間。

## 常見誤區與取捨

舊文章可能使用 FID；目前應用 INP 評估整個頁面生命週期的互動。RAIL 是分析工作預算的模型，並非與三項 Core Web Vitals 相同的指標。

## 延伸閱讀

- [原系列第 4 篇](https://ithelp.ithome.com.tw/articles/10267350)
- [返回課程總覽](./index.md)
- [Core Web Vitals 與門檻（web.dev）](https://web.dev/articles/vitals)
