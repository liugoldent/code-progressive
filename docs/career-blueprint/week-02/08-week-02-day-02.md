---
sidebar_position: 2
sidebar_label: "Day 2"
slug: "/career-blueprint/week-02-day-02"
title: "第 2 週 Day 2：Top K Frequent Elements、Python 容器與 HTTP 版本比較"
description: "140 分鐘日課：Top K Frequent Elements 30 分鐘獨立嘗試、Python Counter／defaultdict／deque／comprehension、React 閉卷回想與 HTTP/1.1、2、3 比較。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - Python
  - React
  - System Design
keywords: ["Top K Frequent Elements", "Counter", "defaultdict", "deque", "comprehension", "state", "ref", "HTTP/1.1", "HTTP/2", "HTTP/3", "面試準備"]
---

# 第 2 週 Day 2：Arrays & Hashing II

> 安排日期：2026-09-15；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing II  
> 本週 System Design 主題：網路與請求路徑

接續 [第 2 週 Day 1](/docs/career-blueprint/week-02-day-01)。可以提前閱讀，完成狀態依實際學習進度勾選。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。原有程式實作與口述練習仍依各節執行。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：指定 Top K Frequent Elements；30 分鐘獨立嘗試，其餘時間看提示、修正、測試與寫 Big-O。看過答案不算完成。
- [ ] **Python 次主線｜45 分鐘**：理解並操作 Counter、defaultdict、deque、comprehension。
- [ ] **React 回想｜15 分鐘**：不看稿講出昨天 state／ref／普通變數的心智模型與一個 trade-off。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：比較 HTTP/1.1、2、3 的核心差異；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項留到週末補課，不因看過解答而勾成獨立完成。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Top K Frequent Elements | 第一版、失敗測資、修正與 Big-O |
| 21:30–22:15 | Python 次主線 | 四種工具的操作與小實作測試 |
| 22:15–22:30 | React 回想 | 閉卷心智模型與一個取捨 |
| 22:30–22:50 | HTTP 版本比較 | 至少一項主動產出 |

---

## Part 1｜NeetCode 150：Top K Frequent Elements（60 分鐘）

### 今日 60 分鐘執行節奏

**[開始 LeetCode 347｜Top K Frequent Elements 練習](/docs/algorithms/leetcode/f0301-0400/l0347-top-K-frequent-elements)**

既有題解包含 Stage A 解題前、Stage B 解題分析、Stage C 工程遷移，以及 TypeScript＋Python 模板、完整實作與測試。今天先停在 Stage A，提示與分析留到第 30 分鐘後；本頁 Python 教材也留到演算法時段結束再讀。

| 分鐘 | 任務 | 規則 |
| ---: | --- | --- |
| 0–5 | 讀題、確認契約 | 回傳什麼？順序有限制嗎？k 的範圍？ |
| 5–10 | 手算與提出第一個方法 | 寫出三句計畫與預估成本 |
| 10–30 | 獨立實作並試跑 | 不看提示、答案或請 AI 代寫；保留卡住的版本 |
| 30–40 | 視需要逐層看提示、修正 | 記錄用了哪層提示；已解出則檢查推導 |
| 40–50 | 執行測試、補另一語言 | TypeScript／Python 未完成者排補課 |
| 50–60 | 寫 Big-O、閉卷解釋 | 說出每階段成本與每輪保持的條件 |

若 30 分鐘後仍沒解出，這是有效的獨立嘗試紀錄；看提示後修好只能標成「輔助完成」。後續要關掉答案、從空白重寫並通過測試，才勾完整完成。

### 1. 契約與自訂測資

**單選｜這題要回傳什麼？**

- [ ] A. 數值最大的 k 個數字。
- [ ] B. 出現次數最多的 k 種數字，每種只回傳一次。
- [ ] C. 出現次數最多的數字，把每次出現都保留。

<details>
<summary>選完再核對契約</summary>

**答案：B。** 輸出順序不限；題目保證答案集合唯一、k 合法。完整官方題面與範例見連結筆記 Stage A。

