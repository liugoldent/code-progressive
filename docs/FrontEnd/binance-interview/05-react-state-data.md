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

### reconciliation 是什麼？

reconciliation 可以理解成 React 的「新舊畫面比對」流程。

當 state 或 props 改變時，React 會重新執行 component function，產生一棵新的 React element tree。React 不會因此直接把整個 DOM 全部重建，而是把新的 tree 跟上一輪的 tree 做比較，判斷哪些節點可以沿用、哪些 props 要更新、哪些 component 要保留 state、哪些節點需要新增、移除或替換。這個比對過程就是 reconciliation。

簡化流程：

1. state / props 更新後，React 進入 render 階段。
2. component function 被重新呼叫，產生新的 React element tree。
3. React 用 reconciliation 比對新舊 tree。
4. 如果 element type 一樣，例如都是 `<PriceRow />`，React 傾向沿用同一個 component instance，保留它的 state，再更新 props。
5. 如果 element type 不一樣，例如 `<PriceRow />` 變成 `<EmptyRow />`，React 會把舊 subtree 拆掉，建立新的 subtree。
6. 如果是 list，React 會用 `key` 判斷每個 item 的 identity；穩定的 key 可以讓 React 正確保留 row 狀態，錯誤的 key 可能造成 remount 或狀態錯位。
7. 比對完後，React 進入 commit 階段，只把必要變更套用到 DOM。

用交易頁來看：order book 每秒可能收到很多價格檔位更新。React 重新 render order book 時，reconciliation 會比對前後的 rows；如果某個 price level 的 quantity 改了，React 只需要更新那一列的文字或樣式，而不是整張表都重建。這也是為什麼 `key` 不應該亂用 array index，order book 這種資料通常會用 price level 或穩定 id 當 key。

面試回答可以這樣說：

> Reconciliation is React's process of comparing the previous React element tree with the next one. When state or props change, React re-renders components to compute a new tree, then uses reconciliation to decide what can be reused and what needs to change. The actual DOM update happens later in the commit phase. Keys are important for lists because they tell React which items keep the same identity.

重點：

- reconciliation 比的是 React element tree，不是你手動操作 DOM。
- render 不等於 DOM 全部重建；commit 才是真正改 DOM。
- `key` 不是只為了消除 warning，而是幫 React 判斷 list item identity。
- 不穩定的 key，例如 array index 搭配可插入、刪除、排序的列表，容易造成 component state 對錯資料。

## Hooks 心智模型：看到 use 系列怎麼走

先抓一個核心觀念：React 不是「看到 `useMemo` 這個字就魔法式知道要做什麼」，而是 component function 每次 render 時，React 會依照 hooks 的呼叫順序，去目前 component 對應的 hook slot 讀取或更新資料。

所以 hooks 有兩個共同規則：

- hooks 要在 component 或 custom hook 的最上層呼叫。
- hooks 不能放在 `if`、`for`、callback 裡，因為這會讓每次 render 的 hook 順序不一致。

讀任何 `useXxx` 時，先問五件事：

1. 這個 hook 有沒有保存跨 render 的資料？
2. 這個 hook 回傳的值改變時，會不會讓 component 重新 render？
3. 它的 dependency array 或 key 是什麼？
4. 它是在 render 階段算東西，還是在 commit 後做副作用？
5. cleanup、取消訂閱、race condition 要不要處理？

### `useState`：保存會影響畫面的 local state

```tsx
function PriceInput() {
  const [price, setPrice] = useState("65000");

  return (
    <input
      value={price}
      onChange={(event) => setPrice(event.target.value)}
    />
  );
}
```

這段 `useState` 的執行流程：

1. `PriceInput` 被 render。
2. 執行到 `useState("65000")`。
3. 如果是第一次 render，React 建立一個 state slot，初始值是 `"65000"`。
4. 如果不是第一次 render，React 不會再拿 `"65000"` 當新值，而是拿這個 state slot 裡目前保存的 `price`。
5. React 回傳 `[price, setPrice]`。
6. JSX 用 `price` 當 input 的 `value`，所以畫面顯示目前價格。
7. 使用者輸入時，`onChange` 執行 `setPrice(event.target.value)`。
8. `setPrice` 不是立刻改現在這一次 render 裡的 `price` 變數，而是通知 React：「下一次 render 請用新的 price」。
9. React 排程更新，重新執行 `PriceInput`。
10. 新一輪 render 中，`useState` 回傳更新後的 `price`，JSX 重新產生新的 input value。

