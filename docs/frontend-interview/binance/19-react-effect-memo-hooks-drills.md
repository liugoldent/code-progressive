---
sidebar_position: 22
title: "React Hooks 六題實戰：Effect / Memo"
description: "useEffect、useLayoutEffect、useInsertionEffect、useMemo、useCallback、useDebugValue 各六題，練習同步外部系統、dependency、paint timing 與 memoization。"
tags:
  - React
  - Hooks
  - Effect
  - Performance
keywords: ["useEffect 題目", "useLayoutEffect 題目", "useInsertionEffect 題目", "useMemo 題目", "useCallback 題目", "useDebugValue 題目"]
---

# React Hooks 六題實戰：Effect / Memo

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

這一組最重要的分界是：render 用來計算 JSX；Effect 用來讓 committed UI 與外部系統同步；memoization 只處理效能或 reference identity。

## `useEffect`：同步外部系統

### 1. 這個 derived state Effect 有什麼問題？

```tsx
const [price, setPrice] = useState(10);
const [quantity, setQuantity] = useState(2);
const [total, setTotal] = useState(0);

useEffect(() => {
  setTotal(price * quantity);
}, [price, quantity]);
```

<details>
<summary>答案</summary>

`total` 可在 render 直接算出。Effect 版本先用舊 total render/commit，再 effect setState 造成第二次 render，並建立三份可能不同步的 state。改成 `const total = price * quantity`；昂貴且量測後有需要才考慮 `useMemo`。

</details>

### 2. Cleanup 與下一次 setup 的順序是什麼？

```tsx
useEffect(() => {
  console.log("connect", symbol);
  return () => console.log("disconnect", symbol);
}, [symbol]);
```

BTC 改成 ETH，再 unmount，console 順序是什麼？

<details>
<summary>答案</summary>

Committed BTC 後 setup 印 `connect BTC`；symbol 改變並 commit 後，先執行舊 closure 的 `disconnect BTC`，再執行新 setup 的 `connect ETH`；unmount 時印 `disconnect ETH`。Cleanup 對應建立它的那次 setup。

</details>

### 3. 空 dependency 的 interval 為何永遠讀到 0？

```tsx
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []);
```

<details>
<summary>答案</summary>

Callback 捕捉初次 render 的 `count = 0`。若操作是更新 state，可用 functional updater；若 interval 應隨 count 重建，就把 count 列 dependency；若 subscription 要固定但 callback 讀最新值，在 React 18 可謹慎用 latest ref，React 19 可考慮 `useEffectEvent`。

</details>

### 4. 快速切 symbol，舊 request 為何蓋掉新資料？

```tsx
useEffect(() => {
  fetchTicker(symbol).then(setTicker);
}, [symbol]);
```

<details>
<summary>答案</summary>

Request 完成順序不保證等於啟動順序。BTC 先發但晚回，就可能覆蓋 ETH。Cleanup 應 abort 舊 request，或至少用 ignore/sequence token 只接受目前 identity 的結果；loading/error ownership 也要綁在同一 request identity。

</details>

### 5. Strict Mode 開發環境為何出現 setup → cleanup → setup？

<details>
<summary>答案</summary>

React 在開發環境額外執行一次 setup/cleanup 壓力測試，檢查 effect 是否可逆。正確修法是讓 cleanup 完整撤銷 setup，不是用 ref 擋第二次；用 ref 擋可能讓正式 remount 無法重新連線。

</details>

### 6. Dependency array 應該由誰決定？

<details>
<summary>答案</summary>

不是由「想幾時執行」任意挑選，而由 effect 內讀取的 reactive values 決定。若 dependency 導致不想要的重連，應先拆分 effect、把純計算移出、把固定 object 移到 component 外，或重新設計 callback 邊界；不要關 lint 或隱藏 dependency。

</details>

## `useLayoutEffect`：DOM 已 commit、browser 尚未 paint

### 1. Tooltip 為何先閃在錯的位置？

```tsx
useEffect(() => {
  const rect = ref.current!.getBoundingClientRect();
  setTop(rect.bottom);
}, []);
```

<details>
<summary>答案</summary>

一般 Effect 可能在 browser 已 paint 第一版位置後才量測並 setState，所以使用者看到閃爍。必須量 DOM 並在 paint 前修正時才換 `useLayoutEffect`；它會阻擋 paint，不能全域濫用。

</details>

### 2. `useLayoutEffect` 執行時 DOM 存在嗎？

<details>
<summary>答案</summary>

存在。React 已把 DOM mutation commit，ref 已指向 node，但 browser 尚未 paint。這正是量測 layout 或同步調整 scroll/selection 的窗口。

</details>

### 3. Layout Effect 裡 setState 會怎樣？

<details>
<summary>答案</summary>

React 會立刻處理這次更新，通常在 browser paint 前完成第二次 render/commit，所以可避免錯誤位置被看見；代價是阻擋 paint更久。工作要小而必要，不能放慢 request 或重計算。

</details>

### 4. SSR 時為何常看到 Layout Effect 警告或限制？

<details>
<summary>答案</summary>

