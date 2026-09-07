---
sidebar_position: 4
sidebar_label: "第三方 Hooks 入門"
slug: "/frontend-interview/binance/react-third-party-hooks"
title: "React 常用第三方 Hooks：React Query、Redux、Router、表單"
description: "給 React 初學者與 Vue 工程師的第三方 Hooks 入門，解釋 useQuery、useMutation、useQueryClient、useSelector、useDispatch、useNavigate、useParams、useSearchParams 與 useForm。"
tags:
  - React
  - Hooks
  - React Query
  - Redux
  - Interview
keywords: ["React 第三方 Hooks", "useQuery 教學", "useMutation 教學", "useQueryClient", "useSelector", "useDispatch", "useNavigate", "useParams", "useSearchParams", "useForm", "TanStack Query 入門", "Binance 前端面試"]
---

# React 常用第三方 Hooks 入門

React 只內建一部分 Hooks，例如 `useState`、`useEffect`、`useMemo`。實務專案還會從其他套件引入 Hooks，所以看到名稱以 `use` 開頭，不代表它一定是 React 內建功能。

先養成一個習慣：**看到不熟悉的 Hook，第一眼先看 import。**

```tsx
import { useState } from "react";
// React 內建 Hook

import { useQuery, useMutation } from "@tanstack/react-query";
// TanStack Query 提供的第三方 Hooks

import { useSelector, useDispatch } from "react-redux";
// React Redux 提供的第三方 Hooks

import { useSubmitOrder } from "./hooks/useSubmitOrder";
// 專案自己封裝的 custom Hook
```

## 先分清楚三種 Hook

| 種類 | 從哪裡來 | 例子 |
| --- | --- | --- |
| React 內建 Hook | `react` | `useState`、`useEffect`、`useMemo`、`useRef` |
| 第三方 Hook | npm 套件 | `useQuery`、`useSelector`、`useNavigate`、`useForm` |
| 專案自訂 Hook | 專案自己的檔案 | `useSubmitOrder`、`useTickerSocket` |

第三方 Hook 和自訂 Hook 仍然要遵守 React Hooks 規則：

- 只能在 React function component 或其他 Hook 裡呼叫。
- 要放在最上層，不能隨意放進 `if`、`for` 或一般 callback。
- Hook 名稱通常以 `use` 開頭。

## Binance 前端面試的學習優先順序

| 優先級 | 套件 | 先會哪些 Hooks | 交易頁用途 |
| --- | --- | --- | --- |
| P0 | TanStack Query | `useQuery`、`useMutation`、`useQueryClient` | 行情、餘額、訂單、交易規則、下單 |
| P0 | React Redux | `useSelector`、`useDispatch` | 目前交易對、版面、全域 UI 狀態 |
| P1 | React Router | `useParams`、`useSearchParams`、`useNavigate` | 從 URL 取得 symbol、週期、tab，切換頁面 |
| P1 | React Hook Form | `useForm` | 表單欄位、驗證、錯誤、送出 |

不用一次背完整套件。先知道每個 Hook 的「資料從哪來、何時執行、回傳什麼、什麼事情會讓畫面更新」。

## Provider：為什麼 Hook 不是 import 後就一定能用？

很多第三方 Hooks 會從 React Context 取得共用物件，因此應用程式外層要先放對應的 Provider。

| Hooks | 外層通常需要 |
| --- | --- |
| `useQuery`、`useMutation`、`useQueryClient` | `QueryClientProvider` |
| `useSelector`、`useDispatch` | React Redux 的 `Provider` |
| `useParams`、`useNavigate` 等 Router Hooks | `BrowserRouter` 或 `RouterProvider` |
| 基本的 `useForm` | 不需要全域 Provider |

概念可以想成：

```text
Provider 在上層提供共用工具
  → 子元件的第三方 Hook 從 Context 取得工具
  → Hook 訂閱資料或回傳操作方法
```

以 TanStack Query 為例，應用程式入口通常先設定：

