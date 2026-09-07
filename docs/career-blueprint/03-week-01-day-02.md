---
sidebar_position: 3
sidebar_label: "3. 第 1 週 Day 2"
slug: "/career-blueprint/week-01-day-02"
title: "第 1 週 Day 2：Valid Anagram、Python 基礎、React 回想與容量估算"
description: "Amazon、Binance、台積電與聯發科面試準備日課：用 JavaScript 與 Python 練習 Valid Anagram，建立 venv、pyproject、基本型別與 type hints，回想 React 心智模型，並完成 DAU、QPS、頻寬與儲存量估算。"
tags:
  - Career
  - Interview
  - NeetCode 150
  - JavaScript
  - Python
  - React
  - System Design
keywords: ["Valid Anagram", "Arrays and Hashing", "JavaScript", "Python venv", "pyproject.toml", "Python type hints", "React mental model", "DAU", "QPS", "bandwidth", "storage estimation", "容量估算"]
---

# 第 1 週 Day 2：Arrays & Hashing I

> 練習日期：2026-09-06  
> 今日總時數：140 分鐘  
> 對應目標：Amazon、Binance、台積電、聯發科面試共同核心  
> 今日演算法語言：**JavaScript＋Python**

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Valid Anagram 前 30 分鐘獨立讀題、推導與實作；後 30 分鐘才看提示、修正、測試與寫 Big-O。看過答案不算完成。
- [ ] **Python 次主線｜45 分鐘**：能建立與啟用 `venv`、說明 `pyproject.toml` 的角色，並用基本型別與 type hints 寫一個可執行小程式。
- [ ] **React 回想｜15 分鐘**：不看稿講出昨天 React 主題的心智模型，並說明一個真實 trade-off。
- [ ] **System Design × 高併發｜20 分鐘**：能從 DAU 推導平均／尖峰 QPS、頻寬與儲存量，至少完成一項主動產出。

建議依照固定訓練時段執行：

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Valid Anagram | JavaScript＋Python 程式碼、測資、Big-O、卡點 |
| 21:30–22:15 | Python 基礎 | `.venv` 操作紀錄、`pyproject.toml`、type hints 小程式 |
| 22:15–22:30 | React 回想 | 90 秒口述與一個 trade-off |
| 22:30–22:50 | System Design | 小圖／三個數字／failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：Valid Anagram（60 分鐘）

完整的 JavaScript＋Python 三階段題解已放到 LeetCode 筆記區：

**[開始 LeetCode 242｜Valid Anagram 練習](/docs/algorithms/leetcode/f0201-0300/l0242-valid-anagram)**

> 先從該頁的 Stage A 開始並計時。前 30 分鐘不要展開提示，也不要往下看 Stage B。若已看過答案，今天仍須從空白閉卷重寫並口述理由，才算完成。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與確認契約 | 一句話重述 Input／Output |
| 5–10 | 官方範例與自訂測資 | 先寫預期值，不執行 code |
| 10–15 | 第一個直覺與 Big-O 預估 | 寫下正確性理由與成本 |
| 15–20 | 從直覺整理計畫 | 三句 prose 或 pseudocode |
| 20–30 | JavaScript＋Python 閉卷實作 | 不看提示完成第一次版本 |
| 30–40 | 必要時依序看提示並修正 | 記錄看到了第幾層提示 |
| 40–50 | 測試與 edge cases | 至少跑 8 組測資 |
| 50–60 | 寫 Big-O 與口述 | 說出 invariant、取捨與 Unicode follow-up |

### 今日驗收

- [ ] 前 30 分鐘沒有看提示或 Stage B。
- [ ] 先寫了第一個直覺、正確性理由、預估 Big-O，再開始 coding。
- [ ] 能用 JavaScript 與 Python 從空白完成，而不是把看過的答案重新抄一次。
- [ ] 至少測試：長度不同、相同字串、字元重排、頻率不同、單字元與題目允許的最長方向。
- [ ] 能解釋為什麼長度檢查可提早失敗，以及核心狀態每輪代表什麼。
- [ ] 能推導時間與空間複雜度，並說出排序解的 trade-off。
- [ ] 已在題解頁回填耗時、錯誤類型、提示層級與卡點。

---

## Part 2｜Python 次主線（45 分鐘）

