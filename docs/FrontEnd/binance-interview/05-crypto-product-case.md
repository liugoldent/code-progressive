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

### 標準口述答案

我會先用 REST 抓 order book snapshot，拿到 `lastUpdateId`，再建立 WebSocket 訂閱 depth delta。收到 delta 時先檢查 sequence 是否連續；如果發現 gap，就丟棄目前本地 order book 並重新抓 snapshot。資料結構上 bids / asks 可以用 Map，以 price 當 key，quantity 為 0 時刪除該 level，最後顯示時再排序並取前 N 檔。效能上不會每筆 message 都 setState，而是用 buffer + `requestAnimationFrame` 或固定 interval 批次更新，並確保 row key 穩定，避免整表重建。

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

### 標準口述答案

我會把 K 線資料分成歷史資料和即時更新兩段。進入頁面或切換 symbol / interval 時，用 REST 抓歷史 candles，query key 包含 symbol 和 interval；WebSocket 只負責更新最新一根 candle 或 append 新 candle。判斷依據是 candle open time：如果 open time 相同就 replace 最新 candle，如果是新的 open time 才 append。圖表庫通常比較大，所以會 route-level lazy load；容器尺寸用 ResizeObserver 同步，避免 responsive 下圖表寬高錯誤。

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

### 標準口述答案

我會把下單表單設計成明確的狀態機：未登入、資料載入、可輸入、驗證失敗、提交中、提交成功、提交失敗。前端會根據 symbol rule 驗證 tick size、step size、min notional、餘額與槓桿限制，並對 market order 或高槓桿顯示風險提示。提交時 button disabled，避免重複送單；API reject 時顯示使用者能理解的錯誤，並 refetch balances / open orders。前端 validation 只做 UX 與初步防呆，最終成交與 reject 必須以後端和 WebSocket order update 為準。

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

### 標準口述答案

金融價格不能直接用 JavaScript number 做精準計算，因為 floating point 會有誤差。我會把 API 回來的 price、quantity、fee 都以 string 保存，計算時用 decimal library 或轉成最小單位整數。格式化時要依每個 symbol 的 tick size 和 step size，而不是硬寫小數位。計算邏輯和顯示邏輯要分開，避免把格式化後的字串再拿去做核心計算。

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

### 標準口述答案

WebSocket 我會設計成可恢復的連線層。建立連線後送 subscribe，透過 ping/pong 或 heartbeat 偵測斷線；斷線後用 exponential backoff 重連，成功後重新 subscribe 目前 symbol，並重新抓 snapshot 校正資料。每筆 message 要有 sequence / event time 檢查，避免重複或漏資料。component unmount 或切換 symbol 時要 unsubscribe / close，防止舊連線繼續更新 UI。

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

### 標準口述答案

多裝置交易頁不能只是縮放 desktop。Desktop 可以高資訊密度，把 chart、order book、trade form、open orders 同屏呈現；mobile 則要把資訊分層，用 tab 或 bottom sheet 切換 chart、深度、下單、訂單。高風險操作要增加確認和清楚狀態，不要讓 CTA 太靠近容易誤觸的位置。表單要處理鍵盤遮擋、safe area、touch target，表格要減欄或改橫向 scroll，但價格與數量仍要對齊。

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

### 標準口述答案

我會先把錯誤分成可重試、不可重試、需要重新登入、需要使用者修正輸入、以及高風險交易 reject。UI 顯示要讓使用者知道下一步，例如餘額不足、價格精度不合法、session 過期要重新登入；技術細節放到 log 和 monitoring。一般查詢失敗可以提供 retry，但下單這種高風險操作不能盲目自動重試。當資產或訂單 API 失敗時，畫面要標示資料可能過期，並在恢復後 refetch。

## 高機率系統設計題與答案

### 設計 Binance Futures trading page。

我會先拆需求：行情展示、K 線、order book、下單表單、資產、open orders、成交紀錄、responsive。架構上 REST/React Query 負責 snapshot 和帳戶資料，WebSocket 負責 ticker、depth、order update；client state 管 current symbol、interval、layout、表單 draft。UI 分成 `TradingPage`、`ChartPanel`、`OrderBookPanel`、`TradeForm`、`OpenOrders`、`AccountSummary`。效能上高頻資料 batching，order book 限制檔位，列表 virtualization；可靠性上處理重連、sequence gap、錯誤、loading、data stale 和 monitoring。

