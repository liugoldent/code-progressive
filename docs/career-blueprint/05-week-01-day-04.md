---
sidebar_position: 5
sidebar_label: "5. 第 1 週 Day 4"
slug: "/career-blueprint/week-01-day-04"
title: "第 1 週 Day 4：Two Sum、Python 資料處理與故障降級"
description: "Day 4 日課：60 分鐘 Two Sum、50 分鐘 Python list／dict／set 資料處理、10 分鐘收尾，以及 20 分鐘 System Design failure points 與 fallback。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - Python
  - System Design
keywords: ["Two Sum", "Python", "list", "dict", "set", "failure points", "fallback", "面試準備"]
---

# 第 1 週 Day 4：Two Sum、Python 實作與 Failure Points

> 練習日期：自行填寫實際練習日  
> 今日總時數：140 分鐘  
> 對應目標：Amazon、Binance、台積電、聯發科面試共同核心  
> 本週 System Design 主題：解題框架

這份是提前整理的 Day 4 學習筆記，接續 [Day 3](/docs/career-blueprint/week-01-day-03)。可以先閱讀與練習，完成狀態依實際學習進度填寫。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：指定 Two Sum，完成 Pattern 判斷、程式、測試與 Big-O；Tree／Graph／DP 卡住時優先畫圖與追狀態。
- [ ] **Python 實作｜50 分鐘**：建立專案，用 list／dict／set 寫資料處理，執行型別檢查與測試。
- [ ] **收尾｜10 分鐘**：執行測試並把未完成步驟移入週末補課清單。
- [ ] **System Design × 高併發｜20 分鐘**：列三個 failure points 與 fallback；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。System Design 若未完成，加入週末補課清單；不影響下週主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Two Sum | Pattern 推導、程式、測試、Big-O |
| 21:30–22:20 | Python 資料處理 | 專案、型別檢查與測試結果 |
| 22:20–22:30 | 收尾 | 失敗原因與下一個最小行動 |
| 22:30–22:50 | System Design | 三個故障點與降級方式、至少一項主動產出 |

---

## Part 1｜NeetCode 150：Two Sum（60 分鐘）

完整三階段筆記沿用 LeetCode 專區：

**[開始 LeetCode 1｜Two Sum 練習](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)**

> 先從該頁 Stage A 讀題、自訂測資、寫計畫與第一次實作。完成自己的版本後，再看 Stage B 分析與 Stage C 工程遷移。本頁的參考解答也先不要展開。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與 constraints | 一句 Input／Output 契約 |
| 5–15 | 自訂測資、提出暴力解 | 最簡單正確解與複雜度預估 |
| 15–25 | 找出重複工作、判斷 Pattern | 三句解題計畫 |
| 25–40 | 閉卷實作 | TypeScript 與 Python 版本 |
| 40–50 | 執行測試 | 官方範例與邊界測資 |
| 50–60 | 手動演算與口述 | 每輪狀態、invariant、Big-O 與卡點 |

### 1. 作答前先填這張卡

```txt
輸入是：
輸出代表數值還是位置：
兩個位置能否相同：
數值相同但位置不同是否可以：
最簡單正確做法：
哪個動作一直重複：
我希望加速哪個操作：
我的 Pattern 判斷與理由：
三句解題計畫：
1.
2.
3.
```

首次作答模板：

