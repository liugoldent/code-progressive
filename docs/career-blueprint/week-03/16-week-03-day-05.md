---
sidebar_position: 5
sidebar_label: "Day 5"
slug: "/career-blueprint/week-03-day-05"
title: "第 3 週 Day 5：Valid Palindrome 週測、useEffect 面試回答與擴展順序"
description: "140 分鐘日課：Valid Palindrome 限時重寫與 Two Pointers 模板、何時不該使用 useEffect、Amazon Customer Obsession 英文行為面試、週檢討，以及水平擴展架構的第一個瓶頸與擴展順序。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Valid Palindrome", "Two Pointers", "Think Aloud", "useEffect", "Customer Obsession", "水平擴展", "負載平衡", "bottleneck"]
---

# 第 3 週 Day 5：Valid Palindrome 週測、useEffect 面試回答與擴展順序

> 安排日期：2026-09-25；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing III／Two Pointers  
> 本週 System Design 主題：水平擴展與負載平衡

接續 [第 3 週 Day 4](/docs/career-blueprint/week-03-day-04)。今天把本週內容轉成面試輸出：先閉卷重寫並口述，再對照題解與參考回答。看到答案、聽懂講解或讀過範例，都不算自己完成。

作答方式：知識題先單選，再展開解析；進度與經歷題只依真實證據勾選。以下是 Markdown 清單，網站不會自動保存作答。請另外保存第一次程式、測試結果、口述錄音與週檢討。

## 今日完成定義

- [ ] **NeetCode 150 週測｜45 分鐘**：Valid Palindrome 限時重寫＋Two Pointers 模板，全程 Think Aloud；結束後只記最多三個最重要錯誤。
- [ ] **React 面試化／系統設計｜45 分鐘**：回答「何時不該使用 `useEffect`」，能區分 render 計算、事件處理與外部系統同步，完成 3 分鐘口述與追問。
- [ ] **英文／行為面試｜20 分鐘**：Amazon Customer Obsession，用真實使用者問題反推方案，完成一段有驗證依據的英文 STAR。
- [ ] **週檢討｜10 分鐘**：列出本週完成、未完成、下週一個優先修正。未完成項只移到六、日補，不推遲下週主線。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：指出架構第一個 bottleneck 與擴展順序；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。完整題解：[LeetCode 125｜Valid Palindrome](/docs/algorithms/leetcode/f0101-0200/l0125-valid-palindrome)。週測前只看題意與契約，不展開題解。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | NC150 週測 | 原始閉卷程式、測試、Two Pointers 模板、Think Aloud、最多三個錯誤 |
| 21:15–22:00 | React 面試回答 | 3 分鐘錄音、三個場景的選擇與理由、追問修正 |
| 22:00–22:20 | Customer Obsession | 真實使用者訊號、反推方案、90 秒英文錄音與結果證據 |
| 22:20–22:30 | 週檢討 | 完成／未完成、週末補課、下週唯一優先修正 |
| 22:30–22:50 | System Design Combo | 第一個瓶頸、擴展順序與至少一項主動產出 |

---

## Part 1｜NeetCode 150 週測：Valid Palindrome＋Two Pointers（45 分鐘）

### 1. 限時規則與節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 關閉舊解，重述契約與三組預期結果 | 輸入、輸出、忽略規則與邊界 |
| 4–27 | 選一種語言閉卷重寫 Valid Palindrome | 第一版程式、逐步口述與卡點 |
| 27–34 | 跑測試並說明指標移動 | 成功／失敗輸出與修正紀錄 |
| 34–40 | 抽象成 Two Pointers 模板 | 指標起點、跳過條件、比較／更新、停止條件、invariant |
| 40–45 | 對照題解，選最多三個重要錯誤 | 每個錯誤對應一個可驗證修正動作 |

全程 Think Aloud：契約 → 最直接正確做法 → 重複工作或額外空間 → 指標計畫 → 實作 → 測試 → Big-O。卡住時說出目前的假設與下一個最小測資；計時結束就保存原始版本。提示後才完成要如實標記。另一種語言放到週末補課，不擠占今天的面試主線。

### 2. Stage A｜先重述契約再寫程式

