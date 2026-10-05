---
sidebar_position: 4
sidebar_label: "Day 4"
slug: "/career-blueprint/week-04-day-04"
title: "第 4 週 Day 4：Container With Most Water、Python domain error 與快取高併發"
description: "140 分鐘日課：完成 Container With Most Water 的 Pattern 推導、程式、測試與 Big-O；拆 Python package 並建立 domain error；練習 cache stampede、penetration 與 hot key。"
tags: [Career, Interview, NeetCode 150, Python, System Design]
keywords: ["Container With Most Water", "Two Pointers", "Python package", "domain error", "exception", "cache stampede", "cache penetration", "hot key", "Caching"]
---

# 第 4 週 Day 4：Container With Most Water、Python domain error 與快取高併發

> 安排日期：2026-10-01；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 本週 NC150 分類：Two Pointers  
> 本週 System Design 主題：Caching

接續[第 4 週 Day 3](/docs/career-blueprint/week-04-day-03)。今天從「枚舉所有兩條線」的成本，推導如何安全排除一批配對；Python 練習則把昨日的 package 與例外概念整理成有邊界的小程式。以下參考答案請在留下自己的第一版後再展開；勾選與實測紀錄依實際結果填寫，網站上的 Markdown 清單不會自動保存作答。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘：** 指定 Container With Most Water，完成 Pattern 判斷、程式、測試與 Big-O；Tree／Graph／DP 題型卡住時優先畫圖、定義並追蹤狀態，不套用到今天的題目分類。
- [ ] **Python 實作｜50 分鐘：** 拆 package，建立 domain error，讓未知例外繼續往上傳，不以 `except Exception: pass` 吞掉錯誤。
- [ ] **收尾｜10 分鐘：** 執行測試，保存實際輸出，將未完成步驟移入週末補課清單。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘：** 本週 Caching；處理 cache stampede／penetration／hot key，至少完成小圖、三個數字、failure case、3 分鐘口述其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。System Design 若未完成，加入週末補課清單；**不影響下週主線。**

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Container With Most Water | Pattern 推導、第一版程式、測試輸出、Big-O |
| 21:30–22:20 | Python package 與 domain error | 檔案結構、成功／已知錯誤／未知錯誤測試 |
| 22:20–22:30 | 收尾 | 測試指令與結果、未完成項與補做動作 |
| 22:30–22:50 | Caching Combo | 小圖、三個數字、failure case 或口述至少一項 |

---

## Part 1｜NeetCode 150：Container With Most Water（60 分鐘）

完整的題目契約、分層提示、TypeScript／Python 實作與工程遷移見 [LeetCode 11｜Container With Most Water](/docs/algorithms/leetcode/f0001-0100/l0011-container-with-most-water)。先讀該頁 Stage A 並自行作答；今天的任務是實際寫出和驗證，而非閱讀現成解答。題目從高度陣列中選兩條線，回傳最大容器面積；寬度是兩位置距離，高度由較矮的線限制。這題不計算中間每格的積水。

| 分鐘 | 動作 | 留下什麼 |
| ---: | --- | --- |
| 0–8 | 讀題與手算測資 | 輸入／輸出、面積公式與預期值 |
| 8–18 | 寫最直接解法，估算成本 | 枚舉多少對、每對做什麼 |
| 18–30 | 推導 Pattern，寫第一版 | 每次移動為何不漏最佳答案；不開提示 |
| 30–45 | TypeScript／Python 實作與修正 | 第一版、修正原因與提示層級 |
| 45–55 | 跑一般及邊界測資 | 預期／實際結果，保留失敗紀錄 |
| 55–60 | 寫 Big-O 並閉卷口述 | 時間、額外空間與指標移動理由 |

### 先判斷 Pattern，不先背名稱

用自己的話回答：如果檢查每一對線，長度為 `n` 時有多少對？若從最寬的一對開始，寬度往內縮時，換哪一側才**可能** 補回寬度損失？先寫出排除理由，再替做法命名。

