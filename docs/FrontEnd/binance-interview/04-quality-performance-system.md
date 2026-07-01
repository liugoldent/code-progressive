---
title: "效能 / 測試 / 前端系統設計"
description: "Binance Senior Front-end 面試常見的效能優化、測試策略與前端系統設計整理。"
tags:
  - Performance
  - Testing
  - System Design
  - Frontend
keywords: ["frontend performance", "testing", "system design", "React performance"]
sidebar_position: 5
---

# 效能 / 測試 / 前端系統設計

## 前端效能分類

面試時不要只說「用 memo」。先分類問題：

- Loading performance：首屏載入、bundle size、資源載入。
- Runtime performance：互動、scroll、動畫、頻繁 render。
- Network performance：API latency、cache、重試、併發。
- Perceived performance：skeleton、progressive rendering、optimistic UI。
- Stability：錯誤恢復、監控、記憶體洩漏。

## React Runtime Performance

常見優化順序：

1. 先用 Profiler 找到慢在哪。
2. 降低 state 更新範圍。
3. 拆 component，讓高頻更新不影響低頻 UI。
4. 使用 memoized selector。
5. 對昂貴計算用 `useMemo`。
6. 對大量列表用 virtualization。
7. 對高頻事件做 throttle / debounce / batching。

## 高頻行情更新

問題：

WebSocket 每秒推送很多 ticker / order book 更新，如果每筆都 setState，畫面可能卡頓。

策略：

- WebSocket message 先進 buffer。
- 用 `requestAnimationFrame` 合併一個 frame 內的更新。
- 對不可見區域不更新或低頻更新。
- 大列表使用 virtual list。
- 將資料處理移到 Web Worker。
- 僅更新變動 row，不重建整個列表。

```ts
const pendingUpdates: TickerUpdate[] = [];
let scheduled = false;

function onTickerMessage(update: TickerUpdate) {
  pendingUpdates.push(update);

  if (scheduled) return;
  scheduled = true;

  requestAnimationFrame(() => {
    scheduled = false;
    flushTickerUpdates(pendingUpdates.splice(0));
  });
}
```

## Bundle Performance

必會：

- route-level code splitting。
- dynamic import。
- tree shaking。
- 移除未使用 polyfill。
- 避免整包引入大型 library。
- 分析 bundle，例如 webpack-bundle-analyzer。
- 圖片壓縮與 lazy loading。
- CDN caching。

面試例子：

如果交易頁依賴圖表庫，可以只在進入交易頁時 lazy load，不要讓首頁或登入頁承擔圖表庫成本。

## Web Vitals

基本概念：

- LCP：最大內容元素載入時間，反映主要內容何時可見。
- INP：互動延遲，反映使用者操作後頁面反應。
- CLS：版面位移，反映畫面是否跳動。

交易 UI 特別要注意 CLS：

- 數字更新時保留欄位寬度。
- 表格 row 高度固定。
- loading skeleton 尺寸接近實際內容。
- 圖表容器先預留高度。

## 測試策略

面試不要只說「我會寫 unit test」。要能分層。

| 測試 | 目標 | 例子 |
| --- | --- | --- |
| Unit test | 驗證 pure function / reducer / formatter | 價格格式、order book merge、reducer |
| Component test | 驗證 UI 狀態與互動 | 下單表單 validation、error state |
| Integration test | 驗證資料流 | query loading -> success -> mutation invalidate |
| E2E test | 驗證核心流程 | 登入、切換交易對、送出訂單模擬 |
| Visual regression | 避免 UI 破版 | dashboard、modal、mobile layout |

## React Testing Library

回答方向：

- 測使用者看得到、做得到的行為。
- 優先用 role / label 查詢。
- 避免測 implementation detail。
- mock API 要覆蓋 loading、success、error。

```tsx
expect(screen.getByRole("button", { name: /buy/i })).toBeDisabled();
```

比起檢查 className，更應該檢查使用者行為是否正確。

## 系統設計：Trading Dashboard

### 需求

設計一個 futures trading dashboard：

- 顯示 K 線圖。
- 顯示 order book。
- 顯示 ticker。
- 使用者可切換 symbol。
- 使用者可建立 order。
- desktop / mobile responsive。
- 即時資料要穩定更新。

### 架構拆分

```txt
TradingPage
├── SymbolSelector
├── MarketSummary
├── ChartPanel
├── OrderBookPanel
├── TradeForm
├── OpenOrders
└── AccountSummary
```

### 狀態分層

Server state：

- symbol metadata。
- ticker snapshot。
- order book snapshot。
- open orders。
- balances。

Client state：

- current symbol。
- selected interval。
- layout preference。
- trade form draft。
- modal / tab state。

Realtime state：

- WebSocket connection。
- ticker delta。
- depth update。
- reconnect status。

### 資料流

1. 使用者選 symbol。
2. React Query 抓 symbol metadata / snapshot。
3. WebSocket subscribe 該 symbol。
4. delta 更新進 cache 或外部 store。
5. UI 用 selector 取得最小資料。
6. 下單 mutation 成功後 invalidates balances / open orders。

## 可觀測性

Senior 面試可以主動提：

- 前端錯誤監控：runtime error、unhandled rejection。
- API error rate。
- WebSocket reconnect 次數。
- 下單流程 latency。
- React render performance。
- Web Vitals。
- feature flag 與灰度發布。

## 高機率口試題

- 如果 order book 一直更新造成畫面卡頓，你怎麼查？
- 什麼情況會用 virtual list？
- 如何降低 bundle size？
- React Profiler 看到某元件一直 render，你怎麼處理？
- Trading dashboard 的 state 要怎麼分層？
- WebSocket 斷線重連要注意什麼？
- 你會怎麼設計前端測試策略？
- Unit test 和 integration test 分別測什麼？
- 如何避免 layout shift？
- 如何監控 production 前端錯誤？

