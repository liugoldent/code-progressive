---
sidebar_position: 24
title: "React 19 Hooks 六題實戰：Action / Optimistic / Effect Event"
description: "useActionState、useOptimistic、useEffectEvent 各六題，練習 async Action、optimistic UI、pending ownership 與 Effect 中的 non-reactive logic。"
tags:
  - React 19
  - Hooks
  - Actions
  - Interview
keywords: ["useActionState 題目", "useOptimistic 題目", "useEffectEvent 題目", "React 19 Hooks"]
---

# React 19 Hooks 六題實戰

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

:::warning 版本界線

本專案目前使用 React 18，以下 API 不能直接 import 到現有 live component。題目依目前 React 官方文件整理，目的是讓你升級 React 19+ 或面試看到新語法時能推導；不要為了做題直接升級整個 Docusaurus 專案。

:::

## `useActionState`：由 Action 的結果更新 state

### 1. Action 的第一個參數為何不是 FormData？

```tsx
async function submit(previousState, formData) {
  const symbol = formData.get("symbol");
  return { ok: true, symbol };
}

const [state, submitAction, isPending] = useActionState(submit, { ok: false });
```

<details>
<summary>答案</summary>

包進 `useActionState` 後，Action 會多收到第一個 `previousState`，原本 form action 的參數往後移。因此 `FormData` 是第二個參數。Action return value 會成為下一輪 state。

</details>

### 2. Action 沒有 return 時 state 會變什麼？

```tsx
async function save(previousState, formData) {
  await postOrder(formData);
}
```

<details>
<summary>答案</summary>

Async function 沒有明確 return 會 resolve `undefined`，因此 action state 也變成 `undefined`。應回傳完整、可顯示的下一狀態；不要誤以為它會像 object state 一樣自動 merge previous state。

</details>

### 3. `isPending` 的 owner 是誰？

<details>
<summary>答案</summary>

它屬於這個 Action 的 transition lifecycle，不代表頁面所有 network request。按鈕可依它 disable 或顯示 submitting；背景 query refetch、圖片載入等仍需各自狀態。

</details>

### 4. 可以在任意 click handler 直接呼叫 `submitAction()` 嗎？

<details>
<summary>答案</summary>

Returned action 通常交給 `<form action={submitAction}>`、`formAction`，或在 `startTransition` action context 中呼叫。脫離 action context 直接 dispatch 會失去預期 pending/action semantics，React 也會提示；一般 click 邏輯要依 API contract 包進 Transition。

</details>

### 5. 連續送出兩次時，previous state 代表什麼？

<details>
<summary>答案</summary>

每次 Action 應從 React 管理的前一個 action state 推導下一狀態，不要從 closure 猜目前狀態。仍要定義產品的重複提交策略：disable、排隊、取消、idempotency key，或允許多個獨立操作；Hook 不替 server 保證順序與冪等。

</details>

### 6. 它能取代 TanStack Query mutation 嗎？

<details>
<summary>答案</summary>

不一定。它很適合 form/action 的 state、error 與 pending；TanStack Query mutation 另有 shared server cache、invalidations、retry、mutation cache 等責任。選擇取決於資料是否要與全站 server state cache 協調，不是 API 新舊。

</details>

## `useOptimistic`：Action 進行中先顯示預期結果

### 1. Optimistic state 是新的 source of truth 嗎？

```tsx
const [optimisticOrders, addOptimistic] = useOptimistic(
  orders,
  (current, draft) => [...current, { ...draft, pending: true }],
);
```

<details>
<summary>答案</summary>

不是。`orders` 仍是 canonical state；optimistic state 是 Action pending 期間暫時投影。Action 完成且 parent/canonical value 更新後，畫面回到由確認資料推導的狀態。

</details>

### 2. 為何 optimistic item 需要 client ID？

<details>
<summary>答案</summary>

List 需要穩定 key，也要把 pending/error/confirmed item 對應起來。用 array index 或等 server 回來才有 ID，會讓 reconciliation、重試與多筆同時提交很難處理。常見做法是先生成 client request ID，server 回應後再 reconcile。

</details>

### 3. Request 失敗後要做什麼？

<details>
<summary>答案</summary>