```ts
function twoSum(nums: number[], target: number): number[] {
  throw new Error("先完成自己的版本");
}
```

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    raise NotImplementedError("先完成自己的版本")
```

### 2. 測試不能只看答案長得一樣

沿用題解頁的三組官方範例，另加自訂測資。兩個 index 的回傳順序不限，應驗證「位置不同、位置合法、對應數值相加正確」。

| 類別 | nums | target | 有效位置（順序不限） | 驗證重點 |
| --- | --- | ---: | --- | --- |
| 官方 | `[2, 7, 11, 15]` | 9 | `[0, 1]` | 答案含 index 0 |
| 官方 | `[3, 2, 4]` | 6 | `[1, 2]` | 不能用第一個 3 配自己 |
| 官方 | `[3, 3]` | 6 | `[0, 1]` | 相同值、不同位置 |
| 自訂 | `[-3, 4, 3, 90]` | 0 | `[0, 2]` | 負數 |
| 自訂 | `[0, 4, 3, 0]` | 0 | `[0, 3]` | 重複的 0 |
| 自訂 | `[1, 2, 3, 8]` | 11 | `[2, 3]` | 答案在尾端 |

官方保證至少兩個元素且恰好一組答案，空陣列和無解不是官方輸入；若自己定義額外防禦行為，請另列測試，不要混成官方保證。

<details>
<summary>完成第一版後再看：Python 暴力解、最佳化與狀態演算</summary>

### 看到這題，怎麼想到要用 dict／Map？

最直覺是拿一個數字，把後面的數字逐一配一次。問題在於每走到下一個位置，又重新找一遍配對值。以目前數字 7、目標 9 為例，我們其實只想知道「前面有沒有 2？它在哪？」因此保存「數值 → 位置」，就能直接找需要的值。Set 只能回答有沒有，沒有保存要回傳的位置。

Pattern 是「記住已走過的資料，快速查找配對值」。下次遇到必須回傳位置、且能由目前值算出另一個目標值時，再考慮這種做法；不要看到兩個數字就直接套用。

把下面程式存成 `two_sum.py`。TypeScript 的暴力與最佳化版本請對照題解頁 Stage B。

```python
def two_sum_brute(nums: list[int], target: int) -> list[int]:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    raise ValueError("No valid pair")


def two_sum(nums: list[int], target: int) -> list[int]:
    index_by_value: dict[int, int] = {}
    for index, value in enumerate(nums):
        complement = target - value
        if complement in index_by_value:
            return [index_by_value[complement], index]
        index_by_value[value] = index
    raise ValueError("No valid pair")
```

步驟：先算需要的配對值，查詢已走過的位置；找到就回傳，找不到才記錄目前位置。

每輪都要保持：處理 index `i` 之前，dict 裡的所有位置都小於 `i`。這就是 invariant，也解釋了為什麼不會用到同一個位置兩次。

| i | value | 要找的值 | 查找前記錄 | 動作 |
| ---: | ---: | ---: | --- | --- |
| 0 | 3 | 3 | `{}` | 記錄 `3: 0` |
| 1 | 2 | 4 | `{3: 0}` | 記錄 `2: 1` |
| 2 | 4 | 2 | `{3: 0, 2: 1}` | 回傳 `[1, 2]` |

暴力解最差比較 `n(n−1)/2` 組，時間 `O(n²)`、額外空間 `O(1)`。最佳化只掃描一次，在一般雜湊查詢平均 `O(1)` 的前提下，平均時間 `O(n)`、額外空間 `O(n)`；極端雜湊碰撞可能讓總時間退化到 `O(n²)`。

常見錯誤：先存再查導致配到自己；用 truthy 判斷而漏掉 index 0；回傳數值而非位置。排序加雙指標也能做，但需保留原始 index 且排序耗時 `O(n log n)`；輸入已排序時，雙指標才更值得考慮。

</details>

### 3. 可執行測試

Python 存成 `test_two_sum.py`，與自己的 `two_sum.py` 放在同一個練習專案根目錄：

```python
import unittest
from two_sum import two_sum


class TwoSumTests(unittest.TestCase):
    def test_valid_pairs(self) -> None:
        cases = [
            ([2, 7, 11, 15], 9), ([3, 2, 4], 6), ([3, 3], 6),
            ([-3, 4, 3, 90], 0), ([0, 4, 3, 0], 0), ([1, 2, 3, 8], 11),
        ]
        for nums, target in cases:
            with self.subTest(nums=nums, target=target):
                original = nums.copy()
                result = two_sum(nums, target)
                self.assertEqual(len(result), 2)
                i, j = result
                self.assertNotEqual(i, j)
                self.assertTrue(0 <= i < len(nums) and 0 <= j < len(nums))
                self.assertEqual(nums[i] + nums[j], target)
                self.assertEqual(nums, original)


if __name__ == "__main__":
    unittest.main()
