---
title: "React 基礎：Vue 對照版"
description: "給 Vue 背景工程師補 React 基礎，使用 Vue 與 React 程式碼對照理解 JSX、元件、props、state、事件、列表、表單、effect 與 hooks。"
tags:
  - React
  - Vue
  - Interview
  - Binance
keywords: ["React 基礎", "Vue 對照 React", "JSX", "useState", "useEffect", "React interview"]
sidebar_position: 2
---

# React 基礎：Vue 對照版

## 先建立 React 的基本心法

如果你本來寫 Vue，先用這句話理解 React：

> Vue 是「資料變了，框架追蹤依賴後更新模板」；React 是「狀態變了，元件函式重新執行，重新算出畫面」。

React 裡最重要的基礎是：

- 元件本質是 function。
- props 是父層傳進來的資料。
- state 是元件自己管理、會影響畫面的資料。
- state 改變時，React 會重新執行元件 function。
- render 階段只是重新計算畫面；React 會再比對新舊結果後更新 DOM。
- 不要直接改 state object，要產生新 object / array。

## Vue SFC vs React Component

### Vue

```vue
<template>
  <section>
    <h2>{{ symbol }}</h2>
    <p>最新價：{{ lastPrice }}</p>
  </section>
</template>

<script setup>
defineProps({
  symbol: String,
  lastPrice: String,
});
</script>
```

### React

```tsx
type TickerCardProps = {
  symbol: string;
  lastPrice: string;
};

function TickerCard({ symbol, lastPrice }: TickerCardProps) {
  return (
    <section>
      <h2>{symbol}</h2>
      <p>最新價：{lastPrice}</p>
    </section>
  );
}
```

重點：

- Vue 用 template 描述畫面。
- React 用 JSX 描述畫面。
- React JSX 裡 `{}` 可以放 JavaScript expression。
- React component 名稱要大寫，像 `TickerCard`。

面試說法：

> React component 是一個接收 props、回傳 UI 的 function。當 props 或 state 改變時，React 會重新執行這個 function，產生新的畫面描述。

## JSX 基礎

JSX 看起來像 HTML，但它其實是 JavaScript。

### Vue 條件渲染

```vue
<template>
  <p v-if="isPositive">上漲</p>
  <p v-else>下跌或持平</p>
</template>
```

### React 條件渲染

```tsx
function PriceChange({ change }: { change: number }) {
  const isPositive = change > 0;

  return (
    <div>
      {isPositive ? <p>上漲</p> : <p>下跌或持平</p>}
    </div>
  );
}
```

### Vue class 綁定

```vue
<p :class="{ green: change > 0, red: change < 0 }">
  {{ change }}%
</p>
```

### React className

```tsx
function ChangeText({ change }: { change: number }) {
  const className = change > 0 ? "green" : change < 0 ? "red" : "gray";

  return <p className={className}>{change}%</p>;
}
```

重點：

- React 用 `className`，不是 `class`。
- React 裡沒有 `v-if`、`v-for`，用 JavaScript 寫條件和列表。
- JSX 只能回傳一個根節點，所以常用 `<>...</>` fragment。

## Props：父傳子

### Vue 父層

```vue
<TickerCard symbol="BTCUSDT" last-price="65000" />
```

### Vue 子層

```vue
<script setup>
defineProps({
  symbol: String,
  lastPrice: String,
});
</script>
```

### React 父層

```tsx
function TradingPage() {
  return <TickerCard symbol="BTCUSDT" lastPrice="65000" />;
}
```

### React 子層

```tsx
type TickerCardProps = {
  symbol: string;
  lastPrice: string;
};

function TickerCard(props: TickerCardProps) {
  return (
    <section>
      <h2>{props.symbol}</h2>
      <p>{props.lastPrice}</p>
    </section>
  );
}
```

常見寫法是直接解構：

```tsx
function TickerCard({ symbol, lastPrice }: TickerCardProps) {
  return (
    <section>
      <h2>{symbol}</h2>
      <p>{lastPrice}</p>
    </section>
  );
}
```

面試說法：

