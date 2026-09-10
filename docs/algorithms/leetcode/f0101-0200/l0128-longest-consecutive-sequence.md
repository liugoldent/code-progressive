---
title: "[0128] Longest Consecutive Sequence"
toc_max_heading_level: 2
description: "LeetCode 128 Longest Consecutive Sequence 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0128", "Longest Consecutive Sequence", "TypeScript", "Python", "面試練習"]
date: 2025-06-16
---

# [0128] Longest Consecutive Sequence

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-22（W03）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 128／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

找出資料裡最長的一串連續整數，回傳長度。輸入位置不必相鄰，順序可以打亂；同一數字重複出現不會讓連續長度增加。

### 3. Input / Output 契約

輸入整數陣列，允許空陣列；輸出非負整數長度，不回傳序列本身。連續指相鄰數值差 1，不是子陣列的相鄰索引。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function longestConsecutive(nums: number[]): number;
```

#### Python

```python
def longest_consecutive(nums: list[int]) -> int: ...
```

### 4. 官方範例拆解

1. `[100,4,200,1,3,2] → 4`，因為有 1、2、3、4。
2. `[0,3,7,2,5,8,4,6,0,1] → 9`，0 到 8 共九個不同整數。
3. `[1,0,1,2] → 3`，重複的 1 不延長序列。

### 5. 限制條件

`0 <= n <= 10^5`；值介於 −10^9 與 10^9；題面要求 O(n) 時間。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「未排序」「數值連續」「回傳長度」「線性時間」「可以空輸入」。

### 7. 面試確認問題

不用問是否可有重複或負數，題目已允許。若要回傳最長區間且多組同長，才需確認選哪組；本題只回傳長度。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[100, 4, 200, 1, 3, 2]]` | `4` |
| 官方 2 | `[[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]]` | `9` |
| 官方 3 | `[[1, 0, 1, 2]]` | `3` |
| 自訂：空 | `[[]]` | `0` |
| 自訂：全重複 | `[[7, 7, 7]]` | `1` |
| 自訂：負數 | `[[-3, -2, -1, 1]]` | `3` |
| 自訂：起點重複 | `[[1, 1, 1, 2, 3, 4]]` | `4` |



### 9. 第一個直覺

如果從每一個數字都開始找下一個整數，同一條長序列會被重複走幾次？

沒有提供這次的作答，所以不代填你的想法。記錄：我準備逐一檢查什麼？為何不會漏掉有效答案？

### 10. 複雜度預估

先填 `n` 的意思、每輪工作量、最多幾輪，以及另建了哪些資料。若有字串、群組或輸出清單，也要列出它們的總長度；不要只填一個背過的 Big-O。

### 11. 解題計畫

```txt
1. 我要按照什麼順序處理輸入：
2. 每一步如何判定／產生答案：
3. 何時停止，如何確認沒有漏解：
我認為最容易錯的測資與理由：
```

### 12. 第一次實作

#### TypeScript

```ts
function longestConsecutive(nums: number[]): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def longest_consecutive(nums: list[int]) -> int:
    raise NotImplementedError("先完成自己的版本")
```

```txt
實際耗時：
結果／失敗測資：
錯誤類型（契約／推導／邊界／語法／複雜度）：
卡點：
看到第幾層提示：
```

<details>
<summary>提示一：從需求再想一步</summary>

每條連續序列的第一個值有什麼特徵？

</details>

<details>
<summary>提示二：解法方向</summary>

Set 能快速查下一個整數是否存在；但還要避免從每個中間點重走。

</details>

<details>
<summary>提示三：接近解法</summary>

只有 x−1 不存在時，才從 x 開始往後數；外層遍歷去重後集合。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用Set 與序列起點判斷？

不想從 1 數到 4，又從 2 數到 4、從 3 數到 4。要知道「下一個整數在不在」可存 Set；更重要的是只從沒有前一個整數的起點出發。`[4,1,3,2]` 中只有 1 沒有前驅，整條只走一次。Map 計次數多存了本題不需要的資訊；單有 Set 但每個值都向後走，仍可能平方時間。