```

TypeScript 測試放在 `two-sum.ts` 的函式下方。使用專案已有的 TypeScript 執行工具，或在練習專案安裝 `tsx` 後執行 `npx tsx two-sum.ts`。

```ts
const cases: [number[], number][] = [
  [[2, 7, 11, 15], 9], [[3, 2, 4], 6], [[3, 3], 6],
  [[-3, 4, 3, 90], 0], [[0, 4, 3, 0], 0], [[1, 2, 3, 8], 11],
];
for (const [nums, target] of cases) {
  const original = [...nums];
  const result = twoSum(nums, target);
  const [i, j] = result;
  if (result.length !== 2 || !Number.isInteger(i) || !Number.isInteger(j)
      || i === j || i < 0 || j < 0 || i >= nums.length || j >= nums.length
      || nums[i] + nums[j] !== target
      || JSON.stringify(nums) !== JSON.stringify(original)) {
    throw new Error(`Invalid result: ${JSON.stringify({ nums, target, result })}`);
  }
}
console.log("Two Sum: 6 cases passed");
```

### 4. 解題後：把技巧帶回工作

**這個資料結構／演算法是為了解決什麼問題？** 不想每次都把前面的資料重新找一遍。例如查 100 次商品 ID，原本每次遍歷商品清單；先建立 ID 到商品的對應後，就能重用查找結果。dict／Map 保存對應關係，Two Sum 則利用它查配對值；代價是多一份記憶體。

**現實工作中哪裡會遇到？可以改善什麼？** 前端合併訂單與商品資訊時，可把 Two Sum 的「數值 → 位置」改成「商品 ID → 商品」，減少重複掃描。對帳工具則可用金額查候選交易，但金額不唯一，還要確認帳戶、幣別、時間與是否已核銷；單一 dict 無法處理跨程序同時核銷。完整前後實作、觸發門檻與代價請完成題解頁 Stage C。

### 5. 今日驗收與一分鐘複習卡

- [ ] 先自行作答，再看分析；記下實際耗時與提示層級。
- [ ] TypeScript、Python 都跑過六組測資。
- [ ] 能由暴力解的重複操作推導 Pattern，說出時間與空間的代價。
- [ ] 能畫出每輪狀態並解釋為何兩個 index 不同。
- [ ] 已閱讀 Stage C，能說出一個工程用途和不能直接套用的界線。

完成後閉卷回答：

```txt
怎麼想到資料結構：我需要快速回答＿＿，而且還需要保存＿＿。
暴力解與瓶頸：
最佳化做法：
每輪都要保持什麼（invariant）：
時間／空間與前提：
最容易犯的錯：
工程用途與限制：
```

Tree／Graph／DP 是後續題型的通用卡關規則：先畫節點與邊、走訪順序，或列出狀態定義與轉移表，再逐步追蹤；今天 Two Sum 只需畫陣列與每輪狀態，不額外加題。

---

## Part 2｜Python 實作：list／dict／set 資料處理（50 分鐘）

### 1. 今日目標與時間分配

情境：收到一批訂單列，輸出有效訂單，並統計每種商品的數量。同一訂單 ID 只保留第一筆有效資料，數量小於等於 0 的列忽略，輸出保留有效資料原本的順序，不修改輸入。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | 建專案、虛擬環境與設定 | 能執行 Python 和 mypy |
| 10–20 | 定義資料契約、自訂測資 | 重複 ID 與無效數量的處理規則 |
| 20–35 | 用三種容器實作 | `summarize_orders` |
| 35–45 | 執行型別檢查與測試 | 通過結果或具體錯誤 |
| 45–50 | 口述資料流與成本 | 每個容器的用途、Big-O |

### 2. 建立最小專案

以下以 Python 3.10 以上、macOS／Linux shell 為例。若 Part 1 已有專案，就沿用它。

```bash
mkdir day4-python
cd day4-python
python3 -m venv .venv
source .venv/bin/activate
python -m pip install mypy
```

在根目錄建立 `pyproject.toml`：

```toml
[tool.mypy]
python_version = "3.10"
strict = true
```

這是練習用工具設定，尚未定義可發布套件。`.venv` 用來隔離套件，不存放原始碼，也不要加入版本控制。參考：[Python venv 文件](https://docs.python.org/3/library/venv.html)。

```txt
day4-python/
  .venv/
  pyproject.toml
  two_sum.py
  test_two_sum.py
  orders.py
  test_orders.py
```

### 3. list／dict／set 各自負責什麼？

| 容器 | 今天保存的內容 | 為什麼需要 |
| --- | --- | --- |
| list | 依接收順序保留的有效訂單 | 最後輸出完整資料與順序 |
| set | 已接受的訂單 ID | 快速判斷是不是重複訂單 |
| dict | 商品 ID → 累積數量 | 同一商品出現在不同訂單時累加 |

不要把訂單 ID 和商品 ID 混在一起：同一個商品可以被不同訂單購買，不能因為商品相同就把第二張訂單刪除。

先在 `orders.py` 定義契約：

```python
from typing import TypedDict


