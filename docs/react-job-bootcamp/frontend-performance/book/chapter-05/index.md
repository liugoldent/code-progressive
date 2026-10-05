---
sidebar_position: 5
title: "Chapter 05｜快取與網路機制"
description: "書籍版第 05 章逐節筆記與練習。"
---

# Chapter 05｜快取與網路機制

在速度、資料新鮮度和使用者隔離之間做正確取捨。

## 這一章在解決什麼

快取的核心問題是「同一份回應何時還能使用、能由誰使用」。HTTP cache、Service Worker、CDN 和前端資料快取作用於不同層；它們可能同時影響一次請求。設計前先明確寫下資料能容忍多久舊值、是否含個人資訊、如何更新與清除。

## 怎麼決定先讀哪一節

帶 hash 的公開靜態檔適合長快取；HTML 需能發現新版本；一般公開資料可評估短快取或 SWR；登入個人資料則必須審慎處理共享和登出後殘留。

## 本章小節

1. [5-1 HTTP Cache](./section-5-1.md)
2. [5-2 Service Workers Cache](./section-5-2.md)
3. [5-3 CDN](./section-5-3.md)
4. [5-4 Application Shell Architecture](./section-5-4.md)
5. [5-5 Stale While Revalidate](./section-5-5.md)
6. [5-6 升級 HTTP 版本](./section-5-6.md)

## 本章學習方式

先選一個自己的頁面，照每節的「從頭做一次」保存基準值與操作紀錄。讀完後，把每節的結果連回同一個使用者任務，判斷最大瓶頸是否已經改變。

[返回書籍版總覽](../index.md)
