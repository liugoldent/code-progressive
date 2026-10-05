---
sidebar_position: 4
title: "3-4 優化資源載入時機：Resource Hints"
description: "渲染流程優化：優化資源載入時機：Resource Hints 的原理、操作、判讀與練習。"
---

# 3-4 優化資源載入時機：Resource Hints

> 學習目標：只為本頁真正重要、且發現太晚的資源加提示。

**核心觀念：** preconnect 用於即將請求的跨來源；preload 用於本頁高優先、但晚發現的資源；prefetch 用於未來可能用到的資源。提示會消耗網路容量，需要依實際資源瀑布決定。

**實作與驗證：** 先找 LCP 圖或字型是否晚發現，再增加單一提示並重測。比對 as、type、crossorigin 與實際請求是否一致，避免重複下載。

**常見誤區：** 不是提示越多越快；過量 preload 可延遲 CSS 或主圖。

### 如何避免提示搶資源

先確定 LCP 元素，再問它的資源是否已在 HTML 中直接出現。若是 CSS 背景圖、JS 後插入的圖片等晚發現資源，才考慮 preload；若圖片本身已能被 HTML 及早發現，可能只需調整 `fetchpriority`。跨來源字型需注意 `crossorigin` 一致。

```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="preload" href="/fonts/site.woff2" as="font" type="font/woff2" crossorigin>
```

在 Network 比較修改前後資源開始時間、優先序與是否出現重複請求。

延伸：[Day 09 原系列筆記](../../day-09.md)。

## 原理拆解

資源提示解決的是「瀏覽器何時知道某個資源存在」與「何時開始連線」的問題。若主圖已在 HTML 裡直接出現，增加 preload 可能沒有收益，還可能重複請求；若主圖藏在 CSS 或 JS 裡，preload 可讓它提早進入下載隊列。`preconnect` 對跨來源連線有用，但會提早花費 DNS、TCP／QUIC 與 TLS 成本。提示不會縮小資源，也不能消除下載後的 JS 執行。

## 從頭做一次

1. 先找出 LCP 元素與它的 URL。看 Network waterfall 中主圖／字型的請求何時開始，若發現它等到 CSS 或 JS 完成後才開始，再考慮 preload。
2. 若首屏會向第三方網域請求必要字型或圖片，可評估 preconnect；若是下一頁可能用的檔案，可評估 prefetch。每個提示都與實際請求的 URL、as、type、crossorigin 對齊。
3. 比較提示前後開始下載時間、LCP 與其他關鍵資源的等待。若出現「preloaded but unused」警告或重複請求，先修正或移除提示。

## 如何判斷做對了

提示會消耗頻寬和連線；不應把所有資源都標成高優先。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 3-25～3-35

### 3-25～3-27：資源提示是對瀏覽器的請求，不是免費加速

書中把 Resource Hints 視為開發者在瀏覽器自行發現資源之前提供的線索。本節列 `preload`、`prefetch`、`preconnect`、`dns-prefetch`、`prerender` 五種提示，並提醒所有提示都會與真正需要的資源競爭網路、CPU 或記憶體。使用前先判斷「這個資源何時確定會用到」。頁 3-26 的例子主要用 `<link rel="...">`；書中也註明 Preload 已有獨立標準，不能簡單把五種提示視作同一個規格。

### 3-27～3-30：Preload 與 Prefetch

`preload` 針對**目前頁面很快就要用到**的資源，提早開始下載；`prefetch` 偏向**未來導航可能會用到**的資源，在空閒時預取。書中以首屏圖片、字型等說明 preload 的情境，並強調 `as` 要填正確資源類型，否則瀏覽器可能以錯誤優先序處理，甚至重複下載。頁 3-29 的表格是當時 Chrome 不同資源的載入優先級；它可用於理解「優先權依資源類型與載入階段而異」，實際規則需在目前瀏覽器版本重新測。書中建議在 DevTools Network 觀察 Priority 欄驗證。

### 3-30～3-33：Preconnect 與 DNS-Prefetch

`preconnect` 可提前完成跨來源連線建立所需的 DNS、TCP、TLS 步驟；書中以 CDN、即將用到的第三方網域為例。只有確定即將使用的少數來源才值得使用，因為空連線也占資源。`dns-prefetch` 僅提早解析域名，成本較低；頁 3-32～3-33 說明在支援情況不明時可配合 preconnect 作降級提示。書中把 DNS 查詢、握手與第一個位元組的時間拆開畫圖，讓使用者能從 Network waterfall 找到真正可能省下的階段。

### 3-33～3-35：Prerender 與 YouTube 實例

`prerender` 對高度確定的下一頁可預先載入甚至渲染；若預測錯誤，浪費也最大。書中因此把它放在比 prefetch 更審慎的情境，並提醒支援度要核對。案例 `lite-youtube-embed` 展示另一種應用：先以縮圖代替一開始就載入完整 YouTube iframe，使用者接近互動時再建立連線或請求真正播放器。其改善來自延後重型第三方資源，搭配 preconnect 加快確定要用到時的連線，而不是對所有第三方網域都預先連線。

## 問題與解答：資源提示該給誰

**問題 1：`preload` 與 `prefetch` 何時用？** `preload` 告訴瀏覽器本頁很快需要某資源，適合晚發現的 LCP 圖或關鍵字型；`prefetch` 比較偏向未來導覽可能需要的資源。先從瀑布圖確認資源發現太晚，再加提示；不能因為重要就把所有檔案都 preload。

**問題 2：`preconnect` 與 `dns-prefetch` 差在哪？** 前者嘗試提前完成跨來源連線準備，後者主要先做 DNS 解析。若確定很快會向某第三方來源請求，可測 preconnect；若只是可能使用，可考慮較輕的 DNS 提示。過多預連線會佔用連線與裝置資源。

**問題 3：為何 preload 後資源竟下載兩次？** 提示的 URL、`as`、`type` 或 `crossorigin` 與真正請求不吻合時，瀏覽器可能無法重用。對照 Network 的 Initiator 與兩次請求標頭，修正屬性後重測。

**問題 4：資源提示會傷害其他載入嗎？** 會。網路頻寬有限，錯誤的高優先資源可能擠掉 CSS 或首屏主圖。看 LCP、總傳輸與瀑布圖，若關鍵資源開始更晚，就要撤回或調整提示。
