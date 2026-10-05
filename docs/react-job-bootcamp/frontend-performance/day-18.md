---
sidebar_position: 18
title: "Day 18｜Service Worker Cache"
description: "前端效能優化第 18 堂：Service Worker Cache 的觀念、實作、驗證與常見誤區。"
---

# Day 18｜Service Worker Cache

> 本篇是對 2021 年原系列第 18 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** Service Worker 位在應用與網路之間，可攔截請求，實作 cache-first、network-first 等策略，支援離線體驗。

**解答：** 版本化 precache；靜態資源用 cache-first，頻繁更新資料用 network-first，能接受舊資料者用 stale-while-revalidate。`activate` 時刪除舊 cache，為離線與網路失敗提供 fallback，避免快取帶驗證資訊的敏感回應。

**風險：** 更新生命週期、舊 cache 清理及錯誤快取很容易造成「使用者永遠拿到舊版」。版本管理與 fallback 必須先設計。

## 深入理解

Service Worker 有 install、activate 與 fetch 生命週期，通常需 HTTPS。它管理的是可程式化的 Cache Storage，與 HTTP cache 行為不同，兩者可能一起影響結果。

## 實作與驗證

先定義 precache 版本與 runtime 策略。測首次線上、重新整理、離線、更新部署後四種情境；在 Application 面板檢查 worker 狀態與 Cache Storage。對 API 設 timeout 和網路失敗 fallback，保留清理舊 cache 的路徑。

## 常見誤區與取捨

cache-first 套在 HTML 或敏感 API 上容易長期看到舊資料。skipWaiting／clientsClaim 雖能加快更新，也需確認舊頁面與新資源相容。

## 延伸閱讀

- [原系列第 18 篇](https://ithelp.ithome.com.tw/articles/10276666)
- [返回課程總覽](./index.md)
