---
sidebar_position: 22
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

> 實際案例：[useState：交易下單數量與衍生金額](./practical-cases/use-state)

### 做題前：先知道 state 不是可立即修改的普通變數

Component 每次 render 都像 React 呼叫一次函式並拍下一張快照。該次函式裡的 `count`、event handler 與 JSX 都屬於同一張 snapshot；呼叫 setter 是要求 React 排入下一次 render，不會改掉目前函式中的變數。

```tsx
const [state, setState] = useState(initialState);
```

| 項目 | 角色 |
| --- | --- |
| `initialState` | component 第一次 mount 時的初值；可以傳值或 lazy initializer |
| `state` | 本次 render 固定不變的 snapshot |
| `setState(next)` | 把指定的 next value 排入更新佇列 |
| `setState(previous => next)` | 讓 next value 依序從 queue 中的 pending state 計算 |

```text
目前 render：count = 0
    ↓ event handler 呼叫 setCount(...)
React 將 update 放進 queue
    ↓ handler 結束後處理 queue
下一次 render：count = 計算後的新 snapshot
```

完整的輸入情境通常同時包含「要保存的資料」與「可以推導的資料」：

```tsx
function OrderTicket() {
  const [price, setPrice] = useState("10");
  const [quantity, setQuantity] = useState("2");
  const notional = Number(price) * Number(quantity); // 不必再建 state

  return (
    <label>
      數量
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <span>名目金額：{notional}</span>
    </label>
  );
}
```

`useState` 適合保存會影響畫面、且無法只靠目前 props/state 重建的資料。若值不影響 render，可考慮 ref；若能直接計算，就不要再存一份 state；若多個欄位有複雜狀態轉移，再考慮 reducer。

> 一句話記憶：state 是「每次 render 的不可變快照」，setter 是「排入下一張快照的更新」。

