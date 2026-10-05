---
sidebar_position: 1
sidebar_label: "Day 1"
slug: "/career-blueprint/week-03-day-01"
title: "第 3 週 Day 1：Valid Sudoku、React Effect 邊界與水平擴展"
description: "140 分鐘日課：Valid Sudoku 讀題、暴力解與 Pattern 推導、閉卷實作及 Edge Cases；整理 React effect、event、derived data 與 cleanup；比較垂直／水平擴展及負載平衡。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Valid Sudoku", "Arrays and Hashing", "React effect", "event handler", "derived data", "cleanup", "vertical scaling", "horizontal scaling", "load balancing", "水平擴展", "負載平衡"]
---

# 第 3 週 Day 1：Valid Sudoku、React Effect 邊界與水平擴展

> 安排日期：2026-09-21；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing III  
> 本週 System Design 主題：水平擴展與負載平衡

接續 [第 2 週 Day 5](/docs/career-blueprint/week-02-day-05)。今天先獨立產出，再對照解析；能說出 `Set`、`useEffect` 或「加機器」不等於理解，必須說明它解決哪個重複工作、由什麼事件觸發，以及失敗時如何收回資源或流量。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。程式、測試、圖與口述仍需留下自己的可驗證證據。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Valid Sudoku 先讀題與 constraints，說出 brute force／Pattern，再閉卷實作、測 Edge Cases、寫 Big-O。
- [ ] **React 主線｜50 分鐘**：整理 effect、event、derived data 邊界與 cleanup，完成分類、改寫與操作驗證。
- [ ] **收尾｜10 分鐘**：記錄卡點與明確的週末補課項目。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：比較 vertical／horizontal scaling；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項放進週末補課，不推遲下一個工作日的主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Valid Sudoku | 題意、暴力解、Pattern 推導、閉卷程式、測資與 Big-O |
| 21:30–22:20 | React 邊界整理 | 分類表、改寫程式、cleanup 操作紀錄 |
| 22:20–22:30 | 收尾 | 卡點、週末時段與可驗收的補課動作 |
| 22:30–22:50 | Scaling 比較 | 小圖／三個數字／failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：Valid Sudoku（60 分鐘）

完整三階段題解沿用 LeetCode 專區：

**[開始 LeetCode 36｜Valid Sudoku 練習](/docs/algorithms/leetcode/f0001-0100/l0036-valid-sudoku)**

該頁包含 Stage A 解題前、Stage B 解題分析、Stage C 工程遷移，以及 TypeScript＋Python 的第一次實作模板、暴力解、最佳化解與可執行測試。今天完成自己的版本前，只讀 Stage A；不要展開提示或往下看答案。若以前看過解答，仍要從空白閉卷重寫並留下卡點。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 讀題、constraints 與契約 | 一句話題意；列出「驗證」不等於「求解」 |
| 8–15 | 手算官方與自訂測資 | 先寫預期值，不執行 code |
| 15–23 | 說出 brute force | 正確性理由、比較範圍與成本預估 |
| 23–30 | 從瓶頸推導 Pattern | 三句計畫；說明狀態按什麼範圍分組 |
| 30–43 | 閉卷實作 | TypeScript＋Python；未完成語言標記補課 |
| 43–53 | 跑 Edge Cases | 官方 2 組＋自訂至少 5 組 |
| 53–60 | Big-O 與口述 | 固定棋盤、一般化棋盤、invariant 與一個修正點 |

### 1. 先確認題目，而不是先背解法

**單選｜Valid Sudoku 要判斷什麼？**

- [ ] A. 目前棋盤是否已填滿，而且只有唯一解。
- [ ] B. 目前已填數字是否違反同行、同列或同一個 3×3 宮不可重複的規則。
- [ ] C. 自動補完所有空格，再回傳完成後的棋盤。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 題目只驗證目前已填的格子；`.` 是空格，不參與重複判斷。合法的未完成棋盤不代表一定可解，也不必在本題證明有解。

</details>

**單選｜官方 constraints 對實作有什麼影響？**

