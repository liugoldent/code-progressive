---
sidebar_position: 26
title: "Day 26｜JavaScript 記憶體管理"
description: "前端效能優化第 26 堂：JavaScript 記憶體管理 的觀念、實作、驗證與常見誤區。"
---

# Day 26｜JavaScript 記憶體管理

> 本篇是對 2021 年原系列第 26 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** Garbage collector 只能回收「不可達」物件。意外保留參考的 closure、全域集合、事件監聽、timer、DOM 節點與 cache，會形成記憶體洩漏。

**解答：** 建立可重現操作，分別拍攝前後 Heap Snapshot，比較 retained size 與 detached DOM tree；沿 retaining path 找到仍持有物件的監聽器、timer、closure 或集合。於生命週期結束時解除監聽、取消訂閱並限制 cache 大小。

**實務：** 使用 Heap Snapshot、Allocation Timeline 比較操作前後；元件卸載時清理訂閱、監聽與計時器，並為 cache 設上限。

## 深入理解

記憶體洩漏是物件仍可達卻不再需要；一次分配大量記憶體不一定是洩漏。常見根源有保留 DOM 的事件監聽、timer、訂閱、閉包及無上限的 Map/cache。

## 實作與驗證

在相同起始狀態重複開啟／關閉同一元件數次，強制 GC 後拍 heap snapshot，觀察 retained size 是否持續增加。沿 retaining path 找到持有者，再清除監聽、計時器或訂閱並重測。

## 常見誤區與取捨

只看單次 heap 大小可能被 GC 時機誤導；應看多輪操作後的趨勢與可重現的 retaining path。

## 延伸閱讀

- [原系列第 26 篇](https://ithelp.ithome.com.tw/articles/10280288)
- [返回課程總覽](./index.md)
