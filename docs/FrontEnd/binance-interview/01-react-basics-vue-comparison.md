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

### setCount 為什麼要這樣寫？

React 的 `count` 不是 Vue `ref` 那種「可直接被追蹤的響應式容器」，而是這次 render 拿到的 state 快照（snapshot）。

```tsx
const [count, setCount] = useState(0);
```

這行可以拆成兩個角色來看：

- `count`：目前這次 render 讀到的值。
- `setCount`：通知 React「下一次 render 請使用新的 count」的更新函式。

所以 `setCount(count + 1)` 不是在原地修改 `count`，而是在告訴 React：

1. 下一個 `count` 應該變成 `count + 1`。
2. 請安排元件重新 render。
3. 重新執行 `Counter()`，拿到新的 `count`。
4. 比對新的 JSX 結果，更新畫面上真的需要變動的 DOM。

也就是說，React 重新畫畫面的入口是 setter，不是變數本身。

錯誤理解：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function add() {
    // 錯：count 是這次 render 的快照，不是響應式 ref
    // count++;
  }

  return <button onClick={add}>{count}</button>;
}
```

`count++` 會有兩個問題：

- `count` 是 `const`，本來就不能直接改。
- 即使是物件 state，你直接改內部欄位，React 也不會因為你改了某個屬性就知道要重新 render。

物件 state 更容易踩雷：

```tsx
type TradeForm = {
  price: string;
  quantity: string;
};

function TradePanel() {
  const [form, setForm] = useState<TradeForm>({
    price: "",
    quantity: "",
  });

  function wrongChangePrice(price: string) {
    // 錯：直接改舊物件，React 不會因為這行就收到更新通知
    form.price = price;
  }

  function changePrice(price: string) {
    // 對：建立新物件，並透過 setter 通知 React 更新
    setForm((prev) => ({
      ...prev,
      price,
    }));
  }

  return (
    <input
      value={form.price}
      onChange={(event) => changePrice(event.target.value)}
    />
  );
}
```

這裡的 `setForm((prev) => ({ ...prev, price }))` 有三個重點：

- `prev` 是 React 提供的最新 state，不一定等於目前 render 裡的 `form`。
- `{ ...prev, price }` 是建立新物件，不是修改舊物件。
- React 收到 setter 後，才會排程更新並重新 render。

### 和 Vue 的差異

Vue 的 `ref` 本身是響應式容器，所以你寫：

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function add() {
  count.value++;
}
</script>
```

Vue 能追蹤 `count.value` 被改變，因為 `ref` 內部幫你包了一層 getter / setter。

React 則是把更新動作明確交給你：

```tsx
function add() {
  setCount((prev) => prev + 1);
}
```

可以把它想成：

- Vue：改 `ref.value`，框架幫你追蹤依賴。
- React：呼叫 setter，明確通知框架更新狀態。

這也是 React 面試很常問的點：React 比較重視「資料不可變（immutability）」和「render 是 state 的結果」。你不要直接改舊資料，而是建立下一份 state，交給 React 重新 render。

### setState 後：function 會重跑，但 DOM 只更新差異

`setState` 或 `setCount` 觸發的是 React 的 render 流程，不是直接把整個瀏覽器畫面砍掉重建。

可以分成兩個階段理解：

1. render 階段：React 重新執行相關 component function，算出這次新的 JSX。
2. commit 階段：React 比對新舊結果，只把真的有差異的地方更新到 DOM。

所以比較精準的說法是：

```txt
state 改變
-> component function 重新執行
-> 普通變數與推導資料重新計算
-> React 比對新舊 JSX
-> DOM 只更新真的變動的部分
```

範例：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  console.log("Counter render");

  const double = count * 2;

  return (
    <div>
      <h1>Binance Interview Notes</h1>

      <button onClick={() => setCount((prev) => prev + 1)}>
        count: {count}
      </button>

      <p>double: {double}</p>

      <StaticPanel />
    </div>
  );
}

function StaticPanel() {
  console.log("StaticPanel render");

  return <section>固定內容</section>;
}
```

第一次 render 會看到：

```txt
Counter render
StaticPanel render
```

點擊 button 後，因為 `setCount` 讓 `Counter` 重新 render，通常也會看到：

```txt
Counter render
StaticPanel render
```

這代表 component function 重新執行了，所以這些東西都會重新計算：

```tsx
const double = count * 2;

