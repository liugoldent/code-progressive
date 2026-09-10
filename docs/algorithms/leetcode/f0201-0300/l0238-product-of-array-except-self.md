---
title: "[0238] Product of Array Except Self"
toc_max_heading_level: 2
description: "LeetCode 238 Product of Array Except Self 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0238", "Product of Array Except Self", "TypeScript", "Python", "面試練習"]
---

# [0238] Product of Array Except Self

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-09-17（W02）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 238／Medium |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

對每個位置，算出其他所有位置數字的乘積，按原位置順序回傳。不能使用除法。

### 3. Input / Output 契約

輸入整數陣列，輸出等長整數陣列。排除的是目前位置，其他位置即使數值相同仍要乘進去；輸出順序必須對應輸入位置。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function productExceptSelf(nums: number[]): number[];
```

#### Python

```python
def product_except_self(nums: list[int]) -> list[int]: ...
```

### 4. 官方範例拆解

1. `[1,2,3,4] → [24,12,8,6]`：位置 1 的結果是 1×3×4=12。
2. `[-1,1,0,-3,3] → [0,0,9,0,0]`：只有排除那個 0 的位置能得到非零乘積。

### 5. 限制條件

`2 <= n <= 10^5`；值介於 -30 與 30。所有前綴、後綴乘積以及答案保證在 32 位整數範圍；要求 O(n) 時間、不能除法。進階要求不計輸出時 O(1) 額外空間。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「每個位置都要答案」「排除自己」「可能為零或負數」「不能除法」「線性時間」。

### 7. 面試確認問題

不必問能否有 0，限制已允許。面試中可確認輸出空間是否排除在計算外；進階題面已明說。超出整數範圍的產品需求要另定數值格式。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[1, 2, 3, 4]]` | `[24, 12, 8, 6]` |
| 官方 2 | `[[-1, 1, 0, -3, 3]]` | `[0, 0, 9, 0, 0]` |
| 自訂：兩個零 | `[[0, 0, 2]]` | `[0, 0, 0]` |
| 自訂：最小 | `[[2, 3]]` | `[3, 2]` |
| 自訂：負數 | `[[-1, -2, -3]]` | `[6, 3, 2]` |
| 自訂：全一 | `[[1, 1, 1]]` | `[1, 1, 1]` |



### 9. 第一個直覺

