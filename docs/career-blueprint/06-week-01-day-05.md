---
sidebar_position: 6
sidebar_label: "6. 第 1 週 Day 5"
slug: "/career-blueprint/week-01-day-05"
title: "第 1 週 Day 5：NC150 週測、React 面試口述與週檢討"
description: "Day 5 日課：45 分鐘 Arrays & Hashing I 週測、45 分鐘 Vue 與 React 更新模型口述、20 分鐘英文自介、10 分鐘週檢討，以及 20 分鐘 System Design 完整框架與取捨。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Arrays & Hashing I", "週測", "Think Aloud", "Vue reactivity", "React render model", "英文自介", "trade-off"]
---

# 第 1 週 Day 5：週測、面試口述與週檢討

> 練習日期：以實際練習當日為準\
> 今日總時數：140 分鐘  
> 對應目標：Amazon、Binance、台積電、聯發科面試共同核心  
> 本週 NC150 分類：Arrays & Hashing I  
> 本週 System Design 主題：解題框架

這份是提前整理的 Day 5 學習筆記，接續 [Day 4](/docs/career-blueprint/week-01-day-04)。今天把本週內容轉成閉卷作答與面試口述，完成狀態依實際練習勾選。

後續題目可從 [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) 閱讀；今天先完成本週驗收。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。原有程式實作與口述練習仍依各節執行。

## 今日完成定義

- [ ] **NeetCode 150 週測｜45 分鐘**：本週三題隨機抽一題，30 分鐘閉卷重寫；全程 Think Aloud，結束後只記三個最重要錯誤。
- [ ] **React 面試化／系統設計｜45 分鐘**：完成一段 3 分鐘口述，說明 Vue reactivity 與 React render model，並回答追問。
- [ ] **英文／行為面試｜20 分鐘**：完成英文 90 秒自介，涵蓋五年前端、轉職背景、為何補 React／基礎。
- [ ] **週檢討｜10 分鐘**：列出本週完成、未完成、下週一個優先修正；未完成項只移到六、日補，不推遲下週主線。
- [ ] **System Design × 高併發｜20 分鐘**：3 分鐘口述完整框架與兩個 trade-off；小圖／三個數字／failure case／3 分鐘口述，至少完成一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。System Design 若未完成，加入週末補課清單；不影響下週主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | NC150 週測 | 抽題紀錄、閉卷程式與測試、Think Aloud、最多三個重要錯誤 |
| 21:15–22:00 | Vue／React 面試口述 | 3 分鐘錄音、例子與追問回答 |
| 22:00–22:20 | 英文／行為面試 | 90 秒自介錄音與真實經歷 |
| 22:20–22:30 | 週檢討 | 完成／未完成、下週唯一優先修正、週末補課 |
| 22:30–22:50 | System Design | 完整框架、兩個取捨、至少一項主動產出 |

---

## Part 1｜NeetCode 150 週測：Arrays & Hashing I（45 分鐘）

### 1. 隨機抽一題，不重抽

擲骰子一次：1–2 選 217、3–4 選 242、5–6 選 1。記下結果再開始計時，不因熟悉程度換題。

| 骰子 | 本週題目 | 作答入口 |
| --- | --- | --- |
| 1–2 | 217 Contains Duplicate | [題目筆記](/docs/algorithms/leetcode/f0201-0300/l0217-contain-duplicate) |
| 3–4 | 242 Valid Anagram | [題目筆記](/docs/algorithms/leetcode/f0201-0300/l0242-valid-anagram) |
| 5–6 | 1 Two Sum | [題目筆記](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum) |

只讀抽中題的 Stage A 題意、契約與限制，關閉提示及舊程式。這裡是週測入口，三階段分析與 TypeScript／Python 實作沿用題目筆記，不在考前重貼解答。今天的 30 分鐘選一種語言完成；另一種語言如需補強，放到週末。

### 2. 今日 45 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–3 | 抽題、選語言、開錄音與空白檔 | 題號與開始時間 |
| 3–33 | 30 分鐘閉卷重寫，全程 Think Aloud | 讀題、計畫、程式、測試與 Big-O |
| 33–40 | 對照題解 Stage B，回看卡點 | 找出錯誤原因；保留原始作答 |
| 40–45 | 閱讀 Stage C 的工程用途並收斂錯題 | 最多三個重要錯誤、各一個修正動作 |

