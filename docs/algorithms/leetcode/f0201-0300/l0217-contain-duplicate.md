---
title: "[0217] Contains Duplicate"
description: "LeetCode 217 Contains Duplicate 三階段練習筆記：先獨立讀題與實作，再從暴力瓶頸推導最佳化方法，最後遷移到即時事件去重。"
tags:
  - LeetCode
  - Easy
  - TypeScript
  - Python
  - Interview
  - Array
keywords: ["0217", "Contains Duplicate", "LeetCode", "TypeScript", "Python", "Edge Cases", "Big-O", "面試口述"]
---

# [0217] Contains Duplicate

> 題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)  
> 官方題目：[LeetCode 217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)  
> 今日完整日課：[第 1 週 Day 1：React 與 System Design](/docs/career-blueprint/week-01-day-01)

## Stage A｜解題前：先獨立完成（0–25 分鐘）

這一段刻意不提示最佳資料結構。先計時、口述，再寫程式。

### 1. 題目基本資料

| 欄位 | 內容 |
| --- | --- |
| 題號 | 217 |
| 題名 | Contains Duplicate |
| 難度 | Easy |
| 官方分類 | Array |
| 練習日期 | 2026-09-05 |
| 建議 timebox | 讀題 5 分鐘＋推導 10 分鐘＋實作 10 分鐘 |

### 2. 白話題意

給定一個整數陣列 `nums`：

- 只要有任何一個值出現至少兩次，回傳 `true`。
- 如果所有值都只出現一次，回傳 `false`。

題目只問「是否存在」，不要求回傳重複的是哪個值、出現次數或索引。

### 3. Input / Output 契約

TypeScript：

```ts
function containsDuplicate(nums: number[]): boolean;
```

Python：

```python
from typing import List


class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        ...
```

- 輸入是整數陣列。
- 輸出只有布林值。
- 不要求保留或回傳原始順序。
- 題目沒有要求修改輸入；實作時應避免不必要地改動 `nums`。
- 只要找到一組重複值就可以提早結束。

### 4. 官方範例拆解

```txt
輸入：[1, 2, 3, 1]
輸出：true
原因：值 1 在索引 0 與 3 出現。
```

```txt
輸入：[1, 2, 3, 4]
輸出：false
原因：每一個值都不同。
```

```txt
輸入：[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
輸出：true
原因：不只一個值重複；題目仍只需回傳 true。
```

### 5. 限制條件

- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

先回答：

1. 當 `n = 100,000`，約 `n²` 次比較是否合理？
2. 題目是否允許只掃過陣列一次？
3. 值的範圍遠大於陣列長度，若用值直接當作連續陣列索引，記憶體會如何？

### 6. 客觀關鍵字與線索

先只圈客觀資訊，不急著把單一關鍵字背成固定解法：

- 「any value」：只要任一個值符合即可。
- 「appears at least twice」：需要辨認某值是否曾出現。
- 「every element is distinct」：要判斷是否全部唯一。
- `nums.length <= 10^5`：解法要能承受十萬筆輸入。
- 回傳 `boolean`：找到反例後可以 early return。

### 7. 面試確認問題

可以問：

- 我可以使用額外記憶體嗎？
- 是否要求不能修改輸入陣列？
- 要回傳布林值，還是也要回傳重複值或索引？

由題面已知，不必重複問：

- 輸入元素是整數。
- 輸入至少有一個元素。
- 負數是合法輸入。

如果面試官要求 `O(1)` 額外空間，才需要重新討論排序與是否可修改輸入。

### 8. 自訂測資

先寫預期答案，再執行程式：

| 類型 | 輸入 | 預期 | 要驗證什麼 |
| --- | --- | --- | --- |
| 最小輸入 | `[7]` | `false` | 一個元素不可能重複 |
| 一般重複 | `[1, 2, 3, 1]` | `true` | 重複值相隔多個位置 |
| 全部不同 | `[1, 2, 3, 4]` | `false` | 完整走訪後才知道答案 |
| 相鄰重複 | `[5, 5]` | `true` | 最早能提早結束 |
| 負數 | `[-1, -2, -1]` | `true` | 不錯把值當非負索引 |
| 零與負數 | `[0, -1, 1]` | `false` | 值域不影響相等判斷 |
| 多組重複 | `[2, 2, 3, 3]` | `true` | 不必計算完整頻率 |
| 壓力方向 | 長度 `100,000` 且全相異 | `false` | 最差情況仍需走完整個陣列 |

