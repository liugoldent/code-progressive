---
sidebar_position: 18
title: "React 現場實戰題（第二回）：Identity / Render / Concurrent UI"
description: "六題深入 React list key、prop 初始化 state、React.memo reference、Context render、useSyncExternalStore 與 Transition，從錯誤行為推導正確資料流。"
tags:
  - React
  - Hooks
  - Performance
  - Interview
keywords: ["React key 面試題", "React.memo 面試題", "React Context render", "useSyncExternalStore", "useTransition", "React concurrent rendering", "React 實戰題"]
---

# React 現場實戰題（第二回）：Identity / Render / Concurrent UI

:::tip 系列導覽

[回到系列總覽](./13-react-live-interview-series.md) · [入門篇：Props / State / Form / Effect](./15-react-foundations-live-demo.md) · [第一回：State / Effect / Realtime](./11-react-state-effect-live-demo.md) · [第一回補強：State / Effect / Async 組合題](./16-react-state-effect-reinforcement.md) · **第二回：Identity / Render / Concurrent UI**

:::

第一回主要沿著時間順序找 state、effect 與 async bug；這一回改看另一組常見問題：React 如何判斷「是不是同一個東西」，以及你的資料邊界如何影響 render。

每一題先回答三件事再展開答案：

1. 使用者實際會看到什麼？
2. React 為什麼做出這個結果？
3. 修正後的 source of truth 與 identity 在哪裡？

## 題目一：排序後，輸入內容為什麼跑到另一筆訂單？

### 題目

使用者可以在每一筆訂單旁輸入備註。請先找出問題，再預測重新排序後會發生什麼：

```tsx
import { useState } from "react";

type Order = {
  id: string;
  symbol: string;
  quantity: number;
};

function OrderRow({ order }: { order: Order }) {
  const [note, setNote] = useState("");

  return (
    <li>
      <span>
        {order.symbol} / {order.quantity}
      </span>
      <input
        aria-label={`${order.symbol} note`}
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
    </li>
  );
}

export function OpenOrders({ orders }: { orders: Order[] }) {
  const [ascending, setAscending] = useState(true);
  const sortedOrders = [...orders].sort((a, b) =>
    ascending ? a.quantity - b.quantity : b.quantity - a.quantity,
  );

  return (
    <>
      <button onClick={() => setAscending((value) => !value)}>
        reverse
      </button>
      <ul>
        {sortedOrders.map((order, index) => (
          <OrderRow key={index} order={order} />
        ))}
      </ul>
    </>
  );
}
```

假設排序前第一列是 BTC、第二列是 ETH。使用者在 BTC 輸入 `urgent`，然後按下 `reverse`，讓 ETH 來到第一列。

### 答案

備註很可能留在第一列，因此看起來變成 ETH 的備註是 `urgent`。

問題不是 `sort`，而是 `key={index}` 把「第 0 個位置」當成 identity。排序前後，React 看到的 child key 仍然是：

```txt
排序前：key 0、key 1
排序後：key 0、key 1
```

React 因此保留 key `0` 對應的 `OrderRow` instance 與它的 local state，只把 prop 從 BTC 換成 ETH。`note` 屬於 component instance，不會因為 `order` prop 換了就自動清空。

可以把它想成：

```txt
排序前
key 0 → props: BTC、local note: "urgent"
key 1 → props: ETH、local note: ""

排序後（使用 index key）
key 0 → props 改成 ETH、local note 仍是 "urgent"
key 1 → props 改成 BTC、local note 仍是 ""
```

### 修正版

使用資料本身穩定且唯一的 identity：

```tsx
{sortedOrders.map((order) => (
  <OrderRow key={order.id} order={order} />
))}
```

現在 React 會把 `order.id` 與 component state 綁在一起：

```txt
BTC order id → BTC 的 OrderRow instance → BTC 的 note
ETH order id → ETH 的 OrderRow instance → ETH 的 note
```

排序只改變位置，不會交換 identity。

### 不是看到 list 就不能用 index

Index key 在「項目固定、沒有插入刪除、不會排序、child 沒有需要保留的 local state」時不一定立刻出錯。但只要列表會重排或編輯，就不應把位置冒充資料 identity。

