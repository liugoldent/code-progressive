---
sidebar_position: 8
title: "Day 08｜瀏覽器架構與渲染管線"
description: "前端效能優化第 8 堂：瀏覽器架構與渲染管線 的觀念、實作、驗證與常見誤區。"
---

# Day 08｜瀏覽器架構與渲染管線

> 本篇是對 2021 年原系列第 8 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** HTML 形成 DOM、CSS 形成 CSSOM，接著建立 render tree，進行 layout、paint 與 composite。JavaScript 長任務與同步腳本會阻塞主執行緒。

**解答：** 用 Performance panel 找 style、layout、paint 或 script 中成本最高者。避免交錯讀寫 layout 資訊；先集中讀取尺寸，再批次修改 DOM。把大任務切片，動畫盡量只改 `transform` 與 `opacity`。

**複習：** 修改幾何位置容易觸發 layout；只改 transform/opacity 通常較容易交給合成階段處理，但仍需量測。

## 深入理解

渲染可概括為解析、樣式計算、layout、paint 與 composite。並非每次 CSS 修改都經過所有階段；改寬高常觸發 layout，改背景色常需要 paint，transform/opacity 常可只做 composite，但是否建立獨立層仍由瀏覽器決定。

## 實作與驗證

錄製一段卡頓操作，看主執行緒火焰圖中 Script、Recalculate Style、Layout、Paint 的時間。若讀取尺寸緊跟寫入 DOM，重構為先讀後寫或減少讀取次數；比較修改前後 frame time。

## 常見誤區與取捨

不要只用『DOM 多』推斷瓶頸。少量節點頻繁同步量測也可能昂貴；先有 trace 再改程式碼。

## 延伸閱讀

- [原系列第 8 篇](https://ithelp.ithome.com.tw/articles/10270187)
- [返回課程總覽](./index.md)