> 官方 constraints 不接受空陣列，所以 `[]` 不屬於本題必要測資。若把函式當一般 production utility，才另外定義空陣列應回傳 `false`。

### 9. 第一個直覺

不要捏造一個「做過的答案」。實際寫下今天第一個想法：

```txt
我的第一個直覺：


為什麼它一定正確：


我需要重複做的操作：

```

### 10. 複雜度預估

在寫 code 前先填：

```txt
假設陣列長度是 n：
預估時間：O(          )
預估額外空間：O(          )
在 n = 100,000 時是否可接受：
```

### 11. 解題計畫

先用三句話或 pseudocode 寫計畫，不要直接衝 code：

```txt
1.
2.
3.
```

### 12. 第一次閉卷實作

TypeScript：

```ts
function containsDuplicate(nums: number[]): boolean {
  // 先自己完成
}
```

Python：

```python
from typing import List


class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        # 先自己完成
        pass
```

紀錄：

| 欄位 | 回填 |
| --- | --- |
| 實作耗時 | ＿＿分鐘 |
| 是否一次通過 | 是／否 |
| 錯誤類型 | 讀題／邏輯／語法／edge case／Big-O |
| 最卡的位置 | ＿＿＿＿＿＿＿＿ |

<details>
<summary>提示一：需求層級</summary>

處理目前的數字時，你真正需要知道的是它的完整出現次數，還是只需要知道「之前是否見過」？

</details>

<details>
<summary>提示二：資料結構方向</summary>

哪一種資料結構可以保存「已看過的值」，並支援快速的 membership check？

</details>

<details>
<summary>提示三：複雜度目標</summary>

嘗試只走訪一次輸入。對每個值先查詢，再決定是否加入；目標是平均 `O(n)` 時間。

</details>

---

## Stage B｜解題分析：完成閉卷後再看（25–50 分鐘）

### 1. 看到這題，怎麼想到要用 Set？

**先抓住這個想法：** 我只要知道「這個數字前面看過沒」，不需要知道它出現幾次，所以可以用 `Set` 記住看過的數字。

可以照這個順序想：

1. **題目要我回答什麼？** 有沒有任何一個數字出現第二次。
2. **最直接怎麼做？** 把數字兩兩比較，找到相同的就回傳 `true`。這樣能解，但資料多時要比很多次。
3. **能不能記住前面看過什麼？** 可以。一邊往後讀，一邊記錄；讀到新數字時，就問「紀錄裡有它嗎？」
4. **用陣列記可以嗎？** 可以，但每次用 `includes` 查，還是可能要從頭找到底。只是把雙層比較換了寫法，沒有解決一直找的問題。
5. **哪個資料結構適合一直查「有沒有」？** `Set`。它能記住值，也能快速查某個值是否在裡面；一般雜湊實作下，查詢和加入平均都是 `O(1)`。

拿 `[1, 2, 3, 1]` 想一次：先記下 `1`、`2`、`3`，讀到最後的 `1` 時，紀錄裡已經有 `1`，所以答案是 `true`。

**為什麼不用 Map 記次數？** 也能解，但這題在第二次看到時就能結束，不必繼續數到第三次、第四次。`Set` 保存的資訊就夠了。

下次遇到類似題目，可以先問自己：

> 我是不是一直在問「這個東西看過沒」？如果只要知道有沒有，而且能用額外記憶體保存紀錄，就可以考慮 Set。若還要記「幾次」或「在哪個位置」，再考慮 Map。

這裡的 Pattern，就是「邊讀、邊記住看過的值、邊查重」這套做法；不必把「重複」兩個字背成固定答案。

### 2. 暴力解

把每一對不同索引拿來比較：

```ts
function containsDuplicateBruteForce(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] === nums[j]) {
        return true;
      }
    }
  }

  return false;
}
```

對應的 Python 暴力解：

```python
def contains_duplicate_brute_force(nums: list[int]) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True

    return False
```

- 正確性：所有索引對都會被檢查；任何重複值形成的索引對都不會漏掉。
- 時間：最差比較約 `n(n - 1) / 2` 次，因此是 `O(n²)`。
- 額外空間：只使用迴圈變數，因此是 `O(1)`。

