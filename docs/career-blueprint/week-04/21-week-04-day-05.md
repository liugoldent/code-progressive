---
sidebar_position: 5
sidebar_label: "Day 5"
slug: "/career-blueprint/week-04-day-05"
title: "第 4 週 Day 5：Trapping Rain Water 圖解、Context 更新成本與快取恢復"
description: "140 分鐘日課：Trapping Rain Water 圖解與解法理解、React Context 更新成本及 state 歸屬、Production Incident 英文口述、週檢討，以及錯誤快取的恢復流程。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Trapping Rain Water", "Two Pointers", "Think Aloud", "React Context", "global state", "Production Incident", "cache recovery", "Caching"]
---

# 第 4 週 Day 5：Trapping Rain Water 圖解、Context 更新成本與快取恢復

> 安排日期：2026-10-02；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 本週 NC150 分類：Two Pointers  
> 本週 System Design 主題：Caching

接續[第 4 週 Day 3：reducer＋Context 與快取失效](/docs/career-blueprint/week-04-day-03)。今天把本週學過的指標推導、React state 歸屬與快取設計轉成面試回答。知識題先作答再展開解析；進度題只依自己的圖、錄音或紀錄勾選。Markdown 勾選不會在網站自動保存。

## 今日完成定義

- [ ] **NeetCode 150 週測｜45 分鐘**：Trapping Rain Water 只做圖解與解法理解，**不要求一次寫完程式**；全程 Think Aloud，結束後只記最多三個最重要錯誤。
- [ ] **React 面試化／系統設計｜45 分鐘**：解釋 Context 的更新成本，並用具體場景回答何時不用全域 state。
- [ ] **英文／行為面試｜20 分鐘**：以真實 Production Incident 說出症狀、證據、root cause、止血與防再發，錄一段英文回答。
- [ ] **週檢討｜10 分鐘**：列出本週完成、未完成、下週一個優先修正。未完成項只移到六、日補，不推遲下週主線。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：回答「快取資料錯了怎麼恢復？」並完成一張小圖／三個數字／一個 failure case／3 分鐘口述中的至少一項。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。完整題解另見 [LeetCode 42｜Trapping Rain Water](/docs/algorithms/leetcode/f0001-0100/l0042-trapping-rain-water)；先完成自己的圖與推導，再展開該頁解法。Caching Combo 若未完成，加入週末補課清單，不影響下週主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | Trapping Rain Water 週測 | 逐格水量圖、兩端移動理由、Think Aloud、最多三個錯誤 |
| 21:15–22:00 | React 面試回答 | 3 分鐘錄音、兩個 state 歸屬場景與成本判斷 |
| 22:00–22:20 | Production Incident | 真實事件的證據鏈、英文錄音與一個追問修正 |
| 22:20–22:30 | 週檢討 | 完成／未完成、週末補課、下週唯一優先修正 |
| 22:30–22:50 | Caching Combo | 恢復流程與四種主動產出至少一項 |

---

## Part 1｜NeetCode 150 週測：Trapping Rain Water（45 分鐘）

### 1. 限時規則與 Think Aloud

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–5 | 閉卷重述輸入、輸出與邊界 | 「每格寬 1，左右都要有擋水高度」 |
| 5–17 | 用兩組高度畫柱、左右最高柱與逐格水量 | 自己的圖與總和 |
| 17–29 | 從逐格公式推導預先計算與雙指標 | `leftMax`、`rightMax` 的意義與空間取捨 |
| 29–38 | 口述三輪指標移動，說明為何可結算較低側 | 指標軌跡、每輪不變量與 Big-O |
| 38–45 | 核對題解與反例，只記最多三個重要錯誤 | 原始圖、修正圖與下次可驗收動作 |

全程說出目前看到的高度、已知的最高擋板、自己還不確定哪一側，以及下一個要檢查的格子。卡住時先用 `[3, 0, 3]` 畫最小凹槽，保留原始推導。程式碼是可選的延伸，不列入今天的完成條件。

### 2. 先畫水，再抽象成公式

先在紙上畫 `[4, 2, 0, 3, 2, 5]`，逐格標出左側最高柱、右側最高柱、水面與水量；再用 `[3, 0, 3]` 和 `[1, 2, 3]` 檢查「有凹槽」與「沒有右擋板」兩種情況。

