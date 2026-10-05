---
sidebar_position: 3
title: "Chapter 03｜渲染流程優化"
description: "書籍版第 03 章逐節筆記與練習。"
---

# Chapter 03｜渲染流程優化

理解瀏覽器管線，讓畫面更早出現、互動更流暢。

## 這一章在解決什麼

渲染優化從一條管線看問題：HTML／CSS 解析、樣式計算、布局、繪製、合成，以及同時在主執行緒執行的 JavaScript。腳本載入、資源提示與懶載入影響工作何時開始；虛擬列表和高效能 CSS 則影響每次更新需要做多少工作。

## 怎麼決定先讀哪一節

Network 有長瀑布時先看載入順序；Performance 有大量 Layout／Paint 時先看 DOM 與樣式更新；主執行緒有長 JS 任務時轉查演算法、分片或 Worker。

## 本章小節

1. [3-1 瀏覽器的架構演進史](./section-3-1.md)
2. [3-2 瀏覽器渲染引擎的運作機制](./section-3-2.md)
3. [3-3 控制 Script 載入時機：Non-Blocking Script](./section-3-3.md)
4. [3-4 優化資源載入時機：Resource Hints](./section-3-4.md)
5. [3-5 減輕渲染負擔：Virtualized List](./section-3-5.md)
6. [3-6 延遲載入 Lazy Loading](./section-3-6.md)
7. [3-7 寫出高效能的 CSS](./section-3-7.md)
8. [3-8 硬體加速：CSS GPU Acceleration](./section-3-8.md)

## 本章學習方式

先選一個自己的頁面，照每節的「從頭做一次」保存基準值與操作紀錄。讀完後，把每節的結果連回同一個使用者任務，判斷最大瓶頸是否已經改變。

[返回書籍版總覽](../index.md)