### 今日目標

完成後，不看筆記回答：

1. `venv` 隔離的是什麼？它不會隔離什麼？
2. `pyproject.toml` 解決什麼問題？它和虛擬環境有何不同？
3. `list[str]`、`dict[str, int]`、`tuple[int, str]`、`set[str]` 各表示什麼？
4. Type hints 會不會在執行期自動阻止錯誤型別？
5. `str | None` 為什麼不能直接呼叫 `.upper()`？

### 1. `venv`：隔離專案的 Python 套件

同一台電腦上的專案可能需要不同版本的套件。虛擬環境讓每個專案擁有自己的 Python 執行入口與套件安裝位置，避免把依賴全部塞進系統 Python。

```txt
project-a/                       project-b/
├── .venv/                       ├── .venv/
│   └── package X 1.x            │   └── package X 2.x
└── pyproject.toml               └── pyproject.toml
```

建立與啟用：

```bash
python3 -m venv .venv
source .venv/bin/activate
python --version
python -m pip --version
```

Windows PowerShell 的啟用方式：

```powershell
.venv\Scripts\Activate.ps1
```

離開環境：

```bash
deactivate
```

三個容易混淆的點：

- `venv` 隔離的是 Python interpreter 入口與安裝到該環境的 packages，不是 Docker 那種完整作業系統隔離。
- 啟用的主要效果是調整目前 shell 的 `PATH`；即使不啟用，也可以明確執行 `.venv/bin/python`。
- `.venv/` 通常不提交 Git；應提交依賴宣告，讓其他人能重建環境。

今日實作紀錄：

```txt
建立環境的命令：
python 實際路徑：
pip 實際路徑：
我如何確認沒有用到系統環境：
```

### 2. `pyproject.toml`：專案與工具的共同設定入口

`venv` 回答「依賴安裝在哪裡」，`pyproject.toml` 則描述「這是什麼專案、需要什麼依賴、build system 或工具如何設定」。兩者不是替代關係。

最小學習範例：

```toml
[project]
name = "day-02-python-practice"
version = "0.1.0"
description = "Week 1 Day 2 Python practice"
requires-python = ">=3.10"
dependencies = []

[project.optional-dependencies]
dev = ["mypy>=1.10"]

[tool.mypy]
python_version = "3.10"
strict = true
```

讀法：

- `[project]`：標準化的專案 metadata 與 runtime dependencies。
- `requires-python`：宣告支援的 Python 版本，不是替你安裝 Python。
- `dependencies`：程式執行時需要的第三方套件；今天的範例只用標準函式庫，所以保持空陣列。
- `[project.optional-dependencies]`：可選依賴群組；這裡把型別檢查工具放在 `dev`。
- `[tool.mypy]`：特定工具的設定。其他 formatter、linter、test runner 也可擁有各自區塊。

> 不要為了「用了 Python」就塞滿設定。單檔 LeetCode 練習不一定需要 packaging；今天建立 `pyproject.toml` 是為了理解正式專案如何宣告 metadata、依賴與工具設定。

### 3. 基本型別與 Type Hints

常用型別：

| 類別 | Python 值 | Type hint | 特性 |
| --- | --- | --- | --- |
| 整數 | `42` | `int` | 任意精度整數 |
| 浮點數 | `3.14` | `float` | 適合一般計算，不適合直接代表精確金額 |
| 布林 | `True` | `bool` | `True`／`False` |
| 字串 | `"BTCUSDT"` | `str` | 不可變文字序列 |
| 串列 | `["BTC", "ETH"]` | `list[str]` | 有順序、可變、可重複 |
| Tuple | `(200, "ok")` | `tuple[int, str]` | 有順序、通常表達固定結構 |
| 集合 | `{"BTC", "ETH"}` | `set[str]` | 不重複、無索引存取 |
| 字典 | `{"BTC": 1}` | `dict[str, int]` | key 對 value 的映射 |
| 空值 | `None` | `None`／`str | None` | 明確表示沒有值 |

Type hints 是給人、IDE 與靜態檢查工具看的契約；Python 預設不會在 runtime 自動強制：

```python
def normalize_symbol(symbol: str) -> str:
    return symbol.strip().upper()
```

