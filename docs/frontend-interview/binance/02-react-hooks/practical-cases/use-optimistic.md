---
sidebar_position: 13
slug: "/frontend-interview/binance/practical-cases/use-optimistic"
title: "useOptimistic"
description: "用交易下單案例理解 useOptimistic 如何在 Action 進行期間先顯示暫時訂單，成功後換成 server 結果，失敗時回到已確認資料。"
tags: [React 19, Hooks, useOptimistic, Optimistic UI, Interview]
---

# useOptimistic

:::warning React 版本

`useOptimistic` 需要 React 19+。目前這個 Docusaurus 專案使用 React 18，因此以下程式是升級後才能執行的獨立實作題，不要直接 import 到現有 live component。

:::

## `useOptimistic`：Action 進行中先顯示預期結果

交易者送出訂單後，API 可能需要一段時間才會回應。如果畫面完全不變，使用者可能以為沒有按到，再次送出相同訂單。

這個案例會在 request 開始時先加入一筆「送出中」的暫時訂單：

- Server 接受訂單後，暫時訂單會換成具有正式 ID 的確認訂單。
- Server 拒絕訂單後，暫時訂單會自動消失，畫面回到最後一次確認的資料。
- 暫時狀態會明確標示「送出中」，不會假裝交易已經成功。

## 實作題目

請完成一個限價單表單，需求如下：

1. 使用者可以輸入交易對與數量並送出訂單。
2. Action 開始後，清單立刻顯示一筆「送出中」的訂單。
3. 約 1.2 秒後，成功訂單改為「已接受」並顯示 server ID。
4. 輸入 `SOLUSDT` 時模擬 server 拒絕，暫時訂單要消失並顯示錯誤。
5. 已確認訂單是 canonical state；optimistic state 只存在於 Action 期間。
6. Optimistic update function 必須保持 pure，不修改原陣列。

## 參考解答

