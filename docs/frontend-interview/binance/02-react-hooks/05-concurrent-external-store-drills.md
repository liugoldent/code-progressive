---
sidebar_position: 5
sidebar_label: "Concurrent UI / External Store"
slug: "/frontend-interview/binance/react-concurrent-external-hooks-drills"
title: "React Hooks 六題實戰：Concurrent UI / External Store"
description: "useTransition、useDeferredValue、useSyncExternalStore 各六題，練習 urgent 與 non-blocking 更新、延後值、external store snapshot 與 SSR。"
tags:
  - React
  - Hooks
  - Concurrent
  - External Store
keywords: ["useTransition 題目", "useDeferredValue 題目", "useSyncExternalStore 題目", "React concurrent UI"]
---

# React Hooks 六題實戰：Concurrent UI / External Store

[回到 Hooks 六題題庫](/docs/frontend-interview/binance/react-hooks-six-drills-index)

這三個 Hook 都不是 debounce，也不會讓昂貴 JavaScript 自動變快。它們處理的是 React 更新優先級、延後顯示與外部訂閱的一致性。

## `useTransition`：把 state update 標成 non-blocking

`useTransition` 用來告訴 React：**某一批 state update 不需要立刻完成，可以先讓更急的互動更新。**

例如搜尋商品時，畫面其實有兩種不同優先級的更新：

- 使用者剛輸入的文字要立刻出現在 input，這是 **urgent update**。
- 數千筆搜尋結果可以稍後再更新，這是 **non-blocking update**。

如果兩者一起觸發昂貴的 render，使用者可能每打一個字都感覺輸入框卡住。`useTransition` 可以把結果區的更新降成較低優先級，讓 React 優先處理新的按鍵、點擊等互動。

### 基本語法

```tsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSomeState(nextValue);
});
```

- `startTransition(callback)`：將 callback 中同步排入的 state updates 標記為 Transition。
- `isPending`：這次 Transition 尚未完成時為 `true`，可以用來顯示「結果更新中」。

:::warning 最重要的觀念

**`startTransition` 的 callback 會立即、同步執行。它主要標記的是 React state update，不是把 callback 變成背景工作。**

`startTransition` 不是計時器、`setTimeout` 或 Web Worker。React 不會等到瀏覽器有空才呼叫 callback，也不會把 callback 裡的 JavaScript 搬到另一條 thread。

```tsx
console.log("A");

startTransition(() => {
  console.log("B");
  setQuery(nextQuery); // 只有這個 React update 被標記為 Transition
});

console.log("C");

// 執行順序：A → B → C
```

因此下面的 `expensiveFilter()` 仍然會立即占用 main thread、阻塞 event handler：

```tsx
startTransition(() => {
  const results = expensiveFilter(products, nextQuery); // 仍是同步工作
  setResults(results); // 這個 state update 才是 Transition
});
```

真正被改變的是 React 對 `setQuery`、`setResults` 等更新所觸發 render 的排程優先級。Transition 讓 React 可以優先處理更急的互動，並中斷或放棄過時的低優先級 render；它不會讓普通 JavaScript 自動變快或變成背景工作。

:::

### 實際案例：商品搜尋

假設 `ProductList` 需要 render 很多商品。不要讓同一份 state 同時控制輸入框與昂貴結果，而是把它拆成兩份：

```tsx
import { memo, useState, useTransition } from "react";

type Product = {
  id: string;
  name: string;
};

const ProductList = memo(function ProductList({
  products,
  query,
}: {
  products: Product[];
  query: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const matchedProducts = products.filter((product) =>
    product.name.toLowerCase().includes(normalizedQuery),
  );

  return (
    <ul>
      {matchedProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
});

export function ProductSearch({ products }: { products: Product[] }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;

    // Urgent：受控 input 必須立刻反映使用者輸入。
    setInput(next);

    // Non-blocking：大型結果區可以稍後追上最新輸入。
    startTransition(() => {
      setQuery(next);
    });
  }

  return (
    <section>
      <label>
        搜尋商品
        <input value={input} onChange={handleChange} />
      </label>

      {isPending && <p>搜尋結果更新中...</p>}

      <ProductList products={products} query={query} />
    </section>
  );
}
```

這個案例的更新流程是：

```txt
使用者輸入
├─ setInput(next)              → urgent，input 立即顯示新文字
└─ startTransition(...)
   └─ setQuery(next)           → non-blocking，驅動大型結果區
```

