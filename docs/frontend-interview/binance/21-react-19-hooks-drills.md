---
sidebar_position: 25
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

> 實際案例：[useActionState：整合交易下單的提交狀態](./practical-cases/use-action-state)

### 先建立心智模型

`useActionState` 用來管理「一次使用者 Action 執行後得到的狀態」。它把以下三件常一起出現的事串在同一條資料流中：

1. 執行同步或非同步副作用，例如送出表單、呼叫 API。
2. 用 Action 的回傳值更新畫面，例如顯示成功訊息或驗證錯誤。
3. 在 Action 尚未完成時提供 `isPending`，讓 UI 顯示處理中狀態。

它的概念很像「**允許副作用的 async reducer**」：`useReducer` 的 reducer 必須保持 pure，`useActionState` 的 `reducerAction` 則是為了 Action 而設計，可以呼叫 API，並依前一次結果計算下一份 Action state。

```tsx
const [state, dispatchAction, isPending] = useActionState(
  reducerAction,
  initialState,
  permalink?,
);
```

| 項目 | 角色 |
| --- | --- |
| `reducerAction(previousState, payload)` | 執行工作並 `return` 下一份 state；可以是 async function |
| `initialState` | 第一次 render 使用的 state；第一次 dispatch 後就以 Action 的回傳值為準 |
| `state` | 最近一次已完成 Action 的回傳值 |
| `dispatchAction(payload)` | 觸發 Action；payload 會成為 `reducerAction` 的第二個參數 |
| `isPending` | 這個 Hook 是否仍有 Action 正在處理 |
| `permalink` | 選填；主要供 Server Function 表單在 hydration 前做 progressive enhancement |

資料流可以記成：

```text
initialState
    ↓
使用者觸發 dispatchAction(payload)
    ↓
reducerAction(previousState, payload)
    ↓ await API / 執行副作用
return nextState
    ↓
state = nextState，React 重新 render
```

### 完整表單範例

```tsx
import { useActionState } from "react";

type SubmitState =
  | { status: "idle"; message: null }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: SubmitState = { status: "idle", message: null };

async function createOrder(
  _previousState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const symbol = String(formData.get("symbol") ?? "").trim();

  if (!symbol) {
    return { status: "error", message: "請輸入交易對" };
  }

  try {
    await postOrder({ symbol });
    return { status: "success", message: `${symbol} 下單成功` };
  } catch {
    return { status: "error", message: "下單失敗，請稍後重試" };
  }
}

function OrderForm() {
  const [state, submitAction, isPending] = useActionState(
    createOrder,
    initialState,
  );

  return (
    <form action={submitAction}>
      <input name="symbol" aria-label="交易對" />
      <button disabled={isPending}>
        {isPending ? "送出中…" : "下單"}
      </button>
      <p aria-live="polite">{state.message}</p>
    </form>
  );
}
```

這段程式的關鍵不是少寫一個 `useState`，而是 React 知道 `submitAction` 是一個 Action。把它交給 `<form action>` 後，React 會自動在 Transition 中執行表單提交，將 `FormData` 傳入第二個參數、追蹤 pending，並以函式的回傳值更新 `state`。

如果不是透過 `<form action>` 或其他 Action prop，而是在一般事件中手動呼叫，就要自己建立 Action context：

```tsx
import { startTransition } from "react";

function handleRetry() {
  startTransition(() => {
    dispatchAction(lastPayload);
  });
}
```

### 和其他 Hook 怎麼分工？

| 需求 | 較適合的工具 |
| --- | --- |
| 管理一般 UI state，不執行副作用 | `useState` / `useReducer` |
| 管理 Action 的回傳結果與 pending | `useActionState` |
| Action 尚未完成就先顯示預期結果 | `useOptimistic` |
| 只想把某次更新標記為非阻塞 | `useTransition` |
| 管理跨頁 server cache、retry、invalidation | TanStack Query 等資料層工具 |

