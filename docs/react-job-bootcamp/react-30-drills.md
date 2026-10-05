---
sidebar_position: 1
title: React 30 題逐題改寫與解法整理
description: 依《React 求職特訓營》30 題主題整理的逐題學習筆記，含推理、解法、邊界條件與練習。
---

# React 30 題逐題改寫與解法整理

> 這份筆記依[《React 求職特訓營》電子書](https://reading.udn.com/onlineViewer/2BpdfViewer/239868)的 30 題逐頁核對題目情境與推理，再用自己的話整理重點，並以改寫範例延伸練習。建議先遮住解法，預測畫面或程式輸出，再讀原因、實作與自我檢查。這是搭配原書閱讀的筆記，不重刊原書內容。

**閱讀路線：** 第 1～9 題建立「state 是 render 快照」的模型；第 10～15 題練習 Effect 與外部系統同步；第 16～20 題判斷渲染成本與元件身分；第 21～30 題把觀念用於面試實作。每題先回答「資料由誰擁有、何時變動、什麼值可以推導」，再決定要不要用 state、Effect 或 memo。

**與電子書對讀：** 下列頁碼是書頁印出的頁碼，並非閱讀器顯示的 PDF 頁數。讀完一題可回到原書的題目說明、範例與延伸討論，並先自己預測結果。

每題先列「原書逐頁重點」供回書查閱，再列「先想問題，再看解答」供自我測驗；後面是我另寫的推演與延伸。原書穿插的求職 Q&A 與章節空白頁不列入 React 解題摘要。

| 題號 | 書頁 | 題號 | 書頁 | 題號 | 書頁 |
| --- | ---: | --- | ---: | --- | ---: |
| 01 | 4 | 11 | 68 | 21 | 140 |
| 02 | 9 | 12 | 74 | 22 | 148 |
| 03 | 14 | 13 | 78 | 23 | 159 |
| 04 | 22 | 14 | 88 | 24 | 168 |
| 05 | 28 | 15 | 95 | 25 | 177 |
| 06 | 34 | 16 | 106 | 26 | 186 |
| 07 | 39 | 17 | 112 | 27 | 195 |
| 08 | 45 | 18 | 118 | 28 | 205 |
| 09 | 51 | 19 | 125 | 29 | 217 |
| 10 | 63 | 20 | 131 | 30 | 228 |

## 第一章：狀態管理

### 01｜陣列內容改了，畫面為什麼沒更新？

#### 原書逐頁重點（書頁 4–7）

- **4–5 頁：先看現象。** 原例的姓名清單按鈕會加入 Leo；console 裡的陣列已多一筆，畫面卻維持原狀。這提醒我們要分開檢查「資料內容是否變了」與「React 是否安排了下一次 render」。原書先列出元件重新渲染的線索：自己的 state 或 props 變動，以及父元件重新渲染。
- **6–7 頁：追查參考值。** `push` 修改原陣列，交給 setter 的仍是同一個參考。React 對前後 state 做 `Object.is` 比較，因此這次更新沒有產生可辨認的新值。物件直接改欄位也有同樣問題。書中對照複製陣列再設定的寫法，並提醒淺拷貝與深拷貝要依資料結構選用；這道題只需建立新陣列，不能因此推論每次更新都要深拷貝。

#### 先想問題，再看解答

**問題 1：按鈕按下後，為何 console 已看到 Leo，清單卻沒變？**

**解答：** `push` 確實把 Leo 放進原陣列，所以 console 能讀到新內容；但 `setNames(names)` 傳回的是同一個陣列物件。React 比較前後 state 時看到參考相同，可以略過這次更新。資料被改動與畫面重新渲染是兩件事，不能以 console 的內容判定畫面一定更新。

**問題 2：只寫 `setNames([...names, 'Leo'])` 就夠了嗎？何時改用函式更新？**

**解答：** 單次事件新增一筆時，新陣列已能讓 React 辨認更新；若可能連續新增、非同步回呼也會更新，應寫 `setNames(previous => [...previous, 'Leo'])`，讓計算基於佇列中的最新值。兩種寫法都不能先對舊陣列呼叫 `push`。

**問題 3：巢狀物件是否一定要整份深拷貝？**

**解答：** 不必。若只修改某筆人物的姓名，先建立新陣列，再為那筆建立新物件即可；其他未改動的人物可沿用原參考。關鍵是從 state 根節點到被修改欄位的每一層都產生新參考，不能改寫舊快照。

**改寫題意：** 在 state 陣列上直接呼叫 `push`，接著把同一個陣列交回 setter；資料看似增加了，UI 卻沒有重新渲染。

**核心原因：** `push` 會原地修改陣列，物件參考沒有改變。React 以 `Object.is` 比較新舊 state，看到相同參考時可以略過更新。

**解法：** 建立新陣列，不改動舊 state；當更新依賴前一次值時使用函式更新。

```jsx
setNames((previous) => [...previous, 'Leo']);
```

**面試回答：** state 應視為唯讀快照。除了陣列，物件也應以展開、`map`、`filter` 等方式產生新參考。

**再往下一層：** `push` 回傳的是新長度，不是新陣列；`const next = names.push('Leo')` 得到的是數字。即使寫成 `names.push('Leo'); setNames(names)`，舊陣列也已被改動，會讓其他仍持有舊快照的程式看見被竄改的資料。新增用展開或 `concat`、刪除用 `filter`、更新某筆用 `map`。更新時只複製必要層級，並用 React DevTools 確認下一次 render 收到新參考。

**自己試：** 先預測 `setNames(names.push('Leo'))` 會把 state 變成什麼型別，再到 console 印出 `push` 的回傳值驗證。

#### 從一次點擊追到 React 的比較

假設目前 `names` 指向陣列 A，內容是 `['Ann']`。執行 `names.push('Leo')` 後，A 的內容變成兩筆，但變數仍指向 A。接著呼叫 `setNames(names)`，交給 React 的仍是 A；新舊 state 以 `Object.is` 比較是同一個參考。React 可以略過這次由 setter 造成的更新，所以畫面未必跟著變。即使父元件稍後讓子元件意外重渲染，看到已被修改的陣列，也只是把 bug 暫時掩蓋，不能證明原寫法正確。

```jsx
function NameList() {
  const [names, setNames] = useState([{ id: 'ann', name: 'Ann' }]);

  function addName() {
    setNames((previous) => [...previous, {
      id: crypto.randomUUID(), name: 'Leo',
    }]);
  }

  return <>
    <button onClick={addName}>新增 Leo</button>
    <ul>{names.map((person) => <li key={person.id}>{person.name}</li>)}</ul>
  </>;
}
```

這裡的 id 在新增資料時建立，讓重複姓名仍有穩定 key。`[...previous, next]` 建立一個新陣列，但其中既有物件仍共享原參考；若要改某筆物件的欄位，也要為那筆建立新物件。這就是「不可變更新」只複製沿途必要層級的意思。

**自我檢查：** 你能分別寫出新增、刪除、更新第 N 筆的不可變操作嗎？新增用展開、刪除用 `filter`、更新用 `map`，三者共同點都是不改寫舊 state。

### 02｜連續加五次，為什麼只增加一次？

#### 原書逐頁重點（書頁 9–12）

- **9–11 頁：原題連續呼叫五次。** 按一次按鈕，五行都是 `setCount(count + 1)`；即使每行後面都印出 `count`，印到的仍是這次 render 捕捉的舊值。五次不是依次從 0 算到 5，而是都把同一個快照加一後排入更新。
- **12 頁：改用函式更新。** 把五行改成 `setCount(previous => previous + 1)`，每個更新才會接續前一個結果，最後增加 5。重點是 setter 排程下次 render，不能在同一次事件裡期待 `count` 變數即時改寫。

#### 先想問題，再看解答

**問題 1：初始值 0，連續五次 `setCount(count + 1)`，按一次會顯示多少？**

**解答：** 顯示 1。五行在同一次事件中都讀取這次 render 的 `count = 0`，因此排入的是五個「設為 1」。React 批次處理後，最終值仍是 1；這不是 React 漏掉四個呼叫。

**問題 2：怎麼讓按一次真的加 5？**

**解答：** 五次都用 `setCount(previous => previous + 1)`。React 處理更新佇列時，第一個 callback 收到 0，後續依次收到 1、2、3、4，最後算出 5。若需求只是一次加 5，也可直接寫一個函式更新 `previous => previous + 5`；原題用五次是為了測試快照與佇列概念。

**問題 3：為何 setter 後立刻 `console.log(count)` 仍印出 0？**

**解答：** 當前事件處理器封閉的是這次 render 的 `count`，setter 只要求下一次 render 使用新值，不會修改目前作用域裡的常數。需要在點擊當下使用下一個值，就先在 handler 計算局部變數；需要在更新後同步外部系統，再考慮 Effect。

**改寫題意：** 原書在同一個事件中連續執行五次 `setCount(count + 1)`，結果只從 0 變成 1。下文用三次更新作為較短的佇列推演。

**核心原因：** 該次 render 裡的 `count` 是固定快照，三行都計算出 `1`；React 又會批次處理事件內更新。

**解法：** 若下一個值依賴上一個值，傳入 updater function。

```jsx
setCount((value) => value + 1);
setCount((value) => value + 1);
setCount((value) => value + 1);
```

**面試回答：** setter 不是立刻改寫目前變數；它是排入下一次 render 的更新。批次處理與非同步 API 是不同概念。

**排隊推演：** render 時 `count = 0`。三個 `setCount(count + 1)` 各自送出「把值設成 1」，所以結果是 1；三個 updater function 則依序接收 0、1、2，結果是 3。若混用 `setCount(count + 5)` 與 `setCount((n) => n + 1)`，應按佇列順序逐項算，而不是在目前事件裡讀 `count` 猜答案。

**常見誤解：** `console.log(count)` 緊接在 setter 後仍印出舊值，並不表示更新失敗；它讀的是該次 render 的閉包。想在更新後與外部系統同步，可用 Effect；想處理這次點擊，則可直接在事件處理器使用剛算出的下一個值。

#### 逐格計算更新佇列

| 排入的更新 | 進入時值 | 交給下一項的值 |
| --- | ---: | ---: |
| `(n) => n + 1` | 0 | 1 |
| `(n) => n + 1` | 1 | 2 |
| `(n) => n + 1` | 2 | 3 |

相較之下，`setCount(count + 1)` 在事件開始時就先讀 `count=0`，三次都是要求設成 1。批次處理讓 React 避免每行 setter 都立即 render；它不代表三次更新會自動合併成「加三」。updater function 是把**計算規則**交給佇列，React 才能依序傳入前一項算出的值。

**變化題：** 若先 `setCount(count + 5)`，再 `setCount((n) => n + 1)`，從 0 出發結果是 6；若順序反過來，最後那個「設成 5」會覆蓋先前計算，結果是 5。面試時不要只背「函式更新會加三」，要會按順序模擬佇列。

### 03｜非同步資料尚未回來，為什麼畫面先報 undefined？

#### 原書逐頁重點（書頁 14–20）

- **14–17 頁：先釐清執行順序。** 元件用 `useState()` 儲存 API 回傳資料，卻在第一次 render 直接讀取 `user.name` 與 `user.phone`。書中的畫面顯示 API 最終能取得資料，但 render 先因 `undefined` 的屬性存取而失敗；「API 有回資料」無法保證第一次 render 就有資料。
- **18–19 頁：Effect 的時機與兩種防護。** Effect 在 render 完成、DOM 更新後才執行，因此不能替首次 render 提供資料。書中先示範條件渲染，再示範可選鏈 `user?.name`。前者可以明確決定資料未到時顯示什麼，後者適合安全讀取，但畫面可能只是空白。
- **20 頁：以資料形狀設計初始值。** 若欄位結構可預期，也可以給符合結構的初始物件。選用初始物件、條件渲染或可選鏈，取決於「載入中」是否應與「資料為空」有不同呈現。

#### 先想問題，再看解答

**問題 1：請求最後有成功，為何第一次進畫面仍會因 `user.name` 崩潰？**

**解答：** React 要先執行元件函式，算出第一個畫面，才會在 commit 後執行 Effect。`useState()` 的初值是 `undefined`，第一次 render 讀 `user.name` 就已拋錯；之後的 API 結果不能回頭讓這次 render 成功。

**問題 2：條件渲染、可選鏈、初始物件要怎麼選？**

**解答：** 若「載入中」要有明確畫面，先用條件渲染，例如 `if (!user) return <Loading />`。可選鏈適合單一選填欄位，卻可能把未載入和缺欄位都顯示成空白。已知資料結構且空值有意義時，才用完整的初始物件；別靠假資料掩蓋請求狀態。

**問題 3：API 失敗或沒有 `phone` 時該怎麼辦？**

**解答：** 將 loading、error、成功但缺欄位視為不同情況。請求失敗要顯示錯誤或重試；成功資料中的選填電話可顯示「未提供」。只加 `user?.phone` 雖避免拋錯，仍不足以交代使用者目前發生什麼事。

**先對照原書情境：** 元件以 `useState()` 建立使用者資料，並在 Effect 中向 API 取得使用者；但第一次 render 已經讀取 `user.name`、`user.phone`。請求尚未完成，`user` 仍是 `undefined`，畫面便先出錯。應先看錯誤訊息中的動詞：讀取 `undefined.name` 通常是 `Cannot read properties of undefined`；對不存在的層級賦值才可能是 `Cannot set properties of undefined`。兩者都涉及資料形狀，但出錯操作不同。

```jsx
// 第一次 render 就會讀取 undefined.name
const [user, setUser] = useState();
useEffect(() => {
  fetch('/api/user/1').then((r) => r.json()).then(setUser);
}, []);
return <p>{user.name}</p>;
```

要先選定資料的生命週期：`null` 表示尚未有使用者，載入中先顯示 loading；成功後才讀 `user.name`，失敗時顯示錯誤。若 API 可能缺少 `phone`，再對該**選填欄位**使用預設值。只靠 `user?.name` 雖可避免崩潰，卻可能把載入中與真正缺資料混成同一種空白畫面。

**以下是延伸情境：** 若資料已存在，但元件還要讀取 `profile.contact.email`，則需要檢查每層結構，以及更新巢狀 state 時是否不小心把資料刪掉。這與原書的非同步首次 render 問題相關，但不是同一個出錯時機。

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

#### 原書逐頁重點（書頁 22–26）

- **22–23 頁：問題來自重複程式。** 原例把 Name、Email、Age 分成三個 state 與三個事件處理器。新增欄位時，狀態與 handler 都要跟著增加；題目要求保留各 input 的結構，找出更容易擴充的資料處理方式。
- **24–25 頁：合併 state 還不夠。** 把三個值放入物件只是第一步。如果每個欄位仍各寫一個 handler，重複並未消失。書中改用 input 的 `name` 當欄位鍵，由一個共用 handler 讀取 `name`、`value`，並展開前一個物件狀態。
- **26 頁：動態欄位名稱是關鍵。** `[name]: value` 是計算屬性名稱；少了中括號就會更新名為 `name` 的固定欄位。若欄位間存在複雜依賴，書中也提到可再考慮 `useReducer`，不必讓單一 handler 承擔所有業務規則。

#### 先想問題，再看解答

**問題 1：把三個欄位放進同一個物件 state，為何還不算解完？**

**解答：** 若 Name、Email、Age 仍各有一個 handler，新增欄位還是要複製一套事件邏輯。原題要減少的是重複的狀態更新流程；讓每個 input 的 `name` 對應資料鍵，再由共用 handler 處理，擴充欄位時才不必再寫同型函式。

**問題 2：為何更新時要寫 `{ ...previous, [name]: value }`？**

**解答：** 展開 `previous` 是保留其他欄位；`[name]` 會用事件讀到的欄位名作為鍵。若寫成 `{ name: value }`，會產生字面上的 `name` 欄位，並丟掉其他值。Age 從 input 讀到的是字串，需要依驗證規則再轉為數字。

**問題 3：checkbox 或連動欄位也能全交給這個 handler 嗎？**

**解答：** checkbox 通常應讀 `checked`，不是 `value`。若一欄變更會清空另一欄、影響送出資格，單純的欄位覆寫還不夠；應把關聯規則明確寫成一次狀態轉移，第 9 題的 reducer 就是這類情境。

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

**實際表單還要處理不同 input 型別：** checkbox 讀 `checked`，一般文字框讀 `value`；數字欄位從 DOM 讀到的也先是字串，須按需求轉型與驗證。`name` 必須對應資料模型中的鍵，不能任由未知欄位加入物件。欄位雖多但彼此獨立時，分開的 state 也完全合理；若某些欄位一變就要重設下游欄位，請接著讀第 9 題的 reducer 設計。

#### 把「欄位多」與「狀態複雜」分開

十個彼此獨立的文字欄位，可能只需要一個物件與共用 change handler；兩個互相約束的欄位，反而可能需要明確的狀態轉移。不要以欄位數量作為使用 `useReducer` 的唯一門檻。先畫出欄位關係：誰改變會使誰失效？哪幾個值必須一起提交？哪些只是從現有值推導的驗證結果？

```jsx
function handleChange(event) {
  const { name, type, value, checked } = event.target;
  if (!['name', 'email', 'subscribe'].includes(name)) return;
  setForm((current) => ({
    ...current,
    [name]: type === 'checkbox' ? checked : value,
  }));
}
```

例如 `subscribe` 是布林值，不能把 checkbox 的 `value` 字串誤存進 state。送出前仍應驗證 email 格式與必填欄位；讓輸入框 `disabled` 並不等於資料保證合法。若某欄位是 `firstName + lastName` 得出的全名，應在 render 推導，不必再做一個 state 欄位並用 Effect 同步。

### 05｜條件渲染為什麼冒出數字 0？

#### 原書逐頁重點（書頁 28–32）

- **28–29 頁：從延遲載入的清單觀察。** 原例先以空陣列作為好友資料，稍後才模擬取得清單；清單區使用 `friends.length && ...`。在資料回來前，空狀態訊息雖出現，畫面卻同時多了 `0`。
- **30–31 頁：分清 JavaScript 與 React 的工作。** `&&` 在左側為 falsy 時會回傳左側原值，所以長度 0 的結果是數字 0。React 會略過 `false`、`null`、`undefined` 等作為子節點的值，但會顯示數字 0。書中用 HTML 與 React 的渲染差異帶出這個陷阱。
- **32 頁：讓條件明確成為布林值。** 可寫 `friends.length > 0`，或用雙重否定轉換；若需要在兩種畫面間擇一，三元運算子更易讀。選擇依需求，不是把每個 `&&` 都換掉。

#### 先想問題，再看解答

**問題 1：`{friends.length && <List />}` 在空陣列時到底算出什麼？**

**解答：** `friends.length` 是數字 0。JavaScript 的 `&&` 遇到 falsy 左值會直接回傳左值，因此整個 JSX 表達式得到 0。React 會把數字 0 當文字顯示；這不是陣列自己被印到畫面上。

**問題 2：為何 `{isVisible && <Panel />}` 的 `false` 卻沒有被顯示？**

**解答：** 左值為布林 `false` 時，`&&` 回傳的也是 `false`，React 會略過這種子節點值。兩個寫法差在左值的型別，不能只用「都為 falsy」來預測渲染結果。

**問題 3：怎麼修，空清單還要顯示提示時又怎麼寫？**

**解答：** 只要控制有無列表，可寫 `friends.length > 0 && <List />`；若空清單應顯示「沒有好友」，用三元運算子在列表與空狀態間擇一。這樣條件本身是明確的布林判斷，也讓產品畫面有完整描述。

**改寫題意：** 使用 `{items.length && <List />}`，空陣列時畫面顯示 `0`。

**核心原因：** `&&` 回傳第一個 falsy 值；`items.length` 為 0，而 React 會渲染數字 0，只會忽略 `false`、`null`、`undefined`。

**解法：** 明確轉成布林值。

```jsx
{items.length > 0 && <List items={items} />}
```

`&&` 是 JavaScript 表達式，不是 React 專用語法：`0 && <List />` 的結果就是數字 `0`。React 忽略 `false`、`null`、`undefined`，但會渲染數字。當左側可能是數字、字串或物件時，先寫出明確條件；若還有空狀態畫面，可使用三元運算子：

```jsx
{items.length > 0 ? <List items={items} /> : <p>目前沒有項目</p>}
```

**自己試：** 比較 `{0 && <p>內容</p>}`、`{Boolean(0) && <p>內容</p>}` 和 `{0 > 0 && <p>內容</p>}` 的畫面差異。

#### 為什麼只在某些條件出現「多餘的 0」

JavaScript 的 `&&` 不會一律回傳布林值；左側為 falsy 時，直接回傳左側原值。`items.length` 為 0，整個表達式結果便是數字 0，而 React 會渲染數字。若左側是 `false`，React 會忽略它，因此 `{isVisible && <Panel />}` 看起來正常。

| JSX 表達式 | 左側值 | `&&` 的結果 | React 畫面 |
| --- | --- | --- | --- |
| `{items.length && <List />}` | `0` | `0` | 顯示 0 |
| `{items.length > 0 && <List />}` | `false` | `false` | 不顯示內容 |
| `{isVisible && <Panel />}` | `false` | `false` | 不顯示內容 |

這題不是 React 在空陣列時多印一個計數，而是 JavaScript 表達式先算出了 0。若需求需要空狀態訊息，三元運算子更清楚；若只是選擇性顯示，明確寫布林條件即可。不要靠 CSS 隱藏那個 0，因為資料與 JSX 邏輯仍是錯的。

### 06｜為什麼 Hook 數量前後不一致？

#### 原書逐頁重點（書頁 34–38）

- **34–35 頁：錯誤出現在登入狀態改變後。** 原例先檢查登入身分，登入後才在條件分支內呼叫額外的 Effect；首次 render 看似正常，下一次 render 的 Hook 數量變了，才出現 `Rendered more hooks than during the previous render`。
- **36–38 頁：順序比名稱重要。** React 依呼叫順序對應各 Hook 的狀態，不能讓條件決定「要不要呼叫 Hook」。書中列出頂層呼叫與僅在 React 元件或自訂 Hook 中呼叫的規則，並將條件移到 Effect 裡，讓每次 render 都走過相同的 Hook 呼叫位置。

#### 先想問題，再看解答

**問題 1：為何登入前正常，登入後才報 Hook 數量不同？**

**解答：** 初次 render 時登入條件為假，條件分支中的 Hook 沒被呼叫；登入後同一個元件多呼叫一個 Hook。React 用呼叫順序配對各 Hook 的狀態，第二次的順序與第一次不同，於是報錯。錯誤通常在條件切換那次 render 才浮現。

**問題 2：能否在 `if (isLoggedIn)` 裡呼叫 `useEffect`？**

**解答：** 一般 Hook 不能這樣呼叫。應在元件頂層每次都呼叫 `useEffect`，再於 callback 裡寫 `if (!isLoggedIn) return`，並把登入狀態列入依賴。如此 Hook 的位置固定，副作用仍可依條件執行。

**問題 3：若登入與未登入要用完全不同的 Hook 組合呢？**

**解答：** 將兩種畫面拆成不同元件，由父元件條件渲染 `<LoggedInView />` 或 `<LoggedOutView />`。每個元件自己的 Hook 順序保持固定；切換元件會重新掛載，須留意其內部 state 是否應重設。

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

#### 原書逐頁重點（書頁 39–44）

- **39–41 頁：先對照父子元件。** 父元件按模式傳入不同的 input 初始值，畫面上的「預設值」文字已從 50 變成 100，但子元件輸入框仍顯示 50。子元件把 prop 傳給 `useState` 作初始值，因而產生「prop 更新」與「內部 state 保留」的差異。
- **42–44 頁：初始值只在掛載時採用。** 重新 render 會讀到新 prop，卻不會再用它初始化既有 state。書中提出兩條路：確實需要同步時，在子元件的 Effect 根據 prop 更新 state；若切換代表一個全新實體，改變 `key` 使子元件重新掛載。後者會重設該元件的所有內部 state，須確認符合使用者預期。

#### 先想問題，再看解答

**問題 1：父元件顯示預設值已從 50 變 100，為何 input 仍是 50？**

**解答：** 子元件在初次掛載時用 prop 的 50 初始化了內部 state。之後父元件改傳 100，子元件會重新 render 並收到新 prop，但 `useState(initialValue)` 不會重新初始化既有 state；受控 input 仍讀內部 state 的 50。

**問題 2：什麼時候用 Effect 同步，什麼時候用 `key` 重掛載？**

**解答：** 如果同一個輸入框必須持續存在，只是某個外部值確實要覆寫其內容，可在依賴該 prop 的 Effect 裡更新 state，但要定義何時允許覆蓋使用者正在編輯的文字。若 mode 切換代表一張全新表單，可讓 `key` 隨 mode 變化，使 React 建立新元件；它會連驗證訊息、游標相關 state 一起重設。

**問題 3：能否根本不複製 prop 到 state？**

**解答：** 若 input 完全由父元件控制，直接把 `value` 與 `onChange` 放在父元件管理，子元件不必保存 prop 的副本。先確認資料的唯一擁有者，再決定是否真的需要本地編輯狀態，能減少同步規則。

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

#### 原書逐頁重點（書頁 45–50）

- **45–47 頁：先找出真正的效能問題。** 原例是含 email、密碼的表單；每輸入一字，整個元件的 render 記錄都增加。書中先指出 state 或 props 變動、父元件重渲染都可能讓元件重跑，再針對「只在提交時使用輸入內容」這個條件考慮其他儲存方式。
- **48–50 頁：用 ref 保存不驅動畫面的值。** `useRef` 可跨 render 保留可變值，修改 `.current` 不會觸發 render。書中把輸入資料改放在 ref，減少打字時的重渲染；但若畫面上的即時驗證、計數或按鈕狀態依賴輸入值，就需要 state 或其他能驅動畫面的方式，不能只為了減少 render 一律換成 ref。

#### 先想問題，再看解答

**問題 1：輸入 email 一個字，為何整個表單元件都重新執行？**

**解答：** 原例的 email 與 password 存在 `useState`。每次 `onChange` 呼叫 setter 都會要求元件以新 state 重新 render；元件函式內的 log 與其他計算也會跟著執行。這是 state 驅動畫面的正常機制，只有成本真的成問題時才需要優化。

**問題 2：若資料只在送出時使用，ref 為何適合？**

**解答：** ref 的 `.current` 能保存最新輸入而不要求 React 重新 render；提交時再讀取它即可。資料既不會影響即時畫面，也就不一定要進 state。但更簡單的非受控表單也可在提交時從 `FormData` 讀值，應依題目限制選擇。

**問題 3：什麼情況不該把輸入值改放 ref？**

**解答：** 例如要邊輸入邊顯示錯誤、限制按鈕是否可按、即時預覽輸入文字，畫面依賴值的變化，就應用 state 或能通知畫面的機制。ref 值變了不會觸發 render，否則畫面容易落後於資料。

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

#### 原書逐頁重點（書頁 51–62）

- **51–53 頁：題目是連動規則。** Name、Degree、Current Job、Next Job 等欄位彼此影響：未填現職時，下個職位不可用；只有條件都有效時才能提交。畫面需求不只是把欄位值存起來，還要保持欄位間的一致性。
- **54–56 頁：先展示物件 state 加 Effect 的代價。** 書中把各區資料放進一個物件，每次修改區塊都展開前一個 state，再用 Effect 檢查能否提交。這可運作，但轉移規則分散在多個 updater 與 Effect，閱讀與維護變得費力。
- **57–62 頁：讓 reducer 集中處理轉移。** 書中用不同 action 表示個人資料、學歷、工作資料的更新，並在 reducer 完成欄位有效性與提交條件的計算；元件只負責 dispatch 事件。重點不是 `useReducer` 一定比較快，而是把互相關聯的狀態更新放在同一個可檢查的位置。

#### 先想問題，再看解答

**問題 1：這題與第 4 題的「一個 handler 管欄位」有何不同？**

**解答：** 第 4 題主要處理同型輸入欄位的重複碼；這題有「現職有效才允許填下個職位」「個人、學歷、工作都符合條件才可提交」等跨欄位規則。更新一個欄位可能使另一欄失效，因此要管理整個狀態轉移，而不只是把 `[name]` 設成新值。

**問題 2：用多個 setter 加 Effect 計算 `isSubmitEnabled` 有何代價？**

**解答：** 先更新欄位、render，Effect 再檢查條件並設定另一個 state，會產生額外更新；規則也分散在 handler 與 Effect 中，難以追查哪個動作造成結果。若提交資格能完全由欄位值推導，可直接在 render 計算；若多個欄位必須在同一事件一起調整，可用 reducer 集中處理。

**問題 3：reducer 應接收什麼，輸出什麼？**

**解答：** 它接收目前 state 與描述事件的 action，例如「更新工作資料」，回傳包含更新後欄位及相關有效性的全新 state。reducer 應保持純函式，不在裡面發請求或改寫原物件；這樣相同輸入會有可預測的結果，也較容易逐個 action 驗證。

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

#### 原書逐頁重點（書頁 63–67）

- **63–65 頁：從切換頁面觀察累積。** 倒數頁面掛載時建立 `setInterval`，切回 Home 再回來，console 的 tick 越來越密集；計時器並未因元件離開畫面自動停止。若計時器回呼改成網路請求，重複工作會更難察覺。
- **66–67 頁：Effect 要成對設置與清理。** 在 Effect 中保留 interval ID，回傳 cleanup 呼叫 `clearInterval`。書中說明 cleanup 在卸載或 Effect 重執行前執行，並延伸到事件監聽、WebSocket 等訂閱型資源；排查時應看資源是否留下，而非只看一次 render 是否正常。

#### 先想問題，再看解答

**問題 1：為何每次離開 Timer 再回來，tick 訊息會變多？**

**解答：** 每次掛載都建立新的 interval；原本的 interval 沒被停止，切頁後仍在執行。回來一次就多一個計時器，console 的輸出頻率持續增加。這也可能造成背景請求、耗電與對已卸載元件的更新嘗試。

**問題 2：cleanup 應寫在哪裡，何時執行？**

**解答：** Effect 中建立 interval 後，回傳函式 `() => clearInterval(id)`。元件卸載會清理；依賴變化導致 Effect 重跑時，也會先清理上一輪再建立下一輪。建立與清除使用同一個 id，才能確實釋放資源。

**問題 3：空依賴陣列是否已保證只會有一個 interval？**

**解答：** 它只表示同一次掛載期間，依賴不變時不重跑該 Effect；重新掛載仍會再建立。沒有 cleanup，頁面切換或開發模式的 StrictMode 檢查仍能暴露重複資源問題。

**先對照原書情境：** 倒數計時頁面使用 `setInterval`。切到別頁再回來多次後，畫面看似正常，但 console 的 tick 輸出數量越來越多。原因是每次掛載都建立新 interval，舊 interval 在卸載後仍持續執行。這個症狀比「頁面變慢」更精確：外部工作被重複建立且沒有釋放。

```jsx
function Countdown({ initialSeconds = 10 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>{seconds === 0 ? "Time's up!" : `${seconds} 秒`}</p>;
}
```

這個最小版在到 0 後仍會定時醒來，只是不再改變數值。若要求到 0 完全停止，可把 interval 的建立條件放在 Effect 中，讓 `seconds === 0` 時先清理上一輪 interval，再不建立新的 interval；或改用一次性的 `setTimeout`。不要在 Effect 中直接讀 `seconds` 卻把它從依賴陣列拿掉，那會讓 callback 一直看到建立時的舊快照。

**延伸情境：** 若開啟、關閉彈窗五次後，一次按鍵觸發五次處理器，也要檢查是否有未移除的事件監聽。

Effect 的工作是讓元件與外部系統同步。`addEventListener`、`setInterval`、WebSocket 訂閱都在 React 之外持續存在。元件重新 render 不會自動替你移除它們。每次依賴改變時，React 會先執行上次 Effect 的 cleanup，再執行新的 setup；卸載時也會 cleanup。

```jsx
useEffect(() => {
  function onKeyDown(event) {
    if (event.key === 'Escape') onClose();
  }

  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [onClose]);
```

建立和移除必須指向**同一個函式參考**。若每次更新都新增 listener，卻只在卸載時試圖移除另一個函式，事件仍會累積。計時器也是同樣原則：

```jsx
useEffect(() => {
  const id = setInterval(refresh, 1000);
  return () => clearInterval(id);
}, [refresh]);
```

`refresh` 若由元件內建立且每次 render 身分都不同，interval 也會每次重建；可以把相關邏輯移入 Effect，或在確有需要時穩定函式身分。不要為了消掉依賴警告而刪除依賴。

**檢查方式：** 用 DevTools 看 listener／計時器數量，反覆掛載與卸載元件，確認每次 setup 都有對應 cleanup。慢不一定等於記憶體洩漏；也可能是昂貴 render 或大量 DOM，先量測再下結論。

### 11｜在 Effect 裡 fetch，為什麼結果不如預期？

#### 原書逐頁重點（書頁 68–73）

- **68–70 頁：原例同時有兩個現象。** 輸入 User ID 後按 Fetch，名稱仍顯示 `undefined`；載入頁面時甚至可能先取回整份使用者清單。原因要分開看：畫面初始資料為空，以及 Effect 的空依賴陣列只在初次掛載時執行，此時 ID 還是空字串，請求 URL 指向清單端點。
- **71–73 頁：依真正的輸入觸發請求。** 書中把 ID 放入依賴陣列，並在 ID 未填時提前離開 Effect，使請求跟著 ID 變動。這解決「按鈕更新 ID 後不再請求」；實務上還要處理載入、失敗與舊請求晚回來覆蓋新資料，後者在第 13 題展開。

#### 先想問題，再看解答

**問題 1：使用者輸入 ID 後按 Fetch，為何名稱仍顯示 `undefined`？**

**解答：** 原例的 Effect 依賴是空陣列，只在初次掛載時執行；那時 `userId` 還是空字串。按鈕雖更新 ID，Effect 不會因此重跑，`userData` 沒換成指定使用者的資料，畫面讀到的 `name` 因而不符合預期。

**問題 2：為何 console 曾看到一整份使用者陣列？**

**解答：** 初次請求的 URL 結尾沒有使用者 ID，API 將它視為取得所有使用者的端點。陣列沒有 `name` 屬性，因此直接讀 `userData.name` 得到 `undefined`。這要從請求 URL 與回應形狀一起查，不能只看 JSX。

**問題 3：把 `userId` 放入依賴陣列後，還需要什麼守衛？**

**解答：** 在 ID 為空時直接離開 Effect，避免首次載入就請求清單端點；對載入與錯誤另外顯示狀態。若多次快速切換 ID，舊回應還可能晚到並覆蓋新資料，須接第 13 題處理。

**先對照原書情境：** 使用者輸入 ID 後按「Fetch User」，畫面卻顯示 `User Name: undefined`。這裡有兩個獨立問題。初次 render 時 `userId` 是空字串，Effect 卻立刻請求 `/users/`；API 可能回傳**陣列**，陣列是真值，因此 `{userData && ...}` 會進入畫面，但 `userData.name` 不存在。另一方面，依賴陣列是 `[]`，之後輸入 ID 也不會再依新 ID 請求。

要先決定「輸入即查」還是「按鈕才查」。若是按鈕才查，`draftId` 是輸入框草稿，`requestedId` 是已提交的查詢；Effect 依 `requestedId` 發送請求：

```jsx
const [draftId, setDraftId] = useState('');
const [requestedId, setRequestedId] = useState('');

<input value={draftId} onChange={(event) => setDraftId(event.target.value)} />
<button onClick={() => setRequestedId(draftId.trim())}>查詢</button>

useEffect(() => {
  if (!requestedId) return;
  // 使用 requestedId 發送請求，並處理 loading／error／結果
}, [requestedId]);
```

若業務需求是輸入即查，可以直接依 `userId` 同步，再考慮 debounce。兩種互動不應混成「按鈕看似查詢，但請求其實在掛載時就送出」。

**延伸情境：** 畫面顯示使用者 A，切換到 B 後卻仍顯示 A；或請求一直重送。先分清楚三件事：何時發送、哪個結果可以採用、畫面目前是哪種狀態。

Effect 讀取了 `userId`，它就必須是依賴。漏掉會固定使用舊值；把每次 render 都建立的新物件放進依賴，則可能反覆請求。讀取 JSON 前也要檢查 HTTP 狀態，因為 `fetch` 收到 404/500 不會自動 reject。

```jsx
const [user, setUser] = useState(null);
const [status, setStatus] = useState('idle');
const [error, setError] = useState(null);

useEffect(() => {
  const controller = new AbortController();

  async function load() {
    setStatus('loading');
    setError(null);
    setUser(null); // 避免切換 B 時暫時顯示 A

    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const nextUser = await response.json();
      if (!controller.signal.aborted) {
        setUser(nextUser);
        setStatus('success');
      }
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause);
        setStatus('error');
      }
    }
  }

  load();
  return () => controller.abort();
}, [userId]);
```

畫面至少要區分 loading、error、成功但空資料，以及成功且有資料。`AbortController` 可取消支援 signal 的網路操作；若資料來源不支援取消，改用第 13 題的 `ignore` 旗標阻止舊結果寫入。實務上，若專案已有路由 loader 或資料請求函式庫，應優先使用它處理快取、重試及去重，不必每個元件重寫一遍。

**自問：** `userId` 切換後，舊資料要保留並標示「更新中」，還是立即清空？這是產品行為選擇，應明確設計。

### 12｜空依賴陣列的 Effect 為什麼在開發環境跑兩次？

#### 原書逐頁重點（書頁 74–77）

- **74–75 頁：觀察到的是開發模式的重複執行。** 原例空依賴陣列的 Effect 增加計數，畫面卻顯示兩次。書中帶讀者檢查應用入口的 `StrictMode`，而不是先認定依賴陣列寫錯。
- **76–77 頁：理解檢查目的。** StrictMode 在開發過程額外執行 setup 與 cleanup，用來暴露不對稱的副作用。書中提到移除 StrictMode 可讓示例計數回到一次，但更重要的是確保 Effect 能正確清理，使元件經過重複掛載檢查後仍維持正確行為。

#### 先想問題，再看解答

**問題 1：`useEffect(..., [])` 為何在本地開發時像執行兩次？**

**解答：** 原例入口使用 StrictMode。開發環境會額外執行 Effect 的設置與清理流程，檢查副作用是否能安全重來；空依賴陣列並不表示「開發期間絕對只呼叫一次」。先核對入口與執行環境，再排查是否也有真正重複掛載。

**問題 2：直接移除 StrictMode 是完整修法嗎？**

**解答：** 移除後示例數字可能只增加一次，但若 Effect 會訂閱、開計時器或建立連線，仍必須寫對應 cleanup。否則元件真正卸載再掛載時依然會漏資源。StrictMode 是協助暴露問題的檢查，不能取代正確的 Effect 設計。

**問題 3：若 Effect 用於「按一下購買」這種操作，重跑怎麼辦？**

**解答：** 使用者明確點擊造成的動作應放在事件處理器，別靠掛載 Effect 來代表一次購買。若是頁面載入時必須向外部系統同步，則要讓同步可清理或具備重複執行時仍安全的處理方式。

`[]` 的意思是「這個 Effect 不讀取會隨 render 改變的 reactive value」，不是「整個程式生命週期只執行一次」。在根節點啟用 Strict Mode 的開發環境，React 會額外做一次 setup → cleanup → setup，檢查元件能否正確重新連線。

```jsx
useEffect(() => {
  const connection = connect(roomId);
  return () => connection.disconnect();
}, [roomId]);
```

這個例子在開發環境可能看到連線、斷線、再連線；使用者最後仍只有一條有效連線。若看到兩條持續存在的連線，問題是 cleanup 缺漏。`useRef` 旗標強迫跳過第二次 setup，會把問題藏起來，真正在頁面間來回切換時仍可能出錯。

另外要分辨 **render 函式被額外呼叫** 與 **Effect 被額外 setup**。render 應保持純粹，不在 render 中連線、改 DOM 或發送請求。若某個操作本來只應由點擊觸發，例如付款或送出表單，就放在事件處理器，不應放在掛載 Effect。

**面試回答順序：** 確認 Strict Mode 與開發環境 → 畫出 setup/cleanup 時序 → 檢查資源是否成對釋放 → 再判斷副作用是否放錯位置。

#### 把「跑兩次」拆成可觀察的兩種現象

如果 `console.log` 寫在元件函式最上方，你觀察的是 **render 被呼叫**；若 log 寫在 Effect 裡，觀察的是 **Effect 的 setup**。這兩個階段不等價。render 只是計算下一個畫面，React 甚至可能放棄這次計算；Effect 只會跟已提交的畫面同步。因此，不能看到 render log 兩次，就推論已建立兩條訂閱。

以一個訂閱為例，開發環境的驗證序列可以寫成：

| 步驟 | React 做的事 | 外部系統應留下什麼 |
| --- | --- | --- |
| 1 | setup：訂閱事件 | 1 個訂閱 |
| 2 | cleanup：取消剛才的訂閱 | 0 個訂閱 |
| 3 | setup：重新訂閱 | 1 個訂閱 |

若第 2 步沒有對稱地移除第 1 步建立的**同一個** listener，第三步後就會留下 2 個。把 Strict Mode 關掉只會少一次測試；頁面實際卸載、重新掛載時，漏清理仍會出現。開發時也可能因熱更新再次執行 Effect，所以應驗證資源的最終數量，而非只數 log 次數。

**動手驗證：** 在 Effect 的 setup/cleanup 各印一個不同標記；開關 Strict Mode、切換頁面，再觀察序列。最後回答「每次可見畫面究竟有幾條有效連線」，比回答「印了幾行 log」更接近這題要測的觀念。

#### 把缺少 cleanup 的程式真正修好

```jsx
useEffect(() => {
  function handleResize() {
    setWidth(window.innerWidth);
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化畫面
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

setup 中建立的是 `handleResize`，cleanup 必須移除同一個函式。若 cleanup 寫 `removeEventListener('resize', () => setWidth(window.innerWidth))`，看起來邏輯相同，實際上卻是另一個函式物件，原 listener 不會被移除。React 額外執行 Effect 正是為了讓這種問題在開發時更容易暴露。

### 13｜快速切換條件時，舊請求蓋掉新請求怎麼辦？

#### 原書逐頁重點（書頁 78–87）

- **78–80 頁：重現結果錯置。** 下拉選單依 userId 取使用者，快速從 User 1 切到 User 2、User 3 後，最後畫面可能停在較早請求的姓名。依賴陣列已包含 userId，因此問題不是「沒有重新請求」，而是各請求完成順序與發送順序不同。
- **81–83 頁：阻止過期結果更新畫面。** 書中先用 Effect cleanup 將前一輪請求標記為失效；舊請求即使完成，也不再呼叫 `setUserData`。這修正顯示錯誤，但請求本身仍可能持續。
- **84–86 頁：取消不再需要的請求。** 再用 `AbortController` 將 signal 傳給 fetch，依賴值改變或卸載時呼叫 `abort()`。書中利用瀏覽器 Network 面板觀察舊請求被取消。錯誤處理須辨識取消與真正的失敗。
- **87 頁：回到產品需求。** 若有快取、重試、重複請求消除等需求，可用成熟資料請求工具；核心判斷仍是「哪一個請求的結果現在有資格更新畫面」。

#### 先想問題，再看解答

**問題 1：依賴陣列已有 `userId`，為何最後仍顯示別人的名字？**

**解答：** 每個 ID 的請求都正確送出了，但網路回覆沒有保證按送出順序完成。若 User 1 的慢請求最後才回來，它可能在 User 3 的新結果之後呼叫 `setUserData`，讓畫面回到舊人。這是請求競態，不是依賴沒有生效。

**問題 2：忽略過期回應和取消請求差在哪裡？**

**解答：** cleanup 中設失效旗標，舊回應即使完成也不更新 state，能保證畫面正確；但網路工作仍可能繼續。`AbortController` 在 cleanup 呼叫 `abort()`，可以中止尚未完成的 fetch；它仍需處理取消造成的例外，並確保只有目前請求能顯示資料。

**問題 3：快速切到 User 3 時，畫面能先保留 User 1 的名字嗎？**

**解答：** 這是產品選擇，但必須標示清楚。可清空舊資料並顯示 loading，或保留舊資料但顯示「正在載入 User 3」，避免使用者把舊姓名誤認為新 ID 的結果。競態修正只解決最終結果，不會自動決定過渡畫面。

**先對照原書情境：** 下拉選單更新 `userId`，Effect 隨之請求該使用者。快速從 ID 1 切到 ID 2，畫面卻可能顯示 ID 1。這不一定是依賴陣列寫錯；兩個請求都合法發出，只是較早發出的請求較晚完成。

**時序推演：** 先選 A，發出請求 A；立刻選 B，發出請求 B；B 在 100 ms 回來，A 在 900 ms 回來。如果兩個 `.then` 都呼叫 `setData`，畫面最後顯示 A。發送順序與完成順序沒有保證一致。

關鍵不只是取消請求，而是**讓過期結果失去更新 UI 的資格**。Effect cleanup 正好代表目前這次同步已失效：

```jsx
useEffect(() => {
  let ignore = false;
  setData(null);

  fetchData(query).then((data) => {
    if (!ignore) setData(data);
  });

  return () => {
    ignore = true;
  };
}, [query]);
```

這個旗標是每次 Effect 各自擁有的區域變數。切到 B 時，React 先清理 A 的 Effect，使 A 的 `ignore` 變 `true`；A 即使稍後完成，也不能覆蓋 B。請求若支援 `AbortController`，可同時取消以節省資源，但仍應知道第三方 Promise 不一定真的能取消。

**邊界條件：** 請求失敗也只能由最新請求顯示錯誤；快速重試、卸載、切換 query 都要避免舊結果回寫。若搜尋框每輸入一字就請求，debounce 只會減少請求數量，**不能取代**競態防護。

**自己試：** 在開發工具把 A 的回應延遲設得比 B 久，依序選 A、B。修正前應能重現舊資料覆蓋，修正後最後畫面必須與目前選單的 ID 一致。

#### loading 與 error 也有競態

只保護 `setData` 還不完整。假設 B 正在載入，而 A 在此時失敗；若 A 的 `.catch` 無條件 `setError`，畫面會把 A 的錯誤顯示在 B 的選項下。若 A 的 `.finally` 無條件 `setLoading(false)`，B 明明還在等待，loading 卻提前消失。因此，同一次請求的成功、失敗與完成狀態，都必須套用相同的「這次請求是否仍有效」判斷。

```jsx
useEffect(() => {
  let active = true;
  setStatus('loading');
  setError(null);

  fetchUser(userId)
    .then((user) => {
      if (active) {
        setUser(user);
        setStatus('success');
      }
    })
    .catch((cause) => {
      if (active) {
        setError(cause);
        setStatus('error');
      }
    });

  return () => { active = false; };
}, [userId]);
```

若允許同一個 `userId` 按「重試」，僅靠 `[userId]` 不會重新執行 Effect；需另外設計 `retryKey` 或將重試放到資料請求層。這能幫你區分「查詢條件變了」與「同一條件重新請求」兩種事件。

### 14｜這段邏輯真的需要 useEffect 嗎？

#### 原書逐頁重點（書頁 88–94）

- **88–90 頁：原例把可推導資料又存了一份。** 第一次 Effect 取得 user，第二次 Effect 依 user 組出完整地址並寫入 `fullAddress` state。畫面依次經過 loading、已有姓名但地址未算出、最後地址出現；書中用 render 計數呈現這段多餘的中間狀態。
- **91–94 頁：在 render 中直接推導。** 完整地址只由目前 `user.address` 決定，無須另一個 Effect 與 state。取得 user 後直接在 render 計算即可，減少一次設定 state 與過渡畫面。若計算真的昂貴，才考慮 memo；普通字串組合不需要。

#### 先想問題，再看解答

**問題 1：取得 user 後，為何頁面還會再 render 一次才出現完整地址？**

**解答：** 原例將 `fullAddress` 另外存成 state。user 更新先觸發一次 render；第二個 Effect 看到 user 改變，再組地址、呼叫 setter，於是又 render。中間會短暫出現「姓名已有、地址尚無」的畫面。

**問題 2：刪掉第二個 Effect 與 `fullAddress` state，地址從哪來？**

**解答：** 每次 render 直接由當前 `user.address` 組字串，`user` 還沒載入時回傳空值或顯示 loading。因為地址完全由 user 推導，沒有獨立的資料來源，不需要保存副本。user 一更新，同一次 render 就能顯示姓名與地址。

**問題 3：如果組地址很費時，是否又該放回 Effect？**

**解答：** 不一定。純計算仍可在 render 做；量測證明昂貴後，可評估 `useMemo`，依 address 變化重算。Effect 是與外部系統同步的工具，把純計算搬進 Effect 往往只會增加狀態與過渡 render。

**先對照原書情境：** 第一個 Effect 請求使用者後 `setUser(data)`；第二個 Effect 看到 `user` 改變，再 `setFullAddress(...)`。在沒有 Strict Mode 額外檢查的簡化情境下，可推演為：初次 render（`user=null`）→ 請求完成後 `user` 更新而 render → 第二個 Effect 寫入地址 state 又 render。最後一次 render 只是為了顯示可由 `user` 直接算出的字串。

```jsx
// 保留 user 這個來源資料；地址在每次 render 從目前 user 推導
const fullAddress = user
  ? `${user.address.street}, ${user.address.city}`
  : '';
```

這樣請求完成後的那次 render 就能直接顯示地址，不需第二個 Effect 與第二份 state。實際 render 次數會受 Strict Mode、其他 state 更新與批次處理影響；面試時先說明假設，再按更新來源逐次推演，避免死背一個數字。

先問：「我要同步的外部系統是什麼？」如果答案只有「另一個 state」，通常應在 render 直接推導。把 `firstName`、`lastName` 合成 `fullName` 的 Effect 會造成一次舊值畫面與一次多餘更新：

```jsx
// 直接從目前 render 的資料算出來
const fullName = `${firstName} ${lastName}`;
```

若使用者按下提交鈕要送出表單，請求屬於**事件造成的動作**，放在 `handleSubmit`。若畫面顯示某個 `roomId` 就需要保持 WebSocket 連線，連線屬於**畫面存在期間的同步**，放在 Effect。

| 需求 | 放在哪裡 | 原因 |
| --- | --- | --- |
| 由資料篩選可見清單 | render；昂貴時再考慮 `useMemo` | 同一份資料可立即算出 |
| 點擊「儲存」送出表單 | 事件處理器 | 有明確使用者意圖 |
| 訂閱聊天室 | Effect + cleanup | 需要隨元件與 `roomId` 同步 |
| 將 props 複製到 state | 先重新設計資料所有權 | 容易產生兩份不一致資料 |

**自我檢查：** 刪掉這個 Effect 後，能否在 render 算出同一結果？能的話先刪；若需要 Effect，寫清楚 setup、依賴、cleanup 三者。

#### 「可推導」與「使用者可編輯」是不同需求

如果地址只是顯示文字，`fullAddress` 可由 `user.address` 計算，無需獨立 state。但若畫面提供一個地址編輯框，允許使用者先修改草稿而尚未儲存，草稿與伺服器 `user.address` 已經不是同一件事；此時需要 draft state。判斷能否刪掉 state，不是看兩個值文字上是否相似，而是看它們是否代表不同的使用者意圖與生命週期。

```jsx
const [draftAddress, setDraftAddress] = useState('');

function startEditing() {
  setDraftAddress(formatAddress(user.address));
}
```

這裡在「開始編輯」事件中建立草稿，比在 Effect 中永遠把 `user.address` 複製到 `draftAddress` 安全；後者可能在背景資料更新時覆蓋使用者尚未提交的輸入。

### 15｜事件後量測 DOM，畫面為什麼閃一下？

#### 原書逐頁重點（書頁 95–105）

- **95–98 頁：觀察視覺閃爍。** 原例載入大量留言後，想讓捲動容器直接到最底部；程式在資料更新後用 Effect 設定 `scrollTop`，初次顯示時卻會先看見頂部，再跳到底部。書中用延遲資料回傳放大這個現象。
- **99–102 頁：拆開時間順序。** 更新 comments 觸發 render，瀏覽器先繪製列表，`useEffect` 才操作捲動位置，所以使用者可能看見第一個畫面。這是 DOM 操作時機造成的閃爍，不能只靠刪除模擬延遲掩蓋。
- **103–105 頁：在繪製前完成必要的 DOM 操作。** 書中將該段同步捲動改為 `useLayoutEffect`，使捲動位置在瀏覽器繪製前設定。它可能阻塞繪製，應限於確實需要在繪製前量測或調整版面的情境。

#### 先想問題，再看解答

**問題 1：為何留言列表先露出頂部，再跳到最底部？**

**解答：** comments state 更新後，React 先把新列表提交到 DOM；一般 Effect 常在瀏覽器繪製後才設定 `scrollTop`。使用者於是先看到未捲動的列表，再看到捲到最底的結果。延遲請求只是讓現象更容易觀察，真正原因是操作 DOM 的時機。

**問題 2：為何 `useLayoutEffect` 能消除這種閃爍？**

**解答：** 它在 DOM 更新後、瀏覽器繪製前同步執行；在此階段設定捲動位置，使用者第一次看到的就是已定位的列表。它適合必須先量測或修正版面才能顯示的操作，但會阻塞繪製，不應無條件替換所有 Effect。

**問題 3：只把模擬的兩秒延遲刪掉算修好嗎？**

**解答：** 不算。資料快時閃爍可能變得不明顯，但慢網路與大列表仍能重現；應以真實的 DOM 更新與繪製順序處理。也要確認每次新增留言都需要強制捲底，避免使用者正在閱讀舊留言時被拉走。

例如 tooltip 必須先知道自己的高度才能決定顯示在按鈕上方還是下方。一般 Effect 通常在繪製後執行，使用者可能先看見預設位置，下一幀才看見修正位置。

`useLayoutEffect` 在 DOM 更新後、瀏覽器繪製前執行。可以測量 DOM 並同步設定位置，讓第一次可見畫面就是正確位置：

```jsx
const ref = useRef(null);
const [height, setHeight] = useState(0);

useLayoutEffect(() => {
  const nextHeight = ref.current.getBoundingClientRect().height;
  setHeight(nextHeight);
}, []);
```

這不代表所有 Effect 都應換成 `useLayoutEffect`。它會阻塞瀏覽器繪製；若只需請求資料、記錄事件或訂閱，使用一般 Effect。若位置能用 CSS（例如 flex/grid）處理，通常比 JavaScript 量測更簡單。伺服器渲染時也沒有可量測的 DOM，須考慮初始畫面與 hydration。

**面試回答：** 先指出「錯誤位置被畫出來」的時序，再比較 CSS、`useEffect` 和 `useLayoutEffect` 的適用範圍。

#### 為什麼會閃：把一幀畫出來

一般 Effect 的典型順序是 render 決定「先放在預設位置」→ commit 更新 DOM → 瀏覽器有機會把這個位置畫出來 → Effect 讀取高度並更新 state → 第二次 render 把 tooltip 移到正確位置。人眼看到的是兩個位置相繼出現。`useLayoutEffect` 讓測量與第二次更新在繪製前完成，因此第一幀就呈現修正後位置；代價是瀏覽器必須等待這段同步工作結束。

實作時不要把 `getBoundingClientRect()` 的結果直接當絕對定位的 `top`，除非你已確認定位容器與座標系一致。可先量測目標按鈕與 tooltip 的矩形，再將視窗座標轉為容器座標。視窗縮放、容器滾動、字體載入與內容改變，都可能使舊測量失效；真正的定位需求常適合使用成熟的 positioning 工具或 CSS anchor／layout 能力。

**檢查表：**

1. 不做 JavaScript 測量時，CSS 是否已能滿足需求？
2. 量測的是哪個元素？座標相對 viewport 還是容器？
3. 何時需要重新量測（resize、內容變更、字體載入）？
4. 同步量測成本是否會讓畫面卡頓？

這四個答案比只說「把 `useEffect` 改成 `useLayoutEffect`」更接近完整解法。

#### 一個容易誤修的細節

若量測後每次都 `setHeight`，即使高度未變也會反覆排入更新；應視情況比較前後值，或讓定位邏輯直接使用 CSS。若 tooltip 的內容會因資料請求而變長，只用 `[]` 在初次掛載量一次也不夠；要讓重新量測跟真正會改變尺寸的因素同步，或觀察尺寸變化。先畫出「內容何時變 → DOM 何時更新 → 何時量測」的時間線，才能寫出正確依賴。

## 第三章：渲染與效能

### 16｜列表用 index 當 key 有什麼風險？

#### 原書逐頁重點（書頁 106–111）

- **106–108 頁：用展開狀態找錯位。** 水果清單每列有可展開的內部狀態。展開 Banana 後刪掉它，Cherry 可能接手展開狀態，因為刪除後索引重排，React 把原來某個位置的元件視為同一個實體。
- **109–111 頁：key 表示身分。** 書中用協調過程解釋 key 如何幫 React 對應舊列與新列；把穩定、唯一的資料 ID 當 key，刪除或排序後才會保留正確列的 state。若資料無 ID，可在建立資料時產生，不要在每次 render 臨時產生隨機 key。

#### 先想問題，再看解答

**問題 1：展開 Banana 後刪掉它，為何 Cherry 可能變成展開狀態？**

**解答：** 若 key 用陣列索引，刪掉 Banana 後 Cherry 移到原本 Banana 的位置，React 可能把它視為同一個位置上的元件，沿用該位置的內部展開 state。畫面資料換了，元件身分卻錯配；這不是 Cherry 的資料真的變成 Banana。

**問題 2：改成 `key={fruit.id}` 解決了什麼？**

**解答：** id 隨資料項目移動，React 在刪除或排序後仍能認出同一顆水果。Banana 被刪就卸載自己的元件；Cherry 繼續保有它原本的 state。key 的用途是建立相鄰清單元素的穩定身分，並非傳給子元件顯示的普通 prop。

**問題 3：什麼時候 index 當 key 才不容易出錯？**

**解答：** 清單永遠固定、不重排、不插入或刪除，且項目沒有各自需保存的 state 時，索引風險較低。但資料需求可能改變，能取得穩定 ID 時仍優先用 ID。每次 render 產生新隨機 key 更糟，會使所有列反覆重掛載。

假設清單是 `A、B、C`，畫面上第二列的輸入框正在編輯 B。刪掉 A 後變成 `B、C`。如果 key 是 index，React 看到 key `0、1` 仍存在，可能沿用原先 A、B 的元件實例；第二列原本保留的區域 state 便可能落到 C 身上。

```jsx
// 容易在插入、刪除、排序時出錯
items.map((item, index) => <EditableRow key={index} item={item} />)

// 讓 React 按資料身分對應元件
items.map((item) => <EditableRow key={item.id} item={item} />)
```

`key` 是同層兄弟元素間的身分線索，不會作為一般 prop 傳進子元件；若子元件也需要 id，仍要傳 `itemId={item.id}`。在 render 時呼叫 `Math.random()` 或 `crypto.randomUUID()` 產生 key 也不行，因為每次 key 都變，元件會反覆卸載與掛載。建立資料時產生一次 id，之後保持穩定。

| 操作 | 以 index 當 key | 以資料 id 當 key |
| --- | --- | --- |
| 在最前面插入 X | 原本 A 的元件可能被配給 X | X 建立新元件，A 保留自己的元件 |
| 刪除 A | 原本 B 的位置變成 index 0 | B 仍由自己的 id 識別 |
| 排序 B、C | 位置改變，局部 state 可能錯位 | 元件身分隨資料移動 |

要特別測未受控輸入框、列內展開狀態與動畫，這些地方最容易看出 key 錯配。若列表只是純文字，錯誤可能暫時看不出來，但身分模型仍不正確。

**何時可以用 index？** 清單內容固定、順序固定、不會插入刪除，也沒有要保留的列內狀態時。判斷依據是資料身分是否會與位置分離，而不是「React 有沒有顯示警告」。

#### 真正要追的是「哪個 state 屬於哪筆資料」

設想每個 `EditableRow` 都有自己的 `draft` state。起初 `key=0` 的元件編輯 A，`key=1` 的元件編輯 B。刪掉 A 之後，React 看到新的第一筆 B 仍使用 `key=0`，於是可能把原本 A 的元件 state 留給 B。資料列的文字雖然改成 B，輸入框內尚未提交的 draft 卻可能仍是 A 的。使用資料 id 作 key，React 才能知道「B 從第二個位置移到第一個位置，但仍是 B」。

**練習：** 寫三筆可編輯清單，先改第二筆的輸入框但不提交，再刪第一筆。分別用 index 與 id 當 key，觀察未提交文字去了哪裡。這比只看列表文字更容易抓到真正的錯配。

同一筆資料的 id 應由資料來源或建立該資料的事件提供。若後端已給 id，直接沿用；若是本地新建待辦，就在新增事件產生一次。`key` 的有效範圍是同層兄弟，不要求整個網站每個元素的 key 都全球唯一。真正要避免的是同層重複，或同一筆資料每次 render 換 key。

### 17｜父元件更新，昂貴子元件為什麼也重渲染？

#### 原書逐頁重點（書頁 112–117）

- **112–114 頁：先量到浪費。** 頁面有 count 與 text 兩個狀態，昂貴子元件只收 text。按下增加 count，父元件重新 render，子元件也重跑費時的模擬計算，雖然它的資料沒有變。
- **115–117 頁：在確認瓶頸後用 memo。** 書中將昂貴子元件包上 `React.memo`，讓 props 未變時略過子元件 render，並說明淺層比較與自訂比較函式的概念。是否值得使用，取決於重渲染頻率、子元件成本與 props 穩定性，不能只因看到一次 render 就加 memo。

#### 先想問題，再看解答

**問題 1：昂貴元件只收 `text`，按增加 count 為何它仍執行？**

**解答：** count 是父元件的 state；父元件更新後會重新執行並產生子元件元素。一般子元件也會重新 render，即使這次傳入的 text 沒變。原例子元件有刻意昂貴的計算，因此多跑一次足以讓畫面卡頓。

**問題 2：`React.memo` 在這個例子省掉哪次工作？**

**解答：** 用 memo 包住昂貴子元件後，count 改變但傳入的 text 相同，React 可略過該子元件 render。按「改變文字」時 text prop 真有變，子元件仍必須重跑並顯示新內容；如果它完全不更新，表示比較條件寫錯了。

**問題 3：為何不把整個應用每個元件都包 memo？**

**解答：** 比較 props 與維持最佳化也有成本，且物件或函式 prop 若每次都建立新參考，memo 可能完全省不到工作。先用 Profiler 找到昂貴且常因無關更新重跑的元件，再確認 props 穩定性，才有具體改善目標。

**先對照原書情境：** `App` 有互不相關的 `count` 與 `text`。昂貴的 `ExpensiveComponent` 只接收 `text`，但按下增加 count 後仍重新執行。原因是父元件 render 時，預設也會重新評估子元件；「props 沒變」本身不會自動讓一般子元件跳過 render。

```jsx
const ExpensiveComponent = memo(function ExpensiveComponent({ text }) {
  // 假設此處的渲染工作經量測確實昂貴
  return <div>{text}</div>;
});

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Initial Text');
  return <>
    <button onClick={() => setCount((n) => n + 1)}>Count +1</button>
    <button onClick={() => setText('Updated Text')}>Change text</button>
    <ExpensiveComponent text={text} />
    <p>Count: {count}</p>
  </>;
}
```

現在增加 `count` 時，`text` 仍是同一個字串，`memo` 可以略過昂貴子元件；改變 `text` 時則必須重新 render。這是**略過元件 render**，與 `useMemo` 快取 render 內部某項計算不同。

**量測順序：** 先用 Profiler 確認子元件真的是瓶頸，再用 `memo`，最後檢查 props 是否穩定。若傳進來的是每次重建的物件或函式，請讀第 18、20 題。若真正耗時的是一次渲染上萬個 DOM 節點，應考慮分頁或虛擬化；若是單一純計算昂貴，才考慮 `useMemo` 快取計算結果。

#### 先分辨「重渲染」與「畫面有變」

`ExpensiveComponent` 函式重新執行，不代表 React 必然改寫對應 DOM；如果算出的 JSX 沒變，commit 可能沒有可見差異。但昂貴的 JavaScript 計算已經付出成本。這題關心的是**render 工作量**，不能只看畫面有沒有閃。可在子元件函式入口放 `console.count('Expensive render')` 觀察呼叫，再用 Profiler 量測耗時。開發模式的 Strict Mode 可能額外呼叫 render，量測時要明確記錄環境。

比較三次操作：初次載入一定 render；增加 `count` 時，未使用 `memo` 的子元件通常會再 render；改變 `text` 時，即使使用 `memo` 也應 render。若第三種操作被你「最佳化」到不更新，代表你用錯了比較邏輯，造成舊資料顯示。

若昂貴子元件自己有 `useState`，它自己的 setter 仍會觸發更新；`memo` 只比較從父層傳來的 props，並不是「永遠不重新渲染」開關。將 state 移到更靠近使用它的元件，有時比包 `memo` 更有效，因為更新範圍本來就縮小了。

### 18｜React.memo 應該到處加嗎？

#### 原書逐頁重點（書頁 118–124）

- **118–120 頁：巢狀 memo 仍可能全部重跑。** 原例把大型清單與小項目都包上 `memo`；按父元件的 count 按鈕，仍看到各項 render 次數增加。memo 不是自動凍結子樹，而是逐層比較傳入 props。
- **121–123 頁：找出失穩的陣列參考。** 清單資料若宣告在父元件函式內，每次 render 都建立新陣列，淺層比較判定 `items` 改變。書中比較將固定資料移到元件外，以及用 `useMemo` 保持引用的方式；這個靜態清單放到元件外更簡單。
- **124 頁：比較工具的職責。** `React.memo` 記住元件的 render 結果，`useMemo` 記住特定計算值或引用。兩者都有成本，應先確認資料是否真的需要重建，以及省下的工作是否值得。

#### 先想問題，再看解答

**問題 1：大型清單與小項目都包了 memo，為何按父層按鈕仍全都重跑？**

**解答：** 原例的 `items` 陣列寫在父元件函式內，父層每次 render 都建立新陣列。大型清單接到新參考，淺層比較判定 props 不同，就重新 render，接著各層也可能跟著工作。memo 比的是 props 身分，不是看陣列內容是否肉眼相同。

**問題 2：靜態資料應放元件外，還是用 `useMemo`？**

**解答：** 資料完全固定時，放在元件外最直接，根本不在 render 時重建。資料要根據依賴推導且計算昂貴，或為了讓 memo 子元件收到穩定參考，才評估 `useMemo`。把每個小陣列都放進 memo 可能比重新建立還複雜。

**問題 3：怎麼判斷優化有沒有成功？**

**解答：** 分別測初次載入、父層無關 state 更新、清單資料真正改變三種情境。無關更新應少做清單工作；資料改變時仍要正確更新。若只看到 render 次數下降卻顯示舊資料，優化反而造成錯誤。

**先對照原書情境：** `App` 每次 render 都在函式內建立 `items = [{ name: 'apple' }, ...]`，再把它傳給已用 `memo` 包住的 `LargeList`。即使清單內容看起來相同，`items` 仍是新的陣列參考，`Object.is(previousItems, nextItems)` 為 `false`，所以 `LargeList` 會重渲染；其內部小元件也可能跟著更新。

```jsx
// 若資料真的固定，移到元件外通常比加 Hook 簡單
const ITEMS = [
  { id: 'apple', name: 'apple' },
  { id: 'banana', name: 'banana' },
];

