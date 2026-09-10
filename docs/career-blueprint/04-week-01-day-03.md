---
sidebar_position: 4
sidebar_label: "4. 第 1 週 Day 3"
slug: "/career-blueprint/week-01-day-03"
title: "第 1 週 Day 3：閉卷重現、Vue 轉 React 與最小系統架構"
description: "Amazon、Binance、台積電與聯發科面試準備日課：閉卷重寫 Contains Duplicate 與 Valid Anagram，用 React 重建 Vue 列表表單，並用四步答題模板練習最小架構、分散式細節與高流量極限場景。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - JavaScript
  - Python
  - React
  - System Design
keywords: ["Contains Duplicate", "Valid Anagram", "Arrays and Hashing", "Vue to React", "derived state", "React Profiler", "System Design interview template", "High-Level Design", "distributed systems", "high traffic", "Client API Service Database", "面試準備"]
---

# 第 1 週 Day 3：Arrays & Hashing I

> 練習日期：2026-09-07  
> 今日總時數：140 分鐘  
> 對應目標：Amazon、Binance、台積電、聯發科面試共同核心  
> 今日原則：**閉卷重現、可執行證據、先畫最小架構，再做分散式與極限流量加壓**

> 下一天的 [Day 4：Two Sum、Python 資料處理與故障降級](/docs/career-blueprint/week-01-day-04) 筆記已提前整理，可以先閱讀學習。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。原有程式實作與口述練習仍依各節執行。

## 今日完成定義

- [ ] **NeetCode 150｜45 分鐘**：閉卷重寫 Contains Duplicate＋Valid Anagram 的 JavaScript 與 Python 版本，補上圖解、invariant 與 Big-O。
- [ ] **React 實戰｜60 分鐘**：把 Vue 列表／表單改寫成 React；禁止用 effect 同步 derived state，並留下可執行程式、測試、Profiler 或 Debug 證據至少一項。
- [ ] **收尾｜15 分鐘**：完成 8 題觀念單選、核對解析，勾選實際驗證紀錄，並標記未完成項與下一個最小行動。
- [ ] **System Design × 高併發｜20 分鐘**：使用四步答題模板，畫出 `Client → API → Service → DB` 最小架構，並回答分散式演進與 50 倍流量極限場景；至少完成一項主動產出。

建議依照固定訓練時段執行：

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | NC150 閉卷重現 | JavaScript＋Python、兩張小圖、Big-O、卡點 |
| 21:15–22:15 | Vue 列表／表單轉 React | 可執行程式、測試、Profiler 或 Debug 證據之一 |
| 22:15–22:30 | 收尾 | 8 題觀念單選、實際驗證紀錄與未完成標記 |
| 22:30–22:50 | System Design | 四步答題卡＋小圖／數字／failure／口述至少一項 |

---

## Part 1｜NeetCode 150 閉卷重現（45 分鐘）

今天不做新題。先關閉舊筆記與解答，只保留題名、函式簽名和自己準備的測資。

完成後才回看：