重點：

- `price` 是某一次 render 的快照。
- `setPrice` 會觸發下一次 render。
- 如果下一個 state 依賴上一個 state，優先用 updater function：

```tsx
setCount((prev) => prev + 1);
```

### `useReducer`：把狀態轉移集中到 reducer

```tsx
type State = {
  side: "buy" | "sell";
  price: string;
  quantity: string;
};

type Action =
  | { type: "change_side"; side: "buy" | "sell" }
  | { type: "change_price"; price: string }
  | { type: "change_quantity"; quantity: string };

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

function OrderForm() {
  const [state, dispatch] = useReducer(reducer, {
    side: "buy",
    price: "",
    quantity: "",
  });

  return (
    <button onClick={() => dispatch({ type: "change_side", side: "sell" })}>
      Sell
    </button>
  );
}
```

這段 `useReducer` 的執行流程：

1. `OrderForm` 被 render。
2. 執行到 `useReducer(reducer, initialState)`。
3. 第一次 render 時，React 建立 reducer state slot，保存初始表單狀態。
4. React 回傳目前的 `state` 和穩定的 `dispatch` function。
5. 使用者點 Sell，事件 handler 呼叫 `dispatch({ type: "change_side", side: "sell" })`。
6. React 把目前 state 和 action 丟進 `reducer(state, action)`。
7. reducer 回傳新的 state object。
8. React 用新的 state 觸發下一次 render。
9. 下一次 render 時，`state.side` 會變成 `"sell"`。

重點：

- `useState` 是「直接設定下一個值」。
- `useReducer` 是「描述發生什麼事件，再由 reducer 決定下一個 state」。
- 下單表單、連線狀態、複雜 filter 很適合用 reducer，因為狀態轉移有明確 domain rule。

#### `useReducer` 的固定寫法與型態

`useReducer` 的結構通常固定長這樣：

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

要分清楚兩組「第一個、第二個」：

- `useReducer(reducer, initialState)`：第一個參數是 reducer function，第二個參數是初始 state。
- `const [state, dispatch] = ...`：回傳陣列的第一個值是目前 state，第二個值是 dispatch function。
- `reducer(state, action)`：reducer 的第一個參數是目前 state，第二個參數是 action，最後一定要回傳下一個 state。

`state` 不一定要是物件，型態是由 `initialState` 和 reducer 回傳值決定。簡單 counter 也可以用 number：

```tsx
function reducer(count: number, action: "add" | "minus") {
  if (action === "add") return count + 1;
  if (action === "minus") return count - 1;
  return count;
}

const [count, dispatch] = useReducer(reducer, 0);

dispatch("add");
```

只是實務上常把 `state` 和 `action` 寫成物件，因為複雜狀態比較好擴充，也比較容易描述「發生了什麼事」：

```tsx
dispatch({ type: "change_price", price: "65000" });
```

使用時機：

- 單一 input、toggle、tab 這種簡單狀態，用 `useState` 就夠。
- 多個 state 欄位彼此有關，例如下單表單的 side、price、quantity，可以考慮 `useReducer`。
- 下一個 state 需要根據上一個 state 和 action 做規則判斷時，適合 `useReducer`。
- 同一組狀態會被很多事件更新，例如 change price、change quantity、reset form、submit success、submit failed，用 `useReducer` 會比散落多個 `setState` 更好讀。

### `useEffect`：render 完後同步外部系統

```tsx
function TickerSocket({ symbol }: { symbol: string }) {
  useEffect(() => {
    const ws = new WebSocket(makeTickerUrl(symbol));

    ws.onmessage = (event) => {
      console.log(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return <div>{symbol}</div>;
}
```

