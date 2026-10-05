---
sidebar_position: 28
title: "Day 28｜Runtime Performance Debugging"
description: "前端效能優化第 28 堂：Runtime Performance Debugging 的觀念、實作、驗證與常見誤區。"
---

# Day 28｜Runtime Performance Debugging

> 本篇是對 2021 年原系列第 28 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 用 DevTools Performance 錄製真實操作，從長任務、call tree、bottom-up、layout、paint、FPS 與記憶體找證據。

**解答：** 先關閉不相關擴充功能並固定裝置／網路條件，錄製一次最小重現；由 Main thread 找超過一幀預算的 task，再用 Bottom-up 找最耗時函式。若時間在 layout/paint，回查造成失效的 DOM；若在 script，切片、減量或移出主執行緒。

**除錯流程：**

1. 建立穩定重現步驟。
2. 在一致環境錄製 baseline。
3. 找最長的主執行緒工作與依賴來源。
4. 一次改一項並重新量測。
5. 把結果加入持續監控或 performance budget。

## 深入理解

Performance trace 應從一個具體症狀出發：載入慢、點擊卡住、捲動掉幀或記憶體成長。火焰圖的長條表示時間花在哪裡，Bottom-up 可彙總最昂貴的函式，Call tree 可追呼叫路徑。

## 實作與驗證

錄製前先清楚定義操作起終點，存下 baseline。對載入看 Network 與 LCP 相關區段；對互動看事件、長任務及下一次 paint；對動畫看 frame 與 layout/paint。改動後使用同條件重錄並保留 trace。

## 常見誤區與取捨

不要把 DevTools 錄製的額外開銷當作使用者實際延遲；trace 用於診斷，最終仍需實際裝置或 RUM 驗證。

## 延伸閱讀

- [原系列第 28 篇](https://ithelp.ithome.com.tw/articles/10281074)
- [返回課程總覽](./index.md)
