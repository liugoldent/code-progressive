---
sidebar_position: 3
title: "HTML 中高階面試實戰題"
description: "以語意、表單提交、原生 dialog、事件、圖片載入、安全與可訪問性為核心的 HTML 中高階面試題。"
tags:
  - HTML
  - Interview
  - Accessibility
keywords: ["HTML 中高階面試題", "HTML semantic", "form submission", "dialog", "web accessibility"]
---

# HTML 中高階面試實戰題

[回到 Web Platform 題庫](./index.md)

HTML 題不只是背標籤。資深面試更常問：瀏覽器原生行為能替你處理多少事情，以及錯用語意會造成哪些鍵盤、表單與可訪問性問題。

## 1. `<div @click>` 做按鈕，補 `role="button"` 就夠了嗎？

<details>
<summary>參考答案</summary>

不夠。`role` 只向 accessibility tree 宣告語意，不會自動補上鍵盤 focus、Enter/Space 啟動、disabled 行為、表單整合與瀏覽器預設樣式。優先使用原生 `<button>`。

若受限於特殊 host 必須模擬，至少要處理 `tabindex="0"`、Enter 與 Space（包含避免 Space 捲頁）、focus 樣式、`aria-disabled` 與事件阻擋。但這其實是在重造原生按鈕，也更容易漏掉平台行為。

</details>

## 2. 為什麼表單不能只監聽按鈕的 `click`？

使用者在 input 按 Enter、程式呼叫 `requestSubmit()`，或有多個 submitter 時會發生什麼？

<details>
<summary>參考答案</summary>

提交是 form 層級的行為，不等於某顆按鈕被 click。只監聽 click 會漏掉 implicit submission、輔助科技與程式化提交。應在 form 的 `submit` 事件處理，並從 `SubmitEvent.submitter` 判斷由哪個按鈕送出。

`requestSubmit()` 會走 constraint validation 與 `submit` event；舊的 `form.submit()` 會直接提交，不會觸發 `submit` event，也不會做 constraint validation。若要保留平台語意，通常選 `requestSubmit()`。

</details>

## 3. `disabled` 和 `aria-disabled="true"` 有何不同？

<details>
<summary>參考答案</summary>

原生 `disabled` 適用於支援它的 form controls：不能操作、通常不能 focus，而且不會成為表單提交資料的一部分。`aria-disabled="true"` 只把狀態暴露給輔助科技，不會阻止 click、鍵盤操作或提交，程式仍要自行攔截。

如果按鈕在 disabled 時仍需可 focus，讓使用者讀到「為何不能送出」，可以考慮 `aria-disabled`，但必須完整處理互動與視覺狀態。若值要隨表單提交但欄位不可編輯，對文字型 control 可評估 `readonly`，它和 disabled 的提交、focus 行為不同。

</details>

## 4. 自製 modal 與原生 `<dialog>`，你會怎麼選？

<details>
<summary>參考答案</summary>

`dialog.showModal()` 會把元素放入 top layer，讓其餘文件內容 inert，並提供 Esc 關閉、初始 focus 等平台行為；可用 `::backdrop` 設計背景。表單若使用 `method="dialog"`，可關閉 dialog 並寫入 `returnValue`，不送出網路請求。

但仍要提供可辨識的標題、合理的初始 focus、關閉操作，並在關閉後把 focus 還給觸發者。自製 modal 適合真的有原生元件無法滿足的互動或相容限制，但要承擔 focus trap、背景 inert、stacking、scroll lock、Esc 與 screen reader 測試成本。

</details>

## 5. 一張 LCP hero 圖應不應該加 `loading="lazy"`？

<details>
<summary>參考答案</summary>

通常不應。首屏且高機率成為 LCP 的圖片需要盡早發現與下載，lazy loading 反而可能延遲它。可使用正確的 `<img>`、`srcset`、`sizes`、明確 `width`/`height`，必要時設定 `fetchpriority="high"`；若是 CSS background，瀏覽器通常要等 CSS 解析後才發現資源，更要量測是否需要 preload。

螢幕外圖片才適合 `loading="lazy"`。`width` 與 `height` 不只是顯示尺寸，還讓瀏覽器預先保留 aspect ratio 空間，降低 CLS。

</details>

## 6. 一整列可點擊的 card 裡還有「收藏」按鈕，HTML 怎麼設計？

<details>
<summary>參考答案</summary>

不要把 `<button>` 放進 `<a>`，也不要巢狀互動元素。標題可使用正常連結，收藏使用獨立按鈕；若產品要求整張卡可點，可用 CSS pseudo-element 擴張主要連結的點擊區域，再確保收藏按鈕位於更高 layer 並保有自己的可操作區域。

也可以由 card 容器監聽 pointer click 後導頁，但必須排除文字選取、子互動元素與 modifier keys，並保留真正的 `<a href>`，才有開新分頁、複製網址、鍵盤與無 JavaScript fallback。DOM 順序、focus indicator 與可理解的 accessible name 都要測。

</details>

## 7. `async`、`defer` 與 `type="module"` 的執行順序差在哪？

<details>
<summary>參考答案</summary>

- 傳統 `async` script 下載完成就執行，不保證文件順序，執行時會暫停 HTML parser。
- 傳統 `defer` script 平行下載，文件解析完成後、`DOMContentLoaded` 前依文件順序執行。
- Module script 預設具有 defer 類似行為，會等待 dependency graph；同時是 strict mode，且每個 module 有自己的 scope。

第三方 analytics 若彼此獨立可用 async；依賴 DOM 與順序的傳統 bundle 可用 defer；現代 ESM 入口用 module。真正順序還會受 dynamic import、top-level await 與網路依賴影響，因此不要把初始化正確性建立在偶然下載速度上。

</details>

## 8. 實作題：設計一個可訪問且能漸進增強的搜尋表單

需求：JavaScript 正常時顯示即時建議；JavaScript 失敗時仍可送出搜尋；輸入框有可見名稱；狀態能被 screen reader 知道。

<details>
<summary>評分重點與骨架</summary>

```html
<form action="/search" method="get" role="search">
  <label for="site-search">搜尋文章</label>
  <input
    id="site-search"
    name="q"
    type="search"
    autocomplete="off"
    aria-describedby="search-status"
  />
  <button type="submit">搜尋</button>
  <p id="search-status" aria-live="polite"></p>
</form>
```

基本功能由 HTML form 與後端 GET endpoint 保證，JavaScript 再增強 suggestions。若做成 combobox，要依對應 ARIA pattern 管理 expanded、controls、active descendant、選項鍵盤操作；不能只在 input 下畫一個清單就宣稱可訪問。狀態訊息應精簡，避免每次按鍵都讓 live region 過度播報。

</details>

## 面試追問清單

- JavaScript 完全沒載入時，核心流程是否還成立？
- 這個 ARIA 是否在彌補錯誤元素選擇？能否改用原生 HTML？
- 鍵盤、觸控、screen reader 與瀏覽器 autofill 各會怎麼操作？
- 表單資料實際送出了哪些欄位？驗證發生在哪一層？

## 延伸查證

- [MDN：`<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [MDN：`<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form)
