---
description: 介紹useAsyncData
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
    useAsyncData,
    seo,
    nuxt useAsyncData,
  ]
---

# useAsyncData

## 概念

- 通常用於在頁面組件中加載數據，並將數據綁定到組件的模板中。使用 useAsyncData 可以讓您更輕鬆地處理異步數據的加載過程，並確保數據在「組件渲染之前」已經準備好。

## 範例

### composable part

```html
<script setup lang="ts">
  const { data, pending, error, refresh } = await useAsyncData(
    "mountains",
    () => $fetch("https://api.nuxtjs.dev/mountains")
  );
</script>
```

### vue part

```html
<template>
  <div>
    <h2>山脈列表</h2>

    <div v-if="pending">數據加載中...</div>

    <div v-else-if="error">加載數據時出現錯誤：{{ error.message }}</div>

    <div v-else>
      <ul>
        <li v-for="mountain in data" :key="mountain.id">{{ mountain.name }}</li>
      </ul>
    </div>

    <button @click="refresh">重新加載數據</button>
  </div>
</template>

<script setup lang="ts">
  import { useAsyncData } from "~/composables/useAsyncData";

  const { data, pending, error, refresh } = await useAsyncData(
    "mountains",
    () => $fetch("https://api.nuxtjs.dev/mountains")
  );
</script>
```

## 參數

### key

- 一個唯一的鍵，以確保可以跨請求正確地刪除數據提取。 如果您不提供密鑰，則會為您生成一個對 `useAsyncData` 實例的文件名和行號唯一的密鑰。

### handler

- 一個返回值的異步函數

### options：

#### `lazy`

- 是否於載入路由後才開始執行異步請求函數，預設為 `false`，所以會阻止路由載入直到請求完成後才開始渲染頁面元件。

#### `default`

- 可以將異步請求發送與回傳解析前，設定資料的預設值，對於設定 `lazy: true` 選項特別有用處，至少有個預設值可以使用及渲染顯示。

#### `server`

- 是否在服務器上獲取數據（默認為 true）

#### `transform`

- 加工`handler`回傳結果的函數

#### `pick`

- 如果`handler`回傳物件，則可以以依照需要的 key 取出資料，例如只從 JSON 物件中取某幾個 key 組成新的物件

#### `watch`

- 監視反應源以自動刷新

#### `immediate`

- 當設置為 false 時，將阻止請求立即觸發。 （默認為 true）

#### `deep`

- 傳回深度引用物件中的資料，預設為`true`，可以將其設定為`false`在淺引用對像中傳回數據，如果您的數據不需要深度響應，則可以提高效能。

#### `dedupe`

- 避免在同一時間獲取同一個 key 值資料（預設為`cancel`）
- 有兩種值：
  - cancel：當一個新的請求產生時，取消已經存在的請求
  - defer：如果有任何 pending 要求，將不會去產生一個新的請求

#### `initialCache`

- 預設為`true`，當第一次請求資料時，將會把有效的 payload 快取，之後請求只要是相同的 key，都會直接回傳快取結果。

## 返回值

### data

- 傳入非同步函數的回傳結果

### pending

- 以`true`或`false`表示是否正在獲取資料

### refresh/execute

- 一個函數，可以用來重新執行`handler`函數，回傳新的資料，類似重新整理、重打一次 API 的概念。預設情況下 refresh() 執行完並回傳後才能再次執行。

### error

- 資料獲取失敗時回傳的物件
