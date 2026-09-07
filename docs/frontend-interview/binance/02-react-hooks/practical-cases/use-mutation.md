---
sidebar_position: 16
slug: "/frontend-interview/binance/practical-cases/use-mutation"
title: "useMutation"
description: "用交易下單實作 useMutation 的事件觸發、variables、pending、錯誤處理與成功後同步 Query Cache。"
tags: [React, Hooks, TanStack Query, useMutation, Server State, Interview]
---

# useMutation

## 實際情境：送出限價單並更新未成交訂單

交易頁已經用 `useQuery` 顯示未成交訂單。當使用者送出一張限價單時，需要處理一次會改變 server state 的寫入流程：

- 只有按下送出按鈕時才執行 POST，不在 render 時自動執行。
- 把這次表單資料透過 `mutate(variables)` 傳給 `mutationFn`。
- Request 進行中鎖住表單，避免使用者重複點擊。
- 成功時顯示 server 確認的訂單，並更新 `['orders', symbol]` cache。
- 失敗時保留原本的訂單列表並顯示錯誤。
- 每次送單帶上 `clientRequestId`；正式環境應由後端提供 idempotency contract。

## 安裝

先在 React 專案安裝 TanStack Query：

```bash
npm install @tanstack/react-query
```

## 完整可操作範例

以下是單檔 `App.jsx` 範例。它用延遲 Promise 模擬查詢訂單與送單 API，因此不需要外部後端；實務上只要把 `mockFetchOrders` 與 `mockPostOrder` 換成真正的 request 函式。

```jsx
import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

let nextOrderId = 1002;
let serverOrders = [
  {
    id: "order-1001",
    symbol: "BTCUSDT",
    side: "buy",
    price: 62000,
    quantity: 0.01,
    status: "OPEN",
    createdAt: "09:30:00",
  },
];

function mockFetchOrders(symbol) {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve(serverOrders.filter(order => order.symbol === symbol));
    }, 400);
  });
}

function mockPostOrder(input) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (input.simulateError) {
        reject(new Error("可用餘額不足，訂單未建立"));
        return;
      }

      if (input.price <= 0 || input.quantity <= 0) {
        reject(new Error("價格與數量必須大於 0"));
        return;
      }

      const confirmedOrder = {
        id: `order-${nextOrderId++}`,
        symbol: input.symbol,
        side: input.side,
        price: input.price,
        quantity: input.quantity,
        status: "OPEN",
        createdAt: new Date().toLocaleTimeString(),
        clientRequestId: input.clientRequestId,
      };

      serverOrders = [confirmedOrder, ...serverOrders];
      resolve(confirmedOrder);
    }, 900);
  });
}

function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createOrder"],
    mutationFn: mockPostOrder,
    // 寫入是否能重試取決於後端的冪等設計，這裡不自動重試。
    retry: false,
    onSuccess: confirmedOrder => {
      // POST 回傳完整訂單，因此可直接把 server 結果寫進既有列表 cache。
      queryClient.setQueryData(
        ["orders", confirmedOrder.symbol],
        oldOrders => [confirmedOrder, ...(oldOrders ?? [])],
      );
    },
  });
}

function OrderScreen() {
  const symbol = "BTCUSDT";
  const [side, setSide] = useState("buy");
  const [price, setPrice] = useState("65000");
  const [quantity, setQuantity] = useState("0.01");
  const [simulateError, setSimulateError] = useState(false);

  const ordersQuery = useQuery({
    queryKey: ["orders", symbol],
    queryFn: () => mockFetchOrders(symbol),
  });

  const createOrder = useCreateOrder();

  function handleSubmit(event) {
    event.preventDefault();

    createOrder.mutate({
      symbol,
      side,
      price: Number(price),
      quantity: Number(quantity),
      simulateError,
      // 正式專案通常使用 UUID，並讓 server 依此 key 防止重複建立。
      clientRequestId: `${Date.now()}-${Math.random()}`,
    });
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <h1>BTCUSDT 限價單</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: 14,
          padding: 20,
          border: "1px solid #d1d5db",
          borderRadius: 12,
        }}
      >
        <fieldset
          disabled={createOrder.isPending}
          style={{ display: "grid", gap: 14, border: 0, padding: 0 }}
        >
          <legend style={{ fontWeight: 700, marginBottom: 12 }}>建立訂單</legend>

          <label>
            方向
            <select
              value={side}
              onChange={event => setSide(event.target.value)}
              style={{ display: "block", width: "100%", padding: 8 }}
            >
              <option value="buy">買入</option>
              <option value="sell">賣出</option>
            </select>
          </label>

          <label>
            價格
            <input
              type="number"
              min="0.01"
              step="0.01"
              required
              value={price}
              onChange={event => setPrice(event.target.value)}
              style={{ display: "block", width: "100%", padding: 8 }}
            />
          </label>

          <label>
            數量
            <input
              type="number"
              min="0.0001"
              step="0.0001"
              required
              value={quantity}
              onChange={event => setQuantity(event.target.value)}
              style={{ display: "block", width: "100%", padding: 8 }}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={simulateError}
              onChange={event => setSimulateError(event.target.checked)}
            />{" "}
            模擬下單失敗
          </label>

          <button type="submit">
            {createOrder.isPending ? "送單中…" : "送出限價單"}
          </button>
        </fieldset>
      </form>

      {createOrder.isError && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          下單失敗：{createOrder.error.message}
        </p>
      )}

      {createOrder.isSuccess && (
        <p role="status" style={{ color: "#047857" }}>
          訂單 {createOrder.data.id} 已建立，server 狀態為
          {" "}{createOrder.data.status}。
        </p>
      )}

      <section style={{ marginTop: 28 }}>
        <h2>未成交訂單</h2>

        {ordersQuery.isPending && <p>讀取訂單中…</p>}

        {ordersQuery.isError && (
          <p role="alert">訂單讀取失敗：{ordersQuery.error.message}</p>
        )}

        {ordersQuery.data?.length === 0 && <p>目前沒有未成交訂單。</p>}

        {ordersQuery.data?.map(order => (
          <article
            key={order.id}
            style={{
              marginTop: 10,
              padding: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 8,
            }}
          >
            <strong style={{ color: order.side === "buy" ? "#047857" : "#b91c1c" }}>
              {order.side === "buy" ? "買入" : "賣出"} {order.symbol}
            </strong>
            <div>
              價格 {order.price.toLocaleString()} · 數量 {order.quantity}
            </div>
            <small>
              {order.id} · {order.status} · {order.createdAt}
            </small>
          </article>
        ))}
      </section>

      <aside
        style={{
          marginTop: 20,
          padding: 16,
          borderRadius: 8,
          background: "#f3f4f6",
          lineHeight: 1.7,
        }}
      >
        <strong>mutation status：</strong>
        <code>{createOrder.status}</code>
        <br />
        <strong>目前 variables：</strong>
        <code>
          {createOrder.variables
            ? JSON.stringify({
                side: createOrder.variables.side,
                price: createOrder.variables.price,
                quantity: createOrder.variables.quantity,
              })
            : "尚未送單"}
        </code>
      </aside>
    </main>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OrderScreen />
    </QueryClientProvider>
  );
}
```