這段 `useEffect` 的執行流程：

1. `TickerSocket` 被 render，拿到 props：`symbol`。
2. render 階段執行到 `useEffect`，React 記住這個 effect callback 和 dependency array：`[symbol]`。
3. React 先完成 JSX 計算，並把結果 commit 到 DOM。
4. commit 後，React 才執行 effect callback。
5. effect 裡建立 WebSocket，訂閱目前 `symbol` 的行情。
6. 如果下一次 render 時 `symbol` 沒變，React 不重新執行這個 effect。
7. 如果下一次 render 時 `symbol` 變了，React 會先執行上一輪 cleanup：`ws.close()`。
8. cleanup 完，再用新的 `symbol` 執行新的 effect callback，建立新連線。
9. component unmount 時，React 也會執行 cleanup，關掉 WebSocket。

重點：

- `useEffect` 不是拿來算 derived data 的。
- `useEffect` 是同步外部系統，例如 WebSocket、API request、DOM event、storage。
- dependency array 不是「想監聽誰」而已，更精準是「這個 effect 使用了哪些 render scope 的值」。
- React Strict Mode 在開發環境可能會讓 effect setup / cleanup 多跑一次，用來檢查 cleanup 是否正確。

### `useMemo`：在 render 階段快取計算結果

```tsx
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

這段 `useMemo` 的執行流程：

1. `OrderBookSide` 被 render，從 props 拿到 `bids`。
2. 執行到 `useMemo` 時，React 會比較 dependency array 裡的 `bids`。
3. 如果這次的 `bids` 和上次是同一個 array reference，React 直接回傳上次快取的 `visibleBids`。
4. 如果 `bids` 是新的 array reference，React 才重新執行 callback：

```ts
bids.filter((item) => item.quantity !== "0");
```

5. `filter` 會把 quantity 是 `"0"` 的價位過濾掉，只留下真正要顯示的 bid levels。
6. JSX 再用 `visibleBids.map(...)` 產生 `<li>` 列表。

重點：

- `useMemo` 發生在 render 階段。
- `useMemo` 是效能優化，不是資料來源。
- dependency array 看的是 reference equality，不會深層比較 array 裡每個物件。
- 簡單計算可以直接寫，不一定要包 `useMemo`。

### `useCallback`：快取 function reference

```tsx
function OrderBookRow({ price, onSelect }: OrderBookRowProps) {
  return <button onClick={() => onSelect(price)}>{price}</button>;
}

const MemoOrderBookRow = React.memo(OrderBookRow);

