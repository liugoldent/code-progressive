---
title: "面試題庫與回答模板"
description: "Binance 前端面試練習題、回答模板、英文口說與行為面試準備。"
tags:
  - Interview
  - Behavioral
  - React
  - JavaScript
keywords: ["frontend interview questions", "Binance interview", "behavioral interview", "React questions"]
sidebar_position: 10
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

答題版：

React 的更新大致分成 render 和 commit。當 state 或 props 改變時，React 會重新呼叫 component function，產生新的 React element tree；接著透過 reconciliation 比對新舊 tree，找出需要變更的部分。真正更新 DOM 是 commit 階段，commit 後一般 `useEffect` 才會執行；`useLayoutEffect` 則是在 DOM 更新後、瀏覽器 paint 前執行。重點是 render 不等於整個 DOM 重建，React 會盡量只 commit 必要變更。

### useEffect 和 useLayoutEffect 差在哪？

答題版：

`useEffect` 會在瀏覽器 paint 後執行，所以不會阻塞使用者看到畫面，適合同步外部資料、訂閱事件、打 API。`useLayoutEffect` 在 DOM commit 後、paint 前同步執行，適合需要量測 DOM 尺寸、同步調整 layout、避免畫面閃爍的情境。因為它會阻塞 paint，所以不應該把一般 side effect 都放進 `useLayoutEffect`。

### 什麼狀況會造成不必要 render？

答題版：

常見原因是 state 放太高，parent 每次更新都讓 child 跟著 render；或 props 每次都是新 reference，例如 inline object、array、function。Context value 每次重建也會讓 consumers 更新；Redux selector 如果每次回傳新 object，也會造成 re-render。另一種是 key 不穩定，讓 React 以為 item 換了，直接 remount component。面試時我會補一句：先用 Profiler 確認 render 來源，再決定要不要 memo。

### 如何優化？

答題版：

我會先用 React Profiler 找出真正慢的 component 和 render 原因。若 state 放太高，就把 state colocate 到需要的區域；若 context 造成大範圍更新，就拆 context 或穩定 provider value；若 props reference 不穩定，再用 `useMemo`、`useCallback` 或 `React.memo`。Redux 場景會用 memoized selector；大量列表用 virtual list；高頻行情則用 batching 或 `requestAnimationFrame` 合併更新。優化後要重新量測，避免只增加複雜度。

## Redux / React Query 題庫

### Redux 解決什麼問題？

回答：

Redux 讓複雜 client state 有可預測的單向資料流。action 描述事件，reducer pure function 產生下一個 state，selector 讓 view 只取需要的資料，middleware 處理 side effect。它適合跨元件共享、需要一致性的 client state。

### React Query 解決什麼問題？

回答：

React Query 管理 server state，包含 fetching、cache、stale data、retry、background refetch、mutation 和 invalidation。它避免每個元件自己寫 loading/error/cache 邏輯，也能讓相同 query key 的資料共享。

### 下單成功後如何更新 UI？

答題版：

下單成功後我會先讓 mutation 進入 success / accepted 狀態，接著 invalidate open orders、balances、order history 這些相關 query。如果 API 回傳完整 order，也可以先 `setQueryData` 更新 cache，讓 UI 立即反應。但交易是高風險操作，我不會隨便 optimistic update 成已成交，因為後端風控、撮合狀態或餘額都可能改變結果。最終訂單狀態應以後端 response 和 WebSocket order update 校正。

## JavaScript 題庫

### event loop

最短回答：

JavaScript 先跑 call stack 的同步程式。Promise callback 進 microtask，timer / event 多數進 macrotask。每次 stack 清空後會先清 microtask，再進下一個 macrotask。大量 microtask 可能讓瀏覽器沒有機會 paint。

### debounce vs throttle

- debounce：停止觸發一段時間後才執行，適合搜尋輸入。
- throttle：固定時間最多執行一次，適合 scroll、resize、高頻行情 UI 更新。

交易資料通常更常用 throttle / batching，因為資料持續進來，不能等到完全停止才更新。

### deep clone 怎麼做？

答題版：