官方參考：[React `useState`](https://react.dev/reference/react/useState)、[State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)

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

第一次點擊後是 `1`，不是 `3`。

每一次 render 都會取得一份 state snapshot。這次畫面中的 `count` 是 `0`，event handler 內的三個 `count` 也都固定是 `0`；呼叫 `setCount` 只會排入下一次 render 的更新，不會立刻改掉目前函式裡的變數。因此三行實際上都是 `setCount(1)`。

React 也會批次處理同一個 event 中的更新，通常等 handler 跑完才進行下一次 render。若下一個值依賴前一個待處理值，要傳入 updater function：

```tsx
setCount(previous => previous + 1); // 0 → 1
setCount(previous => previous + 1); // 1 → 2
setCount(previous => previous + 1); // 2 → 3
```

React 會依序把每個 updater 套用到 queue 中的 pending state，所以結果是 `3`。簡單判斷方式是：**更新不依賴舊值可直接傳值；依賴舊值時使用 functional update。**

</details>

### 2. Lazy initializer 會執行幾次？

```tsx
const [draft, setDraft] = useState(loadDraft());
const [profile] = useState(() => loadProfile());
```

Parent 每次 render 都讓 child 跟著 render。`loadDraft` 與 `loadProfile` 各會被呼叫幾次？

<details>
<summary>答案</summary>

`loadDraft()` 會在 child 每次 render 時執行；`() => loadProfile()` 則只在該 component instance 初始化時使用。

原因是 JavaScript 呼叫 `useState` 前，會先計算所有參數：

```tsx
const initialDraft = loadDraft();       // 每次 render 都先執行
const [draft] = useState(initialDraft);  // React 後續忽略 initialDraft
```

第二種傳入的是函式本身，而不是函式結果。React 把它辨認為 initializer，需要建立初始 state 時才呼叫：

```tsx
const [profile] = useState(() => loadProfile());
```

因此 parent re-render 導致 child re-render，不會再次載入 profile；但 child unmount 後重新 mount 會重新初始化。開發環境 Strict Mode 可能故意呼叫 initializer 兩次並丟棄其中一次結果，以檢查它是否純粹，所以 initializer 不應寫 storage、送 request 或修改外部變數。

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

因為「object 裡面的內容變了」不等於「state reference 變了」。這段程式先直接修改目前的 state object，再把同一個 object 傳回去：

```tsx
order.price = 90; // 舊 object 被直接修改
setOrder(order);  // previousObject === nextObject
```

React 使用 `Object.is` 比較前後 state。兩者是同一個 reference，React 可以判斷沒有新 state 而跳過更新，所以畫面不一定重新 render。

直接 mutation 還會破壞舊 render 的 snapshot。先前的 event handler、memoized component 或除錯紀錄若仍持有這個 object，也會看到它被偷偷改掉，使「某次 render 當時的資料」不再可靠。

應建立新的 object，只替換要變動的欄位：

```tsx
setOrder(previous => ({
  ...previous,
  price: 90,
}));
```

若修改巢狀資料，從被修改的節點一路到最外層都要建立新 reference；也可以用 Immer 協助產生 immutable update。

</details>

### 4. 設成相同 primitive 會 render 嗎？

```tsx
const [symbol, setSymbol] = useState("BTCUSDT");
setSymbol("BTCUSDT");
```

<details>
<summary>答案</summary>

通常不會產生需要 commit 的 UI 更新。React 會用 `Object.is(previousState, nextState)` 比較新舊值；兩者相同時，可以跳過 component children 的重新 render 與 DOM commit。

```tsx
Object.is('BTCUSDT', 'BTCUSDT'); // true
```

但不要把這個最佳化描述成「component function 在所有情況下絕對不會再被呼叫」。若更新已經進入處理流程，React 實作上仍可能先呼叫 component，再決定 bailout；Strict Mode 也可能額外 render 來檢查純度。可靠的語意是：**相同 state 不會形成新的可觀察 UI 狀態，render 必須純粹到即使被額外呼叫也沒有問題。**

另外，若 state 是 object，只有同一個 reference 才相同；`Object.is({}, {})` 是 `false`，即使兩個 object 內容看起來一樣。

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

因為 `useState(marketPrice)` 的參數是 **initial state**，不是「每當 prop 改變就同步 state」。它只在這個 `Ticket` instance 第一次 mount 時決定 `price`；之後 `marketPrice` 改變，現有的 local state 仍由 `setPrice` 管理。

這個行為很重要：若使用者正在 input 輸入草稿，parent 任意 re-render 都覆蓋內容，輸入框會無法正常編輯。React 因此不會自動讓 prop 與 local state 綁在一起。

正確做法取決於資料的真正 owner：

- Input 只需要顯示市場價格，沒有獨立草稿：直接使用 `marketPrice` prop，不建立重複 state。
- 切換 symbol 時要把整個表單視為新表單：由 parent 使用 `<Ticket key={symbol} ... />`，讓 React remount 並重新初始化。
- 每個 symbol 都要保留自己的草稿：把 drafts 提升到 parent，以 `symbol` 作為 key 管理。
- 只有某個明確外部事件需要覆蓋草稿：在 event handler 中同時更新相關 state，讓重設原因清楚。

用 effect 做 `setPrice(marketPrice)` 雖然有時可行，但它建立兩份 source of truth，還會先 render 舊值再同步新值，並可能意外覆蓋使用者輸入；應先確認需求再使用。

</details>

### 6. 哪一個值不該是 state？

```tsx
const [price, setPrice] = useState("10");
const [quantity, setQuantity] = useState("2");
const [notional, setNotional] = useState(20);
```

<details>
<summary>答案</summary>

`notional` 不該是獨立 state，因為它完全可以由目前的 `price` 與 `quantity` 推導：

```tsx
const notional = Number(price) * Number(quantity);
```

若同時保存三份 state，每次修改 price 或 quantity 都必須記得同步 notional。只要漏掉一條更新路徑，便會出現不可能狀態，例如畫面顯示 `price = 20`、`quantity = 2`，但 `notional = 20`。若用 effect 同步，還會多一次 render：先顯示舊 notional，再由 effect 更新。

Render 本來就是根據 props/state 計算 UI 的地方，因此便宜的 derived data 直接計算即可。只有計算非常昂貴且 profiling 證明有需要時，才考慮 `useMemo`；`useMemo` 是效能快取，不是用來修正資料一致性的另一份 state。

判斷問題可以問：**刪掉這份 state 後，能否只靠目前的 props/state 完整重建？**若可以，它通常就是 derived data。

</details>

## `useReducer`：集中描述狀態轉移

> 實際案例：[useReducer：集中管理交易訂單狀態](./practical-cases/use-reducer)

### 做題前：它解決的是「狀態怎麼轉移」，不是單純少寫 setter

當一張訂單表單同時有 `draft`、`submitting`、`success`、`error`，使用多個 `useState` 很容易在不同 event handler 重複一樣的更新規則，甚至產生「已成功但仍顯示錯誤」的不可能組合。

```tsx
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

| 項目 | 角色 |
| --- | --- |
| `state` | 本次 render 的 reducer state snapshot |
| `dispatch(action)` | 把描述事件的 action 排入 React update queue |
| `reducer(state, action)` | pure function；根據舊 state 與 action 回傳完整 next state |
| `initialArg` / `init` | 初始輸入，以及選填的 lazy initialization function |

```tsx
type OrderState =
  | { status: "editing"; error: null }
  | { status: "submitting"; error: null }
  | { status: "error"; error: string };

function reducer(state: OrderState, action): OrderState {
  switch (action.type) {
    case "submitted":
      return { status: "submitting", error: null };
    case "failed":
      return { status: "error", error: action.message };
    case "reset":
      return { status: "editing", error: null };
    default:
      return state;
  }
}
```

```text
使用者事件 → dispatch(action) → React 呼叫 reducer(previousState, action)
           → reducer 回傳 nextState → component 重新 render
```

Reducer 只計算 state，不能送 request、改 DOM、產生隨機值或直接 mutation 舊 state。副作用仍放 event handler、Effect 或資料層；副作用完成後再 dispatch 結果。簡單 boolean 或單一 input 不必為了「看起來正式」就使用 reducer。

> 一句話記憶：`dispatch` 說明發生什麼，pure reducer 集中決定下一個合法狀態。

官方參考：[React `useReducer`](https://react.dev/reference/react/useReducer)、[Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)

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

不會，最後會加二。`dispatch` 不會直接執行並修改目前 render 裡的 `count`，而是把 action 排進 React 的更新佇列。下一次 render 計算 reducer state 時，React 會依序處理：

```text
原始 state 0
  → reducer(0, increment) 回傳 1
  → reducer(1, increment) 回傳 2
```

第二個 action 收到的是第一個 action 算完的 pending state，而不是 event handler closure 裡原本的 snapshot。即使 React 將同一個 event 的更新 batch 在一次 render 內處理，action 的順序仍會保留。

這和兩次 `setCount(count + 1)` 不同：後者先在 handler 中把同一份 `count` snapshot 算成相同的 next value；reducer 則把「發生 increment」排入 queue，之後逐步套用到最新 pending state。

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

不應該。Reducer 的工作是根據 `(state, action)` **計算 next state**，不是執行 action 所代表的外部工作。相同輸入應得到相同輸出，而且不能修改傳入的 state 或 component 外部的資料。

React 可以為了 Strict Mode、concurrent rendering 或重試更新而重複計算 reducer。若 reducer 內呼叫 API 或 analytics，一次使用者操作就可能送出多次 request／事件；即使那次 render 最後被放棄，外部副作用也無法自動撤回。

```tsx
function reducer(state, action) {
  // ✅ 只計算資料
  return { ...state, status: action.type };
}

function handleSubmit() {
  analytics.track('submit'); // ✅ 明確由使用者事件觸發
  dispatch({ type: 'submit' });
}
```

若副作用必須在某個 state 成功 commit 後同步外部系統，放在 effect；若它是使用者操作直接造成的工作，通常放 event handler 或專門的資料層。Reducer 應保持容易單元測試：給定 state/action，直接斷言回傳值即可。

</details>

### 3. 大型初始資料怎麼避免每次 render 重建？

```tsx
const [state, dispatch] = useReducer(reducer, props, createInitialState);
```

`createInitialState` 何時執行？第三個參數和直接寫 `createInitialState(props)` 有何差別？

<details>
<summary>答案</summary>

第三個參數 `createInitialState` 是 lazy initializer。React 建立這個 reducer state 時會呼叫 `createInitialState(props)`，並把結果當作初始 state；一般 re-render 不會再次執行。

```tsx
// ✅ 傳入 function，由 React 在初始化時呼叫
useReducer(reducer, props, createInitialState);

// ❌ JavaScript 每次 render 都先呼叫，再把結果交給 React
useReducer(reducer, createInitialState(props));
```

這能避免 parent 更新造成 child re-render 時，反覆解析或複製大型初始資料。不過 props 後來改變也**不會自動重設 reducer state**；需要 reset 時應 dispatch 明確的 `reset` action，或在資料 identity 真正改變時用 `key` remount component。

開發環境 Strict Mode 可能呼叫 initializer 兩次來檢查純度，因此 `createInitialState` 只能做 deterministic calculation，不應送 request、寫 storage 或修改 props。

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

React 很可能不更新畫面，因為 reducer 回傳的仍是同一個 state reference：

```tsx
Object.is(previousState, nextState); // true
```

更嚴重的是，`push` 已直接修改 `previousState.orders`。先前 render 的 closure、React DevTools 歷史或其他仍引用這個 array 的 component，都會看到舊 snapshot 被改掉，造成難以重現的資料錯亂。

Reducer 應建立新的 array 與最外層 object：

```tsx
function reducer(state, action) {
  return {
    ...state,
    orders: [...state.orders, action.order],
  };
}
```

Immutable update 的目的不只是「讓 React 知道要 render」，也是保證每次 state snapshot 不會在產生後被偷偷改變。對深層結構，可拆小 reducer、正規化資料，或使用 Immer 降低複製巢狀結構的負擔。

</details>

### 5. `dispatch` 可以安全放進 Context 嗎？

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

<details>
<summary>答案</summary>

可以。React 保證同一個 mounted reducer 的 `dispatch` function identity 穩定；state 更新時不會產生新的 dispatch function。因此把它放入 Context，不會因為 dispatch 本身的 reference 改變而通知 consumer。

常見做法是拆成兩個 Context：

```tsx
<OrderStateContext.Provider value={state}>
  <OrderDispatchContext.Provider value={dispatch}>
    {children}
  </OrderDispatchContext.Provider>
</OrderStateContext.Provider>
```

只需要發送 action 的 `AddOrderButton` 訂閱 dispatch Context；當 orders state 更新時，它不會因讀取整份 state Context 而被通知。需要顯示 orders 的 component 才訂閱 state Context。

若寫成 `{ state, dispatch }` 單一 value，每次 state 變動都會產生新的整體 value，所有 consumer 都會更新。`useMemo` 可以避免 unrelated parent render 建立無意義的新 object，但無法讓只讀 dispatch 的 consumer 在 state 真正改變時跳過通知；拆 Context 才改變訂閱邊界。

</details>

### 6. 什麼時候該從 `useState` 換成 `useReducer`？

<details>
<summary>答案</summary>

不是看 state 有幾個欄位，而是看**狀態轉移規則是否開始分散、互相依賴**。以下情況適合 reducer：

- 一個事件會同時修改多個欄位，例如 `orderSubmitted` 同時更新 status、error 與 submittedAt。
- 許多 event handler 都在重複相同更新規則。
- 下一個 state 需要依賴多個目前欄位，容易產生不合法組合。
- 希望用 action 描述「發生什麼」，並獨立測試每種狀態轉移。

```tsx
dispatch({ type: 'price_changed', price: '100' });
dispatch({ type: 'order_submitted' });
dispatch({ type: 'request_failed', message });
```

這會把「事件」留在 component，把「事件如何改變 state」集中在 reducer。代價是 action type、reducer switch 與額外結構，所以單一 input、toggle 或彼此獨立的少量 state 使用 `useState` 通常更直接。

Reducer 也不會自動解決 server cache、request deduplication、retry、loading lifecycle 或跨頁同步；這些需求通常交給專門的資料取得工具，而不是只因資料複雜就全塞進 reducer。

</details>

## `useContext`：讀取最近的 Provider 並訂閱 value

> 實際案例：[useContext：跨元件共用交易偏好](./practical-cases/use-context)

### 做題前：Context 是 tree 上的依賴注入與訂閱

假設登入使用者、主題或交易市場設定要被很深的 child 使用。逐層傳 props 沒有錯，但中間 component 若完全不關心資料，會形成大量 prop drilling。Context 讓 ancestor 在 tree 上提供 value，descendant 直接讀取最近的一層。

```tsx
const MarketContext = createContext("spot");

function App() {
  return (
    <MarketContext.Provider value="futures">
      <OrderPanel />
    </MarketContext.Provider>
  );
}

function OrderPanel() {
  const market = useContext(MarketContext);
  return <p>目前市場：{market}</p>;
}
```

| 元件／API | 角色 |
| --- | --- |
| `createContext(defaultValue)` | 建立 Context identity；default 只在上方完全沒有對應 Provider 時使用 |
| `<Context.Provider value={value}>` | 對其 descendant 提供 value |
| `useContext(Context)` | 讀最近 Provider 的 value，並訂閱後續變化 |

當 Provider value 改變，React 會用 `Object.is` 比較前後 value 並通知 consumers。因此每次 render 都建立 `{ user, logout }` 新 object，會被視為 value 改變；拆 Context、穩定 identity 或縮小 Provider 範圍，是在管理訂閱粒度，不是改變 Context 的基本語意。

```text
Outer Provider(value=A)
└─ component 讀到 A
   └─ Inner Provider(value=B)
      └─ component 讀到 B
```

Context 不會自動成為完整 global store：它沒有 selector、transaction、devtools 或 server cache。頻繁更新的大型共用資料要評估 subscription 粒度；明確只經過一兩層的資料，props 反而更直觀。

> 一句話記憶：`useContext` 讀取並訂閱 component 上方最近 Provider 的 value。

官方參考：[React `useContext`](https://react.dev/reference/react/useContext)、[Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)

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

`Panel` 讀到 `dark`，`Button` 讀到 `light`。

Context 的查找方式類似 lexical scope：React 從呼叫 `useContext(ThemeContext)` 的 component 所在位置，沿著 **render tree 向上** 找第一個相同 Context object 的 Provider。最近的一層會遮蔽更外層的值，所以內層可以針對局部子樹 override theme。

```text
Provider("dark")
├─ Panel  → dark
└─ Provider("light")
   └─ Button → light
```

這不是依照檔案 import 路徑或 JSX 宣告順序搜尋，也不會往 sibling 或 child 尋找。若某個 component 自己先呼叫 `useContext`，再在 return 中建立 Provider，該 Provider 位於它的下方，只會影響 children，不會反過來影響 component 自己。

</details>

### 2. Provider 傳 `undefined` 時會退回 default value 嗎？

```tsx
const AuthContext = createContext("guest");
<AuthContext.Provider value={undefined}>...</AuthContext.Provider>
```

<details>
<summary>答案</summary>

不會。Consumer 會取得 `undefined`。

`createContext('guest')` 的 default value 不是空值合併規則，而是「樹上完全找不到 matching Provider」時的最後 fallback。只要找到了 Provider，它提供的 value 就是答案，不論 value 是 `undefined`、`null`、`false` 或空字串。

若 Auth Provider 是必填，建議不要給一個看似可正常運作的假使用者，而是使用明確 sentinel 並包成 custom Hook：

```tsx
const AuthContext = createContext<AuthValue | null>(null);

function useAuth() {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
```

這樣漏包 Provider 時會在錯誤位置立即失敗，而不是讓 `undefined` 傳到更深處才出現難懂的 property error。

</details>

### 3. 為何 Provider 的 unrelated parent render 也可能通知 consumer？

```tsx
const value = { theme, setTheme };
return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
```

<details>
<summary>答案</summary>

因為 object literal 每次執行都會建立新 reference：

```tsx
Object.is(
  { theme, setTheme },
  { theme, setTheme },
); // false
```

Context 使用 `Object.is` 比較前後 `value`。即使 theme 與 setTheme 都沒變，只要 unrelated parent state 讓 Provider component re-render，新的 `{ theme, setTheme }` 就會被判定為不同 value，React 因而通知所有訂閱這個 Context 的 consumer。

可以穩定 value identity：

```tsx
const value = useMemo(
  () => ({ theme, setTheme }),
  [theme], // setTheme identity 由 React 保證穩定
);
```

這只避免「內容沒變但包裝 object 變了」的通知。如果 `theme` 真的改變，value 本來就應變，所有讀取該 Context 的 consumer 也應取得新 theme。若 value 包含多組更新頻率差很多的資料，通常應拆 Context，而不是不斷堆 memo。

</details>

### 4. `React.memo` 能擋住 Context 更新嗎？

<details>
<summary>答案</summary>

不能擋住 component **自己訂閱的 Context** 更新。`React.memo` 比較的是 parent 傳入的 props；Context 是另一條獨立的 reactive input。

```tsx
const Price = memo(function Price() {
  const ticker = useContext(MarketContext);
  return <span>{ticker.price}</span>;
});
```

即使 `Price` 沒有 props，當 `MarketContext.value` 改變時仍必須 re-render，否則它會顯示過期的 context。Memo 不能為了效能破壞 correctness。

可以採取的最佳化包括：

- 將 theme、auth、ticker 等不同責任或更新頻率拆成不同 Context。
- 讓外層 component 讀 Context，再把 consumer 真正需要的 primitive prop 傳給 memoized child。
- 高頻且需要 selector 的資料使用 `useSyncExternalStore` 類型的 external store，讓 component 只訂閱選取片段。

重點是縮小訂閱範圍，而不是期待 `memo` 擋住已訂閱資料的合法更新。

</details>

### 5. 明明有 Provider，為何 consumer 仍讀到 default？

<details>
<summary>答案</summary>

常見原因有兩類。

第一類是 Provider 實際上不在 consumer 上方：可能包在 sibling、包在 consumer return 的下方，或某條 route／測試 render path 漏包。Context 只沿著 React tree 向上找，不看畫面上的 DOM 距離。

第二類是雙方使用了兩個不同的 Context object：

```tsx
// provider-import.ts 與 consumer-import.ts 若因重複 bundle
// 各自拿到一份模組，名稱相同也沒有用。
ProviderContext === ConsumerContext; // 必須是 true
```

這在 monorepo、symlink、library 重複安裝或錯誤的 bundler alias 中可能發生。`createContext` 每呼叫一次都建立新的 identity；Context 靠 object `===` 配對，不靠變數名稱或 default value。

除錯順序可先用 React DevTools 確認 tree 與 Provider value，再檢查 provider/consumer 是否都從同一個 context module 匯入，以及 bundle 中是否出現重複套件。

</details>

### 6. 哪些資料不適合直接丟進單一 Context？

<details>
<summary>答案</summary>

Context 擅長解決「許多深層 component 都需要同一份相對穩定資料」的傳遞問題，例如 theme、locale、登入資訊或表單層級設定；它不是免費的全域 state manager。

以下資料不適合無差別塞進單一 Context：

- 每秒更新很多次的 order book、mouse position 或影音進度。
- 一個巨大 object，但不同 consumer 只需要其中不同的小欄位。
- 具有 cache、deduplication、retry、stale time 等 lifecycle 的 server data。
- 只在一個小 component 子樹內使用的 local draft。

Provider value 改變時，所有讀取該 Context 的 consumer 都會收到更新；原生 `useContext` 不提供 selector，無法只因 component 使用 `value.price` 就忽略 `value.depth` 的改變。把所有資料放在一起會擴大 render fan-out，也模糊資料 owner。

應先把 state 放在最低的共同 owner；跨深層但低頻的資料再用 Context。高頻細粒度訂閱考慮 external store，server cache 使用資料取得工具，並依責任與更新頻率拆分 Context。

</details>

## `useRef`：跨 render 的可變容器

> 實際案例：[useRef：訂單驗證失敗時聚焦欄位](./practical-cases/use-ref)

### 做題前：ref 能跨 render 保存值，但改它不會更新畫面

Ref 是 component instance 擁有的一個穩定 object：

```tsx
const ref = useRef(initialValue);
// ref object identity 穩定；可讀寫 ref.current
```

它最常處理兩類資料：

1. React 交付的 DOM node，例如 focus、scroll 或 measurement。
2. 不參與 render 的 mutable value，例如 timer ID、previous value、第三方 instance。

```tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleSearch() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }

  return <input ref={inputRef} onChange={scheduleSearch} />;
}
```

| 比較 | state | ref |
| --- | --- | --- |
| 跨 render 保留 | 是 | 是 |
| 更新是否要求 React render | 是 | 否 |
| render 用的畫面資料 | 適合 | 不適合 |
| DOM／timer／imperative instance | 通常不適合 | 適合 |

`ref.current = next` 會立刻修改容器，但 React 不知道 UI 應重新計算。因此把計數器、錯誤訊息或按鈕文字只放 ref，畫面不會跟著變。Render 也應保持 pure；除了可預測的 lazy initialization，不要在 component body 任意讀寫 mutable ref。

DOM ref 的時序要跟 commit 對齊：render 時 DOM 可能尚未存在，commit 後 React 才設定 `.current`；unmount 時再清回 `null`。

> 一句話記憶：ref 是 component 私有的 mutable box，能記住值，但不會通知 React 重畫。

官方參考：[React `useRef`](https://react.dev/reference/react/useRef)、[Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)

### 1. 點擊後畫面為什麼仍是 0？

```tsx
function Counter() {
  const countRef = useRef(0);
  return <button onClick={() => countRef.current++}>{countRef.current}</button>;
}
```

<details>
<summary>答案</summary>

因為 ref 是 React 不追蹤的 mutable container。點擊後 `countRef.current` 的確從 `0` 變成 `1`，但這個 mutation 不會把更新排進 React queue，也就沒有新的 render 與 DOM commit，所以按鈕文字仍停在 `0`。

```text
點擊 → ref.current 變成 1 → 沒有 re-render → DOM 仍是 0
```

如果之後剛好有另一個 state 造成 component re-render，JSX 可能才讀到目前的 ref 值而突然顯示 `1`。這種更新時機取決於無關事件，資料流不可預測，也說明不應拿 ref 保存會影響畫面的資料。

計數會顯示在 UI，就應使用 state：

```tsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(previous => previous + 1)}>
    {count}
  </button>
);
```

Ref 適合 timer ID、DOM node、imperative instance，或 callback 需要讀取但不應觸發畫面更新的值。判斷重點是：**這個值改變時，畫面是否應重新計算？是就用 state；否才考慮 ref。**

</details>

### 2. Render 時能立刻讀到 DOM ref 嗎？

```tsx
const inputRef = useRef<HTMLInputElement>(null);
console.log(inputRef.current);
return <input ref={inputRef} />;
```

<details>
<summary>答案</summary>

不能。初次 render 時 `inputRef.current` 是傳給 `useRef` 的初始值 `null`，因為此時 React 只是在計算「應該產生什麼 JSX」，真正的 `<input>` DOM node 還沒建立。

React 大致分成兩個階段：

```text
Render：呼叫 component，計算 JSX
   ↓
