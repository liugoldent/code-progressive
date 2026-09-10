---
title: "[0167] Two Sum II - Input Array Is Sorted"
toc_max_heading_level: 2
description: "LeetCode 167 Two Sum II - Input Array Is Sorted 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0167", "Two Sum II - Input Array Is Sorted", "TypeScript", "Python", "面試練習"]
---

# [0167] Two Sum II - Input Array Is Sorted

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-28（W04）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 167／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

從已由小到大排列的數字中找兩個不同位置，讓和等於 target，回傳從 1 起算且遞增的兩個位置。

### 3. Input / Output 契約

numbers 非遞減排序，允許相同值；保證唯一一組答案。回傳 [i+1,j+1] 且 i&lt;j，不得使用同一位置兩次。必須使用常數額外空間。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function twoSum(numbers: number[], target: number): number[];
```

#### Python

```python
def two_sum(numbers: list[int], target: int) -> list[int]: ...
```

### 4. 官方範例拆解

1. `[2,7,11,15],9 → [1,2]`。
2. `[2,3,4],6 → [1,3]`。
3. `[-1,0],-1 → [1,2]`。三例回傳的都是從 1 起算的位置，而不是數值。

### 5. 限制條件

`2 <= n <= 3*10^4`；numbers[i] 與 target 介於 −1000 與 1000；已排序、唯一答案、常數額外空間。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「已排序」「兩個不同位置」「1-indexed」「唯一答案」「額外空間固定」。

### 7. 面試確認問題

題面已確認排序與唯一答案，不必重問。若是外部 API 沒有保證排序，要確認由誰驗證；原始資料順序不同時不能偷偷排序後回傳新位置。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[2, 7, 11, 15], 9]` | `[1, 2]` |
| 官方 2 | `[[2, 3, 4], 6]` | `[1, 3]` |
| 官方 3 | `[[-1, 0], -1]` | `[1, 2]` |
| 自訂：相同值不同位置 | `[[3, 3], 6]` | `[1, 2]` |
| 自訂：負數 | `[[-5, -2, 0, 4], -7]` | `[1, 2]` |
| 自訂：尾端 | `[[0, 1, 3, 9], 12]` | `[3, 4]` |



### 9. 第一個直覺

