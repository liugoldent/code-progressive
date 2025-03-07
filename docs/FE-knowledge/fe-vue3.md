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

## Composition API 與 Options API 的優勢
- 避免了 Options API 中的邏輯分散問題
### 更好的 TypeScript 支援

### 減少命名衝突與提升內聚性
#### vue2
* 在vue2中，我們用`mixin`共用相同邏輯（所以要多起一個mixin.js）文件
* 使用多個mixin會造成命名衝突、數據來源不清晰的問題
#### vue3
* 直接引入復用

### 可以拆成Composables來做細粒化的邏輯複用

### 代碼組織方式、邏輯聚合與複用
#### Composition API
* 一個功能所定義的所有API會放在一起，更加高內聚低耦合

#### options API
* 當組件變得複雜時，導致各屬性的列表也會變很長，導致整體組件難以維護以及閱讀
* 程式過於碎片化

## 響應式系統的實現
### Proxy 與深度監控的優勢、Vue 2 的限制（無法監測新屬性、陣列變化等）
- Vue2採用`defineProperty`來劫持物件，然後進行深度遍歷所有屬性，給每個屬性添加`getter`&`setter`，實現響應式
  * 創立一個`watcher`實例，會在組件渲染過程中把`property`紀錄為依賴，當依賴改變時，觸發`setter`，則會通知`watcher`，從而讓關聯組件重新渲染
  * 直接在一個物件上定義一個新屬性或者修改一個物件既有的屬性，並返回物件
  * 能實現響應式的原因：`get`&`set`
  * 若物件存在多個key，需要進行遍歷去更新
  * 如果有深層物件，需要在`defineReactive`中進行遞迴（造成效能耗損）
  * 缺點：檢測不到物件屬性的添加刪除、陣列無法監測、需要遍歷監聽

- Vue3採用`proxy`重寫整個響應式，因為`proxy`可以對整個物件進行監聽，不需要深度遍歷
  * proxy：監聽動態屬性的增加、監聽物件的index & length屬性、刪除屬性
  * 監聽整個物件，並返回一個新物件，我們可以操作新的物件達到響應式
  * 可以監聽陣列的變化

## 性能優化技術
### 靜態內容標記與重用（hoisting）
#### 靜態內容
當模板中的某些部分內容不會改變時，Vue 可以將它們視為靜態內容，生成一個靜態的 VNode。這個 VNode 在後續的重渲染中不需要進行 diff 或重新計算，從而節省性能開銷。

#### 靜態分析
虛擬 DOM，改用**靜態分析**（static tree hoisting），在Template 編譯時預計出哪些部分是靜態的，並**只對動態部分進行更新**，從而提升渲染性能。

#### 靜態提升
在編譯階段，Vue 會自動檢測出靜態內容，並使用類似 createStaticVNode 的方法生成靜態節點，這些節點只生成一次，之後直接復用 = 這些靜態`node`，會被直接`innerHTML`，就不需要創建物件渲染

### 虛擬 DOM diff 演算法的優化
在 diff 演算法上，比 vue2 增加了靜態標記，這樣在看到響應式資料時，Vue3 會直接去尋找該被標注的標記點

### SSR 優化策略（例如 createStaticVNode 的使用）
createStaticVNode 讓 Vue 能夠把不會改變的部分「凍結」下來，只需要生成一次，後續渲染時直接復用，從而達到提高渲染效能的目的

#### SSR 優化
在服務端渲染（SSR）時，如果一部分內容是靜態的，可以直接生成靜態的 HTML，減少客戶端的渲染工作。



## watch 與 watchEffect 的區別
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
- watch客制選擇
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
### watch 如何監聽多個數據
```js
import { ref, watch } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const name = ref('Vue 3');

    watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
      console.log('count 或 name 变化了');
    });

    return { count, name };
  }
};
```

### watchEffect 如何停止更新
```js
import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const count = ref(0);

    const stop = watchEffect(() => {
      console.log('count 的值是:', count.value);
    });

    stop(); // 停止监听
  }
};
```

