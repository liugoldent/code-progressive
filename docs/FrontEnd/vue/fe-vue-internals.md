---
slug: "/FE-knowledge/fe-vue-internals"
title: "Vue 3 底層原理"
description: "從模板編譯、響應式依賴追蹤、更新排程到 Virtual DOM、Diff 與 DOM patch，串起 Vue 3 的完整運作流程。"
tags:
  - Frontend
  - JavaScript
  - Vue
  - Vue 3
keywords: ["Vue 3 底層原理", "reactivity", "Proxy", "effect", "scheduler", "nextTick", "Virtual DOM", "Diff", "patch flags", "compiler"]
---

# Vue 3 底層原理

學 Vue 的 API，會知道「怎麼寫」；理解底層，則能回答「為什麼這樣寫」以及「畫面為什麼在這個時間點更新」。

先用一條主線記住 Vue 3：

```txt
SFC / template
  ↓ 編譯
render function
  ↓ 執行
VNode tree
  ↓ renderer mount / patch
真實 DOM

reactive state
  ↓ track / trigger
component reactive effect
  ↓ scheduler 批次排程
重新執行 render function
```

所以 Vue 3 的底層可以拆成四個主要系統：

1. Compiler：把模板轉成 render function，並留下最佳化提示。
2. Reactivity：追蹤誰讀取了狀態，狀態改變時通知訂閱者。
3. Scheduler：合併同一輪更新，決定元件、watcher 與生命週期的執行順序。
4. Renderer：比較新舊 VNode，對真實 DOM 執行最少量的操作。

## Vue 3 核心套件怎麼分工

閱讀 Vue 原始碼時，不要直接從整個 repository 亂找。先知道幾個重要 package 的責任：

| package | 主要責任 |
| --- | --- |
| `@vue/reactivity` | `reactive`、`ref`、`computed`、effect 與依賴管理 |
| `@vue/runtime-core` | 元件、VNode、renderer、scheduler、生命週期等平台無關邏輯 |
| `@vue/runtime-dom` | 瀏覽器 DOM 操作、attribute、property 與事件 patch |
| `@vue/compiler-core` | 模板 parser、AST transform、code generation |
| `@vue/compiler-dom` | 在 compiler-core 上加入 DOM 專用編譯規則 |
| `@vue/compiler-sfc` | 解析 `.vue` 檔案、`<script setup>`、scoped CSS 等 |
| `@vue/server-renderer` | 把元件樹輸出成伺服器端 HTML |

`runtime-core` 不直接寫死 `document.createElement()`，而是讓平台提供 `createElement`、`insert`、`remove`、`patchProp` 等操作。因此同一套核心 renderer 理論上不只可以渲染到瀏覽器 DOM，也能接到其他宿主環境。

## 從 `.vue` 檔案到 render function

### SFC 不是瀏覽器原生格式

瀏覽器看不懂 `.vue`。開發時，Vite 的 Vue plugin 會配合 `@vue/compiler-sfc`，把一個 Single-File Component 拆成 descriptor：

```vue
<template>
  <button :class="{ active }" @click="count++">
    {{ count }}
  </button>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
const active = ref(true);
</script>

<style scoped>
button { color: tomato; }
</style>
```

大致會分開處理：

- `<script setup>`：轉成元件的 `setup()` 相關程式碼。
- `<template>`：轉成 render function。
- `<style scoped>`：轉換 selector，再交給 CSS 工具鏈處理。

`defineProps()`、`defineEmits()`、`defineExpose()` 等是 compiler macro，不需要 import；它們主要在編譯階段被識別與轉換，不是一般 runtime function call。

### Template compiler 的三個階段

模板編譯可以先用三步理解：

```txt
template string
  ↓ parse
Template AST
  ↓ transform
加入元件、指令與最佳化資訊的 AST
  ↓ generate
render function code
```

例如：

```vue
<div :class="theme">{{ message }}</div>
```

概念上會產生接近以下內容的 render function：

```js
function render(_ctx) {
  return createElementVNode(
    "div",
    { class: normalizeClass(_ctx.theme) },
    toDisplayString(_ctx.message),
    3 // TEXT | CLASS，數字僅用來示意 patch flag
  );
}
```

實際輸出會隨 Vue 版本、編譯模式與模板而變，不應把編譯結果逐字背起來。真正要懂的是：模板最後是 JavaScript function，而 compiler 能先判斷哪些內容會改變。

### 完整版與 runtime-only build

