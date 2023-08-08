---
description: Pinia
tags:
  - Vue
  - Pinia
---
# [Pinia] 新一代的狀態管理工具
## 概念
* 為狀態管理工具
* VueX適用版本：
  * v4 for Vue3
  * v3 for Vue2
* Pinia：Vue3、Vue2都適合
## 與VueX之差異
* Pinia移除Mutation
* Pinia支持Server Side Rendering
* Pinia無需設置namespaced，所有的store module都已自動namespaced
* Pinia可以直接從store取得任何state
* Pinia對TS有更好的支援，不再需要多餘的types來包裝
* Pinia使用action可以直接引入函數
* Pinia取得state不用再傳遞參數，可直接使用「this」取得
* Pinia可以再action使用async/await取得非同步資料更改state
* Pinia不再是單一store，使得我們與Store互動比VueX簡單

## 導入兩個Pinia
1. 先做出一個檔案，裡面使用到`defineStore`
2. 然後在main.js中，導入pinia的`createPinia`
3. 創建實例之後，app.use(實例)
4. 最後組件要使用時，再import所要的store
```js
// store1.js
import { defineStore } from 'pinia';

export const useCounterStore1 = defineStore('counter1', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});

```
```js
// store2.js
import { defineStore } from 'pinia';

export const useCounterStore2 = defineStore('counter2', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});


```
```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { useCounterStore1 } from './store1';
import { useCounterStore2 } from './store2';

const app = createApp(App);

const pinia1 = createPinia();
const pinia2 = createPinia();

// 將 store 注入到對應的 Pinia 實例中
app.use(pinia1);
app.use(pinia2);

app.mount('#app');

```
```vue
<template>
  <div class="app">
    <h1>Vue 3 + Pinia Example</h1>
    <p>Count from Store 1: {{ counter1.count }}</p>
    <p>Count from Store 2: {{ counter2.count }}</p>
    <button @click="counter1.increment">Increment Store 1</button>
    <button @click="counter2.increment">Increment Store 2</button>
  </div>
</template>

<script>
import { useCounterStore1 } from './store1'; // 這邊import 兩個
import { useCounterStore2 } from './store2'; // 這邊import 兩個

export default {
  name: 'App',
  setup() {
    const counter1 = useCounterStore1(); // 這邊use 兩個
    const counter2 = useCounterStore2(); // 這邊use 兩個

    return { counter1, counter2 };
  },
};
</script>

<style>
.app {
  text-align: center;
  padding: 20px;
}
</style>

```



## Demo - Vue3 OptionAPI + Pinia
```js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    async incrementAsync() {
      // 模擬非同步操作，例如 API 請求或定時器
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.count++;
    },
    increment() {
      this.count++
    }
  },
});

```
```vue
<template>
  <div class="app">
    <h1>Vue 3 + Pinia Example</h1>
    <p>Count: {{ counter.count }}</p>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
import { useCounterStore } from './store';

export default {
  name: 'App',
  setup() {
    const counter = useCounterStore();

    const incrementAsync = async () => {
      await counter.incrementAsync();
    };
    // 使用 getters 中的 doubleCount
    const doubleCount = counter.doubleCount;

    return { counter, incrementAsync, doubleCount };
  },
};
</script>

<style>
.app {
  text-align: center;
  padding: 20px;
}
</style>

```
## Demo - Vue2 + Pinia
```js
import Vue from 'vue'
import App from './App.vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.config.productionTip = false
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  pinia,
  render: h => h(App),
}).$mount('#app')
```
```js
// pinia部份相同
```
```js
export default {
  name: 'App',
  computed: {
    ...mapState(useCounterStore, ['counter']),
  }
}
```
## Demo Vue3 + VueX4
1. 一樣先創建store
```js
import { createApp } from 'vue';
import App from './App.vue';
import { createStore } from 'vuex'; // 導入 Vuex

const store = createStore({
  state() {
    return {
      count: 0,
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
});

const app = createApp(App);

app.use(store); // 使用 Vuex store

app.mount('#app');
```
2. 在App.vue中使用VueX
```vue
<template>
  <div class="app">
    <h1>Vue 3 + Vuex 4 Example</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'; // 導入 Vuex 相關函式

export default {
  name: 'App',
  computed: {
    ...mapState(['count']), 
    
    // 使用 mapState 將 state 中的 count 映射為組件的 computed 屬性
    // 映射this.count = store.state.count的值
  },
  methods: {
    ...mapMutations(['increment']), // 使用 mapMutations 將 mutation 中的 increment 映射為組件的 methods
  },
};
</script>

<style>
.app {
  text-align: center;
  padding: 20px;
}
</style>

```
## VueX的map語法
```js
computed: mapState([
  'count',
  'name'
])
```
```js
computed: {
  count(){
    return this.$store.state.count
  }
}
```

## 文章參考
1. [Vuex状态管理-mapState的基本用法详细介绍](https://blog.csdn.net/chenjie9230/article/details/108883055)
2. [[Vue] 新一代狀態管理工具 Pinia](https://www.tpisoftware.com/tpu/articleDetails/2844)
















