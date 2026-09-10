---
title: "[0121] Best Time to Buy and Sell Stock"
toc_max_heading_level: 2
description: "LeetCode 121 Best Time to Buy and Sell Stock 三階段筆記：獨立讀題、推導解法、TypeScript 與 Python 實作測試，以及工程應用與取捨。"
tags:
  - LeetCode
  - Easy
  - TypeScript
  - Python
  - Array
  - Interview
keywords: ["0121", "Best Time to Buy and Sell Stock", "TypeScript", "Python", "面試練習"]
---

# [0121] Best Time to Buy and Sell Stock

> [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) · 日曆安排：2026-10-05（W05）<br />
> 整理／官方題面核對：2026-09-08；實際練習日期與完成狀態由你填寫。

可以直接預習；若要測試獨立解題能力，先完成 Stage A，再展開提示與 Stage B。

## Stage A｜解題前：先獨立完成

### 1. 題目基本資料

| 項目 | 內容 |
| --- | --- |
| 題號／難度 | 121／Easy |
| 廣義分類 | Array |
| 官方題面 | [LeetCode：Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| 練習日期 | 自行填寫；日曆日期不代表已完成 |
| 建議限時 | 讀題與測資 10 分鐘、第一次計畫與實作 20 分鐘、分析測試 20 分鐘、複習 10 分鐘；工程延伸另讀 |

### 2. 白話題意

最多買一次、之後再賣一次，找可得到的最大價差。買入日一定在賣出日之前；沒有正收益就回傳 0。

### 3. Input / Output 契約

輸入每日價格陣列，輸出非負最大收益。不是回傳交易日期，也不是多次交易總收益；允許不交易。

本筆記兩種語言都不修改傳入資料。這是本頁實作的額外約定；題面未要求的防禦行為不當成官方保證。

#### TypeScript

```ts
function maxProfit(prices: number[]): number;
```

#### Python

```python
def max_profit(prices: list[int]) -> int: ...
```

### 4. 官方範例拆解

1. `[7,1,5,3,6,4] → 5`：先以 1 買，之後以 6 賣。不能先賣 7 再買 1。
2. `[7,6,4,3,1] → 0`：之後價格都更低，選擇不交易。

### 5. 限制條件

`1 <= n <= 10^5`；`0 <= prices[i] <= 10^4`。

先估算：用最大輸入規模代入你的比較次數，會做幾次工作？下列 Stage A 只記條件，解法方向留到後面。

### 6. 客觀關鍵字與線索

「先買後賣」「只做一筆」「最大差值」「無利可圖回傳 0」。

### 7. 面試確認問題

不必問能否多次交易，題目只允許一筆；未納入手續費、持有成本、滑價。實際產品若需要交易計算，這些都是額外契約。

### 8. 自訂測資與官方測資

先手算下表，不要直接執行程式確認答案。標為「自訂」的是本筆記另外設計。

| 類別／目的 | 輸入參數（依函式順序） | 預期 |
| --- | --- | --- |
| 官方 1 | `[[7, 1, 5, 3, 6, 4]]` | `5` |
| 官方 2 | `[[7, 6, 4, 3, 1]]` | `0` |
| 自訂：單日 | `[[5]]` | `0` |
| 自訂：遞增 | `[[1, 2, 3]]` | `2` |
| 自訂：相同 | `[[2, 2, 2]]` | `0` |
| 自訂：值域邊界 | `[[0, 10000]]` | `10000` |
| 自訂：最小值在最大值後 | `[[3, 8, 1, 2]]` | `5` |



### 9. 第一個直覺

如果今天固定當賣出日，所有過去價格中，哪個資訊決定今天可有的最佳收益？

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
function maxProfit(prices: number[]): number {
  throw new Error("先完成自己的版本");
}
```

#### Python

```python
def max_profit(prices: list[int]) -> int:
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

固定今天賣出，最好的買入價應在哪段資料中找？

</details>

<details>
<summary>提示二：解法方向</summary>

逐日保留過去最低價格，不用每次重掃前綴。

</details>

<details>
<summary>提示三：接近解法</summary>

先用今天價格減先前最低更新答案，再更新最低價；O(n) 時間、O(1) 空間。

</details>

## Stage B｜解題分析：完成第一次實作後再看

### 1. 看到這題，怎麼想到要用前綴最小值？

不想每一天賣出都把之前所有買入日重算一遍。今天價格 6，只需知道「今天之前最低是多少」，若是 1，今天最佳收益就是 5。把過去整段壓成一個最小值即可，Map 保存所有日期多存了不需要的資訊。全域最大減全域最小也不行，`[3,8,1,2]` 的 8 出現在 1 前面，不能倒著交易。

**下次可以怎麼想：** 若固定現在的決策後，過去只需要一個最值，就邊走邊保留該摘要，別重掃完整歷史。

### 2. 暴力解／最直接的正確解

列舉買入 i、賣出 j，要求 i&lt;j，記錄正價差的最大值。

#### TypeScript

```ts
function maxProfitBrute(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++) for (let j = i + 1; j < prices.length; j++) {
    best = Math.max(best, prices[j] - prices[i]);
  }
  return best;
}
```

#### Python

```python
def max_profit_brute(prices: list[int]) -> int:
    best = 0
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best
```

### 3. 暴力解的瓶頸

每個賣出日都重查所有先前買入日，最差 O(n²)。對固定賣價來說，更高的買價不會比更低的買價更好。

### 4. 從瓶頸推導資料結構／演算法

從第二天開始，先前最低價初始化為第一天。每輪先評估今天賣出的收益，再把今天價格納入未來可用的最低價。

### 5. 為什麼是這個資料結構／方法

min、max 與減法 O(1)，只保存 minBefore 和 best。這是單次掃描的前綴摘要，雖課表分類在 Sliding Window，不需硬套一個 shrink 迴圈。

### 6. 最佳解法步驟

1. minBefore=prices[0]、best=0。
2. 從索引 1 開始，用當天價−minBefore 更新 best。
3. 再更新 minBefore。
4. 回傳 best。

### 7. 核心不變量：每輪都要保持什麼

處理第 i 天之前，minBefore 是索引 0 到 i−1 的最低價，best 是賣出日在 i 之前的最佳非負收益。先更新收益再更新最低值，使買日嚴格早於賣日。

### 8. 手動演算

| 今天價 | 先前最低 | 今天候選收益 | best | 更新後最低 |
| --- | --- | --- | --- | --- |
| 1 | 7 | -6 | 0 | 1 |
| 5 | 1 | 4 | 4 | 1 |
| 3 | 1 | 2 | 4 | 1 |
| 6 | 1 | 5 | 5 | 1 |
| 4 | 1 | 3 | 5 | 1 |

### 9. 完整實作

以下函式可直接拿來做本機練習。提交 LeetCode 時，依編輯器模板保留要求的函式名稱；Python 可放進 `class Solution` 並加上 `self`，其餘演算法相同。

#### TypeScript

```ts
function maxProfit(prices: number[]): number {
  let minBefore = prices[0], best = 0;
  for (let i = 1; i < prices.length; i++) {
    best = Math.max(best, prices[i] - minBefore);
    minBefore = Math.min(minBefore, prices[i]);
  }
  return best;
}
```

#### Python

```python
def max_profit(prices: list[int]) -> int:
    min_before, best = prices[0], 0
    for i in range(1, len(prices)):
        best = max(best, prices[i] - min_before)
        min_before = min(min_before, prices[i])
    return best
```

### 10. 複雜度分析

一趟 n−1 輪，每輪 O(1)，時間 O(n)，額外空間 O(1)。Python 若寫 prices[1:] 會額外複製 O(n)，本頁用索引遍歷避免這個隱藏成本。

### 11. 邊界條件與常見錯誤

直接 max−min 忽略時間順序；把每段上升都加總變成多次交易；best 初始為負值；只記最新低價忘記之前已達成的最大收益。

### 12. 為什麼不用其他方法

左右兩索引追蹤買賣也可以 O(n)，但本題只要數值，minBefore 更直接。多次交易、有冷卻期或持倉限制時，需新狀態，不能直接重用單筆公式。

### 13. 可執行測試

把本頁 Stage B 的暴力解、完整實作及下列同語言測試依序放進 `solution.ts`／`solution.py`；不要混入 Stage A 的空白模板。TypeScript 使用已有的 `tsx` 執行器執行 `tsx solution.ts`，或先用 TypeScript 編譯器以 ES2020 編譯再執行；Python 使用 `python3 solution.py`。

測試同時驗證兩種解法、所有官方範例、自訂邊界與輸入不被修改。順序不限的輸出會先正規化；仍會保留重複項，以免錯誤結果被去重後掩蓋。

#### TypeScript

```ts
const cases: { args: [number[]]; expected: number }[] = [
  {"args": [[7, 1, 5, 3, 6, 4]], "expected": 5},
  {"args": [[7, 6, 4, 3, 1]], "expected": 0},
  {"args": [[5]], "expected": 0},
  {"args": [[1, 2, 3]], "expected": 2},
  {"args": [[2, 2, 2]], "expected": 0},
  {"args": [[0, 10000]], "expected": 10000},
  {"args": [[3, 8, 1, 2]], "expected": 5}
];
const normalize = (value: unknown): string => JSON.stringify(value);
for (const solve of [maxProfitBrute, maxProfit]) {
  for (const { args, expected } of cases) {
    const before = JSON.stringify(args);
    const actual = solve(...args);
    if (normalize(actual) !== normalize(expected)) {
      throw new Error(JSON.stringify({ args, expected, actual }));
    }
    if (JSON.stringify(args) !== before) throw new Error('輸入被修改');
  }
}
console.log('121: both implementations passed ' + cases.length + ' cases');
```

#### Python

```python
import copy
import json

cases = json.loads(r'''[{"args": [[7, 1, 5, 3, 6, 4]], "expected": 5}, {"args": [[7, 6, 4, 3, 1]], "expected": 0}, {"args": [[5]], "expected": 0}, {"args": [[1, 2, 3]], "expected": 2}, {"args": [[2, 2, 2]], "expected": 0}, {"args": [[0, 10000]], "expected": 10000}, {"args": [[3, 8, 1, 2]], "expected": 5}]''')

def normalize(value):
    return value
for solve in (max_profit_brute, max_profit):
    for case in cases:
        args = copy.deepcopy(case['args'])
        before = copy.deepcopy(args)
        actual = solve(*args)
        assert normalize(actual) == normalize(case['expected']), (args, actual, case['expected'])
        assert args == before, '輸入被修改'
print('121: both implementations passed', len(cases), 'cases')
```

## Stage C｜解題後：帶回真實工作

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

不要每次新資料來都重掃所有歷史：過去只對未來提供「最低點」時，一個變數足夠。例如監控值 `[3,8,1,2]` 最大先低後高幅度是 5，雖後面出現更低的 1，也不能抹掉前面的 5。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

監控報表計算時間序列最大向上變化：股價 → 延遲或資源使用量樣本，價差 → 後來數值減先前低點。這是歷史摘要，不是異常預測，也不是用未来價格提供交易建議。若資料亂序，要先按時間驗證或整理。

### 3. 工程遷移情境

依時間排序的單一指標快照；輸出最大向上差，少於兩點視為 0；限定有界整數樣本，避免 NaN 與無限值污染摘要。

### 4. 常見直覺寫法

```ts
type Sample = { at: number; value: number };
function validateSamples(samples: readonly Sample[]): void {
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    if (!Number.isSafeInteger(s.at) || !Number.isInteger(s.value) || Math.abs(s.value) > 1e9
      || (i > 0 && samples[i - 1].at >= s.at)) throw new Error('invalid chronological samples');
  }
}
function largestRiseBefore(samples: readonly Sample[]): number {
  validateSamples(samples);
  let best = 0;
  for (let i = 0; i < samples.length; i++) for (let j = i + 1; j < samples.length; j++) {
    best = Math.max(best, samples[j].value - samples[i].value);
  }
  return best;
}
```

### 5. 潛在問題與觸發門檻

十萬個監控樣本的兩兩配對接近五十億次，線性掃描只需十萬量級。若報表只有幾十點，先以易讀實作與清楚單位為主。

### 6. 套用本題技巧

保持先後順序，從「買入最低價」轉為「先前最低指標值」；不改成全域 max−min，才能反映之後相對之前的上升。

### 7. Production 風格優化

工程例子以 TypeScript 展示資料契約；演算法本身的雙語版本與測試見 Stage B。

```ts
function largestRise(samples: readonly Sample[]): number {
  validateSamples(samples);
  if (samples.length < 2) return 0;
  let minimum = samples[0].value, best = 0;
  for (let i = 1; i < samples.length; i++) {
    best = Math.max(best, samples[i].value - minimum);
    minimum = Math.min(minimum, samples[i].value);
  }
  return best;
}
```

### 8. 優化前後比較

O(n²) 改 O(n)，兩版 O(1) 額外空間；輸入驗證也 O(n)。新版不生成樣本值副本，直接讀 readonly 記錄。

### 9. 使用界線與代價

只適用不刪舊資料的整段摘要。若分析最近五分鐘，最低值過期後要移除，需支援窗口最小值的結構；亂序或更正過去樣本也可能要重算。

### 10. Code Review 說法

> 這個指標只需知道每個時間之前的最低值，可單次掃描省去兩兩比較；請保留時間嚴格遞增與樣本範圍驗證，並另處理窗口過期需求。

### 11. 變形題

1. 回傳達成最大價差的兩天，同值時如何選？
2. 要最大下降幅度，應保存過去什麼摘要？
3. 只允许持有最多 k 天，為何單一全歷史最小值不夠？

### 12. 一分鐘複習卡

| 問題 | 回想要點 |
| --- | --- |
| 怎麼想到這個資料結構／方法？ | 若固定現在的決策後，過去只需要一個最值，就邊走邊保留該摘要，別重掃完整歷史。 |
| 最直接的解法與瓶頸 | 列舉先買後賣，O(n²)。 |
| 最佳化方法 | 前綴最小值 |
| 每輪都要保持什麼（invariant） | minBefore 只含今天之前；best 保留歷史最好。 |
| 時間／空間 | O(n) 時間，O(1) 空間。 |
| 常見錯誤 | 全域 max−min；變成多筆交易。 |
| 工作用途與限制 | 歷史指標最大上升；過期窗口需新結構。 |

完成後回填：實際練習日期＿＿；TypeScript／Python 測試＿＿；能否閉卷解釋＿＿；下次要重寫的部分＿＿。

[回到一個月預習索引](/docs/career-blueprint/leetcode-month-01)
