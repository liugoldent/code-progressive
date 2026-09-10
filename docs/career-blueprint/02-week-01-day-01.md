---
sidebar_position: 2
sidebar_label: "2. 第 1 週 Day 1"
slug: "/career-blueprint/week-01-day-01"
title: "第 1 週 Day 1：Contains Duplicate、React 更新模型與需求澄清"
description: "Amazon、Binance、台積電與聯發科面試準備日課：Contains Duplicate、React Trigger／Render／Commit、state snapshot、source of truth，以及 System Design functional／non-functional requirements。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - React
  - System Design
keywords: ["Contains Duplicate", "Arrays and Hashing", "React Trigger Render Commit", "state snapshot", "source of truth", "functional requirements", "non-functional requirements", "面試準備"]
---

# 第 1 週 Day 1：Arrays & Hashing I

> 練習日期：2026-09-05  
> 今日總時數：140 分鐘  
> 對應目標：Amazon、Binance、台積電、聯發科面試共同核心

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。原有程式實作與口述練習仍依各節執行。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：讀懂 Contains Duplicate 題目與 constraints，先說出暴力解，再閉卷完成最佳化實作、測試 edge cases、說明 Big-O。
- [ ] **React 主線｜50 分鐘**：能用自己的話解釋 Trigger → Render → Commit、state snapshot、source of truth。
- [ ] **收尾｜10 分鐘**：留下卡點，並把未完成內容改寫成週末可直接執行的補課項目。
- [ ] **System Design × 高併發｜20 分鐘**：能區分 functional／non-functional requirements，至少完成一項主動產出。

建議依照固定訓練時段執行：

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Contains Duplicate | 程式碼、測資、Big-O、卡點 |
| 21:30–22:20 | React 更新心智模型 | 三題口述答案與一題預測輸出 |
| 22:20–22:30 | 收尾 | 卡點與週末補課清單 |
| 22:30–22:50 | System Design | 小圖／三個數字／failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：Contains Duplicate（60 分鐘）

完整的三階段題解已獨立放到 LeetCode 筆記區：

**[開始 LeetCode 217｜Contains Duplicate 練習](/docs/algorithms/leetcode/f0201-0300/l0217-contain-duplicate)**

> 先從該頁的 Stage A 開始並計時。完成閉卷實作前，不要往下看 Stage B。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與 constraints | 用一句話重述 Input／Output |
| 5–15 | 自訂測資與暴力解 | 說出正確性與 Big-O |
| 15–25 | 從瓶頸推導 Pattern | 先寫三句解題計畫 |
| 25–40 | 閉卷實作 | TypeScript 與 Python 程式碼 |
| 40–50 | Edge cases 與測試 | 至少跑 7 組測資 |
| 50–60 | 回看分析與口述 | Invariant、時間／空間複雜度 |

### 今日驗收

- [ ] 沒看 Stage B 就先寫出第一個直覺與暴力解。
- [ ] 能指出暴力解的重複操作，而不只背 Pattern 名稱。
- [ ] 能閉卷完成最佳化 TypeScript 與 Python 實作。
- [ ] 能解釋 edge cases、invariant 與 Big-O。
- [ ] 已在本頁勾選實際進度與補課項目。

---

## Part 2｜React 主線（50 分鐘）

### 今日目標

完成後，不看筆記回答：

1. 什麼會 trigger 一次 React render？
2. Render 和 Commit 各自做什麼？
3. 為什麼呼叫 setter 後，當前 event handler 裡的 state 仍是舊值？
4. 如何判斷 state 應該放在哪個 component？
5. 為什麼 derived data 通常不應再存一份 state？

### 1. Trigger → Render → Commit

```txt
Trigger
  初次掛載／state 更新／parent render／context 或 external store 更新
    ↓
Render
  React 呼叫 component function
  讀取這次的 props、state、context snapshot
  計算下一棵 React element tree
    ↓
Reconciliation
  比較前後 element tree，決定哪些變更需要落地
    ↓
Commit
  套用必要 DOM 變更、處理 ref 與 layout effects
    ↓
Browser Paint
  瀏覽器把結果畫成像素
```

三個不能混淆的句子：

- **Render 是計算，不等於重建整頁 DOM。**
- **Commit 才把必要變更套用到真實 DOM。**
- **Browser paint 是瀏覽器畫像素，不是 React render。**

Render 必須保持 pure。不要在 component body 中建立 WebSocket、啟動 timer、修改既有 props/state，因為 React 可能重跑、暫停或放棄尚未 commit 的 render。

### 2. State 是一次 Render 的 Snapshot

每次 render 都拿到該次固定的 state 值。Event handler 也屬於產生它的那次 render：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

第一次點擊時，三行讀到的 `count` 都是同一個 snapshot `0`，因此都要求下一次變成 `1`，不是依序變成 `1、2、3`。