> 常見誤記：雙層迴圈的暴力解不是 `O(n log n)`；`O(n log n)` 通常是排序解的時間。

### 3. 暴力解的瓶頸

上面的雙層迴圈會把每個數字和後面的數字逐一比較。假如全部都不同，第一個要比 `n - 1` 次，第二個要比 `n - 2` 次，一直比到最後，總共是 `n(n - 1) / 2` 次。

慢的地方是：為了確認有沒有重複，不斷把數字拿來互相比。換成「記住前面看過的值」後，每次只需要回答：

> 這個值之前出現過嗎？

接下來要找的資料結構，就得讓這個問題可以快速查到答案。

### 4. 從瓶頸推導資料結構

建立一個集合保存已看過的值；TypeScript 使用 `Set<number>`，Python 使用 `set[int]`：

- 若 `seen.has(value)` 是 `true`，代表目前值至少第二次出現，立即回傳 `true`。
- 否則把值加入 `seen`，繼續處理下一個元素。
- 走完整個陣列仍沒找到，回傳 `false`。

TypeScript `Set` 的 `has`／`add`，以及 Python `set` 的 `in`／`add`，在一般雜湊實作下平均是 `O(1)`，因此只需一輪走訪。

### 5. 為什麼是 Set，而不是 Map

本題只需要保存「是否存在」，不需要保存次數或索引：

| 結構 | 能提供什麼 | 本題評估 |
| --- | --- | --- |
| `Set<number>` | 值是否存在 | 語意最直接 |
| `Map<number, number>` | 值對應次數或索引 | 可以解，但保存了題目不需要的資訊 |
| 普通陣列 | `includes` 查詢「有沒有出現過」 | 每次最差 `O(n)`，沒有消除瓶頸 |
| Boolean 陣列 | 值直接映射索引 | 值域含負數且跨度可到 `2 × 10^9`，不適合 |

### 6. 最佳解法步驟

1. 建立空的 `seen`。
2. 由左到右讀取每一個 `value`。
3. 若 `seen` 已包含 `value`，回傳 `true`。
4. 否則把 `value` 加入 `seen`。
5. 迴圈結束後回傳 `false`。

### 7. 核心不變量

在每次迴圈開始、準備處理 `nums[i]` 時：

> `seen` 恰好包含 `nums[0...i-1]` 中出現過的所有不同值，而且到目前為止尚未發現重複。

因此：

- `seen.has(nums[i])` 為真，證明目前值和某個較早位置相同。
- `seen.has(nums[i])` 為假，加入後仍維持不變量。

### 8. 手動演算

以 `[3, 1, 4, 1]` 為例：

| `i` | 目前值 | 處理前 `seen` | 已看過？ | 動作 |
| ---: | ---: | --- | --- | --- |
| 0 | 3 | `{}` | 否 | 加入 3 |
| 1 | 1 | `{3}` | 否 | 加入 1 |
| 2 | 4 | `{3, 1}` | 否 | 加入 4 |
| 3 | 1 | `{3, 1, 4}` | 是 | 回傳 `true` |

找到第二個 `1` 後不必繼續統計。

### 9. 完整實作

#### TypeScript

```ts
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();

  for (const value of nums) {
    if (seen.has(value)) {
      return true;
    }

    seen.add(value);
  }

  return false;
}
```

也可以用長度差寫成：

```ts
function containsDuplicateBySize(nums: number[]): boolean {
  return new Set(nums).size !== nums.length;
}
```

長度差版本很精簡，但面試時逐步走訪版本更容易說明 invariant、early return 與線上資料處理。

#### Python

```python
from typing import List


class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()

        for value in nums:
            if value in seen:
                return True

            seen.add(value)

        return False
```

