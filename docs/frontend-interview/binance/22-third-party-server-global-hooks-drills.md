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

### `useQuery` 六題詳細補充

1. **Query key 是 cache identity**：`queryFn` 讀到的每個會改變結果的變數都應出現在 key，例如 `['ticker', symbol]`。只改 closure 裡的 symbol 而不改 key，observer 仍訂閱同一筆 cache，會造成不同市場資料互相覆蓋。
2. **Pending 與 fetching**：`isPending` 表示目前沒有成功資料可顯示；`isFetching` 表示 queryFn 正在執行，包含已有舊資料的背景更新。首次 skeleton 通常看 pending，保留內容的小 spinner 看 fetching，避免 refetch 時整頁閃空。
3. **stale 與 GC**：`staleTime` 決定資料多久內視為 fresh、是否需要在 mount/focus 等時機 refetch；`gcTime` 決定沒有 observer 的 inactive cache 最久保留多久。前者是新鮮度策略，後者是記憶體生命期，並不代表 server data 的保存期限。
4. **enabled**：它是 declarative dependency gate，例如缺少 userId 前不執行；長期設為 false 再手動 refetch，會放棄許多自動 invalidation/refetch 能力。真正按鈕觸發的一次性寫入通常是 mutation，不應把 query 硬改成 imperative mode。
5. **取消舊 request**：queryFn 應接收並傳遞 `signal` 給 fetch；key 改變或 query 被取消時，資料層才能中止 I/O。即使不支援 abort，正確 key 仍會把結果寫入各自 cache，不應用一個 component state 接住所有 symbol。
6. **Initial 與 placeholder**：`initialData` 被視為 cache 中真實初始資料，會影響 stale 判斷並可供其他 observer 使用；`placeholderData` 只是在該 observer 尚無資料時的暫時顯示，不等於成功取得。使用 placeholder 時要在 UI 保留「尚未確認」語意。

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

### `useMutation` 六題詳細補充

1. **何時執行**：`useMutation` 只建立 mutation observer 與狀態；真正的 POST 在事件呼叫 `mutate(variables)` 或 `mutateAsync(variables)` 才開始。Render 中不能呼叫，否則每次 render 都可能產生外部寫入。
2. **mutate / mutateAsync**：前者適合 callback-driven UI，錯誤交給 mutation callbacks；後者回 Promise，適合必須依序 `await` 多步驟或由 caller catch。不要同時 await 又在 onError 做重複 toast/rollback，先定義單一錯誤 owner。
3. **Cache 不會自動理解業務關係**：新增 order 成功不代表 library 知道哪些 query keys 含 orders。可精確 `setQueryData` 寫入 server 回應，或 invalidate 對應 keys 重新取得；不要無差別 invalidate 全站造成 request storm。
4. **Optimistic rollback**：`onMutate` 先取消相關 query、保存 previous snapshot、再 patch cache；`onError` 使用 context 還原，`onSettled` 最後重新驗證。Snapshot 必須 immutable，若直接 mutation 原 cache，rollback reference 也早已被改壞。
5. **連點 concurrency**：每次 mutate 都是獨立執行，response 完成順序不保證等於呼叫順序。UI 若只顯示「最後一次 variables」，不能當作所有 mutation ledger；金融操作要用 client request ID、disable/queue policy 與 server idempotency。
6. **Retry 策略**：Read query 通常可以安全重試，但 mutation 可能重複產生副作用。只有 endpoint 具 idempotency key 或操作本身冪等時才自動 retry，並針對 4xx validation、5xx、timeout 分別決策。

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

### `useQueryClient` 六題詳細補充

