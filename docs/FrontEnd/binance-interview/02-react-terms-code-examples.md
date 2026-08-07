---
title: "React 面試術語中文對照：交易頁程式碼範例"
description: "整理 Binance React 前端面試常見術語中文解釋，包含 render、commit、reconciliation、state、props、React Query、Redux、WebSocket、order book 與下單表單範例。"
tags:
  - React
  - Vue
  - Binance
  - Interview
keywords: ["React 術語中文", "React 面試術語", "React render commit", "reconciliation 中文", "React Query 範例", "Redux 範例", "WebSocket 範例", "Binance trading UI", "交易頁前端", "order book component", "Vue 轉 React", "前端面試題"]
sidebar_position: 5
---

# React 術語中文對照與交易頁範例

> 如果你還不熟悉 `useQuery`、`useMutation`、`useQueryClient` 等第三方 Hooks，建議先讀 [React 常用第三方 Hooks 入門](./02-react-third-party-hooks.md)，再回來看這篇的交易頁範例。

## 常見術語中英對照

| 英文 | 中文理解 | Binance 交易頁例子 |
| --- | --- | --- |
| render | 重新計算畫面 | 價格更新後，React 重新計算 ticker 顯示 |
| commit | 套用到 DOM | React 把最新價格文字真正更新到畫面 |
| reconciliation | 新舊畫面比對 | order book row 只更新變動的價格檔位 |
| state | 會影響畫面的狀態 | 下單表單的 price、quantity、side |
| props | 父層傳入資料 | `OrderBookTable` 接收 bids / asks |
| controlled component | 受控元件 | input value 由 React state 控制 |
| derived data | 推導資料 | quantity * price 算出 notional |
| server state | 伺服器資料狀態 | balances、open orders、symbol rules |
| client state | 前端本地狀態 | active tab、layout、目前選擇 symbol |
| query key | 快取身份 | `["ticker", "BTCUSDT"]` |
| mutation | 修改資料請求 | submit order、cancel order |
| invalidation | 標記快取失效 | 下單後重新抓 open orders |
| stale | 資料可能過期 | WebSocket 斷線時行情不一定最新 |
| snapshot | 初始完整快照 | REST 抓完整 order book |
| delta | 增量更新 | WebSocket 推某些價格檔位變化 |
| batching | 批次合併更新 | 一個 frame 內多筆 ticker 合成一次 setState |

## 範例一：Vue `v-model` 轉 React 受控元件

Vue 常見寫法：

```vue
<template>
  <input v-model="price" />
  <p>價格：{{ price }}</p>
</template>

<script setup>
import { ref } from "vue";

const price = ref("");
</script>
```

React 對應寫法：

```tsx
import { useState } from "react";

export function PriceInput() {
  const [price, setPrice] = useState("");

  return (
    <>
      <input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <p>價格：{price}</p>
    </>
  );
}
```

重點：

- Vue 的 `v-model` 幫你包雙向綁定。
- React 會明確寫出 `value` 和 `onChange`。
- 交易表單建議用 React 這種明確資料流，因為驗證、提交中、API 錯誤都比較可控。

## 範例二：computed 轉 derived data / useMemo

Vue：

```vue
<script setup>
import { computed, ref } from "vue";

const price = ref("65000");
const quantity = ref("0.01");

const notional = computed(() => {
  return Number(price.value) * Number(quantity.value);
});
</script>
```

React 簡單版：

```tsx
function TradeAmount() {
  const [price, setPrice] = useState("65000");
  const [quantity, setQuantity] = useState("0.01");

  const notional = Number(price) * Number(quantity);

  return <div>成交金額：{notional}</div>;
}
```

React 有成本計算時才用 `useMemo`：

```tsx
const visibleRows = useMemo(() => {
  return levels
    .filter((level) => Number(level.quantity) > 0)
    .slice(0, 50);
}, [levels]);
```

重點：

