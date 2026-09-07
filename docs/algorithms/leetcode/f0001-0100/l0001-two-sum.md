---
title: "[0001] Two Sum"
sidebar_label: "[0001] Two Sum"
description: "LeetCode 0001 Two Sum 三階段刷題筆記：先讀懂題目與限制，再推導解法，最後把技巧遷移到真實工程案例。"
tags:
  - LeetCode
  - Easy
  - Array
  - Interview
keywords: ["0001", "Two Sum", "LeetCode", "TypeScript", "Python", "陣列題", "面試刷題"]
---

# [0001] Two Sum

> 題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)  
> 官方題目：[LeetCode 1. Two Sum](https://leetcode.com/problems/two-sum/)  
> 今日完整日課：[第 1 週 Day 4：Python 與 System Design](/docs/career-blueprint/week-01-day-04)

## Stage A｜解題前：先獨立完成（0–25 分鐘）

這一段先不提示最佳資料結構。請先計時、口述題意，再寫自己的版本。

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號 | 0001 |
| 題名 | Two Sum |
| 難度 | Easy |
| 題目大類 | Array |
| 官方題目 | [LeetCode：Two Sum](https://leetcode.com/problems/two-sum/) |
| 本次整理日期 | 2026-09-05 |
| 建議限時 | 第一次作答 20 分鐘，口述 3 分鐘 |

### 2. 白話題意

你會拿到一個整數陣列 `nums` 和一個整數 `target`。請從陣列中找出兩個不同位置，讓這兩個位置上的數字相加等於 `target`，最後回傳這兩個位置的 index。

題目保證恰好存在一組有效答案；同一個元素不能使用兩次，答案順序不限。

### 3. Input / Output 契約

```ts
function twoSum(nums: number[], target: number): number[];
```

Python：

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    ...
```

| 項目 | 契約 |
| --- | --- |
| `nums` | 整數陣列 |
| `target` | 兩個目標元素的總和 |
| 回傳值 | 長度為 2 的 index 陣列 |
| 是否回傳數值 | 否，題目要的是 index |
| 是否能重複使用同一位置 | 否 |
| 答案數量 | 官方保證恰好一組 |
| index 順序 | 任意順序皆可 |
| 是否修改輸入 | 本文實作不修改 `nums` |

### 4. 官方範例拆解

#### 範例一

```text
輸入：nums = [2, 7, 11, 15], target = 9
輸出：[0, 1]
```

`nums[0]` 是 `2`，`nums[1]` 是 `7`，兩者相加為 `9`，因此回傳 `[0, 1]`。

#### 範例二

```text
輸入：nums = [3, 2, 4], target = 6
輸出：[1, 2]
```

`nums[1] + nums[2]` 等於 `2 + 4`，結果為 `6`。注意答案不是回傳 `[2, 4]`，而是回傳它們的位置 `[1, 2]`。

#### 範例三

```text
輸入：nums = [3, 3], target = 6
輸出：[0, 1]
```

雖然兩個數值相同，但它們位於不同位置，因此可以組成答案。

### 5. 限制條件

- `2 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`
- `-10^9 <= target <= 10^9`
- 恰好存在一組有效答案。
- 官方追問：能否提出時間複雜度低於 `O(n²)` 的演算法？

先不要想特定資料結構，先問自己：當陣列長度為 `10^4` 時，兩兩比較的次數最多會到什麼量級？

### 6. 客觀關鍵字與線索

這些只是題目提供的客觀訊號，還不是解法：

- 「兩個不同位置」
- 「相加等於 `target`」
- 「回傳 index」
- 「恰好一組答案」
- 「答案順序不限」
- 「低於 `O(n²)`」
- 陣列沒有保證已排序

### 7. 面試確認問題

| 可以確認的問題 | 本題答案 |
| --- | --- |
| 可能沒有答案嗎？ | 不會，題目保證一組答案 |
| 可能有多組答案嗎？ | 不會，題目保證只有一組有效答案 |
| 可以使用同一個元素兩次嗎？ | 不可以 |
| 要回傳數字還是 index？ | index |
| 可以修改原陣列嗎？ | 題目沒有要求；如果修改會影響 index，應先說明 |
| index 的回傳順序重要嗎？ | 不重要 |

### 8. 自訂測資

寫程式前，先確認自己的方案能處理下列情況：

```ts
// 最小長度
nums = [1, 2], target = 3; // [0, 1]

// 相同數值，但使用不同 index
nums = [3, 3], target = 6; // [0, 1]

// 包含負數
nums = [-3, 4, 3, 90], target = 0; // [0, 2]

// 包含 0
nums = [0, 4, 3, 0], target = 0; // [0, 3]

// 答案不在相鄰位置
nums = [5, 1, 8, 2], target = 7; // [0, 3]
```

### 9. 第一個直覺

先在自己的筆記中回答，不必追求最佳解：

1. 最直接、一定正確的做法是什麼？
2. 怎麼保證不會把同一個 index 使用兩次？
3. 找到答案後能不能提前結束？
4. 目前的方案會重複做哪些工作？

> 我的第一個想法：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

### 10. 複雜度預估

在寫 code 前先估算：

- 每個元素需要和多少個其他元素比較？
- 陣列長度為 `n` 時，比較次數如何成長？
- 當 `n = 10^4` 時，這個成本是否符合官方追問？
- 如果願意使用額外空間，能否減少重複尋找？

> 我的預估：時間 `O(____)`，空間 `O(____)`。

### 11. 解題計畫

先用三到五句話或 pseudocode 描述：

```text
1. 我要保存／檢查的資訊是：
2. 每走到一個元素時，我會：
3. 找到答案的條件是：
4. 如果還沒找到，我會：
```

### 12. 第一次閉卷實作

不要捏造成功紀錄。完成後再填寫：

```ts
function twoSumFirstAttempt(nums: number[], target: number): number[] {
  // 在這裡保留第一次作答
  throw new Error("先完成自己的版本");
}
```

Python：

```python
def two_sum_first_attempt(nums: list[int], target: int) -> list[int]:
    raise NotImplementedError("先完成自己的版本")
```

| 紀錄 | 內容 |
| --- | --- |
| 花費時間 | ＿＿＿＿ |
| 是否一次通過 | ＿＿＿＿ |
| 錯誤類型 | ＿＿＿＿ |
| 卡住的位置 | ＿＿＿＿ |

#### 分級提示

<details>
<summary>提示一：重新看需求</summary>

當你站在目前的數字上，要和它配對的另一個數字，可以直接用 `target` 和目前數字算出來嗎？

</details>

<details>
<summary>提示二：思考需要的操作</summary>

如果已經看過前面的數字，你需要快速回答：「我要找的那個數字以前出現過嗎？它的 index 是多少？」

</details>

<details>
<summary>提示三：接近解法</summary>

用一個能建立「數值 → index」對應的結構。每次先尋找目前數字的補數，找不到時再記錄目前數字。

</details>

---

## Stage B｜解題分析：完成閉卷後再看（25–50 分鐘）

:::warning 先完成第一次作答

以下開始包含解法。若還沒自己嘗試，先停在 A 區。

:::

### 1. 看到這題，怎麼想到要用 Map／dict？

**先抓住這個想法：** 不只要知道「配對的數字看過沒」，還要知道「它在哪個位置」，所以用 Map／dict 記住數值與位置的對應。

可以照這個順序想：

1. **題目要我回答什麼？** 找兩個不同位置，數值相加等於 target，回傳位置。
2. **最直接怎麼做？** 把不同位置兩兩配一次，找到符合的就結束。
3. **哪件事一直重複？** 每換一個數字，又掃描一批候選值來找配對。
4. **真的需要逐個猜配對值嗎？** 不用。若 target 是 9、目前是 7，只需要找 2；這個 `target - value` 就叫補數。
5. **該記什麼才能直接回答？** 記住前面每個值的位置，用補數查位置。陣列每次 `findIndex` 仍要從頭找，Map／dict 才能在一般雜湊情況下平均 `O(1)` 查到。

拿 `[2, 7, 11, 15]` 想一次：先記下 `2 → 0`，讀到 7 時查 2，取得位置 0，就能回傳 `[0, 1]`。

**為什麼不沿用 Contains Duplicate 的 Set？** Set 只記「看過沒」，Two Sum 還要回傳位置，所以保存的資訊不夠；記出現次數也不能直接回答位置。

**下次可以怎麼想：** 若能由目前值算出需要的另一個值，而且還要取得它的位置或資料，就考慮用 Map／dict 記住先前的對應。Pattern 是「邊讀、邊記、邊查配對」，不是看到「兩個」就套公式。

### 2. 暴力解

最直接的正確做法，是枚舉所有不同的 index 組合。

```ts
function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let left = 0; left < nums.length; left += 1) {
    for (let right = left + 1; right < nums.length; right += 1) {
      if (nums[left] + nums[right] === target) {
        return [left, right];
      }
    }
  }

  throw new Error("The input does not contain a valid pair.");
}
```

Python：

```python
def two_sum_brute_force(nums: list[int], target: int) -> list[int]:
    for left in range(len(nums)):
        for right in range(left + 1, len(nums)):
            if nums[left] + nums[right] == target:
                return [left, right]
    raise ValueError("The input does not contain a valid pair.")