function App() {
  const [count, setCount] = useState(0);
  return <>
    <button onClick={() => setCount((n) => n + 1)}>{count}</button>
    <LargeList items={ITEMS} />
  </>;
}
```

若清單是由 props 或 state 計算出來且計算昂貴，才考慮 `useMemo(() => deriveItems(source), [source])`，再把穩定結果傳給 `memo` 子元件。不要為了使 `memo` 生效而把本來很便宜的資料處理複雜化。

`memo` 包住元件後，父元件重新 render 時，React 會比較子元件這次與上次的 props；若各 prop 依 `Object.is` 都相同，通常可略過子元件 render。它不會阻止子元件自己的 state 更新，也不會阻止它所讀取的 Context 更新。

```jsx
const ProductList = memo(function ProductList({ products, onSelect }) {
  return products.map((product) => (
    <button key={product.id} onClick={() => onSelect(product.id)}>
      {product.name}
    </button>
  ));
});
```

若父元件每次都傳新的 `products.filter(...)` 結果或新的 `onSelect` 函式，淺比較仍會判定 props 改變。此時要先確認重渲染真的慢，再考慮穩定資料或函式身分。盲目加 memo 會增加比較成本，也可能讓資料流更難閱讀。

**面試判斷：**「子元件重渲染」本身不等於效能問題。先量測耗時、確認 props 是否穩定，再決定是否加 memo。

#### 對照三種讓 `items` 穩定的方法

| 資料來源 | 建議寫法 | 為什麼 |
| --- | --- | --- |
永遠固定的清單 | 宣告在元件外 | 沒有理由每次建立，也不需 Hook |
由 props/state 推導且計算昂貴 | `useMemo` 並列出真正依賴 | 依賴未變時可重用結果 |
每次都從 API 取得的新資料 | 讓請求層保存穩定資料，必要時避免重複轉換 | 先解決資料流，再談 memo |

把同樣內容放進 `useMemo(() => [...], [])` 雖可得到穩定參考，但固定常數直接移出元件更清楚。若 `items` 實際依賴 `category`，卻錯寫空依賴陣列，畫面會停留在舊分類；效能優化不能以犧牲正確性為代價。

### 19｜沒讀取 Context 的元件，為什麼還是重渲染？

#### 原書逐頁重點（書頁 125–130）

- **125–127 頁：追查元件位置。** Provider 使用來自 App 的 state；每次更新，App 也會重渲染。原例中的昂貴元件即使沒有讀取 context，仍可能因它是 App 渲染的子節點而重跑。
- **128–130 頁：縮小更新影響。** 書中先調整 Provider 與元件的擺放，使昂貴元件不再被無關的 context 區域包住，再以 `memo` 示範可跳過的 render。重點要同時看 provider 的 value、state 所在元件與子樹結構；「沒有呼叫 `useContext`」不足以保證不重渲染。

#### 先想問題，再看解答

**問題 1：昂貴元件沒呼叫 `useContext`，為何按 context 的增加按鈕它也重跑？**

**解答：** 原例的 context 值由 App 的 state 提供。按鈕使 App 重新 render，App 產生的其他子節點也可能跟著 render；沒有讀取 context 只表示不會因訂閱該值而更新，並不阻止父層更新向下傳遞。

**問題 2：移動 Provider 的範圍能改善什麼？**

**解答：** 讓只有真正需要共享值的子樹位於 Provider 內，並把 state 放在最接近使用者的地方，可減少無關區域受到同一個父元件更新的影響。若 App 仍直接重建昂貴元件，可能還要以 memo 或重新安排元件邊界處理，不能只搬 Provider 就期待所有 render 消失。

**問題 3：Provider 的 value 寫成新物件有何影響？**

**解答：** 每次父層 render 都建立新的 value 物件時，使用該 context 的元件會看到新參考，即使內部欄位沒變也可能更新。可拆分變動頻率不同的 context、穩定必要的 value，並以實際量測確認；不要把無關資料全部塞進一個大型 context。

**先對照原書情境：** `App` 保存共享狀態，並在 `AppContext.Provider` 之下直接寫入 `<Parent />`；`Parent` 又渲染一個沒有呼叫 `useContext` 的昂貴子元件。按鈕更新 `App` state 後，昂貴子元件仍重新 render。不能僅憑「它沒讀 Context」就認定 React 不會執行它。

要拆開兩條更新路徑：

1. **一般父子 render 路徑：** `App` 更新而重新 render，`<Parent />` 是在它的 JSX 中新建的元素；`Parent` 與後代通常也會再 render。昂貴元件沒讀 Context，仍可能因父層 render 而執行。
2. **Context 訂閱路徑：** 真正呼叫 `useContext(AppContext)` 的 consumer，Provider `value` 改變時會取得新值；即使被 `memo` 包住，也不能因相同 props 略過這次 Context 更新。

```jsx
const ExpensiveView = memo(function ExpensiveView({ title }) {
  return <section>{title}</section>;
});