- [LeetCode 217｜Contains Duplicate 三階段筆記](/docs/algorithms/leetcode/f0201-0300/l0217-contain-duplicate)
- [LeetCode 242｜Valid Anagram 三階段筆記](/docs/algorithms/leetcode/f0201-0300/l0242-valid-anagram)
- [NeetCode 150 題單](https://neetcode.io/practice/practice/neetcode150)

### 今日 45 分鐘節奏

| 分鐘 | 任務 | 必須留下的內容 |
| ---: | --- | --- |
| 0–3 | 關閉答案、寫契約 | 兩題各一句 Input／Output |
| 3–11 | Contains Duplicate | TypeScript＋Python 閉卷實作 |
| 11–21 | Valid Anagram | TypeScript＋Python 閉卷實作 |
| 21–29 | 執行測試 | 每題至少 5 組，共用語言中立測資 |
| 29–35 | 補 invariant 與 Big-O | 不只寫結論，要說成本從哪裡來 |
| 35–42 | 畫兩張狀態圖 | 每一步的輸入、保存狀態與判斷 |
| 42–45 | 對答案、標記卡點 | 只看自己缺的段落，不重讀全文 |

### 1. 先選題目契約

**單選｜Contains Duplicate 的契約哪個正確？**

- [ ] A. 輸入數字陣列，回傳重複值的所有位置。
- [ ] B. 輸入數字陣列，回傳是否有重複的 boolean；發現重複可提早結束，本次練習保留輸入。
- [ ] C. 輸入字串，回傳排序後的新字串。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 回傳的是有無重複。保留輸入是本次練習的約定，不能自行推成所有題目的官方限制。

</details>

**單選｜Valid Anagram 的判斷規則是哪個？**

- [ ] A. 輸入兩個字串，回傳 boolean；順序可不同，但每個字元次數要相同。
- [ ] B. 只比較長度。
- [ ] C. 只比較字元種類，不比較次數。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 不同順序是允許的；重複字元的數量不能忽略。

</details>

### 2. 閉卷程式模板

#### Contains Duplicate｜TypeScript

```ts
function containsDuplicate(nums: number[]): boolean {
  throw new Error("閉卷完成");
}
```

#### Contains Duplicate｜Python

```python
def contains_duplicate(nums: list[int]) -> bool:
    # 閉卷完成
    pass
```

#### Valid Anagram｜TypeScript

```ts
function isAnagram(s: string, t: string): boolean {
  throw new Error("閉卷完成");
}
```

#### Valid Anagram｜Python

```python
def is_anagram(s: str, t: str) -> bool:
    # 閉卷完成
    pass
```

### 3. 共用測資，不先提供實作

Contains Duplicate：

| 輸入 | 預期 | 驗證目的 |
| --- | --- | --- |
| `[1, 2, 3, 1]` | `true` | 重複值相隔多個位置 |
| `[1, 2, 3, 4]` | `false` | 全部相異 |
| `[7]` | `false` | 最小輸入 |
| `[5, 5]` | `true` | 相鄰重複與提早結束 |
| `[-1, 0, -1]` | `true` | 負數不影響 equality |

Valid Anagram：

| `s` | `t` | 預期 | 驗證目的 |
| --- | --- | --- | --- |
| `"anagram"` | `"nagaram"` | `true` | 順序不同但內容相同 |
| `"rat"` | `"car"` | `false` | 字元種類不同 |
| `"ab"` | `"a"` | `false` | 長度不同 |
| `"aab"` | `"abb"` | `false` | 重複次數不同 |
| `"abc"` | `"abc"` | `true` | 相同字串也成立 |

### 4. 狀態圖與 Invariant 選擇題

Contains Duplicate：

**單選｜用 Set 處理 [1, 2, 3, 1]，準備處理最後一個 1 前，狀態與動作是哪個？**

- [ ] A. Set 是 {1}；直接加入並回傳 false。
- [ ] B. Set 是 {1, 2, 3}；先查到 1 已存在，因此回傳 true。
- [ ] C. Set 是空的；每輪都應清空。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 每輪開始前，Set 保存已處理位置出現的值；先查再加入，避免把目前值當成之前就看過。

</details>

Valid Anagram：

**單選｜s="aab"、t="aba"，每輪 s 字元加一、t 字元減一；處理完索引 1 後，次數差是什麼？**

- [ ] A. a: 0、b: 0；只要長度相同就都為零。
- [ ] B. a: 2、b: 1；把兩字串的次數相加。
- [ ] C. a: +1、b: −1；各字元在已處理 s 前綴的次數減去 t 前綴次數。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 前兩字元是 aa 與 ab，所以 a 多一個、b 少一個。處理完整字串後差值才回到零。

</details>

### 5. Big-O 選擇題：同時辨認成本與理由

**單選｜一般雜湊操作平均 O(1) 時，Contains Duplicate 的 Set 版本時間與最差額外空間為何？**

- [ ] A. 平均 O(n) 時間、O(n) 空間；全部相異時保存 n 個值。
- [ ] B. O(1) 時間、O(1) 空間；查找很快就不必讀陣列。
- [ ] C. O(n²) 時間、O(1) 空間；Set 不占記憶體。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 要逐一讀取元素；單次平均查詢成本不是整題成本。

</details>

**單選｜兩字串長度同為 n，計數法與排序法的成本何者正確？**

- [ ] A. 計數永遠只用 O(1) 空間，與字元集合無關。
- [ ] B. 計數平均 O(n)、O(k) 空間；固定 26 小寫字母時為 O(1) 空間，排序通常 O(n log n)。
- [ ] C. 排序不用讀字串，所以是 O(log n)。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** k 是不同字元種類數。固定字元集合才可把計數表空間視為常數。

</details>

<details>
<summary>45 分鐘結束後再展開：最低驗收答案</summary>

Contains Duplicate 的線性版本應維護「已處理 prefix 中出現過的值」。每次先做 membership check，再加入目前值；一般雜湊情況下平均時間 `O(n)`、最差額外空間 `O(n)`。

Valid Anagram 應比較每個字元的完整次數，而不是只比較字元種類。可維護兩邊的 frequency balance；平均時間 `O(n)`，一般字元集合的空間是 `O(k)`。官方固定 26 個小寫字母時可視為 `O(1)`，但排序替代方案是 `O(n log n)`。

若無法從這些句子重寫 code，回到各題 Stage B 的「從瓶頸推導資料結構」，不要直接複製完整實作。

</details>

### 6. 今日閉卷驗收

- [ ] 四份實作都從空白完成，沒有先看既有筆記。
- [ ] 兩題都跑過至少 5 組測資。
- [ ] 兩張圖能看出每輪讀取、查詢與更新的順序。
- [ ] Invariant 描述的是每一輪都成立的狀態，不是把題意重說一次。
- [ ] Big-O 有寫出每個成本來源，以及 average hash operation 的前提。
- [ ] 若回看答案，已標記缺口；「看懂」沒有被算成「閉卷完成」。

---

## Part 2｜React 實戰：Vue 列表／表單改寫（60 分鐘）

### 今日任務

把下面的 Vue 待辦列表改寫成 React，保留行為但重新思考 state ownership。禁止用 effect 把 `tasks` 或 `filter` 同步成另一份 derived state。

完成定義：

- 可新增非空白任務。
- 可切換完成狀態。
- 可選擇顯示全部、未完成或已完成。
- 顯示剩餘未完成數量。
- `visibleTasks` 與 `remainingCount` 不存進 state。
- 至少留下：可執行程式、測試、Profiler 或 Debug 證據之一。

### 1. Vue 來源版本

```vue
<script setup>
import { computed, ref } from "vue";

const tasks = ref([
  { id: "task-1", title: "Review React state", done: false },
  { id: "task-2", title: "Draw minimal architecture", done: true },
]);
const draft = ref("");
const filter = ref("all");

const visibleTasks = computed(() => {
  if (filter.value === "active") {
    return tasks.value.filter((task) => !task.done);
  }

  if (filter.value === "done") {
    return tasks.value.filter((task) => task.done);
  }

  return tasks.value;
});

const remainingCount = computed(
  () => tasks.value.filter((task) => !task.done).length,
);

function addTask() {
  const title = draft.value.trim();
  if (!title) return;

  tasks.value.push({
    id: crypto.randomUUID(),
    title,
    done: false,
  });
  draft.value = "";
}

function toggleTask(id) {
  const task = tasks.value.find((item) => item.id === id);
  if (task) task.done = !task.done;
}
</script>

<template>
  <section>
    <form @submit.prevent="addTask">
      <input v-model="draft" aria-label="New task" />
      <button type="submit">Add</button>
    </form>

    <label>
      Filter
      <select v-model="filter">
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="done">Done</option>
      </select>
    </label>

    <p>{{ remainingCount }} remaining</p>

    <ul>
      <li v-for="task in visibleTasks" :key="task.id">
        <label>
          <input
            type="checkbox"
            :checked="task.done"
            @change="toggleTask(task.id)"
          />
          {{ task.title }}
        </label>
      </li>
    </ul>
  </section>
</template>
```

### 2. 先做 Vue → React 心智模型對照

不要逐行翻譯語法，先選出資料角色：

**單選｜TaskPractice 中 tasks、draft、filter 應如何分類？**

- [ ] A. 由 TaskPractice 擁有的 source state。
- [ ] B. 都只屬於 DOM，不需要 state。
- [ ] C. 都是可由 remainingCount 還原的 derived data。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 三者可獨立改變，影響畫面，因此由元件保存來源狀態。

</details>

**單選｜visibleTasks、remainingCount、addTask、toggleTask 的角色是哪個？**

- [ ] A. 四者都要各存一份 state。
- [ ] B. 前兩者是 render 中的衍生值；後兩者是由 owner 處理的事件動作。
- [ ] C. 前兩者是 API；後兩者是資料庫欄位。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 衍生值由 tasks／filter 計算；事件更新 tasks，不能把函式本身分類成來源資料。

</details>

先選答案，再照選項口述：

**單選｜購物車 total 完全由 items 算出，哪個選擇比較合理？**

- [ ] A. 只存 items，render 時計算 total；若量測證明昂貴，再考慮快取。
- [ ] B. items 與 total 各存 state，任何更新都手動同步。
- [ ] C. 只存 total，需要 items 時再從總額還原。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 這樣避免兩份資料失去同步；代價是每次 render 計算。後端權威總額則是另一個契約，不能當成純前端衍生值。

</details>

**單選｜在 React 勾選任務時，哪條資料流正確？**

- [ ] A. 直接修改 task.done，不呼叫 setter。
- [ ] B. DOM 自己保存狀態，tasks 永遠不用更新。
- [ ] C. onChange → 用 map 建新陣列並複製目標任務 → setter → render 重算顯示資料。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 狀態擁有者處理事件並提交新值，讓 UI 與來源 state 保持一致。

</details>

### 3. 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 讀 Vue 並選 ownership 題 | 三份 source state、兩份 derived data |
| 8–18 | 建 React component 骨架 | JSX、controlled input／select、list key |
| 18–32 | 實作 events | add、toggle、immutable update |
| 32–40 | 移除 derived state | render 時計算 filter 與 remaining |
| 40–50 | 跑程式與 edge cases | 空白 submit、filter、toggle、新增 |
| 50–57 | 留一項證據 | 測試／Profiler／Debug／執行截圖 |
| 57–60 | 寫 trade-off | 是否需要 `useMemo`，依什麼證據決定 |

### 4. 禁止的 Effect 同步寫法

```jsx
const [visibleTasks, setVisibleTasks] = useState([]);
const [remainingCount, setRemainingCount] = useState(0);

useEffect(() => {
  setVisibleTasks(filterTasks(tasks, filter));
  setRemainingCount(tasks.filter((task) => !task.done).length);
}, [tasks, filter]);
```

這段不是語法錯誤，但建立了多餘的同步責任：

- `tasks`／`filter` 和兩份 derived state 可能短暫不一致。
- Effect 在 commit 後才執行，接著 setter 又安排下一次 render。
- 每新增一種來源或衍生值，就多一個 dependency 與漏同步風險。
- 這些值完全能由當次 render 的 props/state 算出，不需要外部系統同步。

Effect 應優先用於 React 外部系統，例如網路連線、DOM API、訂閱或非 React widget。它不是「只要資料改變就跑計算」的通用工具。

### 5. React 閉卷模板

```jsx
import { useState } from "react";

const initialTasks = [
  { id: "task-1", title: "Review React state", done: false },
  { id: "task-2", title: "Draw minimal architecture", done: true },
];

export function TaskPractice({ createId = () => crypto.randomUUID() }) {
  // 1. 宣告真正的 source state
  // 2. 在 render 推導 visibleTasks 與 remainingCount
  // 3. 實作 addTask 與 toggleTask
  // 4. 回傳 controlled form 與 keyed list
}
```

### 6. 必測行為

| 操作 | 預期 |
| --- | --- |
| 初次 render | 顯示 2 個任務與 `1 remaining` |
| 只輸入空白後 submit | 不新增任務 |
| 新增 `Practice forms` | 新增一筆未完成任務，input 清空 |
| 勾選第一筆 | 第一筆變完成，remaining 減一 |
| Filter 選 Active | 只顯示未完成任務 |
| Filter 選 Done | 只顯示完成任務 |
| Filter 切回 All | 原始 tasks 狀態仍保留 |

<details>
<summary>完成自己的版本後再看：React 參考實作</summary>

```jsx
import { useState } from "react";

const initialTasks = [
  { id: "task-1", title: "Review React state", done: false },
  { id: "task-2", title: "Draw minimal architecture", done: true },
];

export function TaskPractice({ createId = () => crypto.randomUUID() }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });
  const remainingCount = tasks.filter((task) => !task.done).length;

  function addTask(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: createId(), title, done: false },
    ]);
    setDraft("");
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  return (
    <section>
      <form onSubmit={addTask}>
        <input
          aria-label="New task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <label>
        Filter
        <select
          aria-label="Filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>
      </label>

      <p>{remainingCount} remaining</p>

      <ul>
        {visibleTasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

</details>

### 7. 可選測試證據

若練習專案已有 Vitest 與 React Testing Library，可留下這類測試：

```jsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TaskPractice } from "./TaskPractice";