如果只是簡單 JSON-compatible object，可以用 `JSON.parse(JSON.stringify(obj))`，但它會丟掉 function、Date、Map、Set、undefined，也不能處理 circular reference。現代瀏覽器可用 `structuredClone`，支援更多資料型別，但仍不代表應該對大型 state 做深拷貝。React/Redux 裡更好的做法通常是 immutable update、normalized state、或用 Immer 處理局部更新，避免不必要的大量 clone。

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

答題版：

我會先用 bundle analyzer 找出最大 chunk 和最大依賴，再決定優化策略。常見做法包含 route-level code splitting、lazy load chart library、避免整包 import、確保 ESM tree shaking 生效、移除不必要 polyfill、替換過大的套件、壓縮圖片與字體。對交易頁來說，圖表和技術指標相關 library 可以延後到進入 trading page 才載入，不應影響首頁或登入頁。

## 行為面試題

準備 5 個故事，每題都用 STAR，但 Action 要講出技術決策。

### 解過一個 production bug。

答題方向：

先講影響範圍，例如某個 dashboard 在特定瀏覽器白屏、下單表單錯誤、或 API race condition 導致資料顯示錯。接著說你如何定位：看 error monitoring、重現步驟、查 release diff、加 log、回滾或 hotfix。Action 要包含止血與根因修復，例如先 rollback，再修 race condition 或補測試。最後講結果：錯誤率下降、恢復時間、補了哪種 regression test。

### 推動過一次效能優化。

答題方向：

不要只說「我用了 memo」。先講量測到的問題，例如列表 scroll 掉幀、切換 filter 慢、bundle 太大。Action 可以是 React Profiler 找 render 熱點、拆 state、memoized selector、virtual list、code splitting、batching WebSocket updates。Result 最好有數字，例如 render 次數下降、LCP 改善、bundle 減少、互動延遲降低。

### 和設計師 / 後端意見不同時怎麼處理。

答題方向：

先承認目標是一致的：交付對使用者正確且可維護的方案。和設計師不同時，用限制條件和使用者場景討論，例如 mobile 誤觸風險、可訪問性、資訊密度；和後端不同時，用 API contract、錯誤碼、資料一致性、效能成本對齊。重點是你有提出替代方案、明確 trade-off，並把決策記錄下來，而不是只說服對方照你的做。

### 接手 legacy code 後如何改善。

答題方向：

先講你不會一開始就大重構，而是先建立安全網：理解業務流程、補關鍵測試、整理模組邊界、找出最痛的維護點。Action 可以是把重複邏輯抽成 hook / utility、加 TypeScript 型別、拆大 component、移除 dead code、逐步替換舊資料流。Result 要強調風險可控，例如 bug 減少、交付變快、onboarding 容易。

### deadline 緊時如何取捨品質與交付。

答題方向：

我會先拆需求成 must-have 和 nice-to-have，確保核心流程正確且可回滾。品質底線不能退，例如型別檢查、核心測試、錯誤處理、風險提示、監控；可以延後的是非核心動畫、低優先級設定、少量視覺 polish。若真的需要 trade-off，會和 PM/設計/後端同步風險，留下 TODO 和後續補強計畫，而不是偷偷降低品質。

## 反問面試官

| 可以問的問題 | 你想確認什麼 |
| --- | --- |
| 這個 team 負責 Binance 哪一塊產品？ | 確認是 Futures、Spot、Wallet、Growth 還是內部平台，方便判斷業務場景和技術重點。 |
| 前端主要技術棧是 React + Redux / React Query 嗎？ | 確認你的準備是否對齊團隊實際 stack，也能順便引出你對狀態管理的理解。 |
| 即時資料主要透過 WebSocket 還是內部資料層？ | 確認團隊如何處理行情、訂單、資產更新，判斷即時資料與可靠性要求。 |
| 團隊如何衡量前端效能與穩定性？ | 確認是否看 Web Vitals、error rate、reconnect rate、下單流程 latency 等 production 指標。 |
| Senior frontend 在系統設計與跨團隊協作上期待到什麼程度？ | 確認職級期待，包含是否需要主導架構、review API contract、推動工程治理。 |
| On-call 或 production incident 的處理流程是什麼？ | 確認前端是否參與事故處理、監控告警、回滾和 postmortem。 |

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