## Teleport 的使用與原理
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
### Teleport 的 to 屬性用法（可傳 CSS 選擇器或 DOM 元素）
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Teleport 使用 CSS 選擇器</title>
  <script src="https://unpkg.com/vue@3"></script>
  <style>
    /* 設定 Teleport 目標的樣式 */
    #teleport-target {
      border: 2px solid blue;
      padding: 10px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <!-- Vue app 掛載點 -->
  <div id="app">
    <h1>使用 CSS 選擇器作為 Teleport 目標</h1>
    <!-- 將內容傳送到 id 為 "teleport-target" 的元素 -->
    <teleport to="#teleport-target">
      <div style="background-color: lightgreen; padding: 10px;">
        這段內容被 Teleport 到 #teleport-target！
      </div>
    </teleport>
  </div>

  <!-- Teleport 目標 -->
  <div id="teleport-target">
    <h2>Teleport 目標區域</h2>
  </div>

  <script>
    const app = Vue.createApp({});
    app.mount('#app');
  </script>
</body>
</html>
```
```html
<!-- TeleportExample.vue -->
<template>
  <div>
    <h1>使用 DOM 元素作為 Teleport 目標</h1>
    <!-- 將內容傳送到 targetElement 所指的 DOM 元素 -->
    <teleport :to="targetElement">
      <div style="background-color: lightcoral; padding: 10px;">
        這段內容被 Teleport 到目標 DOM 元素！
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
export default {
  setup() {
    const targetElement = ref(null);
    onMounted(() => {
      // 在組件掛載後，獲取目標 DOM 元素
      targetElement.value = document.getElementById('teleport-target');
    });
    return { targetElement };
  }
}
</script>