## Hook 在什麼時候真的送出 request？

呼叫 `useCreateOrder()` 只會建立 mutation observer，初始狀態是 `idle`：

```jsx
const createOrder = useCreateOrder();
```

真正開始寫入的是 submit event 中的 `mutate`：

```jsx
createOrder.mutate({
  symbol: "BTCUSDT",
  side: "buy",
  price: 65000,
  quantity: 0.01,
});
```

完整資料流是：

```text
render
  → useMutation 建立 observer，status = "idle"

使用者送出表單
  → mutate(orderInput)
  → status = "pending"
  → mutationFn(orderInput)
  → mockPostOrder 建立 server order
     ├─ 成功：status = "success"，結果放進 data，執行 onSuccess
     └─ 失敗：status = "error"，錯誤放進 error
```

`orderInput` 也會保留在 `createOrder.variables`，因此 pending 或 error UI 可以知道這次操作的是哪一份輸入。

## 為什麼成功後訂單列表會更新？

Mutation 的成功結果會放在 `createOrder.data`，但它**不會自動加入** `useQuery` 的訂單列表 cache。TanStack Query 不知道「建立訂單」會影響哪幾個 query keys，因此範例在 `onSuccess` 明確連接兩者：

```jsx
onSuccess: confirmedOrder => {
  queryClient.setQueryData(
    ["orders", confirmedOrder.symbol],
    oldOrders => [confirmedOrder, ...(oldOrders ?? [])],
  );
},
```

資料流可以分成兩條：

```text
POST 成功結果
  ├─ mutation.data：提供這次操作的成功訊息
  └─ setQueryData(["orders", symbol])：更新共享訂單列表
                                           ↓
                              訂閱相同 key 的 useQuery 重畫
```

使用 server 回傳的 `confirmedOrder` 更新 cache，而不是直接加入表單 draft，因為真正的 `id`、`status`、成交規則或正規化後的數值通常由 server 決定。

## `setQueryData` 與 `invalidateQueries` 怎麼選？

本例的 POST 會回傳一筆完整訂單，因此直接更新 cache 可以立刻呈現，也不需要多發一次 GET：

```jsx
queryClient.setQueryData(["orders", symbol], oldOrders => [
  confirmedOrder,
  ...(oldOrders ?? []),
]);
```

若送單同時影響餘額、風險額度、不同篩選條件的訂單列表，或 API 回傳資訊不完整，讓相關 queries 失效通常比較可靠：

