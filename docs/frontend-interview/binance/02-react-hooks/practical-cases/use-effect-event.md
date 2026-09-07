---
sidebar_position: 14
slug: "/frontend-interview/binance/practical-cases/use-effect-event"
title: "useEffectEvent"
description: "用即時行情連線案例理解 useEffectEvent 如何讓 subscription 維持不變，同時讀取最新的通知設定。"
tags: [React 19.2, Hooks, useEffectEvent, useEffect, Subscription, Interview]
---

# useEffectEvent

:::warning React 版本

`useEffectEvent` 需要 React 19.2+。目前這個 Docusaurus 專案使用 React 18，因此以下程式是升級後才能執行的獨立實作題，不要直接 import 到現有 live component。

:::

## 實際情境：行情連線不因通知設定改變而重建

交易畫面會依照 `symbol` 建立一條行情 subscription。每筆價格抵達時，通知邏輯還要讀取使用者最新的 `muted` 與 `notificationMode` 設定。

這些值扮演的角色不同：

- `symbol` 決定要同步哪個外部資料源；改變時必須 cleanup 舊連線並建立新連線。
- `muted` 與 `notificationMode` 只決定下一筆行情抵達時如何處理；改變時不應重連。

如果把三者全部放進同一個 Effect，dependency lint 會正確要求 `[symbol, muted, notificationMode]`，但每次切換通知設定都會中斷並重建行情連線。`useEffectEvent` 可以把「連線生命週期」與「行情抵達時才執行的邏輯」分開。

## 完整實作

以下範例不需要 WebSocket server，可以直接放進 React 19.2+ 專案的 `App.jsx`。`createMarketStream` 用 interval 模擬行情 subscription，方便觀察 cleanup 與 setup 次數。

```jsx
import { useEffect, useEffectEvent, useRef, useState } from "react";

const initialPrices = {
  BTCUSDT: 68000,
  ETHUSDT: 3600,
  SOLUSDT: 165,
};

function createMarketStream(symbol, onPrice) {
  let price = initialPrices[symbol];

  const timerId = window.setInterval(() => {
    const movement = (Math.random() - 0.5) * price * 0.002;
    price = Math.max(0.01, price + movement);
    onPrice(Number(price.toFixed(2)));
  }, 1200);

  return () => window.clearInterval(timerId);
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function App() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [price, setPrice] = useState(initialPrices.BTCUSDT);
  const [muted, setMuted] = useState(false);
  const [notificationMode, setNotificationMode] = useState("compact");
  const [connectionCount, setConnectionCount] = useState(0);
  const [lastEvent, setLastEvent] = useState("等待第一筆行情…");
  const previousPriceRef = useRef(initialPrices.BTCUSDT);

  const onPriceArrived = useEffectEvent((receivedSymbol, nextPrice) => {
    const previousPrice = previousPriceRef.current;
    const change = nextPrice - previousPrice;
    previousPriceRef.current = nextPrice;

    // 每次行情事件都會讀到最新 committed 設定，
    // 但這些設定不會控制 subscription 的生命週期。
    if (muted) {
      setLastEvent(`已收到 ${receivedSymbol} 行情，但通知已靜音`);
      return;
    }

    if (notificationMode === "detailed") {
      const direction = change >= 0 ? "+" : "";
      setLastEvent(
        `${receivedSymbol} ${formatPrice(nextPrice)}（${direction}${change.toFixed(2)}）`,
      );
      return;
    }

    setLastEvent(`${receivedSymbol} 更新為 ${formatPrice(nextPrice)}`);
  });

  useEffect(() => {
    previousPriceRef.current = initialPrices[symbol];
    setPrice(initialPrices[symbol]);
    setConnectionCount(count => count + 1);
    setLastEvent(`已訂閱 ${symbol}，等待行情…`);

    const disconnect = createMarketStream(symbol, nextPrice => {
      setPrice(nextPrice);
      onPriceArrived(symbol, nextPrice);
    });

    return disconnect;
  }, [symbol]);

  return (
    <main
      style={{
        maxWidth: 620,
        margin: "40px auto",
        padding: 24,
        fontFamily: "sans-serif",
        color: "#111827",
      }}
    >
      <h1>即時行情通知</h1>

      <label style={{ display: "grid", gap: 6, marginBottom: 16 }}>
        交易對
        <select
          value={symbol}
          onChange={event => setSymbol(event.target.value)}
        >
          {Object.keys(initialPrices).map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <fieldset style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <legend>通知設定</legend>

        <label>
          <input
            type="checkbox"
            checked={muted}
            onChange={event => setMuted(event.target.checked)}
          />{" "}
          靜音
        </label>

        <label>
          顯示模式：{" "}
          <select
            value={notificationMode}
            onChange={event => setNotificationMode(event.target.value)}
          >
            <option value="compact">簡潔</option>
            <option value="detailed">詳細（含漲跌）</option>
          </select>
        </label>
      </fieldset>

      <section
        aria-live="polite"
        style={{
          padding: 16,
          border: "1px solid #d1d5db",
          borderRadius: 10,
          lineHeight: 1.7,
        }}
      >
        <strong>{symbol}</strong>
        <div style={{ fontSize: 32 }}>{formatPrice(price)}</div>
        <p>{lastEvent}</p>
        <small>行情連線建立次數：{connectionCount}</small>
      </section>
    </main>
  );
}
```

