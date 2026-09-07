---
sidebar_position: 8
sidebar_label: "Router / Form"
slug: "/frontend-interview/binance/third-party-router-form-hooks-drills"
title: "第三方 Hooks 六題實戰：React Router / React Hook Form"
description: "useNavigate、useParams、useSearchParams、useForm、useWatch、useFieldArray 各六題，練習 URL state、history、表單 subscription、validation 與動態欄位 identity。"
tags:
  - React
  - React Router
  - React Hook Form
  - Interview
keywords: ["useNavigate 題目", "useParams 題目", "useSearchParams 題目", "useForm 題目", "useWatch 題目", "useFieldArray 題目"]
---

# 第三方 Hooks 六題實戰：Router / Form

[回到 Hooks 六題題庫](/docs/frontend-interview/binance/react-hooks-six-drills-index)

Router Hooks 的 source of truth 是 URL/history；Form Hooks 的核心是欄位註冊與 subscription。不要先把 URL 或整份表單複製進 local state，再用 Effect 雙向同步。

:::note 套件版本

React Router 在不同模式/版本的 import path、navigate return type 與 Data API 能力有所差異。題目聚焦共同心智模型；實作時以專案 lockfile 與該 major 版官方文件為準。

:::

## React Router `useNavigate`：以程式改變 location/history

### 做題前：Navigate 改的是 browser history，不是 local state

URL 本身是一份可返回、可分享、可重新整理的 application state。`useNavigate` 取得 imperative navigation function，適合在使用者事件或已完成的 Effect 中改變目前 location。

```tsx
const navigate = useNavigate();

navigate("/orders/123", { replace?, state? });
navigate(-1);
```

| 呼叫方式 | 對 history 的影響 |
| --- | --- |
| `navigate(to)` | 預設 push 新 entry，Back 可回上一頁 |
| `navigate(to, { replace: true })` | 取代目前 entry，常用於登入完成等中繼頁 |
| `navigate(delta)` | 在既有 history stack 前進／後退，不保證目的地是站內頁 |

```tsx
async function handleLogin(credentials) {
  const result = await login(credentials);

  if (result.ok) {
    navigate("/dashboard", { replace: true });
  }
}
```

```text
使用者 submit
  → server 確認登入成功
  → navigate("/dashboard", { replace: true })
  → Router 更新 location、match 新 routes、render 新頁面
```

Render 必須 pure，不能在 component body 直接 navigate。一般頁面連結優先使用 `<Link>`，表單／資料路由優先使用 `<Form>`、loader/action `redirect`；這些 declarative API 能保留 accessibility、pending 與 framework data flow。只有事件結果確實需要程式判斷目的地時才用 Hook。

Navigation `state` 適合短暫 UI context，不會成為可分享 URL，也不能替代 server data。Data/Framework mode 的 navigate 可回傳完成時 resolve 的 Promise；Declarative mode 常回 `void`，型別與 await 行為要依實際 router mode。

> 一句話記憶：`useNavigate` 是程式化 history 操作；先判斷應 push、replace，還是其實該用 Link/redirect。