- [ ] A. 棋盤固定為 9×9，值只會是 `"1"` 到 `"9"` 或 `"."`；提交官方題目時不必自行設計任意尺寸規則。
- [ ] B. 每列長度可能不同，所以一定要先補成正方形。
- [ ] C. 輸入可能包含任何 Unicode 字元，必須先正規化。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 防禦非法 API 輸入是另一個需求，不能把自訂需求冒充官方限制。今天可額外約定不修改輸入，並用測試驗證。

</details>

### 2. Brute force 與 Pattern 推導

先閉卷口述以下四句，再展開參考答案：

1. 最直接的正確方法會比較什麼？
2. 它在哪裡重複掃描？
3. 處理到某一格時，真正需要知道的資訊是什麼？
4. 同一個數字出現在不同宮，為何不能用一個全域容器判斷？

<details>
<summary>第 23 分鐘後核對推導</summary>

最直接的方法是把已填格兩兩比較；數字相同且同行、同列或同宮就回傳 `false`。它是正確的，但同一區域會被反覆掃描。

逐格處理時，只需要快速回答三個問題：這個值在目前 row 看過沒、在目前 column 看過沒、在目前 box 看過沒。因此狀態要按三種範圍分開保存。`Set` 保存「看過沒」已足夠；若需求改成回報衝突座標，才需要保存位置的 `Map` 或其他結構。

宮編號可寫成：

```txt
box = floor(row / 3) * 3 + floor(column / 3)
```

處理一格之前的 invariant 是：每個容器精確保存其範圍內「已處理且非空」的數字，而且前面尚未發現衝突。必須先查再加入。

</details>

### 3. 閉卷實作模板

先寫 2–3 句計畫，才開始 coding。保留第一次失敗版本；不要用參考答案覆蓋學習證據。

#### TypeScript

```ts
function isValidSudoku(board: string[][]): boolean {
  throw new Error('先完成自己的版本');
}
```