1. **Client instance**：在 render 中 `new QueryClient()` 會讓每次 render 都產生空 cache，observer、retry 與 mutation 狀態也全部換 owner。應在 app bootstrap/module scope 建一次，或用 lazy state 確保每個 application request/client session 有穩定 instance。
2. **Prefix matching**：`['orders']` 預設可匹配 `['orders']`、`['orders', symbol]` 等前綴；需要只影響完全相同 key 時使用 exact 選項。Key 應由共用 factory 建立，避免字串拼法不同導致漏 invalidation。
3. **Immutable cache update**：`setQueryData` updater 應回傳新 object/array 並保留未變節點的 references。直接 push/splice 舊資料會破壞 snapshot、memo 與 rollback；也不要把不完整 optimistic response 假裝成 server canonical entity。
4. **Imperative read 不訂閱**：`getQueryData` 只讀呼叫當下的 cache，之後改變不會讓 component 因這行自動 render。Render UI 應使用 `useQuery`/observer；imperative read 適合 event、loader 或 cache orchestration。
5. **Prefetch 與 ensure**：prefetch 表達「先暖 cache，caller 不直接需要回傳資料」，錯誤通常由 cache 狀態處理；ensure 表達「這段流程現在需要一份資料」，會回傳資料並依 cache/freshness 決定是否 fetch。選擇取決於 caller contract，而非哪個比較快。
6. **Provider ownership**：Hook 讀最近一層 `QueryClientProvider` 的 client。多 client 可隔離 microfrontend/test/cache，但跨 provider invalidation 不互通；若意外巢狀 provider，外層 Devtools 也可能看不到內層資料。

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

### `useSelector` 六題詳細補充

1. **Selector result identity**：React Redux 預設以嚴格 reference equality 比較前後結果；每次回 `{ a, b }` 新 object，任何 action 後都像改變。可分成多個 primitive selectors、用 memoized selector，或明確傳 `shallowEqual`，不要先用昂貴 deep equality 掩蓋設計。
2. **Selector 必須 pure**：它可能在 render、每次 dispatch 與開發檢查中多次執行，所以不能 request、dispatch、寫 storage 或 mutation state。昂貴 derivation 用 Reselect 等 memoization，副作用放 thunk/listener/event。
3. **選整份 state**：`state => state` 讓任何 reducer 產生新 root reference 都通知 component，等同放棄 subscription 粒度，也會觸發官方 dev warning。只選 UI 實際使用的最小 slice，並保持 reducer structural sharing。
4. **Selector 讀 props**：簡單 inline selector 可捕捉 `id`；有內部 memo cache 的 selector 若被多個 component instance 共用，要建立 per-instance selector 或使用支援多參數 cache 的設計。Entity 可能被同次 action 刪除時也要 defensive read，避免 zombie-child edge case。
5. **React.memo 邊界**：Store subscription 的 selected result 改變時，component 必須 render，`memo` 不會阻止；memo 只處理 parent props 引起的 render。要減少 store update，應修 selector result identity 和粒度。
6. **Provider**：沒有對應 context 的 Provider 時 Hook 無法取得 store，會直接報錯而非回 undefined。測試應用真 store/Provider 或明確 test wrapper；不要在 component 裡 catch 後靜默顯示舊資料。

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

### `useDispatch` 六題詳細補充

1. **Dispatch 與 render**：dispatch 先讓 reducer 計算 store，再通知 subscriptions；目前 component 只有在它的 selector result 改變或 parent 更新時才 render。Dispatch 本身不是 local setter，不代表所有 dispatching components 都更新。
2. **不能在 render dispatch**：Render 必須 pure，dispatch 會同步改外部 store 並通知其他 components，容易形成 update-during-render 警告或循環。由使用者造成的 action 放 event；由外部同步造成的放 Effect，但先確認是否應由 loader/thunk 負責。
3. **Dependency**：同一 Provider store 下 dispatch reference 穩定，但 eslint 不知道這項 library contract；安全做法仍放 `[dispatch]`。這不會造成 Effect 重跑，反而讓 dependency 描述完整。
4. **Typed Hook**：預先建立 `useAppDispatch` 能帶入 `AppDispatch`，讓 thunk return type、中介層擴充與 action payload 在所有 component 一致。新版 React Redux 可用 `.withTypes`；避免每個 call site 重複 cast。
5. **Closure 仍是 snapshot**：dispatch 完成後，目前 handler 裡的 selected value仍屬於本次 render，不會就地改變。若 orchestration 需要最新 state，放進 thunk 使用 `getState`，或讓下一次 render/Effect 回應 selector 改變。
6. **Action 粒度**：UI 若知道「先 setLoading、再 setRows、再 closeModal」等 reducer 細節，流程會散落且容易中斷。Dispatch 一個具業務意圖的 action/thunk，例如 `orderSubmitted`，由 domain layer 決定狀態轉移與 side effects。

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
