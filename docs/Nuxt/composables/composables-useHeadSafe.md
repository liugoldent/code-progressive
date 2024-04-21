---
description: 介紹useHeadSafe
tags:
  - nuxt
  - composable
keywords:
  [
    nuxt,
    js,
    javascript,
    composable,
    composable api,
    useHeadSafe,
    seo,
    nuxt useHeadSafe,
  ]
---

# useHeadSafe

## 概念

- 是對`useHead`composables 的包裝，他限制了輸入值只能是安全的

## 範例

- 使用方法：跟`useHead`一樣

```js
useHeadSafe({
  script: [{ id: "xss-script", innerHTML: 'alert("xss")' }],
  meta: [{ "http-equiv": "refresh", content: "0;javascript:alert(1)" }],
});
// Will safely generate
// <script id="xss-script"></script>
// <meta content="0;javascript:alert(1)">
```

## 參數

- 使用方法：跟`useHead`一樣

## 返回值

- 無

## 類型參考

```ts
export default {
  htmlAttrs: ["id", "class", "lang", "dir"],
  bodyAttrs: ["id", "class"],
  meta: ["id", "name", "property", "charset", "content"],
  noscript: ["id", "textContent"],
  script: ["id", "type", "textContent"],
  link: [
    "id",
    "color",
    "crossorigin",
    "fetchpriority",
    "href",
    "hreflang",
    "imagesrcset",
    "imagesizes",
    "integrity",
    "media",
    "referrerpolicy",
    "rel",
    "sizes",
    "type",
  ],
};
```