#### Python

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    raise NotImplementedError('先完成自己的版本')
```

```txt
實際耗時：
結果／失敗測資：
錯誤類型（契約／推導／宮編號／邊界／語法／複雜度）：
卡點：
看到第幾層提示：
```

### 4. Edge Cases：先手算再執行

下列字串的 `/` 代表換列，實際測試時要建立 9×9 二維字元陣列。

| 測資 | 預期 | 驗證目的 |
| --- | --- | --- |
| 官方合法棋盤 | `true` | 一般未填滿棋盤 |
| 官方衝突棋盤 | `false` | 數字造成列／宮衝突 |
| 九列皆為 `.........` | `true` | 空格必須略過 |
| `1.......1 / ......... / ...` | `false` | 只在同一 row 衝突 |
| `1........ / ......... / ... / 1........` | `false` | 只在同一 column 衝突 |
| `1........ / .1....... / ...` | `false` | 只在同一 box 衝突 |
| `(0,0)=1`、`(4,4)=1`，其餘空白 | `true` | 不同 row／column／box 可重複 |

今日至少實際執行七組測資，並確認函式沒有修改輸入。完整可執行測試在題解頁 Stage B。

### 5. Big-O 與口述驗收

**單選｜這題的複雜度應如何說最完整？**

- [ ] A. 永遠是 O(n)，因為有兩層迴圈但常數可忽略。
- [ ] B. 官方固定 81 格，因此時間與額外空間可視為 O(1)；若一般化為 N×N 棋盤，逐格集合版本平均 O(N²) 時間、O(N²) 空間。
- [ ] C. 使用 Set 後完全不必讀棋盤，所以是 O(1)。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 固定輸入大小與一般化分析要分開說。暴力兩兩比較在一般化棋盤有 O(N⁴) 次配對；逐格版本讀 N² 格，雜湊查詢平均 O(1)，所以平均 O(N²)。本頁實作固定為 9×9，不能因此宣稱支援任意 N。

</details>

**今日驗收**

- [ ] 能說出驗證棋盤與求解數獨的差異。
- [ ] 能由重複掃描推導出需要保存的資訊，不只報 `Set`。
- [ ] TypeScript 與 Python 都從空白實作；若只完成一種，另一種已排入補課。
- [ ] 官方範例與五種自訂 Edge Cases 都已實際執行。
- [ ] 能解釋宮編號、先查後加，以及每輪要保持的條件。
- [ ] Big-O 同時說清固定棋盤與一般化棋盤的差異。

---

## Part 2｜React 主線：effect、event、derived data 與 cleanup（50 分鐘）

### 今日目標與節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | 建立三分法 | 將 8 個情境分類成 render／event／effect |
| 10–22 | derived data 改寫 | 刪除同步 state 的多餘 effect |
| 22–35 | event 與 effect 邊界 | 解釋「為什麼執行」而不是看程式內容猜 |
| 35–45 | cleanup 實作 | timer／subscription／request 至少操作一種 |
| 45–50 | 口述與驗收 | 一分鐘決策樹＋三題單選 |

React 官方把 Effect 定義為「讓元件與外部系統同步」；如果沒有外部系統，通常不需要 Effect。可由目前 props／state 算出的資料，直接在 render 計算；特定使用者操作造成的工作，放在相對應的 event handler。參考 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) 與 [`useEffect` reference](https://react.dev/reference/react/useEffect)。

### 1. 先問「為什麼執行」

| 類型 | 觸發原因 | 典型例子 | 不應承擔的工作 |
| --- | --- | --- | --- |
| Derived data | render 需要由現有資料算結果 | `fullName`、篩選清單、總價 | 不另存一份同步 state |
| Event | 使用者做了特定操作 | submit、購買、刪除、導航 | 不因重新掛載而重播 |
| Effect | 元件顯示後需與外部系統保持同步 | WebSocket、timer、DOM widget、瀏覽器 API | 不用來搬運可直接計算的資料 |

一句判斷法：

```txt
能由目前輸入算出？      → render 時計算 derived data
因這次 click／submit？  → event handler
因元件目前顯示且需同步外部系統？ → effect，並檢查 cleanup
```

### 2. Derived data：不要多存一份會失同步的答案

以下版本會先 render 舊的 `fullName`，Effect 執行後再更新 state，造成多一次 render，也多出一份必須同步的狀態：

```tsx
function Profile({ firstName, lastName }: { firstName: string; lastName: string }) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return <h2>{fullName}</h2>;
}
```

改成 render 時直接推導：

```tsx
function Profile({ firstName, lastName }: { firstName: string; lastName: string }) {
  const fullName = `${firstName} ${lastName}`;
  return <h2>{fullName}</h2>;
}
```

`useMemo` 不是「所有 derived data 都要用」；只有計算昂貴或穩定引用確實有價值時再考慮，而且它仍是 render 階段的快取，不是把資料同步到另一份 state。

**單選｜商品清單 `products` 與搜尋字 `query` 已在 props／state，畫面要顯示符合項目，優先放哪裡？**

- [ ] A. render 中計算 `products.filter(...)`；先確認效能瓶頸，再決定是否 memoize。
- [ ] B. 用 effect 把結果同步到 `visibleProducts` state。
- [ ] C. 用 ref 保存結果，因為 ref 變更會自動更新畫面。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 結果完全由目前輸入決定，不需要另一個真相來源。若實測計算昂貴，可考慮 `useMemo`；不是看到 `.filter` 就先最佳化。

</details>

### 3. Event：知道是哪個操作發生，就在操作當下處理

購買 API 的原因是使用者按下按鈕，不是商品元件出現在畫面上。若先把 `shouldBuy` 設成 true，再用 Effect 送出，重新掛載、狀態恢復或依賴變動都可能讓語意變得難追。

```tsx
function BuyButton({ productId }: { productId: string }) {
  async function handleBuy() {
    await postPurchase(productId);
    showNotification('Purchase submitted');
  }

  return <button onClick={handleBuy}>Buy</button>;
}
```

**單選｜下列哪個工作最應放在 event handler？**

- [ ] A. 元件顯示期間訂閱聊天室，roomId 改變時切換連線。
- [ ] B. 使用者按 Submit 後，把這份表單 POST 到 API。
- [ ] C. 元件顯示期間監聽 window resize。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** A、C 都描述「顯示期間與外部系統同步」；B 有明確的一次使用者操作。判斷依據是執行原因，不是程式裡有沒有 async 或 API。

</details>

### 4. Effect：setup 與 cleanup 是同一段同步流程

Effect 的 cleanup 不只在 unmount 執行。依賴改變後，React 會先用舊值執行 cleanup，再用新值執行 setup；元件移除時再做最後一次 cleanup。開發模式的 Strict Mode 還會額外做一次 setup → cleanup → setup，以檢查流程是否能安全重做。[`useEffect` reference](https://react.dev/reference/react/useEffect)

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <p>Room: {roomId}</p>;
}
```