Commit：更新 DOM，設定 ref.current
```

React 在 commit 階段建立／更新 DOM 後，才把 node 指派給 `inputRef.current`。因此 render 內讀 DOM ref，不只初次是 `null`，更新 render 時也可能讀到上一輪 commit 的 node，而不是目前正在計算的 JSX。

需要操作 DOM 時依需求選擇時機：

```tsx
// ✅ 使用者操作發生時，DOM 通常已完成 commit
function handleClick() {
  inputRef.current?.focus();
}

// ✅ mount 後同步量測 layout，避免畫面先閃動
useLayoutEffect(() => {
  const width = inputRef.current?.getBoundingClientRect().width;
}, []);

// ✅ mount 後不需阻擋 paint 的操作
useEffect(() => {
  inputRef.current?.focus();
}, []);
```

當 node 從 DOM 移除時，React 會在 commit 中把 ref 設回 `null`。因此非同步 callback 執行時仍應考慮 component 可能已 unmount，使用 null check 或 optional chaining。

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

這個模式讓長時間存活的 callback 透過同一個 ref object，讀到後來寫入 `.current` 的值：

```tsx
const latestSymbol = useRef(symbol);

useEffect(() => {
  latestSymbol.current = symbol;
}, [symbol]);

useEffect(() => {
  const timer = setInterval(() => {
    console.log(latestSymbol.current);
  }, 3000);

  return () => clearInterval(timer);
}, []);
```

Interval callback 雖然捕捉到第一次 render 的 lexical environment，但它捕捉的 `latestSymbol` object 沒有改變，因此可以從 `.current` 取得後續同步進去的值，而且不必在每次 `symbol` 改變時重設 interval。

代價包括：

1. **脫離 reactive data flow**：ref 是 mutable escape hatch。React 不會追蹤 `.current` 的變化，也不會因它改變而重新 render 或重新執行 effect。
2. **需要手動同步**：開發者必須維護 `latestSymbol.current = symbol` 及正確的 dependencies。忘記同步或漏掉依賴時，仍會得到舊資料，而且比一般 dependency 問題更難察覺。
3. **畫面與邏輯可能不同步**：修改 `.current` 不會更新 JSX，因此不能把 ref 當成應驅動畫面的 state。
4. **存在 effect 執行前的時間差**：`useEffect` 在 commit 後才把新 `symbol` 寫入 ref。在新畫面完成 commit 到該 effect 執行之間，callback 仍可能讀到前一次的值。
5. **可能掩蓋真正的依賴**：若 `symbol` 改變時，本來就應重新訂閱、重新查詢或連線到另一個商品，那它就是 reactive dependency，應放入 effect dependency，而不是用 ref 阻止 effect 重跑。

可用這個原則判斷：

| 需求 | 建議做法 |
| --- | --- |
| `symbol` 改變後需要更新畫面 | 使用 state / props |
| `symbol` 改變後需要重建 subscription | 將 `symbol` 放進 effect dependencies，並 cleanup 舊 subscription |
| 不想重設 timer，但 callback 要讀取最新 `symbol` | React 18 可使用此 ref pattern |
| 使用 React 19.2+，且 callback 只由 effect 內部觸發 | 可考慮 `useEffectEvent` |

React 19.2+ 可將「非 reactive、但需要讀取最新值」的 effect 邏輯寫成 Effect Event：

```tsx
const onTick = useEffectEvent(() => {
  console.log(symbol);
});