```txt
最直接做法：＿＿＿＿＿＿
它的成本：＿＿＿＿＿＿
目前左高、右低時，我會移動哪端？理由：＿＿＿＿＿＿
我的 Pattern 判斷與適用前提：＿＿＿＿＿＿
```

**單選｜目前左端高 8、右端高 3，將右端固定而把左端往內移，為何無法得到更大面積？**

- [ ] A. 新寬度變小，水高仍最多是右端的 3。
- [ ] B. 因為左端的高度必定是整個陣列最高。
- [ ] C. 因為所有 Two Pointers 題目都固定較矮的一端。

<details>
<summary>寫完自己的排除理由後核對</summary>

**答案：A。** 固定較矮的右端時，任何更靠內的左端都讓寬度變小，水高仍不超過 3；這批配對不可能勝過目前已計算的配對。因此可以捨棄較矮端，嘗試找到更高的邊。這個推導才是本題使用兩端指標的理由，並非只看見「兩條線」就套 Pattern。兩端等高時任選一端移動都可，但程式規則要一致。

</details>

### 閉卷實作與測試

先從空白完成 `maxArea(height: number[]): number` 與 `max_area(height: list[int]) -> int`。可用暴力解驗證小陣列的預期值，但 30 分鐘第一版要保留，不要用參考答案覆蓋。若要核對完整雙語實作，完成後再看題解的 Stage B。

| 高度 | 預期最大面積 | 驗證點 |
| --- | ---: | --- |
| `[1, 8, 6, 2, 5, 4, 8, 3, 7]` | `49` | 官方例；選到位置 1 與 8 |
| `[1, 1]` | `1` | 最短合法輸入 |
| `[0, 0]` | `0` | 高度為零 |
| `[5, 5, 5]` | `10` | 等高時的移動規則 |
| `[1, 2, 3, 4]` | `4` | 單調遞增 |
| `[4, 3, 2, 1]` | `4` | 單調遞減 |
| `[2, 100, 2]` | `4` | 不把中間高柱當作必然最佳 |

<details>
<summary>實作與測試後，核對 Pattern、狀態與 Big-O</summary>

暴力解檢查每一對，約 `n(n - 1) / 2` 次，每次計算 `(right - left) × min(height[left], height[right])`，時間 `O(n²)`。優化後從兩端出發，先計算當前面積，再移動較矮端；每輪至少縮小一格，至多 `n - 1` 輪，時間 `O(n)`、額外空間 `O(1)`，且不修改輸入。

**每輪要保持什麼（invariant）？** 已排除的端點，不可能與尚在區間內的另一端組成比先前計算結果更大的面積；因此目前最佳值不會漏掉被排除的答案。若左端較矮，固定左端改選更靠內的右端，只會讓寬度變小，水高仍不超過左高，於是可以丟掉左端；右端較矮時對稱。

</details>

**驗收：**

- [ ] 保留 Pattern 推導與第一次作答，記下是否看過提示。
- [ ] 程式實際跑過上表測資；失敗時保留預期／實際與修正原因。
- [ ] 能說明移動較矮端的排除證明，而非只說「因為雙指標」。
- [ ] Big-O 有列出暴力與優化版本的成本來源。

> 後續若在 Tree／Graph／DP 卡住：Tree／Graph 先畫節點、邊與走訪順序；DP 先定義 `state` 代表什麼，再列初值、轉移和一張小表逐格追蹤。今天是陣列兩端指標題，優先畫兩端位置與每輪面積。

---

## Part 2｜Python 實作：拆 package、domain error、不吞 exception（50 分鐘）

