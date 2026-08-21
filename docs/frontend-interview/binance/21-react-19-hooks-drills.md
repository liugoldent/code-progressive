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

可以把它理解成 reducer 與 async form action 的結合：React 把「上一次 Action 已確認的結果」交回 action，讓你計算下一份 UI state。這不是 component render 當下 closure 裡的 state，也不是 server 自動傳來的參數。

若從普通 `<form action={fn}>` 遷移，最常見的 bug 就是仍寫成 `fn(formData)`，導致對 `previousState` 呼叫 `.get()`。TypeScript 應明確標註兩個參數，讓順序錯誤在編譯期被看見。

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

```tsx
async function save(previousState, formData) {
  try {
    const order = await postOrder(formData);
    return { status: "success", order, message: null };
  } catch (error) {
    return { ...previousState, status: "error", message: toMessage(error) };
  }
}
```

Action 的 return type 最好使用可辨識 union，讓 success/error/pending UI 不會靠多個互相矛盾的 boolean。Thrown error 則應交給 error boundary 或框架約定，與「預期的表單驗證錯誤」分開。

</details>

### 3. `isPending` 的 owner 是誰？

<details>
<summary>答案</summary>

它屬於這個 Action 的 transition lifecycle，不代表頁面所有 network request。按鈕可依它 disable 或顯示 submitting；背景 query refetch、圖片載入等仍需各自狀態。

Pending 的範圍也決定 UI ownership：提交按鈕與該表單可以讀它，頁面其他 widget 不應因此全部進 loading。若產品允許重複送出，要另外設計 concurrency；單純 `disabled={isPending}` 只是其中一種 UX 策略，不是 Hook 強制行為。

</details>

### 4. 可以在任意 click handler 直接呼叫 `submitAction()` 嗎？

<details>
<summary>答案</summary>

Returned action 通常交給 `<form action={submitAction}>`、`formAction`，或在 `startTransition` action context 中呼叫。脫離 action context 直接 dispatch 會失去預期 pending/action semantics，React 也會提示；一般 click 邏輯要依 API contract 包進 Transition。

```tsx
function handleClick() {
  startTransition(() => {
    submitAction(new FormData(formRef.current));
  });
}
```

能使用原生 form action 時優先使用，因為 Enter submit、鍵盤操作與 progressive enhancement 的語意更完整。只有提交不是表單事件，或需要先組合 action payload 時，才手動建立 action context。

</details>

### 5. 連續送出兩次時，previous state 代表什麼？

<details>
<summary>答案</summary>

每次 Action 應從 React 管理的前一個 action state 推導下一狀態，不要從 closure 猜目前狀態。仍要定義產品的重複提交策略：disable、排隊、取消、idempotency key，或允許多個獨立操作；Hook 不替 server 保證順序與冪等。

`previousState` 是 Action state 的序列化推導入口，但網路完成順序、server 寫入順序與使用者意圖仍可能不同。像下單或付款不能只靠 client disable；server 端還要使用 idempotency key，回應也要能對應 request ID，才能避免 double submit。

</details>

### 6. 它能取代 TanStack Query mutation 嗎？

<details>
<summary>答案</summary>

不一定。它很適合 form/action 的 state、error 與 pending；TanStack Query mutation 另有 shared server cache、invalidations、retry、mutation cache 等責任。選擇取決於資料是否要與全站 server state cache 協調，不是 API 新舊。

若結果只影響目前表單，例如登入錯誤或設定儲存訊息，`useActionState` 往往足夠。若成功後要更新多頁共用的 orders cache、取消舊 request、做 optimistic cache patch 或觀察 mutation，server-state library 仍有價值。兩者也能合作：Action 負責提交語意，成功後交由資料層 invalidate/revalidate。

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

因此 optimistic reducer 必須能在任意最新 base value 上重播，而不能偷偷修改 `orders`。Server 成功後應讓 canonical data 包含確認結果；失敗時 base 沒變，投影自然消失。若 canonical 更新漏掉，optimistic item 完成後會「閃回去」，那是資料 ownership 問題，不是再加一份 local state 就能解決。