useEffect(() => {
  const timer = setInterval(() => onTick(), 3000);
  return () => clearInterval(timer);
}, []);
```

`useEffectEvent` 只能從 effect 或其他 Effect Event 中呼叫，不是一般 event handler，也不應拿來刻意省略真正會決定 effect 是否重跑的 dependency。本專案目前使用 React 18，因此這段是升級後的替代方案，現階段不能直接使用。

</details>

### 4. 這個昂貴 instance 每次都會建立嗎？

```tsx
const engineRef = useRef(new TradingEngine());
```

<details>
<summary>答案</summary>

會。`useRef` 雖然只會採用第一次 render 傳入的 initial value，但 JavaScript 會先計算函式參數，再呼叫函式：

```tsx
const engine = new TradingEngine(); // 每次 render 都先執行
const engineRef = useRef(engine);    // 後續 render 傳入的 engine 會被忽略
```

因此 `useRef(new TradingEngine())` 在每次 re-render 都會建立一個新 instance，只是 React 繼續保留原本的 `engineRef.current`，新建立的 instance 隨即被丟棄。

**解法一：用 ref 做 lazy initialization**

```tsx
const engineRef = useRef<TradingEngine | null>(null);

if (engineRef.current === null) {
  engineRef.current = new TradingEngine();
}