```tsx
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

後面的 `useQueryClient()` 取得的就是這個 `queryClient`。

---

## TanStack Query：管理伺服器資料

TanStack Query（以前常被稱為 React Query）主要管理 server state，例如：

- 最新行情。
- 未成交訂單。
- 帳戶餘額。
- 交易規則。
- API 的 loading、error、cache 與重新取得。

先記住三個核心 Hooks：

| Hook | 最簡單的中文理解 |
| --- | --- |
| `useQuery` | 讀取、快取並訂閱伺服器資料 |
| `useMutation` | 準備一個修改伺服器資料的操作 |
| `useQueryClient` | 取得 React Query 的快取管理器 |

### `useQuery`：讀取並訂閱資料

先不要把 `useQuery` 想成「幫我呼叫一次 `fetch`」。比較準確的理解是：

> 元件用 `queryKey` 指定自己要訂閱哪一份伺服器資料；TanStack Query 再決定要使用 cache，還是執行 `queryFn` 取得資料。

一個最基本的 query 有兩個必要角色：

| 設定 | 負責什麼 | 可以怎麼想 |
| --- | --- | --- |
| `queryKey` | 唯一識別這份資料 | cache 的地址、資料的身分證 |
| `queryFn` | 真正取得這份資料 | 知道怎麼呼叫 API 的函式 |

`staleTime`、`enabled` 等其他設定，都是在控制「何時要執行 `queryFn`」以及「資料多久算新鮮」。

```tsx
import { useQuery } from "@tanstack/react-query";

type Ticker = {
  symbol: string;
  lastPrice: string;
};

async function fetchTicker(symbol: string): Promise<Ticker> {
  const res = await fetch(`/api/ticker?symbol=${symbol}`);

  if (!res.ok) {
    throw new Error("取得行情失敗");
  }

  return res.json();
}

function TickerCard({ symbol }: { symbol: string }) {
  // 例如 symbol 是 "BTCUSDT" 時，這份資料的身分就是：
  // ["ticker", "BTCUSDT"]
  const tickerQuery = useQuery({
    queryKey: ["ticker", symbol],
    queryFn: () => fetchTicker(symbol),
    staleTime: 3_000,
  });

  if (tickerQuery.isPending) return <p>第一次載入中</p>;
  if (tickerQuery.isError) return <p>{tickerQuery.error.message}</p>;

  return <strong>{tickerQuery.data.lastPrice}</strong>;
}
```

把範例中最重要的兩行單獨拿出來看：

```tsx
queryKey: ["ticker", symbol],       // 我要哪一份資料？
queryFn: () => fetchTicker(symbol), // 這份資料要怎麼取得？
```

這裡不是 `useQuery()` 一執行就無條件呼叫 API。比較精確的流程是：

```text
元件 render
  → useQuery 訂閱 ["ticker", symbol] 這個 query
  → React Query 檢查這個 key 的 cache
  → 有可直接使用的 fresh data：先使用 cache
  → 沒有資料或需要重新取得：執行 queryFn
  → queryFn 呼叫 fetchTicker(symbol)
  → 成功資料寫入 cache
  → 訂閱這個 key 的元件重新 render
