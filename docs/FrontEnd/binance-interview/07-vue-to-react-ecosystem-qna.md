---
title: "Vue 轉 React 生態面試題"
description: "給 Vue 背景工程師準備 Binance React 前端職缺的高機率面試題與口述答案。"
tags:
  - Vue
  - React
  - Interview
  - Binance
keywords: ["Vue to React", "React interview", "Binance frontend", "Redux", "React Query", "Hooks"]
sidebar_position: 8
---

# Vue 轉 React 生態面試題

## 這篇怎麼用

你本來寫 Vue，不代表不能面 React 職缺。面試官真正想確認的是：

- 你是否理解 React 的 mental model，而不是把 Vue 寫法硬搬過來。
- 你是否知道 React 生態常見工具的分工，例如 Redux、React Query、React Router。
- 你是否能在交易產品場景下處理即時資料、表單、效能與錯誤。
- 你是否能誠實說出 Vue / React 差異，並把既有前端經驗轉換成 React 可用的能力。

## Vue 候選人常被追問

### 你原本主要寫 Vue，為什麼覺得可以勝任 React 職缺？

答題版：

我會先承認 Vue 和 React 的寫法不同，但前端工程核心能力是共通的：JavaScript / TypeScript、component design、state management、API data flow、responsive UI、效能優化、測試與 production debugging。我準備 React 時會特別補它的 mental model：React 不是 template + reactivity，而是 state/props 變化後重新 render，再透過 reconciliation commit DOM。Redux、React Query 也都有對應的資料流概念。我會把 Vue 經驗轉成 React 做法，而不是直接套 Vue 習慣。

### 你覺得 Vue 和 React 最大差異是什麼？

答題版：

Vue 比較偏 framework，提供 template、directive、reactivity、computed、watch、SFC 等完整約定；React 比較偏 UI library，核心是 function component、JSX、state、props、hooks，周邊如 routing、server state、form、styling 多由生態工具組合。Vue 透過 reactive dependency tracking 精準知道哪些資料被用到；React 則是 state/props 更新後重新執行 component function，再由 diff 決定 DOM 更新。面 React 時我會強調：不要期待 React 自動追蹤所有 reactive dependency，要主動管理 state、dependency array 和 render 邊界。

### 你從 Vue 轉 React，最容易踩的坑是什麼？

答題版：

第一是把 `useEffect` 當成 Vue `watch` 亂用，導致 derived state、fetch、同步邏輯混在一起。第二是忽略 dependency array，造成 stale closure 或無限重跑。第三是以為改 object 內容 React 會自動追蹤，但 React 依賴 immutable update 和 reference equality。第四是把所有全域資料都塞 Redux，沒有區分 server state 和 client state。我的修正方式是：derived data 用 render 或 `useMemo`，外部同步才用 effect；API cache 交給 React Query；client state 才進 Redux。

## React Mental Model 題

### Vue reactivity 和 React state model 差在哪？

答題版：

Vue 會透過 proxy / dependency tracking 知道 template 或 computed 用了哪些 reactive data，資料變更時觸發對應更新。React 則不會追蹤 object 裡每個 property 的讀取；React 的更新來自 `setState`、props 變化或 store 訂閱變化。component function 重新執行後產生新的 element tree，再由 React diff。這代表 React 裡 state update 要用 immutable pattern，不能直接 mutate object 後期待 UI 自動更新。

### Vue template 和 React JSX 差在哪？

答題版：

Vue template 是框架定義的模板語法，有 `v-if`、`v-for`、`v-model`、slot 等 directive；React JSX 本質上是 JavaScript expression 的語法糖，最後會轉成 React element。React 裡條件渲染、列表、事件、資料轉換都用 JS 本身處理，例如 `items.map()`、`condition ? A : B`。JSX 的優點是和 JavaScript 結合緊密，缺點是團隊要更自律，避免把太多複雜邏輯塞進 render。

### Vue `v-model` 對應 React 什麼概念？

答題版：

