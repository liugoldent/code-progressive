---
sidebar_position: 2
sidebar_label: "Day 2"
slug: "/career-blueprint/week-04-day-02"
title: "第 4 週 Day 2：3Sum、Python package 與 cache-aside 讀寫"
description: "140 分鐘日課：3Sum 前 30 分鐘獨立嘗試；Python package、import、自訂 exception 與 finally；閉卷回想 React reducer；畫 cache-aside 讀寫與失效流程。"
tags: [Career, Interview, NeetCode 150, Python, React, System Design]
keywords: ["3Sum", "Two Pointers", "Python package", "import", "custom exception", "finally", "React reducer", "cache-aside", "Caching"]
---

# 第 4 週 Day 2：3Sum、Python package 與 cache-aside 讀寫

> 安排日期：2026-09-29；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 本週 NC150 分類：Two Pointers  
> 本週 System Design 主題：Caching

接續[第 4 週 Day 1](/docs/career-blueprint/week-04-day-01)。昨天用排序陣列找一組兩數和；今天 3Sum 要找**所有不重複的數值三元組**。先保存自己的推導與第一版，再開提示。勾選狀態只代表實際完成；網站上的 Markdown 清單不會自動保存作答。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：3Sum 前 30 分鐘獨立嘗試；其餘時間看提示、修正、測試與寫 Big-O。看過答案不算完成。
- [ ] **Python 次主線｜45 分鐘**：理解並實作 package、import、自訂 exception、`finally`。
- [ ] **React 回想｜15 分鐘**：不看稿講出昨天 reducer、action、transition 的心智模型與一個 trade-off。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：畫 cache-aside read/write 流程；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。請另存第一版程式、測試輸出、口述或圖。提示後修好時，標成「提示後完成」；要算獨立完成，需關掉參考後從空白重寫並實測。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | 3Sum | 30 分鐘第一版、提示紀錄、測試與 Big-O |
| 21:30–22:15 | Python 次主線 | package 結構、成功與失敗路徑的測試輸出 |
| 22:15–22:30 | React 回想 | 閉卷口述與一個取捨 |
| 22:30–22:50 | Caching Combo | 讀寫流程及至少一項主動產出 |

---

## Part 1｜NeetCode 150：3Sum（60 分鐘）

完整題目契約、分層提示、TypeScript／Python 實作與工程延伸見 [LeetCode 15｜3Sum](/docs/algorithms/leetcode/f0001-0100/l0015-3Sum)。前 30 分鐘只看該頁 Stage A 的題意、限制與測資；不要展開提示或 Stage B。

| 分鐘 | 動作 | 留下什麼 |
| ---: | --- | --- |
| 0–5 | 讀題，分清回傳數值或索引 | 契約、限制、重複三元組的定義 |
| 5–10 | 手算官方與自訂測資 | 預期結果；不先執行參考程式 |
| 10–30 | 獨立推導、實作、試跑 | 第一版與卡點；不看提示或答案 |
| 30–40 | 按需逐層開提示並修正 | 記下看到哪一層、改了哪一行及原因 |
| 40–52 | 跑測試，檢查漏解與重複 | 實際輸出、失敗測資與修正 |
| 52–60 | 寫 Big-O、閉卷口述 | 排序、外層、內層及額外空間成本 |

### 先確認契約，再寫第一版

輸入是至少 3 個整數，回傳所有和為 0 的三個**數值**；三個位置須不同，相同數值組合只回傳一次，輸出順序不限。官方最大長度為 3000。先寫出最直接的正確解，再問如何降低枚舉量；也要決定是否允許排序原輸入，並在空間分析保持一致。

**單選｜`[0, 0, 0, 0]` 應回傳什麼？**

- [ ] A. 四份 `[0, 0, 0]`，因為有四種選位置的方法。
- [ ] B. 一份 `[0, 0, 0]`，因為回傳的是不重複的數值組合。
- [ ] C. 空陣列，因為三個數值必須不同。

<details>
<summary>完成第一次作答後再核對</summary>

**答案：B。** 位置須不同，數值可以相同；同一組數值只保留一次。

</details>

先自行填三句計畫：固定了什麼？剩下要找什麼？如何保證不漏解、也不重複？以下測資請先手算，再實際執行；比較三元組時可先各自排序，再比較整體集合。