// 此處可確定 engineRef.current 已是 TradingEngine
engineRef.current.trade();
```

這是 render 中寫入 ref 的少數可接受例外：條件必須可預測，而且 `new TradingEngine()` 的結果必須穩定、不能有外部副作用。

**解法二：使用 `useState` 的 lazy initializer**

```tsx
const [engine] = useState(() => new TradingEngine());
```

若 instance 在元件存活期間不需要被替換，這也能避免每次 re-render 都執行 constructor。不需要 setter 時可以只解構第一個元素。

| 寫法 | 一般 re-render 時是否重新建立 |
| --- | --- |
| `useRef(new TradingEngine())` | 會，建立後被 React 忽略 |
| `useRef(null)` + 初始化判斷 | 不會 |
| `useState(() => new TradingEngine())` | 不會 |

以上都是針對同一次 mount 的 re-render；元件 unmount 後重新 mount，仍會建立新的 instance。開 WebSocket、訂閱事件等有外部副作用的初始化，應放進 effect 並提供 cleanup，而不是在 render 或 state initializer 中執行。另外，開發環境的 Strict Mode 可能故意重複呼叫初始化流程來檢查純度，因此 constructor 仍應保持純粹。

</details>

### 5. 可以在 render 中任意讀寫 ref 嗎？

<details>
<summary>答案</summary>

**一般不行。**語法上可以存取 `.current`，但 React 不會追蹤 ref 的讀寫，而同一個 ref object 又會跨多次 render 保留。若在 render 中任意讀寫，它就成為 React 不知道的隱藏輸入或副作用。

React 預期 render 像純函式：相同的 props、state、context 應算出相同的 JSX，而且執行一次、兩次，或中途放棄，都不應改變其他 render 的結果。

#### 為什麼 render 中寫 ref 有問題？

```tsx
function Counter() {
  const renderCount = useRef(0);
  renderCount.current += 1; // ❌ render 本身產生 mutation

  return <p>Render 次數：{renderCount.current}</p>;
}
```

這段程式假設「呼叫 component function 就等於成功顯示一次」，但 React 不保證如此：

- Strict Mode 在開發環境可能額外執行 render，以找出不純的程式。
- Concurrent rendering 可以暫停、重試或放棄某次 render。
- 被放棄的 render 雖然沒有 commit 到畫面，卻已經修改共用的 `ref.current`。

例如 render A 把數字從 0 改成 1，之後 A 被放棄；render B 仍可能讀到 1。畫面從未 commit A，但 A 已偷偷影響 B，結果便取決於 React 的執行時機，而不只取決於 props 和 state。

#### 為什麼 render 中讀 ref 也有問題？

```tsx
function Player() {
  const playingRef = useRef(false);

  return <p>{playingRef.current ? '播放中' : '已暫停'}</p>; // ❌
}
```

若其他地方執行 `playingRef.current = true`，React 不會因此重新 render，畫面可能一直顯示「已暫停」。即使剛好因另一個 state 更新而重新 render，畫面才突然讀到新值，更新時機也不是由這份資料驅動的。

DOM ref 還有另一個問題：React 在 commit 階段才設定 DOM ref。第一次 render 時它是 `null`；後續 render 讀到的也可能是上一次 commit 的 DOM node，而不是目前正在計算的 JSX 所對應的 node。

#### 應該放在哪裡？

| 需求 | 正確位置 |
| --- | --- |
| 值會影響 JSX | 使用 state / props，在 render 中讀取 |
| 點擊時 focus input 或讀取最新 imperative value | Event handler 中讀寫 ref |
| Commit 後操作 DOM、訂閱或同步外部系統 | 合適的 effect 中讀寫 ref |
| 保存 timer ID，不需要顯示在畫面 | Event handler 或 effect 中讀寫 ref |

```tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus(); // ✅ 使用者事件發生時，render 已結束
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus</button>
    </>
  );
}
```

#### 例外：可預測的 lazy initialization

```tsx
const engineRef = useRef<TradingEngine | null>(null);