```jsx
const createOrder = useMutation({
  mutationFn: postOrder,
  onSuccess: async (_confirmedOrder, input) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["orders", input.symbol],
      }),
      queryClient.invalidateQueries({ queryKey: ["balances"] }),
    ]);
  },
});
```

`onSuccess` 回傳的 Promise 會被 mutation lifecycle 等待；上例會在兩項 invalidation 完成後才結束這段 callback。

## 如何操作與觀察

1. 第一次開啟時，`useQuery` 會從 mock server 讀取一張既有訂單。
2. 按「送出限價單」後，`mutate(payload)` 才開始執行，mutation status 由 `idle` 變成 `pending`。
3. Pending 期間 `fieldset` 被停用，按鈕顯示「送單中…」。這是 UI 防連點，不等於後端已具備冪等保障。
4. 約 `900ms` 後，server 回傳帶有 `id` 與 `status` 的訂單；`onSuccess` 把它加入 `['orders', 'BTCUSDT']` cache，列表立即更新。
5. 勾選「模擬下單失敗」再送出，觀察 `isError` 與 `error`；原本的訂單 cache 不會被改動。
6. 錯誤後再次送出不需要自行清除 error。下一次 `mutate` 會開始新的 mutation lifecycle。

## 實際 API 版本

接上真正後端時，`mutationFn` 可以改成：

```jsx
async function postOrder(input) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 只有後端實作相同 contract 時，這個 key 才真的能防止重複下單。
      "Idempotency-Key": input.clientRequestId,
    },
    body: JSON.stringify({
      symbol: input.symbol,
      side: input.side,
      price: input.price,
      quantity: input.quantity,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `下單失敗：${response.status}`);
  }

  return response.json();
}
```

`fetch` 收到 `400`、`409`、`500` 等 HTTP response 時不會自動 reject，所以仍要檢查 `response.ok` 並 `throw`；`useMutation` 才會進入 error 狀態。

## `mutate` 與 `mutateAsync`

一般按鈕事件可讓 mutation callbacks 集中管理成功、失敗與 cache 同步：

```jsx
createOrder.mutate(payload);
```

若下一步必須等 server 確認後才能開始，可以使用回傳 Promise 的 `mutateAsync`：

```jsx
async function handleSubmit(payload) {
  try {
    const confirmedOrder = await createOrder.mutateAsync(payload);
    navigate(`/orders/${confirmedOrder.id}`);
  } catch (error) {
    // mutateAsync 會 reject，caller 必須處理錯誤。
    showToast(error.message);
  }
}
```

`mutate()` 回傳 `void`，因此不要寫成 `await createOrder.mutate(payload)`；那不會等待 request 完成。

## 這題真正要觀察什麼？

```text
表單 draft（client state）
          ↓ 使用者 submit
mutate(variables)
          ↓
mutationFn(variables) 執行 server write
          ↓
     成功或失敗
      ↙       ↘
mutation 狀態   Query Cache 一致性
data / error    setQueryData 或 invalidateQueries
```

`useMutation` 管理的是一次命令式 server write 的 lifecycle，不是長期保存訂單列表。訂單列表仍由 `useQuery` 與 Query Cache 管理；mutation 成功後，開發者要明確描述這次寫入如何影響既有 server state cache。

## 面試回答

> 我會用 `useMutation` 管理由事件觸發的 server write。Hook 本身不會送 request，呼叫 `mutate(variables)` 或 `mutateAsync(variables)` 才會執行 `mutationFn`。UI 可以直接讀 `isPending`、`isError` 與 `data` 呈現 lifecycle；成功後再依 API 回傳是否完整，選擇用 `setQueryData` 精確更新 cache，或用 `invalidateQueries` 重新驗證相關資料。下單等非冪等操作不會盲目自動 retry，還需要後端的 idempotency key contract。

## 常見錯誤

```jsx
// ❌ render 時就呼叫 API；mutationFn 必須是一個 function。
useMutation({ mutationFn: postOrder(formData) });

// ❌ mutate 回傳 void，await 不會等到 server response。
const order = await createOrder.mutate(payload);

// ❌ POST 成功不代表訂單 query cache 會自動更新。
useMutation({ mutationFn: postOrder });

// ❌ 直接修改舊 cache，可能讓 observer 無法可靠追蹤 immutable update。
queryClient.setQueryData(["orders", symbol], oldOrders => {
  oldOrders.push(confirmedOrder);
  return oldOrders;
});

// ❌ UI disable 只能減少連點，不能取代 server idempotency。
<button disabled={mutation.isPending}>送單</button>
```

官方參考：[TanStack Query `useMutation`](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)、[Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)、[Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)

[回到 Server / Global State 六題練習](/docs/frontend-interview/binance/third-party-server-global-hooks-drills#tanstack-query-usemutation執行-server-write)
