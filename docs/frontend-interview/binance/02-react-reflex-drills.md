---
sidebar_position: 3
title: "Vue 轉 React：30 次反射訓練"
description: "給已會 Vue、知道基本 React Hooks 但還不熟練的工程師，透過閉卷實作、debug、口述與交易頁小題建立 React render、state、effect、closure 與資料流反射。"
tags:
  - React
  - Vue
  - Practice
  - Interview
keywords: ["Vue 轉 React 練習", "React Hooks 練習", "React 面試實作", "React stale closure", "React useEffect 練習", "React debug", "Binance frontend interview"]
---

# Vue 轉 React：30 次反射訓練

這份練習不是要背更多 API，而是把下面這條判斷鏈練到不必停頓：

```txt
需求進來
→ source of truth 在哪裡？
→ 是 props、state，還是 render 時可推導的值？
→ 由使用者事件觸發，還是要同步外部系統？
→ 會不會跨 render、需要 cleanup、可能 race？
→ 先寫最小正確版本
→ 有量測到瓶頸才做 memoization
```

## 通關標準

練到下面四件事，才算從「會用 Hook」進到「有 React 反射」：

- 20 到 30 分鐘內，能從空白寫出一個有 props、state、表單與列表的 TypeScript component。
- 看到需求時，能先判斷要不要 state / effect，而不是先挑 Hook。
- 看到 stale closure、直接 mutate state、漏 cleanup、錯誤 key、request race，能指出原因並修正。
- 寫完後能用 60 秒說清楚 source of truth、render 觸發點、effect 生命週期與 trade-off。

## 每題固定規則

1. 第一輪 25 分鐘不用 AI，不開完整範例。
2. 可以查 TypeScript 型別或 API 拼字，但先寫下自己的資料流。
3. 至少手動測一個 happy path 和一個 edge case。
4. 寫完要回答本題的口述問題。
5. 再讓 AI 做 reviewer：只能指出 bug、反例與追問，先不要讓它整題重寫。
6. 隔天從空白重寫昨天最卡的一題；能重現才算完成。

AI 可以縮短查資料時間，但面試現場需要的是你能判斷 AI 產出的 effect、dependency、cleanup 與 state 架構是否正確。

## 寫 React 前先問七題

| 問題 | 判斷方向 |
| --- | --- |
| 誰擁有這份資料？ | 最接近需要共同使用它的 component；伺服器資料不要複製成多份 local state |
| 畫面是否真的需要記住它？ | 需要跨 render 且改變後要更新畫面才考慮 state |
| 能否從現有 props / state 算出？ | 能就直接在 render 推導，不要再建一份 state + effect |
| 是哪個事件造成變化？ | click、change、submit 的邏輯放 event handler |
| 是否在同步外部系統？ | WebSocket、timer、DOM event、network、storage 才是 effect 候選 |
| 跨 render 要保存但不必更新畫面嗎？ | connection、timer id、buffer、latest mutable value 可考慮 ref |
| 現在真的有可量測的效能問題嗎？ | 沒有就先保持簡單；不要反射性加入 memo |

## Vue 到 React 的決策對照

這張表是遷移提示，不是逐字替換表。

| Vue 習慣 | React 優先思考 | 常見誤區 |
| --- | --- | --- |
| `ref` / `reactive` | 畫面要記住的值用 `useState` / `useReducer`；不影響畫面的 mutable value 用 `useRef` | 把每個區域變數都做成 state |
| `computed` | 先直接在 render 推導；昂貴計算或需穩定 reference 時才 `useMemo` | 每個 derived value 都包 `useMemo` |
| `watch` / `watchEffect` | 先判斷是否真在同步外部系統，再用 `useEffect` | 用 effect 同步兩份 React state |
| `emit` | 父層傳 callback，子層回報事件 | 子層直接修改 props |
| `v-model` | controlled input：`value` + `onChange` | 同時讓 DOM 與 React 都當 source of truth |
| composable | custom Hook 組合 stateful logic | 只因程式碼長就抽 Hook；普通 pure function 不必叫 `use` |
| Pinia / Vuex | 先 colocate；真的跨區域共享再選 Context / Redux 等 store | 所有 state 都放全域 |
| template 自動追蹤 | component 是某次 props/state 的 UI snapshot | 直接 mutate object，期待 React 追蹤欄位 |

## 第一階段：基本資料流（第 1～6 次）

### 1. Counter，不准只寫加一

需求：顯示 count，提供 `+1`、`+3`、reset，count 不得低於 0。

必須練到：

- `+3` 使用三次 updater 或一次根據前值的 updater，並能解釋 snapshot / batching。
- reset 是 event logic，不需要 effect。
- 說明為什麼普通區域變數不能保存 count。

口述題：為什麼連續三次 `setCount(count + 1)` 不保證得到 `+3`？

### 2. Controlled Order Form

需求：建立 `side`、`price`、`quantity` 三個欄位，顯示 notional，輸入無效時 disabled submit。

限制：

- notional 不得另建 state。
- 不得用 effect 計算 validation。
- price / quantity 在輸入階段先保存 string，避免使用者輸入中間態被破壞。