```

`right` 從 `left + 1` 開始，所以不會使用同一個元素兩次，也不會重複比較 `[i, j]` 和 `[j, i]`。

### 3. 暴力解的瓶頸

對每個 `nums[left]`，內層迴圈都會重新掃描後面的候選數字。

最差比較次數為：

```text
(n - 1) + (n - 2) + ... + 1
= n × (n - 1) / 2
```

當 `n = 10,000` 時，最多約為 `49,995,000` 次比較。真正重複的工作是：每換一個目前值，都得再掃描候選資料，尋找它需要的補數。

### 4. 從瓶頸推導資料結構

目前最慢的操作是：

```text
我要的 complement 是否已經出現？如果有，它在哪個 index？
```

如果只靠陣列回答，每次查找是 `O(n)`；如果在掃描過程中建立數值索引，就可以直接用補數取得先前位置。

因此把：

```text
反覆掃描陣列找補數
```

改成：

```text
查詢「數值 → index」的對應
```

### 5. 為什麼是 Map／dict，而不是 Set

這題需要以下操作；TypeScript 使用 Map，Python 使用 dict：

| 操作 | `Map<number, number>` 的平均成本 |
| --- | ---: |
| 記錄某個數值的 index | `O(1)` |
| 查詢補數是否出現 | `O(1)` |
| 取得補數的 index | `O(1)` |

`Set` 只能很自然地回答「有沒有這個數值」，但題目還要回傳 index。`Map` 可以同時保存數值與位置，因此更符合需求。

### 6. 最佳解法步驟

使用一次掃描：

1. 建立 `indexByValue`，保存之前看過的數值與 index。
2. 走到 `nums[i]` 時，計算 `complement = target - nums[i]`。
3. 先查詢 `complement` 是否已經存在。
4. 如果存在，回傳補數的舊 index 與目前 index。
5. 如果不存在，再把目前數值與 index 放入 `Map`。

「先查再存」很重要，它能保證目前元素不會和自己配對。

### 7. 核心不變量

在每次處理 index `i` 的開頭：

> `indexByValue` 只包含 index 小於 `i` 的元素；因此一旦找到補數，補數 index 一定和 `i` 不同。

這條規則同時解決了快速查找與「不可使用同一個元素兩次」兩個要求。

### 8. 手動演算

以 `nums = [2, 7, 11, 15]`、`target = 9` 為例：

| `i` | `nums[i]` | `complement` | 查找前的 `Map` | 結果 |
| ---: | ---: | ---: | --- | --- |
| 0 | 2 | 7 | `{}` | 找不到 7，記錄 `2 → 0` |
| 1 | 7 | 2 | `{2 → 0}` | 找到 `2 → 0`，回傳 `[0, 1]` |

再看重複值 `nums = [3, 3]`、`target = 6`：

| `i` | `nums[i]` | `complement` | 查找前的 `Map` | 結果 |
| ---: | ---: | ---: | --- | --- |
| 0 | 3 | 3 | `{}` | 找不到，記錄 `3 → 0` |
| 1 | 3 | 3 | `{3 → 0}` | 找到 index 0，回傳 `[0, 1]` |

### 9. 完整實作

#### TypeScript

```ts
function twoSum(nums: number[], target: number): number[] {
  const indexByValue = new Map<number, number>();

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    const complement = target - value;
    const complementIndex = indexByValue.get(complement);

    if (complementIndex !== undefined) {
      return [complementIndex, index];
    }

    indexByValue.set(value, index);
  }

  throw new Error("The input does not contain a valid pair.");
}
```

使用 `complementIndex !== undefined`，而不是判斷它是否為 truthy，因為合法答案可能位於 index `0`。

#### Python

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    index_by_value: dict[int, int] = {}

    for index, value in enumerate(nums):
        complement = target - value
        if complement in index_by_value:
            return [index_by_value[complement], index]
        index_by_value[value] = index

    raise ValueError("The input does not contain a valid pair.")
```

