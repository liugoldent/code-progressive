---
sidebar_position: 5
slug: "/frontend-interview/binance/practical-cases/use-imperative-handle"
title: "useImperativeHandle"
description: "用可重用價格輸入元件案例理解 useImperativeHandle 如何限制 parent 可執行的命令。"
tags: [React, Hooks, useImperativeHandle, Interview]
---

# useImperativeHandle

## 實際情境：只暴露價格欄位允許的操作

Parent 需要在驗證失敗時聚焦欄位，也要能清除內容，但不應拿到整個 DOM node 後任意修改。Child 透過 imperative handle 只暴露 `focus`、`clear`、`validate`。

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const PriceInput = forwardRef(function PriceInput(
  { value, onChange },
  ref,
) {
  const inputRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        inputRef.current?.focus();
      },
      clear() {
        onChange("");
        inputRef.current?.focus();
      },
      validate() {
        return Number(value) > 0;
      },
    }),
    [onChange, value],
  );

  return (
    <label>
      價格：
      <input
        ref={inputRef}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </label>
  );
});

export default function App() {
  const priceFieldRef = useRef(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("請輸入價格");

  function submitOrder() {
    if (!priceFieldRef.current?.validate()) {
      setMessage("價格必須大於 0");
      priceFieldRef.current?.focus();
      return;
    }

    setMessage(`準備送出價格 ${price}`);
  }

  return (
    <main style={{ fontFamily: "sans-serif", padding: 32 }}>
      <h1>限價單</h1>
      <PriceInput ref={priceFieldRef} value={price} onChange={setPrice} />

      <p>
        <button onClick={submitOrder}>驗證訂單</button>
        <button onClick={() => priceFieldRef.current?.clear()}>清除</button>
      </p>

      <p role="status">{message}</p>
    </main>
  );
}
```

## 操作時觀察

1. Parent 拿到的是自訂 handle，不是 `<input>` DOM node。
2. `validate` 讀取目前的 `value`，所以 dependency 必須包含 value。
3. 一般資料流仍透過 controlled prop `value/onChange`；handle 只處理必要的命令式操作。

## 面試回答

> `useImperativeHandle` 用來限制 parent 透過 ref 能呼叫的介面。與其暴露整個 DOM，我會暴露 focus、clear、validate 這類語意化命令；一般資料同步仍使用 props。React 18 通常搭配 `forwardRef`，React 19 才能直接把 ref 當 prop。

[回到 State / Context / Ref 六題練習](/docs/frontend-interview/binance/react-state-context-ref-hooks-drills)