> Props 是父元件傳給子元件的資料。子元件不應該直接修改 props；如果子元件要通知父元件，就由父元件傳 callback 下來。

## State：元件自己的狀態

### Vue ref

```vue
<template>
  <button @click="count++">點擊 {{ count }}</button>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
</script>
```

### React useState

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      點擊 {count}
    </button>
  );
}
```

重點：

- React state 要透過 setter 更新，例如 `setCount`。
- 不要寫 `count++`，因為 React 不會知道你改了。
- state 更新後，元件 function 會重新執行。

## State 更新要用 function 寫法的時機

如果下一個 state 依賴上一個 state，建議用 function 寫法。

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  }

  return <button onClick={addThree}>{count}</button>;
}
```

面試說法：

> 當下一個 state 依賴上一個 state，我會使用 functional update，避免讀到同一次 render 裡的舊值。

## 事件處理

### Vue

```vue
<button @click="submitOrder">下單</button>

<script setup>
function submitOrder() {
  console.log("submit");
}
</script>
```

### React

```tsx
function TradeButton() {
  function submitOrder() {
    console.log("submit");
  }

  return <button onClick={submitOrder}>下單</button>;
}
```

帶參數：

```tsx
function SymbolList() {
  function selectSymbol(symbol: string) {
    console.log(symbol);
  }

  return (
    <button onClick={() => selectSymbol("BTCUSDT")}>
      BTCUSDT
    </button>
  );
}
```

重點：

- React 事件是 camelCase，例如 `onClick`、`onChange`。
- 傳 function，不是直接執行 function。
- `onClick={submitOrder}` 是傳函式。
- `onClick={submitOrder()}` 會在 render 當下直接執行，通常是錯的。

## 列表渲染與 key

### Vue

```vue
<template>
  <ul>
    <li v-for="order in orders" :key="order.id">
      {{ order.symbol }} - {{ order.price }}
    </li>
  </ul>
</template>
```

### React

```tsx
type Order = {
  id: string;
  symbol: string;
  price: string;
};

function OpenOrders({ orders }: { orders: Order[] }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.symbol} - {order.price}
        </li>
      ))}
    </ul>
  );
}
```

重點：

- React 用 `array.map()` 渲染列表。
- `key` 是 React 判斷列表項目身份用的。
- 不建議用 index 當 key，尤其列表會排序、插入、刪除。
- open orders 用 `order.id` 當 key；order book 可以用 `side + price`。

面試說法：

> Key 不是給畫面看的，是給 React diff 用的。穩定 key 可以避免列表項目身份錯亂。

## 表單：受控元件

### Vue v-model

```vue
<template>
  <input v-model="price" />
  <input v-model="quantity" />
  <p>金額：{{ Number(price) * Number(quantity) }}</p>
</template>

<script setup>
import { ref } from "vue";

const price = ref("");
const quantity = ref("");
</script>
```

### React controlled component

```tsx
import { useState } from "react";

function TradeForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const notional = Number(price || 0) * Number(quantity || 0);

  return (
    <form>
      <input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="價格"
      />
      <input
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
        placeholder="數量"
      />
      <p>金額：{notional}</p>
    </form>
  );
}
```

重點：

- React 的 input value 由 state 控制，所以叫受控元件。
- 使用者輸入時觸發 `onChange`，再用 setter 更新 state。
- 交易產品正式環境不要用 `Number` 做精準金融計算，這裡只是基礎語法示範。

## useReducer：表單欄位多時更清楚

當下單表單欄位變多，用很多 `useState` 會變亂。

```tsx
import { useReducer } from "react";

type State = {
  side: "buy" | "sell";
  price: string;
  quantity: string;
};

type Action =
  | { type: "change_side"; side: "buy" | "sell" }
  | { type: "change_price"; price: string }
  | { type: "change_quantity"; quantity: string };

const initialState: State = {
  side: "buy",
  price: "",
  quantity: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "change_side":
      return { ...state, side: action.side };
    case "change_price":
      return { ...state, price: action.price };
    case "change_quantity":
      return { ...state, quantity: action.quantity };
    default:
      return state;
  }
}

function TradeFormWithReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <form>
      <button
        type="button"
        onClick={() => dispatch({ type: "change_side", side: "buy" })}
      >
        買入
      </button>
      <button
        type="button"
        onClick={() => dispatch({ type: "change_side", side: "sell" })}
      >
        賣出
      </button>

      <input
        value={state.price}
        onChange={(event) =>
          dispatch({ type: "change_price", price: event.target.value })
        }
      />
      <input
        value={state.quantity}
        onChange={(event) =>
          dispatch({ type: "change_quantity", quantity: event.target.value })
        }
      />
    </form>
  );
}
```

