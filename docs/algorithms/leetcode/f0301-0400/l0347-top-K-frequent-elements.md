---
title: "[0347] Top K Frequent Elements"
toc_max_heading_level: 2
description: "LeetCode 347 Top K Frequent Elements 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0347", "Top K Frequent Elements", "TypeScript", "Python", "面試練習"]
---

# [0347] Top K Frequent Elements

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-15（W02）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 347／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

找出出現次數最多的 k 種數字，回傳數字本身，每種只出現一次。

### 3. Input / Output 契約

nums 是整數陣列，k 是要取的種類數；輸出長度 k，順序不限。題目保證答案集合唯一，並保證 k 不超過相異數量；不是取數值最大的 k 個。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function topKFrequent(nums: number[], k: number): number[];
```

#### Python

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]: ...
```

### 4. 官方範例拆解

1. `[1,1,1,2,2,3], k=2 → [1,2]`：次數為 3、2、1。
2. `[1], k=1 → [1]`。
3. `[1,2,1,2,1,2,3,1,3,2], k=2 → [1,2]`：1 和 2 各四次，3 兩次；入選者間可以同次數。

### 5. 限制條件

`1 <= n <= 10^5`；`-10^4 <= nums[i] <= 10^4`；`1 <= k <= 相異數量`；答案唯一。進階要求時間優於 O(n log n)。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「最常出現」「k 種」「答案順序不限」「輸入大小十萬」「答案集合唯一」。

### 7. 面試確認問題

不必問 k=0 或空輸入，官方不包含。真實排行榜需另問同分時的排序規則、統計時間區間與是否重複計事件。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[1, 1, 1, 2, 2, 3], 2]` | `[1, 2]` |
| 官方 2 | `[[1], 1]` | `[1]` |
| 官方 3 | `[[1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2]` | `[1, 2]` |
| 自訂：負數 | `[[-1, -1, 0, 2], 1]` | `[-1]` |
| 自訂：單一種類 | `[[4, 4, 4], 1]` | `[4]` |
| 自訂：全部入選 | `[[3, 2, 1], 3]` | `[1, 2, 3]` |
| 自訂：數值邊界 | `[[0, 0, -10000, 10000], 1]` | `[0]` |



### 9. 第一個直覺

能否先把每個數字的次數算出來？算完之後，是否每個名次都必須完整排好？

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
function topKFrequent(nums: number[], k: number): number[] {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]:
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

需要比較數字大小，還是比較每種數字有幾個？

</details>

<details>
<summary>提示二：解法方向</summary>

先用 Map／dict 計次數，再想是否必須比較排序。

</details>

<details>
<summary>提示三：接近解法</summary>

次數最多 n，可以按次數分桶，由高往低取 k 個。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用Map／dict 計數與頻率桶？

我們要的是「每種有幾個」，所以先保存數字到次數的對應。最直接是依次數排序，但排序會做許多比較；次數其實只可能是 1 到 n。以 1 出現三次、2 兩次為例，可以直接把 1 放進桶 3、2 放進桶 2。Set 會丟失次數，完整排序則算出了我們未必需要的每個名次。

**下次可以怎麼想：** 若排名依據是可控範圍內的整數，先計數，再考慮按該整數分桶，避免完整排序。

### 2. 暴力解／最直接的正確解

基準解先計數，再把相異值依次數排序取前 k 個。這是容易驗證的正確解，最差不符合進階的時間要求。

#### TypeScript

```ts
function topKFrequentBrute(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!).slice(0, k);
}
```

#### Python

```python
def top_k_frequent_brute(nums: list[int], k: int) -> list[int]:
    counts: dict[int, int] = {}
    for x in nums:
        counts[x] = counts.get(x, 0) + 1
    return sorted(counts, key=lambda x: counts[x], reverse=True)[:k]
```

### 3. 暴力解的瓶頸

令 u 為相異數量。排序 u 個候選需要 O(u log u) 次量級的比較；總平均時間 O(n+u log u)，u 接近 n 時是 O(n log n)。

### 4. 從瓶頸推導資料結構／演算法

先保留計數，再把比較排序換成直接定位：count 是桶的 index。掃過 n 個桶與 u 個候選，就可由大到小找到需要的答案。

### 5. 為什麼是這個資料結構／方法

Map／dict 計數採平均 O(1) 存取；桶陣列索引 O(1)，每個相異值只放進一桶。配置 n+1 個桶花 O(n) 時間與空間，不是免費的。

### 6. 最佳解法步驟

1. 計算每種數字的次數。
2. 建立 n+1 個互相獨立的桶。
3. 次數 c 的數字放入 buckets[c]。
4. 從最高頻率掃下來，恰好收集 k 種就回傳。

### 7. 核心不變量：每輪都要保持什麼

開始讀取頻率 c 的桶時，所有高於 c 的桶都已處理；答案內的每個值都比尚未處理者更頻繁或同頻，且不重複。

### 8. 手動演算

| 階段 | 狀態 |
| --- | --- |
| 計數 | 1:3、2:2、3:1 |
| 桶 3 | [1]，答案 [1] |
| 桶 2 | [2]，答案 [1,2] |
| 已滿 k=2 | 回傳，不再讀桶 1 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function topKFrequent(nums: number[], k: number): number[] {
  const counts = new Map<number, number>();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => [] as number[]);
  for (const [x, count] of counts) buckets[count].push(x);
  const result: number[] = [];
  for (let count = nums.length; count >= 1; count--) {
    for (const x of buckets[count]) {
      result.push(x);
      if (result.length === k) return result;
    }
  }
  return result;
}
```

