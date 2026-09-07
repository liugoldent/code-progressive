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

## 今日完成定義

- [ ] **NeetCode 150｜45 分鐘**：閉卷重寫 Contains Duplicate＋Valid Anagram 的 JavaScript 與 Python 版本，補上圖解、invariant 與 Big-O。
- [ ] **React 實戰｜60 分鐘**：把 Vue 列表／表單改寫成 React；禁止用 effect 同步 derived state，並留下可執行程式、測試、Profiler 或 Debug 證據至少一項。
- [ ] **收尾｜15 分鐘**：用自己的話寫 5 句技術筆記，逐項標記完成／未完成與下一個最小行動。
- [ ] **System Design × 高併發｜20 分鐘**：使用四步答題模板，畫出 `Client → API → Service → DB` 最小架構，並回答分散式演進與 50 倍流量極限場景；至少完成一項主動產出。

建議依照固定訓練時段執行：

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | NC150 閉卷重現 | JavaScript＋Python、兩張小圖、Big-O、卡點 |
| 21:15–22:15 | Vue 列表／表單轉 React | 可執行程式、測試、Profiler 或 Debug 證據之一 |
| 22:15–22:30 | 收尾 | 5 句技術筆記與未完成標記 |
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
| 3–11 | Contains Duplicate | JavaScript＋Python 閉卷實作 |
| 11–21 | Valid Anagram | JavaScript＋Python 閉卷實作 |
| 21–29 | 執行測試 | 每題至少 5 組，共用語言中立測資 |
| 29–35 | 補 invariant 與 Big-O | 不只寫結論，要說成本從哪裡來 |
| 35–42 | 畫兩張狀態圖 | 每一步的輸入、保存狀態與判斷 |
| 42–45 | 對答案、標記卡點 | 只看自己缺的段落，不重讀全文 |

### 1. 先寫題目契約

```txt
Contains Duplicate
輸入：
輸出：
可否修改輸入：
找到答案後能否提早結束：

Valid Anagram
輸入：
輸出：
順序是否重要：
重複次數是否重要：
```

### 2. 閉卷程式模板

#### Contains Duplicate｜JavaScript

```js
function containsDuplicate(nums) {
  // 閉卷完成
}
```

#### Contains Duplicate｜Python

```python
def contains_duplicate(nums: list[int]) -> bool:
    # 閉卷完成
    pass
```

#### Valid Anagram｜JavaScript

```js
function isAnagram(s, t) {
  // 閉卷完成
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

### 4. 先畫圖，再補一句 Invariant

Contains Duplicate：

```txt
輸入：[ ＿, ＿, ＿, ＿ ]
             ↑ 目前位置

處理前保存的狀態：＿＿＿＿＿＿＿＿＿＿
本輪先問：＿＿＿＿＿＿＿＿＿＿＿＿＿
本輪更新：＿＿＿＿＿＿＿＿＿＿＿＿＿

Invariant：在準備處理索引 i 時，＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿。
```

Valid Anagram：

```txt
s： [ ＿, ＿, ＿ ]
      ↑
t： [ ＿, ＿, ＿ ]
      ↑

字元       目前狀態代表什麼
＿＿       ＿＿＿＿＿＿＿＿＿
＿＿       ＿＿＿＿＿＿＿＿＿

Invariant：處理完索引 0...i 後，＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿。
```

### 5. Big-O 不能只填答案

```txt
Contains Duplicate
時間：O(        )，因為：
空間：O(        )，最差何時發生：
資料結構單次操作的平均成本：

Valid Anagram
時間：O(        )，因為：
空間：O(        )，令 k 代表：
只有 26 個小寫字母時，空間是否可改寫：
排序替代方案時間：O(        )，代價是：
```

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

不要逐行翻譯語法，先填資料角色：

| 資料／動作 | Vue | React 應由誰擁有 | 是 source state 還是 derived data？ |
| --- | --- | --- | --- |
| `tasks` | `ref` | ＿＿＿＿ | ＿＿＿＿ |
| `draft` | `ref`＋`v-model` | ＿＿＿＿ | ＿＿＿＿ |
| `filter` | `ref`＋`v-model` | ＿＿＿＿ | ＿＿＿＿ |
| `visibleTasks` | `computed` | ＿＿＿＿ | ＿＿＿＿ |
| `remainingCount` | `computed` | ＿＿＿＿ | ＿＿＿＿ |
| `addTask` | event handler | ＿＿＿＿ | ＿＿＿＿ |
| `toggleTask` | event handler | ＿＿＿＿ | ＿＿＿＿ |

先口述：

```txt
React 不需要把 Vue computed 改成 state，因為：

Vue 可以直接修改 ref 裡的 array/object；React 更新時我要改成：

表單 submit 與 checkbox change 的資料流是：
```

### 3. 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 讀 Vue 並填 ownership 表 | 三份 source state、兩份 derived data |
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

至少留一項，填入可重現資訊：

```txt
[ ] 可執行程式
啟動命令：
頁面／路徑：
我實際操作的四個行為：

[ ] 測試
命令：
通過／失敗數：
測到的行為：