function OrderBookSide({ bids }: { bids: Level[] }) {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const handleSelect = useCallback((price: string) => {
    setSelectedPrice(price);
  }, []);

  return (
    <ul>
      {bids.map((item) => (
        <MemoOrderBookRow
          key={item.price}
          price={item.price}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}
```

這段 `useCallback` 的執行流程：

1. `OrderBookSide` 被 render。
2. 執行到 `useCallback`，React 比較 dependency array：`[]`。
3. 第一次 render 時，React 建立 `handleSelect` function 並快取起來。
4. 之後 render 時，因為 dependency 沒變，React 回傳同一個 function reference。
5. `MemoOrderBookRow` 收到的 `onSelect` reference 沒變，配合 `React.memo` 時比較容易避免不必要 render。
6. 使用者點 row 時，`handleSelect(price)` 執行，呼叫 `setSelectedPrice(price)`。
7. `setSelectedPrice` 觸發 `OrderBookSide` 下一次 render。

重點：

- `useCallback(fn, deps)` 大致等於 `useMemo(() => fn, deps)`。
- `useCallback` 快取的是 function 本身，不是 function 的執行結果。
- 沒有傳給 memo child、effect dependency、subscription API 時，不一定需要 `useCallback`。
- dependency array 寫錯會造成 stale closure，function 會讀到舊 render 的變數。

### `useRef`：保存跨 render 的可變容器，但不觸發 render

```tsx
function LatestPricePanel({ price }: { price: string }) {
  const latestPriceRef = useRef(price);

  useEffect(() => {
    latestPriceRef.current = price;
  }, [price]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      console.log(latestPriceRef.current);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return <div>{price}</div>;
}
```

這段 `useRef` 的執行流程：

1. `LatestPricePanel` 被 render，拿到 props：`price`。
2. 執行到 `useRef(price)`。
3. 第一次 render 時，React 建立一個 ref object：`{ current: price }`。
4. 之後每次 render，React 都回傳同一個 ref object。
5. 第一個 effect 在 `price` 改變後，把最新 price 寫進 `latestPriceRef.current`。
6. 第二個 effect 只在 mount 後建立一次 interval。
7. interval callback 每秒讀 `latestPriceRef.current`，所以可以讀到最新 price。
8. 修改 `latestPriceRef.current` 不會觸發 render。

這段可以類比成 Vue 的 `onMounted`，但要注意它分成兩條資料流：

1. 畫面更新：父層傳新的 `price` 進來，`LatestPricePanel` 重新 render，`return <div>{price}</div>` 才會顯示新價格。
2. interval 讀值：component mount 後建立一次 interval，之後 interval 不重建，只是每秒讀 `latestPriceRef.current`。

所以不是「初始化後都靠 interval 更新畫面」。interval 只是定時執行 callback，這裡用來印出最新價格；真正讓畫面變新的仍然是 props / state 變化造成的 render。

這裡為什麼需要 ref？因為如果直接在只跑一次的 effect 裡讀 `price`，容易讀到第一次 render 的舊值：

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log(price);
  }, 1000);

  return () => window.clearInterval(timer);
}, []);
```

上面這段 effect 的 dependency array 是 `[]`，代表 interval callback 是 mount 時建立的 function，裡面捕捉到的 `price` 可能一直是第一次 render 的 price。把最新值同步到 `latestPriceRef.current`，就是為了讓這個長期存在的 interval callback 每次都能讀到最新值。

重點：

- `useRef` 適合保存不需要直接顯示到畫面的資料。
- 常見用途是 DOM node、timer id、WebSocket instance、latest value。
- 如果資料變了要更新畫面，用 `useState`；如果只是保存 mutable value，用 `useRef`。
- `useEffect(..., [])` 很像 mount 後做一次 setup；如果 setup 出來的 callback 需要讀最新 props / state，可以用 ref 避免 stale closure。

### `useContext`：讀取上層 Provider 提供的值

```tsx
const TradingContext = createContext<{ symbol: string } | null>(null);

function SymbolText() {
  const trading = useContext(TradingContext);

  return <span>{trading?.symbol}</span>;
}
```

這裡可以把 context 想成一條資料通道。`createContext(null)` 建立通道，`Provider` 在上層放資料，`useContext` 在下層讀資料。

如果外層這樣提供 value：

```tsx
function App() {
  return (
    <TradingContext.Provider value={{ symbol: "BTCUSDT" }}>
      <Layout />
    </TradingContext.Provider>
  );
}

function Layout() {
  return <SymbolText />;
}
```

`SymbolText` 不需要從 `App -> Layout -> SymbolText` 一層一層接 `symbol` props，也能透過 `useContext(TradingContext)` 讀到：

```tsx
{ symbol: "BTCUSDT" }
```

所以畫面會顯示 `BTCUSDT`。如果外層沒有包 `<TradingContext.Provider>`，`useContext(TradingContext)` 會拿到 `createContext` 的 default value，也就是 `null`。

這行用的是 optional chaining：

```tsx
return <span>{trading?.symbol}</span>;
```

意思是 `trading` 不是 `null` 時才讀 `trading.symbol`；如果是 `null`，就回傳 `undefined`，畫面不顯示內容，也不會因為讀取 `null.symbol` 而報錯。

這段 `useContext` 的執行流程：

1. `SymbolText` 被 render。
2. 執行到 `useContext(TradingContext)`。
3. React 往 component tree 上層找最近的 `<TradingContext.Provider>`。
4. 如果找得到，回傳 Provider 的 `value`。
5. 如果找不到，回傳 `createContext` 的 default value，這裡是 `null`。
6. JSX 用 `trading?.symbol` 顯示目前交易對。
7. 如果 Provider 的 `value` reference 改變，所有讀取這個 context 的 component 都可能重新 render。

重點：

- context 適合放 theme、locale、auth user、目前交易環境這類跨層級資料。
- 不適合把高頻 order book delta 直接塞進大 context，容易造成大範圍重渲染。
- Provider value 如果每次 render 都建立新 object，會讓 consumer 更容易重渲染，必要時用 `useMemo` 穩定 value。

### `useLayoutEffect`：DOM 更新後、瀏覽器繪製前同步處理

```tsx
function PriceColumn() {
  const listRef = useRef<HTMLUListElement | null>(null);

  useLayoutEffect(() => {
    const height = listRef.current?.getBoundingClientRect().height ?? 0;
    console.log(height);
  }, []);

  return <ul ref={listRef} />;
}
```

這段是在做一件事：等 `<ul>` 真正被放到 DOM 後，立刻量它的高度。

```tsx
const listRef = useRef<HTMLUListElement | null>(null);
```

這裡建立一個 ref，用來保存真實 DOM element。型別是 `HTMLUListElement | null`，代表一開始還沒有 DOM，所以是 `null`；等 React 把 `<ul>` commit 到 DOM 後，才會把真實的 `<ul>` 放到 `listRef.current`。

```tsx
return <ul ref={listRef} />;
```

這行把 `listRef` 掛到 `<ul>` 上。render 階段只是產生 React element；真正的 DOM 會在 commit 階段建立，建立完成後 React 才會設定：

```tsx
listRef.current = 真實的 ul DOM
```

所以不要在 render 階段直接讀 DOM 尺寸。render 時 DOM 還不一定存在，而且 render 應該保持純粹。

```tsx
const height = listRef.current?.getBoundingClientRect().height ?? 0;
```

這行分成兩段看：

1. `listRef.current?.getBoundingClientRect()`：如果 `listRef.current` 有 DOM，就取得它在畫面上的尺寸和位置。
2. `.height ?? 0`：如果量得到高度就用高度；如果 `listRef.current` 還是 `null`，就用 `0` 當 fallback。

`getBoundingClientRect()` 會回傳類似這樣的資料：

```tsx
{
  width,
  height,
  top,
  left,
  right,
  bottom
}
```

這裡只取 `height`，所以它是在量 `<ul>` 的實際高度。

這段 `useLayoutEffect` 的執行流程：

1. `PriceColumn` 第一次 render。
2. `useRef(null)` 建立 ref object，這時 `listRef.current` 還是 `null`。
3. `return <ul ref={listRef} />`，React 知道這個 DOM 之後要接到 `listRef`。
4. React commit DOM，把真實 `<ul>` 放進頁面。
5. React 設定 `listRef.current` 指向真實的 `<ul>` DOM。
6. 瀏覽器繪製畫面前，React 執行 `useLayoutEffect` callback。
7. callback 讀 `listRef.current.getBoundingClientRect().height`，印出高度。
8. 瀏覽器才把畫面繪製出來。

`useLayoutEffect` 和 `useEffect` 最大差別是執行時機：

```txt
useEffect:
React 更新 DOM
-> 瀏覽器先繪製畫面
-> useEffect 執行
```

```txt
useLayoutEffect:
React 更新 DOM
-> useLayoutEffect 執行
-> 瀏覽器繪製畫面
```

所以如果只是打 API、訂閱 WebSocket、印 log、同步 localStorage，通常用 `useEffect`。如果是量 DOM 尺寸、設定 scroll position、依照高度修正位置，並且不想讓使用者先看到錯的位置或閃一下，就會用 `useLayoutEffect`。

例如量完高度後要立刻更新畫面：

```tsx
function PriceColumn() {
  const listRef = useRef<HTMLUListElement | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const nextHeight = listRef.current?.getBoundingClientRect().height ?? 0;
    setHeight(nextHeight);
  }, []);

  return (
    <>
      <ul ref={listRef} />
      <div>height: {height}</div>
    </>
  );
}
```

這種情況如果用 `useEffect`，瀏覽器可能先畫出 `height: 0`，effect 後才改成真正高度，畫面就可能閃一下。`useLayoutEffect` 會在瀏覽器繪製前先完成量測和同步更新，比較適合處理 layout。

重點：

- 大部分情況用 `useEffect`。
- 只有需要在畫面繪製前讀寫 layout，才用 `useLayoutEffect`。
- 過度使用會阻塞瀏覽器繪製。
- `useRef` 負責拿 DOM；`ref={listRef}` 負責把 DOM 存進 ref；`useLayoutEffect` 負責在繪製前讀 DOM 尺寸。

### custom hook：把一組 hook 流程包成可重用邏輯

```tsx
function useTickerSocket(symbol: string) {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    const ws = new WebSocket(makeTickerUrl(symbol));

    ws.onmessage = (event) => {
      setTicker(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return ticker;
}

function TickerPanel({ symbol }: { symbol: string }) {
  const ticker = useTickerSocket(symbol);

  return <div>{ticker?.lastPrice ?? "Loading"}</div>;
}
```

這段 custom hook 的執行流程：

1. `TickerPanel` 被 render，拿到 `symbol`。
2. 執行 `useTickerSocket(symbol)`。
3. 進入 custom hook 內部，照順序執行 `useState` 和 `useEffect`。
4. custom hook 回傳 `ticker`。
5. `TickerPanel` 用 `ticker` render 畫面。
6. WebSocket 收到資料後，custom hook 內部呼叫 `setTicker`。
7. `setTicker` 觸發使用這個 custom hook 的 component 重新 render。

重點：

- custom hook 不是新的 React 特權語法，它只是把 hooks 組合起來的 function。
- custom hook 名稱要以 `use` 開頭，讓 lint 規則可以檢查 hooks 使用方式。
- 讀 custom hook 時，要進去看它內部用了哪些 state、effect、ref、memo。

### React Query 的 `useQuery`：用 query key 訂閱 server state

```tsx
function OpenOrders({ symbol }: { symbol: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["openOrders", symbol],
    queryFn: () => fetchOpenOrders(symbol),
  });

  if (isLoading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return <OrderList orders={data ?? []} />;
}
```

這段 `useQuery` 的執行流程：

1. `OpenOrders` 被 render，拿到 `symbol`。
2. 執行到 `useQuery`。
3. React Query 用 `queryKey: ["openOrders", symbol]` 判斷這份 server state 的身份。
4. 如果 cache 裡已有資料，先回傳 cache data 和目前狀態。
5. 如果沒有資料、資料 stale，或設定要求 refetch，React Query 會執行 `queryFn`。
6. component 先根據 `isLoading`、`error`、`data` render 畫面。
7. request 完成後，React Query 更新 cache。
8. 這個 query 的 subscriber 被通知，`OpenOrders` 重新 render。
9. 如果 `symbol` 改變，query key 改變，React Query 會切到另一份 cache identity。

重點：

- `queryKey` 是 server state 的身份，不是隨便取的名字。
- 不同交易對、不同 filter、不同分頁條件，都應該反映在 query key。
- React Query 管 API cache；不要把所有 API response 再塞一份進 Redux。

### 讀 hooks 時的總結口訣

看到 `useState`：這裡有 local state，`setState` 會觸發下一次 render。

看到 `useReducer`：這裡有一組狀態轉移規則，事件會被 dispatch 到 reducer。

看到 `useEffect`：這裡在同步外部系統，要檢查 dependency 和 cleanup。

看到 `useMemo`：這裡在 render 階段快取計算結果，要檢查 dependency 和計算是否真的貴。

看到 `useCallback`：這裡在穩定 function reference，要檢查是不是傳給 memo child 或 effect。

看到 `useRef`：這裡保存跨 render 的 mutable value，改 `.current` 不會 render。

看到 `useContext`：這裡讀 Provider 的值，要注意 Provider value reference 和重渲染範圍。

看到 custom hook：進去看它包了哪些 hooks，真正的資料流在裡面。

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