也不要用每次 render 都會變的 key：

```tsx
<OrderRow key={crypto.randomUUID()} order={order} />
```

這會讓 React 每次都把舊 component unmount、建立新 component；local state、focus 與未完成輸入都會被重設。

### 面試口述

> Key 不只是消除 warning，它決定 sibling 之間的 component identity。用 index 當 key 時，排序會讓原本位置的 local state 被配給另一筆資料。我會使用後端提供的穩定 order id；若刻意改 key，則要清楚那代表要求 React remount 並重設整棵子樹的 state。

## 題目二：交易對已切換，為什麼表單仍保留上一個價格？

### 題目

Parent 把最新商品與市場價格傳進下單表單：

```tsx
import { useState } from "react";

type OrderTicketProps = {
  symbol: string;
  marketPrice: string;
};

function OrderTicket({ symbol, marketPrice }: OrderTicketProps) {
  const [price, setPrice] = useState(marketPrice);

  return (
    <label>
      {symbol} limit price
      <input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
    </label>
  );
}
```

第一次 render 是 `BTCUSDT / 65000`。接著 parent 改成 `ETHUSDT / 3500`。Input 會顯示多少？

### 答案

Input 仍顯示 `65000`，除非使用者之前已經改過它。

`useState(marketPrice)` 的參數只用來建立這個 component instance 的初始 state。之後 prop 改變會讓 component 再 render，但不會重新初始化 state：

```txt
mount：marketPrice = "65000"
→ 建立 price state = "65000"

下一次 render：marketPrice = "3500"
→ 讀取既有 price state = "65000"
→ 不會再次使用 initial state
```

這不是 React 漏掉同步，而是程式同時存在兩份可能不同的資料：

- `marketPrice`：parent 提供的市場價。
- `price`：使用者正在編輯的 limit price draft。

真正要先回答的是：交易對切換、行情跳動、使用者已輸入內容時，各自應該保留還是重設 draft？

### 修正方案 A：根本不需要可編輯 state

如果只是顯示市場價，不要複製 prop：

```tsx
function MarketPrice({ symbol, marketPrice }: OrderTicketProps) {
  return <output>{symbol}: {marketPrice}</output>;
}
```

`marketPrice` 就是唯一 source of truth。

### 修正方案 B：切商品代表全新的表單

若產品規則是「切 symbol 就丟掉舊 draft，並以新市場價建立表單」，可在 parent 用 key 明確表達 reset 邊界：

```tsx
<OrderTicket
  key={symbol}
  symbol={symbol}
  marketPrice={marketPrice}
/>
```

Symbol 改變時，舊 `OrderTicket` unmount，新 instance 以新的 `marketPrice` 初始化。這種做法簡潔，但會重設整個子樹的 state、focus 與未送出的欄位；這必須是你真的想要的產品行為。

### 修正方案 C：每個商品都要保留自己的 draft

若切回 BTC 時要恢復 BTC 尚未送出的內容，draft 不該只存在目前這個 ticket 裡。可以由 parent 以 symbol 管理：

```tsx
type Drafts = Record<string, string>;

function TradingPage({ symbol, marketPrice }: OrderTicketProps) {
  const [drafts, setDrafts] = useState<Drafts>({});
  const price = drafts[symbol] ?? marketPrice;

  function updatePrice(nextPrice: string) {
    setDrafts((previous) => ({
      ...previous,
      [symbol]: nextPrice,
    }));
  }

  return (
    <OrderTicketControlled
      symbol={symbol}
      price={price}
      onPriceChange={updatePrice}
    />
  );
}
```

這時 draft identity 是 `symbol`，資料不會因單一 component instance 的生命週期而消失。

### 能不能用 effect 同步？

可以在明確規格下做 reset：

```tsx
useEffect(() => {
  setPrice(marketPrice);
}, [symbol]);
```

但這不是看到 prop 與 state 就自動套用的公式。Effect 在 commit 後才執行，symbol 改變的那次 render 仍會先讀到舊 draft，之後再多一次 state update；而且 dependency 與重設規則寫錯時，可能在每次行情更新時覆蓋使用者輸入。若「新 identity 就要全新 state」，key 通常更直接。

### 面試口述