面試說法：

> 如果狀態欄位多，而且狀態變化有明確事件，我會用 useReducer。下單表單就是典型場景，因為 side、price、quantity、order type、validation 彼此有關。

## computed 對照：React 直接推導或 useMemo

### Vue computed

```vue
<script setup>
import { computed, ref } from "vue";

const bids = ref([
  { price: "65000", quantity: "0.2" },
  { price: "64900", quantity: "0" },
]);

const visibleBids = computed(() => {
  return bids.value.filter((item) => item.quantity !== "0");
});
</script>
```

### React 直接推導

```tsx
function OrderBookSide({ bids }: { bids: Level[] }) {
  const visibleBids = bids.filter((item) => item.quantity !== "0");

  return (
    <ul>
      {visibleBids.map((item) => (
        <li key={item.price}>{item.price}</li>
      ))}
    </ul>
  );
}
```

### React useMemo

```tsx
import { useMemo } from "react";

function OrderBookSide({ bids }: { bids: Level[] }) {
  const visibleBids = useMemo(() => {
    return bids.filter((item) => item.quantity !== "0");
  }, [bids]);

  return (
    <ul>
      {visibleBids.map((item) => (
        <li key={item.price}>{item.price}</li>
      ))}
    </ul>
  );
}
```

重點：

- 簡單計算可以直接寫在元件內。
- 計算很重、或要傳給 memo child 時，再用 `useMemo`。
- `useMemo` 依賴 array，Vue computed 依賴響應式追蹤。

## watch 對照：useEffect

### Vue watch symbol

```ts
watch(symbol, async (nextSymbol) => {
  ticker.value = await fetchTicker(nextSymbol);
});
```

### React useEffect symbol

```tsx
function TickerPanel({ symbol }: { symbol: string }) {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadTicker() {
      const data = await fetchTicker(symbol);

      if (!ignore) {
        setTicker(data);
      }
    }

    loadTicker();

    return () => {
      ignore = true;
    };
  }, [symbol]);

  return <div>{ticker?.lastPrice ?? "載入中"}</div>;
}
```