if (engineRef.current === null) {
  engineRef.current = new TradingEngine();
}
```

這是 render 中寫 ref 的少數可接受例外，因為初始化分支只在值為 `null` 時執行，而且每次執行都應得到可預測、等價且沒有外部副作用的結果。若 constructor 會連線 WebSocket、訂閱事件或修改外部資料，就不是安全的 lazy initialization，應改到 effect 並 cleanup。

簡單記法：**資料若參與畫面，用 state；ref 只保存不參與畫面的 imperative 資料，並在 event handler、effect 或可預測的初始化分支中存取。**

</details>

### 6. `useRef` 和 module-level 變數差在哪裡？

<details>
<summary>答案</summary>

差別在 **owner、生命週期與隔離範圍**。

```tsx
let moduleCounter = 0; // 整個 module 共用

function Widget() {
  const localCounter = useRef(0); // 每個 Widget instance 各自一份
}
```

若畫面同時 mount 兩個 `Widget`：

- 兩者讀寫的是同一個 `moduleCounter`，A 修改後 B 也會看到。
- 兩者各自擁有不同的 `localCounter` ref，A 不會污染 B。
- Ref 在該 instance 的 re-render 之間保留；unmount 後該 instance 的 ref 便失去生命週期 owner，重新 mount 會建立新 ref。
- Module 變數通常存活到整個 module／頁面執行環境被卸載，和 component 是否存在無關。

Module 變數還可能造成測試互相污染，以及 SSR 中不同使用者 request 共用可變資料的風險。Ref 則由 React component tree 管理，範圍比較符合「這個 instance 的 imperative 資料」。

不過 ref 仍不會觸發 render。若資料改變需要更新 UI，應使用 state；若多個 component 真的要共享 reactive data，應由共同 parent、Context 或 external store 管理，而不是用 module mutable variable 偷渡。

</details>

## `useImperativeHandle`：限制 parent 透過 ref 能做什麼

> 實際案例：[useImperativeHandle：限制價格欄位的命令介面](./practical-cases/use-imperative-handle)

### 做題前：它是在設計 imperative API 邊界

一般情況應以 props 描述 UI，例如用 `isOpen` 控制 modal。但 focus、selection、scroll 這些操作本質上是命令式行為；parent 有時需要透過 ref 呼叫 child。若直接暴露整個 DOM node，parent 也能任意改 style、value 或事件，child 的封裝就破掉了。

```tsx
useImperativeHandle(ref, createHandle, dependencies?);
```

```tsx
type SearchInputHandle = {
  focus(): void;
  clear(): void;
};

const SearchInput = forwardRef<SearchInputHandle>(function SearchInput(_, ref) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
    clear() {
      if (inputRef.current) inputRef.current.value = "";
    },
  }), []);

  return <input ref={inputRef} />;
});
```

```text
parent ref.current
    ↓ 只能看到 child 公開的 contract
{ focus(), clear() }
    ↓ child 內部再操作
真正的 input DOM ref
```

`createHandle` 讀到的 props/state 屬於 reactive values，必須正確列在 dependencies，否則 method 可能捕捉舊值。React 18 及更早版本要用 `forwardRef` 接收 ref；React 19 可以把 `ref` 當 prop 接收。這是版本語法差異，封裝原則相同。

不要用 imperative handle 取代本來可以 declarative 表達的資料流。`open/close` 往往適合 `isOpen` prop；`focus/scroll/select` 才是典型 imperative method。

> 一句話記憶：它不是讓 parent 權限更大，而是把 child 的 ref 能力縮成最小公開介面。

官方參考：[React `useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle)

### 1. Parent 最後拿到 DOM node 還是自訂 object？

```tsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current?.focus(),
}));
```

<details>
<summary>答案</summary>

Parent 最後拿到的是 `{ focus }` 這個自訂 handle，不是內部的 `<input>` DOM node。

`useImperativeHandle` 會攔截 parent 傳入的 ref，並決定要把什麼值放進 `parentRef.current`：

```tsx
type InputHandle = {
  focus: () => void;
};

const SearchInput = forwardRef<InputHandle>(function SearchInput(_, ref) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }), []);

  return <input ref={inputRef} />;
});
```

Parent 只能呼叫 `searchRef.current?.focus()`，不能任意修改 input value、style 或 DOM attributes。這建立一層封裝：child 之後即使把 `<input>` 換成第三方 editor，只要仍實作 `focus()`，parent 就不必改。

它不是把資料「傳回 parent」的一般管道，而是刻意暴露一小組 imperative commands 的 escape hatch。

</details>

### 2. Handle method 為何一直使用舊 prop？

```tsx
useImperativeHandle(ref, () => ({
  submit: () => onSubmit(symbol),
}), []);
```

<details>
<summary>答案</summary>

因為空 dependency array 表示 React 不需要重新建立 handle。第一次 render 建立的 `submit` function 透過 closure 捕捉了當時的 `onSubmit` 與 `symbol`，後續 props 改變時，它仍呼叫舊值。

```tsx
useImperativeHandle(ref, () => ({
  submit: () => onSubmit(symbol),
}), [onSubmit, symbol]); // ✅ handle 使用到的 reactive values
```

當 dependency 改變時，React 會在 commit 階段更新 parent ref 所指向的 handle。Parent 下次呼叫 `submit()` 就會使用最新 callback 與 symbol。

另一種設計是讓命令顯式接收當次資料：

```tsx
useImperativeHandle(ref, () => ({
  submit: (nextSymbol: string) => onSubmit(nextSymbol),
}), [onSubmit]);
```

