---
sidebar_position: 9
title: "Day 09｜Resource Hints 與非阻塞腳本"
description: "前端效能優化第 9 堂：Resource Hints 與非阻塞腳本 的觀念、實作、驗證與常見誤區。"
---

# Day 09｜Resource Hints 與非阻塞腳本

> 本篇是對 2021 年原系列第 9 篇的學習整理，加入現行實務補充；驗證時以你專案的實測結果為準。

**精華：** `preconnect`、`dns-prefetch`、`preload`、`prefetch` 用來提示瀏覽器未來需要的資源；`async` 與 `defer` 則改變腳本下載及執行時機。

**解答：** 應用主程式通常使用 `defer`；完全獨立的分析腳本可用 `async`。只 preload 首屏確定會使用的字型、樣式或主圖，跨來源資源搭配正確 `crossorigin`；下一頁可能使用的低優先資源才用 prefetch。

**判斷：**

- `defer`：依文件順序執行，適合依賴 DOM 的一般應用腳本。
- `async`：下載完立即執行，適合彼此獨立的腳本。
- `preload`：本次導覽確定需要的高優先資源。
- `prefetch`：未來可能使用，優先度較低。

## 深入理解

preconnect 先處理跨來源連線；preload 提早抓本頁確定要用的資源；prefetch 備妥未來可能使用的資源。資源提示消耗連線與頻寬，數量過多會擠掉真正重要的資源。

## 實作與驗證

用 waterfall 找『開始下載太晚』的關鍵字型或主圖。只對確定需要的資源設定 preload，並核對 as、type、crossorigin 與實際請求是否一致。一般獨立腳本選 async；需依文件順序、等待 DOM 解析完成者選 defer。

## 常見誤區與取捨

preload 後若請求條件不符，可能重複下載；preconnect 太多第三方網域也會增加連線成本。

## 範例：選擇正確提示

```html
<link rel="preconnect" href="https://fonts.example.com" crossorigin />
<link rel="preload" href="/fonts/site.woff2" as="font" type="font/woff2" crossorigin />
<script defer src="/app.js"></script>
<script async src="/independent-analytics.js"></script>
```

先在 waterfall 確認字型確實晚發現，再考慮 preload。若字型未被本頁使用，這個提示反而搶走主圖或 CSS 的頻寬；跨來源字型的 `crossorigin` 要與實際請求一致。

## 延伸閱讀

- [原系列第 9 篇](https://ithelp.ithome.com.tw/articles/10271044)
- [返回課程總覽](./index.md)