describe("TaskPractice", () => {
  it("derives the visible list and remaining count from source state", () => {
    render(<TaskPractice createId={() => "task-3"} />);

    expect(screen.getByText("1 remaining")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("New task"), {
      target: { value: "Practice forms" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("Practice forms")).toBeInTheDocument();
    expect(screen.getByText("2 remaining")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filter"), {
      target: { value: "done" },
    });

    expect(screen.queryByText("Practice forms")).not.toBeInTheDocument();
    expect(screen.getByText("Draw minimal architecture")).toBeInTheDocument();
  });
});
```

這段測試只在已有相依套件的練習環境執行；今天不要求為了單一證據替這個文件站新增測試框架。

### 8. 證據四選一

至少實際完成一項，再勾選證據種類與結果：

**證據種類（可複選，依實際情況）**

- [ ] 可執行頁面：已操作新增、空白提交、toggle、filter。
- [ ] 自動化測試：已執行並看到結果。
- [ ] Profiler：已錄製一次互動並看到 commit 記錄。
- [ ] Debug：已用 DevTools、breakpoint 或 console 追蹤事件與 state。
- [ ] 尚未執行，只讀過或改過程式。

**本次觀察結果（依實際情況單選）**

- [ ] 行為符合頁面列出的驗收條件。
- [ ] 發現新增或空白提交錯誤，週末重測這兩項。
- [ ] 發現 toggle 或篩選錯誤，週末追蹤 handler 與 state。
- [ ] 尚未觀察，不能判定通過。

**證據保留方式（可複選，依實際情況）**

- [ ] 保留終端機測試輸出。
- [ ] 保留執行畫面截圖或錄影。
- [ ] 保留 Profiler 記錄或 Debug 截圖。
- [ ] 尚未保留證據。

### 9. `useMemo` Trade-off

今天的 `filter` 和 `remainingCount` 對小列表很便宜，直接在 render 計算通常最好。`useMemo` 不是 correctness requirement，也不是「derived data 都必須用」的規則。

只有在以下證據出現時才評估 memoization：

- 列表足夠大、計算足夠昂貴。
- Profiler 顯示該計算確實佔用可感知時間。
- dependencies identity 能穩定，cache 命中有意義。
- 記憶體、依賴維護與閱讀成本值得。

### 10. React 今日驗收

- [ ] 我是從 ownership 與資料流改寫，不是逐行翻譯 Vue 語法。
- [ ] `tasks`、`draft`、`filter` 是 source state。
- [ ] `visibleTasks`、`remainingCount` 是 render 時計算的 derived data。
- [ ] 沒有使用 effect 同步 derived state。
- [ ] Array／object 更新保持 immutable，list key 使用穩定 ID。
- [ ] 至少留下可執行程式、測試、Profiler 或 Debug 證據一項。
- [ ] 我能說明何時才考慮 `useMemo`，而不是無條件加入。

---

## Part 3｜收尾：觀念選擇題（15 分鐘）

這段要確認的是：你是否理解今天的做法，以及是否實際操作過程式。先用選擇題辨認觀念，再記錄操作結果，不用一次寫出完整的技術總結。

每題只有一個最佳答案。先花 5 分鐘選答案，再花 5 分鐘看解析，最後用 5 分鐘勾選驗證紀錄與未完成項。第 6–8 題對應後面的 Part 4，可以做完 System Design 練習後再回來答。

### 8 題觀念單選

**1. Contains Duplicate：用 `Set` 記住已看過的數字，主要省下什麼工作？**

- A. 不必儲存任何資料，額外空間降為 `O(1)`。
- B. 不必每次掃描之前的數字；在一般雜湊操作平均 `O(1)` 的假設下，整體時間由兩兩比較的 `O(n²)` 降為平均 `O(n)`。
- C. 不必讀取完整輸入，任何情況都只需 `O(1)` 時間。

**2. Valid Anagram：`"aab"` 與 `"abb"` 長度一樣，也都有 `a`、`b`，為什麼仍然不是 anagram？**

- A. 因為字母排列順序不同。
- B. 因為 anagram 不允許重複字母。
- C. 因為每個字母的出現次數不同，只比較長度與字元種類不夠。

**3. Invariant 是「每一輪都保持成立的狀態描述」。假設兩個字串等長，每輪讀取各自同一個位置，對 `s` 的字元計數加一、對 `t` 的字元計數減一。處理完索引 `0...i` 後，`count[c]` 代表什麼？**

- A. 字元 `c` 在 `s[0...i]` 的出現次數，減去它在 `t[0...i]` 的出現次數；沒存入的字元視為零。
- B. 字元 `c` 在完整字串 `s` 的出現次數，與目前處理進度無關。
- C. 字元 `c` 是否曾經出現過，只可能是 `true` 或 `false`。

**4. 把 Vue 任務列表改成目前的 React `TaskPractice`，資料應該放在哪裡？**

- A. `tasks`、`draft`、`filter`、`visibleTasks`、`remainingCount` 全部各存一份 state。
- B. 由 `TaskPractice` 的 `useState` 保存 `tasks`、`draft`、`filter`，在 render 根據它們算出 `visibleTasks` 與 `remainingCount`。
- C. 只保存 `remainingCount`，再從數量還原任務內容與篩選結果。

**5. 為什麼這個小列表不用 `useEffect` 把 `remainingCount` 同步到另一份 state？**

- A. 因為 `useEffect` 不能呼叫 state setter。
- B. 因為在 render 算出的數字不會隨 `tasks` 更新。
- C. 因為它可以直接從當次的 `tasks` 算出；另存 state 再用 effect 同步會增加維護成本，也可能造成額外 render 與暫時不同步。

**6. 使用者讀取自己的 Watchlist 時，今天的最小 request flow（請求處理路徑）是哪一個？**

- A. `Client → API → Watchlist Service → DB`，查詢結果再沿呼叫路徑回傳。
- B. `Client → DB`，瀏覽器保管資料庫帳密並直接查詢。
- C. `Client → API → Cache`，即使沒有 cache 資料也不需要其他資料來源。

**7. 已有多台不保存本機使用者 session 的 Service instance，希望分配 HTTP 請求並避開不健康的 instance，應優先使用什麼？**

- A. 資料庫索引，讓索引決定 HTTP 請求送到哪台 Service。
- B. Load Balancer（負載平衡器）搭配健康檢查，將請求分配給健康的 instance。
- C. 各台 Service 的本機 `Map`，用它自動共享所有 instance 的狀態。

**8. 正在處理 50 倍流量的尖峰，監控顯示 DB connection pool 已滿、請求持續排隊。第一步比較合理的是什麼？**

- A. 只增加 Service instance，讓更多請求同時連入 DB。
- B. 讓每個失敗請求立即無限重試，直到成功。
- C. 先限制進入系統的請求量、設定有上限的排隊與 timeout，保護 DB；再依讀寫比例與瓶頸評估 cache、查詢優化或擴容。

作答區：

**第 1 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 2 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 3 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 4 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 5 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 6 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 7 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

**第 8 題（依實際情況單選）**

- [ ] A
- [ ] B
- [ ] C
- [ ] 尚不確定，先看解析再重選。

<details>
<summary>選完再展開：參考答案與白話解析</summary>

1. **B**。`Set` 保存已看過的值，讓你快速回答「這個數字之前出現過嗎？」。仍需逐一讀取輸入，最差額外空間是 `O(n)`；不能把單次平均查詢成本和整體時間混為一談。
2. **C**。`"aab"` 有兩個 `a`，`"abb"` 只有一個 `a`。Anagram 可以改變順序，但每個字元的次數必須相同。
3. **A**。這張表記的是「到目前位置，兩邊各字元的次數差」。每一輪加減後仍維持這個意義，才叫 invariant。全部處理完後，所有差值都為零才代表次數一致。若你用的是兩張頻率表，invariant 則是各表準確記錄各自已處理部分的次數。
4. **B**。本例的元件擁有原始資料；顯示清單和剩餘數量可以算出，不必再存。對照 Vue，可以把 `ref`／`reactive` 管的來源資料對應到 React state，把 `computed` 表達的衍生關係改寫成 render 中的計算；兩者的執行與快取機制並不完全相同。
5. **C**。`tasks` 改變後，React 重新執行元件，就會算出新的剩餘數量。`useEffect` 可以更新 state，但這裡沒有必要多存一份能直接算出的資料。
6. **A**。API 接收請求，Service 處理業務規則與資料權限，DB 儲存和查詢資料。API 與 Service 在最小版本可以位於同一個程式，不代表一開始就要拆成不同服務。
7. **B**。負載平衡器處理的是「請求分配到哪台健康的服務」。這只是本題指定問題的解法；分散式系統還有資料一致性、重試等其他問題，不能靠一個元件全部解決。
8. **C**。已知 DB 飽和時，先限制壓力，避免排隊與重試繼續放大負載。只增加上游 Service 不會自動增加 DB 容量；後續改善要根據量測決定。

</details>

### 實際驗證紀錄：做過才勾，可複選

選對觀念題不代表程式已經跑過。這裡不用猜標準答案，只勾你實際執行並觀察到的項目：

- [ ] 初始畫面顯示兩個任務，剩餘數量是 `1`。
- [ ] 新增一個非空白任務後，清單增加一筆、輸入框清空，剩餘數量加一。
- [ ] 提交只有空白的輸入，沒有新增任務。
- [ ] 勾選未完成任務後，剩餘數量減一；取消勾選後再加一。
- [ ] 切換 Active／Done，只顯示符合條件的任務，剩餘數量仍依全部任務計算。
- [ ] 我有執行自動化測試，已在 Part 2「證據四選一」勾選結果並保留測試輸出。
- [ ] 我有使用 Profiler 或 Debug 工具，已在 Part 2 勾選觀察結果並保留工具畫面。
- [ ] 我還沒執行程式，目前只閱讀或修改了程式碼。

手動操作證據直接勾選上方實際看到的行為，並在 Part 2 選證據種類。只改過 JSX、還沒重新操作驗證，就選「尚未執行」，不要勾通過。

### 未完成項不能只寫主題名稱

每個主題依實際情況選狀態；需要補課時直接採用對應動作，不必另寫原因。

**Contains Duplicate（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 30 分鐘：重做對應演算法練習並跑測試。

**Valid Anagram（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 30 分鐘：重做對應演算法練習並跑測試。

**React 改寫（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 20 分鐘：重選更新模型題，再操作計數器或任務列表。

**React 證據（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週六 20 分鐘：重選更新模型題，再操作計數器或任務列表。

**System Design 模板（依實際情況單選）**

- [ ] 已獨立完成並驗證。
- [ ] 看解析能理解，但尚未獨立完成。
- [ ] 尚未開始／卡住，採用下列補課動作。

補課動作：週日 20 分鐘：重選本節設計題，再照框架錄三分鐘口述。


收尾規則：

- 「還不熟 React」不是可執行缺口。
- 「Active filter 測試仍失敗，明天用 20 分鐘檢查 controlled select」才是。
- 未完成項只保留下一個最小行動，不在收尾時間開新坑。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：畫出 `Client → API → Service → DB` 最小架構

延續前兩天的 Watchlist：

- Day 1 已練習 functional／non-functional requirements。
- Day 2 已練習 DAU、QPS、頻寬與儲存估算。
- Day 3 把需求與數字接到最小可工作的 high-level design。

今天先設計「使用者讀取、新增、刪除自己的 watchlist items」。即時行情 streaming 暫時 out of scope，避免 20 分鐘內同時塞進兩條完全不同的資料流。

### 1. System Design 面試黃金四步

這是一份導航框架，不是萬能答案。45 分鐘面試可先用以下節奏，遇到面試官指定 deep dive 時再調整：

| 步驟 | 建議時間 | 回答什麼 | 離開這一步前要有什麼 |
| --- | ---: | --- | --- |
| 1. Requirements | 0–7 分 | 使用者、functional、out of scope、NFR | 問題邊界與 2–3 個品質目標 |
| 2. Capacity | 7–12 分 | DAU、平均／尖峰 QPS、資料量、頻寬 | 只算會影響選型的數量級 |
| 3. HLD | 12–27 分 | Client、API、Service、DB、核心 API、schema、request flow | 一條能從請求走到資料的完整路徑 |
| 4. Deep Dive | 27–40 分 | 分散式細節、極限流量、瓶頸、一致性、failure、trade-off | 一條 scale-out 路徑與一個極限情境解法 |
| Recap | 40–45 分 | 回扣需求、風險與下一步 | 沒漏核心 flow，主動邀請追問 |

為什麼用固定流程：

- 防止容量估算花太久，最後沒有核心架構。
- 讓每個技術元件都能回扣需求或數字，而不是堆名詞。
- 提醒自己一定要談 failure 與 trade-off。

不能硬背的地方：

- 不是每題都需要 Redis、Kafka、CDN、WebSocket 或 sharding。
- SQL／NoSQL、push／pull、一致性／可用性的答案取決於資料模型與需求。
- 面試官可能要求跳步或深入某一區，模板必須能被調整。
- CAP 只在 network partition 的情境下幫助說明取捨，不能用一句「選 AP」代替具體 failure behavior。

#### 每一題固定加問的兩個鏡頭

這兩區是在練習兩件事：**多台後端怎麼一起工作，以及人突然變多時怎麼保住服務。** 原本的問句是複習用的檢查清單；第一次接觸時，先讀下面的中文解釋和參考回答，不需要一口氣背完英文。

以下統一用「使用者收藏清單 Watchlist」當例子：前端可以讀取清單、新增收藏、刪除收藏。**參考回答是一組練習假設，不是每個系統都必須照做。**

先把你熟悉的 `fetch()` 往後延伸：

```txt
Vue／React 頁面
  → fetch('/v1/watchlist')
  → Load Balancer（把請求分給可用後端的入口）
  → Service A 或 Service B（執行後端程式）
  → Database（正式保存資料）
  → 回傳 JSON → 前端更新畫面
```

Service 是後端服務；instance 是這份後端程式的一個執行個體。可以想成同一份 Node.js API 程式開了好幾份。它們不會自動共享變數，就像兩個分頁中的 JavaScript 變數不會自動同步。

**A. 分散式架構細節：後端有好幾台，怎麼合作才不會出錯？**

##### A1｜Service 是否 stateless？session／lock／counter 放在哪裡？

**白話：** 這次請求交給 A，下一次交給 B，B 還知道你是誰、你剛才做了什麼嗎？

- **Stateless（無狀態）：** 必須跨請求保留的資料，不只綁在某一台後端的記憶體裡。不是禁止使用區域變數，也不是整個系統沒有資料。
- **Session（登入狀態）：** 記錄這個登入憑證對應哪個使用者、是否過期等。若採伺服器 session，可放在共用儲存；另一種做法是讓各台服務都能驗證 token。
- **Lock（鎖）：** 防止多個操作同時修改同一份資料而互相干擾。單機的鎖管不到另一台服務；簡單資料操作可優先靠 DB 交易與約束保護。
- **Counter（計數器）：** 例如「這個使用者一分鐘已呼叫幾次 API」。若每台各算各的，切換機器就可能繞過總限制。

**可以這樣回答：**「收藏清單存 DB，不只存在 Service A 的 Map。登入資訊讓每台服務都能驗證；跨機限流計數放在支援原子更新的共用儲存。新增收藏用 DB 唯一約束避免重複，不先引入額外的分散式鎖。」

**前端連結：** Pinia／React state 可以保存畫面資料，但不能取代後端正式紀錄。重新整理、換裝置或換後端 instance，都不應讓已儲存的收藏消失。

##### A2｜如何水平擴展與 service discovery？Load Balancer 如何判定 instance health？

**白話：** 一台忙不過來，要怎麼增加幫手？入口怎麼知道有哪些幫手、哪些已經壞了？

- **水平擴展：** 增加執行後端的個體，例如從 2 份變成 4 份。相對地，把單台換成更強的 CPU／更多記憶體叫垂直擴展。
- **Service discovery（服務探索）：** 透過平台、服務登錄或 DNS 等方式，取得目前可連線的服務位置。
- **Load Balancer（負載平衡器）：** 將請求分配給可用的 instance。
- **Health check（健康檢查）：** 檢查 instance 能否接新請求。程式還活著，不一定代表它已準備好服務；是否能接流量和是否需要重啟，可用不同檢查判定。

**可以這樣回答：**「先讓服務不依賴單機狀態，再增加 instance。平台更新可用節點名單，入口只把新請求送給通過 readiness 檢查的節點；故障節點移出，恢復並通過檢查後再加入。」

**前端連結：** 通常仍呼叫同一個 API 網址，不必自己選 A 或 B。但正在故障機器上處理的請求仍可能失敗，所以前端還是需要錯誤與重試流程。

##### A3｜Database 如何 replication、partition／sharding？partition key 為什麼不會造成 hotspot？

**白話：** 資料庫如何備援、分攤資料？分完之後，會不會大家還是只擠同一台？

- **Replication（複寫）：** 把同一份資料複製到其他節點。常見模式是主庫接受寫入、副本複製資料；副本可能落後，不能假設每台每一刻都相同。
- **Partition（分區）：** 依規則把資料切成幾部分；不一定跨機器。**Sharding（分片）**通常指把不同部分放到不同資料庫節點。
- **Partition key（分區鍵）：** 決定一筆資料分到哪一區的欄位，例如 `user_id`。
- **Hotspot（熱點）：** 某一區或某一筆資料特別熱門，其他機器很閒，它卻忙不過來。

**可以這樣回答：**「初期先用一個主庫，依備援需求配置副本；真的需要分片時，再依 `hash(user_id)` 分配，讓同一個人的收藏放一起。雜湊能幫助分散不同使用者，但不能保證沒有熱點；單一大客戶仍可能很忙，要觀察各片請求量，再考慮限流或調整分配。」

**前端連結：** 新增成功後若馬上讀到落後的副本，收藏可能看似消失。需要和後端約定「寫完立即讀」能看到自己的更新，例如暫時讀主庫；不能只靠前端多刷幾次。

##### A4｜Cache 的 key、TTL、invalidation、cache miss 與 stale behavior 是什麼？

**白話：** 想重用之前的查詢結果來加速，要用什麼名字找？多久作廢？改資料後怎麼更新？沒找到或找到舊資料時怎麼辦？

| 術語 | 中文意思 | 收藏清單例子 |
| --- | --- | --- |
| Key | 快取資料的識別名稱 | `watchlist:123` 代表使用者 123 的清單 |
| TTL | 快取存活時間 | 假設 30 秒到期；這是練習值，不是通用標準 |
| Invalidation | 讓舊快取失效 | 新增收藏成功後刪除舊快取，下次重新查 DB |
| Cache miss | 沒有可用快取 | 查 DB，取得結果後再放入快取 |
| Stale behavior | 讀到舊資料時的處理規則 | 可容忍時先顯示舊清單，標示更新時間並背景刷新 |

**可以這樣回答：**「先確認查詢負載需要快取，再以使用者 ID 當 key。DB 更新成功後讓快取失效，TTL 當額外保護。Miss 時查 DB；若允許回舊清單，要約定最大可接受資料年齡並提供更新時間。要求最新的讀取就不能任意用舊快取回答。」

注意：先寫 DB 再刪快取，也可能遇到另一個讀取把舊值重新填回的競爭；嚴格需求還要加版本判斷或協調更新流程。TTL 不等於完整一致性保證。

**前端連結：** 這和前端 query cache 的概念相似，但後端快取與瀏覽器快取是不同層。清掉前端快取，不代表後端也變新；UI 可以顯示「上次更新：10:30，正在重新整理」。

##### A5｜非同步事件如何保證 idempotency、ordering、retry、dead-letter 與 backpressure？

**白話：** 有些工作稍後才做，如果訊息重送、順序顛倒、一直失敗，或工作堆太多，怎麼處理？例如收藏存好後，再通知背景服務更新推薦資料。

| 術語 | 中文意思 | 例子與回答方向 |
| --- | --- | --- |
| Idempotency（冪等） | 同一操作重做，業務結果不重複增加 | 同一個新增收藏操作重送兩次，仍只有一筆；用操作 ID／DB 約束去重 |
| Ordering（順序） | 定義哪些事件必須依序生效 | 「新增後刪除」不能最後變成新增；同一使用者依序處理，或用版本避免舊狀態覆蓋新狀態 |
| Retry（重試） | 暫時失敗後再試 | 間隔逐次拉長、加隨機延遲，並限制次數 |
| Dead-letter（死信） | 多次失敗的訊息另存待查 | 不讓一筆壞訊息永遠阻塞其他工作；告警並修正後再決定重播 |
| Backpressure（背壓） | 下游忙不過來時，讓上游減速 | 消費端減少拉取；佇列接近上限時限制生產或拒絕新工作 |

**可以這樣回答：**「事件可能重送，因此處理端依事件 ID 去重；同一使用者的修改保留順序。暫時錯誤有限次重試，仍失敗就移到死信佇列並通知維運。監控待處理數和最老訊息等多久，過載時讓上游減速。」

如果 DB 寫入和事件發送都必須可靠完成，可以在同一個 DB 交易中保存收藏與「待發送事件」，再由背景程式發送；這叫 outbox，避免收藏存好了但通知永久漏掉。

**前端連結：** 使用者按一次新增，遇到 timeout 後重送，應沿用同一次操作 ID。停用按鈕能減少連點，但不能取代後端去重；timeout 也不代表後端一定沒有成功。

##### A6｜單機、單 AZ、單 region 失效時，RPO／RTO 和 failover 行為是什麼？

**白話：** 壞掉的範圍有多大？最多能接受丟多少近期資料、停多久？要怎麼切到備用服務？

- **單機：** 某個服務或資料庫節點故障。
- **AZ（可用區）：** 同一地理區域內有隔離供電、網路等設計的部署區域。一個 AZ 故障可能影響多台機器。
- **Region（區域）：** 更大的地理部署範圍，通常包含多個 AZ。
- **RPO（復原點目標）：** 最多可接受失去多長時間內的資料。例如目標 1 分鐘，表示最多容忍最近 1 分鐘的更新遺失。
- **RTO（復原時間目標）：** 最多可接受花多久恢復服務。例如目標 10 分鐘。
- **Failover（故障切換）：** 改由備用服務／資料庫接手。

**可以這樣回答：**「Service 單機壞掉就從入口移除，其他 instance 接新請求。單 AZ 故障需有其他 AZ 的服務與資料庫備援；整個 region 故障則需跨區備援。假設業務接受 RPO 1 分鐘、RTO 10 分鐘，我會以此設計並演練驗證，不能因為有副本就宣稱達標。切換資料庫寫入前，要確保舊主庫不能繼續接受寫入。」

**前端連結：** 切換期間可能只能看舊清單、暫時不能新增。畫面需分清楚「已儲存」「儲存失敗」「結果待確認」，不能全部顯示成功。

##### A7｜網路分區時，哪些操作寧可拒絕，哪些可以接受 stale data？

**白話：** 兩邊服務都還活著，卻互相聯絡不到。如果無法確認最新資料，還要繼續提供哪些功能？這裡的「網路分區」不是 A3 的資料分片。

**可以這樣回答：**「假設收藏清單允許短暫看舊資料，讀取可以回最後一次快照並標示更新時間。若新增或刪除必須經由唯一主庫確認，而現在無法連到主庫，就先不接受這些寫入，避免兩邊各改各的。已送出但沒收到結果的操作顯示待確認，恢復後查狀態或用原操作 ID 重試。」

**前端連結：** 可以保留最後成功載入的清單並顯示「連線異常，以下是先前資料」。若支援離線編輯，也要明確顯示「尚未同步」；存在瀏覽器不等於後端已儲存。

**B. 高流量極限場景：突然很多人一起打 API，要怎麼撐住？**

##### B1｜先量化壓力：QPS、極限倍數、持續多久、讀寫比、payload、hottest key

**白話：** 「很多人」到底是多少？他們同時在做什麼？

- **QPS：** 每秒請求數。100 人各在同一秒發 5 次請求，就是約 500 QPS；不是 100 QPS。
- **極限倍數與持續時間：** 1,000 QPS 暴增 50 倍到 50,000 QPS，持續 5 分鐘；短暫尖峰和整天高負載的策略不同。
- **讀寫比：** 例如 99% 查清單、1% 修改清單；能快取的讀取和需可靠儲存的寫入成本不同。
- **Payload：** 每次傳送的資料大小，例如一份回應 2 KB。
- **Hottest key：** 被讀寫最頻繁的資料識別值，例如某位使用者的 `watchlist:123`。多人讀各自清單，與大量請求集中讀同一份資料，壓力分布不同。

**可以這樣回答：**「練習假設平常尖峰 1,000 QPS，重連時升到 50,000 QPS 並持續 5 分鐘，99% 讀、1% 寫。若每個讀取回應 2 KB，單是讀回應就約 99 MB/s，尚未算協定等額外成本。我也會查是否集中在少數使用者。」

**前端連結：** 多個元件重複請求、所有使用者同時輪詢、斷線後立刻重連，都會把 QPS 放大。

##### B2｜說出第一個會爆的資源：CPU、memory、connection pool、DB IOPS、lock、queue age、egress

**白話：** 哪一個環節會先忙不過來？「會爆」通常指延遲變大、排隊或錯誤增加。

| 指標／資源 | 白話解釋 |
| --- | --- |
| CPU | 程式計算來不及，例如大量排序、壓縮或 JSON 處理 |
| Memory | 記憶體不足，例如一次載入太多資料或累積太多等待中的請求 |
| Connection pool | 可重用的 DB 連線集合；連線全被占用時，新查詢要等待或失敗 |
| DB IOPS | 資料庫儲存層每秒處理讀寫操作的能力 |
| Lock | 多個操作搶同一筆資料的修改權，只能互相等待 |
| Queue age | 佇列中工作已等待多久；它是塞車指標，不是硬體資源 |
| Egress | 對外傳出的資料流量，可能碰到頻寬上限或增加成本 |

**可以這樣回答：**「這題先假設大量讀取沒命中快取，導致 DB 連線池先塞滿。我會看連線等待時間、查詢延遲和 DB 負載，驗證是否真的卡在這裡；不能只憑 QPS 猜是哪個資源。」

**前端連結：** API 很慢，不一定是 React render 慢；瀏覽器 Network 的等待時間可提供線索，後端瓶頸仍需要伺服器監控確認。

##### B3｜說出 admission control：rate limit、quota、load shedding、bounded queue、timeout

**白話：** 服務忙不過來時，要限制多少工作進來、等多久，避免全部一起倒。

- **Admission control（准入控制）：** 決定哪些新請求可以進來的總體策略。
- **Rate limit（限速）：** 限制單位時間的請求量，例如一個使用者每分鐘最多 60 次。
- **Quota（配額）：** 分配可用額度，例如每個帳號每天的呼叫總量，或保留給核心功能的處理額度。
- **Load shedding（丟棄過量負載）：** 過載時及早拒絕部分請求，保護仍能處理的工作。
- **Bounded queue（有界佇列）：** 排隊名額有限，不能無限往記憶體塞請求。
- **Timeout（逾時）：** 等待有上限，避免資源一直被占著；客戶端逾時不保證伺服器工作已取消。

**可以這樣回答：**「每位使用者限速，超額回 429；服務總處理數與排隊數也設上限，容量不足時回 503，並提供適當的稍後重試資訊。各層設定等待上限，避免請求一直堆積。」

**前端連結：** 收到 `429` 時，依 `Retry-After` 等待；不要寫成失敗就立即再 `fetch()`。寫入逾時要確認結果，不要一律當作完全沒執行。

##### B4｜說出吸收尖峰的方法：batching、coalescing、cache、queue、pre-warm、autoscaling

**白話：** 哪些工作可以合併、重用、晚點做？哪些容量可以提前準備或增加？

| 方法 | 中文解釋 | 例子與限制 |
| --- | --- | --- |
| Batching | 多筆工作合成一批 | 一次查多個標的；要限制批次大小與等待時間 |
| Coalescing | 同時要同一份資料的請求共用一次工作 | 同一使用者同時有 10 次 cache miss，只查一次 DB；不同使用者的私有清單不能混用 |
| Cache | 重用已有結果 | 重複讀取少查 DB，但需要失效與舊資料策略 |
| Queue | 先排隊、之後處理 | 通知或推薦更新可晚點做；不會讓總工作量消失，長期進得比出得快仍會塞滿 |
| Pre-warm | 提前準備容量 | 活動前啟動服務、建立連線、準備確定會用到的快取 |
| Autoscaling | 自動增加或減少 instance | 依負載調整容量，但啟動需要時間，下游 DB 也可能已到上限 |

**可以這樣回答：**「重複讀取先用快取和同 key 請求合併減少 DB 工作。允許延遲的背景任務放有上限的佇列，活動前準備容量，再依監控擴展服務。收藏寫入若尚未持久保存，不能只因排進記憶體佇列就回『已儲存』。」

**前端連結：** 輸入搜尋時 debounce 可以減少請求；多個元件共用查詢結果可以避免重複呼叫。但單一瀏覽器的優化，仍要搭配伺服器整體保護。

##### B5｜說出降級順序：先犧牲什麼非核心功能？如何呈現 stale／partial？

**白話：** 做不到全部功能時，先保住什麼？使用者要怎麼知道現在不是完整、最新的結果？

- **降級：** 暫時提供較少或較簡單的功能，保留核心流程。
- **Stale：** 資料是舊的，不一定缺項。
- **Partial：** 資料不完整，例如清單載入成功，但其中一些標的的額外資訊載入失敗。

**可以這樣回答：**「先停推薦計算，再降低背景刷新頻率；收藏清單在允許的資料年齡內可以回舊快照。保留核心讀寫的容量；仍無法確認寫入結果時，不能假裝成功。」

**前端連結：** 清單可以繼續顯示，推薦區顯示「暫時無法載入」；舊資料標示更新時間，部分失敗標示缺少哪一區。不要把部分載入失敗渲染成『你沒有任何收藏』。

##### B6｜說出恢復方式：retry storm、逐步放量、drain backlog、校驗一致性

**白話：** 系統剛恢復時，怎麼避免所有人一起重試又把它打倒？之前沒做完的工作怎麼補？

- **Retry storm（重試風暴）：** 很多客戶端或服務同時重試，形成第二波壓力。
- **逐步放量：** 慢慢提高允許流量，觀察延遲與錯誤率，穩定才繼續增加。
- **Drain backlog（消化積壓）：** 在下游承受範圍內逐批完成排隊工作，並保留處理新請求的能力。
- **校驗一致性：** 確認正式資料、快取和背景處理結果是否對得上，例如比對清單版本、檢查有無漏做或重複操作。

**可以這樣回答：**「重試採逐次拉長的間隔並加入隨機延遲，避免所有人同一秒重送。恢復後逐步放量，控制背景工作處理速度，觀察 DB 與佇列。重播失敗事件前確認去重有效，再檢查資料版本是否一致。」

**前端連結：** 例如失敗後約等 1、2、4 秒再試，每次加一點隨機時間並設次數上限。這只是時間策略；能否重試，仍取決於操作是否安全、能否用相同操作 ID 去重。

##### 為什麼「多開機器」不是完整解法？

想像原本有 2 台 API，各允許 50 條 DB 連線，合計最多 100 條；擴成 10 台後就可能要求 500 條。但 DB 假設只能提供 200 條連線，API 變多也不會把 DB 容量一起變大。

就像多開收銀台，卻仍只有同一個出餐口：訂單收得更快，後面反而塞得更嚴重。所以要先找到瓶頸，限制流入，再決定增加哪一層容量。這裡的「擴 Service」是增加後端 API 執行個體。

##### 前端初學者可以先練這段回答

> 「我先讓每台 API 都能處理同一位使用者的請求，正式收藏資料存 DB。流量變大時，先看 DB 連線和查詢是否塞住，再用快取、合併重複查詢及限流保護它。畫面可以在約定範圍內顯示舊清單，但要標示更新時間；新增收藏如果逾時，先顯示結果待確認，用同一個操作 ID 查詢或重試。服務恢復時，逐步恢復流量，避免大家一起重送。」

第一輪先能說明「請求去哪裡、資料存哪裡、忙碌或故障時畫面怎麼辦」。第二輪再逐項加入上述術語和取捨，不需要第一次就熟悉跨區資料庫操作。

### 2. 四步框架情境選擇題

依題目給定情境選答案，再對照解析；口述時沿用選定情境即可：

本次固定設計「使用者讀取、增刪與排序自己的 Watchlist」，不包含下單。以下各題採題目列出的假設，每題選一個最合適的答案。

**單選｜Step 1：哪組需求足以界定今天的範圍？**

- [ ] A. 只說系統要快，不定義行為。
- [ ] B. 讀取、增刪與排序清單；操作須驗證 owner，保存成功代表 DB 已確認；下單不在範圍。
- [ ] C. 先決定 Redis 和 Kafka，再決定使用者需求。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 功能、權限與成功語意要先確定，才能檢查架構是否滿足需求。

</details>

**單選｜哪一組品質目標可以驗收？**

- [ ] A. 很快、永不故障、絕對安全。
- [ ] B. 有用 Load Balancer 就算達成所有品質需求。
- [ ] C. 練習假設：讀取 p95 ≤ 200 ms、月可用率 99.9%、寫入需持久化確認，請求須驗證身分與 ownership。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 數字是練習假設，需和面試官確認；指標有測量範圍才有辦法驗收。

</details>

**單選｜假設 100 萬 DAU、每人每天 8 次 API 請求、尖峰是平均的 10 倍，尖峰 QPS 約是多少？**

- [ ] A. 8,000,000 QPS，因為每日有八百萬次。
- [ ] B. 約 926 QPS，做數量級估算可用約 1,000。
- [ ] C. 約 93 QPS，不需要乘尖峰倍數。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 平均為 1,000,000 × 8 ÷ 86,400 ≈ 92.6 QPS，再乘 10；每日總量不是每秒流量。

</details>

**單選｜100 萬份清單，每份 2 KB，保存目前版本且有三副本，資料量約多少？**

- [ ] A. 6 GB，尚未加索引、歷史版本與儲存系統開銷。
- [ ] B. 6 MB，因為副本會壓縮。
- [ ] C. 2 GB，副本不用占空間。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 十進位估算：1,000,000 × 2 KB × 3 = 6 GB；保留歷史資料需要另估 retention。

</details>

**單選｜讀取自己的 Watchlist，最小且有權限檢查的路徑是哪一條？**

- [ ] A. Client 直接帶資料庫帳密查 DB。
- [ ] B. Client → API → Service 驗證使用者權限 → DB，再沿原路回傳。
- [ ] C. Client → Cache；沒有資料也直接宣稱成功。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** API 接收請求，Service 處理權限與規則，DB 是資料來源；邏輯分層不要求部署成不同服務。

</details>

**單選｜新增標的 API 與資料模型，哪個設計符合 ownership 和安全重試？**

- [ ] A. 只信任 body 的 user_id，任何人都可指定其他帳戶。
- [ ] B. 驗證身分後新增標的，用 (user_id, symbol) 唯一約束防重複，操作 ID 用於查詢重試狀態。
- [ ] C. 逾時一律回成功，不必查是否提交。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 例如 POST /watchlist/items 帶 symbol，成功回已保存項目；未授權或驗證錯誤需明確回應。唯一約束限制資料，操作 ID 處理操作重複，責任不同。

</details>

**單選｜DB 連線池已滿，請求仍持續增加，第一步應如何處理？**

- [ ] A. 讓每個失敗請求立即無限重試。
- [ ] B. 只增加上游 Service，讓更多請求進入 DB。
- [ ] C. 限流、限制排隊與 timeout，先保護 DB，再依量測優化。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 上游擴容不會自動增加 DB 容量；重試還會放大壓力。恢復時需逐步放量。

</details>

**單選｜假設正常 1,000 QPS、尖峰 50 倍持續 5 分鐘，且 DB pool 飽和，哪個計畫完整？**

- [ ] A. 先限流、限制排隊與 timeout；非核心讀取允許明確 stale；恢復時逐步放量並查資料。
- [ ] B. 只寫 autoscale，不監控下游。
- [ ] C. 全部無限排隊，等五分鐘後再處理。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 尖峰為 50,000 QPS。需同時觀察 pool、延遲、錯誤率及 queue age，避免過期工作拖垮恢復。

</details>

**單選｜如何做有條件的架構取捨？**

- [ ] A. 所有系統都必須一開始就 sharding。
- [ ] B. Cache 永遠正確且沒有維護成本。
- [ ] C. 先選 DB 直接讀取以降低複雜度；若量測顯示熱讀成為瓶頸，再加入 cache 並設失效策略。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 選擇要說清好處、代價與改選條件；不能只列技術名稱。

</details>

### 3. 面試口述版本選擇

**選一個口述練習版本（依實際情況單選）**

- [ ] 基礎版：依上方正確選項，說明需求、三個容量數字、請求路徑與 DB 過載保護。
- [ ] 進階版：基礎版再加 region 故障、資料可能遺失的範圍及 cache 代價。

口述時沿用已選的具體情境，不需要另造題目或數字。

### 4. 今天的 20 分鐘壓縮版

| 分鐘 | 四步 | 今日輸出 |
| ---: | --- | --- |
| 0–3 | Requirements | 3 個功能、2 個 out of scope、3 個 NFR |
| 3–6 | Capacity | 沿用 Day 2 的三個數量級 |
| 6–12 | HLD | `Client → API → Watchlist Service → DB`＋一條 read flow |
| 12–17 | Deep Dive | DB failure＋分散式演進＋50 倍尖峰 |
| 17–20 | Recap | 3 分鐘口述，必須提到限流、降級與恢復 |

### 5. 最小架構與故障情境選擇題

**單選｜讀取自己的 Watchlist，最小且有權限檢查的路徑是哪一條？**

- [ ] A. Client 直接帶資料庫帳密查 DB。
- [ ] B. Client → API → Service 驗證使用者權限 → DB，再沿原路回傳。
- [ ] C. Client → Cache；沒有資料也直接宣稱成功。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** API 接收請求，Service 處理權限與規則，DB 是資料來源；邏輯分層不要求部署成不同服務。

</details>

**單選｜目前 DB 讀取延遲正常，是否立即加入 cache？**

- [ ] A. 一定要，架構圖越多元件越完整。
- [ ] B. 先保留最小路徑；量測到重複熱讀與延遲瓶頸，再評估 cache。
- [ ] C. 完全不需要監控，以後再說。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** Cache 多一份資料副本，需要處理 miss 與失效；有明確收益才值得加入。

</details>

**單選｜單一 region 失效、備區採非同步 replica，安全的讀寫策略是哪個？**

- [ ] A. 舊、新兩區都接受寫入，最後人工合併。
- [ ] B. 備區有副本就保證零資料遺失。
- [ ] C. 允許舊資料的讀取可標 stale；寫入先等待受控 promotion 與 fencing，且承認最新未複寫資料可能遺失。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** Fencing 阻止舊主節點繼續寫入；非同步複寫不能無條件保證 RPO 為零。

</details>

<details>
<summary>完成四步答題卡後再看：Watchlist 示範答案</summary>

#### Step 1｜Requirements

Functional：

1. 使用者可讀取自己的 watchlist items。
2. 使用者可新增一個 symbol，且同一 symbol 不重複。
3. 使用者可刪除一個 symbol。

Out of scope：即時價格 streaming、搜尋 symbol、通知與多裝置衝突 UI。假設 API 前已有登入驗證，但 service 仍要依 authenticated user ID 做 authorization。

Non-functional：

- Read API p95 latency 小於 200 ms。
- 月可用性目標 99.9%。
- 已回覆成功的 watchlist write 不可靜默遺失。
- 使用者只能讀寫自己的資料。

#### Step 2｜Capacity

沿用 Day 2 的練習假設：

```txt
1,000,000 DAU
約 1,000 peak API QPS
每人最多 20 個 symbols → 最多約 20,000,000 rows
約 2 GB raw current metadata；三副本約 6 GB
```

這個規模不需要一開始就分庫。先建立正確 index、觀察實際 read/write ratio、connection pool 與 p95 latency。

#### Step 3｜High-Level Design

```txt
┌──────────────┐   HTTPS / JSON   ┌────────────────────┐
│ Web / Mobile │ ───────────────→ │ API / Load Balancer│
│ Client       │ ←─────────────── │ Auth + Rate Limit  │
└──────────────┘                  └──────────┬─────────┘
                                            │ internal request
                                            ▼
                                 ┌────────────────────┐
                                 │ Watchlist Service  │
                                 │ validation + authz │
                                 └──────────┬─────────┘
                                            │ parameterized SQL
                                            ▼
                                 ┌────────────────────┐
                                 │ PostgreSQL         │
                                 │ source of truth    │
                                 └────────────────────┘
```

責任：

- Client：顯示清單、提交使用者意圖、處理 loading／error。
- API／Load Balancer：TLS termination、驗證身份、rate limit、routing；多實例避免單點。
- Watchlist Service：驗證 symbol、檢查 user ownership、執行 use case；保持 stateless 以便水平擴展。
- PostgreSQL：持久化、唯一約束與 transaction，作為 watchlist source of truth。

核心 API：

```http
GET /v1/watchlist
200 { "items": [{ "symbol": "BTCUSDT", "position": 0 }] }

POST /v1/watchlist/items
{ "symbol": "ETHUSDT" }
201 { "symbol": "ETHUSDT", "position": 1 }

DELETE /v1/watchlist/items/ETHUSDT
204 No Content
```

資料模型：

```sql
CREATE TABLE watchlist_items (
  user_id BIGINT NOT NULL,
  symbol VARCHAR(32) NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, symbol)
);