```

#### `queryKey` 到底該怎麼定義？

先記一個最實用的規則：

> `queryFn` 讀取、而且會改變 API 回傳結果的變數，通常都要放進 `queryKey`。

定義時可以由左到右依照「從大範圍到具體條件」排列：

```tsx
[資料種類, 識別值或查詢條件]
```

以行情為例：

```tsx
queryKey: ["ticker", symbol]
//         └─ 種類    └─ 哪一個交易對
```

當 `symbol` 不同，完整的 key 也不同：

```tsx
["ticker", "BTCUSDT"] // BTC 行情的 cache
["ticker", "ETHUSDT"] // ETH 行情的 cache
```

因此這是兩份不同的 cache。元件從 BTC 切換到 ETH 時，`queryKey` 會跟著改變，`useQuery` 會改為訂閱 ETH 的資料；如果 ETH 沒有可用的 fresh cache，才執行對應的 `queryFn`。

可以按照以下三步驟決定 key：

1. **先寫資料種類**：例如 `"ticker"`、`"orders"`、`"balances"`。
2. **加入資料的識別值**：例如 `symbol`、`orderId`、`accountId`。
3. **加入會改變回傳結果的查詢條件**：例如 `status`、`page`、`sort`。

| 想取得的資料 | `queryFn` 使用的條件 | 合理的 `queryKey` |
| --- | --- | --- |
| 全站共用的交易規則 | 沒有變動參數 | `["exchangeInfo"]` |
| 某個交易對的行情 | `symbol` | `["ticker", symbol]` |
| 某一筆訂單 | `orderId` | `["order", orderId]` |
| 篩選、分頁後的訂單 | `symbol`、`status`、`page` | `["orders", { symbol, status, page }]` |
| 某帳戶的餘額 | `accountId` | `["accounts", accountId, "balances"]` |

例如 API 同時受到三個條件影響：

```tsx
function Orders({ symbol, status, page }: OrdersProps) {
  const ordersQuery = useQuery({
    queryKey: ["orders", { symbol, status, page }],
    queryFn: () => fetchOrders({ symbol, status, page }),
  });

  // ...
}
```

如果漏掉 `page`：

```tsx
useQuery({
  queryKey: ["orders", { symbol, status }], // 錯：沒有 page
  queryFn: () => fetchOrders({ symbol, status, page }),
});
```

第 1 頁和第 2 頁就會被當成同一份資料，可能讀到彼此的 cache。反過來說，如果某個值只控制畫面樣式、完全不影響 API 結果，例如 `isSidebarOpen`，就不該放進 key，否則同一份伺服器資料會被拆成多份不必要的 cache。

`queryKey` 的幾個重要特性：

- 最外層使用陣列。
- 陣列項目的順序有差：`["orders", status, page]` 和 `["orders", page, status]` 是不同的 key。
- key 裡的物件會被穩定地雜湊；`{ status, page }` 和 `{ page, status }` 會被視為同一組條件。
- 不要放 `Math.random()`、目前時間或每次都變動的值，否則每次都像是在訂閱新資料。
- 同一個專案要維持一致命名；`["ticker", symbol]` 和 `["tickers", symbol]` 會是不同的 cache。

所以你可以把判斷濃縮成一句話：

```text
兩次 API 呼叫若可能得到不同資料，就要讓它們的 queryKey 不同。
兩次 API 呼叫若代表同一份資料，就應該使用相同的 queryKey。
```

key 採用由大到小的結構，之後也比較容易一次讓整組資料失效：

```tsx
queryClient.invalidateQueries({ queryKey: ["ticker"] });
// 可以比對所有以 ["ticker"] 開頭的 queries，
// 例如 ["ticker", "BTCUSDT"]、["ticker", "ETHUSDT"]。
```

#### `queryFn` 才是真正呼叫 API 的函式

```tsx
queryFn: () => fetchTicker(symbol)
```

React Query 判斷需要取得資料時，才會呼叫 `queryFn`。不要寫成：

```tsx
queryFn: fetchTicker(symbol) // 錯：render 時就先執行了
```

#### 常看的 query 狀態

| 狀態 | 意思 |
| --- | --- |
| `data` | 最近一次成功取得的資料 |
| `isPending` | 目前還沒有成功資料 |
| `isFetching` | `queryFn` 現在正在執行，包含背景重新取得 |
| `isError` | query 目前是錯誤狀態 |
| `error` | query 拋出的錯誤 |
| `isStale` | 目前資料被視為可能過期 |

> 完整實作：[`useQuery`：切換並更新交易行情](/docs/frontend-interview/binance/practical-cases/use-query)

`isPending` 和 `isFetching` 不完全相同：

```text
第一次載入，還沒有資料
  → isPending: true
  → isFetching: true

畫面已有舊資料，正在背景更新
  → isPending: false
  → isFetching: true
```

### `useMutation`：準備修改資料的操作

mutation 通常用在會改變伺服器狀態的操作：

- 新增訂單。
- 取消訂單。
- 修改槓桿。
- 更新使用者設定。

```tsx
import { useMutation } from "@tanstack/react-query";

type SubmitOrderInput = {
  symbol: string;
  side: "buy" | "sell";
  price: string;
  quantity: string;
};

