---
description: 介紹useError
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
    useError,
    seo,
    nuxt useError,
  ]
---

# useError

## 概念

- 可以返回正在處理的全域 Nuxt 錯誤，他在 client 端和 server 端都可以使用

## 範例

### composable part

```js
const error = useError();
```

### vue part

```html
<!-- pages/MyPage.vue -->

<template>
  <div>
    <h2>我的頁面</h2>

    <div v-if="error">
      <p>錯誤訊息：{{ error }}</p>
      <button @click="clearError">清除錯誤</button>
    </div>

    <button @click="simulateError">模拟錯誤</button>
  </div>
</template>

<script setup>
  import { useError } from "~/composables/useError";

  const { error, setError, clearError } = useError();

  // 模拟错误的函数
  const simulateError = () => {
    setError("這是一個模擬的錯誤訊息");
  };
</script>
```

## 返回值

### error 內容

```ts
interface {
  // HTTP響應狀態碼
  statusCode: number
  // HTTP響應狀態消息
  statusMessage: string
  // 錯誤消息
  message: string
}
```