如果模板在 build 階段已經編譯，瀏覽器端只需要 runtime。這樣可以避免把 template compiler 一起送進正式 bundle。

只有在瀏覽器中臨時把字串模板編譯成 render function 時，才需要包含 runtime compiler 的 Vue build。一般 Vite + SFC 專案通常走預先編譯。

## VNode 與 Virtual DOM 是什麼

VNode 是描述 UI 的普通 JavaScript 物件。簡化後可以想成：

```js
const vnode = {
  type: "button",
  props: {
    class: "primary",
    onClick: handleClick,
  },
  children: "Save",
  key: null,
  el: null,
};
```

幾個重要欄位：

- `type`：DOM tag、元件、Text、Comment、Fragment、Teleport 等類型。
- `props`：attribute、DOM property、事件、元件 props 等。
- `children`：文字、VNode 陣列或 slot。
- `key`：辨識前後兩次 render 中的節點身分。
- `el`：mount 後對應的真實 DOM 節點。
- `component`：元件 VNode 對應的 component instance。
- `patchFlag`、`dynamicChildren`：compiler 留給 runtime 的最佳化資訊。

Virtual DOM 的主要價值不是保證「一定比手寫 DOM 快」，而是讓開發者宣告下一個 UI 狀態，再由 renderer 統一處理跨平台渲染、元件組合與更新策略。

Vue 的特色是 compiler 和 runtime 能互相合作，所以它不是完全盲目地比較整棵 VNode tree。

## `createApp().mount()` 大致發生什麼事

第一次掛載可以沿著這條路徑理解：

```txt
createApp(App)
  ↓
app.mount(container)
  ↓
建立 root VNode
  ↓
render(vnode, container)
  ↓
patch(null, vnode)
  ↓
建立 component instance
  ↓
初始化 props / slots / setup
  ↓
建立 component render effect
  ↓
執行 render function 取得 subTree
  ↓
patch(null, subTree)
  ↓
建立並插入真實 DOM
```

### Component instance 裡有什麼

component instance 是 Vue 在 runtime 管理元件的內部物件，常見資訊包括：

- `vnode`：目前代表這個元件的 VNode。
- `type`：元件定義本身。
- `parent`、`root`：元件樹關係。
- `props`、`attrs`、`slots`、`refs`。
- `setupState`：`setup()` 回傳或 `<script setup>` 暴露給模板的狀態。
- `subTree`：這個元件上一次 render 出來的 VNode tree。
- `effect`、`update`：負責元件重新渲染的 reactive effect 與更新 job。
- `isMounted`、生命週期 hooks 等狀態。

一個「元件 VNode」和元件 render 後得到的 `subTree` 不一樣：前者代表元件這個抽象節點，後者才描述元件要輸出的元素、子元件與文字。

### 為什麼 setup 只執行一次，template 卻能一直更新

首次 mount 時，Vue 會建立元件的 render effect。render function 執行期間讀到的 reactive state 會成為這個 effect 的 dependency。

之後 dependency 改變，不需要重跑 `setup()`；Vue 只要排程元件的 update job，再重新執行 render function，產生新的 `subTree` 與舊 `subTree` 比較即可。

## 響應式系統：從讀取到通知更新

### Vue 2 與 Vue 3 的攔截方式

Vue 2 主要用 `Object.defineProperty()` 包裝已存在的物件屬性。Vue 3 則是：

- `reactive object`：使用 `Proxy` 攔截操作。
- `ref`：透過 `.value` 的 getter / setter 追蹤與觸發。

Proxy 能攔截的不只有 `get` 和 `set`，也包含 `has`、`deleteProperty`、`ownKeys` 等操作，所以 Vue 3 能自然處理新增屬性、刪除屬性與列舉 key。

### `track()` 與 `trigger()`

先看最小化概念模型：

```js
let activeEffect;
const targetMap = new WeakMap();

function track(target, key) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const dep = depsMap?.get(key);
  dep?.forEach((effect) => effect());
}
```

概念上的關係是：

```txt
WeakMap
  target object
    Map
      property key
        dependency collection
          effect A
          effect B
```

Vue 實際原始碼還要處理 effect 清理、巢狀 effect、computed、batch、array、Map、Set、iteration dependency 等情況，資料結構也可能隨版本最佳化。面試時講清楚這個概念模型，比背某個版本的私有欄位可靠。

### `reactive()` 的核心概念

簡化版可以寫成：