30 分鐘到就停筆，未完成也保留現況。之後的修正不算閉卷完成；看過提示就標記「提示後完成」。

### 3. Think Aloud：讓面試官跟得上

依序說出下面內容，寫程式與測試時也持續說明目前在驗證什麼，不需要逐字念語法。

**單選｜週測 Think Aloud，哪個順序能讓面試官跟上？**

- [ ] A. 逐字念語法，不談需求或測試。
- [ ] B. 直接說我背過最佳解，不必解釋。
- [ ] C. 確認輸出與限制 → 最直接做法 → 重複工作 → 實作計畫 → 測試 → 複雜度。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 這題只確認口述流程，不提前透露抽中題的資料結構。選完後依這個順序完成 30 分鐘週測。

</details>

**卡住時先採取哪個動作（依實際情況單選）**

- [ ] 不確定題意：重新讀 Stage A 契約與一個範例。
- [ ] 不確定程式狀態：手動追一次最小合法輸入。
- [ ] 不確定測試失敗原因：比較預期與實際輸出。

卡住時先從上面的三種動作選一個，再手動追狀態；不必臨時組織填空句。

### 4. 作答紀錄與三個重要錯誤

**抽中題目（依實際情況單選）**

- [ ] 骰子 1–2：217 Contains Duplicate。
- [ ] 骰子 3–4：242 Valid Anagram。
- [ ] 骰子 5–6：1 Two Sum。

**作答語言（依實際情況單選）**

- [ ] TypeScript。
- [ ] Python。

**30 分鐘內結果（依實際情況單選）**

- [ ] 未完成。
- [ ] 完成但測試失敗。
- [ ] 閉卷通過。
- [ ] 使用提示後才完成。

**使用的提示（依實際情況單選）**

- [ ] 未看提示。
- [ ] 提示一。
- [ ] 提示二或三。
- [ ] Stage B 解答。

**實際完成的驗證（可複選，依實際情況）**

- [ ] 一般案例通過。
- [ ] 最小合法輸入通過。
- [ ] 重複值或特殊情況通過。
- [ ] 已口述 Big-O 與計算前提。
- [ ] 作答後已閱讀 Stage C 並說明一個工程用途。
- [ ] 尚未完成測試。

**週測最重要錯誤：最多選三項；沒有就不勾（可複選，依實際情況）**

- [ ] 看錯輸出契約 → 下次先重選契約題。
- [ ] 說不出推導 → 先說最直接做法與重複工作。
- [ ] 實作次序錯誤 → 用最小例子追每輪狀態。
- [ ] 漏測邊界 → 補一般、最小、重複／特殊三類測試。
- [ ] Big-O 沒前提 → 分清單次操作與整體成本。
- [ ] 口述中斷 → 按需求、計畫、測試、成本順序說。

只保留最重要的三個；若不足三個，不捏造錯誤。修正要能驗證，例如「寫迴圈前先口述每輪保存哪些資料」，不要只寫「更小心」。

### 5. 今日週測驗收

- [ ] 隨機抽題後未更換，保留 30 分鐘原始版本。
- [ ] 全程 Think Aloud，包含推導、測試與複雜度。
- [ ] 有跑測試，或明確記錄尚未跑完的原因。
- [ ] 作答後才看分析，能說出一個工程用途及使用界線。
- [ ] 錯題本最多三項，每項都有下一個修正動作。

---

## Part 2｜React 面試化／系統設計：Vue 與 React 更新模型（45 分鐘）

### 1. 今日目標與節奏

面試題：「你有 Vue 經驗，請用三分鐘說明 Vue reactivity 與 React render model，並用計數器解釋差異。」

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 閉卷寫兩種更新流程 | 各一條資料流 |
| 8–18 | 用計數器確認狀態與畫面何時改變 | 預測、理由、對照文件 |
| 18–28 | 組織 3 分鐘講稿並第一次錄音 | 一段完整回答 |
| 28–38 | 練三個追問 | 每題約一分鐘 |
| 38–45 | 回聽、修正並重錄 | 最終 3 分鐘版本 |

### 2. 先選更新流程，再對照

**單選｜Vue 與 React 更新模型的比較，何者正確？**