class Order(TypedDict):
    order_id: str
    product_id: str
    quantity: int


def summarize_orders(orders: list[Order]) -> tuple[list[Order], dict[str, int]]:
    raise NotImplementedError("先依契約完成自己的版本")
```

本練習假設輸入符合 `Order` 欄位型別。Type hints 和 mypy 不會在執行時替外部 JSON 驗證資料；真實 API 邊界要另外驗證。這裡只處理題目明確定義的數量與重複規則。

### 4. 先手算，再寫程式

| 輸入順序 | order_id | product_id | quantity | 預期 |
| ---: | --- | --- | ---: | --- |
| 1 | A | pen | 2 | 接受 |
| 2 | A | pen | 9 | 重複，忽略 |
| 3 | B | pen | 3 | 接受，同商品累加 |
| 4 | C | book | 0 | 無效，忽略 |
| 5 | C | book | 1 | 接受，前一筆無效不占用 ID |

輸出訂單依序為 A、B、C；商品總量為 `{"pen": 5, "book": 1}`。若先把無效訂單 ID 放進 set，第五筆會被錯誤忽略。

<details>
<summary>完成自己的版本後再看：orders.py 參考實作</summary>

保留 `Order` 定義，把函式替換成：

```python
def summarize_orders(orders: list[Order]) -> tuple[list[Order], dict[str, int]]:
    accepted: list[Order] = []
    seen_ids: set[str] = set()
    quantity_by_product: dict[str, int] = {}

    for order in orders:
        if order["quantity"] <= 0 or order["order_id"] in seen_ids:
            continue
        seen_ids.add(order["order_id"])
        accepted.append(order.copy())
        product_id = order["product_id"]
        quantity_by_product[product_id] = (
            quantity_by_product.get(product_id, 0) + order["quantity"]
        )

    return accepted, quantity_by_product
```

每輪處理前，set 只保存已接受的訂單 ID；dict 的數量只來自 accepted 中的訂單。三份資料因此維持相同的有效範圍。

使用 `copy()` 讓輸出訂單可修改而不回頭改到輸入；目前欄位全是字串與整數，淺複製足夠。未來若加入巢狀 list 或 dict，就要重新決定哪些物件可共用。

令 `n` 為輸入列數、`u` 為有效唯一訂單數、`p` 為有效商品種類；一般雜湊情況下時間平均 `O(n)`，包含輸出的空間為 `O(u + p)`。若以 `accepted` 的逐筆掃描來判斷重複，最差會變成 `O(n²)`。

這只是單批、單程序資料整理。跨批資料要另外保存已處理 ID；多個服務同時處理相同訂單時，還需要資料庫唯一性約束等協調機制。

</details>

### 5. 測試與型別檢查

存成 `test_orders.py`：

```python
import unittest
from orders import Order, summarize_orders


class OrderTests(unittest.TestCase):
    def test_empty(self) -> None:
        self.assertEqual(summarize_orders([]), ([], {}))

    def test_duplicates_totals_and_order(self) -> None:
        rows: list[Order] = [
            {"order_id": "A", "product_id": "pen", "quantity": 2},
            {"order_id": "A", "product_id": "pen", "quantity": 9},
            {"order_id": "B", "product_id": "pen", "quantity": 3},
            {"order_id": "C", "product_id": "book", "quantity": 0},
            {"order_id": "C", "product_id": "book", "quantity": 1},
        ]
        original = [row.copy() for row in rows]
        accepted, totals = summarize_orders(rows)
        self.assertEqual(accepted, [rows[0], rows[2], rows[4]])
        self.assertEqual(totals, {"pen": 5, "book": 1})
        self.assertEqual(rows, original)
        accepted[0]["quantity"] = 99
        self.assertEqual(rows[0]["quantity"], 2)

    def test_invalid_then_valid(self) -> None:
        rows: list[Order] = [
            {"order_id": "A", "product_id": "pen", "quantity": -2},
            {"order_id": "A", "product_id": "book", "quantity": 1},
        ]
        self.assertEqual(summarize_orders(rows), ([rows[1]], {"book": 1}))

    def test_all_invalid(self) -> None:
        rows: list[Order] = [
            {"order_id": "A", "product_id": "pen", "quantity": 0},
            {"order_id": "B", "product_id": "book", "quantity": -1},
        ]
        self.assertEqual(summarize_orders(rows), ([], {}))


