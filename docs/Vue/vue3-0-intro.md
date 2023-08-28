---
description: Vue3 基本介紹
tags:
  - Vue
---

# [Vue3] Vue3 基本介紹

## 基本`Vite.config.js`

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 這邊把@意指為./src
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

## main.js 為進入點
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

## 常見資料夾
### assets
* 放靜態資源，如圖片orCSS

### components
* 放元件

### stores
* 與Pinia狀態管理有關

### router
* 與Vue router路由管理有關

### views
* 路由元件

### public
* 裡面的東西不會經過編譯和打包，所以放這裡面的東西不能被JS引用
* 通常放icon
* 而在專案打包時，public內的檔案會被直接複製一份。放在根目錄內，所以要引用資源時，要使用絕對路徑
```
/favicon.ico
```

## 為何要打包
### 必要的編譯語法
* 因為瀏覽器不懂.vue，所以要編譯成瀏覽器懂的.js or .css
* 瀏覽器不認識新語法，所以要polyfill

### 壓縮成一個或較少份的檔案
* 可以減少HTTP Requests

### Minify
* 將程式碼變短，節省瀏覽器解析的時間
* 在不影響程式運作的前提下，去除不必要的空白字元、註解、將變數名稱、函數名稱、參數名稱縮短

### Uglify
* 讓前端Code，不那麼容易被研究

### 處理第三方套件模組的引入與編譯

## SFC 是如何被編譯的
* 每個SFC都會被編譯成一個JS的ES Module，一個渲染函式
### 骨架
* SFC中`<script>`、`<template>`的內容會被編譯成渲染函式，要用到時，就會呼叫此渲染函式（這也是為啥我們可以import vue的關係，因為最後都會變成JS模組）

### 樣式
* `<style>`


## script setup
* 為何要使用：加上`setup`屬性之後，Vue會幫開發者將裡面的邏輯，包到`setup()`內，並將top-level binding 自動暴露給模板
* 具有更好的運行效能
* 在沒有`setup`，只用`setup()`時，宣告在內部的變數需要`return`出去，才能傳給渲染函式，而直接加上的情況不用
* `<script setup>`是直接取用變數。而`<script> + setup()`，會須經過傳遞，先從setup傳出去，再傳給渲染函式