```js
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key);
      return Reflect.get(target, key, receiver);
    },

    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);

      if (!Object.is(oldValue, value)) {
        trigger(target, key);
      }

      return result;
    },
  });
}
```

實際實作會比這複雜許多，例如要區分：

- 是新增 key 還是修改既有 key。
- 陣列 `length`、索引與 iteration 的關係。
- `Map.set()`、`Set.add()`、`clear()` 等 collection 操作。
- readonly、shallow reactive 與 ref 自動解包。
- 同一個 raw object 重複呼叫 `reactive()` 時的 proxy cache。

### 為什麼解構後可能失去響應式

```js
const state = reactive({ count: 0 });
const { count } = state;

state.count++;
console.log(count); // 仍是解構當下的 number
```

`count` 現在只是區域變數，讀取它不會再經過 `state` Proxy 的 `get` trap。可以改用：

```js
const state = reactive({ count: 0 });
const { count } = toRefs(state);

state.count++;
console.log(count.value); // 1
```

若解構出來的是物件，修改那個物件內部屬性仍可能具有響應式；失去連線的是「解構後的變數綁定」，不代表所有深層值都必然變成 raw object。

### Proxy 與 raw object 的身分不同

```js
const raw = {};
const observed = reactive(raw);

console.log(raw === observed); // false
console.log(toRaw(observed) === raw); // true
```

這會影響用物件身分作為 `Map` key、`Set` member 或第三方 library instance 的情境。不要長期混用 raw 與 proxy；不適合被代理的第三方 instance 可以評估 `markRaw()` 或 `shallowRef()`。

## Reactive Effect 是依賴追蹤的核心

effect 的責任可以簡化為：

1. 執行使用者或 renderer 提供的 function。
2. 執行時把自己設成目前的 active effect。
3. reactive getter 讀到 active effect，建立雙向依賴關係。
4. dependency 改變時，直接執行 effect 或交給 scheduler。

```js
function effect(fn) {
  const reactiveEffect = () => {
    activeEffect = reactiveEffect;
    try {
      fn();
    } finally {
      activeEffect = undefined;
    }
  };

  reactiveEffect();
  return reactiveEffect;
}
```

真正實作還需要 effect stack 與 parent link，否則 effect 裡又執行另一個 effect 時，外層 effect 會遺失。

### 為什麼依賴需要重新收集與清理

看這個分支：

```js
watchEffect(() => {
  if (enabled.value) {
    console.log(message.value);
  }
});
```

當 `enabled` 是 `true` 時，effect 依賴 `enabled` 和 `message`。如果後來 `enabled` 變成 `false`，下一次執行就不再讀取 `message`，因此舊的 `message → effect` 關係應該失效。

Vue 需要在 effect 每次執行前後維護 dependency 關係，避免失效的分支一直觸發不必要更新。這也是「自動依賴追蹤」不只是把 function 放進一個 Set 那麼簡單的原因。

### 元件更新也是 effect

每個元件會有自己的 render effect。首次執行負責 mount；後續執行負責產生新 subTree 並 patch：

```js
const componentUpdateFn = () => {
  if (!instance.isMounted) {
    const subTree = renderComponentRoot(instance);
    patch(null, subTree, container);
    instance.subTree = subTree;
    instance.isMounted = true;
  } else {
    const prevTree = instance.subTree;
    const nextTree = renderComponentRoot(instance);
    instance.subTree = nextTree;
    patch(prevTree, nextTree, container);
  }
};
```

這是示意碼，但它把 Vue 的核心接起來了：render 時 `track`，state 改變時 `trigger`，scheduler 排入 component update，最後 renderer `patch`。

## `ref`、`computed`、`watch` 的底層角色

### `ref` 為什麼需要 `.value`

JavaScript 無法攔截區域變數本身的讀寫：

```js
let count = 0;
count++;
```

Vue 因此把值放進具有 getter / setter 的容器：

```js
function ref(initialValue) {
  let value = initialValue;

  return {
    get value() {
      track(/* ref dependency */);
      return value;
    },
    set value(nextValue) {
      if (!Object.is(value, nextValue)) {
        value = nextValue;
        trigger(/* ref dependency */);
      }
    },
  };
}
```

模板與某些 reactive object property 會幫忙解包 ref，但一般 JavaScript 中仍需明確使用 `.value`。不要把「模板可省略 `.value`」誤解成 ref 本身不是容器。

### `computed` 為什麼有快取

`computed` 本身會管理一個 reactive subscriber。重點不是單純「只算一次」，而是：

