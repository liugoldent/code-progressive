---
title: "[0042] Trapping Rain Water"
toc_max_heading_level: 2
description: "LeetCode 42 Trapping Rain Water 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Hard
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0042", "Trapping Rain Water", "TypeScript", "Python", "面試練習"]
---

# [0042] Trapping Rain Water

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-10-02（W04 週測）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

日曆這天只要求圖解與解法理解，不要求一次寫完。此處仍備好完整雙語題解；你可以先手算每格水量，再讀不變量，程式與工程延伸按自己的步調閱讀。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 42／Hard |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

每根柱寬 1，下雨後計算所有凹槽上方能留下的水量總和。柱子本身占空間，不能把它算成水。

### 3. Input / Output 契約

輸入非負整數高度，輸出總水量整數。左右沒有邊界能擋住的水會流掉；回傳總量，不是挑兩條線求最大容器。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function trap(height: number[]): number;
```

#### Python

```python
def trap(height: list[int]) -> int: ...
```

### 4. 官方範例拆解

1. `[0,1,0,2,1,0,1,3,2,1,2,1] → 6`：索引 2、4、5、6、9 分別有 1、1、2、1、1 單位水。
2. `[4,2,0,3,2,5] → 9`：中間四格水量為 2、4、1、2。

### 5. 限制條件

`1 <= n <= 2*10^4`；`0 <= height[i] <= 10^5`。每根柱寬固定 1。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「每根寬 1」「雨後保留」「水量總和」「非負高度」「左右開放」。

### 7. 面試確認問題

不必問可否傾斜或選哪兩根，本題是整張高度圖。產品模擬需問是否三維、邊界開放、流動與排水；官方不模擬時間或滲透。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]]` | `6` |
| 官方 2 | `[[4, 2, 0, 3, 2, 5]]` | `9` |
| 自訂：單格 | `[[0]]` | `0` |
| 自訂：單凹槽 | `[[3, 0, 3]]` | `3` |
| 自訂：遞增 | `[[1, 2, 3]]` | `0` |
| 自訂：遞減 | `[[3, 2, 1]]` | `0` |
| 自訂：等高 | `[[2, 2, 2]]` | `0` |
| 自訂：邊界不同高 | `[[5, 0, 1, 0, 2]]` | `5` |



### 9. 第一個直覺

只看某一格，它的水面最多能到多高？只看左右相鄰柱夠嗎，還是要看更遠？

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
function trap(height: number[]): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def trap(height: list[int]) -> int:
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

每格水面由左最高與右最高的哪一個決定？

</details>

<details>
<summary>提示二：解法方向</summary>

先用兩份前後最大值理解，再考慮只保存兩端目前最大值。

</details>

<details>
<summary>提示三：接近解法</summary>

當 leftMax&lt;=rightMax，左側水量已可確定；對右側未知的更高柱不會讓左側水位超過 leftMax。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用左右最大值與雙指標結算？

最直接對每格重新找左右最高柱，再以較低邊界減去該格高度。`[4,2,0,3,2,5]` 的第二格左最高 4、右最高 5，所以只有 2 格水。反覆找最大值是瓶頸，先保存前後最大值就能線性；再往前想，左右最大值較小的一側已足以結算，不必保存整張表。Set 不提供位置兩側最大值，單看相鄰柱也會漏掉遠處邊界。

**下次可以怎麼想：** 某位置受左右邊界的較小值限制時，若一側上限已確定且另一側至少同高，就可先結算這一側。

### 2. 暴力解／最直接的正確解

每格 i 各掃一次含自己的左側、右側最大值，相減算該格水量；邊界至少包含自己，因此結果不會為負。

#### TypeScript

```ts
function trapBrute(height: number[]): number {
  let total = 0;
  for (let i = 0; i < height.length; i++) {
    let leftMax = height[i], rightMax = height[i];
    for (let j = 0; j < i; j++) leftMax = Math.max(leftMax, height[j]);
    for (let j = i + 1; j < height.length; j++) rightMax = Math.max(rightMax, height[j]);
    total += Math.min(leftMax, rightMax) - height[i];
  }
  return total;
}
```

