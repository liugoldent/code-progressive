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
  1. 需要明確指出監控的數據，開啟 deep 才可以深度監控屬性或元素的變化
- watchEffect：
  1. 自動收集使用到的響應式數據，因此代碼更簡潔
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
* 可以將原始數據標記為非響應式的，即使後來使用ref or reactive都無法是響應式
* 當渲染具有不可變數據源的大列表時，跳過響應式能提高效能

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
