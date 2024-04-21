---
description: 介紹useHead
tags:
  - nuxt
  - composable
keywords:
  [nuxt, js, javascript, composable, composable api, useHead, seo, nuxt useHead]
---

# useHead

## 概念

- `useHead`可以以程式或響應式的方式來自定義 Nuxt App 中每個頁面的頭部屬性，它是由[Unhead](https://unhead.unjs.io/)提供支持的。如果數據來自用戶或其他不可信來源時，建議使用`useHeadSafe`

## 範例

```html
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>

<script setup>
  import { useHead } from "@nuxtjs/composition-api";

  // 使用 useHead 設置網頁元信息
  useHead(() => ({
    title: "我的網站",
    meta: [
      { hid: "description", name: "description", content: "這是我的網站描述" },
      {
        hid: "keywords",
        name: "keywords",
        content: "Nuxt.js, Vue.js, JavaScript",
      },
    ],
  }));
</script>
```

## 參數

### `meta`

- 陣列中的每個元素，都會映射到新創建的`<meta>`標籤，其中物件屬性映射到相應的屬性
- 類型：`Array<Record<string, any>>`

### `link`

- 數組中的每個元素都映射到一個新創建的`<link>`標籤，其中對象屬性映射到相應的屬性。
- 類型：`Array<Record<string, any>>`

### `style`

- 數組中的每個元素都映射到一個新創建的`<style>`標籤，其中對象屬性映射到相應的屬性。
- 類型：`Array<Record<string, any>>`

### `script`

- 數組中的每個元素都映射到一個新創建的`<script>`標籤，其中對象屬性映射到相應的屬性。
- 類型：`Array<Record<string, any>>`

### `noscript`

- 數組中的每個元素都映射到一個新創建的`<noscript>`標籤，其中對象屬性映射到相應的屬性。
- 類型：`Array<Record<string, any>>`

### `titleTemplate`

- 配置動態模板以自定義每個頁面的標題。
- 類型：`string` | `((title: string) => string)`

### `title`

- 在每個頁面上設置靜態頁面標題。
- 類型：`string`

### `bodyAttrs`

- 設置`<body>`標籤的屬性。每個對象屬性都映射到相應的屬性。
- 類型：`Record<string, any>`

### `htmlAttrs`

- 設置`<html>`標籤的屬性。每個對象屬性都映射到相應的屬性。
- 類型：`Record<string, any>`

## 返回值

- 無

## 類型參考

```ts
interface MetaObject {
  title?: string;
  titleTemplate?: string | ((title?: string) => string);
  base?: Base;
  link?: Link[];
  meta?: Meta[];
  style?: Style[];
  script?: Script[];
  noscript?: Noscript[];
  htmlAttrs?: HtmlAttributes;
  bodyAttrs?: BodyAttributes;
}
```