```txt
高度：[4, 2, 0, 3, 2, 5]
索引：  0  1  2  3  4  5
每格水量：_  _  _  _  _  _
總水量：___

對索引 i：water[i] = max(0, min(leftMax[i], rightMax[i]) - height[i])
```

這裡 `leftMax[i]` 與 `rightMax[i]` 包含第 `i` 根柱子。公式要解釋的是每格**較矮擋板**決定水面；柱子的高度本身不能算水。這組高度的逐格結果是 `0, 2, 4, 1, 2, 0`，總量 `9`，請在自己畫完後才核對。

**單選｜為什麼 `[1, 2, 3]` 的總水量是 0？**

- [ ] A. 每根柱子都比左邊高，所以右邊一定有水。
- [ ] B. 每格較矮的左右最高擋板不高於該格柱子，沒有可留住的水。
- [ ] C. 只有長度大於 3 的陣列才可能積水。

<details>
<summary>畫完再看答案</summary>

**答案：B。** 光看到一側高柱不足以積水；左右兩側都要形成有效邊界。完整題面與更多測資見[題目筆記](/docs/algorithms/leetcode/f0001-0100/l0042-trapping-rain-water)。

</details>

### 3. 用逐格解法理解雙指標

逐格向左右掃描最高柱容易重做工作；先建立左右最高柱陣列可把時間降為 `O(n)`，但要 `O(n)` 額外空間。雙指標保留 `leftMax` 與 `rightMax` 兩個累積值，分別是從兩端走到目前位置時見過的最高柱。每輪先把兩端目前柱高納入最高值，再處理**累積最高值較低的一側**：若 `leftMax <= rightMax`，右側已有足夠高的擋板，左格水量為 `leftMax - height[left]`，接著左指標向內；反之處理右格，水量為 `rightMax - height[right]`。每格只結算一次，每個指標至多走過陣列一次，所以時間 `O(n)`、額外空間 `O(1)`。

不要只背「移較矮邊」。本頁比較的是**兩側累積最高值**；若採用比較目前兩根柱高的另一種寫法，要另行維持那種寫法的不變量。口述時指出本輪為何已能結算該側、哪些格子已結算，以及另一側尚未確定的高度為何不影響本輪結果。

| 核對問題 | 應能說出的理由 |
| --- | --- |
| 為何只看相鄰柱不夠？ | 更遠的最高柱可能才是有效擋板。 |
| 與 Container With Most Water 差在哪？ | 這題累加每格水量；Container 題選兩根柱，最大化一個面積。 |
| `leftMax` 或 `rightMax` 何時更新？ | 處理該側位置時先納入目前高度，再計算非負水量。 |
| 指標相遇時怎麼辦？ | 該格至多結算一次；檢查自己採用的迴圈條件是否漏算或重算。 |

### 4. 只記最重要的錯誤

從實際犯過的錯誤選**最多三個**；沒有犯到就不勾，不必湊滿三個。每個錯誤寫一個下次可以重畫或口述驗證的動作。

- [ ] 把柱高或容器面積算進總水量 → 重畫 `[3, 0, 3]` 並逐格標柱與水。
- [ ] 只找相鄰擋板 → 在 `[4, 2, 0, 3, 2, 5]` 標出每格的遠端最高柱。
- [ ] 說不出移動較低累積最高值那側的理由 → 口述一輪「已知另一側擋板」與「本側累積最高柱」。
- [ ] 忘記邊界或重複結算 → 用遞增、遞減、單格測資追蹤指標。
- [ ] Big-O 只背結論 → 解釋每個指標的移動上限與保存的狀態。

- [ ] 已保存自己的水量圖與原始口述。
- [ ] 能手算至少兩組測資並說明逐格公式。
- [ ] 能說明預先計算與雙指標的時間、空間取捨。
- [ ] 已記最多三個真實錯誤及各自的修正動作。

---

## Part 2｜React 面試化／系統設計：Context 更新成本與 state 歸屬（45 分鐘）

### 1. 面試題與節奏

面試題：「Context 很方便。為什麼不能把所有 state 都放在一個全域 Provider？一個表單草稿、主題設定、每秒更新的即時價格，你會放哪裡？」

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–8 | 畫 state 的讀者、寫者及生命週期 | 每份 state 的 owner |
| 8–18 | 解釋 Provider `value` 身分變化與 Consumer 更新 | 一張更新路徑圖 |
| 18–28 | 比較表單、主題、即時價格三個場景 | 選擇與取捨 |
| 28–38 | 錄 3 分鐘英文或中文面試回答 | 第一版錄音 |
| 38–45 | 回答追問並對照官方文件 | 修正一個不精確的說法 |