if __name__ == "__main__":
    unittest.main()
```

在練習專案根目錄執行：

```bash
python -m mypy orders.py test_orders.py two_sum.py test_two_sum.py
python -m unittest discover -v
```

mypy 檢查程式的型別一致性，unittest 檢查實際行為；兩者都通過才符合今日驗收。第一次自訂版本若失敗，保留錯誤與修正原因。參考：[mypy 命令列文件](https://mypy.readthedocs.io/en/stable/command_line.html)。

### 6. Python 今日驗收

- [ ] 建好環境，能說明目前用哪個 Python 執行。
- [ ] 能分別說明 list 保序、set 查重、dict 累加的責任。
- [ ] 測試涵蓋空輸入、重複 ID、同商品不同訂單、無效數量與輸入不被修改。
- [ ] 通過型別檢查，也理解它不等於 runtime validation。
- [ ] 能說明平均時間與額外空間，以及跨批／多程序的界線。

---

## Part 3｜收尾（10 分鐘）

前 4 分鐘重跑測試與型別檢查，中間 3 分鐘記錄卡點，最後 3 分鐘把未完成步驟改寫成週末可直接執行的任務。

| 主題 | 卡點 | 根因分類 | 下一個最小行動 |
| --- | --- | --- | --- |
| Two Sum | ＿＿＿＿ | 契約／Pattern／實作／測試／Big-O | ＿＿＿＿ |
| Python | ＿＿＿＿ | 環境／型別／查重／累加／複製 | ＿＿＿＿ |
| System Design（Combo 後填） | ＿＿＿＿ | 偵測／降級／恢復／流量 | ＿＿＿＿ |

### 未完成才加入的週末補課清單

- [ ] 週六 30 分鐘：閉卷重寫 Two Sum 的 TypeScript 與 Python，跑六組測資，口述每輪狀態與 Big-O。
- [ ] 週六 25 分鐘：完成訂單整理函式，修到 mypy 與四個 unittest 測試都通過。
- [ ] 週日 20 分鐘：重寫三個故障點的偵測、fallback、恢復條件，錄一段 3 分鐘口述。

以上只勾選需要補課的項目；已完成就移除。System Design 的結果在 20 分鐘 Combo 結束後補填，未完成也不延後下週主線。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：列三個 Failure Points 與 Fallback

沿用前幾天的即時價格 Watchlist。Failure point 是「哪一段會壞」，fallback 是「壞掉時還能提供什麼有限功能」。先決定使用者看到什麼，再選擇技術處理方式。

今天依本週四步框架回答：需求 → 容量假設 → 最小架構 → 故障與取捨。數字都是練習假設，不是真實系統量測。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–3 | 確認需求與假設 | 看價格、保存清單；行情可標記過期，寫入不可假成功 |
| 3–6 | 畫最小資料流 | 標出三個故障點 |
| 6–14 | 填故障表 | 偵測、使用者狀態、fallback、恢復 |
| 14–18 | 主動產出至少一項 | 小圖／三個數字／failure case／口述 |
| 18–20 | 驗收與記錄 | 未完成內容移入週末 |

### 1. 先自己填

```txt
故障點一：
如何知道它壞了：
使用者會看到什麼：
暫時能提供什麼功能：
何時可以恢復正常：
降級後會不會壓垮另一個元件：