[ ] React Profiler
互動：
commit 次數／耗時：
我從 flame graph 看見：

[ ] Debug 證據
工具：React DevTools／breakpoint／console trace
重現步驟：
觀察結果：
```

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

## Part 3｜收尾：5 句技術筆記（15 分鐘）

禁止複製本頁句子。每句必須是自己的話，而且要包含今天實際做過的證據。

### 5 句模板

```txt
1. Contains Duplicate 的核心狀態是＿＿＿＿，它讓＿＿＿＿從＿＿＿＿降為＿＿＿＿。

2. Valid Anagram 不能只比較＿＿＿＿，因為＿＿＿＿；我的 invariant 是＿＿＿＿。

3. Vue 的＿＿＿＿在 React 中由＿＿＿＿擁有，而＿＿＿＿應在 render 推導。

4. 我沒有用 effect 同步 derived state，因為＿＿＿＿；我的執行／測試／Profiler／Debug 證據是＿＿＿＿。

5. 今天最小架構的 request flow 是＿＿＿＿；演進成分散式後用＿＿＿＿處理＿＿＿＿，50 倍流量時先＿＿＿＿。
```

### 未完成項不能只寫主題名稱

| 項目 | 完成狀態 | 可驗證缺口 | 下一個 15–30 分鐘行動 |
| --- | --- | --- | --- |
| Contains Duplicate | 完成／未完成 | ＿＿＿＿ | ＿＿＿＿ |
| Valid Anagram | 完成／未完成 | ＿＿＿＿ | ＿＿＿＿ |
| React 改寫 | 完成／未完成 | ＿＿＿＿ | ＿＿＿＿ |
| React 證據 | 完成／未完成 | ＿＿＿＿ | ＿＿＿＿ |
| System Design 模板 | 完成／未完成 | ＿＿＿＿ | ＿＿＿＿ |

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

從今天起，每次 System Design 練習都必須在 Deep Dive 回答這兩區：

**A. 分散式架構細節**

- Service 是否 stateless？session／lock／counter 放在哪裡？
- 如何水平擴展與 service discovery？Load Balancer 如何判定 instance health？
- Database 如何 replication、partition／sharding？partition key 為什麼不會造成 hotspot？
- Cache 的 key、TTL、invalidation、cache miss 與 stale behavior 是什麼？
- 非同步事件如何保證 idempotency、ordering、retry、dead-letter 與 backpressure？
- 單機、單 AZ、單 region 失效時，RPO／RTO 和 failover 行為是什麼？
- 網路分區時，哪些操作寧可拒絕，哪些可以接受 stale data？

**B. 高流量極限場景**

- 先量化壓力：平常 QPS、極限倍數、持續多久、讀寫比、payload 與 hottest key。
- 說出第一個會爆的資源：CPU、memory、connection pool、DB IOPS、lock、queue age 或 egress。
- 說出 admission control：rate limit、quota、load shedding、bounded queue、timeout。
- 說出吸收尖峰的方法：batching、coalescing、cache、queue、pre-warm、autoscaling。
- 說出降級順序：先犧牲什麼非核心功能，如何讓使用者知道資料 stale／partial。
- 說出恢復方式：避免 retry storm、逐步放量、drain backlog、校驗一致性。

> 「多開機器」不是完整解法。若下游 DB、共享 lock、partition hotspot 或 connection pool 仍是固定上限，前端 service 擴容只會更快壓垮下游。

### 2. 可複製的四步答題模板

先把這份貼到紙上或白板，限時填完：

```txt
題目：設計＿＿＿＿＿＿＿＿＿＿＿＿
使用者／核心情境：＿＿＿＿＿＿＿＿

Step 1｜Requirements
Functional：
1.
2.
3.

Out of scope：
1.
2.

Non-functional（必須可量測或可判定）：
- Latency：
- Availability：
- Consistency／Durability：
- Security：

Step 2｜Capacity Estimation
題目給定：
我的假設：
- DAU：
- requests / user / day：
- peak factor：
- payload / record size：
- retention：

三個會影響設計的數字：
1. Average QPS =
2. Peak QPS =
3. Storage／Bandwidth =

Step 3｜High-Level Design
[Client] → [API / Load Balancer] → [Service] → [Database]

每個元件責任：
- Client：
- API：
- Service：
- DB：

核心 API：
- METHOD /path
  request：
  response：
  errors／idempotency：

核心資料模型：
- Entity：
- Primary key：
- Index：
- Ownership／constraint：

一條完整 request flow：
1.
2.
3.
4.

Step 4｜Deep Dive & Bottleneck
最可能先遇到的瓶頸：
可觀測指標：
擴展或降級方式：

分散式架構細節：
- Stateless／state ownership：
- Replication 與讀寫路由：
- Partition key／hotspot：
- Cache consistency：
- Idempotency／ordering／retry：
- 單 AZ／region failover、RPO／RTO：

高流量極限場景：
- 平常流量：
- 極限流量、倍數、持續時間：
- 第一個瓶頸：
- Admission control／backpressure：
- 降級順序：
- 恢復與資料校驗：

