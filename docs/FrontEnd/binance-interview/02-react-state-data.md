---
title: "React / Redux / React Query"
description: "React、Redux 狀態管理、React Query server state 與非同步資料處理面試筆記。"
tags:
  - React
  - Redux
  - React Query
  - Interview
keywords: ["React", "Redux", "Flux", "React Query", "state management", "async data"]
sidebar_position: 3
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

追問：

- `handleTickerMessage` 是否穩定？需要 `useCallback` 嗎？
- WebSocket 重連怎麼做？
- 快速切換 symbol 時如何避免舊 connection 繼續更新？

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

## 高機率口試題

- React key 的作用是什麼？為什麼不能常用 index 當 key？
- `useEffect` dependency array 如何決定？
- Redux 和 React Context 差在哪？
- Redux middleware 解決什麼問題？
- Redux selector 為什麼重要？
- React Query 的 query key 要怎麼設計？
- `staleTime` 和 `gcTime` 差在哪？
- mutation 成功後怎麼同步列表資料？
- WebSocket 即時資料要放 Redux、React Query 還是 local state？
- 如何避免大量行情更新造成 React 卡頓？