**下次可以怎麼想：** 當要找可串接的連續段，先問能不能只從段的起點展開，讓每個元素只屬於一次展開。

### 2. 暴力解／最直接的正確解

先建立 Set 加速是否存在，但仍從每個不同值往後找；這個基準解正確，能清楚隔離「重複展開」的瓶頸。

#### TypeScript

```ts
function longestConsecutiveBrute(nums: number[]): number {
  const values = new Set(nums);
  let best = 0;
  for (const start of values) {
    let end = start;
    while (values.has(end)) end++;
    best = Math.max(best, end - start);
  }
  return best;
}
```

#### Python

```python
def longest_consecutive_brute(nums: list[int]) -> int:
    values = set(nums)
    best = 0
    for start in values:
        end = start
        while end in values:
            end += 1
        best = max(best, end - start)
    return best
```

### 3. 暴力解的瓶頸

長度 u 的連續段會走 u+(u−1)+…+1 次，最差 O(n+u²)。查詢變快，不等於查詢次數變少。

### 4. 從瓶頸推導資料結構／演算法

先檢查 start−1；若存在，這個數屬於更早起點的序列，跳過。外層必須走去重集合，否則大量重複起點又會重掃相同長段。

### 5. 為什麼是這個資料結構／方法

Set 建立平均 O(n)，查找平均 O(1)；不需要額外排序。整數加一在官方範圍內可安全表示；不把 Map／Set 操作的極端碰撞成本說成嚴格最差 O(1)。

### 6. 最佳解法步驟

1. 以 Set 去重。
2. 遍歷各值；有前驅就跳過。
3. 從起點一路找下一個整數，直到不存在。
4. 更新最大長度。

### 7. 核心不變量：每輪都要保持什麼

每次展開從一條最大連續段的最小值開始，展開中的 `[start,end)` 都存在。每條段只會有一個起點，已完成段的最大長度存在 best。

### 8. 手動演算

| 外層值（採輸入首次出現順序示意） | 是否有前驅 | 動作 |
| --- | --- | --- |
| 100 | 否 | 長度 1 |
| 4 | 是，3 | 跳過 |
| 200 | 否 | 長度 1 |
| 1 | 否 | 走 1→2→3→4，長度 4 |
| 3、2 | 都有 | 跳過 |

Python Set 的遍歷順序不保證與此表相同，但每條段的起點與最終答案相同。

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function longestConsecutive(nums: number[]): number {
  const values = new Set(nums);
  let best = 0;
  for (const start of values) {
    if (values.has(start - 1)) continue;
    let end = start;
    while (values.has(end)) end++;
    best = Math.max(best, end - start);
  }
  return best;
}
```

#### Python

```python
def longest_consecutive(nums: list[int]) -> int:
    values = set(nums)
    best = 0
    for start in values:
        if start - 1 in values:
            continue
        end = start
        while end in values:
            end += 1
        best = max(best, end - start)
    return best
