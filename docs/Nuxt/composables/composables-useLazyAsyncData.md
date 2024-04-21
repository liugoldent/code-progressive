---
description: 介紹 useLazyAsyncData
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
    useLazyAsyncData,
    seo,
    nuxt useLazyAsyncData,
  ]
---

# useLazyAsyncData
## 概念
* 默認情況下，`useLazyAsyncData`會阻塞導航，直到非同步處理程序解析完成。`useLazyAsyncData`在`useAsyncData`周圍提供一個包裝氣，通過將`lazy`設定為`true`，在處理程序解析之前觸發導航。
* 注意：一樣不得重複命名為useLazyAsyncData
## 範例
```vue
<script setup lang="ts">
/* 在获取完成之前，导航将会发生。
  在组件的模板中直接处理挂起和错误状态
*/
const { pending, data: count } = await useLazyAsyncData('count', () => $fetch('/api/count'))

watch(count, (newCount) => {
  // 因为 count 可能最初为 null，你不会立即访问到它的内容，但你可以监视它。
})
</script>

<template>
  <div>
    {{ pending ? '加载中' : count }}
  </div>
</template>
```
## 參數
* 參考`useAsyncData`
## 返回值
## 類型參考