- 簡單推導資料可以直接算。
- `useMemo` 主要是效能優化，不是每個 computed 都要翻成 `useMemo`。
- 金融計算不要真的用 `Number` 做精準計算；面試範例可以簡化，正式環境要用 decimal library 或最小單位整數。

## 範例三：watch 轉 useEffect

Vue watch：

```ts
watch(symbol, async (nextSymbol) => {
  ticker.value = await fetchTicker(nextSymbol);
});
```

React effect：

```tsx
function TickerPanel({ symbol }: { symbol: string }) {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTicker() {
      const data = await fetchTicker(symbol, controller.signal);
      setTicker(data);
    }

    loadTicker();

    return () => {
      controller.abort();
    };
  }, [symbol]);

  return <div>{ticker?.lastPrice ?? "載入中"}</div>;
}
```

重點：

- `useEffect` 不是單純 watch，它是在同步外部系統。
- 切換交易對時要取消舊 request，避免舊資料覆蓋新資料。
- dependency array 放 `[symbol]`，表示交易對變了就重新同步。

## 範例四：React Query 抓伺服器資料狀態

這個範例把「呼叫 API、保存結果、處理載入與錯誤、判斷資料是否過期」交給 React Query。以下程式假設應用程式最外層已經設定好 `QueryClientProvider`。

```tsx
import { useQuery } from "@tanstack/react-query";

type Ticker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

async function fetchTicker(symbol: string): Promise<Ticker> {
  const res = await fetch(`/api/ticker?symbol=${symbol}`);
  if (!res.ok) throw new Error("無法取得行情");
  return res.json();
}

export function TickerCard({ symbol }: { symbol: string }) {
  const query = useQuery({
    queryKey: ["ticker", symbol],
    queryFn: () => fetchTicker(symbol),
    staleTime: 3_000,
  });

  if (query.isPending) return <div>行情載入中</div>;
  if (query.isError) return <div>行情載入失敗</div>;

  return (
    <section>
      <h3>{query.data.symbol}</h3>
      <strong>{query.data.lastPrice}</strong>
      <span>{query.data.priceChangePercent}%</span>
    </section>
  );
}
```

### 三個核心設定

- `queryKey: ["ticker", symbol]` 是快取身份。
- `queryFn` 是 React Query 判斷需要取資料時才會執行的非同步函式。
- `staleTime: 3_000` 表示成功取得資料後，3 秒內視為 fresh（新鮮）。

`queryKey` 不只像 `useEffect` 的 dependency array 一樣能反映 `symbol` 變化，也是這份資料在快取中的地址。例如：

```ts
["ticker", "BTCUSDT"];
["ticker", "ETHUSDT"];
```

兩個 key 代表兩份獨立快取，避免 BTC 和 ETH 行情混在一起。

### 第一次載入的實際流程

假設畫面使用 `<TickerCard symbol="BTCUSDT" />`，而快取裡還沒有 BTC 行情：

```text
TickerCard 開始 render
  → useQuery 訂閱 ["ticker", "BTCUSDT"]
  → React Query 檢查快取，發現沒有資料
  → 執行 queryFn
  → queryFn 呼叫 fetchTicker("BTCUSDT")
  → query.isPending 為 true，畫面顯示「行情載入中」
  → API 成功回傳，React Query 把資料寫進對應的 cache
  → React Query 通知 TickerCard 重新 render
  → query.data 有資料，畫面顯示 symbol、價格與漲跌幅
```

如果 `fetchTicker` 因為 HTTP 錯誤而 `throw`，React Query 會接住錯誤並依設定重試；最終仍失敗時，`query.isError` 會變成 `true`，畫面顯示「行情載入失敗」。

### `symbol` 改變時

當 props 從 `BTCUSDT` 變成 `ETHUSDT`：

```text
["ticker", "BTCUSDT"]
  → ["ticker", "ETHUSDT"]
  → React Query 改為訂閱 ETHUSDT 的 cache
  → 有 fresh cache 就直接使用
  → 沒有 cache 就執行 fetchTicker("ETHUSDT")
```

