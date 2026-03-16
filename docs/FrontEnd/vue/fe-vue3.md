---
slug: "/FE-knowledge/fe-vue3"
title: "前端 Vue 3"
description: "整理 Vue 3 的核心改動、響應式系統、Composition API、效能優化、TypeScript 與 Nuxt 3 實務觀念。"
tags:
  - Frontend
  - JavaScript
  - Vue
  - Vue 2
  - Vue 3
keywords: ["Vue 3", "Composition API", "reactivity", "watch", "Teleport", "Tree Shaking", "TypeScript", "Nuxt 3"]
---

# [FE] Vue 3

Vue 3 不只是把 API 換成 `setup()` 或 `<script setup>`。它真正的核心價值在於三件事：

- 更好的邏輯組織方式
- 更完整的響應式能力
- 更適合現代前端工程化與 TypeScript

這篇筆記把常見面試題與實務觀念放在同一條脈絡裡，重點不是背 API，而是理解 Vue 3 為什麼這樣設計。

## Vue 3 在解決什麼問題

如果用一句話總結 Vue 3：它想改善 Vue 2 在大型專案中的維護成本。

Vue 2 不是不能開發大型系統，但當元件愈來愈複雜時，常見問題也會愈來愈明顯：

- 相同功能的邏輯被拆在 `data`、`computed`、`methods`、`watch` 各處
- `mixin` 雖然能共用邏輯，但容易有命名衝突，也不容易追來源
- 對 TypeScript 的支援不夠自然
- 響應式系統在物件新增屬性、陣列變化等情境上有限制

Vue 3 的改進方向，就是讓程式碼更容易拆、組、推理與最佳化。

## Composition API 與 Options API

### Options API 適合什麼情境

Options API 的優勢是直覺，尤其在小型元件或教學範例裡很好懂。

```js
export default {
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    doubleCount() {
      return this.count * 2;
    },
  },
  methods: {
    increment() {
      this.count += 1;
    },
  },
};
```

缺點是當功能變多時，跟同一個功能相關的邏輯會被拆散在不同區塊裡，閱讀時要來回跳。

### Composition API 為什麼更適合大型專案

Composition API 的重點不是「寫法比較新」，而是「可以用功能切分程式碼」。

```vue
<script setup>
import { computed, ref } from "vue";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value += 1;
}
</script>
```

同一個功能相關的狀態、衍生值、事件處理都可以放在一起，這讓它更適合：

- 抽成 composable 共用邏輯
- 和 TypeScript 結合
- 在大型元件中維持可讀性

### Vue 2 的 mixin vs Vue 3 的 composable

Vue 2 常用 `mixin` 共用邏輯，但 mixin 有兩個典型問題：

- 命名衝突
- 很難一眼看出資料從哪裡來

Vue 3 比較常用 composable：

```js
// useCounter.js
import { computed, ref } from "vue";

export function useCounter() {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value += 1;
  }

  return {
    count,
    doubleCount,
    increment,
  };
}
```

這種方式的好處是來源清楚、耦合度低，而且更容易被測試。

## Vue 3 響應式系統

### Vue 2 為什麼有限制

Vue 2 主要透過 `Object.defineProperty()` 攔截既有屬性的 `getter` 與 `setter`。這種方式能做出響應式，但有幾個限制：

- 新增或刪除物件屬性不容易監聽
- 陣列索引與長度變化處理較麻煩
- 深層物件需要遞迴處理，成本較高

### Vue 3 為什麼改成 Proxy

Vue 3 改用 `Proxy` 後，可以直接代理整個物件，而不是一個 key 一個 key 地包裝。

這帶來幾個好處：

- 可監聽新增、刪除屬性
- 可監聽陣列索引與長度變化
- 不需要一開始就深度遍歷整棵資料結構
- 對複雜資料結構更自然

### 常用響應式 API

#### `ref`

適合基本型別，也可以包物件。

```js
import { ref } from "vue";

const count = ref(0);
count.value += 1;
```

#### `reactive`

適合物件或陣列。

```js
import { reactive } from "vue";

const user = reactive({
  name: "KT",
  role: "admin",
});
```

#### `toRef` 與 `toRefs`

當你想把 `reactive` 物件中的欄位拆出去，又不想失去響應式時會用到。

```js
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
  loading: false,
});

const { count, loading } = toRefs(state);
```

#### `shallowRef` 與 `shallowReactive`

只追蹤第一層，適合大型資料、第三方實例或不希望深度代理的情境。