口述題：哪些是 source state，哪些是 derived data？

### 3. List identity

需求：顯示可新增、刪除、重新排序的 watchlist，每列有自己的 note input。

必須驗證：

- 使用 stable symbol / id 當 key。
- 用 array index 當 key 後重排，觀察 note 跑到錯列，再修正。
- 用 immutable update 增刪排序。

口述題：`key` 為什麼不只是拿來消除 warning？

### 4. Parent / child data flow

需求：`TradingPage` 擁有 current symbol；`SymbolSelector` 選擇；`TickerCard` 顯示。

限制：子元件不能複製一份 current symbol state，也不能修改 props。

口述題：為什麼共用 state 要提升到最近共同父層？什麼時候不該再往上提升？

### 5. Immutable nested update

需求：更新以下 state 的 `risk.maxPosition`，並讓依賴 `settings` 的 child 正確收到新 reference。

```ts
type Settings = {
  theme: "dark" | "light";
  risk: {
    maxPosition: string;
    confirmBeforeSubmit: boolean;
  };
};
```

口述題：直接寫 `settings.risk.maxPosition = value` 有哪兩類問題？

### 6. State structure

需求：設計訂單送出狀態，至少包含 `idle`、`submitting`、`success`、`error`。

加分：用 TypeScript discriminated union 避免同時出現 `isLoading: true` 和 `isSuccess: true` 的不合法組合。

口述題：何時 `useReducer` 比多個 `useState` 更容易維護？

## 第二階段：Effect 與 Closure（第 7～12 次）

### 7. You Might Not Need an Effect

修正這段程式，不要用 effect 保存 `fullName`：