</details>

### 2. 為何 optimistic item 需要 client ID？

<details>
<summary>答案</summary>

List 需要穩定 key，也要把 pending/error/confirmed item 對應起來。用 array index 或等 server 回來才有 ID，會讓 reconciliation、重試與多筆同時提交很難處理。常見做法是先生成 client request ID，server 回應後再 reconcile。

Client ID 與 server ID 是不同欄位：前者描述這次 UI submission 的 identity，後者描述後端 entity。Server 回來後可以保留 client ID 作 reconciliation metadata，不能直接換 key 導致整列 remount；多筆內容相同的 order 也不能靠 price/quantity 猜是哪一筆。

</details>

### 3. Request 失敗後要做什麼？

<details>
<summary>答案</summary>

React 會在 Action 結束後回到 canonical value，但產品仍要顯示錯誤、保留可重試內容或說明回滾。不能只讓項目消失，否則使用者不知道操作失敗；金融操作尤其要區分「送出中、已接受、已成交、失敗」。

實務上會把失敗資訊放在 action state 或獨立 mutation record：保留原輸入、錯誤原因、client request ID 與 retry handler。Rollback 不只是視覺刪除；若 optimistic update 同時改了餘額、列表與計數，這些投影都必須由同一份 canonical state 恢復，避免局部殘留。

</details>

### 4. 為何 list update 建議使用 reducer form？

<details>
<summary>答案</summary>

當 base `orders` 在 Action pending 期間也更新，React 可用最新 base state 重新執行 reducer，把 optimistic action 套在最新清單上。這比捕捉一份舊陣列更能處理同時進來的 server update。

Reducer 應保持 pure：相同的 `current` 和 optimistic payload 必須產生相同結果，不能在裡面產生隨機 ID、讀時間或送 request。ID 和 timestamp 應在 dispatch 前建立並放進 payload，這樣 React 重播 projection 時不會得到另一筆 item。

</details>

### 5. 可以在 render 中呼叫 optimistic setter 嗎？

<details>
<summary>答案</summary>

不可以。和 state setter 一樣，render 必須純粹；optimistic update 應發生在 Action、event/effect 等 callback 中，而且一般要有 Transition/Action context 承接 pending 時間。

若在 render 中呼叫，會形成 render → update → render 循環，也可能在 concurrent render 被丟棄後留下不一致意圖。正確時間點是使用者已明確觸發提交時：先 dispatch optimistic payload，再 await server，最後更新 canonical state 或回報錯誤。

</details>

### 6. 哪些操作不適合 optimistic UI？

<details>
<summary>答案</summary>

不可逆、高失敗成本、需要 server 先驗證、或錯誤顯示會誤導使用者的操作不宜假裝成功。例如下單可先顯示「正在送出」draft，但不能在交易所確認前顯示「已成交」。Optimistic UX 必須保留真實狀態語意。

可用三個問題判斷：失敗率是否低、是否容易完整 rollback、暫時錯誤會不會造成使用者做出下一個危險決策。按讚或改暱稱通常適合；轉帳、刪除唯一資料、權限變更則應更保守。Optimistic 不等於顯示成功，可以只提早顯示明確標記的 `sending` row。

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

這裡有兩種 reactivity：`roomId` 改變代表外部同步對象改了，必須 cleanup 舊 socket 並 setup 新 socket；`theme` 只影響未來 connected event 發生時的呈現。Effect Event 把後者抽成「非 reactive setup、但讀最新 committed value」的事件。

若 toast 文案本身需要在 theme 改變當下重新顯示，那 theme 就是 reactive dependency，不能抽走。判斷依據永遠是產品事件語意，不是想讓 dependency array 變短。

</details>

### 2. 它是不是「忽略 dependency lint」工具？

<details>
<summary>答案</summary>

