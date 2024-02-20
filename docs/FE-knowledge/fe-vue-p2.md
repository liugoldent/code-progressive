---
description: vue 面試常見問題
tags: 
    - javascript
    - Test
    - Vue
---
# [FE] Vue - p2

## MVVM
* model：代表業務邏輯
* View：代表View，負責將數據轉換成UI展現出來
* ViewModel：監聽Model數據改變 & 控制View行為的地方。簡單來說就是同步View & Model的物件。
* 注意 View & Model 之間沒有直接關係，是透過ViewModel來聯繫

## 生命週期
### 列表（總共分為8階段）創建 -> 載入 -> 更新 -> 銷毀
* beforeCreate：vue實體被建立，狀態與事件都未初始化
  * vue3：setup()
* created：vue實體被建立，狀態與事件都已初始化
  * vue3：setup()
* beforeMount：vue實體尚未與DOM綁定
  * vue3：onBeforeMount()
* mounted：綁定完成（DOM已创建）
  * vue3：onMounted()
  * DOM渲染也在此階段完成
* beforeUpdate：狀態改變，畫面尚未更新前
  * vue3：onBeforeUpdate
* updated：狀態改變，畫面也改變完成
  * vue3：onUpdated
* beforeDestroy：vue實體被銷毀前
  * vue3：onBeforeUnmount
* destroyed：vue實體被銷毀完畢
  * vue3：onUnmounted

### 作用是什麼
* 方便我們控制vue物件的過程

### 第一次加載觸發哪些hook
* beforeCreate、created、beforeMount、mounted

## 雙向綁定的原理：defineProperty()
* 透過`Object.defineProperty`來監控各個屬性的getter or setter
* 當我們透過JS物件，把它傳給Vue實例時，Vue會先遍歷他的所有屬性，將其轉換為getter setter。
* Vue通過Observer來監聽自己的model變化，通過Compile來更新自己的模板
```html
<body>
    <div id="app">
    <input type="text" id="txt">
    <p id="show"></p>
</div>
</body>
<script type="text/javascript">
    var obj = {}
    Object.defineProperty(obj, 'txt', {
        get: function () {
            return obj
        },
        set: function (newValue) {
            document.getElementById('txt').value = newValue
            document.getElementById('show').innerHTML = newValue
        }
    })
    document.addEventListener('keyup', function (e) {
        obj.txt = e.target.value
    })
</script>
```

## 為何在Vue2天加新屬性時，介面不會刷新
* 因為Vue2資料在生成時，是使用defineProperty生成響應式數據，所以偵測不到
* 解決辦法
  * Vue.set()
  * Object.assign()：需要創建一個新物件
  * $forcecUpdated()

## 父子傳值
* props down / emit up
* eventBus
* VueX
* provide / inject

## vue-router
### hash vs history
#### hash
* 當點選# tag時，網頁會自動跳到某tag上，不會觸發重新載入頁面，而且還會記錄在session history中，可以用上一頁回到原本位置
##### 優點
* 不需要後端相對應的配置
* 舊版的瀏覽器可以用

#### history
* 首先要在vue router的history先設置
```javascript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```
* 跳轉時會發出HTTP請求，而且後端要自己設定，以免造成404錯誤
##### 優點
* 需要後端的互相配置
* 舊版瀏覽器支援度較低

### to、from、next

#### beforeEach（全域）
* 意思是每一個路由要進入之前都會先經過這邊

```javascript
const router = createRouter({...})

// to：即將進入的路由
// from：從何處進入的路由
router.beforeEach((to, from) =>{
  // ...
})
```

#### beforeEnter（路由）
* 主要是使用於元件中
```javascript
const routes = [
  {
    path: 'user/:id',
    components: UserDetails,
    beforeEnter: (to, from) =>{
      return false
    }
  }
]
```

#### beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave
```html
<script>
export default {
  data(){
    return { ... }
  },
  beforeRouteEnter(){
    // 尚未進入該元件時被調用
    // ...
  },
  beforeRouteUpdate(){
    // 路由被改變，但是元件本身仍是同一個的時候被調用
    // ...
  },
  beforeRouteLeave(){
    // 當路由要離開這個元件時被自動調用
    // ...
  }
}
  </script>
```
[4-4 路由守衛（Navigation Guards）](https://book.vue.tw/CH4/4-4-navigation-guards.html)

## vueX
### state
* vuex的狀態管理區，每一個應用僅包含一個store物件，不可直接修改這些數據
### mutation
* mutation 更新state
### getters
* 類似vue的computed
### action
* 支援非同步
* 透過store.dispatch來操作action -> action commit 給mutation -> mutation 直接操作state

## vue-cli 如何新增自定義指令
### vue2 - directive
```javascript
Vue.directive('dir2', {
    inserted(el) {
        console.log(el);
    }
})
```
### vue3 - app.config.globalProperties
```js
// in main.js
app.config.globalProperties.sharedModule_str = sharedModule_str
```

## 自定義filters
### 1. 直接如同data同樣層級設定
```js
var vm=new Vue({
    el:"#app",
    data:{
        msg:''
    },
    filters: {
      capitalize: function (value) {
        // ...
      }
    }
})
```

### 2. 全域
```js
Vue.filter('capitalize', function (value) {
  // ...
})
```

### keep-alive
* 可以使被包含的組件保留狀態，避免重新渲染
* include：字符串或正則表達式，只有名稱匹配的組件會被緩存
* exclude：字符串或正則表達式，任何名稱匹配的組件都不會被緩存
```html
<keep-alive include='include_components' exclude='exclude_components'>
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>
```

## css 只在當前組件起作用
* use `<style scoped></style>`

## v-if vs v-show
* v-if = 依條件渲染
* v-show = visibility:hidden

## $route vs $router
* $route包含 push, params, hash, query, fullPath, matched, name 等參數
* $router 則是包含跳轉方法與hook

## 動態路由的數值
* 於router的index.js中，對path屬性加上「:」，使用router物件的params.id獲取。

## mixin
### vue2
* 組件的data、methods優先級高於mixin的
* 生命週期會先執行mixin的，在執行組件中的
* 自定義與組件屬性會高於mixin
#### Demo
##### in mixin conuter.js
```js
// 注意：其實寫法跟vue一樣
const mixin = {
    data() {
        return {
        countMixin: 0
        };
    },
    methods: {
        incrementMixin() {
        this.countMixin++;
        }
    }
}
```
##### in vue2
```html
<script>
import counter from "./mixin/counter";

export default {
  // 在這邊是直接mixins進來
  mixins: [counter],
}
</script>
```
* 這時會提到一個問題，也就是「如果有同名時」，兩者相同名稱，將以內部組件為優先

### vue3
* composition API 依靠原生JS來共享程式碼，因此mixin的命名衝突就會被解決。
##### in mixin 資料夾的 useCounter.js
```js
// 不管vue2 or vue3 我們一樣在寫vue來創造mixin
import { ref, computed } from "vue";

export default function () {
  const count = ref(0);
  const double = computed(() => count.value * 2)
  function increment() {
    count.value++;
  }
  // 然後這邊return 變數出去，讓別人接
  return {
    count,
    double,
    increment
  }
}
```

##### in vue3 的template模板
```vue
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
    const { count, double, increment} = useCounter();
    return {
      count,
      double,
      increment
    }
  },
}
</script>
```
[共用方法-vue mixins 與 vue3 composition api 簡介](https://www.tpisoftware.com/tpu/articleDetails/2459)












