`useActionState` 不會自動提供 cache、retry、request cancellation、optimistic UI 或後端冪等性。預期中的錯誤（例如欄位驗證失敗）適合 `return` 成 state；非預期錯誤則可以 `throw`，交給最近的 Error Boundary。若快速 dispatch 多次，React 會把同一個 Hook 的 Action 依序排隊，讓下一次收到上一次的回傳 state；需要平行 request 時，通常應改用 `useState` 搭配 `useTransition` 自行管理。

> 一句話記憶：`useActionState` 是「以 Action 的回傳值作為 state，並由 React 一起管理 Action pending 與執行順序」。

官方參考：[React `useActionState`](https://react.dev/reference/react/useActionState)、[React `<form>`](https://react.dev/reference/react-dom/components/form)

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

同一個 Hook 的多次 dispatch 會由 React **依序排隊執行**。第一次完成並回傳 next state 後，第二次才會把它當成自己的 `previousState`；這是因為下一次運算必須先知道上一次結果，不能平行計算。

因此每次 Action 都應從 React 傳入的前一個 action state 推導下一狀態，不要從 closure 猜目前狀態。若操作彼此獨立且必須平行執行，應改用 `useState`、`useTransition` 或資料層工具自行管理。

產品仍要定義重複提交策略：disable、排隊、取消、idempotency key，或允許多個獨立操作；Hook 的 client-side queue 不替 server 保證冪等。

`previousState` 是 Action state 的序列化推導入口，但這個 queue 只涵蓋目前掛載中的同一個 Hook；其他 component、分頁、重試與後端處理都不在它的保證範圍內。像下單或付款不能只靠 client disable；server 端還要使用 idempotency key，回應也要能對應 request ID，才能避免 double submit。

</details>

### 6. 它能取代 TanStack Query mutation 嗎？

<details>
<summary>答案</summary>

不一定。它很適合 form/action 的 state、error 與 pending；TanStack Query mutation 另有 shared server cache、invalidations、retry、mutation cache 等責任。選擇取決於資料是否要與全站 server state cache 協調，不是 API 新舊。

若結果只影響目前表單，例如登入錯誤或設定儲存訊息，`useActionState` 往往足夠。若成功後要更新多頁共用的 orders cache、取消舊 request、做 optimistic cache patch 或觀察 mutation，server-state library 仍有價值。兩者也能合作：Action 負責提交語意，成功後交由資料層 invalidate/revalidate。

</details>

## `useOptimistic`：Action 進行中先顯示預期結果

### 先別急著做題：它到底在解什麼問題？

假設畫面已經從 server 取得一份訂單清單 `orders`。使用者送出一筆 BTC 訂單後，API 需要 800 ms 才會回應。

如果只用一般的等待流程，程式通常會先等 server，成功後才把新訂單放進畫面：

```tsx
async function handleSubmit(draft) {
  const confirmedOrder = await postOrder(draft);
  setOrders((current) => [...current, confirmedOrder]);
}
```

這 800 ms 內畫面完全沒變。使用者不知道按鈕有沒有生效，可能再按一次。最直接的改善是：**request 一送出，先在清單顯示一列「送出中」；server 確認後，再換成真正的訂單。**

這就是 optimistic UI。它不是對使用者謊稱「已成功」，而是先顯示目前最合理的預期結果，並清楚標示仍在處理中。

```text
真正資料的時間線： A ─────── 等 server ─────── A + B（已接受）

使用者看到的時間線：A → A + B（送出中） ───→ A + B（已接受）
                                      失敗 └──→ A + 錯誤訊息
```

`useOptimistic` 負責的是中間那段「送出中」的暫時畫面。它不負責呼叫 API，也不會替 server 決定最後結果。

### 先建立心智模型

API 形狀如下：

```tsx
const [optimisticState, setOptimistic] = useOptimistic(
  value,
  reducer?,
);
```

| 項目 | 在這一節的角色 |
| --- | --- |
| `value` | canonical base value，也就是已確認、最終可信的資料；沒有 pending Action 時，畫面就使用它 |
| `optimisticState` | component 真正拿去 render 的值；Action 期間可能包含暫時投影 |
| `setOptimistic(payload)` | 登記一次暫時操作；必須在 Action 或 Transition 裡呼叫 |
| `reducer(currentState, payload)` | 把暫時操作套到目前狀態並回傳投影結果；必須是 pure function |

以訂單清單為例，可以把每次 render 想成：

```text
沒有 pending Action：
optimisticOrders = orders

有 pending Action：
optimisticOrders = 從最新的 orders 出發，依序套用尚未完成的 optimistic 操作
```

這裡最重要的是：**React 沒有建立第二份永久資料庫。** `orders` 仍然是 server 已確認資料；`optimisticOrders` 只是「最新確認資料 + 尚未完成操作」的畫面投影。

### 為什麼第二個參數可以省略？

`useOptimistic` 有兩種常見寫法。簡單 scalar value 可以不傳 reducer，setter 直接指定暫時值：

```tsx
const [optimisticLiked, setOptimisticLiked] = useOptimistic(isLiked);

startTransition(async () => {
  setOptimisticLiked(true);
  const confirmed = await saveLike();
  setIsLiked(confirmed);
});
```

需要從目前值計算時，也可以傳 updater function，寫法類似 `useState`：

```tsx
setOptimisticLiked((current) => !current);
```

陣列、購物車或一次要同步改多個欄位時，通常改用 reducer form。這時 setter 的角色比較像 `dispatch`：呼叫端只傳「發生了什麼」，reducer 負責計算畫面。

```tsx
const [optimisticOrders, dispatchOptimistic] = useOptimistic(
  orders,
  (currentOrders, action) => {
    if (action.type === "add") {
      return [...currentOrders, action.order];
    }

    return currentOrders;
  },
);

dispatchOptimistic({ type: "add", order: draft });
```

若 base value 可能在 request 期間被其他資料更新，reducer form 尤其重要：React 可以拿最新 base value 重算投影，避免一直疊在舊 snapshot 上。

### 一個可追蹤成功與失敗的完整範例

下面先用單一 component 展示完整資料流。為了避免誤導，optimistic row 的狀態叫 `submitting`，server 回傳後才叫 `accepted`，不會在交易所確認前顯示「已成交」。

```tsx
import { useOptimistic, useState } from "react";

type OrderRow = {
  id: string;
  clientRequestId: string;
  symbol: string;
  quantity: number;
  status: "submitting" | "accepted";
};

type OrderDraft = Pick<
  OrderRow,
  "clientRequestId" | "symbol" | "quantity"
>;

function OrderPanel() {
  // canonical state：只在 server 成功後加入確認資料
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  // render 時讀 optimisticOrders，不直接讀 orders
  const [optimisticOrders, addOptimisticOrder] = useOptimistic(
    orders,
    (currentOrders, draft: OrderDraft): OrderRow[] => [
      ...currentOrders,
      {
        id: `optimistic:${draft.clientRequestId}`,
        ...draft,
        status: "submitting",
      },
    ],
  );

  async function submitAction(formData: FormData) {
    const symbol = String(formData.get("symbol") ?? "").trim();
    const quantity = Number(formData.get("quantity"));

    if (!symbol || !Number.isFinite(quantity) || quantity <= 0) {
      setError("請輸入交易對與正確數量");
      return;
    }

    // ID 在 dispatch 前產生，reducer 重跑時才不會每次得到不同 ID
    const draft: OrderDraft = {
      clientRequestId: crypto.randomUUID(),
      symbol,
      quantity,
    };

    setError(null);
    addOptimisticOrder(draft); // 立即多 render 一列「送出中」

    try {
      const confirmedOrder = await postOrder(draft);

      // 最終資料一定採用 server 回傳值，而不是把 optimistic row 當真
      setOrders((current) => [...current, confirmedOrder]);
    } catch {
      // orders 沒變；Action 結束後暫時 row 會消失
      setError("訂單送出失敗，請確認狀態後再試一次");
    }
  }

  return (
    <section>
      {/* form 的 action prop 會讓 submitAction 在 Transition 中執行 */}
      <form action={submitAction}>
        <input name="symbol" defaultValue="BTCUSDT" />
        <input name="quantity" type="number" min="0.001" step="0.001" />
        <button type="submit">送出訂單</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <ul>
        {optimisticOrders.map((order) => (
          <li key={order.clientRequestId}>
            {order.symbol} × {order.quantity} —
            {order.status === "submitting" ? "送出中…" : "交易所已接受"}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`postOrder` 是應用程式自己的 API function，不是 React API。假設成功時它會回傳真正的 server ID 與確認狀態，並保留 client request ID，讓 optimistic row 與 confirmed row 可以使用同一個穩定的 React key：

```tsx
async function postOrder(draft: OrderDraft): Promise<OrderRow> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!response.ok) throw new Error("order rejected");
  return response.json();
}
```

### 按下送出後，React 實際做了什麼？

假設送出前 `orders` 只有訂單 A：

| 時間點 | canonical `orders` | render 使用的 `optimisticOrders` | 畫面 |
| --- | --- | --- | --- |
| 送出前 | `[A]` | `[A]` | 只有 A |
| 呼叫 `addOptimisticOrder(B)` | 仍是 `[A]` | reducer 算出 `[A, B(submitting)]` | B 立刻出現 |
| `await postOrder(B)` | 仍是 `[A]` | `[A, B(submitting)]` | 等待期間持續顯示 B |
| server 成功，`setOrders` | `[A, serverB]` | 最後收斂成 `[A, serverB]` | B 變成已接受 |
| server 失敗 | 仍是 `[A]` | Action 結束後回到 `[A]` | B 消失，顯示錯誤 |

成功時不需要再寫一個 `removeOptimisticOrder` 清除暫時 row。當 Action 與真正資料更新完成，React 會在最後的 render 直接讓 optimistic state 與新的 `orders` 收斂；不是先清掉 B、閃一下，再加入 serverB。

失敗時也不是 React 自動理解業務錯誤。真正的原因是：失敗 branch 沒有修改 `orders`，Action 結束後暫時投影失效，所以畫面回到原本的 `[A]`。`error`、重試按鈕和保留表單內容仍要由產品程式自己處理。

### 為什麼一定要放在 Action／Transition 裡？

React 必須知道暫時投影要維持到什麼時候。Action 的 async lifecycle 正好提供這個範圍：

```text
Action 開始 → 顯示 optimistic state → await 工作 → Action resolve/reject → 回到 base value
```

前面範例使用 `<form action={submitAction}>`，React 已自動建立 Transition，所以可以直接呼叫 `addOptimisticOrder`。如果是一般 click handler，就要自己包：

```tsx
import { startTransition } from "react";