CREATE INDEX watchlist_items_user_position_idx
  ON watchlist_items (user_id, position);
```

Read flow：

1. Client 帶 access token 呼叫 `GET /v1/watchlist`。
2. API 驗證身份、rate limit，將可信任的 user ID 傳給 Watchlist Service。
3. Service 以 `user_id` 查詢 DB，依 `position` 排序。
4. Service 回傳 DTO；Client render list。查詢超時則回明確 error，不把舊資料冒充成最新結果。

#### Step 4｜Deep Dive、Failure 與 Trade-off

Failure case：PostgreSQL 無法連線。

- 使用者看到：讀取顯示暫時無法載入；寫入不可假裝成功。
- 偵測：DB connection error、pool saturation、query timeout、API 5xx、p95/p99 latency。
- 保護：設定 bounded connection pool 與 query timeout；避免每層無限制重試造成 retry storm。
- 恢復：DB failover 後逐步恢復流量，確認 error rate 與 replica lag；只有具有 idempotency 或安全語意的操作才自動重試。

Trade-off：先選 PostgreSQL，而不是 document database。

- 原因：資料模型有明確 user ownership、每位使用者 symbol 唯一約束與排序需求；transaction 與 constraint 直接。
- 代價：要管理 schema、connection pool，極大規模時可能需要 partition／sharding。
- 改選條件：若主要存取永遠是整份文件、單一使用者內原子更新、schema 高度彈性，而且實際 scale／團隊營運經驗支持 document store，才重新評估。

今天不先加 Cache：目前資料小、單次查詢至多 20 rows，cache invalidation 會增加寫入一致性與 stale data 複雜度。只有 DB read load、p95 latency 或成本量測顯示需要時，才評估 read-through cache；同時要定義 TTL、invalidate 與 stale behavior。

#### 分散式架構演進

只有在流量、跨區需求或量測到的瓶頸出現後，才把最小架構演進成：

```txt
                            ┌──────────── Region A ────────────┐
