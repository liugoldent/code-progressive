---
description: hydration是什麼、注水是什麼
tags:
  - html
  - interview
keywords:
  [
    hydration,
    html,
    css,
    js,
    javascript,
    this,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
  ]
---

# 談談 hydration
## 概念
在 Web 開發中，「hydration」是指在服務器端渲染（SSR）後，在客戶端將服務器生成的 HTML 元素轉換為可交互的動態元素的過程。簡單來說，它是將靜態的 HTML 元素轉換為具有動態行為的元素的過程。

在 SSR 中，服務器會生成 HTML 內容並將其發送給客戶端，以加速頁面的初始加載和提高 SEO。然而，這些 HTML 元素通常是靜態的，沒有與 JavaScript 行為相關聯。為了實現更豐富的用戶體驗，我們需要在客戶端將這些靜態 HTML 元素轉換為具有交互性的元素。

這就是 hydration 的作用：它**通過在客戶端重新創建並附加 JavaScript 行為，將靜態的 HTML 元素轉換為動態的元素**。這樣一來，我們就可以實現諸如事件處理、狀態管理和動態更新等功能，從而提供更好的用戶體驗。

在像 Vue.js、React 和 Nuxt.js 這樣的框架和庫中，hydration 是由框架或庫本身負責的，開發者不需要手動實現它。它們會自動處理在客戶端重新注水的過程，以確保頁面的動態功能正常運作


## podcast 多聽一遍
[聊聊-Hydration-HTML](https://www.youtube.com/watch?v=Pgom8TZHs6I&t=1s&ab_channel=gt)