function handleClick(draft: OrderDraft) {
  startTransition(async () => {
    addOptimisticOrder(draft);

    try {
      const confirmedOrder = await postOrder(draft);
      setOrders((current) => [...current, confirmedOrder]);
    } catch {
      setError("送出失敗");
    }
  });
}
```

若在 Action／Transition 外直接呼叫 optimistic setter，React 會警告，而且暫時值可能只出現一下就立刻回復，因為沒有 pending Action 幫它界定存活時間。

### 它和 `useState` 最根本的差別

| `useState` | `useOptimistic` |
| --- | --- |
| 保存真正要持續存在的 component state | 根據 base value 顯示 Action 期間的暫時投影 |
| setter 更新後，值會保留到下一次 setter | optimistic setter 的效果只維持到 Action 結束 |
| 適合保存 server 已確認結果、錯誤等 | 適合顯示 sending、liking、deleting 等即時回饋 |
| 不會因 async callback 結束而自動還原 | Action 失敗且 base 沒更新時，會回到 base value |

所以兩者通常是合作，不是二選一：`orders` 由 state、props 或 server cache 保存；`useOptimistic` 只負責把 pending intent 投影到畫面。

> 一句話記憶：`useOptimistic` 是「在 Action 進行期間，把使用者剛做的操作暫時套到最新確認資料上；Action 結束後，以真正資料為準」。

官方參考：[React `useOptimistic`](https://react.dev/reference/react/useOptimistic)、[React `<form>` 的 optimistic 範例](https://react.dev/reference/react-dom/components/form#optimistically-updating-form-data)

下面六題都沿用同一組角色：`orders` 是確認資料，`optimisticOrders` 是實際 render 的清單，`addOptimisticOrder` 登記暫時操作，`postOrder` 才真的把資料送到 server。先掌握這四者，再判斷每題。

### 1. Optimistic state 會變成新的 source of truth（最終可信資料）嗎？

```tsx
const [optimisticOrders, addOptimisticOrder] = useOptimistic(
  orders,
  (currentOrders, draft) => [
    ...currentOrders,
    { ...draft, status: "submitting" },
  ],
);
```

<details>
<summary>答案</summary>

不是。前面範例的 `orders` 仍是 canonical state；optimistic state 只是 Action pending 期間的暫時投影。沒有 pending Action 時，`optimisticOrders` 就等於目前傳入的 `orders`。

成功 branch 必須把 server 回傳結果寫回 `orders`、更新 parent props，或更新 server cache。Action 結束後，畫面才會以這份已確認結果為準。失敗時通常不更新 base，所以暫時投影消失，畫面回到操作前的確認資料。

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

### 做題前：同一個 Effect 裡其實可能混著兩種不同邏輯

假設聊天室用 `roomId` 決定連哪個房間，連線成功時則用目前 `theme` 顯示通知：

- `roomId` 改變代表同步對象變了，Effect 必須 cleanup 舊連線並重新 setup。
- `theme` 只影響下一次通知長什麼樣，不應讓 socket 重連。

如果把兩者都直接寫在 Effect setup，dependency lint 會正確要求 `[roomId, theme]`，結果每次切換 theme 都重建連線。`useEffectEvent` 用來抽出第二種「由 Effect 內事件觸發、要讀最新值、但不應控制 setup lifecycle」的邏輯。

```tsx
const onEvent = useEffectEvent(callback);
```

```tsx
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showToast(`已連上 ${roomId}`, theme);
  });

  useEffect(() => {
    const socket = connect(roomId);
    socket.on("connected", onConnected);
    return () => socket.close();
  }, [roomId]);
}
```

```text
roomId 改變
  → cleanup 舊 socket → setup 新 socket

theme 改變
  → 不重連
  → 下次 connected event 呼叫 onConnected 時讀最新 committed theme
```

| 普通 Effect dependency | Effect Event 讀取的值 |
| --- | --- |
| 改變時應重新同步外部系統 | 只在未來事件發生時影響處理內容 |
| 例如 `roomId`、`serverUrl` | 例如 notification theme、muted、最新 callback |

它不是關閉 dependency lint 的工具。若 `pageUrl` 改變本來就應重新 log visit，把它藏進 Effect Event 反而漏事件。Effect Event 也不是一般 event handler：只能從同一 component 的 Effect 或其他 Effect Event 呼叫，不能在 render/click 中呼叫、傳給 child，或放進 dependency array；官方目前也明確不保證它的 function identity 穩定。

這個 repo 使用 React 18，不能直接 import `useEffectEvent`。本節是 React 19.2+ 心智模型；React 18 若用 latest ref 模擬，必須自行維護 committed value 與清楚的 lifecycle contract。

> 一句話記憶：Effect Event 讓 Effect 內的事件讀最新值，但不讓那些值重新啟動外部同步。

官方參考：[React `useEffectEvent`](https://react.dev/reference/react/useEffectEvent)、[Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)

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
