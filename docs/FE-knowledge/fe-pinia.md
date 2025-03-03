---
description: Pinia
tags: 
    - Pinia 
    - VueX
---

# [FE] Pinia

## Pinia 與 Vuex 的比較
- Pinia API 更簡潔、輕量且天然支援 Composition API。
- 更好的 TypeScript 支援與類型推斷，開發體驗更佳。
- 過去 Vuex 的繁瑣結構（如 mutations、action 分離）在 Pinia 中整合得更好。
- 統一 store 定義方式（使用 `defineStore`）使得狀態管理更加直觀。

## Pinia 的基本用法
```js
// store/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```
```html
<!-- Component.vue -->
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double Count: {{ counter.doubleCount }}</p>
    <button @click="counter.increment">Increment</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/store/counter'
const counter = useCounterStore()
</script>
```

## Getters 與 Actions 的差異
* Getters： 用於從 state 派生出其他狀態值，類似計算屬性，通常不應修改 state。
* Actions： 用來處理邏輯操作與異步流程，可以修改 state，也可以調用其他 actions。

## Pinia 中的響應式機制
* Pinia 的 state 透過 Vue 3 的 reactive() 建立響應式數據。
* 組件引用 store 時，利用 Vue 的 reactivity 系統，自動追蹤依賴變更。
* 修改 store 中數據時，組件自動更新顯示。

## Pinia 與 SSR/SSG 的整合
* 服務端渲染時需注意狀態隔離，避免不同用戶共享同一個 store 實例。
* Nuxt 3 中通常使用插件方式註冊 Pinia，並在客戶端與服務端創建隔離的 store 實例。

## 異步操作與錯誤處理
* 在 actions 中撰寫 async/await 邏輯，並使用 try/catch 捕捉異常。
* Pinia 的 actions 可以直接修改 state，而無需額外 mutations。
* 與 Vuex 相比，Pinia 使得異步與同步邏輯整合更直觀。
```js
actions: {
  async fetchData() {
    try {
      const data = await fetch('https://api.example.com/data').then(res => res.json())
      this.data = data
    } catch (error) {
      console.error('Fetch data failed:', error)
      // 設定錯誤狀態或進行其他錯誤處理
    }
  }
}
```
## 插件機制
* Pinia 支援全局插件，在創建 store 前注入通用邏輯（如持久化、日誌、錯誤追蹤）。
* 可使用 pinia.use() 註冊插件，插件函式接收 store 實例與 options 參數。
* 具體案例：例如狀態持久化插件，將 store state 存入 localStorage，初始化時恢復數據

## Composable vs Pinia
### 範疇不同：
Composable 是一種撰寫可重用邏輯的設計模式，範圍很廣，能夠處理任何需要封裝邏輯的情境。
Pinia 則是一個具體的狀態管理庫，專注於集中管理應用程式的全域狀態。

### 使用場景：
當你需要共用某段邏輯但不涉及全域狀態時，使用 composable 函式即可。
而如果你需要管理跨元件的全域狀態，例如使用者資訊、應用設定等，則可以考慮使用 Pinia。