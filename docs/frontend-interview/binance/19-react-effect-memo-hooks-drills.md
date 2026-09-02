---
sidebar_position: 23
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

### 做題前：Effect 的對象必須是 React 外部系統

Render 的責任是根據 props/state 計算 JSX；Effect 則在畫面 commit 後，把這個結果同步到 React 無法直接控制的系統，例如 WebSocket、browser event、timer、第三方 widget 或 network connection。

```tsx
useEffect(setup, dependencies?);
```

| 項目 | 角色 |
| --- | --- |
| `setup` | 建立目前這版 props/state 對應的外部同步 |
| `cleanup` | `setup` 選擇回傳的函式；撤銷同一次 setup 建立的工作 |
| `dependencies` | setup 讀取的所有 reactive values；React 用 `Object.is` 比較 |

```tsx
function Ticker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const connection = tickerClient.subscribe(symbol, setPrice);
    return () => connection.unsubscribe();
  }, [symbol]);

  return <p>{symbol}：{price ?? "連線中"}</p>;
}
```

當 `symbol` 從 BTC 變 ETH，生命週期不是只執行新 setup：

```text
commit BTC → setup(BTC)
commit ETH → cleanup(BTC) → setup(ETH)
unmount   → cleanup(ETH)
```

若沒有外部系統，通常不需要 Effect。`total = price * quantity` 直接在 render 計算；使用者點擊送出就在 event handler 執行；不要先設旗標，再用 Effect 監看旗標完成同一事件。Fetch 放 Effect 時還要自己處理 abort、race、cache 與 server rendering，framework 或 server-state library 往往更完整。

> 一句話記憶：Effect 是 committed UI 與外部系統之間可 setup、可 cleanup、可重新同步的橋。

