---
sidebar_position: 21
title: "React Hooks 六題實戰：State / Context / Ref"
description: "useState、useReducer、useContext、useRef、useImperativeHandle、useId 各六題，練習 snapshot、identity、subscription、DOM ref 與 accessibility。"
tags:
  - React
  - Hooks
  - State
  - Interview
keywords: ["useState 題目", "useReducer 題目", "useContext 題目", "useRef 題目", "useImperativeHandle 題目", "useId 題目"]
---

# React Hooks 六題實戰：State / Context / Ref

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

每題先回答「畫面／console 是什麼、為什麼、怎麼改」，再展開答案。

## `useState`：render snapshot 與更新佇列

### 1. 連續更新三次，畫面是多少？

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }}>{count}</button>;
}
```

<details>
<summary>答案</summary>

第一次點擊後是 `1`。三行都讀到同一次 render 的 `count = 0`，所以都排入「設成 1」。若要累加三次，改用三個 `setCount(previous => previous + 1)`。

</details>

### 2. Lazy initializer 會執行幾次？

```tsx
const [draft, setDraft] = useState(loadDraft());
const [profile] = useState(() => loadProfile());
```

Parent 每次 render 都讓 child 跟著 render。`loadDraft` 與 `loadProfile` 各會被呼叫幾次？

<details>
<summary>答案</summary>

`loadDraft()` 是普通 expression，每次 render 都先被 JavaScript 呼叫，雖然 React 只採用第一次的結果。傳入 `() => loadProfile()` 才是 lazy initializer，正常情況只在初始化時呼叫。開發環境 Strict Mode 可能為了檢查純度而呼叫 initializer 兩次，結果只採用一次。

</details>

### 3. Object 已改，為什麼畫面不更新？

```tsx
const [order, setOrder] = useState({ price: 100, quantity: 1 });

function discount() {
  order.price = 90;
  setOrder(order);
}
```

<details>
<summary>答案</summary>

程式 mutation 了舊 state，接著把同一個 reference 傳回 setter。React 以 `Object.is` 判斷新舊 state，相同 reference 可跳過更新。應建立新 object：`setOrder(previous => ({ ...previous, price: 90 }))`。

</details>

### 4. 設成相同 primitive 會 render 嗎？

```tsx
const [symbol, setSymbol] = useState("BTCUSDT");
setSymbol("BTCUSDT");
```

<details>
<summary>答案</summary>

React 會以 `Object.is` 比較並跳過不必要的更新。實作上 component 可能在跳過 children 前被額外呼叫一次，因此面試時不要承諾「component function 絕對零次呼叫」；可靠保證是相同 state 不會形成需要 commit 的 UI 變更。

</details>

### 5. Prop 變了，初始 state 會跟著變嗎？

```tsx
function Ticket({ symbol, marketPrice }) {
  const [price, setPrice] = useState(marketPrice);
  return <input value={price} onChange={e => setPrice(e.target.value)} />;
}
```

BTC 切成 ETH 時，`marketPrice` 已改，input 為何可能仍是 BTC 價格？

<details>
<summary>答案</summary>

`initialState` 只在 component instance 初始化時使用。先決定產品規格：只是顯示就直接用 prop；切 symbol 要整份重設可用 `key={symbol}`；每個 symbol 要保留 draft 則由 parent 以 symbol 管理。不要不加思考地用 effect 同步兩份 source of truth。

</details>

### 6. 哪一個值不該是 state？

```tsx
const [price, setPrice] = useState("10");
const [quantity, setQuantity] = useState("2");
const [notional, setNotional] = useState(20);
```

<details>
<summary>答案</summary>

若 `notional` 永遠是 `Number(price) * Number(quantity)`，它是 render 時可計算的 derived data，不該再保存。多一份 state 會增加不同步狀態與額外 render。只有無法由目前 props/state 重建、且需要跨 render 保存的資料才是 state 候選。

</details>

## `useReducer`：集中描述狀態轉移

### 1. Dispatch 兩次會遺失更新嗎？

```tsx
function reducer(count, action) {
  if (action.type === "increment") return count + 1;
  return count;
}