當使用者連續輸入時，React 可以先處理最新的 `input`，並中斷或放棄尚未 commit 的舊 `query` render，讓結果直接追上較新的內容。`ProductList` 加上 `memo`，也能在 urgent render 中以 props 未變為由跳過結果區，等 Transition 更新 `query` 時再重新 render。

這不表示篩選或 render 變快了，而是 React 有機會先完成更重要的互動。若 `products.filter(...)` 本身就是一段長時間、不可切割的同步 JavaScript，它執行時仍會占住 main thread；這種瓶頸仍要靠改善演算法、列表 virtualization 或 Web Worker 處理。

### 什麼適合放進 Transition？

可以用這個問題判斷：**這次更新晚一點顯示，使用者是否仍能正確操作？**

通常適合：

- 大型搜尋或篩選結果
- 複雜圖表
- 大量列表
- 大型頁籤內容切換

通常不適合：

- controlled input 的 `value`
- checkbox 是否勾選
- focus、pressed 等立即互動狀態
- 必須立即顯示的表單錯誤

最後要記住：Transition 解決的是 **React 更新優先級**，不是 debounce、網路 loading，也不是把 JavaScript 搬到背景執行。

### 1. 為何輸入仍然卡住？

```tsx
function handleChange(event) {
  const next = event.target.value;
  setInput(next);
  const rows = slowFilter(products, next);
  startTransition(() => setRows(rows));
}
```

<details>
<summary>答案</summary>

`slowFilter` 在 `startTransition` 之前同步執行，仍阻塞 event handler。Transition 只標記 callback 內排入的 React updates，不會延後 callback 外的普通 JavaScript。應讓昂貴 render 發生在 transition state 更新之後，或把純 CPU 工作移到 worker/更合適的演算法。

關鍵是拆開「立即顯示按鍵」和「可以稍後完成的結果」：input 的 `setInput(next)` 維持 urgent，`startTransition(() => setQuery(next))` 只更新篩選條件，讓昂貴列表在可中斷的 background render 中計算。新按鍵進來時，React 可以放棄尚未 commit 的舊結果，直接追最新 query。

但 Transition 只是 React 排程，不會讓一段同步函式自動可中斷。若單次 `slowFilter` 已長時間霸佔 event handler 或主執行緒，仍要改善演算法、virtualize 列表或移到 Web Worker。

</details>

### 2. Controlled input 的 value 可以只在 Transition 裡更新嗎？

```tsx
startTransition(() => setQuery(event.target.value));
return <input value={query} />;
```

<details>
<summary>答案</summary>

不應該。Controlled input 的 state 必須同步回應輸入，不能是 non-blocking update。拆成 urgent `input` 與 transition `query`：先 `setInput(next)`，再 transition `setQuery(next)` 讓昂貴結果追上。

```tsx
function handleChange(event) {
  const next = event.target.value;
  setInput(next);
  startTransition(() => setQuery(next));
}
```

`input` 是 DOM value 的 source of truth，因此每個 keystroke 都要立刻 commit；`query` 只驅動可延後的結果區。也可以只保存 input，再讓結果區讀 `useDeferredValue(input)`，避免自己維護兩份值。

#### 補充：`useDeferredValue` 是什麼？

`useDeferredValue` 是 React 的 concurrent Hook，用來讓畫面中**優先級較低的 consumer 暫時沿用某個 value 的舊版本**。它不會延後原本 state 的更新；`input` 仍會立即變成最新值，只是昂貴的結果區可以先讀 `deferredQuery`，等 React 有空時再於 background render 中追上。

```tsx
function ProductSearch({ products }) {
  const [input, setInput] = useState("");
  const deferredQuery = useDeferredValue(input);
  const isStale = input !== deferredQuery;

  return (
    <section>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <div aria-busy={isStale} style={{ opacity: isStale ? 0.6 : 1 }}>
        <ProductList products={products} query={deferredQuery} />
      </div>
    </section>
  );
}
```

一次輸入大致會經過兩次 render：

```txt
使用者輸入 "re"
├─ urgent render
│  ├─ input = "re"                 → 輸入框立刻更新
│  └─ deferredQuery = "r"          → 結果區暫時顯示舊結果
└─ background render
   └─ deferredQuery = "re"         → 結果區追上最新輸入
```

如果追趕途中又輸入新字，React 可以中斷尚未 commit 的 background render，改為追最新值。因此它表達的是「這部分 UI 可以落後」，不是固定延遲幾毫秒，也不是 debounce。它沒有 `isPending`；需要提示畫面正在追上時，可以比較 `input !== deferredQuery`。