選擇取決於 API 語意，但不能為了讓 handle identity 看似穩定，就故意省略真實 dependency；stable stale value 仍然是 bug。

</details>

### 3. Parent 在自己的 render 中呼叫 `ref.current.focus()` 會怎樣？

<details>
<summary>答案</summary>

這是不正確的呼叫時機，可能什麼都沒做，也可能操作上一輪 commit 的 DOM。

Parent render 時，child 的這次 JSX 還沒有 commit：初次 mount 的 `ref.current` 是 `null`；更新時它可能仍指向上一輪 handle。更重要的是 `focus()` 會改變瀏覽器焦點，屬於外部副作用，而 render 必須只是計算 JSX。

React 可以重複、暫停或放棄 render。若 render 中呼叫 focus，即使這次 UI 最後沒有 commit，使用者焦點也已被移動；Strict Mode 下還可能重複執行。

應由明確事件或 commit 後流程觸發：

```tsx
function handleEditClick() {
  editorRef.current?.focus(); // ✅ 使用者事件
}

useEffect(() => {
  if (shouldAutoFocus) editorRef.current?.focus(); // ✅ commit 後
}, [shouldAutoFocus]);
```

Optional chaining 只避免 `null` exception，不能把 render phase 的 side effect 變成正確做法。

</details>

### 4. 應暴露 `input` 還是 `focus/clear/validate`？

<details>
<summary>答案</summary>

優先暴露最小而具語意的操作，例如 `focus()`、`clearSelection()` 或 `focusInvalidField()`，而不是整個 `HTMLInputElement`。

若直接暴露 DOM node，parent 可以呼叫任何 method、改任意 attribute，甚至假設 child 一定由某個 `<input>` 組成。Child 的內部結構因此變成 public API，日後換成 textarea、contenteditable 或第三方元件都可能破壞 parent。

```tsx
type FormHandle = {
  focusInvalidField: () => void;
  resetSelection: () => void;
};
```

這種 capability-based API 只承諾「能完成什麼」，不洩漏「內部怎麼完成」。也比較容易限制誤用、撰寫型別和測試。

只有 parent 確實需要原生 DOM API，而且薄 wrapper 沒有封裝價值時，才考慮直接轉發 DOM ref。`useImperativeHandle` 應保持少量 escape hatch，不能取代一般 props/state 資料流。

</details>

### 5. 可以用 imperative handle 取代 controlled props 嗎？

<details>
<summary>答案</summary>

通常不該。Controlled component 的核心是 value 由 props/state 決定，更新透過 callback 往上通知：

```tsx
<PriceInput value={price} onChange={setPrice} />
```

資料 owner 明確，React DevTools 能看見 props/state，任何 render 都能根據輸入重建 UI。若改成 parent 到處呼叫 `ref.current.setPrice()`、`getPrice()`，就形成隱藏的雙向命令流：畫面真正資料可能藏在 child ref／DOM 中，驗證、重設、SSR 與測試都更難推理。

合理的 imperative use case 通常是「命令」而不是「應用資料」：

- Focus、scroll、文字 selection。
- 播放、暫停影音。
- 觸發第三方 imperative widget 的操作。
- 暫時無法用 declarative props 表達的 DOM 行為。

若需求可以說成「畫面應呈現某個 value」，優先 props/state；若需求是「現在執行一次 focus/scroll/play」，才考慮 imperative handle。

</details>

### 6. React 18 與 React 19 的 ref 接法有何差異？

<details>
<summary>答案</summary>

**核心差異（一句話總結）：**React 18 的 function component 必須透過 `forwardRef` 接收 parent 傳來的 ref；React 19 則可把 `ref` 當成一般 prop，直接從 props 取得。

#### React 18：必須使用 `forwardRef`

在 React 18，`ref` 是 React 特別處理的 attribute，不會出現在 function component 的一般 props 中。Child 必須用 `forwardRef` 包裹，並從 render function 的第二個參數取得 `ref`：

```tsx
// React 18
import { forwardRef, useRef } from 'react';

type Props = {
  placeholder?: string;
};

const CustomInput = forwardRef<HTMLInputElement, Props>(
  function CustomInput({ placeholder }, ref) {
    return <input ref={ref} placeholder={placeholder} />;
  },
);

function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <CustomInput ref={inputRef} placeholder="請輸入..." />;
}
```

#### React 19：直接把 `ref` 當 prop

React 19 開始，function component 可以直接從第一個參數取得 `ref`，因此新元件不再需要使用 `forwardRef`：

```tsx
// React 19+
import { useRef, type Ref } from 'react';

type Props = {
  placeholder?: string;
  ref?: Ref<HTMLInputElement>;
};

function CustomInput({ placeholder, ref }: Props) {
  return <input ref={ref} placeholder={placeholder} />;
}

function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <CustomInput ref={inputRef} placeholder="請輸入..." />;
}
```

Parent 的寫法沒有改變，差別只在 **child 如何接收 ref**：

| 版本 | Child 接收方式 | 是否需要 `forwardRef` |
| --- | --- | --- |
| React 18 | render function 的第二個參數 | 需要 |
| React 19 | 一般 props 中的 `ref` | 不需要 |

若 child 不想直接暴露 DOM，而是要透過 `useImperativeHandle` 只提供 `focus()`、`clear()` 等方法，兩個版本仍然都可以使用它；改變的只有 ref 傳進 child 的方式。

面試與實作時要先確認 React 與 `@types/react` 版本。React 19 的 ref-as-prop 語法若直接貼進 React 18 專案，runtime 與型別都不會依照 React 19 的方式處理。

</details>

## `useId`：SSR 安全的 accessibility identity

> 實際案例：[useId：建立可重複使用的無障礙訂單欄位](./practical-cases/use-id)

### 做題前：它產生的是結構 ID，不是資料 ID

同一頁可能 render 多個表單元件。若每個元件都硬編碼 `id="password"`，`label htmlFor`、`aria-describedby` 會指向重複 ID；若用 `Math.random()`，server render 與 client hydration 又可能產生不同 HTML。

```tsx
const id = useId();
```

`useId` 回傳與這個 component 中這次 Hook 呼叫位置相關的穩定字串，適合串起 accessibility attributes：

```tsx
function PasswordField() {
  const prefix = useId();
  const inputId = `${prefix}-input`;
  const hintId = `${prefix}-hint`;

  return (
    <div>
      <label htmlFor={inputId}>密碼</label>
      <input id={inputId} aria-describedby={hintId} type="password" />
      <p id={hintId}>至少 12 個字元</p>
    </div>
  );
}
```

```text
useId() 產生同一 instance 的 prefix
├─ label htmlFor ──────┐
├─ input id  ◀─────────┘
└─ aria-describedby ──▶ hint id
```

它不適合 list key、database ID、cache key 或 request ID。那些 identity 應來自資料本身，才能在排序、插入、刪除與重新掛載後仍代表同一 entity。`useId` 也不會自動建立 label 關聯；你仍要把回傳字串放進正確 HTML attributes。