如果每次更新都依賴前一次排隊後的結果，使用 updater function：

```tsx
setCount((previous) => previous + 1);
setCount((previous) => previous + 1);
setCount((previous) => previous + 1);
```

這時 React 依序把 updater 套用到 pending state，下一次 render 得到 `3`。

面試說法：

> Calling a state setter schedules an update; it does not mutate the state variable captured by the current render. Each render sees a snapshot. When the next value depends on the previous queued value, I use the functional updater form.

### 3. Source of Truth

Source of truth 是某份資料真正由誰擁有與更新。原則不是「所有東西都放全域」，而是：

- 一份概念資料應有一個權威來源。
- 需要共同讀寫它的元件，將 state 提升到最近的共同 owner。
- 能從 props/state 在 render 算出的值，通常不要再存成另一份 state。
- Server state、global client state、local UI state 的 ownership 不相同，不要混成一個大 store。

#### 錯誤方向：同步兩份可推導 state

```tsx
function OrderForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notional, setNotional] = useState(0);

  useEffect(() => {
    setNotional(Number(price) * Number(quantity));
  }, [price, quantity]);

  // ...
}
```

`notional` 完全可由 `price` 與 `quantity` 推導。另存 state 會增加同步點、一次額外 render，並可能短暫顯示舊值。

#### 較好的方向：Render 時推導

```tsx
function OrderForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const notional = Number(price) * Number(quantity);

  // ...
}
```

這裡：

- `price` 的 source of truth 是 `OrderForm` 的 state。
- `quantity` 的 source of truth 是 `OrderForm` 的 state。
- `notional` 不是另一份 source of truth，而是當次 render 的 derived value。

### 4. 判斷 State Owner 的四個問題

遇到一份資料，依序問：

1. 它會隨時間改變，而且畫面需要因它更新嗎？不是的話可能不需要 state。
2. 它能否由現有 props 或 state 算出？可以的話在 render 推導。
3. 哪些元件需要讀取它？
4. 哪些元件需要修改它？把 state 放在能涵蓋這些讀寫者的最近共同 owner。

例子：搜尋框和結果列表都需要 `query`，那麼 `query` 應由兩者最近的共同 parent 擁有；input 接收 `value` 和 `onChange`，成為 controlled component。

### 5. 口述與閉卷檢查

先遮住答案：

#### 題目 A

使用者點擊按鈕，`setState` 被呼叫後，從 Trigger 到畫面更新發生什麼？

**單選｜React 從 setter 到畫面更新，哪個順序正確？**

- [ ] A. Setter 直接改 DOM，之後才呼叫元件。
- [ ] B. 安排更新 → render 計算 UI → commit 必要 DOM 變更 → browser paint。
- [ ] C. 每次 render 都刪除整頁 DOM，再重建所有節點。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** Render 負責計算，commit 才套用必要變更；元件執行不代表整頁 DOM 重建。

</details>

<details>
<summary>參考回答</summary>

Setter 將更新排入 React 並 trigger 新 render。React 重新呼叫相關 component，用新一輪 state snapshot 計算 element tree，經 reconciliation 找出差異，再於 commit 階段把必要變更套用到 DOM。最後瀏覽器 paint；component function 被重跑不代表整頁 DOM 都被重建。

</details>

#### 題目 B

預測第一次點擊後的畫面，並說出理由：

```tsx
const [score, setScore] = useState(0);

function handleClick() {
  setScore(score + 1);
  console.log(score);
}
```

**單選｜第一次點擊後，下一次畫面與當次 console 分別是什麼？**

- [ ] A. 畫面 1、console 1；setter 立即改掉區域變數。
- [ ] B. 畫面 1、console 0；handler 仍使用目前快照。
- [ ] C. 畫面 0、console 0；setter 完全沒有效果。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** setScore(score + 1) 安排下一次 state 為 1，但目前 handler 的 score 仍是 0。

</details>

<details>
<summary>參考回答</summary>

下一次 render 的畫面是 `1`，但當次 handler 的 console 是 `0`。Setter 安排下一次 render，不會修改目前 render 已捕捉的 `score` snapshot。

</details>

#### 題目 C

`firstName`、`lastName`、`fullName` 是否都應該存 state？

**單選｜fullName 只由 firstName 和 lastName 組合而成，應如何保存？**

- [ ] A. 三者都存 state，再用 effect 同步。
- [ ] B. 只保存 fullName，任何名字都能無歧義拆回來。
- [ ] C. 保存 firstName、lastName，render 時計算 fullName。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 可推導的資料通常不必另存；如果 fullName 可獨立編輯且語意不同，再重新決定 owner。

</details>

<details>
<summary>參考回答</summary>

通常只保存可被使用者獨立修改的 `firstName` 與 `lastName`。`fullName` 可在 render 用兩者推導，避免兩份資料失去同步。如果 `fullName` 本身是可獨立編輯且有不同商業語意，才可能成為自己的 source of truth。

