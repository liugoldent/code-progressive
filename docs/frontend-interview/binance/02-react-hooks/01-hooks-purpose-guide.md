---
sidebar_position: 1
sidebar_label: "Hooks 為什麼存在"
slug: "/frontend-interview/binance/react-hooks-purpose-guide"
title: "React Hooks 為什麼存在：常用 Hook 解決問題全覽"
description: "從用途、存在理由、問題與最小用法理解 React 18/19、TanStack Query、Redux、Zustand、React Router、React Hook Form 常用 Hooks。"
tags:
  - React
  - Hooks
  - React 19
  - TanStack Query
  - Redux
  - React Router
  - React Hook Form
  - Zustand
keywords: ["React Hooks 用途", "React Hook 為什麼", "React Hook 解決什麼問題", "常用 Hooks", "useState", "useEffect", "useQuery", "useForm"]
---

# React Hooks 為什麼存在：常用 Hook 解決問題全覽

這篇不從「API 有幾個參數」開始，而是固定回答五件事：

1. **在做什麼？** Hook 管理、訂閱或連接哪一類資料。
2. **為什麼存在？** React 或第三方 library 為什麼需要提供這個抽象。
3. **解決什麼問題？** 如果沒有它，產品程式通常會出現什麼困難。
4. **怎麼用？** 最小可辨識語法與必要邊界。
5. **用了有什麼差別？** 用 Before → After 看它改善了哪個責任邊界。

:::warning 版本與「常用」的範圍

本專案目前使用 React 18。標示 **React 19+** 或 **React 19.2+** 的 API 不能直接放進現有 live component。

React 內建 API 有明確清單；第三方套件則不存在有限的「全部 Hooks」。這篇的「常用」範圍是：React 現代內建 Hooks 全覽，加上這套 Binance 面試筆記已採用的 TanStack Query、React Redux、Zustand、React Router 與 React Hook Form 高頻 Hooks。實際工作仍要以專案安裝版本的官方文件為準。

:::

## Hook 本身為什麼存在？

Function component 每次 render 都會重新執行。普通區域變數不會替 component 保存跨 render 的狀態，也不會通知 React 更新畫面；訂閱、DOM、網路與快取又各有自己的生命週期。

Hook 提供的是「讓 component 接入某種 React 或 library 能力的固定入口」：

```text
需要記住並顯示資料        → state Hook
需要同步 React 外部系統   → effect / subscription Hook
需要操作 DOM 或保存不可見值 → ref Hook
需要降低昂貴 render 成本  → performance / concurrent Hook
需要管理 server cache     → TanStack Query Hook
需要讀寫 global store     → Redux / Zustand Hook
需要讓 URL 成為狀態       → React Router Hook
需要管理大型表單          → React Hook Form Hook
```

Custom Hook 的價值也不是「少寫幾行」，而是把一組有狀態、effect、subscription 或第三方 Hook 的流程封裝成可重用的業務能力。兩個 component 呼叫同一個 custom Hook，預設會建立兩份獨立狀態，不會自動共享資料。

## 選 Hook 前先走這個判斷順序

1. **能從 props / state 在 render 直接算出來嗎？** 能就直接計算，通常不需要新 Hook state 或 Effect。
2. **這是使用者事件嗎？** 提交、點擊、下載等明確事件優先放 event handler，不要繞進 Effect。
3. **資料需要跨 render 保存，而且改變時要更新畫面嗎？** 用 `useState` 或 `useReducer`。
4. **資料需要跨 render 保存，但改變時不該 render 嗎？** 用 `useRef`。
5. **需要與 React 外部系統維持同步嗎？** 用 Effect 或正式 subscription Hook。
6. **資料的 owner 其實是 server cache、URL、global store 或 form store 嗎？** 使用對應 library Hook，不要複製成另一份 local state。
7. **只是懷疑效能不好嗎？** 先量測，再決定 `useMemo`、`useCallback`、Transition 或 virtualization。

---

## 一、React state 與資料傳遞 Hooks

### `useState`

- **在做什麼：**保存會影響畫面的 component local state，setter 排入下一次 render。
- **為什麼存在：**普通變數會在每次 function render 重新建立，改普通變數也不會通知 React。
- **解決什麼問題：**輸入值、開關、選取項目等 UI 記憶如何跨 render 保存並更新畫面。
- **怎麼用：**`const [value, setValue] = useState(initialValue)`；下一個值依賴上一個值時用 `setValue(previous => next)`。
- **不要拿來：**保存能從其他 props / state 直接推導的重複資料。

### `useReducer`

- **在做什麼：**把 state transition 集中到 `reducer(state, action)`。
- **為什麼存在：**多個相關欄位若散落在許多 setter，事件與合法轉移會越來越難追蹤。
- **解決什麼問題：**複雜表單、連線狀態機、訂單流程如何用明確事件產生一致的下一狀態。
- **怎麼用：**`const [state, dispatch] = useReducer(reducer, initialState)`，再呼叫 `dispatch({ type: "submit" })`。
- **不要拿來：**只有一個簡單 boolean 或 input 時，`useState` 通常更直接。

### `useContext`

- **在做什麼：**讀取並訂閱 component tree 上方最近的 Context value。
- **為什麼存在：**theme、locale、登入資訊等 tree-scoped dependency 不適合層層 prop drilling。
- **解決什麼問題：**深層 component 如何取得共同依賴，並在 Provider value 改變時更新。
- **怎麼用：**先建立 `const ThemeContext = createContext(defaultValue)`，上層提供 value，子層用 `const theme = useContext(ThemeContext)`。
- **不要拿來：**把所有高頻資料塞進一個巨大 Context；consumer 會隨 value identity 改變而更新。