官方參考：[React Router `useNavigate`](https://reactrouter.com/api/hooks/useNavigate)

### 1. 為何 render 時立刻跳頁或形成循環？

```tsx
function Guard({ user }) {
  const navigate = useNavigate();
  if (!user) navigate("/login");
  return <Dashboard />;
}
```

<details>
<summary>答案</summary>

Render 必須純粹，navigate 是外部狀態變更。Router data loader/action 中優先回傳 redirect；純 client guard 可 render `<Navigate>` 或在必要 Effect 中導航。不要在 component body 執行。

</details>

### 2. Login 成功後為何通常用 `replace: true`？

```tsx
navigate("/dashboard", { replace: true });
```

<details>
<summary>答案</summary>

Replace 會取代目前 login history entry，使用者按 Back 不會又回到已完成的 login 頁。一般從列表進詳情則通常保留 push history；要依使用者返回預期決定。

</details>

### 3. `navigate(-1)` 一定回到站內上一頁嗎？

<details>
<summary>答案</summary>

不一定。History 可能沒有上一筆，或上一筆是外部網站。只有能確定 history entry 的流程（例如站內 modal）才安全使用 delta；否則提供明確 fallback path。

</details>

### 4. 可以把資料全塞進 navigation state 取代 URL/query 嗎？

<details>
<summary>答案</summary>

Navigation state 不出現在 URL，重新整理、直接分享或新分頁進入時可能不可用。可分享/可 bookmark 的 symbol、tab、filters 應放 path/search；暫時 UI context 才適合 state，重要資料仍從 server/cache identity 取得。

</details>

### 5. Event 與 Effect 導航怎麼選？

<details>
<summary>答案</summary>

使用者按按鈕後跳頁是在 event handler 直接 navigate；「auth state committed 後必須同步到另一 location」才可能是 Effect。能用 Link/Form/redirect 宣告的導航，通常比 Effect 更清楚也更可存取。

</details>

### 6. `navigate()` 回傳型別為何可能是 `void | Promise<void>`？

<details>
<summary>答案</summary>

React Router Declarative mode 與 Data/Framework mode 的 implementation 不同，後者可回傳 navigation completion Promise。TypeScript 專案應依實際 router mode 做官方建議的型別增補或正確 await，不要隨手 `as void` 蓋掉流程差異。

</details>

### `useNavigate` 六題詳細補充

1. **Render 不能導航**：`navigate()` 會改 location/history，是外部狀態寫入；render 中呼叫會造成 render → navigate → render，Strict Mode/concurrent render 更會放大問題。使用者決策放 event handler；由已 committed 狀態觸發才放 Effect；loader/action 已知 redirect 時優先在資料層 redirect。
2. **replace 的語意**：登入頁通常只是前往目標頁的中繼狀態，使用 replace 可避免 Back 又回到已無效的 login submit 畫面。一般內容瀏覽應保留 push，不能為了「不讓使用者返回」濫用 replace。
3. **History delta**：`navigate(-1)` 只操作 browser history，上一筆可能不存在、是站外或不是產品預期頁。Close modal 若確定 modal 由 location background 建立可用 delta；一般取消流程應提供明確 fallback path。
4. **Navigation state**：它保存在 history entry，適合短暫且不可分享的 UI context；重新整理、複製連結、直接開網址都不能當可靠資料來源。可分享/可恢復的 filter 放 URL，canonical entity 回 server/query cache，敏感資料不要放 history state。
5. **Event 或 Effect**：按下按鈕、完成 submit 等已知 user event 直接 navigate，避免先 set flag 再由 Effect 觀察。只有導航原因來自 render 後才知道的外部同步狀態，例如 auth session 失效，Effect 才合理。
6. **Return type**：Declarative router 的 navigation 可回 `void`；Data/Framework mode 能回在導航完成時 resolve 的 Promise，且 identity contract 也不同。TypeScript 應依實際 router mode 做 module augmentation或明確處理 Promise，不能一律 `await` 後假設 loader 已完成。

## React Router `useParams`：讀取目前 route match 的動態片段

### 做題前：Param 來自目前 matched route，也是外部輸入

Route pattern `/trade/:symbol` 中的 `:symbol` 是動態片段。Router 對目前 URL 完成 matching 後，`useParams` 回傳 matched branch 中可用的 params；nested child 也能讀到 parent route params。

```tsx
const params = useParams();
```

```text
URL /accounts/a1/orders/o9
    ↓ match /accounts/:accountId/orders/:orderId
useParams()
    ↓
{ accountId: "a1", orderId: "o9" }
```

Param value 仍要視為 `string | undefined` 與不可信輸入：Router 負責路徑 matching/decoding，不負責確認它是支援的交易對、合法 UUID 或有權查看的帳號。

```tsx
function TickerPage() {
  const { symbol: rawSymbol } = useParams();
  const symbol = parseSupportedSymbol(rawSymbol);

  const ticker = useQuery({
    queryKey: ["ticker", symbol],
    queryFn: () => fetchTicker(symbol),
    enabled: symbol !== null,
  });

  if (symbol === null) return <NotFound />;
  return <Ticker data={ticker.data} />;
}
```

不要把 param 無條件複製到 `useState`。URL 改變會產生新的 params，但舊 local state 不會重新初始化，於是出現兩份 source of truth。若只要顯示／查詢，直接從 param validate、normalize、derive；只有真正可編輯且尚未提交的 draft 才另建 state。

> 一句話記憶：`useParams` 讀的是目前 route match，不是已驗證的業務資料；先檢查再進 query 或 UI。

官方參考：[React Router `useParams`](https://reactrouter.com/api/hooks/useParams)

### 1. `/trade/:symbol` 讀到的 symbol 一定是 string 嗎？

```tsx
const { symbol } = useParams();
```

<details>
<summary>答案</summary>

型別通常是 `string | undefined`，因為 component 可能未在預期 route 下或參數不存在。先透過 route 結構/型別與 runtime validation 確認，再用；不要直接 non-null assertion 後送 API。

</details>

### 2. URL encoded value 需要自己 `decodeURIComponent` 嗎？

<details>
<summary>答案</summary>

Router 通常已處理 path param decoding；重複 decode 可能拋錯或改變 `%`。仍要做業務 validation/normalization，例如 `symbol.toUpperCase()` 並確認在允許清單，而不是把 decode 當驗證。

</details>

### 3. Parent route 的 params 在 child route 可讀嗎？

<details>
<summary>答案</summary>

Nested child match 會繼承 parent params，因此 `/accounts/:accountId/orders/:orderId` 的 child 可讀兩者。相同 param name 在巢狀 route 中會造成覆蓋/混淆，命名要清楚。

</details>

### 4. 把 param 複製到 state 有何風險？

```tsx
const { symbol } = useParams();
const [selected, setSelected] = useState(symbol);
```

<details>
<summary>答案</summary>

建立兩份 source of truth；URL 改變不會重新初始化 state。若 selected 就是 navigation state，直接使用 param；若是可編輯 draft，明確定義何時提交回 URL、何時 reset，而不是 Effect 雙向同步。

</details>

### 5. Param 改變後 query 如何切換 cache？

<details>
<summary>答案</summary>

Validation 後的 param 應進 query key，例如 `['ticker', symbol]`。只讓 queryFn closure 讀 param 而 key 不變，會把不同 route 的資料混成同一 cache identity。

</details>

### 6. 無效 param 應由 component 顯示空白嗎？

<details>
<summary>答案</summary>

最好在 route loader/schema boundary 解析並回 404/redirect，或 component 明確顯示 invalid state；不要讓 `undefined` 一路進 API 變成 `/api/ticker/undefined`。URL 也是不可信輸入。

</details>

### `useParams` 六題詳細補充

1. **Param type**：Route 可能沒有 match、optional param 也可能缺少，因此讀值要視為 `string | undefined` 並在 boundary validate。即使 TypeScript 縮窄 key，也不代表 URL 內容符合業務 enum。
2. **Decode**：Router 已對匹配片段做 URL decoding，重複 `decodeURIComponent` 可能把合法 `%` 再解一次並拋錯。仍要做的是 schema/allowlist validation、大小寫 normalization，以及把 normalized value用於 query key。
3. **Nested matches**：Child route 可讀到目前 matched branch 上祖先 routes 的 dynamic params；同名 param 會造成理解困難，route design 應使用清楚唯一名稱。Sibling 或未 match route 的 params 不存在。
4. **不要複製 state**：Param 本身就是 URL source of truth；複製進 local state 後，navigation 改 param 不會自動同步，還會短暫顯示舊 entity。直接由 param 推導 query/form key；只有真正可編輯 draft 才建立 local state，並定義何時 reset。
5. **Cache identity**：`['ticker', normalizedSymbol]` 讓 param 變更自然切換 observer/cache；不要 key 固定再讓 queryFn 偷讀 closure。未通過 validation 前使用 enabled gate 或 route error，避免用 `undefined` 發 request。
6. **Invalid param UX**：在 route/loader boundary 轉成 404、redirect 或明確 unsupported state，比 component 回空白更可觀察。錯誤頁仍需保留導航出口，也不要把 invalid input 默默改成 BTC，否則分享的錯誤 URL 看似成功。

## React Router `useSearchParams`：讀寫 query string

### 做題前：Search params 是 URL state，setter 會觸發 navigation

搜尋條件、分頁與 tab 若需要分享、bookmark 或重新整理後恢復，適合放在 query string。`useSearchParams` 讓 component 讀取目前 `URLSearchParams`，並透過 setter 導航到新的 search string。

```tsx
const [searchParams, setSearchParams] = useSearchParams(defaultInit?);
```

```tsx
function OrdersToolbar() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "open";

  function changeTab(nextTab: string) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("tab", nextTab);
      next.delete("page"); // tab 改變時明確重設分頁
      return next;
    });
  }

  return <Tabs value={tab} onChange={changeTab} />;
}
```

```text
目前 URL ?symbol=BTCUSDT&tab=open&page=3
  → 建立 params copy、只修改 tab 並刪除 page
  → setSearchParams(next)
  → Router navigation
  → URL 與所有 readers 一起看到新 search params
```

`setSearchParams({ tab: "history" })` 是替換成該組 params，不會像 class state 自動 merge，所以想保留 `symbol` 時要從目前值 copy。Callback 形狀也不具有 React state setter 的同 tick queue 累積保證。

`searchParams` reference 是穩定但 mutable 的。只呼叫 `params.set(...)` 會修改 object，卻不會更新 URL 或 navigation；應產生下一份 params 並交給 setter。輸入框每打一字就 navigation 也可能污染 history 與增加 loader/request，實務上常區分 input draft 與 committed URL filters。

> 一句話記憶：讀值來自 URL，寫值代表 navigation；更新時要明確決定保留、替換與移除哪些 keys。

官方參考：[React Router `useSearchParams`](https://reactrouter.com/api/hooks/useSearchParams)

### 1. `setSearchParams` 是 local state setter 嗎？

<details>
<summary>答案</summary>

不是。設定 search params 會造成 navigation 並更新 URL/history。它雖支援 callback 形狀，但不保證像 React setState 一樣在同一 tick 把多次 functional update 排隊累積。

</details>

### 2. 為何直接 mutation 後 URL 沒變？

```tsx
const [params] = useSearchParams();
params.set("tab", "orders");
```

<details>
<summary>答案</summary>

`URLSearchParams` object 可變，但只有呼叫 `setSearchParams` 才 navigation。直接改 object 可能在下次 unrelated render 讀到變值，URL 卻沒同步。建立下一份 params 並交給 setter，維持清楚資料流。

</details>

### 3. 更新 `tab` 為何把 `symbol` 弄丟？

```tsx
setSearchParams({ tab: "orders" });
```

<details>
<summary>答案</summary>

這會設定成只含 tab 的新 query string，不會像 class setState 自動 merge。要保留其他 keys，從目前 params 建立 copy、修改後 return；同時明確決定哪些舊 key 在 tab 切換時本來就應移除。

</details>

### 4. Search param 的 `page` 可以直接 `Number()` 後使用嗎？

<details>
<summary>答案</summary>

要處理缺值、`NaN`、負數、小數與上限：parse、validate、clamp，再生成 canonical value。URL 是外部輸入，不要信任 TypeScript cast。

</details>

### 5. Default init 會在第一次 render 改寫 URL 嗎？

```tsx
useSearchParams({ tab: "chart" });
```

<details>
<summary>答案</summary>

Default init 可提供初始讀值，但不會自動在第一次 render 把它寫進 URL。若產品要求 canonical URL，應透過 route/redirect 或明確 navigation 正規化。

</details>

### 6. Input 每打一字就更新 search params 好嗎？

<details>
<summary>答案</summary>

視 UX 而定，但每字 navigation 會堆 history、觸發 loader/query 並讓 Back 行為奇怪。常見做法是 local draft + debounce/submit 後更新 URL，連續取代可用 replace；可分享的 committed filter 才是 URL truth。

</details>

### `useSearchParams` 六題詳細補充

1. **它是 navigation**：`setSearchParams` 會建立/取代 location，而不是只改 component memory，因此會觸發 router matching、loader 與 history 語意。是否 replace、是否保留 scroll，都應按 navigation UX 決定。
2. **Stable 但 mutable**：目前 `searchParams` reference 可穩定地當 Effect dependency，但 `URLSearchParams` 物件本身可 mutation；只呼叫 `.set()` 不會通知 Router。建立/回傳新的 params 並呼叫 setter，才能讓 URL 成為已提交狀態。
3. **保留其他 keys**：`setSearchParams({ tab })` 表示整份 query 變成這個 object，不是 merge。更新單一欄位要從 current 複製、set/delete 目標 key後回傳；並測試 multi-value keys，避免 object shorthand 意外壓掉重複參數。
4. **Parsing 與 validation**：`Number(null)`、`Number('')` 都可能得到 0，`Number('abc')` 是 NaN；必須先檢查 raw presence，再做 finite/integer/range clamp。URL 永遠是不可信輸入，不能只靠 TypeScript cast。
5. **Default init**：它只提供 URL 缺值時 Hook 首次讀取的預設，不會自動改寫 address bar。若產品要求 canonical URL，應明確 navigate/redirect，並避免 hydration 後才偷偷加參數造成 history 噪音。
6. **每字更新**：Query 可分享時很有價值，但每個 keystroke 都 push history、跑 loader 或發 request 可能很昂貴。可用 local draft + submit/debounce commit，或使用 replace 避免 Back 穿過每個字；選擇要與可分享性和資料取得策略一致。

## React Hook Form `useForm`：建立表單控制與 subscription

### 做題前：它建立的是整張表單的控制器

大型表單若每個 input 都用 React state controlled，任何按鍵都可能讓整個 form tree render。React Hook Form（RHF）主要透過欄位註冊、ref 與細粒度 subscription 管理輸入，`useForm` 則建立這份 form control 與所有操作 API。

```tsx
const {
  register,
  handleSubmit,
  control,
  formState,
  setValue,
  reset,
  setError,
  getValues,
} = useForm({ defaultValues, resolver?, mode? });
```

```tsx
type OrderForm = {
  symbol: string;
  quantity: number;
};

function OrderTicket() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderForm>({
    defaultValues: { symbol: "BTCUSDT", quantity: 1 },
  });

  async function onValid(values: OrderForm) {
    await postOrder(values);
  }

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input {...register("symbol", { required: "請輸入交易對" })} />
      <input
        type="number"
        {...register("quantity", { valueAsNumber: true, min: 0.001 })}
      />
      {errors.symbol && <p role="alert">{errors.symbol.message}</p>}
      <button disabled={isSubmitting}>送出</button>
    </form>
  );
}
```

```text
register 欄位與規則
  → 使用者輸入由 form control 追蹤
  → handleSubmit 執行 validation
      ├─ valid：呼叫 onValid(parsedValues)
      └─ invalid：更新 errors，聚焦／顯示錯誤
```

`defaultValues` 是 form 初始化與 dirty comparison 的基準，不是每次 props 改變就自動覆蓋欄位。遠端資料到達後要以 `reset(data)` 或適合版本的 values 策略明確同步；否則使用者 draft 很容易被非預期重設。

RHF 只管理 client form state/validation，不替代 server validation、mutation cache 或安全檢查。即使 client 通過，server 仍必須驗證；server error 可用 `setError` 顯示，並定義下次提交／欄位變更時如何清除。

> 一句話記憶：`useForm` 建立表單控制與 subscription 邊界，`register` 接欄位，`handleSubmit` 串 validation 與提交。

官方參考：[React Hook Form `useForm`](https://react-hook-form.com/docs/useform)

### 1. `defaultValues` prop 改變後欄位會自動重設嗎？

```tsx
const form = useForm({ defaultValues: order });
```

<details>
<summary>答案</summary>

Default values 會被快取，不是每次 prop 改就覆蓋使用者輸入。切換真正不同的 form identity 時，明確呼叫 `reset(nextOrder)`，或依套件版本/需求使用 reactive values 設定；先定義 dirty fields 要保留還是丟棄。

</details>

### 2. 為何 input 有 `value` 卻沒有更新 React Hook Form？

```tsx
<input {...register("price")} value={price} />
```

<details>
<summary>答案</summary>

同時建立 RHF registered uncontrolled flow 與外部 controlled value，ownership 衝突。原生 input 優先讓 `register` 管理；真正 controlled 第三方元件用 `Controller/useController` 明確接 value/onChange/ref。

</details>

### 3. `formState.isDirty` 為何不準？

<details>
<summary>答案</summary>

Dirty comparison 需要完整、穩定的 defaultValues 作基準。漏填欄位 default、混入不可比較的 custom object，或用外部 mutation 改 defaults 都會破壞判斷。先建立完整 serializable defaults。

</details>

### 4. `handleSubmit(onValid)` 會阻止原生 submit 嗎？

<details>
<summary>答案</summary>

會整合 validation 並處理 submit event；但 `onValid` 內 async error 不會被魔法吞掉，仍要 try/catch 與顯示 server error。Client validation 通過也不代表 server 接受。

</details>

### 5. `setError('root.server', ...)` 後下一次送出怎麼處理？

<details>
<summary>答案</summary>

Root/server error 的生命週期要明確管理，成功/重新提交時依需求 clear；欄位 server error 則要映射到對應 field。不要只 toast 後保留一個永遠存在的 invalid state。

</details>

### 6. 為何整張表單每打一字都 render？

<details>
<summary>答案</summary>

可能在 root 解構/訂閱了整份 `formState` 或用 `watch()` 無差別監聽所有欄位。把 subscription 移到真正需要的 child，使用 `useWatch`/`useFormState` 選取範圍；先量測，不要為了零 render 破壞可讀性。

</details>

### `useForm` 六題詳細補充

1. **Default values 是初始化基準**：同步 prop 改變不會自動覆蓋使用者已編輯欄位；載入新 entity 後應在明確時機 `reset(nextValues)`，並選擇是否保留 dirty/touched/errors。避免每個 render 建新 values 造成無限 reset 或草稿消失。
2. **Controlled / uncontrolled 邊界**：`register` 主要讓 RHF透過 ref 管 uncontrolled input；自己傳 `value` 卻不把 `onChange` 交回 RHF，畫面與 form store 就分裂。第三方 controlled widget 用 `Controller/useController`，普通 input 則讓 `register` 提供 handlers。
3. **Dirty 比較基準**：`isDirty` 是目前 values 與完整 `defaultValues` 的比較結果；漏給 default、型別不一致（`"1"` vs `1`）或 reset 選項都會改變判斷。所有欄位先提供穩定 default，server entity 切換時再明確重設基準。
4. **handleSubmit**：它回傳真正的 submit handler，會處理 preventDefault、執行 validation，再分流 onValid/onInvalid；onValid 內 request thrown error仍需自行 catch/交給 mutation。不要同時在 form `onSubmit` 外又綁 button click 重複送出。
5. **Server root error**：Root error適合表單整體錯誤，欄位錯誤則對應 field name。新提交開始時可清掉過期 server error，成功 reset；若 server error 要持續到使用者修改某欄，應定義精確 clear 規則，不能讓舊訊息污染下一筆 entity。
6. **Render 粒度**：解構/訂閱整份 formState、根層 `watch()` 或把所有 values 提升到 parent 都會擴大更新。讓欄位靠 uncontrolled ref 運作，在需要顯示 error/derived preview 的小 component 用 `useFormState`、`useWatch` 精準訂閱。

## React Hook Form `useWatch`：在指定範圍訂閱欄位值

### 做題前：Watch 的重點是「哪個 component 要跟哪個欄位一起 render」

`getValues("price")` 只在呼叫當下讀 snapshot，不建立 subscription；`useWatch` 則訂閱指定欄位，當該值改變時讓呼叫它的 component/custom Hook 更新。這讓衍生 UI 可以靠近實際 consumer，不必讓整張表單每打一字都 render。

```tsx
const value = useWatch({
  control,
  name?,
  defaultValue?,
  compute?,
  disabled?,
});
```

```tsx
function Notional({ control }: { control: Control<OrderForm> }) {
  const [price, quantity] = useWatch({
    control,
    name: ["price", "quantity"],
  });

  const notional = Number(price) * Number(quantity);
  return <output>名目金額：{notional}</output>;
}

function OrderTicket() {
  const { register, control } = useForm<OrderForm>();

  return (
    <form>
      <input {...register("price")} />
      <input {...register("quantity")} />
      <Notional control={control} />
    </form>
  );
}
```

```text
price 改變
  → RHF form control 通知 price subscribers
  → Notional 的 useWatch 得到新值並 render
  → 不需讓不關心 price 的 siblings 全部更新
```

不傳 `name` 代表訂閱整張表單，方便但會放大更新範圍。`compute` 可從訂閱資料選出真正需要的結果，但仍應保持 pure。Subscription 建立有時序：若在 `useWatch` 掛上前已 `setValue`，需要結合 `getValues` 或調整 component 結構，不能假設舊通知會重播。

它是 Hook，只能在 component/custom Hook 頂層呼叫；event handler 想讀當下值應使用 `getValues`，不能臨時呼叫 `useWatch`。

> 一句話記憶：`useWatch` 是 RHF 的 reactive field subscription，訂閱範圍應縮到真正需要重新 render 的 consumer。

官方參考：[React Hook Form `useWatch`](https://react-hook-form.com/docs/usewatch)

### 1. 它和 `getValues('price')` 差在哪裡？

<details>
<summary>答案</summary>

`useWatch` 會訂閱值並在相關欄位改變時更新呼叫它的 component；`getValues` 是當下 imperative read，不建立 subscription。要讓 summary 跟著輸入更新用 watch，要在 click 時讀一次可用 getValues。

</details>

### 2. 為何 `useWatch()` 不傳 name 容易擴大 render？

<details>
<summary>答案</summary>

它訂閱整份 form values，任一欄位改變都可能 render consumer。只需要 price/quantity 就傳明確 names，並把訂閱 colocate 到顯示 total 的小 component。

</details>

### 3. Subscription 建立前先 `setValue`，會讀到更新嗎？

<details>
<summary>答案</summary>

官方提醒 subscription 執行順序很重要：若 update 發生在 useWatch 訂閱之前，該次 notification 可能被錯過。需要永遠拿 current values 的 custom Hook 可合併 `useWatch()` subscription 與 `getValues()` snapshot。

</details>

### 4. `compute` 適合做什麼？

<details>
<summary>答案</summary>

用來從訂閱資料選出/計算 consumer 真正需要的值，縮小更新範圍，例如只回傳有效的 notional。Compute 應純粹且便宜；昂貴工作仍要量測與設計。

</details>

### 5. `disabled: true` 會清掉欄位值嗎？

<details>
<summary>答案</summary>

它停用這個 watch subscription，不等於 unregister field 或刪除 form value。要區分「不再觀察」與「欄位不存在」。

</details>

### 6. 可以在事件 handler 中呼叫 `useWatch` 讀最新值嗎？

<details>
<summary>答案</summary>

不可以，Hook 只能在 component/custom Hook 頂層。事件中讀一次用 `getValues`；需要 reactive render 則在頂層 `useWatch`，handler 使用該次 render snapshot 或明確 imperative read。

</details>

### `useWatch` 六題詳細補充

1. **Reactive vs imperative**：`useWatch` 建 subscription，指定欄位改變會讓使用它的 component render；`getValues` 只讀呼叫當下 snapshot，不訂閱。UI preview 用 watch，click submit 前臨時讀值可用 getValues。
2. **Name 粒度**：不傳 name 訂閱整份 form，任一欄位輸入都可能更新 consumer。把 price/quantity preview 抽到小 component，只 watch 這兩個 names，再在本地推導 notional，能隔離大表單。
3. **Subscription order**：若 `setValue` 發生在 watcher 建立前，那次 notification 可能已錯過；初始化應使用 defaultValues，或在 custom Hook 合併 `useWatch` result 與 `getValues()` 的目前 snapshot。不要依靠 Effect 裡晚建立 watcher補歷史事件。
4. **compute**：它可讓 subscription只回傳真正關心的衍生結果，例如總額或 filtered slice，縮小回傳 identity。Compute 必須 pure 且結果穩定；每次回新大型 object 仍可能造成 render。
5. **disabled**：它暫停 subscription，不等於 unregister、清空 value 或修改 form store。重新啟用時要理解預設/目前值來源；若產品真的要刪欄位資料，使用 unregister/resetField 等明確 API。
6. **Rules of Hooks**：不能在 event handler 呼叫 useWatch；Hook 必須在 component/custom Hook 頂層。Handler 要最新值使用 `getValues`，或讓頂層 watcher 產生值後由 closure 使用本次 render snapshot。

## React Hook Form `useFieldArray`：管理動態欄位與 identity

### 做題前：動態欄位最難的不是 array，而是每一列的身份

使用者可新增、刪除、交換多筆委託時，每列 input 都有自己的 focus、dirty、validation 與 DOM instance。若用 array index 當 React key，刪掉第 0 列後，後面所有 row 的 key 都改變，輸入狀態可能跟錯資料。

`useFieldArray` 以 RHF 產生的 `field.id` 維持 UI row identity，並提供結構操作：

```tsx
const {
  fields,
  append,
  prepend,
  remove,
  swap,
  move,
  update,
  replace,
} = useFieldArray({ control, name, rules? });
```

```tsx
function OrderLegs() {
  const { control, register } = useForm({
    defaultValues: { legs: [{ serverId: null, symbol: "BTCUSDT", quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "legs" });

  return (
    <>
      {fields.map((field, index) => (
        <fieldset key={field.id}>
          <input {...register(`legs.${index}.symbol`)} />
          <input type="number" {...register(`legs.${index}.quantity`)} />
          <button type="button" onClick={() => remove(index)}>刪除</button>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => append({ serverId: null, symbol: "", quantity: 1 })}
      >
        新增一列
      </button>
    </>
  );
}
```

| Identity | 用途 |
| --- | --- |
| `field.id` | RHF/React render row key，維持 input instance |
| `serverId` | 後端 entity identity，提交、更新、刪除 API 使用 |
| array index | 目前欄位 path 的位置，排序後本來就會改變 |

`append` 應傳完整 row shape，讓 default、validation 與 dirty comparison 有一致基準。`update(index, value)` 可能讓該 row unmount/remount；只改單一欄位且要保留 instance 時，使用 `setValue("legs.0.quantity", next)` 更精確。

不要在同一個 click 中堆疊多個互相依賴的 array action 再假設每一步同步完成；先表達最終結構，或把下一步放到下一個明確 lifecycle。

> 一句話記憶：`useFieldArray` 管動態欄位結構；render key 用 `field.id`，業務 API identity 仍用 server ID。

官方參考：[React Hook Form `useFieldArray`](https://react-hook-form.com/docs/usefieldarray)

### 1. Render list 時 key 應用 index 還是 `field.id`？

```tsx
{fields.map((field, index) => (
  <input key={field.id} {...register(`orders.${index}.price`)} />
))}
```

<details>
<summary>答案</summary>

使用 `field.id` 作 React key，index 只用在欄位 path。刪除/交換後，stable field identity 才能保留正確 input state/focus；`key={index}` 會把位置冒充資料 identity。

</details>

### 2. `update(index, value)` 為何可能讓欄位 remount？

<details>
<summary>答案</summary>

Field array 的 update 會更新該項結構，官方說明可能 unmount/remount 目標欄位。若只改單一值且要保留 instance/focus，可用 `setValue('orders.0.price', value)`；選 API 時要知道 identity 代價。

</details>

### 3. Append partial object 可以嗎？

<details>
<summary>答案</summary>

Dynamic field action 通常需要提供完整 default object，避免欄位一開始是 undefined、validation/default/dirty 基準不一致。例如 append `{ symbol: '', price: '', quantity: '' }`，不是只 append `{ symbol }`。

</details>

### 4. 為何不建議同一個 click 連續 append 再 remove？

<details>
<summary>答案</summary>

Stack 多個 field-array actions 會讓 index/registration lifecycle 難以推導。把真正的單一步驟資料轉換設計清楚，或讓後續 remove 在狀態 commit 後發生；不要依賴舊 index snapshot。

</details>

### 5. Array-level validation error 在哪裡顯示？

<details>
<summary>答案</summary>

除了每列 field errors，minLength 等 built-in array rule 可能出現在 field array root error。UI 要分開顯示「第 2 列 price 錯」與「至少要一筆」這兩種語意。

</details>

### 6. 交換兩列後 server ID 與 field ID 怎麼分工？

<details>
<summary>答案</summary>

`field.id` 是 RHF/React render identity；server `orderId` 是業務 identity，兩者都應保留但用途不同。Submit 時送 server ID，render key 用 field.id；不要覆寫或把自動產生 field id 當後端資料 ID。

</details>

### `useFieldArray` 六題詳細補充

1. **`field.id` 是 React identity**：Index key 會在插入/刪除/排序後把 DOM input state與錯誤對到另一列。`field.id` 專供 reconciliation；server entity ID仍是業務欄位，兩者不要互相覆寫。
2. **Update 可能 remount**：`update` 會替換該列 field object，文件明確提示可能 unmount/remount；要只改一個欄位且保留 focus/內部狀態，使用 `setValue('items.0.price', next)`。整列語意真的被替換時才用 update。
3. **Append 完整 shape**：新增資料應包含所有已註冊欄位的 defaults，不能只傳 partial/空 object讓 controlled/uncontrolled 狀態不一致。可用 `createEmptyOrder()` factory 集中型別、預設與 client metadata。
4. **不要堆疊 array actions**：同一 event 連續 append/remove 會讓第二個 index 基於尚未反映的 fields snapshot，意圖難以推導。直接計算最終 replace 值，或讓下一個操作在後續 render/明確事件執行。
5. **Array-level error**：Built-in rules 的 root error位於 field-array error boundary，應在整個列表附近顯示，例如「至少一筆」；每列欄位錯誤仍顯示在該 row。Server array error也要轉成一致結構，讓 focus與 accessibility訊息可用。
6. **兩種 ID 分工**：`field.id` 在 client render lifetime 保持 row identity；`serverId` 用於 update/delete API。Swap/move只改順序不改任何 ID；submit 時送 serverId與欄位值，通常不要把 RHF internal id當後端主鍵。

## 完成檢查

- URL 是可分享 navigation state，draft 與 committed filters 要分開。
- Router setter 是 navigation，不是 local state merge。
- React Hook Form 的效能來自註冊與細粒度 subscription，不是把所有值再複製到 state。
- Dynamic fields 同時有 render identity 與業務 identity。

[回到 Hooks 六題題庫](/docs/frontend-interview/binance/react-hooks-six-drills-index)