Valid Palindrome 要忽略非英文字母與數字，並忽略英文字母大小寫，判斷剩下的序列是否正反相同。本週的重點是說出「為何兩端可以逐步排除」，不是只喊 Two Pointers。

**單選｜`"0P"` 的結果與理由是什麼？**

- [ ] A. `true`；數字和英文字母都可忽略。
- [ ] B. `false`；`0` 與 `p` 都要保留，兩端不相同。
- [ ] C. 輸入不合法；字串中不得有數字。

<details>
<summary>完成第一版後再看契約答案</summary>

**答案：B。** 數字要保留；只跳過非英文字母、非數字的字元。此題完整限制與解法細節以 [125 題筆記](/docs/algorithms/leetcode/f0101-0200/l0125-valid-palindrome) 為準。

</details>

先選一種語言，從空白補完；另一種留作週末閉卷重寫。不要在考前複製完成版。

```ts
function isPalindrome(s: string): boolean {
  // TODO：閉卷寫出自己的計畫與實作。
  throw new Error('尚未完成');
}
```

```python
def is_palindrome(s: str) -> bool:
    # TODO：閉卷寫出自己的計畫與實作。
    raise NotImplementedError
```

| 輸入 | 預期 | 要驗證的情況 |
| --- | :---: | --- |
| `"A man, a plan, a canal: Panama"` | true | 大小寫與標點 |
| `"race a car"` | false | 有效字元不對稱 |
| `" "` | true | 清理後為空 |
| `"0P"` | false | 數字必須保留 |
| `"ab_a"` | true | 跳過底線後比較 |

### 3. Two Pointers 模板：從本題抽出可遷移的問題

閉卷寫出自己的五句模板，並各用一個測資解釋：

1. 兩個指標從哪裡開始？對「相向」與「同向」題目是否一樣？
2. 哪些元素可跳過？跳過時如何保證不越界？
3. 每輪比較或更新什麼？哪個狀態可以安全排除？
4. 指標何時停止？相遇、交錯或走完整段，各代表什麼？
5. 每輪 invariant 是什麼？每個指標最多移動幾次？

**單選｜本題兩端略過無效字元後，最重要的 invariant 是哪個？**

- [ ] A. 指標外側已處理的有效字元都成對相同；下一步只需比較尚未處理的兩端。
- [ ] B. 左右指標每輪都必須一起移動一次，即使其中一側是標點。
- [ ] C. 只要字串長度是奇數，一定為回文。

<details>
<summary>第 40 分鐘後展開：模板與複雜度核對</summary>

**答案：A。** 本題用相向指標；每側先略過不需比較的字元，再比較兩個有效字元。若不同可立刻結束；若相同則向內收縮，維持外側已驗證相同。兩指標合計至多走過整個輸入，時間 `O(n)`；直接在字串位置上比較時，額外空間 `O(1)`。先清理再反轉也能得到正確答案，但會建立 `O(n)` 額外資料。

模板不能不看條件就套到每一道題。下週的排序陣列 Two Sum II 也從兩端開始，但排除某一端的理由來自**排序與和的大小**，而非跳過標點；使用前必須重新證明移動規則。

</details>

### 4. 只記最重要的三個錯誤

最多勾三項實際發生的錯誤；不足三項不必湊數。每項都要留下能驗收的修正動作。

- [ ] 忘了保留數字 → 用 `"0P"` 和 `"1a1"` 重跑並口述字元規則。
- [ ] 跳過無效字元時越界 → 用 `" "`、`".,!"` 追蹤指標位置。
- [ ] 兩端移動順序錯 → 用 `"ab_a"` 畫每一步的左右位置。
- [ ] 只背 Pattern、說不出排除理由 → 重錄 invariant 與一次失敗案例。
- [ ] Big-O 只報答案 → 說明每個指標的最大移動次數與是否建立新字串。
- [ ] 沒有實際測試或口述中斷 → 執行五組測資，重錄卡住時的假設與驗證。

**今日週測驗收**

- [ ] 23 分鐘重寫時限結束時保留原始版本，未用參考解覆蓋。
- [ ] 全程 Think Aloud，能說出指標每次移動的原因。
- [ ] 實際跑至少五組測資，記錄未通過案例與修正。
- [ ] 能用五句模板解釋 Two Pointers，並說出本題的 invariant、時間與空間成本。
- [ ] 對照後只保留最多三個重要錯誤與下一次驗收動作。

