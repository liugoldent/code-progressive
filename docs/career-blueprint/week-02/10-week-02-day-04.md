---
sidebar_position: 4
sidebar_label: "Day 4"
slug: "/career-blueprint/week-02-day-04"
title: "第 2 週 Day 4：Product of Array Except Self、Python 小練習與 HTTP 快取策略"
description: "140 分鐘日課：Product of Array Except Self 的 Pattern 推導、雙語實作、測試與 Big-O，Python frequency／grouping／queue 三個小練習，以及 Cache-Control、ETag 與 stale 策略判斷。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - Python
  - System Design
keywords: ["Product of Array Except Self", "Arrays & Hashing II", "prefix product", "suffix product", "frequency", "grouping", "queue", "Cache-Control", "ETag", "stale-while-revalidate", "stale-if-error"]
---

# 第 2 週 Day 4：Arrays & Hashing II

> 安排日期：2026-09-17；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing II  
> 本週 System Design 主題：網路與請求路徑

接續 [第 2 週 Day 3](/docs/career-blueprint/week-02-day-03)。今天的重點不是背出兩次迴圈，而是能從重複計算推導 Pattern，留下可執行測試，並判斷 HTTP response 在 fresh、stale、revalidate 與 origin failure 時應如何處理。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：指定 Product of Array Except Self，完成 Pattern 判斷、TypeScript＋Python 程式、測試與 Big-O；Tree／Graph／DP 卡住時優先畫圖與追狀態。
- [ ] **Python 實作｜50 分鐘**：完成 frequency／grouping／queue 三個小練習，通過提供的 assertions，並能說出各容器的用途。
- [ ] **收尾｜10 分鐘**：執行今日測試，把未完成步驟移入週末補課清單，且每項都有可驗收的下一步。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：判斷 Cache-Control、ETag、stale 策略；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。閱讀答案不等於完成；未完成項加入週末補課，不壓縮明天主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Product of Array Except Self | Pattern 推導、雙語程式、測資、Big-O、卡點 |
| 21:30–22:20 | Python 三個小練習 | frequency／grouping／queue 實作與 assertions |
| 22:20–22:30 | 收尾 | 測試結果、未完成項、週末最小補課動作 |
| 22:30–22:50 | HTTP 快取策略 | Cache-Control／ETag／stale 判斷與至少一項主動產出 |

---

## Part 1｜NeetCode 150：Product of Array Except Self（60 分鐘）

完整三階段題解放在 LeetCode 專區：

**[開始 LeetCode 238｜Product of Array Except Self 練習](/docs/algorithms/leetcode/f0201-0300/l0238-product-of-array-except-self)**

先停在題解的 Stage A。前 30 分鐘不要展開提示，也不要往下看 Stage B；若以前看過答案，仍要從空白重寫並口述推導，才能算今天完成。

### 1. 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與確認契約 | 一句話說清楚「排除的是位置，不是數值」 |
| 5–10 | 手算官方與自訂測資 | 預期輸出、零與負數的影響 |
| 10–18 | 提出最直接正確解 | 三句計畫、正確性與預估成本 |
| 18–25 | 找出重複計算、判斷 Pattern | 畫一個位置左右兩段，不只寫 Pattern 名稱 |
| 25–35 | TypeScript＋Python 實作 | 先完成熟悉語言；另一語言不得只貼答案 |
| 35–48 | 跑測試與修正 | 官方 2 組＋自訂 4 組，保留失敗原因 |
| 48–55 | 寫 Big-O 與 invariant | 說明每個 O(n) 從哪兩次走訪而來 |
| 55–60 | 口述與回看 Stage B | Pattern、邊界、替代方案與一個工程用途 |

### 2. 先判斷契約，不先看 Pattern

**單選｜輸入 `[2, 2, 3]` 時，第一個位置的答案是什麼？**

- [ ] A. `3`，因為要排除所有和自己數值相同的元素。
- [ ] B. `6`，因為只排除索引 0，索引 1 的另一個 2 仍要乘。
- [ ] C. `12`，因為目前位置也要乘進去。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 題目排除的是目前位置，不是排除相同數值。輸出也必須保持與輸入索引一一對應。

</details>

**單選｜以下哪個限制必須同時滿足？**