async function submitOrder(input: SubmitOrderInput) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("下單失敗");
  return res.json();
}

function OrderButton() {
  const orderMutation = useMutation({
    mutationFn: submitOrder,
  });

  function handleClick() {
    orderMutation.mutate({
      symbol: "BTCUSDT",
      side: "buy",
      price: "65000",
      quantity: "0.01",
    });
  }

  return (
    <button disabled={orderMutation.isPending} onClick={handleClick}>
      {orderMutation.isPending ? "下單中" : "送出訂單"}
    </button>
  );
}
```

最容易誤會的地方是：

> 呼叫 `useMutation(...)` 只是建立 mutation controller，不會立刻送出 POST。真正開始下單的是 `orderMutation.mutate(input)`。

完整流程：

```text
元件 render
  → useMutation 建立 mutation controller
  → 此時 status 是 idle，沒有送 API

使用者按下按鈕
  → handleClick 執行
  → orderMutation.mutate(input)
  → React Query 內部把 status 改成 pending
  → isPending 自動變成 true
  → mutationFn(input) 執行
  → submitOrder(input) 發送 POST
  → 成功：status 變成 success
  → 失敗：status 變成 error
```

程式不需要自己寫：

```tsx
setIsPending(true);
```

`status`、`isPending`、`isError`、`error` 和 `data` 都由 `useMutation` 管理。

> 完整實作：[`useMutation`：送出限價單並更新未成交訂單](/docs/frontend-interview/binance/practical-cases/use-mutation)

#### `mutate(input)` 的 input 去了哪裡？

```text
orderMutation.mutate(input)
                       │
                       ├── 傳給 mutationFn(input)
                       ├── 成功時傳給 onSuccess(data, input)
                       └── 失敗時傳給 onError(error, input)
```

```tsx
const orderMutation = useMutation({
  mutationFn: submitOrder,
  onSuccess: (data, input) => {
    console.log("後端回傳", data);
    console.log("原本送出的參數", input);
  },
  onError: (error, input) => {
    console.log(`${input.symbol} 下單失敗`, error);
  },
});
```

#### `mutate` 和 `mutateAsync`

```tsx
orderMutation.mutate(input);
```

適合用 mutation 自己的 `onSuccess`、`onError` 處理生命週期。

```tsx
try {
  const order = await orderMutation.mutateAsync(input);
  console.log(order);
} catch (error) {
  console.error(error);
}
```

需要在同一段 async 程式中等待結果時，可以使用 `mutateAsync`。

### `useQueryClient`：取得快取管理器

```tsx
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

function useSubmitOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOrder,
    onSuccess: async (_data, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["openOrders", input.symbol],
        }),
        queryClient.invalidateQueries({
          queryKey: ["balances"],
        }),
      ]);
    },
  });
}
```

`useQueryClient()` 不會自己抓資料，也不會自己下單。它只是讓元件或 custom Hook 取得同一個 `QueryClient`，以便操作快取。

常見方法：

| 方法 | 用途 |
| --- | --- |
| `invalidateQueries` | 把符合的 query 標記為 stale，使用中的 query 預設會重新取得 |
| `setQueryData` | 直接更新某個 key 的 cache |
| `getQueryData` | 讀取某個 key 現有的 cache |
| `removeQueries` | 移除符合條件的 cache |

下單後的資料流：

```text
useQuery(["openOrders", "BTCUSDT"])
  → 畫面目前顯示未成交訂單 A

useMutation + mutate(newOrder)
  → POST 建立新訂單成功

useQueryClient().invalidateQueries(["openOrders", "BTCUSDT"])
  → 原本的訂單 cache 被標記為 stale
  → 正在使用這份 query 的畫面重新執行 queryFn
  → 取得包含新訂單的資料 B
  → 訂單列表重新 render