---

## Part 2｜React 面試化／系統設計：何時不該使用 useEffect（45 分鐘）

### 1. 面試題與節奏

面試題：「在 React 裡，何時不該使用 `useEffect`？如果有搜尋列表、儲存按鈕和外部訂閱，你會如何選擇？」回答時先指出觸發原因，再決定程式放在哪裡。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 閉卷把三個場景分類 | render 計算／事件處理／外部同步 |
| 8–18 | 修正一段多餘 Effect | 前後程式與避免的重複更新 |
| 18–28 | 組織三分鐘口述並錄第一版 | 原始回答 |
| 28–38 | 回答三個追問 | 成本、reset、訂閱清理 |
| 38–45 | 對照官方文件並重錄 | 最終回答與一個修正點 |

### 2. 先選擇觸發原因

| 場景 | 先問自己 |
| --- | --- |
| 根據 `items` 與 `query` 顯示搜尋結果 | 能否在 render 時直接算出？ |
| 使用者點「儲存」後送出請求 | 這個動作是否由明確事件觸發？ |
| 元件顯示期間維持 WebSocket 或非 React 元件狀態 | 是否要與外部系統同步，並在不再需要時清理？ |

**單選｜以下哪段情境最適合用 Effect？**

- [ ] A. 把 `firstName` 與 `lastName` 串成 `fullName`。
- [ ] B. 使用者點按鈕時送出一次購買請求。
- [ ] C. 元件掛載時訂閱外部資料來源，依參數變更重建訂閱，卸載時取消。

<details>
<summary>先回答，再展開判斷理由</summary>

**答案：C。** 可從 props／state 計算的值直接在 render 取得；明確的使用者動作放在事件處理；外部訂閱要隨元件生命週期同步並清理。這是 React 官方對 Effect 的基本界線；資料請求也可能使用 Effect，但要處理競態與清理，若框架提供資料載入機制則先考慮框架方案。參考 [React：You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)、[Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)。

</details>

### 3. 閉卷改寫：搜尋列表

先說出問題，再自己改寫下例；這段程式把可由當次 `items` 與 `query` 算出的資料多存一份，Effect 更新它會造成額外一次更新，也使兩份狀態可能短暫不一致。

```tsx
const [visibleItems, setVisibleItems] = useState(items);
useEffect(() => {
  setVisibleItems(items.filter(item => item.name.includes(query)));
}, [items, query]);
```

<details>
<summary>改寫後再看最小參考版本</summary>

```tsx
const visibleItems = items.filter(item => item.name.includes(query));
```

先在 render 直接計算。若量測證明這段計算昂貴，才考慮 `useMemo` 快取計算結果；不要先以 Effect 保存衍生資料。若 `items` 來自伺服器，要另行判斷資料載入位置，不把「搜尋結果可直接計算」推成「所有網路請求都不能用 Effect」。參考 [React：You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)。

</details>

### 4. 三分鐘口述骨架與追問

```txt
0:00–0:35  先問：程式為何執行？因 render、使用者事件，還是外部系統需要同步？
0:35–1:20  可從 props／state 算出的值在 render 算；昂貴時計算結果可考慮 memo。
1:20–2:00  點按鈕後的一次性操作放事件 handler，避免畫面顯示或重新掛載時誤觸發。
2:00–2:40  訂閱、計時器或非 React 系統同步可用 Effect，依參數更新並清理。
2:40–3:00  用搜尋列表例子說出少一次同步、少一份可能不一致的 state。
```

| 追問 | 回答要點 |
| --- | --- |
| 某項 prop 變了，表單草稿要全部重設？ | 先看 state 歸屬與是否應用不同 `key` 重建表單；不直接以 Effect 逐欄同步。 |
| 搜尋結果計算很慢？ | 先量測，必要時 `useMemo` 快取純計算，仍不需把結果再存成 state。 |
| 外部訂閱何時清理？ | 訂閱參數改變或元件不再顯示時，清除舊連線／訂閱，避免重複訊息與資源泄漏。 |

**今日 React 驗收**