先列出最簡單的所有位置配對。當某一對太小或太大，已排序能否幫你排除其他配對？

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
function twoSum(numbers: number[], target: number): number[] {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
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

若最左與最右的和太小，保留最左、只換更小的右值有可能成功嗎？

</details>

<details>
<summary>提示二：解法方向</summary>

利用排序，每次排除一個端點。

</details>

<details>
<summary>提示三：接近解法</summary>

兩端和太小移左，太大移右；left&lt;right，回傳時兩者加 1。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用相向雙指標與排序排除？

需要找兩個位置，直覺會列舉所有配對。但已排序讓我們知道一整排配對都不可能：`[2,7,11,15]` 中 2+15 太大，15 配任何其他值都只會更大，所以可排除 15；接著 2+11 仍太大，排除 11。這個「安全排除」才是雙指標理由。Map 能查配對位置，但會用 O(n) 空間，沒有利用題目給的排序與空間限制。

**下次可以怎麼想：** 已排序且兩端和能判定一整排配對必然太大或太小時，就能每次安全排除一端。

### 2. 暴力解／最直接的正確解

枚舉所有 i&lt;j，找到總和等於 target 就回傳一基位置。

#### TypeScript

```ts
function twoSumBrute(numbers: number[], target: number): number[] {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  throw new Error('No solution');
}
```

#### Python

```python
def two_sum_brute(numbers: list[int], target: int) -> list[int]:
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1]
    raise ValueError('No solution')
```

### 3. 暴力解的瓶頸

最多 n(n−1)/2 次比較，O(n²)。其中很多配對可由排序一次整批排除，不需要逐一算。

### 4. 從瓶頸推導資料結構／演算法

和小於 target 時，numbers[left] 配任何不大於 numbers[right] 的值都太小，故丟棄 left。和大於 target 時，numbers[right] 配任何不小於 numbers[left] 的值都太大，故丟棄 right。

### 5. 為什麼是這個資料結構／方法

索引存取、相加、比較都 O(1)，不另存查詢表。left 只增加、right 只減少，所以總移動 n−1 次以內。

### 6. 最佳解法步驟

1. 兩端指標起始為 0 與 n−1。
2. 相加等於 target 就回傳兩者加 1。
3. 太小移 left，太大移 right。
4. 保持 left&lt;right；題面保證會找到。

### 7. 核心不變量：每輪都要保持什麼

若答案尚未找到，兩個答案位置都仍在目前 `[left,right]` 候選區間內；被刪除的端點已證明不可能參與任何尚未檢查的有效配對。

### 8. 手動演算

| left,right | 數值和 | 動作（target=9） |
| --- | --- | --- |
| 0,3 | 2+15=17 | 排除右端 |
| 0,2 | 2+11=13 | 排除右端 |
| 0,1 | 2+7=9 | 回傳 [1,2] |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function twoSum(numbers: number[], target: number): number[] {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  throw new Error('No solution');
}
```

#### Python

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1
        else:
            right -= 1
    raise ValueError('No solution')
```

### 10. 複雜度分析

每輪縮短候選區間一格，最多 n−1 輪，O(n) 時間、O(1) 額外空間；固定兩個索引的輸出也是 O(1)。無解例外是防禦行為，不是官方會測的正常路徑。

### 11. 邊界條件與常見錯誤

回傳 0-based；left&lt;=right 讓同一位置被用兩次；指標移動方向顛倒；未排序資料照用；把第 1 題 Map 做法照搬而超出空間要求。

### 12. 為什麼不用其他方法

每個位置搭配二分搜尋是 O(n log n)、O(1) 額外空間，可作中間解。未排序時 Map 更合適；若先排序還要回傳原始位置，須保留位置對應及排序成本。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[], number]; expected: number[] }[] = [
  {"args": [[2, 7, 11, 15], 9], "expected": [1, 2]},
  {"args": [[2, 3, 4], 6], "expected": [1, 3]},
  {"args": [[-1, 0], -1], "expected": [1, 2]},
  {"args": [[3, 3], 6], "expected": [1, 2]},
  {"args": [[-5, -2, 0, 4], -7], "expected": [1, 2]},
  {"args": [[0, 1, 3, 9], 12], "expected": [3, 4]}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [twoSumBrute, twoSum]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('167: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[2, 7, 11, 15], 9], "expected": [1, 2]}, {"args": [[2, 3, 4], 6], "expected": [1, 3]}, {"args": [[-1, 0], -1], "expected": [1, 2]}, {"args": [[3, 3], 6], "expected": [1, 2]}, {"args": [[-5, -2, 0, 4], -7], "expected": [1, 2]}, {"args": [[0, 1, 3, 9], 12], "expected": [3, 4]}]''')

def normalize(value):
    return value
for solve in (two_sum_brute, two_sum):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('167: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不想把明明不可能成功的配對逐個算完。例如最小候選加最大候選還不夠，這個最小值就不必再試。排序提供可證明的方向，兩個索引只保存候選界線。省去配對表，代價是必須先有可靠排序。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

後台從已排序的整數庫存包裝量中找兩包湊指定數量：數字 → 包裝 units，索引 → package 記錄。無序資料、帶品類相容性條件時不能只依數量排除。

### 3. 工程遷移情境

包裝選擇工具接受按 units 非遞減排序的清單，允許無解並回傳 null；多解時回傳掃描首先找到的一組，不宣稱最便宜或最早。

### 4. 常見直覺寫法

```ts
type Package = { id: string; units: number };
function validatePackages(items: readonly Package[], target: number): void {
  if (!Number.isSafeInteger(target) || target < 0 || target > 1e9) throw new Error('invalid target');
  for (let i = 0; i < items.length; i++) {
    if (!Number.isSafeInteger(items[i].units) || items[i].units < 0 || items[i].units > 1e9
      || (i > 0 && items[i - 1].units > items[i].units)) throw new Error('invalid sorted input');
  }
}
function pickPackagesBefore(items: readonly Package[], target: number): [string, string] | null {
  validatePackages(items, target);
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    if (items[i].units + items[j].units === target) return [items[i].id, items[j].id];
  }
  return null;
}
```

### 5. 潛在問題與觸發門檻

上萬個候選包裝且無解時，兩兩比較會走到平方量級。若只有幾種固定包裝，枚舉成本小；還可更容易處理其他優先條件。

### 6. 套用本題技巧

沿用已排序、兩個不同位置、和等於目標；產品輸出 package ID，不直接把一基索引漏到 UI。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function pickPackages(items: readonly Package[], target: number): [string, string] | null {
  validatePackages(items, target);
  let left = 0, right = items.length - 1;
  while (left < right) {
    const sum = items[left].units + items[right].units;
    if (sum === target) return [items[left].id, items[right].id];
    if (sum < target) left++; else right--;
  }
  return null;
}
```

### 8. 優化前後比較

含前置驗證，原版 O(n²)、新版 O(n)，兩版額外 O(1)。多解時可能選中不同的有效 ID，契約明確允許任何有效一組。

### 9. 使用界線與代價

排序是必要前提。若必須字典序最小 ID 或最低價格，需把該目標納入演算法；本函式只做本地候選查找，不處理庫存預留或同時下單。

### 10. Code Review 說法

> 清單已按 units 排好，可用兩端和一次排除不可能的端點，將無解路徑改為線性；請明確保留任何一組都可、無解回傳 null 的契約。

### 11. 變形題

1. 回傳所有配對而非唯一一組時，如何處理重複值？
2. 原始輸入未排序但要回傳原 index，代價在哪？
3. 要最接近 target，如何維持目前最好差距？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 已排序且兩端和能判定一整排配對必然太大或太小時，就能每次安全排除一端。 |
| 最直接的解法與瓶頸 | 枚舉 i&lt;j，O(n²)。 |
| 最佳化方法 | 相向雙指標與排序排除 |
| 每輪都要保持什麼（invariant） | 答案若存在，仍在未排除的候選區間。 |
| 時間／空間 | O(n) 時間、O(1) 額外空間。 |
| 常見錯誤 | 一基位置與移動方向。 |
| 工作用途與限制 | 排序包裝配對；多解規則另定。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