</details>

### 6. React 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| Trigger 是什麼？ | 初次掛載或 props/state/context/store 變化使 React 安排 render |
| Render 做什麼？ | 呼叫 component，以 snapshot 計算下一個 UI |
| Commit 做什麼？ | 把 reconciliation 決定的必要變更套用到 DOM |
| Setter 會立刻改變變數嗎？ | 不會；它安排更新，當前 render 的 snapshot 不變 |
| 何時用 updater？ | 下一個 state 依賴前一個 pending state 時 |
| Source of truth 是什麼？ | 一份概念資料的權威 owner |
| Derived data 怎麼處理？ | 優先在 render 由既有 props/state 算出 |

延伸閱讀：[React 更新流程與狀態管理](/docs/frontend-interview/binance/react-state-data)

---

## Part 3｜收尾（10 分鐘）

### 今日卡點紀錄

每個主題依實際情況選狀態；需要補課時直接採用對應動作，不必另寫原因。

**Contains Duplicate（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 30 分鐘：重做對應演算法練習並跑測試。

**React（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 20 分鐘：重選更新模型題，再操作計數器或任務列表。

**System Design（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週日 20 分鐘：重選本節設計題，再照框架錄三分鐘口述。


### 明確的週末補課項目

只有今天未完成或無法閉卷重現的項目才移入週末；不要寫「複習 React」這種無法驗收的任務。

- [ ] 週六 30 分鐘：不看解答，從空白寫出 `containsDuplicate`，跑 7 組測資並口述 invariant 與 Big-O。
- [ ] 週六 20 分鐘：錄一段 90 秒口述，解釋 Trigger → Render → Commit，並用一個 state snapshot 範例佐證。
- [ ] 週日 20 分鐘：為即時 Watchlist 重寫 3 條 functional 與 5 條 measurable non-functional requirements。
- [ ] 若以上今天已能閉卷完成：刪除對應補課，不新增進度，讓週末休息。

明日開始前的 retrieval check：

**單選｜Contains Duplicate 兩兩比較最差時間為什麼是 O(n²)？**

- [ ] A. 需要比較約 n(n−1)/2 對元素。
- [ ] B. 只比較 n 次，但每次固定花 n 秒。
- [ ] C. 只要有兩個迴圈就一定是 O(n²)，不用看範圍。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 成本來自實際比較次數；不能只數迴圈層數。

</details>

**單選｜哪一組正確區分功能需求與品質需求？**

- [ ] A. 功能：p95 小於 200 ms；品質：新增標的。
- [ ] B. 功能：使用 Redis；品質：使用 PostgreSQL。
- [ ] C. 功能：新增追蹤標的；品質：讀取 p95 小於 200 ms。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 功能說明使用者能做什麼；品質說明做到什麼程度。這裡的延遲是練習目標。

</details>

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：先澄清需求，再談架構

情境：

> 設計一個即時價格 Watchlist。使用者可以追蹤多個股票或加密貨幣交易對，頁面要顯示初始價格並持續更新。

面試中先不要立刻說 WebSocket、Kafka 或 Redis。先把「系統要做什麼」和「做到什麼品質」問清楚。

### 1. Functional requirements

Functional requirements 描述使用者或系統可以執行的行為：

- 使用者可以新增、刪除與排序追蹤標的。
- 開啟頁面時能取得每個標的的初始價格 snapshot。
- 頁面能接收並顯示即時價格更新。
- 連線異常時顯示 stale／reconnecting 狀態，而不是假裝價格仍是最新。
- 登入使用者可以跨裝置保存 watchlist；訪客是否保存則需要確認。

需要追問：

- 只顯示 last price，還是也要 bid/ask、漲跌幅、成交量？
- 使用者最多可追蹤多少標的？
- 排序是手動順序，還是依漲跌幅動態排序？
- 是否允許訪客使用？跨裝置同步是否必要？
- 斷線恢復後要接受最新 snapshot，還是不能漏掉任何歷史 tick？

### 2. Non-functional requirements

Non-functional requirements 描述品質屬性與限制，最好可衡量：

| 面向 | 練習版需求 |
| --- | --- |
| 規模 | 支援 100,000 concurrent users；每人最多 20 個標的 |
| 新鮮度 | 正常網路下，使用者看到的價格相對 server 接收時間 p95 小於 1 秒 |
| 可用性 | Watchlist 讀取 API 月可用性目標 99.9% |
| UI 效能 | 高頻行情可合併，但單一頁面最多每秒 commit 4 次價格畫面 |
| 一致性 | 價格允許短暫 eventual consistency；使用者自訂 watchlist 不可靜默遺失 |
| 恢復 | reconnect 後先取 snapshot，再接續具 sequence 的增量資料 |
| 安全 | 驗證使用者只能修改自己的 watchlist；API 與 stream 全程加密 |
| 可觀測性 | 追蹤連線數、更新延遲、sequence gap、reconnect rate、stale client 數量 |