function Parent() {
  return <ExpensiveView title="固定內容" />;
}
```

若 `Parent` 因上層更新而重新 render，`ExpensiveView` 的 props 仍相同，`memo` 可略過它；另一種做法是調整 state 所在位置與元件組合，讓頻繁變動的 state 只影響需要它的區域。將不相關的 Context 拆開，也可減少 consumer 因共享 value 變化而更新。

**檢查順序：** 先標出哪個 state 變了 → 哪個元件擁有它 → 哪些子元件隨父層 render → 哪些元件讀 Context。若把所有重渲染都歸因於 Context，會錯過原書這題真正要分辨的父子 render 路徑。

#### 用元件樹推演，比猜測 Context 行為可靠

```text
App（持有 count，提供 Context value）
└─ Parent（沒有讀 Context，但由 App render）
   ├─ Consumer（呼叫 useContext）
   └─ ExpensiveView（沒有讀 Context）
```

點擊按鈕更新 `count`，先標記 `App` 需要 render。`App` 重新產生 `Parent` 元素，`Parent` 也可能 render，進而帶動 `ExpensiveView`。另外，若 Provider 的 value 也變了，`Consumer` 會經由 Context 收到更新。這是兩條同時可能存在的路徑；「沒讀 Context」只能排除第二條，不能排除第一條。

修正也要對準路徑：若昂貴子元件因父層 render 而執行，可用 `memo` 或改變元件組合；若是 consumer 對過大的 Context 訂閱，拆分 Context 或縮小消費元件。先在 Profiler 確認是哪個元件耗時，再選策略。

還要檢查 Provider 的 value 身分：`value={{ count, setCount }}` 在提供者每次 render 時都建立新物件。若 `count` 沒變，但其他 state 使 Provider render，consumer 仍可能因 value 參考改變而更新。可視實際成本穩定 value，例如 `useMemo(() => ({ count, setCount }), [count])`；但 count 真正改變時 consumer 本來就應更新，`useMemo` 無法也不該阻止它。

### 20｜memo 遇到函式 prop 為什麼失效？

#### 原書逐頁重點（書頁 131–139）

- **131–133 頁：原例的按鈕仍需更新父層 count。** 父元件每次 render 重新宣告 `increment` 函式，將它作為 `onClick` 傳給 `memo` 包住的昂貴子元件。函式內容看似相同，但新舊參考不同，淺層比較因此不能略過 render。
- **134–137 頁：穩定函式參考並避免舊快照。** 書中用 `useCallback` 包住函式，且以 `setCount(previous => previous + 1)` 避免讀取舊 count，讓 callback 能有穩定參考。若仍捕捉會變的值，依賴陣列須如實列出，不能為了保持參考而漏依賴。
- **138–139 頁：優化要有對象。** `useCallback` 主要在函式身分會影響 memo 子元件或 Hook 依賴時有用；單純讓每個函式都被記住，可能增加複雜度而沒有可感知的改善。

#### 先想問題，再看解答

**問題 1：子元件已經 `memo`，按父層 count 為何還是重跑？**

**解答：** 父元件每次執行都重新建立 `increment` 函式；新舊函式雖做同一件事，參考卻不同。它作為 `onClick` prop 傳下去時，memo 的淺層比較判定 props 變了，於是仍重新 render。

**問題 2：`useCallback(() => setCount(count + 1), [])` 能修好嗎？**

**解答：** 函式參考會穩定，但它一直捕捉初次 render 的 count，可能每次都要求設成 1。若回呼只需遞增，改用 `setCount(previous => previous + 1)`，再給 `useCallback` 空依賴才合理。若函式讀取 userId 等外部值，必須列入依賴，不能為了穩定身分犧牲正確性。

**問題 3：什麼時候應保留普通函式？**

**解答：** 子元件很便宜、沒有 memo，也沒有 Hook 依賴該函式身分時，重新建立函式未必是瓶頸。`useCallback` 本身也要維護依賴；先量測子元件 render 是否真的耗時，再決定是否使用。

**先對照原書情境：** 昂貴子元件已由 `memo` 包住，但父元件每次 render 都寫 `const increment = () => setCount(count + 1)`，並把它當 `onClick` prop 傳入。每次都是新函式參考，因此子元件的 props 比較失敗。

```jsx
const increment = useCallback(() => {
  setCount((count) => count + 1);
}, []);
```

這裡用 updater function 是關鍵：回呼不必封閉某次 render 的 `count`。若改成 `useCallback(() => setCount(count + 1), [count])`，每次 count 改變仍會得到新函式，對這道題的 memo 效果沒有幫助。不能單純把依賴改為 `[]` 並保留 `count + 1`，那樣函式會一直讀到初次 render 的 count。

JavaScript 每次執行 `() => ...` 都建立新的函式物件。父元件 render 時若把這個新函式傳給 `memo` 子元件，淺比較會看見不同參考，因而無法略過 render。

`useCallback` 的目的，是在依賴不變時重用**函式身分**；它不會讓函式內部運算更快。若回呼要根據前一個 state 更新，可用 updater function，避免把整個 `todos` 納入依賴：

```jsx
const addTodo = useCallback((text) => {
  setTodos((previous) => [...previous, { id: crypto.randomUUID(), text }]);
}, []);
```

但若函式確實讀取 `userId` 等 reactive value，就要把它列入依賴，不能用空陣列強留舊閉包。也可先問是否需要 `memo`：若子元件很小、render 很便宜，直接傳函式比額外管理快取更清楚。

**連結第 18 題：** `memo` 控制元件是否因相同 props 重渲染；`useCallback` 只幫其中一種 prop 保持參考穩定。兩者都應由量測與實際資料流決定。

#### 為什麼「加了 useCallback」仍可能沒用

若回呼讀取 `count`，`useCallback(..., [count])` 在每次 count 變化後仍產生新函式；這是**正確的依賴更新**，並非 Hook 壞掉。要穩定身分，先問回呼是否真的需要讀取目前的 `count`。若唯一目的只是累加，updater function 讓 React 提供最新值，因此回呼不再依賴外層快照。若還需根據當前 `userId` 呼叫 API，就不能省略 `userId` 依賴；子元件必須在 userId 改變時收到新回呼。

**預測題：** 比較下面兩個回呼在連點三次後的結果：`useCallback(() => setCount(count + 1), [])` 與 `useCallback(() => setCount((n) => n + 1), [])`。前者一直封閉初次 render 的 count，後者每次根據更新佇列中的最新值計算。這同時連回第 2 題的 state 快照模型。

在面試現場，若被要求優化，先口述完整依賴，再提出 updater function；不要直接寫空依賴陣列追求「參考穩定」。穩定而讀錯資料的函式是錯誤的優化。最後用 Profiler 比較優化前後：若子元件本來就很便宜，增加 `useCallback` 及依賴管理可能讓程式更複雜，卻沒有可測量的好處。

## 第四章：面試實作

### 21｜判斷 render 與 Effect 的輸出順序

#### 原書逐頁重點（書頁 140–147）

- **140–142 頁：題目要求預測初次與點擊後的 console 順序。** 元件函式內有兩個 log，兩個 Effect 中又有 log，其中一個 Effect 會回傳 cleanup。看程式時先分出 render 階段的同步敘述、Effect setup 與 cleanup，而不要只按原始碼由上到下排列。
- **143–145 頁：先在未啟用 StrictMode 的前提推演。** 初次 render 先印元件函式中的 A、D，再跑 Effect 的 B、E、F；cleanup C 尚未發生。count 更新時先印 A、D，無依賴陣列的 Effect 再印 E，依賴 count 的 Effect 印 F；空依賴 Effect 不重跑，C 也不會在這次點擊出現。
- **146–147 頁：說清環境假設。** 書中特別提醒要先確認 StrictMode，否則開發環境的額外檢查會改變觀察到的輸出。面試回答應先聲明假設、逐階段說明，再對照瀏覽器 console，而不是只背一串字母。

#### 先想問題，再看解答

**問題 1：未開 StrictMode 時，原書範例初次 render 的輸出順序是什麼？**

**解答：** 先執行元件函式中的 A、D，DOM 提交後才執行 Effect，依序印 B、E、F，因此是 `A → D → B → E → F`。回傳 cleanup 的 C 此時只是建立函式，尚未執行。

**問題 2：按下增加 count 後，為何沒有 C？**

**解答：** 這次 state 更新重新執行元件函式，先印 A、D；無依賴陣列的 Effect 再印 E，依賴 count 的 Effect 印 F。帶 `[]` 的 Effect 不因 count 更新而重跑，它的 cleanup C 也不會在這次點擊執行。不能把「每次 render」和「每次 Effect 重跑」混為一談。

**問題 3：若面試官在開發環境看到不同順序，怎麼答？**

**解答：** 先確認 StrictMode、元件是否重新掛載，以及 log 是在 render、Effect setup 還是 cleanup。開發模式的額外檢查可造成額外輸出；應說明在指定環境下的執行階段，而不是把一組字母視為任何環境都不變的答案。

這類題目先不要猜 log 清單。把程式分成三段：**render**（計算 JSX）、**commit**（React 更新 DOM）、**Effect**（與外部系統同步）。事件處理器在使用者操作時執行，setter 只排入下一次 render，不會改寫目前閉包中的變數。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  console.log('render', count);

  useEffect(() => {
    console.log('effect', count);
    return () => console.log('cleanup', count);
  }, [count]);

  return <button onClick={() => {
    setCount(count + 1);
    console.log('click', count);
  }}>+1</button>;
}
```