Server 沒有 layout、也不執行 effects；依賴 paint 前修正的 component 在 server HTML 中無法呈現最終 layout。應讓初始 HTML 仍可接受、把該區域改成 client-only，或確認其實一般 Effect 已足夠，而不是用「isomorphic layout effect」掩蓋設計問題。

</details>

### 5. 可以用它讓 API 更快嗎？

<details>
<summary>答案</summary>

不行。它不提高優先級或網路速度，只會把 effect 放到 paint 前同步執行，反而更容易卡住畫面。資料取得通常由框架/資料庫層或一般 Effect 管理。

</details>

### 6. 怎麼口述 `useEffect` 與 `useLayoutEffect`？

<details>
<summary>答案</summary>

兩者都在 commit 後同步外部系統；Layout Effect 在 paint 前同步執行並阻擋 paint，適合 DOM measurement/position correction。一般 Effect不應死背成「永遠 paint 後」，但若邏輯必須保證 paint 前完成，就明確用 Layout Effect。

</details>

## `useInsertionEffect`：CSS-in-JS library 的插入時機

### 1. 一般產品 component 該用它量 DOM 嗎？

<details>
<summary>答案</summary>

不該。它主要給 CSS-in-JS library 在 layout effects 讀 layout 前插入動態 style。此時不能依賴 ref 已附加，也不適合一般 DOM measurement；量測用 `useLayoutEffect`。

</details>

### 2. 為何 CSS-in-JS 不只在 render 插 `<style>`？

<details>
<summary>答案</summary>

Render 必須純粹，且 concurrent render 可能被丟棄；render 中修改 DOM 會留下未 commit 的 style。Insertion Effect 把實際插入移到 commit 的專用時機。

</details>

### 3. 可以在 Insertion Effect 裡 setState 嗎？

<details>
<summary>答案</summary>

不應該。這個 Hook 的能力刻意受限，目標是插入 style，不是安排 component 更新。需要 state/effect 的產品邏輯應回到一般 Hook 邊界。

</details>

### 4. Ref 在這個 Hook 中一定可用嗎？

<details>
<summary>答案</summary>

不保證。Insertion Effect 的時間點早於 layout effects，React 可能尚未 attach ref；不要拿它操作 DOM node。

</details>

### 5. 它會在 server render 執行嗎？

<details>
<summary>答案</summary>

不會，Effect 類 Hook 只在 client。CSS-in-JS library 仍需獨立的 SSR style extraction/collection 策略，不能期待 `useInsertionEffect` 產生 server HTML 的 CSS。

</details>

### 6. 面試遇到它，不知道細節怎麼安全回答？

<details>
<summary>答案</summary>

先說它是 library hook、不是 `useEffect` 的「更早更快版」；主要供 CSS-in-JS 在 layout measurement 前插 style，產品 component 很少直接使用。再補上 render purity、不能拿來量 DOM 與 SSR 不執行即可。

</details>

## `useMemo`：快取本次 render 的計算結果

### 1. `useMemo` callback 何時執行？

```tsx
const visible = useMemo(() => filter(items, tab), [items, tab]);
```

<details>
<summary>答案</summary>

在 render 階段。初次 render 會計算；之後 dependencies 以 `Object.is` 比較，有變才重算。它不是 commit 後執行的 effect，所以 callback 必須純粹。

</details>

### 2. 這個 dependency 為何讓 memo 每次失效？

```tsx
const options = { limit: 20 };
const rows = useMemo(() => selectRows(data, options), [data, options]);
```

<details>
<summary>答案</summary>

`options` 每次 render 都是新 object。可把 object 建在 memo callback 裡並依賴 primitive `limit`，或把固定常數移出 component。再包一層 `useMemo` 也能穩定，但先簡化資料依賴更清楚。

</details>

### 3. 可以靠 `useMemo` 保證資料永遠不丟嗎？

<details>
<summary>答案</summary>

不能。它是效能優化，不是 semantic storage；React 可能因開發、suspend 或未來最佳化丟棄 cache。Correctness 需要保存的資料用 state/ref；程式在沒有 memo cache 時也必須正確。

</details>

### 4. 把所有小計算都 memoize 會更快嗎？

<details>
<summary>答案</summary>

不一定。Memo 自己有 dependency 比較、記憶體與認知成本，簡單乘法或短陣列可能更慢。先找真實 re-render 原因並用 Profiler 量測；`useMemo` 不解 mutation、stale data 或錯誤 state owner。

</details>

### 5. Memoized object 對 Context 有什麼用、沒有什麼用？

<details>
<summary>答案</summary>

它能避免 provider 因 unrelated render 建立新 object 而通知 consumer；當 object 內的真實 dependency 改變，value reference 仍應改，consumer 仍會 render。它無法提供 selector 粒度或隔離高頻欄位。

</details>

### 6. Strict Mode 為何可能呼叫 calculation 兩次？

<details>
<summary>答案</summary>

開發環境用額外呼叫找出 impurity，只採用其中一次結果。若 callback mutation props 或有副作用，問題會被放大；正確做法是保持 calculation 純粹，不是偵測環境避開第二次。

