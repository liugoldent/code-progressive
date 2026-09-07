---
sidebar_position: 11
slug: "/frontend-interview/binance/practical-cases/use-sync-external-store"
title: "useSyncExternalStore"
description: "用即時行情 store 案例理解 useSyncExternalStore 的 subscribe、穩定 snapshot、取消訂閱與多元件一致性。"
tags: [React, Hooks, useSyncExternalStore, External Store, Interview]
---

# useSyncExternalStore

## 實際情境：訂閱 React 外部的即時行情 store

WebSocket client、瀏覽器 API 或第三方狀態庫的資料不一定保存在 React state 裡。直接呼叫 `marketStore.getSnapshot()` 只能讀到呼叫當下的值，React 不知道資料何時改變；`useSyncExternalStore` 則用 `subscribe` 接收變更通知，再用 `getSnapshot` 讀取一致的版本。

下面是完整的 JavaScript 範例，可以整份複製到 [你的 OneCompiler React draft](https://onecompiler.com/react#draft-kx8x) 的 `App.jsx`，取代原本內容後按 **Run**。不需要修改其他檔案，也不需要額外 CSS。

```jsx
import { useEffect, useSyncExternalStore } from "react";

const INITIAL_PRICES = {
  "BTC/USDT": 64231.2,
  "ETH/USDT": 3486.75,
  "SOL/USDT": 148.32,
};

function createMarketStore() {
  let snapshot = {
    symbol: "BTC/USDT",
    price: INITIAL_PRICES["BTC/USDT"],
    previousPrice: INITIAL_PRICES["BTC/USDT"],
    status: "paused",
    updatedAt: new Date().toLocaleTimeString(),
    version: 0,
  };
  let intervalId = null;
  const listeners = new Set();

  function getSnapshot() {
    // Store 沒變時必須回傳同一個 reference。
    return snapshot;
  }

  function subscribe(listener) {
    listeners.add(listener);

    // React unmount 或重新訂閱時會呼叫 cleanup。
    return () => listeners.delete(listener);
  }

  function emit(patch) {
    // Store 真的改變時建立新的 immutable snapshot。
    snapshot = {
      ...snapshot,
      ...patch,
      version: snapshot.version + 1,
      updatedAt: new Date().toLocaleTimeString(),
    };
    listeners.forEach(listener => listener());
  }

  function tick() {
    const changePercent = (Math.random() - 0.5) * 0.004;
    const nextPrice = Math.max(0.01, snapshot.price * (1 + changePercent));

    emit({
      previousPrice: snapshot.price,
      price: Number(nextPrice.toFixed(2)),
    });
  }

  function start() {
    if (intervalId !== null) return;
    emit({ status: "live" });
    intervalId = window.setInterval(tick, 800);
  }

  function pause() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    emit({ status: "paused" });
  }

  function destroy() {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function toggle() {
    if (snapshot.status === "live") pause();
    else start();
  }

  function selectSymbol(symbol) {
    const nextPrice = INITIAL_PRICES[symbol];
    emit({
      symbol,
      price: nextPrice,
      previousPrice: nextPrice,
    });
  }

  return {
    subscribe,
    getSnapshot,
    start,
    destroy,
    tick,
    toggle,
    selectSymbol,
  };
}

// Store 存在 React component tree 外，模擬 WebSocket/第三方 store。
const marketStore = createMarketStore();

function useMarketSnapshot() {
  return useSyncExternalStore(
    marketStore.subscribe,
    marketStore.getSnapshot,
  );
}

function MarketHeader() {
  const market = useMarketSnapshot();

  return (
    <header style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ margin: 0, color: "#6b7280" }}>即時行情</p>
        <h1 style={{ marginTop: 4 }}>{market.symbol}</h1>
      </div>
      <strong style={{ color: market.status === "live" ? "#047857" : "#b45309" }}>
        {market.status === "live" ? "● LIVE" : "● PAUSED"}
      </strong>
    </header>
  );
}

function PriceCard() {
  const market = useMarketSnapshot();
  const direction = market.price - market.previousPrice;
  const priceColor = direction > 0 ? "#047857" : direction < 0 ? "#b91c1c" : "#111827";

  return (
    <section
      style={{
        margin: "20px 0",
        padding: 20,
        border: "1px solid #d1d5db",
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700, color: priceColor }}>
        {market.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      <p style={{ marginBottom: 0, color: "#6b7280" }}>
        snapshot #{market.version} · 更新時間 {market.updatedAt}
      </p>
    </section>
  );
}

function MarketControls() {
  const market = useMarketSnapshot();

  return (
    <section>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {Object.keys(INITIAL_PRICES).map(symbol => (
          <button
            key={symbol}
            onClick={() => marketStore.selectSymbol(symbol)}
            disabled={market.symbol === symbol}
          >
            {symbol}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={marketStore.tick}>立即產生一筆報價</button>
        <button onClick={marketStore.toggle}>
          {market.status === "live" ? "暫停串流" : "繼續串流"}
        </button>
      </div>
    </section>
  );
}

export default function App() {
  useEffect(() => {
    marketStore.start();
    return marketStore.destroy;
  }, []);

  return (
    <main
      style={{
        maxWidth: 640,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <MarketHeader />
      <PriceCard />
      <MarketControls />

      <aside
        style={{
          marginTop: 24,
          padding: 16,
          lineHeight: 1.7,
          background: "#f3f4f6",
          borderRadius: 8,
        }}
      >
        <strong>觀察重點：</strong>MarketHeader、PriceCard 和 MarketControls
        都各自訂閱同一個 React 外部 store。報價改變時，它們會從同一份 snapshot
        取得互相一致的 symbol、price、status 與 version。
      </aside>
    </main>
  );
}
```

## 如何操作與觀察

1. 按 **Run** 後，價格會每 `800ms` 自動改變，header、價格卡與按鈕文字會同步反映同一份 snapshot。
2. 切換 `BTC/USDT`、`ETH/USDT`、`SOL/USDT`，觀察商品、初始價格與 snapshot 版本一起更新。
3. 按「暫停串流」後，定時報價停止，但「立即產生一筆報價」仍會從 store 主動通知 React 更新。
4. 這些行情資料都沒有放進 component 的 `useState`；按鈕直接呼叫外部 `marketStore`，訂閱通知才讓 React 重新讀 snapshot。

## `useSyncExternalStore` 的三份 contract

```jsx
const snapshot = useSyncExternalStore(
  marketStore.subscribe,
  marketStore.getSnapshot,
  getServerSnapshot, // 使用 SSR 時提供；純 client 範例可省略
);
```

- `subscribe(listener)`：store 改變時呼叫 listener，並回傳 unsubscribe cleanup。
- `getSnapshot()`：回傳目前不可變的資料版本。資料沒變時必須維持相同 identity。
- `getServerSnapshot()`：SSR 與 hydration 使用的初始 snapshot；server 和 client 的初始內容必須一致。

這個 OneCompiler 範例完全在 client 執行，所以只需要前兩個參數。

## 為什麼不能直接讀 store？

```jsx
function Price() {
  // 只讀取當下的值；store 之後改變不會自動觸發 React render。
  const market = marketStore.getSnapshot();
  return <strong>{market.price}</strong>;
}
```

React 只追蹤 props、state、context 與 Hook 建立的訂閱，不會追蹤普通 method call。`useSyncExternalStore` 把「如何收到通知」和「如何讀取目前值」交給 React，React 也能在 commit 前再次檢查 snapshot，避免 concurrent render 期間不同 component 顯示不同 store 版本。

## Snapshot 為什麼必須穩定？

下面的寫法每次都建立新 object，即使 store 沒變，React 也會認為拿到新的 snapshot：

```jsx
function getSnapshot() {
  return { ...currentData }; // 錯誤：每次呼叫都是新 reference
}
```

範例讓 `getSnapshot()` 直接回傳已保存的 `snapshot`。只有 `emit()` 真正更新 store 時，才建立新的 immutable object：

```jsx
snapshot = { ...snapshot, ...patch };
listeners.forEach(listener => listener());
```

這同時滿足兩個條件：沒變時 `Object.is(oldSnapshot, newSnapshot)` 為 `true`；有變時則為 `false`，React 才需要 render。

## 為什麼要回傳 unsubscribe？

```jsx
function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
```

Component unmount 或訂閱函式 identity 改變時，React 需要解除舊 listener。漏掉 cleanup 會讓已離開畫面的 component 仍被通知，長期可能造成重複更新與 memory leak。

範例的 `marketStore.subscribe` 與 `getSnapshot` 都在 component 外建立，因此 identity 穩定，不會在每次 render 無意義地重新訂閱。

## 面試回答

> `useSyncExternalStore` 用來安全訂閱 React 外部的 mutable source，例如 WebSocket store、瀏覽器 API 或第三方狀態庫。`subscribe` 負責通知與 cleanup，`getSnapshot` 負責回傳目前不可變版本；資料沒變時 snapshot identity 必須穩定，真的改變時才建立新 reference。React 因而能重新 render，並在 concurrent rendering 中確認 commit 的各區塊使用一致版本；SSR 時再提供一致的 `getServerSnapshot`。

[回到 Concurrent Hooks 六題練習](/docs/frontend-interview/binance/react-concurrent-external-hooks-drills#usesyncexternalstore把-react-接到外部-mutable-source)
