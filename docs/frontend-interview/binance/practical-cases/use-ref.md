---
sidebar_position: 4
title: "useRef"
description: "用訂單驗證與聚焦案例理解 useRef 的 DOM reference 與跨 render 可變資料。"
tags: [React, Hooks, useRef, Interview]
---

# useRef

## 實際情境：驗證失敗時聚焦價格欄位

送出訂單時，如果價格不合法，就把游標移回價格欄位。另用 ref 記錄本次 component instance 嘗試送出的次數，但不讓次數本身觸發 render。

```tsx
import { useRef, useState } from "react";

export default function App() {
  const priceInputRef = useRef(null);
  const submitAttemptsRef = useRef(0);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("尚未送出");

  function handleSubmit(event) {
    event.preventDefault();
    submitAttemptsRef.current += 1;

    if (Number(price) <= 0) {
      setMessage(`第 ${submitAttemptsRef.current} 次：價格必須大於 0`);
      priceInputRef.current?.focus();
      return;
    }

    setMessage(`第 ${submitAttemptsRef.current} 次：訂單格式正確`);
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>限價單驗證</h1>

      <form onSubmit={handleSubmit}>
        <label>
          價格：
          <input
            ref={priceInputRef}
            value={price}
            onChange={event => setPrice(event.target.value)}
          />
        </label>
        <button type="submit">送出訂單</button>
      </form>

      <p role="status">{message}</p>
    </main>
  );
}
```

## 操作時觀察

1. 空白或輸入 `0` 後送出，input 會取得 focus。
2. 修改 `.current` 不會主動 render；畫面更新是因為 `setMessage`。
3. Ref 的資料屬於目前 component instance，re-render 會保留，unmount 後則消失。

## 面試回答

> `useRef` 是跨 render 保留的 mutable container。它常用來取得 DOM、保存 timer ID 或第三方 instance；修改 `.current` 不會觸發 render，所以需要顯示在畫面上的資料應該用 state，而不是 ref。

## 常見錯誤

```tsx
// ❌ 改了 ref，但期待畫面自動更新
countRef.current += 1;
return <p>{countRef.current}</p>;
```

[回到 State / Context / Ref 六題練習](../react-state-context-ref-hooks-drills)
