---
sidebar_position: 25
title: "第三方 Hooks 六題實戰：TanStack Query / Redux / Zustand"
description: "useQuery、useMutation、useQueryClient、useSelector、useDispatch、Zustand store Hook 各六題，練習 server cache、mutation、selector 與 global client state。"
tags:
  - React
  - TanStack Query
  - Redux
  - Zustand
  - Interview
keywords: ["useQuery 題目", "useMutation 題目", "useQueryClient 題目", "useSelector 題目", "useDispatch 題目", "Zustand 題目"]
---

# 第三方 Hooks 六題實戰：Server / Global State

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

先看 import。TanStack Query 管 server state/cache；Redux 與 Zustand 常用來管理 shared client state。它們不是三種可互換的 `useState`。

:::note 執行環境

本專案未安裝以下第三方套件，程式碼是閱讀與推導題。API 形狀以目前 TanStack Query、React Redux 與 Zustand 官方文件為準。

:::

## TanStack Query `useQuery`：訂閱一份 server cache

### 1. 切 symbol 後為何仍顯示 BTC 資料？

```tsx
const ticker = useQuery({
  queryKey: ["ticker"],
  queryFn: () => fetchTicker(symbol),
});
```

<details>
<summary>答案</summary>

`queryFn` 讀取的 symbol 會改變資料 identity，卻沒放進 key；所有 symbol 共用 `['ticker']` cache。改成 `queryKey: ['ticker', symbol]`。Query key 描述資料是誰，不只是「何時重跑」的 dependency。

</details>

### 2. `isPending` 與 `isFetching` 有何差別？

<details>
<summary>答案</summary>

`isPending` 表示還沒有成功資料的 pending status；`isFetching` 表示 queryFn 正在執行，包含第一次載入與背景 refetch。有舊資料且背景更新時，可繼續顯示資料並用小型 refreshing indicator，不必整頁退回 skeleton。

</details>

### 3. `staleTime` 與 `gcTime` 各控制什麼？

<details>
<summary>答案</summary>

`staleTime` 控制資料多久算 fresh，影響 mount/focus 等時機是否需要 refetch；`gcTime` 控制沒有 observer 的 inactive cache 保留多久。Fresh/stale 不等於 cache 存在/被刪除。

</details>

### 4. `enabled: false` 是「先不要自動跑」還是永久 button mode？

<details>
<summary>答案</summary>

它會停用自動執行，可用於 dependent query，例如 token 尚未存在；若產品真的是使用者按搜尋才送出，可把表單 draft 與 committed filters 分開，讓 query key 由 committed filters 驅動。長期靠 refetch 傳參數會失去 declarative cache identity。

</details>

### 5. 快速換 key 時如何取消舊 fetch？

```tsx
queryFn: ({ signal }) => fetch(url, { signal })
```

<details>
<summary>答案</summary>

使用 Query function context 的 AbortSignal 並傳給支援取消的 request。Query observer 切換/失效時 library 才能取消底層工作；即使 cache 可避免錯資料 identity，取消仍可省網路與不必要 side effect。

</details>

### 6. `initialData` 與 `placeholderData` 有何差別？

<details>
<summary>答案</summary>

`initialData` 進入 shared cache，預設仍可能視為 stale；`placeholderData` 只給目前 observer 暫時顯示，不寫入 cache。SSR/hydration、從列表 seed 詳情與純 skeleton placeholder 是不同需求，不應只看畫面相同就混用。

</details>

## TanStack Query `useMutation`：執行 server write

### 1. `useMutation` render 時會立刻 POST 嗎？

```tsx
const createOrder = useMutation({ mutationFn: postOrder });
```

<details>
<summary>答案</summary>

不會。Hook 建立 mutation observer 與操作函式；要在 event/Action 中呼叫 `createOrder.mutate(variables)` 或 `await createOrder.mutateAsync(variables)` 才執行。

</details>

### 2. `mutate` 與 `mutateAsync` 怎麼選？

<details>
<summary>答案</summary>

`mutate` 以 callbacks 處理結果並回傳 void，適合一般 event；`mutateAsync` 回傳 Promise，適合需要 compose/await 的流程，且必須自己 catch error。不要 `await mutate()` 後誤以為 server 已完成。

</details>

### 3. 成功後 query cache 會自動知道訂單已新增嗎？

<details>
<summary>答案</summary>

通常不會。Mutation 成功後要依 API 回應選擇 `invalidateQueries` 重新取得，或 `setQueryData` 直接更新已知結果。Server write 與讀取 cache 的一致性是你明確描述的關係。

</details>

### 4. Optimistic update 如何 rollback？

<details>
<summary>答案</summary>

`onMutate` 先 cancel 相關 queries、保存 previous cache、寫 optimistic data，並 return context；`onError` 用 context 還原；`onSettled` 再 invalidate 校正。還要處理多筆並行 mutation，不能只保存一個全域 previous array。

</details>

### 5. 使用者連點兩次，哪個 callback 先完成？