<style scoped>
/* 可以在此處定義樣式 */
</style>
```
*  移動後內容依然屬於父組件的生命週期與響應系統

## 組件間通信方式
### 父子組件間的數據傳遞
* （props、emit）
### 跨層級共享數據（provide/inject），以及響應式數據如何保證不被誤改
* provide('count', readonly(count));

## Tree Shaking 與程式碼分割
### 基本概念
* 一種通過清除多餘代碼的方式，來優化項目打包體積的技術
* 在vue2無論有無使用到功能，最終都會產出在代碼中
* 在vue3則是沒有使用，就不會打包
### 如何做（ES Module 靜態分析與未使用模組剔除）
* 編譯階段利用`es6 module`判斷哪些模塊已經加載，判斷哪些模塊與變量未使用或引用，進而使用對應代碼
* 使用 tree shaking，讓要被用到的方法再被打包就好。僅僅在用到的時候做打包，沒用到的模塊都被搖掉，打包的整體體積變小
### 動態載入組件與 lazy loading 的實踐

### 作用
* 減少程式體積
* 減少程式執行時間
* 對架構更優化

## TypeScript 與 Vue 3 的整合
### `<script setup lang="ts">` 的使用
### 利用類型定義提升開發體驗與降低錯誤率

## webpack vs vite
### webpack
1. 核心邏輯是打包，預先**將所有的專案內容與資源做靜態分析然後包成數個檔案**。第一次啟動的時候會做完整Modules分析和打包，速度會慢上許多
2. 使用各種不同的loader和plugin處理非JS的資源，建構過程中轉換成可以使用的Module。

### Vite
1. 原生 ES Modules
Vite 在開發模式下直接利用瀏覽器原生支援的 **ES Modules**。這意味著它不需要像 Webpack 那樣將所有資源預先打包，因為瀏覽器可以按需請求模組，只在需要時進行編譯和載入。

2. 依賴預編譯 (Pre-Bundling)
Vite 使用 esbuild 來預編譯第三方依賴。esbuild 是使用 Go 語言編寫，性能極高，遠比 Webpack 使用的 Babel 或其他 JS 編譯器更快。

3. 按需編譯
在開發階段，Vite 僅對實際訪問的檔案進行轉譯，而不是一次性打包整個應用。這種「懶編譯」的策略大幅降低了啟動和更新的時間。

4. 快速的模組熱重載 (HMR)
利用 ES Modules 的特性，Vite 的 HMR 能夠快速更新變更的模組，而不必重新編譯整個應用，使得開發時的反饋速度更快。

5. 簡化的構建流程
雖然在生產環境中 Vite 還是使用 Rollup 來進行打包，但其在開發環境中的優化讓整體開發體驗更為流暢。

### 原因
1. Webpack 慢的原因是打包過程使用Dependency Graph Analysis，它會從**入口檔案開始遍歷所有的 import/require 語句**，每個引入的模組，繼續分析其相依來源，直到沒有新的相依來源為止。這個過程會建立一個完整模組依賴關係圖。各種loader的處理時間相對也長，未來可能用到的模組也會一並打包。而 Vite 在開發時不會將所有Module打包，而是**按需載入**，這大幅減少了初次啟動時間。

2. Webpack 和 Vite 如何進行打包細粒化
Webpack的Code Splitting可以**異步載入**或手動切塊(regex)，也有支援Tree-shaking。
Vite則有原生ES Module支援，**替可能用到的Modules產生Preload tag**，讓瀏覽器可以預先載入這些模組，但不執行它們。

### Vite中如果我要進一步減少打包體積，具體應該要怎麼做：
1. 注意按需引入，Vite 有 **vite-plugin-style-import**。但也可以平常在使用UI框架時手動處理實際用到哪些組件。
2. 清理不必要的語言包，這些檔案很大，可以用`vite-plugin-locale`選擇性引入你需要的語言。
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

## computed & watch
### Watch 和 Computed 各自是同步還是異步？為什麼？
**watch是異步**，監聽對象的資料變化時會將一個callBack放入 event queue，確保資料更新以後再執行，避免多次觸發。  
**computed是同步**，原理是 getter 來實踐的，但屬於懶執行。依賴的對象資料發生變化時，只有在需要時才會重新計算它的值。

### 順序
假設響應式數據發生變化，預設（flush: 'post'）下的更新流程大致如下：

1. **數據改變**
    - 改變的響應式數據使得依賴它的 computed 屬性被標記為「dirty」。
2. **組件重新渲染**
    - 進入渲染階段時，如果模板中有存取 computed 屬性，那麼它會被同步重新計算，從而得到最新值。
    - 此時，渲染過程會讀取並使用更新後的 computed 屬性。
3. **DOM 更新完成後**
    - 當渲染（包括更新 DOM）完成後，Vue 會在下一個「tick」中執行 watch 監聽器的回調函數，從而處理需要的副作用。

因此，**在預設情況下**：

- **computed 屬性會在渲染過程中被計算（或重新計算）**，
- **而 watch 的回調則是在渲染完成、DOM 更新後才執行**。

總結：當Computed數值發生變化後→組件重新渲染→渲染完成之後畫面使用最新computed值→最後當DOM更新完之後，Vue會在下一個tick執行watch的function。

## SSR/SSG 與 Nuxt 3 的應用
### Nuxt 3 中的 `defineRouteRules` 或 `prerender` 配置
- SSG：在build 時就生成所有頁面和數據
- SSR：每次請求時動態地從API 獲取數據並注入到HTML 中

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
### 狀態隔離、插件註冊以及與全局狀態管理（如 Pinia）的整合

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
#### 在一起使用的問題
* 性能問題：
由於 Vue 會先執行 v-for，然後對每一個迭代的項目再執行 v-if 判斷，如果資料量很大，這將導致不必要的計算，影響效能。

* 可讀性降低：
將過濾邏輯直接寫在模板中，不如在 computed 屬性中先過濾好資料，這樣模板更乾淨，邏輯也更容易理解和維護。

* 意外的邏輯錯誤：
有時候使用 v-if 的條件可能不容易和 v-for 迭代的邏輯匹配，容易導致預期外的結果。最佳實踐是先在 data 或 computed 中處理好資料，再用 v-for 渲染已經過濾的清單。

* demo：
```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```


## v-if v-show :is
### v-if
#### 優點：
* 動態創建與銷毀： 當條件為 false 時，對應的 DOM 元素完全不會存在，只有當條件為 true 時才創建，節省初始渲染成本。
* 適合初次不需要顯示的情況： 若某些元素只在特定情況下才需要出現，使用 v-if 可以避免不必要的渲染。
* false時： DOM 中移除。完全不會渲染！！
#### 缺點：
* 重複建立銷毀： 當條件頻繁變化時，每次都需要銷毀或創建 DOM 元素，可能會帶來額外的性能開銷。

### v-show
#### 優點：
* 顯示切換迅速： 元素始終渲染在 DOM 中，只是透過 CSS 的 display 屬性控制顯示或隱藏，因此切換顯示狀態非常快。
* 適合頻繁切換的場景： 如果某個元素需要頻繁顯示與隱藏（例如選單、彈窗等），v-show 能減少重複創建和銷毀的成本。
* 為 `display: none`：完全隱藏元素且不佔據空間
#### 缺點：
* 初次渲染成本： 元素無論條件是否滿足，都會先渲染在 DOM 中，對於複雜或較多的元素，初次渲染可能會增加資源消耗。
* 佔用 DOM： 雖然隱藏，但元素仍存在於 DOM 中，對於佈局或內存使用可能有影響。

### :is (動態組件)
#### 優點：
* 靈活的組件切換： 利用 `<component :is="componentName">` 可以根據動態數據決定渲染哪個組件，適合根據狀態展示不同的視圖。
* 組件化管理： 適合拆分功能模塊，根據條件或狀態來動態選擇不同組件，保持代碼結構清晰。
#### 缺點：
* 重新渲染風險： 當切換的組件**彼此之間差異較大或頻繁切換時**，可能會導致組件的卸載與重新創建，從而帶來一定的性能損耗。
* 依賴於組件預加載： 需要**確保所有可能動態切換的組件均已正確載入**，否則可能產生錯誤或延遲。

### 總結
* v-if 適合用於條件不頻繁變化、初次不需要渲染的情況，能夠節省 DOM 渲染資源，但頻繁切換時可能有性能損耗。
* v-show 適合用於需要頻繁切換顯示狀態的場景，雖然初次渲染較重，但切換時性能較高。
* :is (動態組件) 適合用於根據狀態動態切換不同組件的情境，提供高度靈活的組件管理，但需注意頻繁重渲染帶來的性能問題。

## provide inject 寫法
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

## toRefs
* 作用是將傳進的物件裡的所有屬性都變成響應式數據

## shallowReactive & shallowRef
### shallowRef
#### 功能：
* `shallowRef` 創建一個 ref，但只對其「引用本身」的改變進行響應式監控。如果 ref 中存儲的是一個對象，只有當整個對象被替換時（例如重新賦值一個新對象），Vue 才會觸發更新；對象內部的屬性改變則不會被追蹤。
#### **使用場景**：
* 當你不希望對內部複雜對象的所有屬性進行深度響應式處理時，例如：
  - 引用第三方庫生成的對象
  - DOM 元素或非純粹數據結構的數據
  - 性能考量：避免不必要的深度響應式處理導致性能消耗
* 性能優化的
* 主要是監聽.value值變化來做更新view的
* 所以如果改深層的值，沒有偵測到，view是不會更新的。
* 如果要更新要使用`triggerRef(state)`

```js
import { shallowRef } from 'vue';