在沒有 Strict Mode 的一般單次掛載情境，初次會先記錄 `render 0`，commit 後才有 `effect 0`。點擊時先記錄 `click 0`，再進入新 render 記錄 `render 1`；新的 Effect setup 之前，舊 Effect 會記錄 `cleanup 0`，最後才是 `effect 1`。cleanup 讀到 0，因為它封閉的是建立該 Effect 時的快照。

**作答步驟：** 先圈出每個 setter 與依賴 → 逐次寫出 render 快照 → 標出 commit → 安排舊 cleanup 與新 setup。再問面試官是否開啟 Strict Mode；開發環境的額外檢查會改變觀察到的 log，不能混成唯一固定答案。`useLayoutEffect` 與一般 Effect 的執行時機也不同。

#### 在紙上建立事件表

| 時點 | `count` 快照 | 哪段程式執行 | 預期 log |
| --- | ---: | --- | --- |
| 初次 render | 0 | 元件函式 | `render 0` |
| 初次 commit 後 | 0 | Effect setup | `effect 0` |
| 第一次點擊 | 0 | 事件處理器；setter 排隊 | `click 0` |
| 更新 render | 1 | 元件函式 | `render 1` |
| 更新 commit 後 | 0 → 1 | 舊 cleanup，再新 setup | `cleanup 0`、`effect 1` |

