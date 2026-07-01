---
title: "React / Redux / React Query"
description: "React、Redux 狀態管理、React Query server state 與非同步資料處理面試筆記。"
tags:
  - React
  - Redux
  - React Query
  - Interview
keywords: ["React", "Redux", "Flux", "React Query", "state management", "async data"]
sidebar_position: 6
---

# React / Redux / React Query

## React 核心必會

面試官不只問你會不會寫 component，會更在意你是否理解 React 的更新模型。

必會主題：

- JSX 最後會轉成 JavaScript function call。
- component render 應該保持 pure。
- state 更新會觸發重新 render，但不等於 DOM 一定全部更新。
- React 用 reconciliation 比對前後 virtual tree。
- key 影響 list diff 與 component identity。
- hooks 只能在 component / custom hook 最上層呼叫。
- effect 用來同步外部系統，不是所有資料計算都該放進 effect。

## useState / useReducer

`useState` 適合簡單 local state：

- modal open / close。
- input value。
- tab active key。
- hover / selected row。

`useReducer` 適合狀態轉移明確、狀態欄位互相關聯的情境：

- 多步驟表單。
- 下單面板。
- 複雜 filter。
- websocket connection state。

```ts
type State = {
  symbol: string;
  side: "buy" | "sell";
  price: string;
  quantity: string;
};

type Action =
  | { type: "change_symbol"; symbol: string }
  | { type: "change_side"; side: "buy" | "sell" }
  | { type: "change_price"; price: string }
  | { type: "change_quantity"; quantity: string };
```

面試回答方向：

如果 state transition 是 domain rule，用 reducer 會比多個 setState 更可預測，也更容易測試。

## useEffect

常見誤區：

- 把 derived state 放進 effect。
- dependency array 亂放或刻意忽略 lint。
- effect 裡訂閱外部事件但忘記 cleanup。
- fetch race condition。

正確心法：

- effect 是讓 React component 和外部系統同步。
- 每次 effect 重新執行前，上一輪 cleanup 會先跑。
- dependency array 表達 effect 使用了哪些 render scope 的值。

交易產品常見 effect：

```tsx
useEffect(() => {
  const ws = new WebSocket(makeTickerUrl(symbol));

  ws.onmessage = (event) => {
    handleTickerMessage(JSON.parse(event.data));
  };

  return () => {
    ws.close();
  };
}, [symbol, handleTickerMessage]);
```

追問與答案：

### `handleTickerMessage` 是否穩定？需要 `useCallback` 嗎？

如果 `handleTickerMessage` 被放進 effect dependency，且每次 render 都重新建立，就會讓 effect 重新執行並重建 WebSocket。是否需要 `useCallback` 要看它是否真的依賴 render scope 的值，以及重建連線是否是問題。常見做法是用 `useCallback` 固定 handler，或把最新狀態放在 `useRef` 裡，避免為了讀最新值而頻繁重建 subscription。

### WebSocket 重連怎麼做？

我會把連線狀態做成小型 state machine：connecting、open、reconnecting、closed。斷線後用 exponential backoff 重連，重連成功後重新 subscribe 目前 symbol，並重新抓 REST snapshot 校正資料，避免斷線期間漏掉 delta。也要處理 heartbeat、最大重試次數、頁面 unmount cleanup，以及使用者切換 symbol 時取消舊連線。

### 快速切換 symbol 時如何避免舊 connection 繼續更新？

effect cleanup 必須 close 舊 WebSocket，並且 message handler 要檢查目前 symbol 或 connection id，只接受最新連線的資料。更保守的做法是每次建立連線時產生 subscription id，收到 message 時比對 id；如果不是最新 id 就忽略。React Query query key 也要包含 symbol，避免不同交易對資料寫進同一份 cache。

## useMemo / useCallback / memo

不要把 memoization 當預設優化。

合理使用時機：

- 計算成本高，例如大量 order book level 聚合。
- props 傳給 memoized child，避免 child 不必要 render。
- callback 作為 subscription / effect dependency，需要穩定 identity。

不合理使用：

- 每個 function 都包 `useCallback`。
- 計算很便宜，但 dependency 很複雜。
- 為了躲 lint 而不是解決資料流。