```

### `useQuery` 與 `useMutation` 快速比較

| 問題 | `useQuery` | `useMutation` |
| --- | --- | --- |
| 用途 | 讀資料 | 新增、修改、刪除資料 |
| 是否通常自動執行 | 是，訂閱後依 cache 與設定判斷 | 否，要呼叫 `mutate` |
| 核心函式 | `queryFn` | `mutationFn` |
| 輸入從哪來 | 通常由 closure / `queryKey` 帶入 | `mutate(input)` 傳入 |
| 結果放哪裡 | Query Cache | Mutation Cache / mutation result |
| 成功後常做什麼 | 顯示資料 | invalidate 或更新相關 query cache |

### TanStack Query 常見誤解

| 誤解 | 正確理解 |
| --- | --- |
| `useQuery` 就是 `fetch` | 它還管理 cache、狀態、訂閱、重試與重新取得 |
| 呼叫 `useMutation` 就會送 API | 呼叫 `mutate` 或 `mutateAsync` 才執行 |
| `invalidateQueries` 會再下一次單 | 它影響 query cache，不是重跑 mutation |
| `isPending` 要自己 `setState` | React Query 依 mutation 狀態自動提供 |
| `staleTime: 3000` 是每 3 秒輪詢 | 只是 3 秒內視為 fresh；輪詢要用 `refetchInterval` |

---

## React Redux：讀取與修改全域 client state

Redux 常用來管理跨很多元件共享的前端狀態，例如：

- 目前選擇的交易對。
- 目前 K 線週期。
- 手機版開啟哪一個 panel。
- 使用者的 UI 偏好。

餘額、訂單等伺服器資料通常優先交給 TanStack Query，不要全部塞進 Redux。

### `useSelector`：從 Redux store 讀資料

```tsx
import { useSelector } from "react-redux";

function CurrentSymbol() {
  const symbol = useSelector(
    (state: RootState) => state.trading.currentSymbol,
  );

  return <strong>{symbol}</strong>;
}
```

`useSelector` 會：

1. 執行 selector，從整個 store 選出需要的值。
2. 訂閱 Redux store。
3. action 發生後再次執行 selector。
4. selector 結果改變時，讓元件重新 render。

### `useDispatch`：取得送出 action 的函式

```tsx
import { useDispatch } from "react-redux";
import { changeSymbol } from "./tradingSlice";

function SymbolButton() {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(changeSymbol("ETHUSDT"))}>
      切換成 ETH
    </button>
  );
}
```

心智模型：

```text
useSelector：store → component
useDispatch：component → action → reducer → store
```

---

## React Router：從網址讀狀態與切換頁面

交易頁常把重要狀態放進 URL，例如：

```text
/trade/BTCUSDT?interval=5m&tab=open-orders
```

這樣重新整理、分享網址、瀏覽器上一頁才會符合預期。

### `useParams`：讀取路徑參數

假設 route 是：

```tsx
<Route path="/trade/:symbol" element={<TradePage />} />
```

元件可以讀取 `:symbol`：

```tsx
import { useParams } from "react-router-dom";

function TradePage() {
  const { symbol } = useParams();

  return <h1>{symbol}</h1>;
}
```

### `useSearchParams`：讀取或修改 query string

```tsx
import { useSearchParams } from "react-router-dom";

function IntervalSelector() {
  const [searchParams, setSearchParams] = useSearchParams();
  const interval = searchParams.get("interval") ?? "1m";

  return (
    <button onClick={() => setSearchParams({ interval: "5m" })}>
      目前：{interval}
    </button>
  );
}
```

呼叫 `setSearchParams` 會更新 URL，並觸發一次 navigation。

### `useNavigate`：用程式切換網址

```tsx
import { useNavigate } from "react-router-dom";

function GoToEthButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/trade/ETHUSDT")}>
      前往 ETH 交易頁
    </button>
  );
}
```

一般可以點擊的導覽優先考慮 `<Link>`；需要在事件完成後切頁時，才常使用 `navigate(...)`。

---

## React Hook Form：管理表單

簡單表單可用 `useState`。欄位、驗證與錯誤很多時，常使用 React Hook Form 的 `useForm`。

```tsx
import { useForm } from "react-hook-form";

type OrderFormValues = {
  price: string;
  quantity: string;
};