這份標註表達「呼叫者應傳入字串，函式應回傳字串」。若有人在未檢查的程式中傳入整數，Python 不會因 annotation 自動拒絕，但函式內的字串操作可能在 runtime 失敗。

可選值要先 narrowing：

```python
def display_name(name: str | None) -> str:
    if name is None:
        return "Anonymous"

    return name.strip() or "Anonymous"
```

### 4. 15 分鐘小實作

建立一個和今天題目同樣會使用「字元次數」的 utility，但先不要複製 Valid Anagram 解答：

```python
def character_frequencies(text: str) -> dict[str, int]:
    frequencies: dict[str, int] = {}

    for character in text:
        frequencies[character] = frequencies.get(character, 0) + 1

    return frequencies


def most_common_character(text: str) -> tuple[str, int] | None:
    frequencies = character_frequencies(text)
    if not frequencies:
        return None

    return max(frequencies.items(), key=lambda item: item[1])
```

請自己補測試：

```python
assert character_frequencies("banana") == {"b": 1, "a": 3, "n": 2}
assert character_frequencies("") == {}
assert most_common_character("") is None
assert most_common_character("aaa") == ("a", 3)
```

若兩個字元同為最高次數，以上實作會依字典保留的插入順序回傳先出現者。這是目前行為的一部分；若需求要按字母排序或回傳全部並列者，型別與演算法都要調整。

### 5. Python 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| 為什麼用 `venv`？ | 隔離專案的 Python 執行入口與第三方套件 |
| `venv` 是容器嗎？ | 不是；它不隔離 OS、process、network 或系統函式庫 |
| `pyproject.toml` 做什麼？ | 集中描述專案 metadata、依賴、build 與工具設定 |
| Type hints 會自動做 runtime validation 嗎？ | 預設不會；需靜態檢查工具或額外 runtime validation |
| `dict[str, int]` 是什麼？ | key 為字串、value 為整數的字典契約 |
| `str | None` 要注意什麼？ | 使用字串方法前先排除 `None` |

---

## Part 3｜React 回想（15 分鐘）

今天不讀新主題。先關掉 Day 1 筆記，用 retrieval practice 確認昨天是否真的留下來。

### 15 分鐘節奏

| 分鐘 | 任務 | 規則 |
| ---: | --- | --- |
| 0–3 | 畫心智模型 | 不看稿寫 Trigger → Render → Commit → Paint |
| 3–7 | 解釋 state snapshot | 用一次 click 與兩次 setter 當例子 |
| 7–11 | 解釋 source of truth | 說明 state owner 與 derived data |
| 11–14 | 說一個 trade-off | 不能只說「A 比 B 好」 |
| 14–15 | 對答案與標卡點 | 只補一個最不穩的洞 |

### 閉卷口述題

```txt
我的 90 秒心智模型：

Trigger：

Render：

Commit：

State snapshot：

Source of truth：
```

<details>
<summary>完成口述後再看參考骨架</summary>

一次更新先被 trigger／schedule；React 在 render 階段重新呼叫相關 component，使用該輪 props、state 與 context snapshot 計算下一個 UI。Reconciliation 找出需要套用的差異，commit 階段才更新 DOM、ref 與相關 effect 時機，之後瀏覽器 paint。Setter 不會修改目前 handler 捕捉的 state snapshot。資料 ownership 應保持單一 source of truth，可由現有資料推導的值通常在 render 計算。

</details>

### 今日一個 Trade-off：儲存 Derived State，還是 Render 時計算？

先不看提示回答：

```txt
情境：購物車有 items，畫面要顯示 total。

方案 A：把 items 與 total 都存 state。
方案 B：只存 items，每次 render 計算 total。

我選：
好處：
代價：
何時可能改選另一個方案：
```

<details>
<summary>參考 trade-off</summary>

一般先選 B，因為 `total` 的 source of truth 仍是 `items`，可避免漏同步與額外更新。代價是每次 render 都會重新計算；當計算經量測後確實昂貴、輸入 identity 穩定，而且快取成本值得時，可以考慮 memoization。這仍是快取衍生值，不代表建立第二份可獨立修改的業務 state。若 total 是後端依稅務、折扣與權限規則計算的權威結果，它就不再只是 client-side derived data，而是 server state。

</details>

