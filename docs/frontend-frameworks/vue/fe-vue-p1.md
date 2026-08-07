---
slug: "/FE-knowledge/fe-vue-p1"
title: "前端 Vue - p1"
description: "整理 Vue 專案初始化、插件機制、模板語法、v-model、computed 與全域方法設計等基礎觀念。"
tags:
  - Frontend
  - Vue
keywords: ["Vue", "Vue.use", "plugin", "template syntax", "v-model", "computed", "global method", "project structure"]
---

# [FE] Vue - p1

這篇聚焦在 Vue 比較偏基礎但很常被問的主題：專案怎麼起、插件怎麼裝、模板語法怎麼運作、`v-model` 背後做了什麼，以及一些常見的 API 設計問題。

如果把 Vue 當成一個完整框架來看，這些觀念其實都在回答同一件事：Vue 如何把一個前端專案組起來，並讓你用一致的方式管理畫面、資料與擴充能力。

## 從 0 到 1 架一個 Vue 專案時，先想哪些事

在開始選工具之前，先確認專案本身是哪一型：

- 官網 / 內容型網站：通常比較重 SEO、首屏速度，可能會考慮 Nuxt
- 後台系統：通常重路由、權限、表單、資料列表
- 跨平台或桌面應用：會牽涉 Electron、uni-app 等不同工具鏈

先決定專案型態，後面的技術選擇才不會亂。

### 一般前端專案的基本配置

一個 Vue 專案至少會碰到這幾類配置：

- 程式碼風格：ESLint、Prettier
- 樣式處理：Sass / Less / PostCSS
- 路由：Vue Router
- 狀態管理：Vuex 或 Pinia
- API：axios 或 fetch
- 環境變數與 build config
- Git hooks / CI / CD

### 常見目錄結構

這裡沒有唯一正解，但原則是依責任切分，而不是依檔案型別亂堆。

```txt
src/
  assets/
  components/
  composables/
  layouts/
  pages/
  router/
  stores/
  styles/
  utils/
  App.vue
  main.ts
```

可以這樣理解：

- `components`：可重用 UI 元件
- `pages` / `views`：頁面級元件
- `router`：路由定義
- `stores`：全域狀態
- `composables`：可重用邏輯
- `utils`：純工具函式
- `assets`：需要被打包處理的資源

## `Vue.use()` 在做什麼

### 它的作用

在 Vue 2 裡，`Vue.use()` 是安裝插件的標準入口。常見的像 `VueRouter`、`Vuex` 都是靠它掛進 Vue 生態。

```js
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
```

你可以把它理解成：

- 把某個功能模組正式註冊到 Vue
- 讓插件有機會注入全域 API、元件、指令或實例屬性

### 它的原理

Vue 2 的 `Vue.use()` 會做幾件事：

1. 檢查插件是否已安裝過，避免重複註冊
2. 如果插件本身是函式，就直接呼叫
3. 如果插件有 `install()` 方法，就執行它
4. 把 `Vue` 本身傳進去，讓插件能擴充 Vue

所以插件通常會長這樣：

```js
const MyPlugin = {
  install(Vue) {
    Vue.prototype.$hello = () => console.log("hello");
  },
};
```

### Vue 3 的觀念差異

到了 Vue 3，比較常看到的是：

```js
const app = createApp(App);
app.use(router);
app.use(pinia);
```

差別在於安裝目標不再是全域的 `Vue`，而是某個 app instance。這讓不同應用之間的隔離更清楚。

## Vue 模板語法在做什麼

Vue 的模板看起來像 HTML，但本質上不是字串模板而已，它最後會被編譯成 render function。

例如：

```vue
<template>
  <div>{{ message }}</div>
</template>
```

會在編譯後轉成可以建立 VNode 的程式碼。也就是說，模板的重點不只是「插值」，而是：

- 宣告式描述畫面
- 讓 Vue 可以分析哪些部分是靜態、哪些是動態
- 進一步做 diff 與編譯期優化

