---
title: "JavaScript / TypeScript 面試重點"
description: "Binance 前端面試常見的 JavaScript 與 TypeScript production code 考點。"
tags:
  - JavaScript
  - TypeScript
  - Interview
keywords: ["JavaScript", "TypeScript", "event loop", "Promise", "production code"]
sidebar_position: 5
---

# JavaScript / TypeScript 面試重點

## Production JavaScript 要能說清楚什麼

Production-level JavaScript 不只是語法熟，面試官會想確認你能不能在大型專案中寫出可維護、可預期、可除錯的程式。

你需要能講：

- 程式執行模型：call stack、microtask、macrotask、render timing。
- 非同步控制：Promise、async/await、錯誤傳遞、取消請求、race condition。
- 資料處理：immutability、reference equality、深拷貝與淺拷貝。
- 模組化：ESM / CommonJS、tree shaking、side effects。
- 瀏覽器 API：fetch、AbortController、localStorage、sessionStorage、BroadcastChannel、Web Worker。
- 記憶體與資源釋放：event listener、timer、subscription、WebSocket cleanup。

## Event Loop

必背版本：

1. JavaScript 是單執行緒執行同步程式碼。
2. Promise callback 進 microtask queue。
3. setTimeout / setInterval / DOM event 多數進 macrotask queue。
4. 每次 call stack 清空後，會先清 microtask，再進下一個 macrotask。
5. 瀏覽器會在適當時機進行 layout / paint。

常見追問與答案：

### `Promise.then` 和 `setTimeout(fn, 0)` 誰先執行？

`Promise.then` 會先執行。同步程式跑完後，event loop 會先清空 microtask queue，Promise callback 屬於 microtask；`setTimeout` callback 屬於 macrotask，要等 microtask 清完後才會進下一輪任務。

### `async/await` 和 Promise 的關係是什麼？

`async/await` 是 Promise 的語法糖。`async function` 一定回傳 Promise；`await` 會暫停目前 async function 後續程式，把後續邏輯排進 microtask，等 Promise settled 後再繼續執行。

### 為什麼大量 microtask 可能阻塞畫面更新？

因為瀏覽器通常要等目前 task 和 microtask queue 清完後，才有機會進行 rendering。若程式持續建立大量 Promise microtask，主執行緒會一直忙著清 microtask，layout / paint 會被延後，畫面就可能卡住。

### `requestAnimationFrame` 適合處理什麼？

`requestAnimationFrame` 適合把 DOM 更新、canvas 繪製、動畫計算安排在下一次 repaint 前執行。交易頁如果有高頻行情，可以把多筆資料先 buffer 起來，在同一個 animation frame 合併更新 UI，避免每筆 message 都觸發 render。

交易產品場景：

如果行情資料一秒更新數十次，不應該每筆 WebSocket message 都直接 setState。可以先進 buffer，再用 `requestAnimationFrame` 或固定 interval 合併更新，避免 render 過度頻繁。

## Promise / async-await

需要掌握：

- `Promise.all`：其中一個 reject 就 reject，適合所有請求都必要。
- `Promise.allSettled`：每個結果都保留，適合部分失敗仍能顯示。
- `Promise.race`：第一個 settled 決定結果，常見於 timeout。
- `Promise.any`：第一個 fulfilled 成功，全部失敗才 reject。

面試回答要補上錯誤處理：

```ts
async function fetchWithTimeout(url: string, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    window.clearTimeout(timer);
  }
}
```

這段可以延伸說明：

- `AbortController` 用來取消已不需要的 request。
- `finally` 確保 timer 被清掉。
- 不只處理 happy path，也處理 timeout 與 HTTP error。

## Race Condition

常見問題：

使用者快速切換交易對 `BTCUSDT -> ETHUSDT -> SOLUSDT`，前一個請求比較慢回來，覆蓋了最新資料。

解法：

- 使用 `AbortController` 取消舊請求。
- 用 request id / version 檢查只接受最新回應。
- 交給 React Query，用 query key 隔離不同交易對資料。
- UI 顯示目前資料的 symbol，避免舊資料混入。

口述範例：

```ts
let latestRequestId = 0;

async function loadSymbol(symbol: string) {
  const requestId = ++latestRequestId;
  const data = await fetchTicker(symbol);

  if (requestId !== latestRequestId) return;
  renderTicker(data);
}
```

## Closure

Closure 是 function 記住宣告時 lexical scope 的能力。

常考：

- `var` 在 loop 中造成共用同一個 binding。
- React hook 中 stale closure。
- debounce / throttle 實作。

React stale closure 範例：

```tsx
useEffect(() => {
  const timer = window.setInterval(() => {
    console.log(count);
  }, 1000);

  return () => window.clearInterval(timer);
}, []);
```

上面會一直印初始 `count`。修法可能是：

- 把 `count` 放進 dependency。
- 使用 functional update。
- 使用 `useRef` 保存最新值。

## this / prototype / class

要能回答：

- 一般 function 的 `this` 由呼叫方式決定。
- arrow function 沒有自己的 `this`，會捕捉外層 lexical `this`。
- `bind / call / apply` 差異。
- class 本質仍基於 prototype。
- instance method 和 static method 差異。

面試不一定要背非常底層，但你要能 debug event handler、callback、class method 遺失 `this` 的問題。

## Immutability

React / Redux 中 immutability 是基礎，因為很多更新判斷依賴 reference equality。