舊的 BTC 請求即使比較晚完成，也只會寫入 BTC 的 cache，不會覆蓋 ETH 的資料。這就是為什麼會影響請求結果的 `symbol` 必須放進 `queryKey`。

### `staleTime: 3_000` 不是每 3 秒輪詢

資料成功取得後的 3 秒內，React Query 會把它視為 fresh。超過 3 秒只代表資料成為 stale（可能過期），不會在第 3 秒一到就立刻送出請求。

stale 資料通常會在下列時機觸發背景重新取得：

- 同一個 query 的元件重新掛載。
- 使用者重新聚焦瀏覽器視窗。
- 網路斷線後重新連線。
- 程式呼叫 `refetch()` 或讓 query invalidated。

背景重新取得時，既有的 `query.data` 可以繼續顯示，並以 `query.isFetching` 判斷背景更新狀態。如果需求是真的每 3 秒更新一次行情，應另外設定：

```tsx
refetchInterval: 3_000,
```

### 和 `useEffect` 的關係

可以先用這個心智模型理解，但兩者不是完全相同的 API：

| React Query | 手寫 `useEffect` 時的概念 |
| --- | --- |
| `queryKey: ["ticker", symbol]` | `[symbol]` dependency，加上資料的快取身份 |
| `queryFn` | effect 裡呼叫的非同步函式 |
| `query.data` | 自己建立的 data state |
| `query.isPending` | 自己建立的首次載入 state |
| `query.isError` / `query.error` | 自己 catch 並保存的 error state |

如果使用 `useEffect`，快取、重試、重複請求、背景更新和 stale 判斷都要自己處理；`useQuery` 則把這些 server state 生命週期集中管理。

補充狀態差異：`isPending` 表示目前還沒有成功資料；`isLoading` 是「第一次請求正在執行」，相當於 `isPending && isFetching`；`isFetching` 則包含第一次請求和背景重新取得。因此這裡使用 `isPending`，可以確保進入成功畫面時 `query.data` 已存在。

## 範例五：下單 mutation 後讓列表重新抓

先抓住這個範例的核心：**畫面上原本已經有「未成交訂單」和「餘額」兩份查詢；送出新訂單成功後，這兩份舊資料可能不準了，所以要通知 React Query 重新取得。**

`useQuery` 和 `useMutation` 在這裡扮演不同角色：

| API | 用途 | 這個範例中的工作 |
| --- | --- | --- |
| `useQuery` | 讀取伺服器資料 | 取得未成交訂單、餘額 |
| `useMutation` | 主動修改伺服器資料 | 新增一張買單或賣單 |
| `invalidateQueries` | 宣告某份 query cache 已過期 | 下單成功後，讓相關畫面取得最新資料 |

假設其他元件已經用下面的 query key 讀取資料：

```tsx
useQuery({
  queryKey: ["openOrders", symbol],
  queryFn: () => fetchOpenOrders(symbol),
});

useQuery({
  queryKey: ["balances"],
  queryFn: fetchBalances,
});
```

下單成功後必須 invalidate 相同的 key，React Query 才知道哪些快取受到影響。

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SubmitOrderInput = {
  symbol: string;
  side: "buy" | "sell";
  price: string;
  quantity: string;
};

async function submitOrder(input: SubmitOrderInput) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("下單失敗");
  return res.json();
}

function useSubmitOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOrder,
    onSuccess: async (_data, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["openOrders", input.symbol],
        }),
        queryClient.invalidateQueries({ queryKey: ["balances"] }),
      ]);
    },
  });
}
```

### 呼叫 `useSubmitOrder()` 不會立刻下單

`useSubmitOrder()` 只是建立一個 mutation controller，真正送出 `POST` 的時機是元件呼叫 `mutate(input)`：

```tsx
function SubmitOrderButton() {
  const orderMutation = useSubmitOrder();

  function handleSubmit() {
    orderMutation.mutate({
      symbol: "BTCUSDT",
      side: "buy",
      price: "65000",
      quantity: "0.01",
    });
  }

  return (
    <div>
      <button disabled={orderMutation.isPending} onClick={handleSubmit}>
        {orderMutation.isPending ? "下單中..." : "買入 BTC"}
      </button>

      {orderMutation.isError && (
        <p role="alert">{orderMutation.error.message}</p>
      )}
    </div>
  );
}
```

因此下面兩段資料其實是同一份 `input`：

```text
orderMutation.mutate({ symbol: "BTCUSDT", side: "buy", ... });
                         │
                         └── 傳給 mutationFn，也就是 submitOrder(input)
