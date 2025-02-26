---
description: vue 面試常見問題
tags:
  - javascript
  - Test
  - Vue
  - Vue2
  - Vue3
---

# [FE] Vue3

## 更小、更快、更友好、性能優化

### 更小

- 引入`tree-shaking`，可以將模塊剪輯，僅打包需要的，讓打包的整體體積更小

### 更快

- diff 演算法優化
- 靜態提升
- 事件監聽緩存
- SSR 優化

### 更友好

- 除了`options API`更有`composition API`
- vue3 是基於 ts 編寫的，可以享受到類型定義提示

### 性能優化

#### 數據響應優化

- vue2 主要是使用`object.defineProperty`，不能檢測物件屬性的添加與刪除
- vue3 主要使用`proxy`監聽整個物件，那麼對於物件刪除與監聽還是可以監聽到的

## watch vs watchEffect

- [文章](https://blog.csdn.net/weixin_57909742/article/details/133779422)
- watch：
  1. 需要**明確指出監控的數據**，開啟 deep 才可以深度監控屬性或元素的變化
- watchEffect：
  1. **自動收集使用到的響應式數據**，因此代碼更簡潔
  2. 但是無法使用舊值與新值
  3. 如果是物件要讓 watchEffect 動作，必須要監聽物件的 key 值
- watch reactive的物件
```js
const obj = reactive({ count: 0 })
// 注意這邊是使用函數
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```
- 客制選擇
```js
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true },
  { deep: true }, 
  { immediate: true }, 
  // 監聽器建立後會立刻執行一次，輸出當前 someRef 的值；之後每當 someRef 改變時，監聽器才會再次被觸發。
)
```

## props的寫法
```html
<script setup>
import { defineProps } from 'vue'
import PropTypes from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <h4>{{ props.title }}</h4>
</template>

```


## vue3 的性能提升，是通過哪幾個方面顯現的

- [文章](https://github.com/febobo/web-interview/issues/46)

### 編譯

#### vue2

- vue2 在組件創建時，都會創立一個`watcher`實例，會在組件渲染過程中把`property`紀錄為依賴，當依賴改變時，觸發`setter`，則會通知`watcher`，從而讓關聯組件重新渲染

#### vue3

- 靜態標記優化
  - vue3 在 diff 演算法上，比 vue2 增加了靜態標記，這樣在看到響應式資料時，Vue3 會直接去尋找該被標注的標記點
- 靜態提升
  - Vue3 對於不參與更新的元素，會做靜態提升，只會創建一次，再渲染時直接復用
- SSR 優化
  - 當靜態內容大時，會用`createStaticVNode`方法在客戶端去生成一個 static node，這些靜態`node`，會被直接`innerHTML`，就不需要創建物件渲染

### 原始碼

- 使用 tree shaking，讓要被用到的方法再被打包就好
  - 僅僅在用到的時候做打包，沒用到的模塊都被搖掉，打包的整體體積變小

### 響應式系統

- Vue2採用`defineProperty`來劫持物件，然後進行深度遍歷所有屬性，給每個屬性添加`getter`&`setter`，實現響應式
- Vue3採用`proxy`重寫整個響應式，因為`proxy`可以對整個物件進行監聽，不需要深度遍歷
  - proxy：監聽動態屬性的增加、監聽物件的index & length屬性、刪除屬性

## vue3為何要使用proxy替代defineProperty
### defineProperty
* 直接在一個物件上定義一個新屬性或者修改一個物件既有的屬性，並返回物件
* 能實現響應式的原因：`get`&`set`
* 若物件存在多個key，需要進行遍歷去更新
* 如果有深層物件，需要在`defineReactive`中進行遞迴（造成效能耗損）
* 缺點：檢測不到物件屬性的添加刪除、陣列無法監測、需要遍歷監聽

### proxy
* 監聽整個物件，並返回一個新物件，我們可以操作新的物件達到響應式
* 可以監聽陣列的變化

## composition API vs options API
### 基本概念相比
#### options API
* 當組件變得複雜時，導致各屬性的列表也會變很長，導致整體組件難以維護以及閱讀
* 程式過於碎片化
#### composition API
* 一個功能所定義的所有API會放在一起，更加高內聚低耦合

### 邏輯復用
#### vue2
* 在vue2中，我們用`mixin`共用相同邏輯（所以要多起一個mixin.js）文件
* 使用多個mixin會造成命名衝突、數據來源不清晰的問題
#### vue3
* 直接引入復用

## TreeShaking
### 基本概念
* 一種通過清除多餘代碼的方式，來優化項目打包體積的技術
* 在vue2無論有無使用到功能，最終都會產出在代碼中
* 在vue3則是沒有使用，就不會打包
### 如何做
* 編譯階段利用`es6 module`判斷哪些模塊已經加載，判斷哪些模塊與變量未使用或飲用，進而使用對應代碼

### 作用
* 減少程式體積
* 減少程式執行時間
* 對架構更優化

## computed
```js
const now = computed(() => Date.now())
```

## class & style
```html
<div :class="{ active: isActive }"></div>
<div :class="[activeClass, errorClass]"></div>
<div :class="[isActive ? activeClass : '', errorClass]"></div>

<div :style="[baseStyles, overridingStyles]"></div>
<div :style="styleObject"></div>
```
```js
const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))

const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

## 列表渲染
### 基本
```html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>

<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>

<!-- 記得下方是從1開始 -->
<span v-for="n in 10">{{ n }}</span>
```

### v-for v-if 注意事項
```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```


## provide inject
* 盡量保持provide的響應式數據在供給方中
* 如果真的要讓子組件更改資料，建議傳遞function下去
### provide
```html
<script setup>
import { provide } from 'vue'

provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
</script>
```
```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
  }
}
```

### inject
```html
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```
```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

