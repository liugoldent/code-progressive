---
title: "交易產品前端情境題"
description: "針對 Binance Futures / 交易產品前端常見情境整理的系統設計與實作考點。"
tags:
  - Binance
  - Futures
  - Trading
  - System Design
keywords: ["Binance Futures", "trading UI", "order book", "WebSocket", "financial precision"]
sidebar_position: 6
---

# 交易產品前端情境題

## 為什麼要準備交易產品情境

Binance 前端職缺即使寫的是一般 React / JavaScript，也很可能會追問你是否能處理交易產品的特殊問題：

- 即時資料量大。
- UI 更新頻繁。
- 數字精度要求高。
- 錯誤提示必須明確。
- 使用者操作有資金風險。
- desktop / mobile 都需要高資訊密度。

## 情境一：Order Book

### 面試題

請設計一個 order book component，資料從 REST snapshot 與 WebSocket delta 來。

### 回答方向

資料來源：

- REST 取得初始 snapshot。
- WebSocket 訂閱 depth update。
- 使用 update id / sequence id 確認 delta 沒有漏。
- 漏資料時重新抓 snapshot。

資料結構：

```ts
type OrderBookSide = Map<string, string>;

type OrderBook = {
  lastUpdateId: number;
  bids: OrderBookSide;
  asks: OrderBookSide;
};
```

注意：

- price / quantity 用 string 保存原始精度。
- 顯示前再格式化。
- quantity 為 0 代表刪除該 price level。
- bids 通常價格由高到低，asks 由低到高。

效能：

- 不要每次 delta 都重建全部 row。
- 可限制顯示前 N 檔。
- 高頻 delta 批次處理。
- row 使用穩定 key：`side + price`。

## 情境二：K 線圖

### 面試題

如何設計 K 線圖資料流？

### 回答方向

- REST 抓歷史 K 線。
- WebSocket 更新目前 candle。
- interval 改變時 query key 改變。
- symbol 改變時取消舊請求與舊 subscription。
- 圖表庫 lazy load，避免拖慢首屏。
- resize observer 處理容器尺寸變化。

狀態：

```ts
type Kline = {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
};
```

重點：

- 不要用 index 當 candle key。
- 同一根 candle 更新時應 replace，不是 append。
- 新 interval 需要清掉舊資料 loading state，避免誤讀。

## 情境三：下單表單

### 面試題

設計 buy / sell order form，要注意什麼？

### 回答方向

表單欄位：

- side：buy / sell。
- order type：market / limit / stop。
- price。
- quantity。
- leverage。
- reduce only / post only。

驗證：

- price tick size。
- quantity step size。
- min notional。
- available balance。
- leverage / margin rule。
- market order 風險提示。

UI 狀態：

- 未登入。
- 資產載入中。
- 不合法輸入。
- submitting。
- API reject。
- order accepted。
- partial filled / filled / canceled。

面試關鍵：

前端驗證只能提升 UX，不能取代後端風控。下單結果必須以後端回應為準。

## 情境四：價格精度

### 為什麼不能直接用 number

JavaScript number 是 IEEE 754 floating point，會有精度問題：

```js
0.1 + 0.2 === 0.3 // false
```

交易產品裡 price / quantity / fee 不應直接用 number 做精準計算。

策略：

- API 原始值保存為 string。
- 使用 decimal library 做計算。
- 依 symbol metadata 的 tick size / step size 格式化。
- 顯示與計算分離。

型別方向：

```ts
type DecimalString = string;

type SymbolRule = {
  priceTickSize: DecimalString;
  quantityStepSize: DecimalString;
  minNotional: DecimalString;
};
```

## 情境五：WebSocket 可靠性

需要涵蓋：

- connect。
- subscribe / unsubscribe。
- heartbeat / ping-pong。
- reconnect with backoff。
- resubscribe after reconnect。
- message dedup。
- sequence gap detection。
- fallback to REST snapshot。
- cleanup on unmount。

簡化流程：

```txt
connect
  -> subscribe(symbol)
  -> receive snapshot/delta
  -> detect gap?
      yes -> refetch snapshot
      no  -> apply delta
  -> disconnect?
      reconnect -> resubscribe -> refetch snapshot
```

## 情境六：多裝置交易頁

Desktop：

- 左側 chart。
- 右側 order form。
- 中間 / 下方 order book、open orders。
- 高資訊密度，快捷鍵與 hover detail 可用。

Mobile：

- 重要資訊 tab 化。
- 下單 CTA 固定在安全位置。
- 表格欄位減少，必要資訊優先。
- 避免小螢幕誤觸高風險操作。
- 鍵盤彈出時表單不能被遮住。

## 情境七：錯誤處理

交易產品常見錯誤：

- 網路錯誤。
- API rate limit。
- session expired。
- insufficient balance。
- price precision invalid。
- quantity too small。
- market closed / symbol disabled。
- order rejected by risk control。

回答框架：

1. 顯示使用者能理解的錯誤。
2. 保留技術錯誤給 log / monitoring。
3. 可重試的錯誤提供 retry。
4. 高風險操作不可自動重試。
5. 資產 / 訂單狀態錯誤時要 refetch。

## 高機率系統設計題

- 設計 Binance Futures trading page。
- 設計 order book，如何合併 snapshot 和 delta？
- 設計 K 線圖，如何處理即時更新？
- 設計下單表單，如何處理 validation 和 API error？
- 如何處理 WebSocket reconnect？
- 如何保證價格精度？
- 如果 mobile 下單頁容易誤觸，你怎麼改？
- 如何設計 watchlist？
- 如何設計 open orders 列表？
- 如何讓交易頁在弱網路下仍然可用？