需要能說：

- 不直接 mutate state。
- shallow compare 只能比較引用，不會深度檢查。
- 大型巢狀資料可以 normalized，避免深層更新。
- Immer 可以降低 reducer 更新巢狀資料的心智負擔。

錯誤範例：

```ts
state.orders.push(newOrder);
return state;
```

正確方向：

```ts
return {
  ...state,
  orders: [...state.orders, newOrder],
};
```

如果使用 Redux Toolkit，Immer 會讓「看起來像 mutate」的寫法轉成 immutable update，但面試時要講得出背後原因。

## TypeScript 必會

### 型別不是越複雜越好

面試官看重的是你能不能讓型別服務業務，降低錯誤。

交易資料常見型別：

```ts
type SymbolName = `${string}USDT`;

type Ticker = {
  symbol: SymbolName;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  eventTime: number;
};

type OrderSide = "buy" | "sell";

type OrderBookLevel = {
  price: string;
  quantity: string;
  total: string;
  side: OrderSide;
};
```

價格與數量建議用 string 或 decimal library，不要直接用 number 做金融精度計算。

### Union / Narrowing

```ts
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

function renderState<T>(state: ApiState<T>) {
  if (state.status === "success") {
    return state.data;
  }

  if (state.status === "error") {
    return state.error.message;
  }

  return null;
}
```

這類 discriminated union 很適合表達 UI state，避免 `data`、`error`、`loading` 多個 boolean 互相矛盾。

### Generics

常見回答方向：

- 泛型讓 function / component 保留輸入與輸出之間的型別關係。
- 不要濫用 `any`，必要時用 `unknown` 再 narrowing。
- API wrapper、table component、form field、query hook 很常用 generics。

```ts
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
```

## 高機率口試題與答案

### 請解釋 event loop，microtask 和 macrotask 差在哪？

JavaScript 會先執行 call stack 裡的同步程式。同步程式結束後，event loop 會先清 microtask queue，再處理下一個 macrotask。Promise callback、`queueMicrotask` 通常是 microtask；`setTimeout`、`setInterval`、多數 DOM event callback 可視為 macrotask。差別在於 microtask 優先級更高，而且同一輪 event loop 會盡量清完，所以大量 microtask 可能延後瀏覽器 paint。

### `useEffect` 裡面遇到 stale closure 怎麼辦？

先確認 effect 使用了哪些 render scope 的值，正常情況應該把它們放進 dependency array。如果是 interval、WebSocket callback 這種長生命週期 callback，需要讀最新值，可以用 `useRef` 保存 latest value；如果是根據上一個 state 更新，優先用 functional update，例如 `setCount((prev) => prev + 1)`。不要用刻意移除 dependency 來壓掉 lint，這通常只是把 bug 藏起來。

### Promise 的錯誤如何傳遞？`try/catch` 可以抓到哪些錯？

Promise chain 中 throw error 或 return rejected Promise，都會讓後面的 `.catch` 接到。`async/await` 裡 `await` 到 rejected Promise 時會像 throw 一樣丟出，因此可以被同一個 async function 裡的 `try/catch` 抓到。但 `try/catch` 抓不到沒有 await 的非同步錯誤，例如 setTimeout callback 裡 throw 的錯，除非在 callback 內自己處理或把它轉成 Promise。

### 如何取消一個 fetch request？

使用 `AbortController`。建立 controller，把 `controller.signal` 傳給 fetch；當 component unmount、query key 改變、使用者切換 symbol 或 timeout 發生時呼叫 `controller.abort()`。實務上還要在 catch 裡分辨 `AbortError` 和真正的網路/API 錯誤，避免把使用者主動取消顯示成失敗。

### 什麼是 debounce / throttle？交易即時資料會用哪個？

Debounce 是停止觸發一段時間後才執行，適合搜尋輸入、視窗 resize 結束後重新計算。Throttle 是固定時間最多執行一次，適合 scroll、mousemove、行情 UI 更新。交易即時資料通常不適合 debounce，因為資料流可能不會停止；較常用 throttle、`requestAnimationFrame` batching，或固定 interval flush，確保 UI 有穩定更新節奏。

### TypeScript 的 `unknown` 和 `any` 差在哪？

`any` 會關掉型別檢查，任何操作都被允許，風險是錯誤會延後到 runtime 才爆。`unknown` 表示目前不知道型別，但使用前必須 narrowing，例如檢查 `typeof`、`Array.isArray`、自訂 type guard。處理外部 API、`JSON.parse`、第三方 SDK 回傳值時，`unknown` 比 `any` 安全。

### union type 如何幫你寫更安全的 UI state？

Union type 可以把 UI 狀態設計成互斥狀態，避免 `isLoading=true` 但同時有 `data` 和 `error` 這類矛盾。常見做法是 discriminated union，例如 `{ status: "loading" } | { status: "success"; data: T } | { status: "error"; error: Error }`。這樣 TypeScript 會根據 `status` narrowing，確保只有 success 狀態能讀 data，error 狀態能讀 error。

### 為什麼金融價格不要直接用 floating point number 計算？

JavaScript number 是 IEEE 754 floating point，像 `0.1 + 0.2` 會有精度誤差。交易產品的 price、quantity、fee、notional 都需要精準，不能讓浮點誤差影響下單或顯示。實務上會保留 API 原始 decimal string，計算時用 decimal library 或整數最小單位，最後依 tick size / step size 做格式化。