Python 用 `in` 判斷鍵是否存在，不用位置的 truthy 值判斷。若要在 LeetCode 提交，可將函式包進 `class Solution`，方法命名為 `twoSum(self, nums, target)`；本文保留獨立函式方便本機測試。

### 10. 複雜度分析

- 時間複雜度：平均 `O(n)`。每個元素只掃描一次，每次執行一次 `Map.get()` 和最多一次 `Map.set()`；兩者平均為 `O(1)`。
- 空間複雜度：`O(n)`。如果答案直到最後才出現，`Map` 最多保存與輸入規模同階的資料。

Python dict 的 `in`、取值與寫入也採一般雜湊操作平均 `O(1)` 的分析。暴力解最差時間 `O(n²)`、額外空間 `O(1)`。

JavaScript `Map` 的查找通常視為平均 `O(1)`；這不是所有情況下都保證的最壞界線，因此複雜度敘述要保留「平均」。

### 11. Edge cases 與常見錯誤

#### 錯把數值當成 index 回傳

```ts
return [complement, value]; // 錯誤：題目要 index
```

#### 先存再查，讓同一元素配到自己

如果輸入為 `[3, 2, 4]`、`target = 6`，先把 `3 → 0` 存入再找補數 `3`，就可能錯誤回傳 `[0, 0]`。