> 上表數字是今天用來練習推導的假設，不是 Amazon、Binance 或任何真實公司的內部流量。面試時要先和面試官確認或主動聲明假設。

### 3. 今日主動產出

「主動產出」是把前面讀到的需求，轉成自己能畫、能算、能解釋的設計，留下理解的證據：

- **一張圖**：資料從哪裡來，經過誰，最後到哪裡？
- **三個數字**：多少人使用、每人追蹤多少標的、畫面多久更新一次？
- **一個故障案例**：出事時使用者看到什麼，系統怎麼恢復？

例如「要即時、要支援很多人」還太抽象。畫圖與估算能幫你進一步回答：「價格怎麼送到瀏覽器？一萬人看同一檔股票時怎麼處理？斷線後怎麼避免顯示錯誤資料？」

> 今天至少完成一項主動產出即可，不用第一天就設計完整系統。下方 `[x]` 表示筆記已提供範例，不代表你已完成練習；能不看答案、用自己的話重現，才算自己的產出。

#### [x] 一張小圖

```txt
行情來源
   ↓
Ingestion / Normalization
   ↓
Realtime Fan-out ─────────→ Metrics / Alerts
   ↓
WebSocket Gateway
   ↓
Browser Buffer
   ↓  每秒最多 4 次 UI commit
React Watchlist

Watchlist API ←→ Database
      ↑
   使用者增刪排序
```

這張圖只先畫資料責任與兩條資料流：

- 行情是高頻、可推送、允許合併顯示的 server state。
- 使用者的 watchlist 是低頻但不可靜默遺失的持久資料。

##### 白話拆解：股價與自選清單是兩種資料

假設你追蹤台積電與聯發科，上半部在處理「最新股價怎麼到畫面」：

| 名稱 | 白話意思 |
| --- | --- |
| 行情來源 | 提供最新價格的交易所或資料商 |
| Ingestion / Normalization | 收進資料，把不同來源的欄位與格式整理一致 |
| Realtime Fan-out | 同一筆價格更新，分送給所有追蹤這檔股票的人；fan-out 就是一份輸入分送給多個接收者 |
| Metrics / Alerts | 記錄連線數、延遲與錯誤，異常時通知維運人員 |
| WebSocket Gateway | 維持與瀏覽器的即時連線，把更新推送過去 |
| Browser Buffer | 瀏覽器先暫存更新，避免每收到一筆就更新畫面 |
| React Watchlist | 使用者最後看到的自選清單畫面 |

這些方塊先代表「責任」，不代表每個方塊都要部署成獨立服務。入門版本可以讓同一個後端同時負責接收行情、找訂閱者與透過 WebSocket 分送。

假設短時間收到同一檔股票的價格：

```txt
1000 → 1001 → 1002 → 1003
```

如果需求只要顯示最新價格，瀏覽器可以先保留最新的 `1003`，下次更新畫面時直接顯示，不必把每個中間價格都畫出來。這就是「行情可合併顯示」。這個假設不適用於必須保存每筆成交的交易紀錄。

「每秒最多 4 次 UI commit」是行情畫面的更新預算，目的是避免高頻資料拖慢瀏覽器。它不代表每秒只能收到 4 筆資料，也不是限制按鈕、輸入框等所有 React 互動；實作時可透過批次更新行情 state 控制頻率，並量測實際 commit。

下半部的 `使用者增刪排序 → Watchlist API ←→ Database` 則保存「你追蹤哪些股票，以及排列順序」。例如把聯發科加入清單，重新登入後仍應看得到；寫入失敗時也要告知使用者，不能假裝已保存。

所以兩條資料流各自回答：**價格現在是多少？使用者選了哪些標的？** server state 是由伺服器提供或管理的資料；股價與已保存的個人清單都可以屬於 server state，但更新頻率與保存要求不同。

#### [x] 三個數字

```txt
100,000 concurrent users
20 symbols / user
4 UI commits / second / active page
```

推導：最壞會形成 `100,000 × 20 = 2,000,000` 個邏輯訂閱關係，但不代表 upstream 要建立兩百萬條獨立市場連線。Gateway 應依 symbol 共用上游資料，再 fan out 給訂閱該 symbol 的 clients。

##### 白話拆解：訂閱關係不等於連線數

- `concurrent users`：同時使用的人數，這裡假設是 10 萬人。
- `symbol`：一個行情標的的識別碼，例如用 `TWSE:2330` 表示台積電。
- `subscription`（訂閱）：某個連線希望接收某個標的的更新，不是付費訂閱的意思。
- `upstream`（上游）：相對於我們的後端，提供行情的來源。
- `client`（客戶端）：這裡是使用者的瀏覽器頁面。

