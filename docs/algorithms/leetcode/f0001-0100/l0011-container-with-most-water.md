---
title: "[0011] Container With Most Water"
sidebar_label: "[0011] Container With Most Water"
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

## Stage A｜解題前：先獨立完成（0–30 分鐘）

這一段先不提示解法。請先計時、口述題意，手算測資，再寫自己的版本。

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號 | 0011 |
| 題名 | Container With Most Water |
| 難度 | Medium |
| 題目大類 | Array |
| 官方題面 | [LeetCode：Container With Most Water](https://leetcode.com/problems/container-with-most-water/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

你會拿到一排垂直線的高度 `height`。選其中兩條作為容器左右邊界，底部是兩條線之間的水平距離。請回傳所有選法中最大的容器面積。

容器不能傾斜；中間的線不會扣掉面積。這題只問兩條邊界能圍出的面積，不是把各處的積水加總。

### 3. Input / Output 契約

輸入非負整數高度陣列，相鄰兩條線的橫向間距為 1。題目要回傳最大面積數值，不是端點索引，也不是所有凹槽水量總和。

#### TypeScript

```ts
function maxArea(height: number[]): number;
```

#### Python

```python
def max_area(height: list[int]) -> int: ...
```

| 項目 | 契約 |
| --- | --- |
| `height[i]` | 位置 `i` 的垂直線高度，為非負整數 |
| 兩線距離 | 位置 `i` 與 `j` 的距離是 `j - i`，其中 `i < j` |
| 單組面積 | `min(height[i], height[j]) * (j - i)` |
| 回傳值 | 所有不同端點配對中的最大面積 |
| 是否回傳端點 | 否，只回傳面積 |
| 是否修改輸入 | 本文實作不修改 `height`，這是筆記約定 |

### 4. 官方範例拆解

#### 範例一

```text
輸入：height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
輸出：49
```

位置 1 的高度是 8，位置 8 的高度是 7。兩者距離為 `8 - 1 = 7`，水面不能高過較矮的右邊，所以面積為 `7 * 7 = 49`；官方輸出是最大面積 49。

#### 範例二

```text
輸入：height = [1, 1]
輸出：1
```

只有一組端點，寬為 1、高為 1，因此面積為 1。

### 5. 限制條件

- `2 <= height.length <= 10^5`。
- `0 <= height[i] <= 10^4`。
- 位置間距固定為 1，容器不可傾斜。

先估算：若逐一檢查每一對端點，當 `n = 10^5` 時會比較幾組？Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

這些只是題目提供的訊號，還不是解法：

- 「挑兩條線」
- 「最大面積」
- 「寬是兩個位置的距離」
- 「水高受較矮邊限制」
- 「不能傾斜」
- 「高度非負」

### 7. 面試確認問題

| 可以確認的問題 | 本題答案 |
| --- | --- |
| 需要回傳端點位置嗎？ | 不用，只回傳最大面積 |
| 中間的柱子會扣掉水量嗎？ | 不會；這題只看選出的兩條邊界 |
| 可以傾斜容器嗎？ | 不可以 |
| 兩條線之間的間距固定嗎？ | 固定，相鄰位置距離為 1 |
| 可能只有一條線嗎？ | 不會，長度至少為 2 |
| 可以修改輸入嗎？ | 題面未要求；本文實作不修改 |

若改成真實幾何資料，才需要再確認座標是否等距、線段厚度與單位。

### 8. 自訂測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | `height` | 預期最大面積 |
| --- | --- | --- |
| 官方 1 | `[1, 8, 6, 2, 5, 4, 8, 3, 7]` | `49` |
| 官方 2／最小長度 | `[1, 1]` | `1` |
| 自訂：零高度 | `[0, 0]` | `0` |
| 自訂：等高 | `[5, 5, 5]` | `10` |
| 自訂：遞增 | `[1, 2, 3, 4]` | `4` |
| 自訂：遞減 | `[4, 3, 2, 1]` | `4` |
| 自訂：最高柱不一定組成最佳解 | `[2, 100, 2]` | `4` |

### 9. 第一個直覺

先在自己的筆記中回答，不必追求最佳解：

1. 最直接、一定正確的做法是什麼？
2. 每一對端點的面積怎麼計算？
3. 你的方案為什麼不會漏掉任何有效配對？
4. 哪些工作會重複做？

> 我的第一個想法：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

### 10. 複雜度預估

在寫 code 前先估算：

- `n` 代表什麼？
- 你的方案會處理多少組端點？每組需要多少工作？
- `n = 10^5` 時，大約需要多少次比較？
- 另外儲存了哪些資料？

> 我的預估：時間 `O(____)`，額外空間 `O(____)`。

### 11. 解題計畫

```txt
1. 我要按照什麼順序處理輸入：
2. 每一步如何判定／產生答案：
3. 何時停止，如何確認沒有漏解：
我認為最容易錯的測資與理由：
```

### 12. 第一次閉卷實作

不要捏造成功紀錄。完成後把自己的第一次版本留在這裡：

#### TypeScript

```ts
function maxArea(height: number[]): number {
  // 在這裡保留第一次作答
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def max_area(height: list[int]) -> int:
    raise NotImplementedError("先完成自己的版本")
```

| 紀錄 | 內容 |
| --- | --- |
| 花費時間 | ＿＿＿＿ |
| 是否一次通過／失敗測資 | ＿＿＿＿ |
| 錯誤類型（契約／推導／邊界／語法／複雜度） | ＿＿＿＿ |
| 卡住的位置 | ＿＿＿＿ |
| 看到第幾層提示 | ＿＿＿＿ |

#### 分級提示

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

---

## Stage B｜解題分析：完成閉卷後再看（30–50 分鐘）

:::warning 先完成第一次作答

以下開始包含解法。若還沒自己嘗試，先停在 A 區。

:::

### 1. 看到這題，怎麼想到要用移動短邊的雙指標？

**先抓住這個想法：** 面積由「較矮邊的高度 × 兩邊距離」決定。當距離縮小，若較矮的那條線還留著，這些新配對不可能比目前更好，所以可以一次排除它。

可以照這個順序想：

1. **題目要我回答什麼？** 從所有兩條線中，找出最大面積。
2. **最直接怎麼做？** 把每對端點都算一次，保留最大值。
3. **哪件事最花時間？** 同一條線會與很多其他端點重複配對。能否一次證明其中一批配對都不值得再看？
4. **最寬的一對能提供什麼資訊？** 先看最左與最右。之後所有內部配對都更窄。
5. **哪一端可以安全丟掉？** 假設左高 2、右高 7。只把右端往內，寬度變小，水高仍不超過 2；這一批配對都不會超越已算過的這一對。因此移走左端，尋找可能更高的新短邊。

例如高度 `[2, 3, 7]`：端點 `(0, 2)` 的面積是 `2 * 2 = 4`；保留左邊、把右端換到位置 1，只剩 `1 * min(2, 3) = 2`。這裡不是靠猜測「短邊比較重要」，而是用面積上界排除候選。

排序高度會破壞原本位置距離；只選兩根最高柱也忽略寬度。兩者都不能代替上述證明。

**下次可以怎麼想：** 若目標值由一個瓶頸和逐漸縮小的範圍決定，先證明保留瓶頸不會改善，再安全排除它。

### 2. 暴力解／最直接的正確解

列舉所有 `i < j`，用 `(j - i) * min(height[i], height[j])` 更新最大值。這是最容易確認正確性的版本，也適合當小測資的對照答案。

#### TypeScript

```ts
function maxAreaBrute(height: number[]): number {
  let best = 0;
  for (let left = 0; left < height.length; left += 1) {
    for (let right = left + 1; right < height.length; right += 1) {
      const width = right - left;
      const waterHeight = Math.min(height[left], height[right]);
      best = Math.max(best, width * waterHeight);
    }
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

總共有 `n * (n - 1) / 2` 對端點。當 `n = 10^5` 時，約為 `4,999,950,000` 對。每一對的計算雖然是 `O(1)`，完整枚舉仍是 `O(n²)` 時間。

真正要省的是重複檢查「保留同一條短邊，另一端卻越靠越近」的配對；這些配對的面積上界已經能由目前端點推得。

### 4. 從瓶頸推導資料結構／演算法

先看最外兩端並記錄面積。假設 `height[left] <= height[right]`，對任何新的右端 `k`，若 `left < k < right`：

```text
area(left, k)
  = (k - left) * min(height[left], height[k])
  <= (k - left) * height[left]
  <= (right - left) * height[left]
  = area(left, right)
```

目前這對已計入 `best`，所以所有保留 `left` 的更窄配對都不可能創造更高答案，可以執行 `left++`。若右邊較矮，左右對稱地移動 `right`。兩端同高時，任移一端都成立。

### 5. 為什麼是這個資料結構／方法

這裡使用的是**相向雙指標加上可證明的候選排除**。兩個索引表示尚未排除的端點範圍，`best` 保存已算過的最大面積。

| 操作 | 成本 | 原因 |
| --- | --- | --- |
讀取兩端高度 | `O(1)` | 陣列可直接用 index 讀值 |
計算當前面積 | `O(1)` | 一次減法、取較小值與乘法 |
排除一端 | `O(1)` | 每輪只移動一個 index |

每輪至少縮小區間一次，因此最多 `n - 1` 輪。不需要排序，也不需要另外記錄各高度出現的位置；`Set` 或 `Map` 無法提供這裡需要的面積上界證明。

### 6. 最佳解法步驟

1. 設 `left = 0`、`right = n - 1`、`best = 0`。
2. 計算 `(right - left) * min(height[left], height[right])`，用它更新 `best`。
3. 移動較矮的一端；同高時任選一端。
4. 重複直到兩端相遇，回傳 `best`。

### 7. 核心不變量：每輪都要保持什麼

在每輪開始時：

> `best` 是已計算配對中的最大面積；被移出區間的端點，其尚未逐一計算的配對都無法超越 `best`。全域最佳值已在 `best` 中，或仍由目前區間內的端點組成。

計算當前面積後才移動端點，是維持這條規則的關鍵。移動短邊所排除的配對都比當前面積小；當兩端相遇時，不再有兩條不同的線可配對，所以 `best` 就是答案。

### 8. 手動演算

以官方範例 `[1, 8, 6, 2, 5, 4, 8, 3, 7]` 逐輪追蹤：

| `left, right` | 兩端高度 | 當前面積 | 更新後 `best` | 移動哪端 |
| --- | --- | ---: | ---: | --- |
| `0, 8` | `1, 7` | `8 * 1 = 8` | 8 | 左端較矮，`left++` |
| `1, 8` | `8, 7` | `7 * 7 = 49` | 49 | 右端較矮，`right--` |
| `1, 7` | `8, 3` | `6 * 3 = 18` | 49 | `right--` |
| `1, 6` | `8, 8` | `5 * 8 = 40` | 49 | 等高，這份程式移左端 |
| `2, 6` | `6, 8` | `4 * 6 = 24` | 49 | `left++` |

後續區間更窄，程式繼續跑到兩端相遇；最大值保持 49。等高時若改為移右端，走訪路徑可能不同，但答案相同。

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

### 11. Edge cases 與常見錯誤

#### 移動較高端

若 `height[left] < height[right]`，移動較高的右端時，只知道寬度變窄，卻無法安全排除原本的右端。例如 `[1, 100, 100, 100]`，若從兩端開始一直移動較高的右端，最多只記到面積 3，會錯過位置 1 與 3 的面積 200。只有短邊的排除證明成立。

#### 把水高寫成兩邊的最大值

水會從較矮端流出，應使用 `min(...)`。例如 `[2, 10]` 的面積是 `2`，不是 `10`。

#### 把寬度寫成 `right - left + 1`

寬是兩條線位置的距離。最小長度 `[1, 1]` 的寬是 `1`，不是 `2`。

#### 排序後才找端點

排序會改變原本的位置距離。即使知道最高的兩條線，也不能單憑高度確定最大面積；`[2, 100, 2]` 的答案來自兩端，面積為 4。

#### 與 Trapping Rain Water 混淆

本題選兩條線圍成單一容器，不扣掉中間的高度，也不累計各位置的積水。

#### 倚賴 JavaScript 隱式轉型

`[right - left] * waterHeight` 會先建陣列再轉為數值。應直接寫 `(right - left) * waterHeight`，讓寬度始終是數值。

### 12. 為什麼不用其他方法

| 方法 | 時間／空間 | 本題取捨 |
| --- | --- | --- |
| 枚舉所有端點配對 | `O(n²)`／`O(1)` | 簡單且正確，適合作小測資對照；最大輸入太大 |
| 排序後挑高柱 | 至少有排序成本 | 原位置距離被破壞，不能據此得到答案 |
| 只看兩根最高柱 | `O(n)`／`O(1)` | 忽略寬度，無法保證最優 |
| 短邊排除的相向雙指標 | `O(n)`／`O(1)` | 保留位置與寬度，且每次排除有證明 |

若題目改成「列出所有配對面積」，輸出本身就有 `O(n²)` 項，不能期待只走線性次數；若改成接雨水總量，目標函式與證明都必須重做。

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

---

## Stage C｜解題後：遷移到 Production（50–60 分鐘）

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** 當兩兩比較太多時，這個方法幫我們找出「整批都不可能更好」的候選，省去逐一檢查。

例如目前左高 2、右高 7、距離 5，面積為 10。保留左邊的高度 2，只把右邊往內縮，寬度小於 5，水高又不可能超過 2，因此那些配對都不會超過 10。可以直接移走左端。

陣列保存各位置的高度；兩個指標表示尚未排除的範圍；演算法根據「較矮邊限制面積」的證明決定移哪端。這把配對計算從 `O(n²)` 降為 `O(n)`，只需 `O(1)` 額外空間。代價是證明依賴這個確切的面積公式；換了目標函式不能照搬。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：演算法教學工具的容器示範

- **原本麻煩在哪？** 使用者調整一排等間距高度後，前端每次都重算所有端點配對；柱線數量很大、操作頻繁時，計算會拖慢回應。
- **怎麼套用這題？** 畫面資料的 `height[i]` 就是題目的線段高度；只需要顯示最大面積數值時，可用短邊排除，把每次計算縮到線性時間。
- **做到哪裡就不夠？** 若畫面還要逐一動畫展示所有配對，輸出與動畫工作仍可能是平方量級。繪圖瓶頸也要另外量測。

#### 情境 B：演算法測試器檢查快速版本

- **原本麻煩在哪？** 修改指標移動規則後，少數樣本可能仍通過，卻在特殊高度排列下漏解。
- **怎麼套用這題？** 小陣列用暴力解產生正確面積，再和快速解比較；這是把本題的「所有端點配對 → 最大面積」當成測試基準。
- **做到哪裡就不夠？** 暴力測試器只適用小資料，不能拿它處理十萬條線；測試通過也不能代替短邊排除的正確性證明。

這題在一般產品功能中沒有很常見的直接對應。可以帶回工作的重點，是先找出能**證明**安全排除的候選，再決定是否優化搜尋。

### 工程情境：即時容器示範計算器

假設前端的教學工具接受等間距線段高度，每次拖曳滑桿就回傳最大面積供畫面顯示。這是受限的數學示範，不拿來代表實際水利或結構設計。

輸入由 UI 產生，但函式仍檢查資料：至少兩條線、最多十萬條、每個高度都是 0 到 10,000 的整數。函式不修改輸入；無效資料直接拋錯，不把錯誤高度偷偷當成 0。

### 常見直覺寫法

先驗證一次資料，再列舉每一組端點。這個版本容易理解，也適合少量柱線的示範。

```ts
function validateHeights(values: readonly number[]): void {
  if (values.length < 2 || values.length > 100_000) {
    throw new RangeError("Expected 2 to 100,000 heights.");
  }
  if (values.some((value) => !Number.isInteger(value) || value < 0 || value > 10_000)) {
    throw new RangeError("Each height must be an integer from 0 to 10,000.");
  }
}

function demoAreaBefore(values: readonly number[]): number {
  validateHeights(values);
  let best = 0;
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      best = Math.max(best, (right - left) * Math.min(values[left], values[right]));
    }
  }
  return best;
}
```

這裡的兩層迴圈與 Stage B 的暴力解相同；差別是工程函式先確認外部資料契約，並以 `readonly` 表達不修改輸入。

### 潛在問題與觸發門檻

- 20 條線只有 `20 * 19 / 2 = 190` 組配對；低頻操作時，直覺版本可能就夠。
- 10,000 條線有 `49,995,000` 組配對；拖曳時若每次重新計算，成本會反覆發生。
- 100,000 條線接近 50 億組配對，已不適合作即時枚舉。

這些是比較次數推算，不是毫秒實測。前端還可能受繪圖或狀態更新影響；應分開量測計算與渲染耗時。

### 套用本題技巧

這個示範工具使用相同的資料與公式，所以可直接套用短邊排除：

```text
原本：每兩條線都配一次，再取最大面積。
現在：只看目前左右端點，記下面積後移走較矮端。
```

對每次移走的端點，保留它並縮小寬度的所有配對都無法改善已記錄值。這一步是正確性的核心，不是因為「雙指標通常比較快」。

### Production 風格優化

工程例子以 TypeScript 展示資料契約。這裡直接接受 `readonly number[]`，只讀取資料，不需要為了呼叫 Stage B 的可變陣列簽名而複製整份輸入。

```ts
function demoArea(values: readonly number[]): number {
  validateHeights(values);
  let left = 0;
  let right = values.length - 1;
  let best = 0;

  while (left < right) {
    const waterHeight = Math.min(values[left], values[right]);
    best = Math.max(best, (right - left) * waterHeight);

    if (values[left] <= values[right]) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return best;
}
```

若要顯示最大容器的端點，則需連同 `best` 記錄那一組索引，並定義多組面積相同時選哪一組；本函式只承諾回傳面積。

### 優化前後

| 面向 | 枚舉所有配對 | 移動短邊 |
| --- | --- | --- |
| 單次計算 | `O(n²)` | `O(n)` |
| 額外空間 | `O(1)` | `O(1)` |
| 輸入驗證 | `O(n)`，已包含在總成本中 | `O(n)`，已包含在總成本中 |
| 輸入修改 | 不修改 | 不修改 |
| 回傳值 | 最大面積 | 相同的最大面積 |
| 適合情境 | 小量、低頻，也適合作對照測試 | 大量或頻繁重新計算 |

兩者對合法輸入使用相同的面積公式與回傳契約。線性計算不代表畫面一定流暢，還需看渲染成本。

### 使用界線與代價

- 少量、低頻計算時，簡單雙層迴圈更容易檢查；應依資料規模與量測結果決定是否替換。
- 要列出或動畫展示每一組配對時，輸出本身是 `O(n²)`；只算最大值的捷徑不能消除展示成本。
- 線段若有不等距橫座標，必須重新檢查輸入契約與寬度公式；橫座標嚴格遞增時短邊排除仍可成立，但程式不能繼續用 index 差當寬度。
- 換成其他業務指標時，必須先證明「保留短邊、縮小寬度無法改善」的同型性質，否則不能套此移動規則。

### Code Review 說法

> 目前每次調整高度都枚舉所有端點；若輸入達一萬條線，單次就有約五千萬組比較。這個最大面積公式允許移走較矮端，因為保留它的更窄配對不會超過當前值。我建議用雙指標把計算降成 `O(n)`，保留小輸入暴力版作核對，並分開量測計算與圖形渲染。

### 變形題

1. 橫座標不等距但仍遞增，短邊排除是否仍成立？
2. 必須列出每對面積時，線性輸出還可能嗎？
3. 改成接雨水總量，為何不能只保存最大兩端容器？

### 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到移動短邊？ | 寬度縮小時，保留較矮邊無法提高水高；先證明那些配對不會更好，再排除該端。 |
| 暴力解與瓶頸 | 枚舉所有端點配對，共 `O(n²)` 次。 |
| 最佳化 | 從最寬兩端開始，每輪計算面積並移走較矮端。 |
| 每輪都要保持什麼？ | 被移走端點的未算配對都不會超越 `best`；這就是 invariant（不變量）。 |
| 時間／空間 | 核心 O(n) 時間、O(1) 空間。 |
| 常見錯誤 | 移高邊、寬加 1、排序破壞距離。 |
| Production | 等間距容器示範計算器可直接用；換公式前必須重做排除證明。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

---

## 相關連結

- [回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
- [Two Sum](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)
