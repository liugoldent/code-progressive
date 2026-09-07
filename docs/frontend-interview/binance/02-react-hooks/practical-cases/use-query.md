---
sidebar_position: 15
slug: "/frontend-interview/binance/practical-cases/use-query"
title: "useQuery"
description: "用交易行情卡實作 useQuery 的 queryKey、queryFn、首次載入、背景更新、快取與請求取消。"
tags: [React, Hooks, TanStack Query, useQuery, Server State, Interview]
---

# useQuery

## 實際情境：切換並更新交易行情

交易頁需要依照使用者選擇的交易對取得行情。切換交易對時，每個商品應有獨立快取；回到剛看過的商品時，可以先顯示快取，不必每次都退回全頁 loading。

這個案例會同時呈現：

- `queryKey` 如何區分 BTC、ETH 與 SOL 的快取。
- `queryFn` 如何取得資料並處理 HTTP error。
- `isPending` 與 `isFetching` 如何呈現不同 loading 狀態。
- `staleTime` 與 `gcTime` 分別控制資料新鮮度與 inactive cache 保留時間。
- 快速切換交易對時，如何把 TanStack Query 提供的 `signal` 傳給 request。

## 安裝

先在 React 專案安裝 TanStack Query：

```bash
npm install @tanstack/react-query
```

## 完整可操作範例

以下是單檔 `App.jsx` 範例。為了不依賴外部 API，它使用延遲 `800ms` 的 mock server；實務上只要把 `mockFetchTicker` 換成真正的 `fetch`，`useQuery` 的部分不需要改。

```jsx
import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
const BASE_PRICES = {
  BTCUSDT: 64231.2,
  ETHUSDT: 3486.75,
  SOLUSDT: 148.32,
};

let requestSequence = 0;

function mockFetchTicker(symbol, signal) {
  const requestId = ++requestSequence;

  return new Promise((resolve, reject) => {
    function handleAbort() {
      window.clearTimeout(timerId);
      reject(new DOMException("Request aborted", "AbortError"));
    }

    const timerId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);

      if (symbol === "ERROR") {
        reject(new Error("伺服器暫時無法取得行情"));
        return;
      }

      const basePrice = BASE_PRICES[symbol];
      const changePercent = (Math.random() - 0.5) * 0.01;

      resolve({
        symbol,
        price: Number((basePrice * (1 + changePercent)).toFixed(2)),
        updatedAt: new Date().toLocaleTimeString(),
        requestId,
      });
    }, 800);

    if (signal.aborted) {
      handleAbort();
      return;
    }

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function TickerScreen() {
  const [symbol, setSymbol] = useState("BTCUSDT");

  const tickerQuery = useQuery({
    // symbol 會改變 API 結果，所以必須是 key 的一部分。
    queryKey: ["ticker", symbol],
    queryFn: ({ signal }) => mockFetchTicker(symbol, signal),
    staleTime: 15_000,
    gcTime: 60_000,
  });

  return (
    <main
      style={{
        maxWidth: 620,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <h1>交易行情</h1>

      <nav
        aria-label="選擇交易對"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {SYMBOLS.map(option => (
          <button
            key={option}
            onClick={() => setSymbol(option)}
            disabled={symbol === option}
          >
            {option}
          </button>
        ))}

        <button
          onClick={() => setSymbol("ERROR")}
          disabled={symbol === "ERROR"}
        >
          模擬錯誤
        </button>
      </nav>

      {tickerQuery.isPending && (
        <section style={cardStyle} aria-live="polite">
          <p>第一次取得 {symbol} 行情中…</p>
        </section>
      )}

      {!tickerQuery.isPending && !tickerQuery.data && (
        <section style={cardStyle}>
          <p role="alert" style={{ color: "#b91c1c" }}>
            {tickerQuery.error?.message ?? "取得行情失敗"}
          </p>
          <button onClick={() => tickerQuery.refetch()}>重試</button>
        </section>
      )}

      {tickerQuery.data && (
        <section style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div>
              <p style={{ margin: 0, color: "#6b7280" }}>
                {tickerQuery.data.symbol}
              </p>
              <strong style={{ display: "block", fontSize: 36, marginTop: 8 }}>
                {tickerQuery.data.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </div>

            <span style={{ color: tickerQuery.isFetching ? "#b45309" : "#047857" }}>
              {tickerQuery.isFetching ? "更新中…" : "已同步"}
            </span>
          </div>

          {tickerQuery.isError && (
            <p role="alert" style={{ color: "#b91c1c" }}>
              背景更新失敗，目前繼續顯示上一筆資料。
            </p>
          )}

          <p style={{ color: "#6b7280" }}>
            更新時間：{tickerQuery.data.updatedAt} · Request #{tickerQuery.data.requestId}
          </p>

          <button
            onClick={() => tickerQuery.refetch()}
            disabled={tickerQuery.isFetching}
          >
            手動更新
          </button>
        </section>
      )}

      <aside
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 8,
          background: "#f3f4f6",
          lineHeight: 1.7,
        }}
      >
        <strong>目前 queryKey：</strong>
        <code>{JSON.stringify(["ticker", symbol])}</code>
        <br />
        <strong>status：</strong>
        <code>{tickerQuery.status}</code>
        {" · "}
        <strong>fetchStatus：</strong>
        <code>{tickerQuery.fetchStatus}</code>
      </aside>
    </main>
  );
}

const cardStyle = {
  marginTop: 20,
  padding: 20,
  minHeight: 150,
  border: "1px solid #d1d5db",
  borderRadius: 12,
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TickerScreen />
    </QueryClientProvider>
  );
}
```