### React 今日驗收

- [ ] 沒看 Day 1 就完成 90 秒口述。
- [ ] 沒把 render 說成「整頁 DOM 重建」。
- [ ] 能解釋 setter 與當前 snapshot 的關係。
- [ ] Trade-off 同時包含好處、代價與改變決策的條件。
- [ ] 只回看最不穩的一點，沒有用重讀整頁代替回想。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：容量估算——DAU、QPS、頻寬、儲存量

延續 Day 1 的即時價格 Watchlist（股票自選清單）。今天只做 back-of-the-envelope estimation，也就是用簡單算式粗估系統需要多少容量，不設計完整架構。

### 0. 先懂名詞，再看公式

想像你正在做一個股票網站：使用者打開頁面查看股價，也能保存自己追蹤的股票。下面四個名詞，分別在問四件事：

| 名詞 | 白話意思 | 常見單位 |
| --- | --- | --- |
| DAU | 今天有多少不同的人使用？ | 人（以一天為統計範圍） |
| QPS | 系統每秒收到多少次請求？ | 次／秒 |
| 頻寬 | 網路每秒能傳多少資料？估算時要問需要傳多少。 | MB/s、Mbps |
| 儲存量 | 把資料保存下來，需要多少空間？ | KB、GB、TB |

#### DAU：一天有多少不同的人來用

DAU 是 **Daily Active Users，每日活躍使用者數**。

假設今天小明打開網站 5 次、小美打開 3 次、小華打開 1 次，今天的 DAU 是 **3 人，不是 9 人**。同一個人一天內重複使用，通常只算一位；實際上什麼行為算「活躍」，由產品定義。

**今天有 100 萬人用過，不代表 100 萬人同時在線。** 就像餐廳一天接待 300 人，也不代表店裡同時坐著 300 人。後面計算即時推送時，還需要另外假設某個時間點有多少人在線。

#### QPS：系統每秒要處理多少次請求

QPS 是 **Queries Per Second**。這頁用它表示「每秒 API 請求數」。

「請求（request）」就是前端向後端提出一次要求。例如：

```js
fetch('/api/watchlist'); // 要求後端：給我自選股票清單
```

這樣呼叫一次，就是一次 API 請求。假設每次打開頁面，前端先呼叫一次 API 取得自選清單，再呼叫一次 API 取得股價，**打開一次頁面就會產生 2 次請求**。

如果某一秒有 10 個人打開頁面，而且各自在這一秒發出這兩次請求：

```txt
10 人 × 每人 2 次請求 = 20 次請求
這一秒的 QPS = 20
```

所以不能直接把 DAU 當成 QPS：一個算一天內的不同使用者，一個算每秒的請求。

後面的範例假設每人一天打開 4 次、每次發出 2 次請求：

```txt
每人每天：4 × 2 = 8 次請求
100 萬人每天：100 萬 × 8 = 800 萬次請求
一天有：24 × 60 × 60 = 86,400 秒
平均 QPS：800 萬 ÷ 86,400 ≈ 93 次／秒
```

這是把整天的請求平均分攤到每一秒。但使用者可能集中在股市開盤時進站，所以還要估「**尖峰 QPS**」，也就是最忙時每秒的請求數。後面先假設尖峰是平均的 10 倍；這個倍數叫 **peak factor（尖峰倍率）**，不是固定規則。

#### 頻寬：每秒要傳多少資料

把網路想成水管，資料是水，頻寬就是水管每秒能送多少水。QPS 只告訴你有幾次請求，但傳一個股價數字和傳一張大圖片，資料大小不同，對網路的負擔也不同。

股票網站還會主動把最新股價推送給使用者。先用小一點的數字理解：

```txt
同時有 100 人看股價
每人每秒收到 2 則更新
每則更新大小是 200 bytes

每秒傳送量 = 100 × 2 × 200
           = 40,000 bytes／秒
           = 40 KB/s
```

也就是光這些更新，網路每秒就需要送出 40 KB 的資料。這裡算的是「**需要的資料傳輸速率**」，用來估算應準備多少頻寬。伺服器向外送資料，叫 **egress（輸出流量）**。

單位要留意大小寫：