#### 用 truthy 判斷 index

```ts
if (indexByValue.get(complement)) {
  // index 0 會被判斷成 false
}
```

#### 以為相同數值不能使用

`[3, 3]` 可以組成答案，因為限制的是不能重複使用同一個 index，不是不能使用相同數值。

#### 使用排序後忘記原始 index

排序可以協助找配對，但會改變位置。若走排序方案，必須先保存每個值的原始 index。

### 12. 為什麼不用其他方法

| 方法 | 複雜度 | 本題取捨 |
| --- | --- | --- |
| 雙層迴圈 | 時間 `O(n²)`、空間 `O(1)` | 最容易推導，但不符合官方追問 |
| 排序＋雙指標 | 時間 `O(n log n)` | 可以找出數值，但需要額外保存原始 index |
| 兩次掃描 `Map` | 平均時間 `O(n)` | 可行，但要額外處理不能使用同一 index；一次掃描更直接 |
| `Set` | 平均查找 `O(1)` | 只存值不足以直接回傳 index |
| 一次掃描 `Map` | 平均時間 `O(n)`、空間 `O(n)` | 同時符合快速查找與回傳 index 的需求 |

如果題目改成「陣列已排序，而且只要回傳位置」，雙指標就會成為值得優先考慮的方案，因為它可以用 `O(1)` 額外空間完成。

### 13. 測試

同一套測資檢查暴力與最佳化版本。答案順序不限，因此驗證位置合法、位置不同、相加正確，並確認未修改輸入。以下包含三組官方範例與四組自訂測資；無解輸入屬於額外防禦契約。

#### TypeScript

將本節測試、暴力解與完整實作放進同一個 `two-sum.ts`，使用練習專案的 TypeScript 執行工具執行。

```ts
const cases: [number[], number][] = [
  [[2, 7, 11, 15], 9], [[3, 2, 4], 6], [[3, 3], 6],
  [[1, 2], 3], [[-3, 4, 3, 90], 0], [[0, 4, 3, 0], 0],
  [[5, 1, 8, 2], 7],
];
for (const solve of [twoSumBruteForce, twoSum]) {
  for (const [nums, target] of cases) {
    const before = JSON.stringify(nums);
    const result = solve(nums, target);
    const [i, j] = result;
    if (result.length !== 2 || !Number.isInteger(i) || !Number.isInteger(j)
        || i === j || i < 0 || j < 0 || i >= nums.length || j >= nums.length
        || nums[i] + nums[j] !== target || JSON.stringify(nums) !== before) {
      throw new Error(`Invalid result: ${JSON.stringify({ nums, target, result })}`);
    }
  }
  let rejected = false;
  try { solve([1, 2], 99); } catch { rejected = true; }
  if (!rejected) throw new Error("Expected an error for no valid pair");
}
console.log("Two Sum: both implementations passed");
```

