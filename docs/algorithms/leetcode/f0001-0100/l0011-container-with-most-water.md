---
title: "[0011] Container With Most Water"
toc_max_heading_level: 2
description: "LeetCode 11 Container With Most Water 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0011", "Container With Most Water", "TypeScript", "Python", "面試練習"]
---

# [0011] Container With Most Water

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-10-01（W04）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 11／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Container With Most Water](https://leetcode.com/problems/container-with-most-water/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

從一排垂直線選兩條，與底線形成不傾斜的容器，找能裝最多水的面積。只選兩個邊界，中間線不扣面積。

### 3. Input / Output 契約

輸入非負整數高度陣列，橫向間距為 1；回傳最大面積數值，不是索引，也不是所有凹槽水量總和。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function maxArea(height: number[]): number;
```

#### Python

```python
def max_area(height: list[int]) -> int: ...
```

### 4. 官方範例拆解

1. `[1,8,6,2,5,4,8,3,7] → 49`：位置 1 的高 8 與位置 8 的高 7，寬 7，水高 7，面積 49。
2. `[1,1] → 1`：寬 1、高 1。

### 5. 限制條件

`2 <= n <= 10^5`；`0 <= height[i] <= 10^4`。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「挑兩條」「最大面積」「寬是位置距離」「不能傾斜」「高度非負」。

### 7. 面試確認問題

不必問中間柱子要不要扣除，題意是兩條線作容器，與接雨水題不同。若換成真實幾何資料，需問間距是否一致、是否有厚度與單位。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[1, 8, 6, 2, 5, 4, 8, 3, 7]]` | `49` |
| 官方 2 | `[[1, 1]]` | `1` |
| 自訂：零高度 | `[[0, 0]]` | `0` |
| 自訂：等高 | `[[5, 5, 5]]` | `10` |
| 自訂：遞增 | `[[1, 2, 3, 4]]` | `4` |
| 自訂：遞減 | `[[4, 3, 2, 1]]` | `4` |
| 自訂：高柱在中間 | `[[2, 100, 2]]` | `4` |



### 9. 第一個直覺

每一對的容量如何計算？若目前一高一低，保留矮邊、只換另一邊有機會更好嗎？

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
function maxArea(height: number[]): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def max_area(height: list[int]) -> int:
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

面積受兩個高度中哪個限制？

</details>

<details>
<summary>提示二：解法方向</summary>

從最寬兩端開始，找能安全排除的那一端。

</details>

<details>
<summary>提示三：接近解法</summary>

算過目前面積後移動較矮端；保留它只會變窄，無法改善。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用移動短邊的雙指標？

不想枚舉每一對，但不能只憑「兩個數」就用雙指標。關鍵是面積等於較矮高度乘寬度。若左高 2、右高 7，保留左邊再把右邊往內，水高最多仍是 2、寬只會更小，所以左邊可排除。排序高度會破壞原本距離；選兩根最高柱也忽略寬度，因此都不能替代這個推導。

**下次可以怎麼想：** 若目標值由一個瓶頸和逐漸縮小的範圍決定，先證明保留瓶頸不會改善，再安全排除它。

### 2. 暴力解／最直接的正確解

列舉所有 i&lt;j，用 `(j−i)*min(height[i],height[j])` 更新最大值。

#### TypeScript

```ts
function maxAreaBrute(height: number[]): number {
  let best = 0;
  for (let i = 0; i < height.length; i++) for (let j = i + 1; j < height.length; j++) {
    best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
  }
  return best;
}
```

#### Python

```python
def max_area_brute(height: list[int]) -> int:
    best = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            best = max(best, (j - i) * min(height[i], height[j]))
    return best
```

### 3. 暴力解的瓶頸

約 n²/2 對逐一算，但保留短邊的其他更窄配對，其上界已不超過當前面積。

### 4. 從瓶頸推導資料結構／演算法

先看最外兩端並記錄面積。若 left 較矮，所有保留 left 的內部配對都不會更好，故 left++；right 較矮同理。等高時任移一邊皆可。

### 5. 為什麼是這個資料結構／方法

兩個索引及 best，陣列索引 O(1)；每輪至少移一端。沒有排序，也不用 Set 或 Map。

### 6. 最佳解法步驟

1. left=0、right=n−1、best=0。
2. 用短邊高度乘端點距離更新 best。
3. 移動較矮端；同高任選一端。
4. 直到兩端相遇，回傳 best。

### 7. 核心不變量：每輪都要保持什麼

best 是已看配對的最大面積。每次刪掉一端前，已證明所有保留該端的更窄配對都不會超越已記錄值；因此全域最佳值不是已記錄，就是仍有候選在區間內。

### 8. 手動演算

| left,right | 高度 | 面積 | 動作 |
| --- | --- | --- | --- |
| 0,8 | 1,7 | 8 | 左較矮，left++ |
| 1,8 | 8,7 | 49 | 右較矮，right-- |
| 1,7 | 8,3 | 18 | right-- |
| 1,6 | 8,8 | 40 | 同高任移一端；best 仍 49 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1, best = 0;
  while (left < right) {
    best = Math.max(best, (right - left) * Math.min(height[left], height[right]));
    if (height[left] <= height[right]) left++;
    else right--;
  }
  return best;
}
```

#### Python

```python
def max_area(height: list[int]) -> int:
    left, right, best = 0, len(height) - 1, 0
    while left < right:
        best = max(best, (right - left) * min(height[left], height[right]))
        if height[left] <= height[right]:
            left += 1
        else:
            right -= 1
    return best
