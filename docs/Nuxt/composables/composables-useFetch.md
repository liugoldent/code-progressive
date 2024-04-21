---
description: 介紹useFetch
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
    useFetch,
    seo,
    nuxt useFetch,
  ]
---

# useFetch

## 概念

- `useFetch` 是一個用於發起 HTTP 請求的 composables 函數，它允許您在組件中方便地執行數據獲取操作。`useFetch` 是基於 Vue 3 的 `@nuxtjs/composition-api` 插件提供的功能。

- 使用 `useFetch` 可以將數據獲取的邏輯與組件邏輯分離，從而使組件更加清晰和可維護。它可以在組件的 `setup()` 函數中使用，與其他 Composables 函數一起工作，並且可以通過響應式的方式更新組件的數據。

- 可以直接在 setup function, plugin, route middleware 調用。返回可響應式的可組合函數，並處理將響應添加到 Nuxt payload 中，可以將此數據直接注入到頁面中。

- `useFetch`為保留字，不應該重新命名自己的composables為`useFetch`

## 範例

### composable part

```html
<script setup lang="ts">
  const { data, pending, error, refresh } = await useFetch("/api/modules", {
    pick: ["title"],
  });
</script>
```

- `data`, `pending`, `error`, `refresh` 為 Vue refs，他們要使用`.value`
- 傳入第一個參數為 API 網址
- 傳入第二個參數為物件

### vue part

```html
<template>
  <div>
    <h2>用户列表</h2>
    <ul v-if="users">
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
    <div v-else>数据加载中...</div>
  </div>
</template>

<script setup>
  import { useFetch } from "@nuxtjs/composition-api";

  // 使用 useFetch 发起 HTTP 请求
  const { data: users, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );
</script>
```

## 參數
* 所有fetch參數都可以為computed or ref，如果被更新，將自動使用`useFetch`
### URL

- 要獲取的 URL

### options

- 為物件型態

#### method

- 請求方法

#### query

- 請求所需參數

#### params

- query 的別名

#### body

- 請求正文

#### headers

- 請求的 headers

#### baseURL

- 基本 URL

#### timeout

- 多久 timeout

## 返回值

**默認情況下，Nuxt 會等待 refresh 完成後才能再次執行**

### data

- 傳入異步函數的結果

### pending

- 一個布林值，只是數據是否在獲取中

### refresh/execute

- 一個可以用於刷新 handler 函數返回的數據的函數

### error

- 如果數據獲取失敗，則為錯誤物件

### status

- 表示數據請求的狀態的字符串（"idle"、"pending"、"success"、"error"）

## 類型參考

```ts
function useFetch<DataT, ErrorT>(
        url: string | Request | Ref<string | Request> | () => string | Request,
        options?: UseFetchOptions<DataT>
): Promise<AsyncData<DataT, ErrorT>>

type UseFetchOptions<DataT> = {
  key?: string
  method?: string
  query?: SearchParams
  params?: SearchParams
  body?: RequestInit['body'] | Record<string, any>
  headers?: Record<string, string> | [key: string, value: string][] | Headers
  baseURL?: string
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  getCachedData?: (key: string) => DataT
  deep?: boolean
  default?: () => DataT
  transform?: (input: DataT) => DataT
  pick?: string[]
  watch?: WatchSource[] | false
}

type AsyncData<DataT, ErrorT> = {
  data: Ref<DataT | null>
  pending: Ref<boolean>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  error: Ref<ErrorT | null>
  status: Ref<AsyncDataRequestStatus>
}

interface AsyncDataExecuteOptions {
  dedupe?: boolean
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'

```
