---
description: 介紹 useNuxtApp
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
    useNuxtApp,
    seo,
    nuxt useNuxtApp,
  ]
---

# useNuxtApp
## 概念
* 是 Nuxt.js 中提供的一個 Composables 函數，用於在組件中獲取 Nuxt 應用程序實例。通過 useNuxtApp，您可以在組件中訪問 Nuxt 應用程序實例的各種功能和屬性，例如路由、插件、配置等。
## 範例
```html
<template>
  <div>
    <h1>Hello, {{ appName }}</h1>
    <p>当前路由：{{ currentRoute }}</p>
  </div>
</template>

<script setup>
import { useNuxtApp } from '@nuxtjs/composition-api';

// 使用 useNuxtApp 獲取 Nuxt 應用程序實例
const nuxtApp = useNuxtApp();

// 獲取應用程序名稱
const appName = nuxtApp.$options.name;

// 獲取當前路由信息
const currentRoute = nuxtApp.context.route.path;
</script>
```
## 方法
### `provide(name, value)`
* 使值和輔助方法在你的Nuxt應用程序中的所有組合函數和組件中都可用。
```js
const nuxtApp = useNuxtApp()
nuxtApp.provide('hello', (name) => `Hello ${name}!`)

// 输出 "Hello name!"
console.log(nuxtApp.$hello('name'))
```
### `hook(name, cb)`
* 用於在特定點上的渲染生命周期中添加自定義邏輯。當創建Nuxt插件時，通常使用hook函數
```ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    /* code */
  })
  nuxtApp.hook('vue:error', (..._args) => {
    console.log('vue:error')
    // if (process.client) {
    //   console.log(..._args)
    // }
  })
})
```
### `callHook(name, ...args)`
* 調用任何現有鉤子時，它會返回一個promise
```ts
await nuxtApp.callHook('my-plugin:init')
```

## 屬性
### isHydrating
* 檢查Nuxt App是否在客戶端進行注水
```ts
export default defineComponent({
  setup (_props, { slots, emit }) {
    const nuxtApp = useNuxtApp()
    onErrorCaptured((err) => {
      if (process.client && !nuxtApp.isHydrating) {
        // ...
      }
    })
  }
})
```
## 返回值
## 類型參考