## 如何操作與觀察

1. 等待第一筆模擬行情，確認價格與通知文字約每 `1.2` 秒更新。
2. 在「簡潔」與「詳細」模式間切換；下一筆行情會使用新格式，但「行情連線建立次數」不變。
3. 開啟靜音；下一筆行情仍會更新價格，通知區則顯示已靜音，連線同樣不會重建。
4. 切換交易對；舊 interval 會被 cleanup，新交易對建立 subscription，因此連線次數加一。
5. 若開發環境使用 `<StrictMode>`，React 會在 development 額外執行一次 setup → cleanup → setup 來檢查 cleanup 是否完整，所以初次看到次數大於 `1` 是正常的；production 不會做這次檢查。

## 資料流與生命週期

```text
symbol 改變
  → cleanup 舊 subscription
  → createMarketStream(symbol)
  → 連線次數 +1

muted / notificationMode 改變
  → component 重新 render
  → subscription 不重建
  → 下一筆行情呼叫 onPriceArrived
  → Effect Event 讀取最新 committed 設定
```

`symbol` 被 Effect 本身讀取，因此必須留在 dependency array。`muted` 與 `notificationMode` 只在 Effect Event 內讀取；它們改變時，Effect Event 會在下一次被呼叫時看到新值，但不會讓外層 Effect 重新同步。

事件本身的資料則以參數傳入：

```jsx
onPriceArrived(symbol, nextPrice);
```

這讓 `receivedSymbol` 和 `nextPrice` 明確代表「那一筆行情事件發生時的資料」，而 `muted`、`notificationMode` 代表「處理事件時要讀取的最新設定」。

## 不使用 `useEffectEvent` 會發生什麼？

```jsx
// ❌ 通知設定每改一次，行情 subscription 就重建一次
useEffect(() => {
  return createMarketStream(symbol, nextPrice => {
    setPrice(nextPrice);

    if (!muted) {
      showNotification(nextPrice, notificationMode);
    }
  });
}, [symbol, muted, notificationMode]);
```

直接從 Effect callback 讀取 `muted` 與 `notificationMode` 時，它們就是 Effect 的 reactive dependencies。不能單純從陣列刪掉，否則 callback 會捕捉舊 render 的設定。正確做法是先判斷它們是否真的不該控制外部同步，再把那一小段事件邏輯抽成 Effect Event。

## 常見錯誤

```jsx
// ❌ Effect Event 的 function identity 不穩定，不可放進 dependencies
useEffect(() => {
  onPriceArrived(symbol, price);
}, [onPriceArrived]);

// ❌ 它不是一般 UI event handler
<button onClick={onPriceArrived}>模擬行情</button>;

// ❌ 不可傳給 child 或其他 Hook，應在使用它的 Effect 旁定義
useMarketStream(symbol, onPriceArrived);

// ❌ 真正決定同步對象的 symbol 不能藏進 Effect Event
const connect = useEffectEvent(() => createMarketStream(symbol));
useEffect(() => connect(), []);
```

## 面試回答

> `useEffectEvent` 適合 Effect 內由 subscription、timer 或 DOM listener 觸發的事件邏輯：它需要讀取最新 committed props/state，但那些值不應令外部同步重建。這個案例中 `symbol` 決定行情 subscription，所以留在 Effect dependency；`muted` 與 `notificationMode` 只影響下一筆行情如何通知，所以由 Effect Event 讀取。它不是忽略 dependency lint 的工具，也不能當 `onClick`、傳給 child、傳給其他 Hook，或加入 dependency array。

官方參考：[React `useEffectEvent`](https://react.dev/reference/react/useEffectEvent)、[Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)

[回到 React 19 Hooks 六題練習](/docs/frontend-interview/binance/react-19-hooks-drills#useeffectevent把-effect-事件與-reactive-setup-分開)