### 最小組合範例

```tsx
function QuantityInput() {
  const [quantity, setQuantity] = useState(1);
  const notional = quantity * 65000; // 可推導，直接在 render 計算

  return (
    <button onClick={() => setQuantity(previous => previous + 1)}>
      {quantity} BTC / ${notional}
    </button>
  );
}
```

### Before → After：state 與資料傳遞

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useState` | `let open = false; open = true`，普通變數改了但 React 不會 render | `const [open, setOpen] = useState(false)`，事件呼叫 `setOpen(true)` | 值能跨 render 保存，更新也正式進入 React 流程 |
| `useReducer` | `setStatus`、`setError`、`setOrder` 散落在每個 handler，可能形成矛盾組合 | `dispatch({ type: "submit_succeeded", order })`，由 reducer 一次產生完整 state | 事件與合法狀態轉移集中、可測試 |
| `useContext` | `theme` 從 App 經過不使用它的 Layout、Panel 一路傳到 Button | Button 直接 `const theme = useContext(ThemeContext)` | 移除無意義 prop drilling，同時訂閱最近 Provider |

---

## 二、React ref、DOM 與 identity Hooks

### `useRef`

- **在做什麼：**保存跨 render 穩定的 mutable container，或取得 DOM node。
- **為什麼存在：**timer ID、WebSocket instance、前一次值與 DOM reference 需要保存，但修改它們不應直接 render。
- **解決什麼問題：**component 如何記住「畫面不需要顯示」的值，以及如何操作 browser DOM。
- **怎麼用：**`const inputRef = useRef(null)`，DOM 用 `<input ref={inputRef} />`，其他值讀寫 `ref.current`。
- **不要拿來：**把應該顯示在 UI 的資料藏進 ref，否則畫面不會跟著更新。

### `useImperativeHandle`

- **在做什麼：**限制 parent 經由 ref 能操作的 imperative API。
- **為什麼存在：**可重用 component 有時要允許 focus、scroll、reset，但不應暴露整個內部 DOM。
- **解決什麼問題：**parent 與 child 的命令式整合如何維持小而穩定的介面。
- **怎麼用：**`useImperativeHandle(ref, () => ({ focus, reset }), [])`；React 18 通常搭配 `forwardRef`，React 19 可使用 ref prop。
- **不要拿來：**一般資料傳遞仍應使用 props；這是 escape hatch。

### `useId`

- **在做什麼：**產生 server/client 一致的 component instance ID。
- **為什麼存在：**SSR hydration 期間若 client 與 server 自行產生不同亂數 ID，無障礙關聯會不一致。
- **解決什麼問題：**`label` / `input`、hint、error description 等 accessibility attribute 如何安全配對。
- **怎麼用：**`const id = useId()`，再使用 `<label htmlFor={id}>` 與 `<input id={id} />`。
- **不要拿來：**list key；key 應來自資料本身的穩定 identity。

### Before → After：ref、DOM 與 identity

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useRef` | 用 module 變數保存 timer，所有 component instance 會共用同一份 | `const timerRef = useRef(null)`，每個 instance 使用自己的 `timerRef.current` | 保存非畫面資料而不觸發 render，也不會跨 instance 汙染 |
| `useImperativeHandle` | Parent 用 `childRef.current.querySelector("input")` 依賴 child DOM 結構 | Child 暴露 `useImperativeHandle(ref, () => ({ focus }))` | Parent 只依賴語意化命令，內部 DOM 可自由重構 |
| `useId` | render 中用 `Math.random()` 建 input ID，SSR 與 client 可能不同 | `const id = useId()`，同時交給 `htmlFor` 與 `id` | hydration-safe 的 accessibility 關聯 |

---

## 三、React Effect Hooks

### `useEffect`

- **在做什麼：**在 commit 後讓 component 與外部系統同步，並提供 cleanup。
- **為什麼存在：**render 必須保持 pure，但 WebSocket、timer、DOM event、第三方 widget 有 setup / update / teardown 生命週期。
- **解決什麼問題：**外部資源如何跟著 component mount、dependency 改變與 unmount 正確建立、更新、清除。
- **怎麼用：**`useEffect(() => { const resource = connect(id); return () => resource.close(); }, [id])`。
- **不要拿來：**計算 derived data、處理明確 click/submit 事件，或用一份 state 同步另一份 state。

### `useLayoutEffect`

- **在做什麼：**DOM commit 後、browser paint 前同步執行 effect。
- **為什麼存在：**tooltip 定位、selection 或 scroll 有時必須先量測 DOM，再在使用者看到前修正。
- **解決什麼問題：**避免先畫錯位置、下一幀才跳到正確位置的 layout flicker。
- **怎麼用：**`useLayoutEffect(() => { setRect(ref.current.getBoundingClientRect()); }, [anchor])`。
- **不要拿來：**一般 request 或不需要阻擋 paint 的工作；它會延後畫面繪製。

### `useInsertionEffect`

- **在做什麼：**在 layout effects 前插入動態 CSS rule。
- **為什麼存在：**CSS-in-JS library 要確保 layout measurement 發生前樣式已存在，又不能在可能被放棄的 render 中修改 stylesheet。
- **解決什麼問題：**concurrent rendering 下動態 CSS 插入與 layout measurement 的時序一致性。
- **怎麼用：**library 內使用 `useInsertionEffect(() => insertRule(rule), [rule])`。
- **不要拿來：**一般 app side effect、DOM measurement 或 state update；它主要是 library hook。