時間線：

```txt
mount room=A        A.connect()
room A → B          A.disconnect() → B.connect()
unmount             B.disconnect()
Strict Mode 開發檢查 A.connect() → A.disconnect() → A.connect()
```

常見資源與 cleanup：

| setup | cleanup | 不清理可能發生什麼 |
| --- | --- | --- |
| `setInterval`／`setTimeout` | `clearInterval`／`clearTimeout` | 重複 callback、卸載後仍工作 |
| `addEventListener` | 相同 target／type／handler 的 `removeEventListener` | listener 疊加、舊閉包繼續執行 |
| WebSocket／subscription | `close`／`unsubscribe` | 重複訊息、連線與資源洩漏 |
| fetch request | `AbortController.abort()` 或忽略過期結果 | 舊回應覆蓋新結果、浪費請求 |

### 5. 15 分鐘操作：修正搜尋請求的競態

以下練習假設沒有框架提供的 data fetching／cache 層。輸入快速從 `react` 改成 `react effect` 時，較早的請求可能較晚回來；若直接 `setResults`，舊結果會覆蓋新結果。

```tsx
type SearchResult = { id: string; title: string };

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setError(null);
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setResults(await response.json());
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === 'AbortError') return;
        setError(caught instanceof Error ? caught.message : 'Unknown error');
      }
    }

    if (query.trim()) load();
    else setResults([]);

    return () => controller.abort();
  }, [query]);

  if (error) return <p role="alert">{error}</p>;
  return <ul>{results.map(item => <li key={item.id}>{item.title}</li>)}</ul>;
}
```

操作驗收：

- [ ] 在 Network 面板使用 Slow 3G，快速改變 query，看到舊 request 被取消或結果被忽略。
- [ ] 反覆掛載／卸載元件，確認沒有持續中的 timer、listener 或 subscription。
- [ ] 修改 Effect 使用的 reactive value，確認 dependency 完整，而不是用空陣列壓掉 linter。
- [ ] 能說明 framework data loader／query library 可能提供 cache、dedupe、SSR 等能力；手寫 Effect 不是所有專案的預設答案。

### 6. 一分鐘複習卡

| 問題 | 一句答案 |
| --- | --- |
| 什麼是 derived data？ | 能由目前 props／state 直接算出的值，通常在 render 計算 |
| 什麼放 event？ | 因特定 click、submit、input 等互動才要做的工作 |
| 什麼放 Effect？ | 元件顯示期間，需與 React 外部系統同步的工作 |
| cleanup 何時跑？ | 依賴改變時先清舊 setup，unmount 時再清最後一次 |
| Strict Mode 為何多跑一次？ | 開發時壓測 setup／cleanup 是否對稱且可重做 |
| dependency 怎麼決定？ | 由 Effect 讀取的 reactive values 決定，不是想跑幾次就手挑 |

**React 今日驗收**

- [ ] 能將八個情境分類為 derived data、event 或 effect，並說理由。
- [ ] 能刪除一個同步 derived state 的多餘 Effect。
- [ ] 能解釋 cleanup 的完整時機，不只說 unmount。
- [ ] 至少實際驗證 timer、listener、subscription 或 fetch cleanup 一種。
- [ ] 能說明 Effect 的 dependency 由讀取內容決定，以及缺少依賴的風險。