### 設計 order book，如何合併 snapshot 和 delta？

先 fetch snapshot，保存 `lastUpdateId`；WebSocket delta 到來時檢查 delta 的 sequence 是否接在 snapshot 後面。符合順序就套用：quantity 為 0 刪除 price level，否則 upsert 該 price level；bids 由高到低，asks 由低到高排序。若 sequence 不連續，代表漏資料，必須重新抓 snapshot。效能上 delta 先 buffer，批次更新 UI，只渲染可見前 N 檔。

### 設計 K 線圖，如何處理即時更新？

歷史 K 線用 REST query，key 包含 symbol 和 interval；即時 K 線用 WebSocket。收到更新後用 `openTime` 判斷是更新當前 candle 還是新增 candle：同一個 openTime 就 replace，新的 openTime 才 append。切換 symbol / interval 時取消舊請求和舊 subscription，避免舊資料污染新圖。圖表庫 lazy load，容器 resize 要同步 chart resize。

### 設計下單表單，如何處理 validation 和 API error？

前端 validation 先依 symbol rule 檢查 price tick、quantity step、min notional、餘額、槓桿限制和必填欄位；送出時進 submitting 狀態並防重複提交。API error 要映射成使用者可理解的訊息，例如餘額不足、價格精度錯誤、風控 reject。成功後 invalidate balances / open orders，並等待 WebSocket order update 校正最終狀態。高風險 mutation 不做盲目 optimistic update。

### 如何處理 WebSocket reconnect？

我會加入 heartbeat 偵測連線健康，斷線後用 exponential backoff 重連，並限制最大重試或顯示失敗狀態。重連成功後重新 subscribe 所有目前需要的 channel，並重新抓 snapshot，因為斷線期間可能漏 delta。UI 要顯示 reconnecting / stale 狀態，讓使用者知道資料不是最新。unmount、登出或切換 symbol 時要 cleanup 舊連線與 timer。

### 如何保證價格精度？

資料層保留 decimal string，不用 number 做核心計算。計算層使用 decimal library 或最小單位整數，並依 symbol metadata 的 tick size、step size、min notional 驗證。顯示層負責格式化，不把格式化結果回寫成計算來源。提交訂單前再次用同一套 rule normalize，避免 UI 顯示合法但送到 API 不合法。

### 如果 mobile 下單頁容易誤觸，你怎麼改？

我會先檢查 touch target、CTA 位置、button 間距、顏色語意與確認流程。高風險操作例如 market order 或高槓桿下單，可以加入確認 sheet，明確列出 side、symbol、price、quantity、notional、leverage。Buy/Sell 顏色和文案要清楚，提交中 disabled，避免連點。也要處理鍵盤彈出時 CTA 被遮住或位置跳動。

### 如何設計 watchlist？

Watchlist 是使用者偏好與行情資料的組合。使用者自選 symbol 清單可以存在 server 或 client preference，React Query 抓 watchlist metadata，WebSocket 訂閱 watchlist ticker。UI 要支援新增、移除、排序、搜尋、持久化與錯誤恢復。效能上若 watchlist 很長，不應每個 symbol 建一條獨立 connection，而應使用批量訂閱或合併 stream。

### 如何設計 open orders 列表？

Open orders 初始資料用 REST query，依 account、symbol、status 做 query key；WebSocket order update 用來更新訂單狀態。列表要支援 loading、empty、error、cancel pending、partial filled、filled、canceled。取消訂單是 mutation，成功後 invalidate open orders / balances，或直接更新該 order cache。表格欄位要固定寬度並格式化數字，mobile 可減欄或進 detail view。

### 如何讓交易頁在弱網路下仍然可用？

弱網路下要保留已有資料並標示 stale，不要一 refetch 就清空畫面。API request 要有 timeout、retry policy、取消機制；WebSocket 斷線要重連並顯示 reconnecting。對核心操作要保守：如果餘額或風控資料不可信，下單 button 應 disabled 或要求重新整理。靜態資源要 code split 和 cache，錯誤提示要清楚，恢復連線後 refetch snapshot 校正狀態。