~~~jsx
import { useOptimistic, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

const initialOrders = [
  {
    id: "ORDER-1001",
    symbol: "ETHUSDT",
    quantity: 0.25,
    status: "confirmed",
  },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createOrderOnServer(draft) {
  await wait(1200);

  // 使用 SOLUSDT 測試失敗後的自動回復。
  if (draft.symbol === "SOLUSDT") {
    throw new Error("SOLUSDT 暫時無法建立訂單");
  }

  return {
    ...draft,
    id: "ORDER-" + Date.now(),
    status: "confirmed",
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "下單中…" : "送出訂單"}
    </button>
  );
}

export default function App() {
  const formRef = useRef(null);
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState("");

  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    orders,
    (currentOrders, draft) => [
      ...currentOrders,
      {
        ...draft,
        status: "pending",
      },
    ],
  );

  async function submitOrder(formData) {
    const symbol = String(formData.get("symbol") ?? "")
      .trim()
      .toUpperCase();
    const quantity = Number(formData.get("quantity"));

    if (!symbol) {
      setError("請輸入交易對");
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("數量必須大於 0");
      return;
    }

    const draft = { symbol, quantity };

    setError("");
    addOptimisticOrder({
      ...draft,
      id: "TEMP-" + Date.now(),
    });

    try {
      const confirmedOrder = await createOrderOnServer(draft);

      // 只有 server 確認後，才更新真正的 orders。
      setOrders((currentOrders) => [
        ...currentOrders,
        confirmedOrder,
      ]);
      formRef.current?.reset();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "下單失敗，請稍後重試",
      );
      // 不更新 orders。Action 結束後，optimistic order 會消失。
    }
  }

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
      <h1>建立限價單</h1>

      <form
        ref={formRef}
        action={submitOrder}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 360,
          marginBottom: 24,
        }}
      >
        <label>
          交易對
          <input
            name="symbol"
            defaultValue="BTCUSDT"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </label>

        <label>
          數量
          <input
            name="quantity"
            type="number"
            min="0.001"
            step="0.001"
            defaultValue="0.01"
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </label>

        <SubmitButton />
      </form>

      {error && (
        <p role="alert" style={{ color: "#b91c1c" }}>
          {error}
        </p>
      )}

      <h2>訂單清單</h2>
      <ul style={{ display: "grid", gap: 10, padding: 0 }}>
        {optimisticOrders.map((order) => {
          const isPending = order.status === "pending";

          return (
            <li
              key={order.id}
              style={{
                listStyle: "none",
                padding: 12,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                opacity: isPending ? 0.65 : 1,
              }}
            >
              <strong>{order.symbol}</strong>
              {" · "}
              {order.quantity}
              {" · "}
              {isPending ? "送出中…" : "已接受"}
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {order.id}
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
~~~

## 如何操作與觀察

1. 使用預設的 `BTCUSDT` 送出，清單會立刻出現 `TEMP-` 開頭的訂單。
2. 約 1.2 秒後，暫時訂單會換成 `ORDER-` 開頭的 server 結果。
3. 改成 `SOLUSDT` 再送出，暫時訂單仍會立即出現。
4. Server 模擬拒絕後，暫時訂單會消失，已確認訂單不受影響，畫面顯示錯誤訊息。

## 更新流程

~~~text
orders：最後一次由 server 確認的資料
          ↓
addOptimisticOrder(draft)
          ↓
optimisticOrders：暫時多出一筆「送出中」
          ↓ await server
成功 ──→ setOrders(confirmedOrder) ──→ 顯示正式訂單
失敗 ──→ orders 不變 ───────────────→ 暫時訂單消失
~~~

`orders` 是 source of truth，`optimisticOrders` 是 React 在 Action 進行期間投影出的畫面。失敗時不需要手動從陣列刪除暫時訂單；只要不修改 base state，Action 結束後 React 就會回到 `orders`。

## 為什麼要在 Action 中呼叫？

`addOptimisticOrder` 回傳的更新函式是為 Action 設計的。這個案例把 `submitOrder` 交給 `<form action>`，因此 React 會建立 Action context，讓 optimistic state 維持到 async 工作完成。

如果不是透過 form Action，而是在一般事件中觸發，就要自行使用 `startTransition`：

~~~jsx
import { startTransition } from "react";

function handleRetry(draft) {
  startTransition(async () => {
    addOptimisticOrder(draft);
    const confirmedOrder = await createOrderOnServer(draft);
    setOrders((currentOrders) => [...currentOrders, confirmedOrder]);
  });
}
~~~

## 這題真正要觀察什麼？

- `useOptimistic` 不會呼叫 API，也不會永久保存 server data。
- Update function 只計算 optimistic projection，必須保持 pure。
- 暫時資料需要自己的穩定 key，不能和 server ID 混為一談。
- 成功時要更新 canonical state；失敗時則保留原本 canonical state。
- 下單與付款仍需要 server-side idempotency，optimistic UI 不能防止重複交易。

## 面試回答

> `useOptimistic` 用來在 Action 尚未完成時，根據目前已確認的 state 與本次操作投影暫時 UI。這份 optimistic state 不是第二個永久 source of truth；成功時要用 server 結果更新 canonical state，失敗時則讓 Action 結束並回到原資料。Update function 必須保持 pure，畫面也要清楚標示 pending，不能把高風險操作假裝成已成功。

## 常見錯誤

~~~jsx
// ❌ 直接修改 canonical array
(currentOrders, draft) => {
  currentOrders.push(draft);
  return currentOrders;
}

// ❌ 把 optimistic order 當成 server 已確認
addOptimisticOrder({
  ...draft,
  status: "confirmed",
});

// ❌ 一般事件中脫離 Action context 呼叫
function handleClick() {
  addOptimisticOrder(draft);
}

// ❌ 成功後沒有更新真正的 state
async function submitOrder(formData) {
  addOptimisticOrder(toDraft(formData));
  await createOrderOnServer(formData);
}
~~~

官方參考：[React `useOptimistic`](https://react.dev/reference/react/useOptimistic)、[React `<form>` 的 optimistic 範例](https://react.dev/reference/react-dom/components/form#optimistically-updating-form-data)

[回到 React 19 Hooks 六題練習](/docs/frontend-interview/binance/react-19-hooks-drills#useoptimisticaction-進行中先顯示預期結果)