#### Python

```python
def trap_brute(height: list[int]) -> int:
    total = 0
    for i in range(len(height)):
        left_max = right_max = height[i]
        for j in range(i):
            left_max = max(left_max, height[j])
        for j in range(i + 1, len(height)):
            right_max = max(right_max, height[j])
        total += min(left_max, right_max) - height[i]
    return total
```

### 3. 暴力解的瓶頸

n 格各掃 O(n) 高度，總 O(n²)。同一段左側最高柱被重找很多次，右側也相同。

### 4. 從瓶頸推導資料結構／演算法

中間解可先算 leftMax[i]、rightMax[i]，再加總，O(n) 時間 O(n) 空間。要省記憶體，兩端逐步縮進：每輪先把目前兩端高度納入最大值；較小最大值那側已知有對面更高的牆，故其水量已確定。

### 5. 為什麼是這個資料結構／方法

只需 max、加減與陣列索引。兩個最大值不是目前端點高度，而是各自掃描過的整側最大高度；這個版本的判斷依 max，不能隨意替換成另一版本的迴圈條件。

### 6. 最佳解法步驟

1. left=0、right=n−1，兩侧最大值與 total=0。
2. 先更新含目前端點的 leftMax、rightMax。
3. leftMax&lt;=rightMax 時加 leftMax−height[left]，再 left++。
4. 否則加 rightMax−height[right]，再 right--。
5. 直到 left>right，每格結算一次。

### 7. 核心不變量：每輪都要保持什麼

區間外格子的水量已正確累計。更新後 leftMax 是 `[0,left]` 的最大值，rightMax 是 `[right,n−1]` 的最大值。較小邊界側的對面已有至少同高的牆，所以當前格水位只受較小邊界限制；相等可任結算一側。

### 8. 手動演算

| [4,2,0,3,2,5] 的 left,right | leftMax,rightMax | 本輪新增水量 | 總量 |
| --- | --- | --- | --- |
| 0,5 | 4,5 | 4−4=0 | 0 |
| 1,5 | 4,5 | 4−2=2 | 2 |
| 2,5 | 4,5 | 4−0=4 | 6 |
| 3,5 | 4,5 | 4−3=1 | 7 |
| 4,5 | 4,5 | 4−2=2 | 9 |
| 5,5 | 5,5 | 5−5=0 | 9 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;
  while (left <= right) {
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);
    if (leftMax <= rightMax) {
      total += leftMax - height[left];
      left++;
    } else {
      total += rightMax - height[right];
      right--;
    }
  }
  return total;
}
```

#### Python

```python
def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = total = 0
    while left <= right:
        left_max = max(left_max, height[left])
        right_max = max(right_max, height[right])
        if left_max <= right_max:
            total += left_max - height[left]
            left += 1
        else:
            total += right_max - height[right]
            right -= 1
    return total
