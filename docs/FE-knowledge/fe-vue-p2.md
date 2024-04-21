---
description: vue 面試常見問題
tags:
  - javascript
  - Test
  - Vue
---

# [FE] Vue - p2

## MVVM

- model：代表業務邏輯
- View：代表 View，負責將數據轉換成 UI 展現出來
- ViewModel：監聽 Model 數據改變 & 控制 View 行為的地方。簡單來說就是同步 View & Model 的物件。
- 注意 View & Model 之間沒有直接關係，是透過 ViewModel 來聯繫

## 生命週期

### 列表（總共分為 8 階段）創建 -> 載入 -> 更新 -> 銷毀

- beforeCreate：vue 實體被建立，狀態與事件都未初始化
  - vue3：setup()
- created：vue 實體被建立，狀態與事件都已初始化
  - vue3：setup()
- beforeMount：vue 實體尚未與 DOM 綁定
  - vue3：onBeforeMount()
- mounted：綁定完成（DOM 已创建）
  - vue3：onMounted()
  - DOM 渲染也在此階段完成
- beforeUpdate：狀態改變，畫面尚未更新前
  - vue3：onBeforeUpdate
- updated：狀態改變，畫面也改變完成
  - vue3：onUpdated
- beforeDestroy：vue 實體被銷毀前
  - vue3：onBeforeUnmount
- destroyed：vue 實體被銷毀完畢
  - vue3：onUnmounted

### 作用是什麼

- 方便我們控制 vue 物件的過程

### 第一次加載觸發哪些 hook

- beforeCreate、created、beforeMount、mounted

### 資料請求放在 created or mounted 的區別

- 在 mounted 時，有可能會造成頁面閃動（頁面 DOM 已經完成）
- created：是在組建實例一旦完成立刻調用，這時候節點尚未生成
- mounted：是在頁面 dom 渲染完成之後就立刻執行。

## 雙向綁定的原理：defineProperty()

- 透過`Object.defineProperty`來監控各個屬性的 getter or setter
- 當我們透過 JS 物件，把它傳給 Vue 實例時，Vue 會先遍歷他的所有屬性，將其轉換為 getter setter。
- Vue 通過 Observer 來監聽自己的 model 變化，通過 Compile 來更新自己的模板

```html
<body>
  <div id="app">
    <input type="text" id="txt" />
    <p id="show"></p>
  </div>
</body>
<script type="text/javascript">
  var obj = {};
  Object.defineProperty(obj, "txt", {
    get: function () {
      return obj;
    },
    set: function (newValue) {
      document.getElementById("txt").value = newValue;
      document.getElementById("show").innerHTML = newValue;
    },
  });
  document.addEventListener("keyup", function (e) {
    obj.txt = e.target.value;
  });
</script>
```

## 雙向綁定是什麼

- 當用戶與 UI 進行交互，改變 UI 的值之後，數據模型會跟著改變。
- 反過來，當數據模型的值發生改變，UI 也會自動更新反應

## 響應式

- 當數據發生變化時，相關的 UI 會自動去更新反應這些變化，而不需要透過手動編寫代碼來處理數據和 UI 之間的同步

## Vue 實例掛載的過程中發生了什麼?

1. 初始化實例
2. 模板編譯
3. 創建虛擬 DOM
4. 掛載（mount）:在這階段 Vue 將虛擬 DOM 掛載到真正的 DOM 上。這過程發生在 beforeMount & mounted 之間
5. 數據響應式
6. 完成掛載（mounted）

## 為何在 Vue2 添加新屬性時，介面不會刷新

- 因為 Vue2 資料在生成時，是使用 defineProperty 生成響應式數據，所以偵測不到
- 解決辦法
  - Vue.set()
  - Object.assign()：需要創建一個新物件
  - $forcecUpdated()

## 傳值

- props down / emit up（父子）
- ref（父子）
- eventBus（兄弟）
- $parent / $root（兄弟）
- provide / inject（祖先）
- atrrs / listeners（祖先）
- VueX

## vueX

### state

- vuex 的狀態管理區，每一個應用僅包含一個 store 物件，不可直接修改這些數據

### mutation

- mutation 更新 state

### getters

- 類似 vue 的 computed

### action

- 支援非同步
- 透過 store.dispatch 來操作 action -> action commit 給 mutation -> mutation 直接操作 state

## vue-cli 如何新增自定義指令

### vue2 - directive