<details>
<summary>答案</summary>

Network 完成順序不保證等於呼叫順序。產品要決定 disable、允許並行、序列化 scope 或 idempotency；不能靠畫面上第二次點擊較晚就假設它最後成功。金融寫入還要用 server idempotency key。

</details>

### 6. Query retry 策略可直接套到 mutation 嗎？

<details>
<summary>答案</summary>

不應盲目套用。讀取通常可安全重試，寫入可能已在 server 成功但 client 丟失回應；沒有冪等保障時自動 retry 可能重複下單。先確認 HTTP method、idempotency key 與 server contract，再決定 mutation retry。

</details>

## TanStack Query `useQueryClient`：操作目前 Provider 的 cache client

### 1. 為何不能在 component render 中 `new QueryClient()`？

```tsx
function App() {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>...</QueryClientProvider>;
}
```

<details>
<summary>答案</summary>

每次 render 都換一個 client，cache 與 observer 邊界被重建。Browser app 通常建立穩定單例；SSR 則每個 request 建立隔離 client並正確 hydrate。`useQueryClient()` 會取得最近 Provider 的同一 instance。

</details>

### 2. `invalidateQueries({ queryKey: ['orders'] })` 會影響哪些 key？

<details>
<summary>答案</summary>

預設可用 prefix 匹配 `['orders']`、`['orders', symbol]` 等相關 queries；需要只命中完整 key 時使用 exact/filter 設定。先設計一致的 key factory，才不會 invalidate 太寬或漏掉。

</details>

### 3. `setQueryData` 可以 mutation 舊 cache object 嗎？

```tsx
client.setQueryData(["orders"], old => {
  old.push(newOrder);
  return old;
});
```

<details>
<summary>答案</summary>

不可以。Updater 要 immutable，回傳新 array/object，否則 observer 可能看不到 reference 變化，舊 cache snapshot也被改壞。改成 `old => [...(old ?? []), newOrder]`。

</details>

### 4. Render 中 `queryClient.getQueryData()` 會自動訂閱嗎？

<details>
<summary>答案</summary>

不會，它是 imperative cache read。Cache 之後更新不會因這一行讓 component render；UI 需要 reactive data 時使用 `useQuery`/相應 observer Hook。

</details>

### 5. `prefetchQuery` 與 `ensureQueryData` 的意圖有何不同？

<details>
<summary>答案</summary>

Prefetch 通常用於提前暖 cache，呼叫端不直接需要回傳資料；ensure 則要確保取得一份資料並回傳，可重用現有 cache。兩者都要用與 consumer 完全一致的 key/queryFn contract。

</details>

### 6. 多個 Provider 時會拿到哪個 client？

<details>
<summary>答案</summary>

和 Context 一樣，拿到 tree 上最近的 QueryClientProvider。Microfrontend 或測試若意外巢狀 Provider，invalidate 的可能是另一份 cache；debug 時要同時確認 query key 與 client identity。

</details>

## React Redux `useSelector`：訂閱 selector result

### 1. 為何任何 action 都讓 component render？

```tsx
const value = useSelector(state => ({
  symbol: state.trade.symbol,
  theme: state.ui.theme,
}));
```

<details>
<summary>答案</summary>

Selector 每次回新 object，而 `useSelector` 預設以嚴格 reference equality 比較結果。可拆成兩個 primitive selector、使用 memoized selector，或明確傳 `shallowEqual`；選擇要依實際 render 成本。

</details>

### 2. Selector 可以做 API 或修改 state 嗎？

<details>
<summary>答案</summary>

不可以。Selector 可能在 render 與每次 dispatch 被多次執行，必須純粹。昂貴 derived data 應用 memoized selector；副作用放 thunk/listener middleware/event flow。

</details>

### 3. `useSelector(state => state)` 有什麼代價？

<details>
<summary>答案</summary>

訂閱整個 root state，幾乎任何 reducer 更新都產生新 root reference，component 跟著 render。應只選 component 真正需要的最小 slice。

</details>

### 4. Selector 使用 prop id 時要注意什麼？

```tsx
const order = useSelector(state => state.orders.byId[id]);
```

<details>
<summary>答案</summary>

基本寫法可用，但資料可能在同一次更新中被刪除，selector 要防禦 `undefined`；昂貴 memoized selector若依 props，也要避免所有 component instance 共用會互相污染的單一 cache。

</details>

### 5. `React.memo` 能擋住 store subscription update 嗎？

<details>
<summary>答案</summary>

不能擋住 selector result 真正改變；memo 只處理 parent props。它可避免 parent unrelated render，但 store update 是否 render 由 selector result equality 決定。

</details>

### 6. 沒有 `<Provider store={store}>` 會怎樣？

<details>
<summary>答案</summary>

Hook 找不到 Redux Context 會拋錯。測試要用實際/測試 store Provider 包住 component；不要 mock `useSelector` 到失去真實 subscription 行為。

</details>

## React Redux `useDispatch`：取得 store dispatch

