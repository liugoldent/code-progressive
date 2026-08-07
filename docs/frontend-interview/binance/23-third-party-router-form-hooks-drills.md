---
sidebar_position: 26
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

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)

Router Hooks 的 source of truth 是 URL/history；Form Hooks 的核心是欄位註冊與 subscription。不要先把 URL 或整份表單複製進 local state，再用 Effect 雙向同步。

:::note 套件版本

React Router 在不同模式/版本的 import path、navigate return type 與 Data API 能力有所差異。題目聚焦共同心智模型；實作時以專案 lockfile 與該 major 版官方文件為準。

:::

## React Router `useNavigate`：以程式改變 location/history

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

## React Router `useParams`：讀取目前 route match 的動態片段

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

## React Router `useSearchParams`：讀寫 query string

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

## React Hook Form `useForm`：建立表單控制與 subscription

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

## React Hook Form `useWatch`：在指定範圍訂閱欄位值

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

## React Hook Form `useFieldArray`：管理動態欄位與 identity

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

## 完成檢查

- URL 是可分享 navigation state，draft 與 committed filters 要分開。
- Router setter 是 navigation，不是 local state merge。
- React Hook Form 的效能來自註冊與細粒度 subscription，不是把所有值再複製到 state。
- Dynamic fields 同時有 render identity 與業務 identity。

[回到 Hooks 六題題庫](./17-react-hooks-six-drills-index.md)
