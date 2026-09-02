---
sidebar_position: 1
title: React 30 題逐題改寫與解法整理
description: React 狀態、副作用、效能與實作面試題的快速複習筆記。
---

# React 30 題逐題改寫與解法整理

> 這份筆記依《React 求職特訓營》的題目主題重新表述，解法與程式碼皆重新整理，適合面試前快速複習。重點不是背 API，而是能說明「為什麼出錯、React 如何判斷更新、如何選擇修正方式」。

## 第一章：狀態管理

### 01｜陣列內容改了，畫面為什麼沒更新？

**改寫題意：** 在 state 陣列上直接呼叫 `push`，接著把同一個陣列交回 setter；資料看似增加了，UI 卻沒有重新渲染。

**核心原因：** `push` 會原地修改陣列，物件參考沒有改變。React 以 `Object.is` 比較新舊 state，看到相同參考時可以略過更新。

**解法：** 建立新陣列，不改動舊 state；當更新依賴前一次值時使用函式更新。

```jsx
setNames((previous) => [...previous, 'Leo']);
```

**面試回答：** state 應視為唯讀快照。除了陣列，物件也應以展開、`map`、`filter` 等方式產生新參考。

### 02｜連續加三次，為什麼只增加一次？

**改寫題意：** 同一個事件中連續執行三次 `setCount(count + 1)`，結果只從 0 變成 1。

**核心原因：** 該次 render 裡的 `count` 是固定快照，三行都計算出 `1`；React 又會批次處理事件內更新。

**解法：** 若下一個值依賴上一個值，傳入 updater function。

```jsx
setCount((value) => value + 1);
setCount((value) => value + 1);
setCount((value) => value + 1);
```

**面試回答：** setter 不是立刻改寫目前變數；它是排入下一次 render 的更新。批次處理與非同步 API 是不同概念。

### 03｜更新巢狀物件時，為什麼讀到 undefined？

**改寫題意：** 元件預期 `profile.contact.email` 一直存在，但 state 的初始值或某次更新後缺少 `contact`，render 或 Effect 讀取深層欄位時便出現 `Cannot read properties of undefined`。若直接對不存在的層級賦值，則會出現 `Cannot set properties of undefined`。

先看最常見的錯誤。假設畫面會讀取：

```jsx
<p>{profile.contact.email}</p>
```

如果初始值少了 `contact`：

```jsx
const [profile, setProfile] = useState({});
```

第一次 render 時，`profile.contact` 是 `undefined`，程式接著讀取 `undefined.email`，因此立即報錯。這不是 React 特有的錯誤，而是 JavaScript 無法從 `undefined` 繼續取得屬性。

**核心原因一：初始資料缺少畫面需要的層級。** 如果欄位在元件生命週期中一定會使用，應先給定穩定的資料形狀：

```jsx
const [profile, setProfile] = useState({
  name: '',
  contact: {
    email: '',
    phone: '',
  },
});
```

**核心原因二：setter 會替換整個物件，不會自動合併。** 以下寫法雖然成功更新 email，卻同時刪除了原本的 `name` 與 `phone`：

```jsx
// 錯誤：更新後只剩下 contact.email
setProfile({
  contact: {
    email: nextEmail,
  },
});
```

更新巢狀欄位時，要將沿途每一層都複製，再覆蓋真正要改的欄位：

```jsx
setProfile((previous) => ({
  ...previous, // 保留 name 等 profile 第一層欄位
  contact: {
    ...previous.contact, // 保留 phone 等 contact 內的欄位
    email: nextEmail, // 只替換 email
  },
}));
```

假設更新前是：

```js
{
  name: '小明',
  contact: { email: 'old@example.com', phone: '0912345678' },
}
```

更新後會得到一個新物件，但未修改的資料仍被保留：

```js
{
  name: '小明',
  contact: { email: 'new@example.com', phone: '0912345678' },
}
```

展開運算子只複製目前那一層，所以不能只寫 `...previous`；`contact` 本身也必須再複製一次。

**核心原因三：直接修改 state，或修改尚未建立的層級。**

```jsx
// 不要這樣做
profile.contact.email = nextEmail;
setProfile(profile);
```

如果 `contact` 不存在，第一行就會報錯；即使它存在，這段程式仍直接修改舊 state，且交回相同的物件參考，React 可能略過重新渲染。state 應視為唯讀快照，更新時建立新物件。

**非同步資料的處理：** 如果完整資料要等待 API 回傳，`null` 往往比假裝已有資料更能表達「尚未載入」，並在讀取前處理 loading：

```jsx
const [profile, setProfile] = useState(null);

useEffect(() => {
  fetchProfile().then(setProfile);
}, []);

if (!profile) {
  return <p>Loading...</p>;
}

return <p>{profile.contact.email}</p>;
```

如果某個欄位本來就是選填，可以使用 optional chaining 與預設值：

```jsx
<p>{profile?.contact?.email ?? '尚未提供 Email'}</p>
```

但 `?.` 只會讓讀取在資料不存在時安全停止，不會建立缺少的 `contact`，也不會修復錯誤的資料結構。若更新時 `contact` 合理地可能不存在，要明確提供預設物件：

```jsx
setProfile((previous) => ({
  ...previous,
  contact: {
    ...(previous.contact ?? {}),
    email: nextEmail,
  },
}));
```

**面試回答：** 深層欄位出現 `undefined`，通常代表資料形狀在某個時間點不符合元件的預期。先確認每一層是否存在；同步表單給穩定的初始結構，更新時逐層建立新物件；非同步資料則明確處理 loading。optional chaining 只能避免當下崩潰，不能取代正確的資料模型。

### 04｜表單欄位很多，是否每欄都要一個 state？

**改寫題意：** 一個表單有大量欄位，若每欄建立 state 與 handler，程式碼會充滿重複內容。

**解法：** 高度相關且一起提交的欄位可放在同一物件，使用 input 的 `name` 作為更新鍵；但互不相關、更新頻率不同的狀態不必強行合併。