React 裡通常是 controlled component：input 的 `value` 由 state 控制，`onChange` 更新 state。Vue 的 `v-model` 幫你包了一層雙向綁定語法糖；React 會更明確地把資料流寫出來。表單複雜時可以用 React Hook Form、Formik 或自訂 reducer 管理。交易下單表單我會偏向明確 controlled / reducer 狀態，因為 validation、提交中、錯誤與風險提示都要可控。

```tsx
const [price, setPrice] = useState("");

return (
  <input
    value={price}
    onChange={(event) => setPrice(event.target.value)}
  />
);
```

### Vue computed 對應 React 的什麼？

答題版：

簡單 derived data 可以直接在 render 裡計算，不一定要 `useMemo`。如果計算成本高，或需要穩定 reference 傳給 memoized child，才用 `useMemo`。Vue computed 會依 reactive dependency cache；React `useMemo` 依 dependency array cache。面試時要補一句：`useMemo` 是效能優化提示，不是語意保證，不應該為了所有計算都加。

### Vue watch 對應 React 的什麼？

答題版：

最接近的是 `useEffect`，但不能完全等同。Vue watch 常用來觀察某個 reactive value 的變化；React `useEffect` 的定位是「同步外部系統」，例如訂閱 WebSocket、打 API、操作 DOM、寫 storage。如果只是根據 state 推導另一個值，不該放 effect，應該直接 derived 或用 `useMemo`。這是 Vue 轉 React 很重要的心智轉換。

### Vue lifecycle 對應 React hooks 怎麼說？

答題版：

React function component 不會逐一對應 Vue lifecycle，而是用 effect 描述同步邏輯。`onMounted` 類似 dependency 為空的 `useEffect`；`onUnmounted` 對應 effect return cleanup；`onUpdated` 類似有 dependency 的 effect，但 React 裡要具體說明依賴哪些值。需要在 paint 前量測 DOM 時用 `useLayoutEffect`。我不會背 lifecycle 對照表，而是說清楚 effect 的同步與 cleanup 模型。

### Vue ref 和 React ref 差在哪？

答題版：

Vue `ref` 可以包 reactive primitive，也可拿 DOM/component instance；React `useRef` 主要是保存 mutable value 或 DOM reference，改 `ref.current` 不會觸發 render。React 裡如果資料變更需要更新 UI，應該用 state；如果只是保存 timer id、WebSocket instance、latest value、DOM node，可以用 ref。交易頁常用 ref 保存最新 WebSocket connection id，避免舊 message 寫入新畫面。

### Vue slot 對應 React 什麼？

答題版：

React 通常用 `children`、render props 或 component composition。Vue slot 是模板層的插槽機制；React 把 component 當值傳遞，用 props 組合。一般 slot 對應 `children`，scoped slot 可用 render prop 或把資料交給 child function。面試時我會強調 React 鼓勵 composition，避免過度繼承或巨大通用 component。

## Redux / Pinia / React Query 題

### Pinia / Vuex 和 Redux 最大差異是什麼？

答題版：

Pinia / Vuex 都是 Vue 生態的狀態管理，和 Vue reactivity 整合深；Redux 是 framework-agnostic 的 predictable state container，核心是 action、reducer、store、selector、middleware。Redux reducer 應該是 pure function，狀態更新可追蹤、可 time travel、可測試。現代 React 通常用 Redux Toolkit，透過 slice、Immer、createAsyncThunk 或 RTK Query 降低樣板碼。

### Redux Toolkit 的 slice 是什麼？

答題版：

Slice 是 Redux Toolkit 對某個 domain state 的封裝，包含 `name`、`initialState`、reducers 和自動產生的 actions。它讓 action type、action creator、reducer 放在一起，降低傳統 Redux 樣板碼。RTK 內建 Immer，所以 reducer 裡可以寫看似 mutate 的程式，但底層會產生 immutable update。交易頁可以有 `layoutSlice`、`watchlistSlice`、`userPreferenceSlice`。

### Redux 和 React Query 要怎麼分工？

答題版：