### 2. Context 的成本要說精確

Context 讓深層元件讀到上層 Provider 的值，適合跨越多層傳遞相同資訊。Provider 的 `value` 變成不同值時，讀取該 Context 的元件會重新 render；React 用 `Object.is` 比較前後值。`memo` 不能阻止**自己讀了已變動 Context** 的元件更新。若 Provider 每次 render 都建立新的物件或函式，即使欄位內容看似相同，也可能讓 Consumer 做不必要的工作；可在量測後穩定 `value`，或依更新頻率與讀者拆分 Context。實際成本仍應用 Profiler 看 Consumer 數量、更新頻率與 render 工作量。[React 官方：useContext](https://react.dev/reference/react/useContext)、[React 官方：memo](https://react.dev/reference/react/memo)。

```txt
Provider value 改變
   └─ 讀取此 Context 的 Consumer 更新
       └─ 各 Consumer 執行自己的 render 工作
```

**單選｜`ThemeContext` 與高頻價格都塞進同一個 `value`，價格每秒變化時，哪個判斷較準確？**

- [ ] A. 只有讀取 `price` 欄位的 Consumer 會更新。
- [ ] B. 讀取這個 Context 的 Consumer 會因新 `value` 更新；可依讀者與更新頻率拆分並量測。
- [ ] C. 替所有 Consumer 加 `memo` 後，Context 變化不再觸發更新。

<details>
<summary>先答，再看解析</summary>

**答案：B。** 基本 `useContext` 訂閱的是整個 Context 值，不會自動只追蹤物件的某一欄；`memo` 不能跳過已變動 Context 導致的 Consumer 更新。[React 官方：useContext](https://react.dev/reference/react/useContext)。

</details>

### 3. 何時不用全域 state

| 場景 | 優先歸屬 | 判斷理由 |
| --- | --- | --- |
| 只在表單內使用的輸入草稿與驗證訊息 | 表單元件或最近共同父層 | 讀寫範圍小，離開表單即可丟棄，無需擴散到全站。 |
| 整站多處讀取、很少改變的主題偏好 | 接近需要它的共同上層；必要時用 Context | 避免逐層傳遞，但仍要確認讀者與 Provider 範圍。 |
| 每秒變動、只在行情面板顯示的價格 | 行情區域或專用訂閱邊界 | 避免高頻更新帶動無關 Consumer；跨頁共享時再設計資料來源與訂閱。 |
| 可由既有 state 計算的總價或篩選結果 | 不另存 state，render 時計算 | 避免兩份資料不同步；昂貴時計量後再考慮 memoization。 |

「不用全域」不等於只能存在一個子元件：兩個兄弟元件都要讀寫時，先提升到最近共同父層。資料若來自伺服器，還要決定快取、重新驗證與失效策略；Context 只負責傳遞值，本身不提供這些策略。

### 4. 三分鐘口述與追問

```txt
0:00–0:35  先找 state 的讀者、寫者與生命週期。
0:35–1:20  說明 Provider value 身分改變後的 Consumer 更新成本。
1:20–2:15  比較表單草稿、主題、即時價格的歸屬。
2:15–3:00  提出量測方式，以及何時拆 Context 或縮小 Provider 範圍。
```

追問：「`memo` 是否能擋住 Context 更新？」「拆 Context 的代價是什麼？」「兩個相鄰元件共用草稿，是否一定要全域？」回答時各說一個條件與代價；不要宣稱任何一次更新都會重畫整頁 DOM。

- [ ] 已錄 3 分鐘回答，能指出 Consumer 更新原因與量測方法。
- [ ] 三個場景都能選擇 state owner 並說出取捨。
- [ ] 能回答 `memo`、拆分 Context、最近共同父層三個追問。

---

## Part 3｜英文／行為面試：Production Incident（20 分鐘）

選一件**自己實際參與**的正式環境事件。若當時沒有權限修復或沒有確認 root cause，就明說自己負責的調查、止血與驗證範圍；不要把練習情境或未證實的推測說成個人經歷。

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–4 | 選事件並界定影響 | 使用者症狀、起始時間與範圍 |
| 4–8 | 排出證據鏈 | 指標、log、trace、變更紀錄及反證 |
| 8–12 | 分開 root cause 與止血 | 造成錯誤的機制、當下恢復動作 |
| 12–17 | 錄 90 秒英文 | 自己的行動、恢復證據與後續防再發 |
| 17–20 | 回答追問、修正一句 | 如何驗證？還有什麼不確定？ |

| 段落 | 英文起句 | 要補上的真實內容 |
| --- | --- | --- |
| 症狀 | “Users started seeing…” | 受影響流程、時間、比例或範圍；沒有數字就說觀察依據。 |
| 證據 | “We compared … and found …” | 哪個指標異常、哪個 log／trace 支持或否定假設。 |
| Root cause | “The root cause was …” | 若已確認，說出觸發條件與失效機制；未確認則說 “Our leading hypothesis was …”。 |
| 止血 | “To restore service, I …” | 回滾、切流、停用功能、限流或修復資料，以及自己實際做的部分。 |
| 防再發 | “After recovery, we …” | 監控、測試、發布防護或 runbook，如何驗證有效。 |

**單選｜哪種說法有足夠的因果與驗證？**

- [ ] A. “The site was slow, so we restarted everything and it was solved.”
- [ ] B. “After a release, checkout errors rose. A trace isolated a failing dependency. We rolled back, watched the error rate return to baseline, then added a release check.”
- [ ] C. “I know the root cause was the database because databases often fail.”

<details>
<summary>先答，再看解析</summary>

**答案：B。** 它提供症狀、證據、止血與恢復驗證；但這只是示範答法，不可當成自己的經驗。正式回答仍要補充當時真正確認的 root cause 與自己的貢獻。

</details>

追問練習：“How did you separate correlation from root cause?”、“What did you do while the cause was still uncertain?”、“How did you know the incident was over?”

- [ ] 已用真實事件錄 90 秒英文，沒有捏造數字或權限。
- [ ] 症狀、證據、root cause、止血、防再發五段都能說明。
- [ ] 能指出恢復驗證及一項尚存的不確定性。

---

## Part 4｜週檢討：只選一個下週優先修正（10 分鐘）

先盤點可回看的成果，再列未完成與最小補做動作。`2026-10-03（六）`、`2026-10-04（日）` 是補課時段；不要因為週末沒補完，就把下週主線往後挪。

| 本週方向 | 可作為完成證據 |
| --- | --- |
| Two Pointers：Two Sum II、3Sum、Container With Most Water、Trapping Rain Water | 自己的圖、測資、移動理由；本日 Trapping Rain Water 只要求圖解與理解。 |
| React reducer 與 Context | state owner、transition 或 Provider 更新路徑、口述錄音。 |
| Python 次主線 | 實際建立 package、import 與例外處理的紀錄或測試。 |
| Caching | 快取層次、cache-aside、失效與錯誤資料恢復的圖或數字。 |
| 英文／行為面試 | 真實事件的證據鏈與錄音。 |

**完成盤點（只勾有證據的項目）**

- [ ] 演算法練習留下自己的圖或程式、測資與推導。
- [ ] React／Python 練習留下可回看的實作或口述。
- [ ] Caching 至少留下本週一項自己的產出。
- [ ] Production Incident 已用真實事件完成英文錄音。

**未完成才勾選，並排入六、日補課**

- [ ] 六：補 Trapping Rain Water 逐格圖與移動理由，不強迫一次寫完程式。
- [ ] 六：補 React state 歸屬表與 3 分鐘口述。
- [ ] 日：補 Python 或本週其他最小未完成練習，保存實際證據。
- [ ] 日：補 Production Incident 真實證據鏈或英文錄音。
- [ ] 日：Caching Combo 尚無主動產出，保留 20 分鐘補一張小圖／三個數字／一個 failure case／3 分鐘口述；**不影響下週主線**。
- [ ] 本週無待補項目；此項不可與上面任一補課項同時勾選。

**下週唯一優先修正（依實際最大卡點單選）**

- [ ] 演算法：先畫最小反例與不變量，再碰程式。
- [ ] React：先找 state 的讀者、寫者和 owner，再選傳遞方式。
- [ ] 系統設計：先定義權威資料、容許舊值時間與恢復指標。
- [ ] 面試口述：每次用一項證據支持一項因果主張。

未完成項只移到六、日補，不推遲下週主線。週末仍未補完時保留未完成紀錄，下一週照原定主題開始。

---

## Part 5｜每日 System Design × 高併發 Combo：快取資料錯了怎麼恢復？（20 分鐘）

### 今日微題

商品價格的權威資料在 DB，服務以 Redis cache-aside 加速讀取。發布後部分使用者看見舊價或錯價。請在 3 分鐘內說明：怎樣判定**哪一層錯**、先怎麼止血、如何回到權威值，以及如何確認真的恢復。沿用本週的 [cache-aside 與快取失效筆記](/docs/career-blueprint/week-04-day-03)。

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–4 | 畫 Client → Browser／CDN → App／Redis → DB | 標權威值與可能舊值的層 |
| 4–9 | 比對錯誤樣本與來源 | key、版本、TTL、時間、DB 值與受影響範圍 |
| 9–15 | 排止血、修復、驗證順序 | 刪錯 key／繞過快取／回填、保護 DB、監控 |
| 15–20 | 完成四選一主動產出 | 小圖／三個數字／failure case／3 分鐘口述 |

**參考恢復順序：** 先辨認錯誤的是 DB 權威資料還是某個快取副本；若 DB 本身錯，先修權威資料，清快取不會治本。若 DB 正確，定位錯誤 key、受影響使用者與快取層，暫時繞過或停用受影響讀取路徑，對明確範圍執行失效；若大量 key 要同時失效，評估 DB 回源容量，分批清理、限流或預熱，避免 cache stampede。接著驗證讀取重新取得正確資料，檢查舊值是否被並發請求重新回填。再修正失效、版本、TTL 或部署流程。Redis 的 cache-aside 文件描述寫入主資料後刪除快取、讀取 miss 後回填並設定 TTL，也指出熱門 key 同時過期可能使 DB 瞬間承壓。[Redis 官方：cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)。

**單選｜DB 已是正確價格，但 Redis 部分 key 是舊價，下一步哪個較合理？**

- [ ] A. 只把 TTL 加長，讓系統有時間自行恢復。
- [ ] B. 先確認錯誤 key 與影響範圍，針對性失效或繞過，控制回源並驗證正確值。
- [ ] C. 不檢查 DB，直接清掉所有環境的全部快取。

<details>
<summary>回答後看解析</summary>

**答案：B。** TTL 只限制該層舊值存活時間，不保證立即正確；全量清空可能導致大量 miss 與 DB 壓力，也可能漏掉 Browser／CDN 等其他層。要先確認權威值與錯誤範圍，再執行可驗證的恢復。

</details>

### 主動產出：四選一，至少完成一項

- [ ] **一張小圖**：標出哪一層有舊值、權威 DB、失效或繞過點、恢復後的讀取路徑。
- [ ] **三個數字**：假設流量 `2,000 reads/s`、命中率 `95%`，正常 DB 約 `100 reads/s`；若全部失效，短時可能接近 `2,000 reads/s`。寫出假設、單位與保護方法，這些是演算值而非實測容量。
- [ ] **一個 failure case**：DB 已更新、`DEL` 失敗，或舊請求在刪除後回填舊值；描述使用者現象、觀測、止血與防再發。
- [ ] **3 分鐘口述**：依「權威值 → 定位錯層 → 止血 → 安全失效／回填 → 驗證 → 防再發」錄音。

驗收時看相同 key 的 DB 值、各快取層版本與實際使用者回應是否一致，並追蹤錯價比例、cache hit／miss、DB QPS、延遲與錯誤率。若版本 key 用來避開舊值，讀取端仍須從可靠來源取得**目前版本**；只換 key 名稱不等於恢復。[Redis 官方：cache-aside](https://redis.io/docs/latest/develop/use-cases/cache-aside/)。

---

## 今日結束打卡

- [ ] Trapping Rain Water 已完成圖解、推導與 Think Aloud；只記最多三個實際錯誤。
- [ ] React 回答有 Context 更新成本、state 歸屬場景與錄音。
- [ ] Production Incident 英文回答有真實證據、止血與防再發。
- [ ] 週檢討已列完成、未完成、六日補課與下週唯一優先修正。
- [ ] Caching Combo 至少完成一項主動產出；未完成則已加入週末清單。

[回到一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