### 1. 呼叫 `dispatch` 本身會讓目前 component render 嗎？

<details>
<summary>答案</summary>

不直接。Dispatch 把 action 送進 store；reducers 產生新 state後，只有 selector result 改變的 subscribers 才需要 render。目前 component 若沒有訂閱 state，可能完全不 render。

</details>

### 2. 可以在 render 中 dispatch 嗎？

<details>
<summary>答案</summary>

不可以。Render 必須純粹，render → dispatch → store update → render 容易形成循環。Dispatch 放 event handler、effect（真正同步需求）或資料流程 middleware。

</details>

### 3. `dispatch` 要放進 Effect dependency 嗎？

```tsx
const dispatch = useDispatch();
useEffect(() => {
  dispatch(loadOrders(symbol));
}, [dispatch, symbol]);
```

<details>
<summary>答案</summary>

可以且建議照 lint 列出。只要 Provider 使用同一 store instance，dispatch reference 穩定，不會因此重跑；symbol 才是會改變這次載入 identity 的 dependency。

</details>

### 4. TypeScript 專案為何要建立 typed dispatch Hook？

<details>
<summary>答案</summary>

一般 `useDispatch` 不一定知道 thunk/middleware 擴充後的 AppDispatch 型別。常見做法在 store 模組建立 `useAppDispatch = useDispatch.withTypes<AppDispatch>()`（依版本 API），讓 thunk return 與 action type 正確推導，避免每個 component 重複 cast。

</details>

### 5. Dispatch 後立刻讀 closure 中的 selector value，會是新值嗎？

```tsx
dispatch(selectSymbol("ETHUSDT"));
console.log(symbol);
```

<details>
<summary>答案</summary>

`symbol` 是目前 render snapshot，仍是舊值。Store 可能已同步更新，但 React component 要下一次 render 才拿到新 selector result。若流程需要 action result，用 thunk return/unwrap 或明確資料流，不要混讀 closure 與 `store.getState()`。

</details>

### 6. UI 每個 event 都直接 dispatch 多個低階 action，好嗎？

<details>
<summary>答案</summary>

能跑不等於邊界好。複雜業務流程可 dispatch 一個具語意的 action/thunk，例如 `submitOrderRequested`，把驗證、API 與後續狀態集中；component 描述使用者意圖，不必知道所有 reducer 細節。

</details>

## Zustand bound store Hook：以 selector 訂閱 client store

### 1. 為何不建議不傳 selector 讀整份 store？

```tsx
const store = useTradingStore();
```

<details>
<summary>答案</summary>

Component 訂閱整份 state，任何欄位 reference 改變都可能 render。改成 `useTradingStore(state => state.symbol)` 等最小 selector；多欄位 object selector 要處理穩定 equality，例如 `useShallow`。

</details>

### 2. 直接 mutation nested object 會更新嗎？

```tsx
set(state => {
  state.order.price = 90;
  return { order: state.order };
});
```

<details>
<summary>答案</summary>

若沒有 Immer middleware，這破壞 immutable update，selector 可能收到同一 nested reference。應回傳新的層級：`set(state => ({ order: { ...state.order, price: 90 } }))`。

</details>

### 3. Store 可以在 component 內每次 create 嗎？

<details>
<summary>答案</summary>

一般 global bound store 應在 module scope 建立一次；component 內每次 create 會重設資料與 subscription identity。若需求是每棵子樹/每個 tab 獨立 store，使用穩定 factory + Context/`useState` 建立 instance，並明確管理生命週期。

</details>

### 4. `useTradingStore.getState()` 在 render 中會訂閱嗎？

<details>
<summary>答案</summary>

不會。它是 imperative read，適合 event/非 React 程式；UI render 應呼叫 bound Hook + selector，否則 store 更新時 React 不知道要更新畫面。

</details>

### 5. Persist store 在 SSR 為何可能 hydration mismatch？

<details>
<summary>答案</summary>

Server 只能看到 default state，client 一開始可能立刻讀 localStorage rehydrated state，HTML 不一致。要設計 hydration gate、skip hydration/manual rehydrate 或 server 可重建初值；更要避免在不同 server requests 共用可變 store。

</details>

### 6. Zustand 能取代 TanStack Query 嗎？

<details>
<summary>答案</summary>

技術上能把 response 塞進 store，但你要自己負責 cache identity、stale/fresh、dedupe、retry、cancel、refetch 與 invalidation。Zustand 適合 shared client state；server state通常交給專門資料庫層，只有產品需要的 client projection 才進 store。

</details>

## 完成檢查

- Query key 是 server data identity，mutation 不會自動維護所有讀取 cache。
- Selector result identity 決定 Redux/Zustand consumer 的更新粒度。
- Imperative cache/store read 不等於 React subscription。
- 寫入重試、optimistic update 與金融操作都必須考慮冪等與真實狀態語意。

[下一組：Router / Form 第三方 Hooks](./23-third-party-router-form-hooks-drills.md)