Python 也可以用集合長度差寫成：

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        return len(set(nums)) != len(nums)
```

和 TypeScript 相同，逐步走訪版本能 early return，也更適合在面試中解釋目前已見集合的 invariant。

### 10. 複雜度分析

設 `n = nums.length`：

- **時間：平均 `O(n)`**。最多走訪 `n` 個元素；TypeScript 的 `Set.has`／`Set.add` 與 Python 的 `value in seen`／`seen.add` 平均為 `O(1)`。
- **額外空間：最差 `O(n)`**。所有值都不相同時，`seen` 會保存 `n` 個值。
- **Early return** 只改善部分輸入的實際執行時間，不改變最差 Big-O。
- 雜湊結構的理論最差情況取決於實作，不應把平均 `O(1)` 描述成所有情況下的絕對保證。

### 11. Edge cases 與常見錯誤

- 把雙層迴圈誤寫成 `O(n log n)`；正確是 `O(n²)`。
- 先 `add` 再 `has`，會讓每個值都被判定為已存在。
- 為長度 0 或 1 寫必要性不高的特判；一般 utility 可接受，但官方輸入保證至少一個元素。
- 使用 `sort()` 卻忘記 JavaScript 預設按字串排序；數字要傳 `(a, b) => a - b`。
- 使用 `sort()` 直接改動原陣列，卻沒有先和面試官確認 mutation 是否可接受。
- 使用 `Array.includes` 保存已見值；雖然邏輯正確，查詢「有沒有出現過」 仍是線性。
- Python 使用 `value in seen_values`，但 `seen_values` 實際上是 `list`；list membership 最差仍是 `O(n)`，要確認容器真的是 `set`。
- Python 函式只有型別與註解卻沒有內容時，必須保留 `pass` 或 `...`，否則不是合法語法。
- 寫完只測正數，漏掉負數、單元素、全部相異與相鄰重複。

### 12. 為什麼不用其他方法

| 方法 | 時間 | 額外空間 | 什麼條件下可考慮 |
| --- | --- | --- | --- |
| 雙層比較 | `O(n²)` | `O(1)` | 輸入極小、只求最簡單正確版本 |
| 排序後比較相鄰 | `O(n log n)` | 視排序實作而定 | 記憶體受限，且允許修改輸入；若不允許則先複製陣列 |
| Set 線性掃描 | 平均 `O(n)` | `O(n)` | 本題預設條件下最清楚的選擇 |
| 計數陣列／bitset | 可能 `O(n + R)` | `O(R)` | 值域 `R` 很小、連續且已知時 |

### 13. 測試

#### TypeScript

```ts
const cases: Array<{ nums: number[]; expected: boolean }> = [
  { nums: [7], expected: false },
  { nums: [1, 2, 3, 1], expected: true },
  { nums: [1, 2, 3, 4], expected: false },
  { nums: [5, 5], expected: true },
  { nums: [-1, -2, -1], expected: true },
  { nums: [0, -1, 1], expected: false },
  { nums: [2, 2, 3, 3], expected: true },
];

for (const { nums, expected } of cases) {
  const actual = containsDuplicate(nums);
  console.assert(
    actual === expected,
    `${JSON.stringify(nums)}: expected ${expected}, received ${actual}`,
  );
}
```

#### Python

```python
def test_contains_duplicate() -> None:
    cases: list[tuple[list[int], bool]] = [
        ([7], False),
        ([1, 2, 3, 1], True),
        ([1, 2, 3, 4], False),
        ([5, 5], True),
        ([-1, -2, -1], True),
        ([2, 2, 3, 3], True),
    ]

    solution = Solution()

    for nums, expected in cases:
        actual = solution.containsDuplicate(nums)
        assert actual is expected, (
            f"{nums}: expected {expected}, received {actual}"
        )