```txt
B = Byte，位元組；b = bit，位元
1 Byte = 8 bits
1 KB = 1,000 bytes（本題採十進位估算）
1 MB = 1,000,000 bytes

20 MB/s = 每秒 20 百萬個 bytes
        = 160 百萬個 bits／秒
        = 160 Mbps（也寫成 Mb/s）
```

#### 儲存量：資料存下來占多少空間

小明追蹤台積電、小美追蹤聯發科，網站要保存這些設定，下次打開才知道各自的清單有哪些股票。這些資料會占用儲存空間。

```txt
每人的自選清單資料占 2 KB
共有 100 萬人的清單要保存

儲存量 = 100 萬 × 2 KB = 2 GB
```

如果為了故障時仍有資料，總共保存 **3 份副本**，就是 `2 GB × 3 = 6 GB`。這裡的 **replication factor（副本數）** 是 3，表示總共三份，包含原本那一份。

**儲存量要看「有多少人的資料需要保存」，不一定是 DAU。** 昨天有來、今天沒來的人，他的自選清單通常也要保留。後面的範例另外假設需要保存資料的使用者也是 100 萬人，不能只從 DAU 推出這個數字。

#### 後面會遇到的幾個英文

| 用詞 | 在這道題的意思 |
| --- | --- |
| session | 一次開啟並使用自選清單的過程；本題假設每次產生 2 次 API 請求。 |
| concurrent users／同時在線人數 | 某個時間點正在使用網站的人數。 |
| connection | 網路連線；本題簡化為每位在線使用者維持一條接收股價的連線。 |
| symbol | 股票或交易商品的代號。 |
| payload | 一則訊息實際攜帶的資料內容；200 bytes 是它的大小，尚未包含傳輸協定額外占用的空間。 |
| metadata | 描述清單的資料，例如追蹤的股票代號與排序；這裡不包含完整的歷史股價。 |

先不用背公式。能用自己的話回答「每天幾個人、每秒幾次請求、每秒傳多少資料、保存資料占多少空間」，再往下計算。

> 以下數字全是練習假設，不是任何公司的真實流量。面試時先說清楚假設，得到面試官同意後再算；數量級與推導比小數點精準更重要。

### 1. 先列假設

```txt
DAU：1,000,000 人
每位使用者每日開啟 watchlist：4 次
每次讀取 API requests：2 次
讀取流量的 peak factor：10 倍
同時在線率：5%
每位在線使用者平均訂閱：20 個 symbols
每次推送 payload：200 bytes
同一使用者的 UI／網路更新頻率：每秒 2 次合併訊息
每位使用者平均保存的 watchlist metadata：2 KB
需要保存 watchlist 資料的使用者總數：1,000,000 人（獨立於 DAU 的假設）
資料副本數：3
```

### 2. 核心估算公式

```txt
平均 QPS = DAU × 每人每日 requests ÷ 86,400
尖峰 QPS = 平均 QPS × peak factor
頻寬 = 同時連線數 × 每連線每秒訊息數 × 平均 payload bytes
儲存量 = 需要保存資料的使用者總數 × 每位使用者資料量 × replication factor
```

計算前先把單位寫在紙上，避免把 bits、bytes、MB、GB 或「每天」與「每秒」混在一起。

### 3. Worked Example

#### API QPS

```txt
每人每日 requests = 4 sessions/day × 2 requests/session = 8 requests/day

平均 QPS
= 1,000,000 users/day × 8 requests/user ÷ 86,400 seconds/day
≈ 92.6 requests/second
≈ 100 QPS（數量級）

尖峰 QPS
≈ 100 × 10
≈ 1,000 QPS
```

平均值很容易掩蓋尖峰。系統 sizing、rate limit 與 load test 至少要以尖峰和安全餘裕討論，不能只拿約 100 QPS 當容量目標。

#### Realtime Egress Bandwidth

```txt
同時在線人數
= 1,000,000 DAU × 5%
= 50,000 connections

每秒輸出 bytes
= 50,000 connections × 2 messages/second × 200 bytes/message
= 20,000,000 bytes/second
≈ 20 MB/s
≈ 160 Mb/s
```

這裡估的是 application payload 的最低量級，尚未加入 WebSocket／TLS／TCP overhead、重送、heartbeat、區域間流量和突發尖峰。若每個 symbol tick 都個別推送，不做 batching／coalescing，訊息數可能遠高於此假設。