- [ ] A. 可以用總乘積除以目前值，只要另外處理 0。
- [ ] B. 不能使用除法，目標時間為 `O(n)`；進階要求不計輸出陣列時 `O(1)` 額外空間。
- [ ] C. 可以排序輸入，輸出順序不重要。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 輸出位置有意義，因此不能任意排序輸入；題目也明確禁止除法。

</details>

### 3. 測資先手算，再開始 coding

| 類別 | 輸入 | 預期 | 驗證目的 |
| --- | --- | --- | --- |
| 官方 1 | `[1, 2, 3, 4]` | `[24, 12, 8, 6]` | 一般正數 |
| 官方 2 | `[-1, 1, 0, -3, 3]` | `[0, 0, 9, 0, 0]` | 一個零與負數 |
| 自訂 | `[0, 0, 2]` | `[0, 0, 0]` | 兩個零 |
| 自訂 | `[2, 3]` | `[3, 2]` | 最小合法長度 |
| 自訂 | `[-1, -2, -3]` | `[6, 3, 2]` | 負號變化 |
| 自訂 | `[1, 1, 1]` | `[1, 1, 1]` | 單位元素 |

先回答：固定位置 `i` 後，最直接做法要掃幾個元素？換到 `i + 1` 時，哪些乘法被重做？

### 4. 第一次實作模板

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
第一個方法：
預估時間／空間：
失敗測資：
錯誤類型（契約／推導／邊界／語法／複雜度）：
看到第幾層提示：未看／一／二／三／Stage B
```

<details>
<summary>提示一：只問需求，不說做法</summary>

排除目前位置後，剩下的元素可以分成哪兩段？

</details>

<details>
<summary>提示二：降低重複工作</summary>

相鄰位置左邊那一段的乘積，只比前一格多乘一個數；右邊也有對稱關係。

</details>

<details>
<summary>提示三：接近實作</summary>

先把每格左邊的乘積寫進輸出，再反向維護一個右邊乘積並乘回該格。

</details>

### 5. 30 分鐘後才展開：Pattern、參考程式與 invariant

<details>
<summary>Pattern 判斷與完整參考實作</summary>

最直接解對每個位置重掃其他 `n - 1` 個數，總共 `n(n - 1)` 次左右，時間 `O(n²)`。真正的瓶頸不是乘法慢，而是左右重疊區段被重算。

看到「每個位置的答案，可以拆成它左邊全部資料的累積結果 × 右邊全部資料的累積結果」，才判斷為前綴／後綴累積。這裡不需要用 Map 查 key；frequency 也不足以保留每個位置左右兩段的關係。

```text
nums       [1, 2, 3, 4]
左側乘積   [1, 1, 2, 6]
右側乘積   [24,12,4, 1]
逐格相乘   [24,12,8, 6]
```

TypeScript：

```ts
function productExceptSelf(nums: number[]): number[] {
  const result = Array<number>(nums.length).fill(1);

  let prefix = 1;
  for (let i = 0; i < nums.length; i += 1) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1;
  for (let i = nums.length - 1; i >= 0; i -= 1) {
    result[i] *= suffix;
    suffix *= nums[i];
  }

  return result;
}
```

Python：

```python
def product_except_self(nums: list[int]) -> list[int]:
    result = [1] * len(nums)

    prefix = 1
    for index, value in enumerate(nums):
        result[index] = prefix
        prefix *= value

    suffix = 1
    for index in range(len(nums) - 1, -1, -1):
        result[index] *= suffix
        suffix *= nums[index]

    return result
```

每輪都要保持的條件（invariant）：

- 正向處理索引 `i` 前，`prefix` 等於所有索引小於 `i` 的乘積。
- 反向處理索引 `i` 前，`suffix` 等於所有索引大於 `i` 的乘積；`result[i]` 已保存左側乘積。
- 一定要先使用累積值，再把 `nums[i]` 納入，否則會錯把自己乘進答案。

</details>

### 6. 可執行測試

#### TypeScript

```ts
const cases: Array<[number[], number[]]> = [
  [[1, 2, 3, 4], [24, 12, 8, 6]],
  [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]],
  [[0, 0, 2], [0, 0, 0]],
  [[2, 3], [3, 2]],
  [[-1, -2, -3], [6, 3, 2]],
  [[1, 1, 1], [1, 1, 1]],
];

