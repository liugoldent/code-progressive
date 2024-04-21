---
description: 介紹 useLazyFetch
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
    useLazyFetch,
    seo,
    nuxt useLazyFetch,
  ]
---

# useLazyFetch
## 概念
* 默認情況下，`useFetch`在其異步處理程序解析之前會阻止導航。`useLazyFetch`提供了一個包裝器，將`useFetch`包裝起來，通過將`lazy`選項設置為`true`來在處理程序解析之前觸發導航。
## 範例
```vue
<script setup lang="ts">
/* Navigation will occur before fetching is complete.
  Handle pending and error states directly within your component's template
*/
const { pending, data: posts } = await useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // Because posts might start out null, you won't have access
  // to its contents immediately, but you can watch it.
})
</script>

<template>
  <div v-if="pending">
    Loading ...
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- do something -->
    </div>
  </div>
</template>
```
## 參數
* 參考`useFetch`
## 返回值
## 類型參考