| 輸入 | 預期數值組合 | 驗證點 |
| --- | --- | --- |
| `[-1, 0, 1, 2, -1, -4]` | `[[-1, -1, 2], [-1, 0, 1]]` | 官方例；兩種答案與去重 |
| `[0, 1, 1]` | `[]` | 無答案 |
| `[0, 0, 0]` | `[[0, 0, 0]]` | 相同數值、不同位置 |
| `[0, 0, 0, 0]` | `[[0, 0, 0]]` | 不可輸出重複組合 |
| `[-2, 0, 0, 2, 2]` | `[[-2, 0, 2]]` | 內層重複值 |
| `[1, 2, 3]` | `[]` | 全正數 |

在第 30 分鐘保存第一版與測試結果；沒解出也照實記錄。第 30 分鐘後才看[既有筆記的分層提示與 Stage B](/docs/algorithms/leetcode/f0001-0100/l0015-3Sum)，逐一修正，不用參考程式覆蓋第一版。

<details>
<summary>寫完自己的分析後，核對複雜度與不變量</summary>

最直接枚舉三個不同位置需 `O(n³)` 次檢查。排序後逐一固定一個數，對右側區間用兩端指標找配對；外層至多 `n` 次，內層每次線性移動，合計 `O(n²)` 時間，排序 `O(n log n)` 不改總上界。命中後兩端都向內移並跳過相同值，外層也跳過重複固定值；每輪仍只在固定值右側搜尋。若原地排序，演算法額外空間取決於語言排序實作，不能無條件宣稱 `O(1)`；若像既有題解先複製陣列，工作陣列是 `O(n)`，結果空間另計。詳見題解的雙語實作與成本說明。

</details>

**驗收：**

- [ ] 保留 30 分鐘第一版、卡點與提示層級。
- [ ] 實際跑完上表 6 組，修掉重複或漏解。
- [ ] 能說明「排序後固定一個值」如何把剩下問題變成兩數和。
- [ ] Big-O 分開寫排序、外層、內層、工作陣列與輸出空間。

---

## Part 2｜Python 次主線：package、import、exception、finally（45 分鐘）

