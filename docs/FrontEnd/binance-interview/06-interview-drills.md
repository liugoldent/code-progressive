---
title: "面試題庫與回答模板"
description: "Binance 前端面試練習題、回答模板、英文口說與行為面試準備。"
tags:
  - Interview
  - Behavioral
  - React
  - JavaScript
keywords: ["frontend interview questions", "Binance interview", "behavioral interview", "React questions"]
sidebar_position: 7
---

# 面試題庫與回答模板

## 自我介紹模板

中文：

> 我主要做前端工程，核心經驗是 React / JavaScript / TypeScript，熟悉狀態管理、API 資料流、responsive UI 和前端工程化。我過去比較重視 production code 的穩定性，例如錯誤處理、loading/error state、元件拆分、效能優化與可維護性。如果面對交易產品，我會特別注意即時資料、數字精度、使用者操作風險，以及大量資料更新下的 UI 效能。

英文：

> I am a frontend engineer focused on React, JavaScript, and TypeScript. My production experience is around building maintainable UI, managing complex state, integrating asynchronous APIs, and improving runtime performance. For trading products, I pay special attention to realtime data, precision, error handling, and keeping the interface responsive under frequent updates.

## 專案經驗回答模板

用 STAR，但技術面要更具體：

- Situation：專案背景與限制。
- Task：你負責什麼。
- Action：你做了哪些技術決策。
- Result：效果如何，有數字更好。

範例：

> 我負責一個資料量很大的 dashboard。原本每次資料更新都會造成整頁重渲染，切換 filter 時也有舊請求覆蓋新資料的問題。我先把 server state 移到 React Query，用 query key 隔離不同 filter，並用 AbortController 避免舊請求回寫。接著把高頻更新區塊拆出去，用 memoized selector 和 virtual list 降低 render 成本。最後 loading/error/empty state 也一起標準化，讓頁面在慢網路下比較穩定。

## React 題庫

### React render 流程是什麼？

回答要點：

- state / props 改變會觸發 render。
- render 產生新的 React element tree。
- React reconciliation 比對新舊 tree。
- commit 階段把必要變更套到 DOM。
- effect 在 commit 後執行，layout effect 時機更早。

### useEffect 和 useLayoutEffect 差在哪？

回答要點：

- `useEffect` 在 paint 後執行，不阻塞畫面。
- `useLayoutEffect` 在 DOM 更新後、瀏覽器 paint 前執行。
- 需要同步量測 DOM 或避免閃爍時才用 `useLayoutEffect`。
- 濫用 `useLayoutEffect` 會阻塞 paint。

### 什麼狀況會造成不必要 render？

回答要點：

- parent state 更新導致 child 跟著 render。
- props 每次都是新 reference。
- context value 每次重建。
- selector 回傳新 object。
- key 不穩定造成 remount。

### 如何優化？

回答要點：

- 先 profiler。
- state colocate。
- 拆 context。
- `React.memo`。
- `useMemo / useCallback`。
- memoized selector。
- virtual list。
- batching high-frequency updates。

## Redux / React Query 題庫

### Redux 解決什麼問題？

回答：

Redux 讓複雜 client state 有可預測的單向資料流。action 描述事件，reducer pure function 產生下一個 state，selector 讓 view 只取需要的資料，middleware 處理 side effect。它適合跨元件共享、需要一致性的 client state。

### React Query 解決什麼問題？

回答：

React Query 管理 server state，包含 fetching、cache、stale data、retry、background refetch、mutation 和 invalidation。它避免每個元件自己寫 loading/error/cache 邏輯，也能讓相同 query key 的資料共享。

### 下單成功後如何更新 UI？

回答：

- mutation 成功後 invalidate open orders / balances。
- 若後端回傳新 order，可先更新 cache。
- 高風險交易不隨便 optimistic update。
- 如果 WebSocket 也會推訂單狀態，要避免 REST 和 WS 重複更新造成閃爍。

## JavaScript 題庫

### event loop

最短回答：

JavaScript 先跑 call stack 的同步程式。Promise callback 進 microtask，timer / event 多數進 macrotask。每次 stack 清空後會先清 microtask，再進下一個 macrotask。大量 microtask 可能讓瀏覽器沒有機會 paint。

### debounce vs throttle

- debounce：停止觸發一段時間後才執行，適合搜尋輸入。
- throttle：固定時間最多執行一次，適合 scroll、resize、高頻行情 UI 更新。

交易資料通常更常用 throttle / batching，因為資料持續進來，不能等到完全停止才更新。

### deep clone 怎麼做？

回答要點：

- JSON 方法會丟失 function、Date、Map、Set、undefined，也處理不了 circular reference。
- `structuredClone` 支援更多資料型別，但仍不適合所有情境。
- 大型 state 更應該避免深層 clone，改用 normalized state 或 immutable update。

## CSS / UI 題庫

### 如何做 responsive trading dashboard？

回答：

我會先依資訊優先級拆區塊。Desktop 用 grid 保留 chart、order book、trade form 同屏；tablet 把次要區塊收進 tabs；mobile 改單欄，把下單操作放在清楚但不易誤觸的位置。表格在 mobile 可能改成 card 或水平 scroll，數字欄位要保留對齊與格式。

### 如何確保 UI quality？

回答：

我會為每個資料區塊定義 loading、empty、error、success、disabled 和 pending 狀態，並確保 responsive、keyboard 操作和錯誤提示完整。交易產品還會特別檢查數字格式、漲跌顏色、錯誤提示、提交中防重複操作。

## Tooling 題庫

### Webpack loader 和 plugin 差異？

回答：

Loader 是針對單一 module 的轉換，例如把 TypeScript、CSS、圖片轉成 Webpack 能處理的內容。Plugin 是掛在 Webpack build lifecycle 上，能做更全域的事情，例如產生 HTML、抽 CSS、注入環境變數、分析 bundle。

### 如何降低 bundle size？

回答要點：

- code splitting。
- lazy load routes / chart library。
- tree shaking。
- 避免整包 import。
- 檢查 polyfill。
- bundle analyzer。
- 壓縮圖片與字體。
- CDN cache。

## 行為面試題

準備 5 個故事：

- 解過一個 production bug。
- 推動過一次效能優化。
- 和設計師 / 後端意見不同時怎麼處理。
- 接手 legacy code 後如何改善。
- deadline 緊時如何取捨品質與交付。

每個故事要包含：

- 背景。
- 你的責任。
- 技術決策。
- trade-off。
- 結果。
- 學到什麼。

## 反問面試官

可以問：

- 這個 team 負責 Binance 哪一塊產品？
- 前端主要技術棧是 React + Redux / React Query 嗎？
- 即時資料主要透過 WebSocket 還是內部資料層？
- 團隊如何衡量前端效能與穩定性？
- Senior frontend 在系統設計與跨團隊協作上期待到什麼程度？
- On-call 或 production incident 的處理流程是什麼？

## 最後一週 checklist

- 能白板說清 React Query vs Redux。
- 能設計 order book snapshot + delta。
- 能解釋 event loop。
- 能說明一次實際效能優化。
- 能寫出 TypeScript discriminated union。
- 能講 responsive dashboard 策略。
- 能準備 5 個 STAR 故事。
- 能用英文講 1 分鐘自我介紹。
- 能做 20 題常見 LeetCode easy / medium。
- 能針對 Binance 交易產品提出合理反問。