```jsx
const [form, setForm] = useState({ name: '', email: '', role: '' });

function handleChange(event) {
  const { name, value } = event.target;
  setForm((previous) => ({ ...previous, [name]: value }));
}
```

**面試回答：** state 的切分依「是否一起變動」決定；複雜狀態轉移可進一步改用 `useReducer`。

### 05｜條件渲染為什麼冒出數字 0？

**改寫題意：** 使用 `{items.length && <List />}`，空陣列時畫面顯示 `0`。

**核心原因：** `&&` 回傳第一個 falsy 值；`items.length` 為 0，而 React 會渲染數字 0，只會忽略 `false`、`null`、`undefined`。

**解法：** 明確轉成布林值。

```jsx
{items.length > 0 && <List items={items} />}
```

### 06｜為什麼 Hook 數量前後不一致？

**改寫題意：** 某個 Hook 放在條件式或提早 `return` 之後，條件改變時 React 報告 Hook 數量與上次 render 不同。

常見錯誤訊息有兩種：

```text
Rendered more hooks than during the previous render.
Rendered fewer hooks than expected.
```

**核心原因：React 不是靠變數名稱辨認 Hook，而是靠每次 render 的呼叫順序。** 可以把同一個元件的 Hook 想成依序編號的格子：

```text
第 1 個 Hook → useState(name)
第 2 個 Hook → useState(age)
第 3 個 Hook → useEffect(...)
```

React 在下一次 render 時，預期仍會依照相同順序遇到這三個 Hook，才能把先前保存的 state、Effect 與這次呼叫正確配對。變數名稱只是 JavaScript 區域變數，不是 React 保存狀態的識別碼。

以下程式第一次 render 時 `enabled` 是 `false`，只呼叫一個 Hook；下一次變成 `true`，便多出一個 Hook：

```jsx
function Profile({ enabled }) {
  const [name, setName] = useState(''); // 第 1 個 Hook

  if (enabled) {
    useEffect(() => {                   // 有時出現的第 2 個 Hook
      document.title = name;
    }, [name]);
  }

  return <input value={name} onChange={(event) => setName(event.target.value)} />;
}
```

當 Hook 中途出現或消失，後面的 Hook 編號就會整批錯位。React 無法確定某一格原本屬於哪個 state 或 Effect，因此直接報錯，避免把狀態配到錯誤的 Hook。

**提前 `return` 也會造成相同問題。** Hook 即使沒有寫在 `if` 區塊內，只要放在可能提前結束的分支後面，呼叫數量仍可能改變：

```jsx
function Profile({ user }) {
  const [editing, setEditing] = useState(false);

  if (!user) return <p>Loading...</p>;

  // 錯誤：有 user 時才會執行到這裡
  const [draft, setDraft] = useState(user.name);

  return <Editor draft={draft} onChange={setDraft} />;
}
```

**正確原則：一般 Hook 必須在元件或自訂 Hook 的最上層無條件呼叫，而且要放在所有可能的提前 `return` 之前。** 條件要移到 Hook 的 callback 或資料計算裡：

```jsx
function Profile({ enabled, name }) {
  useEffect(() => {
    if (!enabled) return;

    document.title = name;
  }, [enabled, name]);

  if (!enabled) return null;

  return <p>{name}</p>;
}
```

若條件控制的是初始值，可以讓 Hook 照常執行，只改變傳入的值：

```jsx
const [status, setStatus] = useState(enabled ? 'ready' : 'disabled');
```

如果兩個條件分支需要完全不同的一組 Hook，適合拆成不同元件，讓每個元件各自維持穩定順序：

```jsx
function Panel({ mode }) {
  return mode === 'edit' ? <EditPanel /> : <PreviewPanel />;
}

function EditPanel() {
  const [draft, setDraft] = useState('');
  // EditPanel 自己的 Hook 順序固定
}

function PreviewPanel() {
  const data = usePreviewData();
  // PreviewPanel 自己的 Hook 順序固定
}
```

同樣不能把一般 Hook 放在以下位置：

- `if`、三元運算子、`&&` 或 `switch` 等條件分支
- `for`、`while` 或陣列迭代 callback
- 事件處理函式或其他巢狀函式
- `useEffect`、`useMemo` 等 Hook 的 callback
- `try` / `catch` / `finally`
- 一般 JavaScript 函式；只有 React 函式元件與自訂 Hook 可以呼叫 Hook

自訂 Hook 不是規則的漏洞。元件若條件式呼叫 `useUser()`，即使看不到它內部的 `useState`、`useEffect`，仍然會破壞順序：

```jsx
// 錯誤
if (loggedIn) {
  const user = useUser();
}

// 正確：每次 render 都呼叫，由自訂 Hook 內部決定是否工作
const user = useUser(loggedIn);
```

可用 `eslint-plugin-react-hooks` 的 `rules-of-hooks` 規則在開發階段提早抓出大部分違規位置。

> **React 19 的特殊例外：** `use(promiseOrContext)` 可以出現在條件式與迴圈中，但仍須在元件或自訂 Hook 內呼叫，也不能放進 `try/catch`。這個例外只適用於 `use`；`useState`、`useEffect`、`useMemo` 等一般 Hook 仍必須遵守固定順序。

**除錯步驟：** 從錯誤發生的元件開始，依序檢查所有 Hook 與自訂 Hook；尋找它們前方的條件分支、提前 `return`、迴圈與 callback。不要只搜尋 `useState`，因為 `useSelector`、`useQuery` 等第三方 Hook 也受相同規則限制。

**面試回答：** React 依 Hook 的呼叫順序保存與配對狀態，不是依變數名稱。若 Hook 被放進條件、迴圈，或位於可能提前 `return` 的程式碼之後，不同 render 的 Hook 數量與順序就會改變。修正方式是讓 Hook 在元件或自訂 Hook 最上層無條件執行，再把條件放進 Hook callback，或把不同分支拆成獨立元件。

### 07｜props 改了，useState 的初始值為什麼沒跟著改？

**改寫題意：** 子元件以 prop 計算 `useState(initialValue)`；父元件更新 prop 後，子元件 state 仍保留舊值。

