---
sidebar_position: 27
title: "Day 27｜Stale-While-Revalidate"
description: "前端效能優化第 27 堂：Stale-While-Revalidate 的觀念、實作、驗證與常見誤區。"
---

# Day 27｜Stale-While-Revalidate

> 本篇是對 2021 年原系列第 27 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** 先立即回傳舊快取內容，同時在背景重新驗證並更新快取，兼顧回應速度與資料新鮮度。

**解答：** HTTP 可設定 `Cache-Control: max-age=..., stale-while-revalidate=...`；前端資料層則先顯示 cache，背景 fetch，成功後替換並通知 UI。權限、付款、即時庫存等不能容忍舊值的資料不要使用此策略。

**適合：** 能容忍短暫舊資料的內容；價格、庫存、權限等敏感資料須謹慎。UI 端也常以相同概念實作資料快取。

## 深入理解

HTTP stale-while-revalidate 是快取指令，容許過期內容在指定期間先回應並背景驗證；前端資料庫的同名模式是應用層策略，兩者更新時機與可見性不同。

## 實作與驗證

為公告或一般內容設定可容忍的陳舊時間。測新鮮、剛過期、超過 SWR 視窗及離線時顯示的內容；前端資料層需處理背景請求失敗、競態與元件重複掛載。

## 常見誤區與取捨

價格、權限與付款狀態通常不能直接使用可能過期的資料作決策；UI 顯示舊值時應讓使用者知道資料狀態。

## 延伸閱讀

- [原系列第 27 篇](https://ithelp.ithome.com.tw/articles/10280724)
- [返回課程總覽](./index.md)
- [HTTP Cache-Control（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