和 `useTransition` 的差別可以從控制位置理解：

- `useTransition`：在產生 state update 的地方，把某次更新標成 non-blocking，並提供 `isPending`。
- `useDeferredValue`：在消費 value 的地方取得可落後的版本；適合只有一份 urgent state，或無法控制 value 是在哪裡更新的情況。

兩者都只調整 React render 的排程，不會讓昂貴計算本身變快，也不保證減少 API request。若要讓 urgent render 真正跳過昂貴結果區，通常還要把該 child 包成 `memo`，並確保其他 props 的 identity 穩定。

</details>

### 3. `isPending` 代表 request pending 嗎？

<details>
<summary>答案</summary>

它代表 Transition 尚未完成，不等同任何特定 fetch 狀態。若資料庫層已有 `isFetching`/navigation state，應依產品需求分別顯示。不要把所有 loading 都綁成一個 boolean。

Transition 可能只重算本地大列表，完全沒有 request；反過來，request 也可能仍在網路中，但目前沒有 transition render。實務上可分成 `isTransitionPending`、`isFetching`、`isSubmitting`，前者表達「畫面正在追上」，後兩者才是 I/O lifecycle。

</details>

### 4. Transition 會 debounce 多次輸入嗎？

<details>
<summary>答案</summary>

不會。React 可以中斷過時的 non-blocking render，優先處理最新 urgent update，但事件與 state update 仍可能每次發生；它不保證少打 API。限制 request 頻率仍用 debounce/throttle、cache 或 request cancellation。

Debounce 解決的是「隔多久才啟動工作」，Transition 解決的是「已啟動的 React render 要用什麼優先級」。搜尋欄可以同時使用兩者：即時更新 input、以 Transition 保持結果 render 順暢，再 debounce API 以減少流量。

</details>

### 5. `await` 後的 setState 仍屬於同一 Transition 嗎？

```tsx
startTransition(async () => {
  const data = await save();
  setResult(data);
});
```

<details>
<summary>答案</summary>

在 React 18 的心智模型中，`await` 後的更新需要再包一次 `startTransition` 才能明確標為 Transition；目前 React 新版 Actions 改善了 async transition 流程，但回答時仍要先確認專案版本。這個 repo 是 React 18，不應直接套用 React 19 行為。

```tsx
startTransition(async () => {
  const data = await save();
  startTransition(() => setResult(data));
});
```

這也不代表 Transition 接管了 request error、取消與 race condition；那些仍屬於 action 或資料層。面試時先說明版本，再解釋 `await` 是一條 async boundary，會比背一句「可以／不可以」更完整。

</details>

### 6. 什麼時候完全不需要 Transition？

<details>
<summary>答案</summary>

更新很便宜、沒有可感知輸入延遲，或真正瓶頸是網路/同步 CPU 時不需要。先修資料結構、縮小 render tree、virtualize 或 cache；Transition 是 UX scheduling 工具，不是通用效能補丁。

可以用一句話判斷：**這次更新若晚一點顯示，使用者是否仍能正確操作？**Controlled input、焦點、pressed 狀態、即時錯誤通常不能延後；大型 tab 內容或昂貴篩選結果則可能適合。沒有實際卡頓時，加入雙重狀態與 pending UI 只會增加複雜度。

</details>

## `useDeferredValue`：讓非關鍵 consumer 暫時使用舊值

> 實際案例：[useDeferredValue：輸入框立即更新，昂貴結果稍後追上](/docs/frontend-interview/binance/practical-cases/use-deferred-value)

### 它是等待一段時間後才更新嗎？

不是。`useDeferredValue` 沒有計時器，也不能設定 `300ms` 之類的等待時間。更精確的心智模型是：

> Urgent update 發生時，React 允許 deferred value 暫時沿用「上一次已 commit 的值」，同時在 background render 嘗試讓它追上最新 value。

```tsx
const [input, setInput] = useState("");
const deferredQuery = useDeferredValue(input);
```

假設畫面原本已經 commit：

```txt
input = "B"
deferredQuery = "B"
```

使用者再輸入 `T` 時，大致會經過：

```txt
第一階段：urgent render
├─ input = "BT"                 → controlled input 立即顯示新文字
└─ deferredQuery = "B"          → 結果區暫時沿用上次 commit 的值

第二階段：background render
└─ deferredQuery = "BT"         → background render 完成後才 commit 新結果
```