</details>

## `useCallback`：快取 function definition

### 1. Callback 會在 render 時執行嗎？

```tsx
const handleBuy = useCallback(() => submit(symbol), [symbol]);
```

<details>
<summary>答案</summary>

不會。React 在 render 時回傳快取的 function reference，function body 等被事件或其他程式呼叫才執行。它大致等同 `useMemo(() => function, deps)`，不是「快取執行結果」。

</details>

### 2. 包了 `useCallback`，child 為何仍 render？

```tsx
const onSelect = useCallback(handleSelect, []);
return <Row onSelect={onSelect} order={{ id, price }} />;
```

<details>
<summary>答案</summary>

`order` 每次都是新 object，而且 child 若沒包 `memo`，parent render 本來就會呼叫 child。要先確認優化邊界：穩定所有影響 `memo` 比較的 props，或更好地傳 primitives；別只 memo 一個 callback 就期待整棵 tree 停止。

</details>

### 3. 空 dependency 為何送出舊 symbol？

```tsx
const handleBuy = useCallback(() => submit(symbol), []);
```

<details>
<summary>答案</summary>

Callback 永遠捕捉初次 render 的 symbol。應依賴 `[submit, symbol]`。若 callback identity 改變造成 effect 重連，要重畫 effect/API 邊界，而不是刪 dependency 製造 stale closure。

</details>

### 4. Setter 的 functional updater 如何減少 dependency？

```tsx
const add = useCallback((order) => {
  setOrders([...orders, order]);
}, [orders]);
```

<details>
<summary>答案</summary>

改成 `setOrders(previous => [...previous, order])` 後 callback 不必讀 `orders`，dependency 可變成 `[]`（若沒有其他 reactive value）。這不是欺騙 lint，而是把「如何由前值更新」交給 React queue。

</details>

### 5. 何時 `useCallback` 有實際價值？

<details>
<summary>答案</summary>

常見於傳給已 memoized 且 render 昂貴的 child、callback 是其他 Hook dependency、或外部 API 真的依 function identity 訂閱/解除。普通 button handler 通常不需包；建立 function 本身很少是瓶頸。

</details>

### 6. React Compiler 專案還要手動 memo 嗎？

<details>
<summary>答案</summary>

要看專案是否啟用 Compiler、編譯覆蓋與實際 profiler。Compiler 可自動 memoize 許多值/function，會降低手動 `useCallback` 的需求；但 subscription identity、明確 API contract 或未被編譯的程式仍需判斷。不要只因「新版 React」就批次刪除。

</details>

## `useDebugValue`：替 custom Hook 標示 DevTools 狀態

### 1. 它會把文字印到 console 嗎？

```tsx
function useOnlineStatus() {
  const online = useSyncExternalStore(subscribe, getSnapshot);
  useDebugValue(online ? "Online" : "Offline");
  return online;
}
```

<details>
<summary>答案</summary>

不會。它只自訂 React DevTools 顯示的 custom Hook label，不改 UI、不回傳資料、也不取代 logging。

</details>

### 2. 應該在每個產品 component 都加嗎？

<details>
<summary>答案</summary>

通常不用。它對被多人重用、內部狀態不易理解的 custom Hook 最有價值；直接看到 `useState` 的小 Hook 再加 label 可能只是噪音。

</details>

### 3. 昂貴格式化怎麼避免平時執行？

```tsx
useDebugValue(date, date => formatVerySlowly(date));
```

<details>
<summary>答案</summary>

傳第二個 formatter function，React DevTools 需要顯示時才呼叫格式化。先在外面算好字串則每次 Hook render 都付成本，即使沒開 DevTools。

</details>

### 4. 它可以條件式呼叫嗎？

<details>
<summary>答案</summary>

不可以，仍是 Hook，必須遵守頂層與固定順序規則。要條件顯示可把條件放進 value/formatter，而不是條件式呼叫 `useDebugValue`。

</details>

### 5. Production correctness 可以依賴它嗎？

<details>
<summary>答案</summary>

不可以。它是開發觀察工具；資料流、錯誤處理與 UI 不該依賴 DevTools 是否存在。Custom Hook 仍要正常 return 真正狀態。

</details>

### 6. 要標原始資料還是業務語意？

<details>
<summary>答案</summary>

優先標能縮短 debug 的語意，例如 `Socket: reconnecting (attempt 2)`，而不是再顯示一整個無法掃讀的 object。敏感資料也不該為了方便直接暴露在 label。

</details>

## 完成檢查

- Effect 的輸入由它讀取的 reactive values 決定，cleanup 要對稱撤銷 setup。
- Layout Effect 是 paint 前的必要 DOM 同步，不是「比較快的 Effect」。
- Insertion Effect 主要服務 CSS-in-JS library。
- `useMemo` 快取值，`useCallback` 快取 function definition；兩者都不修 correctness。
- `useDebugValue` 只改善 custom Hook 在 DevTools 裡的可讀性。

[下一組：Concurrent / External Store Hooks](./20-react-concurrent-external-hooks-drills.md)