### `useEffectEvent`（React 19.2+）

- **在做什麼：**建立只由 Effect 觸發、能讀最新 props/state 的 non-reactive callback。
- **為什麼存在：**Effect setup 可能只依賴 `roomId`，但 subscription callback 又要讀最新 theme；把兩者都列 dependency 會造成無意義重連。
- **解決什麼問題：**分離「決定 Effect 是否重建的 reactive dependency」與「Effect 事件發生時才讀取的最新資料」。
- **怎麼用：**`const onConnected = useEffectEvent(() => notify(theme))`，再從 `useEffect` 建立的 callback 呼叫它。
- **不要拿來：**一般 `onClick`、傳給 child，或刻意隱藏真正應使 Effect 重跑的 dependency。

延伸：[`useEffectEvent` 行情連線實際案例](/docs/frontend-interview/binance/practical-cases/use-effect-event)

```tsx
function Ticker({ symbol }) {
  useEffect(() => {
    const socket = connectTicker(symbol);
    return () => socket.close();
  }, [symbol]);
}
```

這裡 Effect 存在的理由是管理 socket lifecycle；如果只是由 `orders` 算總額，就不需要 Effect。

### Before → After：Effect

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useEffect` | 在 render 直接 `connectTicker(symbol)`，每次 render 都建立連線且無 cleanup | `useEffect(() => { const socket = connectTicker(symbol); return () => socket.close(); }, [symbol])` | 外部資源跟著 dependency 與 unmount 正確建立、清除 |
| `useLayoutEffect` | 用 `useEffect` 量 tooltip，browser 先畫錯位置再修正 | `useLayoutEffect(() => measureAndPlace(), [anchor])` | 在 paint 前量測與修正，避免可見 flicker |
| `useInsertionEffect` | CSS-in-JS library 在 render 修改 stylesheet，render 被放棄也留下規則 | `useInsertionEffect(() => insertRule(rule), [rule])` | stylesheet mutation 與 commit 對齊，且早於 layout measurement |
| `useEffectEvent` | Effect 同時依賴 `roomId`、`theme`，換 theme 也讓 socket 重連 | Effect 只依賴 `roomId`，通知 callback 用 Effect Event 讀最新 theme | reactive setup 與 non-reactive event logic 分離 |

---

## 四、React performance 與 concurrent UI Hooks

### `useMemo`

- **在做什麼：**在 dependencies 未改變時重用上一次 calculation result。
- **為什麼存在：**昂貴 render-time calculation 或需要穩定 identity 的 derived object 可能造成不必要成本。
- **解決什麼問題：**相同輸入重複排序、過濾、聚合，或新 object reference 破壞 memoized child 的跳過條件。
- **怎麼用：**`const visible = useMemo(() => filterOrders(orders), [orders])`。
- **不要拿來：**保證 correctness 或包住所有簡單計算；memoization 本身也有成本。

### `useCallback`

- **在做什麼：**在 dependencies 未改變時重用同一個 function reference。
- **為什麼存在：**memoized child、Effect 或 subscription API 有時把 callback identity 當成更新邊界。
- **解決什麼問題：**parent 每次 render 建立新 function，導致 identity-sensitive consumer 重做工作。
- **怎麼用：**`const handleSelect = useCallback(id => setSelectedId(id), [])`。
- **不要拿來：**普通 DOM `onClick` 預設不需要；它不會阻止 function 內部工作執行。

### `useTransition`

- **在做什麼：**把一批 state update 標記成 non-blocking，並回傳 pending 狀態。
- **為什麼存在：**搜尋輸入等 urgent interaction 不應等待大型列表 render 完成。
- **解決什麼問題：**昂貴畫面更新如何被中斷或延後，讓輸入、點擊保持 responsive。
- **怎麼用：**`const [isPending, startTransition] = useTransition()`，再用 `startTransition(() => setQuery(next))`。
- **不要拿來：**受控 input 的 value、debounce、API cancellation 或搬移同步 CPU 工作到背景 thread。

### `useDeferredValue`

- **在做什麼：**提供一份可以暫時落後於最新 value 的 deferred copy。
- **為什麼存在：**有時 producer 必須立即更新，但昂貴 consumer 可以晚一點追上。
- **解決什麼問題：**不能控制 setter 的 component 如何延後非關鍵結果區 render。
- **怎麼用：**`const deferredQuery = useDeferredValue(query)`，昂貴列表使用 deferred value。
- **不要拿來：**固定時間 debounce 或減少 network request；它控制 render priority，不控制時間與請求次數。

### `useTransition` 和 `useDeferredValue` 怎麼選？

```text
你能控制造成更新的 setter → useTransition 包住那次 update
你只拿到一個已更新的 value → useDeferredValue 延後 consumer
```

### Before → After：performance 與 concurrent UI

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useMemo` | theme 每次改變都重新執行昂貴的 `sortOrderBook(levels)` | `const sorted = useMemo(() => sortOrderBook(levels), [levels])` | `levels` 沒變時重用計算結果；是否值得仍要量測 |
| `useCallback` | Parent 每次 render 都給 memo child 新的 `onSelect` reference | `const onSelect = useCallback(id => setSelectedId(id), [])` | identity-sensitive child 在其他 props 未變時可跳過 render |
| `useTransition` | `setInput(next)` 與大型列表的 `setQuery(next)` 都是 urgent，輸入容易卡 | input 正常更新，`startTransition(() => setQuery(next))` | 讓 React 優先處理輸入並可中斷過時列表 render |
| `useDeferredValue` | 搜尋頁只能把最新 `query` 立刻傳入昂貴列表 | `const deferredQuery = useDeferredValue(query)`，列表使用 deferred value | producer 保持即時，非關鍵 consumer 可以稍後追上 |