官方參考：[React `useEffect`](https://react.dev/reference/react/useEffect)、[Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)

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

### `useEffect` 六題詳細補充

1. **Derived state**：Effect 的工作對象應是 React 外部系統；`total` 完全由本次 render 的 `price`、`quantity` 決定，直接算才能保證同一個 snapshot 永遠一致。若計算昂貴，先 profile 再 memoize，仍不需要多一份 state。
2. **Cleanup 時序**：每次 setup 與它自己的 closure 綁定，所以 cleanup 讀到的是舊 `symbol`，這正是它能解除舊連線的原因。Dependency 改變時是「新 UI commit → 舊 cleanup → 新 setup」；unmount 則只剩最後一次 cleanup。
3. **Stale interval**：空 dependency 表示這個 Effect 不會因 `count` 改變而重建，不表示 callback 自動讀最新值。若只需 `setCount(c => c + 1)` 就用 updater；若要記錄最新 count，才選擇把 count 列為 dependency、latest ref 或 React 19 Effect Event，各自代表不同 setup 語意。
4. **Request race**：cleanup 可用 `AbortController` 取消仍支援 abort 的 fetch；若底層不能取消，至少以 `ignore` flag 或 request ID 阻止過期結果 commit。Loading/error 也要檢查同一 identity，否則舊 request 的 finally 仍可能關掉新 request 的 loading。
5. **Strict Mode**：開發環境的額外 setup/cleanup 模擬「mount 後立即離開再回來」，用來暴露沒有解除 listener、重複連線和非冪等寫入。Production 不會因 Strict Mode 固定執行兩次，但使用者真實導航仍會 remount，所以 cleanup 必須本來就正確。
6. **Dependencies**：component 內的 props、state、以及使用它們建立的 function/object 都是 reactive values。若不想讓某個值觸發 Effect，必須證明它不是 setup 的輸入，例如移到 Effect 內建立、移到 module scope，或拆成 Effect Event；不能只刪陣列項目。

## `useLayoutEffect`：DOM 已 commit、browser 尚未 paint

> 實際案例：[useLayoutEffect：交易風險 Tooltip 定位](./practical-cases/use-layout-effect) · [OneCompiler 可操作版本](https://onecompiler.com/react#draft-8xxa)

### 做題前：只有「錯誤畫面不能先被看見」才需要阻擋 paint

Tooltip 初次 render 前不知道自己的實際高度，必須等 DOM commit 後量測，再修正位置。若用一般 Effect，browser 可能先畫出錯誤位置；`useLayoutEffect` 讓量測與同步修正在 repaint 前完成。

```text
render → DOM commit / ref attach → useLayoutEffect → browser paint → useEffect
```

```tsx
function Tooltip({ targetRect }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const nextHeight = ref.current?.getBoundingClientRect().height ?? 0;
    setHeight(nextHeight);
  }, []);

  const top = targetRect.top - height;
  return <div ref={ref} style={{ top }}>風險提示</div>;
}
```

第一次 commit 的 DOM 已存在，ref 也已 attach；layout effect 量到高度後 `setHeight`，React 會在 paint 前完成必要的第二次 render/commit。使用者看不到錯位版，但主執行緒被同步工作阻擋，所以內容必須小且必要。

| 需求 | 選擇 |
| --- | --- |
| 訂閱、network、analytics，不影響首次可見位置 | `useEffect` |
| DOM measurement 後必須在 paint 前修正 | `useLayoutEffect` |
| 可以靠 CSS layout 完成 | 不需要 Effect |

Server 沒有 DOM layout，兩種 Effect 都不在 server render 執行。若 server HTML 必須等 client 量測才合理，還要設計可接受 fallback 或 client-only boundary。

> 一句話記憶：`useLayoutEffect` 是會阻擋 repaint 的 DOM 同步窗口，不是更快、更高級的 `useEffect`。

官方參考：[React `useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect)

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

React 會立刻處理這次更新，通常在 browser paint 前完成第二次 render/commit，所以可避免錯誤位置被看見；代價是阻擋 paint 更久。工作要小而必要，不能放慢 request 或重計算。

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

### `useLayoutEffect` 六題詳細補充

1. **Tooltip 閃爍**：首次 render 還不知道實際高度，可以先 render、在 layout effect 量測、立即 setState，再讓 browser paint 修正後的位置。若錯位不影響體驗，普通 Effect 更不阻塞；若可用 CSS positioning 解決，甚至不需 Effect。
2. **DOM 時序**：commit 先完成 DOM mutation 與 ref attachment，layout effects 才執行，之後才允許 paint。適合 `getBoundingClientRect`、selection、scroll 等必須依 committed DOM 的工作，不適合在 render 讀 node。
3. **同步更新**：layout effect 中的 state update 會讓 React 在 paint 前再 render/commit；使用者看不到中間版，但主執行緒要付兩次工作。要避免無條件 setState 形成循環，也不要在這裡做可延後的大計算。
4. **SSR**：server 沒有 viewport、字型完成狀態或 DOM layout，因此無法預先執行同一套量測。應讓 server fallback 結構可接受、hydration 後再修正；若 component 沒有有意義的 server HTML，才考慮 client-only boundary。
5. **API latency**：網路等待不會因 paint 前執行而縮短，反而會阻塞首屏。資料預取應交給 framework/server-state layer；layout effect 只保留微小、同步且直接影響首次 paint 的 DOM 工作。
6. **面試口述**：不要簡化成「Effect 永遠 paint 後」，因 React 可能依互動時機提早處理。可靠差異是 `useLayoutEffect` **保證**在 browser repaint 前同步完成，會阻塞 paint；只有需要這個保證才使用。

## `useInsertionEffect`：CSS-in-JS library 的插入時機

### 為什麼需要它？（為啥不能用 `useEffect` / `useLayoutEffect`）

主要為了解決 CSS-in-JS 在 React 18 **效能與渲染順序**上的痛點：

- **`useEffect` 太晚了**：它通常會讓瀏覽器先繪製（paint）畫面。如果這時才插入樣式，頁面可能出現無樣式內容的快閃（FOUC），並觸發額外的樣式計算與重繪。
- **`useLayoutEffect` 可能造成額外的樣式重算**：它雖然會在瀏覽器繪製前執行，但 React 此時已進入 layout effect 階段；若許多 component 才各自插入 `<style>`，瀏覽器可能反覆執行 Recalculate Style，甚至連帶觸發 layout，增加 rendering cost。
- **`useInsertionEffect` 的時間點剛剛好**：它在 commit 期間、所有 layout effects 執行前插入樣式，確保後續的 DOM layout measurement 已經能讀到新 CSS，讓瀏覽器更有效率地統一套用樣式。要注意，React 並不保證它一定發生在所有 DOM mutation 之前，因此仍不能在這裡依賴 ref 或量測 DOM。

### API 與執行邊界

```tsx
useInsertionEffect(setup, dependencies?);
```

它的典型 caller 是 CSS-in-JS library，而不是一般產品 component：

```tsx
function useCSS(rule: string) {
  useInsertionEffect(() => {
    const style = insertRule(rule);
    return () => style.remove();
  }, [rule]);
}
```

```text
render（只計算 className）
  ↓ commit 中插入必要 style rule
useInsertionEffect
  ↓ layout effects 開始量測，已能套用該 rule
useLayoutEffect
  ↓ paint
```

這個階段不能 setState，也不能假設 refs 已 attach 或 DOM 已完成特定 mutation。Server render 也不執行它；library 若支援 SSR，仍需另外收集與輸出 critical CSS。

> 一句話記憶：`useInsertionEffect` 只為 runtime CSS library 提供 layout measurement 前的樣式插入時機。

官方參考：[React `useInsertionEffect`](https://react.dev/reference/react/useInsertionEffect)

### 1. 一般產品 component 該用它量 DOM 嗎？

<details>
<summary>答案</summary>

不該。它主要給 CSS-in-JS library 在 layout effects 讀 layout 前插入動態 style。此時不能依賴 ref 已附加，也不適合一般 DOM measurement；量測用 `useLayoutEffect`。

原因是它的執行時機**沒有提供 DOM 已到位的保證**。可以把可靠的順序理解成：

```text
React commit 開始
  ├─ DOM mutations 與 useInsertionEffect 的處理可能交錯
  ├─ refs 連接完成
  └─ useLayoutEffect 執行（DOM 已 commit、瀏覽器繪製前）
瀏覽器繪製頁面（paint）
useEffect 執行（通常不阻擋 paint）
```

React 只保證 `useInsertionEffect` 早於所有 layout effects，不保證它一定在所有 DOM mutations 之前或之後。因此在裡面存取 `ref.current` 或呼叫 `getBoundingClientRect()` 都不可靠：

- **元件首次掛載時**：ref 尚未連接，`ref.current` 通常仍是 `null`。
- **元件更新時**：DOM mutations 可能尚未完成，也可能已完成；你無法可靠判定量到的是更新前還是更新後的 DOM 尺寸與狀態。

若必須讀取已 commit 的新 DOM 並在 paint 前修正畫面，應使用 `useLayoutEffect`。

</details>

### 2. 為何 CSS-in-JS 不只在 render 插 `<style>`？

<details>
<summary>答案</summary>

因為 render 階段只應該**描述 UI 應該長什麼樣子**，不能直接修改 `document.head`。在 React 18 的 concurrent rendering 中，一次 render 可能被暫停、重跑，甚至整份丟棄；「render 過」不代表「最後真的顯示在畫面上」。

假設 CSS-in-JS library 在 component function 執行時立刻做這件事：

```tsx
function Button({ color }: { color: string }) {
  // ❌ render 階段直接改外部 DOM
  document.head.appendChild(createStyle(`.button { color: ${color} }`));
  return <button className="button">Buy</button>;
}
```

React 可能先 render `color="red"`，還沒 commit 就收到更高優先級的更新，最後只 commit `color="green"`。但 red 的 `<style>` 已經被插進真實 DOM，形成幾個問題：

- 畫面上根本沒有 red 版本，卻留下無主的 style rule。
- Strict Mode 或 render retry 可能重複插入相同 rule。
- render 不再純粹；相同 props 呼叫兩次，外部結果不同，也難以測試。
- 被 Suspense 或 concurrent render 放棄的 tree 仍可能污染全域 stylesheet。

較合理的分工是：render 時只依據 style 內容算出穩定的 class name、把規則登記到 library cache；等 React **真的 commit 這棵 tree** 時，再由 `useInsertionEffect` 把尚未存在的 rule 插入 stylesheet。如此 side effect 才和 committed UI 對齊，而且 rule 會早於所有 layout effects 準備好，後續的 `getBoundingClientRect()` 才會量到套用新 CSS 後的尺寸。

它解決的是「**何時安全地把動態 CSS 寫進真實頁面**」，不是要求每個 render 都新增一個 `<style>`。成熟 library 通常還會用 hash、cache 與 rule 去重，讓相同樣式共用 class/rule；SSR 則另外在 server render pipeline 收集 CSS，因為 Effect 類 Hook 在 server 不執行。

面試時可以濃縮成：**render 可能被放棄，所以不能在 render 修改 stylesheet；`useInsertionEffect` 把插入動作延後到 commit，並保證 CSS 在 layout effects 量測之前已存在。**

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

### `useInsertionEffect` 六題詳細補充

1. **不用來量 DOM**：它的執行點是為 style insertion 特別設計，ref attachment 與 DOM 可用性不是它的 contract。產品 component 量測一律先考慮 CSS，再考慮 layout effect。
2. **不能在 render 插 style**：concurrent render 可能暫停或放棄；若 render 已改動 document，未 commit 的 tree 也會污染頁面。Insertion Effect 讓 side effect 與真正 commit 對齊，並確保後續 layout measurement 已看到 CSS。
3. **不能 setState**：這個階段的限制是刻意的，避免在極早 commit phase 再發 component update。業務狀態應在 event、一般 Effect 或 layout effect 中處理，library 只在這裡插入/清除 style rule。
4. **Ref 不保證**：不要因名字裡有 Effect 就假設和 layout effect 擁有相同 DOM 時序；callback 可能在 refs attach 前後交錯執行。它只能依賴 library 自己的 stylesheet/cache。
5. **SSR**：server-side style 必須在 render pipeline 中收集 critical CSS 並輸出到 HTML，不能等 client Effect。Hydration 還要重用 server 已生成的 rules，避免重複插入與 class mismatch。
6. **安全回答**：先指出 audience 是 CSS-in-JS library author，再說明目的為「layout effect 量測前讓規則存在」。最後補上 render purity、不是 DOM measurement、server 不執行，即已涵蓋主要 contract。

## `useMemo`：快取本次 render 的計算結果

### 做題前：先有正確程式，再用 memoization 省重算

Component 每次 render 都會重新執行函式 body。大多數計算很便宜，直接重算最清楚；但若大型清單篩選已被 Profiler 證明昂貴，而且輸入常保持不變，就可以快取上次結果。

```tsx
const cachedValue = useMemo(calculateValue, dependencies);
```

```tsx
function OrderTable({ orders, filter, theme }) {
  const visibleOrders = useMemo(
    () => expensiveFilter(orders, filter),
    [orders, filter],
  );

  return <Table className={theme} rows={visibleOrders} />;
}
```

```text
第一次 render             → 執行 calculation，保存 result
下次 render，deps 都相同  → 重用 result
下次 render，某個 dep 改變 → 重新 calculation，保存新 result
```

| 它快取什麼 | 不負責什麼 |
| --- | --- |
| pure calculation 的回傳值 | 不保存業務資料 |
| 物件／陣列的 reference identity | 不阻止 parent 或 component 本身 render |
| dependency 未變時省掉重算 | 不修正 side effect 或 stale dependency |

Calculation 在 render 階段執行，所以必須 pure，不能送 request、改 props 或寫外部變數。Cache 是效能最佳化，React 在特定情況可以丟棄；若 cache 消失會讓功能壞掉，那份資料應該是 state 或 ref，而不是 `useMemo`。

`useMemo` 本身也有 closure、dependency comparison 與閱讀成本。先量測再使用；如果一個「永遠新」的 dependency 每次都換 reference，memo 仍會每次重算。

> 一句話記憶：`useMemo` 可以重用 pure calculation 的結果，但不能成為程式正確性所依賴的 storage。

官方參考：[React `useMemo`](https://react.dev/reference/react/useMemo)

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

不一定，甚至可能更慢。`useMemo` 不是免費跳過計算：每次 render 仍要建立 calculation function、建立 dependency array、逐項用 `Object.is` 比較，React 還要保存上一次 dependencies 與結果。對 `price * quantity`、字串拼接或只有幾筆資料的 `map`，重新計算通常比管理 cache 更便宜。

```tsx
// 通常直接算即可：便宜、清楚、沒有 cache 管理成本
const total = price * quantity;

// 通常是過度優化
const total = useMemo(() => price * quantity, [price, quantity]);
```

`useMemo` 比較可能有價值的情況有兩類：

1. **計算真的昂貴**：例如大量資料排序、複雜圖表轉換，而且 Profiler 顯示它在無關 render 中反覆消耗可觀時間。
2. **穩定 reference 能跨過 memo boundary**：例如結果 object/array 傳給 `memo` 包裝的昂貴 child；沒有穩定 reference 時，child 的 shallow comparison 每次都會判定 prop 改變。

```tsx
const visibleRows = useMemo(
  () => expensiveFilterAndSort(rows, filter, sort),
  [rows, filter, sort],
);

return <MemoizedTable rows={visibleRows} />;
```

判斷順序應是：先確認 re-render 是否真的慢，再找出慢的是 calculation 還是 child render，最後才在能切斷重複工作的邊界加 memo。`useMemo` 只會重用結果，不會修好原陣列被 mutation、漏 dependency 造成的 stale data，或 state 放錯 owner 導致整棵樹頻繁 render。

</details>

### 5. Memoized object 對 Context 有什麼用、沒有什麼用？

<details>
<summary>答案</summary>

Context Provider 以 `Object.is` 比較前後的 `value`。如果 Provider 每次 render 都建立新的 object，即使內容相同，reference 仍不同，所有讀取該 Context 的 consumers 都會收到更新。

```tsx
function SessionProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("dark");

  // ❌ theme 改變令 Provider re-render，也會建立新的 value object
  // consumer 即使只需要 user，仍會被通知
  return (
    <SessionContext value={{ user, logout: () => setUser(null) }}>
      {children}
    </SessionContext>
  );
}
```

先穩定 function，再 memoize Provider value，可以避免 `user` 沒變時產生「假的新 value」：

```tsx
const logout = useCallback(() => setUser(null), []);
const session = useMemo(() => ({ user, logout }), [user, logout]);

return <SessionContext value={session}>{children}</SessionContext>;
```

但它只能消除 **Provider 因無關原因 render，而 value 的真實輸入都沒變** 的情況。只要 `user` 改變，`session` reference 就必須改變；所有呼叫 `useContext(SessionContext)` 的 consumers 仍會 render。就算某個 consumer 只讀 `logout`、完全沒讀 `user`，標準 Context 也不會替它做欄位級 selector。

如果 value 同時放入 `price`、`theme`、`user` 等更新頻率和使用者完全不同的資料，單純 memoize 整個 object 無法隔離它們。常見改善是拆成多個 Context、把 state 與 dispatch 分開，或改用支援 selector 的 external store。另需注意：`memo(Component)` 也擋不住 component 自己訂閱的 Context 更新；`memo` 只比較 props。

</details>

### 6. Strict Mode 為何可能呼叫 calculation 兩次？

<details>
<summary>答案</summary>

在 Strict Mode 的**開發環境**，React 可能故意呼叫 `useMemo` calculation 兩次，並忽略其中一次結果。這是 purity probe：純函式以相同 inputs 執行兩次，除了多花開發環境的計算時間，不應留下任何可觀察差異；production 不會因這項 Strict Mode 檢查固定做兩次。

```tsx
const visible = useMemo(() => {
  // ❌ 修改來自 props 的陣列；執行兩次會 push 兩次
  todos.push({ id: "temp", text: "Loading" });
  return filterTodos(todos, tab);
}, [todos, tab]);
```

這段程式即使沒有 Strict Mode 也有 bug，因為它修改了 component 不擁有的輸入。雙重呼叫只是讓重複資料更快現形。正確寫法是建立 calculation 自己擁有的新資料：

```tsx
const visible = useMemo(() => {
  const nextTodos = [...todos, { id: "temp", text: "Loading" }];
  return filterTodos(nextTodos, tab);
}, [todos, tab]);
```

Calculation 內也不能發 request、寫 localStorage、記 analytics、遞增 module 變數或 setState，因為 render 可以重試、暫停或被放棄，React 從來不保證它只執行一次。若需要與外部系統同步，應由 event handler 或合適的 Effect 負責。

不要用 `useRef`、`process.env.NODE_ENV` 或「是否已執行」flag 跳過第二次，這只會把 impurity 藏起來。真正的判準是：**無論 calculation 被呼叫零次、一次或多次，除了回傳值之外都不應改變外部世界。**

</details>

### `useMemo` 六題詳細補充

1. **執行時機**：memo calculation 是 render 的一部分，所以不能寫 request、setState、修改 prop 或依賴執行次數。初次一定計算；後續只在所有 dependencies 皆 `Object.is` 相同時重用上次結果。
2. **Object dependency**：component body 每次都建立新的 `options`，等於每次都宣告輸入改了。把 `{ limit }` 移入 calculation 並依賴 `limit` 最直接，也比「先 memo options、再 memo rows」少一層心智成本。
3. **不是 storage**：Cache 消失時最多只能讓計算重做，不能讓業務資料遺失或行為改變。WebSocket instance、使用者 draft 與 request result 分別應由 ref、state 或 server cache 保存。
4. **成本模型**：Memo 有建立 closure、保存 value、比較 dependencies 及閱讀維護成本。便宜計算通常直接做更快；真正適合的是可量測的昂貴 calculation，或需要穩定 identity 才能讓下游 memo boundary 生效。
5. **Context value**：Memo 只能避免 inputs 沒變時的虛假新 reference；只要 value 內任一 dependency 改變，所有讀該 Context 的 consumers 仍收到更新。高頻且互不相關的欄位應拆 Context 或使用 selector store。
6. **Strict Mode**：雙重 calculation 是 purity probe，React 只採其中一份結果。若 callback push 到 props array，畫面可能重複 item，正好證明 calculation 有 mutation；應複製後操作，而不是用 ref 阻擋第二次。

## `useCallback`：快取 function definition

### 做題前：它保存函式 identity，不會提前執行函式

在 JavaScript 中，每次 render 寫出的 `() => submit(symbol)` 都是新 function object。普通按鈕完全沒問題；只有下游真的在意 reference identity 時，穩定 callback 才有價值。

```tsx
const cachedFunction = useCallback(functionDefinition, dependencies);
```

```tsx
const OrderForm = memo(function OrderForm({ onSubmit }) {
  // 假設這個 child render 很昂貴
  return <button onClick={onSubmit}>送出</button>;
});

function TradePage({ symbol, theme }) {
  const handleSubmit = useCallback(() => {
    submitOrder(symbol);
  }, [symbol]);

  return (
    <div className={theme}>
      <OrderForm onSubmit={handleSubmit} />
    </div>
  );
}
```

當 `theme` 改變而 `symbol` 沒變，React 可以回傳上一個 `handleSubmit` reference；搭配 `memo`，昂貴 child 才有機會跳過 render。若 child 沒有 memo boundary，單獨包 `useCallback` 通常不會減少 render。

| `useMemo` | `useCallback` |
| --- | --- |
| 執行 calculation 並快取回傳值 | 不執行 callback，只快取 function 本身 |
| `useMemo(() => result, deps)` | `useCallback(fn, deps)` |

Dependencies 不是「我希望何時換函式」的選項，而是 callback 讀取的全部 reactive values。漏掉 `symbol` 會讓 callback 永遠送出舊 symbol。若只為更新 state 而讀舊 state，functional updater 常能合法減少 dependency。

> 一句話記憶：`useCallback` 只在 dependencies 不變時提供相同 function identity，不會讓 function 執行得更快。

官方參考：[React `useCallback`](https://react.dev/reference/react/useCallback)

### 1. Callback 會在 render 時執行嗎？

```tsx
const handleBuy = useCallback(() => submit(symbol), [symbol]);
```

<details>
<summary>答案</summary>

不會。`useCallback` 的確在 render 階段被呼叫，但 React 此時只決定要回傳「上一次的 function reference」還是「這次的新 function reference」；箭頭函式裡的 `submit(symbol)` 不會因此執行。Function body 要等 click、child component 或其他程式真正呼叫 `handleBuy()` 時才執行。

可以把它概念化成：

```tsx
// 兩者的 memoization 概念近似
const handleBuy = useCallback(() => submit(symbol), [symbol]);
const handleBuy = useMemo(() => () => submit(symbol), [symbol]);
```

不過這不代表 React 連「函式值」都不會建立。Component 每次 render 時，JavaScript 仍會先建立這次傳給 `useCallback` 的箭頭函式；若 dependencies 都與上次相同，React 會忽略它並把上一次保存的 reference 回傳。

```tsx
const handleBuy = useCallback(() => submit(symbol), [symbol]);

// 只有真正呼叫時才 submit
return <button onClick={handleBuy}>Buy</button>;
```

因此 `useCallback` 快取的是 **function identity / definition**，不是 function 的執行結果，也不會自動 debounce、防止連點或避免 API 重複送出。如果想快取計算結果，才是 `useMemo`；如果想控制連點，則要另外做 disabled、debounce 或 request state。

</details>

### 2. 包了 `useCallback`，child 為何仍 render？

```tsx
const onSelect = useCallback(handleSelect, []);
return <Row onSelect={onSelect} order={{ id, price }} />;
```

<details>
<summary>答案</summary>

因為穩定一個 callback 並不等於阻止 child render。React 的預設行為是：parent render 時，它回傳的 child elements 也會重新被 React 處理。只有 child 使用 `memo`，React 才會在進入 child 前對新舊 props 做 shallow comparison。

即使 `Row` 已包 `memo`，這個例子仍有另一個問題：

```tsx
const onSelect = useCallback(handleSelect, []);

// ❌ 每次 render 都建立新的 order object
return <MemoizedRow onSelect={onSelect} order={{ id, price }} />;
```

`onSelect` reference 或許沒變，但 `{ id, price }` 每次 render 都是新的 object。`memo` 逐項用 `Object.is` 比較 props，會得到：

```tsx
Object.is(previousOrder, nextOrder); // false
```

只要任一 prop 不同，`Row` 仍會 render。可以優先改傳 primitive，讓資料依賴更清楚：

```tsx
return <MemoizedRow onSelect={onSelect} id={id} price={price} />;
```

若 child API 必須接收 object，才考慮：

```tsx
const order = useMemo(() => ({ id, price }), [id, price]);
return <MemoizedRow onSelect={onSelect} order={order} />;
```

另外，`useCallback(handleSelect, [])` 只有在 `handleSelect` 本身不是會隨 render 改變的 reactive value 時才安全；否則仍可能產生 stale closure。完整的優化邊界必須同時滿足：child 確實昂貴、child 有 `memo`、所有需要穩定的 props 都穩定，而且 Profiler 證明省下的工作值得增加的複雜度。

</details>

### 3. 空 dependency 為何送出舊 symbol？

```tsx
const handleBuy = useCallback(() => submit(symbol), []);
```

<details>
<summary>答案</summary>

因為 JavaScript function 會閉包捕捉「建立它的那一次 render snapshot」。第一次 render 若 `symbol === "BTC"`，空 dependency `[]` 便告訴 React：「這個 callback 永遠不需要換成新版」。之後畫面即使已切成 ETH，React 仍回傳第一次保存的 callback，所以 click 時讀到的仍是 `"BTC"`。

```tsx
// 第一次 render：建立捕捉 BTC 的 function
// 後續 render：因為 []，繼續重用同一個 function
const handleBuy = useCallback(() => submit(symbol), []);
```

正確作法是把 callback body 讀取的 reactive values 都列為 dependencies：

```tsx
const handleBuy = useCallback(() => submit(symbol), [submit, symbol]);
```

當 `symbol` 從 BTC 變成 ETH，React 會回傳一個捕捉 ETH 的新 callback。若 `submit` 是 component 外的 module function，它不是 reactive value，可以不列；若它來自 props、Context 或 component 內宣告，通常就必須列入。應以實際來源判斷，而不是看到它「像 function」就猜它穩定。

Dependency array 不是用來指定「我希望 callback 多久改一次」，而是描述 callback 使用了哪些 render inputs。若正確 dependencies 讓某個 Effect 太常重連，應拆 Effect、移動 function 建立位置或重新設計 subscription 邊界；直接刪 dependency 只是以 stale data 換取穩定 identity。

</details>

### 4. Setter 的 functional updater 如何減少 dependency？

```tsx
const add = useCallback((order) => {
  setOrders([...orders, order]);
}, [orders]);
```

<details>
<summary>答案</summary>

原本的 callback 必須讀取「建立它的那次 render」中的 `orders`，所以 `[orders]` 必須存在；每當 orders 改變，callback reference 也會跟著改變。

```tsx
const add = useCallback((order) => {
  setOrders([...orders, order]);
}, [orders]);
```

若下一個 state 只需要根據前一個 state 算出，可以把「如何更新」交給 React 的 state queue：

```tsx
const add = useCallback((order) => {
  setOrders(previous => [...previous, order]);
}, []);
```

這時 callback body 不再讀取 render scope 的 `orders`，因此可以**合法**移除該 dependency。React 稍後處理 update queue 時，會把當時最新的 pending state 傳入 `previous`。這在同一批更新連續新增多筆資料時尤其重要：

```tsx
setOrders(previous => [...previous, firstOrder]);
setOrders(previous => [...previous, secondOrder]);
```

第二個 updater 會收到第一個 updater 的結果，不會因兩次都讀到同一份舊 snapshot 而覆蓋其中一筆。

但 functional updater 只能移除「只為了計算下一個 state 而讀取的舊 state」。如果 callback 還讀了其他 reactive value，仍要保留：

```tsx
const add = useCallback((order) => {
  setOrders(previous => [...previous, { ...order, symbol }]);
}, [symbol]);
```

這不是為了安撫 lint 的技巧，而是實際改變資料流：callback 不再自行讀舊 state，而是傳一個純 updater 給 React。

</details>

### 5. 何時 `useCallback` 有實際價值？

<details>
<summary>答案</summary>

`useCallback` 的價值通常不是「建立 function 很貴」——建立普通 JavaScript function 通常很便宜——而是下游是否會觀察 function reference 改變。常見的有效場景有三種：

1. **傳給已 memoized、而且 render 昂貴的 child**

   ```tsx
   const handleSelect = useCallback((id: string) => {
     setSelectedId(id);
   }, []);

   return <MemoizedLargeTable onSelect={handleSelect} rows={rows} />;
   ```

   若其他 props 也穩定，callback reference 不變能讓 `memo` 跳過無關的 child render。若 child 沒有 `memo` 或 render 很便宜，通常得不到實際收益。

2. **Callback 是另一個 Hook 的 dependency**

   ```tsx
   const createConnection = useCallback(
     () => connect(roomId),
     [roomId],
   );

   useEffect(() => {
     const connection = createConnection();
     return () => connection.disconnect();
   }, [createConnection]);
   ```

   穩定 identity 可避免 Effect 因無關 render 重跑。不過若 function 只供該 Effect 使用，通常直接把 function 移進 Effect 會更簡單，不一定需要 `useCallback`。

3. **API 明確把 function identity 當成 contract**

   例如某些 subscription、imperative API 或自訂 Hook 需要用同一個 callback reference 註冊、更新或作為 cache key。此時 identity 本身就是 API 語意的一部分。

普通 `<button onClick={handleClick}>` 通常不需要 `useCallback`。DOM button 不會只因 handler reference 改變就做昂貴的 component render，而且 memoization 本身仍有 dependency 比較與維護成本。先找出可量測的 render 問題，再在真正存在 identity-sensitive consumer 的邊界使用。

</details>

### 6. React Compiler 專案還要手動 memo 嗎？

<details>
<summary>答案</summary>

不一定。React Compiler 能分析 component 與 Hook 的資料流，自動 memoize 許多 values、functions 與 component 子樹，因此在成功編譯的程式碼中，原本只為避免無關 re-render 而手寫的 `useCallback` 往往會變得多餘。

但「專案安裝了新版 React」不等於「所有程式都已由 Compiler 自動優化」。仍要確認：

- 專案是否真的啟用 React Compiler，而不只是升級 React runtime。
- 該檔案或 component 是否在 Compiler 的編譯範圍內並成功通過分析。
- 第三方 library 或自訂 Hook 是否對 callback identity 有明確 contract。
- 手動 memo 是否不只為效能，也是在表達某個外部 API 所需的穩定 identity。

例如單純把 handler 傳給 UI child，Compiler 通常有機會自動建立適當的 memo boundary：

```tsx
function ProductPage({ productId }) {
  function handleBuy() {
    submit(productId);
  }

  return <BuyButton onBuy={handleBuy} />;
}
```

但若 callback 被交給未受 Compiler 控制的外部 subscription，則應依那個 API 的 contract 判斷，而不是假設 Compiler 一定能替你維持需要的 reference：

```tsx
useExternalSubscription(topic, handler);
```

遷移時不要全域搜尋並刪除所有 `useCallback`。較安全的方式是先確認 Compiler diagnostics 與 lint，再用 Profiler 比較關鍵互動，逐步移除只是效能提示、已被 Compiler 涵蓋的 memoization；對 subscription、cache key 或 library boundary 則保留清楚的 identity 設計。

</details>

### `useCallback` 六題詳細補充

1. **快取的是 definition**：Render 時 React 依 dependencies 決定回傳舊 function 或新 function；body 要等 click/subscription 呼叫才跑。它不會快取 `submit` 結果，也不會自動防止重複提交。
2. **Child 仍 render**：Parent render 預設會 render children；只有 `memo` 才比較 props，而任何一個新 object/function 都足以讓 shallow comparison 失敗。優化前要先確認 child 真昂貴，並檢查完整 props boundary。
3. **Stale symbol**：`[]` 宣告 callback 永遠不需換版，與 body 讀取會變的 `symbol` 矛盾。正確 dependency 是所有 reactive reads；若 `submit` 來自 module scope 或穩定 API 才可能不列，不能憑名字猜穩定。
4. **Functional updater**：改用 updater 後 callback 不再讀 render snapshot 的 `orders`，因此可合法移除該 dependency。React 會按 queue 中最新 pending state 呼叫 updater，也能避免同事件多次新增時遺失更新。
5. **實際價值**：常見 contract 是 memoized child prop、另一個 Effect dependency、或 add/remove listener 需要 reference。普通 DOM button 不會因 handler 換 reference 就昂貴更新，包 callback 反而讓 dependency 更難讀。
6. **Compiler**：Compiler 能根據資料流自動建立許多 memo boundary，但專案可能只編譯部分檔案，library identity contract 也不一定能推導。升級時應靠 compiler diagnostics、lint 與 Profiler 逐步刪除冗餘手動 memo，而非全域搜尋取代。

## `useDebugValue`：替 custom Hook 標示 DevTools 狀態

> 實際案例：[useDebugValue：替行情連線 Hook 顯示可讀狀態](./practical-cases/use-debug-value)

### 做題前：它只改善 custom Hook 的除錯介面

當 DevTools 看到 `useSyncExternalStore`、`useState` 等底層值時，不一定知道它們合起來代表「行情已連線」或「訂單同步中」。`useDebugValue` 讓 reusable custom Hook 顯示一個具業務意義的 label。

```tsx
useDebugValue(value, format?);
```

```tsx
function useTickerStatus(symbol: string) {
  const status = useSyncExternalStore(subscribe, getSnapshot);

  useDebugValue(
    { symbol, status },
    ({ symbol, status }) => `${symbol}: ${status}`,
  );

  return status;
}
```

| 項目 | 角色 |
| --- | --- |
| `value` | 要讓 React DevTools 顯示的除錯資料 |
| `format(value)` | 選填 formatter；DevTools 需要顯示時才呼叫，適合較昂貴格式化 |
| Hook return value | 真正提供給 component 的資料，與 debug value 無關 |

它不會印到 console、不會改變 render、也不能成為 logging、telemetry 或 production correctness 的依據。通常只放在被多人重用、內部狀態不易理解的 custom Hook；產品 component 中每個小 Hook 都標註反而製造雜訊。

Hooks 規則仍然適用：`useDebugValue` 必須無條件放在 custom Hook 頂層，不能因 `process.env` 或資料狀態不同而條件式呼叫。

> 一句話記憶：`useDebugValue` 是 custom Hook 給 React DevTools 的人類可讀標籤，不影響產品行為。

官方參考：[React `useDebugValue`](https://react.dev/reference/react/useDebugValue)

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

不會。`useDebugValue` 的用途是替 **custom Hook 在 React DevTools 裡顯示一段容易理解的除錯資訊**。以上例來說，開發者在 DevTools 的 Components 面板檢查使用 `useOnlineStatus` 的 component 時，可以在 Hooks 區域看到類似 `OnlineStatus: Online` 或 `OnlineStatus: Offline` 的資訊。

它不會產生任何使用者看得見的 UI，也不會：

- 把內容印到 browser console；
- 改變 `online` 的值；
- 讓 component 因此多回傳資料；
- 自動把狀態送到 logging 或監控平台。

因此，若目的是保留執行紀錄，仍應使用適當的 logger 或 telemetry；若目的是在畫面上顯示連線狀態，仍要由 component render。`useDebugValue` 只是在 DevTools 中替 Hook 加上「給開發者看的註解」，不能取代正式的輸出或記錄機制。

</details>

### 2. 應該在每個產品 component 都加嗎？

<details>
<summary>答案</summary>

通常不用，而且 React 官方也更鼓勵把它用在 **共享、可重用的 custom Hook**，而不是每個 component 或每個簡單 Hook 都加。

判斷標準是：開發者只看 Hook 名稱與原始 state 時，是否很難快速知道目前的業務狀態。例如下列 Hook 很適合標示：

- `useOnlineStatus`：將 boolean 翻成 `Online` / `Offline`；
- `useSocket`：顯示 `connecting`、`connected`、`reconnecting #2`；
- `usePermission`：顯示 `granted`、`denied`、`prompt`；
- 共用 data-fetching Hook：摘要成 `loading`、`success (12 items)` 或 `error`。

反過來說，如果 Hook 只是包一個容易看懂的 `useState(false)`，或只在單一 component 內使用，DevTools 原本的資訊通常已經足夠。到處加入 `useDebugValue` 會增加維護成本，也可能讓真正重要的狀態被大量 label 淹沒。

另外，`useDebugValue` 通常應寫在 custom Hook 裡，讓除錯資訊跟抽象本身放在一起；不需要為了使用它而在每個呼叫該 Hook 的產品 component 重複標示。

</details>

### 3. 昂貴格式化怎麼避免平時執行？

```tsx
useDebugValue(date, date => formatVerySlowly(date));
```

<details>
<summary>答案</summary>

把原始值當作第一個參數，再把格式化邏輯以第二個參數傳入：

```tsx
useDebugValue(date, currentDate => formatVerySlowly(currentDate));
```

這個第二參數稱為 formatter function。React 會把原始的 `date` 交給它，並在 React DevTools 確實需要顯示該 debug value 時才進行格式化。這能避免在一般 render 過程中先支付昂貴的日期格式化、巨大 object serialization 或摘要計算成本。

下面的寫法則失去延後計算的好處：

```tsx
// 每次 custom Hook render 都會先執行 formatVerySlowly
useDebugValue(formatVerySlowly(date));
```

即使使用者根本沒有開 DevTools，傳入第一個參數前，JavaScript 仍必須先執行 `formatVerySlowly(date)`。因此只有在格式化真的有成本時才需要 formatter；簡單的 boolean 轉字串通常可以直接寫。

formatter 必須保持 pure：相同輸入應得到相同描述，而且不能在裡面更新 state、送 request、寫 cache 或回報錯誤。React 不保證它一定會執行，也不保證精確的執行次數；DevTools 的顯示行為不應影響應用程式本身。

</details>

### 4. 它可以條件式呼叫嗎？

<details>
<summary>答案</summary>

不可以。雖然 `useDebugValue` 不管理畫面狀態，它仍然是 React Hook，所以同樣受 Rules of Hooks 約束：必須在 custom Hook 的頂層呼叫，不能放進 `if`、迴圈、event handler 或可能提早 `return` 之後。

錯誤範例：

```tsx
function useSocket(enabled: boolean) {
  if (enabled) {
    useDebugValue("Socket enabled");
  }
}
```

當 `enabled` 在不同 render 間改變時，Hook 的呼叫數量與順序也會改變，破壞 React 依固定順序追蹤 Hooks 的規則。

正確做法是每次 render 都呼叫它，只讓傳入的值依條件改變：

```tsx
function useSocket(enabled: boolean) {
  useDebugValue(enabled ? "Socket enabled" : "Socket disabled");
}
```

如果某個狀態沒有值得顯示的內容，也應維持呼叫位置固定，例如傳入 `null`、`"disabled"` 或其他清楚的摘要；重點是條件只能影響 value 或 formatter 的輸出，不能影響 `useDebugValue` 本身是否被呼叫。

</details>

### 5. Production correctness 可以依賴它嗎？

<details>
<summary>答案</summary>

不可以。`useDebugValue` 是開發階段的觀察工具，不是應用程式資料流的一部分。Production 使用者通常不會開 React DevTools，而且 React 不保證 formatter 會被呼叫，因此任何 correctness 都不能依賴它。

尤其不能把下列工作放進 formatter：

- 初始化資料或補上預設值；
- 更新 state、ref 或 cache；
- 發送 API request；
- 執行訂閱或 cleanup；
- 上報必要的錯誤或監控事件。

例如下面的程式有 bug，因為 `reportError` 是否執行取決於 DevTools 是否要求顯示 label：

```tsx
useDebugValue(error, currentError => {
  reportError(currentError);
  return currentError.message;
});
```

真正影響功能的工作應放在正常 render 資料流、event handler 或適合的 Effect 中。Custom Hook 也仍然要透過 `return` 提供呼叫端真正需要的狀態；`useDebugValue` 不會把值傳給 component，更不能作為功能是否正常的依據。

</details>

### 6. 要標原始資料還是業務語意？

<details>
<summary>答案</summary>

優先顯示能回答「這個 Hook 現在處於什麼狀態？」的**業務語意摘要**，而不是不加整理地塞入整包原始資料。

例如 socket Hook 內部可能有多個欄位：

```tsx
{
  connected: false,
  retryCount: 2,
  nextRetryAt: 1720000000000,
  lastError: /* ... */
}
```

DevTools label 若直接顯示整個 object，開發者仍要展開並自行推理；顯示 `Socket: reconnecting (attempt 2)` 則能立即說明狀態。常見的好摘要還包括 `Query: loading`、`Cart: 3 items`、`Permission: denied`。必要時可用 formatter 從原始資料產生這種短文字。

不過，不是所有原始值都必須改成字串。若某個小型 enum、boolean 或短值本身已很清楚，直接傳入即可。原則是資訊要簡短、穩定、容易掃讀，並且確實有助於定位問題。

也要把 DevTools 視為可能被開發者、測試人員、共享螢幕或截圖看到的介面。不要在 label 放 access token、密碼、完整 email、個資或其他 secret；除錯方便不代表可以繞過資料最小化與隱私要求。若需要辨認資料，可採遮罩、計數、狀態分類或非敏感 ID 摘要。

</details>

### `useDebugValue` 六題詳細補充

1. **不是 console**：它只影響 React DevTools 展開 custom Hook 時顯示的 label，不會出現在 browser console，也不應被測試當作輸出。真正 logging 應使用可控的 logger/telemetry。
2. **使用位置**：最有價值的是共用 custom Hook 的抽象邊界，例如 connection、permissions 或 query state。一般 component 內散落使用只會讓 DevTools tree 多出難以維護的標籤。
3. **Lazy formatter**：第二個參數接收原始 value，DevTools 需要顯示時才格式化，因此能避免每次 render 都做日期/大 object serialization。Formatter 也必須 pure，不能因 DevTools 展開而改變程式狀態。
4. **Rules of Hooks**：它仍依呼叫順序對應 Hook slot，必須在 custom Hook 頂層呼叫。可以傳 `enabled ? value : "disabled"`，但不能把呼叫本身放在 if 後。
5. **不影響 correctness**：Production 可能沒有 DevTools，React 也不承諾 formatter 一定執行。任何資料初始化、錯誤上報或 cache 更新放在 formatter 中都是 bug。
6. **業務語意**：Label 應回答「這個 Hook 現在處於什麼狀態」，例如 `Socket: reconnecting #2`，並避免 token、email 等敏感值。大型 raw object 可由 DevTools 其他欄位查看，不必塞進一行 label。

## 完成檢查

- Effect 的輸入由它讀取的 reactive values 決定，cleanup 要對稱撤銷 setup。
- Layout Effect 是 paint 前的必要 DOM 同步，不是「比較快的 Effect」。
- Insertion Effect 主要服務 CSS-in-JS library。
- `useMemo` 快取值，`useCallback` 快取 function definition；兩者都不修 correctness。
- `useDebugValue` 只改善 custom Hook 在 DevTools 裡的可讀性。

[下一組：Concurrent / External Store Hooks](./20-react-concurrent-external-hooks-drills.md)
