---
sidebar_position: 3
title: "useContext"
description: "用交易偏好設定案例理解 useContext、Provider、訂閱邊界與 custom Hook guard。"
tags: [React, Hooks, useContext, Interview]
---

# useContext

## 實際情境：讓交易頁共用顯示幣別

工具列與訂單摘要位於不同層級，但都需要讀取同一個顯示幣別。Context 適合提供這種跨多層 component 的共同設定。

```tsx
import { createContext, useContext, useMemo, useState } from "react";

const CurrencyContext = createContext(null);

function useCurrency() {
  const value = useContext(CurrencyContext);

  if (value === null) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return value;
}

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const value = useMemo(() => ({ currency, setCurrency }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

function CurrencyToolbar() {
  const { currency, setCurrency } = useCurrency();

  return (
    <label>
      顯示幣別：
      <select
        value={currency}
        onChange={event => setCurrency(event.target.value)}
      >
        <option value="USD">USD</option>
        <option value="TWD">TWD</option>
      </select>
    </label>
  );
}

function OrderSummary() {
  const { currency } = useCurrency();
  const usdNotional = 65000;
  const amount = currency === "USD" ? usdNotional : usdNotional * 32;

  return (
    <p>
      訂單金額：{currency} {amount.toLocaleString()}
    </p>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <main style={{ fontFamily: "sans-serif", padding: 32 }}>
        <h1>交易偏好</h1>
        <CurrencyToolbar />
        <OrderSummary />
      </main>
    </CurrencyProvider>
  );
}
```

## 操作時觀察

1. 切換幣別後，所有呼叫 `useCurrency` 的 consumer 都取得最近 Provider 的新值。
2. Default value 不是錯誤處理；custom Hook 主動檢查 `null`，漏包 Provider 時能立即指出問題。
3. `useMemo` 避免 Provider 因無關 render 產生內容相同但 reference 不同的 value。

## 面試回答

> `useContext` 會讀取 component 上方最近的 matching Provider，並訂閱它的 value。它適合 theme、locale、登入資訊等跨層級資料；高頻且互不相關的資料不要全部塞進單一 Context，否則任一 value 改變都會通知所有 consumer。

[回到 State / Context / Ref 六題練習](../react-state-context-ref-hooks-drills)