- dependency 沒變，多次讀取可沿用先前結果。
- dependency 改變時，computed 先被標記為需要重新驗證／計算。
- 沒有人讀 computed 時，不必急著產生新值。
- 下一次讀取 `.value` 時，才取得最新結果並建立外層依賴關係。

```js
const total = computed(() => price.value * quantity.value);
```

如果 template 使用 `total`，component render effect 訂閱的是 computed；而 computed 自己再訂閱 `price` 和 `quantity`。這形成一條 dependency graph。

### `watchEffect` 與 `watch` 差在哪一層

兩者最後都建立 reactive effect，但依賴來源不同：

- `watchEffect(fn)`：執行 `fn` 時自動收集同步讀到的 dependency。
- `watch(source, callback)`：先用 getter、ref、reactive object 或 source array 明確取得被觀察值，再比較新舊值後決定 callback。

`deep: true` 並不是 Proxy 收不到深層變更，而是 watcher 必須走訪深層屬性，才能在 effect 執行期間讀到它們並建立 dependency。深層大型物件的 traversal 會有成本。

## Scheduler：為什麼連改三次只更新一次

```js
count.value++;
count.value++;
count.value++;
```

如果每次 setter 都立即重畫，會產生很多重複 render 和 DOM 操作。Vue 為 component render effect 設定 scheduler：dependency 觸發時先把 update job 放進 queue，同一個 job 在同一輪 flush 會被去重。

簡化概念如下：

```js
const queue = [];
const queuedJobs = new Set();
const resolvedPromise = Promise.resolve();
let flushing = false;

function queueJob(job) {
  if (!queuedJobs.has(job)) {
    queuedJobs.add(job);
    queue.push(job);
  }

  if (!flushing) {
    flushing = true;
    resolvedPromise.then(flushJobs);
  }
}

function flushJobs() {
  try {
    for (const job of queue) job();
  } finally {
    queue.length = 0;
    queuedJobs.clear();
    flushing = false;
  }
}
```

Vue 實作還會處理 job id、插入順序、pre/post callback、遞迴更新限制、flush 期間新增工作等細節。

### 為什麼通常由父元件先更新

父元件通常比子元件更早建立，因此 update job id 較小。queue 會維持適當順序，讓父元件先更新。

這有兩個重要效果：

- 父元件能先把新 props 傳給子元件。
- 如果父元件在更新期間卸載子元件，已排入 queue 的子元件更新可以跳過。

### 一次更新的大致順序

可先用這個實務模型記憶：

```txt
同步 JavaScript 修改 state
  ↓
排入去重後的 jobs
  ↓ microtask
pre-flush watcher
  ↓
component render / patch（大致父 → 子）
  ↓
post-flush watcher 與 updated hooks
  ↓
await nextTick() 後續程式
```

巢狀元件與同一輪新增 job 會讓精確順序更複雜，實務上應依 API 保證來設計，不要依賴未公開的私有排序細節。

### Watcher 的 `flush`

```js
watch(source, callback, { flush: "pre" });  // 預設
watch(source, callback, { flush: "post" });
watch(source, callback, { flush: "sync" });
```

- `pre`：在擁有這個 watcher 的元件 DOM 更新前執行，適合狀態協調。
- `post`：等元件 DOM 更新後執行，適合讀取更新後 DOM。
- `sync`：同步執行，不做一般批次合併；高頻 mutation 時要小心成本。

## `nextTick()` 到底在等什麼

修改 reactive state 後，JavaScript 中的值已經改了，但 DOM patch 通常仍在 queue 裡：

```js
count.value++;

console.log(count.value); // 新值
console.log(el.textContent); // 可能仍是舊 DOM

await nextTick();
console.log(el.textContent); // Vue 這輪 DOM 更新已完成
```

`nextTick()` 本質上是等待目前的 scheduler flush promise；如果沒有進行中的 flush，則使用已 resolve 的 Promise。它不是固定等待某個毫秒數，也不是 `setTimeout()`。

需要在 DOM 更新後執行副作用時，`flush: "post"` 的 watcher 往往比在 watcher 裡反覆手動 `nextTick()` 更能表達意圖。

## Renderer 的 `patch()` 在做什麼

renderer 會先判斷新舊 VNode 的類型：

```txt
patch(oldVNode, newVNode)
  ├─ Text → processText
  ├─ Comment → processComment
  ├─ Fragment → processFragment
  ├─ Element → processElement
  ├─ Component → processComponent
  ├─ Teleport → 交給 Teleport 實作
  └─ Suspense → 交給 Suspense 實作
```