先看一個常見的編輯表單：父元件切換目前選到的使用者，再將 `user` 傳給同一個 `Editor`。

```jsx
function Editor({ user }) {
  const [name, setName] = useState(user.name);

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

第一次選到小明時，`name` 確實會是「小明」。但使用者在 input 內輸入「小明（修改中）」後，即使父元件改成傳入小美，input 仍可能顯示小明的草稿。

**核心原因：`useState` 的參數是 initial state，不是每次 render 都要同步的 current state。** React 只在元件首次掛載時，用它建立 state；只要畫面樹中仍是同一位置、同一種類的 `Editor`，之後重新 render 都會保留原本的 state。

可以用時間線理解：

| 時間 | 收到的 `user.name` prop | `useState` 保存的 `name` | 發生什麼事 |
| --- | --- | --- | --- |
| 第一次掛載 | 小明 | 小明 | 用 prop 建立初始 state |
| 使用者輸入 | 小明 | 小明（修改中） | setter 更新自己的 state |
| 父元件改傳小美 | 小美 | 小明（修改中） | 只是重新 render，沒有重新初始化 |

第三次 render 時，JavaScript 仍會計算 `user.name` 並呼叫 `useState('小美')`，但 React 會忽略新的初始化參數，回傳目前已保存的「小明（修改中）」。

也就是說，props 與 state 是兩份不同的資料：

```text
props.user.name → 父元件這次 render 傳來的快照
state.name      → Editor 自己保存、由 setName 更新的記憶
```

props 改變會讓子元件重新 render，但「重新 render」不等於「卸載後重新掛載」。只有元件真的被移除、元件種類改變，或它的 `key` 改變時，React 才會丟掉舊 state 並重新初始化。

#### 解法一：只是顯示或計算資料，直接使用 prop

如果值完全由 props 決定，根本不需要多存一份 state：

```jsx
// 不建議：color 會和 messageColor 不同步
function Message({ messageColor }) {
  const [color] = useState(messageColor);
  return <p style={{ color }}>Hello</p>;
}