---

## 五、React external store 與開發工具 Hooks

### `useSyncExternalStore`

- **在做什麼：**用正式 contract 訂閱 React 外部 mutable store 並讀取一致 snapshot。
- **為什麼存在：**直接呼叫 `store.getState()` 不會讓 React 知道何時更新，concurrent render 也可能讀到撕裂資料。
- **解決什麼問題：**瀏覽器 API、WebSocket store、第三方 state library 如何安全接入 React render 與 SSR hydration。
- **怎麼用：**`const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)`。
- **不要拿來：**普通 React local state；`getSnapshot` 在資料沒變時必須回傳相同 reference。

### `useDebugValue`

- **在做什麼：**替 custom Hook 在 React DevTools 顯示可讀標籤。
- **為什麼存在：**複雜 custom Hook 的內部數值不一定能直接表達目前狀態。
- **解決什麼問題：**開發者如何快速看出 `useTickerSocket` 是 connecting、live 還是 stale。
- **怎麼用：**在 custom Hook 內呼叫 `useDebugValue(status, formatStatus)`。
- **不要拿來：**顯示產品 UI 或執行必要邏輯；app 不應依賴 DevTools 是否打開。

### Before → After：external store 與 DevTools

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useSyncExternalStore` | render 直接讀 `marketStore.getSnapshot()`，store 改變不會通知 React | `useSyncExternalStore(marketStore.subscribe, marketStore.getSnapshot)` | 建立正式 subscription，React 能取得一致 snapshot 並更新 UI |
| `useDebugValue` | DevTools 只看到 custom Hook 內部的多個 boolean，難判斷連線狀態 | `useDebugValue(status, value => "Ticker: " + value)` | custom Hook 在開發工具中直接顯示有語意的狀態 |

---

## 六、React 19 Action、optimistic 與 resource APIs

### `useActionState`（React 19+）

- **在做什麼：**執行可含副作用的 Action，以回傳值更新 state，並提供 `isPending`。
- **為什麼存在：**表單提交常同時需要 previous result、async action、validation result 與 pending，手動拆成多份 state 容易失去同一條生命週期。
- **解決什麼問題：**Action 的執行結果如何直接成為 UI state；同一 Hook 的多次 dispatch 會依序排隊。
- **怎麼用：**`const [state, submitAction, isPending] = useActionState(action, initialState)`，通常交給 `<form action={submitAction}>`。
- **不要拿來：**取代 server cache、retry、request cancellation 或後端 idempotency。

### `useOptimistic`（React 19+）

- **在做什麼：**Action pending 時先投影使用者預期看到的暫時狀態。
- **為什麼存在：**若每次送出訊息、按讚、加入購物車都等待 server round trip，UI 會顯得遲鈍。
- **解決什麼問題：**如何立即回饋操作，成功後與 canonical state 對齊，失敗後回到確認資料。
- **怎麼用：**`const [optimisticItems, addOptimistic] = useOptimistic(items, updateFn)`，在 Action 中先 dispatch optimistic payload。
- **不要拿來：**高風險且不可安全 rollback 的操作，或當成第二份永久 source of truth。

延伸：[`useOptimistic` 交易下單實際案例](/docs/frontend-interview/binance/practical-cases/use-optimistic)

### `use`（React 19+，名稱不是 `useXxx`）

- **在做什麼：**在 render 中讀取 Promise 或 Context resource；Promise pending 時整合 Suspense。
- **為什麼存在：**component 需要在宣告 UI 時讀取非同步 resource，而不是把 loading 流程全拆成 Effect 與 local state。
- **解決什麼問題：**Promise 如何在適當 Suspense boundary 暫停 subtree，resolve 後再繼續 render。
- **怎麼用：**`const data = use(dataPromise)` 或 `const theme = use(ThemeContext)`；Promise 必須穩定或由 framework/cache 提供。
- **特別規則：**可以在條件式與迴圈中呼叫，但仍只能在 component 或 Hook 內；不要在 client render 每次建立新 Promise。

### `useFormStatus`（React DOM，React 19+）

- **在做什麼：**讀取 parent form 最近一次提交的 `pending`、`data`、`method`、`action`。
- **為什麼存在：**SubmitButton 這類深層 child 不應為了 form pending 再拉一套 prop drilling 或 Context。
- **解決什麼問題：**form 內的按鈕、提示區如何知道目前是否正在提交與正在送什麼資料。
- **怎麼用：**`import { useFormStatus } from "react-dom"`，在 `<form>` 內部的 child component 呼叫 `const { pending } = useFormStatus()`。
- **常見陷阱：**它讀 parent form，不會追蹤「呼叫 Hook 的同一個 component 才 render 出來」的 form。

### Before → After：React 19 Action 與 resource

| Hook / API | 原本寫法／問題 | 使用後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useActionState` | 手動維護 `isPending`、`error`、`result`，每條 return path 都要同步多個 setter | `const [state, action, isPending] = useActionState(submit, initialState)` | Action 回傳值就是下一份 state，pending 與 queue 由 React 串起來 |
| `useOptimistic` | `await sendMessage()` 完成後訊息才出現在列表 | Action 中先 `addOptimistic(draft)`，server 確認後更新 canonical list | 使用者立刻收到回饋，失敗時能回到確認資料 |
| `use` | Client component 用 Effect、loading state、error state 解開一個外部 Promise | `const message = use(messagePromise)`，外層放 Suspense / Error Boundary | 非同步讀取進入 render boundary，不必在 component 複製 lifecycle state |
| `useFormStatus` | Form 把 `pending` 從 parent 逐層傳給深層 SubmitButton | SubmitButton 在 form 內直接 `const { pending } = useFormStatus()` | 移除提交狀態 prop drilling，狀態 owner 仍是 parent form |