如果新舊 VNode 的 `type` 或 `key` 不同，就不適合原地 patch，通常會卸載舊節點並掛載新節點。

### Element 初次 mount

對 element 而言，大致會：

1. 呼叫宿主平台的 `createElement`。
2. mount 文字或 children VNode。
3. 設定 class、style、attribute、DOM property 與 event。
4. 執行 directive / transition 的對應 hook。
5. 把 element 插入 container。

### Element 更新

`patchElement` 主要比較：

- props 是否新增、改變或移除。
- children 是 text、array 還是空值。
- compiler 是否提供 patch flag，讓 runtime 走更窄的更新路徑。

DOM property 和 HTML attribute 不總是相同。例如 input 的 `value` 通常需要用 property 更新；`data-*` 多半走 attribute。Vue 的 `runtime-dom` 會統一處理這些平台細節。

### 事件為什麼不一定每次 remove 再 add

更新 `@click` handler 時，Vue 可以在 DOM 元素上維持一個 invoker，原生 listener 仍指向 invoker，只替換 invoker 內目前要執行的 handler。

這能降低反覆 `removeEventListener` / `addEventListener`，也便於處理多個 handler 與事件更新時機。

## Keyed Diff：列表如何更新

Vue 3 對 keyed children 的核心目標是：

- 能沿用的節點就 patch。
- 新節點才 mount。
- 消失的舊節點才 unmount。
- 必須移動時，盡量減少 DOM move。

假設：

```txt
old: a b c d e
new: a c b e f
```

演算法可以用五段理解。

### 1. 從頭同步

從左右兩邊的開頭開始，只要 `type + key` 相同就直接 patch。

上例的 `a` 可以先確定沿用。

### 2. 從尾同步

再從尾端往前比，相同就 patch。真實資料常只在頭尾插入，這兩段 fast path 很划算。

### 3. 某一側先比完

- 舊列表先用完：剩下的新節點直接 mount。
- 新列表先用完：剩下的舊節點直接 unmount。

### 4. 處理未知中間區段

當中間兩邊都還有節點時：

1. 建立 `new key → new index` map。
2. 走訪舊節點，找到它在新列表的位置。
3. 找不到的舊節點直接 unmount。
4. 找到的節點先 patch，並記錄新舊 index 對應。

### 5. 最長遞增子序列減少移動

Vue 從 index 對應中求 Longest Increasing Subsequence（LIS）。LIS 中的節點相對順序已經正確，可以留在原位；不在 LIS 中但仍存在的節點才需要移動。

最後通常從右往左處理，因為右側已經可以作為插入或移動的 anchor。

### 為什麼不能用 array index 當 key

若列表會插入、刪除或排序，index 描述的是「位置」，不是資料「身分」。資料移位後，同一個 key 可能被套到另一筆資料，導致：

- component local state 跟錯資料。
- input 值或游標狀態錯置。
- transition 行為不正確。
- Vue 無法正確判斷該沿用、移動還是重建誰。

穩定且唯一的資料 id 才是理想 key。沒有 stable id、而且列表永遠不重排的純展示內容，才比較可能接受 index key。

## Component 怎麼決定要不要更新

父元件重新 render，不代表所有子元件都一定完整更新。遇到 component VNode 時，Vue 會評估：

- props 是否真的改變。
- children / slots 是否可能改變。
- compiler 提供了哪些動態資訊。
- HMR、directive、transition 等特殊條件。

若需要更新，子元件會接收 next VNode、更新 props / slots，再執行自己的 render effect。若不需要，則沿用既有 component instance 與 DOM。

這也是為什麼保持 props 穩定很重要：

```vue
<!-- 每個 child 都要自己比較 activeId -->
<ListItem
  v-for="item in list"
  :key="item.id"
  :id="item.id"
  :active-id="activeId"
/>

<!-- 父層先算成穩定 boolean，通常更容易跳過無關 child update -->
<ListItem
  v-for="item in list"
  :key="item.id"
  :id="item.id"
  :active="item.id === activeId"
/>
```

## Compiler 如何幫 Virtual DOM 加速

Vue 3 常被稱為 compiler-informed Virtual DOM：compiler 先分析模板，runtime 就不用把所有節點當成完全未知。

### Static caching / hoisting