Redux 管 client state，例如目前選擇的 symbol、layout、使用者偏好、某些跨頁 UI 狀態。React Query 管 server state，例如 API 回來的 balances、open orders、symbol rules、historical klines。Server state 有遠端來源、快取、stale、refetch、retry、mutation/invalidation 問題，交給 React Query 比手寫 Redux cache 更適合。不要把所有 API response 都塞 Redux，這會讓失效和同步很難維護。

### React Query 和 Vue Query 概念一樣嗎？

答題版：

核心概念一樣，都是 TanStack Query：query key、query function、cache、staleTime、gcTime、invalidate、mutation。差別是 React 用 hook API，例如 `useQuery`、`useMutation`；Vue 用 Vue adapter 和 composition API。面試 React 時要能用 React 語境回答，例如 query key 放 dependency、component mount/unmount 對 observer 的影響、mutation success 如何 `queryClient.invalidateQueries`。

### Binance 交易頁中哪些資料不該放 Redux？

答題版：

高頻 ticker、order book delta、K 線即時更新不一定適合直接放 Redux，因為每筆 dispatch 都可能造成訂閱者更新，效能成本高。這類資料可放 React Query cache、專用 external store、component local state，或先進 buffer 批次更新。API snapshot 如 symbol metadata、balances、open orders 可用 React Query；使用者偏好、layout、current symbol 這類 client state 才比較適合 Redux。

## React Hooks 題

### `useEffect` dependency array 為什麼容易出錯？

答題版：

因為 dependency array 不是「我想什麼時候跑」的開關，而是 effect 使用到哪些 render scope 值的宣告。漏 dependency 會有 stale closure；多 dependency 可能暴露 function identity 不穩定或 effect 責任太多。正確做法是拆 effect、把 derived data 移出 effect、用 `useCallback` 穩定 callback、用 `useRef` 保存 mutable latest value。不要為了安靜 lint 就關掉 exhaustive-deps。

### 什麼時候用 `useReducer` 而不是 `useState`？

答題版：

當狀態轉移有明確事件、欄位互相影響、或需要集中測試時，用 `useReducer` 比多個 `useState` 清楚。交易下單表單就是例子：改 side、改 order type、改 price、改 quantity、reset、submit success/error 都是 action。Reducer 能把 domain rule 集中，也能避免多個 setState 順序造成難查的 bug。

### 什麼時候不該用 `useMemo` / `useCallback`？

答題版：

不應該為每個計算和每個 function 都加。memoization 有成本，也會增加 dependency 維護成本。只有計算昂貴、reference 穩定性會影響 child render、或 callback 是 effect/subscription dependency 時才值得。面試時我會說：先用 Profiler 找瓶頸，再加 memo；不是先加 memo 再假設效能變好。

### 如何寫一個交易 ticker 的 custom hook？

答題版：

我會讓 hook 接收 symbol，內部管理 REST initial data、WebSocket subscription、cleanup、錯誤與 stale 狀態。重點是切換 symbol 時要關閉舊 subscription，只讓最新 connection 寫資料；高頻 message 要 batching；unmount 要 cleanup。hook 對外回傳 `{ data, status, error, reconnecting }`，UI 不需要知道底層連線細節。

```tsx
function useTicker(symbol: string) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const connectionIdRef = useRef(0);

  useEffect(() => {
    const connectionId = ++connectionIdRef.current;
    const ws = new WebSocket(makeTickerUrl(symbol));

    ws.onmessage = (event) => {
      if (connectionId !== connectionIdRef.current) return;
      setTicker(JSON.parse(event.data));
    };

    return () => {
      ws.close();
    };
  }, [symbol]);

  return ticker;
}
```

這只是面試簡化版；production 還要補 heartbeat、reconnect、batching、error state。

## React Router / Form / Testing 題

### React Router 和 Vue Router 差在哪？

答題版：

概念上都有 route config、nested route、params、query、navigation guard 類需求。React Router 更偏 component/hook API，例如 `useParams`、`useSearchParams`、`useNavigate`。Vue Router 的 navigation guard 是很常見的集中式寫法；React 常把權限判斷做成 route wrapper、loader、layout route 或 component-level guard。面試時要能說：交易頁 symbol、interval、tab 可以放 URL，讓分享、刷新和返回都可預期。