```javascript
Vue.directive("dir2", {
  inserted(el) {
    console.log(el);
  },
});
```

### vue3 - app.config.globalProperties

```js
// in main.js
app.config.globalProperties.sharedModule_str = sharedModule_str;
```
## 自定義指令
### 全域
```js
// 註冊一個全域自訂義指令 `v-focus`
Vue.directive('focus', {
  // 當被綁定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 頁面加載後自動讓輸入匡獲取取到焦點的小功能
  }
})
```

### 局部註冊
```js
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 頁面加載後自動讓輸入匡獲取取到焦點的小功能
    }
  }
}
```
```html
<input v-focus />
```

### 應用場景
[自訂義指令](https://github.com/febobo/web-interview/issues/21)
* 防抖
* 圖片懶加載
* 一鍵copy功能


## 自定義過濾器 filters
### 是什麼？
* 就是將不必要的東西過濾掉
* 實質上不改變原始數據，只是對數據加工，可以看成一種純函數
### 應用場景
* 單位轉換、數字打點、文本格式化、時間格式化
### 1. 直接如同 data 同樣層級設定

```js
var vm = new Vue({
  el: "#app",
  data: {
    msg: "",
  },
  filters: {
    capitalize: function (value) {
      // ...
    },
  },
});
```

### 2. 全域

```js
Vue.filter("capitalize", function (value) {
  // ...
});
```

### 使用
* 同名時，局部的或蓋掉全域的
```html
{{ message | filterA | filterB }}
```

## css 只在當前組件起作用

- use `<style scoped></style>`

## v-if vs v-show

- v-if = 依條件渲染
- v-show = display: none

### 編譯時機

- v-if：在 DOM 上會真正的消失
- v-show：只是在 CSS 上加上 display: none 的 CSS 屬性

### 性能表現

- v-if：在頻繁切換的場景，性能表現較好
- v-show：在頻繁切換且元素結構穩定的場景，v-show 更適合

## $route vs $router

- $route 包含 push, params, hash, query, fullPath, matched, name 等參數
- $router 則是包含跳轉方法與 hook

## 動態路由的數值

- 於 router 的 index.js 中，對 path 屬性加上「:」，使用 router 物件的 params.id 獲取。

## mixin

### vue2

- 組件的 data、methods 優先級高於 mixin 的
- 生命週期會先執行 mixin 的，在執行組件中的
- 自定義與組件屬性會高於 mixin

#### Demo

##### in mixin conuter.js

```js
// 注意：其實寫法跟vue一樣
const mixin = {
  data() {
    return {
      countMixin: 0,
    };
  },
  methods: {
    incrementMixin() {
      this.countMixin++;
    },
  },
};
```

##### in vue2

```html
<script>
  import counter from "./mixin/counter";

  export default {
    // 在這邊是直接mixins進來
    mixins: [counter],
  };
</script>
```

[文章](https://github.com/febobo/web-interview/issues/15)

- 這時會提到一個問題，也就是「如果有同名時」，兩者相同名稱，將以內部組件為優先。而後者 mixin 會蓋掉前者 mixin
  - 組件內部優先級最高，會覆蓋 mixin 中命名的選項
  - 如果 mixin 和組件中都定義了同名的生命週期，會先執行 mixin 中的
  - 對於其他 methods、computed，如果有同名，會被合併到陣列中依次執行

### vue3

- composition API 依靠原生 JS 來共享程式碼，因此 mixin 的命名衝突就會被解決。

##### in mixin 資料夾的 useCounter.js

```js
// 不管vue2 or vue3 我們一樣在寫vue來創造mixin
import { ref, computed } from "vue";

export default function () {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }
  // 然後這邊return 變數出去，讓別人接
  return {
    count,
    double,
    increment,
  };
}
```

##### in vue3 的 template 模板

```html
<template>
  <h1>{{ "Hello Vue3 !!" }}</h1>
  <p>{{ count }}</p>
  <p>{{ double }}</p>
  <button @click="increment">測試1</button>
</template>

<script>
  // 一樣我們先引入mixin的js檔案
  import useCounter from "./utils/useCounter";

  export default {
    setup() {
      // 再來這邊使用解構的方式去拿變數出來，以此就可以解決命名相沖的問題
      const { count, double, increment } = useCounter();
      return {
        count,
        double,
        increment,
      };
    },
  };
</script>
```

[共用方法-vue mixins 與 vue3 composition api 簡介](https://www.tpisoftware.com/tpu/articleDetails/2459)