dispatch({ type: "increment" });
dispatch({ type: "increment" });
```

<details>
<summary>答案</summary>

不會。兩個 action 依序進入更新佇列，第二次 reducer 會收到第一次 reducer 的結果，最後加二。這和兩次 `setCount(count + 1)` 都捕捉同一 snapshot 不同。

</details>

### 2. Reducer 可以寫 API 或修改外部變數嗎？

```tsx
function reducer(state, action) {
  analytics.track(action.type);
  return { ...state, status: action.type };
}
```

<details>
<summary>答案</summary>

不應該。Reducer 必須純粹：相同 state/action 產生相同結果，不修改外部系統。React Strict Mode 在開發環境可能額外呼叫 reducer 來找 impurity，副作用因此可能重複。分析、request 或 storage 應放在 event handler、effect 或資料層。

</details>

### 3. 大型初始資料怎麼避免每次 render 重建？

```tsx
const [state, dispatch] = useReducer(reducer, props, createInitialState);
```

`createInitialState` 何時執行？第三個參數和直接寫 `createInitialState(props)` 有何差別？

<details>
<summary>答案</summary>

第三個 `init` function 用於 lazy initialization，只在初始化 reducer state 時需要；直接呼叫 `createInitialState(props)` 則是每次 component render 都先計算，再把結果當參數傳入。

</details>

### 4. Reducer 改了資料卻 return 同一個 object，結果是什麼？

```tsx
function reducer(state, action) {
  state.orders.push(action.order);
  return state;
}
```

<details>
<summary>答案</summary>

這同時破壞 reducer 純度與 immutable update。因為回傳 reference 沒變，React 可忽略更新；舊 snapshot 也被偷偷改壞。應回傳 `{ ...state, orders: [...state.orders, action.order] }`。

</details>

### 5. `dispatch` 可以安全放進 Context 嗎？

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

<details>
<summary>答案</summary>

可以，`dispatch` identity 穩定。常見設計會把 state Context 與 dispatch Context 拆開，讓只發 action、不讀 state 的元件不必因整份 state 更新。拆 Context 是 render 邊界設計，不是 `useMemo` 的替代語法遊戲。

</details>

### 6. 什麼時候該從 `useState` 換成 `useReducer`？

<details>
<summary>答案</summary>

當多個欄位一起轉移、同一狀態有很多事件、規則需要集中測試，或想用 action 描述「發生什麼」時適合 reducer。單一 toggle/input 不會因改成 reducer 自動更好；server cache 也不該只因複雜就塞進 reducer。

</details>

## `useContext`：讀取最近的 Provider 並訂閱 value

### 1. 會讀到哪一層 Provider？

```tsx
<ThemeContext.Provider value="dark">
  <Panel />
  <ThemeContext.Provider value="light">
    <Button />
  </ThemeContext.Provider>
</ThemeContext.Provider>
```

`Panel` 和 `Button` 各讀到什麼？

<details>
<summary>答案</summary>

`Panel` 讀到 `dark`，`Button` 讀到離自己最近的 `light`。`useContext` 往 component 上方找最近的 provider，不會讀到同一個 component return 裡才建立的 provider。

</details>

### 2. Provider 傳 `undefined` 時會退回 default value 嗎？

```tsx
const AuthContext = createContext("guest");
<AuthContext.Provider value={undefined}>...</AuthContext.Provider>
```

<details>
<summary>答案</summary>

不會。只要上方有 matching provider，consumer 就取得 provider 的 `undefined`；default value 只在完全沒有 provider 時使用。若 provider 必填，常用 `null` default 搭配 custom Hook 主動 throw 清楚錯誤。

</details>

### 3. 為何 Provider 的 unrelated parent render 也可能通知 consumer？

```tsx
const value = { theme, setTheme };
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

<details>
<summary>答案</summary>

每次 render 都建立新的 object reference，Context value 以 `Object.is` 比較後視為改變。可用 `useMemo(() => ({ theme, setTheme }), [theme])` 避免「內容沒變但 reference 變」；若 `theme` 真的變，consumer 本來就應更新。

</details>

### 4. `React.memo` 能擋住 Context 更新嗎？

<details>
<summary>答案</summary>

不能擋住 component 自己訂閱的 Context 更新。`memo` 只比較 parent 傳入的 props。若 theme 與每秒更新的 ticker 共用一個 Context，應依責任/頻率拆 Context，或採 selector-based external store。