Failure case：
- 發生什麼：
- 使用者看到什麼：
- 如何偵測：
- 如何保護與恢復：

核心 trade-off：
- 選擇 A：
- 沒選 B：
- A 的代價：
- 什麼條件出現時改選 B：

Recap
我的設計滿足＿＿＿＿，以＿＿＿＿換取＿＿＿＿；在＿＿倍極限流量時先＿＿＿＿，最大未解風險是＿＿＿＿。
```

### 3. 面試時可直接使用的轉場句

```txt
「我先確認今天要支援的三個核心行為，以及明確不做的範圍。」

「接著我只估算會影響資料庫與服務容量的三個數字；其餘先保留假設。」

「我先畫最小可工作的 request path，再根據瓶頸加入 cache、queue 或 replica。」

「這裡我選 A，是因為目前需求重視＿＿；代價是＿＿。若＿＿發生，我會改成 B。」

「最後我用一個分散式 failure 和一個＿＿倍流量情境，檢查這張圖如何限流、降級與恢復。」
```

### 4. 今天的 20 分鐘壓縮版

| 分鐘 | 四步 | 今日輸出 |
| ---: | --- | --- |
| 0–3 | Requirements | 3 個功能、2 個 out of scope、3 個 NFR |
| 3–6 | Capacity | 沿用 Day 2 的三個數量級 |
| 6–12 | HLD | `Client → API → Watchlist Service → DB`＋一條 read flow |
| 12–17 | Deep Dive | DB failure＋分散式演進＋50 倍尖峰 |
| 17–20 | Recap | 3 分鐘口述，必須提到限流、降級與恢復 |

### 5. 先自己填今天的空白圖

```txt
┌──────────┐     HTTPS      ┌──────────┐
│          │ ─────────────→ │          │
└──────────┘                └────┬─────┘
                                 │
                                 ▼
                           ┌──────────┐
                           │          │
                           └────┬─────┘
                                 │
                                 ▼
                           ┌──────────┐
                           │          │
                           └──────────┘

Request flow：
1.
2.
3.
4.

為什麼現在沒有 Cache：
什麼指標出現時才加：

若流量放大 50 倍：
第一個瓶頸：
如何限流／backpressure：
如何降級：
如何恢復：

若單一 region 失效：
讀取行為：
寫入行為：
如何避免 split-brain：
```

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

```txt
我的版本：


每條箭頭傳什麼：

```

#### [ ] 三個數字

```txt
數字 1：＿＿＿＿，假設／公式：＿＿＿＿
數字 2：＿＿＿＿，假設／公式：＿＿＿＿
數字 3：＿＿＿＿，假設／公式：＿＿＿＿

哪個數字真的影響今天的架構選擇：
```

#### [ ] 一個 Failure Case

```txt
失效元件：
使用者看到：
如何偵測：
如何避免連鎖故障：
如何恢復：
資料是否可能遺失或重複：
```

#### [ ] 3 分鐘口述

```txt
0:00–0:30  Requirements 與 out of scope
0:30–0:50  三個容量數字
0:50–1:35  最小架構與一條 request flow
1:35–2:10  分散式演進：stateless、replication、partition key
2:10–2:45  50 倍尖峰：第一個瓶頸、限流、降級、恢復
2:45–3:00  核心 trade-off 與 recap
```

#### 固定加壓卡：每次 System Design 都要填

這兩張卡是 Deep Dive 的最低門檻，不取代上面的四選一主動產出：

```txt
[ ] 分散式架構細節
State owner：
Replication／讀寫路由：
Partition key／hotspot：
Cache consistency：
Idempotency／ordering：
單 AZ／region failure：

[ ] 高流量極限場景
正常 QPS → 極限 QPS／持續時間：
第一個飽和資源：
Admission control／backpressure：
降級順序：
恢復與資料校驗：
```

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

```txt
實際開始／結束：＿＿＿＿～＿＿＿＿
Contains Duplicate：未完成／看答案後完成／閉卷完成
Valid Anagram：未完成／看答案後完成／閉卷完成
JavaScript：未完成／閉卷完成
Python：未完成／閉卷完成
React 程式：未完成／可執行
React 證據：無／程式／測試／Profiler／Debug
5 句技術筆記：未完成／完成
System Design 四步：未完成／提示後完成／獨立完成
分散式細節卡：未完成／完成
高流量極限卡：未完成／完成
System Design 主動產出：小圖／三個數字／failure case／3 分鐘口述

今天最重要的理解：

今天仍不穩的地方：

下一個最小補課行動：
```

真正完成的標準不是「今天看了很多」，而是留下可再次驗證的輸出：

1. 四份演算法實作、兩個 invariant、兩組 Big-O 與兩張狀態圖。
2. 一個沒有 effect 同步 derived state 的可執行 React 列表／表單。
3. 一項 React 執行、測試、Profiler 或 Debug 證據。
4. 五句自己的技術筆記與明確未完成項。
5. 一份能在 3 分鐘內走完，且包含分散式細節與高流量極限解法的 System Design 四步答題卡。