#### Watchlist Storage

```txt
原始資料
= 1,000,000 位需保存資料的使用者 × 2 KB/user
= 2 GB

三副本
= 2 GB × 3
= 6 GB
```

這只包含目前 watchlist metadata，不包含 index、database overhead、備份、WAL／binlog、歷史版本、audit log 或 market data。面試時要說出自己算的是哪一層，避免把 `6 GB` 說成整個系統的全部儲存需求。

### 4. 今日主動產出

至少完成一項；其餘可當參考答案對照。

#### [ ] 一張小圖

```txt
1,000,000 DAU
      │ × 8 requests/day ÷ 86,400 × peak 10
      ├──────────────────────────────→ 約 1,000 peak API QPS
      │
      │ × 5% online × 2 msg/s × 200 B
      ├──────────────────────────────→ 約 20 MB/s egress payload
      │
      │ × 2 KB × 3 replicas
      └──────────────────────────────→ 約 6 GB current metadata
```

#### [ ] 三個數字

```txt
約 1,000 peak API QPS
約 20 MB/s realtime egress payload
約 6 GB current watchlist metadata（含三副本）
```

每個數字都要附假設。只背結果、不會重算，不算完成。

#### [ ] 一個 Failure Case

```txt
故障：市場開盤或重大消息發生時，真實 peak factor 從假設的 10 倍升到 50 倍，
同時 reconnect storm 讓大量 clients 在數秒內重新抓 snapshot。

影響：
- API QPS、WebSocket handshake 與 egress 同時暴增。
- Cache miss 可能把尖峰放大到 database。
- Queue 持續累積時，使用者收到「成功但過時」的價格。

偵測：
- 監控 request rate、p95/p99 latency、error rate、queue age、cache hit rate、
  active connections、reconnect rate 與資料 freshness。

保護與恢復：
1. Client 使用 exponential backoff 加 jitter，避免同步重連。
2. Snapshot API 做 per-user／per-IP rate limit，並優先由 cache 回覆。
3. 對價格更新做 batching／coalescing，設定 bounded queue 與 freshness 上限。
4. 過載時降級更新頻率並明確標示 stale，而不是無限累積舊訊息。
5. 容量恢復後逐步放量，確認 queue age 與 freshness 回到 SLO。
```

#### [ ] 3 分鐘口述

```txt
0:00–0:30  先說明產品範圍與所有假設
0:30–1:15  從 DAU 推導平均與尖峰 QPS
1:15–2:00  從 concurrent users 推導 realtime egress
2:00–2:30  推導目前資料與三副本儲存量
2:30–3:00  說明尖峰估錯的 failure case、監控與降級
```

### 5. 容量估算常見錯誤

- 把 `DAU` 直接當 concurrent users；兩者中間需要同時在線率或使用時長假設。
- 用 `DAU ÷ 86,400` 就叫做 QPS，卻漏掉每位使用者每天會產生多少 requests。
- 只算平均 QPS，不設 peak factor、成長餘裕或 failure burst。
- bytes 與 bits 混用；`20 MB/s` 約為 `160 Mb/s`，尚未含 protocol overhead。
- 只算單筆 payload，不乘訊息頻率與 fan-out recipients。**白話：除了「一則多大」，還要算「每秒幾則、傳給幾人」**。例如每則 200 bytes、每人每秒 2 則、共 100 位接收者（fan-out recipients），就是 `200 × 2 × 100 = 40,000 bytes／秒`。若訊息數已是所有接收者的合計，就不要再乘一次人數。
- 只算 raw data，不說 replication、index、log、backup 是否已包含。**白話：資料本身的大小，不等於全部儲存空間**。raw data 是原始資料；replication 是資料副本；index 是加速查找的索引；log 是運作或變更紀錄；backup 是供日後還原的備份。例如可以說：「原始資料 2 GB，總共三份副本是 6 GB，尚未包含索引、紀錄與備份。」重點是交代計算範圍。
- 算出精確到小數點很多位，卻無法解釋最敏感的假設是哪一個。**白話：要知道哪個假設最不確定，猜錯會讓結果差最多**。例如原本估每人每秒更新 2 則，需求是 20 MB/s；若實際是 20 則，就變成 200 MB/s，比小數點算幾位更值得關心。在這個乘法公式裡，人數、頻率或訊息大小任何一項變成兩倍，結果都會加倍；優先確認現實中可能變動最大的那一項。