假設每人只開一個頁面、每頁使用一條 WebSocket，10 萬人就有約 10 萬條瀏覽器到後端的連線。同一條連線可以承載 20 檔股票的更新，所以最多有 200 萬個「連線追蹤標的」的關係，並不需要 200 萬條 WebSocket。若使用者開多個分頁或裝置，連線數還會增加。

##### 一份台積電行情，到底怎麼分送給一萬人？

先縮小成三個人。假設 A、B 看台積電，C 看聯發科。WebSocket 是瀏覽器與後端之間持續保持的連線，建立後，後端可以主動把資料送給瀏覽器。

**步驟 1：每個瀏覽器建立連線，再告訴後端自己要看什麼。**

例如 A 透過自己的 WebSocket 傳送一個訂閱訊息。以下是我們為練習自行設計的訊息格式，不是 WebSocket 內建指令：

```json
{ "type": "subscribe", "symbols": ["TWSE:2330"] }
```

WebSocket 提供傳送訊息的通道；「subscribe 代表什麼、收到後如何處理」要由應用程式自己定義。

**步驟 2：後端在記憶體維護一張訂閱表。**

```txt
標的              想收到更新的連線
TWSE:2330 台積電 → A 的連線、B 的連線
TWSE:2454 聯發科 → C 的連線
```

可以把它想成 JavaScript 的 `Map<Symbol, Set<Connection>>`：用股票代碼查找一組連線。這張表表示「目前要送給誰」，與資料庫裡長期保存的個人自選清單用途不同。

**步驟 3：後端向上游取得台積電行情，收到一筆更新。**

```json
{ "symbol": "TWSE:2330", "price": "1003.00" }
```

同一份行情可供 A、B 共用。實際上，上游一條連線也可能提供很多標的；需要幾條上游連線，取決於資料商協定、容量與備援需求，不是由觀看人數直接決定。

**步驟 4：查表，透過每個訂閱者的連線各送一份。**

```txt
行情來源
   │ 台積電新價格 1003（一筆更新）
   ▼
我們的後端：查「台積電」的訂閱表
   ├── A 的 WebSocket → A 的瀏覽器
   └── B 的 WebSocket → B 的瀏覽器

C 只訂閱聯發科，因此這次不會收到台積電更新。
```

下面是幫助理解的 JavaScript 示意碼，只呈現分送的核心，不是完整伺服器：

```js
// 訂閱表：每個標的對應一組想接收它的連線。
const subscribersBySymbol = new Map();

function subscribe(socket, symbol) {
  if (!subscribersBySymbol.has(symbol)) {
    subscribersBySymbol.set(symbol, new Set());
  }
  subscribersBySymbol.get(symbol).add(socket);
}

function onMarketUpdate(update) {
  const subscribers = subscribersBySymbol.get(update.symbol);
  if (!subscribers) return;

  const message = JSON.stringify(update);
  for (const socket of subscribers) {
    socket.send(message); // 透過這位訂閱者的連線送出一份。
  }
}
```

一萬人追蹤台積電，就是表裡有一萬條連線，收到行情後向這些連線各送一份。**共用的是上游行情；後端對使用者的分送成本仍然存在。** `send()` 也不代表對方已經收到或畫面已更新。

例如台積電每秒更新 10 次，一萬人都要收到每次更新：

```txt
上游 → 我們的後端：每秒接收 10 筆台積電更新
我們的後端 → 一萬個瀏覽器：每秒約 10 × 10,000 = 100,000 次訊息傳送
```

這裡假設每筆行情各送一則訊息，沒有在伺服器端合併或批次傳送。瀏覽器每秒只更新 4 次畫面，並不會自動降低這些網路訊息數；若要減少傳送量，也要在後端另行設計合併策略。

**步驟 5：瀏覽器收到訊息，先存最新價格，再批次更新 React 畫面。**

每個瀏覽器各自處理自己的 buffer 與畫面。後端負責「送給誰」，瀏覽器負責「收到後何時畫出來」。使用者取消追蹤、關閉頁面或斷線時，後端也要清除對應訂閱；正式實作還需要處理連線已關閉、傳送失敗，以及慢速連線的暫存上限。

##### 一台後端放不下時怎麼辦？

接著才把連線分散到多台 Gateway。例如一萬個連線分成兩組，各五千個：

```txt
行情來源 → 行情接收服務 → 內部分送層
                           ├── Gateway 1 → 自己管理的 5,000 個瀏覽器
                           └── Gateway 2 → 自己管理的 5,000 個瀏覽器
```

內部分送層把台積電更新送給有台積電訂閱者的 Gateway，每台 Gateway 再查自己的訂閱表，送給自己管理的連線。這種「對某個主題發布資料，交給訂閱該主題的接收者」的方式稱為 publish/subscribe，簡稱 pub/sub。