如果第二階段尚未完成，使用者又輸入 `C`，React 可以放棄過時的 `"BT"` background render，改為嘗試讓 `deferredQuery` 直接追上 `"BTC"`。因此中間值不保證每個都會 commit，追上速度也由 React 排程與實際 render 成本決定，不是「時間到就更新」。

這也表示它不是 debounce：

- `useDeferredValue`：調整 React render 的相對優先級，讓 UI consumer 可以暫時讀舊值。
- debounce：等待明確時間，例如停止輸入 `300ms` 後才執行工作。

若需求是減少搜尋 API 次數，仍要使用 debounce、cache 或 request cancellation；`useDeferredValue` 不提供 request 次數或延遲時間保證。

### `useTransition` 和 `useDeferredValue` 怎麼選？

兩者底層都在表達「這部分 React UI 可以晚一點完成」，主要差別在控制位置：

| 比較 | `useTransition` | `useDeferredValue` |
| --- | --- | --- |
| 放在哪一端 | 產生 state update 的地方 | 消費 value 的地方 |
| 控制方式 | `startTransition(() => setState(...))` | `const deferred = useDeferredValue(value)` |
| 適用時機 | 能控制 setter，想標記某次更新 | 已經拿到 value，只想讓某個 consumer 晚點追上 |
| pending 狀態 | 提供 `isPending` | 沒有；可比較 `value !== deferredValue` |
| 搜尋案例 | 常拆成 urgent `input` 和 transition `query` | 可以只保存 `input`，列表讀 `deferredInput` |

#### 能控制更新：使用 `useTransition`

```tsx
const [input, setInput] = useState("");
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

function handleChange(event) {
  const next = event.target.value;

  setInput(next); // urgent
  startTransition(() => {
    setQuery(next); // non-blocking
  });
}

return <SlowProductList query={query} />;
```

這種寫法適合你擁有更新 action、想明確指定哪個 state update 是 non-blocking，並需要 `isPending` 顯示追趕狀態。

#### 只想延後 consumer：使用 `useDeferredValue`

```tsx
const [input, setInput] = useState("");
const deferredInput = useDeferredValue(input);
const isStale = input !== deferredInput;

return (
  <>
    <input value={input} onChange={event => setInput(event.target.value)} />
    <SlowProductList query={deferredInput} />
  </>
);
```

這種寫法適合 source value 必須立即更新，但只有某個昂貴 consumer 可以落後；也適合 value 由 props、context 或第三方 Hook 提供，無法控制它原本的 setter。

可以用下面的問題快速判斷：

```txt
我能控制產生這次 state update 的地方嗎？
├─ 能，而且想標記「這次更新」可以延後
│  └─ useTransition
└─ 不能，或只想讓「某個 consumer」晚點追上
   └─ useDeferredValue
```

同一條資料流程通常選最能表達 ownership 邊界的一種即可，不需要同時套兩層。若昂貴 child 沒有 `memo` 邊界，parent 的 urgent render 仍可能呼叫它；要真正跳過舊值未變時的昂貴 child，還要確保 component 被 memoize，其他 props identity 也維持穩定。

### 1. 第一次 render 會拿到什麼？

```tsx
const deferredQuery = useDeferredValue(query);
```

<details>
<summary>答案</summary>

初次 render 的 deferred value 與傳入 value 相同。之後 query 更新時，React 先用新 query、舊 deferredQuery render urgent UI，再在 background 嘗試讓 deferredQuery 追上。

第一次沒有「舊值」可以沿用，所以不會先得到 `undefined`。後續背景 render 可以被更新的 query 中斷，最後直接跳到最新值；中間值不保證全部 commit。這是相對優先級，不是固定延遲幾毫秒。

</details>

### 2. 如何顯示「結果正在追上」？

```tsx
const isStale = query !== deferredQuery;
```

<details>
<summary>答案</summary>

可用這個差異降低舊結果 opacity 或顯示 subtle pending indicator。不要把舊結果冒充新查詢結果；UI 要清楚表達它暫時落後。

```tsx
<section aria-busy={isStale} style={{ opacity: isStale ? 0.6 : 1 }}>
  <Results query={deferredQuery} />
</section>
```

若舊結果仍可點擊，要確認 item identity 與操作語意仍安全；不能讓使用者以為正在操作新 query，實際卻對舊資料送出寫入。

</details>

### 3. 它會減少 fetch 次數嗎？

<details>
<summary>答案</summary>