for (const [nums, expected] of cases) {
  const original = [...nums];
  const actual = productExceptSelf(nums);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`failed: ${JSON.stringify({ nums, expected, actual })}`);
  }
  if (JSON.stringify(nums) !== JSON.stringify(original)) {
    throw new Error("input was mutated");
  }
}

console.log("Product of Array Except Self: 6 cases passed");
```

#### Python

```python
import unittest


class ProductExceptSelfTests(unittest.TestCase):
    def test_cases(self) -> None:
        cases = [
            ([1, 2, 3, 4], [24, 12, 8, 6]),
            ([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]),
            ([0, 0, 2], [0, 0, 0]),
            ([2, 3], [3, 2]),
            ([-1, -2, -3], [6, 3, 2]),
            ([1, 1, 1], [1, 1, 1]),
        ]

        for nums, expected in cases:
            with self.subTest(nums=nums):
                original = nums.copy()
                self.assertEqual(product_except_self(nums), expected)
                self.assertEqual(nums, original)


if __name__ == "__main__":
    unittest.main()
```

### 7. Big-O 與口述驗收

**單選｜最佳化版本的複雜度哪個正確？**

- [ ] A. `O(n²)` 時間、`O(1)` 空間，因為有兩個迴圈。
- [ ] B. `O(2n)`，所以不能簡化為 `O(n)`。
- [ ] C. `O(n)` 時間；不計回傳陣列時額外空間 `O(1)`，回傳陣列本身為 `O(n)`。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 兩個迴圈是前後相接，不是巢狀，所以工作量是 `n + n`，省略常數後為 `O(n)`。`result` 是題目要求的輸出；另外只保存 `prefix`、`suffix` 與索引。

</details>

- [ ] 能從暴力解的重複區段推導前綴／後綴，而不是只背題名。
- [ ] TypeScript 與 Python 都通過 6 組測資，或已把缺少的語言列入補課。
- [ ] 能解釋為何空的左段／右段乘積是 `1`，不是 `0`。
- [ ] 能說出一個零、兩個零、負數與最小長度如何影響結果。
- [ ] 能說出先更新累積值再寫答案會犯什麼錯。
- [ ] 能區分演算法額外空間與必要輸出空間。

> Tree／Graph／DP 卡住規則：Tree／Graph 先畫節點、邊、走訪順序與已訪狀態；DP 先寫「狀態代表什麼、從哪裡轉移、初始值、計算順序」。今天的 Array 題則畫索引與左右區段，目的相同：把腦中的隱藏狀態攤開來追。

---

## Part 2｜Python 實作：frequency／grouping／queue（50 分鐘）

今天不追求花俏語法。三題都先寫清楚 input／output，再選容器；所有函式保留輸入，不做原地修改。

### 1. 時間分配

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 建立單檔、抄函式簽名與測試 | `python_practice.py` 可執行 |
| 5–17 | frequency | 字串次數表與 4 組 assertions |
| 17–32 | grouping | 依 department 分組且保留順序 |
| 32–45 | queue | `deque` 模擬有容量的工作佇列 |
| 45–50 | 全部重跑與口述 | 容器選擇、邊界與 Big-O |

### 2. 練習一：frequency

需求：忽略空白與大小寫，統計每個單字出現次數；只用 Python 標準函式庫。

```python
def word_frequencies(text: str) -> dict[str, int]:
    # 自己完成
    raise NotImplementedError
```

測試：

```python
assert word_frequencies("") == {}
assert word_frequencies("BTC btc ETH") == {"btc": 2, "eth": 1}
assert word_frequencies("  a   a b  ") == {"a": 2, "b": 1}
assert word_frequencies("One") == {"one": 1}
```

<details>
<summary>完成後看參考實作</summary>

```python
def word_frequencies(text: str) -> dict[str, int]:
    frequencies: dict[str, int] = {}
    for word in text.lower().split():
        frequencies[word] = frequencies.get(word, 0) + 1
    return frequencies
```

令 `c` 為文字字元數，切分與走訪合計為 `O(c)`；字典最多保存 `u` 個不同單字，空間 `O(u)`。這個簡化版本把標點視為單字的一部分；若要把 `"btc,"` 與 `"btc"` 當同一字，需另定 tokenizer 規則。

</details>

### 3. 練習二：grouping

需求：把人名依部門分組，保留輸入內的順序，不修改輸入。缺少或空白部門統一放到 `"unknown"`。

```python
from typing import TypedDict


