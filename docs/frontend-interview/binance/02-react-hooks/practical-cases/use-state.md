---
sidebar_position: 1
slug: "/frontend-interview/binance/practical-cases/use-state"
title: "useState"
description: "用交易下單數量與預估金額案例理解 useState、functional update 與 derived data。"
tags: [React, Hooks, useState, Interview]
---

# useState

## 實際情境：調整下單數量

交易者可以連續增加或減少 BTC 數量，畫面即時顯示預估成交金額。這個案例同時展示兩個面試重點：

- 下一個值依賴上一個 state 時，使用 functional updater。
- 可以從其他 state 算出的值，不要再存成另一份 state。

```tsx
import { useState } from "react";

const BTC_PRICE = 65000;

export default function App() {
  const [quantity, setQuantity] = useState(1);

  // derived data：不用額外建立 notional state
  const notional = BTC_PRICE * quantity;

  function increaseThreeTimes() {
    setQuantity(previous => previous + 1);
    setQuantity(previous => previous + 1);
    setQuantity(previous => previous + 1);
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>BTC 市價單</h1>
      <p>參考價格：${BTC_PRICE.toLocaleString()}</p>

      <button
        onClick={() => setQuantity(previous => Math.max(1, previous - 1))}
      >
        −
      </button>
      <strong style={{ margin: "0 16px" }}>{quantity} BTC</strong>
      <button onClick={() => setQuantity(previous => previous + 1)}>＋</button>

      <button onClick={increaseThreeTimes} style={{ marginLeft: 16 }}>
        連加三次
      </button>

      <p>預估金額：${notional.toLocaleString()}</p>
    </main>
  );
}
```

## 操作時觀察

1. 點「連加三次」，數量會增加 `3`，因為三個 updater 依序讀取 pending state。
2. `notional` 每次 render 都由最新的 `quantity` 算出，永遠不會和數量不同步。
3. 如果三次都寫成 `setQuantity(quantity + 1)`，同一次 click 只會使用同一份 quantity snapshot。

## 面試回答

> 我會用 `useState` 保存需要跨 render 存在、且會影響畫面的最小狀態。下一個值依賴前一個值時用 functional updater；像成交金額這種能由價格和數量推導的資料，直接在 render 計算，避免多一份 source of truth。

## 常見錯誤

```tsx
// ❌ 三次都讀到同一次 render 的 quantity
setQuantity(quantity + 1);
setQuantity(quantity + 1);
setQuantity(quantity + 1);

// ❌ notional 是可推導資料，容易和 quantity 不同步
const [notional, setNotional] = useState(BTC_PRICE);
```

[回到 State / Context / Ref 六題練習](/docs/frontend-interview/binance/react-state-context-ref-hooks-drills)
