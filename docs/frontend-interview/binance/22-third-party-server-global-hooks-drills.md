---
sidebar_position: 26
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

### 做題前：Server state 不只是 fetch 完放進 local state

同一筆 `BTCUSDT` 行情可能同時被頁首、圖表與下單面板使用。若每個 component 都在 Effect 中自行 fetch，就會各自維護 loading、error、取消、重試與新鮮度，也不知道彼此其實在讀同一份遠端資料。

`useQuery` 讓 component 以 query key 訂閱 QueryClient 中的一筆 cache：

```tsx
const result = useQuery({
  queryKey,
  queryFn,
  staleTime?,
  gcTime?,
  enabled?,
});
```

| 概念 | 角色 |
| --- | --- |
| `queryKey` | server data 的 cache identity；會改變結果的輸入都應進 key |
| `queryFn({ signal })` | 取得資料並回傳 Promise；失敗時 throw |
| `data` / `error` | 最近成功資料或目前錯誤 |
| `status` | 是否還沒有資料、成功或錯誤 |
| `fetchStatus` / `isFetching` | queryFn 現在是否正在執行，包含背景 refetch |

```tsx
function Ticker({ symbol }: { symbol: string }) {
  const ticker = useQuery({
    queryKey: ["ticker", symbol],
    queryFn: ({ signal }) => fetchTicker(symbol, signal),
    staleTime: 10_000,
  });

  if (ticker.isPending) return <p>第一次載入中…</p>;
  if (ticker.isError) return <p role="alert">載入失敗</p>;

  return (
    <p>
      {ticker.data.price}
      {ticker.isFetching && <small> 更新中…</small>}
    </p>
  );
}
```

```text
component 訂閱 ["ticker", symbol]
  → cache 有 fresh data：直接顯示
  → cache 無資料／已需更新：queryFn 取得資料
  → QueryClient 保存結果並通知所有相同 key observers
```

Query key 是「資料是誰」，`staleTime` 是「多久內不用重新驗證」，`gcTime` 是「沒有 observer 後 cache 留多久」，三者不要混在一起。它適合可快取的 server read；一次性 server write 通常用 mutation。

> 一句話記憶：`useQuery` 用穩定 key 訂閱共享 server cache，queryFn 只是取得這筆資料的方法。

