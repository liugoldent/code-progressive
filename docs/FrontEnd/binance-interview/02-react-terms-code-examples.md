---
title: "React 術語中文對照與交易頁範例"
description: "把 Binance React 前端面試常見術語翻成中文，並用交易頁程式碼示範 React、Redux、React Query、WebSocket 與下單表單。"
tags:
  - React
  - Vue
  - Binance
  - Interview
keywords: ["React 中文", "React Query 範例", "Redux 範例", "Binance trading UI", "Vue 轉 React"]
sidebar_position: 3
---

# React 術語中文對照與交易頁範例

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

  if (query.isLoading) return <div>行情載入中</div>;
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

重點：

- `queryKey: ["ticker", symbol]` 是快取身份。
- 不同 symbol 要有不同快取，避免 BTC 和 ETH 資料混在一起。
- `staleTime` 是資料新鮮時間，不是多久輪詢一次。

## 範例五：下單 mutation 後讓列表重新抓

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
    onSuccess: (_data, input) => {
      queryClient.invalidateQueries({ queryKey: ["openOrders", input.symbol] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
    },
  });
}
```

重點：

- mutation 是會改伺服器資料的請求。
- 下單成功後，未成交訂單和餘額都可能變，所以標記快取失效。
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
