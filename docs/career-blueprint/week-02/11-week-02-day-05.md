---
sidebar_position: 5
sidebar_label: "Day 5"
slug: "/career-blueprint/week-02-day-05"
title: "第 2 週 Day 5：NC150 週測、React 閉卷實作、Ownership 與慢頁面診斷"
description: "140 分鐘日課：三題 Pattern 辨識與 Product Except Self 重寫、React 表單與列表更新及 ref focus、Amazon Ownership STAR、週檢討，以及用 waterfall 診斷慢頁面。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["週測", "Think Aloud", "Product of Array Except Self", "React form", "list update", "ref focus", "Amazon Ownership", "STAR", "waterfall", "網路與請求路徑"]
---

# 第 2 週 Day 5：週測、React 閉卷實作與慢頁面診斷

> 安排日期：2026-09-18；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing II  
> 本週 System Design 主題：網路與請求路徑

接續 [第 2 週 Day 4](/docs/career-blueprint/week-02-day-04)。今天驗收本週學習：先閉卷產出，再對照解析。會念 Pattern 名稱不等於會解題；看得懂參考程式也不等於自己能完成。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案，不代表網站會自動保存作答。不要把尚未實作、測試或錄音的項目勾成完成。

## 今日完成定義

- [ ] **NeetCode 150 週測｜45 分鐘**：三題 Pattern 辨識＋Product Except Self 重寫，全程 Think Aloud；結束後只記三個最重要錯誤。
- [ ] **React 面試化／系統設計｜45 分鐘**：閉卷完成表單、list update、ref focus。
- [ ] **英文／行為面試｜20 分鐘**：Amazon Ownership，一個主動承擔且有量化結果的 STAR。
- [ ] **週檢討｜10 分鐘**：列出本週完成、未完成、下週一個優先修正。未完成項只移到六、日補，不推遲下週主線。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：用 waterfall 解釋一次慢頁面診斷；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。完整題解索引：[一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | NC150 週測 | 三题推導口述、閉卷程式與測試、最多三個錯誤 |
| 21:15–22:00 | React 閉卷實作 | 可操作表單、列表更新、焦點行為與驗收紀錄 |
| 22:00–22:20 | Ownership STAR | 90 秒英文錄音、真實行動與數據來源 |
| 22:20–22:30 | 週檢討 | 完成／未完成、週末補課、下週唯一優先修正 |
| 22:30–22:50 | Waterfall 診斷 | 請求相依關係、可驗證假設與至少一項主動產出 |

---

## Part 1｜NeetCode 150 週測（45 分鐘）

### 1. 今日節奏與閉卷規則

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–9 | 三題各 3 分鐘，辨識 Pattern 並解釋理由 | 最直接做法、重複工作、要記住的資訊 |
| 9–34 | 閉卷重寫 Product Except Self | 自己的程式、手算、測試與 Big-O |
| 34–40 | 對照 Stage B 與自己的失敗案例 | 找出原因，保留原始作答 |
| 40–45 | 看 Stage C，整理最多三個重要錯誤 | 每項一個可以驗收的修正動作 |

全程 Think Aloud：說清楚需求 → 最直接做法 → 哪裡重複 → 計畫 → 實作 → 測試 → 成本。卡住時說出正在驗證的假設，不需要逐字念語法。25 分鐘重寫時段到就保留現況；提示後才完成要如實標記。

### 2. Stage A｜三題先辨識，再寫自己的計畫

今天使用本週三題，每題先只閱讀以下契約。不要提前展開後面的解析。

| 題目 | 必須回答的問題 | 口述要求 |
| --- | --- | --- |
| 49 Group Anagrams | 把可互相重排的字串放同組；重複字串仍保留 | 如何判斷同組？逐組比較時有哪些重複工作？ |
| 347 Top K Frequent Elements | 回傳出現次數最高的 k 個數字，不是數值最大的 k 個 | 要比較的量是什麼？有哪些資訊不能只用「出現過」表示？ |
| 238 Product of Array Except Self | 每格回傳其他所有元素的乘積，不可使用除法，要求 O(n) 時間 | 一個零、兩個零時輸出如何變？哪些乘法被重算？ |

每題說出一個最直接且正確的方法、成本預估與改善方向，再進入下一題。只報名稱沒有推導，列為未完成。

**單選｜Product Except Self 的契約，哪個正確？**

- [ ] A. 先乘全部元素，再除以目前元素；零不必處理。
- [ ] B. 每個位置都排除自己，支援零與負數，不能使用除法。
- [ ] C. 回傳陣列內不同數字的總乘積。

<details>
<summary>選完再看契約答案</summary>

**答案：B。** 例如 `[1, 2, 3, 4]` 的第一格是 `2 × 3 × 4 = 24`；`[-1, 1, 0, -3, 3]` 只有零的位置可以得到非零結果。這裡先確認輸出，不提供實作方式。

</details>

### 3. Product Except Self：閉卷模板與測資

題目完整資料、限制與三階段筆記：[LeetCode 238](/docs/algorithms/leetcode/f0201-0300/l0238-product-of-array-except-self)。考前只看該頁 Stage A，Stage B 與 Stage C 留到對照時段。本頁是週測入口，完整雙語暴力解、最佳化實作與工程案例沿用該頁，避免提前重貼答案。

先口述兩三句計畫，再選一種語言重寫；另一種語言若無法在時限內完成，列入週末補課，不延長本日主線。

```ts
function productExceptSelf(nums: number[]): number[] {
  // TODO：先說明計畫，再閉卷實作。
  throw new Error('尚未完成');
}
```

```python
def product_except_self(nums: list[int]) -> list[int]:
    # TODO：先說明計畫，再閉卷實作。
    raise NotImplementedError
```

| 輸入 | 預期輸出 | 驗證重點 |
| --- | --- | --- |
| `[1, 2, 3, 4]` | `[24, 12, 8, 6]` | 官方一般案例 |
| `[-1, 1, 0, -3, 3]` | `[0, 0, 9, 0, 0]` | 官方含零與負數案例 |
| `[0, 0, 3]` | `[0, 0, 0]` | 自訂兩個零 |
| `[2, 3]` | `[3, 2]` | 自訂最小長度 |
| `[-1, -2, -3]` | `[6, 3, 2]` | 自訂負數符號 |

把以下測試接在自己的函式後執行。TypeScript 使用既有 TS 執行環境；Python 可直接執行檔案。不要只憑肉眼看過就勾選通過。

```ts
const cases: [number[], number[]][] = [
  [[1, 2, 3, 4], [24, 12, 8, 6]],
  [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]],
  [[0, 0, 3], [0, 0, 0]],
  [[2, 3], [3, 2]],
  [[-1, -2, -3], [6, 3, 2]],
];
for (const [input, expected] of cases) {
  const actual = productExceptSelf([...input]);
  if (actual.length !== expected.length || actual.some((v, i) => v !== expected[i])) {
    throw new Error(`失敗：${JSON.stringify({ input, actual, expected })}`);
  }
}
console.log('5 cases passed');
```

```python
cases = [
    ([1, 2, 3, 4], [24, 12, 8, 6]),
    ([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]),
    ([0, 0, 3], [0, 0, 0]),
    ([2, 3], [3, 2]),
    ([-1, -2, -3], [6, 3, 2]),
]
for values, expected in cases:
    actual = product_except_self(values.copy())
    assert actual == expected, (values, actual, expected)
print("5 cases passed")
```

### 4. Stage B｜作答結束後才對照 Pattern 與理由

<details>
<summary>第 34 分鐘後展開：三題 Pattern 辨識解析</summary>

| 題目 | 從瓶頸想到方法 | 成本與適用條件 |
| --- | --- | --- |
| Group Anagrams | 不想把新字串和所有組反覆比較，替字母組成建立共同識別值，再放入對應群組 | 排序字串作 key：n 個字串、最大長度 m，約 O(nm log m)；固定小寫字母也可用計數 key，約 O(nm) |
| Top K Frequent Elements | 必須先知道每個數字有幾個，再按次數選前 k 名；Set 只能記「有沒有」，資訊不足 | 計數後排序 O(n + u log u)，u 為不同數字數；題目要求優於 O(n log n)，可再推導按次數分桶的 O(n) 解 |
| Product Except Self | 暴力解為每個位置重掃其他元素，O(n²)；相鄰位置的左右乘積可以共用 | 左右兩趟，每趟 O(n)；輸出 O(n)，扣除輸出後額外空間 O(1)，以題目整數成本模型計算 |

238 的每輪規則：左到右時，寫入當前格的量只包含左邊；右到左時，乘入的量只包含右邊。先使用累積值，再把當前元素納入累積，才不會把自己乘進去。

對 `[1, 2, 3, 4]`，第一趟結果是 `[1, 1, 2, 6]`；第二趟從右邊依序乘入 `1、4、12、24`，得到 `[24, 12, 8, 6]`。空的一側用 1 表示，不用 0。若左右累積先包含當前元素，就違反「排除自己」。

</details>

### 5. Stage C｜工程遷移與三個最重要錯誤

<details>
<summary>對照後閱讀：這個技巧能拿來做什麼？</summary>

**【這個演算法是為了解決什麼問題？】** 不想針對每個位置都把左右兩邊重新算一次。四個元素的暴力解要做 12 次乘法；共享左右累積後，工作量隨元素數線性增加。重點是可重用的累積結果，不是記住兩個迴圈。

**【現實工作中哪裡會遇到？可以改善什麼？】** 例如離線敏感度分析，計算移除每個倍率後的整體乘積；元素對應倍率，輸出對應逐項排除的結果。原本每個倍率都重掃整批，共享左右結果可減少重算。這是批次計算技巧，不直接解決資料即時變動或分散式一致性；浮點倍率還須處理溢位、精度與極小值。完整案例與使用界線見 238 的 Stage C。

</details>

**最多選三項實際錯誤；不足三個不必湊數。**

- [ ] 只背 Pattern → 重錄「最直接做法、重複工作、需要記住什麼」三句推導。
- [ ] 把當前元素乘進自己 → 用 `[2, 3]` 逐輪追蹤寫入與更新順序。
- [ ] 零或負數算錯 → 重跑含零、雙零與負數案例。
- [ ] 把輸出空間說成 O(1) → 分開口述輸出空間與額外空間。
- [ ] 寫完沒有測試 → 執行五組 assertions，保留失敗輸出。
- [ ] Think Aloud 中斷 → 重新口述卡住當下的假設與驗證動作。

**今日週測驗收**

- [ ] 三題都能說出推導與成本，不只報名稱。
- [ ] 保留閉卷原始程式，區分獨立完成與提示後完成。
- [ ] 實際執行測試，能解釋每輪保持什麼。
- [ ] 只記最多三個重要錯誤，理解一個工程用途及限制。

---

## Part 2｜React 面試化／系統設計：表單、List Update、Ref Focus（45 分鐘）

### 1. 閉卷任務與時間分配

建立一個「面試練習清單」：輸入任務名稱後新增，能切換完成、刪除項目；新增成功清空輸入並把焦點移回輸入框。空白不可新增，未完成數從清單即時計算。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 說清楚資料與事件 | state、ref、衍生資料各自用途 |
| 5–30 | 閉卷實作 | 表單、新增／切換／刪除、ref focus |
| 30–40 | 操作驗收 | 空白、Enter、刪除中間項、焦點 |
| 40–45 | 口述資料流與修正 | 3 分鐘回答＋一個可驗證卡點 |

### 2. 實作前的三個選擇題

**單選｜未完成數應放在哪裡？**

- [ ] A. 另存 state，每次用 effect 同步。
- [ ] B. 由目前 items 計算，避免多存一份容易不同步的資料。
- [ ] C. 存在 ref，修改後畫面一定自動更新。

**單選｜切換某一項完成狀態應怎麼做？**

- [ ] A. 直接改原本 item.done，再傳回同一個陣列。
- [ ] B. 複製陣列，但仍直接改共用的 item 物件。
- [ ] C. 用 map 產生新陣列，目標 item 也建立新物件。

**單選｜提交後讓仍然掛載的輸入框取得焦點，應怎麼做？**

- [ ] A. 在提交事件中透過 DOM ref 呼叫 focus。
- [ ] B. 在 render 中 focus，確保每次輸入都搶回焦點。
- [ ] C. 把 DOM 元素存進字串 state。

<details>
<summary>完成實作後再看答案與最小參考版本</summary>

**答案：B、C、A。** state 保存畫面資料；ref 保存 DOM 參照；未完成數可由清單導出。更新陣列與其中變更的物件都要建立新值。參考 [React 陣列更新](https://react.dev/learn/updating-arrays-in-state) 與 [DOM refs](https://react.dev/learn/manipulating-the-dom-with-refs)。

以下是 TypeScript React 元件，可放進既有 React＋TS 練習專案。輸入框一直存在，因此能在事件中 focus；若要聚焦的是剛新增、尚未 commit 的節點，不能直接照搬這個時機。

```tsx
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

type Item = { id: number; text: string; done: boolean };

export default function PracticeList() {
  const [text, setText] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const remaining = items.filter(item => !item.done).length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    const item: Item = { id: nextId.current++, text: value, done: false };
    setItems(previous => [...previous, item]);
    setText('');
    inputRef.current?.focus();
  }

  function toggle(id: number) {
    setItems(previous => previous.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  }

  function remove(id: number) {
    setItems(previous => previous.filter(item => item.id !== id));
  }

  return (
    <section>
      <form onSubmit={submit}>
        <label>
          任務名稱
          <input ref={inputRef} value={text}
            onChange={event => setText(event.target.value)} />
        </label>
        <button type="submit">新增</button>
      </form>
      <p>未完成：{remaining}</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <label>
              <input type="checkbox" checked={item.done}
                onChange={() => toggle(item.id)} />
              {item.text}
            </label>
            <button type="button" onClick={() => remove(item.id)}
              aria-label={`刪除 ${item.text}`}>刪除</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

這裡的遞增 id 只供單次掛載的本機練習使用；若資料要持久化或多人共用，需改用持久且唯一的識別值。id 在事件中產生，不在 state updater 中改動計數器。

</details>

### 3. 操作驗收與面試追問

| 操作 | 預期結果 |
| --- | --- |
| 輸入三個空白後提交 | 不新增，輸入框取得焦點 |
| 輸入「React」後按 Enter | 新增一次、不重新整理頁面、清空並聚焦輸入框 |
| 新增 A、B、C，勾選 B，再刪除 A | B 仍保持勾選，C 不被錯置 |
| 切換同一項兩次 | 回到原狀，未完成數同步正確 |
| 刪除全部 | 清單為空，未完成數為 0 |

**3 分鐘口述骨架**

```txt
0:00–0:45  state 保存輸入與清單；ref 指向輸入 DOM；未完成數由清單推導。
0:45–1:30  表單提交先阻止預設導頁，再檢查 trim 後的輸入。
1:30–2:15  用函式型更新、新陣列與新物件；key 使用穩定 id。
2:15–3:00  解釋 focus 時機與一個測試；大量資料時再討論分頁或虛擬列表。
```

追問：「兩個分頁同時編輯怎麼辦？」目前清單只存在單一頁面記憶體，並未處理同步。若改成伺服器保存，需另外設計失敗回復、重試去重與版本衝突；不能只把 state 搬到全域就宣稱解決。

- [ ] 閉卷完成表單、三種列表操作與焦點控制。
- [ ] 未修改既有 state 物件，未使用 index 作為可刪除列表的 key。
- [ ] 實際操作上述五組案例，留下錄影、測試或操作紀錄至少一項。
- [ ] 能說清楚本機 UI 狀態與伺服器資料的界線。

---

## Part 3｜英文／行為面試：Amazon Ownership STAR（20 分鐘）

### 1. 先選真實經歷

Ownership 著重長期結果與主動承擔，不只處理自己被分配的部分。素材可用主動追查效能問題、協調跨組修復或補上可持續的防錯機制；成果與責任範圍必須真實。參考 [Amazon Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 選一個真實事件，確認數據來源 | 問題、自己的責任、前後數據 |
| 4–10 | 按 STAR 組織英文 | Situation、Task、Action、Result |
| 10–13 | 錄 90 秒英文，回聽 | 一段原始錄音 |
| 13–17 | 回答追問 | 為何主動承擔、取捨、如何確認成果 |
| 17–20 | 修正並重錄 | 最終版本與一個改善點 |

**單選｜哪個最能支持 Ownership？**

- [ ] A. 「不是我負責的，我只把問題轉出去。」
- [ ] B. 「我觀察到使用者影響，確認責任邊界後主動協調、追蹤修復並建立驗證。」
- [ ] C. 「我不找其他負責人討論，直接重寫整套系統。」

<details>
<summary>選完再看解析</summary>

**答案：B。** 主動承擔包含讓問題有結果，也包含協作與可持續的後續安排；不是用越權或加班時數代替成果。

</details>

### 2. 90 秒英文骨架與量化方式

以下是組織方式，不是已發生的個人經歷。使用自己的事實口述，不必照抄填空。

| 段落 | 英文起句 | 要回答的事 |
| --- | --- | --- |
| Situation，15 秒 | “I noticed that…” | 哪個使用者流程有問題，為什麼重要？ |
| Task，15 秒 | “Although my initial task was…, I took responsibility for…” | 原本職責與主動承擔的範圍分別是什麼？ |
| Action，40 秒 | “I investigated…, worked with…, and verified…” | 自己做了哪些判斷、協調與驗證？ |
| Result，20 秒 | “Compared with the baseline…, we observed…” | 前後數字、觀察期間、自己與團隊的貢獻 |

**量化示範，僅為虛構練習：** 同環境十次測量，中位載入時間由 2.4 秒降到 1.5 秒，減少 `(2.4 - 1.5) / 2.4 = 37.5%`。可以說 “The median load time decreased by 37.5% in ten controlled runs.” 不能把本機十次測試說成全站 p95，也不能把這組數字當成自己的成果。

**資料來源（依事實勾選）**

- [ ] 有監控、測試紀錄或工單可支持數字。
- [ ] 只有估算；口述時明確說明估算方法與限制。
- [ ] 尚無可驗證數據；保留為待補證據，本項尚未完成。

### 3. 追問與驗收

- [ ] 能回答 “Why did you take ownership of this problem?”
- [ ] 能回答 “What did you personally do, and what did the team do?”
- [ ] 能回答 “How did you measure the result?”
- [ ] 能回答 “What would you do differently next time?”
- [ ] 90 秒內包含真實主動行動、量化結果與數據來源，已完成錄音。

---

## Part 4｜週檢討：只選一個優先修正（10 分鐘）

前 3 分鐘盤點實際證據，接著 3 分鐘確認未完成項，再用 2 分鐘安排週末，最後 2 分鐘選下週唯一優先修正。閱讀過不等於完成。

| 本週項目 | 可作為完成證據 |
| --- | --- |
| Group Anagrams、Top K、Product Except Self | 自己的程式、執行結果、Pattern 與成本口述 |
| React 表單、列表、ref | 可執行元件、操作案例或錄影 |
| Python 資料處理 | frequency／grouping／queue 實作與測試 |
| Ownership | 真實 STAR、數據來源、英文錄音 |
| 網路與請求路徑 | DNS／TLS／CDN／快取／waterfall 的圖或口述 |

**未完成才勾選，補課固定放 9/19（六）或 9/20（日）：**

- [ ] 六：補演算法另一種語言或失敗案例，完成後執行五組測試。
- [ ] 六：補 React 失敗操作，重做新增、切換、刪除與 focus 驗收。
- [ ] 日：補 Ownership 數據來源，錄一段 90 秒英文。
- [ ] 日：補本週網路題，留下一張圖或 3 分鐘診斷錄音。
- [ ] 沒有待補項目；以上補課項不勾選。

**下週唯一優先修正（依實際卡點單選）：**

- [ ] 推導不清：coding 前先講 60 秒計畫。
- [ ] 測試不足：每題先準備一般、最小與特殊案例。
- [ ] React 容易改到舊資料：每次操作先指出哪層要建立新值。
- [ ] 口述不完整：每天錄一次有數據、有取捨的三分鐘回答。

未完成項只移到六、日補，不推遲下週主線。週末仍未完成就保留狀態，下一個週末再處理；不要擅自占用下週原定訓練時段。

---

## Part 5｜每日 System Design × 高併發 Combo：Waterfall 慢頁面診斷（20 分鐘）

### 1. 今日微題與節奏

題目：「使用者說列表頁很慢，你如何用 waterfall 判斷時間花在哪裡，並提出下一個驗證動作？」

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 固定測量條件、定義慢 | 冷／暖快取、裝置網路、完成指標 |
| 4–10 | 讀請求瀑布與相依關係 | 哪個請求讓後續工作等待 |
| 10–15 | 提出一個原因假設與驗證 | 能支持或推翻假設的證據 |
| 15–20 | 完成主動產出 | 圖、三個數字、failure case 或口述 |

### 2. 先懂 Waterfall 在看什麼

Waterfall 把每個請求的開始時間與各階段畫在同一條時間軸。長條晚開始，不一定是下載慢；可能前面的 JavaScript 執行完才發送。多個請求重疊時，不能把每支耗時相加當作整頁載入時間。

| 階段 | 白話解釋 | 下一個檢查 |
| --- | --- | --- |
| Queueing／Stalled | 請求在送出前等待 | 優先級、連線與其他瀏覽器排程因素 |
| DNS | 尋找網域對應位置 | 新網域、解析快取與解析時間 |
| Connection／SSL | 建立連線及安全握手 | 是否重用連線、是否跨太多網域 |
| Waiting／TTFB | 從送出請求到收到第一個位元組 | 網路往返、伺服器處理、上游等待 |
| Content Download | 接收回應內容 | 傳輸大小、網速與壓縮 |

TTFB 長不能直接證明 SQL 慢；要再對照 Server-Timing、後端 trace 或服務紀錄。連線重用時，也未必每支請求都有 DNS 與 TLS 階段。欄位與 Timing 說明可查 [Chrome DevTools Network 文件](https://developer.chrome.com/docs/devtools/network/reference)。

### 3. Worked Example：先找阻塞使用者目標的路徑

以下是教學假設資料，並非本站實測；時間全部從 navigation start 起算。目標是「列表第一屏資料出現」，不是單看 load event。

| 工作 | 開始 → 結束（ms） | 觀察 |
| --- | --- | --- |
| HTML | 0 → 200 | 收到文件後才發現主程式 |
| app.js 下載 | 200 → 700 | 500 ms |
| JS 執行 | 700 → 1000 | 300 ms，需用 Performance 面板確認 |
| 列表 API | 1000 → 1600 | TTFB 500 ms、下載 100 ms |
| 列表渲染 | 1600 → 1700 | 100 ms，需用 Performance 面板確認 |
| 非必要分析請求 | 250 → 2400 | 最後結束，但假設它不阻塞列表 |

**單選｜應優先形成哪個診斷？**

- [ ] A. 分析請求最後完成，所以一定是列表慢的根因。
- [ ] B. 列表 API 到 1000 ms 才發送，先追 Initiator 與主執行緒，再檢查 API 的 500 ms TTFB。
- [ ] C. 所有請求耗時相加就是頁面載入時間。

<details>
<summary>選完再看診斷與改善假設</summary>

**答案：B。** 假設中的列表關鍵路徑是 HTML → 主程式 → JS 執行 → API → render。先確認 API 是否真的依賴前面的程式或資料；若參數與權限已足夠，才評估提早發送。

假設可在 700 ms 發 API，且其他工作、資源競爭與回應耗時不變，API 1300 ms 完成、畫面約 1400 ms 出現，理想上比 1700 ms 少 300 ms。這是待驗證預估，不是部署後成果；若需要前置授權或主執行緒仍忙，未必得到這個改善。

接著用相同裝置、網路與快取條件重測，確認第一屏真的提早，而非只把工作移到別處。不要因為想並行就拿掉必要的身份驗證。

</details>

### 4. 自己做一次診斷

1. 開啟要測的頁面與 DevTools Network，保留相同測量條件。冷快取測试可勾 Disable cache 後重載；暖快取另外測，不混成一組。
2. 找到使用者等待的資料或主要圖片，查看 Timing 與 Initiator，說明是「晚發送」還是「發出後很久才完成」。
3. 若網路已完成但畫面仍慢，到 Performance 面板檢查長任務與渲染；Network 本身不能量出所有 JS 執行成本。
4. 提出一個假設、一次修改與對照測量。沒有實際 trace 時，只能把本節標成教學案例演練。

### 5. 高併發追問與 Failure Case

情境：CDN 快取同時到期，大量請求打回 origin，列表 API TTFB 上升。Waterfall 能觀察用戶端等待變長，但無法單獨證明這就是快取同時失效。

下一步比較快取命中率、origin QPS、服務排隊時間與 DB 連線等待。若證據吻合，再評估合併同一資源的回源请求、分散到期時間，以及在業務允許時暫回舊資料。公開榜單可能容忍短暫過期；權限與個人化回應必須按正確身份隔離，不能直接共用快取。

若十萬名使用者在同一秒各發出一次列表请求，僅此端點就約 100,000 requests/s；這是假設尖峰，不能拿單次瀏覽器測試代替服務容量測試。失敗重試也要有上限與退避，避免把排隊問題放大。

### 6. 主動產出：至少完成一項

#### [ ] 一張小圖

照自己的觀察重畫，標出時間與相依；以下只作教學參考。

```txt
HTML 0–200 → JS 下載 200–700 → JS 執行 700–1000
                                         ↓
                               API 1000–1600 → Render 1600–1700
分析請求 250–2400 ──────────────────────────────→（假設不阻塞列表）
```

#### [ ] 三個數字

- API 發送前等待：1000 ms，從 navigation start 到 request start。
- API TTFB：500 ms，屬於 API 請求內部等待。
- 第一屏出現：1700 ms，從 navigation start 到列表渲染完成。

以上是同一教學情境的不同指標，彼此可能包含，不能直接相加。自己完成時改用實測值，或明確說明是在口述教學案例。

#### [ ] 一個 Failure Case

用四句說明「快取到期後 TTFB 上升」：觀察到什麼 → 還缺什麼證據 → 如何降級 → 如何驗證恢复。必須包含資料新鮮度、權限界線與避免無限重試。

#### [ ] 3 分鐘口述

```txt
0:00–0:30  定義慢的使用者目標與測量條件。
0:30–1:15  按相依關係描述 waterfall，指出晚發送和 TTFB 的差別。
1:15–2:00  提出一個原因假設、需要的證據與改善方式。
2:00–2:30  說明高併發時可能的排隊、快取失效與重試放大。
2:30–3:00  用相同條件驗證目標指標，交代取捨與尚未確認的事。
```

### 7. 今日 System Design 驗收

- [ ] 能區分請求發送延遲、TTFB、下載與渲染時間。
- [ ] 能指出關鍵相依路徑，不把最晚完成的請求直接當成根因。
- [ ] 有一個可被證據推翻的假設與下一個檢查動作。
- [ ] 已完成至少一項自己的產出，分清教學數字與實測數字。

---

## 今日結束打卡

- [ ] NC150：三題辨識、238 閉卷重寫與測試完成；最多記三個錯誤。
- [ ] React：表單、list update、ref focus 完成且實際驗收。
- [ ] 英文：Ownership STAR 已錄音，量化結果有依據。
- [ ] 週檢討：完成與未完成已盤點，下週只選一個優先修正。
- [ ] System Design：能用 waterfall 解釋慢頁面，留下一項主動產出。
- [ ] 未完成項已安排六、日補課，不推遲下週主線。