這張表刻意把「更新後的畫面是 1」與「舊 cleanup 仍讀到 0」放在同一列比較。每個閉包都屬於它建立時的 render；React 不會回頭把舊函式內的 `count` 改成 1。若題目再加一個沒有依賴陣列的 Effect，它在每次 commit 後都要執行；若依賴是 `[]`，一般更新不會重跑。

**變化題：** 同一個 click handler 連寫兩次 `setCount(count + 1)`，下一次 render 是多少？改成兩次 `setCount((n) => n + 1)` 又是多少？先用第 2 題的更新佇列算出下一個 state，再回到本題排列 render 與 Effect，不能把兩題拆開背。

### 22｜實作待辦清單

#### 原書逐頁重點（書頁 148–158）

- **148–150 頁：先讀完成標準。** 原題提供待辦清單的起始程式碼，要求新增（按鈕與 Enter）、刪除、checkbox 切換完成，以及完成項目的刪除線。面試時先確認每個操作對畫面與資料的影響，再動手改碼。
- **151–153 頁：新增需要兩種 state。** 清單保存所有項目，輸入框保存正在輸入的文字；新增時建立包含 id、文字、完成狀態的新物件與新陣列，清空輸入框，並避免空白項目。
- **154–156 頁：刪除與切換交給清單擁有者。** Item 接收資料與回呼，將 id 傳回 TodoList；父元件用 `filter` 刪除、用 `map` 對指定項目建立新的完成狀態。這同時展示資料向下、事件向上的元件分工。
- **157–158 頁：由需求延伸。** 這題的價值在完整實作與說明，而不只寫出某一個 handler；書中也提醒若面試官追加需求，先確認預期行為與狀態邊界。