### React 表單要怎麼做 validation？

答題版：

簡單表單可以 controlled component + local state。複雜表單可用 React Hook Form 降低 render 成本，搭配 Zod/Yup 做 schema validation。交易下單表單除了一般必填，還要依 symbol rule 驗證 tick size、step size、min notional、available balance。前端 validation 是 UX 防線，最終仍以後端風控與 API 回應為準。

### React Testing Library 的測試心法是什麼？

答題版：

React Testing Library 鼓勵測使用者行為，而不是測 implementation detail。優先用 role、label、text 找元素，例如 `getByRole("button", { name: /buy/i })`，少測 className 或內部 state。交易產品要測 loading、error、empty、success、disabled、submitting、API reject 這些狀態，尤其是下單按鈕是否會在資料不可信或提交中被 disabled。

### 你會怎麼測 React Query + mutation？

答題版：

我會用 mock server 或 mock query function，測 loading -> success -> mutation -> invalidate/refetch 的流程。下單 mutation 可以測 submit 後 button disabled、成功後 open orders 被 refetch、失敗後錯誤訊息出現。不要只測 hook 有沒有被呼叫，而是測使用者看到的 UI 狀態與資料流是否正確。

## Binance React 高機率情境題

### 用 React 設計 Futures 下單表單，你會怎麼拆？

答題版：

我會拆成 `TradeFormContainer` 和 presentational components。Container 負責讀 symbol rules、balances、價格、mutation；form state 用 `useReducer` 管 side、order type、price、quantity、leverage、validation errors。Price/quantity input 是 controlled component，提交前 normalize decimal string。Mutation success 後 invalidate balances/open orders，API reject 顯示可理解錯誤。高風險操作如 market order 或高槓桿要加確認。

### 用 React 設計 order book，最容易被追問什麼？

答題版：

面試官通常追問 snapshot + delta、sequence gap、資料結構、效能。我的答案是 REST snapshot 初始化，WebSocket delta 增量更新；用 update id 檢查漏資料，gap 就 refetch snapshot；bids/asks 用 Map 以 price 為 key，quantity 為 0 刪除；顯示前排序取前 N 檔；高頻 update 先 buffer，再用 `requestAnimationFrame` 批次 setState。

### React 中 WebSocket message 每秒很多，怎麼避免畫面卡？

答題版：

不要每筆 message 都 setState 或 dispatch Redux。先把 message 放進 mutable buffer，用 `requestAnimationFrame` 或固定 interval flush；只更新變動資料；大型列表 virtualization；昂貴 merge/sort 可放 Web Worker；用 selector 降低訂閱範圍。React 端要把高頻區域和低頻 UI 拆開，避免 ticker 更新造成整頁 render。

### 如何避免切換交易對時舊資料蓋掉新資料？

答題版：

REST request 用 AbortController 或 request id；React Query query key 必須包含 symbol；WebSocket 建立 connection id，message handler 只接受最新 id；effect cleanup 關閉舊 subscription。UI 也要顯示目前 symbol，避免舊資料短暫閃入。這題本質是在考 race condition 和資料身份。

### 如果面試官問你 React 不熟，怎麼回答比較穩？

答題版：

不要硬說完全一樣。可以說：我過去主要寫 Vue，但我已經針對 React 職缺補強它的核心差異：render model、hooks、effect cleanup、immutable state、Redux、React Query。我的優勢是 production 前端經驗，例如資料流、非同步、responsive UI、效能和錯誤處理；React 生態我會用這些共通能力落地，並遵守 React 的最佳實務，而不是把 Vue 寫法搬過來。

## 快速背誦清單

- React 不追蹤 object property mutation，更新 UI 要 setState 並保持 immutable。
- `useEffect` 是同步外部系統，不是 Vue watch 的完全替代品。
- React Query 管 server state，Redux 管 client state。
- 高頻 WebSocket 資料要 batching，不要每筆都 setState/dispatch。
- 下單表單要 controlled/reducer、validation、submitting、API error、防重複提交。
- Vue 經驗可以轉換成 component design、狀態管理、API data flow、效能和 production debugging。