延伸：[React 19 Hooks 六題實戰](/docs/frontend-interview/binance/react-19-hooks-drills) · [`useActionState` 實際案例](./practical-cases/use-action-state.md)

---

## 七、TanStack Query：server state Hooks

這組 Hook 存在的共同理由是：server state 有 cache identity、fresh/stale、retry、deduplication、background refetch 與 invalidation，不只是「fetch 完放進 `useState`」。

| Hook | 在做什麼 | 為什麼存在 | 解決什麼問題 | 怎麼用 |
| --- | --- | --- | --- | --- |
| `useQuery` | 依 `queryKey` 讀取、快取並訂閱 server data | 多個 component 不應各自重做 loading/error/cache | server read、dedupe、freshness、background refetch | `useQuery({ queryKey: ["orders", symbol], queryFn: fetchOrders })` |
| `useMutation` | 執行 create/update/delete 類 server write | write 不是一份長期 subscription，但需要 lifecycle | pending、error、success、retry 與 mutation observation | `useMutation({ mutationFn: submitOrder, onSuccess })` |
| `useQueryClient` | 取得目前 Provider 的 cache client | mutation 成功後需要協調既有 queries | invalidate、prefetch、cancel、讀寫 cache | `const client = useQueryClient(); client.invalidateQueries({ queryKey: ["orders"] })` |
| `useInfiniteQuery` | 管理有 pageParam 的分頁或 cursor query | 無限列表需要保存 pages 與 next cursor | load more、cursor、分頁 cache 與重取 | `useInfiniteQuery({ queryKey, queryFn, initialPageParam, getNextPageParam })` |
| `useQueries` | 動態並行訂閱多個 queries | Hook 不能在迴圈中呼叫，query 數量卻可能動態改變 | watchlist 多商品平行讀取 | `useQueries({ queries: symbols.map(makeQueryOptions) })` |
| `useSuspenseQuery` | 讓 query loading/error 交給 Suspense 與 Error Boundary | 有些 UI 希望把非同步 boundary 集中在 component 外 | declarative loading boundary，成功 render 時 data 已存在 | `useSuspenseQuery({ queryKey, queryFn })` |
| `useIsFetching` | 計算符合 filter 的 active query 數量 | 全域 loading indicator 不應訂閱每個 query object | 頁面或頂部 network activity 狀態 | `const count = useIsFetching({ queryKey: ["orders"] })` |
| `useIsMutating` | 計算符合 filter 的 pending mutation 數量 | 跨 component 操作可能需要共同 pending 提示 | 全域 save/submission activity | `const count = useIsMutating({ mutationKey: ["submitOrder"] })` |

### `useQuery` 與 `useMutation` 最小用法

```tsx
const ordersQuery = useQuery({
  queryKey: ["orders", symbol],
  queryFn: () => fetchOrders(symbol),
});

const queryClient = useQueryClient();
const submitMutation = useMutation({
  mutationFn: submitOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["orders", symbol] });
  },
});
```

