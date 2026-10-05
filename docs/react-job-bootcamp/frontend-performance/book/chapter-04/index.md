---
sidebar_position: 4
title: "Chapter 04｜組建流程優化"
description: "書籍版第 04 章逐節筆記與練習。"
---

# Chapter 04｜組建流程優化

控制 JavaScript 的下載與執行成本。

## 這一章在解決什麼

這一章處理「打包產物到底讓使用者下載了什麼」。Code splitting 延後低頻功能，tree shaking 移除真正未使用的輸出，支援矩陣則決定轉譯與 polyfill 量。三者互補，但每一項都需要看正式 build 產物，而不是只憑原始碼推測。

## 怎麼決定先讀哪一節

先用 analyzer 找最大模組；未使用輸出試 tree shaking，低頻功能試動態匯入，舊語法與 polyfill 則回到瀏覽器支援矩陣。量首屏收益，也要量第一次使用功能的新增等待。

## 本章小節

1. [4-1 拆分應用 Bundle：Code Splitting 與 Dynamic Import](./section-4-1.md)
2. [4-2 移除用不到的程式碼：Tree Shaking](./section-4-2.md)
3. [4-3 Polyfill-less Bundling Script](./section-4-3.md)

## 本章學習方式

先選一個自己的頁面，照每節的「從頭做一次」保存基準值與操作紀錄。讀完後，把每節的結果連回同一個使用者任務，判斷最大瓶頸是否已經改變。

[返回書籍版總覽](../index.md)