### `{{ }}` 是什麼

你可以把它視為一種插值語法，概念上接近 Mustache，但 Vue 模板本身不是單純在跑一個 Mustache 模板引擎，而是有自己的編譯流程。

## `v-model` 的本質

`v-model` 常被講成雙向綁定，但如果拆開看，它其實只是語法糖。

### 在表單元素上的展開方式

```html
<input v-model="msg" />
```

本質上接近：

```html
<input :value="msg" @input="msg = $event.target.value" />
```

所以它其實是兩件事組合：

- `:value` 綁值
- `@input` 或對應事件回寫資料

### 在元件上的 `v-model`

Vue 3 中，元件上的 `v-model` 預設對應：

- `modelValue`
- `update:modelValue`

```vue
<CustomInput v-model="keyword" />
```

子元件通常會這樣寫：

```vue
<script setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>
```

這樣你會比較清楚：`v-model` 不是魔法，它只是 Vue 幫你約定好一組 props + emit。

## computed 與 data 可以同名嗎

技術上不應該這樣做，因為它們最後都會被代理到元件實例上，名稱衝突會造成覆蓋或警告。

```js
export default {
  data() {
    return {
      total: 1,
    };
  },
  computed: {
    total() {
      return 999;
    },
  },
};
```

這種寫法會讓程式碼可讀性變差，而且 Vue 也會警告你有重複定義。

### 實務上的原則

- `data` 放原始狀態
- `computed` 放衍生結果
- 名稱應該反映角色差異

例如：

- `price`
- `quantity`
- `totalPrice`

這比把 `total` 同時拿來當 state 與 computed 好得多。

## Vue 要怎麼定義全域方法

這題真正想問的是：你想把共用能力掛在哪裡，以及這樣做是否容易維護。

### Vue 2：掛在 prototype

```js
Vue.prototype.$formatPrice = function formatPrice(value) {
  return `$${value}`;
};
```

優點是任何元件都能直接用 `this.$formatPrice()`。

缺點也很明顯：

- 來源不夠透明
- 型別提示差
- 全域污染風險高

### Vue 3：掛在 `app.config.globalProperties`

```js
const app = createApp(App);
app.config.globalProperties.$formatPrice = (value) => `$${value}`;
```

這比 Vue 2 的 prototype 稍微清楚一點，但本質上仍然是全域注入。

### 比較推薦的做法

如果只是單純工具函式，通常更推薦：

- 直接 `import`
- 做成 composable
- 或在特定 plugin 內統一注入

原因很簡單：顯式依賴比隱式全域能力更好維護。

## 全域 mixin 適合嗎

技術上可以，但通常不建議把它當成主要方案。

```js
Vue.mixin({
  methods: {
    greet() {
      console.log("hello");
    },
  },
});
```

問題是：

- 來源不明
- 容易與元件自己的名稱衝突
- 會影響每一個元件

所以如果你只是想共用邏輯，優先考慮 composable；如果你是想做框架級擴充，再考慮 plugin。

## 實務上怎麼回答這篇常見題

如果面試官連續問 `Vue.use`、`v-model`、模板語法、全域方法，你可以用同一條主線回答：

1. Vue 有自己的模板編譯系統，讓你用宣告式方式描述 UI。
2. `v-model` 只是語法糖，本質上是資料綁定加事件回寫。
3. 插件機制讓 Vue 可以被擴充，但要注意全域污染與可維護性。
4. 專案初始化時，真正重要的不是工具越多越好，而是結構與責任切分清楚。

## 總結

這篇的核心可以濃縮成一句話：

Vue 不只是拿來寫畫面，它同時提供了模板、插件、資料綁定與專案組織的一整套慣例。

你把這些基本觀念串起來之後，後面再看 Vue Router、Pinia、Composition API、Nuxt 3 才會更有脈絡。
