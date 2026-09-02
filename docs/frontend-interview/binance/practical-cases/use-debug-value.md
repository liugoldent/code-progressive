---
sidebar_position: 8
title: "useDebugValue"
description: "用行情連線 custom Hook 理解 useDebugValue 如何在 React DevTools 顯示業務狀態。"
tags: [React, Hooks, useDebugValue, DevTools, Interview]
---

# useDebugValue

## 實際情境：替行情連線 Hook 顯示可讀狀態

假設 `useMarketConnection` 內部同時保存連線狀態與重試次數。Component 需要這些資料來 render，但開發者在 React DevTools 除錯時，更想直接看到 `行情：重連中（第 2 次）`，而不是展開數個 state 後自行推理。

下面是完整的 JavaScript 範例，可以直接複製到 [OneCompiler React](https://onecompiler.com/react) 的 `App.js`。不需要額外 CSS 檔案。

```jsx
import { useDebugValue, useState } from "react";

function useMarketConnection() {
  const [status, setStatus] = useState("offline");
  const [retryCount, setRetryCount] = useState(0);

  // 第一個參數保存原始除錯資料；第二個參數負責轉成可讀摘要。
  // Formatter 只供 React DevTools 顯示，不參與畫面 render。
  useDebugValue({ status, retryCount }, value => {
    if (value.status === "online") return "行情：已連線";
    if (value.status === "connecting") return "行情：連線中";
    if (value.status === "reconnecting") {
      return `行情：重連中（第 ${value.retryCount} 次）`;
    }
    return "行情：離線";
  });

  function connect() {
    setStatus("connecting");

    window.setTimeout(() => {
      setStatus("online");
      setRetryCount(0);
    }, 800);
  }

  function disconnect() {
    setStatus("offline");
    setRetryCount(0);
  }

  function simulateFailure() {
    setStatus("reconnecting");
    setRetryCount(count => count + 1);
  }

  return {
    status,
    retryCount,
    connect,
    disconnect,
    simulateFailure,
  };
}

const statusText = {
  offline: "離線",
  connecting: "連線中…",
  online: "已連線",
  reconnecting: "重連中…",
};

export default function App() {
  const market = useMarketConnection();

  return (
    <main
      style={{
        maxWidth: 560,
        margin: "48px auto",
        padding: 24,
        fontFamily: "sans-serif",
        border: "1px solid #d1d5db",
        borderRadius: 12,
      }}
    >
      <h1>BTC 即時行情</h1>

      <p>
        畫面狀態：<strong>{statusText[market.status]}</strong>
      </p>
      <p>重試次數：{market.retryCount}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={market.connect}>連線</button>
        <button onClick={market.simulateFailure}>模擬斷線</button>
        <button onClick={market.disconnect}>完全中斷</button>
      </div>

      <p style={{ marginTop: 24, color: "#4b5563", lineHeight: 1.6 }}>
        操作按鈕後，再到 React DevTools 的 Components 面板選取 App，
        展開 hooks，觀察 MarketConnection 的 debug value。
      </p>
    </main>
  );
}
```

## 如何在 OneCompiler 觀察

1. 打開 OneCompiler React，把原本的 `App.js` 全部替換成上方程式，再按 **Run**。
2. 瀏覽器需先安裝 React Developer Tools；`useDebugValue` 不會直接顯示在預覽畫面或 console。
3. 開啟瀏覽器開發者工具，切到 **Components**，在 OneCompiler 的 React 預覽中選取 `App`。
4. 在 Hooks 區域找到 `MarketConnection`。依序操作按鈕，應看到 debug value 在 `行情：離線`、`行情：連線中`、`行情：已連線` 與 `行情：重連中（第 N 次）` 之間改變。
5. 若 Components 面板沒有偵測到預覽，可把 OneCompiler 的 result 在新分頁開啟後，再重新開啟 DevTools。

## 畫面文字和 debug value 有什麼不同？

畫面上的「已連線」來自 component render：

```jsx
<strong>{statusText[market.status]}</strong>
```

DevTools 裡的 `行情：已連線` 則來自 custom Hook 內的：

```jsx
useDebugValue({ status, retryCount }, formatter);
```

兩者即使文字相似，也有完全不同的用途。前者是產品 UI，使用者看得到；後者只協助開發者理解 custom Hook，不會建立 DOM、不會印到 console，也不會改變 Hook 的 return value。

## 為什麼要傳 formatter？

第一個參數保留 `{ status, retryCount }` 這份原始資料，formatter 則把多個欄位整理成一句業務語意。React DevTools 需要顯示時才會呼叫 formatter，因此昂貴的格式化不必在每次 render 都先執行。

Formatter 必須是 pure function。不能在裡面 `setState`、發 API request 或寫入 cache，因為應用程式不能依賴 DevTools 是否存在、是否展開這個 Hook。

## 面試回答

> `useDebugValue` 用來替 reusable custom Hook 在 React DevTools 顯示可讀摘要。這個案例把 `status` 和 `retryCount` 格式化成「行情：重連中（第 2 次）」，讓開發者不必展開多個內部 state。它只影響開發工具，不影響 UI、資料流或 production correctness；格式化昂貴時，可以用第二個 formatter 參數延後計算。

[回到 Effect / Memo 六題練習](../react-effect-memo-hooks-drills#usedebugvalue替-custom-hook-標示-devtools-狀態)
