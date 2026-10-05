---
sidebar_position: 3
slug: "/frontend-interview/binance/practical-cases/use-context"
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

## 切換幣別時，程式是怎麼跑的？

以下以從 USD 切換成 TWD 為例。先分清楚四件事：**事件發生、state 更新、元件重新執行、畫面更新，是不同的步驟。**

### 1. 切換前，兩個元件讀取同一份資料

第一次渲染時，`CurrencyProvider` 執行：

```jsx
const [currency, setCurrency] = useState("USD");
const value = useMemo(() => ({ currency, setCurrency }), [currency]);
```

此時 `currency` 是 `"USD"`，`value` 包含這個幣別，以及更新 Provider state 的 `setCurrency` 函式。

Provider 透過 `value={value}` 提供資料。`CurrencyToolbar` 和 `OrderSummary` 呼叫 `useCurrency()` 時，讀到的都是這個 Provider 提供的資料。

**真正的 state 只有 Provider 裡那一份，兩個元件沒有各自建立一份 currency state。**

### 2. 使用者選了 TWD，觸發 onChange

工具列裡有：

```jsx
<select
  value={currency}
  onChange={event => setCurrency(event.target.value)}
>
```

選擇 TWD 時，React 呼叫事件處理函式。其中 `event.target` 是觸發事件的 select 元素，`event.target.value` 是 `"TWD"`，所以相當於執行：

```jsx
setCurrency("TWD");
```

雖然這個呼叫發生在 `CurrencyToolbar`，更新的仍然是 **CurrencyProvider 裡的 state**，因為這個函式是從 Provider 經由 Context 傳過來的。

### 3. setCurrency 安排下一次渲染

`setCurrency("TWD")` 不會直接修改目前這次渲染中的 `currency` 變數。例如：

```jsx
onChange={event => {
  console.log(currency); // "USD"

  setCurrency(event.target.value);

  console.log(currency); // 仍然是 "USD"
}}
```

第二次印出來仍然是 USD，因為這個事件處理函式讀到的是**這次渲染時的狀態快照**。

`setCurrency` 的意思可以理解成：「React，請把幣別更新成 TWD，並安排下一次渲染。」一般情況下，React 會在事件處理結束後處理這些更新。

### 4. React 重新執行 CurrencyProvider

下一次渲染時，React 再次呼叫 `CurrencyProvider`，這行也會再執行：

```jsx
const [currency, setCurrency] = useState("USD");
```

但是這次 `currency` 是 `"TWD"`。React 記住了這個元件的 state；`"USD"` 只用來設定第一次的初始值，後續渲染取得的是 React 保存的最新值。

`setCurrency` 的函式參考則保持穩定。

### 5. useMemo 發現幣別改變，建立新物件

接著執行：

```jsx
const value = useMemo(() => ({ currency, setCurrency }), [currency]);
```

React 比較上一次與這次的依賴：

```text
上一次：[ "USD" ]
這一次：[ "TWD" ]
```

依賴改變了，因此重新執行 `() => ({ currency, setCurrency })`，建立包含 `currency: "TWD"` 的新物件。

這時 `currency` 的內容改變，`value` 的物件參考也與上一次不同。`useMemo` 不會阻止幣別更新；它會在依賴改變時重新計算。

### 6. Context 值改變，React 通知消費者

Provider 這次使用新的 `value`：

```jsx
<CurrencyContext.Provider value={value}>
  {children}
</CurrencyContext.Provider>
```

React 使用 `Object.is` 比較前後的 Context 值。這次是新物件，所以 React 安排讀取這個 Context 的元件重新渲染。

`CurrencyToolbar` 和 `OrderSummary` 都呼叫 `useCurrency()`，它的內部執行：

```jsx
const value = useContext(CurrencyContext);
```

**這個 useContext 讓 React 知道，呼叫它的元件需要隨 Context 值更新。** Custom Hook 本身不會產生獨立元件；訂閱屬於使用這個 Hook 的元件。

Context 值改變，不代表底下所有元件都必然因 Context 重新渲染。這裡受到 Context 更新通知的是讀取它的消費者；其他元件仍可能因父元件或自己的 state 更新而重新渲染。

### 7. CurrencyToolbar 重新執行，拿到 TWD

工具列重新執行：

```jsx
const { currency, setCurrency } = useCurrency();
```

這次 `currency` 是 `"TWD"`，因此回傳的 JSX 相當於：

```jsx
<select value="TWD">
```

這是**受控元件（controlled component）**：選單的選取值由 React 的 `currency` state 控制。

```text
使用者選擇 → onChange 更新 state
state 的值 → 決定 select 顯示哪個選項
```

重新渲染會建立新的事件處理函式供下次使用，但**不會因為渲染而自動呼叫 onChange**，所以不會形成無限循環。

### 8. OrderSummary 重新執行，重新計算金額

訂單摘要重新執行：

```jsx
const { currency } = useCurrency();
const usdNotional = 65000;
const amount = currency === "USD" ? usdNotional : usdNotional * 32;
```

這次 `currency === "USD"` 是 `false`，所以選擇冒號右邊的計算：

```jsx
const amount = 65000 * 32; // 2080000
```

`amount.toLocaleString()` 依執行環境的地區設定格式化數字；在常見的繁體中文或英文地區設定下，會得到 `"2,080,000"`。因此新的 JSX 描述：

```text
訂單金額：TWD 2,080,000
```

`amount` 是一般區域變數，沒有另外存進 state。**每次 OrderSummary 執行，都會依當次的 currency 重新計算。** 這個範例使用固定匯率 `1 USD = 32 TWD`。

### 9. React 將渲染結果套用到畫面

前面重新執行元件的階段，是計算新畫面應該長什麼樣子（render）。接著 React 將必要的變更套用到 DOM（commit），瀏覽器再繪製更新後的畫面。

```text
原本：訂單金額：USD 65,000
更新：訂單金額：TWD 2,080,000
```

重新渲染不等於重新載入整個網頁，也不等於重新建立所有 DOM。

### 完整流程

```text
使用者選擇 TWD
    ↓
CurrencyToolbar 的 onChange 被呼叫
    ↓
setCurrency("TWD")
    ↓
React 記錄 state 更新
    ↓
重新執行 CurrencyProvider，currency 是 "TWD"
    ↓
useMemo 因依賴改變，產生新的 value
    ↓
Provider 的 Context 值改變
    ↓
CurrencyToolbar、OrderSummary 重新執行
    ↓
工具列使用 TWD，摘要算出 2,080,000
    ↓
React 將必要的變更套用到 DOM
    ↓
瀏覽器顯示更新後的畫面
```

這次更新從 `CurrencyProvider` 自己的 state 開始，**不需要重新執行外層的 App**。以上描述的是一次更新的邏輯流程；開發環境啟用 Strict Mode 時，可能看到額外的元件函式執行，不能直接把執行次數當成畫面更新次數。

## 操作時觀察

1. 切換幣別後，所有呼叫 `useCurrency` 的 consumer 都取得最近 Provider 的新值。
2. Default value 不是錯誤處理；custom Hook 主動檢查 `null`，漏包 Provider 時能立即指出問題。
3. `useMemo` 避免 Provider 因無關 render 產生內容相同但 reference 不同的 value。

## 面試回答

> `useContext` 會讀取 component 上方最近的 matching Provider，並訂閱它的 value。它適合 theme、locale、登入資訊等跨層級資料；高頻且互不相關的資料不要全部塞進單一 Context，否則任一 value 改變都會通知所有 consumer。

[回到 State / Context / Ref 六題練習](/docs/frontend-interview/binance/react-state-context-ref-hooks-drills)