### Before → After：TanStack Query

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useQuery` | 每個 component 都用 Effect + `isLoading` + `error` + `data` 呼叫同一支 API | `useQuery({ queryKey: ["orders", symbol], queryFn })` | 相同 key 共用 cache、request lifecycle 與 background refetch |
| `useMutation` | 每個 submit handler 手動切 loading、catch error、處理 success | `useMutation({ mutationFn: submitOrder, onSuccess })` | Server write lifecycle 集中，UI 讀 mutation status |
| `useQueryClient` | 下單成功後整頁 reload，或到處手動通知訂單列表重抓 | `queryClient.invalidateQueries({ queryKey: ["orders"] })` | 透過 cache identity 協調所有相關 observer |
| `useInfiniteQuery` | 自己維護 `pages`、`cursor`、`hasNext`，refetch 時容易把頁面合錯 | `useInfiniteQuery({ queryFn, initialPageParam, getNextPageParam })` | pages 與 pageParam lifecycle 由 query cache 管理 |
| `useQueries` | 在 `symbols.map(symbol => useQuery(...))` 動態呼叫 Hook，違反固定順序 | `useQueries({ queries: symbols.map(makeOptions) })` | 合法訂閱動態數量的 queries |
| `useSuspenseQuery` | 每個資料 component 都重複寫 loading/error early return | `useSuspenseQuery(options)`，外層統一 Suspense 與 Error Boundary | loading/error boundary 與成功 UI 分離 |
| `useIsFetching` | 把每個 query 的 `isFetching` 一路傳到頂部 network bar | `const active = useIsFetching({ queryKey: ["orders"] })` | 直接觀察符合條件的全域 read activity |
| `useIsMutating` | 每個儲存按鈕各自通知全域「正在儲存」狀態 | `const active = useIsMutating({ mutationKey: ["save"] })` | 不複製 mutation state 就能顯示跨 component activity |

延伸：[第三方 Server / Global State Hooks 六題實戰](/docs/frontend-interview/binance/third-party-server-global-hooks-drills)

---

## 八、React Redux 與 Zustand：global client state Hooks

### React Redux

| Hook | 在做什麼 | 為什麼存在 | 解決什麼問題 | 怎麼用 |
| --- | --- | --- | --- | --- |
| `useSelector` | 訂閱 Redux store 的 selector result | component 不應訂閱整個 store 或手動 unsubscribe | 只在選取結果改變時 render | `const symbol = useSelector(state => state.trade.symbol)` |
| `useDispatch` | 取得 store 的 dispatch function | component 需要送出 domain action，但不應直接改 store | 以 action 驅動 reducer/middleware 流程 | `const dispatch = useDispatch(); dispatch(orderSubmitted(payload))` |
| `useStore` | 直接取得 Redux store instance | 少數整合層需要 replaceReducer 或 imperative access | library integration 與特殊 store 操作 | `const store = useStore()`；一般讀資料仍優先 `useSelector` |

Redux 專案通常再建立 typed wrappers，例如 `useAppSelector`、`useAppDispatch`，讓每個 component 不必重複標註 `RootState` 與 `AppDispatch`。

### Zustand

| Hook | 在做什麼 | 為什麼存在 | 解決什麼問題 | 怎麼用 |
| --- | --- | --- | --- | --- |
| bound store Hook | 同時持有 store API 並以 selector 訂閱資料 | 小型 global state 不一定需要 action/reducer ceremony | 用簡單 selector 共享 client state | `const symbol = useTradeStore(state => state.symbol)` |
| `useStore` | 將 vanilla Zustand store 接到 React | 動態或 scoped store 不一定是 module singleton | Provider/scoped/dynamic store subscription | `const value = useStore(store, state => state.value)` |
| `useShallow` | 對 selector 的 object/array result 做 shallow memo | selector 每次回傳新 object 會造成無意義 render | 多欄位選取時穩定結果 identity | `useTradeStore(useShallow(state => ({ a: state.a, b: state.b })))` |

### Before → After：Redux 與 Zustand

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| Redux `useSelector` | `store.getState().trade.symbol` 只能讀當下值，之後改變不會自動 render | `useSelector(state => state.trade.symbol)` | component 正式訂閱選取結果，而不是整個 store |
| Redux `useDispatch` | component 直接 import singleton store 再 `store.dispatch(...)`，難以替換 Provider/store | `const dispatch = useDispatch()` | dispatch 從目前 Provider 取得，component 不綁死 module singleton |
| Redux `useStore` | 特殊 library integration 無法取得 Provider 實際使用的 store instance | `const store = useStore()` | 在必要的 escape hatch 取得正確 store；一般資料仍用 selector |
| Zustand bound Hook | 自己建立 Context + reducer + action wrappers 只為共享小型 UI state | `const symbol = useTradeStore(state => state.symbol)` | 以 selector 直接訂閱小型 global client state |
| Zustand `useStore` | 所有 widget 被迫共用 module singleton，無法每個 panel 建獨立 store | `useStore(panelStore, state => state.zoom)` | vanilla store 可由 Context/scoped owner 注入 |
| Zustand `useShallow` | selector 每次回傳 `{ symbol, price }` 新 object，任一 store action 都可能 render | `useTradeStore(useShallow(state => ({ symbol: state.symbol, price: state.price })))` | 物件內選取值未改時重用結果邊界 |

不要因為 global store 方便，就把 input draft、單一 modal 開關等 local UI state 全部提升。先決定 owner，再選工具。

---

## 九、React Router：讓 URL 與 navigation 成為 state

Router Hooks 存在的共同理由是：path、query string、history 與 navigation lifecycle 本來就在 router store；複製到 local state 會產生兩份真相。

| Hook | 在做什麼 | 為什麼存在 | 解決什麼問題 | 怎麼用 |
| --- | --- | --- | --- | --- |
| `useNavigate` | 回傳 programmatic navigation function | 某些 navigation 由登入成功、取消或 command 觸發 | event 後 push/replace/history delta | `const navigate = useNavigate(); navigate("/orders", { replace: true })` |
| `useParams` | 讀取 matched route 的 dynamic params | entity identity 常直接編碼在 path | `/trade/:symbol` 如何取得 symbol | `const { symbol } = useParams()`，使用前處理可能的 `undefined` |
| `useSearchParams` | 讀寫 URL query string | filter、tab、sort 要可分享、重新整理與瀏覽器返回 | URL 與畫面 filter 保持同一份 source of truth | `const [params, setParams] = useSearchParams(); setParams({ tab: "open" })` |
| `useLocation` | 讀取目前 pathname、search、hash、state、key | component 需要知道完整 location 或對 navigation 做反應 | analytics、modal background、route-specific UI | `const location = useLocation()` |
| `useMatch` | 判斷目前 URL 是否符合指定 pattern | navigation item 或 layout 需要知道 active 狀態 | 自訂 active UI 與 path params match | `const match = useMatch("/orders/:id")` |
| `useNavigation` | 讀取 Data Router 的 idle/submitting/loading 狀態 | route loader/action navigation 有跨頁 pending lifecycle | 全域 navigation spinner 與提交進度 | `const navigation = useNavigation()` |
| `useFetcher` | 不切換頁面也能呼叫 route loader/action | inline update、autocomplete 不應造成 navigation | router-managed non-navigation request lifecycle | `const fetcher = useFetcher(); fetcher.submit(data, options)` |
| `useLoaderData` | 讀取 matched route loader 的結果 | route data 應在 render 前由 router 載入與協調 | route-level data dependency、SSR 與 navigation revalidation | `const data = useLoaderData()` |
| `useActionData` | 讀取最近一次 route action 的回傳值 | 表單提交結果與 validation error 屬於 route action | route form 的 success/error result | `const actionData = useActionData()` |

### Before → After：React Router

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useNavigate` | `window.location.href = "/orders"` 觸發整頁 reload | `navigate("/orders")` | 使用 router navigation，保留 SPA lifecycle 與 history 語意 |
| `useParams` | 手動 `location.pathname.split("/")` 猜 symbol 所在位置 | `const { symbol } = useParams()` | 參數直接來自 matched route contract |
| `useSearchParams` | filter 只放 `useState`，重整、分享連結、Back 後全部遺失 | `setSearchParams({ status: "open" })` | URL 成為可分享、可恢復的 filter source of truth |
| `useLocation` | 直接讀 `window.location`，React 不知道 navigation 後要更新 | `const location = useLocation()` | location 改變時 component 會收到新的 router state |
| `useMatch` | `pathname.startsWith("/orders")` 對 dynamic segment、尾斜線容易判錯 | `useMatch("/orders/:id")` | 使用與 router 相同的 pattern matcher |
| `useNavigation` | 自建 global boolean，loader A 完成時可能誤關掉 loader B 的 loading | `const navigation = useNavigation()` | pending 直接來自 Data Router navigation lifecycle |
| `useFetcher` | Inline favorite button 自己 fetch、取消、pending，完成後還要手動同步 route data | `const fetcher = useFetcher(); fetcher.submit(...)` | 不 navigation 也能使用 router action 與 revalidation |
| `useLoaderData` | Route component mount 後才用 Effect fetch，先 render 空頁再載入 | Route loader 先準備資料，component 用 `useLoaderData()` | 資料 dependency 提升到 route boundary，利於 SSR 與 navigation |
| `useActionData` | Route form 自建 local error state，navigation/remount 後 ownership 模糊 | Action return validation result，component 用 `useActionData()` | 提交結果由 route action lifecycle 管理 |