不保證。若 Effect/query 依賴 deferred value，快速輸入可能使某些 background render 被中斷，但這不是具時間保證的 debounce。需要「停 300ms 才請求」仍要 debounce；server-state library 還要搭配 cache/cancel。

被 React 放棄的 render 不等於已啟動的外部 I/O 必然取消。API 搜尋仍應使用 AbortController 或 query library 處理舊 request、dedupe 與 cache；Deferred Value 只負責 consumer render 可以暫時讀舊值。

</details>

### 4. 傳入每次新建的 object 有什麼問題？

```tsx
const deferredFilters = useDeferredValue({ symbol, side });
```

<details>
<summary>答案</summary>

每次 render 都是新 reference，即使欄位沒變也像新 value，容易產生不必要 background render。優先 defer primitive 或已穩定、語意明確的 value。

`useDeferredValue` 以 `Object.is` 判斷輸入是否變動，`Object.is({},{})` 是 `false`。可分別傳遞真正變動的 primitives，或只在 `symbol`、`side` 改變時建立 memoized filters；否則 unrelated render 也會安排一次無意義的追趕。

</details>

### 5. 它和 `useTransition` 怎麼選？

<details>
<summary>答案</summary>

能控制 setter 時，用 Transition 標記「這個更新可延後」並取得 `isPending`；只拿到一個 value、無法控制它在哪裡被 set 時，consumer 可用 deferred value。兩者都是 scheduling，不是固定毫秒 delay。

換成 ownership 說法：`startTransition` 放在「發出更新」的一端，`useDeferredValue` 放在「消費輸入」的一端。通常挑最能清楚表達邊界的一種即可，不需要為同一條資料同時套兩層延後。

</details>

### 6. Deferred child 為何仍每次 render？

<details>
<summary>答案</summary>

Deferred value 讓它有機會先維持舊值，但若 child 沒有 memo 邊界，parent urgent render 仍會呼叫 child。把昂貴 consumer 抽成 `memo` component，並只傳 deferred value 與穩定 props，才能實際跳過 urgent pass 的昂貴工作。

`memo` 比較的是所有 props。即使 deferred query 沒變，只要同時傳入每次新建的 options object 或 callback，child 仍會 render。完整優化邊界是：昂貴 child 被 memoize、deferred prop 保持舊 reference，其他 props 也具穩定 identity。

</details>

## `useSyncExternalStore`：把 React 接到外部 mutable source

> 實際案例：[useSyncExternalStore：訂閱 React 外部的即時行情 store](/docs/frontend-interview/binance/practical-cases/use-sync-external-store)

### 做題前：React 不會自動知道普通 JavaScript store 變了

WebSocket client、browser online status 或第三方 store 可以在 React event 之外改變。Component 直接呼叫 `store.getSnapshot()` 只是在這次 render 讀一次值；之後 store 變動，React 沒收到通知，就不會重新 render。

`useSyncExternalStore` 要求外部 source 提供正式 contract：

```tsx
const snapshot = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot?,
);
```

| 參數 | 外部 store 必須保證什麼 |
| --- | --- |
| `subscribe(callback)` | store 改變時呼叫 callback，並回傳 unsubscribe |
| `getSnapshot()` | 回傳目前不可變 snapshot；同一版本沒變時 reference 必須相同 |
| `getServerSnapshot()` | 選填；SSR 與 hydration 第一刻可重現的 snapshot |

最小 store 可以長這樣：

```tsx
let price = 100;
const listeners = new Set<() => void>();

const tickerStore = {
  getSnapshot: () => price,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  update(nextPrice: number) {
    price = nextPrice;
    listeners.forEach((listener) => listener());
  },
};

function Price() {
  const price = useSyncExternalStore(
    tickerStore.subscribe,
    tickerStore.getSnapshot,
    () => 100,
  );

  return <span>{price}</span>;
}
```

```text
WebSocket message
  → store 建立新版本
  → subscribe callbacks 通知 React
  → React 呼叫 getSnapshot
  → snapshot 確實改變才 render/commit
```

React 還能在 concurrent render 與 commit 間重新檢查 snapshot，降低同一畫面不同區塊讀到不同 store version 的風險。但 Hook 不負責 WebSocket reconnect、資料驗證、sequence gap、cache policy 或 selector 粒度；那些仍是 store adapter 的責任。

Object snapshot 若每次呼叫都 `{ ...current }`，即使內容沒變 reference 也不同，會造成持續更新。應在 store 真正變動時才建立並快取新 immutable snapshot。