### 確保提供數據不給更改：readonly()
```html
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```


## reactive
* 用來創建一個響應式物件

## ref 
* 通過reactive包裝成一個物件
* 把值傳給value屬性。`ref(obj)` 理解為 `reactive({value: obj})`
* 基本類型使用ref
* 引用類型使用reactive

## toRef
* 把物件中的某個值轉換為響應式數據，接收兩個參數，第一個是obj、第二個是屬性名稱
```html
<script>
// 1. 導入 toRef
import {toRef} from 'vue'
export default {
    setup() {
        const obj = {count: 3}
        // 2. 將 obj 物件中属性count的值轉化為響應式數據
        const state = toRef(obj, 'count')

        // 3. 将toRef包装过的數據物件返回供template使用
        return {state}
    }
}
</script>

```

### toRef vs ref
* ref：對數據的拷貝。toRef：對數據的引用
* ref：改變會更新view。toRef：改變不會更新view


## toRefs
* 作用是將傳進的物件裡的所有屬性都變成響應式數據

## shallowReactive
* 淺層的reactive
* 只有第一層被Proxy代理，也就是說只有修改第一層的值時，才會做響應式更新

## shallowRef
* 一樣拿來做性能優化的
* 主要是監聽.value值變化來做更新view的
* 所以如果改深層的值，沒有偵測到，view是不會更新的。
* 如果要更新要使用`triggerRef(state)`

## toRaw
* 當我們想要修改原始數據，但不想讓view更新時，可以使用這個
* 對這個物件做所有操作時，都不會讓視圖產生變化
* 將一個由reactive生成的響應式數據，變成非響應式數據

## markRaw
* 可以將**原始數據標記為非響應式的**，即使後來使用ref or reactive都無法是響應式
* 當渲染具有不可變數據源的大列表時，**跳過響應式能提高效能**

## ref
* 一樣是可以取得元素，但是vue3寫法不同
* 步驟：
  1. 先給目標元素的ref屬性設置一個值，假設為el
  2. 然後在setup中調用ref函數，值為null，並賦值給變量el，該變量名稱必須與我們給元素設置的ref屬性名相同
  3. 把對元素的引用變量el，return 出去
```html
<template>
  <div>
    <div ref="el">div元素</div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
      // 創建一個DOM引用，名稱需要和ref屬性名相同
      const el = ref(null)

      // 在掛載後，才能通過el獲取目標元素
      onMounted(() => {
        el.value.innerHTML = '内容被修改'
      })

      // 把創建的引用 return 出去
      return {el}
  }
}
</script>

```

## Vue2 & Vue3 差異

### 響應系統：
Vue 3 使用 Proxy 取代 Vue 2 的 Object.defineProperty。這一變化使得 Vue 3 的響應性系統能夠處理嵌套屬性、陣列和動態屬性的變化，性能上也有了顯著提升。

### Composition API:
setup 函數讓邏輯更加聚合和可重用，避免了 Options API 中的邏輯分散問題，特別適合處理複雜邏輯和大型專案。也可以拆成Composables來做細粒化的邏輯複用。

### Tree-shaking：
Vue 3 進行了 Tree-shaking 的優化，允許**只打包實際使用到的部分**，減少最終 bundle 的大小，所以使用動態載入組件可以有效減少專案打包體積哦！component、mixin也隨之為了支援 Tree-shaking 改為模組化。

### 虛擬 DOM 和渲染性能
Vue 3 重新設計了虛擬 DOM，改用**靜態分析**（static tree hoisting），在Template 編譯時預計出哪些部分是靜態的，並**只對動態部分進行更新**，從而提升渲染性能。

### webpack
1. 核心邏輯是打包，預先**將所有的專案內容與資源做靜態分析然後包成數個檔案**。第一次啟動的時候會做完整Modules分析和打包，速度會慢上許多
2. 使用各種不同的loader和plugin處理非JS的資源，建構過程中轉換成可以使用的Module。