```

`onSuccess` 的第二個參數也是這次 `mutate(...)` 傳入的資料，所以可以取得 `input.symbol`，只更新這次交易對的未成交訂單。

### 一次成功下單的完整流程

```text
使用者點擊「買入 BTC」
  → handleSubmit 呼叫 orderMutation.mutate(input)
  → React Query 將 mutation 狀態改成 pending
  → mutationFn 執行 submitOrder(input)
  → submitOrder 發送 POST /api/orders
  → 後端建立訂單並回傳成功結果
  → 執行 onSuccess(data, input)
  → ["openOrders", "BTCUSDT"] 被標記為 stale
  → ["balances"] 被標記為 stale
  → 正在畫面上使用這些 key 的 query 會在背景重新取得
  → 新資料寫入 cache，訂單列表與餘額元件重新 render
```

注意：`invalidateQueries` 不是再送一次下單請求，也不是直接把訂單塞進列表。它做的是「這份快取可能舊了」的標記；符合條件且正在使用中的 query 預設會重新執行自己的 `queryFn`。

### 為什麼要等 `Promise.all`？

兩個 `invalidateQueries` 可以同時執行。因為 `onSuccess` 回傳的 Promise 會被 mutation 等待，所以在未成交訂單和餘額完成重新整理前，`orderMutation.isPending` 仍是 `true`，按鈕可以繼續保持 disabled，避免使用者太早重複下單。

如果不需要等待列表刷新，也可以不寫 `await`；訂單仍會成功送出，只是 mutation 會更早離開 pending 狀態。

### 失敗時會怎樣？

如果 `/api/orders` 回傳非 2xx 狀態，`submitOrder` 會 `throw new Error("下單失敗")`：

```text
submitOrder throw
  → mutation 進入 error 狀態
  → orderMutation.isError 變成 true
  → onSuccess 不會執行
  → 不會 invalidate 未成交訂單與餘額
```

最後整理：

- `mutationFn`：定義「如何送出下單請求」。
- `mutate(input)`：真正開始執行下單，`input` 會傳給 `mutationFn`。
- `isPending`：從送出請求到 `onSuccess` 的 Promise 完成前都是 `true`。
- `onSuccess(_data, input)`：只有下單成功才執行；`_data` 是 API 結果，`input` 是原本的下單參數。
- `queryClient`：React Query 的快取管理器。
- `invalidateQueries`：將符合 key 的資料標記為 stale，並讓使用中的 query 重新取得。
- 交易類功能不要亂做「假裝成功」的 optimistic update，最終狀態以後端和訂單推送為準。

## 範例六：用 useReducer 管下單表單

```tsx
type TradeFormState = {
  side: "buy" | "sell";
  orderType: "limit" | "market";
  price: string;
  quantity: string;
  error: string | null;
};

type TradeFormAction =
  | { type: "change_side"; side: "buy" | "sell" }
  | { type: "change_order_type"; orderType: "limit" | "market" }
  | { type: "change_price"; price: string }
  | { type: "change_quantity"; quantity: string }
  | { type: "set_error"; error: string | null }
  | { type: "reset" };

const initialState: TradeFormState = {
  side: "buy",
  orderType: "limit",
  price: "",
  quantity: "",
  error: null,
};