> 一句話記憶：`useId` 解決同一 React tree 與 SSR hydration 中的 accessibility ID 協調，不代表業務資料身份。

官方參考：[React `useId`](https://react.dev/reference/react/useId)

### 1. State 更新後 ID 會改嗎？

```tsx
const id = useId();
const [value, setValue] = useState("");
```

<details>
<summary>答案</summary>

不會。同一個 mounted component instance 中，同一個 `useId` 呼叫位置會在 re-render 之間取得相同 ID。Input 的 value state 更新不會改變 component identity，因此 label 與 input 的關聯也不會斷掉。

```tsx
const id = useId(); // 例如 React 產生的 :r1:

return (
  <>
    <label htmlFor={id}>Symbol</label>
    <input
      id={id}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  </>
);
```

若 component unmount 後重新 mount，例如 `key` 改變，這是新的 component instance，ID 也可能不同。不要依賴 ID 的字串格式或拿它當永久資料 identity；它只需在 React tree 與 server/client hydration 中維持正確關聯。

因此 `useId` 適合 accessibility attributes，不適合作為 API payload、database ID、analytics entity ID 或需要跨 session 保存的識別碼。

</details>

### 2. 可以拿 `useId()` 當 list key 嗎？

<details>
<summary>答案</summary>

不可以，原因有兩層。

第一，若在 `map` 裡為每筆資料呼叫 `useId`，資料筆數或順序改變會讓 Hook 呼叫次數／順序改變，違反 Rules of Hooks。

第二，list key 的任務是告訴 React「這次 render 的哪筆資料，對應上次的哪筆資料」。這個 identity 必須來自資料本身；`useId` 的 identity 來自 component tree 中的 Hook 位置，無法表達某個 order 在排序、插入或刪除後仍是同一筆 order。

```tsx
// ✅ key 來自 domain data
orders.map(order => (
  <OrderRow key={order.id} order={order} />
));
```

若 key 跟著位置變動，React 可能把某列的 local state、focus 或輸入內容錯配給另一筆資料。資料沒有 ID 時，應在資料建立／取得時產生並保存，而不是在 render 時臨時生成。

</details>

### 3. 為何不直接用 `Math.random()` 產生 input id？

<details>
<summary>答案</summary>

因為 `Math.random()` 每次呼叫都可能不同，render 不是穩定、可重試的計算：

```tsx
const id = Math.random().toString(36); // 每次 render 都是新值
```

State 更新後 label 的 `htmlFor` 和 input `id` 雖然可能在同一次 render 一起改掉，但 DOM identity 無意義地變動，也破壞 render 純度。Strict Mode 的額外 render 還會產生更多不同結果。

SSR 問題更明顯：server 可能輸出 `id="abc"`，client 第一次 render 卻得到 `id="xyz"`，造成 hydration markup 不一致。React 無法確定 server HTML 和 client component 是否完全對應。

`useId` 會根據 React tree identity 產生可協調的 ID；在 server 與 client component tree 相同的前提下，即使 hydration 執行順序不同，也能維持關聯。它解決的是 UI／accessibility identity，不是密碼學隨機值或資料 ID。

</details>

### 4. 一個 Hook 怎麼產生多個關聯 ID？

```tsx
const prefix = useId();
const inputId = `${prefix}-price`;
const errorId = `${prefix}-price-error`;
```

<details>
<summary>答案</summary>

可以把一次 `useId` 的結果當作該元件實例的唯一 prefix，再加上有語意的 suffix：

```tsx
const prefix = useId();
const inputId = `${prefix}-price`;
const hintId = `${prefix}-price-hint`;
const errorId = `${prefix}-price-error`;

return (
  <>
    <label htmlFor={inputId}>Price</label>
    <input
      id={inputId}
      aria-describedby={`${hintId} ${errorId}`}
    />
    <p id={hintId}>輸入每單位價格</p>
    <p id={errorId}>價格必須大於零</p>
  </>
);
```

每個 `PriceField` instance 都會有不同 prefix，所以頁面上 render 多份表單也不會 ID collision；同一 instance 內的 label、hint、error 又能清楚互相關聯。

不需要為每個 element 都呼叫一次 `useId`。共用 prefix 能減少 Hook 數量，也讓產生出的關係更容易閱讀與維護。

</details>

### 5. `useId` 本身會自動改善 accessibility 嗎？

<details>
<summary>答案</summary>

不會。`useId` 只產生一個可用的唯一字串，不知道這個 ID 要代表 label、提示、錯誤訊息或其他 element，也不會自動加入任何 ARIA 關係。

```tsx
const errorId = useId();

// ❌ 只有產生 ID，input 與錯誤訊息仍沒有關聯
return <p id={errorId}>Required</p>;
```

必須把正確 attributes 接起來：

```tsx
const inputId = useId();
const errorId = `${inputId}-error`;

return (
  <>
    <label htmlFor={inputId}>Price</label>
    <input id={inputId} aria-describedby={errorId} aria-invalid="true" />
    <p id={errorId}>Price is required</p>
  </>
);
```

Accessibility 取決於正確 HTML semantics、名稱、描述、狀態與鍵盤操作，不取決於「是否使用某個 Hook」。例如 `<label><span>Price</span><input /></label>` 已由巢狀語意建立關聯，可能根本不需要 ID。

</details>

### 6. 把 `useId` 放進條件式會有什麼問題？

```tsx
if (showError) {
  const errorId = useId();
}
```

<details>
<summary>答案</summary>

這會違反 Rules of Hooks。React 不是靠變數名稱辨認某個 Hook 的 state，而是靠每次 render 的**呼叫順序**把第 1、2、3 個 Hook 對回先前保存的資料。

假設 `showError = false` 時跳過 `useId`，後面的 `useState` 變成第 2 個 Hook；下一次 `showError = true` 時插入 `useId`，原本的 `useState` 變成第 3 個。React 就無法正確判斷每個儲存位置屬於誰。

應固定在 component top level 呼叫，再條件式使用結果：

```tsx
const errorId = useId();

return (
  <>
    <input aria-describedby={showError ? errorId : undefined} />
    {showError && <p id={errorId}>Invalid price</p>}
  </>
);
```

如果只有某個條件成立時才需要整組 hooks，可把那個區塊抽成獨立 component，讓新 component 內部的 Hook 順序仍固定。規則不是「條件式不能顯示 UI」，而是「同一 component 每次 render 必須以相同順序呼叫 Hooks」。

</details>

## 完成檢查

你應該能不看答案說出：

- state 是 snapshot，setter/dispatch 排入更新，不改目前變數。
- Context 是依 provider value identity 進行的訂閱，不是免費全域 store。
- Ref 是 component-local escape hatch，不參與畫面更新。
- Imperative handle 應暴露最小命令介面。
- `useId` 解 accessibility 與 hydration identity，不解 list identity。

[下一組：Effect / Memo Hooks](./19-react-effect-memo-hooks-drills.md)