### Vite
1. 基於ES Module，開發環境內不會進行預先打包，是直接使用瀏覽器所知的**ES Module 導入**，熱更新也優化成這個方式，不須像webpack那般重新打包，所以開發時的啟動速度爆快！
2. Vite用的是esbuild做預先構建，這是由golang編寫的工具，大幅加快較大dependency的處理速度。

### Webpack vs Vite
1. Webpack 慢的原因是打包過程使用Dependency Graph Analysis，它會從**入口檔案開始遍歷所有的 import/require 語句**，每個引入的模組，繼續分析其相依來源，直到沒有新的相依來源為止。這個過程會建立一個完整模組依賴關係圖。各種loader的處理時間相對也長，未來可能用到的模組也會一並打包。而 Vite 在開發時不會將所有Module打包，而是**按需載入**，這大幅減少了初次啟動時間。

2. Webpack 和 Vite 如何進行打包細粒化
Webpack的Code Splitting可以**異步載入**或手動切塊(regex)，也有支援Tree-shaking。
Vite則有原生ES Module支援，**替可能用到的Modules產生Preload tag**，讓瀏覽器可以預先載入這些模組，但不執行它們。

### Watch 和 Computed 各自是同步還是異步？為什麼？
**watch是異步**，監聽對象的資料變化時會將一個callBack放入 event queue，確保資料更新以後再執行，避免多次觸發。  
**computed是同步**，原理是 getter 來實踐的，但屬於懶執行。依賴的對象資料發生變化時，只有在需要時才會重新計算它的值。

### Vite中如果我要進一步減少打包體積，具體應該要怎麼做：
1. 注意按需引入，Vite 有 **vite-plugin-style-import**。但也可以平常在使用UI框架時手動處理實際用到哪些組件。
2. 清理不必要的語言包，這些檔案很大，可以用vite-plugin-locale選擇性引入你需要的語言。
3. rollup有自帶的manualChunks hook，可以利用它來分割，並且在terserOptions設定compress來移除多餘的console和debugger:
4. **動態載入組件**:
盡量把一些需要特定事件才引入的組件用這種方式寫，可以有效減少打包體積，讓下載資源的速度快上一些，或者defineAsyncComponent做lazy
5. 使用 Bundle Visualizer 分析打包結果:
利用 vite-plugin-visualizer 等工具分析 bundle 結構，找出占用體積較大的模組，再進行針對性優化。
6. 外部化依賴（Externalize Dependencies）
* 將部分大庫（例如 lodash、moment 等）設定為外部依賴，利用 CDN 或其他方式提供，讓它們不納入打包檔案中。
* 可在 Vite 的 build.rollupOptions.external 中設定需要外部化的模組。
```html
<Component :is="name" />
```
```js
const componentsMap = {
　ComponentA: () => import('@/components/ComponentA.vue'),
};
```
5. 如果是Nuxt，將不太需要請求API的靜態頁面路由，改設定為SSG
```html
<script setup>
defineRouteRules({
  // 設定 prerender 為 true，讓 Nuxt 在生成階段預先渲染此頁面
  prerender: true
})
</script>

<template>
  <div>
    <h1>這是一個靜態生成的頁面</h1>
    <p>這個頁面會在生成階段預先渲染成 HTML。</p>
  </div>
</template>
```

### 有使用過Vue的Teleport嗎? 請你解釋運作原理和寫出一個具體例子
1. 運作的原理:
這是個可以指定掛載位置，用來動態插入DOM特定節點的組件。這個組件允許我們使用 to 的屬性指定一個CSS選擇器或者DOM元素來插入。但這個Teleport仍然屬於調用它的父組件底下響應，即便DOM遭到移動，生命週期也不會因此被改變。
2. 如果defineExpose的事件需要曝露出去，請避免在computed中調用「異步事件」，很容易造成抖動。

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Vue 3 Teleport 範例</title>
  <script src="https://unpkg.com/vue@3"></script>
  <style>
    /* 針對 teleport 目標的樣式 */
    #teleport-target {
      border: 2px solid red;
      padding: 10px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <!-- Vue app 主要掛載點 -->
  <div id="app">
    <h1>Vue Teleport 範例</h1>
    <p>這是在 app 中的內容</p>

    <!-- 使用 teleport 將內容渲染到 #teleport-target -->
    <teleport to="#teleport-target">
      <div style="background-color: lightblue; padding: 10px;">
        這個區塊是透過 Teleport 移動到 #teleport-target 區域的！
      </div>
    </teleport>
  </div>

  <!-- Teleport 目標，將會在此呈現 teleport 內容 -->
  <div id="teleport-target">
    <h2>Teleport 目標區</h2>
  </div>

  <script>
    // 建立並掛載 Vue 3 應用程式
    const app = Vue.createApp({});
    app.mount('#app');
  </script>
</body>
</html>
```