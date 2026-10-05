---
sidebar_position: 6
title: "Chapter 06｜Web Workers 與 WebAssembly"
description: "書籍版第 06 章逐節筆記與練習。"
---

# Chapter 06｜Web Workers 與 WebAssembly

把真正昂貴的計算從主執行緒工作中分離。

## 這一章在解決什麼

Worker 與 Wasm 解決不同問題。Worker 處理「工作在哪個執行緒跑」，Wasm 處理「某種計算以什麼形式執行」；兩者可以合併。先證明主執行緒被純計算阻塞，再把啟動、資料傳輸和總完成時間算入方案比較。

## 怎麼決定先讀哪一節

若工作很小，先保留簡單 JS；若長任務阻塞 UI，可試切片或 Worker；若計算核心夠重且已有適合的原生演算法，再評估 Wasm。

## 本章小節

1. [6-1 Web Workers](./section-6-1.md)
2. [6-2 WebAssembly](./section-6-2.md)

## 本章學習方式

先選一個自己的頁面，照每節的「從頭做一次」保存基準值與操作紀錄。讀完後，把每節的結果連回同一個使用者任務，判斷最大瓶頸是否已經改變。

[返回書籍版總覽](../index.md)
