---
title: "[0347] Top K Frequent Elements"
sidebar_label: "[0347] Top K Frequent Elements"
description: "LeetCode 347 Top K Frequent Elements 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Medium
  - Array
  - Interview
keywords: ["0347", "Top K Frequent Elements", "TypeScript", "Python", "面試練習"]
---

# [0347] Top K Frequent Elements

> 題單：[一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)<br />
> 官方題目：[LeetCode 347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)<br />
> 日曆安排：2026-09-15（W02）；實際練習日期與完成狀態由你填寫。

## Stage A｜解題前：先獨立完成（0–25 分鐘）

這一段先不提示最佳資料結構。請先計時、口述題意，再寫自己的版本。

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號 | 0347 |
| 題名 | Top K Frequent Elements |
| 難度 | Medium |
| 題目大類 | Array |
| 官方題目 | [LeetCode：Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| 本次整理日期 | 2026-09-15（原官方題面核對：2026-09-08） |
| 建議限時 | 第一次作答 20 分鐘，口述 3 分鐘；工程延伸另讀 |

### 2. 白話題意

你會拿到一個整數陣列 `nums` 和一個整數 `k`。請找出陣列中出現次數最多的 `k` 種數字，最後回傳這些數字本身，每種只出現一次。

題目保證答案集合唯一，答案順序不限。注意要比較的是「出現次數」，不是數字本身的大小。

### 3. Input / Output 契約

```ts
function topKFrequent(nums: number[], k: number): number[];
```

Python：

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]:
    ...