test_contains_duplicate()
```

面試口述模板：

> 暴力解會比較所有索引對，時間是 `O(n²)`。瓶頸是每遇到一個值都重新線性搜尋它是否出現過。我用 Set 保存已見值，讓 查詢「有沒有出現過」 平均降為 `O(1)`；陣列只走一次，所以平均時間 `O(n)`、最差額外空間 `O(n)`。每輪開始時，Set 包含目前索引以前的所有不同值，因此一旦目前值已在 Set 中，就能正確回傳 `true`。

---

## Stage C｜解題後：遷移到 Production（50–60 分鐘）

### 1. 【這個資料結構／演算法是為了解決什麼問題？】

**回答：** `Set` 很適合處理「我一直要確認某個東西有沒有出現過，但不想每次都把整份清單找一遍」。

例如已經看過一萬個數字，現在又來一個。用陣列查，可能要從第一個找到第一萬個；用 `Set` 記住那些數字，就能直接查它在不在裡面。

用複雜度來說：陣列找一次最差是 `O(n)`，Set 查一次平均是 `O(1)`。處理整批資料，就能從最差 `O(n²)` 改成平均 `O(n)`。

**代價是要多留一份紀錄。** 最多需要 `O(n)` 額外記憶體。Set 只記「有沒有」，不記「有幾個」；要統計次數時用 Map／dict。資料如果一直進來，也要想好什麼時候刪掉舊紀錄。

### 2. 【現實工作中哪裡會遇到？可以用這個題型去改善什麼？】

#### 情境 A：前端 WebSocket 收到重複事件

聊天室斷線重連後，可能又收到剛才那則訊息。交易或通知畫面也可能遇到同樣情況。

- **原本麻煩在哪？** 每來一筆就用 `.some()` 翻遍畫面資料，確認它是不是已經顯示過。清單越長，每次要找的資料就越多。
- **怎麼套用 217？** 把「數字看過沒」換成「這個事件 ID 收過沒」。用 Set 記 ID，先查再決定要不要加入畫面；查一次平均是 `O(1)`。成交事件可以用市場加成交 ID 辨認，例如 `market + tradeId`。
- **做到哪裡就不夠？** 如果網頁整天開著，ID 會越存越多，要訂保留上限或過期時間。刪掉的 ID 再送來時，就可能認不出是舊事件；其他分頁、裝置也不會自動共用這份紀錄。

#### 情境 B：後端匯入檔案前，先找出同一批裡的重複資料

例如匯入會員清單，規則要求同一批不能出現兩筆相同 email。

- **原本麻煩在哪？** 每讀一列就回頭和前面所有列比對，檔案大時會反覆找很多次，最差是 `O(n²)`。
- **怎麼套用 217？** 讀一列就查 email 是否已在 Set 裡；有就回報目前這列重複，沒有就記下來。同一批的檢查平均是 `O(n)`。要列出第一次出現的列號，才需要改用 Map 一起記位置。
- **做到哪裡就不夠？** Set 只知道這次讀到的資料。若兩個匯入工作同時新增相同 email，仍要靠資料庫的唯一限制擋住重複；本機的一份 Set 無法替所有工作把關。

下面用即時成交事件示範實際怎麼改。

### 工程情境：即時成交事件去重

Binance 類型的交易前端可能因 WebSocket reconnect、server retry 或重複訂閱，收到相同的成交事件。假設每個事件有穩定的 `market + tradeId`，UI 不應把同一筆成交插入兩次。

### 常見直覺寫法

```ts
type Trade = {
  market: string;
  tradeId: string;
  price: string;
};

const renderedTrades: Trade[] = [];

function appendIfNew(trade: Trade): void {
  const duplicated = renderedTrades.some(
    (item) =>
      item.market === trade.market && item.tradeId === trade.tradeId,
  );

  if (!duplicated) {
    renderedTrades.push(trade);
  }
}
```

這段在資料很少時完全合理；問題出現在事件持續流入後，每一筆都要掃描已渲染陣列。

### 觸發門檻與潛在問題

- 每筆事件的查詢是 `O(m)`，`m` 是目前保留的成交數。
- 高頻事件下，總成本會隨列表成長。
- 如果畫面只保留 20 筆，且事件更新不頻繁，這段 `.some()` 很直觀，不一定需要優化。
- 當列表持續增長或每秒收到大量事件時，重複線性掃描才會成為值得處理的瓶頸。

### 套用本題技巧：先直接優化常見寫法

和 LeetCode 題目相同，真正要加速的是「這筆資料之前收過嗎」的查詢。第一步不需要先寫 class，只要加入一個 `Set` 保存已見過的成交 ID：

```ts
type Trade = {
  market: string;
  tradeId: string;
  price: string;
};

const renderedTrades: Trade[] = [];
const seenTradeIds = new Set<string>();