class Member(TypedDict):
    name: str
    department: str


def group_names_by_department(members: list[Member]) -> dict[str, list[str]]:
    # 自己完成
    raise NotImplementedError
```

測試：

```python
members: list[Member] = [
    {"name": "Amy", "department": "FE"},
    {"name": "Bo", "department": "BE"},
    {"name": "Cy", "department": "FE"},
    {"name": "Di", "department": ""},
]
original = [member.copy() for member in members]

assert group_names_by_department(members) == {
    "FE": ["Amy", "Cy"],
    "BE": ["Bo"],
    "unknown": ["Di"],
}
assert members == original
assert group_names_by_department([]) == {}
```

<details>
<summary>完成後看參考實作</summary>

```python
def group_names_by_department(members: list[Member]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for member in members:
        department = member["department"].strip() or "unknown"
        groups.setdefault(department, []).append(member["name"])
    return groups
```

處理 `n` 位成員平均時間 `O(n)`；輸出保存 `n` 個名字，空間 `O(n)`。dict 負責「部門 → 該組清單」，list 負責保留同組輸入順序。若多個程序同時修改同一分組，單機 dict 並不能提供跨程序一致性。

</details>

### 4. 練習三：queue

需求：建立有容量的 FIFO 工作佇列。加入成功回傳 `True`；滿了就回傳 `False`，不丟掉舊工作。取出空佇列時回傳 `None`。

```python
from collections import deque


class JobQueue:
    def __init__(self, capacity: int) -> None:
        # 自己完成
        raise NotImplementedError

    def enqueue(self, job_id: str) -> bool:
        raise NotImplementedError

    def dequeue(self) -> str | None:
        raise NotImplementedError

    def __len__(self) -> int:
        raise NotImplementedError
```

測試：

```python
queue = JobQueue(capacity=2)
assert len(queue) == 0
assert queue.dequeue() is None
assert queue.enqueue("job-a") is True
assert queue.enqueue("job-b") is True
assert queue.enqueue("job-c") is False
assert queue.dequeue() == "job-a"
assert queue.enqueue("job-c") is True
assert queue.dequeue() == "job-b"
assert queue.dequeue() == "job-c"
assert queue.dequeue() is None

try:
    JobQueue(capacity=0)
except ValueError:
    pass
else:
    raise AssertionError("capacity=0 should fail")
```

<details>
<summary>完成後看參考實作</summary>

```python
class JobQueue:
    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self._capacity = capacity
        self._jobs: deque[str] = deque()

    def enqueue(self, job_id: str) -> bool:
        if len(self._jobs) >= self._capacity:
            return False
        self._jobs.append(job_id)
        return True

    def dequeue(self) -> str | None:
        if not self._jobs:
            return None
        return self._jobs.popleft()

    def __len__(self) -> int:
        return len(self._jobs)
```

`deque.append` 與 `deque.popleft` 在兩端操作皆為 `O(1)`；佇列最多保存 `capacity` 筆，空間 `O(capacity)`。這只是單程序、記憶體內的佇列；正式工作佇列還要定義持久化、重試、ack、可見性逾時、去重與 dead-letter queue。

</details>

### 5. Python 驗收

**單選｜為何 queue 不直接用 list 的 `pop(0)`？**

- [ ] A. list 不能放字串。
- [ ] B. `pop(0)` 會搬動後續元素，通常為 `O(n)`；`deque.popleft()` 適合從左端 `O(1)` 取出。
- [ ] C. deque 會自動把工作存進資料庫。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** deque 改善的是兩端操作；它不會自動提供 durability 或分散式一致性。

</details>

- [ ] 三個練習的 assertions 都已實際執行。
- [ ] 能說出 dict 在 frequency 與 grouping 中分別映射什麼。
- [ ] grouping 保留順序，且沒有修改輸入。
- [ ] queue 滿載時行為明確，不會無限制吃記憶體。
- [ ] 能說出三題的時間與空間成本。

---

## Part 3｜收尾：測試與週末補課（10 分鐘）

### 1. 最後一次執行

```bash
python -m unittest -v test_product_except_self.py
python python_practice.py
```

TypeScript 使用目前練習專案既有 runner；例如已有 `tsx` 時執行：

```bash
npx tsx product-except-self.ts
```

**實際測試結果（依事實單選）**

- [ ] 全部通過。
- [ ] 演算法測試失敗，已保存第一個失敗案例。
- [ ] Python 小練習失敗，已定位到 frequency／grouping／queue 其中一題。
- [ ] 尚未執行，不勾任何「完成」項。

### 2. 週末補課清單

只搬移未完成步驟，不把整天模糊地寫成「重看」。每項控制在 20–40 分鐘，並寫出驗收條件。

- [ ] `30 分鐘｜238 閉卷重寫`：不看提示完成一種語言，通過 6 組測資並口述 invariant。
- [ ] `20 分鐘｜238 第二語言`：補齊 TypeScript 或 Python，確認未修改輸入。
- [ ] `20 分鐘｜Python frequency／grouping`：從空白重寫並通過 assertions。
- [ ] `20 分鐘｜Python queue`：補滿載、空佇列與非法容量測試。
- [ ] `20 分鐘｜HTTP cache`：重畫判斷圖並口述一個 stale failure case。
- [ ] 無需補課；今天所有驗收項目都有執行證據。

---

## Part 4｜每日 System Design × 高併發 Combo：HTTP 快取判斷（20 分鐘）

### 1. 今日微題與時間分配

微題：收到一個 response 時，如何判斷能否保存、能否直接重用、何時用 ETag 驗證，以及 stale response 在什麼條件下可以回給使用者？

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 畫 fresh／stale／validate 路徑 | 一張小圖 |
| 5–10 | 判斷三組 header | 每組的 browser／shared cache 行為 |
| 10–15 | 算三個數字 | TTL、stale window、origin QPS |
| 15–20 | failure case 或 3 分鐘口述 | origin timeout 時的可接受行為 |

### 2. 先建立最小心智模型

```text
Client request
      │
      ▼
Cache 有副本嗎？ ──沒有──► Origin ──200＋headers──► 儲存（若允許）
      │有
      ▼
仍 fresh 嗎？ ──是──► 直接回 cached response
      │否：stale
      ▼
允許 stale 嗎？ ──是──► 回 stale；依策略背景更新或只在錯誤時使用
      │否
      ▼
帶 If-None-Match 驗證 ──304──► 重用 body、更新 metadata
                         └─200──► 換成新 body 與新 validator
```

`Cache-Control` 主要決定能否保存、fresh 多久、過期後是否必須驗證及共享快取規則。`ETag` 是 representation 的 validator；過期後可用 `If-None-Match` 問 origin「內容是否仍相同」。相同時回 `304 Not Modified`，省掉 response body，但仍有一次網路往返與 origin／edge 驗證成本。

規範與查閱入口：[RFC 9111：HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)、[MDN Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)、[MDN ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/ETag)。

### 3. 先分清楚：header 與 directive 是不同層級

先看一組完整的 **response headers**：

```http
Cache-Control: private, max-age=60, must-revalidate
ETag: "user-42-v8"
```

- **Header（標頭欄位）**：整行資料中的欄位，例如 `Cache-Control`、`ETag`。
- **Header value（欄位值）**：冒號右邊的整段內容。例如 `Cache-Control` 的值是 `private, max-age=60, must-revalidate`。
- **Directive（指令）**：`Cache-Control` 值中以逗號分隔的每一項，例如 `private`、`max-age=60`、`must-revalidate`。
- **Directive parameter（指令參數）**：指令後面的設定值，例如 `max-age` 的參數是 `60` 秒。

所以 `ETag` 是另一個 header，**不是** `Cache-Control` directive。它提供 validator；當 cache 需要確認舊副本是否仍有效時，會把該值放進 request header：

```http
If-None-Match: "user-42-v8"
```

origin 判斷內容沒變可回 `304 Not Modified`；內容已變則回 `200` 與新的 body／`ETag`。

以下談的 `Cache-Control` 都是 **response header**。閱讀時固定問兩題，會比背名稱清楚：

1. **能不能存？** `no-store` 禁止保存；`private` 只禁止 shared cache 保存，browser private cache 仍可保存。
2. **存了之後，這次能不能不問 origin 就直接用？** 要看副本是 fresh 還是 stale，以及是否有 `no-cache`、`must-revalidate` 或允許 stale 的 directive。

> **fresh／stale 描述的是「已保存副本的新鮮度」，不是「有快取／沒快取」。** 副本變 stale 通常也不會立刻被刪除；它仍可能拿去 revalidate，或在特定條件下暫時回傳。

| `Cache-Control` directive | Browser private cache | CDN／proxy shared cache | 最容易誤會的地方 |
| --- | --- | --- | --- |
| `max-age=60` | 計算出的 current age 小於 freshness lifetime 時，可直接重用 | 同左；若另有 `s-maxage`，shared cache 改用後者 | `60` 秒後是 stale，不是自動刪除；也不是單純從「browser 收到」那刻重新起算 |
| `s-maxage=300` | 不影響 private cache | 以 `300` 秒作為 shared cache 的 freshness lifetime，優先於 `max-age`／`Expires` | `s` 指 shared，不是 seconds；秒數是 `=300` 的參數 |
| `private` | 可以保存 | 不可保存這份 response | 不是「任何 cache 都不能存」；要全面禁止保存應看 `no-store` |
| `no-cache` | 可以保存，但每次重用前都要向 origin 驗證 | 同左 | 名稱像「不要 cache」，實際是「不要在未驗證時直接使用」 |
| `no-store` | 不應保存 | 不應保存 | 不是「可以存、每次驗證」；那是 `no-cache`。它也不會主動清除先前已存在的舊副本 |
| `must-revalidate` | fresh 時可直接重用；stale 後必須先成功驗證 | 同左 | 它只限制 stale response；不像 `no-cache` 那樣要求每次重用都驗證 |
| `stale-while-revalidate=30` | 實際支援度依 cache 而定 | stale 後 `30` 秒內可先回舊副本，同時在背景 revalidate | 目的是降低等待時間；不是延長 fresh lifetime，也不保證所有 cache 都實作 |
| `stale-if-error=120` | 實際支援度依 cache 而定 | 在指定錯誤發生時，stale 後 `120` 秒內可回舊副本 | 只有錯誤路徑才能用；origin 正常時不能拿它當一般的 stale window |

用三個最常混淆的 directive 快速對照：

```text
no-store         → 不要保存
no-cache         → 可以保存，但每次使用前都要驗證
must-revalidate  → 可以保存；fresh 可直接用，只有 stale 後必須驗證
```

### 4. 三組 response headers 組合判斷

#### 情境 A：個人化 API

```http
Cache-Control: private, no-cache
ETag: "user-42-v8"
```

**單選｜最合理的解讀是哪個？**

- [ ] A. browser 可保存，但每次重用前要 revalidate；shared cache 不應把這份個人化資料共用給其他人。
- [ ] B. 任何 cache 都不能保存。
- [ ] C. browser 可永遠直接重用，不必連線。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** `private` 限制 shared cache，`no-cache` 要求重用前驗證。若資料敏感到不應落入任何 cache，才考慮 `no-store`，並搭配整體安全需求評估。

</details>

#### 情境 B：版本化靜態資產

```http
Cache-Control: public, max-age=31536000, immutable
```

**單選｜部署新內容時，最重要的配套是什麼？**

- [ ] A. 沿用相同 URL，期待所有 cache 立刻忘記舊檔。
- [ ] B. 內容改變就更換帶 hash 的 URL；HTML 使用較短策略，指向新資產 URL。
- [ ] C. 每次請求都用 `no-cache`。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 長 TTL 與 immutable 適合內容位址化資產；內容變動時 URL 也要變。若同 URL 改內容，舊 cache 可以合法地繼續回舊版本。

</details>

#### 情境 C：公開商品列表

```http
Cache-Control: public, max-age=30, s-maxage=120, stale-while-revalidate=30, stale-if-error=300
ETag: "catalog-v31"
```

**單選｜response 在 shared cache 已有 135 秒，origin 正常時，合理行為是什麼？**

- [ ] A. shared cache 仍在 120 秒 fresh window 內，直接當 fresh 回傳。
- [ ] B. 已 stale 15 秒，位於 30 秒 stale-while-revalidate window；可先回 stale 並啟動背景 revalidation。
- [ ] C. 已超過 stale-if-error 300 秒，必須刪除。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 對 shared cache，`s-maxage=120` 決定 freshness；age 135 表示 stale 15 秒，仍落在 `stale-while-revalidate=30` 的窗口。ETag 可讓背景驗證在內容沒變時收到 304。

</details>

### 5. 三個數字

假設 `/catalog` 進站流量為 10,000 QPS、shared cache hit ratio 為 95%，先忽略 request collapsing 與 revalidation traffic：

1. origin miss traffic 約為 `10,000 × (1 - 0.95) = 500 QPS`。
2. hit ratio 掉到 80% 時，origin 約為 `2,000 QPS`，是原本的 4 倍。
3. `s-maxage=120`、`stale-while-revalidate=30` 表示正常時最多可在過期後 30 秒窗口內先回 stale 並背景更新；它不是「資料永遠只會舊 30 秒」的完整保證，因為 age、網路延遲、實作與 error policy 都會影響觀察結果。

**單選｜高併發下最需要補的保護是哪個？**

- [ ] A. TTL 一到，讓所有 miss 同時打 origin，更新會更快。
- [ ] B. 觀察 cache hit ratio、origin QPS、revalidation latency；搭配 request collapsing／single-flight、TTL jitter 與容量保護。
- [ ] C. 只監控 browser console。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 大量 key 同時過期會造成 cache stampede。策略除了 header，還要處理同時更新與 origin 容量。

</details>

### 6. Failure case：origin timeout 時回不回 stale？

商品列表已 stale 40 秒，response 宣告 `stale-if-error=300`，origin timeout。此時回 stale 可以保住可用性，但使用者可能看到舊價格或庫存。

判斷不能只說「stale 比錯誤好」：

- 商品瀏覽列表可標記資料時間、回 stale，並監控 stale serve rate。
- 下單、扣庫存、付款等 correctness-critical write path 不應把舊列表當成最終事實；提交時仍由 authoritative service 重新驗證價格與庫存。
- 超過允許窗口後，回明確錯誤或降級畫面，不應無期限供應未知年代的資料。
- 若 `Vary`、Authorization 或 cache key 設錯，stale 策略可能放大資料外洩，而不只是資料過舊。

### 7. 3 分鐘口述骨架與今日驗收

```txt
0:00–0:35  先分 private cache 與 shared cache，說明 cache key。
0:35–1:15  Cache-Control 決定保存、freshness 與 stale 規則。
1:15–1:50  ETag＋If-None-Match：304 省 body，但不是零成本。
1:50–2:30  用商品列表說 stale-while-revalidate 與 stale-if-error。
2:30–3:00  failure case：列表可降級，下單仍需 authoritative validation。
```

**主動產出（至少完成一項）**

- [ ] 自己重畫 fresh／stale／validate 小圖，沒有照抄。
- [ ] 閉卷算出 10,000 QPS 在 95% 與 80% hit ratio 的 origin QPS。
- [ ] 說明 origin timeout 時，哪些 read 可回 stale、哪些 write 不能相信 stale。
- [ ] 完成一次 3 分鐘口述並回聽。

**觀念驗收**

- [ ] 能清楚分辨 `no-cache` 與 `no-store`。
- [ ] 能說明 ETag 的 304 仍需要網路往返。
- [ ] 能分辨 `max-age` 與 `s-maxage` 作用對象。
- [ ] 能說出 `stale-while-revalidate` 與 `stale-if-error` 的觸發差異。
- [ ] 能指出 cache stampede 與錯誤 cache key 各自造成的風險。

---

## 今日總驗收

- [ ] Product of Array Except Self 已留下 Pattern 推導、雙語程式、6 組測試與 Big-O。
- [ ] Python frequency／grouping／queue 三題都已執行，不只閱讀參考答案。
- [ ] 最後一次測試結果已記錄；未完成項已搬到週末清單。
- [ ] Cache-Control／ETag／stale 至少完成一項主動產出。
- [ ] 能在 60 秒內說出今天最重要的四句：為何是左右累積、每輪 invariant、為何 deque 適合 FIFO、stale 何時可用。

明天開始前閉卷回答：為何 Product of Array Except Self 不是 frequency 題？`no-cache` 能不能保存？ETag 回 304 省掉什麼、沒有省掉什麼？queue 滿時為何不能無限排隊？