> Prop 傳給 useState 只負責初始化，不會持續同步。我會先定義這是市場資料、目前表單 draft，還是每個 symbol 各自的 draft。只顯示就直接用 prop；切 symbol 要整份重設可以用 key；要保留多商品草稿則提升 state，按 symbol 建模。方案取決於產品規則，不是補一個 effect 就結束。

## 題目三：加了 `React.memo`，為什麼明細列仍一直 render？

### 題目

頁面上的 clock 每秒更新。`PriceRow` 已經包了 `memo`，但 console 仍每秒出現：

```tsx
import { memo, useState } from "react";

type PriceRowProps = {
  symbol: string;
  price: string;
  format: { decimals: number; showCurrency: boolean };
  onSelect: (symbol: string) => void;
};

const PriceRow = memo(function PriceRow(props: PriceRowProps) {
  console.log("render PriceRow", props.symbol);
  return (
    <button onClick={() => props.onSelect(props.symbol)}>
      {props.symbol}: {props.price}
    </button>
  );
});

export function Watchlist() {
  const [now, setNow] = useState(Date.now());

  return (
    <>
      <button onClick={() => setNow(Date.now())}>refresh clock</button>
      <time>{now}</time>
      <PriceRow
        symbol="BTCUSDT"
        price="65000"
        format={{ decimals: 2, showCurrency: true }}
        onSelect={(symbol) => console.log("select", symbol)}
      />
    </>
  );
}
```

`symbol` 與 `price` 沒變，為什麼 memo 沒跳過這次 render？

### 答案

`memo` 預設逐一用 `Object.is` 比較新舊 props。每次呼叫 `Watchlist()` 都會建立新的 object 與 function：

```tsx
{ decimals: 2, showCurrency: true }       // 新 object reference
(symbol) => console.log("select", symbol) // 新 function reference
```

內容看起來相同，不代表 reference 相同：

```tsx
Object.is({ decimals: 2 }, { decimals: 2 }); // false
Object.is(() => {}, () => {});               // false
```

只要一個 prop 不相同，`PriceRow` 就會再次 render。

### 修正版一：先改善 component API

如果 child 只需要兩個格式選項，傳 primitive 往往比傳設定 object 更清楚：

```tsx
type PriceRowProps = {
  symbol: string;
  price: string;
  decimals: number;
  showCurrency: boolean;
  onSelect: (symbol: string) => void;
};
```

再讓 callback reference 穩定：

```tsx
import { memo, useCallback, useState } from "react";

export function Watchlist() {
  const [now, setNow] = useState(Date.now());

  const handleSelect = useCallback((symbol: string) => {
    console.log("select", symbol);
  }, []);

  return (
    <>
      <button onClick={() => setNow(Date.now())}>refresh clock</button>
      <time>{now}</time>
      <PriceRow
        symbol="BTCUSDT"
        price="65000"
        decimals={2}
        showCurrency
        onSelect={handleSelect}
      />
    </>
  );
}
```

### 修正版二：object 本身有完整語意

若 `format` 確實是一個應該整體傳遞的設定，可以 memoize 它：

```tsx
const format = useMemo(
  () => ({ decimals, showCurrency }),
  [decimals, showCurrency],
);

const handleSelect = useCallback((symbol: string) => {
  selectSymbol(symbol);
}, [selectSymbol]);
```

Dependency 不能為了穩定 reference 而故意漏寫。若 callback 使用會改變的 state 或 props，必須正確列入；否則只是把不必要 render 換成 stale closure。

### 不要把 memo 當 correctness 工具

`memo` 只是一個效能提示：

- Parent render 不等於 DOM 一定更新。
- Child 很便宜時，memo 比較成本與複雜度可能不值得。
- `price` 真正變動時，PriceRow 本來就必須 render。
- Child 自己的 state 或它讀取的 Context 改變時，仍會 render。

應先用 React Profiler 找到昂貴且重複的 render，再決定要拆 state、縮小 props、使用 memo，還是根本不必處理。

### 面試口述

> React.memo 預設做 shallow prop comparison；inline object、array、function 每次 render 都有新 reference，所以會使比較失敗。我會先改善 component API 與 state colocate，再針對量測到的熱點使用 useMemo、useCallback 和 memo。穩定 reference 不能以錯誤 dependency 或 stale closure 為代價。

