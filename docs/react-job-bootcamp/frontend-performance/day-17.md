---
sidebar_position: 17
title: "Day 17｜HTTP Cache"
description: "前端效能優化第 17 堂：HTTP Cache 的觀念、實作、驗證與常見誤區。"
---

# Day 17｜HTTP Cache

> 本篇是對 2021 年原系列第 17 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** `Cache-Control` 決定 freshness，ETag/Last-Modified 用於重新驗證。檔名帶內容 hash 的靜態資源可長期快取，HTML 則通常需要較短策略或重新驗證。

**解答：** 內容 hash 的 JS/CSS/圖片設 `public, max-age=31536000, immutable`；入口 HTML 使用短 TTL 或 `no-cache`，確保能取得指向新版資源的新文件。API 依資料敏感度使用短快取、重新驗證或 `no-store`。

**複習：** `no-cache` 是「可存，但使用前需驗證」；`no-store` 才是不保存。

## 深入理解

瀏覽器新鮮快取直接重用回應；過期回應可用 ETag／Last-Modified 向伺服器驗證並收到 304。no-cache 允許儲存但使用前要驗證，no-store 要求不儲存。

## 實作與驗證

對內容 hash 的靜態檔設長效 immutable；對 HTML 用重新驗證策略，確保可發現新版檔名。用 DevTools Network 的 Disable cache 關閉狀態與正常狀態比較；也可用 curl -I 檢查 Cache-Control、ETag、Vary。

## 常見誤區與取捨

若檔名沒有內容 hash，就不能無條件長期快取。登入個人資料不能因 CDN 設定錯誤而被共用快取。

## 範例：依資源型態設定快取

```http
# 檔名含內容 hash 的靜態檔
Cache-Control: public, max-age=31536000, immutable

# 入口 HTML：可儲存，但再次使用前須向伺服器驗證
Cache-Control: no-cache

# 不應被儲存的敏感回應
Cache-Control: no-store
```

部署時先上傳新版本 hash 檔，再讓 HTML 指向它；舊 hash 檔要保留一段時間，避免使用者仍持有舊 HTML 時資源突然 404。驗證可重整兩次觀察第一次下載、第二次快取或 304 的差異。

## 延伸閱讀

- [原系列第 17 篇](https://ithelp.ithome.com.tw/articles/10276125)
- [返回課程總覽](./index.md)
- [HTTP Cache-Control（MDN）](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)
