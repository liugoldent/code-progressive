---
description: 介紹 useNuxtData
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
    useNuxtData,
    seo,
    nuxt useNuxtData,
  ]
---

# useNuxtData
## 概念
* 使用 useNuxtData hook 時，您可以從上下文中訪問到一些關於當前頁面的重要信息，比如路由參數、頁面的元數據（meta data）、頁面的標題等。這使得您可以在 Vue 組件中方便地訪問這些數據，以便根據這些信息來動態地調整組件的行為、顯示內容等。
* 允許你獲取一些cache的資料
## 範例
```html
<script setup lang="ts">
const { data } = await useFetch('/api/posts', { key: 'posts' })
</script>

<script setup lang="ts">
const { id } = useRoute().params
const { data: posts } = useNuxtData('posts')
const { data } = useLazyFetch(`/api/posts/${id}`, {
  key: `post-${id}`,
  default() {
    return posts.value.find(post => post.id === id)
  }
})
</script>

```
## 返回值
## 類型參考
```ts
useNuxtData<DataT = any> (key: string): { data: Ref<DataT | null> }
```