## 題目四：只讀 theme 的元件，為什麼被 ticker 拖著更新？

### 題目

`ticker` 每秒可能更新很多次，設定按鈕只使用 `theme`：

```tsx
import { createContext, memo, useContext, useState } from "react";

type TradingContextValue = {
  ticker: { symbol: string; price: string } | null;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

const TradingContext = createContext<TradingContextValue | null>(null);

const SettingsButton = memo(function SettingsButton() {
  const context = useContext(TradingContext);
  if (!context) throw new Error("missing TradingContext");

  console.log("render SettingsButton");
  return (
    <button onClick={() => context.setTheme("dark")}>
      current theme: {context.theme}
    </button>
  );
});

function TradingProvider({ children }: { children: React.ReactNode }) {
  const [ticker, setTicker] = useState<TradingContextValue["ticker"]>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <TradingContext.Provider value={{ ticker, theme, setTheme }}>
      {children}
    </TradingContext.Provider>
  );
}
```

為什麼 `SettingsButton` 包了 memo 仍會隨 ticker 更新？把 Provider value 包 `useMemo` 能完全解決嗎？

### 答案

Context consumer 會在它訂閱的 Provider value 改變時更新。這裡每次 ticker 改變，value 的內容確實不同；即使 `SettingsButton` 沒讀 `ticker` 欄位，它仍訂閱整個 `TradingContext` value。

`memo` 比較的是 parent 傳入的 props，不能阻止 component 因自己讀取的 Context 改變而 render。

把 value 包進 `useMemo`：

```tsx
const value = useMemo(
  () => ({ ticker, theme, setTheme }),
  [ticker, theme],
);
```

只能避免 Provider 的 parent 因無關原因 render 時建立新 value；ticker 每次真的改變，`value` 還是必須變。因此它不能解決不同更新頻率混在同一個 Context 的根本問題。

### 修正版：按責任與更新頻率拆 Context

```tsx
const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
} | null>(null);

const TickerContext = createContext<{
  symbol: string;
  price: string;
} | null>(null);

function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ticker, setTicker] = useState<{
    symbol: string;
    price: string;
  } | null>(null);

  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <TickerContext.Provider value={ticker}>
        {children}
      </TickerContext.Provider>
    </ThemeContext.Provider>
  );
}
```

`SettingsButton` 只讀 `ThemeContext`，ticker 更新就不再透過同一個 context subscription 通知它。

### 大型狀態還可以怎麼做？

如果一個 store 有很多欄位、consumer 只需要其中一小部分，可考慮：

- 把 Provider 放近真正需要它的子樹，縮小更新範圍。
- 依領域與更新頻率拆 Context。
- 使用支援 selector 的 state library，讓 consumer 訂閱選出的 slice。
- 高頻外部資料使用正式 external-store subscription，而不是把所有 tick 塞進一個巨大 Context。

重點不是「Context 很慢」，而是 Context value 的粒度決定通知邊界。

### 面試口述

> React.memo 不會擋住 component 自己訂閱的 Context update。useMemo 只能穩定沒有實際變化時的 provider value；ticker 真變時仍會通知所有 consumer。我會依資料責任與更新頻率拆 Context，或用 selector-based store，讓 theme 與高頻行情不要共享同一個更新邊界。

## 題目五：直接讀外部 store，React 為什麼不會自動更新？

### 題目

團隊把 WebSocket 最新價存在 React 外面的 mutable object：

```tsx
const priceStore = {
  current: {
    symbol: "BTCUSDT",
    price: "65000",
  },
};

socket.onmessage = (event) => {
  const next = parseTicker(event.data);
  priceStore.current.symbol = next.symbol;
  priceStore.current.price = next.price;
};

export function LatestPrice() {
  return (
    <output>
      {priceStore.current.symbol}: {priceStore.current.price}
    </output>
  );
}
```

WebSocket 收到新價格後，畫面一定會跟著更新嗎？如果剛好因其他 state 讓 component render，看似有更新，這個實作就正確嗎？

### 答案