## 誰知道要先讀取快取？快取放在哪裡？

`mockFetchTicker` 不知道也不會檢查快取。它只負責模擬向伺服器取得資料：等待 `800ms`，接著讓 Promise 成功或失敗。

真正管理快取的是 TanStack Query 的 `QueryClient`：

```jsx
const queryClient = new QueryClient();
```

`QueryClientProvider` 再把同一個 client 提供給下面的元件：

```jsx
<QueryClientProvider client={queryClient}>
  <TickerScreen />
</QueryClientProvider>
```

元件呼叫 `useQuery` 時，Hook 會取得這個 `QueryClient`，並依照 `queryKey` 尋找對應的 cache：

```text
queryClient
  └─ QueryCache（預設存在 JavaScript 記憶體）
      ├─ ["ticker", "BTCUSDT"] → BTC 行情
      ├─ ["ticker", "ETHUSDT"] → ETH 行情
      └─ ["ticker", "SOLUSDT"] → SOL 行情
```

可以使用 `getQueryData` 讀取指定 key 的現有資料：

```jsx
queryClient.getQueryData(["ticker", "BTCUSDT"]);
```

這些資料預設只存在目前頁面的記憶體，不會自動寫入 `localStorage`；重新整理網頁後，這個 `QueryClient` 與它的 cache 通常會重新建立。

以下是方便理解的簡化流程，不是 TanStack Query 的實際原始碼：

```text
const key = ["ticker", symbol];
const cachedData = queryClient.getQueryData(key);

if (cachedData 還在 staleTime 內) {
  // 直接把 fresh cache 提供給元件，不執行 queryFn。
} else {
  // 沒有 cache，或目前時機需要重新取得資料。
  const data = await mockFetchTicker(symbol, signal);
  queryClient.setQueryData(key, data);
}
```

因此第一次取得 BTC 行情時，流程是：

```text
useQuery 訂閱 ["ticker", "BTCUSDT"]
  → QueryClient 找不到這個 key 的 cache
  → 執行 queryFn
  → mockFetchTicker 回傳行情
  → QueryClient 把結果存進 BTC 的 cache
  → tickerQuery.data 收到資料
```

在 `staleTime: 15_000` 的期限內再次使用相同 key：

```text
useQuery 訂閱 ["ticker", "BTCUSDT"]
  → QueryClient 找到仍然 fresh 的 BTC cache
  → 直接提供 tickerQuery.data
  → 不需要執行 mockFetchTicker
```

如果 cache 已經 stale，它仍然可以先顯示舊資料，再依設定與觸發時機於背景執行 `queryFn` 更新；stale 不等於資料已被刪除。`gcTime` 才控制沒有任何 observer 使用後，inactive cache 可以保留多久。

角色可以分成：

```text
useQuery / QueryClient：尋找、保存、更新與通知 cache
mockFetchTicker：需要取得新資料時，模擬向 server 發 request
```

## `resolve({...})` 的資料交給誰？

`resolve` 是建立 Promise 時，由 JavaScript 提供的函式：

```jsx
function mockFetchTicker(symbol, signal) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve({
        symbol,
        price: 64000,
      });
    }, 800);
  });
}
```

`resolve({...})` **不是直接指定給某個固定變數**。它會把物件設定為這個 Promise 的成功結果；最後是哪個變數取得資料，取決於誰使用 `await` 或 `.then()` 等待這個 Promise。

例如使用 `await`：

```jsx
const ticker = await mockFetchTicker("BTCUSDT", signal);

// 800ms 後，ticker 會取得 resolve 傳入的物件：
// {
//   symbol: "BTCUSDT",
//   price: 64000,
// }
```

使用 `.then()` 也是相同概念：

```jsx
mockFetchTicker("BTCUSDT", signal).then(ticker => {
  // ticker 就是 resolve 傳入的物件。
  console.log(ticker);
});
```

在這個 `useQuery` 案例中：

```jsx
const tickerQuery = useQuery({
  queryKey: ["ticker", symbol],
  queryFn: ({ signal }) => mockFetchTicker(symbol, signal),
});
```

可以把 TanStack Query 內部的行為簡化想成：

```jsx
const data = await queryFn();
```

所以資料的傳遞順序是：

```text
resolve(行情物件)
  → 成為 mockFetchTicker 回傳的 Promise 成功結果
  → 成為 queryFn 的成功結果
  → TanStack Query 寫入目前 queryKey 的 cache
  → 元件從 tickerQuery.data 取得資料
```