function appendIfNew(trade: Trade): void {
  const key = `${trade.market}:${trade.tradeId}`;

  if (seenTradeIds.has(key)) {
    return;
  }

  seenTradeIds.add(key);
  renderedTrades.push(trade);
}
```

這就是對「常見直覺寫法」最直接的優化：

```txt
原本：每次用 renderedTrades.some(...) 線性尋找
現在：每次用 seenTradeIds.has(key) 做平均 O(1) 查詢
```

兩個容器的責任不同：

- `renderedTrades`：保存畫面需要的完整資料與顯示順序。
- `seenTradeIds`：只保存穩定 key，負責快速判斷是否重複。
- key 使用 `market + tradeId`，避免不同市場剛好使用相同 `tradeId` 時互相衝突。

如果資料量有明確上限，或這個元件生命週期很短，到這一版通常就足夠了。

### 第一層優化留下的問題

上面的簡單版本解決了查詢成本，但在「長時間運行的無限 WebSocket stream」中會產生新問題：

```txt
程式運行越久
→ seenTradeIds 只增加、不刪除
→ 記憶體持續成長
```

這不是 LeetCode 解法本身的問題，而是 production 資料沒有終點。只有當 stream 長時間運行、事件量大，而且記憶體成長已成為實際風險時，才需要下一層設計。

### Production 進階優化：限制去重集合大小

進階版用 `Set` 負責查詢、用獨立順序佇列負責淘汰，只保證最近 `maxSize` 個不同事件不重複：

```ts
type Trade = { // 定義收到的成交事件需要哪些欄位。
  market: string; // 市場名稱，例如 BTC-USDT；也是複合去重 key 的一部分。
  tradeId: string; // 成交事件的穩定 ID；相同事件重送時必須維持相同值。
  price: string; // 成交價格；用字串避免金融小數直接受到浮點誤差影響。
}; // 結束 Trade 型別定義。

class RecentTradeIds { // 封裝「查重＋限制記憶體大小」的責任。
  private readonly ids = new Set<string>(); // 保存目前有效的 key，讓查重平均為 O(1)。
  private readonly order: string[] = []; // 按加入順序保存 key，才能知道下一個該淘汰誰。
  private head = 0; // 指向 order 中最舊且尚未淘汰的 key，避免每次使用 O(n) 的 shift()。

  constructor(private readonly maxSize: number) { // 建立實例時，要求呼叫者指定最多保留多少個 key。
    if (!Number.isInteger(maxSize) || maxSize <= 0) { // 上限必須是正整數，否則淘汰規則沒有合理語意。
      throw new Error("maxSize must be a positive integer"); // 對錯誤設定立即失敗，避免程式帶著無效狀態執行。
    } // 結束 maxSize 驗證。
  } // 結束 constructor。

  hasOrAdd(trade: Trade): boolean { // 收到一筆成交；重複回傳 true，全新則記錄後回傳 false。
    const key = `${trade.market}:${trade.tradeId}`; // 組合市場與成交 ID，避免不同市場的相同 ID 互相衝突。

    if (this.ids.has(key)) { // 先查 Set；存在代表這筆事件仍在去重視窗內。
      return true; // 告訴呼叫者這是重複事件，不必再次寫入畫面資料。
    } // 結束重複事件分支。

    this.ids.add(key); // 把全新 key 加入 Set，供之後的事件做快速查詢。
    this.order.push(key); // 同時記住加入順序，之後超過上限時才能淘汰最舊 key。

    if (this.ids.size > this.maxSize) { // 新增後若超過容量，就只淘汰一個最舊 key，讓大小回到 maxSize。
      const expiredKey = this.order[this.head]; // 從 head 位置取得目前最舊、應失效的 key。
      this.head += 1; // 將 head 往後移；不呼叫 shift()，避免每次搬動剩餘陣列元素。
      this.ids.delete(expiredKey); // 從 Set 移除舊 key；它之後若再次出現，會被視為新事件。
      this.compactQueueIfNeeded(); // 視情況清掉 order 前方已失效的空間，避免 backing array 一直增長。
    } // 結束容量超限處理。

    return false; // 這筆是全新事件，呼叫者可以安全地把它加入 store。
  } // 結束 hasOrAdd。

  private compactQueueIfNeeded(): void { // 偶爾壓縮順序陣列，不在每次淘汰時都支付搬移成本。
    if (this.head >= 1_000 && this.head * 2 >= this.order.length) { // 至少累積 1,000 筆失效資料，且失效前綴已占陣列一半才整理。
      this.order.splice(0, this.head); // 一次移除所有已淘汰的前綴；這次是 O(n)，但不會每筆事件都執行。
      this.head = 0; // 壓縮後第一個有效 key 回到索引 0，所以重設 head。
    } // 結束是否需要壓縮的判斷。
  } // 結束 compactQueueIfNeeded。
} // 結束 RecentTradeIds class。