沿用昨日的商品查詢練習，把「資料與業務規則」放在 `catalog` package，把命令列顯示放在入口。**Domain error** 是業務規則預期會發生的錯誤，例如商品不存在；未知程式錯誤不應假裝成「查無商品」。Python 的 [package 與 import 說明](https://docs.python.org/3/tutorial/modules.html)及[例外處理說明](https://docs.python.org/3/tutorial/errors.html)可在實作後核對。

| 分鐘 | 動作 | 證據 |
| ---: | --- | --- |
| 0–8 | 畫出 package 邊界與三條路徑 | 成功、商品不存在、未知故障 |
| 8–25 | 建立 `errors.py`、`service.py`、入口 | 可用 `python -m shop` 執行 |
| 25–38 | 寫 `unittest` 並跑三條路徑 | 指令、測試結果與錯誤型別 |
| 38–45 | 故意讓儲存層拋出 `RuntimeError` | 確認沒有被轉成「查無商品」 |
| 45–50 | 閉卷說明責任邊界 | 哪層定義、拋出、捕捉 domain error |

### 先畫邊界

```txt
practice/
├── shop/
│   ├── __init__.py
│   ├── __main__.py      # 入口：把已知錯誤轉成使用者訊息
│   └── catalog/
│       ├── __init__.py
│       ├── errors.py    # 業務錯誤型別
│       └── service.py   # 查詢與業務規則
└── tests/
    └── test_catalog.py
```

從 `practice/` 執行 `python -m shop` 與 `python -m unittest discover -s tests -v`。`__main__.py` 使用絕對 import，執行時由 Python 辨認 package；不要直接跑內層 `service.py` 來賭 import 路徑。`__init__.py` 本例可保持空白。

**單選｜儲存層意外拋出 `RuntimeError`，哪個處理符合「不要吞 exception」？**

- [ ] A. `except Exception: return None`，再顯示查無商品。
- [ ] B. 入口只捕捉 `ProductNotFoundError`；未知錯誤保留 traceback 交給上層處理。
- [ ] C. 所有錯誤都用 `finally` 改成成功結果。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 找不到商品是已知業務結果；儲存層或程式故障需要可觀測且可排查。若在基礎設施邊界轉換已知的外部錯誤，應捕捉具體型別，必要時用 `raise DomainError(...) from exc` 保留原始原因；不要無條件把未知錯誤轉成 domain error。

</details>

<details>
<summary>先自行實作、跑測試，再核對最小參考程式</summary>

`shop/catalog/errors.py`：

```python
class ProductNotFoundError(Exception):
    def __init__(self, product_id: int) -> None:
        self.product_id = product_id
        super().__init__(f"Product {product_id} not found")
```

`shop/catalog/service.py`：

```python
from collections.abc import Callable

from shop.catalog.errors import ProductNotFoundError


def get_product(product_id: int, load: Callable[[int], str | None]) -> str:
    product = load(product_id)
    if product is None:
        raise ProductNotFoundError(product_id)
    return product
```

`shop/__main__.py`：

```python
from shop.catalog.errors import ProductNotFoundError
from shop.catalog.service import get_product


def load_product(product_id: int) -> str | None:
    return {1: "Notebook"}.get(product_id)


def main() -> None:
    try:
        print(get_product(1, load_product))
        print(get_product(2, load_product))
    except ProductNotFoundError as exc:
        print(f"找不到商品：{exc.product_id}")


if __name__ == "__main__":
    main()
```

`tests/test_catalog.py`：

```python
import unittest

from shop.catalog.errors import ProductNotFoundError
from shop.catalog.service import get_product


class CatalogTests(unittest.TestCase):
    def test_found(self) -> None:
        self.assertEqual(get_product(1, lambda _: "Notebook"), "Notebook")

    def test_not_found(self) -> None:
        with self.assertRaises(ProductNotFoundError) as caught:
            get_product(2, lambda _: None)
        self.assertEqual(caught.exception.product_id, 2)

    def test_unknown_error_propagates(self) -> None:
        def broken_load(_product_id: int) -> str | None:
            raise RuntimeError("storage unavailable")

        with self.assertRaisesRegex(RuntimeError, "storage unavailable"):
            get_product(1, broken_load)


if __name__ == "__main__":
    unittest.main()
```

本例入口只接住已知的 `ProductNotFoundError`；`RuntimeError` 會繼續往上傳。正式服務可在最外層記錄例外並回應一般性錯誤，但不能讓失敗悄悄變成正常查詢結果。

</details>

### 驗收與錯誤紀錄

**單選｜下列哪個測試最能證明未知錯誤沒有被吞掉？**

- [ ] A. 只測商品 1 回傳 Notebook。
- [ ] B. 讓 `load` 拋出 `RuntimeError`，斷言 `get_product` 也拋出同一類錯誤。
- [ ] C. 只檢查 `errors.py` 檔名存在。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 成功路徑與檔案存在，無法證明錯誤路徑有保留失敗訊號。

</details>

- [ ] `python -m shop` 顯示成功商品與已知找不到訊息。
- [ ] 三個測試都實際執行，保留指令與結果。
- [ ] 能說明 `None` 是「找不到」，而未知例外表示程式或依賴故障。
- [ ] 程式中沒有 `except Exception: pass` 或把所有例外轉成 `None`。

---

## Part 3｜收尾：執行測試與移入週末補課（10 分鐘）

先重跑演算法測資與 Python 測試，再記錄**實際** 結果。筆記內的預期值和參考程式不等於你已完成測試。

| 分鐘 | 動作 | 留下什麼 |
| ---: | --- | --- |
| 0–5 | 執行本日演算法測資與 `python -m unittest discover -s tests -v` | 指令、成功／失敗數與第一個失敗 |
| 5–8 | 把未完成步驟各寫成可執行動作 | 卡點、預估時間、完成證據 |
| 8–10 | 勾選今日狀態與週末補課 | 不把未做的工作標完成 |

| 測試／步驟 | 實際指令或證據位置 | 實際結果／卡點 | 週末最小補做動作 |
| --- | --- | --- | --- |
| Container With Most Water 測資 | `＿＿＿` | `＿＿＿` | `＿＿＿` |
| Python 成功與錯誤路徑 | `＿＿＿` | `＿＿＿` | `＿＿＿` |
| Caching Combo 產出 | `＿＿＿` | `＿＿＿` | `＿＿＿` |

若全數完成，在補做欄寫「無」；測試失敗時保留失敗輸出，修正並重跑後再標記完成。

---

## Part 4｜每日 System Design × 高併發 Combo：stampede、penetration、hot key（20 分鐘）

### 今日微題

商品詳情 API 使用 Redis cache-aside：讀取先查 cache，miss 才查 DB。熱門商品剛好過期、有人反覆查不存在的 ID、單一超熱門商品被大量讀取，這三種情況各自讓哪一層先承壓？先畫正常路徑，再標出三種異常。概念可接續[昨日的快取失效練習](/docs/career-blueprint/week-04-day-03)與 [Redis cache-aside 說明](https://redis.io/docs/latest/develop/use-cases/cache-aside/)。

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–5 | 畫 `Client → API → Redis → DB` | hit、miss、回填和 TTL |
| 5–10 | 分清三種現象的觸發條件 | 哪種是同時 miss、哪種是永遠不存在、哪種集中打同一 key |
| 10–15 | 各挑一個保護策略，說出限制 | 合併回源、負面快取／驗證、熱點分散或本地快取 |
| 15–20 | 交付四選一並檢查 failure case | 小圖／三個數字／failure case／3 分鐘口述 |

| 現象 | 具體觸發 | 主要風險 | 可先採取的手段與代價 |
| --- | --- | --- | --- |
| Cache stampede | 熱門 key 同時過期，大量請求一起 miss | DB 突增回源量 | 同 key 請求合併、TTL 錯峰；跨實例仍需協調，等待者可能增加延遲 |
| Cache penetration | 大量查不存在的 ID，cache 和 DB 都找不到 | 每次都打 DB | 對「確認不存在」結果短 TTL 負面快取；需防止資料新建後仍讀到不存在，且要限制惡意輸入 |
| Hot key | 單一 key 即使一直 hit，請求仍集中在同一 Redis 節點 | Redis 節點頻寬、CPU 或網路瓶頸 | 讀取副本／本地短 TTL 快取或適當分散；增加一致性與失效成本 |

**單選｜某商品 key 一直命中，但 Redis 某個節點 CPU 飆高；這最直接是哪種問題？**

- [ ] A. Cache penetration，因為所有請求都 miss。
- [ ] B. Hot key，因為流量集中在同一 key／節點。
- [ ] C. Cache stampede，因為一定是 TTL 過期。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 命中率高並不代表快取節點沒有瓶頸。Stampede 要看同時過期後的 miss 與 DB 回源；penetration 要看無效 ID 與持續 miss。

</details>

<details>
<summary>自己產出後核對一張參考小圖</summary>

```txt
Client → API → GET Redis(product:42)
                 ├─ hit → 回傳（hot key 可使此節點過載）
                 └─ miss → DB 查詢 → SET Redis + TTL → 回傳
                            ├─ 熱門 key 同時失效：多個 miss 一起打 DB（stampede）
                            └─ 商品不存在：若不記短期「不存在」，下次仍打 DB（penetration）
```

</details>

**三個數字（情境假設，不是實測）：** 假設熱門商品 `2,000 reads/s`、平常命中率 `95%`、DB 可承受此查詢 `300 reads/s`。平常回源量約 `100/s`；若 key 同時過期且未合併回源，短時需求可接近 `2,000/s`，約為平常 `20` 倍且超出此假設的 DB 容量。請自行寫出三個數字及單位，並說明同 key 請求合併後仍要量測等待時間與失敗時的行為。

**一個 failure case：** 熱門 key 到期時，負責重建快取的請求逾時；等待者如何返回或重試？觀測 Redis hit rate、DB QPS、API p95、逾時率；限制同時回源量，必要時短暫提供可接受的舊資料。若資料不能容忍舊值，改用受控錯誤回應，而不是把過期資料當最新。

**3 分鐘口述順序：** 正常讀取路徑 → 三種觸發條件 → 每種主要受壓層 → 一個策略及代價 → 一個故障時的降級與指標。至少交付一項自己的小圖、三個數字、failure case 或錄音；讀過上面的參考材料不算產出。

- [ ] 自己畫一張小圖，標出三種異常發生在哪裡。
- [ ] 自己算三個數字，包含假設、單位與容量比較。
- [ ] 自己寫一個 failure case，包含使用者現象、觀測與補救。
- [ ] 完成 3 分鐘口述並記下一個答不出的追問。

---

## 今日完成檢查

每列只選一種真實狀態；參考答案不等於自己完成。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| Container With Most Water 的 Pattern、程式、測試與 Big-O | [ ] | [ ] | [ ] |
| Python package、domain error 與三條路徑測試 | [ ] | [ ] | [ ] |
| 收尾測試紀錄與未完成標記 | [ ] | [ ] | [ ] |
| Caching Combo 至少一項主動產出 | [ ] | [ ] | [ ] |

### 未完成才加入的週末補課清單

- [ ] 演算法缺 Pattern 推導、程式、測試或 Big-O：週末保留 30 分鐘，先畫兩端狀態，從空白重寫並跑上表測資。
- [ ] Python package 或錯誤處理未驗證：週末保留 25 分鐘，補三條路徑的測試；特別確認未知例外會往上傳。
- [ ] 收尾測試輸出或未完成紀錄尚缺：週末保留 10 分鐘，重跑測試並寫下指令與失敗原因。
- [ ] Caching Combo 尚無主動產出：週末保留 20 分鐘，補小圖、三個數字、failure case 或 3 分鐘口述；**不影響下週主線。**
- [ ] 今日全部完成，無需補課。此項不可與上面任一補課項同時勾選。

明天開始前閉卷回答：為什麼容器題可丟掉較矮端？domain error 與未知故障由哪層處理？高命中率下，為何仍可能有 hot key 問題？