// 建議：每次 render 都使用最新 prop
function Message({ messageColor }) {
  const color = messageColor;
  return <p style={{ color }}>Hello</p>;
}
```

衍生資料也應直接在 render 時重新計算：

```jsx
function Price({ originalPrice, discountRate }) {
  const finalPrice = originalPrice * (1 - discountRate);
  return <span>{finalPrice}</span>;
}
```

這能避免同一份資料同時存在於 prop 與 state，之後還要煩惱如何保持同步。

#### 解法二：它是可編輯資料，而且父元件需要掌握結果，改成受控元件

讓父元件保留唯一的資料來源，子元件只接收 `value` 與回報 `onChange`：

```jsx
function Editor({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function UserPage() {
  const [name, setName] = useState('小明');

  return <Editor value={name} onChange={setName} />;
}
```

此時 `name` 只存在父元件一處。父元件若載入另一位使用者並呼叫 `setName('小美')`，Editor 便會顯示小美；Editor 內也不再有另一份可能過期的 `name` state。

#### 解法三：切換不同資料時，要放棄舊草稿，用 `key` 重建元件

編輯不同使用者通常代表不同表單。如果切換對象時就是要清除舊 state，可以用穩定的識別碼作為 `key`：

```jsx
function UserPage({ selectedUser }) {
  return <Editor key={selectedUser.id} user={selectedUser} />;
}
```

當 `selectedUser.id` 從 `1` 變成 `2`，React 會把它們視為兩個不同的 Editor：

```text
key=1 的 Editor 卸載 → 舊草稿與 Effect 被清理
key=2 的 Editor 掛載 → useState(user.name) 重新初始化
```

`key` 會重設該元件整棵子樹的 state、ref 與 DOM 狀態，因此應使用 `user.id` 這類代表資料身分的穩定值。不要使用 `Math.random()` 或每次 render 都不同的 key，否則使用者每輸入一個字都可能使元件重建。

#### 解法四：確實要保留「第一次收到的值」，把意圖寫進名稱

有些元件本來就只把 prop 當預設值，後續交由自己管理。例如顏色選擇器的預設色：

```jsx
function ColorPicker({ initialColor }) {
  const [color, setColor] = useState(initialColor);
  // initialColor 之後再改，刻意不影響使用者已選的 color
}
```

使用 `initialColor` 或 `defaultColor`，會比命名成 `color` 更清楚：呼叫端一看就知道「只有第一次有效」。這和非受控表單元素的 `defaultValue` 概念相似。

#### 解法五：用 Effect 同步可以做到，但要先確認不會蓋掉使用者輸入

以下寫法會在 `user` 改變後再更新草稿：

```jsx
function Editor({ user }) {
  const [draft, setDraft] = useState(user.name);

  useEffect(() => {
    setDraft(user.name);
  }, [user]);

  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}
```

但它有幾個代價：

- prop 改變時，會先以舊 draft render 一次，Effect 執行後再 render 一次。
- 只要父元件建立新的 `user` 物件，Effect 就可能再次執行。
- 伺服器背景更新或父元件重新整理資料時，可能覆蓋尚未儲存的輸入。
- 需要自己定義「哪個 prop 改變才算換了一份草稿」，很容易產生同步規則與依賴陣列問題。

因此，如果需求是「換人時整張表單重設」，通常 `key={user.id}` 更直接；如果父子元件必須共用編輯結果，通常受控元件更清楚。Effect 同步適合真正需要讓兩套獨立狀態在特定時機協調的情境，不應當成複製 props 的預設解法。

#### Lazy initializer 也不會跟著 prop 重新執行

改成函式初始化，只是避免昂貴計算在每次 render 都執行，並不會讓 state 自動同步：

```jsx
const [form, setForm] = useState(() => createForm(user));
```

`createForm(user)` 仍只在這個元件初始化 state 時使用。開發環境的 Strict Mode 可能為了檢查純函式而呼叫 initializer 兩次，但後續 prop 更新仍不會重新初始化。

#### 常見誤解

- **「父元件 render 了，子元件應該重跑 `useState`。」** 子元件函式確實會再執行，但 React 會回傳已保存的 state，忽略新的 initial state。
- **「傳入一個新物件就會重設。」** 新物件只代表 prop 參考改變；只要元件身分沒變，state 仍會保留。
- **「用 `useMemo` 包起來就能同步。」** `useMemo` 只快取計算結果，不會重設 `useState`。
- **「`useState(user)` 會複製 user。」** 不會；首次 state 會拿到同一個物件參考，而且不應直接修改 props 或 state 物件。

#### 如何選擇？

| 需求 | 建議做法 |
| --- | --- |
| 只顯示或可由 props 計算 | 直接使用 prop／render 時推導 |
| 子元件編輯，父元件也要取得最新值 | 由父元件持有 state，改成受控元件 |
| 切換資料對象時要放棄整份舊草稿 | 使用代表資料身分的 `key` |
| prop 只負責第一次預設值，之後刻意忽略更新 | 保留 local state，prop 命名為 `initialXxx`／`defaultXxx` |
| 需要保存每個對象各自的草稿 | 將草稿提升到父元件，依 `id` 儲存 |
| 兩套獨立狀態確實要在特定變化後同步 | 謹慎使用 Effect，先定義覆寫規則 |

**除錯步驟：** 看到 prop 已變但畫面仍是舊值時，先搜尋是否有 `useState(prop)` 或 `useState(() => createSomething(prop))`。接著問這個值究竟是「可推導資料」、「使用者草稿」，還是「只在第一次使用的預設值」，再選擇直接使用 prop、提升 state、使用 `key`，或刻意保留 local state。

**面試回答：** `useState(initialValue)` 的 `initialValue` 只在元件首次掛載時用來建立 state。props 改變只會觸發重新 render；只要元件在畫面樹中的身分沒有改變，React 就會保留它原有的 state。若值可由 props 推導就不要複製成 state；若父子要共同編輯就提升 state；若切換資料對象時要整份重設，可使用穩定的 `key` 讓元件重新掛載。Effect 雖能同步，但要小心額外 render 與覆蓋使用者草稿。

### 08｜什麼時候 useState 不夠好？

**改寫題意：** 多個 state 彼此依賴，事件處理器散落各處，合法與非法狀態轉移難以追蹤。

`useState` 並沒有功能上的缺陷，複雜狀態理論上都能用它完成。真正的問題通常是：**狀態更新規則開始比畫面本身更難理解。**

例如一個送出流程分開保存三個布林值：

```jsx
const [isSaving, setIsSaving] = useState(false);
const [isSaved, setIsSaved] = useState(false);
const [hasError, setHasError] = useState(false);
```

每個 state 單獨看都很合理，但組合起來可能產生不合法狀態：

```text
isSaving=true、isSaved=true   → 到底還在儲存，還是已完成？
isSaved=true、hasError=true   → 到底成功，還是失敗？
```

可以先改善資料形狀，用一個互斥的 `status` 取代多個旗標：

```jsx
const [status, setStatus] = useState('editing');
// editing | saving | saved | error
```

這時 `useState` 仍然很好用。**state 數量多並不自動代表要使用 `useReducer`；重點是更新是否彼此相關，以及轉移規則是否已經分散。**

#### 適合繼續使用 useState 的情況

- 狀態彼此獨立，例如搜尋文字、Modal 是否開啟、目前頁碼。
- 更新規則很簡單，讀到 setter 就能立即理解。
- 每個事件只改一兩個值，不會重複同一套複雜邏輯。
- 元件規模小，沒有難以重現的狀態轉移 bug。

```jsx
const [query, setQuery] = useState('');
const [page, setPage] = useState(1);
const [isHelpOpen, setIsHelpOpen] = useState(false);
```

這三個值沒有必須一起更新的規則，硬塞進 reducer 只會增加 action 與 `switch` 的樣板程式碼。

#### 何時開始考慮 useReducer？

出現以下訊號時，`useReducer` 通常能讓程式更清楚：

1. **一次操作要一起更新多個相關欄位。** 例如「重設表單」必須同時清除欄位、錯誤與提交狀態。
2. **相同更新規則散落在多個 handler。** 例如新增、修改、刪除商品都要重新計算或維持相同限制。
3. **狀態有明確流程。** 例如 `editing → submitting → success/error`，不能任意跳轉。
4. **常出現不可能的狀態組合。** 多個 boolean 很容易彼此矛盾。
5. **難以知道「為什麼變成這個 state」。** 只看到許多 setter，無法對應是哪個使用者行為造成的。
6. **希望獨立測試狀態規則。** reducer 是純函式，可以不 render 元件就測試輸入與輸出。

#### useReducer 的心智模型

```text
目前 state + 發生的 action
              │
              ▼
        reducer(state, action)
              │
              ▼
          下一個 state
              │
              ▼
          React 重新 render
```

使用 `useState` 時，事件處理器通常直接描述「state 要怎麼改」：

```jsx
function handleDelete(id) {
  setItems((items) => items.filter((item) => item.id !== id));
}
```

使用 `useReducer` 時，事件處理器只描述「發生了什麼事」：

```jsx
function handleDelete(id) {
  dispatch({ type: 'item_deleted', id });
}
```

真正的更新規則集中在 reducer：

```jsx
function itemsReducer(items, action) {
  switch (action.type) {
    case 'item_added': {
      return [
        ...items,
        { id: action.id, name: action.name, quantity: 1 },
      ];
    }

    case 'quantity_changed': {
      return items.map((item) =>
        item.id === action.id
          ? { ...item, quantity: action.quantity }
          : item,
      );
    }

    case 'item_deleted': {
      return items.filter((item) => item.id !== action.id);
    }

    case 'cart_cleared': {
      return [];
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
```

元件中再使用：

```jsx
function Cart() {
  const [items, dispatch] = useReducer(itemsReducer, initialItems);

  return (
    <CartList
      items={items}
      onDelete={(id) => dispatch({ type: 'item_deleted', id })}
      onQuantityChange={(id, quantity) =>
        dispatch({ type: 'quantity_changed', id, quantity })
      }
    />
  );
}
```

`action.type` 建議描述已經發生的事件，例如 `item_deleted`、`form_submitted`，而不是 `set_items`。這樣 log 裡看到 action，就能還原使用者做了什麼。

#### reducer 必須保持純粹

reducer 會在 render 流程中執行，因此要遵守三件事：

- 相同的 `state` 與 `action` 必須得到相同結果。
- 不可直接修改原 state；陣列與物件要回傳新參考。
- 不要在 reducer 裡呼叫 API、寫入 localStorage、啟動 timer 或操作 DOM。

```jsx
// 錯誤：修改原陣列，而且 reducer 裡有副作用
function reducer(state, action) {
  state.items.push(action.item);
  saveToServer(state);
  return state;
}

// 正確：只計算下一個 state
function reducer(state, action) {
  return {
    ...state,
    items: [...state.items, action.item],
  };
}
```

API 請求應放在事件處理器或 Effect，請求結果再 dispatch 回 reducer：

```jsx
async function handleSave() {
  dispatch({ type: 'save_started' });

  try {
    const result = await saveToServer(state);
    dispatch({ type: 'save_succeeded', result });
  } catch (error) {
    dispatch({ type: 'save_failed', message: error.message });
  }
}
```

#### reducer 為什麼比較容易測試？

因為它只是普通 JavaScript 函式：

```jsx
const previous = [
  { id: 1, name: 'Keyboard', quantity: 1 },
];

const next = itemsReducer(previous, {
  type: 'quantity_changed',
  id: 1,
  quantity: 2,
});

expect(next[0].quantity).toBe(2);
expect(previous[0].quantity).toBe(1); // 原 state 沒被修改
```

不需要模擬點擊，也能直接確認每一種 action 的轉移規則。

#### useState 與 useReducer 的取捨

| 比較 | `useState` | `useReducer` |
| --- | --- | --- |
| 簡單更新 | 程式碼較少、直覺 | 可能顯得過度設計 |
| 多個相關更新 | handler 容易散落 setter | 規則集中在 reducer |
| 除錯 | 要追蹤是哪個 setter 執行 | 可記錄 action 與前後 state |
| 測試 | 通常透過元件互動測試 | reducer 可當純函式測試 |
| 可讀性 | 簡單時最好讀 | 流程複雜時更容易追蹤 |
| 效能 | 通常沒有本質差異 | 不是自動減少 render 的工具 |

兩者可以混用。例如表單主要資料使用 reducer，而是否開啟說明 Modal 仍使用 `useState`。不要為了「看起來進階」而把所有 state 都塞進同一個 reducer。

**面試回答：** `useState` 適合獨立且更新簡單的狀態。當多個值必須一起轉移、相同規則散落在許多 handler、容易形成不合法組合，或需要獨立測試狀態流程時，我會考慮 `useReducer`。事件處理器透過 action 描述「發生什麼事」，reducer 集中且純粹地計算下一個 state。它的主要價值是可讀性、可追蹤性與可測試性，不是效能魔法。

### 09｜彼此依賴的複雜表單怎麼管理？

**改寫題意：** 欄位是否可填、送出是否可用等條件互相依賴，若都存成 state 容易不同步。

複雜表單最容易犯的錯，不是 state 太少，而是**把所有看得到的 UI 狀態都存成 state**：

```jsx
const [name, setName] = useState('');
const [degree, setDegree] = useState('');
const [currentJob, setCurrentJob] = useState('');
const [lookingForNextJob, setLookingForNextJob] = useState(false);
const [nextJob, setNextJob] = useState('');
const [canEditNextJob, setCanEditNextJob] = useState(false);
const [canSubmit, setCanSubmit] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSubmitted, setIsSubmitted] = useState(false);
```

此時每改一個欄位，都要記得同步其他 state：

```jsx
function handleCurrentJobChange(value) {
  setCurrentJob(value);
  setCanEditNextJob(Boolean(value));
  setCanSubmit(Boolean(name && degree && value));

  if (!value) {
    setLookingForNextJob(false);
    setNextJob('');
  }
}
```

只要某個 handler 漏掉一行，畫面就可能出現矛盾，例如 `currentJob` 已清空，但「下一份工作」仍可輸入；或表單內容無效，送出按鈕卻仍可點。

#### 第一步：區分真正 state 與衍生資料

判斷方式是問：**它是否能完全由其他 state 在 render 時算出來？**

真正需要保存的資料：

```text
form         使用者輸入的欄位
touched      使用者是否碰過欄位，決定何時顯示錯誤
status       editing | submitting | success
serverError  API 回傳、無法從本機欄位推導的錯誤
```

不需要另外保存的衍生資料：

```text
canEditNextJob = currentJob 是否有值
errors         = validate(form) 的結果
isValid        = errors 是否為空
canSubmit      = isValid 且目前沒有送出
```

如果把 `canSubmit` 存成 state，就會出現兩份事實來源：欄位內容說「不能送」，`canSubmit` 卻可能仍是 `true`。直接推導便不需要同步。

#### 第二步：用一個物件保存同一份表單資料

```jsx
const initialState = {
  form: {
    name: '',
    degree: '',
    currentJob: '',
    lookingForNextJob: false,
    nextJob: '',
  },
  touched: {},
  status: 'editing',
  serverError: null,
};
```

這裡沒有保存 `errors`、`canEditNextJob` 或 `canSubmit`，因為它們都能從上面這些資料算出來。

#### 第三步：把欄位依賴規則集中在 reducer

這份表單的規則是：只有填寫「目前工作」後，才能勾選正在找下一份工作；如果清空目前工作，下游欄位也要一起清除。

```jsx
function formReducer(state, action) {
  switch (action.type) {
    case 'field_changed': {
      const nextForm = {
        ...state.form,
        [action.field]: action.value,
      };

      if (action.field === 'currentJob' && !action.value.trim()) {
        nextForm.lookingForNextJob = false;
        nextForm.nextJob = '';
      }

      return {
        ...state,
        form: nextForm,
        status: 'editing',
        serverError: null,
      };
    }

    case 'field_blurred': {
      return {
        ...state,
        touched: {
          ...state.touched,
          [action.field]: true,
        },
      };
    }

    case 'validation_requested': {
      return {
        ...state,
        touched: {
          name: true,
          degree: true,
          currentJob: true,
          nextJob: true,
        },
      };
    }

    case 'submit_started': {
      return {
        ...state,
        status: 'submitting',
        serverError: null,
      };
    }

    case 'submit_succeeded': {
      return { ...state, status: 'success' };
    }

    case 'submit_failed': {
      return {
        ...state,
        status: 'editing',
        serverError: action.message,
      };
    }

    case 'form_reset': {
      return initialState;
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
}
```

「清空 currentJob 時也清除依賴欄位」只定義在一個地方。不論變更來自 input、載入草稿或其他按鈕，都可以重用同一個 action 與轉移規則。

> reducer 裡對 `nextForm` 賦值是安全的，因為它是剛建立的新物件；不能直接寫 `state.form.nextJob = ''`，那會修改舊 state。

#### 第四步：驗證寫成純函式，錯誤在 render 時計算

```jsx
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = '請輸入姓名';
  }

  if (!form.degree) {
    errors.degree = '請選擇學歷';
  }

  if (!form.currentJob.trim()) {
    errors.currentJob = '請輸入目前工作';
  }

  if (form.lookingForNextJob && !form.nextJob.trim()) {
    errors.nextJob = '請輸入期望的下一份工作';
  }

  return errors;
}
```

元件每次 render 都以最新表單推導 UI 狀態：

```jsx
function JobForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { form, touched, status, serverError } = state;

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;
  const canEditNextJob = Boolean(form.currentJob.trim());
  const canSubmit = isValid && status !== 'submitting';

  // ...render form
}
```

這些值不會不同步，因為它們沒有自己的 setter；每次 render 都只從最新 `form` 與 `status` 得到唯一答案。

如果驗證計算真的非常昂貴，才考慮用 `useMemo`；一般表單的字串與欄位檢查通常不需要。

#### 第五步：欄位只 dispatch 發生的事件

```jsx
<input
  value={form.currentJob}
  onChange={(event) =>
    dispatch({
      type: 'field_changed',
      field: 'currentJob',
      value: event.target.value,
    })
  }
  onBlur={() =>
    dispatch({ type: 'field_blurred', field: 'currentJob' })
  }
/>

{touched.currentJob && errors.currentJob && (
  <p role="alert">{errors.currentJob}</p>
)}

<label>
  <input
    type="checkbox"
    checked={form.lookingForNextJob}
    disabled={!canEditNextJob}
    onChange={(event) =>
      dispatch({
        type: 'field_changed',
        field: 'lookingForNextJob',
        value: event.target.checked,
      })
    }
  />
  正在尋找下一份工作
</label>

<input
  value={form.nextJob}
  disabled={!canEditNextJob || !form.lookingForNextJob}
  onChange={(event) =>
    dispatch({
      type: 'field_changed',
      field: 'nextJob',
      value: event.target.value,
    })
  }
/>
```

文字 input 使用 `event.target.value`，checkbox 則要使用 `event.target.checked`；若寫成共用 handler，要記得根據 input type 取得正確值。

#### 第六步：提交副作用留在 handler，reducer 只管理狀態

```jsx
async function handleSubmit(event) {
  event.preventDefault();

  if (!isValid) {
    dispatch({ type: 'validation_requested' });
    return;
  }

  dispatch({ type: 'submit_started' });

  try {
    await saveApplication(form);
    dispatch({ type: 'submit_succeeded' });
  } catch (error) {
    dispatch({
      type: 'submit_failed',
      message: error.message,
    });
  }
}
```

流程會變成明確的狀態機：

```text
editing ──合法送出──▶ submitting ──成功──▶ success
   ▲                         │
   └──────────失敗───────────┘
```

使用單一 `status` 能避免 `isSubmitting=true` 與 `isSubmitted=true` 同時成立。如果還有 `idle`、`savingDraft` 等流程，也應先列出合法狀態與可發生的轉移，再設計 action。

#### touched、client error 與 server error 不要混在一起

- `errors`：由目前欄位推導，例如必填或格式錯誤，不必存入 state。
- `touched`：使用者是否操作過，用來避免畫面一打開就顯示滿版錯誤，需要保存。
- `serverError`：例如 Email 已被使用、伺服器失敗，無法只靠本機欄位推導，需要保存。

驗證規則和「何時顯示錯誤」是兩件事：欄位可以從一開始就無效，但通常等 blur 或第一次 submit 後才顯示訊息。

#### 何時應使用表單函式庫？

`useReducer` 適合管理自訂流程，但不代表所有大型表單都要自己造輪子。出現以下需求時，可以考慮 React Hook Form、Formik 等工具：

- 數十個欄位與巢狀陣列欄位。
- 動態新增／刪除欄位。
- 非同步驗證、欄位級驗證與複雜錯誤管理。
- 需要追蹤 dirty、touched、submit count 等大量 metadata。
- 大型表單對每次輸入造成的 render 很敏感。

即使使用函式庫，原則仍相同：保存最小必要資料、避免矛盾 state、把驗證寫成可測試規則、讓資料依賴有單一來源。

#### 常見錯誤

- 將 `canSubmit`、`isValid`、`filteredOptions` 等可推導值再次存入 state。
- 用 Effect 監聽每個欄位，再同步另一批 state，造成額外 render 與循環依賴。
- 一個使用者操作連續 dispatch 多個欄位 action，卻沒有一個能表達完整意圖的 action。
- 在 reducer 裡直接修改 state、呼叫 API 或顯示通知。
- 清除上游欄位時忘記處理已失效的下游資料。
- 只用 disabled 隱藏不合法操作，提交時卻沒有再次驗證資料。

**面試回答：** 我會先找出表單的最小必要 state，只保存使用者輸入、touched、提交狀態與伺服器錯誤；`errors`、`isValid`、`canSubmit`、欄位是否可用等值在 render 時推導，避免重複與矛盾。欄位依賴和多步狀態轉移集中到純 reducer，以 action 描述使用者行為；API 請求留在事件處理器，結果再 dispatch。這樣驗證、UI 狀態與提交流程都有單一資料來源，也比較容易測試。

## 第二章：副作用

### 10｜頁面越用越慢，可能是 Effect 沒清理嗎？

**改寫題意：** 元件重複掛載後，計時器、事件監聽或訂閱累積，造成重複執行與記憶體洩漏。

**解法：** Effect 建立外部連線時回傳 cleanup；清理內容必須對應建立內容。

```jsx
useEffect(() => {
  const id = setInterval(refresh, 1000);
  return () => clearInterval(id);
}, []);
```

### 11｜在 Effect 裡 fetch，為什麼結果不如預期？

**常見問題：** 依賴漏寫導致舊資料、依賴寫錯造成無限請求、卸載後仍回寫、沒有區分 loading/error/empty。

**解法：** Effect 依賴包含請求所讀取的 reactive values；使用 `AbortController` 取消過期請求，並完整處理狀態。

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function load() {
    const response = await fetch(`/api/users/${userId}`, {
      signal: controller.signal,
    });
    setUser(await response.json());
  }

  load().catch((error) => {
    if (error.name !== 'AbortError') setError(error);
  });
  return () => controller.abort();
}, [userId]);
```

### 12｜空依賴陣列的 Effect 為什麼在開發環境跑兩次？

**核心原因：** React Strict Mode 在開發環境額外執行 setup → cleanup → setup，用來暴露不可逆或缺少清理的副作用；正式環境不會用相同方式重複。

**正確處理：** 不要用 ref 旗標把第二次執行硬擋掉；讓 Effect 可重入並實作正確 cleanup。

**面試回答：** 問清楚是否為 Strict Mode 與開發環境，是回答這題的第一步。

### 13｜快速切換條件時，舊請求蓋掉新請求怎麼辦？

**改寫題意：** 使用者先選 A 再快速選 B，A 的慢請求最後才返回，把 B 的資料覆蓋。

**核心原因：** 網路回應順序不等於發送順序，形成 race condition。

**解法：** cleanup 中取消前一個請求，或用 `ignore`／request id 確保只有最新請求能提交結果。

```jsx
useEffect(() => {
  let ignore = false;
  fetchData(query).then((data) => {
    if (!ignore) setData(data);
  });
  return () => { ignore = true; };
}, [query]);
```

### 14｜這段邏輯真的需要 useEffect 嗎？

**判斷原則：** Effect 用來和 React 外部系統同步，例如網路、DOM API、訂閱、第三方元件。純計算、由 props/state 推導的值、使用者事件，不該為了「資料變了」就放進 Effect。

```jsx
// 不需 Effect + 額外 state
const fullName = `${firstName} ${lastName}`;
```

**面試回答：** 先問「我要同步的外部系統是什麼？」答不出來時通常不需要 Effect。

### 15｜事件後量測 DOM，畫面為什麼閃一下？

**改寫題意：** Effect 在瀏覽器完成繪製後才測量與調整位置，使用者先看到錯誤版面再看到修正結果。

**解法：** 必須在 paint 前完成的 DOM 測量可用 `useLayoutEffect`；一般副作用仍優先使用 `useEffect`，避免阻塞繪製。

```jsx
useLayoutEffect(() => {
  setHeight(ref.current.getBoundingClientRect().height);
}, []);
```

## 第三章：渲染與效能

### 16｜列表用 index 當 key 有什麼風險？

**改寫題意：** 可新增、刪除或排序的列表以索引作 key，編輯狀態、輸入框內容或元件內 state 跑到別列。

**核心原因：** key 是 React 判斷元素身分的依據；順序改變後，同一索引代表了不同資料。

**解法：** 使用資料本身穩定且唯一的 id。只有永不重排、增刪的靜態列表才適合 index。

### 17｜昂貴計算每次 render 都重跑怎麼辦？

**解法順序：** 先確認是否真的慢，再減少工作量或移出 render；純計算且依賴穩定時才用 `useMemo` 快取結果。

```jsx
const visibleItems = useMemo(
  () => expensiveFilter(items, query),
  [items, query],
);
```

**面試回答：** `useMemo` 是效能最佳化提示，不是語意保證；濫用也有比較依賴與保存記憶體的成本。

### 18｜React.memo 應該到處加嗎？

**核心概念：** `memo` 在 props 依 `Object.is` 比較皆相同時略過子元件 render。若 props 每次都是新物件或新函式，memo 幾乎無效。

**適用情境：** 元件 render 昂貴、重渲染頻繁、且 props 多數時間穩定。先用 Profiler 驗證瓶頸。

### 19｜Context 更新為什麼讓很多元件一起 render？

**核心原因：** Provider 的 `value` 改變時，所有讀取該 Context 的 consumer 都會重新渲染；每次建立新物件也算改變。

**解法：** 將不同更新頻率的資料拆成多個 Context；穩定 Provider value；把讀 Context 的薄層與 memoized 展示元件分開。大型外部狀態可考慮 selector 型方案。

```jsx
const value = useMemo(() => ({ user, signOut }), [user, signOut]);
```

### 20｜memo 遇到函式 prop 為什麼失效？

**核心原因：** 元件每次 render 都建立新的函式參考，使 memo 判定 props 改變。

**解法：** 如果子元件確實因函式身分反覆 render 且有成本，使用 `useCallback`；依賴 state 時優先用 updater 減少依賴。

```jsx
const addTodo = useCallback((text) => {
  setTodos((previous) => [...previous, { id: crypto.randomUUID(), text }]);
}, []);
```

**面試回答：** `useCallback` 快取函式身分，不會讓函式本身執行更快。

## 第四章：面試實作

### 21｜判斷 render 與 Effect 的輸出順序

**作答方法：** 先確認 Strict Mode。render 階段的同步程式依上到下執行；commit 後才執行 Effect。更新時先執行舊 Effect 的 cleanup，再執行新 Effect setup；無依賴 Effect 每次 commit 都跑，`[]` 只在掛載週期，`[count]` 在 count 改變時跑。

**面試重點：** 不要只背一串 log；要把 render、commit、cleanup、setup 與 Strict Mode 分層說明。

### 22｜實作待辦清單

**需求拆解：** 新增、切換完成、刪除；可再加入編輯與篩選。

**狀態設計：** `draft` 與 `todos` 足夠；每筆 todo 具穩定 id、text、completed。所有更新都保持 immutable。

```jsx
setTodos((items) => items.map((item) =>
  item.id === id ? { ...item, completed: !item.completed } : item
));
```

**面試重點：** 先完成資料模型與核心互動，再處理樣式、空輸入、鍵盤操作與可存取性。

### 23｜設計可重用的 Tabs 元件

**狀態設計：** controlled 版本接收 `value/onChange`，或 uncontrolled 版本內部保存 active id；內容應由資料驅動，不要硬編每個 tab。

**可存取性：** 使用 `tablist`、`tab`、`tabpanel`、`aria-selected`、正確 id 關聯，並支援方向鍵與焦點移動。

**面試重點：** 先說清楚 API、狀態所有權與鍵盤行為，再開始寫 JSX。

### 24｜現場寫一個資料請求 Custom Hook

**介面範例：** `useFetch(url)` 回傳 `{ data, error, loading, refetch }`。Hook 內處理請求生命週期與取消，但不綁死展示 UI。

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, error, loading: false });
        }
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```

### 25｜實作簡易分頁

**狀態設計：** 保存 `page`；總頁數由 `total/pageSize` 推導。換頁後依 API 契約請求資料，第一頁禁用 Previous，最後一頁禁用 Next。

```jsx
const totalPages = Math.ceil(total / pageSize);
const canPrevious = page > 1;
const canNext = page < totalPages;
```

**面試重點：** 先確認頁碼是 0-based 還是 1-based、後端是否回傳 total、換頁競態與 loading 如何處理。

### 26｜點擊畫面時在該處產生表情符號（第一階段）

**狀態模型：** 每次點擊建立 `{ id, x, y, emoji }`，加入陣列後映射成絕對定位元素。

**座標選擇：** 相對 viewport 用 `clientX/clientY`；相對容器則扣除 `getBoundingClientRect()` 的 left/top。

```jsx
function handleClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  setEmojis((items) => [...items, {
    id: crypto.randomUUID(),
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }]);
}
```

### 27｜表情符號動畫後自動移除（第二階段）

**作法：** 每個項目具有穩定 id；動畫結束可用 `onAnimationEnd` 移除，通常比為每個 emoji 建 timer 更貼近 UI 生命週期。

```jsx
function removeEmoji(id) {
  setEmojis((items) => items.filter((item) => item.id !== id));
}
```

**注意：** 若使用 timeout，要清除計時器；大量高頻事件應考慮上限與效能。

### 28｜讀 API 文件後完成同義字查詢

**解題流程：** 先列出 API 輸入、回傳 schema、錯誤碼與限制；再建立 query/loading/error/results。提交時編碼查詢字串、檢查 `response.ok`，只讓最新請求更新畫面。

**面試重點：** 面試官同時在看閱讀文件、釐清需求、非同步狀態與錯誤處理，不只是在看 fetch 能不能成功。

### 29｜井字遊戲

**狀態模型：** `board` 為 9 格陣列、`isXNext` 表示玩家；winner 是由 board 推導，不必再存一份 state。

**點擊規則：** 已填格或已有贏家時忽略；複製 board 後寫入 X/O，再切換玩家。Reset 回復初始狀態。

```jsx
function handleClick(index) {
  if (board[index] || winner) return;
  setBoard((cells) => cells.map((cell, i) =>
    i === index ? (isXNext ? 'X' : 'O') : cell
  ));
  setIsXNext((value) => !value);
}
```

**面試重點：** 勝負判斷寫成純函式，涵蓋 8 條連線；再處理平手、禁用狀態與鍵盤操作。

### 30｜翻牌配對遊戲

**狀態模型：** 每張卡包含唯一 id、配對值與 matched；另保存目前翻開的卡 id。初始化時建立六對資料並洗牌。

**流程：**

1. 點擊已配對或已翻開卡片時忽略。
2. 第一張只記錄；第二張加入後暫停輸入。
3. 相同則標記 matched；不同則延遲翻回。
4. 清空本回合選擇；全部 matched 時顯示完成。

**常見陷阱：** 用圖案值當 key（成對值會重複）、第三張能在 timeout 前被點擊、重設後舊 timer 繼續更新、洗牌時直接修改 state。

**面試重點：** 先畫有限狀態流程，再實作 UI；這題主要測非同步互動、不可變更新與邊界條件。

## 面試前速記

- state 是 render 當下的快照；依賴前值時使用 updater function。
- state 與 props 都視為唯讀；陣列與物件更新要建立新參考。
- Hook 呼叫順序必須固定，不能放在條件、迴圈或提早 return 之後。
- 能在 render 推導的資料，不要另存 state 再用 Effect 同步。
- Effect 是與外部系統同步；setup 與 cleanup 應成對且可重入。
- key 代表資料身分，不是消除警告用的流水號。
- memo、useMemo、useCallback 都應由實際瓶頸驅動。
- 實作題先講資料模型、狀態所有權、事件流程與邊界條件，再寫畫面。

## 參考來源

- 王介德（Danny Wang），《React求職特訓營：精選30道實戰決勝題×轉職Q&A無痛提升你的前端面試力》。本筆記僅保留主題脈絡，題意與解法均重新表述。
- 作者第 15 屆 iThome 鐵人賽公開系列：30 天 React 練功坊。
- React 官方文件：State、Effects、Hooks Rules、Rendering Lists、memoization。
