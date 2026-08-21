---
sidebar_position: 23
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

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

這三個 Hook 都不是 debounce，也不會讓昂貴 JavaScript 自動變快。它們處理的是 React 更新優先級、延後顯示與外部訂閱的一致性。

## `useTransition`：把 state update 標成 non-blocking

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

[下一組：React 19 Hooks](./21-react-19-hooks-drills.md)
