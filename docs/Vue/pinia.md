---
description: Pinia
tags:
  - Vue
  - Pinia
---

# [Pinia] 新一代的狀態管理工具

## 概念

- 為狀態管理工具
- VueX 適用版本：
  - v4 for Vue3
  - v3 for Vue2
- Pinia：Vue3、Vue2 都適合

## 與 VueX 之差異

- Pinia 移除 Mutation
- Pinia 支持 Server Side Rendering
- Pinia 無需設置 namespaced，所有的 store module 都已自動 namespaced
- Pinia 可以直接從 store 取得任何 state
- Pinia 對 TS 有更好的支援，不再需要多餘的 types 來包裝
- Pinia 使用 action 可以直接引入函數
- Pinia 取得 state 不用再傳遞參數，可直接使用「this」取得
- Pinia 可以再 action 使用 async/await 取得非同步資料更改 state
- Pinia 不再是單一 store，使得我們與 Store 互動比 VueX 簡單
- devtools 支持
  - 追蹤 actions、mutations 時間線
  - 在組件中展示他所用到的 store
  - 調適更容易的 time travel
- hot reload

## 導入兩個 Pinia

1. 先做出一個檔案，裡面使用到`defineStore`
2. 然後在 main.js 中，導入 pinia 的`createPinia`
3. 創建實例之後，app.use(實例)
4. 最後組件要使用時，再 import 所要的 store

```js
// store1.js
import { defineStore } from "pinia";

export const useCounterStore1 = defineStore("counter1", {
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
import { defineStore } from "pinia";

export const useCounterStore2 = defineStore("counter2", {
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
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import { useCounterStore1 } from "./store1";
import { useCounterStore2 } from "./store2";

const app = createApp(App);

const pinia1 = createPinia();
const pinia2 = createPinia();

// 將 store 注入到對應的 Pinia 實例中
app.use(pinia1);
app.use(pinia2);

app.mount("#app");
```

```html
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
  import { useCounterStore1 } from "./store1"; // 這邊import 兩個
  import { useCounterStore2 } from "./store2"; // 這邊import 兩個

  export default {
    name: "App",
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
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
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
      this.count++;
    },
  },
});
```

```html
<template>
  <div class="app">
    <h1>Vue 3 + Pinia Example</h1>
    <p>Count: {{ counter.count }}</p>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
  import { useCounterStore } from "./store";

  export default {
    name: "App",
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
import Vue from "vue";
import App from "./App.vue";
import { createPinia, PiniaVuePlugin } from "pinia";

Vue.config.productionTip = false;
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  pinia,
  render: (h) => h(App),
}).$mount("#app");
```

```js
// pinia部份相同
```

```js
export default {
  name: "App",
  computed: {
    ...mapState(useCounterStore, ["counter"]),
  },
};
```

## Demo - Vue3 + VueX4

1. 一樣先創建 store

```js
import { createApp } from "vue";
import App from "./App.vue";
import { createStore } from "vuex"; // 導入 Vuex

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

app.mount("#app");
```

2. 在 App.vue 中使用 VueX

```html
<template>
  <div class="app">
    <h1>Vue 3 + Vuex 4 Example</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex"; // 導入 Vuex 相關函式

  export default {
    name: "App",
    computed: {
      ...mapState(["count"]),

      // 使用 mapState 將 state 中的 count 映射為組件的 computed 屬性
      // 映射this.count = store.state.count的值
    },
    methods: {
      ...mapMutations(["increment"]), // 使用 mapMutations 將 mutation 中的 increment 映射為組件的 methods
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

## VueX 的 map 語法

```js
computed: mapState(["count", "name"]);
```

```js
computed: {
  count(){
    return this.$store.state.count
  }
}
```

## state

### 使用

```html
<script setup>
  import { useCounterStore } from "@/stores/counter";
  // 可以在组件中的任意位置访问 `store` 变量 ✨
  const store = useCounterStore();
  store.count++;
</script>
```

### 重置

```js
const store = useStore();

store.$reset();
```

### 取出

```html
<script setup>
  import { storeToRefs } from "pinia";
  const store = useCounterStore();
  // 如果要讓store.state保持響應式，必須要用storeToRefs取出
  const { name, doubleCount } = storeToRefs(store);
  // actions可以直接取出
  const { increment } = store;
</script>
```

### 變更 state

- 記得要用`$patch`，請不要使用`=`

```js
// 較不推薦，因為任何集合的修改，會較耗時
store.$patch({
  count: store.count + 1,
  age: 120,
  name: "DIO",
});
// 較推薦
store.$patch((state) => {
  state.items.push({ name: "shoes", quantity: 1 });
  state.hasChanged = true;
});
```

### 監聽 state

```js
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem("piniaState", JSON.stringify(state));
  },
  { deep: true }
);
```

## getter

### 訪問 getter

```js
export const useStore = defineStore("main", {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 类型是自动推断出来的，因为我们没有使用 `this`
    doubleCount: (state) => state.count * 2,
    /**
     * 返回 count 的值乘以 2 加 1
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      return this.doubleCount + 1;
    },
  },
});
```

### 在 template 上訪問

```html
<script setup>
import { useCounterStore } from './counterStore'
const store = useCounterStore()
</script>
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>
```

### 向getter傳遞參數
- return 一個function
```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

## 文章參考

1. [Vuex 状态管理-mapState 的基本用法详细介绍](https://blog.csdn.net/chenjie9230/article/details/108883055)
2. [[Vue] 新一代狀態管理工具 Pinia](https://www.tpisoftware.com/tpu/articleDetails/2844)