### 6. 四家公司如何看同一題

| 公司方向 | 容量估算時要特別主動提到 |
| --- | --- |
| Amazon | 假設、數量級、peak factor、成本、failure mode 與可驗證的 SLO |
| Binance | 行情 fan-out、突發波動、freshness、reconnect storm、snapshot＋delta |
| 台積電 | 穩定餘裕、跨區／跨廠備援、audit／retention、降級與復原程序 |
| 聯發科 | 大型內部工具 concurrent usage、payload、前端渲染節流、可觀測性 |

### 7. 今日 System Design 驗收

- [ ] 我先聲明所有容量數字是題目資訊還是自己的假設。
- [ ] 我能從 DAU 推導 requests/day、平均 QPS 與 peak QPS。
- [ ] 我沒有把 DAU 和 concurrent users 混為一談。
- [ ] 頻寬計算包含 recipients、messages/second、payload 與單位轉換。
- [ ] 儲存估算說清楚是否包含副本、index、log 與 backup。
- [ ] 我能指出最敏感假設，並描述估低後的一個 failure case。
- [ ] 我完成了小圖／三個數字／failure case／3 分鐘口述至少一項。

---

## Part 5｜收尾與明日 Retrieval Check

### 今日卡點紀錄

| 主題 | 卡點 | 根因分類 | 下一個最小行動 |
| --- | --- | --- | --- |
| Valid Anagram | ＿＿＿＿ | 讀題／推導／JavaScript／Python／測試／Big-O | ＿＿＿＿ |
| Python | ＿＿＿＿ | venv／pyproject／型別／type hints | ＿＿＿＿ |
| React | ＿＿＿＿ | 更新流程／snapshot／ownership／trade-off | ＿＿＿＿ |
| System Design | ＿＿＿＿ | 假設／QPS／頻寬／儲存／failure | ＿＿＿＿ |

### 未完成才加入的補課項目

- [ ] 週六 30 分鐘：不看解答，從空白用 JavaScript 與 Python 各寫一次 `isAnagram`，共用 8 組測資並口述 invariant 與 Big-O。
- [ ] 週六 20 分鐘：從空資料夾建立 `.venv` 與最小 `pyproject.toml`，再用 type hints 寫一個小函式。
- [ ] 週日 15 分鐘：錄一段 90 秒 React 心智模型，必須包含一個有條件的 trade-off。
- [ ] 週日 20 分鐘：換一組 DAU、在線率與 payload，重新手算 QPS、頻寬、儲存量。
- [ ] 若以上今天已能閉卷完成：刪除對應補課，不新增進度，讓週末休息。

明日開始前，先不看答案回答：

```txt
1. Valid Anagram 的 Input／Output 契約是什麼？
2. 你的第一版作法每一輪維持什麼 invariant？
3. venv 與 pyproject.toml 分別解決什麼問題？
4. Type hints 為什麼不是 runtime validation？
5. React render、commit 與 browser paint 有何不同？
6. 如何從 DAU 推導 peak QPS，而不是直接猜一個數字？
```

## 今日結束打卡

```txt
實際開始／結束：＿＿＿＿～＿＿＿＿
Valid Anagram：未完成／提示後完成／閉卷完成
看到提示層級：未看／提示一／提示二／提示三／Stage B
Python 小實作：未完成／完成
React 口述：未完成／看稿完成／閉卷完成
System Design 主動產出：小圖／三個數字／failure case／3 分鐘口述

今天最重要的理解：

今天仍不穩的地方：

週末補課的唯一優先項目：
```

真正完成的標準不是「看完」，而是明天不看筆記仍能重建：

1. 用 JavaScript 與 Python 從題目契約與暴力瓶頸推導 Valid Anagram 的解法。
2. 建立隔離環境，說明 `pyproject.toml`，並讀寫常用 type hints。
3. 用自己的話講清楚 React 更新心智模型與一個有條件的 trade-off。
4. 從清楚假設算出 QPS、頻寬與儲存量，並說明估錯容量時如何失敗。
