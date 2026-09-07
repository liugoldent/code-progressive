---
sidebar_position: 10
slug: "/frontend-interview/binance/practical-cases/use-deferred-value"
title: "useDeferredValue"
description: "用大量商品搜尋案例理解 useDeferredValue 如何讓昂貴結果暫時沿用舊值，並和 debounce、useTransition 比較。"
tags: [React, Hooks, useDeferredValue, Concurrent, Interview]
---

# useDeferredValue

## 實際情境：輸入框立即更新，昂貴結果稍後追上

交易平台的商品搜尋框必須立刻顯示使用者輸入，但包含數百列的結果區可以稍後再更新。`useDeferredValue` 讓 component 保留一份可暫時落後的 value，將最新的 `input` 交給輸入框，將 `deferredQuery` 交給昂貴列表。

下面是完整的 JavaScript 範例，可以整份複製到 [你的 OneCompiler React draft](https://onecompiler.com/react#draft-kx8x) 的 `App.jsx`，取代原本內容後按 **Run**。不需要修改其他檔案，也不需要額外 CSS。

```jsx
import { memo, useDeferredValue, useState } from "react";

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

// 放在 component 外面，讓每次 render 都使用同一個 array reference。
const PRODUCTS = Array.from({ length: 1200 }, (_, index) => ({
  id: index + 1,
  symbol: `${SYMBOLS[index % SYMBOLS.length]}-${index + 1}`,
  market: index % 2 === 0 ? "USDT" : "USDC",
}));

const SlowProductRow = memo(function SlowProductRow({ product }) {
  // 模擬交易列表中的格式化、指標與複雜 component render。
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
    <section>
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
    </section>
  );
});

export default function App() {
  const [input, setInput] = useState("");
  const [useDeferredMode, setUseDeferredMode] = useState(true);

  // input 仍立即更新；deferredQuery 可以暫時保留上一個版本。
  const deferredQuery = useDeferredValue(input);
  const queryForList = useDeferredMode ? deferredQuery : input;
  const isStale = useDeferredMode && input !== deferredQuery;

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
          checked={useDeferredMode}
          onChange={event => setUseDeferredMode(event.target.checked)}
        />
        結果區使用 useDeferredValue
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="試著快速輸入 BTC、ETH 或 USDT"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #9ca3af",
            borderRadius: 8,
            fontSize: 16,
          }}
        />
        <button onClick={() => setInput("")}>清除</button>
      </div>

      <p>
        input 目前顯示：<strong>{input || "（空字串）"}</strong>
      </p>

      <div
        aria-busy={isStale}
        style={{
          opacity: isStale ? 0.55 : 1,
          transition: "opacity 120ms",
        }}
      >
        <p style={{ minHeight: 24, color: isStale ? "#b45309" : "#047857" }}>
          {isStale ? "結果仍是舊版本，正在追上最新輸入…" : "結果已是最新版本"}
        </p>

        <SlowProductList products={PRODUCTS} query={queryForList} />
      </div>

      <aside
        style={{
          marginTop: 20,
          padding: 16,
          lineHeight: 1.7,
          background: "#f3f4f6",
          borderRadius: 8,
        }}
      >
        <strong>觀察重點：</strong>開啟 useDeferredValue 後快速輸入時，input
        先顯示最新文字；結果區可以短暫保留舊 query，並以半透明表示 stale。
      </aside>
    </main>
  );
}
```

## 如何操作與比較

1. 保持「結果區使用 `useDeferredValue`」勾選，按清除後快速輸入 `BTC` 或 `USDT`。
2. 比較「input 目前顯示」和「結果使用的 query」。React 忙著 render 大型列表時，後者可以暫時落後，結果區也會變成半透明。
3. 取消勾選、清除後再快速輸入相同文字。這次昂貴列表直接讀最新 `input`，輸入較容易被列表 render 拖慢。
4. 不同裝置速度不同。若差異不明顯，可把 `SlowProductRow` 的迴圈次數從 `12000` 調高到 `30000`；若預覽太慢則調低到 `5000`。

## 更新流程

```txt
使用者輸入 "BT"
├─ urgent render
│  ├─ input = "BT"                 → controlled input 立即更新
│  └─ deferredQuery = "B"          → memoized 結果區先沿用舊值
└─ background render
   └─ deferredQuery = "BT"         → 結果區追上最新輸入
```

追趕途中若又輸入新字，React 可以中斷尚未 commit 的 background render，改為追更新的 value。這是一種 render 優先級，不保證延遲固定毫秒數，也不保證每一個中間值都會出現在畫面。

## 為什麼 `memo` 很重要？

`useDeferredValue` 讓 urgent render 暫時取得相同的 `deferredQuery`，但 parent render 時預設仍會呼叫 child。將昂貴的 `SlowProductList` 包成 `memo` 後，只要 `products` 和 `query` 都沒變，React 就能在 urgent pass 跳過整個結果區。

這也是 `PRODUCTS` 放在 component 外的原因。如果每次 render 都建立新 array，即使 `query` 還是舊值，`products` prop 的 reference 已改變，`memo` 仍無法跳過結果區。

## 它不是 debounce

`useDeferredValue` 不會承諾「停止輸入 300ms 後才更新」，也不保證減少 API request：

- `useDeferredValue`：讓 React render 可以暫時使用舊 value，改善互動優先級。
- debounce：等一段明確時間後才開始工作，常用來限制 request 次數。

需要遠端搜尋時可以同時使用兩者：deferred value 保持本地結果 render 順暢，debounce、cache 與 request cancellation 負責網路層。

## 和 `useTransition` 怎麼選？

`useTransition` 用在產生更新的一端：你能控制 setter，並想把某次 state update 標成 non-blocking。`useDeferredValue` 用在消費 value 的一端：你已有一個會立即更新的 value，只想讓某個昂貴 consumer 晚一點追上。

這個案例只保存一份 `input` state，因此不需要另外維護 `input` 和 `query`；結果區直接讀 `useDeferredValue(input)`。它沒有 `isPending`，所以用 `input !== deferredQuery` 判斷畫面是否 stale。

## 面試回答

> `useDeferredValue` 讓非關鍵 UI 暫時沿用 value 的舊版本。這個案例讓 controlled input 直接讀最新 `input`，昂貴且 memoized 的商品列表改讀 `deferredQuery`；React 可以先 commit 輸入，再在可中斷的 background render 讓結果追上。它調整的是 React render 優先級，不是固定時間的 debounce，也不會讓昂貴演算法本身變快。

[回到 Concurrent Hooks 六題練習](/docs/frontend-interview/binance/react-concurrent-external-hooks-drills#usedeferredvalue讓非關鍵-consumer-暫時使用舊值)