```

### 10. 複雜度分析

每輪結算一格，恰好 n 輪，O(n) 時間。只保存五個數值狀態與索引，O(1) 額外空間。官方總量上界小於 2×10^9，JavaScript number 可精確表示。

### 11. 邊界條件與常見錯誤

先相減再更新最大值可能算出負水量；把每格水位取左右最大值中的較高者；只看緊鄰柱；和 Container With Most Water 的兩端最大面積混淆；不同版本的 max 更新順序與迴圈條件混用。

### 12. 為什麼不用其他方法

兩張前後最大值表容易畫圖，O(n) 空間且可輸出每格水深。單調堆疊也 O(n)，擅長按凹槽結算但要小心寬度與等高柱。只要總量時雙指標更省記憶體；要每格水深則表格可能更清楚。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[]]; expected: number }[] = [
  {"args": [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], "expected": 6},
  {"args": [[4, 2, 0, 3, 2, 5]], "expected": 9},
  {"args": [[0]], "expected": 0},
  {"args": [[3, 0, 3]], "expected": 3},
  {"args": [[1, 2, 3]], "expected": 0},
  {"args": [[3, 2, 1]], "expected": 0},
  {"args": [[2, 2, 2]], "expected": 0},
  {"args": [[5, 0, 1, 0, 2]], "expected": 5}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [trapBrute, trap]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('42: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], "expected": 6}, {"args": [[4, 2, 0, 3, 2, 5]], "expected": 9}, {"args": [[0]], "expected": 0}, {"args": [[3, 0, 3]], "expected": 3}, {"args": [[1, 2, 3]], "expected": 0}, {"args": [[3, 2, 1]], "expected": 0}, {"args": [[2, 2, 2]], "expected": 0}, {"args": [[5, 0, 1, 0, 2]], "expected": 5}]''')

def normalize(value):
    return value
for solve in (trap_brute, trap):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('42: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不要為每個格子重找遠處最高邊界；保存已知上界後，可以在足够資訊時提前結算。左右最大值存摘要，雙指標選可確定的一側。省下兩張表，但若需要所有每格數據仍要輸出空間。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

一維地形教學或遊戲關卡預覽可計算靜態蓄水示意：陣列值 → 等寬地形格高度，結果 → 二維剖面面積。這不是實際排水量預測；三維出口、排水孔與流體動態都超過本題模型。

### 3. 工程遷移情境

關卡編輯器的靜態剖面檢查，格寬由參數給出，非負有限高度；回傳剖面面積，單位為高度單位乘寬度單位。

### 4. 常見直覺寫法

```ts
function validateProfile(heights: readonly number[], cellWidth: number): void {
  if (!Number.isFinite(cellWidth) || cellWidth <= 0 || cellWidth > 1000 || heights.length > 20000
    || heights.some(h => !Number.isFinite(h) || h < 0 || h > 100000)) throw new Error('invalid profile');
}
function basinAreaBefore(heights: readonly number[], cellWidth: number): number {
  validateProfile(heights, cellWidth);
  return trapBrute([...heights]) * cellWidth;
}
```

### 5. 潛在問題與觸發門檻

拖曳兩萬格的地形圖時，每次重做平方掃描可能成為熱點；還需量測繪圖與事件頻率。小型固定教學圖直接用前後表，更有利顯示每格水位。

### 6. 套用本題技巧

核心不變量維持等寬、靜態開放邊界的一維模型；結果再乘格寬。即使高度改為小數，同一比較證明成立，但計算有浮點誤差，測試應用容許誤差。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function basinArea(heights: readonly number[], cellWidth: number): number {
  validateProfile(heights, cellWidth);
  return trap([...heights]) * cellWidth;
}
```

### 8. 優化前後比較

O(n²) 改 O(n)，核心 O(1) 暫存；wrapper 複製 readonly 陣列需 O(n)。若高度是小數，結果是近似面積，不應要求十進位逐位完全相等。

### 9. 使用界線與代價

每次修改仍重算全圖 O(n)，不是常數更新。若關卡有排水孔或三維旁路，需更完整的模型；本題不能替代物理模擬。

### 10. Code Review 說法

> 這裡只需要靜態總面積，可以用左右最大值逐格結算，避免每格重掃；請把面積單位、開放邊界與浮點容差寫進契約。

### 11. 變形題

1. 每根寬度不同，結算水深後還需乘什麼？
2. 改回傳每格水深，需要多少輸出空間？
3. 二維網格可以從側面洩水，左右兩個最大值為何不夠？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 某位置受左右邊界的較小值限制時，若一側上限已確定且另一側至少同高，就可先結算這一側。 |
| 最直接的解法與瓶頸 | 每格找左右最高，O(n²)。 |
| 最佳化方法 | 左右最大值與雙指標結算 |
| 每輪都要保持什麼（invariant） | 較小最大值側已有足夠對面邊界，可安全結算。 |
| 時間／空間 | 核心 O(n) 時間，O(1) 空間。 |
| 常見錯誤 | 先減後更新、取較高水位、與容器題混淆。 |
| 工作用途與限制 | 一維地形教學；不等於真實流體或排水模型。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