function tradeFormReducer(
  state: TradeFormState,
  action: TradeFormAction,
): TradeFormState {
  switch (action.type) {
    case "change_side":
      return { ...state, side: action.side, error: null };
    case "change_order_type":
      return { ...state, orderType: action.orderType, error: null };
    case "change_price":
      return { ...state, price: action.price, error: null };
    case "change_quantity":
      return { ...state, quantity: action.quantity, error: null };
    case "set_error":
      return { ...state, error: action.error };
    case "reset":
      return initialState;
    default:
      return state;
  }
}
```

重點：

- 多個欄位互相影響時，`useReducer` 比很多個 `useState` 更清楚。
- 每個 action 代表一個使用者事件。
- 下單表單有很多 domain rule，用 reducer 比較容易測試。

## 範例七：買賣盤 snapshot + delta 合併

```ts
type Side = "bid" | "ask";

type OrderBook = {
  bids: Map<string, string>;
  asks: Map<string, string>;
  lastUpdateId: number;
};

type DepthDelta = {
  updateId: number;
  bids: Array<[price: string, quantity: string]>;
  asks: Array<[price: string, quantity: string]>;
};

function applySideDelta(
  levels: Map<string, string>,
  updates: Array<[string, string]>,
) {
  for (const [price, quantity] of updates) {
    if (quantity === "0") {
      levels.delete(price);
    } else {
      levels.set(price, quantity);
    }
  }
}

function applyDepthDelta(book: OrderBook, delta: DepthDelta): OrderBook {
  if (delta.updateId <= book.lastUpdateId) {
    return book;
  }

  const bids = new Map(book.bids);
  const asks = new Map(book.asks);

  applySideDelta(bids, delta.bids);
  applySideDelta(asks, delta.asks);

  return {
    bids,
    asks,
    lastUpdateId: delta.updateId,
  };
}
```

重點：

- snapshot 是初始完整買賣盤。
- delta 是後續某些價格檔位的變化。
- quantity 為 0 通常代表刪除該價格檔位。
- 正式環境還要檢查 sequence gap；如果中間漏資料，要重新抓 snapshot。

## 範例八：WebSocket 高頻資料批次更新

```tsx
function useBufferedTicker(symbol: string) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const latestRef = useRef<Ticker | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket(makeTickerUrl(symbol));

    ws.onmessage = (event) => {
      latestRef.current = JSON.parse(event.data);

      if (frameRef.current !== null) return;

      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        setTicker(latestRef.current);
      });
    };

    return () => {
      ws.close();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [symbol]);

  return ticker;
}
```

重點：

- 每筆 WebSocket message 都 setState 會讓畫面太頻繁更新。
- 先把最新資料放在 ref，再用 `requestAnimationFrame` 合併到下一次畫面更新。
- 高頻交易資料常用這種「只顯示最新狀態」的策略。

## 範例九：Redux Toolkit 管前端本地狀態

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TradingUiState = {
  currentSymbol: string;
  selectedInterval: "1m" | "5m" | "1h" | "1d";
  activePanel: "chart" | "orderBook" | "orders";
};

const initialState: TradingUiState = {
  currentSymbol: "BTCUSDT",
  selectedInterval: "1m",
  activePanel: "chart",
};

const tradingUiSlice = createSlice({
  name: "tradingUi",
  initialState,
  reducers: {
    changeSymbol(state, action: PayloadAction<string>) {
      state.currentSymbol = action.payload;
    },
    changeInterval(state, action: PayloadAction<TradingUiState["selectedInterval"]>) {
      state.selectedInterval = action.payload;
    },
    changePanel(state, action: PayloadAction<TradingUiState["activePanel"]>) {
      state.activePanel = action.payload;
    },
  },
});

export const { changeSymbol, changeInterval, changePanel } = tradingUiSlice.actions;
export const tradingUiReducer = tradingUiSlice.reducer;
```

重點：

- 目前交易對、K 線週期、手機版 active panel 是前端本地狀態，適合 Redux。
- 餘額、訂單、交易規則是伺服器資料狀態，優先用 React Query。
- Redux Toolkit 裡看起來像直接修改，實際上會透過 Immer 產生不可變更新。