最後在畫面中讀到的就是：

```jsx
tickerQuery.data.symbol;
tickerQuery.data.price;
```

另外，`setTimeout()` 本身回傳的是計時器 ID：

```jsx
const timerId = window.setTimeout(callback, 800);
```

`timerId` 只用於 `clearTimeout(timerId)`；它不是行情資料。真正的行情資料是傳給 `resolve({...})` 的物件。

## 如何操作與觀察

1. 第一次開啟時沒有 BTC cache，因此 `isPending` 和 `isFetching` 都是 `true`，畫面顯示首次載入狀態。
2. 資料出現後按「手動更新」，舊價格仍留在畫面；此時只有 `isFetching` 是 `true`，適合顯示小型的「更新中」。
3. 切換成 ETH，`queryKey` 由 `["ticker", "BTCUSDT"]` 變成 `["ticker", "ETHUSDT"]`，因此會建立另一份 cache。
4. 在 `15` 秒內切回 BTC，會直接讀取 fresh cache，不需要再次等待 request。
5. 快速連續切換不同交易對，舊 query 若變成 inactive，傳入 mock request 的 `signal` 可以中止不再需要的工作。
6. 按「模擬錯誤」，觀察沒有成功資料時的 error UI；按「重試」會再次執行相同 query 的 `queryFn`。

## 實際 API 版本

換成真正後端時，保留相同函式介面，並且記得檢查 `response.ok`：

```jsx
async function fetchTicker(symbol, signal) {
  const response = await fetch(`/api/tickers/${symbol}`, { signal });

  if (!response.ok) {
    throw new Error(`取得行情失敗：${response.status}`);
  }

  return response.json();
}

const tickerQuery = useQuery({
  queryKey: ["ticker", symbol],
  queryFn: ({ signal }) => fetchTicker(symbol, signal),
  staleTime: 15_000,
});
```

`fetch` 收到 `404`、`500` 等 HTTP response 時不會自動 reject，所以需要主動 `throw`；TanStack Query 才會把 query 切換到 error 狀態並依設定重試。

## 這題真正要觀察什麼？

```text
component 訂閱 ["ticker", symbol]
          ↓
QueryClient 依 queryKey 尋找 cache
          ↓
有 fresh data ───────────────→ 直接顯示
          ↓ 沒有／需要更新
queryFn({ signal }) 取得資料
          ↓
成功結果寫入對應 key 的 cache
          ↓
所有訂閱相同 key 的 component 更新
```

`useQuery` 管理的是一份具有 identity、生命週期與多個 observers 的 server cache，不只是把 `fetch` 包進 Hook。元件宣告自己需要哪份資料，QueryClient 再根據 cache 狀態與設定決定是否執行 `queryFn`。

## `isPending` 與 `isFetching` 的 UI 分工

| 情況 | `isPending` | `isFetching` | 建議 UI |
| --- | --- | --- | --- |
| 第一次取得，尚無成功資料 | `true` | `true` | Skeleton 或主要 loading |
| 已有資料，沒有 request | `false` | `false` | 正常顯示資料 |
| 已有資料，背景更新中 | `false` | `true` | 保留資料，加小 spinner |

如果只看 `isFetching` 並在它為 `true` 時把整張卡換成 loading，手動更新或視窗聚焦 refetch 時就會讓舊資料消失，造成不必要的畫面閃爍。

## 為什麼 `QueryClient` 放在 component 外面？

```jsx
const queryClient = new QueryClient();
```

Browser app 通常需要一個穩定的 client。若在 `App` function body 裡每次 `new QueryClient()`，重新 render 時可能建立新的 cache coordinator，原有 cache 與 observers 就無法穩定共用。

## 面試回答

> 我會用 `useQuery` 管理可快取的 server read。`queryKey` 是 cache identity，因此 `queryFn` 使用且會影響回傳結果的變數，例如 `symbol`，都要放進 key。第一次沒有資料時用 `isPending` 呈現主要 loading，已有資料的背景更新則用 `isFetching` 顯示較輕量的提示。request 支援取消時，我也會把 query function context 的 `signal` 傳到底層 `fetch`。

## 常見錯誤

```jsx
// ❌ symbol 改變，但所有商品仍共用同一份 cache。
useQuery({
  queryKey: ["ticker"],
  queryFn: () => fetchTicker(symbol),
});

// ❌ render 時已經執行函式；queryFn 應該是一個 function。
useQuery({
  queryKey: ["ticker", symbol],
  queryFn: fetchTicker(symbol),
});

// ❌ HTTP 500 不會讓 fetch 自動 reject，錯誤內容可能被當成成功資料。
async function fetchTicker(symbol) {
  const response = await fetch(`/api/tickers/${symbol}`);
  return response.json();
}

// ❌ 每次 render 都可能建立新的 QueryClient。
function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

官方參考：[TanStack Query `useQuery`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)、[Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)、[Query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)

[回到 Server / Global State 六題練習](/docs/frontend-interview/binance/third-party-server-global-hooks-drills#tanstack-query-usequery訂閱一份-server-cache)