不依賴 reactive state 的靜態內容可以被快取或提升，後續 render 沿用相同 VNode，renderer 看到新舊 VNode 是同一個 reference 時可以跳過。

大量連續靜態節點也可能被濃縮成 static vnode，以更低成本掛載。

### Patch Flags

例如只有 class 是動態的：

```vue
<div :class="{ active }">fixed text</div>
```

compiler 會在 VNode 留下類似 `CLASS` 的 flag。更新時 renderer 可以只處理 class，不必重新完整比較所有 props 與文字。

常見概念包括：

- `TEXT`：動態文字。
- `CLASS`：動態 class。
- `STYLE`：動態 style。
- `PROPS`：已知名稱的動態 props。
- `FULL_PROPS`：需要完整 props diff。
- `STABLE_FRAGMENT`、`KEYED_FRAGMENT`、`UNKEYED_FRAGMENT`：children 結構提示。

flag 的實際數值與內部細節不應當成 public API 使用。

### Block tree 與 `dynamicChildren`

block 代表內部結構相對穩定的一段模板。compiler 會把帶有 patch flag 的動態後代收集到 block 的 `dynamicChildren`。

```vue
<div>
  <header>完全靜態</header>
  <section>
    <p>{{ message }}</p>
  </section>
  <footer>完全靜態</footer>
</div>
```

重新渲染時，runtime 可以優先走訪扁平化後的動態節點，而不是每次遞迴比較所有靜態層級。

`v-if`、`v-for` 會改變結構，因此會形成新的 block 邊界，讓各自範圍內仍可維持可預測的動態節點集合。

### Cache handlers

模板中的事件 handler 在條件允許時可以被 compiler cache，避免每次 render 都產生新的 function reference，連帶減少子元件因 listener identity 改變而更新的機會。

## 常見語法糖在底層怎麼展開

### `v-model`

元件上的：

```vue
<CustomInput v-model="keyword" />
```

概念上是：

```vue
<CustomInput
  :model-value="keyword"
  @update:model-value="keyword = $event"
/>
```

因此 `v-model` 仍遵守 props down、events up，不是子元件偷偷直接修改父元件變數。

### `v-if`

`v-if` 是 structural directive，會改變要產生哪一個 VNode branch。條件切換時，舊 branch 可能被 unmount，新 branch 被 mount。

### `v-show`

`v-show` 通常保留同一個 DOM，只透過 directive 更新 display。它有較高的首次建立成本，但高頻切換通常比反覆 mount / unmount 更合適。

### Slot

slot 在底層通常以 function 形式交給子元件。子元件決定何時、在哪個 render context 呼叫，因此 scoped slot 才能把子元件資料傳給父層提供的 slot template。

slot function 應在合適的 render 階段被呼叫，Vue 才能正確追蹤 dependency 與套用 block optimization。

## 生命週期其實是 renderer 的時間點

生命週期不是獨立於渲染流程之外的魔法，而是 Vue 在特定 renderer 階段呼叫已註冊的 hooks。

```txt
setup
  ↓
beforeMount
  ↓
render + patch DOM
  ↓
mounted

state / props changed
  ↓
beforeUpdate
  ↓
render + patch DOM
  ↓
updated

unmount requested
  ↓
beforeUnmount
  ↓
停止 component effects、卸載 subTree
  ↓
unmounted
```

幾個實務重點：

- `setup()` 執行時還沒有完成 DOM mount。
- `onMounted()` 代表元件自己的 DOM 已建立，但不等於圖片、字型或所有非同步工作都載入完成。
- `onUpdated()` 不應再無條件修改會觸發自身 render 的 state，否則可能造成遞迴更新。
- 元件 unmount 時，Vue 會停止和 component scope 綁定的 render effect、computed 與同步建立的 watcher。

## `effectScope` 與自動清理

元件 setup 期間同步建立的 effect 會被收進元件的 effect scope，因此元件卸載時可以一起停止。

這也是 composable 不應隨意在脫離 component scope 的非同步 callback 中建立永久 watcher 的原因：若沒有被 scope 收集或手動停止，可能留下不需要的訂閱。

```js
const stop = watchEffect(() => {
  // ...
});

// 不再需要時
stop();
```

library 或複雜 composable 也可使用 `effectScope()` 集中管理多個 effect 的生命週期。

## `provide` / `inject` 為什麼可以跨很多層

`inject` 不需要中間每一層轉傳 props。概念上，每個 component instance 都有 `provides`，並能沿 parent chain 找到上層提供的 key。