#### 先想問題，再看解答

**問題 1：從提供的起始碼開始，最少需要哪些 state？**

**解答：** 一個 `todos` 陣列保存清單項目，一個 `draft` 字串保存輸入框目前文字。每筆 todo 至少有穩定 id、文字、完成布林值。完成筆數、剩餘筆數或刪除線樣式都能由 `todos` 推導，沒有必要另存一份容易失同步的 state。

**問題 2：新增、刪除、切換完成各用什麼資料操作？**

**解答：** 新增時先 trim 並拒絕空白，建立新 id 與新陣列；刪除時用 `filter` 排除指定 id；切換時用 `map` 找到該 id，回傳帶有相反 `completed` 值的新物件。三種操作都保留舊 state 不被改寫，使 React 能正確更新。

**問題 3：checkbox 與刪除按鈕在 Item 裡，為何仍由 TodoList 更新？**

**解答：** TodoList 擁有整份 `todos`，所以應由它決定資料如何變動。Item 只把使用者意圖與 id 傳回父元件；父元件更新後再把新資料向下傳。這讓同一筆資料只有一個權威來源，也方便新增其他操作如篩選與排序。

先把需求翻成資料操作：新增一筆、切換完成、刪除一筆。`draft` 是輸入框目前文字；`todos` 是清單資料；剩餘數量可由清單推導，不必再存一份 state。每筆資料用 `{ id, text, completed }`，id 在新增時產生且保持穩定。

```jsx
function TodoApp() {
  const [draft, setDraft] = useState('');
  const [todos, setTodos] = useState([]);
  const remaining = todos.filter((todo) => !todo.completed).length;

  function addTodo(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setTodos((items) => [...items, {
      id: crypto.randomUUID(), text, completed: false,
    }]);
    setDraft('');
  }

  function toggleTodo(id) {
    setTodos((items) => items.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }

  function removeTodo(id) {
    setTodos((items) => items.filter((item) => item.id !== id));
  }

  return <>
    <form onSubmit={addTodo}>
      <input aria-label="新待辦" value={draft}
        onChange={(event) => setDraft(event.target.value)} />
      <button type="submit">新增</button>
    </form>
    <p>尚未完成：{remaining}</p>
    <ul>{todos.map((todo) => <li key={todo.id}>
      <label><input type="checkbox" checked={todo.completed}
        onChange={() => toggleTodo(todo.id)} />{todo.text}</label>
      <button onClick={() => removeTodo(todo.id)}>刪除</button>
    </li>)}</ul>
  </>;
}
```

**逐步驗證：** 空白輸入不新增；連續新增 id 不重複；切換其中一筆不影響其他筆；刪除後計數正確。若要求編輯、篩選、持久化，再分步加上；不要一開始把所有需求塞進單一 handler。`localStorage` 是外部系統，持久化才需要考慮 Effect。

#### 為什麼只存 `draft` 和 `todos`

若再存一個 `remaining` state，每次新增、完成或刪除都要記得同步更新。漏掉任何一個路徑，畫面就會出現「清單只有兩筆未完成，計數卻顯示三筆」的矛盾。從 `todos` 推導可讓清單成為唯一資料來源。若有 `all / active / completed` 篩選，也只需保存目前選擇的 filter，顯示清單由 `todos` 和 filter 算出。

```jsx
const visibleTodos = todos.filter((todo) => {
  if (filter === 'active') return !todo.completed;
  if (filter === 'completed') return todo.completed;
  return true;
});
```

**面試中的實作順序：** 先做新增，確認文字與穩定 id；再做完成切換，確認只替換目標物件；再做刪除；最後補空狀態、鍵盤與樣式。若需求包含「編輯」，需要明確區分清單資料與編輯中的暫存文字：按取消應保留原值，按儲存才寫回 `todos`。這不是多加一個按鈕而已，而是新增了「編輯中」的狀態轉移。

### 23｜設計可重用的 Tabs 元件

#### 原書逐頁重點（書頁 159–167）

- **159–161 頁：起始要求。** 原題提供三個 tab 的 id、標題與內容，要求預設顯示第一項，按鈕切換後同步更新 active 樣式與內容，並沿用既有 HTML 結構。
- **162–164 頁：先用最小 state 完成切換。** 保存目前 activeTabId；按鈕事件只改 id，render 依 id 決定哪個標籤有 active class、顯示哪段內容。這是從資料推導畫面的練習，不必為樣式和內容再各存一份 state。
- **165–167 頁：處理追問的自動輪播。** 原書再加一個可控制開關與間隔的輪播需求：Effect 建立 interval，依目前 id 找下一個索引並循環；cleanup 清除計時器。把「是否自動輪播」做成 prop，讓元件在不同場景可重用。

#### 先想問題，再看解答

**問題 1：三個 tab 的 active 樣式與內容，需要分別存 state 嗎？**

**解答：** 不需要。只存一個 `activeTabId`；每顆按鈕的 active class 由 `tab.id === activeTabId` 判定，內容也從對應 tab 資料取得。若再存 `activeTitle`、`activeContent`，切換時要維持三份資料同步，反而增加出錯機會。

**問題 2：初次應顯示哪一頁，點 Tab 2 時如何更新？**

**解答：** 初始 id 設為第一筆 tab 的 id，第一次 render 便顯示第一個標籤與內容。點 Tab 2 只更新 active id；下一次 render 的按鈕樣式和內容同時從新 id 推導，不需直接操作 DOM class。

**問題 3：追加自動輪播時，如何避免越跑越快？**

**解答：** Effect 建立 interval 後回傳 `clearInterval`；開關或時間間隔改變時先清掉舊計時器，再建立新計時器。回呼根據前一個 active id 找下一個索引，最後一項再回到第一項。若需求允許關閉輪播，關閉時不要建立 interval。

先定義元件 API，比先寫 JSX 更重要。假設 `items` 是 `{ id, label, content }[]`，受控版由父元件傳 `value` 與 `onChange`，適合 URL 或其他控制項也要切換分頁的情況；非受控版在 Tabs 內使用 `useState`，適合局部 UI。

```jsx
function Tabs({ items, value, onChange }) {
  return <>
    <div role="tablist" aria-label="內容分類">
      {items.map((item) => <button
        key={item.id}
        id={`tab-${item.id}`}
        role="tab"
        type="button"
        aria-selected={item.id === value}
        aria-controls={`panel-${item.id}`}
        tabIndex={item.id === value ? 0 : -1}
        onClick={() => onChange(item.id)}
      >{item.label}</button>)}
    </div>
    {items.map((item) => <div key={item.id}
      id={`panel-${item.id}`} role="tabpanel"
      aria-labelledby={`tab-${item.id}`} tabIndex={0}
      hidden={item.id !== value}>
      {item.content}
    </div>)}
  </>;
}
```

這是可點擊的最小版本，所有 panel 都保留在 DOM 中，未選中的 panel 以 `hidden` 隱藏，因此切回時內容中的局部 state 可保留。若需求要求每次切換都重新建立內容，就要改用只渲染 active panel，並重新處理 `aria-controls` 關聯。完整 tabs 還要處理左右方向鍵、Home/End、焦點移動，以及選中項目被移除時要選哪個項目。若不打算完成 tab 模式的鍵盤互動，簡單導覽按鈕或連結可能更合適。`id` 若來自任意文字，要確保產生的 DOM id 唯一且安全。

**面試說法：** 我先確認受控／非受控、是否保留未選中內容、切換是否同步 URL，再實作狀態與語意；樣式在互動正確後補上。

#### 把滑鼠可用的 Tabs 補成鍵盤可用

`role="tab"` 表示你承諾了 Tab 的鍵盤互動模式。常見做法是「只有選中 tab 可透過 Tab 鍵進入」，進入後用左右方向鍵移動並選取；Home/End 跳到首尾。以下示範選取與焦點同步的處理核心：

```jsx
const tabRefs = useRef([]);

function handleTabKeyDown(event, index) {
  const last = items.length - 1;
  let next = index;
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = last;
  else return;

  event.preventDefault();
  onChange(items[next].id);
  tabRefs.current[next]?.focus();
}
```

將每個 tab button 加上 `ref={(node) => { tabRefs.current[index] = node; }}` 和 `onKeyDown={(event) => handleTabKeyDown(event, index)}`，並在 `map` 中取得 `index`。如果標籤可被禁用，還要跳過 disabled 項目。若選中項目從 `items` 消失，父元件須決定退回第一項還是相鄰項；受控元件不能自行默默修改父層的 `value`。

### 24｜現場寫一個資料請求 Custom Hook

#### 原書逐頁重點（書頁 168–176）

- **168–170 頁：題目要求抽出重複的請求邏輯。** 原例頁面載入使用者資料；面試要求寫 `useFetch(url)`，回傳 `data`、`loading`、`error`，不裝額外套件，盡量只改資料邏輯而保留原渲染區。
- **171–174 頁：把狀態與 Effect 移入 Hook。** 書中在自訂 Hook 中管理請求狀態與錯誤，在 url 變更時再請求，元件只消費回傳結果。Hook 名稱以 `use` 開頭，內部仍須遵守 Hook 規則；Effect callback 本身保持同步，另宣告 async 函式執行請求。
- **175–176 頁：從可用版本延伸。** 原書追問多 API、取消進行中的請求、快取與其他 HTTP 方法。基礎抽取能減少頁面重複碼，但正式使用時仍要處理競態條件與錯誤呈現。

#### 先想問題，再看解答

**問題 1：這題的 `useFetch(url)` 應收什麼、回傳什麼？**

**解答：** 收入請求 URL，回傳 `data`、`loading`、`error` 三個與畫面直接相關的值。元件把取資料的邏輯交給 Hook，再依這三個狀態呈現載入、成功與失敗。Hook 本身不能回傳 JSX 來取代頁面，因為題目要求保留既有渲染結構。

**問題 2：為何不直接把 Effect callback 宣告成 `async`？**

**解答：** Effect callback 應回傳 cleanup 函式或不回傳值；`async` 函式一定回傳 Promise，不符合這個契約。可在 Effect 內宣告並呼叫一個 async 函式，並在 try/catch/finally 中維護資料、錯誤與載入狀態。

**問題 3：URL 快速變更時，這個基礎 Hook 還缺什麼？**

**解答：** 需要防止舊請求晚回來覆蓋新 URL 的結果，做法可沿用第 13 題的失效旗標或 `AbortController`。也應在新請求開始時定義舊資料是否保留、錯誤何時清空；只有抽出重複碼並不足以保證資料正確。

書中這題的核心是把重複的資料請求生命週期抽成 Hook。它應使用 `use` 開頭、遵守 Hook 呼叫規則，並回傳資料、錯誤與 loading；不是因為「函式裡有 fetch」就自動成為 Custom Hook。

先訂好契約：`useFetch(url)` 在 URL 改變時重新請求，回傳 `{ data, error, loading }`。`url` 無值時不請求；收到非 2xx 要視為錯誤；上一個 URL 的請求不能覆蓋新資料。

```jsx
function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: false });

  useEffect(() => {
    if (!url) {
      setState({ data: null, error: null, loading: false });
      return;
    }

    const controller = new AbortController();
    setState({ data: null, error: null, loading: true });
    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, error: null, loading: false });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setState({ data: null, error, loading: false });
        }
      });
    return () => controller.abort();
  }, [url]);

  return state;
}
```

元件使用時依 `loading/error/data` 分支呈現，不應讓 Hook 決定 UI。若面試題還要求 `refetch`，需設計一次明確的重試觸發值；不要宣稱上面這個版本已支援它。正式產品還要考慮快取、重試、SSR、request deduplication；這道題先驗證抽象邊界與正確的非同步生命週期。

#### Hook 與元件的責任邊界

```jsx
function UserCard({ userId }) {
  const { data, error, loading } = useFetch(`/api/users/${userId}`);
  if (loading) return <p>讀取中…</p>;
  if (error) return <p role="alert">讀取失敗：{error.message}</p>;
  if (!data) return <p>尚無資料</p>;
  return <article><h2>{data.name}</h2></article>;
}
```

