---
sidebar_position: 6
title: "useId"
description: "用可重複渲染的交易表單案例理解 useId 與 accessibility attributes 的關聯。"
tags: [React, Hooks, useId, Accessibility, Interview]
---

# useId

## 實際情境：頁面上有多張相同訂單表單

買入與賣出表單都包含 Price 欄位。如果手寫固定 `id="price"`，頁面會出現重複 ID，label 可能聚焦到錯誤 input。`useId` 能為每個 component instance 建立穩定且 SSR 安全的前綴。

```tsx
import { useId, useState } from "react";

function PriceField({ side }) {
  const prefix = useId();
  const inputId = `${prefix}-price`;
  const hintId = `${prefix}-hint`;
  const errorId = `${prefix}-error`;
  const [price, setPrice] = useState("");
  const invalid = price !== "" && Number(price) <= 0;

  return (
    <section style={{ marginBottom: 24 }}>
      <h2>{side}</h2>

      <label htmlFor={inputId}>價格</label>
      <input
        id={inputId}
        value={price}
        onChange={event => setPrice(event.target.value)}
        aria-describedby={`${hintId}${invalid ? ` ${errorId}` : ""}`}
        aria-invalid={invalid}
      />

      <p id={hintId}>請輸入大於 0 的限價</p>
      {invalid && (
        <p id={errorId} style={{ color: "crimson" }}>
          價格必須大於 0
        </p>
      )}
    </section>
  );
}

export default function App() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>BTCUSDT 訂單</h1>
      <PriceField side="買入" />
      <PriceField side="賣出" />
    </main>
  );
}
```

## 操作時觀察

1. 點擊「買入」與「賣出」的 label，各自只會聚焦自己的 input。
2. State 更新後 ID 維持穩定；同一個 component unmount/remount 才可能取得新 ID。
3. `useId` 只產生字串，仍要正確連接 `htmlFor`、`id`、`aria-describedby`。

## 面試回答

> `useId` 用來產生可在 SSR 與 hydration 間協調的 UI ID，典型用途是連接 label、input、hint 和 error。它不能當 list key，因為 list identity 應來自資料本身；也不是 database ID 或安全 token。

[回到 State / Context / Ref 六題練習](../react-state-context-ref-hooks-drills)