</details>

先手算以下自訂測資，再搭配題解中的官方範例執行。比較結果可排序，但不要先去重，否則會把錯誤的重複輸出藏起來。

| 自訂輸入 nums／k | 預期集合 | 驗證重點 |
| --- | --- | --- |
| `[-1, -1, 0, 2]`／`1` | `[-1]` | 次數與數值大小不同 |
| `[4, 4, 4]`／`1` | `[4]` | 單一種類 |
| `[3, 2, 1]`／`3` | `[1, 2, 3]` | 所有種類入選，順序不限 |
| `[5, 5, 6, 6, 7]`／`2` | `[5, 6]` | 入選者可同頻，答案集合仍唯一 |

空陣列與 k = 0 不在官方契約；若加測，另標為工程擴充，不自行改題。

### 2. 今日驗收

- [ ] 留下自己的第一版與實際卡點，沒有用參考程式冒充第一次實作。
- [ ] 能說出最直接方法的重複工作，及後來如何減少它。
- [ ] 官方範例與上表測資都已執行，結果長度正好為 k。
- [ ] 定義 n 為輸入長度、u 為不同數字數量，逐步計算時間與空間。
- [ ] 已區分平均成本、輔助空間與輸出空間，而非只背一行 Big-O。
- [ ] 能解釋 Stage C 的錯誤碼排名案例，及跨服務彙整為何還要處理時間窗與重複事件。

<details>
<summary>完成自己的分析後，核對 Big-O</summary>

計次數再排序：平均時間 `O(n + u log u)`，另存次數與候選需 `O(u)` 空間。頻率桶版本：計數、配置桶、放入候選與掃描合計平均 `O(n)` 時間、`O(n)` 輔助空間，另有 `O(k)` 輸出；這裡採雜湊平均存取成本。推導與雙語程式以既有 Stage B 為準。

</details>

---

## Part 2｜Python 次主線（45 分鐘）

### 今日目標與時間分配

| 分鐘 | 練習 |
| ---: | --- |
| 0–10 | Counter 與 defaultdict：先預測，再執行 |
| 10–20 | deque：先進先出、容量滿時的行為 |
| 20–30 | comprehension：改寫迴圈、驗證物件獨立 |
| 30–40 | 閉卷完成事件摘要小實作 |
| 40–45 | 執行測試、口述成本與使用界線 |

### 1. 四種工具各自在省什麼工作？

| 工具 | 白話用途 | 要注意的行為 |
| --- | --- | --- |
| `Counter` | 數每種有幾個 | 缺少的 key 用索引讀取為 0；次數歸零不會自動刪 key |
| `defaultdict(list)` | 第一次遇到一組時，自動準備容器 | `d[key]` 缺值會建立項目；`d.get(key)` 不會呼叫 factory |
| `deque` | 從兩端放入、取出 | 兩端 append／pop 約 O(1)；中間索引 O(n) |
| comprehension | 用簡短語法建立轉換或篩選後的集合 | 不會自動降低演算法複雜度 |