當子元件第一次呼叫 `provide` 時，Vue 會讓它建立一層繼承自 parent provides 的物件。這樣：

- 沒覆寫的 key 可以沿原型鏈讀到祖先值。
- 子層提供同名 key 時只遮蔽自己的後代，不會修改祖先 provides。

`provide` 本身不會自動把普通值變成 reactive；若要讓後代響應更新，應提供 ref、reactive object 或 computed，並視需要搭配 `readonly()` 保護寫入入口。

## KeepAlive、Teleport、Suspense 的底層定位

### KeepAlive

`KeepAlive` 不是把 DOM 截圖存起來，而是快取 component VNode 與 component instance。切走時通常進入 deactivated 狀態並把 DOM 搬到暫存 container，而不是完整 unmount。

因此：

- local state 能保留。
- 再次顯示時走 activated，而非重新 mounted。
- 快取太多仍會占用記憶體。
- `include`、`exclude`、`max` 用來控制 cache 範圍。

### Teleport

Teleport 改變的是 DOM 插入位置，不改變 component tree 的邏輯親子關係。因此 props、inject、emit 與生命週期仍依原 component tree 運作。

### Suspense

Suspense 會協調具有非同步 dependency 的 subtree，先管理 pending branch 與 fallback branch，dependency 完成後再切換到 resolved content。它不是通用的 request cache。

## SSR Hydration 在做什麼

SSR 先在 server 產生 HTML；client 端拿到 HTML 後，不應整頁重建，而是讓 client VNode tree 對應並接管既有 DOM，補上事件與響應式更新能力，這個過程叫 hydration。

```txt
server component tree
  ↓ renderToString
HTML 傳到瀏覽器
  ↓
client 建立相同 VNode tree
  ↓ hydrate
沿用既有 DOM + 綁定互動能力
```

Hydration mismatch 常見原因：

- server 與 client 產生不同的時間、亂數或 locale 格式。
- render 階段直接讀 `window`、viewport、`localStorage`。
- 不合法 HTML 被瀏覽器自動修正結構。
- server request 之間錯誤共用 singleton state。
- client 初始資料與 server render 時不同。

解法的核心不是隱藏警告，而是讓 server 和 client 的第一次 render 保持 deterministic；瀏覽器專屬狀態可延後到 mounted 後處理。

## Scoped CSS 並不是真正的 Shadow DOM

```vue
<style scoped>
.title { color: red; }
</style>
```

compiler 會產生元件 scope id，並轉換 selector。概念上接近：

```css
.title[data-v-xxxx] { color: red; }
```

renderer 會在對應 DOM 上加 scope attribute。它是 selector rewrite，不是瀏覽器原生 Shadow DOM，所以仍需理解 cascade、specificity、`:deep()`、`:slotted()` 與全域樣式的影響。

## 常見錯誤可以怎麼從底層推理

### 改了 state，立刻讀 DOM 還是舊的

原因：state 是同步改變，component update 被 scheduler 放到 microtask queue。

處理：需要更新後 DOM 時使用 `await nextTick()`、`onUpdated()`，或 `flush: "post"` watcher。

### `computed` 裡呼叫 API 或改 state

原因：computed getter 可能因 dependency 與讀取時機重跑；它應描述衍生值，不適合承擔不可預測的 side effect。

處理：computed 保持純粹，API、storage、DOM 等副作用放在事件、watch 或明確 action。

### 替換 `reactive` 變數後畫面不更新

```js
let state = reactive({ count: 0 });
state = reactive({ count: 10 });
```

先前使用者訂閱的是舊 proxy 上的 property。重新指定區域變數，不會自動把既有訂閱搬到新 proxy。

處理：維持同一個 reactive object 並修改 property，或需要整體替換時使用 `ref`：

```js
const state = ref({ count: 0 });
state.value = { count: 10 };
```

### `watch` 沒有偵測到預期內容

```js
watch(state.count, callback); // 傳入的是當下 number，不是 reactive source
```

應傳 ref 或 getter：

```js
watch(() => state.count, callback);
```

### List input 狀態亂掉

原因：key 不穩定，renderer 把「位置相同但資料身分不同」的節點當成可沿用。

處理：使用資料自己的 stable unique id。

### 父層重畫造成很多子層更新

先檢查：

- 傳給子元件的 props 是否每次都建立新 object / array / function。
- slot 是否含有真正會變的 dependency。
- 子元件是否收到過大的 reactive object。
- 是否能在父層先算出更穩定、粒度更小的 props。
- 大型 immutable data 是否適合 `shallowRef()` / `shallowReactive()`。

