---
sidebar_position: 20
title: "Day 20｜CDN"
description: "前端效能優化第 20 堂：CDN 的觀念、實作、驗證與常見誤區。"
---

# Day 20｜CDN

> 本篇是對 2021 年原系列第 20 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** CDN 從靠近使用者的節點提供內容，降低 RTT 並分擔 origin 流量。靜態資源最容易受益，動態內容則取決於可快取性與邊緣能力。

**解答：** 把 hash 靜態資源放 CDN 並設定長 TTL；HTML/API 依可快取程度設定 cache key、`s-maxage` 與 purge。確認 query、cookie、語系等是否需要進 cache key，避免不同使用者拿到錯誤內容。

**實務：** 設定 cache key、TTL、purge、版本化與 fallback；壓縮、HTTP 版本、TLS 與圖片轉換通常也可由 CDN 協助。

## 深入理解

CDN 可快取與壓縮資源，縮短部分使用者至服務節點的距離。但實際命中率由 cache key、TTL、Vary、cookie、query 參數與清除策略決定。

## 實作與驗證

檢查回應中的 Age、Cache-Control、CDN 命中資訊及 TTFB；分冷命中、熱命中、不同地區比較。靜態檔用內容 hash，公開 HTML/API 先定義可共用範圍，再設 CDN 規則。

## 常見誤區與取捨

個人化內容若被錯誤納入共用快取會造成資料外洩。CDN 命中高也不代表 LCP 一定快，渲染和 JS 仍可能是瓶頸。

## 延伸閱讀

- [原系列第 20 篇](https://ithelp.ithome.com.tw/articles/10277764)
- [返回課程總覽](./index.md)
