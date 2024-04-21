---
description: 介紹useHydration
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
    useHydration,
    seo,
    nuxt useHydration,
  ]
---

# useHydration

## 概念

- useHydration 是一個 Composables 函數，用於設置組件的數據是否需要在客戶端重新注水（hydration）。在 Nuxt.js 中，SSR（服務器端渲染）是一個常見的用例，它使得您可以在服務器端渲染組件，然後在客戶端將其重新注水，以提供更快的頁面加載和更好的 SEO。

- 默認情況下，Nuxt.js 的組件在 SSR 模式下會自動進行重新注水。然而，有時候您可能希望組件在客戶端不進行重新注水，以減少客戶端的工作量或避免與客戶端進行衝突。這時就可以使用 `useHydration` 函數。
## 範例
```html
<template>
  <div>
    <h1>Hello World</h1>
    <p v-if="!hydrated">此組件未在客戶端重新注水</p>
    <p v-else>此組件已在客戶端重新注水</p>
  </div>
</template>

<script setup>
import { useHydration } from '@nuxtjs/composition-api';

// 使用 useHydration 函數
const { hydrated } = useHydration();
</script>

```
## 參數
### `key`
* Type: String
* key 是唯一的鍵，用於標識 Nuxt 應用程序中的數據
### `get`
* Type: Function
* get 是一個返回值的函數，用於設置初始數據
### `set`
* Type: Function
* set 在客戶端接收數據的函數
### notice
* 在服務器端使用`get`函數返回初始數據後，您可以使用作為useHydration可組合項中第一個參數傳遞的唯一鍵在`nuxtApp.payload`中訪問該數據。
## 返回值
## 類型參考
```ts
useHydration <T> (key: string, get: () => T, set: (value: T) => void) => {}
```