```tsx
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

口述題：這種寫法為什麼多一次 render，也可能讓 state 失去同步？

### 8. Timer stale closure

先預測這段程式會印什麼，再改成符合「每秒以最新 count 記錄」的版本：

```tsx
useEffect(() => {
  const id = window.setInterval(() => {
    console.log(count);
  }, 1000);

  return () => window.clearInterval(id);
}, []);
```

至少提出兩種解法，並說明重新建立 subscription 與使用 ref 的 trade-off。

### 9. Effect cleanup

需求：訂閱 `window.resize` 並顯示 viewport width。

必須驗證：

- handler reference 可正確移除。
- unmount 後不再更新。
- 開發環境 Strict Mode setup → cleanup → setup 仍正確。

口述題：Strict Mode 為什麼可能讓 effect 看起來執行兩次？

### 10. Async request race

需求：快速切換 `BTCUSDT`、`ETHUSDT` 時，舊 response 不得覆蓋新 symbol。

至少實作一種：

- `AbortController` 取消舊 request。
- 使用 request id / ignore flag，讓過期 response 不 commit。
- 使用 TanStack Query，以 query key 隔離 symbol 並正確傳遞 abort signal。

口述題：cleanup 只能避免 React warning，還是也關係到資料正確性？

### 11. `useRef` 與 `useState` 選擇

把以下資料分類：input value、WebSocket instance、latest tick buffer、connection status、animation frame id、modal open state。

規則：使用者需要立刻看到的狀態通常不能只放 ref；不影響畫面的 runtime handle 不需要 state。

### 12. Custom Hook boundary

實作 `useDocumentTitle(title)` 與 `useOnlineStatus()`，再回答：

- 哪些 state 是每個 consumer 各自擁有？
- custom Hook 是否會自動共享 state？
- 哪一段其實只需要 pure utility function？

## 第三階段：資料狀態與可靠性（第 13～18 次）

### 13. Loading / error / empty / success

為 open orders 列表完整建模四種狀態。背景 refetch 時保留舊資料，不要把整個畫面清空成 spinner。

### 14. Query key

設計 symbol、status、page 都會改變的 open orders query key。說明漏掉其中一個參數會造成什麼 cache collision。

### 15. Mutation lifecycle

實作 mock create order：pending 時防重複提交、錯誤可重試、成功後更新或 invalidate open orders / balances。

限制：不能把「已送出」optimistic 地顯示成「已成交」。

### 16. Client / server / URL / form state 分類

分類 current symbol、selected interval、balances、open orders、modal、draft price、theme、shareable filters，並為每個選擇 owner。

### 17. Reducer state machine

用 reducer 表達 WebSocket 的 `idle → connecting → open → reconnecting → failed`。不允許以多個 boolean 表達互相衝突的狀態。

### 18. Integration test

至少測：初次 loading、成功、empty、API error、快速切 symbol、submit pending 防連點、mutation 後列表更新。

## 第四階段：Realtime 與效能（第 19～24 次）

### 19. Snapshot + delta

先用 REST snapshot 建 order book，再套 WebSocket delta。quantity 為 0 時刪除 level；sequence gap 時停止相信本地資料並重新同步。

### 20. Buffer + animation frame

WebSocket message 先進 buffer，一個 animation frame 最多 commit 一次 UI。記得在 unmount 取消 animation frame 與關閉 socket。

口述題：這是在節流資料來源、資料處理，還是 UI 呈現？被合併的 tick 是否仍影響最終正確狀態？

### 21. Reconnect

實作 exponential backoff + jitter、最大重試、重新訂閱與 stale UI。切換 symbol 後，舊 socket 不得再更新新畫面。

### 22. Render profiling

刻意讓 parent 每 100 ms 更新，記錄 child render 次數。依序嘗試：

1. state colocate。
2. 拆 component / context。
3. 穩定 props。
4. 最後才評估 `memo` / `useMemo` / `useCallback`。

要留下優化前後數據；只說「感覺比較快」不算完成。

### 23. Large list

比較「只顯示 order book 前 20 檔」與「對歷史成交紀錄使用 virtualization」。說明為什麼資料只有 20 列時不必急著 virtualize。

### 24. Main-thread budget

製造一次昂貴排序，使用 Chrome Performance 判斷成本在計算、React render、layout 還是 paint。需要時把純計算移到 Web Worker，但先算清楚 serialization 成本。

## 第五階段：面試輸出（第 25～30 次）

### 25. 45 分鐘 React coding

閉卷完成一個 watchlist：搜尋、排序、favorite、loading/error/empty、TypeScript。最後用 3 分鐘說明 state structure。

### 26. 30 分鐘 React debugging

混合修復：mutation、index key、missing dependency、漏 cleanup、derived state effect、async race。每修一項都要先解釋 observable symptom。

### 27. Trading page system design

15 分鐘內說完：需求、狀態分層、REST + WebSocket 資料流、snapshot + delta、效能、錯誤恢復、測試、監控。

### 28. Security review

針對登入與下單流程列出：XSS、CSRF 是否成立、token/cookie、CSP、重複提交、idempotency key、敏感 log、第三方 script。若走 Wallet 分支，再加 chain / address / amount / approval / signature intent。

### 29. Vue → React 專案故事

準備一個真實 Vue 專案，用 React 語言重新解釋：

- 原本的 state / computed / watcher / Pinia 在 React 會如何切分？
- 哪些架構能力可以直接轉移？
- 哪些 React 風險需要額外處理？
- 不要聲稱尚未做過的 React production 經驗。

### 30. Full mock interview

完整跑一次：英文自介 1 分鐘、React 核心 10 分鐘、coding 45 分鐘、system design 30 分鐘、behavioral 20 分鐘、反問 5 分鐘。

錄音後只檢查三件事：有沒有先回答核心、是否用具體例子、trade-off 是否清楚。

## React Debug 必背症狀表

| 症狀 | 第一個檢查點 |
| --- | --- |
| setState 後立刻讀到舊值 | state 是本次 render snapshot；是否應用 updater 或把後續邏輯放事件中 |
| interval / socket callback 一直讀舊資料 | callback 捕捉哪次 render；dependency、functional update 或 ref 哪個符合語意 |
| effect 一直重跑 | dependency 是否每次建立新 object / function；effect 是否根本不需要 |
| 切換 symbol 後顯示舊資料 | 舊 request / subscription 是否取消；query key / sequence 是否正確 |
| 列表排序後 input 狀態跑錯列 | key 是否使用 array index 或不穩定值 |
| 物件欄位改了但畫面沒更新 | 是否直接 mutate；setter 是否得到新 reference |
| 所有 consumer 一起重 render | Context value、state owner、selector 範圍是否過大 |
| memo 加了仍然 render | props / context / local state 是否真的穩定；是否找錯瓶頸 |
| 開發環境連線建立兩次 | Strict Mode 是否暴露 cleanup 不完整，而不是先怪 React |

## 每題 60 秒口述模板

> 這題的 source of truth 是 ___，放在 ___，因為 ___。畫面中的 ___ 可以由現有資料直接推導，所以不另外存 state。___ 是使用者事件，放在 handler；___ 需要同步外部系統，所以放 effect，dependency 是 ___，cleanup 會 ___。我先保持 render simple；只有 Profiler 顯示 ___ 是瓶頸時，才會考慮 ___。主要 edge case 是 ___，我會用 ___ 驗證。

## 自評表

每項 0～2 分，總分至少 10，且「正確性」不可為 0，才進下一階段。

| 項目 | 0 分 | 1 分 | 2 分 |
| --- | --- | --- | --- |
| 正確性 | happy path 也錯 | happy path 正確 | edge case、cleanup、race 也處理 |
| 獨立完成 | 依賴完整答案 | 需要少量提示 | 可從空白完成 |
| React 決策 | 先堆 Hook | 大致知道 owner | 能清楚區分 state / derived / event / effect / ref |
| TypeScript | 大量 `any` | 基本 props/state 型別 | union、narrowing、API boundary 清楚 |
| 測試 | 沒驗證 | 手動驗 happy path | 自動測試關鍵行為與失敗狀態 |
| 口述 | 只描述語法 | 能講流程 | 能講原理、替代方案與 trade-off |

分數只是回饋工具。真正的通關訊號是：隔天不看答案仍能重現，並能故意改壞再說出會出現什麼症狀。