```js
import { shallowRef } from "vue";

const chartInstance = shallowRef(null);
```

#### `readonly`

適合把資料往下層傳遞時做保護，避免子層誤改。

```js
import { provide, reactive, readonly } from "vue";

const state = reactive({ theme: "light" });

provide("appState", readonly(state));
```

#### `toRaw` 與 `markRaw`

- `toRaw`：取得原始物件
- `markRaw`：告訴 Vue 這個物件不要被轉成響應式

常用在第三方 library instance、地圖物件、編輯器物件等。

## computed、watch、watchEffect

這三個很常被混用，但用途不同。

### `computed`

`computed` 用來產生「可被快取的衍生狀態」，重點是它應該是純函式，不要拿來做副作用。

```js
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

適合：

- UI 顯示值轉換
- 表單衍生狀態
- 多個狀態的彙整結果

### `watch`

`watch` 適合在你「明確知道要監聽誰」時使用，也適合需要舊值與新值比較的情況。

```js
watch(
  () => route.query.keyword,
  (newKeyword, oldKeyword) => {
    if (newKeyword !== oldKeyword) {
      fetchList();
    }
  },
  { immediate: true }
);
```

適合：

- 監聽特定來源
- 需要 `newValue` / `oldValue`
- 要控制 `immediate`、`deep`、`once`

### `watchEffect`

`watchEffect` 會自動收集 callback 中用到的響應式依賴。

```js
const stop = watchEffect(() => {
  console.log("count:", count.value);
});

stop();
```

適合：

- 原型開發
- 依賴來源很多、不想手動列出
- 寫簡短的 reactive side effect

限制是它不適合做很精準的變更比較，也拿不到明確的舊值。

### 怎麼選

- 要衍生狀態，用 `computed`
- 要追蹤指定來源，用 `watch`
- 要自動收集依賴，用 `watchEffect`

## 組件之間如何溝通

### 父子元件：`props` / `emit`

這仍然是最基本、最推薦的資料流。

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["save"]);
</script>
```

原則上：

- 資料往下傳，用 `props`
- 事件往上丟，用 `emit`

### 跨層共享：`provide` / `inject`

適合處理跨層級但又不想引入全域狀態管理的情境，例如：

- 表單群組
- Tabs / Accordion
- theme / config

```js
// provider
const formState = reactive({ disabled: false });
provide("formState", readonly(formState));

// consumer
const formState = inject("formState");
```

如果你擔心下層元件誤改資料，建議搭配 `readonly()`。

### 暴露組件方法：`defineExpose`

如果父元件需要呼叫子元件的方法，可以用 `defineExpose`。

```vue
<script setup>
function open() {
  console.log("open modal");
}

defineExpose({ open });
</script>
```

## Vue 3 內建能力

### Teleport

Teleport 讓你把元件的 DOM 渲染到畫面上的其他位置，但邏輯上仍然屬於原本元件樹。

最常見用途：

- Modal
- Drawer
- Toast
- 全域浮層

```vue
<template>
  <button @click="open = true">Open Modal</button>

  <teleport to="body">
    <div v-if="open" class="modal">
      <p>這是 modal 內容</p>
      <button @click="open = false">Close</button>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);
</script>
```

重點是：DOM 位置被搬走，但組件的生命週期、事件與狀態仍屬於原本元件。

### Suspense

Suspense 用來處理非同步元件或 async setup 的 loading/fallback 狀態。

```vue
<Suspense>
  <template #default>
    <AsyncProfile />
  </template>

  <template #fallback>
    <div>Loading...</div>
  </template>
</Suspense>
```

它很適合拿來包：

- 非同步頁面區塊
- 初始資料載入
- 需要 fallback UI 的 async component

### 動態元件 `:is`

當你需要依條件切換元件類型時，可以用動態元件。

```vue
<component :is="currentComponent" />
```

適合：

- tab content
- step form
- 後台面板切換

## Vue 3 的效能優化觀念

### 編譯期優化比 Vue 2 更完整

Vue 3 的效能提升不只來自 runtime，也來自 compiler。

它會在編譯階段做更多靜態分析，例如：

- 靜態節點提升（hoisting）
- patch flag 標記
- block tree 追蹤動態節點

意思是：Vue 不需要每次都全量比對整棵 VDOM，而是更精準地更新真正有變化的部分。

### 靜態提升（Static Hoisting）

模板裡不會變的內容，Vue 會盡量提早抽出來重用，避免每次 re-render 都重新建立。