官方參考：[TanStack Query `useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)、[Query basics](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

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

### `useQuery` 六題詳細補充

1. **Query key 是 cache identity**：`queryFn` 讀到的每個會改變結果的變數都應出現在 key，例如 `['ticker', symbol]`。只改 closure 裡的 symbol 而不改 key，observer 仍訂閱同一筆 cache，會造成不同市場資料互相覆蓋。
2. **Pending 與 fetching**：`isPending` 表示目前沒有成功資料可顯示；`isFetching` 表示 queryFn 正在執行，包含已有舊資料的背景更新。首次 skeleton 通常看 pending，保留內容的小 spinner 看 fetching，避免 refetch 時整頁閃空。
3. **stale 與 GC**：`staleTime` 決定資料多久內視為 fresh、是否需要在 mount/focus 等時機 refetch；`gcTime` 決定沒有 observer 的 inactive cache 最久保留多久。前者是新鮮度策略，後者是記憶體生命期，並不代表 server data 的保存期限。
4. **enabled**：它是 declarative dependency gate，例如缺少 userId 前不執行；長期設為 false 再手動 refetch，會放棄許多自動 invalidation/refetch 能力。真正按鈕觸發的一次性寫入通常是 mutation，不應把 query 硬改成 imperative mode。
5. **取消舊 request**：queryFn 應接收並傳遞 `signal` 給 fetch；key 改變或 query 被取消時，資料層才能中止 I/O。即使不支援 abort，正確 key 仍會把結果寫入各自 cache，不應用一個 component state 接住所有 symbol。
6. **Initial 與 placeholder**：`initialData` 被視為 cache 中真實初始資料，會影響 stale 判斷並可供其他 observer 使用；`placeholderData` 只是在該 observer 尚無資料時的暫時顯示，不等於成功取得。使用 placeholder 時要在 UI 保留「尚未確認」語意。

## TanStack Query `useMutation`：執行 server write

### 做題前：Mutation 是由事件觸發的一次寫入流程

Query 通常宣告「畫面需要哪份 server data」；下單、修改暱稱、刪除資料則是使用者主動觸發的 write。`useMutation` 在 render 時只建立 observer 與操作函式，不會自行 POST。

```tsx
const mutation = useMutation({
  mutationFn,
  onMutate?,
  onSuccess?,
  onError?,
  onSettled?,
});
```

| 項目 | 角色 |
| --- | --- |
| `mutate(variables)` | 啟動 mutation，以 callbacks 接結果，回傳 `void` |
| `mutateAsync(variables)` | 啟動並回傳 Promise，由 caller `await` / `catch` |
| `isPending` / `data` / `error` | 這個 mutation observer 的執行狀態 |
| lifecycle callbacks | optimistic patch、成功更新、rollback 與最後校正 |

```tsx
const queryClient = useQueryClient();
const createOrder = useMutation({
  mutationFn: postOrder,
  onSuccess: (confirmedOrder) => {
    queryClient.setQueryData(["orders"], (old = []) => [
      ...old,
      confirmedOrder,
    ]);
  },
});

function handleSubmit(draft) {
  createOrder.mutate(draft);
}
```

```text
render：建立 mutation observer（不送 request）
event：mutate(draft)
  → pending → mutationFn(draft)
  → success：更新／invalidate 相關 query cache
  → error：顯示錯誤，必要時 rollback
  → settled：做成功失敗都要執行的校正
```

Server write 成功不代表 QueryClient 自動知道哪些 read caches 受影響；關係必須由 `setQueryData` 或 `invalidateQueries` 明確描述。多次 `mutate` 也可能並行且亂序完成。下單、付款等操作若要 retry，必須先有 server idempotency contract。

> 一句話記憶：`useMutation` 管理一次命令式 server write 的 lifecycle，cache 一致性仍要明確接回 QueryClient。

官方參考：[TanStack Query `useMutation`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)、[Mutations guide](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

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

### `useMutation` 六題詳細補充

1. **何時執行**：`useMutation` 只建立 mutation observer 與狀態；真正的 POST 在事件呼叫 `mutate(variables)` 或 `mutateAsync(variables)` 才開始。Render 中不能呼叫，否則每次 render 都可能產生外部寫入。
2. **mutate / mutateAsync**：前者適合 callback-driven UI，錯誤交給 mutation callbacks；後者回 Promise，適合必須依序 `await` 多步驟或由 caller catch。不要同時 await 又在 onError 做重複 toast/rollback，先定義單一錯誤 owner。
3. **Cache 不會自動理解業務關係**：新增 order 成功不代表 library 知道哪些 query keys 含 orders。可精確 `setQueryData` 寫入 server 回應，或 invalidate 對應 keys 重新取得；不要無差別 invalidate 全站造成 request storm。
4. **Optimistic rollback**：`onMutate` 先取消相關 query、保存 previous snapshot、再 patch cache；`onError` 使用 context 還原，`onSettled` 最後重新驗證。Snapshot 必須 immutable，若直接 mutation 原 cache，rollback reference 也早已被改壞。
5. **連點 concurrency**：每次 mutate 都是獨立執行，response 完成順序不保證等於呼叫順序。UI 若只顯示「最後一次 variables」，不能當作所有 mutation ledger；金融操作要用 client request ID、disable/queue policy 與 server idempotency。
6. **Retry 策略**：Read query 通常可以安全重試，但 mutation 可能重複產生副作用。只有 endpoint 具 idempotency key 或操作本身冪等時才自動 retry，並針對 4xx validation、5xx、timeout 分別決策。

## TanStack Query `useQueryClient`：操作目前 Provider 的 cache client

### 做題前：QueryClient 是整個 query cache 的協調者

`useQuery` 負責訂閱某筆資料，`useMutation` 負責一次寫入；當你需要讓多筆 query 失效、直接 patch cache、prefetch 下一頁或取消 request，就要取得它們共同使用的 QueryClient。

```tsx
const queryClient = useQueryClient(queryClient?);
```

一般 browser app 會建立穩定 client，再透過 Provider 供整棵 tree 使用：

```tsx
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

```tsx
function RefreshOrdersButton() {
  const queryClient = useQueryClient();

  return (
    <button onClick={() => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }}>
      重新驗證訂單
    </button>
  );
}
```

| 操作 | 意圖 |
| --- | --- |
| `invalidateQueries` | 標記 matching queries stale，active query 通常接著 refetch |
| `setQueryData` | 同步、immutable 地更新一筆已知 cache |
| `prefetchQuery` | 提前取得資料並放進 cache，不直接回傳給 UI |
| `cancelQueries` | 請求 query 取消；queryFn 要有傳遞 AbortSignal 才能中止底層 I/O |
| `getQueryData` | imperative snapshot read，不會讓 component 訂閱 |

```text
最近的 QueryClientProvider
  └─ useQueryClient() 取得同一 client
      ├─ 讀寫 cache
      ├─ invalidate / refetch / cancel
      └─ 通知 useQuery observers
```

不要在 component body 每次 `new QueryClient()`，否則 cache identity 會跟著 render 重建。需要 reactive UI 時仍應 `useQuery`；render 中 `getQueryData()` 只讀一次 snapshot，後續 cache 更新不會自動重畫。

> 一句話記憶：`useQueryClient` 取得目前 Provider 的 cache coordinator，用來做跨 query 的命令式協調。

官方參考：[TanStack Query `useQueryClient`](https://tanstack.com/query/latest/docs/framework/react/reference/useQueryClient)、[QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient)

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

### `useQueryClient` 六題詳細補充

1. **Client instance**：在 render 中 `new QueryClient()` 會讓每次 render 都產生空 cache，observer、retry 與 mutation 狀態也全部換 owner。應在 app bootstrap/module scope 建一次，或用 lazy state 確保每個 application request/client session 有穩定 instance。
2. **Prefix matching**：`['orders']` 預設可匹配 `['orders']`、`['orders', symbol]` 等前綴；需要只影響完全相同 key 時使用 exact 選項。Key 應由共用 factory 建立，避免字串拼法不同導致漏 invalidation。
3. **Immutable cache update**：`setQueryData` updater 應回傳新 object/array 並保留未變節點的 references。直接 push/splice 舊資料會破壞 snapshot、memo 與 rollback；也不要把不完整 optimistic response 假裝成 server canonical entity。
4. **Imperative read 不訂閱**：`getQueryData` 只讀呼叫當下的 cache，之後改變不會讓 component 因這行自動 render。Render UI 應使用 `useQuery`/observer；imperative read 適合 event、loader 或 cache orchestration。
5. **Prefetch 與 ensure**：prefetch 表達「先暖 cache，caller 不直接需要回傳資料」，錯誤通常由 cache 狀態處理；ensure 表達「這段流程現在需要一份資料」，會回傳資料並依 cache/freshness 決定是否 fetch。選擇取決於 caller contract，而非哪個比較快。
6. **Provider ownership**：Hook 讀最近一層 `QueryClientProvider` 的 client。多 client 可隔離 microfrontend/test/cache，但跨 provider invalidation 不互通；若意外巢狀 provider，外層 Devtools 也可能看不到內層資料。

## React Redux `useSelector`：訂閱 selector result

### 做題前：Component 訂閱的是 selector 結果，不是抽象的「整個 Redux」

Redux store 是 React 外部的 shared client state。`<Provider store={store}>` 把同一 store 放進 context；`useSelector` 讀取需要的 slice，並在每次 dispatch 後重新執行 selector，判斷這個 component 是否需要 render。

```tsx
const selected = useSelector(selector, equalityFnOrOptions?);
```

```tsx
function ActiveSymbol() {
  const symbol = useSelector((state: RootState) => state.trade.symbol);
  return <strong>{symbol}</strong>;
}
```

```text
store.dispatch(action)
  → Redux reducers 建立 next root state
  → useSelector 再算 selector(nextState)
  → 比較 previousSelected 與 nextSelected
  → 結果不同才要求該 component render
```

預設比較是嚴格 reference equality（`===`）。因此下面 selector 每次都建立新 object，即使欄位沒變，也容易讓任何 action 都觸發 render：

```tsx
// 每次 selector 執行都產生新 reference
const result = useSelector((state) => ({
  symbol: state.trade.symbol,
  side: state.trade.side,
}));
```

可以分開選 primitive、使用 memoized selector，或明確採用 `shallowEqual`。Selector 必須 pure，不能送 API、dispatch 或 mutation state；它可能在 render 與 store update 的不同時機多次執行。

`React.memo` 只比較 parent props，不能擋住 component 自己的 store subscription 更新。Selector 的粒度與回傳 identity 才決定這條訂閱何時更新。

> 一句話記憶：`useSelector` 訂閱「從 store 推導出的結果」，結果 identity 改變才使 component 更新。

官方參考：[React Redux Hooks：`useSelector`](https://react-redux.js.org/api/hooks#useselector)

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

### `useSelector` 六題詳細補充

1. **Selector result identity**：React Redux 預設以嚴格 reference equality 比較前後結果；每次回 `{ a, b }` 新 object，任何 action 後都像改變。可分成多個 primitive selectors、用 memoized selector，或明確傳 `shallowEqual`，不要先用昂貴 deep equality 掩蓋設計。
2. **Selector 必須 pure**：它可能在 render、每次 dispatch 與開發檢查中多次執行，所以不能 request、dispatch、寫 storage 或 mutation state。昂貴 derivation 用 Reselect 等 memoization，副作用放 thunk/listener/event。
3. **選整份 state**：`state => state` 讓任何 reducer 產生新 root reference 都通知 component，等同放棄 subscription 粒度，也會觸發官方 dev warning。只選 UI 實際使用的最小 slice，並保持 reducer structural sharing。
4. **Selector 讀 props**：簡單 inline selector 可捕捉 `id`；有內部 memo cache 的 selector 若被多個 component instance 共用，要建立 per-instance selector 或使用支援多參數 cache 的設計。Entity 可能被同次 action 刪除時也要 defensive read，避免 zombie-child edge case。
5. **React.memo 邊界**：Store subscription 的 selected result 改變時，component 必須 render，`memo` 不會阻止；memo 只處理 parent props 引起的 render。要減少 store update，應修 selector result identity 和粒度。
6. **Provider**：沒有對應 context 的 Provider 時 Hook 無法取得 store，會直接報錯而非回 undefined。測試應用真 store/Provider 或明確 test wrapper；不要在 component 裡 catch 後靜默顯示舊資料。

## React Redux `useDispatch`：取得 store dispatch

### 做題前：Dispatch 是寫入入口，本身不會訂閱資料

`useDispatch()` 取得最近 Redux Provider 中 store 的 `dispatch` function。Component 用它送出 action；Redux reducer 再根據 action 計算 next state。畫面是否更新，則取決於 `useSelector` 等訂閱結果是否改變。

```tsx
const dispatch = useDispatch();
```

```tsx
function SideButtons() {
  const dispatch = useAppDispatch();

  return (
    <>
      <button onClick={() => dispatch({ type: "trade/sideChanged", payload: "buy" })}>
        買入
      </button>
      <button onClick={() => dispatch({ type: "trade/sideChanged", payload: "sell" })}>
        賣出
      </button>
    </>
  );
}
```

```text
click event
  → dispatch(action)
  → middleware（若有）
  → reducers(previousState, action)
  → store 保存 nextState 並通知 subscribers
  → selector 結果改變的 components render
```

| `useDispatch` | `useSelector` |
| --- | --- |
| 取得 command/write function | 讀取並訂閱 derived state |
| 呼叫後不保證目前 component render | 選取結果改變才 render |
| 適合 event handler、thunk/action dispatch | 適合 JSX 所需資料 |

不能在 render 中 dispatch，否則形成 render → store update → render loop。Event handler dispatch 後，當前 closure 中的 selector value 仍是那次 render 的 snapshot；新值要到下一次 render 才取得。

TypeScript 專案通常在 app 層輸出 `useAppDispatch = useDispatch.withTypes<AppDispatch>()`，讓 thunk 與 middleware 擴充型別保留下來；UI 不必到處重複寫 cast。

> 一句話記憶：`useDispatch` 只提供 Redux 的 action 入口，真正的 state 計算在 reducer，真正的 UI 訂閱在 selector。

官方參考：[React Redux Hooks：`useDispatch`](https://react-redux.js.org/api/hooks#usedispatch)、[React Redux TypeScript usage](https://react-redux.js.org/using-react-redux/usage-with-typescript)

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

### `useDispatch` 六題詳細補充

1. **Dispatch 與 render**：dispatch 先讓 reducer 計算 store，再通知 subscriptions；目前 component 只有在它的 selector result 改變或 parent 更新時才 render。Dispatch 本身不是 local setter，不代表所有 dispatching components 都更新。
2. **不能在 render dispatch**：Render 必須 pure，dispatch 會同步改外部 store 並通知其他 components，容易形成 update-during-render 警告或循環。由使用者造成的 action 放 event；由外部同步造成的放 Effect，但先確認是否應由 loader/thunk 負責。
3. **Dependency**：同一 Provider store 下 dispatch reference 穩定，但 eslint 不知道這項 library contract；安全做法仍放 `[dispatch]`。這不會造成 Effect 重跑，反而讓 dependency 描述完整。
4. **Typed Hook**：預先建立 `useAppDispatch` 能帶入 `AppDispatch`，讓 thunk return type、中介層擴充與 action payload 在所有 component 一致。新版 React Redux 可用 `.withTypes`；避免每個 call site 重複 cast。
5. **Closure 仍是 snapshot**：dispatch 完成後，目前 handler 裡的 selected value仍屬於本次 render，不會就地改變。若 orchestration 需要最新 state，放進 thunk 使用 `getState`，或讓下一次 render/Effect 回應 selector 改變。
6. **Action 粒度**：UI 若知道「先 setLoading、再 setRows、再 closeModal」等 reducer 細節，流程會散落且容易中斷。Dispatch 一個具業務意圖的 action/thunk，例如 `orderSubmitted`，由 domain layer 決定狀態轉移與 side effects。

## Zustand bound store Hook：以 selector 訂閱 client store

### 做題前：`create` 同時產生 store 與綁定 React 的 Hook

Zustand 常把 shared client state 與 actions 放在 module-level store。呼叫 bound store Hook 時傳 selector，component 只訂閱自己需要的 slice，不必手寫 Provider（除非要 scoped/dynamic store）。

```tsx
type TradingStore = {
  symbol: string;
  side: "buy" | "sell";
  setSymbol(symbol: string): void;
};

const useTradingStore = create<TradingStore>()((set) => ({
  symbol: "BTCUSDT",
  side: "buy",
  setSymbol: (symbol) => set({ symbol }),
}));
```

Component 應選取實際需要的資料：

```tsx
function SymbolPicker() {
  const symbol = useTradingStore((state) => state.symbol);
  const setSymbol = useTradingStore((state) => state.setSymbol);

  return (
    <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
      <option>BTCUSDT</option>
      <option>ETHUSDT</option>
    </select>
  );
}
```

```text
store action 呼叫 set(partial / updater)
  → store 建立 next state
  → 各 selector 重新計算 slice
  → slice equality 改變的 components render
```

不傳 selector 等於讀整份 store，任何欄位 reference 變動都可能更新 component。若 selector 回傳新 object/array，也要考慮 `useShallow` 或其他 equality 策略；優先選 primitive 或穩定 slice。

`useTradingStore.getState()` 是不訂閱的 imperative read，適合 React 外的 event/service，不適合在 render 取代 bound Hook。Store 也應穩定建立；在 component body 每次 `create()` 會重建狀態與訂閱邊界。

Zustand 管的是 shared client state，不自帶 TanStack Query 的 server cache 新鮮度、retry、dedupe 與 invalidation。SSR 加 `persist` 時還要設計每個 request 的 store 隔離與 hydration，不能直接假設 browser `localStorage` 值和 server HTML 相同。

> 一句話記憶：Zustand bound Hook 用 selector 把 component 接到穩定 client store；選多大 slice，就承擔多大的更新範圍。

官方參考：[Zustand `create`](https://zustand.docs.pmnd.rs/reference/apis/create)、[Zustand selectors](https://zustand.docs.pmnd.rs/learn/guides/auto-generating-selectors)

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

### Zustand 六題詳細補充

1. **整份 store subscription**：不傳 selector 通常取得整個 state object，任何欄位更新都可能讓 component render。使用 `useStore(s => s.price)` 等最小 selector；同時取多欄時要注意回傳 object identity，必要時使用 shallow equality。
2. **Nested mutation**：若直接修改 nested object 又回傳同一 reference，selector equality 看不出改變。應建立從修改節點到 selected boundary 的新 references，或使用 Immer middleware；action methods 也要維持未變 branch 的 sharing。
3. **Store 建立位置**：Component body 每次 create 會重置資料、遺失 subscriptions，還可能讓 sibling 各有意外獨立 store。Global singleton 放 module scope；需要 per-tree/per-request instance 時，用 Context/provider lazy 建立並明確定義 lifecycle。
4. **getState 不訂閱**：它適合 event handler、service 或除錯讀取呼叫當下值；在 render 中使用不會因後續 store 改變重 render。UI 讀值一定使用 bound hook selector，否則畫面會停在舊 snapshot。
5. **Persist 與 SSR**：Server 初始 state 與 client storage rehydrate state 可能不同，直接把 persisted 值用於首次 client render 會 mismatch。應定義 hydration flag/fallback、延後顯示 client-only state，且不能把 token/敏感資料無限制 persist。
6. **不能取代 Query cache**：Zustand 管 client-owned state 很合適，但不自帶 query key、staleness、dedupe、refetch、cancellation 與 mutation invalidation。把 server response 全搬進 store 等於自行重造資料層；兩者可分別管理 UI state 與 server state。

## 完成檢查

- Query key 是 server data identity，mutation 不會自動維護所有讀取 cache。
- Selector result identity 決定 Redux/Zustand consumer 的更新粒度。
- Imperative cache/store read 不等於 React subscription。
- 寫入重試、optimistic update 與金融操作都必須考慮冪等與真實狀態語意。

[下一組：Router / Form 第三方 Hooks](./23-third-party-router-form-hooks-drills.md)