先固定一個位置，把其他數字乘起來。換到下一個位置時，哪些計算又重做一次？

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
function productExceptSelf(nums: number[]): number[] {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def product_except_self(nums: list[int]) -> list[int]:
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

排除自己之後，剩下的位置能分成哪兩段？

</details>

<details>
<summary>提示二：解法方向</summary>

記錄左邊乘積，再從右邊補上乘積。

</details>

<details>
<summary>提示三：接近解法</summary>

先把左側乘積寫入輸出，再用單一 rightProduct 反向相乘。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用前綴／後綴乘積？

不想每換一個排除位置，就重新乘整份陣列。以 `[2,3,4]` 的中間位置為例，答案只需要左邊的 2 乘右邊的 4。每次前進，左側乘積只多一個數；反向也相同。Map 並沒有需要查找的 key，保存每個值出現幾次也無法直接得到每個位置左右兩段的結果。

**下次可以怎麼想：** 若每個位置的答案能拆成左段與右段，而且相鄰位置能重用累積結果，就考慮前綴／後綴。

### 2. 暴力解／最直接的正確解

每個位置 i 都從 1 開始，遍歷所有 j，只乘 j≠i 的數。

#### TypeScript

```ts
function productExceptSelfBrute(nums: number[]): number[] {
  return nums.map((_, i) => {
    let product = 1;
    for (let j = 0; j < nums.length; j++) if (j !== i) product *= nums[j];
    return product;
  });
}
```

#### Python

```python
def product_except_self_brute(nums: list[int]) -> list[int]:
    result = []
    for i in range(len(nums)):
        product = 1
        for j, value in enumerate(nums):
            if j != i:
                product *= value
        result.append(product)
    return result
```

### 3. 暴力解的瓶頸

n 個位置各做 n−1 次乘法，共 n(n−1) 次，O(n²)。每個位置的左右區段與相鄰位置大幅重疊。

### 4. 從瓶頸推導資料結構／演算法

第一遍把左邊、不含自己的乘積放到 answer[i]。第二遍維持右邊、不含自己的乘積，乘進 answer[i]。先使用累積值，再把 nums[i] 納入，才能確保沒有包含自己。

### 5. 為什麼是這個資料結構／方法

順序索引與乘法都是 O(1)，不需查找容器。乘法的單位元素是 1，空的左段／右段應是 1；不是 0。此處以官方有界整數模型分析。

### 6. 最佳解法步驟

1. answer 配置 n 格，prefix=1。
2. 從左到右先寫 prefix，再乘上目前元素。
3. suffix=1，從右到左先把 suffix 乘進 answer，再更新 suffix。
4. 回傳 answer。

### 7. 核心不變量：每輪都要保持什麼

正向處理 i 前，prefix 等於所有索引小於 i 的乘積。反向處理 i 前，suffix 等於所有索引大於 i 的乘積，answer[i] 已是左側乘積。

### 8. 手動演算

| i | 左側乘積 | 右側乘積 | 最終答案（[1,2,3,4]） |
| --- | --- | --- | --- |
| 0 | 1 | 24 | 24 |
| 1 | 1 | 12 | 12 |
| 2 | 2 | 4 | 8 |
| 3 | 6 | 1 | 6 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function productExceptSelf(nums: number[]): number[] {
  const result = Array<number>(nums.length).fill(1);
  let prefix = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= suffix;
    suffix *= nums[i];
  }
  return result;
}
```

#### Python

```python
def product_except_self(nums: list[int]) -> list[int]:
    result = [1] * len(nums)
    prefix = 1
    for i, value in enumerate(nums):
        result[i] = prefix
        prefix *= value
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    return result
```

### 10. 複雜度分析

初始化與兩次遍歷均 O(n)，總時間 O(n)。只多 prefix、suffix 與索引，額外空間 O(1)；輸出本身 O(n)。若建左右兩份陣列，雖同樣線性時間，輔助空間會成為 O(n)。

### 11. 邊界條件與常見錯誤

先更新 prefix 再存會包含自己；初始化為 0 讓全部歸零；用總乘積除 nums[i] 違反要求且遇 0 失敗。JavaScript 可能產生 −0，數值上等於 0，序列化測試採同一表示。

### 12. 為什麼不用其他方法

左右兩張乘積表更容易教學，記憶體足夠時合理。總乘積加零計數仍涉及除法，不是本題合規解。任意區間查詢、動態更新要用其他結構，不能把這個一次掃描當万能工具。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[]]; expected: number[] }[] = [
  {"args": [[1, 2, 3, 4]], "expected": [24, 12, 8, 6]},
  {"args": [[-1, 1, 0, -3, 3]], "expected": [0, 0, 9, 0, 0]},
  {"args": [[0, 0, 2]], "expected": [0, 0, 0]},
  {"args": [[2, 3]], "expected": [3, 2]},
  {"args": [[-1, -2, -3]], "expected": [6, 3, 2]},
  {"args": [[1, 1, 1]], "expected": [1, 1, 1]}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [productExceptSelfBrute, productExceptSelf]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('238: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[1, 2, 3, 4]], "expected": [24, 12, 8, 6]}, {"args": [[-1, 1, 0, -3, 3]], "expected": [0, 0, 9, 0, 0]}, {"args": [[0, 0, 2]], "expected": [0, 0, 0]}, {"args": [[2, 3]], "expected": [3, 2]}, {"args": [[-1, -2, -3]], "expected": [6, 3, 2]}, {"args": [[1, 1, 1]], "expected": [1, 1, 1]}]''')

def normalize(value):
    return value
for solve in (product_except_self_brute, product_except_self):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('238: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不要為每個「拿掉一個」的結果重算其他全部。三個布林條件 `[true,false,true]` 若要知道移除各自後其餘是否全過，可以先計算左邊全部通過、再結合右邊。乘法換成 AND 仍可沿用同一分段思考；輸出要 O(n) 空間。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

管理頁解釋多條篩選條件：對一筆記錄，顯示「移除此條件後，其餘條件是否全部符合」。數字 → 已計算的條件結果，乘積 → AND。這只分析同一筆記錄的條件集合，不會自動算整個資料庫每個篩選的命中數。

### 3. 工程遷移情境

篩選除錯面板先固定一份布林結果快照；以下函式不重新呼叫具有副作用的 predicate。

### 4. 常見直覺寫法

```ts
function passesWithoutEachBefore(results: readonly boolean[]): boolean[] {
  return results.map((_, omitted) => results.every((ok, i) => i === omitted || ok));
}
```

### 5. 潛在問題與觸發門檻

m 個條件大多通過時，every 無法提早失敗，會做約 m² 次檢查；批次診斷很多記錄時累積放大。幾個 UI 開關的單次計算則不需要特別優化。

### 6. 套用本題技巧

排除索引 i 的乘積，對應排除條件 i 的合取；AND 有結合律、空段為 true，能拼左右兩段。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function passesWithoutEach(results: readonly boolean[]): boolean[] {
  const output: boolean[] = [];
  let left = true;
  for (const ok of results) {
    output.push(left);
    left = left && ok;
  }
  let right = true;
  for (let i = results.length - 1; i >= 0; i--) {
    output[i] = output[i] && right;
    right = right && results[i];
  }
  return output;
}
```

### 8. 優化前後比較

最差 O(m²) 改 O(m)，兩版輸出都 O(m)，優化額外狀態 O(1)。這個布林特例也能只數失敗數量，並以 O(m) 產出，程式更短。

### 9. 使用界線與代價

條件結果若依賴外部狀態，必須以同一快照計算；不可用短路呼叫改變副作用次數。對純布林資料，失敗計數通常更簡單；此例用來理解可結合運算的左右分解。

### 10. Code Review 說法

> 這份診斷會替每個條件重掃全部布林結果；若量測成為熱點，可以用失敗計數，或需要更一般聚合時採左右累积。請先固定結果快照，避免重跑 predicate。

### 11. 變形題

1. 把乘法換成求和或 AND，空段值是什麼？
2. 換成減法，為什麼不能原樣合併？
3. 每次改一個值又要全部答案，哪些計算可以重用？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 若每個位置的答案能拆成左段與右段，而且相鄰位置能重用累積結果，就考慮前綴／後綴。 |
| 最直接的解法與瓶頸 | 每個位置重乘其餘全部 O(n²)。 |
| 最佳化方法 | 前綴／後綴乘積 |
| 每輪都要保持什麼（invariant） | 先使用不含自己的累積值，再更新。 |
| 時間／空間 | O(n)；額外 O(1)，輸出 O(n)。 |
| 常見錯誤 | 初始化 0、先更新、用除法。 |
| 工作用途與限制 | 排除條件的聚合；先確認結合律與快照。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
