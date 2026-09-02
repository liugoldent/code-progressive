---
sidebar_position: 12
title: "useActionState"
description: "用交易下單表單實作題理解 useActionState 如何串起 previousState、FormData、非同步 Action、isPending 與提交結果。"
tags: [React 19, Hooks, useActionState, Actions, Interview]
---

# useActionState

:::warning React 版本

`useActionState` 需要 React 19+。目前這個 Docusaurus 專案使用 React 18，因此以下程式是升級後才能執行的獨立實作題，不要直接 import 到現有 live component。

:::

## 實作題目：整合交易下單的提交狀態

請完成一個限價單表單，需求如下：

1. 使用者輸入交易對與數量後送出表單。
2. 交易對只接受 `BTCUSDT`、`ETHUSDT`、`SOLUSDT`，數量必須大於 `0`。
3. 驗證錯誤、API 錯誤與成功結果都放進同一份 Action state。
4. API 執行期間按鈕要 disabled，文字改成「下單中…」。
5. 每次提交都累加嘗試次數，練習使用 `previousState`。
6. 不另外建立 `isLoading`、`error`、`message` 等零散 state。

先想想看：Action function 的兩個參數順序是什麼？誰負責把 `FormData` 傳進來？Action 完成後，哪個值會成為下一次 render 的 state？

## 參考解答

```jsx
import { useActionState } from "react";

const initialState = {
  status: "idle",
  message: "尚未送出訂單",
  attempts: 0,
  order: null,
};

const supportedSymbols = new Set(["BTCUSDT", "ETHUSDT", "SOLUSDT"]);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createOrderOnServer({ symbol, quantity }) {
  await wait(900);

  // 輸入 SOLUSDT 時模擬後端拒絕，方便觀察 error state。
  if (symbol === "SOLUSDT") {
    throw new Error("目前無法建立 SOLUSDT 訂單");
  }

  return {
    id: `ORDER-${Date.now()}`,
    symbol,
    quantity,
  };
}

async function submitOrder(previousState, formData) {
  const attempts = previousState.attempts + 1;
  const symbol = String(formData.get("symbol") ?? "")
    .trim()
    .toUpperCase();
  const quantity = Number(formData.get("quantity"));

  if (!supportedSymbols.has(symbol)) {
    return {
      status: "error",
      message: "交易對只接受 BTCUSDT、ETHUSDT 或 SOLUSDT",
      attempts,
      order: null,
    };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      status: "error",
      message: "數量必須大於 0",
      attempts,
      order: null,
    };
  }

  try {
    const order = await createOrderOnServer({ symbol, quantity });

    return {
      status: "success",
      message: `訂單 ${order.id} 建立成功`,
      attempts,
      order,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "下單失敗",
      attempts,
      order: null,
    };
  }
}

export default function App() {
  const [state, submitAction, isPending] = useActionState(
    submitOrder,
    initialState,
  );

  const messageColor =
    state.status === "success"
      ? "#047857"
      : state.status === "error"
        ? "#b91c1c"
        : "#4b5563";

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <h1>建立限價單</h1>

      <form
        action={submitAction}
        style={{ display: "grid", gap: 16, maxWidth: 360 }}
      >
        <label>
          交易對
          <input
            name="symbol"
            defaultValue="BTCUSDT"
            disabled={isPending}
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
            disabled={isPending}
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </label>

        <button disabled={isPending}>
          {isPending ? "下單中…" : "送出訂單"}
        </button>
      </form>

      <section
        aria-live="polite"
        aria-busy={isPending}
        style={{ marginTop: 24, lineHeight: 1.7 }}
      >
        <p style={{ color: messageColor }}>{state.message}</p>
        <p>提交次數：{state.attempts}</p>

        {state.order && (
          <p>
            已確認：{state.order.symbol} / {state.order.quantity}
          </p>
        )}
      </section>
    </main>
  );
}
```

## 如何操作與觀察

1. 送出預設的 `BTCUSDT`，按鈕會先顯示「下單中…」，約 `900ms` 後顯示成功訂單。
2. 輸入不支援的交易對，Action 會直接回傳 validation state，不會呼叫 API。
3. 輸入 `SOLUSDT`，模擬 API rejection，觀察錯誤訊息仍由 Action return value 統一管理。
4. 重複送出幾次，`attempts` 每次都從 React 傳入的 `previousState` 加一。
5. 快速觸發多次時，同一個 Hook 的 Action 會依序排隊；下一次 Action 會收到上一次完成後的 state。

## 這題真正要觀察什麼？

```txt
<form action={submitAction}>
          ↓ React 自動建立 Action / Transition context
submitOrder(previousState, formData)
          ↓ await API，isPending = true
return nextState
          ↓
state 更新，isPending = false，重新 render
```

`<form action={submitAction}>` 會把表單提交放進 Action context，因此不需要在 submit handler 自己呼叫 `preventDefault()`，也不需要手動包 `startTransition`。React 將 `FormData` 當成 dispatch payload，所以它會是 `submitOrder` 的第二個參數；第一個參數永遠是初始 state 或上一次 Action 的回傳值。

若改成從一般 click handler 手動呼叫 returned action，就需要自行建立 Transition：

```jsx
import { startTransition } from "react";

function handleRetry(formData) {
  startTransition(() => {
    submitAction(formData);
  });
}
```

## 面試回答

> `useActionState` 適合管理一次 Action 的回傳結果與 pending。Action 會收到 `previousState` 和本次 payload，可以執行 async side effect，再 return 完整的 next state。交給 `<form action>` 時，React 會自動建立 Transition 並傳入 `FormData`；手動 dispatch 則要放進 `startTransition`。多次 dispatch 會依序排隊，因此適合下一次結果依賴上一次 state 的流程，但它不取代 server cache、retry、request cancellation 或後端 idempotency。

## 常見錯誤

```jsx
// ❌ FormData 不是第一個參數
async function submitOrder(formData) {
  formData.get("symbol"); // 實際拿到的是 previousState
}

// ❌ 沒有 return，完成後 state 會變成 undefined
async function submitOrder(previousState, formData) {
  await createOrderOnServer(formData);
}

// ❌ 一般事件中脫離 Action context 呼叫，isPending 不會正確運作
function handleClick() {
  submitAction(payload);
}
```

官方參考：[React `useActionState`](https://react.dev/reference/react/useActionState)、[React `<form>`](https://react.dev/reference/react-dom/components/form)

[回到 React 19 Hooks 六題練習](../react-19-hooks-drills#useactionstate由-action-的結果更新-state)