React 會在 Action 結束後回到 canonical value，但產品仍要顯示錯誤、保留可重試內容或說明回滾。不能只讓項目消失，否則使用者不知道操作失敗；金融操作尤其要區分「送出中、已接受、已成交、失敗」。

</details>

### 4. 為何 list update 建議使用 reducer form？

<details>
<summary>答案</summary>

當 base `orders` 在 Action pending 期間也更新，React 可用最新 base state 重新執行 reducer，把 optimistic action 套在最新清單上。這比捕捉一份舊陣列更能處理同時進來的 server update。

</details>

### 5. 可以在 render 中呼叫 optimistic setter 嗎？

<details>
<summary>答案</summary>

不可以。和 state setter 一樣，render 必須純粹；optimistic update 應發生在 Action、event/effect 等 callback 中，而且一般要有 Transition/Action context 承接 pending 時間。

</details>

### 6. 哪些操作不適合 optimistic UI？

<details>
<summary>答案</summary>

不可逆、高失敗成本、需要 server 先驗證、或錯誤顯示會誤導使用者的操作不宜假裝成功。例如下單可先顯示「正在送出」draft，但不能在交易所確認前顯示「已成交」。Optimistic UX 必須保留真實狀態語意。

</details>

## `useEffectEvent`：把 Effect 事件與 reactive setup 分開

### 1. Theme 改變為何不該讓 socket 重連？

```tsx
const onConnected = useEffectEvent(() => {
  showToast("connected", theme);
});

useEffect(() => {
  const socket = connect(roomId);
  socket.on("connected", onConnected);
  return () => socket.close();
}, [roomId]);
```

<details>
<summary>答案</summary>

連線 identity 由 `roomId` 決定；toast 在 connected event 發生時想讀最新 theme，但 theme 改變不應重建連線。Effect Event 讀最新 committed value，同時保持 effect 的 reactive dependency 只有 roomId。

</details>

### 2. 它是不是「忽略 dependency lint」工具？

<details>
<summary>答案</summary>

不是。如果 `pageUrl` 改變本來就應重新 log visit，pageUrl 必須留在 effect dependency；把它塞進 Effect Event 會漏掉同步。只有真正由 Effect 內某事件觸發、但不應令 setup 重跑的邏輯才適合抽出。

</details>

### 3. 可以把 Effect Event 傳給 child 當 `onClick` 嗎？

<details>
<summary>答案</summary>

不可以。它只能在定義它的 component 內，由 Effect 或其他 Effect Event 呼叫；不能在 render、一般 event handler中呼叫，也不應傳給其他 component/Hook。Button callback 用普通 function 或 `useCallback`。

</details>

### 4. Effect Event function identity 穩定嗎？

<details>
<summary>答案</summary>

不要依賴它穩定，也不要把它放進 dependency array。它的 contract 是在被 Effect 呼叫時讀到最新 committed props/state，而不是提供 memoized callback identity。

</details>

### 5. 它和 latest ref pattern 差在哪裡？

<details>
<summary>答案</summary>

Latest ref 需要自己同步 `.current`，lint 也不理解 ref 代表哪些 reactive value，容易把真正 dependency藏掉。Effect Event 直接表達「這是 Effect 觸發的 non-reactive event」，由 React 與 lint 約束呼叫位置；但 React 18 仍只能用 ref/重設計作替代。

</details>

### 6. Timer custom Hook 如何判斷 delay 與 callback 的 reactivity？

<details>
<summary>答案</summary>

`delay` 改變通常代表 timer setup 要重建，所以是 effect dependency；callback 內容則常希望每次 tick 讀最新值、不因 callback reference 改變就重設 timer，可包成 Effect Event。要先說出這個語意，再寫 `[delay]`，不是先追求空 dependency。

</details>

## 完成檢查

- Action state 來自 Action return value，pending 有明確 owner。
- Optimistic state 是 pending projection，不是已確認 server truth。
- Effect Event 用於 Effect 觸發的 non-reactive logic，不能傳給 child 或當一般 handler。
- 回答任何 React 19 題目前，先確認實際專案版本。

[下一組：Server / Global State 第三方 Hooks](./22-third-party-server-global-hooks-drills.md)