```

### 10. 複雜度分析

令 u 為相異值數量。建立集合 O(n)，外層 u 次，每個值只在所屬段的展開被走到一次，額外每段一次失敗查詢，總平均 O(n+u)=O(n)。空間 O(u)。巢狀 while 不必然 O(n²)，應數整體拜訪次數。

### 11. 邊界條件與常見錯誤

把數值連續當索引連續；從每個數展開；外層用原陣列導致重複起點；空輸入 best 不可初始為 1。舊文難度 Hard 已依官方改為 Medium。

### 12. 為什麼不用其他方法

複製後排序再去重掃描簡單、O(n log n)，但不符合題面線性要求。值域很小且密集時可用布林陣列；本題值域二十億，直接配置不合理。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[]]; expected: number }[] = [
  {"args": [[100, 4, 200, 1, 3, 2]], "expected": 4},
  {"args": [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], "expected": 9},
  {"args": [[1, 0, 1, 2]], "expected": 3},
  {"args": [[]], "expected": 0},
  {"args": [[7, 7, 7]], "expected": 1},
  {"args": [[-3, -2, -1, 1]], "expected": 3},
  {"args": [[1, 1, 1, 2, 3, 4]], "expected": 4}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [longestConsecutiveBrute, longestConsecutive]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('128: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[100, 4, 200, 1, 3, 2]], "expected": 4}, {"args": [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], "expected": 9}, {"args": [[1, 0, 1, 2]], "expected": 3}, {"args": [[]], "expected": 0}, {"args": [[7, 7, 7]], "expected": 1}, {"args": [[-3, -2, -1, 1]], "expected": 3}, {"args": [[1, 1, 1, 2, 3, 4]], "expected": 4}]''')

def normalize(value):
    return value
for solve in (longest_consecutive_brute, longest_consecutive):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('128: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不想同一條連續記錄從每個中間點重算。例如已收到批次編號 `[10,12,11,20]`，最長完整區間是 10–12。Set 保存已收到的编号，起點規則讓每段只走一次；需多存去重集合。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

離線匯入工具分析已完成的 chunk 編號，找最長連續區間以顯示診斷結果。整數 → chunk sequence，連續段 → 不缺 chunk 的區間。這不是「從 0 起可恢復的前綴」；如果續傳要求從 0 開始，就應另查該前綴。

### 3. 工程遷移情境

一個 job 的完成編號快照，非負安全整數。輸出最長長度，同長不需選段。不同 job 的編號不可混在同一集合。

### 4. 常見直覺寫法

```ts
function longestChunkRunBefore(ids: readonly number[]): number {
  if (ids.some(x => !Number.isSafeInteger(x) || x < 0)) throw new Error('invalid chunk id');
  const sorted = [...new Set(ids)].sort((a, b) => a - b);
  let run = 0, best = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}
```

### 5. 潛在問題與觸發門檻

一個 job 有數十萬塊、反覆產出完整快照報表時，排序成本才可能值得替換。要先量測排序是否占主導；不能宣称特定秒數。

### 6. 套用本題技巧

完全沿用本題數值連續的定義；chunk ID 要先驗證，不能把 UUID 或可跳號的業務流水號當連續整數。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function longestChunkRun(ids: readonly number[]): number {
  if (ids.some(x => !Number.isSafeInteger(x) || x < 0)) throw new Error('invalid chunk id');
  return longestConsecutive([...ids]);
}
```

### 8. 優化前後比較

排序版 O(n+u log u)，起點版平均 O(n)；兩版保留資料 O(n)。新 wrapper 為了重用 number[] 函式還複製一次陣列，計入 O(n) 空間。

### 9. 使用界線與代價

只適合快照。若每來一塊就重建整份 Set，m 次更新仍可能平方成本；即時維護需區間合併結構。已排序輸入可直接線性掃描，無須新建 Set。

### 10. Code Review 說法

> 這份報表只需要最長連續長度，可考慮 Set 加起點展開，省掉排序；請保留單一 job、整數編號的契約，並把續傳前綴與最長區間區分清楚。

### 11. 變形題

1. 改回傳起終點且同長取最小起點，需存什麼？
2. 編號會刪除，如何拆開既有區間？
3. 只需從 0 開始的完整前綴，何必尋找所有段？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 當要找可串接的連續段，先問能不能只從段的起點展開，讓每個元素只屬於一次展開。 |
| 最直接的解法與瓶頸 | 每個值都向後展開，O(n+u²)。 |
| 最佳化方法 | Set 與序列起點判斷 |
| 每輪都要保持什麼（invariant） | 只從無前驅的起點展開一整段。 |
| 時間／空間 | 平均 O(n)，空間 O(u)。 |
| 常見錯誤 | 原陣列重複起點會重走長段。 |
| 工作用途與限制 | chunk 快照診斷；別混同續傳前綴。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