如果使用 Declarative Router，重點通常是前五個；使用 Data / Framework Router，再優先掌握 `useNavigation`、`useFetcher`、`useLoaderData`、`useActionData`。

延伸：[第三方 Router / Form Hooks 六題實戰](/docs/frontend-interview/binance/third-party-router-form-hooks-drills)

---

## 十、React Hook Form：大型表單 Hooks

這組 Hook 存在的共同理由是：大型表單需要欄位註冊、驗證、dirty/touched/error、動態陣列與局部 subscription；全部用 controlled `useState` 手刻，容易造成大量 boilerplate 與廣泛 render。

| Hook | 在做什麼 | 為什麼存在 | 解決什麼問題 | 怎麼用 |
| --- | --- | --- | --- | --- |
| `useForm` | 建立 form control、欄位註冊、驗證與提交入口 | 表單需要一個統一 owner 管理 values 與 form state | register、validation、errors、reset、submit | `const { register, handleSubmit, control, formState } = useForm({ defaultValues })` |
| `useController` | 將單一 controlled widget 接入 RHF control | select、date picker 等第三方元件不能只用 native register | value/onChange/ref/error ownership bridge | `const { field, fieldState } = useController({ name, control })` |
| `useFormContext` | 從最近的 `FormProvider` 取得 form methods | 深層欄位不應逐層傳遞 register/control/errors | 大型巢狀表單的 dependency access | `const { register } = useFormContext()` |
| `useWatch` | 訂閱指定欄位值並限制 render 範圍 | 整個 form 因一個欄位變更而 render 成本太高 | conditional field、即時預覽、欄位依賴 | `const price = useWatch({ control, name: "price" })` |
| `useFieldArray` | 管理動態欄位列與穩定 field identity | append/remove/reorder 若用 index key 會使欄位狀態錯位 | 動態 recipients、order legs、rules editor | `const { fields, append, remove, move } = useFieldArray({ control, name: "legs" })` |
| `useFormState` | 訂閱指定範圍的 errors、dirty、valid 等 form state | deep child 只需要一小部分狀態，不應讓整張表單 render | 局部 error summary、submit section 狀態 | `const { errors, isDirty } = useFormState({ control, name })` |

### Before → After：React Hook Form

| Hook | 原本寫法／問題 | 使用 Hook 後 | 改善了什麼 |
| --- | --- | --- | --- |
| `useForm` | 十個欄位各有 `useState`、`onChange`、touched、error 與 reset 邏輯 | `const form = useForm({ defaultValues })`，input 使用 `register` | 表單值、驗證與提交集中在同一個 form control |
| `useController` | DatePicker 的 value/onChange 與 form store 各維護一份，兩邊可能不同步 | `const { field, fieldState } = useController({ name, control })` | Controlled widget 與 RHF 建立單一 ownership bridge |
| `useFormContext` | `register`、`control`、`errors` 經過五層 component prop drilling | 外層 `FormProvider`，深層欄位呼叫 `useFormContext()` | 深層 form dependency 從正確 Provider 取得 |
| `useWatch` | Parent 呼叫 `watch()` 觀察整張表單，一個 price 字元讓整棵表單 render | 子區塊 `useWatch({ control, name: "price" })` | 把 subscription 和 render 限制在真正的 consumer |
| `useFieldArray` | `useState([])` 加 index key；刪除中間列後 error/focus 跑到別列 | `useFieldArray({ control, name: "legs" })` 並使用 `field.id` | 動態欄位的 identity、註冊與操作一致 |
| `useFormState` | Deep error summary 讀完整 `formState`，任何欄位狀態變化都可能 render | `useFormState({ control, name: ["price", "quantity"] })` | 只訂閱需要的 form state 範圍 |