```

| 項目 | 契約 |
| --- | --- |
| `nums` | 非空整數陣列 |
| `k` | 要取的數字種類數，不超過相異數量 |
| 回傳值 | 長度為 `k` 的數字陣列，每種只出現一次 |
| 是否回傳 index | 否，題目要的是數值 |
| 排名依據 | 出現次數，由多到少選取 |
| 答案數量 | 官方保證答案集合唯一 |
| 回傳順序 | 任意順序皆可 |
| 是否修改輸入 | 本文實作不修改 `nums`，這是本頁的額外約定 |

### 4. 官方範例拆解

#### 範例一

```text
輸入：nums = [1, 1, 1, 2, 2, 3], k = 2
輸出：[1, 2]
```

`1` 出現三次、`2` 出現兩次、`3` 出現一次。最常出現的兩種數字是 `1` 和 `2`，因此回傳 `[1, 2]`；`[2, 1]` 也符合要求。

#### 範例二

```text
輸入：nums = [1], k = 1
輸出：[1]
```

只有一種數字，且要求取一種，因此直接得到 `[1]`。

#### 範例三

```text
輸入：nums = [1, 2, 1, 2, 1, 2, 3, 1, 3, 2], k = 2
輸出：[1, 2]
```

`1` 和 `2` 各出現四次，`3` 出現兩次。入選者可以有相同次數；只要前 `k` 種的集合唯一，就符合題目保證。

### 5. 限制條件

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `1 <= k <= nums 中的相異數量`
- 答案集合唯一。
- 官方追問：能否提出時間複雜度優於 `O(n log n)` 的演算法？

先不要想特定資料結構，先問自己：當陣列長度為 `10^5` 時，你的方案最多會做幾次工作？

### 6. 客觀關鍵字與線索

這些只是題目提供的客觀訊號，還不是解法：

- 「最常出現」
- 「`k` 種數字」
- 「回傳數值」
- 「答案順序不限」
- 「答案集合唯一」
- 輸入長度最多十萬
- 時間優於 `O(n log n)`

### 7. 面試確認問題

| 可以確認的問題 | 本題答案 |
| --- | --- |
| 要回傳數值還是 index？ | 數值 |
| 要取數值最大的 `k` 個嗎？ | 否，依出現次數選取 |
| 空輸入或 `k = 0` 需要處理嗎？ | 官方範圍不包含，不必重問 |
| `k` 可能超過相異數量嗎？ | 不會，官方已保證 |
| 入選者可以同次數嗎？ | 可以，但答案集合保證唯一 |
| 回傳順序重要嗎？ | 不重要 |
| 可以修改原陣列嗎？ | 題面未要求；本文選擇不修改 |

真實排行榜則需另外確認同分規則、統計時間區間與事件是否已去重。

### 8. 自訂測資

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

先在自己的筆記中回答，不必追求最佳解：

1. 最直接、一定正確的做法是什麼？
2. 怎麼判斷某個數字應該入選？
3. 怎麼保證回傳 `k` 種，而且不會重複？
4. 目前的方案會重複做哪些工作？

> 我的第一個想法：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿

### 10. 複雜度預估

在寫 code 前先估算：

- `n` 代表什麼？每輪會檢查多少資料？
- 最多執行幾輪，是否反覆處理相同內容？
- 當 `n = 10^5` 時，這個成本是否符合官方追問？
- 需要另外保存哪些資訊？最多保存幾筆？

> 我的預估：時間 `O(____)`，空間 `O(____)`。

### 11. 解題計畫

```txt
1. 我要按照什麼順序處理輸入：
2. 每一步如何判定／產生答案：
3. 何時停止，如何確認沒有漏解：
我認為最容易錯的測資與理由：
```

### 12. 第一次閉卷實作

完成後再填寫，保留自己的第一次作答。

#### TypeScript

```ts
function topKFrequentFirstAttempt(nums: number[], k: number): number[] {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def top_k_frequent_first_attempt(nums: list[int], k: int) -> list[int]:
    raise NotImplementedError("先完成自己的版本")
```

| 紀錄 | 內容 |
| --- | --- |
| 花費時間 | ＿＿＿＿ |
| 是否一次通過 | ＿＿＿＿ |
| 錯誤類型 | ＿＿＿＿ |
| 卡住的位置 | ＿＿＿＿ |
| 看到第幾層提示 | ＿＿＿＿ |

#### 分級提示

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

---

## Stage B｜解題分析：完成閉卷後再看（25–50 分鐘）

:::warning 先完成第一次作答

以下開始包含解法。若還沒自己嘗試，先停在 A 區。

:::

### 1. 看到這題，怎麼想到要用 Map／dict 計數與頻率桶？

**先抓住這個想法：** 先記住「每種數字有幾個」，再利用「次數只會介於 1 到 n」把數字放到對應的位置，就不用比較出完整名次。

可以照這個順序想：

1. **題目要我回答什麼？** 哪 `k` 種數字出現最多次。
2. **最直接怎麼做？** 算出每種數字的次數，再依次數排序，取前 `k` 種。
3. **哪件事可以省下來？** 排序會反覆比較候選者，但題目不要求排好每個名次。
4. **排名依據有什麼限制？** 次數是 1 到 `n` 的整數，可以直接當陣列位置。
5. **該記什麼？** Map／dict 保存「數字 → 次數」；桶陣列保存「次數 → 有這個次數的數字」。從高次數往下取即可。

拿 `[1, 1, 1, 2, 2, 3]` 想一次：先記下 `1 → 3`、`2 → 2`、`3 → 1`，再把 `1` 放進桶 3、`2` 放進桶 2、`3` 放進桶 1。要兩種就從高處取出 `1` 和 `2`。

**為什麼不用 Set？** Set 只保存有哪些數字，會丟失出現次數；只有計數表則還沒完成挑選，仍需要排序或其他選取方法。

**下次可以怎麼想：** 如果要按次數挑前幾名，而且次數的整數範圍不大，可以先計數，再考慮分桶；若排名依據是任意分數，就不能直接假設配置桶很便宜。

### 2. 暴力解

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

### 5. 為什麼是 Map／dict 與頻率桶

Map／dict 計數採平均 O(1) 存取；桶陣列索引 O(1)，每個相異值只放進一桶。配置 n+1 個桶花 O(n) 時間與空間，不是免費的。

### 6. 最佳解法步驟

1. 計算每種數字的次數。
2. 建立 n+1 個互相獨立的桶。
3. 次數 c 的數字放入 buckets[c]。
4. 從最高頻率掃下來，恰好收集 k 種就回傳。

### 7. 核心不變量

開始讀取頻率 c 的桶時，所有高於 c 的桶都已處理；答案內的每個值都比尚未處理者更頻繁或同頻，且不重複。

### 8. 手動演算

用下面這組自訂資料，照程式執行順序，一行一行看。刻意讓數字與次數不同，方便分清楚「桶的位置」與「桶裡的數字」。

```python
nums = [8, 8, 8, 5, 5, 9]
k = 2
```

目標是找出現次數最多的 **2 種數字**，答案是 `[8, 5]`。以下用 Python 語法解說；TypeScript 版本的計數、分桶與取答案步驟相同。

#### ① 定義函式：參數與回傳值

```python
def top_k_frequent(nums: list[int], k: int) -> list[int]:
```

- `def`：定義函式。
- `top_k_frequent`：函式名稱。
- `nums: list[int]`：參數 `nums` 預期是一個整數串列（list，可以先理解成陣列）。
- `k: int`：參數 `k` 預期是整數。
- `-> list[int]`：回傳值預期是整數串列。

這些型別標註是說明用途，不會自動轉換資料。先簡化成 `def top_k_frequent(nums, k):`，演算法仍然一樣。

Python 用 **縮排** 表示哪些程式屬於函式、迴圈或條件區塊，不用 `{}`。後面的程式片段會保留它們在函式內的縮排；可執行的完整版本見下一節。

#### ② 建立空的計數表

```python
    counts: dict[int, int] = {}
```

`dict` 是字典，可以用 key 查詢 value，類似 JavaScript 的 `Map`。這裡保存「數字 → 出現次數」。

`dict[int, int]` 表示 key 和 value 都是整數；`{}` 表示剛建立的字典是空的。

#### ③ 逐個數字計數

```python
    for x in nums:
        counts[x] = counts.get(x, 0) + 1
```

`for x in nums` 依序把每個數字拿出來，放進變數 `x`。這裡 `x` 依序是 `8 → 8 → 8 → 5 → 5 → 9`。

`counts.get(x, 0)` 表示「查詢 `x` 目前的次數；如果字典裡沒有 `x`，就先用 `0`」。接著加 `1`，再存回 `counts[x]`。

| 這次的 x | 查到的舊次數 | 加 1 後的 counts |
| --- | --- | --- |
| 8 | 沒有，使用 0 | `{8: 1}` |
| 8 | 1 | `{8: 2}` |
| 8 | 2 | `{8: 3}` |
| 5 | 沒有，使用 0 | `{8: 3, 5: 1}` |
| 5 | 1 | `{8: 3, 5: 2}` |
| 9 | 沒有，使用 0 | `{8: 3, 5: 2, 9: 1}` |

最後得到 `counts = {8: 3, 5: 2, 9: 1}`。

#### ④ 建立空桶

```python
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
```

這行比較濃縮，拆開看：

- `list[list[int]]`：外面是一個串列，裡面每一格也是整數串列。
- `len(nums)`：輸入長度，這裡是 `6`。
- `range(7)`：依序產生 `0、1、2、3、4、5、6`，共 7 次。
- `_`：一般用來表示「這個迴圈變數我用不到」。
- `[[] for _ in range(7)]`：串列生成式，每次建立一個新的空串列，共 7 個。

這個例子的建桶步驟相當於：

```python
buckets = []
for _ in range(7):
    buckets.append([])
```

得到：

```python
buckets = [[], [], [], [], [], [], []]
# 索引：    0   1   2   3   4   5   6
```

**索引代表出現次數。** 一個數字最多出現 `6` 次，所以需要能存取 `buckets[6]`。索引從 `0` 開始，因此建立 7 個桶；桶 `0` 這題不使用。

#### ⑤ 把數字放進對應的桶

```python
    for x, count in counts.items():
        buckets[count].append(x)
```

`counts.items()` 讓你逐組取得字典的 key 和 value；`x, count` 把這一組拆成兩個變數。

| 輪次 | x（數字） | count（次數） | 實際執行 |
| --- | --- | --- | --- |
| 第一輪 | 8 | 3 | `buckets[3].append(8)` |
| 第二輪 | 5 | 2 | `buckets[2].append(5)` |
| 第三輪 | 9 | 1 | `buckets[1].append(9)` |

`append(x)` 表示把 `x` 加到串列尾端，類似 JavaScript 的 `push(x)`。結果：

```python
buckets = [
    [],   # 索引 0：不用
    [9],  # 出現 1 次的數字
    [5],  # 出現 2 次的數字
    [8],  # 出現 3 次的數字
    [],   # 出現 4 次的數字
    [],   # 出現 5 次的數字
    [],   # 出現 6 次的數字
]
```

**數字 `8` 放進桶 `3`，因為它出現 3 次。** 同一個桶可以放多種數字，只要它們出現的次數相同。

#### ⑥ 建立答案串列

```python
    result: list[int] = []
```

先準備一個空串列，等等放入選出的數字。此時 `result = []`。

#### ⑦ 從次數最多的桶往下找

```python
    for count in range(len(nums), 0, -1):
        for x in buckets[count]:
```

`range(起點, 終點, 每次變化量)` 不包含終點。這裡是 `range(6, 0, -1)`，所以 `count` 依序是 `6 → 5 → 4 → 3 → 2 → 1`。

內層 `for x in buckets[count]` 把目前這個桶裡的數字逐個取出。**桶是空的，內層就不執行。**

| count | 目前的桶 | 執行結果 |
| --- | --- | --- |
| 6 | `[]` | 沒有數字，繼續 |
| 5 | `[]` | 沒有數字，繼續 |
| 4 | `[]` | 沒有數字，繼續 |
| 3 | `[8]` | 取出 `x = 8` |
| 2 | `[5]` | 取出 `x = 5`，在下一步收滿後回傳 |

#### ⑧ 放入答案，收滿就結束

```python
            result.append(x)
            if len(result) == k:
                return result
```

- `result.append(x)`：把剛取出的數字加到答案尾端。
- `len(result)`：目前收集幾種數字。
- `== k`：是否已經收到要求的數量。
- `return result`：回傳答案，結束整個函式，不只是離開內層迴圈。

```text
取出 8：
result = [8]
長度 1，不等於 k = 2，繼續。

取出 5：
result = [8, 5]
長度 2，等於 k = 2，回傳 [8, 5]。
```

桶 `1` 裡面的 `9` 就不必再看了。

#### ⑨ 最後一行 return

```python
    return result
```

這行縮排回到函式的第一層，位於迴圈外。如果所有迴圈結束還沒提前回傳，就回傳目前結果。本題保證 `k` 合法，所以正常情況會在前面的 `if` 裡回傳。

#### 整個流程回顧

```text
原始資料：[8, 8, 8, 5, 5, 9]
        ↓ 計數
數字 → 次數：{8: 3, 5: 2, 9: 1}
        ↓ 依次數分桶
桶 1：[9]
桶 2：[5]
桶 3：[8]
        ↓ 從高頻率取 2 種
答案：[8, 5]
```

記成三個步驟：**先數次數 → 按次數分組 → 從高次數往下取。**

#### 為什麼這麼多 for，時間仍然是 O(n)？

重點是每個迴圈總共處理多少資料。令 `n` 是輸入長度，`u` 是相異數量：

| 步驟 | 工作量 |
| --- | --- |
| 計數 | 掃過 `n` 個數字，平均 `O(n)` |
| 建立桶 | 建立 `n + 1` 個空桶，`O(n)` |
| 分桶 | 每種數字放一次，`O(u)` |
| 取答案 | 最多檢查 `n` 個桶，內層累計取出 `k` 個數字，`O(n + k)` |

最後的巢狀迴圈不是每個桶都有 `n` 個數字。所有桶加起來只有 `u` 個相異數字，而且取滿 `k` 個就回傳。由於 `k <= u <= n`，總平均時間是 `O(n)`。

連續掃幾遍的成本相加；若每處理一個元素又完整掃一遍，才會出現相乘的成本。桶排序省掉的是排序時的反覆比較。

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

### 13. 測試

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

面試口述模板：

> 我先用 Map／dict 計算每種數字的次數。基準解會排序所有種類，平均時間是 `O(n + u log u)`，其中 `u` 是相異數量。因為次數只介於 1 到 `n`，可以改放到對應的桶，再從高次數往下收集 `k` 種。每輪取出的值不會比尚未處理的值更少見。平均時間 `O(n)`、輔助空間 `O(n)`，且不修改輸入。

---

## Stage C｜解題後：遷移到 Production（50–60 分鐘）

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** 不想為了前幾名，反覆重數每個項目或排出全部名次。例如一萬個點擊事件只要前三個商品：先數各商品，再挑候選。Map 保存次數；桶負責利用次數的整數範圍挑選，代價是與批次大小相關的記憶體。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：後台顯示最常見的錯誤碼

- **原本麻煩在哪？** 每個錯誤碼都用 `filter` 掃描整批事件，錯誤種類越多，重複掃描越多。
- **怎麼套用這題？** 把「數字 → 次數」換成「錯誤碼 → 錯誤量」，一次累計後再挑前 `k` 種。
- **做到哪裡就不夠？** 跨服務報表仍需定義事件去重、時間區間與彙整方式，單機 Map 不會自動得到全站排名。

#### 情境 B：分析一批商品點擊事件

- **原本麻煩在哪？** 想顯示熱門商品，卻對每個商品重新計算點擊量。
- **怎麼套用這題？** 商品 ID 對應本題的數字，點擊次數對應頻率；先數一次，再按需求選取熱門商品。
- **做到哪裡就不夠？** 點擊量不等於不重複訪客數；要排除重複上報或計算不同訪客，必須先定義事件與使用者識別規則。

### 工程遷移情境：錯誤碼排行榜

一份已去重、同一時間區間的錯誤快照；同次數依 code 字典序排序，保留可重現報表。

### 常見直覺寫法

```ts
function topErrorsBefore(codes: readonly string[], k: number): string[] {
  if (!Number.isInteger(k) || k < 0) throw new Error('invalid k');
  return [...new Set(codes)].map(code => ({ code, count: codes.filter(x => x === code).length }))
    .sort((a, b) => b.count - a.count || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0))
    .slice(0, k).map(x => x.code);
}
```

### 潛在問題與觸發門檻

n 個事件、u 種 code 時，原版計數 O(nu)。例如十萬事件、一千種 code，約一億次相等比較。正式環境先量測，不把此估算說成延遲。

### 套用本題技巧

本題最有用的第一步是一次計數；報表為了固定同分次序且 u 遠小於 n，保留排序，沒有強制套用大桶。

### Production 風格優化

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

### 優化前後比較

| 面向 | 每種錯誤碼重新掃描 | 一次 Map 計數 |
| --- | --- | --- |
| 時間 | `O(nu + u log u)` | 平均 `O(n + u log u)` |
| 額外空間 | `O(n + u)`，包含 `filter` 暫存結果 | `O(u)`，保存計數及排序資料 |
| 同次數順序 | 依 code 字典序 | 相同 |
| 輸入修改 | 不修改 | 不修改 |
| `k` 超過種類數 | 回傳全部種類 | 相同 |

其中 `n` 是事件數，`u` 是錯誤碼種類數。這裡改善的是重複計數，排序仍保留以符合報表契約。

### 使用界線與代價

少量 code 的單次報表用排序很合理；要每秒更新、移除過期資料或查歷史區間，需要維護窗口或資料庫聚合。k 大於種類數時，工程版本回傳全部；與官方保證分開。

### Code Review 說法

> 這裡每個錯誤碼都 filter 整批事件，建議先累計一次 Map，保留原本同次數排序規則；事件去重與時間區間仍由上游契約負責。

### 變形題

1. 第 k 名同次數時要全收，輸出契約如何改？
2. 只剩有限記憶體、事件無限流入時，精確排名需要保存什麼？
3. 每分鐘移除過期事件，要如何扣回次數？

### 一分鐘複習卡

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

---

## 相關連結

- [Two Sum](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)
- [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