#### Python

將測試、暴力解與完整實作放進同一個 `two_sum.py`，執行 `python two_sum.py`。

```python
def test_two_sum() -> None:
    cases = [
        ([2, 7, 11, 15], 9), ([3, 2, 4], 6), ([3, 3], 6),
        ([1, 2], 3), ([-3, 4, 3, 90], 0), ([0, 4, 3, 0], 0),
        ([5, 1, 8, 2], 7),
    ]
    for solve in (two_sum_brute_force, two_sum):
        for nums, target in cases:
            before = nums.copy()
            result = solve(nums, target)
            assert len(result) == 2
            i, j = result
            assert i != j and 0 <= i < len(nums) and 0 <= j < len(nums)
            assert nums[i] + nums[j] == target
            assert nums == before
        try:
            solve([1, 2], 99)
        except ValueError:
            pass
        else:
            raise AssertionError("Expected ValueError for no valid pair")


test_two_sum()
print("Two Sum: both implementations passed")
```

面試口述模板：

> 暴力解比較所有不同位置，最差是 `O(n²)`。我需要的其實只是配對值的位置，因此用 Map／dict 保存先前的數值與位置，把重複掃描改成平均 `O(1)` 查找。每輪先查再存，記錄裡的位置一定較早，不會配到自己。整體平均時間 `O(n)`、額外空間 `O(n)`。

---

## Stage C｜解題後：遷移到 Production（50–60 分鐘）

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** Map／dict 很適合處理「我一直要找某個值對應的資料，但不想每次都把整份清單翻一遍」。

例如目前金額是 700、目標是 900，我只需要查「200 對應哪一筆紀錄」。原本要逐筆比對，現在先記下 `200 → 紀錄 A`，就能直接取得 A。

Map 保存「值 → 資料」的對應；Two Sum 演算法則負責計算需要的值，並決定何時查詢與加入。兩者不是同一件事。

一般雜湊情況下，單次查找可從最差 `O(n)` 降為平均 `O(1)`，整批配對從最差 `O(n²)` 改成平均 `O(n)`。**代價是多一份索引記憶體。** 要保存多少筆、相同 key 留哪筆、何時清除，都要另外定義。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：後台尋找兩筆帳務調整紀錄

- **原本麻煩在哪？** 客服輸入差額後，工具把候選紀錄兩兩配一次，資料多時會做大量比較。
- **怎麼套用 Two Sum？** 把「數字 → index」換成「最小貨幣單位金額 → 紀錄 ID」。對每筆金額算差額，再查前面是否有候選。
- **做到哪裡就不夠？** 金額相符只是候選，不代表可核銷。還要確認帳戶、幣別、狀態與操作權限；兩個人同時核銷仍要由後端交易或條件更新保證，不能靠本機 Map。

#### 情境 B：前端把訂單與商品資訊合併

- **原本麻煩在哪？** 每張訂單都用 `products.find(...)` 找商品，`m` 張訂單、`n` 個商品，最差是 `O(mn)`。
- **怎麼套用 Two Sum？** 沿用「先建立對應，再快速查找」的技巧，建立「商品 ID → 商品」。建表加查詢平均 `O(n + m)`；這裡查的是商品 ID，不需要計算補數。
- **做到哪裡就不夠？** 商品更新後要重建或更新索引，否則讀到舊資料。索引也不能取代訂單陣列的顯示順序；只有少量資料、只查一次時，直接 `find` 可能更簡單。

下面用帳務候選配對，示範先直接改善重複查找，再補上資料契約。

### 工程情境：付款對帳工具的候選配對

假設後台取得同一帳戶、尚未核銷的一批調整紀錄，目標是找出兩筆加總符合差額的候選，回傳 ID；沒有答案則回傳 `null`。函式只找候選，不會修改紀錄或執行核銷。

真實資料可能有多組答案，所以先定義「第一組」：**依輸入順序，先選右側位置最早能完成的配對；同一右側位置有多個候選時，取左側位置最早的。** 例如金額 `[1, 2, 3, 4]`、目標 5，選位置 `[1, 2]`，不是 `[0, 3]`。

LeetCode 保證唯一答案，兩種順序都不影響正確性；工程案例沒有這個保證，不能只寫「依陣列順序」就當作行為相同。下面的暴力與索引版本都遵守上述規則。

### 常見直覺寫法