面試回答：

我會先用 React Profiler 找出實際重渲染來源，再決定 memoization。memo 本身也有成本，而且會增加程式複雜度。

## Redux / Flux

### Flux 模式

Flux 核心是單向資料流：

1. View dispatch action。
2. Store 根據 action 更新 state。
3. View 訂閱 state 變化重新 render。

Redux 把這個模型簡化成：

- single store。
- action 描述發生什麼事。
- reducer 是 pure function。
- selector 從 store 取出 view 需要的資料。
- middleware 處理 async、logging、side effect。

### 什麼該放 Redux

適合 Redux：

- 跨多頁 / 多元件共享的 UI state。
- 使用者登入資訊、權限、偏好設定。
- trading layout 設定、watchlist、目前選擇的 symbol。
- 多個元件都需要、且需要一致的 client state。

不一定適合 Redux：

- API response cache。
- 單一元件 local state。
- 表單暫存值，除非跨頁或需要復原。
- mouse hover、dropdown open 這種短生命週期狀態。

面試關鍵句：

Redux 管 client state，React Query 管 server state。兩者可以搭配，但不要把所有 API data 都塞進 Redux。

## React Query

React Query 解決的是 server state：

- 遠端資料不完全由前端擁有。
- 需要 cache、同步、重試、失效、背景更新。
- 多個元件可能讀同一份 API data。
- loading / error / success state 需要標準化。

### Query Key

query key 要表達資料身份：

```ts
useQuery({
  queryKey: ["ticker", symbol],
  queryFn: () => fetchTicker(symbol),
});
```

如果 symbol 不同，cache 應該不同。query key 設計不好會造成資料互相污染。

### staleTime / gcTime

- `staleTime`：資料多久內視為 fresh，不需要重新抓。
- `gcTime`：資料沒有 observer 後多久才從 cache 移除。

交易產品裡：

- 靜態設定，例如交易規則，可以有較長 staleTime。
- 價格行情可能 staleTime 很短，甚至主要走 WebSocket。
- 使用者資產需要謹慎 invalidation，避免顯示過期餘額。

### Mutation

mutation 適合 create / update / delete：

```ts
const mutation = useMutation({
  mutationFn: submitOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["openOrders"] });
    queryClient.invalidateQueries({ queryKey: ["balances"] });
  },
});
```

回答時要補：

- 下單成功後 invalidates open orders / balances。
- 下單失敗要顯示錯誤原因。
- 交易類 mutation 要小心 optimistic update，因為後端風控和成交狀態可能改變結果。

## Redux vs React Query

| 問題 | Redux | React Query |
| --- | --- | --- |
| 管理資料類型 | Client state | Server state |
| 資料來源 | 前端決定 | 後端 API / cache |
| 常見用途 | UI 狀態、使用者偏好、跨元件狀態 | API data、loading、error、重試 |
| 更新方式 | dispatch action | query invalidation / refetch / mutation |
| 面試重點 | reducer、selector、middleware、normalization | query key、cache、staleTime、mutation、retry |

一句話版本：

Redux 是讓前端有可預測的 client state container；React Query 是讓遠端資料的抓取、快取、同步和錯誤狀態標準化。

## 即時資料與 React Query 如何搭配

常見架構：

1. 初始資料用 REST query 抓 snapshot。
2. WebSocket 接增量資料。
3. 用 `queryClient.setQueryData` 更新 cache。
4. 對高頻資料做 batching / throttling。
5. 斷線後重新抓 snapshot，避免增量資料漏掉。

```ts
queryClient.setQueryData<OrderBook>(["orderBook", symbol], (old) => {
  if (!old) return old;
  return applyDepthUpdate(old, update);
});
```

要能說明：

- 為什麼需要 snapshot + delta。
- sequence id / update id 如何避免漏資料。
- 高頻更新為什麼不適合每筆 message 都觸發整棵 UI render。

## 高機率口試題與答案

### React key 的作用是什麼？為什麼不能常用 index 當 key？

Key 用來讓 React 在 list diff 時辨識每個 item 的 identity，決定是更新、移動、還是重建 component。Index 當 key 在列表排序、插入、刪除時會讓 identity 錯位，可能造成 input value、focus、animation、local state 對到錯的 row。只有靜態、不排序、不插入刪除的列表才比較能接受 index key。交易頁 order book、open orders 這類資料應用穩定 id，例如 order id、price level。