`useController` 與 `useFormContext` 不是每張表單都需要。原生 input 先用 `register`；真正 controlled 第三方 widget 才用 controller；只有 component tree 很深時才考慮 Context。

---

## 十一、Custom Hook：把技術 API 變成業務能力

### `useSubmitOrder`、`useTickerSocket` 這類 Hook

- **在做什麼：**組合 React 與第三方 Hooks，向 component 暴露有業務語意的資料和操作。
- **為什麼存在：**多個 component 若重複處理相同 query key、cleanup、錯誤映射與 mutation invalidation，規則容易分歧。
- **解決什麼問題：**重用有狀態的流程、集中 product invariant，並讓 UI 不必理解底層 library 細節。
- **怎麼用：**custom Hook function 名稱以 `use` 開頭，在內部呼叫其他 Hooks，再回傳最小 API。

```tsx
function useSubmitOrder(symbol) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", symbol] });
    },
  });
}

function OrderButton({ symbol, draft }) {
  const submitOrderMutation = useSubmitOrder(symbol);

  return (
    <button onClick={() => submitOrderMutation.mutate(draft)}>
      送出訂單
    </button>
  );
}
```

Custom Hook 應封裝「有意義的行為邊界」，不是把每三行程式都包起來。它也不能繞過 Rules of Hooks。

### Before → After：Custom Hook

```tsx
// 原本：每個下單按鈕都重複 mutation、query key 與 invalidation。
function SpotOrderButton() {
  const queryClient = useQueryClient();
  const mutation = useMutation({ /* 重複設定 */ });
}

function FuturesOrderButton() {
  const queryClient = useQueryClient();
  const mutation = useMutation({ /* 又一份容易分歧的設定 */ });
}

// 使用後：component 只依賴有業務語意的 API。
function OrderButton({ symbol, draft }) {
  const submitOrder = useSubmitOrder(symbol);
  return <button onClick={() => submitOrder.mutate(draft)}>送出</button>;
}
```

改善點不是單純少幾行，而是 query identity、錯誤映射、invalidation 與觀測規則只有一個 owner。

---

## 十二、面試時的快速分類表

| 問題類型 | 第一個想到的 Hook | 先排除的誤用 |
| --- | --- | --- |
| 簡單 local UI state | `useState` | derived state |
| 複雜狀態轉移 | `useReducer` | 一個 boolean 就上 reducer |
| 深層 tree dependency | `useContext` | 高頻巨大 global store |
| DOM / 不觸發 render 的值 | `useRef` | 把 UI state 藏進 ref |
| 外部系統 lifecycle | `useEffect` | event logic、derived data |
| paint 前 DOM measurement | `useLayoutEffect` | 一般 request |
| 昂貴 derived calculation | `useMemo` | 沒量測就全面 memo |
| identity-sensitive callback | `useCallback` | 普通 DOM handler |
| non-blocking update | `useTransition` | debounce、Web Worker |
| 延後昂貴 consumer | `useDeferredValue` | 減少 API request |
| 外部 store subscription | `useSyncExternalStore` | 直接讀 mutable object |
| Action result / pending | `useActionState` | server cache manager |
| optimistic feedback | `useOptimistic` | 不可 rollback 的假成功 |
| server read/cache | `useQuery` | Effect + 重複 local cache |
| server write | `useMutation` | 把 mutation 當 query |
| global client state | `useSelector` / Zustand selector | 全部資料全域化 |
| URL state | Router Hooks | URL 與 local state 雙向同步 |
| 大型表單 | `useForm` | 每個欄位都手刻 controlled state |

## 十三、學習順序

不要照 API 字母順序背。建議依問題逐層增加：

```text
第一層：useState → useEffect → useRef → useContext
第二層：useReducer → useMemo → useCallback → useLayoutEffect
第三層：useTransition → useDeferredValue → useSyncExternalStore
第四層：useQuery → useMutation → useQueryClient
第五層：Redux / Zustand → Router → React Hook Form
第六層：useActionState → useOptimistic → use → useFormStatus
最後：useImperativeHandle / useInsertionEffect / useDebugValue 等特殊邊界
```

讀完這篇後，再進入 [React Hooks 六題反射題庫](/docs/frontend-interview/binance/react-hooks-six-drills-index)，用預測輸出、錯誤假設與 production edge case 驗證自己是否真的理解。

## 官方參考

- [React Built-in Hooks](https://react.dev/reference/react/hooks)
- [React `use`](https://react.dev/reference/react/use)
- [React DOM Hooks](https://react.dev/reference/react-dom/hooks)
- [TanStack Query React API](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [Zustand Hooks](https://zustand.docs.pmnd.rs/reference/index.html#hooks)
- [React Router Hooks](https://reactrouter.com/api/hooks/useNavigate)
- [React Hook Form API](https://react-hook-form.com/docs)