先假設上游已驗證：ID 唯一、同帳戶同幣別、尚未核銷，金額與目標是 JavaScript 安全整數，單位為最小貨幣單位。`readonly` 表達函式不修改輸入的責任。

```ts
type LedgerEntry = Readonly<{
  id: string;
  currency: "TWD" | "USD";
  amountMinor: number;
}>;

function findReconciliationPairBruteForce(
  entries: readonly LedgerEntry[],
  targetMinor: number,
): [string, string] | null {
  for (let right = 0; right < entries.length; right += 1) {
    const needed = targetMinor - entries[right].amountMinor;
    if (!Number.isSafeInteger(needed)) continue;

    for (let left = 0; left < right; left += 1) {
      if (entries[left].amountMinor === needed) {
        return [entries[left].id, entries[right].id];
      }
    }
  }
  return null;
}
```

外層先走右側位置，內層依序找較早位置，因此符合「最早完成配對」的規則。用補數比較時也檢查安全整數：若差值超出安全範圍，就不可能和已驗證為安全整數的候選相等，不使用捨入後的值配對。

### 潛在問題與觸發門檻

- 一次 30 筆，最多比較 `30 × 29 / 2 = 435` 組，簡單雙層迴圈可能就夠。
- 一次 10,000 筆且無解或很晚才找到，最多比較 `49,995,000` 組。
- 如果搜尋又隨篩選或輸入重複執行，累計成本會增加；應量測批次大小、呼叫頻率與耗時。
- 以上是比較次數推算，不是效能實測，也不能直接換算成毫秒。先確認延遲是否超過產品預算，再決定要不要優化。

### 套用本題技巧：先直接優化常見寫法

先沿用相同輸入契約與配對順序，只把「逐筆找補數」改成「用補數查 ID」，不急著增加快取或 class。

沿用上一段 `LedgerEntry`：

```ts
function findReconciliationPairIndexed(
  entries: readonly LedgerEntry[],
  targetMinor: number,
): [string, string] | null {
  const idByAmount = new Map<number, string>();

  for (const entry of entries) {
    const needed = targetMinor - entry.amountMinor;
    const matchedId = Number.isSafeInteger(needed)
      ? idByAmount.get(needed)
      : undefined;

    if (matchedId !== undefined) {
      return [matchedId, entry.id];
    }

    // 同金額保留最早的位置，才能符合既定選擇順序。
    if (!idByAmount.has(entry.amountMinor)) {
      idByAmount.set(entry.amountMinor, entry.id);
    }
  }
  return null;
}
```

```txt
原本：每走到一筆紀錄，再把前面的金額逐筆找一遍。
現在：算出需要的金額，直接查 idByAmount。
```

兩個容器的責任不同：

- `entries` 保留完整紀錄與輸入順序，仍是資料來源。
- `idByAmount` 只保存金額與最早 ID，負責查找，不會改寫輸入。
- 每輪查詢時 Map 只包含較早的紀錄，因此不會用同一位置配自己。
- 同金額不能無條件覆寫，否則可能改變「左側最早」的選擇規則。

對已驗證、一次性的小批資料，這層通常就足夠。Map 在每次呼叫結束後不再保留，不需要先引入跨次快取。

### 第一層優化留下的問題

查找變快，不代表輸入一定可靠：

```txt
上游混入不同幣別、重複 ID 或無效金額
→ Map 仍可能找到數值相符的配對
→ 回傳的候選卻不符合業務契約
```

另外，若一找到候選就結束，後半批的壞資料可能根本沒被檢查。當這個函式需要自行保證「選定幣別整批都有效」時，就先完整驗證，再開始找候選；不要只在查找迴圈裡驗證走到的資料。

### Production 進階優化：先驗證整批，再找候選

以下仍沿用同一份 `LedgerEntry` 與索引函式。這層補的是資料正確性，不會再把 `O(n)` 降成更小的量級。

```ts
function findReconciliationPair(
  entries: readonly LedgerEntry[],
  targetMinor: number,
  currency: LedgerEntry["currency"],
): [string, string] | null {
  if (!Number.isSafeInteger(targetMinor)) {
    throw new TypeError("targetMinor must be a safe integer.");
  }

  const candidates: LedgerEntry[] = [];
  const ids = new Set<string>();

  for (const entry of entries) {
    if (entry.currency !== currency) continue;
    if (entry.id.length === 0 || ids.has(entry.id)) {
      throw new TypeError("Selected entries must have unique, nonempty IDs.");
    }
    if (!Number.isSafeInteger(entry.amountMinor)) {
      throw new TypeError(`Entry ${entry.id} has an invalid amountMinor.`);
    }
    ids.add(entry.id);
    candidates.push(entry);
  }

  return findReconciliationPairIndexed(candidates, targetMinor);
}
```