const obj = { a: 1, b: { c: 2 } };
const myShallowRef = shallowRef(obj);

// 這裡修改 obj 的內部屬性 b.c 不會觸發響應式更新
obj.b.c = 3;

// 只有當整個對象被替換時，才會觸發更新
myShallowRef.value = { a: 10, b: { c: 20 } };
```

### shallowReactive
#### 功能：
* `shallowReactive` 創建一個對象，只有對該對象的最外層屬性進行響應式轉換。也就是說，當你改變對象頂層屬性（如添加、刪除或替換一個屬性）時，會觸發響應式更新，但如果某個屬性本身是一個對象，其內部的屬性變化則不會被監控。
    
#### 使用場景：
* 當你只需要對對象的頂層數據進行響應式處理，而內部嵌套的數據可以保持非響應式，常見於：
  - 數據結構較複雜但只需要監控最外層的變化
  - 對性能有較高要求，避免深層嵌套數據的監控
  - 外部數據或第三方數據結構，只希望 Vue 監控頂層改變
```js
import { shallowReactive } from 'vue';

const state = shallowReactive({
  count: 0,
  nested: { value: 100 }
});

// 修改頂層屬性 count 會觸發更新
state.count = 1;

// 修改 nested 內部屬性不會觸發更新
state.nested.value = 200;
```

## Readonly
### 狀態暴露：
* 當你希望組件或模組內部的狀態對外是只讀的，確保只有內部邏輯能夠修改數據，而外部只能讀取數據時，可以使用 `readonly`。例如在組件中將狀態傳遞給子組件，但不希望子組件直接修改父組件的狀態。
    
### 防止意外修改：
* 當你希望防止某些數據在程序中被誤改動，使用 `readonly` 可以提供一層保護機制。

```js
import { reactive, readonly } from 'vue';

// 創建一個響應式對象
const state = reactive({
  count: 0,
  user: {
    name: 'Alice'
  }
});

// 使用 readonly 創建只讀代理
const readonlyState = readonly(state);

// 可以讀取值
console.log(readonlyState.count); // 輸出: 0

// 嘗試修改只讀狀態（在開發模式下會發出警告，且不會生效）
readonlyState.count = 10; // 此操作不會改變 count 的值

// 內部嵌套的數據同樣是只讀的
readonlyState.user.name = 'Bob'; // 同樣不會生效
```

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

## Suspense
* 用於處理異步組件的狀態
```html
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>
```



## 參考文章
- [文章](https://github.com/febobo/web-interview/issues/46)