`useFetch` 管請求生命週期，`UserCard` 決定呈現方式。若把 JSX、卡片標題、空狀態字串也寫進 Hook，這個 Hook 就很難給列表或其他元件重用。反過來，若元件仍要自己維護 abort、loading、error，抽出 Hook 的價值也有限。

**自己試：** 把 `userId` 從 1 快速切成 2，再切回 1，觀察過期回應是否能覆蓋目前資料。再讓 API 回 404，確認會顯示錯誤而非把錯誤回應當成功資料。這能同時檢驗第 11、13 題的概念是否真的封裝進 Hook。

### 25｜實作簡易分頁

#### 原書逐頁重點（書頁 177–185）

- **177–179 頁：先理解 API 契約。** `fetchUsers(page)` 回傳本頁 `users` 與布林 `hasMore`。頁面要有載入提示、上一頁與下一頁；第一頁不可再往前，沒有更多資料時不可再往後。
- **180–182 頁：讓頁碼驅動請求。** 保存 `page`、`users`、`loading`、`hasMore`，在 page 改變時透過 Effect 取得對應資料，並以使用者 id 當清單 key。載入狀態要與空清單分開處理，避免把正在請求誤判成沒有資料。
- **183–185 頁：最後完成邊界與按鈕。** 按鈕事件只更新頁碼；第一頁和最後一頁依條件 disabled。原書把需求拆成資料、呈現、操作三段，讓面試者能先交付可運作版本，再補充請求錯誤與快速切頁的保護。

#### 先想問題，再看解答

**問題 1：`fetchUsers(page)` 已回傳 `users` 和 `hasMore`，頁面應存哪些值？**

**解答：** 至少保存目前 `page`、本頁 `users`、是否載入中的 `loading`，以及 API 回傳的 `hasMore`。頁碼改變時再取資料；`hasMore` 表示下一頁可否前進，不必猜測「本頁剛好有五筆就一定還有下一頁」。

**問題 2：上一頁和下一頁何時禁用？**

**解答：** 第一頁禁用上一頁；`hasMore` 為 false 時禁用下一頁。載入中也可先禁用按鈕，避免連點建立互相競爭的請求。頁碼狀態要與顯示資料對應，否則按鈕已顯示第二頁，清單卻仍是第一頁，會讓使用者誤解。

**問題 3：按下一頁時應直接修改 `users` 嗎？**

**解答：** 原題是分頁而非追加清單，因此按鈕只更新 `page`，請求回來後以新頁資料取代 `users`。若產品改成「載入更多」或無限捲動，才會把新資料附加到舊清單；兩者的狀態流不同，面試時要先釐清。

先讀 API 契約：它接受 `page`、`offset` 還是 `cursor`？回應是否提供 `total`？書中題目的重點是 Previous/Next 取得對應頁資料，並在邊界禁用。以下用 **1-based page** 與回傳 `{ users, total }` 的 API 示範；若原題 API 不同，應照文件調整。

```jsx
const [page, setPage] = useState(1);
const [result, setResult] = useState({ users: [], total: 0 });
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const pageSize = 10;
const totalPages = Math.ceil(result.total / pageSize);
const canPrevious = page > 1;
const canNext = page < totalPages;
```

切頁時用 `setPage((p) => p + 1)` 或 `p - 1`，不要直接修改 `page`。以 `page` 為依賴發送請求，並參照第 13 題取消或忽略過期回應。

```jsx
useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  setError(null);
  fetchUsers({ page, pageSize, signal: controller.signal })
    .then((next) => {
      if (!controller.signal.aborted) setResult(next);
    })
    .catch((cause) => {
      if (!controller.signal.aborted) setError(cause);
    })
    .finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
  return () => controller.abort();
}, [page]);
```

畫面要用 `loading` 與 `error` 顯示請求狀態。若總筆數因搜尋條件改變而縮小，當前頁可能超出最後一頁；此時要把頁碼調整到合法範圍，或在條件變更時回到第 1 頁。若 API 沒有 total，只能依 `hasNext` 或回傳長度判斷，不能憑空算最後一頁。邊界按鈕要真的設 `disabled`，而非只改顏色。

#### 補上畫面與邊界

```jsx
return <section>
  <h2>使用者清單</h2>
  {loading && <p>載入第 {page} 頁中…</p>}
  {error && <p role="alert">讀取失敗：{error.message}</p>}
  {!loading && !error && result.users.length === 0 && <p>沒有資料</p>}
  {!loading && !error && <ul>
    {result.users.map((user) => <li key={user.id}>{user.name}</li>)}
  </ul>}
  <button disabled={loading || !canPrevious}
    onClick={() => setPage((p) => p - 1)}>Previous</button>
  <span>第 {page} 頁／共 {Math.max(1, totalPages)} 頁</span>
  <button disabled={loading || !canNext}
    onClick={() => setPage((p) => p + 1)}>Next</button>
</section>;
```

這段與前面兩個片段合起來才是一個分頁元件的骨架。若請求失敗，是否保留上一頁清單或清空，應由產品行為決定，不能讓舊資料在沒有標示的情況下假裝是新頁。當 `total=0` 時，畫面可顯示「0 筆資料」而不是硬說有第 1 頁；上例使用 `Math.max(1, totalPages)` 只是為了避免顯示「第 1 頁／共 0 頁」，產品可改成空狀態時不顯示頁碼。

### 26｜點擊畫面時在該處產生表情符號（第一階段）

#### 原書逐頁重點（書頁 186–194）

- **186–188 頁：先拆需求與限制。** 頁面點擊任何位置都產生隨機水果表情，舊表情保留；樣式與表情的 `<span>` 結構已有要求，容器也已設定定位，不應為解題改動預先提供的 CSS。
- **189–191 頁：保存每次點擊產物。** 書中將每個表情的 id、字元與座標放入陣列 state，點擊時抽取隨機水果並加入新項目；再由獨立 Emoji 元件接收資料、繪製列表。這比直接把 DOM 節點塞進頁面，更符合 React 的資料驅動畫面。
- **192–194 頁：核對座標系。** 點擊事件給出的 `clientX/clientY` 是視窗座標，絕對定位子元素的 `left/top` 卻相對定位容器；原書示例在顯示時需修正表情的偏移。實務上若容器不在視窗原點，也要扣除容器矩形的位置，才能讓點擊點與表情中心對齊。

#### 先想問題，再看解答

**問題 1：多次點擊後要讓舊表情仍留在畫面，state 應長什麼樣子？**

**解答：** 用陣列保存每次點擊建立的項目，每筆含穩定 id、選中的水果、x 與 y。點擊時以函式更新把新項目加到舊陣列，而不是只保存「目前一個表情」；render 再 `map` 成 Emoji 元件。

**問題 2：為何直接把 `clientX` 放進絕對定位的 `left`，表情可能不在點擊點？**

**解答：** `clientX` 相對瀏覽器視窗，`left` 通常相對最近的定位容器。若容器距視窗左側 100px，點擊的 clientX 是 160px，容器內座標應是 60px。用容器的 `getBoundingClientRect()` 相減，再考慮圖案寬高或 `translate(-50%, -50%)` 讓中心對準點擊處。

**問題 3：隨機表情與 id 應在何時產生？**

**解答：** 都在點擊事件發生時產生並存入資料。若在 render 內重抽水果或新建 key，其他 state 更新也可能讓舊表情改樣或重掛載。隨機結果屬於那次點擊的資料，不應是每次畫面計算的副產品。

這題看似只要一個 click handler，真正要先想的是**座標系**。`event.clientX/clientY` 是相對視窗；絕對定位子元素若以容器為參考，就要扣掉容器的 `getBoundingClientRect().left/top`。容器必須有 `position: relative`。

每個 emoji 建立 `{ id, x, y, symbol }`；多次點擊需要保存多筆，因此用陣列 state。id 在事件發生時建立，不能在 render 時重建。

```jsx
function handleClick(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  setEmojis((items) => [...items, {
    id: crypto.randomUUID(),
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    symbol: '✨',
  }]);
}

return <div className="emoji-stage" onClick={handleClick}>
  {emojis.map((item) => <span key={item.id} className="emoji"
    style={{ left: item.x, top: item.y }}>
    {item.symbol}
  </span>)}
</div>;
```

```css
.emoji-stage { position: relative; min-height: 20rem; }
.emoji { position: absolute; pointer-events: none; }
```

`pointer-events: none` 可避免再次點擊 emoji 時事件目標改變。若希望圖案中心落在點擊位置，可用 CSS `transform: translate(-50%, -50%)`。若題目要支援觸控、捲動或有邊框的容器，還需核對座標來源與定位基準。

#### 手算一次座標，避免碰運氣調 CSS

假設容器左上角在 viewport 的 `(100, 200)`，使用者點在 `(160, 245)`，那麼 emoji 相對容器的位置應是 `(60, 45)`。`clientX/clientY` 與 `getBoundingClientRect()` 都使用 viewport 座標，所以可以直接相減。若混用 `pageX/pageY`（包含頁面捲動）與 `getBoundingClientRect()`（不包含頁面捲動），捲動後就會偏移。

不要用陣列長度當 id：移除、重設後長度可能重複，React key 與刪除目標都會變得不可靠。點擊事件若綁在包含其他按鈕的容器上，子按鈕點擊也會冒泡而新增 emoji；可限制互動區域，或根據事件目標決定是否處理。

**自己試：** 把容器放在頁面下方並先捲動再點擊四角。若四個 emoji 都落在點擊處，座標系大致正確；只在頁面頂部正確，通常代表混用了 viewport 與 document 座標。

### 27｜延遲啟動與全域暫停表情動畫（第二階段）

#### 原書逐頁重點（書頁 195–204）

- **195–197 頁：在第一階段上追加三項要求。** 每個新表情出現約兩秒後套用提供的 heartbeat 動畫；頁面按鈕可同時暫停或恢復所有表情動畫；點按按鈕本身不能額外生出表情。
- **198–200 頁：每個 Emoji 管自己的延遲狀態。** 書中讓單一表情元件保存 `animated`，在 Effect 建立 timeout，時間到後改變 class，並在卸載時清理。各表情由各自的掛載時間起算，避免共用一個全域計時器導致新舊表情一起啟動。
- **201–204 頁：父層控制暫停，事件要分流。** App 保存 `paused` 並向每個 Emoji 傳 prop，className 依 `animated` 與 `paused` 決定是否加入動畫 class。按鈕事件阻止冒泡到外層點擊處理器，免得按「暫停」也新增表情。原題到此完成。

#### 先想問題，再看解答

**問題 1：新表情應在何時開始 heartbeat，這個時間由誰管理？**

**解答：** 每個 Emoji 自己在掛載後建立約兩秒的 timeout，時間到才把自己的 `animated` 設為 true。這樣每筆都按各自出現的時間開始動畫；元件若先卸載，Effect cleanup 要清掉 timeout，避免留下工作。

**問題 2：按一次全域暫停，為何不能只改其中一個 Emoji？**

**解答：** 「全部暫停」是整個舞台共享的狀態，應由 App 保存 `paused` 並傳給每個 Emoji。Emoji 將自己的 `animated` 與父層的 `paused` 合併判斷 class：時間到且未暫停才套 heartbeat。再次點按恢復時，已到啟動時間的表情便可重新顯示動畫。

**問題 3：按暫停鈕卻多一個水果，是哪個事件造成的？**

**解答：** 按鈕位於有點擊處理器的外層容器內，click 會向上冒泡，外層把它當成新增表情的點擊。可在按鈕 handler 呼叫 `event.stopPropagation()`，或讓外層只處理真正發生在舞台區域的點擊。這題原要求沒有「動畫後自動刪除表情」，該功能是下文額外延伸。

**原題解題線索：** 每個 Emoji 在掛載後用 Effect 建立約兩秒的 timeout，時間到設定自己的 `animated` 狀態，並在 cleanup 清掉尚未執行的 timeout。父元件保存 `paused`，按鈕切換後以 prop 傳給每個 Emoji；只有 `animated && !paused` 才套用題目給的 heartbeat class。暫停按鈕的 click handler 應呼叫 `event.stopPropagation()`，避免外層容器誤新增表情。

**額外延伸：動畫結束後自動移除。** 以下是筆記另加的長時間使用情境，並非原書第 27 題要求。第一階段只會新增，點擊久了 DOM 會一直累積。若產品要求自動清除，可讓有限次動畫的完成事件決定移除時機；原題提供的 heartbeat 是持續動畫，不能直接用 `animationend` 作為刪除訊號。

```jsx
function removeEmoji(id) {
  setEmojis((items) => items.filter((item) => item.id !== id));
}

{emojis.map((item) => <span key={item.id}
  className="emoji flying"
  style={{ left: item.x, top: item.y }}
  onAnimationEnd={() => removeEmoji(item.id)}>
  {item.symbol}
</span>)}
```

```css
.flying { animation: float-up 700ms ease-out forwards; }
@keyframes float-up {
  to { transform: translate(-50%, -100px); opacity: 0; }
}
```

若動畫設定為無限循環，`animationend` 不會如預期完成。使用 `setTimeout` 也可以，但 timer 應隨元件卸載或重設清除；不要在 render 中建立 timer。快速連點時，穩定 id 讓每個完成事件只移除自己的項目。對偏好減少動態效果的使用者，可用 `prefers-reduced-motion` 簡化動畫，並保證項目仍能移除。

#### 動畫結束事件為什麼比共用計時器清楚

每個表情符號從加入 state 開始各自播放動畫，完成時間也各自不同。`onAnimationEnd` 直接帶著該項目的 id 移除它；不需要維護一個「目前該刪哪個」的共用索引，也不會因前面的項目先移除而讓索引錯位。若動畫可能被 CSS 條件關閉，請設計替代移除方式，例如 reduced-motion 下使用極短但仍會結束的動畫，或使用有清理機制的 timer。

```css
@media (prefers-reduced-motion: reduce) {
  .flying { animation-duration: 1ms; }
}
```

**驗收：** 連點十次後先看到十個不同項目，再逐一消失；等待動畫完成後，React state 陣列與 DOM 都回到空。只讓元素 `opacity: 0` 卻不從 state 移除，長時間使用仍會累積不可見 DOM。

### 28｜讀 API 文件後完成同義字查詢

#### 原書逐頁重點（書頁 205–216）

- **205–207 頁：需求要從文件補齊。** 原題只有輸入框與搜尋按鈕，要求使用者輸入單字後列出同義字，並可點其中一個詞再查一次。書中特別要求自行查閱 Datamuse API 文件、不得使用其他第三方套件，也不必改動預先提供的樣式。
- **208–210 頁：確認實際 API 契約。** 書中找到 Datamuse `words?rel_syn=...` 的查詢方式，回應是物件陣列，每筆有 `word` 與 `score`；因此顯示清單時應讀 `word`，不能假設 API 回傳字串陣列。使用者輸入需編碼，空字不應發請求。
- **211–214 頁：分離輸入、請求與結果。** 書中以 `useFetchSynonyms` 包裝按需觸發的請求，保存 synonyms 與 loading，頁面在表單提交時查詢，點同義字後再以該詞發起新查詢。這裡是「點擊時查」，不必因 input 每次變動而立刻請求。
- **215–216 頁：空結果也是完成標準。** 首次尚未搜尋與搜尋後沒有同義字是兩個不同狀態；書中增加是否已搜尋的判斷，才在後者顯示查無結果。若網路失敗，正式產品還應給可辨識的錯誤與重試入口。

#### 先想問題，再看解答

**問題 1：不熟悉 API 時，動手前要從 Datamuse 文件確認什麼？**

**解答：** 確認同義字參數是 `rel_syn`、請求 URL 如何帶入輸入詞、成功回應是物件陣列而非字串陣列，以及要顯示的欄位是 `word`。例如回應項目還可能有 `score`，但題目只要求顯示詞。先用一個已知單字試請求，再決定 state 與渲染寫法。

**問題 2：搜尋按鈕與點某個結果，應走兩套請求邏輯嗎？**

**解答：** 不必。兩者都只是決定「下一個要查的詞」，然後呼叫同一個查詢函式；點結果時先把該詞放回輸入框，再查它的同義字。共用流程能讓 loading、錯誤與舊請求處理一致。