> 一句話記憶：外部 store 負責穩定 snapshot 與變更通知，`useSyncExternalStore` 負責讓 React 安全地訂閱它。

官方參考：[React `useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)

### 1. 直接讀 store 為何不會更新？

```tsx
function Price() {
  return <span>{tickerStore.getSnapshot().price}</span>;
}
```

<details>
<summary>答案</summary>

React 不追蹤普通 object 或 method call。外部 store 必須提供 subscribe notification，component 再用 `useSyncExternalStore(subscribe, getSnapshot)` 訂閱；store 改變時通知 React 重新讀 snapshot。

這個 Hook 同時建立兩份 contract：`subscribe` 在 store 變動時通知並回傳 unsubscribe；`getSnapshot` 在 render 時提供目前不可變版本。React 還能在 commit 前重新檢查 snapshot，避免 concurrent render 期間 store 改變造成畫面不同區塊讀到不同版本。

</details>

### 2. `getSnapshot` 每次回新 object 會怎樣？

```tsx
const getSnapshot = () => ({ ...store.current });
```

<details>
<summary>答案</summary>

即使資料沒變，每次 reference 都不同，React 會認為 snapshot 持續改變，造成不必要 render，甚至 infinite loop 警告。Store 應在資料真的變時建立新 immutable snapshot，沒變時回同一 reference。

錯誤核心不是 spread，而是違反「同一 store version 必須回同一 reference」的 contract。若底層 store mutable，可以在資料改變時產生並快取 immutable snapshot；若 component 只要 price，也可讓 snapshot 直接回傳 primitive。

</details>

### 3. `subscribe` function 每次 render 都新建會怎樣？

```tsx
useSyncExternalStore(
  callback => store.subscribe(symbol, callback),
  () => store.get(symbol),
);
```

<details>
<summary>答案</summary>

新的 subscribe identity 可能讓 React 重新訂閱。可把不依 props 的 function 定義在 component 外；若依 symbol，封裝成 custom Hook 並用 `useCallback`/store API 管理 identity，同時確保 symbol 改變確實切換訂閱。

React 會先解除舊 subscription 再建立新 subscription。高頻 render 下不只浪費工作，某些 event source 還可能在切換空檔漏事件。Cleanup 必須精確移除當初加入的同一 listener，不能只靠全域 `removeAllListeners`。

</details>

### 4. 第三個 `getServerSnapshot` 做什麼？

<details>
<summary>答案</summary>

提供 server render 與 hydration 初始讀值。Server 回傳值必須能在 client hydration 時重現，通常要把 server snapshot 序列化進 HTML；否則會 hydration mismatch。純 client component 才可省略 SSR 策略。

例如 server 先回 `offline`，client hydration 第一刻卻讀到 `online`，兩棵 tree 就可能不一致。先用 HTML 中的 bootstrap snapshot 完成 hydration，之後再由正式 subscription 通知最新 client 狀態，才是穩定流程。

</details>

### 5. 它會自動解決 selector 粒度嗎？

<details>
<summary>答案</summary>

不會。若 snapshot 是整份 order book，任何新 reference 都可能更新所有 consumer。可以讓 store 提供更小 snapshot、使用 selector-aware 封裝，並保持未變 slice reference 穩定；Hook 只保證訂閱與 concurrent consistency。

Selector 本身也要 pure 且 identity 穩定。若每次從同一份 store 都 `map` 出新陣列，React 仍會認為結果改變。常見做法是 structural sharing、memoized selector，或使用支援 selector/equality function 的 external-store adapter。

</details>

### 6. WebSocket Hook 用了它就完成 production correctness 嗎？

<details>
<summary>答案</summary>

還沒有。它不負責 reconnect、sequence gap、snapshot + delta 合併、validation、batching、backpressure 或 auth refresh。它只建立 React 與外部 store 的正式讀取/通知契約；transport lifecycle 仍由 store 層設計。

較清楚的分層是：WebSocket/store 層負責連線、重試與產生 versioned immutable snapshot；React adapter 用 `useSyncExternalStore` 暴露訂閱；component 只讀業務 slice。如此 component mount/unmount 不會直接破壞共享連線，協定 correctness 也能獨立測試。

</details>

## 完成檢查

- Transition 標記更新優先級，不會延後 callback 外的同步工作。
- Deferred value 讓 consumer 暫時落後，不是 debounce。
- External store 必須同時滿足 subscribe、穩定 snapshot、必要時的 server snapshot。

[下一組：React 19 Hooks](/docs/frontend-interview/binance/react-19-hooks-drills)