更正式的 request cancellation：

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetchTicker(symbol, controller.signal)
    .then(setTicker)
    .catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });

  return () => {
    controller.abort();
  };
}, [symbol]);
```

重點：

- `useEffect` 不是所有 watch 的替代品。
- 只有同步外部系統時才用 effect，例如 API、WebSocket、DOM、storage。
- 如果只是計算資料，不要用 effect。

## onMounted / onUnmounted 對照

### Vue

```ts
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
```

### React

```tsx
useEffect(() => {
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

面試說法：

> React effect 的 return function 是 cleanup。訂閱事件、timer、WebSocket 都要 cleanup，避免記憶體洩漏或舊資料繼續更新。

## props callback：子元件通知父元件

### Vue emit

```vue
<template>
  <button @click="$emit('select', 'BTCUSDT')">BTC</button>
</template>
```

### React callback prop

```tsx
function SymbolButton({
  onSelect,
}: {
  onSelect: (symbol: string) => void;
}) {
  return (
    <button onClick={() => onSelect("BTCUSDT")}>
      BTC
    </button>
  );
}

function TradingPage() {
  const [symbol, setSymbol] = useState("BTCUSDT");

  return <SymbolButton onSelect={setSymbol} />;
}
```

重點：

- Vue 子層常用 emit 通知父層。
- React 通常是父層傳 callback 給子層。
- 資料仍是單向流動：父層 state -> 子層 props；子層 callback -> 父層更新 state。

## 不可變更新：React 很重要

### 錯誤寫法

```tsx
const [orders, setOrders] = useState<Order[]>([]);

function addOrder(order: Order) {
  orders.push(order);
  setOrders(orders);
}
```

這樣容易出問題，因為 array reference 沒變。

### 正確寫法

```tsx
function addOrder(order: Order) {
  setOrders((prev) => [...prev, order]);
}
```

更新某一筆：

```tsx
function updateOrderStatus(orderId: string, status: Order["status"]) {
  setOrders((prev) =>
    prev.map((order) =>
      order.id === orderId ? { ...order, status } : order,
    ),
  );
}
```

面試說法：

> React 常靠 reference equality 判斷資料是否改變，所以更新 object / array 時要建立新 reference。

## React 的資料流：交易頁小範例

```tsx
function TradingPage() {
  const [symbol, setSymbol] = useState("BTCUSDT");

  return (
    <main>
      <SymbolSelector value={symbol} onChange={setSymbol} />
      <TickerPanel symbol={symbol} />
      <TradeForm symbol={symbol} />
    </main>
  );
}
```

理解方式：

- `TradingPage` 擁有目前交易對 state。
- `SymbolSelector` 負責改交易對。
- `TickerPanel` 根據交易對抓行情。
- `TradeForm` 根據交易對載入規則與提交訂單。

面試說法：

> 我會把跨區塊共用的狀態往上提，例如目前 symbol；只屬於表單內部的 state 留在表單內。API server state 則交給 React Query。

## 最小交易頁：把基礎串起來

這段不是 production code，是用來把 React 基礎串起來。

```tsx
import { useEffect, useMemo, useState } from "react";

type Ticker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};

function MiniTradingPage() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTicker() {
      const data = await fetchTicker(symbol);

      if (!ignore) {
        setTicker(data);
        setPrice(data.lastPrice);
      }
    }

    loadTicker();

    return () => {
      ignore = true;
    };
  }, [symbol]);

  const notional = useMemo(() => {
    return Number(price || 0) * Number(quantity || 0);
  }, [price, quantity]);

  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log({
      symbol,
      side: "buy",
      price,
      quantity,
    });
  }

  return (
    <main>
      <select value={symbol} onChange={(event) => setSymbol(event.target.value)}>
        <option value="BTCUSDT">BTCUSDT</option>
        <option value="ETHUSDT">ETHUSDT</option>
      </select>

      <section>
        <h2>{symbol}</h2>
        <p>最新價：{ticker?.lastPrice ?? "載入中"}</p>
        <p>漲跌幅：{ticker?.priceChangePercent ?? "-"}%</p>
      </section>

      <form onSubmit={submitOrder}>
        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="價格"
        />
        <input
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          placeholder="數量"
        />
        <p>預估金額：{notional}</p>
        <button type="submit">買入</button>
      </form>
    </main>
  );
}
```

這段包含：

- `useState`：交易對、行情、表單欄位。
- `useEffect`：交易對改變時重新抓行情。
- `useMemo`：根據 price / quantity 推導金額。
- controlled input：價格和數量由 state 控制。
- event handler：submit 時阻止表單預設刷新。

## 面試最短回答模板

### React 和 Vue 最大差異？

> Vue 是響應式依賴追蹤，React 是 state/props 改變後重新執行 component function，再比對 UI。React 不會自動追蹤 object 裡每個欄位，所以我會用 immutable update 和清楚的資料流。

### React state 怎麼更新？

> 用 setter 更新，例如 `setPrice(nextPrice)`。如果下一個值依賴上一個值，用 functional update，例如 `setCount((prev) => prev + 1)`。

### React 裡表單怎麼做？

> 常用受控元件，input value 來自 state，onChange 更新 state。交易下單表單欄位多時，我會用 `useReducer` 管理狀態和驗證。

### 什麼時候用 useEffect？

> 當元件要同步外部系統時使用，例如 API、WebSocket、DOM event、timer。單純推導資料不要放 effect。

### 為什麼不能直接改 state object？

> React 常靠 reference equality 判斷資料變化，直接 mutate object / array 可能讓 React 或 memoized child 判斷不到變化。應該建立新的 object / array。
