---
slug: "/FE-knowledge/fe-vue-p2"
title: "前端 Vue - p2"
description: "整理 Vue 的 MVVM、生命週期、雙向綁定、響應式、指令、條件渲染、元件通信與 mixin 等常見面試觀念。"
tags:
  - Frontend
  - Vue
  - JavaScript
keywords: ["Vue", "MVVM", "lifecycle", "reactivity", "directive", "v-if", "v-show", "mixin", "Vuex"]
---

# [FE] Vue - p2

這篇延續 Vue 基礎篇，往執行流程與元件行為走。主題看起來很多，但其實都圍繞一個核心問題：

Vue 到底怎麼把資料變成畫面，並在資料變動時讓畫面更新。

## MVVM 在 Vue 裡代表什麼

Vue 常被歸類在 MVVM 架構下，可以先用最簡單的方式理解：

- `Model`：資料與業務狀態
- `View`：畫面
- `ViewModel`：負責把資料和畫面串起來的那一層

在 Vue 中，元件實例本身就扮演了很大一部分的 ViewModel 角色。它會：

- 追蹤資料
- 把資料映射到模板
- 在資料更新時觸發畫面更新

重點不是硬背縮寫，而是理解 Vue 的價值在於「不用手動同步 DOM 與 state」。

## Vue 生命週期要怎麼理解

生命週期不是一張表而已，它是在描述一個元件從建立到銷毀的過程中，哪些時機點可以插入邏輯。

### Vue 2 常見生命週期

- `beforeCreate`
- `created`
- `beforeMount`
- `mounted`
- `beforeUpdate`
- `updated`
- `beforeDestroy`
- `destroyed`

### Vue 3 對應 hook

- `setup`
- `onBeforeMount`
- `onMounted`
- `onBeforeUpdate`
- `onUpdated`
- `onBeforeUnmount`
- `onUnmounted`

### 怎麼記比較合理

可以分成四段：

1. 建立：資料與實例準備好
2. 掛載：模板變成真實 DOM
3. 更新：資料變動後重新渲染
4. 銷毀：清除監聽器、timer、外部資源

### 資料請求放 `created` 還是 `mounted`

Vue 2 常被問這題，本質上是在問你需不需要依賴 DOM。

- 不依賴 DOM：通常 `created` 就能做
- 需要操作 DOM：放 `mounted`

如果只是打 API，大多數情況不需要等 DOM 掛完。

## 雙向綁定與響應式

### 雙向綁定是什麼

雙向綁定可以簡單理解成：

- 資料改，畫面跟著改
- 使用者改輸入，資料也跟著改

Vue 裡最常見的表現就是 `v-model`。

### Vue 2 為什麼能做到響應式

Vue 2 主要透過 `Object.defineProperty()` 攔截資料的讀寫。

```js
const obj = {};

Object.defineProperty(obj, "value", {
  get() {
    return "hello";
  },
  set(newValue) {
    console.log("changed:", newValue);
  },
});
```

Vue 會把資料轉成 getter / setter，當資料被讀取時收集依賴，被寫入時通知相關的 watcher 更新畫面。

### Vue 2 的限制在哪裡

這套機制不是不能用，但有限制：

- 新增物件屬性不容易被偵測
- 刪除屬性也不容易追蹤
- 陣列索引、長度變化處理麻煩

這也是 Vue 3 為什麼改用 `Proxy` 的原因。

### 為什麼新增屬性時畫面不更新

在 Vue 2 裡，如果某個屬性一開始不在響應式系統內，後來直接加上去，Vue 不一定知道它要追蹤。

常見處理方式：

- `Vue.set(obj, "key", value)`
- 建立新物件後整體替換

## Vue 實例掛載時發生什麼事

如果面試官問「Vue 掛載過程做了什麼」，可以從這個順序回答：

1. 建立元件實例
2. 初始化 props、methods、data、computed、watch
3. 編譯模板或讀取 render function
4. 產生虛擬 DOM
5. 掛載到真實 DOM
6. 建立後續更新所需的依賴追蹤

重點不是把每一步背成流程圖，而是知道 Vue 做了：

- 初始化
- 編譯
- 渲染
- 追蹤更新

## 元件之間怎麼傳值

