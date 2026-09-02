---
sidebar_position: 9
title: "useTransition"
description: "用大量商品搜尋案例比較普通更新與 Transition，理解 callback 同步執行、React render 優先級與 isPending。"
tags: [React, Hooks, useTransition, Concurrent, Interview]
---

# useTransition

## 實際情境：大量商品搜尋不能拖慢輸入框

使用者在交易平台搜尋商品時，搜尋框文字必須立即顯示，但大型商品列表可以稍後再追上。`useTransition` 可以把「更新結果列表」標記成 non-blocking update，讓 React 優先處理輸入。

下面是完整的 JavaScript 範例，可以直接複製到 [你的 OneCompiler React draft](https://onecompiler.com/react#draft-kx8x) 的 `App.js`，取代原本內容後按 **Run**。不需要額外 CSS 檔案。

```jsx
import { memo, useState, useTransition } from "react";

const SYMBOLS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "XRP",
  "ADA",
  "DOGE",
  "AVAX",
  "DOT",
  "LINK",
];

// 放在 component 外面，確保每次 render 都是同一個 array reference。
const PRODUCTS = Array.from({ length: 1200 }, (_, index) => ({
  id: index + 1,
  symbol: `${SYMBOLS[index % SYMBOLS.length]}-${index + 1}`,
  market: index % 2 === 0 ? "USDT" : "USDC",
}));

const SlowProductRow = memo(function SlowProductRow({ product }) {
  // 模擬真實交易列表中的格式化、指標與複雜元件 render。
  // 每一列只做一小段工作，讓 React 有機會在列與列之間讓出控制權。
  let renderCost = 0;
  for (let i = 0; i < 99999; i += 1) {
    renderCost += Math.sqrt(i + product.id);
  }

  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderBottom: "1px solid #e5e7eb",
      }}
      data-render-cost={Math.round(renderCost)}
    >
      <strong>{product.symbol}</strong>
      <span style={{ color: "#6b7280" }}>{product.market}</span>
    </li>
  );
});

const SlowProductList = memo(function SlowProductList({ products, query }) {
  const keyword = query.trim().toLowerCase();
  const matchedProducts = products
    .filter(product =>
      `${product.symbol} ${product.market}`.toLowerCase().includes(keyword),
    )
    .slice(0, 1200);

  return (
    <div>
      <p>
        結果使用的 query：<strong>{query || "（空字串）"}</strong>
      </p>
      <p>顯示 {matchedProducts.length} 筆</p>

      <ul
        style={{
          height: 300,
          margin: 0,
          padding: 0,
          overflow: "auto",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          listStyle: "none",
        }}
      >
        {matchedProducts.map(product => (
          <SlowProductRow key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
});

export default function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [useTransitionMode, setUseTransitionMode] = useState(true);
  const [isPending, startTransition] = useTransition();

  function handleChange(event) {
    const next = event.target.value;

    // Urgent update：受控 input 必須立刻顯示使用者剛輸入的文字。
    setInput(next);

    if (useTransitionMode) {
      console.log("1. startTransition 前");

      startTransition(() => {
        console.log("2. callback 立即同步執行");
        setQuery(next);
      });

      console.log("3. startTransition 後");
    } else {
      // 比較組：query 也是普通 urgent update。
      setQuery(next);
    }
  }

  function clearSearch() {
    setInput("");
    startTransition(() => {
      setQuery("");
    });
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "32px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <h1>交易商品搜尋</h1>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <input
          type="checkbox"
          checked={useTransitionMode}
          onChange={event => setUseTransitionMode(event.target.checked)}
        />
        使用 useTransition
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={handleChange}
          placeholder="試著快速輸入 BTC、ETH 或 USDT"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #9ca3af",
            borderRadius: 8,
            fontSize: 16,
          }}
        />
        <button onClick={clearSearch}>清除</button>
      </div>

      <p style={{ minHeight: 24, color: isPending ? "#b45309" : "#047857" }}>
        {isPending ? "結果正在追上最新輸入…" : "結果已更新完成"}
      </p>

      <p>
        input 目前顯示：<strong>{input || "（空字串）"}</strong>
      </p>

      <SlowProductList products={PRODUCTS} query={query} />

      <aside
        style={{
          marginTop: 20,
          padding: 16,
          lineHeight: 1.7,
          background: "#f3f4f6",
          borderRadius: 8,
        }}
      >
        <strong>觀察重點：</strong>開啟 useTransition 後快速輸入時，input
        可以先顯示新文字，結果區暫時保留舊 query，並出現 pending 提示。
      </aside>
    </main>
  );
}
```

## 如何操作與比較

1. 保持「使用 `useTransition`」勾選，先按清除，再快速輸入 `BTC` 或 `USDT`。
2. 觀察 input 會優先顯示新文字，結果區的 query 可以暫時落後，期間出現「結果正在追上最新輸入」。
3. 取消勾選、清除後再快速輸入同樣文字。這次 `input` 與 `query` 都是普通更新，React 必須連同昂貴列表一起處理，輸入較容易感覺卡頓。
4. 打開 Console。每次開啟 Transition 模式輸入時，訊息順序都是 `1 → 2 → 3`。

不同裝置的速度不同。如果差異不明顯，可以把 `SlowProductRow` 迴圈的 `12000` 調高到 `30000`；如果預覽太慢，則調低到 `5000`。

## 最重要：callback 不是背景工作

範例裡的 console 順序是：

```txt
1. startTransition 前
2. callback 立即同步執行
3. startTransition 後
```

這證明 `startTransition` 的 callback 會立即、同步執行。它主要標記的是 callback 裡排入的 React state update：

```jsx
startTransition(() => {
  setQuery(next); // 這個更新所觸發的 render 是 Transition
});
```

如果把一整段昂貴的同步運算放進去，它仍會立刻阻塞 main thread：

```jsx
startTransition(() => {
  const results = expensiveFilter(products); // 仍然同步阻塞
  setResults(results);
});
```

Transition 能讓 React 中斷或放棄過時的低優先級 **render**，但不會把普通 JavaScript 搬到 Web Worker，也不會讓演算法自動變快。

## 為什麼需要 `input` 和 `query` 兩份 state？

```txt
使用者輸入
├─ setInput(next)              → urgent，立即控制 input value
└─ startTransition(...)
   └─ setQuery(next)           → non-blocking，驅動大型列表
```

`input` 是受控輸入框的 source of truth，不能延後。`query` 只負責搜尋結果，晚一點顯示不會讓使用者輸入錯誤，因此適合成為 Transition。

`SlowProductList` 使用 `memo` 也很重要。`setInput` 觸發 urgent render 時，`products` 和 `query` 都還沒改變，所以 React 可以跳過昂貴列表；等 Transition 更新 `query` 後，列表才重新 render。

## `isPending` 代表什麼？

`isPending` 表示 Transition 還沒完成，也就是「結果畫面正在追上最新 state」。它不代表 API request 還在傳輸。如果案例改成呼叫後端，仍應另外管理 `isFetching`、錯誤、取消與 race condition。

## 面試回答

> `useTransition` 把某批 React state updates 標記成 non-blocking，讓按鍵或輸入等 urgent update 可以優先處理。這個案例讓 `input` 立即更新，再用 Transition 更新驅動大型列表的 `query`。最重要的是，`startTransition` callback 本身仍會立即同步執行；被降低優先級的是其中 state update 所觸發的 React render，不是 callback 裡的普通 JavaScript。它不是 debounce、Web Worker，也不會讓昂貴演算法自動變快。

[回到 Concurrent Hooks 六題練習](../react-concurrent-external-hooks-drills#usetransition把-state-update-標成-non-blocking)