</details>

### 5. 明明有 Provider，為何 consumer 仍讀到 default？

<details>
<summary>答案</summary>

除了 tree 位置錯誤，也要檢查 provider 與 consumer 是否 import 到兩個不同的 Context object，例如 monorepo 重複打包同一模組。Context 的 identity 必須是同一個 `===` object，名字相同沒有用。

</details>

### 6. 哪些資料不適合直接丟進單一 Context？

<details>
<summary>答案</summary>

高頻且消費粒度差異很大的資料（order book、mouse position）、龐大 server cache、只在單一小子樹使用的 local state，都不適合無差別放進全域 Context。Context 解決傳遞，不自動提供 selector、cache、request lifecycle 或細粒度訂閱。

</details>

## `useRef`：跨 render 的可變容器

### 1. 點擊後畫面為什麼仍是 0？

```tsx
function Counter() {
  const countRef = useRef(0);
  return <button onClick={() => countRef.current++}>{countRef.current}</button>;
}
```

<details>
<summary>答案</summary>

修改 `ref.current` 不會要求 React render，所以 DOM 仍顯示 0。若資料影響畫面，使用 state；ref 適合 timer id、DOM node、imperative instance 或不參與 render 的最新值。

</details>

### 2. Render 時能立刻讀到 DOM ref 嗎？

```tsx
const inputRef = useRef<HTMLInputElement>(null);
console.log(inputRef.current);
return <input ref={inputRef} />;
```

<details>
<summary>答案</summary>

初次 render 是 `null`。React 在 commit 時才把 DOM node 指派給 ref；需要 focus 可在事件中做，需在 mount 後同步操作則用合適的 effect。Unmount 時 React 會把 DOM ref 設回 `null`。

</details>

### 3. Ref 能解 stale closure，但代價是什麼？

```tsx
const latestSymbol = useRef(symbol);
useEffect(() => {
  latestSymbol.current = symbol;
}, [symbol]);
```

<details>
<summary>答案</summary>

長生命 callback 可讀 `latestSymbol.current` 取得最新 committed value，但這也建立非 reactive 的 escape hatch。若 symbol 改變本來就該重建 subscription，仍應放 dependency；不要用 ref 隱藏真正的 effect 輸入。

</details>

### 4. 這個昂貴 instance 每次都會建立嗎？

```tsx
const engineRef = useRef(new TradingEngine());
```

<details>
<summary>答案</summary>

`new TradingEngine()` 是普通 expression，每次 render 都會執行，只是 React 忽略後續 initial value。可用可預測的 lazy pattern：`if (engineRef.current === null) engineRef.current = new TradingEngine()`，前提是建立結果穩定且只在初始化分支寫 ref。

</details>

### 5. 可以在 render 中任意讀寫 ref 嗎？

<details>
<summary>答案</summary>

一般不行。Render 應保持純粹，concurrent rendering 可能被暫停或丟棄；render 中任意讀寫 ref 會讓結果依執行時機改變。只接受可預測的單次初始化例外，其他讀寫放事件或 effect。

</details>

### 6. `useRef` 和 module-level 變數差在哪裡？

<details>
<summary>答案</summary>

每個 mounted component instance 各有自己的 ref，並跨 render 保留；module 變數通常被所有 instance 共用，也可能跨 request 汙染 SSR。需要 component-local imperative state 時用 ref，需要 UI state 時用 state。

</details>

## `useImperativeHandle`：限制 parent 透過 ref 能做什麼

### 1. Parent 最後拿到 DOM node 還是自訂 object？

```tsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current?.focus(),
}));
```

<details>
<summary>答案</summary>

Parent 的 ref 會拿到 `{ focus }`，不是內部 input DOM node。這讓 child 只暴露必要操作，不洩漏整個 DOM 實作。

</details>

### 2. Handle method 為何一直使用舊 prop？

```tsx
useImperativeHandle(ref, () => ({
  submit: () => onSubmit(symbol),
}), []);
```

<details>
<summary>答案</summary>