Vue 常見的溝通方式可以依關係分類：

### 父子元件

- `props` 往下傳
- `emit` 往上送
- `ref` 直接取子元件方法或 DOM

### 跨層級

- `provide / inject`

### 全域狀態

- Vuex 或 Pinia

### 過去常見但現在不太推薦

- event bus
- `$parent`
- `$root`

這些方式不是完全不能用，但可維護性通常比較差。

## Vuex 在做什麼

如果只用一句話說，Vuex 是把全域狀態管理集中起來。

### 核心角色

- `state`：原始資料
- `getters`：衍生狀態
- `mutations`：同步修改 state
- `actions`：處理非同步邏輯，再 commit mutation

這種架構的優勢是資料流清楚，但缺點是樣板較重。也因此在 Vue 3 時代，很多專案更偏向使用 Pinia。

## 自定義指令

自定義指令適合處理「直接跟 DOM 行為有關」的邏輯，而不是一般商業邏輯。

例如：

- 自動聚焦
- click outside
- lazy load
- debounce / throttle 行為封裝

### Vue 2 全域註冊

```js
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  },
});
```

### Vue 3 寫法

```js
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
```

### 什麼情況適合用指令

當你的邏輯主要在「操作 DOM 本身」，指令通常比寫成 component 或 util 更合理。

## `v-if` 與 `v-show`

這題很常被問，但不要只回答 `display: none`。

### `v-if`

- 條件不成立時，DOM 不存在
- 切換成本較高
- 適合不常切換的內容

### `v-show`

- DOM 一直都在
- 只是切換 CSS `display`
- 適合頻繁切換

### 怎麼選

- 初始可能根本不需要渲染：`v-if`
- 只是要常常切換顯示：`v-show`

這本質上是渲染成本的選擇，不是語法題。

## CSS 只作用在當前元件怎麼做

最常見就是：

```vue
<style scoped>
.title {
  color: red;
}
</style>
```

`scoped` 的本質不是 CSS 天然隔離，而是 Vue 在編譯時幫你加上屬性選擇器，讓樣式只命中特定元件。

這很方便，但也不是完全無副作用：

- 深層子元件樣式覆蓋會比較麻煩
- 有時需要搭配 `:deep()`

## 動態路由怎麼理解

像這樣：

```js
{
  path: "/user/:id",
  component: UserPage
}
```

代表 URL 中這段是動態參數，可以在元件內透過 route params 取得：

```js
const route = useRoute();
console.log(route.params.id);
```

這類路由常用在：

- 詳情頁
- 編輯頁
- 多層資源頁面

## mixin 為什麼後來常被 composable 取代

### mixin 的問題

mixin 在 Vue 2 很常見，但問題也很典型：

- 命名衝突
- 資料來源不清楚
- 依賴關係隱晦

而且當 mixin 多了之後，元件會變得很難追蹤到底哪些能力從哪裡進來。

### Vue 3 為什麼偏向 composable

Vue 3 更推薦用 composable，因為它是顯式引入：

```js
import { computed, ref } from "vue";

export function useCounter() {
  const count = ref(0);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value += 1;
  }

  return {
    count,
    double,
    increment,
  };
}
```

這樣的好處是：

- 來源清楚
- 不會隱式覆蓋
- 更容易做型別推導與測試

## 實務上怎麼回答這篇常見題

如果你被問到生命週期、MVVM、雙向綁定、`v-if` / `v-show`、mixin，可以這樣回答：

1. Vue 的核心是透過響應式系統把資料和畫面同步。
2. 生命週期讓你可以在建立、掛載、更新、銷毀等時機插入邏輯。
3. Vue 2 的雙向綁定建立在 `defineProperty` 上，因此對新屬性和陣列變化有限制。
4. 元件溝通應優先走 `props / emit`，更複雜才上 `provide/inject` 或全域狀態。
5. mixin 是舊時代的共用邏輯方案，Vue 3 更推薦 composable。

## 總結

這篇真正要掌握的不是零散 API，而是 Vue 的執行模型：

- 如何建立元件
- 如何追蹤資料變化
- 如何更新畫面
- 如何組織元件之間的溝通方式

理解這條主線之後，你再看 Vue 3 的 Composition API、Pinia、Nuxt 3，會順很多。