```

### 10. 複雜度分析

候選寬每輪減 1，共最多 n−1 輪，O(n) 時間，O(1) 額外空間。官方面積最大不超過 (10^5−1)×10^4，JavaScript number 可精確表示整數結果。

### 11. 邊界條件與常見錯誤

移較高端沒有排除保證；面積用 max(height) 會高估；寬寫 right−left+1；先排序破壞距離；把這題當接雨水扣中間高度。舊版 `[right-left] * ...` 倚賴陣列隱式轉型，改為數值算式。

### 12. 為什麼不用其他方法

暴力解很適合作為小資料測試 oracle。排序高柱再貪心或只看兩根最高都不保證最優；單調堆疊常用在接雨水，與本題的目標函式不同。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[]]; expected: number }[] = [
  {"args": [[1, 8, 6, 2, 5, 4, 8, 3, 7]], "expected": 49},
  {"args": [[1, 1]], "expected": 1},
  {"args": [[0, 0]], "expected": 0},
  {"args": [[5, 5, 5]], "expected": 10},
  {"args": [[1, 2, 3, 4]], "expected": 4},
  {"args": [[4, 3, 2, 1]], "expected": 4},
  {"args": [[2, 100, 2]], "expected": 4}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [maxAreaBrute, maxArea]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('11: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[1, 8, 6, 2, 5, 4, 8, 3, 7]], "expected": 49}, {"args": [[1, 1]], "expected": 1}, {"args": [[0, 0]], "expected": 0}, {"args": [[5, 5, 5]], "expected": 10}, {"args": [[1, 2, 3, 4]], "expected": 4}, {"args": [[4, 3, 2, 1]], "expected": 4}, {"args": [[2, 100, 2]], "expected": 4}]''')

def normalize(value):
    return value
for solve in (max_area_brute, max_area):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('11: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

把「看起來不值得試」變成可證明的排除：保留短邊時，高度受限、寬度只縮小，整批候選不可能改善。這是證明型貪心思維，額外狀態很少；真正代價是需要嚴格滿足同一目標函式。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

這題主要是面試中的排除證明練習，沒有通用的前後端容器功能可直接套。可信的直接場景是演算法教學工具的容器示範計算器；一般業務中的「兩個候選」不足以成立此證明。

### 3. 工程遷移情境

教學視覺化工具接受等間距線段高度，回傳示範圖的最大面積；這是受限數學模型，不當成實際水利或結構設計。

### 4. 常見直覺寫法

```ts
function validateHeights(values: readonly number[]): void {
  if (values.length < 2 || values.length > 100000 || values.some(x => !Number.isInteger(x) || x < 0 || x > 10000)) {
    throw new Error('invalid demo heights');
  }
}
function demoAreaBefore(values: readonly number[]): number {
  validateHeights(values);
  return maxAreaBrute([...values]);
}
```

### 5. 潛在問題與觸發門檻

大量柱線的即時示範若枚舉所有配對，十萬柱接近五十億次比較。這是規模估算；實際 UI 還有繪圖成本，線性演算法不會自動解決渲染瓶頸。

### 6. 套用本題技巧

直接使用相同等間距、取短邊乘寬度的模型。可遷移的是「證明被丟掉的候選不可能更好」；不為了工程例子虛構庫存、網路吞吐與此公式相同。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function demoArea(values: readonly number[]): number {
  validateHeights(values);
  return maxArea([...values]);
}
```

### 8. 優化前後比較

計算 O(n²) 改 O(n)。核心算法 O(1) 空間，但這個 readonly wrapper 為重用簽名複製陣列，因此 wrapper 整體 O(n) 額外空間；不可把兩者混寫。

### 9. 使用界線與代價

若畫每一對配對而非只求最大值，輸出本身仍平方。真正生產應用缺少同樣瓶頸單調性時不能套；這份例子是教育工具，工程遷移範圍明確有限。

### 10. Code Review 說法

> 最大面積只需要最後一個值，可以用短邊排除把計算降成線性；請保留小輸入暴力結果作核對，並分開量測計算與圖形渲染。

### 11. 變形題

1. 橫座標不等距但仍遞增，短邊排除是否仍成立？
2. 必須列出每對面積時，線性輸出還可能嗎？
3. 改成接雨水總量，為何不能只保存最大兩端容器？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 若目標值由一個瓶頸和逐漸縮小的範圍決定，先證明保留瓶頸不會改善，再安全排除它。 |
| 最直接的解法與瓶頸 | 所有端點配對 O(n²)。 |
| 最佳化方法 | 移動短邊的雙指標 |
| 每輪都要保持什麼（invariant） | 丟棄短邊的更窄配對都不可能改善 best。 |
| 時間／空間 | 核心 O(n) 時間、O(1) 空間。 |
| 常見錯誤 | 移高邊、寬加 1、排序破壞距離。 |
| 工作用途與限制 | 主要為排除證明訓練；教學計算器可直接用。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