用小型商品查詢程式串起四個觀念：`catalog` 是 package，`service.py` 是 module；`from catalog.service import ...` 載入明確名稱；找不到商品時拋出業務例外；查詢結束時無論成功或拋錯，都記錄 `finally` 中的清理動作。Package 與 module 的基本規則參考 [Python Modules](https://docs.python.org/3/tutorial/modules.html)；例外與 `finally` 參考 [Python Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)。

| 分鐘 | 練習 | 證據 |
| ---: | --- | --- |
| 0–8 | 畫目錄並說明 package、module、import | 可以指出每個名稱來自哪個檔案 |
| 8–20 | 建立兩個檔案與自訂例外 | 成功路徑可執行 |
| 20–32 | 加入錯誤路徑與 `finally` | 對照成功、失敗兩種 trace |
| 32–40 | 關掉範例，從空白重寫關鍵部分 | 自己的 import、raise、except、finally |
| 40–45 | 執行測試並口述 | 預測與實際輸出、何時該用 `with` |

先自己建立下列結構，稍後從 `practice/` 目錄執行 `python -m app`；`__init__.py` 可以是空檔，這裡用它清楚標示 package。若自己的專案已有同名 `app`，請換獨立練習目錄。

```txt
practice/
├── catalog/
│   ├── __init__.py
│   └── service.py
└── app.py
```

在 `catalog/service.py` 自己寫 `ProductNotFoundError(Exception)` 與 `get_product(product_id)`：`1` 回傳商品名稱，其他 ID 拋出自訂例外。`app.py` 用 `from catalog.service import ...` 匯入；呼叫函式，分別記錄成功、找不到、清理事件。請先預測下方參考程式的 `events`，再展開。

<details>
<summary>自己完成並測試後，看最小參考實作</summary>

`catalog/service.py`：

```python
class ProductNotFoundError(Exception):
    pass


def get_product(product_id: int) -> str:
    if product_id != 1:
        raise ProductNotFoundError(f"product {product_id} not found")
    return "keyboard"
```

`app.py`：

```python
from catalog.service import ProductNotFoundError, get_product


def run(product_id: int) -> list[str]:
    events: list[str] = []
    try:
        events.append(get_product(product_id))
    except ProductNotFoundError:
        events.append("not found")
    finally:
        events.append("cleanup")
    return events


if __name__ == "__main__":
    assert run(1) == ["keyboard", "cleanup"]
    assert run(9) == ["not found", "cleanup"]
    print("success and failure paths passed")
```

在 `practice/` 執行 `python -m app`。成功與已處理的找不到路徑都會走到 `finally`。`finally` 也會在未被這個 `except` 接住的例外傳遞前執行；不要在其中 `return` 或拋出無關例外來遮住原始錯誤。

</details>

**觀念核對：** `import catalog.service` 會把 module 名稱帶入目前命名空間，用 `catalog.service.get_product(...)` 存取；`from catalog.service import get_product` 則直接綁定該名稱。`except ProductNotFoundError` 只接這一類預期的業務錯誤，不要用空白 `except:` 吞掉所有問題。`finally` 適合保證釋放資源；檔案與鎖等支援 context manager 的資源，通常優先使用 `with` 管理。

- [ ] 能指出 package、module 與匯入名稱各在何處。
- [ ] 自己完成成功與找不到兩條路徑，保存測試輸出。
- [ ] 能說出 `except` 負責處理特定錯誤，`finally` 負責兩條路徑都要做的清理。
- [ ] 能說明清理失敗或 `finally` 中的 `return` 為何會影響原始錯誤。

---

## Part 3｜React 回想：reducer transition（15 分鐘）

回想[昨天的表單 reducer 練習](/docs/career-blueprint/week-04-day-01)，今天不開新主題。把筆記蓋住，想像「輸入名稱 → 按儲存 → API 成功／失敗 → 修改後重試」。

| 分鐘 | 閉卷動作 |
| ---: | --- |
| 0–5 | 口述 state、action、reducer 各扮演什麼角色 |
| 5–10 | 說出 `saveRequested`、`saveSucceeded`、`saveFailed` 的轉移與守衛 |
| 10–13 | 說一個 trade-off：何時用 reducer，何時一個 `useState` 足夠 |
| 13–15 | 核對昨天的 transition 表，只修正一個最不穩的地方 |

**閉卷口述題：** `saving` 時連按兩次按鈕，哪一層避免第二筆 API 請求？失敗後保留哪個欄位供重試？為何 `canSubmit` 可由現有 state 算出？用 90 秒說完後，再展開核對。

<details>
<summary>完成口述後再核對</summary>

Reducer 以目前 state 和 action 計算下一個 state，不能在其中呼叫 API。Handler 需要在發請求前檢查是否已在 `saving`，畫面也應停用提交；reducer 對重複的 `saveRequested` 保持原狀，作為狀態層保護。失敗時保留 `name`，更新 `status` 與 `error`；`canSubmit` 可由名稱與狀態算出。**Trade-off：** 事件多、相依狀態轉移多時，reducer 讓規則集中且可檢查，但增加 action 與分支；只有單一獨立欄位時，`useState` 更簡單。參考 [React：Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)。

</details>

- [ ] 不看稿畫出或說出至少三條 transition。
- [ ] 說出一個使用 reducer 的收益與成本，並用昨天的表單情境說明。

---

## Part 4｜每日 System Design × 高併發 Combo：cache-aside（20 分鐘）

### 今日微題：畫 cache-aside read/write 流程

沿用昨天的熱門商品介紹：資料庫是權威資料，Redis 存可重建的快取。應用程式自己處理 miss、回填與寫入後失效；Redis 不會自動攔截資料庫查詢。先自己畫讀取與寫入，再核對 [Redis cache-aside 文件](https://redis.io/docs/latest/develop/use-cases/cache-aside/) 和[專案的 Redis 入門筆記](/docs/system-design/redis-cache-react-python)。

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–6 | 畫 read hit／miss | Redis hit 直接回傳；miss 查 DB、回填並設 TTL |
| 6–11 | 畫 write | DB 更新成功後刪除對應 key；下一次讀取重建 |
| 11–16 | 算三個數字並想失效情境 | QPS、miss、DB 查詢量與一個 race |
| 16–20 | 關閉參考，選一種方式交付 | 小圖／三個數字／failure case／3 分鐘口述 |

<details>
<summary>自己畫完 read/write 後看參考小圖</summary>

```txt
READ  client → API → Redis GET key
                         ├─ hit  → 回傳快取值
                         └─ miss → DB SELECT → Redis SET key + TTL → 回傳

WRITE client → API → DB UPDATE 成功 → Redis DEL key → 回傳
                              └─ 失敗 → 不把新資料當成已提交
```

這張圖採「先更新 DB、再刪快取」的簡化策略。若 DB 已成功而刪快取失敗，讀者仍可能看到舊值，直到 TTL 到期；因此要監控刪除失敗並考慮重試。另有讀取 miss 與寫入交錯的 race，舊讀取結果可能在刪除後才回填；要求更嚴格一致性時，需版本 key、協調或其他策略，而非只靠 TTL。

</details>

**三個數字（練習假設，不是實測）：** 商品介紹有 `2,000 reads/s`，Redis 命中率 `95%`，每個 miss 都查一次 DB。先算出每秒 hit、miss／DB 查詢、若熱門 key 同時過期且所有請求暫時 miss 時 DB 可能遇到的讀量。

<details>
<summary>算完後核對</summary>

命中 `1,900 reads/s`；未命中並查 DB `100 reads/s`；若全數同時 miss 且沒有請求合併或限流，短時間 DB 讀需求可接近 `2,000 reads/s`，為正常估算的 20 倍。實際數字取決於 key 分布、同時性與保護機制。

</details>

**一個 failure case：** DB 更新已成功，但 Redis `DEL` 失敗。請描述使用者看到什麼、用哪個指標發現（刪除失敗率、資料版本差、舊值持續時間）、如何修復（重試刪除、縮短 TTL 或版本化 key）。如果選熱門 key 同時過期，則描述 cache stampede、DB QPS／p95 如何變化，以及請求合併或限流。

<details>
<summary>自己回答後看示範解答</summary>

**DB 更新成功、`DEL` 失敗：** DB 已是新版，但 Redis 仍存舊值。後續讀取若命中快取，使用者會暫時看到舊資料，直到刪除重試成功或 TTL 到期。觀測 Redis 刪除失敗率、DB 與快取的資料版本差，以及從更新完成到舊值消失的持續時間。處理時記錄失敗並重試刪除；縮短 TTL 可限制舊值存活時間，但會增加回源讀取。若需要更嚴格的一致性，可讓讀取依 DB 中的目前版本使用版本化 key，使舊 key 不再被讀取。若 API 因 `DEL` 失敗回報寫入失敗，也要注意 DB 其實已提交，使用者重試可能造成重複寫入。

**熱門 key 同時過期：** 大量請求一起 cache miss 並查 DB，形成 cache stampede。依本題假設，平常 `2,000 reads/s × 5% miss = 100 DB reads/s`；若短時間全部 miss，DB 讀需求可能接近 `2,000/s`，約為平常的 20 倍，DB QPS、API p95 延遲與逾時率可能上升。觀測命中率、DB QPS、p95 與錯誤率；對同一個 key 合併回源請求，必要時限制同時回源量。

</details>

**3 分鐘口述順序：**資料權威在哪裡 → read hit/miss → write 與失效 → 三個數字 → 一個失敗情境與補救。

- [ ] 自己畫一張標出 hit、miss、DB 更新與 DEL 的小圖。
- [ ] 自己算出三個數字，寫明命中率與單位。
- [ ] 自己寫一個 failure case，包含觀測數據與補救。
- [ ] 完成 3 分鐘口述並記錄一個卡住的追問。

---

## 今日完成檢查

每列只選一種真實狀態；看過參考解不等於獨立完成。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| 3Sum 第一版、修正、測試與 Big-O | [ ] | [ ] | [ ] |
| Python package、例外與清理測試 | [ ] | [ ] | [ ] |
| React 心智模型與 trade-off 口述 | [ ] | [ ] | [ ] |
| cache-aside 讀寫與至少一項主動產出 | [ ] | [ ] | [ ] |

明天開始前閉卷回答：3Sum 如何避免重複三元組？`finally` 在拋錯時做什麼？React 的 API 呼叫應放在哪裡？DB 更新成功但刪快取失敗，使用者可能讀到什麼？
