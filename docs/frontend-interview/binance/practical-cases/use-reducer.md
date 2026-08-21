---
sidebar_position: 2
title: "useReducer"
description: "用交易訂單表單案例理解 useReducer 如何集中管理互相依賴的狀態轉移。"
tags: [React, Hooks, useReducer, Interview]
---

# useReducer

## 實際情境：管理一張交易訂單

當 side、price、quantity、status 必須一起遵守規則時，把更新散落在多個 event handler 會越來越難維護。Reducer 讓 action 描述「發生什麼」，並集中計算 next state。

```tsx
import { useReducer } from "react";

const initialState = {
  side: "buy",
  price: "65000",
  quantity: "1",
  status: "editing",
};

function orderReducer(state, action) {
  switch (action.type) {
    case "side_changed":
      return { ...state, side: action.side, status: "editing" };
    case "price_changed":
      return { ...state, price: action.price, status: "editing" };
    case "quantity_changed":
      return { ...state, quantity: action.quantity, status: "editing" };
    case "submitted": {
      const valid = Number(state.price) > 0 && Number(state.quantity) > 0;
      return { ...state, status: valid ? "submitted" : "invalid" };
    }
    case "reset":
      return initialState;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function App() {
  const [order, dispatch] = useReducer(orderReducer, initialState);
  const notional = Number(order.price) * Number(order.quantity);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>建立訂單</h1>

      <button
        onClick={() => dispatch({ type: "side_changed", side: "buy" })}
      >
        買入
      </button>
      <button
        onClick={() => dispatch({ type: "side_changed", side: "sell" })}
      >
        賣出
      </button>

      <p>
        <label>
          價格：
          <input
            value={order.price}
            onChange={event =>
              dispatch({ type: "price_changed", price: event.target.value })
            }
          />
        </label>
      </p>

      <p>
        <label>
          數量：
          <input
            value={order.quantity}
            onChange={event =>
              dispatch({
                type: "quantity_changed",
                quantity: event.target.value,
              })
            }
          />
        </label>
      </p>

      <p>方向：{order.side === "buy" ? "買入" : "賣出"}</p>
      <p>預估金額：${notional.toLocaleString()}</p>
      <p>狀態：{order.status}</p>

      <button onClick={() => dispatch({ type: "submitted" })}>送出</button>
      <button onClick={() => dispatch({ type: "reset" })}>重設</button>
    </main>
  );
}
```

## 操作時觀察

1. 每個 event handler 只 dispatch action，不直接拼裝整份 next state。
2. `submitted` 會一次決定訂單狀態，不會出現多個 setter 只完成一半的中間規則。
3. Reducer 保持純粹；真正的 API request 應由 submit handler 或資料層執行。

## 面試回答

> 當多個 state 欄位會因同一事件一起變動，或更新規則分散在很多 handler 時，我會考慮 `useReducer`。Reducer 必須是 pure function，只根據 state 和 action 回傳 next state，API、analytics 等副作用不放進 reducer。

[回到 State / Context / Ref 六題練習](../react-state-context-ref-hooks-drills)