不一定。修改一般 JavaScript object 不會通知 React 排程 render。只有當其他原因碰巧觸發 render，component 才可能讀到新的 `priceStore.current`，所以 UI 更新時間沒有可靠契約。

即使靠 timer 強制 render，也沒有解決 React 與外部資料來源之間的一致性邊界。在 concurrent rendering 下，React 可能需要多次讀 snapshot 來確認同一次畫面使用一致資料；任意讀 mutable object 可能出現 tearing，也就是不同 component 在同一次可見更新中讀到不同版本。

### 正式的 external store 介面

React 提供 `useSyncExternalStore` 來描述三件事：

1. 如何訂閱 store 變化。
2. 如何取得目前 snapshot。
3. Server rendering 時如何取得初始 snapshot。

```tsx
import { useSyncExternalStore } from "react";

type PriceSnapshot = Readonly<{
  symbol: string;
  price: string;
}>;

let snapshot: PriceSnapshot = {
  symbol: "BTCUSDT",
  price: "65000",
};

const serverSnapshot: PriceSnapshot = {
  symbol: "BTCUSDT",
  price: "--",
};

const listeners = new Set<() => void>();

export const priceStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return snapshot;
  },

  getServerSnapshot() {
    return serverSnapshot;
  },

  update(next: PriceSnapshot) {
    snapshot = next;
    listeners.forEach((listener) => listener());
  },
};

export function usePrice() {
  return useSyncExternalStore(
    priceStore.subscribe,
    priceStore.getSnapshot,
    priceStore.getServerSnapshot,
  );
}

export function LatestPrice() {
  const price = usePrice();
  return <output>{price.symbol}: {price.price}</output>;
}
```

WebSocket adapter 驗證資料後呼叫：

```tsx
socket.onmessage = (event) => {
  priceStore.update(parseAndValidateTicker(event.data));
};
```

### `getSnapshot` 的重要限制

Snapshot 沒變時，`getSnapshot()` 必須回傳同一個 cached value。下面這種寫法每次都建立 object，可能讓 React 判斷 store 一直在變：

```tsx
// 錯誤方向：每次呼叫都是新 reference
getSnapshot() {
  return { ...mutablePrice };
}
```

較安全的方式是在 store 真正更新時建立新的 immutable snapshot，平常直接回傳同一個 reference：

```tsx
update(next: PriceSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}
```

`useSyncExternalStore` 解決的是 React subscription 與 consistent snapshot，不會自動解決 WebSocket reconnect、資料驗證、sequence gap、batching 或 selector 粒度；那些仍是 store 設計的一部分。

### 什麼時候不需要 external store？

如果資料只服務一小棵 React subtree，放在 component state 或 custom hook 通常更簡單。External store 適合資料生命週期獨立於 React、需要跨多個 root 共享，或本來就由第三方 store 管理的情境。

### 面試口述

> React 不會追蹤普通 mutable object 的賦值。外部資料源要提供 subscribe 與穩定 snapshot，並透過 useSyncExternalStore 接到 React；snapshot 只在資料真的改變時換 reference。這讓 React 能正確排程更新並檢查 concurrent rendering 的一致性，但 socket lifecycle、資料順序與 batching 仍要另外設計。

## 題目六：包了 `startTransition`，輸入為什麼還是卡？

### 題目

團隊想讓十萬筆商品搜尋不阻塞輸入：

```tsx
import { useState, useTransition } from "react";

export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(products);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;

    startTransition(() => {
      const nextResults = expensiveFilter(products, nextQuery);
      setQuery(nextQuery);
      setResults(nextResults);
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <span>updating...</span>}
      <ResultList products={results} />
    </>
  );
}
```

為什麼這樣不一定讓 typing 變順？

### 答案

這裡混在一起的是三件不同的工作：

1. 受控 input 的文字必須立即更新。
2. 大型結果畫面可以使用較低優先級更新。
3. `expensiveFilter()` 本身會同步占用 JavaScript main thread。

`startTransition` 會立即呼叫你傳入的 function，藉此標記裡面的 React state updates 是 Transition。它不是 Web Worker，也不會把 callback 裡的同步迴圈搬到背景執行：

```txt
onChange
→ 立刻進入 startTransition callback
→ expensiveFilter 同步占住 main thread
→ 計算完成後才呼叫 setters
```