不是。如果 `pageUrl` 改變本來就應重新 log visit，pageUrl 必須留在 effect dependency；把它塞進 Effect Event 會漏掉同步。只有真正由 Effect 內某事件觸發、但不應令 setup 重跑的邏輯才適合抽出。

Dependency lint 的工作是讓程式碼與 reactivity 一致。Effect Event 不是逃生門，而是明確宣告其中一段只在 Effect 事件發生時執行。若發現幾乎整個 Effect 都被搬進去，通常代表正在隱藏真正 dependency，應重新檢查同步對象。

</details>

### 3. 可以把 Effect Event 傳給 child 當 `onClick` 嗎？

<details>
<summary>答案</summary>

不可以。它只能在定義它的 component 內，由 Effect 或其他 Effect Event 呼叫；不能在 render、一般 event handler 中呼叫，也不應傳給其他 component/Hook。Button callback 用普通 function 或 `useCallback`。

Effect Event 的 owner 是該 Effect lifecycle，不是可任意傳播的 event prop。傳給 child 會讓「何時允許呼叫」失去靜態約束，也混淆使用者事件與外部系統事件。若 custom Hook 需要這段邏輯，應讓 custom Hook 自己定義 Effect Event 或接受普通 callback 並建立清楚 contract。

</details>

### 4. Effect Event function identity 穩定嗎？

<details>
<summary>答案</summary>

不要依賴它穩定，也不要把它放進 dependency array。它的 contract 是在被 Effect 呼叫時讀到最新 committed props/state，而不是提供 memoized callback identity。

React 的 lint 規則會辨識 Effect Event 並將它從 dependencies 排除。若第三方 API 強制以 function reference 做 subscribe/unsubscribe，仍應在同一個 Effect setup 中註冊，cleanup 使用同一次 render 的 reference；不要拿 identity 做 Map key 或公開 API 保證。

</details>

### 5. 它和 latest ref pattern 差在哪裡？

<details>
<summary>答案</summary>

Latest ref 需要自己同步 `.current`，lint 也不理解 ref 代表哪些 reactive value，容易把真正 dependency 藏掉。Effect Event 直接表達「這是 Effect 觸發的 non-reactive event」，由 React 與 lint 約束呼叫位置；但 React 18 仍只能用 ref/重設計作替代。

Ref pattern 還可能在 render 時手動改 `.current`，使 concurrent render 與 committed UI 的值混在一起；Effect Event 的語意是讀最新 **committed** props/state。React 18 若必須使用 latest ref，應集中封裝、在 Effect 中同步並寫清楚為何 setup 不應重建，而不是到處用 ref 關掉 lint。

</details>

### 6. Timer custom Hook 如何判斷 delay 與 callback 的 reactivity？

<details>
<summary>答案</summary>

`delay` 改變通常代表 timer setup 要重建，所以是 effect dependency；callback 內容則常希望每次 tick 讀最新值、不因 callback reference 改變就重設 timer，可包成 Effect Event。要先說出這個語意，再寫 `[delay]`，不是先追求空 dependency。

```tsx
const onTick = useEffectEvent(callback);

useEffect(() => {
  if (delay == null) return;
  const id = setInterval(() => onTick(), delay);
  return () => clearInterval(id);
}, [delay]);
```

`delay = null` 可表達暫停；delay 改變會精確重建 interval，callback 改變則只影響下一次 tick 執行的內容。這個拆法把 setup identity 與事件內容分開，才是 Effect Event 的核心價值。

</details>

## 完成檢查

- Action state 來自 Action return value，pending 有明確 owner。
- Optimistic state 是 pending projection，不是已確認 server truth。
- Effect Event 用於 Effect 觸發的 non-reactive logic，不能傳給 child 或當一般 handler。
- 回答任何 React 19 題目前，先確認實際專案版本。

[下一組：Server / Global State 第三方 Hooks](./22-third-party-server-global-hooks-drills.md)