- [ ] 3 分鐘回答同時包含「不該用」的兩類情況與一個該用的外部同步情況。
- [ ] 自己改寫搜尋列表，能說出多存一份衍生 state 的成本。
- [ ] 能回答三個追問，並保留原始錄音與修正版。
- [ ] 沒把 `useEffect` 一概說成錯誤，也沒把事件請求放進只為追蹤 state 的 Effect。

---

## Part 3｜英文／行為面試：Amazon Customer Obsession（20 分鐘）

Amazon 的 Customer Obsession 強調從顧客出發、往回推導方案並維持信任。這裡練的是**真實經歷的說明方式**；不要把示例數字說成自己的成果。參考 [Amazon Leadership Principles](https://amazon.jobs/content/en/our-workplace/leadership-principles)。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 選一個真實使用者問題 | 客訴、訪談、行為數據或支援紀錄的來源 |
| 4–9 | 從問題往回推導 | 使用者受阻之處、候選方案、取捨與驗證方法 |
| 9–15 | 用 STAR 錄 90 秒英文 | 自己的行動與可驗證結果 |
| 15–20 | 回答追問並重錄 | 一個修正點與最後版本 |

**單選｜哪個回答最符合從使用者問題反推方案？**

- [ ] A. 「我喜歡新技術，所以先選框架，再找適合的使用者問題。」
- [ ] B. 「我先確認哪個使用者流程受阻、受影響範圍和成功標準，再比較方案並驗證結果。」
- [ ] C. 「只要需求單寫了某功能，實作完成就表示使用者問題已解決。」

<details>
<summary>選完再看解析</summary>

**答案：B。** 要能說清楚問題如何被發現、方案如何回應問題，以及結果是否真的改善使用者體驗。不能用技術偏好或交付數量取代使用者結果。

</details>

| STAR 段落 | 英文起句 | 必須包含的事實 |
| --- | --- | --- |
| Situation | “Customers were struggling with…” | 哪類使用者、哪段流程、訊號來自哪裡 |
| Task | “My goal was to…” | 要改善的使用者結果與限制 |
| Action | “I traced the issue back to…, compared…, and chose…” | 自己如何反推原因、比較方案與執行 |
| Result | “We validated the change by…” | 前後數據、觀察期間或定性回饋；不足就說明限制 |

例如「結帳錯誤提示不清楚，使用者反覆提交」可以作為**練習情境**：先查錯誤事件與支援回報，再測試更清楚的提示與重試流程，最後比較完成率及重複提交率。這不是你的既有經驗；正式口述需換成自己做過且能說明證據來源的事件。

追問練習：“How did you know what customers actually needed?”、“What options did you reject and why?”、“How did you know the solution worked?”

- [ ] 已選真實事件，能指出至少一種原始使用者訊號。
- [ ] 能說出需求、候選方案、取捨與結果驗證，不只描述完成的功能。
- [ ] 英文口述有自己的具體行動；數字有來源，沒有數據則如實說明。
- [ ] 已錄 90 秒英文並回答三個追問。

---

## Part 4｜週檢討：只選一個下週優先修正（10 分鐘）

前 3 分鐘盤點證據，接著 3 分鐘列未完成，再用 2 分鐘安排週末，最後 2 分鐘只選一個下週優先修正。「看過筆記」不算完成。

| 本週項目 | 可作為完成證據 |
| --- | --- |
| Valid Sudoku、Longest Consecutive Sequence、Valid Palindrome | 閉卷程式、實際測試、Pattern 推導與 Big-O 口述 |
| React Effect 邊界 | 可說明 render／事件／外部同步三種情況的錄音或筆記 |
| Python 函式與 API | 函式語意、keyword-only、closure、mutable default 的實作與測試 |
| 水平擴展與負載平衡 | 架構圖、health check、autoscaling 假設及瓶頸順序 |
| Customer Obsession | 真實使用者訊號、行動、結果與英文錄音 |

**完成盤點（依實際證據勾選）**

- [ ] 本週演算法三題均有自己的程式、測試與口述。
- [ ] React 與 Python 練習均有可回看的證據。
- [ ] System Design 題至少有一份自己的圖、數字、failure case 或口述。
- [ ] Customer Obsession 已用真實事件完成錄音。

**未完成才勾選；補課固定放 9/26（六）或 9/27（日）：**

- [ ] 六：補週測失敗案例或第二種語言，完成後重跑五組測試。
- [ ] 六：補 React 3 分鐘回答，對照三種觸發原因後重錄。
- [ ] 日：補 Python 實作與測試，只修最小未完成步驟。
- [ ] 日：補 Customer Obsession 證據或 System Design 產出。
- [ ] 沒有待補項目；以上補課項不勾選。

**下週唯一優先修正（依實際最大卡點單選）：**

- [ ] 演算法推導：coding 前先說 60 秒移動規則與 invariant。
- [ ] 測試不足：先寫一般、最小、特殊三類預期值。
- [ ] React 判斷：先問「是 render、事件，還是外部同步？」
- [ ] 面試口述：每天錄一段含問題、取捨、驗證的回答。
- [ ] System Design：擴容前先寫各層容量與第一個瓶頸。

未完成項只移到六、日補，不推遲下週主線。週末若仍未補完，保留未完成狀態，避免把下週原定題目向後順延。

---

## Part 5｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：指出第一個 bottleneck 與擴展順序

題目：「服務流量升到每秒 1,000 個請求。架構是 `Client → Load Balancer → 2 個 App 實例 → DB`。目前每個 App 實例穩定可處理 300 RPS，DB 在現有查詢模式下可處理 900 RPS，Load Balancer 可處理 2,000 RPS。先卡在哪裡？下一步如何擴展？」這些數字是教學假設，實際系統必須用壓測與監控驗證。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 畫請求路徑與標出容量 | LB、App、DB 的現有上限 |
| 4–9 | 算第一個瓶頸 | 需求與各層容量的差距 |
| 9–15 | 說擴展順序與驗證方式 | 每一步擴容後，下一個限制可能在哪裡 |
| 15–20 | 完成至少一項主動產出 | 小圖／三個數字／failure case／3 分鐘口述 |

**單選｜上述假設下，第一個瓶頸是哪一層？**

- [ ] A. Load Balancer，因為所有流量都先經過它。
- [ ] B. App，兩個實例合計約 600 RPS，低於 1,000 RPS 需求。
- [ ] C. DB，因為所有架構中的資料庫必然最先滿載。

<details>
<summary>自己算完後再看擴展順序</summary>

**答案：B。** 在這組簡化假設下，App 合計 `2 × 300 = 600 RPS`，先低於需求；DB 是 900，LB 是 2,000。先確認瓶頸確實在 App，例如 CPU、佇列長度、p95 延遲與錯誤率都支持這個判斷，再增加健康的 App 實例並確認 LB 分流。若增加到 4 個，App 理論上是 `4 × 300 = 1,200 RPS`，此時 DB 的 900 RPS 可能成為下一個限制。接著要檢查慢查詢、索引、連線池與可快取的讀取，再視讀寫比例選擇合適的資料層擴展；不能只繼續加 App。這是容量估算，不保證真實吞吐會線性增加。

</details>

### 主動產出：四選一，至少完成一項

- [ ] **一張小圖**：標出每層容量、App 第一個瓶頸，以及擴到四台後可能轉移到 DB。
- [ ] **三個數字**：寫出需求 `1,000 RPS`、目前 App `600 RPS`、DB `900 RPS`，並說明比較方式。
- [ ] **一個 failure case**：某個 App 健康檢查失敗，LB 將它移出服務；剩一個 App 約 300 RPS，如何限流、降級與恢復？
- [ ] **3 分鐘口述**：依「需求 → 容量 → 第一瓶頸 → 擴容後的新瓶頸 → 驗證指標」完整回答並錄音。

延伸追問：新增實例需要啟動時間；若流量突然暴增，擴容生效前要如何用限流、排隊或降級保護服務？若兩個 App 都依賴同一個 DB，增加 App 可能讓 DB 更快滿載。回答時說清楚自己的容量假設、測量指標與失敗時的保護順序。

---

## 今日結束打卡

- [ ] 週測原始版本、測試結果與最多三個錯誤已保存。
- [ ] React 三分鐘與 Customer Obsession 九十秒英文均已實際錄音。
- [ ] 週檢討已列完成、未完成、週末補課與下週唯一優先修正。
- [ ] System Design 四種主動產出至少完成一項，並能指出擴容後的下一個瓶頸。

[回到一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