這也是你看到 Vue 3 常被提到比 Vue 2 更適合大型畫面更新的原因之一。

### Tree-shaking

Vue 3 的 API 設計更模組化，配合 ES Module 可以做 tree-shaking。

意思是：你沒有用到的 API，打包工具有機會在 build 時移除。

例如只引入這些：

```js
import { ref, computed } from "vue";
```

理論上就比把整包 runtime 都吃進來更容易被最佳化。

### 程式碼分割與 lazy loading

如果你想進一步減少 bundle 體積，實務上最有感的通常是 code splitting，而不是只談 tree-shaking。

```js
import { defineAsyncComponent } from "vue";

const UserPanel = defineAsyncComponent(() => import("./UserPanel.vue"));
```

路由層也可以做 lazy loading：

```js
const routes = [
  {
    path: "/settings",
    component: () => import("@/pages/SettingsPage.vue"),
  },
];
```

### `v-if`、`v-show`、`:is` 怎麼選

- `v-if`：真的移除 / 建立 DOM，適合不常切換的區塊
- `v-show`：只切換 `display`，適合高頻切換
- `:is`：在多個元件之間切換

這不是語法題，而是渲染成本題。

### 列表渲染注意事項

- `v-for` 一定要有穩定的 `key`
- 不要把 `v-if` 和 `v-for` 寫在同一個元素上
- 如果要先過濾再渲染，優先把過濾邏輯移到 `computed`

## TypeScript 與 Vue 3

Vue 3 與 TypeScript 的整合比 Vue 2 自然很多，尤其是 `<script setup lang="ts">`。

```vue
<script setup lang="ts">
interface User {
  id: number;
  name: string;
}

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  save: [id: number];
}>();
</script>
```

這樣做的好處：

- props 型別更清楚
- emit 事件更不容易打錯
- IDE 補全更完整
- 重構時比較安全

## Vue 3 + Vite vs Webpack

### Webpack 的特性

Webpack 很強、很成熟、可配置性高，但啟動與重建成本通常較高。

### Vite 的特性

Vite 在開發時利用原生 ESM，啟動更快，HMR 也通常更直接。

Vite 在正式 build 時底層仍會做 bundling，所以它不是「完全不打包」，而是把開發與建置流程拆開處理。

### 為什麼 Vue 3 常和 Vite 綁在一起

因為 Vue 3 本身就是朝現代工具鏈設計的：

- ESM 友善
- Composition API 易拆模組
- Tree-shaking 更有效
- TypeScript DX 更好

如果你想進一步減少 Vite 打包體積，常見手段有：

- 路由與大元件 lazy load
- 避免無用依賴
- 優先用按需引入
- 重型 library 改成動態載入
- 圖片、icon、locale 資源拆分

## SSR、SSG 與 Nuxt 3

Vue 本身可以做 CSR，但如果你要處理 SEO、首屏速度與內容型網站，通常會進一步用 Nuxt 3。

### 什麼時候會考慮 SSR / SSG

- SEO 很重要
- 首屏內容需要先輸出 HTML
- 內容頁相對穩定，適合預渲染

### Nuxt 3 常見觀念

- route rules 可控制某些頁面是否 prerender、cache 或 SSR
- 每個 request 的狀態要隔離，避免不同使用者共用狀態
- Pinia、plugin、runtime config 都要注意 server/client 差異

如果在 SSR 環境中誤用瀏覽器專屬 API，例如 `window`、`document`、`localStorage`，就容易出現 hydration mismatch 或 server error。

## 面試時可以怎麼回答「Vue 3 有什麼改進」

可以用這個順序回答，會比單純背功能列表好很多：

1. Vue 3 在架構上更適合大型專案，因為 Composition API 讓邏輯可以依功能聚合。
2. 響應式系統改成 Proxy，解決 Vue 2 對新屬性、陣列與深層物件的限制。
3. 編譯期優化更完整，例如靜態提升、patch flags、tree-shaking。
4. 與 TypeScript、Vite、Nuxt 3 的整合更自然，現代工程化體驗更好。

## 總結

Vue 3 的核心不是 API 比較多，而是它把「可維護性、效能、工程化」這三件事一起往前推。

如果你在做中大型專案，真正有價值的幾個關鍵字通常是：

- Composition API
- composable
- Proxy reactivity
- computed / watch / watchEffect 的角色分工
- Teleport / Suspense
- tree-shaking / code splitting
- TypeScript / Vite / Nuxt 3

把這幾個觀念串起來，你對 Vue 3 的理解就不會只停留在 API 層。