<h1>Binance Interview Notes</h1>
<button>count: {count}</button>
<p>double: {double}</p>
<StaticPanel />
```

但真實 DOM 不會全部重建。React 比對後會發現：

- `h1` 文字一樣，不需要改 DOM。
- `section` 文字一樣，不需要改 DOM。
- button 文字從 `count: 0` 變 `count: 1`，需要更新。
- `p` 文字從 `double: 0` 變 `double: 2`，需要更新。

這就是為什麼 React 裡很多普通變數看起來像 Vue computed：

```tsx
const double = count * 2;
```

它不是 state，也不會自己觸發 render；但只要它依賴的 state 改了，component function 重新執行時，它就會重新被算出來。

如果子元件真的很重，且 props 沒有變，可以用 `React.memo` 讓它在父層 render 時被跳過：

```tsx
const StaticPanel = React.memo(function StaticPanel() {
  console.log("StaticPanel render");

  return <section>固定內容</section>;
});
```

但面試時不要一開始就說全部都要 `memo`。比較好的說法是：先理解 render 原因，真的有效能問題再用 Profiler 和 memoization 優化。

面試說法：

> 呼叫 setter 後，React 會重新執行相關 component function 來計算新的 UI 描述，這是 render 階段；接著 React 會做新舊結果比對，commit 階段只更新真正有差異的 DOM。一般變數只是在 render 過程中重新計算，不會自己觸發更新；真正觸發 render 的來源是 state、props、context 或 store 訂閱變化。

## State 更新要用 function 寫法的時機

如果下一個 state 依賴上一個 state，建議用 function 寫法。

先看容易誤會的寫法：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function addThreeWrong() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={addThreeWrong}>{count}</button>;
}
```

如果一開始 `count` 是 `0`，這三行讀到的都是同一次 render 的 `count = 0`，所以它們送出的下一個值都是 `1`。React 可能會把同一個事件裡的更新批次處理（batching），最後畫面通常只會變成 `1`，不是 `3`。

這時要改成 functional update：

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

`prev` 不是你自己從外面閉包抓到的舊 `count`，而是 React 在處理更新佇列時，依序傳進來的最新值。所以上面三次更新會變成：

1. `prev = 0`，回傳 `1`。
2. `prev = 1`，回傳 `2`。
3. `prev = 2`，回傳 `3`。

實務判斷：

- 如果下一個值只是來自輸入事件，可以直接傳值：`setKeyword(event.target.value)`。
- 如果下一個值依賴上一個 state，用 callback：`setCount((prev) => prev + 1)`。
- 如果更新 object / array，建立新資料，不要原地修改。

幣安前端常見情境：

```tsx
type Order = {
  symbol: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
};

function OrderForm() {
  const [order, setOrder] = useState<Order>({
    symbol: "BTCUSDT",
    side: "BUY",
    price: "",
    quantity: "",
  });

  function changeSide(side: Order["side"]) {
    setOrder((prev) => ({
      ...prev,
      side,
    }));
  }

  function resetPriceAndQuantity() {
    setOrder((prev) => ({
      ...prev,
      price: "",
      quantity: "",
    }));
  }

  return (
    <form>
      <button type="button" onClick={() => changeSide("BUY")}>
        Buy
      </button>
      <button type="button" onClick={() => changeSide("SELL")}>
        Sell
      </button>
      <button type="button" onClick={resetPriceAndQuantity}>
        Reset
      </button>
    </form>
  );
}
```

這種寫法能避免兩個問題：

- 多個 state 更新被批次處理時，讀到舊 closure 裡的值。
- 直接修改 object，造成 React 沒有拿到新的 state reference。

面試說法：

> `useState` 回傳的是目前 render 的 state 快照和更新函式。React 不會追蹤你直接改變變數或 object 欄位；呼叫 setter 才是通知 React 排程更新的方式。當下一個 state 依賴上一個 state，我會使用 functional update，避免 batching 或同一次 render 的 snapshot 造成舊值問題。

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

### React 表單不是雙向綁定

React 的受控表單和 Vue `v-model` 看起來很像，但本質不同。

Vue `v-model` 會幫你把「資料進 input」和「input 改資料」包成一個語法：

```vue
<input v-model="price" />
```

可以理解成：

```vue
<input
  :value="price"
  @input="price = $event.target.value"
/>
```

React 沒有自動雙向綁定，要自己明確寫出資料流：

```tsx
<input
  value={price}
  onChange={(event) => setPrice(event.target.value)}
/>
```

資料流是：

```txt
state.price -> input.value -> 使用者輸入 -> onChange -> setState/dispatch -> 新 state -> 重新 render -> input.value
```

所以更精準的說法是：

- 使用者操作 UI 會觸發事件。
- 事件裡呼叫 `setState` 或 `dispatch`。
- state 被更新後，React 重新執行 component function。
- JSX 依照新的 state 重新算出畫面。

也就是「state 是 UI 的資料來源，UI 是 state 的結果」。React 是單向資料流，不是 Vue 那種語法層級的雙向綁定。

如果要把整個 state 顯示在畫面上，不能直接寫 `{state}`，因為 object 不能直接當 React child。要轉成字串：

```tsx
<pre>{JSON.stringify(state, null, 2)}</pre>
```

面試說法：

> React 表單通常用 controlled component。input 的 value 來自 state，使用者輸入時透過 onChange 呼叫 setState 或 dispatch。它看起來像雙向綁定，但資料流仍然是單向的：state 產生 UI，event 再把使用者操作轉成下一個 state。

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
