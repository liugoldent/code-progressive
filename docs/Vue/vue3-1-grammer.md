---
description: Vue3 語法介紹
tags:
  - Vue
---

# [Vue3] Vue3 語法介紹
[Vue 3 響應式基礎](https://ithelp.ithome.com.tw/articles/10298545)
## reactive 
### 基本原理
* 使用`Proxy`實作
* 透過`Proxy`代理操作物件，可以攔截針對物件的所有操作，不只讀取或寫入物件屬性，還包含迭代物件、使用`in`運算子、透過`new`建立物件實體
```js
const proxy = new Proxy(target, handler)
// 其中handler，為每次透過代理操作物件時，會去觸發的方法
// 將target傳進去，會建立一個代理target的Proxy物件
```
* 透過Proxy物件寫入底下的任何屬性，包含新增屬性，也會觸發set handler
* 透過Proxy物件讀取底下的任何屬性，都會觸發get handler
* 直接對原物件操作不會觸發handler
* 所以Proxy攔截原物件的操作，從而做到響應式
* `reactive()`傳入相同的物件or已經存在的Proxy，會回傳相同的Proxy
```js
// 響應原理
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key) //簡單來說，是用來紀錄相依邏輯和資料
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key) //簡單來說，是用來執行相依邏輯和更新資料
    }
  })
}
```

### 操作特殊性
* 參數只接收`Object`、`Array`、`Map`、`Set`，建議其`reference`一致
* 預設為deeply reactive，若為巢狀物件，所有巢狀資料都會有響應性
* 將`ref`資料傳進去`reactive`，會自動取出`value`值

### 喪失響應性
* 對`Proxy`物件重新賦值，因為新物件不再是`Proxy`，所以會失去響應性
```js
// 解決辦法
const objReactive = reactive({ name: "obj" });
console.log(`原本的`, objReactive);
Object.assign(objReactive, { name: "new-obj" });
console.log(`透過 Object.assign 修改的`, objReactive);
```
* 屬性值脫離Proxy，失去響應性
```js
const {name: name1} = objReactive // 脫離原本的reactive
```

## ref

### 基本原理
* 使用`get`、`set`關鍵字來實作
* 可用於基本型別與物件型別上
* ref是把基本型別放到物件的`value`之上，來達到響應式
* 會將傳入的資料放在 RefImpl 物件的 value 屬性下，並回傳 RefImpl 物件
* 對物件的 value 屬性定義 getter 跟 setter，去攔截對 value 的讀取跟寫入。
* 透過 ref() 創造回傳的 reference，來維持響應性，而不是資料(value)本身，所以基本型別才能透過 ref() 來達成響應
* 先經過reactive的proxy之後，把Proxy物件放到value屬性之下
```js
// 響應原理
function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value') //簡單來說，是用來紀錄相依邏輯和資料
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value') //簡單來說，是用來執行相依邏輯和更新資料
    }
  }
  return refObject
}
```

### 基本操作
* 參數可以傳入任何型別
* 會回傳具有響應式、可變動的ref物件（RefImpl），參數裝在value屬性下
* 即使傳入的資料為物件，依然可以對RefImpl.value做重新賦值。因為每次要對.value重新賦值時，都會觸發RefImpl的setter處理響應性。
* 模板上可直接使用資料

### 喪失響應性
```js
// 解構後，喪失響應性
const numberRef = ref(11);
const { value } = numberRef;
numberRef.value = 101;

//value 變數沒有響應性
console.log(value); //印出 11
```

## nextTick
* 基本知識：響應式資料更新之後，Vue會先同步更新相依數據，再非同步去更新DOM
* 所以更新渲染DOM這件事是非同步的，我們就不知道DOM什麼時候會更新完成，但如果我們在更新之後，想要拿寬、高來做事，就要使用到`nextTick`（使用場景：DOM更新之後，想要立刻得到更新後的DOM結構）
* tick：事件循環。每次修改資料之後，Vue會做
  * 同步：修改資料
  * 非同步：修改DOM，等這個Tick跑完，再執行nextTick
  * 非同步：執行nextTick callback


## CSS style scoped
### 不加scoped
* 未加上scoped的樣式，會影響到全域，包含祖先&後代

### 加上scoped
* 加上scoped之後，只會影響到同個元件or頁面的HTML元素

### `:deep()`
* 如果想要從父元件影響到子元件的樣式，但又不希望將樣式影響到全域，可以使用`:deep()`，來突破scoped限制
* 但要注意，是所有後代元件都會被影響到
```html
<style scoped>
:deep(h1){
  color: dark;
}
</style>
```

### `:slotted()`
* Vue預設傳入元件的`<slot/>`樣式，不會被當層元件的scoped影響，因為`<slot />`屬於他的父元件，所以如果想在當前元件做樣式管理，可以使用`:slotted()`
* 也就是slot內容會被父元件影響
* 要從子元件影響slot內容，要用`:slotted()`
```html
<style scoped>
:slotted(h1) {
  color: darksalmon;
}
</style>
```

### `:global`
* 提供`:global ()`選擇器，可以在`<style scope>`內使用，指定樣式轉換為全域樣式
```html
<style scoped>
:global(h1) {
  color: darksalmon;
}
</style>
```

## sass/scss
[Day 15: 在 Vue 專案使用 Sass/SCSS +共用變數 (feat. Vite)](https://ithelp.ithome.com.tw/articles/10301528)
### 內建支持的語言
* `.scss`、`.sass`、`.less`、`.styl`、`.stylus`等檔案
* 使用
```html
<style lang="scss">
$primary-color: #333;
body {
    color: $primary-color;
    }
</style>
```

### 區域引入
* 可以透過`@use`&`@import`，將整份`.scss`檔案引入到元件
```html
<style lang="scss" scoped>
@use "@/assets/scss/_font.scss";
@import "@/assets/scss/_colors.scss";

body {
    color: $primary-color;
    font-size: font.$super-big;
    }
</style>
```

### 全域引入
* 引入點1：`App.vue`
* 引入點2：`main.js`
* 全域共享這份 `.scss` 檔所轉換出來的 CSS 樣式

### 引用方式採坑
* 需`@use`在前，`@import`在後
#### `@use`
* 會做`name-spacing`，每次取用變數都要`fileName.variableName`，避免變數衝突的問題
* 引入需寫在檔案最前面，須優先於`@import`

#### `@import`
* 沒有`name-spacing`，兩個檔案如果定義相同名稱的變數，會後者覆蓋前者
* 引入需在檔案前面，但不得先於`@use`

## name-slot
### 組件
#### 父組件
```html
<template>
  <div>
    <h1>父组件</h1>
    
    <!-- 使用具名插槽，将内容插入到 'customSlot' 中 -->
    <ChildComponent>
      <template v-slot:customSlot="slotProps">
        <p>{{ slotProps.data }}</p>
      </template>
    </ChildComponent>
  </div>
</template>
```
#### 子組件
```html
<template>
  <div>
    <!-- 使用具名插槽，命名为 'customSlot' -->
    <slot name="customSlot" :data="slotData"></slot>
  </div>
</template>
```

## 為何多選綁定陣列不能用 reactive()?
* 主要是因為在Vue的底層，更新陣列，是再重新給一個值，而reactive，在重新給值的這個部分，就會造成綁定失效
