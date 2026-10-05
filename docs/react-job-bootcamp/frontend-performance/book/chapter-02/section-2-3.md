---
sidebar_position: 3
title: "2-3 檔案壓縮 File Compression"
description: "網頁資源優化：檔案壓縮 File Compression 的原理、操作、判讀與練習。"
---

# 2-3 檔案壓縮 File Compression

> 學習目標：能區分內容壓縮、HTTP 傳輸壓縮和瀏覽器快取。

**核心觀念：** Brotli 和 Gzip 對 HTML、CSS、JS 等文字內容有效；圖像／影片通常已有專用壓縮格式。瀏覽器用 Accept-Encoding 告知能力，伺服器用 Content-Encoding 標記回應，快取可能需要按 Accept-Encoding 區分變體。

**實作與驗證：** 檢查 Network 回應標頭及 transfer size，確認 CDN 或伺服器實際回傳 br/gzip。用同一檔案比較壓縮前後大小與伺服器 CPU 成本。

**常見誤區：** 不要對已高度壓縮的圖片或影片重複套通用壓縮，收益可能很小。

### 用標頭確認壓縮真的生效

```bash
curl -I -H 'Accept-Encoding: br,gzip' https://example.com/app.js
```

看回應是否有 `Content-Encoding: br` 或 `gzip`；若經 CDN，還要檢查它是否依不同編碼正確提供變體。瀏覽器 Network 的 transferred size 是傳輸量，不等同於解壓後大小。比較時需固定 URL 與快取狀態；若回應直接由本機快取取得，就不能用該次數字判斷網路壓縮收益。

延伸：[Day 16 原系列筆記](../../day-16.md)。

## 原理拆解

壓縮分為資產本身編碼和 HTTP 回應編碼。JPEG／AVIF 是圖片編碼；Brotli／Gzip 是傳輸文字回應常用的內容編碼。伺服器若回傳 Brotli，瀏覽器會在使用前解壓，開發者在 DevTools 看到的 transferred size 與解壓後資源大小不同。CDN 必須正確處理不同 `Accept-Encoding` 客戶端；若中間快取把 br 版本錯誤交給不支援的客戶端，會造成讀取失敗。壓縮還涉及伺服器 CPU，熱門靜態檔可考慮事先壓縮或由 CDN 處理。

## 從頭做一次

1. 用 curl 帶 Accept-Encoding 請求一個 JS 或 CSS 檔，檢查 Content-Encoding、Content-Type、Vary 和 Cache-Control。再用 Network 比較 transferred size 與 resource size。
2. 對同一檔案測 br 與 gzip，確認中間 CDN 沒有把壓縮回應錯誤地提供給不支援的客戶端。壓縮前先確認資源本身不是大量無用程式碼。
3. 用冷快取量首次下載；再用熱快取量重複導覽。若第二次來自 memory/disk cache，不能拿它的 0 B transferred 來宣稱 Brotli 壓縮率。

## 如何判斷做對了

若圖片、影片本身已有高壓縮率，主要改格式、尺寸、位元率；對它們再套 gzip 通常不是優先工作。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 2-37～2-42

### 2-37～2-39：壓縮發生在回應傳輸時

書中以 200 KB 的文字回應說明：伺服器直接回傳原檔會占用較多網路流量；若瀏覽器與伺服器協商使用壓縮，傳輸的回應體可變小，瀏覽器收到後再解壓。這裡區分兩種概念：圖片等檔案格式內部的有損／無損壓縮，以及 HTTP 回應的端到端壓縮。JPEG、PNG 等通常已內建壓縮，再套 gzip 往往收益有限；HTML、CSS、JS 等文字資源較適合傳輸壓縮。

頁 2-39 的代理節點示意圖強調，端到端壓縮是瀏覽器與來源伺服器對回應體的協商，中間節點不必為內容解壓再壓縮。書中提到常見的 gzip 和 Brotli，並指出 Brotli 可在某些情況產生更小輸出，但不能因此假設每種資源都必然有收益。

### 2-40：用標頭辨認協商是否成功

瀏覽器請求中的 `Accept-Encoding` 告訴伺服器能處理哪些編碼，例如 `br, gzip`。伺服器在回應中用 `Content-Encoding` 指出實際使用的一種編碼。書中的示意還有 `Vary: Accept-Encoding`，表示快取必須依請求的編碼能力區分回應版本。驗證時要看 Network 的回應標頭與實際 transferred size，不能只看壓縮設定檔。

### 2-41～2-42：應用程式與反向代理的兩個落點

書中示範 Express 的 `compression` middleware，也討論把壓縮放在 Nginx 等反向代理處理。後者讓應用程式不必在大量請求下重複花主執行緒時間做壓縮。頁 2-42 的 Nginx 範例含 `gzip on`、可壓縮 MIME 類型、壓縮等級與最小長度設定；它是教學範例，正式設定仍須依服務器版本和資源特性測試。最後用 DevTools Network 的 `Content-Encoding` 驗證第三方服務已啟用壓縮。

## 問題與解答：確認壓縮真的發生

**問題 1：伺服器開了 gzip，就能斷定使用者收到壓縮內容嗎？** 不能。請求會以 `Accept-Encoding` 宣告能力；回應應以 `Content-Encoding: gzip` 或 `br` 標示實際編碼。檢查瀏覽器 Network 的 Response Headers 與 transferred size，並注意 CDN 或代理層可能改寫回應。

**問題 2：為什麼 HTML、CSS、JS 比 JPEG 更適合 Brotli／gzip？** 文字有較多重複片段，可被通用壓縮演算法有效處理；JPEG、WebP 等格式本身已壓縮，再套一層常常收益小甚至增加 CPU。應比較同一檔案的大小與伺服器負擔，而不是對所有 MIME type 一律啟用。

**問題 3：`Content-Length`、decoded size、transferred size 不同，哪個代表網路成本？** transferred size 更接近這次實際傳送的位元組，decoded size 是解壓後交給瀏覽器處理的大小。若命中記憶體快取，transferred size 可能很小；比較壓縮效果時要固定快取狀態。

**問題 4：壓縮應放在 Express 還是 Nginx？** 兩者都可在回應層做，重點是避免重複壓縮、正確協商編碼，並讓 CDN／快取按編碼變體處理。較大的靜態檔也可預壓縮，降低每次請求的 CPU 工作。