容器行為參考 [Python collections](https://docs.python.org/3/library/collections.html)；推導式參考 [Python Data Structures](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)。

### 2. 先預測，再執行

以下各段可分別執行，先遮住 assert，口述結果再核對。

```python
from collections import Counter, defaultdict

counts = Counter(["timeout", "timeout", "offline"])
assert counts["missing"] == 0
assert "missing" not in counts
assert counts.most_common(1) == [("timeout", 2)]
counts["offline"] = 0
assert "offline" in counts

groups: defaultdict[str, list[int]] = defaultdict(list)
assert groups.get("api") is None
assert "api" not in groups
groups["api"].append(503)
assert dict(groups) == {"api": [503]}
```

`most_common(k)` 回傳 `(元素, 次數)` 配對；會呼叫它不等於能解釋 Top K 的演算法，今天仍須自行推導 Big-O。

```python
from collections import deque

queue = deque(["job-a", "job-b"])
queue.append("job-c")
assert queue.popleft() == "job-a"
assert list(queue) == ["job-b", "job-c"]

recent = deque(maxlen=2)
recent.extend(["a", "b", "c"])
assert list(recent) == ["b", "c"]
```

`deque(maxlen=2)` 從右加入新元素且已滿時，會丟掉最左元素；適合只保留最近紀錄。不能把它直接當成不可遺失任務的工作佇列；它也不提供跨程序持久化或重試機制。

```python
values = [-2, 0, 3, 3]
positive = [x for x in values if x > 0]
squares = {x: x * x for x in values}
unique = {x for x in values}
lazy_squares = (x * x for x in values)
assert positive == [3, 3]
assert squares == {-2: 4, 0: 0, 3: 9}
assert unique == {-2, 0, 3}
assert list(lazy_squares) == [4, 0, 9, 9]
assert list(lazy_squares) == []

rows = [[] for _ in range(3)]
rows[0].append(1)
assert rows == [[1], [], []]
```

小括號那段是 generator expression，逐項產生而且消耗後不會自動重來。`[[]] * 3` 則會讓三個位置共用同一個內層 list；請另外實驗一次並解釋差異。多層判斷或副作用很多時，普通迴圈更容易讀。

### 3. 小實作：一批錯誤事件的摘要

輸入是已選定時間範圍的一批 `(服務名稱, 錯誤碼)`，每筆代表一次發生，重複資料也要計入。回傳每種錯誤碼的次數、各服務的錯誤碼清單，以及最後三筆事件。保留服務內順序，不修改輸入；空輸入回傳空容器。

先自行實作 `summarize_events`，再展開參考版。這是四種工具的綜合操作，不要求再寫一次 Top K。

<details>
<summary>完成後再看參考實作（Python 3.9+）</summary>

```python
from collections import Counter, defaultdict, deque

def summarize_events(
    events: list[tuple[str, str]],
) -> tuple[dict[str, int], dict[str, list[str]], list[tuple[str, str]]]:
    counts: Counter[str] = Counter()
    by_service: defaultdict[str, list[str]] = defaultdict(list)
    recent: deque[tuple[str, str]] = deque(maxlen=3)

    for service, code in events:
        counts[code] += 1
        by_service[service].append(code)
        recent.append((service, code))

    groups = {service: codes.copy() for service, codes in by_service.items()}
    return dict(counts), groups, list(recent)
```

以 n 筆事件、u 種錯誤碼計，平均時間 O(n)：遍歷一次，加上最後複製分組共 n 個項目。總額外空間 O(n + u)，最近紀錄本身最多三筆。這裡輸出一般 dict 與獨立清單，讓呼叫者不用依賴 defaultdict 的自動建值行為。

分組仍保存所有事件，不能因為 recent 有上限就宣稱整個函式只有固定記憶體。若事件持續無限流入，要另外限制批次或時間窗；跨服務全站統計也需要彙整機制。

</details>

將自己的函式與下列測試存到同一個 Python 檔，以 `python3` 執行。

```python
events = [("api", "timeout"), ("web", "offline"),
          ("api", "timeout"), ("api", "offline")]
before = events.copy()
counts, groups, recent = summarize_events(events)
assert counts == {"timeout": 2, "offline": 2}
assert groups == {"api": ["timeout", "timeout", "offline"], "web": ["offline"]}
assert recent == events[-3:]
assert events == before
groups["api"].append("manual")
assert groups["web"] == ["offline"]
assert events == before
assert summarize_events([]) == ({}, {}, [])
assert summarize_events([("api", "timeout")]) == (
    {"timeout": 1}, {"api": ["timeout"]}, [("api", "timeout")]
)
```

**單選｜只查詢不存在的服務、不希望產生新 key，該怎麼做？**

- [ ] A. 使用 `groups["unknown"]`，一定不會修改 defaultdict。
- [ ] B. 使用 `groups.get("unknown")`，再處理 None。
- [ ] C. 必須把所有服務都先建立一遍。

<details>
<summary>選完再看解析</summary>

**答案：B。** 用索引存取缺少的 key 才會啟動 defaultdict 的 factory。查詢是否存在，也可用 `key in groups`。

</details>

### 4. Python 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| Counter 保存什麼？ | 每種元素到次數的對應；不是直接回傳元素排名 |
| defaultdict 何時建立缺值？ | 用索引讀取缺少的 key 時；get 不會觸發 factory |
| deque 適合什麼操作？ | 兩端加入與取出；不適合大量中間索引查找 |
| comprehension 比迴圈快一個 Big-O 嗎？ | 不會；仍要數實際迭代與內部操作 |
| 為何不用 `[[]] * n` 建分組？ | 多個位置會指向同一個可變 list |

### 5. Python 今日驗收

- [ ] 已先預測，再執行四種工具的範例。
- [ ] 能說明 Counter 與 defaultdict 的缺值行為差異。
- [ ] 能區分有限容量的最近紀錄與不可丟失的工作佇列。
- [ ] 已自行實作事件摘要並通過測試。
- [ ] 能逐項解釋時間與空間成本。

---

## Part 3｜React 回想（15 分鐘）

今天回想 [昨天的 state／ref／普通變數](/docs/career-blueprint/week-02-day-01)，不讀新主題。

### 15 分鐘節奏

| 分鐘 | 閉卷任務 |
| ---: | --- |
| 0–5 | 說出元件重新執行時，三種資料如何取得與保存 |
| 5–10 | 用一次點擊解釋 state 快照；說出 ref 修改為何不更新 UI |
| 10–13 | 用搜尋框文字與 timer ID 講一個 trade-off |
| 13–15 | 展開核對，只補一個最不穩的觀念 |

### 閉卷口述題

**單選｜哪個心智模型正確？**

- [ ] A. ref 改變會安排 render，只是比 state 慢。
- [ ] B. state 與 ref 可跨同一掛載期間的 render 保存；元件內區域變數每次執行重新初始化。
- [ ] C. 區域變數每次點擊都歸零，即使元件沒有再次 render。

<details>
<summary>完成口述與選擇後再看</summary>

**答案：B。** state 提供這次 render 的快照，setter 排入更新；ref 物件保留，但修改 current 不會要求 render。普通區域變數在元件函式重新執行時初始化，不是每次事件執行都初始化；舊 handler 的閉包仍可能保有當時的變數。重新掛載會重置該元件的 state 與 ref。

**一個 trade-off：** 搜尋文字用 state，讓輸入與 UI 一致，代價是更新會安排 render；timer ID 用 ref，跨 render 保存且不因 ID 改變而更新畫面，但必須自行管理清理。若為了減少 render 把畫面文字改存 ref，就失去修改後自動反映 UI 的行為。[React：Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)

</details>

### React 今日驗收

- [ ] 不看稿說出三者的保存方式與畫面更新差異。
- [ ] 能區分「再次點擊」與「再次 render」。
- [ ] 已口述一個情境、選擇理由與代價，而非只說哪個比較快。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：比較 HTTP/1.1、2、3 的核心差異

| 分鐘 | 任務 |
| ---: | --- |
| 0–5 | 比較傳輸層、請求共用方式、阻塞位置 |
| 5–10 | 畫小圖或解釋三個數字 |
| 10–15 | 描述一個 failure case 與恢復方式 |
| 15–20 | 關閉筆記，自行產出至少一項 |

### 1. 比較表：HTTP 的需求沒變，傳送方式改了

**先認識這幾個名詞**

- **TCP（Transmission Control Protocol，傳輸控制協定）**：讓資料可靠、依序交付的傳輸協定；途中遺失的資料會重傳，後面已到的資料可能需要等前面補齊。
- **TLS（Transport Layer Security，傳輸層安全協定）**：負責加密、保護資料不被竄改，並透過憑證驗證伺服器身分。忘記 TCP 與 TLS 的先後關係，可以回看 [Week 2 Day 1：DNS → TCP → TLS → HTTP 請求流程圖](./07-week-02-day-01.md#1-一張小圖)。
- **UDP（User Datagram Protocol，使用者資料報協定）**：把資料一包一包送出去，本身不保證送達或順序，也不自動重傳。需要這些能力時，可以由上層協定補上。
- **QUIC**：HTTP/3 使用的傳輸協定，運作在 UDP 上，提供可靠傳輸、重傳與壅塞控制，並整合 TLS 1.3 的安全握手。可以先記成「UDP 負責承載，QUIC 負責可靠且安全地傳送」。
- **stream（串流）／多工**：stream 是同一條連線內的一條邏輯資料流；多工就是讓多條資料流交錯傳送。可想成同一條連線同時運送 A、B、C 三個請求，而每份資料都有自己的編號，接收端能分開整理。

QUIC 與 stream 的定義可參考 [RFC 9000：Overview 與 Streams](https://www.rfc-editor.org/rfc/rfc9000.html#section-1)。下文的 **H2／H3** 就是 HTTP/2／HTTP/3 的簡稱。

三者仍表達 method、status、headers 與 body；升級協定不會直接消除慢 SQL 或應用程式排隊。

| 比較 | HTTP/1.1 | HTTP/2 | HTTP/3 |
| --- | --- | --- | --- |
| 底層 | TCP；HTTPS 另加 TLS | TCP；瀏覽器常見為 TLS | QUIC over UDP，整合 TLS 1.3 |
| 傳送格式 | 文字起始行與 headers，body 可是二進位 | 二進位 frame 與 stream | HTTP frame 映射到 QUIC stream |
| 共用連線 | 可重用；pipelining 回應必須依請求順序 | 同一連線多個 stream 交錯傳送 | 多個 QUIC stream 傳送請求 |
| 隊頭阻塞（HOL） | pipelining 中後面回應要等前面 | HTTP stream 可交錯，但 TCP 缺資料會擋住後續位元組交付 | 某 stream 缺資料不要求其他 stream 一起等有序交付 |
| Header 壓縮 | 沒有 H2／H3 的 header 壓縮機制 | HPACK | QPACK |

HTTP/1.1 的連線重用與 pipelining 規則見 [RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html#section-9.3.2)。HTTP/2 的 frame、多工與 TCP 阻塞限制見 [RFC 9113](https://www.rfc-editor.org/rfc/rfc9113.html#section-1)；HTTP/3 的映射與 QPACK 見 [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html#section-1)。

### 2. 今日主動產出

至少完成其中一項自己的產出；選對題目或抄表不算。

#### [ ] 一張小圖：丟包時誰要等？

```text
HTTP/2
請求 A ─ stream A ─┐
請求 B ─ stream B ─┼─ TLS / 同一條 TCP ─ Server
請求 C ─ stream C ─┘       ↑ TCP 中間缺位元組
                         後續位元組先等待補齊，可能一起拖慢 A/B/C

HTTP/3
請求 A ─ QUIC stream A ─┐
請求 B ─ QUIC stream B ─┼─ 同一條 QUIC / UDP ─ Server
請求 C ─ QUIC stream C ─┘
       若遺失的是 A 的資料：A 等重傳；B/C 不必等 A 才能依序交付
```

這不代表 HTTP/3「不重傳」或「永不阻塞」。QUIC 提供可靠傳輸、各 stream 內排序與壅塞控制；連線的頻寬和壅塞控制仍會互相影響，QPACK 相依也可能讓解碼等待。精確說法是減少不同 stream 之間的傳輸層隊頭阻塞。[RFC 9000：Streams](https://www.rfc-editor.org/rfc/rfc9000.html#section-2)、[RFC 9114：HTTP/3](https://www.rfc-editor.org/rfc/rfc9114.html#section-1)

> **名詞補充**：**隊頭阻塞（HOL）** 就是前面的資料卡住，讓後面的資料也得等；**頻寬** 是網路單位時間可傳送的資料量，**壅塞控制** 則是根據網路狀況調整傳送速度，避免持續塞入過多資料。**QPACK** 是 HTTP/3 壓縮 headers（請求／回應附帶資訊）的機制；若解壓縮需要的對照表更新尚未送達，就可能得等它。參考 [RFC 9114：HTTP/3](https://www.rfc-editor.org/rfc/rfc9114.html#section-1)。

#### [ ] 三個數字：容量估算，不是協定跑分

假設某服務穩定處理 **1,000 requests/s**，平均每個請求在系統內停留 **0.2 秒**，則平均在途請求約 **200 個**：`L = λ × W = 1,000 × 0.2`。這是穩態下的 Little's Law 練習估算，三個數字都不是實測。

200 個在途請求不等於 200 條 TCP 連線；H2／H3 可以在連線內多工，但可用 stream 數仍受協商限制與資源影響。協定改善傳輸時，仍須觀察應用 worker、DB pool 與排隊時間。請自行換一組到達率與平均時間重算，不把 p95 延遲代入平均值公式。

**把容量估算的名詞換成白話：**

- **requests/s**：每秒有多少個請求；**在途請求** 是已進入系統、但還沒完成的請求，包含正在處理與排隊等待的。
- **Little's Law**：穩態下，平均系統內請求數 `L` = 平均到達率 `λ` × 平均停留時間 `W`。這裡的 0.2 秒包含處理與等待，不能只算程式執行時間。
- **應用 worker**：伺服器內實際執行請求工作的處理單位，例如 process（行程）或 thread（執行緒），可想成接單做事的店員。這裡不是指瀏覽器的 Web Worker；一個 worker 能同時處理多少請求，要看程式的執行方式。
- **DB pool（資料庫連線池）**：預先建立、可重複借用的一組資料庫連線。像店員共用的幾台收銀機，全部被借走時，其他需要查資料庫的請求可能要排隊。
- **p95 延遲**：將請求耗時由小到大排序，約 95% 的請求不超過這個時間；它不是平均值，所以不能直接代入上面的 `W`。

例如請求很快到達伺服器，卻一直等不到可用的資料庫連線，整體回應仍會很慢；升級 HTTP 協定不會自動增加 worker 或 DB pool 的處理能力。

#### [ ] 一個 Failure Case：網路擋住 UDP

情境：站點宣告支援 HTTP/3，但某企業網路阻擋到目的地的 UDP/443；TCP/443 正常。使用者可能先遇到 QUIC 連線失敗，再透過可用的 HTTP/2 或 HTTP/1.1 連線載入。

**讀懂這個故障情境：**

- **UDP/443、TCP/443**：分別指使用 UDP、TCP 傳送到目的地的 **443 port（連接埠）**。數字相同，但防火牆可以分別允許或阻擋，所以 TCP 能通不代表 UDP 也能通。
- **fallback（退回備用方案）**：主要方式失敗後，改試另一個可用方式；這裡是 HTTP/3 連不上時，改試 HTTP/2 或 HTTP/1.1。
- **CDN／邊緣節點／origin**：CDN 是分散在不同地點、協助快取與轉送內容的服務；邊緣節點是接近使用者、接收連線的站點；origin 是提供原始內容或應用服務的來源伺服器。
- **Network 的 Protocol**：瀏覽器開發者工具中顯示該請求使用的協定，例如 `h2`、`h3`。**邊緣 QUIC 指標** 則是 CDN 或代理端記錄的 QUIC 連線成功、失敗等統計。

| 面向 | 排查或處理 |
| --- | --- |
| 偵測 | 比較同一裝置不同網路的結果；查看瀏覽器 Network 的 Protocol 與連線時間、邊緣 QUIC 指標 |
| 分層定位 | 確認 DNS、TCP/TLS 可用，再查 UDP 路徑；不能只看 API 日誌就認定沒有失敗 |
| 恢復 | 站點保留可用的 TCP HTTPS 協定，驗證客戶端 fallback；檢查防火牆與邊緣 UDP 設定 |
| 驗收 | 在受限網路重測頁面能否完成、最終協定與延遲；切換不是保證零成本 |

HTTP/3 連線受阻時嘗試 TCP 版本的行為參考 [RFC 9114：Connection Establishment](https://www.rfc-editor.org/rfc/rfc9114.html#section-3)。CDN 到瀏覽器與 CDN 到 origin 是兩段連線；看到前段 h3，不代表後段也是 h3。

**單選｜HTTP/3 使用 UDP，代表什麼？**

- [ ] A. HTTP 回應不保證可靠交付。
- [ ] B. QUIC 在 UDP 上提供可靠 stream 與壅塞控制，減少跨 stream 的傳輸層阻塞。
- [ ] C. 不必重傳，也不需要加密。

<details>
<summary>選完再看解析</summary>

**答案：B。** UDP 是底層承載，可靠性由 QUIC 處理；不能只憑 UDP 三個字判斷上層服務是否可靠。

</details>

#### [ ] 3 分鐘口述

```text
0:00–0:40  三個版本的底層與連線重用方式
0:40–1:30  H2 多工為何仍可能被 TCP 丟包拖慢，H3 改在哪
1:30–2:10  說明三個容量數字、假設與連線數的差別
2:10–3:00  UDP 受阻如何偵測、fallback、驗收
```

### 3. 今日 System Design 驗收

- [ ] 能說出三個版本的傳輸層與多工差異。
- [ ] 能區分 TCP 隊頭阻塞與 QUIC stream 內等待。
- [ ] 能說出 UDP 受阻時的偵測、恢復與取捨。
- [ ] 已關閉範例，自己畫一張圖並指出阻塞位置。
- [ ] 已自行計算三個數字，說明單位與假設。
- [ ] 已用自己的話描述一個 failure case、偵測與恢復。
- [ ] 已錄一段 3 分鐘口述。
- [ ] 尚未產出，需補課（不可同時勾已完成項）。

---

## 今日結束打卡

下列各組依實際情況單選，未完成就保留真實狀態。

**Top K Frequent Elements（依實際情況單選）**

- [ ] 尚未完成 30 分鐘獨立嘗試。
- [ ] 已獨立嘗試，看提示／答案後修好，待閉卷重寫。
- [ ] 已閉卷完成、跑過測資，能推導 Big-O。

**Python 次主線（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 看得懂範例，但還不能自行實作。
- [ ] 已完成事件摘要與測試，能說出四種工具的用途與限制。

**React 回想（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 需要看稿才能解釋。
- [ ] 已閉卷講出心智模型與一個 trade-off。

**System Design（依實際情況單選）**

- [ ] 尚未閱讀或完成比較。
- [ ] 已閱讀，尚未主動產出。
- [ ] 已完成至少一項自己的產出。

**本次學習時間（依實際情況單選）**

- [ ] 少於原定時間。
- [ ] 約等於原定時間。
- [ ] 超過原定時間。
- [ ] 未計時。

**口述或主動產出（可複選，依實際情況）**

- [ ] 已錄音，符合本節時限。
- [ ] 已錄音，但超時或中斷。
- [ ] 已自畫資料流或重算數字。
- [ ] 已操作 failure case 並核對結果。
- [ ] 尚未產出（不可與已完成項同時勾選）。

**今天最需要補強的地方（依實際情況單選）**

- [ ] 題意或契約。
- [ ] 實作與測試。
- [ ] React／Python 模型。
- [ ] System Design 假設與故障。
- [ ] 口述表達。
- [ ] 目前沒有待補項目。

### 未完成才加入的週末補課清單（依卡點複選）

- [ ] 30 分鐘：從空白重寫 Top K Frequent Elements，測試並口述 Big-O。
- [ ] 20 分鐘：補完另一語言版本，以相同測資驗證。
- [ ] 20 分鐘：閉卷重寫 Python 摘要，解釋缺值查詢與共享 list 的差異。
- [ ] 10 分鐘：重講 state／ref／普通變數，補清楚事件與 render 的區別。
- [ ] 20 分鐘：重畫 H2／H3 丟包差異，練 UDP 受阻的排查口述。
- [ ] 無需補課（不可與補課項同時勾選）。

[回到一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
