---
title: "JavaScript / TypeScript 面試重點"
description: "Binance 前端面試常見的 JavaScript 與 TypeScript production code 考點。"
tags:
  - JavaScript
  - TypeScript
  - Interview
keywords: ["JavaScript", "TypeScript", "event loop", "Promise", "production code"]
sidebar_position: 2
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

常見追問：

- `Promise.then` 和 `setTimeout(fn, 0)` 誰先執行？
- `async/await` 和 Promise 的關係是什麼？
- 為什麼大量 microtask 可能阻塞畫面更新？
- `requestAnimationFrame` 適合處理什麼？

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

## 高機率口試題

- 請解釋 event loop，microtask 和 macrotask 差在哪？
- `useEffect` 裡面遇到 stale closure 怎麼辦？
- Promise 的錯誤如何傳遞？`try/catch` 可以抓到哪些錯？
- 如何取消一個 fetch request？
- 什麼是 debounce / throttle？交易即時資料會用哪個？
- TypeScript 的 `unknown` 和 `any` 差在哪？
- union type 如何幫你寫更安全的 UI state？
- 為什麼金融價格不要直接用 floating point number 計算？