**問題 3：空結果為何不能一開始就顯示「查無同義字」？**

**解答：** 初始的空陣列代表尚未搜尋，不代表 API 已確認沒有結果。書中用是否完成搜尋區分兩者；查詢中顯示 loading，查詢完成且清單仍空，才顯示查無結果。若請求失敗，也不應把失敗誤當成真的沒有同義字。

這題測的是**先讀契約再寫程式**。不要憑想像認定 API 一定叫 `synonyms`、一定回傳字串陣列。先從文件記下 URL、HTTP 方法、必要參數、成功回應欄位、空結果、錯誤狀態與請求限制，再用一筆已知資料確認 schema。

原書使用 Datamuse 的 `rel_syn` 參數，回傳項目含 `word` 欄位。可先把 API 資料轉成畫面需要的字串清單：

```jsx
async function lookupSynonyms(word, signal) {
  const url = `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  if (!Array.isArray(body)) throw new Error('回應格式不符');
  return body.filter((item) => typeof item.word === 'string')
    .map((item) => item.word);
}
```

輸入框文字與已提交的查詢可以分開：只有按下搜尋才請求；查詢前 `trim()`，空字不送；清楚呈現 loading、無結果、錯誤與成功結果。多次快速搜尋要取消或忽略舊回應。

**驗收情境：** 空白輸入、含空格或特殊字元、無同義字、伺服器錯誤、慢請求之後又搜尋新字。面試時先講清楚契約與狀態流，會比直接貼一段 fetch 更能展示解題能力。

#### 從文件到畫面的完整資料流

```text
使用者輸入 draft
  → 按搜尋，trim 並驗證
  → 形成 submittedWord
  → 發出請求，狀態設為 loading
  → 驗證 HTTP 與回應格式
  → success：顯示同義字或「查無結果」
  → error：顯示可重試的錯誤
```

將輸入草稿和已送出的字分開，能避免使用者打到一半就改變既有結果的標題。對使用者輸入應使用 `encodeURIComponent`；Datamuse 回應是 `{ word, score }[]`，上面的函式把它轉為 `string[]`。若改成輸入即查，才需要評估 debounce；若換用需要 API key 的服務，還要確認金鑰是否能放在瀏覽器端。

**面試中的說明方式：**「我先確認回應 schema 與空結果格式，接著把 loading、成功、無結果、失敗視為不同畫面狀態。提交新查詢會讓上一個結果失效，舊請求不能覆蓋新查詢。」這樣面試官能聽見你如何處理不確定的外部契約。

#### 用「按搜尋才請求」完成畫面骨架

下面沿用前面的 Datamuse `lookupSynonyms` 函式。若面試題改用其他 API，先核對端點與回應形狀，再保留相同的畫面狀態流程。

```jsx
function SynonymSearch() {
  const [draft, setDraft] = useState('');
  const [searchedWord, setSearchedWord] = useState('');
  const [words, setWords] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  async function handleSubmit(event) {
    event.preventDefault();
    const word = draft.trim();
    if (!word) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setSearchedWord(word);
    setWords([]);
    setError(null);
    setStatus('loading');

    try {
      const nextWords = await lookupSynonyms(word, controller.signal);
      if (!controller.signal.aborted) {
        setWords(nextWords);
        setStatus('success');
      }
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause);
        setStatus('error');
      }
    }
  }

  return <section>
    <form onSubmit={handleSubmit}>
      <input aria-label="查詢字" value={draft}
        onChange={(event) => setDraft(event.target.value)} />
      <button type="submit">搜尋</button>
    </form>
    {status === 'loading' && <p>查詢中…</p>}
    {status === 'error' && <p role="alert">{error.message}</p>}
    {status === 'success' && <>
      <h2>{searchedWord} 的同義字</h2>
      {words.length === 0 ? <p>查無結果</p> :
        <ul>{words.map((word) => <li key={word}>{word}</li>)}</ul>}
    </>}
  </section>;
}
```

這裡同義字以字串當 key，前提是 API 保證結果不重複；若可能重複，須按回應提供的穩定 id 或在資料整理階段去重。新搜尋會先 abort 舊請求，舊結果不能更新畫面。重試同一字只要再次提交即可，因為請求由事件啟動，而非只靠某個字串依賴變化。

### 29｜井字遊戲

#### 原書逐頁重點（書頁 217–227）

- **217–219 頁：把規格列成可驗收情境。** 兩位玩家 X、O 輪流，畫面顯示輪到誰；有人連成三格就宣告勝者、停止接收落子，重新開始要清空棋盤並回到 X。原書的起始碼有 9 格陣列與回合 state。
- **220–222 頁：先完成不可變落子。** 點擊已填過的格子不處理；其餘情況複製棋盤，填入當前玩家符號，再設定棋盤並切換回合。直接修改原陣列會重演第 1 題的 state 參考問題。
- **223–225 頁：勝負從棋盤推導。** 列出八種橫、直、斜的勝利組合，逐一檢查三格是否有相同且非空的符號。畫面的勝利訊息由目前棋盤推導，點格前也要先檢查是否已有人獲勝。
- **226–227 頁：完成 reset。** 重設時同時建立新的九格空棋盤與恢復 X 先手；書中用這個實作提醒面試者先交出符合規格的版本，再討論進一步的平手判斷或抽象化。

#### 先想問題，再看解答

**問題 1：點格子時，哪兩種情況應立即忽略？**

**解答：** 格子已有 X 或 O 時不可重複落子；棋盤已有勝者時不可繼續下。先做這兩個守衛，再複製棋盤、填入目前玩家、更新 state 與切換回合，才能避免覆蓋棋子或勝負已定卻繼續遊戲。

**問題 2：如何判斷贏家，而不為八條線各存一個 state？**

**解答：** 列出三橫、三直、兩斜的八組索引，逐組檢查三格是否都非空且相同；找到就回傳該符號，否則回傳沒有贏家。勝者是棋盤資料的推導值，棋盤更新後重新計算即可，避免另一份 state 與棋盤不同步。

**問題 3：Reset 除了清空畫面，還必須重設什麼？**

**解答：** 重新建立九個空格的陣列，並把下一位玩家恢復成 X。若只清空 DOM 或只清棋盤，回合提示與下一次落子可能沿用上一局。若產品還顯示平手訊息，也要在新局從新棋盤推導或同步清除。

把棋盤視為 9 格陣列。若遊戲固定由 X 先手且每次合法落子都輪流，下一位玩家、勝者與平手都可由棋盤**推導**，不必另存可能與棋盤矛盾的 state。勝利只有 8 條線：3 橫、3 直、2 斜。

```jsx
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinner(cells) {
  for (const [a, b, c] of LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}
```

事件處理時先擋掉不合法操作，再建立新棋盤。要小心連續快速點擊：若把棋盤與玩家拆成兩個 state，事件閉包可能都讀到同一個舊玩家。較穩妥的最小模型是只存 `board`，由已下棋步數推導下一位玩家。

```jsx
const [board, setBoard] = useState(Array(9).fill(null));
const winner = findWinner(board);
const nextPlayer = board.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
const isDraw = !winner && board.every(Boolean);

function handleClick(index) {
  setBoard((cells) => {
    if (cells[index] || findWinner(cells)) return cells;
    const player = cells.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
    return cells.map((cell, i) => i === index ? player : cell);
  });
}
```

render 時先判斷 `winner`，再判斷 `isDraw`，否則顯示 `nextPlayer`。Reset 執行 `setBoard(Array(9).fill(null))`。每格可用 button，使鍵盤操作天然可行，並用 `aria-label` 說明格子座標與內容。

**驗證：** 八條連線、平手、不能覆蓋已下格、勝利後不能繼續、重設後 X 先手。

#### 將規則與畫面分開

`findWinner` 是純函式：相同棋盤一定回傳相同結果，不讀 DOM、不呼叫 setter。`handleClick` 只處理一個合法落子狀態轉移。render 則根據 `winner`、`isDraw` 和 `nextPlayer` 選一個訊息：

```jsx
const message = winner
  ? `贏家：${winner}`
  : isDraw
    ? '平手'
    : `輪到：${nextPlayer}`;

return <>
  <p role="status">{message}</p>
  <div className="board">
    {board.map((cell, index) => <button
      key={index} // 固定九格位置，不會插入、刪除或重排
      aria-label={`第 ${Math.floor(index / 3) + 1} 列第 ${index % 3 + 1} 欄：${cell ?? '空白'}`}
      disabled={Boolean(cell) || Boolean(winner) || isDraw}
      onClick={() => handleClick(index)}
    >{cell}</button>)}
  </div>
  <button onClick={() => setBoard(Array(9).fill(null))}>重新開始</button>
</>;
```

這裡 `key={index}` 可以接受，因為九個按鈕代表**固定棋盤位置**，沒有排序或增刪；它與第 16 題可移動資料列的情況不同。若之後加入歷史紀錄與「回到第 N 手」，只存當前棋盤就不夠，資料模型需改成歷史棋盤陣列與當前步數；需求變了，最小 state 也會改變。

### 30｜翻牌配對遊戲

#### 原書逐頁重點（書頁 228–239）

- **228–230 頁：先讀清楚配對規則。** 12 張背面朝上的卡片由 6 對字母洗牌而成；一次最多翻兩張。相同則保持翻開，不同則約 500 毫秒後蓋回；六對都完成時顯示勝利訊息。起始檔已含卡片結構與 CSS class，不需重寫樣式。
- **231–233 頁：把顯示狀態與資料分開。** 原書的起始狀態有卡片內容、目前翻開的卡、正在檢查的兩張及已配對索引。`flip` 與 `matched` class 依狀態決定，卡背字母只有在翻開或配對時可見。洗牌操作不可直接改動共享的原始陣列。
- **234–236 頁：落實點擊守衛。** 已翻開、已配對或正在等待兩張卡判定時，不應接受會破壞回合的第三次點擊。翻牌時產生新的狀態，記錄選中的索引；這些規則比翻轉動畫本身更能決定遊戲是否正確。
- **237–239 頁：完成配對與結束判斷。** 兩張卡相同就標記已配對；不同則在短暫展示後重新蓋上，相關 timeout 需考慮卸載清理。當已配對卡數達 12，從狀態推導勝利訊息。原書解法用 Effect 處理兩張卡的判定與延遲。

#### 先想問題，再看解答

**問題 1：一開始就有 12 張牌，為何還要分 `cards`、`flipped`、`completed`？**

**解答：** `cards` 是固定的牌面順序；`flipped` 記錄這回合暫時翻開的牌；`completed` 記錄已成功配對、之後要一直朝上的牌。把資料與顯示狀態分開，才能在不改牌面值的情況下翻牌、蓋牌與顯示勝利。

**問題 2：兩張不相同時，為何不能立刻蓋回？**

**解答：** 玩家需要短暫看見第二張牌才有記憶遊戲的意義。原題要求約 500 毫秒後才把兩張暫時翻開的牌復原；等待期間應阻止第三次點擊，否則尚未判定完的兩張卡會與新卡混在一起。timeout 若在元件卸載前尚未完成，也應清理。

**問題 3：何時宣告勝利？用「翻開兩張相同」就可以嗎？**

**解答：** 不行，翻對一組只完成兩張。每次配對成功，把該組加入 `completed`；當完成的卡數達 12，代表六對都已找到，才顯示 `You Win!`。勝利訊息可由完成清單長度推導，避免另外存一個可能忘記更新的布林值。

依書中題意，初始有 12 張背面朝上的卡，組成 6 對。這題的難點是**第二張牌翻開後的等待期間**：不能再翻第三張，也不能讓舊 timer 在重新開始後改動新遊戲。

每張卡有唯一 `id` 與可重複的 `symbol`；`matchedIds` 保存已配對卡片，`selectedIds` 保存本回合最多兩張牌。`locked` 表示正在等待比對結果。只有 id 可以當 React key，因為一對卡的 symbol 必然相同。

洗牌時先複製資料再做 Fisher–Yates，避免原地修改 state：

```jsx
function shuffle(cards) {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

**回合流程：**

1. 點擊已配對或已翻開卡片時忽略。
2. 第一張加入 `selectedIds`；第二張加入後立刻鎖住輸入。
3. 比較兩張的 symbol；相同就加入 `matchedIds`，不同就短暫展示後翻回。
4. 清空 `selectedIds` 並解除鎖定；六對全部完成時顯示成功。

```jsx
function chooseCard(card) {
  if (locked || matchedIds.includes(card.id) || selectedIds.includes(card.id)) return;
  if (selectedIds.length === 0) {
    setSelectedIds([card.id]);
    return;
  }

  const first = cards.find((item) => item.id === selectedIds[0]);
  setSelectedIds([first.id, card.id]);
  setLocked(true);

  if (first.symbol === card.symbol) {
    setMatchedIds((ids) => [...ids, first.id, card.id]);
    setSelectedIds([]);
    setLocked(false);
  } else {
    timerRef.current = setTimeout(() => {
      setSelectedIds([]);
      setLocked(false);
      timerRef.current = null;
    }, 800);
  }
}
```

這段核心邏輯假設元件另有 `cards`、`matchedIds`、`selectedIds`、`locked` state，以及 `const timerRef = useRef(null)`。重新開始與卸載時都應 `clearTimeout(timerRef.current)`；重新開始要重新洗牌並清空三份回合狀態。更複雜的版本可用 reducer 把「選第一張、選第二張、比對完成、重設」表示成明確 action，避免多個 setter 漏掉其中一步。

**驗證：** 同張牌連點無效、第三張在等待期間無效、配對成功保持正面、失敗翻回、重設後舊 timer 不再作用、12 張全部配對才顯示完成。先把這些狀態轉移說清楚，再寫畫面會更穩。

#### 把互動視為有限狀態，而非一串 if

| 階段 | 翻開張數 | 可否選牌 | 下一步 |
| --- | ---: | --- | --- |
| 等待第一張 | 0 | 可以 | 記錄第一張 |
| 等待第二張 | 1 | 可以，但不能選同張 | 記錄第二張並鎖定 |
| 展示結果 | 2 | 不可以 | 比對、短暫展示 |
| 回合結束 | 0 | 可以 | 已配對保持正面，其餘背面 |

上面的 `selectedIds` 和 `locked` 可實作這四個階段，但彼此有約束：`locked=true` 時通常應有兩張本回合卡。若需求繼續增加，將階段直接表示為 `phase: 'first' | 'second' | 'resolving'`，搭配 reducer 的 action，會比三個可自由組合的 state 更不容易進入非法狀態。

重設時若只清空 `selectedIds`，舊的 timeout 仍可能在新遊戲開始後執行 `setLocked(false)`。正確做法是先清除 timer，再建立新牌、清空 matched/selected 並解除鎖定。卸載時也要清 timer：

```jsx
useEffect(() => () => clearTimeout(timerRef.current), []);

function resetGame() {
  clearTimeout(timerRef.current);
  timerRef.current = null;
  setCards(createShuffledDeck());
  setSelectedIds([]);
  setMatchedIds([]);
  setLocked(false);
}
```

`createShuffledDeck()` 要為每張卡建立唯一 id，再把六種 symbol 各放兩張後洗牌。遊戲結束可用 `matchedIds.length === cards.length` 推導，不需再存一份 `won` state。這些設計讓重設、快速連點與最後一對完成時的行為都有清楚答案。

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

- [王介德（Danny Wang），《React 求職特訓營》電子書](https://reading.udn.com/onlineViewer/2BpdfViewer/239868)：依其四章、30 題主題對照；本文的說明與程式碼為重新撰寫。
- [udn 書籍介紹與完整目錄](https://reading.udn.com/udnlib/fju/B/239868)：核對題目順序與主題。
- [作者第 15 屆 iThome 鐵人賽公開系列](https://ithelp.ithome.com.tw/2020-12th-ironman/articles/6741)：原書改編來源。
- React 官方文件：[State 更新佇列](https://react.dev/learn/queueing-a-series-of-state-updates)、[與 Effect 同步](https://react.dev/learn/synchronizing-with-effects)、[列表與 key](https://react.dev/learn/rendering-lists)、[memo](https://react.dev/reference/react/memo)、[useMemo](https://react.dev/reference/react/useMemo)、[useCallback](https://react.dev/reference/react/useCallback)。