- [ ] A. Vue 響應式讀取追蹤依賴、寫入通知 effect；React 更新後 render 讀該次快照並計算 UI，commit 套用必要 DOM 變更。
- [ ] B. Vue 改值就一定同步改 DOM，React 每次都重建整頁。
- [ ] C. 兩者都只要直接改普通區域變數就會更新 UI。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** Vue 的 DOM 更新也會排程；React setter 不會改寫目前 handler 的快照。

</details>

Vue 3 的 reactive 物件透過 Proxy 攔截讀寫，ref 透過 `.value` 的存取追蹤與觸發依賴。當 render effect 讀取響應式值，就建立關聯；寫入會通知相關 effect，元件 DOM 更新會批次排程。參考：[Vue Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)。

React 的更新可分成 trigger、render、commit：觸發後呼叫元件計算 UI，再提交必要的 DOM 變更。Render 執行不代表 DOM 一定改變，render 應保持純粹。參考：[React Render and Commit](https://react.dev/learn/render-and-commit)。

React 每次 render 的 state 是該次快照；呼叫 setter 不會改寫目前 handler 已拿到的值。參考：[React State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)。

### 3. 計數器推理練習

以下都是放在事件 handler 裡的片段；Vue 的 `count` 是 `ref(0)`，React 的 `count` 與 `setCount` 來自 `useState(0)`。假設初始值為 0，分別預測一次點擊後的結果。

```js
// Vue
count.value += 1;
count.value += 1;
console.log(count.value);
```

```js
// React
setCount(count + 1);
setCount(count + 1);
console.log(count);
```

<details>
<summary>先預測再展開：狀態與畫面的差異</summary>

Vue 的 `.value` 已變成 2，因此 log 是 2；DOM 要等排程更新。React handler 仍讀到本次快照 0，所以 log 是 0；兩次都要求把值設為 1，下一次 render 的 count 是 1。

React 若要根據前一個待處理的值連續累加，可使用兩次 `setCount(previous => previous + 1)`，結果為 2。這不會讓目前 handler 的 count 立即變成 2。

</details>

### 4. 三分鐘口述骨架

```txt
0:00–0:30  共通點：state 決定 UI；狀態更新與 DOM 更新要分開理解。
0:30–1:15  Vue：響應式讀取建立依賴，寫入通知相關 effect，排程更新畫面。
1:15–2:00  React：trigger → render → commit；每次 render 有自己的 state 快照。
2:00–2:40  用上面的計數器，說明直接更新值與要求下一次 state 的差異。
2:40–3:00  工程影響：移植 Vue 寫法時，先確認 state 的擁有者與更新方式。
```

重點是講清楚因果，不用塞滿三分鐘；可補上自己曾遇過的真實畫面更新問題，但不要把沒做過的案例說成經驗。

### 5. 面試追問與驗收

| 追問 | 回答要點 |
| --- | --- |
| setter 後立刻讀 state，為什麼還是舊值？ | 目前 handler 使用該次 render 的快照；不是單用「非同步」就解釋完 |
| 元件 render 了，DOM 就一定變嗎？ | render 計算結果，commit 才套用必要變更；結果相同可能不需改 DOM |
| 即時價格 Watchlist 的狀態要放哪裡？ | 先分開伺服器行情、使用者保存的清單、暫時 UI 狀態；指定擁有者，再決定共享範圍 |

- [ ] 三分鐘內包含兩種模型、計數器例子與工程影響。
- [ ] 沒有把 Vue 說成 DOM 同步更新，也沒有把 React 說成每次重建整頁。
- [ ] 能區分 render 與 commit，並解釋 state snapshot。
- [ ] 能說出 Watchlist 哪些狀態來自伺服器、哪些只屬於畫面。

---

## Part 3｜英文／行為面試：90 秒自介（20 分鐘）

### 1. 今日節奏

前 4 分鐘列真實素材，接著 6 分鐘寫英文草稿、4 分鐘錄第一次、3 分鐘回聽，最後 3 分鐘修改並重錄。以實際計時為準，超時先刪細節。

**主要技術經驗（依實際情況單選）**

- [ ] 主要使用 Vue。
- [ ] 主要使用 React。
- [ ] Vue 與 React 都有實務經驗。
- [ ] 其他前端技術為主，先使用下方中性句。

**轉職背景的表達範圍（依實際情況單選）**

- [ ] 曾從其他領域轉入前端，可使用轉職句。
- [ ] 不想詳述前職，只說明目前五年前端經驗。
- [ ] 目前不適合宣稱跨領域轉職，跳過轉職句。

**可驗證的專案行動（可複選，依實際情況）**

- [ ] 做過表單與使用者流程。
- [ ] 做過 API 串接與錯誤狀態處理。
- [ ] 做過元件整理或重構。
- [ ] 目前先略過具體專案，不代填成果。

**補強方向（可複選，依實際情況）**

- [ ] React 更新模型與狀態設計。
- [ ] 演算法與資料處理成本。
- [ ] 系統容量、故障與資料流。

### 2. 英文自介模板

以下改成完整句子選單。只選符合事實的句子；沒有符合項可略過，不需補寫未知背景或成果。

每組選一個符合事實的完整句子，依序連起來口述；沒有符合項就選「略過」。不需要補職稱、姓名或成果數字，也不要把不符合的句子說成經歷。

**① 開場：單選**

- [ ] “I'm a frontend engineer with five years of experience, mainly working with Vue.”
- [ ] “I'm a frontend engineer with five years of experience, mainly working with React.”
- [ ] “I'm a frontend engineer with five years of experience building web interfaces.”

**② 轉職背景：單選，僅採用真實描述**

- [ ] “I moved into frontend development from another field because I enjoyed building things that people could use.”
- [ ] “I changed careers because I wanted to combine problem-solving with visible product results.”
- [ ] 略過背景原因，接下一組，不猜測自己的經歷。

**③ 工作經驗：可選一至兩句，僅採用做過的工作**

- [ ] “My work has included forms and user flows. I pay attention to how people understand and complete each step.”
- [ ] “I've worked on API integration and error handling. I focus on making loading, success, and failure states clear.”
- [ ] “I've worked on component refactoring. My goal is to make the code easier for the team to understand and change.”
- [ ] 略過，現階段不聲稱具體專案成果。

**④ 為何補 React：單選**

- [ ] “I'm strengthening my React skills so I can contribute beyond my current stack. I want to understand its rendering model instead of only memorizing syntax.”
- [ ] “I'm reviewing React to make better decisions about state ownership, derived data, and how updates reach the screen.”

**⑤ 為何補基礎與下一步：單選**

- [ ] “I'm also reviewing algorithms and system design. I want to reason more clearly about performance and data flow, explain my decisions, and handle failure cases. In my next role, I hope to contribute my frontend experience while taking more responsibility for technical decisions.”
- [ ] “I'm strengthening my fundamentals so I can explain why an approach works and where it stops being useful. I'm looking for a team where I can contribute my frontend experience and keep improving my ability to solve problems.”

依選句實際錄音計時；不足 90 秒時，可加入另一句真實工作經驗，沒有合適素材就保留短版，別用虛構內容湊時間。

### 3. 回聽與追問

| 時間 | 內容 |
| --- | --- |
| 0–15 秒 | 五年前端經驗與主要工作 |
| 15–35 秒 | 轉職背景與原因 |
| 35–60 秒 | 一個專案：問題、自己的行動、結果 |
| 60–90 秒 | 為何補 React／基礎，以及下一步方向 |

練習追問：「Why did you change careers?」與「Why are you learning React now?」各用兩三句回答。先直接回答原因，再補一個真實例子。

- [ ] 完成約 90 秒錄音，不只默讀草稿。
- [ ] 涵蓋五年前端、轉職背景、補 React／基礎三項。
- [ ] 專案例子能分清團隊成果與自己的行動。
- [ ] 沒有為了好聽而編造職稱、成果數字或經歷。

---

## Part 4｜週檢討（10 分鐘）

前 4 分鐘勾選本週各項狀態，接著 3 分鐘選一個下週優先修正，最後 3 分鐘選六、日補課安排。System Design 進度在 Combo 結束前再勾選。

### 1. 本週完成與未完成

每個主題依實際情況選狀態；需要補課時直接採用對應動作，不必另寫原因。

**NC150：217／242／1 與週測（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 30 分鐘：重做對應演算法練習並跑測試。

**Vue／React 更新模型（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 20 分鐘：重選更新模型題，再操作計數器或任務列表。

**Python 資料處理（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 25 分鐘：重跑本節環境檢查、型別檢查與測試。

**英文／行為面試（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週日 20 分鐘：重選真實經歷句並錄音。

**System Design 解題框架（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週日 20 分鐘：重選本節設計題，再照框架錄三分鐘口述。


「看過」和「能閉卷完成」分開勾選。未完成時採用該主題下方的具體補課動作，不必另寫一段說明。

### 2. 下週只有一個優先修正

**下週唯一優先修正：選最符合本週卡點的一項（依實際情況單選）**

- [ ] 契約不清楚：每次寫程式前先做契約選擇題，驗收是能分清輸入與輸出。
- [ ] 測試不足：每次提交前檢查一般、最小、重複／特殊三類測資。
- [ ] 口述不連貫：每天原定口述時段按選項順序錄一遍，驗收是時間內講完。
- [ ] 容量估算混亂：每次先核對單位，再計算一次 QPS 或分發量。

例：「每次演算法實作前，先花兩分鐘說出輸出契約與兩個邊界測資。」這是調整下週既有練習方法，不是把本週欠課塞進下週。

### 3. 未完成才加入的週末補課清單

只選確實需要補課的項目；此處勾選代表排入補課，完成與否在每日打卡確認。

**本週末補課安排：只選未完成項，完成後在每日打卡核對（可複選，依實際情況）**

- [ ] 週六上午 30 分鐘：閉卷重寫週測題，跑測試並口述原因。
- [ ] 週六下午 20 分鐘：重錄 Vue／React 比較，三分鐘內包含例子。
- [ ] 週日上午 20 分鐘：用真實選句錄英文自介。
- [ ] 週日下午 20 分鐘：System Design 四步框架、兩個取捨與一項產出。
- [ ] 本週均已完成，無需補課。

未完成項只移到六、日補，不推遲下週主線。若週末容量不夠，明確縮小補課範圍或標記仍未完成，不默默延後下週安排。

---

## Part 5｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：3 分鐘口述完整框架與兩個 Trade-off

沿用本週即時價格 Watchlist，以「需求 → 容量假設 → 最小架構 → 故障與取捨」四步回答。今天的數字是練習假設，不是真實產品量測。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 閉卷列四步框架 | 每步一兩句 |
| 4–9 | 補數字、資料流與兩個取捨 | 說明選擇的前提與代價 |
| 9–12 | 錄製三分鐘完整回答 | 框架與兩個 trade-off |
| 12–18 | 回聽並補強一項主動產出 | 自畫／自算／自訂故障／重錄 |
| 18–20 | 驗收、更新週檢討 | 未完成項加入週末補課 |

### 1. 先選出最合適的處理方式

**單選｜完整 System Design 框架的順序是哪個？**

- [ ] A. 需求 → 容量假設 → 最小架構 → 故障與取捨。
- [ ] B. 先選資料庫品牌 → 加所有中介軟體 → 最後問需求。
- [ ] C. 只畫元件，不討論數字與故障。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 每一步為下一步提供依據，最後驗證方案能否承受故障及付出什麼代價。

</details>

**單選｜10,000 人、每人 20 個訂閱、每訂閱每秒更新一次，下游標的更新分發量為何？**

- [ ] A. 10,000 次 API 請求／秒。
- [ ] B. 20 筆上游事件／秒。
- [ ] C. 200,000 筆標的更新／秒；不等於上游事件數或網路封包數。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 10,000 × 20 × 1 = 200,000；共同訂閱可共用上游事件，批次傳輸可合併封包。

</details>

**單選｜頻繁行情更新使用 WebSocket 的取捨何者完整？**

- [ ] A. WebSocket 沒有維護成本，永遠勝過輪詢。
- [ ] B. 可降低等待輪詢的延遲，但要維護連線與重連；低頻且可接受較舊資料時可選輪詢。
- [ ] C. WebSocket 會自動保證所有斷線期間事件都補回。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 技術選擇要包含改選條件；斷線後資料銜接仍需應用層設計。

</details>

**單選｜純看盤 Watchlist 暫時收不到新行情，哪個取捨合理？**

- [ ] A. 保留最後值並標 stale 與原時間；代價是使用者可能誤認新鮮度，下單前須另驗證。
- [ ] B. 保留最後值並把時間改成現在，讓畫面看起來正常。
- [ ] C. 只要 WebSocket 還連著，就能保證行情新鮮。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 連線健康不等於上游資料持續更新。是否允許舊資料，取決於功能需求。

</details>

<details>
<summary>完成自己的版本後對照：Watchlist 框架與兩個取捨</summary>

**需求：** 使用者查看價格並保存追蹤清單，今天不處理下單。行情要帶最後更新時間；清單要等服務端確認才顯示保存成功。

**容量假設：** 同時 10,000 人、每人 20 個標的、每個訂閱平均每秒更新一次，約有 `10,000 × 20 × 1 = 200,000` 筆「對客戶端的標的更新」／秒。這是分發量，並非上游不同事件數，也不等於網路封包數；批次傳送可合併訊息。

**最小架構：** 上游行情進入分發服務，由 WebSocket Gateway 依訂閱推送瀏覽器；清單讀寫由 API 接資料庫。擴容前先量測連線數、每秒分發量與延遲，不能只靠估算就宣稱能承受流量。

**故障：** 斷線或行情停更時顯示 stale 與最後更新時間；重連採退避與隨機延遲，再取得可銜接版本的 snapshot。清單寫入逾時可能已提交，依操作 ID 查狀態，不能假裝成功或盲目重送。

| 取捨 | 今天的選擇與好處 | 代價與改選條件 |
| --- | --- | --- |
| WebSocket vs. 定時輪詢 | 頻繁更新時選 WebSocket，降低等待下一次輪詢的延遲 | 需維護連線、訂閱與重連；低頻資料且能接受較舊內容時可考慮輪詢 |
| 保留過期價格 vs. 停止顯示數值 | 純 Watchlist 保留最後值並明確標 stale，使用者仍可參考 | 使用者可能誤認新鮮度，必須標時間；若用於下單等要求新鮮資料的操作，應阻擋或重新驗證 |

</details>

### 2. 主動產出：至少完成一項

讀範例不算完成。今日微題仍需練三分鐘口述；自己的完整錄音本身即可算一項主動產出。

#### [ ] 一張小圖

```txt
行情來源 → 分發服務 → WebSocket Gateway → Browser
                                             │
                                             └→ Watchlist API → DB

自己加註：訂閱往哪裡送？哪裡會斷？stale 在哪裡呈現？
```

#### [ ] 三個數字

沿用上方容量單選題的 10,000 人、20 個訂閱、每秒一次更新，選出分發量後自己重算一次。共同訂閱同一標的可共用上游事件，下游仍須分發給多個客戶端。

#### [ ] 一個 Failure Case

```txt
觸發：10,000 個客戶端同時斷線並準備重連。
風險：重連與 snapshot 請求集中，恢復中的服務再次過載。
處理：退避加隨機延遲，限制重連／snapshot 速率，畫面標 stale。
驗證：觀察每秒重連數、snapshot QPS、錯誤率與恢復時間。
恢復完成條件：取得新鮮 snapshot 且後續增量序號可銜接。
```

改寫一個自己的故障案例，補上可觀察的訊號與恢復條件，不只說「加 retry」。

#### [ ] 3 分鐘口述

```txt
0:00–0:30  需求與範圍：看行情、保存清單，不處理下單。
0:30–1:00  容量：三個假設與分發量，指出尚未驗證的限制。
1:00–1:40  最小架構：行情與清單兩條資料流。
1:40–2:10  故障：stale、退避重連、snapshot 重新同步。
2:10–3:00  兩個 trade-off：選擇、好處、代價與改選條件。
```

### 3. 今日 System Design 驗收

- [ ] 三分鐘內說完四步框架與兩個 trade-off。
- [ ] 數字有單位、計算式與假設，沒有混淆來源事件與下游分發。
- [ ] 每個取捨都說明代價，以及何時改選另一種方案。
- [ ] 有一項自己的主動產出，能說明故障時的使用者狀態。
- [ ] 未完成已加到週末補課清單，不影響下週主線。

---

## 今日結束打卡

這是進度自評，沒有標準答案；每列選一個符合實際結果的狀態。選對知識題不等於完成程式或錄音。

**NC150 週測（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**Vue／React 口述（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**英文自介（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**週檢討（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**System Design 框架（依實際情況單選）**

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

下週開始前，閉卷回答：抽中題的推導與最容易錯的地方是什麼？Vue 響應式更新與 React state snapshot 如何用例子說清楚？能否在三分鐘內說完 System Design 框架與兩個有代價的選擇？