function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>();

  async function onSubmit(values: OrderFormValues) {
    console.log(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("price", {
          required: "請輸入價格",
        })}
      />
      {errors.price && <p>{errors.price.message}</p>}

      <input
        {...register("quantity", {
          required: "請輸入數量",
        })}
      />
      {errors.quantity && <p>{errors.quantity.message}</p>}

      <button disabled={isSubmitting} type="submit">
        送出
      </button>
    </form>
  );
}
```

核心回傳值：

| 名稱 | 用途 |
| --- | --- |
| `register` | 把 input 註冊進表單並設定驗證規則 |
| `handleSubmit` | 先執行驗證，成功後才呼叫你的 `onSubmit` |
| `formState.errors` | 儲存欄位錯誤 |
| `formState.isSubmitting` | 非同步 submit 執行期間為 `true` |
| `watch` | 讀取並訂閱欄位值 |
| `setValue` | 用程式設定欄位值 |

注意：表單驗證成功不代表交易一定合法。tick size、step size、min notional、可用餘額與風控規則仍要由後端做最後判斷。

---

## 專案自訂 Hook：把第三方 Hook 包成業務語言

```tsx
function useSubmitOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitOrder,
    onSuccess: (_data, input) => {
      return queryClient.invalidateQueries({
        queryKey: ["openOrders", input.symbol],
      });
    },
  });
}
```

這裡有三層：

```text
React 內建 Hooks
  → 第三方套件用它們做出 useMutation、useQueryClient
  → 專案再封裝成有業務意義的 useSubmitOrder
```

元件不需要知道所有 cache 細節，只要使用：

```tsx
const orderMutation = useSubmitOrder();
orderMutation.mutate(input);
```

自訂 Hook 的價值是重用行為、集中規則，以及讓元件程式碼更接近產品語言。

## 看到陌生 Hook 時的閱讀步驟

以後看到任何 `useXxx`，依序問：

1. **從哪裡 import？** React 內建、第三方套件，還是專案自訂？
2. **需要哪個 Provider？** 沒有 Provider 是否會報錯？
3. **它是在讀資料還是提供操作方法？**
4. **真正觸發工作的時機是什麼？** render、event、`mutate()`，還是 effect 後？
5. **輸入在哪裡？** options、argument、query key、closure？
6. **回傳什麼？** data、狀態、setter、dispatch、navigate function？
7. **什麼變化會讓元件重新 render？**
8. **成功、失敗與 cleanup 怎麼處理？**

套用到 `useMutation`：

| 問題 | 答案 |
| --- | --- |
| 從哪裡來？ | `@tanstack/react-query` |
| 需要什麼？ | 上層的 `QueryClientProvider` |
| 用途？ | 管理修改伺服器資料的操作 |
| 何時執行？ | 呼叫 `mutate` / `mutateAsync` 時 |
| 輸入？ | `mutate(input)` 的 `input` |
| 回傳？ | `mutate`、`isPending`、`isError`、`data` 等 |
| 何時重新 render？ | mutation 狀態或元件讀取的結果改變時 |
| 成功後？ | 常用 `onSuccess` 更新或 invalidate query cache |

## 面試前最少要能口述

> `useQuery` 用來訂閱與快取伺服器資料，query key 是快取身份，query function 是實際抓資料的函式。`useMutation` 用來管理新增、修改、刪除等伺服器操作；建立 mutation 不會立即執行，要呼叫 `mutate`。mutation 成功後，我會依後端回傳資料直接更新 cache，或使用 `useQueryClient().invalidateQueries` 讓相關 query 重新取得。

下一步可以接著看：

- [React 術語中文對照與交易頁程式碼範例](/docs/frontend-interview/binance/react-terms-code-examples)
- [React 狀態管理面試：Redux / React Query](/docs/frontend-interview/binance/react-state-data)

## 官方文件

- [TanStack Query：useQuery](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery)
- [TanStack Query：Query Keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys)
- [TanStack Query：Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)
- [TanStack Query：Invalidations from Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [React Router Hooks](https://reactrouter.com/api/hooks/useNavigate)
- [React Hook Form：useForm](https://react-hook-form.com/docs/useform)
