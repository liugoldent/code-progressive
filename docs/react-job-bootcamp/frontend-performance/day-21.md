---
sidebar_position: 21
title: "Day 21｜升級 HTTP 連線"
description: "前端效能優化第 21 堂：升級 HTTP 連線 的觀念、實作、驗證與常見誤區。"
---

# Day 21｜升級 HTTP 連線

> 本篇是對 2021 年原系列第 21 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** HTTP/2 的 multiplexing、header compression 與單連線並行改善 HTTP/1.1 的阻塞與連線成本。效能策略因此不再一味追求 domain sharding 或合併所有資源。

**解答：** 在伺服器/CDN 啟用 HTTP/2 或更新協定與現代 TLS；移除為 HTTP/1.1 設計的過度 domain sharding。保留合理 code splitting，並以 waterfall 檢查是否仍有串行依賴、慢 TTFB 或第三方連線成本。

**實務：** 協定升級不是萬靈丹；仍需減少無用位元組、避免過長依賴瀑布，並透過 Network waterfall 驗證。

## 深入理解

HTTP/2 多工處理讓單一連線可承載多個請求；HTTP/3 使用 QUIC 改善部分連線情境。協定改善傳輸行為，卻無法消除頁面內部的資源依賴。

## 實作與驗證

在 Network 的 Protocol 欄與 waterfall 檢查實際協定、排隊、優先序和串行請求。關閉舊式 domain sharding 前後，測量 DNS／連線成本與真實頁面速度。

## 常見誤區與取捨

多工不等於所有資源應合成一個 bundle；小檔案可分別快取，但過多碎片仍有管理和依賴成本。

## 延伸閱讀

- [原系列第 21 篇](https://ithelp.ithome.com.tw/articles/10278186)
- [返回課程總覽](./index.md)