#### Python

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    counts: dict[int, int] = {}
    for x in nums:
        counts[x] = counts.get(x, 0) + 1
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for x, count in counts.items():
        buckets[count].append(x)
    result: list[int] = []
    for count in range(len(nums), 0, -1):
        for x in buckets[count]:
            result.append(x)
            if len(result) == k:
                return result
    return result
```

### 10. 複雜度分析

計數 O(n)、建立桶 O(n)、放候選 O(u)、向下掃描最多 O(n+u)，平均總時間 O(n)。輔助空間 O(n+u)=O(n)，輸出 O(k)。極端雜湊碰撞會破壞平均成本前提。不能把舊排序版標成線性最佳解。

### 11. 邊界條件與常見錯誤

`Array(n).fill([])` 或 Python `[[]]*n` 會共用同一個桶；Object.keys 會把數字變字串；忘記 return；一次展開整桶可能超過 k，逐項取可明確限制長度。

### 12. 為什麼不用其他方法

當 n 非常大而 k 很小，維護大小 k 的最小堆可在計數後以 O(u log k) 選取，省掉 n 個桶。仍要 O(u) 計數。資料無界、持續流入時，固定一次批次的桶不適合常駐增長。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[], number]; expected: number[] }[] = [
  {"args": [[1, 1, 1, 2, 2, 3], 2], "expected": [1, 2]},
  {"args": [[1], 1], "expected": [1]},
  {"args": [[1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2], "expected": [1, 2]},
  {"args": [[-1, -1, 0, 2], 1], "expected": [-1]},
  {"args": [[4, 4, 4], 1], "expected": [4]},
  {"args": [[3, 2, 1], 3], "expected": [1, 2, 3]},
  {"args": [[0, 0, -10000, 10000], 1], "expected": [0]}
];
const normalize = (value: number[]): string => JSON.stringify([...value].sort((a, b) => a - b));
for (const solve of [topKFrequentBrute, topKFrequent]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('347: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[1, 1, 1, 2, 2, 3], 2], "expected": [1, 2]}, {"args": [[1], 1], "expected": [1]}, {"args": [[1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2], "expected": [1, 2]}, {"args": [[-1, -1, 0, 2], 1], "expected": [-1]}, {"args": [[4, 4, 4], 1], "expected": [4]}, {"args": [[3, 2, 1], 3], "expected": [1, 2, 3]}, {"args": [[0, 0, -10000, 10000], 1], "expected": [0]}]''')

def normalize(value):
    return sorted(value)
for solve in (top_k_frequent_brute, top_k_frequent):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('347: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不想為了前幾名，反覆重數每個項目或排出全部名次。例如一萬個點擊事件只要前三個商品：先數各商品，再挑候選。Map 保存次數；桶負責利用次數的整數範圍挑選，代價是與批次大小相關的記憶體。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

後台顯示一批錯誤事件最常見的 code：數字 → error code，出現次數 → 錯誤量。原本每個 code 都 filter 整批；先計數可只掃一次。跨服務報表還要處理重複事件、時間窗與資料彙整，單機 Map 不會自動得到全站排名。

### 3. 工程遷移情境

一份已去重、同一時間區間的錯誤快照；同次數依 code 字典序排序，保留可重現報表。

### 4. 常見直覺寫法

```ts
function topErrorsBefore(codes: readonly string[], k: number): string[] {
  if (!Number.isInteger(k) || k < 0) throw new Error('invalid k');
  return [...new Set(codes)].map(code => ({ code, count: codes.filter(x => x === code).length }))
    .sort((a, b) => b.count - a.count || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0))
    .slice(0, k).map(x => x.code);
}
```

### 5. 潛在問題與觸發門檻

n 個事件、u 種 code 時，原版計數 O(nu)。例如十萬事件、一千種 code，約一億次相等比較。正式環境先量測，不把此估算說成延遲。

### 6. 套用本題技巧

本題最有用的第一步是一次計數；報表為了固定同分次序且 u 遠小於 n，保留排序，沒有強制套用大桶。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function topErrors(codes: readonly string[], k: number): string[] {
  if (!Number.isInteger(k) || k < 0) throw new Error('invalid k');
  const counts = new Map<string, number>();
  for (const c of codes) counts.set(c, (counts.get(c) ?? 0) + 1);
  return [...counts].sort(([a, ca], [b, cb]) => cb - ca || (a < b ? -1 : a > b ? 1 : 0))
    .slice(0, k).map(([c]) => c);
}
```

### 8. 優化前後比較

O(nu+u log u) 改為平均 O(n+u log u)，Map O(u)。這個版本優化實際的重複計數，並明確保留報表排序規則。

### 9. 使用界線與代價

少量 code 的單次報表用排序很合理；要每秒更新、移除過期資料或查歷史區間，需要維護窗口或資料庫聚合。k 大於種類數時，工程版本回傳全部；與官方保證分開。

### 10. Code Review 說法

> 這裡每個錯誤碼都 filter 整批事件，建議先累計一次 Map，保留原本同次數排序規則；事件去重與時間區間仍由上游契約負責。

### 11. 變形題

1. 第 k 名同次數時要全收，輸出契約如何改？
2. 只剩有限記憶體、事件無限流入時，精確排名需要保存什麼？
3. 每分鐘移除過期事件，要如何扣回次數？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 若排名依據是可控範圍內的整數，先計數，再考慮按該整數分桶，避免完整排序。 |
| 最直接的解法與瓶頸 | 計數再排序 O(n+u log u)。 |
| 最佳化方法 | Map／dict 計數與頻率桶 |
| 每輪都要保持什麼（invariant） | 由高次數向低次數收集，不重複取值。 |
| 時間／空間 | 平均 O(n)；輔助 O(n)，輸出 O(k)。 |
| 常見錯誤 | 共用桶、字串化數字、漏 return。 |
| 工作用途與限制 | 錯誤碼排名；時間窗與跨服務彙總另處理。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