不要一開始就到處加 `v-memo`；先找出 dependency 與 prop stability 問題。

## 除錯響應式更新

開發模式可以使用 render debugging hooks：

```js
import { onRenderTracked, onRenderTriggered } from "vue";

onRenderTracked((event) => {
  console.log("render tracked", event);
});

onRenderTriggered((event) => {
  console.log("render triggered", event);
});
```

- `onRenderTracked`：這次 render 追蹤了哪個 dependency。
- `onRenderTriggered`：哪個 mutation 觸發元件重新 render。

`computed`、`watch`、`watchEffect` 也支援開發期的 `onTrack` / `onTrigger` 選項。再搭配 Vue Devtools 的 component update 與 performance 資訊，比憑感覺猜「Vue 怎麼一直重畫」有效。

## 面試時如何回答 Vue 更新流程

可以用這段作為骨架：

> Vue 會先把 template 編譯成 render function。元件首次掛載時，render function 在 reactive effect 中執行，因此會追蹤本次 render 讀到的狀態。狀態改變後，Proxy 或 ref setter 會觸發相關 dependency，但元件通常不會同步重畫，而是由 scheduler 把 update job 去重並排進 microtask。flush 時重新執行 render function 產生新 VNode tree，renderer 再用新舊 VNode 做 patch。列表的 keyed diff 會搭配 key map 與最長遞增子序列減少移動，而 compiler 也會透過 static caching、patch flags 與 block tree，讓 runtime 跳過靜態內容。

若能接著解釋 `nextTick`、stable key 與 computed cache，通常就已經不是只停留在 API 層。

## 建議的原始碼閱讀順序

第一次不建議照 repository 目錄從頭讀到尾，可以沿著一次更新流程：

1. `packages/reactivity/src/reactive.ts`：proxy 建立與 cache。
2. `packages/reactivity/src/baseHandlers.ts`：object / array 的 proxy traps。
3. `packages/reactivity/src/effect.ts`：effect、track、trigger、dependency。
4. `packages/reactivity/src/ref.ts`、`computed.ts`：ref 與 computed。
5. `packages/runtime-core/src/component.ts`：component instance 與 setup。
6. `packages/runtime-core/src/renderer.ts`：mount、patch、component render effect、keyed diff。
7. `packages/runtime-core/src/scheduler.ts`：queue、flush 與 `nextTick`。
8. `packages/runtime-dom/src/patchProp.ts`：DOM props、attrs、class、style、event。
9. `packages/compiler-core/src/parse.ts`、`transform.ts`、`codegen.ts`：模板編譯。
10. `packages/compiler-sfc`：最後再讀 SFC 與 `<script setup>` 的整合。

每次只追一個問題，例如：

- `count.value++` 最後怎麼走到 component update？
- `v-for` reorder 為什麼只移動兩個 DOM？
- `await nextTick()` resolve 前 scheduler 做完了什麼？
- `<script setup>` 的 macro 最後被轉成什麼？

帶著問題追 call path，會比背 function name 更容易建立長期記憶。

## 總結

Vue 3 底層最重要的不是記住所有私有 function，而是建立這個因果鏈：

```txt
compiler 分析模板
  ↓
render function 建立 VNode
  ↓
render effect 收集 reactive dependency
  ↓
state mutation 觸發 dependency
  ↓
scheduler 合併並排序更新
  ↓
renderer 比較新舊 VNode
  ↓
patch 真實 DOM
```

遇到響應式失效、DOM 時機、列表錯位或不必要更新時，都可以回到這條鏈，判斷問題發生在：

- 沒有正確收集 dependency。
- dependency 有觸發，但 job 尚未 flush。
- VNode 身分或 key 不正確。
- compiler 無法提供足夠的穩定資訊。
- renderer 已更新，但你在錯誤的生命週期讀取 DOM。

## 參考資料

- [Vue 官方：Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Vue 官方：Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism)
- [Vue 官方：Reactivity API](https://vuejs.org/api/reactivity-core.html)
- [Vue Core：reactivity source](https://github.com/vuejs/core/tree/main/packages/reactivity/src)
- [Vue Core：renderer source](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/renderer.ts)
- [Vue Core：scheduler source](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts)
- [Vue Core：compiler source](https://github.com/vuejs/core/tree/main/packages/compiler-core/src)