---

## Part 3｜收尾（10 分鐘）

前 4 分鐘只記真正卡住的地方；後 6 分鐘把卡點轉成「有日期、時長、動作與驗收結果」的週末補課。看過解析不等於已完成，不要為了清空清單勾選。

### 今日卡點紀錄（可複選）

- [ ] Valid Sudoku：把驗證棋盤誤解成求解或唯一解判定。
- [ ] Valid Sudoku：知道用 Set，但說不出 brute force 的重複工作。
- [ ] Valid Sudoku：宮編號、空格或先查後加寫錯。
- [ ] Valid Sudoku：測資可過，但 Big-O 沒區分固定與一般化棋盤。
- [ ] React：把可直接計算的 derived data 另存 state。
- [ ] React：把使用者事件繞到 Effect 才執行。
- [ ] React：只在 unmount 想到 cleanup，漏掉 dependency change。
- [ ] React：靠刪 dependency 消除重跑，沒有修正資料流。
- [ ] System Design：只會說加機器，說不出流量如何分配與移除故障節點。
- [ ] 目前沒有卡點。

### 明確的週末補課項目（依卡點複選）

- [ ] 週六 30 分鐘：從空白重寫 Valid Sudoku 兩種語言，跑官方 2 組與自訂 5 組測資，再口述 invariant／Big-O。
- [ ] 週六 15 分鐘：只用座標畫出九個 box 編號，閉卷寫兩次宮編號公式。
- [ ] 週六 25 分鐘：將一個同步 derived state 的元件改成 render 時計算，記錄 render 次數與行為差異。
- [ ] 週日 25 分鐘：實作 timer 或 listener 的 setup／cleanup，切換 dependency 並重新掛載驗證。
- [ ] 週日 20 分鐘：重畫三台 app server＋load balancer，補 health check 與 session 狀態位置。
- [ ] 週日 10 分鐘：閉卷錄一段 3 分鐘口述，比較 vertical／horizontal scaling 與一個 failure case。
- [ ] 無需補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：比較 vertical／horizontal scaling

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 定義兩種 scaling | 擴大單機 vs 增加節點 |
| 5–10 | 畫負載平衡圖 | 流量入口、節點與 health check |
| 10–15 | 算三個數字 | 單機容量、尖峰需求、容錯後容量 |
| 15–20 | failure case／口述 | 至少完成其中一項自己的產出 |

### 1. 核心比較

| 面向 | Vertical scaling（scale up） | Horizontal scaling（scale out） |
| --- | --- | --- |
| 動作 | 替單一節點增加 CPU、RAM、I/O | 增加多個服務節點共同處理流量 |
| 優點 | 架構簡單，應用通常較少改動 | 容量可分段增加，能跨節點容錯與滾動部署 |
| 上限 | 受單機規格、價格與停機升級限制 | 受共享狀態、資料分割、協調與負載分配限制 |
| 失敗面 | 單機仍可能是 single point of failure | 節點可故障，但 balancer／資料層仍須高可用 |
| 適合起點 | 小流量、難以拆分或有強單機需求的工作負載 | 無狀態請求處理、流量成長與高可用需求 |

Scale out 並不是把三台機器放上線就完成。入口要把請求送到健康節點，節點最好不要只把登入 session 存在自己的記憶體；否則同一使用者的下一個請求落到另一台就可能失去狀態。共享 session store、簽章 token 或有意識的 sticky session 都有不同取捨。

### 2. 一張小圖

```txt
                         health checks
Clients ──▶ Load Balancer ─────────────┐
                 │                     │
                 ├──▶ App A (healthy)  │
                 ├──▶ App B (healthy)  │
                 └──╳ App C (failed) ◀─┘
                         │
                         ▼
              Shared DB / Cache / Queue
```