這裡明確只驗證選定幣別，其他幣別被忽略。過濾後仍保留原順序；兩筆不同 ID、相同金額的紀錄可以配對，兩次出現同一 ID 則拒絕。

`candidates` 只保存原物件引用，函式同步讀取且不修改它們；若未來要保存成跨次快取，必須重新定義快照與失效機制。TypeScript 型別不會驗證外部 JSON，API 邊界仍要檢查欄位型別、帳戶權限與核銷狀態。

### 優化前後

| 面向 | 雙層掃描 | 直接 Map | 驗證整批＋Map |
| --- | --- | --- | --- |
| 單次搜尋時間 | 最差 `O(n²)` | 平均 `O(n)` | 平均 `O(n)`，增加一輪驗證 |
| 額外空間 | `O(1)` | `O(n)` | `O(n)`，含候選陣列與 ID 集合 |
| 配對順序 | 右側最早，再取左側最早 | 相同 | 選定幣別內相同 |
| 輸入修改 | 不修改 | 不修改 | 不修改 |
| 無解 | `null` | `null` | `null` |
| 輸入驗證 | 依賴呼叫端 | 依賴呼叫端 | 驗證選定幣別的 ID 與金額 |
| 適合情境 | 小量、低頻 | 已驗證的較大批次 | 需要此函式保證整批資料契約 |

### 使用界線與代價

- 數十筆、低頻查詢時，先保留易讀的版本；不要看到巢狀迴圈就認定值得改。
- 只找一組候選時，每個金額保存最早 ID 就夠。要找全部配對，需保存多個 ID，輸出本身可能達到 `O(n²)`。
- 原版若定義「左側位置優先」，不能直接替換成本例；要先決定是否允許改變選擇順序。
- 金額使用同幣別的最小貨幣單位安全整數；超出範圍應改用 `bigint` 等精確表示，並一起調整傳輸格式，不能只移除驗證。
- 同一批查很多個 target，重建 Map 仍需每次 `O(n)`；是否值得預處理，要衡量查詢次數與記憶體。
- 候選找到後可能被別人先核銷。最終操作要重新確認狀態並由後端原子地更新，這份 Map 不負責跨程序協調。

### Code Review 說法

> 目前每換一筆候選就重新掃描較早的紀錄；若批次到一萬筆，最差接近五千萬組比較。可以先用金額到最早 ID 的 Map，把查詢改為平均 `O(n)` 的單次走訪，並用多解測資確認選擇順序一致。若這裡也負責輸入契約，再先驗證整批 ID 與金額；成本是 `O(n)` 記憶體，是否值得要看批次規模與實測耗時。

### 變形題

1. 改成回傳所有配對時，為什麼每個金額只保存一個 ID 不夠？輸出最多有幾組？
2. 如果資料已排序，且只要任一組候選，何時可用雙指標節省索引空間？
3. 如果紀錄持續流入且 target 固定，要如何處理核銷、刪除、過期與記憶體上限？

### 一分鐘複習卡

| 項目 | 答案 |
| --- | --- |
| 怎麼想到 Map／dict？ | 一直找配對值，而且還要知道它的位置；只記有沒有不夠 |
| 暴力解 | 比較所有不同位置的配對 |
| 暴力瓶頸 | 每換一個值，又掃描候選資料 |
| 最佳化 | 算補數，用先前的數值查位置 |
| 每輪都要保持什麼？ | 查詢時只保存較早位置，不會配到自己；這就是 invariant |
| 時間 | 平均 `O(n)` |
| 空間 | 最差 `O(n)` |
| 常見錯誤 | 先存再查、漏掉 index 0、回傳數值而非位置 |
| Production | 先用 Map 改善查找，再依契約補驗證；多解時明確定義順序 |

---

## 相關連結

- [Contains Duplicate](/docs/algorithms/leetcode/f0201-0300/l0217-contain-duplicate)
- [第 1 週 Day 4：Python 與 System Design](/docs/career-blueprint/week-01-day-04)