Clients                     │                                  │
   │                        │  Load Balancer                   │
   ▼                        │       │                          │
Global Traffic Manager ─────┼───────▼                          │
   │                        │  Stateless Watchlist Services    │
   │                        │       │           │              │
   │                        │       ▼           ▼              │
   │                        │  Redis Cache   Shard Router      │
   │                        │                   │              │
   │                        │            PostgreSQL Shards     │
   │                        │             Primary + Replica    │
   │                        └───────────────────┬──────────────┘
   │                                            │ async replication
   │                        ┌──────────── Region B ────────────┐
   └────────────────────────┼── Warm Services + Read Replica  │
                            │   controlled failover target     │
                            └──────────────────────────────────┘

DB transaction → Outbox／CDC → Event Bus → Cache invalidation／Audit consumers
```

分散式細節：

- **Stateless service：** 登入狀態不放在單一 instance memory；instance 只處理 request，讓 Load Balancer 可依 health check 移除故障節點並水平擴展。
- **Partition key：** 以 `hash(user_id)` 選 shard，使同一使用者最多 20 筆 watchlist rows 留在同一 shard，單一使用者操作不需 distributed transaction。要持續監控 shard size、QPS 與 hottest keys；企業帳號或機器流量仍可能造成 user hotspot。
- **Replication：** shard 內以 primary 接 write，replica 分擔允許稍舊的 read。跨 region 若採 asynchronous replication，就必須承認可能有 replica lag 與非零 RPO；若業務要求跨區 acknowledged write 也達 RPO 0，需同步共識或跨區同步複寫，代價是 write latency 與 partition 時可用性。
- **Read routing：** 一般 read 可打 replica；write 後立即 read 若要求 read-your-writes，短時間路由 primary，或攜帶已提交 version，直到 replica 追上該 version。
- **Cache consistency：** key 可用 `watchlist:{user_id}`。先寫 DB 成功，再刪除或更新 cache；event bus 再做跨 instance／跨區 invalidation。TTL 是最後保護，不是唯一一致性策略。回覆 cache 資料時要能辨認 version 與 stale 狀態。
- **Reliable event：** DB update 與 outbox record 放在同一 transaction，再由 CDC／publisher 送到 event bus，避免 DB 已成功但 invalidation event 永久遺失。Consumer 以 event ID 去重，重試有上限，失敗進 dead-letter queue，並監控 consumer lag。
- **Idempotency：** 新增／刪除可優先設計成 idempotent resource operation；若仍使用 POST，接受 `Idempotency-Key` 並保存操作結果。DB 的 `(user_id, symbol)` unique constraint 是最後一道重複保護。
- **跨區寫入：** 每個 `user_id` 指定 home region，正常時所有 write 只進 home region。區域切換必須先 fencing 舊 primary，再提升新 primary，避免兩邊同時接受寫入造成 split-brain。

#### 高流量極限場景：50 倍讀取尖峰＋Reconnect Storm

練習假設：平常 peak 約 `1,000 QPS`；市場開盤時 5 分鐘內放大 50 倍到 `50,000 QPS`，大量 clients 同時重連並重新讀取 watchlist。

最可能先爆的不是 React client，而是共享下游：cache miss 造成 database connection pool、primary／replica IOPS 與 query latency 飽和。若每個 service instance 都自行無限制重試，會形成 retry amplification。

解法依順序執行：

1. **入口抑制：** Client 使用 exponential backoff＋jitter；API 以 user／IP／token bucket rate limit，超量回 `429`＋`Retry-After`，防止同一 client 緊密重試。
2. **限制在途工作：** Service 設 concurrency limit、bounded queue 與 deadline；queue 滿時 load shed，不把 request 無限堆到 timeout。每個 instance 的 DB pool 設上限，整體連線數不能隨 service instance 無限制相乘。
3. **吸收重複 read：** 已導入 cache 時，使用 versioned watchlist snapshot；同一 user 的 concurrent cache miss 用 request coalescing／singleflight，只允許一個請求回源。允許的話以短暫 stale-while-revalidate 回覆，response 明確帶 `stale: true`。
4. **保護核心 write：** Read 與 write 使用不同 quota／pool 預算，避免 read storm 吃光 write 資源。無法確認落盤的 write 回明確失敗，不把它悄悄丟進無界 queue；Client 帶 idempotency key 才能安全重試。
5. **水平擴展：** 預熱 stateless service capacity，autoscaling 依 concurrency、CPU 和 queue age，而不只看平均 CPU。Cache／DB 若已是瓶頸，暫停繼續擴 service，先保護下游。
6. **降級順序：** 先停非核心 audit enrichment／推薦排序，再降低背景 refresh；read 可在契約允許下顯示最後 snapshot＋stale 標記。新增／刪除若不能保證 durability，寧可回 `503`，不要假成功。
7. **恢復：** 尖峰下降後逐步提高 rate limit，避免瞬間釋放 backlog；觀察 DB latency、pool usage、cache hit rate、replica lag、outbox lag 與 error rate。重播 dead-letter 前先驗證 idempotency，最後抽樣比對 cache version 與 DB source of truth。

#### 分散式極限 Failure：整個 Home Region 失效

- **讀取：** 若產品允許 eventual consistency，可由 Region B 的 replica 回最後 snapshot，並帶 version／stale 標記；若不能接受舊資料則明確失敗。
- **寫入：** 在完成 primary promotion 與 fencing 前先拒絕，避免兩個 region 同時接受 write。切換完成後，以 idempotency key 重送未確認的操作。
- **RPO／RTO：** asynchronous cross-region replica 可能遺失尚未複寫的最新 write；具體 RPO／RTO 必須先成為 requirement。不能同時口頭承諾零資料遺失、低跨區延遲與 partition 時永遠可寫，卻不說同步共識的成本。
- **復原：** 舊 region 回來時不能直接恢復 write；先比對 timeline／LSN、補齊資料、重建 replica，再由 traffic manager 漸進導流。

Recap：正常流量先以 stateless service 與 PostgreSQL 唯一約束滿足讀寫、ownership 與 durability；當量測證明需要，再以 user-based sharding、replication、versioned cache 和 outbox 演進。50 倍尖峰時先限流與保護下游，再以 cache／coalescing 吸收 read、明確降級，最後漸進恢復並校驗資料。

</details>

### 6. 今日主動產出

至少完成一項；不要把示範答案直接勾成自己的產出。

#### [ ] 一張小圖

**單選｜圖上的箭頭代表什麼？**

- [ ] A. Client 送 HTTP 請求到 API，Service 向 DB 查詢／寫入，結果沿呼叫路徑回傳。
- [ ] B. 所有箭頭都代表 WebSocket。
- [ ] C. 所有元件共享同一份瀏覽器記憶體。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 箭頭需要明確資料與方向。選完後可照這條路徑重畫，作為自己的圖形產出。

</details>

#### [ ] 三個數字

**單選｜假設 100 萬 DAU、每人每天 8 次 API 請求、尖峰是平均的 10 倍，尖峰 QPS 約是多少？**

- [ ] A. 8,000,000 QPS，因為每日有八百萬次。
- [ ] B. 約 926 QPS，做數量級估算可用約 1,000。
- [ ] C. 約 93 QPS，不需要乘尖峰倍數。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 平均為 1,000,000 × 8 ÷ 86,400 ≈ 92.6 QPS，再乘 10；每日總量不是每秒流量。

</details>

**單選｜100 萬人、每人最多 20 個標的，最多多少清單項目？**

- [ ] A. 20,000 列。
- [ ] B. 20,000,000 列；列數會影響索引與儲存估算。
- [ ] C. 1,000,000 QPS。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 人數乘每人項目數得到列數，不是 QPS。再搭配每份 2 KB 與三副本估算約 6 GB，不含索引。

</details>

選完後照公式重新算一次，才勾選「三個數字」產出。

#### [ ] 一個 Failure Case

**單選｜DB 寫入 timeout，哪個 failure case 描述正確？**

- [ ] A. 畫面仍顯示成功，因為 timeout 只影響網路。
- [ ] B. 立即無限重送，重複操作由使用者自行刪除。
- [ ] C. 畫面顯示結果待確認；查操作狀態，以操作 ID 安全重試，並監控 timeout 與 DB 健康。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** Timeout 不代表一定沒提交；若不確認結果，重試可能重複執行。選完後用此情境口述偵測、保護與恢復。

</details>

#### [ ] 3 分鐘口述

```txt
0:00–0:30  Requirements 與 out of scope
0:30–0:50  三個容量數字
0:50–1:35  最小架構與一條 request flow
1:35–2:10  分散式演進：stateless、replication、partition key
2:10–2:45  50 倍尖峰：第一個瓶頸、限流、降級、恢復
2:45–3:00  核心 trade-off 與 recap
```

#### 固定加壓卡：選擇題與進度確認

這兩張卡是 Deep Dive 的最低門檻，不取代上面的四選一主動產出：

**單選｜要跨 Service instance 擴展，哪些資料不能只放在單機 Map？**

- [ ] A. 跨請求必須共享的使用者狀態；持久資料以 DB 為權威，讀 replica 要處理 lag。
- [ ] B. 函式內部的暫時計算，所有區域變數都要放 DB。
- [ ] C. 不必區分資料，Map 自動跨程序共享。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** Stateless 是避免把跨請求的必要狀態綁在單一 instance，不是禁止所有記憶體使用。

</details>

**單選｜以 user_id 分片時，哪個風險與保護方式合理？**

- [ ] A. 每個使用者一定流量相同，不用監控。
- [ ] B. 大客戶可能形成熱點，需觀察分片負載；cache 要有版本／失效策略，事件重送要能去重並驗證順序。
- [ ] C. 分片之後不會再有重複事件。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** Partition key 影響資料與流量分布；cache 和事件重試仍有各自的一致性問題。

</details>

**單選｜DB 連線池已滿，請求仍持續增加，第一步應如何處理？**

- [ ] A. 讓每個失敗請求立即無限重試。
- [ ] B. 只增加上游 Service，讓更多請求進入 DB。
- [ ] C. 限流、限制排隊與 timeout，先保護 DB，再依量測優化。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 上游擴容不會自動增加 DB 容量；重試還會放大壓力。恢復時需逐步放量。

</details>

**加壓卡完成狀態（依實際情況單選）**

- [ ] 已選完上題，並能說明 1,000 → 50,000 QPS、限流、降級與恢復。
- [ ] 能選答案，但口述還需要看解析。
- [ ] 尚未完成，週日安排 20 分鐘重選與口述。

### 7. System Design 常見失誤

- 一開始就畫 Redis、Kafka、CDN，卻還沒說系統要做什麼。
- 容量估算超過十分鐘，算了很多不影響任何選型的數字。
- 只有 component boxes，沒有一條完整 request／data flow。
- API 沒說 authenticated user 的 ownership，DB schema 也沒有 constraint。
- 說「加 cache 就會快」，卻沒有 miss、TTL、invalidation 或 stale behavior。
- 說「服務多開幾台」，卻保留 instance-local session/state，無法真的水平擴展。
- 提到 replication 卻沒說同步／非同步、replica lag、read routing 與 failover。
- 提到 sharding 卻沒說 partition key、resharding 與 hottest key。
- 加了 queue 卻沒說 bounded capacity、ordering、idempotency、retry 與 dead-letter。
- 只講正常路徑，沒說 timeout、partial failure、retry storm 與使用者狀態。
- 說「流量很大就 autoscale」，但沒有極限倍率、第一個下游瓶頸、load shedding 與降級順序。
- 只說選 SQL／NoSQL，沒有需求理由、代價與改選條件。

### 8. 今日 System Design 驗收

- [ ] 我能在 3 分鐘內走完 Requirements → Capacity → HLD → Deep Dive。
- [ ] 我先畫最小可工作路徑，再依數字或瓶頸增加元件。
- [ ] 圖上每個 box 有單一主要責任，每條箭頭知道傳什麼。
- [ ] 我能從 Client 口述到 DB，再把 response 帶回 Client。
- [ ] API 與 schema 能支援今天承諾的 functional requirements。
- [ ] 我能說明 stateless、replication、partition key、cache consistency 與 idempotency。
- [ ] 我能說明單 AZ／region 失效時的讀、寫、fencing、RPO／RTO 取捨。
- [ ] 我已量化一個高流量極限場景，指出第一個飽和資源。
- [ ] 極限解法包含 admission control、backpressure、降級與漸進恢復。
- [ ] Failure case 包含使用者狀態、偵測、保護與恢復。
- [ ] Trade-off 包含選擇理由、代價與改選條件。
- [ ] 我完成小圖／三個數字／failure case／3 分鐘口述至少一項。

---

## 今日結束打卡

這是進度自評，沒有標準答案；每列選一個符合實際結果的狀態。選對知識題不等於完成程式或錄音。

**兩題演算法（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**React 改寫與操作（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後能完成，還需練習。
- [ ] 已獨立完成，並執行測試或口述驗證。

**System Design 最小架構（依實際情況單選）**

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

真正完成的標準不是「今天看了很多」，而是留下可再次驗證的輸出：

1. 四份演算法實作、兩個 invariant、兩組 Big-O 與兩張狀態圖。
2. 一個沒有 effect 同步 derived state 的可執行 React 列表／表單。
3. 一項 React 執行、測試、Profiler 或 Debug 證據。
4. 八題觀念單選的作答與訂正、實際驗證紀錄，以及明確未完成項。
5. 一份能在 3 分鐘內走完，且包含分散式細節與高流量極限解法的 System Design 四步答題卡。