負載平衡器的工作不只是 round robin；還要根據演算法與健康狀態，把新請求導向可服務的節點。它不能自動修正應用程式的共享狀態、資料庫瓶頸或非冪等重試。

### 3. 三個數字：先寫假設，再算容量

假設每台 app server 在延遲目標內可穩定處理 **400 RPS**，尖峰需求為 **900 RPS**，希望任一台故障後仍能承受尖峰：

1. 正常至少需要 `ceil(900 / 400) = 3` 台，總理論容量 1,200 RPS。
2. 三台中一台故障後只剩 800 RPS，低於 900 RPS，不能滿足 N+1 容錯目標。
3. 因此至少部署 4 台；一台故障後仍有 `3 × 400 = 1,200 RPS`，預留 300 RPS，也就是相對尖峰約 33% 餘裕。

這是練習數字，不是實測結論。真實容量必須用相同 request mix、下游依賴、延遲 percentile 與資源限制做 load test；平均 RPS 不能取代尖峰與尾延遲。

### 4. Failure case：節點失敗卻仍收到流量

情境：App C process 卡死，但 TCP port 還能接受連線。若 health check 只確認 port 是否開啟，負載平衡器仍把三分之一請求送過去，使用者看到 timeout；其他節點也可能因 retry storm 被拖垮。

處理順序：

```txt
症狀：部分請求 timeout
  → 比較各 target 的 error／latency
  → readiness check 判定 C 不可接新流量
  → Load Balancer 將 C drain／remove
  → 限制重試次數並加入 backoff／jitter
  → 修復或替換 C，再經 readiness 後逐步加回
```

Health check 要便宜、穩定，又能代表「是否可接流量」。檢查太淺會留下假健康節點；把所有下游都做深度檢查，又可能因單一下游波動同時移除全部節點。面試時要明確說出 readiness 的邊界。

### 5. 主動產出：至少勾一項

- [ ] **一張小圖**：閉卷重畫 Client → Load Balancer → 3 Nodes，標出 health check 與 shared state。
- [ ] **三個數字**：換成自己的單機 RPS、尖峰 RPS、故障一台後容量，寫出計算與假設。
- [ ] **一個 failure case**：說出偵測信號、隔離方式、重試風險與恢復條件。
- [ ] **3 分鐘口述**：依「定義 → 取捨 → 小圖 → 數字 → failure」完整回答一次。

### 6. 面試單選與三分鐘口述卡

**單選｜服務從一台擴成三台後，哪個問題最值得立刻確認？**

- [ ] A. 每台背景顏色是否相同。
- [ ] B. 使用者 session、檔案與排程是否只存在單一節點，以及故障節點如何停止接收新請求。
- [ ] C. 既然有三台，資料庫與負載平衡器一定自動高可用。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 水平擴展會暴露本機狀態與工作重複問題；load balancer 也需要健康檢查。App 層擴展不會自動消除資料層或入口的單點。

</details>

三分鐘口述順序：

1. Vertical 是擴大一台；horizontal 是增加多台。
2. 小流量先 scale up 可能最簡單；成長與可用性需求提高時再 scale out。
3. Load balancer 依健康狀態分配流量，但服務要處理共享狀態、重試與資料層容量。
4. 用三個數字驗證 N+1，而不是只說「多開幾台」。
5. 以假健康節點說明偵測、隔離、降載與恢復。

---

## 今日完成檢查

- [ ] Valid Sudoku 先讀題、constraints 與測資，再進入解法。
- [ ] 已說出 brute force、重複工作、Pattern、invariant 與 Big-O。
- [ ] 閉卷程式與 Edge Cases 有實際執行證據。
- [ ] React 能依執行原因區分 derived data、event 與 effect。
- [ ] 至少操作並驗證一種 cleanup。
- [ ] 收尾留下具體卡點與週末補課時段；若無卡點已如實標記。
- [ ] System Design 四種主動產出至少完成一項，而不是只閱讀參考內容。

## 延伸閱讀

- [React：You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React：Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React：useEffect reference](https://react.dev/reference/react/useEffect)
- [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html)