const recentTradeIds = new RecentTradeIds(10_000); // 建立最多記住最近 10,000 個不同事件的去重器；數字需依實際流量調整。

function onTrade(trade: Trade): void { // WebSocket 每收到一筆成交事件時呼叫這個 handler。
  if (recentTradeIds.hasOrAdd(trade)) { // 查重並在全新時登記 key；回傳 true 代表重複。
    return; // 重複事件提早結束，避免畫面或 store 出現第二份資料。
  } // 結束重複事件分支。

  tradeStore.append(trade); // 只有全新事件才交給 store；store 再負責以符合 React 的方式更新狀態。
} // 結束 onTrade。
```

### 優化前後

| 面向 | 陣列 `.some` | 直接使用 `Set` | 有界 `Set`＋順序佇列 |
| --- | --- | --- | --- |
| 每筆 查詢「有沒有出現過」 | `O(m)` | 平均 `O(1)` | 平均 `O(1)` |
| 記憶體 | 跟渲染列表一起成長 | key 會持續增加 | key 上限約為 `maxSize` |
| 顯示順序 | 由成交陣列保存 | 仍由成交陣列保存 | 仍由成交陣列保存 |
| 去重保證 | 舊成交仍在陣列時可去重 | 元件存活期間看過的 ID 都能去重 | 只保證最近 `maxSize` 個不同事件 |
| 實作成本 | 最低 | 低 | 較高，需要定義淘汰語意 |

`10,000` 只是示範設定，不是通用正確值。Production 必須依事件速率、可能重送的時間窗與裝置記憶體量測後決定，也可以改用 server sequence、時間 TTL 或後端保證。

### 使用界線與代價

- 若列表最多只有 20 筆且更新很少，`.some` 更簡單，未必需要額外結構。
- 若需要快速查重，但資料生命週期有限，優先採用簡單的 `Set` 版本。
- 不要只因為「這是 production」就直接加入有界 queue；先確認 stream 壽命、事件速率與記憶體風險。
- 若事件可能在淘汰後再次送達，有界 Set 會把它當成新事件；需用 sequence 或 server-side idempotency 補強。
- `Set` 不取代畫面資料來源，它只負責去重 lookup；render order 仍由 store 中的交易陣列決定。
- React state 更新應建立新引用或透過狀態庫 API，不應把外部 mutable Set 當作可直接觸發 render 的 state。
- 多個分頁或多個裝置各自有自己的集合；跨 client 的 exactly-once 不能靠瀏覽器 Set 保證。

### Code Review 說法

> 目前每筆成交都用 `.some` 掃描整個列表；當保留筆數與事件頻率增加時，處理成本會線性成長。可以先用 `market + tradeId` 的 Set 把查詢降為平均 `O(1)`，原陣列繼續負責顯示順序。如果這是長時間運行的 stream，再依可接受的重送時間窗加入容量或 TTL 淘汰，避免 Set 無限成長。

### 變形題

1. 如果要回傳第一個重複值，而不是布林值，介面與 early return 怎麼改？
2. 如果只能使用 `O(1)` 額外空間，而且允許修改輸入，會選哪個解法？代價是什麼？
3. 如果只判斷距離不超過 `k` 的重複值，要如何讓保存的資料只代表最近 `k` 個位置？

### 一分鐘複習卡

| 項目 | 答案 |
| --- | --- |
| 怎麼想到 Set？ | 一直問「看過沒」，只需記有沒有，不需記幾次 |
| 暴力解 | 比較所有索引對 |
| 暴力瓶頸 | 查詢「有沒有出現過」 重複線性掃描 |
| 最佳化 | 走訪時用 Set 保存已見值 |
| 每輪都要保持什麼？ | 查目前數字之前，Set 只記著前面看過的值 |
| 時間 | 平均 `O(n)` |
| 空間 | 最差 `O(n)` |
| 常見錯誤 | 把雙層迴圈說成 `O(n log n)`；排序時忽略 mutation |
| Production | 先用穩定 ID＋Set 直接優化；無限 stream 再考慮有界去重 |
---

## 相關連結

- [Two Sum](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)
- [第 1 週 Day 1：React 與 System Design](/docs/career-blueprint/week-01-day-01)