此外，`query` 同時控制 input，卻被標成低優先級；受控 input 的 state 應該立即更新，不能只靠 Transition 更新。

### 修正版：拆開立即值與低優先級值

```tsx
import { memo, useMemo, useState, useTransition } from "react";

const SlowResults = memo(function SlowResults({
  products,
  query,
}: {
  products: Product[];
  query: string;
}) {
  const results = useMemo(
    () => expensiveFilter(products, query),
    [products, query],
  );

  return <ResultList products={results} />;
});

export function ProductSearch({ products }: { products: Product[] }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;

    setInput(next);
    startTransition(() => {
      setQuery(next);
    });
  }

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending && <span>updating...</span>}
      <SlowResults products={products} query={query} />
    </>
  );
}
```

`input` 是 urgent update，使用者輸入後立即 render。`query` 是 Transition update，React 可以先處理新的 urgent input，再繼續或放棄過時的低優先級 render。

把 expensive calculation 移到低優先級 render 路徑，不代表計算突然變快；它只是讓 React 有機會在工作單元之間優先處理更急的畫面更新。若單次 `expensiveFilter` 本身就是一段很長、不可切割的 JavaScript，一旦開始執行仍可能阻塞 main thread。

### 另一個選擇：`useDeferredValue`

若只想讓結果畫面落後於輸入，可以保留一份 input state：

```tsx
const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);

return (
  <>
    <input value={query} onChange={(event) => setQuery(event.target.value)} />
    <SlowResults products={products} query={deferredQuery} />
  </>
);
```

可以用 `query !== deferredQuery` 顯示結果正在追上的視覺狀態。`useDeferredValue` 適合你拿到值、但無法直接控制產生該值的 setter 優先級時。

### Transition 不等於這些工具

| 需求 | 應考慮的工具 |
| --- | --- |
| 等使用者停止輸入 300ms 才打 API | debounce |
| 避免舊 response 覆蓋新查詢 | AbortController、request identity、query library |
| 真正把重 CPU 計算移出 main thread | Web Worker 或 server-side compute |
| 大量 DOM row 導致 render 太重 | virtualization、分頁、縮小 component tree |
| 讓非必要 UI 更新不阻塞 urgent input | Transition / deferred value |

Transition 沒有固定等待時間，也不保證只執行最後一次意圖，因此不能當成 debounce；它也不會取消已送出的 network request。

### 面試口述

> startTransition 調整的是 React update priority，不會把 callback 裡的同步計算移到背景。受控 input 要保留 urgent state，再把結果查詢或大型 subtree 更新標成 Transition；如果單一計算仍長時間占住 main thread，我會改用 worker、server compute、virtualization 或拆分工作。Transition 也不取代 debounce 與 request cancellation。

## 六題完成後，檢查是否真的會了

不看答案，試著在 10 分鐘內回答：

1. 為什麼 list key 會影響 local state，而不只是影響 render 效能？
2. `useState(prop)` 何時讀取 prop？切換資料 identity 時有哪些 state 策略？
3. `React.memo` 比較什麼？inline object 與 function 為什麼會讓它失效？
4. `useMemo` Provider value 為什麼擋不住 ticker 真正更新時的 Context render？
5. External store 的 `subscribe`、`getSnapshot` 與 immutable snapshot 各負責什麼？
6. `startTransition`、debounce、Web Worker 解決的是哪三種不同問題？

再做一次交叉追問：每個修正是為了 correctness 還是 performance？如果拿掉它，最先壞掉的是資料、component identity、畫面更新時機，還是操作流暢度？

## 下一步

- 回到 [系列總覽](./13-react-live-interview-series.md)，混合抽考各篇題目。
- 想補 render / commit 基礎：閱讀 [React / Redux / React Query](./05-react-state-data.md)。
- 想把 render 問題放進 production 效能情境：閱讀 [效能 / 測試 / 前端系統設計](./07-quality-performance-system.md)。
- 想複習 request race 與 realtime correctness：重做 [React 現場實戰題第一回](./11-react-state-effect-live-demo.md)。
- 想用六題組合題銜接第一、二回：前往 [React 現場實戰題第一回補強](./16-react-state-effect-reinforcement.md)。