同一筆更新必須送達所有需要它的 Gateway，不能只交給其中一台，否則另一台的使用者會漏收。五千只是說明分組的假設，不是一台機器的保證容量；真正容量要用訊息頻率、大小、網路與 CPU 等條件量測。

初學先掌握三個動作就夠了：**記住誰訂閱什麼 → 收到行情後查表 → 透過對應連線送出。** 後面再學如何讓多台機器共同完成這件事。

##### Redis 入門：內部分送層具體用什麼技術？

上圖的「內部分送層」可以用 **Redis Pub/Sub** 實作。這是本題的一個教學方案，不是看到大流量就一律加 Redis，也不表示加了 Redis 就一定能支援十萬人。

Redis 是獨立執行、讓應用程式透過網路存取的資料服務，常見用途包括快取與訊息傳遞。本題先認識它的 Pub/Sub 功能：發布者把訊息送進指定頻道，Redis 再推送給訂閱這個頻道的程式。[官方 Pub/Sub 說明](https://redis.io/docs/latest/develop/pubsub/)

| 元件／技術 | 在本題負責什麼 |
| --- | --- |
| 行情接收服務 | 向上游收行情，整理格式，發布更新 |
| Redis Pub/Sub | 把更新分送給訂閱該頻道的 Gateway |
| Gateway | 維持瀏覽器連線，查本機訂閱表，再逐一傳送 |
| Docker | 把程式與執行環境包成容器，方便啟動 |
| Kubernetes（K8s） | 管理容器的部署、擴充與重啟等工作 |
| 負載平衡器（Load Balancer） | 在瀏覽器建立連線時，將連線導向某台 Gateway |

這些工具可以一起使用。例如用 Docker 包裝 Gateway，用 K8s 執行多個 Gateway，再讓這些 Gateway 訂閱 Redis。**多開一台 Gateway 後，仍要靠程式建立訂閱，才會收到行情。**

##### 從一筆台積電行情，理解 Redis 的兩段分送

假設 Gateway 1、Gateway 2 都有使用者追蹤台積電。`market:TWSE:2330` 是我們自行命名的頻道，意思是「台積電行情更新」。

**第一步：兩台 Gateway 各自連到 Redis，訂閱頻道。**

以下是 Redis 指令；正式程式通常透過 Redis 客戶端套件呼叫：

```txt
SUBSCRIBE market:TWSE:2330
```

Redis 會維護這樣的訂閱關係：

```txt
market:TWSE:2330
   → Gateway 1 的 Redis 連線
   → Gateway 2 的 Redis 連線
```

同一台 Gateway 即使有五千人追蹤台積電，也只需要用一個訂閱接收這個頻道，再由自己分送給五千人。

**第二步：行情接收服務把新價格發布到頻道。**

```txt
PUBLISH market:TWSE:2330 '{"symbol":"TWSE:2330","price":"1003.00"}'
```

Redis 將訊息推送給兩台已訂閱的 Gateway。發布者不必自行保存每台 Gateway 的連線清單。[官方命令與分送範例](https://redis.io/docs/latest/develop/pubsub/#wire-protocol-example)

**第三步：Gateway 收到訊息，再查自己的瀏覽器訂閱表。**

```txt
行情接收服務
   │ PUBLISH：台積電 1003
   ▼
Redis 的 market:TWSE:2330 頻道
   ├── Gateway 1
   │      ├── WebSocket → 使用者 A（訂閱台積電）
   │      └── WebSocket → 使用者 B（訂閱台積電）
   └── Gateway 2
          ├── WebSocket → 使用者 C（訂閱台積電）
          └── WebSocket → 使用者 D（訂閱台積電）
```

第一段是 **Redis → Gateway**，第二段是 **Gateway → 瀏覽器**。在這個架構中，瀏覽器連 Gateway，不直接連 Redis；Redis 不需要知道一萬個瀏覽器各是誰。

下面是 Gateway 的概念流程，函式名稱為教學示意，並非特定套件的可直接執行 API：

```js
redis訂閱("market:TWSE:2330", (message) => {
  const update = JSON.parse(message);
  const sockets = 本機訂閱表.get(update.symbol);

  for (const socket of sockets ?? []) {
    socket.send(message);
  }
});
```

若 Gateway 1 的第一位使用者開始追蹤台積電，就建立 Redis 訂閱；最後一位取消追蹤後，可以取消該 Gateway 的 Redis 訂閱，減少不必要的流量。實作時要處理訂閱確認與初始 snapshot 的銜接，不能假設呼叫訂閱函式就已開始收資料。

##### 為什麼這有助於處理大流量？

**它讓行情接收與瀏覽器分送可以分開擴充。** 行情接收服務只管發布更新；Gateway 各自負責一部分瀏覽器，多台一起承擔連線與傳送工作。

這裡有兩種不同的「分配」：

- **分配連線**：負載平衡器把新連線導向不同 Gateway。一條已建立的 WebSocket 通常固定由同一台 Gateway 維持，直到斷線；新增 Gateway 不會自動搬走舊連線。
- **分送行情**：Redis 把同一筆台積電更新送給所有需要它的 Gateway。不能只挑一台送，否則其他 Gateway 的使用者會漏收。

用前面的假設計算：兩台 Gateway 各有五千人追蹤台積電，台積電每秒更新十次，每次各送一則訊息，沒有合併或批次：

| 路段 | 每秒應用層訊息數 |
| --- | ---: |
| 行情接收服務 → Redis | 10 |
| Redis → 兩台 Gateway | 10 × 2 = 20 |
| Gateway 1 → 五千個瀏覽器 | 10 × 5,000 = 50,000 |
| Gateway 2 → 五千個瀏覽器 | 10 × 5,000 = 50,000 |

總共仍要向瀏覽器傳送十萬則訊息，只是工作分散到兩台 Gateway。若每則內容假設為 200 bytes，兩台 Gateway 的總輸出內容就約為 `100,000 × 200 = 20 MB/s`，尚未計入 WebSocket、TLS 與網路協定開銷。這是估算，不是容量保證。

##### 大流量要逐層處理，Redis 只是其中一環

| 遇到的問題 | 對應的設計方向 |
| --- | --- |
| 單台 Gateway 連線或 CPU 太滿 | 增加 Gateway，分配新連線，量測每台負載 |
| 網路訊息太多 | 若需求允許，在後端依標的合併最新值，或批次傳送多個標的 |
| 少數瀏覽器收得很慢 | 設定待傳送資料的上限；按資料語意合併，必要時斷線並要求重新同步，避免記憶體一直增加 |
| 瀏覽器畫面更新太頻繁 | Browser Buffer 加批次更新；這只減少畫面工作，不會自動減少網路流量 |
| Redis 本身成為瓶頸 | 量測頻道流量與網路負載，再評估依標的分區等設計；不是只增加 Gateway |
| Gateway 或 Redis 連線中斷 | 標記資料過期，恢復訂閱並重新取得 snapshot，依協定檢查資料銜接 |

Redis 的 sharded Pub/Sub 是後續可研究的分區機制，讓頻道訊息在對應分區內傳播；它需要配套的部署與客戶端設計，今天先理解分送責任即可。[官方 Sharded Pub/Sub 說明](https://redis.io/docs/latest/develop/pubsub/#sharded-pubsub)

##### Redis Pub/Sub 不會替你保存所有歷史行情

假設 Gateway 2 與 Redis 斷線五秒，這五秒發布的訊息不會在重連後自動補送。Pub/Sub 的傳遞語意是 at-most-once：沒有內建的漏訊息重送保證。因此即使瀏覽器與 Gateway 的 WebSocket 還連著，Gateway 上游中斷時也應通知瀏覽器資料可能過期。[官方傳遞語意](https://redis.io/docs/latest/develop/pubsub/#delivery-semantics)

另外，**發布到頻道與保存最新價格是兩件事**。`PUBLISH` 不會自動產生一份能供新使用者讀取的最新價格；snapshot 要由另一個資料來源或保存機制提供，並設計版本與更新順序。

| 需求 | 應如何思考 |
| --- | --- |
| 看最新價格，允許漏掉中間變動 | 可以評估 Pub/Sub 搭配 snapshot 恢復 |
| 每筆事件都要能重讀、追查 | 需要有保留與重讀能力的訊息機制，例如進一步研究 Redis Streams，並設計保存期限、故障持久性與重複處理 |
| 保存使用者的追蹤清單 | 透過 API 寫入持久資料庫，不靠 Pub/Sub 當保存結果 |

初學時先練習口述：「我把瀏覽器連線分散在多台 Gateway；用 Redis Pub/Sub 將同一筆行情送到需要它的 Gateway，再各自送給使用者。接著量測連線、訊息量、網路與延遲，決定是否要擴充或合併更新，並處理斷線後的資料恢復。」

#### [x] 一個 failure case

```txt
故障：Client WebSocket 中斷 45 秒後重連。

錯誤行為：直接把重連後收到的 delta 接在舊資料上，畫面看似恢復，
但中間可能漏掉更新，sequence 已不連續。

期望行為：
1. UI 標記 reconnecting / stale。
2. 重連後開始暫存新收到的 delta，同時重新取得具版本或 sequence 的 snapshot。
3. snapshot 到手後，丟棄 buffer 中已被 snapshot 涵蓋的 delta。
4. 只在 sequence 能銜接時套用；否則丟棄 buffer 並再次抓 snapshot。
5. 恢復後記錄 reconnect duration 與 gap 指標。
```

##### 白話拆解：重新連上，不代表資料已經正確

| 名詞 | 意思 |
| --- | --- |
| snapshot | 某個時間點的完整資料，像一份存檔 |
| delta | 後續的變動資料，可能只包含改變的部分 |
| sequence | 更新的流水號，用來判斷是否漏掉資料；編號範圍與銜接規則由協定定義 |
| stale / reconnecting | 資料可能已過期／正在重新連線，讓使用者知道目前狀態 |
| gap | 按協定檢查時發現的資料缺口 |

假設此練習的更新按同一條資料流逐筆編號：

```txt
手上的 snapshot：第 100 號
正常接收：101 → 102 → 103
斷線 45 秒後：直接收到 150
```

你漏掉了 `104～149`。如果 delta 必須依賴前面的狀態，直接套用 `150`，畫面可能看似恢復，資料卻是錯的。

恢復時先標記資料可能過期。重連後，一邊暫存新更新，一邊抓完整 snapshot；假設 snapshot 已涵蓋到 `160`，就丟掉 buffer 裡 `160` 以前及 `160` 的更新，再從 `161` 接著套用。如果下一筆卻是 `163`，表示仍有缺口，必須重新同步。只有成功銜接並追上更新，才恢復正常狀態。

注意：斷線時瀏覽器收不到資料，這裡暫存的是「重連後、取得 snapshot 期間」收到的更新。這個流程也需要後端提供能相互對照的 snapshot 版本與串流 sequence，不能只靠前端自行猜測。

如果每筆訊息都帶著某個標的完整的最新價格，且需求只看最新值，就不一定需要補齊每筆歷史更新；但仍要判斷新舊，並讓未收到更新的標的重新取得最新資料。是否需要完整銜接，取決於資料協定與產品需求。

記錄 reconnect duration 與 gap，是為了知道「多久才恢復、是否常常漏資料」，方便追查問題。

#### [ ] 3 分鐘口述

使用以下骨架錄音，不逐字背稿：

```txt
0:00–0:30  重述問題與使用者
0:30–1:20  functional requirements 與範圍外項目
1:20–2:20  三個規模／品質數字與理由
2:20–2:50  斷線 failure case 和恢復語意
2:50–3:00  確認假設，準備進入 high-level design
```

### 4. 四家公司如何看同一題

| 公司方向 | 需求澄清時要特別主動提到 |
| --- | --- |
| Amazon | 數字假設、取捨、可用性、failure handling、清楚的範圍界線 |
| Binance | snapshot＋delta、sequence gap、價格 freshness、重連、數字精度 |
| 台積電 | 權限、稽核、穩定性、內網／跨廠區、長期維護與降級流程 |
| 聯發科 | 大型表格效能、React ownership、測試、CI/CD、RD 工具整合 |

### 5. 今日 System Design 驗收

- [ ] 我能先問需求，不會一開始就堆技術名詞。
- [ ] 我能說出至少 3 條 functional requirements。
- [ ] 我能說出至少 5 條 measurable non-functional requirements。
- [ ] 我有明確聲明容量數字是題目資訊還是自己的假設。
- [ ] 我能描述一個 failure case 的偵測、使用者狀態與恢復方式。

---

## 今日結束打卡

這是進度自評，沒有標準答案；每列選一個符合實際結果的狀態。選對知識題不等於完成程式或錄音。

**Contains Duplicate（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**React 更新模型（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**System Design 需求（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**本次學習時間（依實際情況單選）**

- [ ] 少於原定時間。
- [ ] 約等於原定時間。
- [ ] 超過原定時間。
- [ ] 未計時。

**口述或主動產出（可複選，依實際情況）**

- [ ] 已錄音，符合本節時限。
- [ ] 已錄音，但超時或中斷。
- [ ] 已自畫資料流或重算數字。
- [ ] 已操作 failure case 並核對結果。
- [ ] 尚未產出。

**今天最需要補強的地方（依實際情況單選）**

- [ ] 題意或契約。
- [ ] 實作與測試。
- [ ] React／Python 模型。
- [ ] System Design 假設與故障。
- [ ] 口述表達。
- [ ] 目前沒有待補項目。

**週末下一個最小行動（依實際情況單選）**

- [ ] 週六 30 分鐘：重做本頁演算法練習並跑測試。
- [ ] 週六 20 分鐘：重做本頁前端／Python 選擇題與實作驗證。
- [ ] 週日 20 分鐘：重選 System Design 題並照答案框架口述。
- [ ] 週日 20 分鐘：重錄本頁口述任務。
- [ ] 無需補課。

真正完成的標準不是「看完」，而是明天不看筆記仍能重建：

1. 從暴力解的重複操作推導出更快的 membership check。
2. 用 invariant 和 Big-O 辯護 Contains Duplicate 的實作。
3. 用一個點擊事件講清楚 Trigger → Render → Commit 與 state snapshot。
4. 為一個系統列出功能、可量測品質、容量假設與 failure case。