### `useEffect` dependency array 如何決定？

Dependency array 應該列出 effect 裡使用到、來自 render scope 且會變動的值，例如 props、state、callback、derived value。effect 的目的不是控制「什麼時候我想跑」，而是描述「這個同步外部系統的邏輯依賴哪些值」。如果加 dependency 導致無限重跑，通常代表資料流或 function identity 設計有問題，應該拆 effect、移出 derived calculation、用 `useCallback` 或 `useRef`，而不是直接忽略 dependency。

### Redux 和 React Context 差在哪？

React Context 是 dependency injection / value propagation 機制，適合 theme、locale、auth session 這類低頻全域值。Redux 是可預測的 state container，有 action、reducer、middleware、devtools、selector，適合複雜 client state、跨頁狀態、需要追蹤狀態變化的情境。Context value 更新會讓 consumer 重新 render，若拿來放高頻或大型狀態，容易有效能問題。

### Redux middleware 解決什麼問題？

Middleware 介於 dispatch action 和 reducer 之間，可以處理 reducer 不該做的 side effect，例如 async request、logging、analytics、error reporting、token refresh。Reducer 必須是 pure function，不能直接呼叫 API 或改外部狀態；middleware 讓 action flow 可擴充，同時保留 reducer 的可測試性與可預測性。

### Redux selector 為什麼重要？

Selector 把 store shape 和 component 解耦，component 不需要知道 state 內部結構。它也能封裝 derived data，例如過濾 open orders、排序 watchlist、計算總量。搭配 memoized selector 可以避免每次 render 都產生新 object / array，降低不必要 re-render。大型 Redux app 裡，selector 是維護性和效能的關鍵。

### React Query 的 query key 要怎麼設計？

Query key 要完整描述資料身份，通常用 array：`["orders", accountId, symbol, status]`。所有會影響 response 的參數都要放進 key，避免 cache 污染；不影響資料身份的 UI state 不要放進 key，避免無意義 refetch。key 要穩定、可序列化，並能支援 invalidate 精準控制，例如 invalidate `["openOrders"]` 或只 invalidate 某個 symbol。

### `staleTime` 和 `gcTime` 差在哪？

`staleTime` 決定資料多久內仍被視為 fresh；fresh 資料通常不會因 mount、focus 立刻 refetch。`gcTime` 決定 query 沒有 observer 後多久從 cache 移除。交易規則、symbol metadata 可以有較長 staleTime；行情與資產資料 staleTime 要短或由 WebSocket 驅動；gcTime 則看切頁回來是否希望保留快取。

### mutation 成功後怎麼同步列表資料？

最基本是 mutation success 後 invalidate 相關 query，例如下單成功後 invalidate open orders、balances、order history。若後端回傳完整新資料，也可以 `setQueryData` 直接更新 cache，讓 UI 立即反應。交易類 mutation 要小心 optimistic update，因為後端可能因風控、餘額、價格變動 reject；通常可以 optimistic 顯示 pending，但最終狀態以後端和 WebSocket order update 為準。

### WebSocket 即時資料要放 Redux、React Query 還是 local state？

看資料用途與生命週期。若是 REST snapshot 加 WebSocket delta 的 server state，可以更新 React Query cache；若是多頁共享的 client preference 或連線狀態，可以放 Redux；若資料只服務單一圖表或元件，local state / external store 可能更簡單。高頻行情資料不一定適合直接放 Redux，因為每筆 dispatch 都可能擴大 re-render，常需要 batching、selector 或專用 store。

### 如何避免大量行情更新造成 React 卡頓？

先避免每筆 message 都 setState。把 WebSocket update 放進 buffer，用 `requestAnimationFrame` 或固定 interval 批次 flush；只更新可見資料；order book / ticker row 用穩定 key；大量列表用 virtualization；昂貴計算用 memo 或移到 Web Worker；Redux/React Query 更新要用 selector 控制訂閱範圍。最後用 React Profiler 和 performance timeline 驗證瓶頸，不靠猜。