空 dependency 讓 handle 保留初次 render 的 `onSubmit` 與 `symbol` closure。應列出 `[onSubmit, symbol]`，或重新設計 API 讓 `submit` 接收必要參數。不要為了穩定 identity 犧牲 correctness。

</details>

### 3. Parent 在自己的 render 中呼叫 `ref.current.focus()` 會怎樣？

<details>
<summary>答案</summary>

Render 階段 ref 可能仍是 `null`，而且 render 必須純粹。應在使用者 event 或 commit 後的 effect 中呼叫。Optional chaining 只能避免 null exception，不能讓 render 中的 imperative side effect 變正確。

</details>

### 4. 應暴露 `input` 還是 `focus/clear/validate`？

<details>
<summary>答案</summary>

優先暴露最小、具語意的操作，例如 `focusInvalidField()`；直接暴露整個 DOM node 會讓 parent 與 child 結構耦合。這個 Hook 應是少量 escape hatch，不是一般資料流。

</details>

### 5. 可以用 imperative handle 取代 controlled props 嗎？

<details>
<summary>答案</summary>

通常不該。`setPrice()`、`getValues()` 會建立難追蹤的雙向命令流；會影響畫面的資料仍應透過 props/state 單向傳遞。Focus、scroll、selection、播放控制才是較合理的 imperative use case。

</details>

### 6. React 18 與 React 19 的 ref 接法有何差異？

<details>
<summary>答案</summary>

此專案的 React 18 需要用 `forwardRef` 讓 function component 接收 ref，再交給 `useImperativeHandle`。React 19 可把 `ref` 當 prop 取得。回答時要先說專案版本，避免把新語法貼進 React 18 專案。

</details>

## `useId`：SSR 安全的 accessibility identity

### 1. State 更新後 ID 會改嗎？

```tsx
const id = useId();
const [value, setValue] = useState("");
```

<details>
<summary>答案</summary>

同一個 component instance 的 ID 跨 render 穩定；component unmount/remount 後則是新的 identity。它適合連結 label/input 或 description，不是資料庫 ID。

</details>

### 2. 可以拿 `useId()` 當 list key 嗎？

<details>
<summary>答案</summary>

不可以。Hook 不能在 `map` 中依資料筆數動態呼叫，而且 list key 必須來自資料本身的穩定 identity。應使用 `order.id`；若資料沒有 ID，要在資料建立時產生，而不是 render 時生成。

</details>

### 3. 為何不直接用 `Math.random()` 產生 input id？

<details>
<summary>答案</summary>

Random value 每次 render 不穩定，SSR 產生的 HTML 也可能和 client hydration 不一致。`useId` 由 React 依 tree identity 協調，適合 server/client 一致的 accessibility ID。

</details>

### 4. 一個 Hook 怎麼產生多個關聯 ID？

```tsx
const prefix = useId();
const inputId = `${prefix}-price`;
const errorId = `${prefix}-price-error`;
```

<details>
<summary>答案</summary>

用一個 `useId` 當 prefix 再加 suffix，可以建立同一欄位的 input、hint、error 關係，不需為每個節點各呼叫一次 Hook。

</details>

### 5. `useId` 本身會自動改善 accessibility 嗎？

<details>
<summary>答案</summary>

不會，它只提供 ID。仍要正確連接 `htmlFor`/`id`、`aria-describedby`、`aria-labelledby` 等語意；若 label 已包住 input，甚至可能不需要 ID。

</details>

### 6. 把 `useId` 放進條件式會有什麼問題？

```tsx
if (showError) {
  const errorId = useId();
}
```

<details>
<summary>答案</summary>

違反 Rules of Hooks：不同 render 的 Hook 呼叫順序可能改變。應在 component 最上層固定呼叫，再決定是否使用產生的 ID；或把條件區塊抽成獨立 component。

</details>

## 完成檢查

你應該能不看答案說出：

- state 是 snapshot，setter/dispatch 排入更新，不改目前變數。
- Context 是依 provider value identity 進行的訂閱，不是免費全域 store。
- Ref 是 component-local escape hatch，不參與畫面更新。
- Imperative handle 應暴露最小命令介面。
- `useId` 解 accessibility 與 hydration identity，不解 list identity。

[下一組：Effect / Memo Hooks](./19-react-effect-memo-hooks-drills.md)