故障點二：依上面六欄填寫。
故障點三：依上面六欄填寫。
```

<details>
<summary>寫完後對照：三個故障點與降級方式</summary>

| 故障點 | 偵測方式 | Fallback 與使用者狀態 | 恢復條件與代價 |
| --- | --- | --- | --- |
| 瀏覽器到 WebSocket Gateway 斷線 | heartbeat 逾時、連線關閉、序號缺口 | 顯示 reconnecting／stale 與最後更新時間；有容量才對可見標的啟用限速 HTTP snapshot 輪詢 | 退避加隨機延遲重連；取可銜接版本的 snapshot 後才接增量，否則重新同步；輪詢會增加 API 壓力 |
| 行情上游停止更新 | 連線仍存在，但來源事件時間或序號長時間不前進 | 顯示最後已知值並標 stale；若無資料顯示暫無報價；不可把相同來源的 HTTP 回應當成新行情 | 確認來源恢復且資料新鮮度達標，再重新同步；歷史值只能供參考，不能假裝即時 |
| Watchlist 資料庫不可用 | DB timeout、錯誤率升高、連線池等待增加 | 已有本機清單可供唯讀展示並標記未同步；無副本則明確顯示暫不可用；新增／刪除不回成功 | DB 健康檢查與實際查詢恢復後，重新讀取；寫入逾時可能已提交，依操作 ID 查狀態，不能盲目重送 |

這三種故障影響不同：斷線不一定代表上游停止，上游停止也不一定有網路錯誤，而清單保存故障不應被隱藏成成功。Fallback 必須有使用界線與恢復條件。

</details>

### 2. 主動產出：至少完成一項

下面提供練習骨架；閱讀範例不算完成，要自己重畫、重算、改寫或口述。

#### [ ] 一張小圖

```txt
行情來源 ──→ Gateway ──→ Browser
   F2          F1          │
                          ├─ 顯示價格與最後更新時間
                          └─ Watchlist API ──→ DB（F3）

F1：斷線，標 stale，退避重連；有容量才限速輪詢
F2：上游停更，保留帶時間的最後值；無資料則顯示不可用
F3：保存失敗，唯讀降級，寫入不假成功
```

#### [ ] 三個數字

```txt
假設 10,000 個線上客戶端一起斷線。
每個客戶端每 5 秒取得一次批次 snapshot。
額外平均 QPS = 10,000 ÷ 5 = 2,000。
```

這是分散請求後的平均值，若大家同秒送出，尖峰會更高。假設 API 剩餘容量只有 500 QPS，要涵蓋全部客戶端，平均輪詢間隔至少需 `10,000 ÷ 500 = 20 秒`，還要保留安全餘裕並加入隨機延遲。若新鮮度不能接受，就限制可輪詢人數或暫停輪詢，不能宣稱 fallback 沒有成本。

#### [ ] 一個 Failure Case

```txt
觸發：關閉行情上游，但保留 Gateway 到瀏覽器的連線。
假設：這個標的正常每秒有更新，超過 5 秒未更新就標 stale。
預期：畫面仍保留最後值與原時間，顯示 stale；不因 heartbeat 正常就顯示即時。
恢復：重新取得新鮮 snapshot，確認序號銜接後再套用增量。
驗證：記錄最後行情時間、stale client 數、重新同步時間。
```

五秒只適用今天的活躍行情假設；休市或低成交標的需用來源健康訊號與市場狀態判斷，不能一律當故障。

#### [ ] 3 分鐘口述

```txt
0:00–0:30  需求與品質：價格可標 stale，清單寫入不可假成功
0:30–1:00  最小架構與三個故障點
1:00–2:20  各自怎麼偵測、降級與恢復
2:20–2:50  輪詢 QPS 計算，說明容量不足時怎麼收斂
2:50–3:00  總結選擇與一個代價
```

### 3. 今日 System Design 驗收

- [ ] 列出三個不同故障點，而不是三次寫「server 壞掉」。
- [ ] 每個都有偵測、使用者狀態、fallback 和恢復條件。
- [ ] 能指出哪個 fallback 會增加下游負載，並估算成本。
- [ ] 至少完成一項自己的主動產出。
- [ ] 未完成內容已移入週末，不影響下週主線。

---

## 今日結束打卡

```txt
實際開始／結束：＿＿＿＿～＿＿＿＿
Two Sum：未完成／提示後完成／閉卷完成
Pattern 判斷與理由：
TypeScript 測試：＿＿＿＿；Python 測試：＿＿＿＿
Python 型別檢查：未完成／通過／錯誤＿＿＿＿
Python 資料處理：未完成／完成
System Design 三個故障點：＿＿＿＿、＿＿＿＿、＿＿＿＿
System Design 主動產出：小圖／三個數字／failure case／3 分鐘口述

今天最重要的理解：
今天仍不穩的地方：
週末補課的唯一優先項目與完成條件：
```

明天開始前，閉卷回答：Two Sum 為何不能用同一位置兩次？三種 Python 容器各保存什麼？型別檢查通過為何還要測試？斷線後全面輪詢會增加多少 QPS？
