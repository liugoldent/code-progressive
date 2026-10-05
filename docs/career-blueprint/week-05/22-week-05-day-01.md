---
sidebar_position: 1
sidebar_label: "Day 1"
slug: "/career-blueprint/week-05-day-01"
title: "第 5 週 Day 1：Best Time to Buy and Sell Stock、Hook 契約與 Database Scaling"
description: "140 分鐘日課：閉卷完成 LeetCode 121、定義 React Hook 的 input、output、dependency 與 contract，並替 users／orders 設計 schema 和 index。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Best Time to Buy and Sell Stock", "LeetCode 121", "React custom Hook", "dependency", "contract", "Database Scaling", "users", "orders", "index"]
---

# 第 5 週 Day 1：股票最大收益、Hook 契約與資料庫索引

> 安排日期：2026-10-05；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Sliding Window（本題用前綴最小值即可，不必硬套縮窗）  
> 本週 System Design 主題：Database Scaling

接續 [第 4 週 Day 5](/docs/career-blueprint/week-04-day-05)。先留下自己的解題與設計，再看摺疊的參考解析。練習日期是安排，完成狀態依實際證據勾選。

作答方式：知識題先單選，再展開解析；進度題按實際完成情況勾選。Markdown 勾選清單不會在網站自動保存作答，請自行保存程式、測試輸出、Hook 契約及資料庫設計。「尚未完成」與完成項不可同時勾選。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Best Time to Buy and Sell Stock 先讀題與 constraints，說出 brute force／Pattern，再閉卷實作、測 Edge Cases、寫 Big-O。
- [ ] **React 主線｜50 分鐘**：為一個具體 Hook 定義 input、output、dependency 與 contract，實作並驗證輸入變動與 cleanup。
- [ ] **收尾｜10 分鐘**：記錄具體卡點，以及有時段和驗收標準的週末補課項目。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：替 users／orders 畫 schema 與 index，完成一張小圖／三個數字／一個 failure case／3 分鐘口述中的至少一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項排入週末補課，不占用下一個工作日主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Best Time to Buy and Sell Stock | 題意、暴力解、Pattern、閉卷程式、測資與 Big-O |
| 21:30–22:20 | React Hook 契約 | input／output／dependency／contract 表、實作與行為驗證 |
| 22:20–22:30 | 收尾 | 卡點、週末補課時段與驗收方式 |
| 22:30–22:50 | Database Scaling Combo | users／orders schema、index 與至少一項主動產出 |

---

## Part 1｜NeetCode 150：Best Time to Buy and Sell Stock（60 分鐘）

完整三階段題解與 TypeScript／Python 練習放在 [LeetCode 121｜Best Time to Buy and Sell Stock](/docs/algorithms/leetcode/f0101-0200/l0121-best-time-to-buy-and-sell-stock)。先讀 Stage A；完成自己的第一版與測試後，才對照 Stage B。曾看過解答，也要從空白閉卷重寫。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 讀題與 constraints | Input／Output、先買後賣、最多一筆、無利可圖 |
| 8–16 | 手算官方與自訂測資 | 先列預期值，不先跑程式 |
| 16–24 | 說出 brute force | 列舉買賣日、正確性與成本 |
| 24–31 | 找出重複工作與 Pattern | 說明逐日最低買價和當日收益 |
| 31–46 | 閉卷實作 | TypeScript 或 Python 第一版；不看 Stage B |
| 46–55 | 測 Edge Cases | 至少跑下方 6 組，記錄失敗和修正 |
| 55–60 | 寫 Big-O 與口述 | 說出 invariant、成本與最容易錯的一例 |

### 1. 先確認題目契約

輸入 `prices` 是每天的價格；最多做一筆交易，買入日必須早於賣出日。輸出最大**非負**收益，無利可圖回傳 `0`，不是回傳日期，也不是累加多筆交易。官方限制：`1 <= prices.length <= 10^5`、`0 <= prices[i] <= 10^4`。

**單選｜`[7, 1, 5, 3, 6, 4]` 應輸出什麼？**

- [ ] A. `6`：先賣 7，再買 1。
- [ ] B. `5`：以 1 買入，之後以 6 賣出。
- [ ] C. `7`：把每次上漲都算進同一筆交易。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 買賣有先後，而且最多只做一筆。

</details>

### 2. Brute force → Pattern

先口述 brute force：對每個買入日 `i`，列舉之後的賣出日 `j`，比較 `prices[j] - prices[i]` 與目前答案。再問自己：固定今天為賣出日，是否需要重新掃過所有先前買入日？

**單選｜走到今天的價格時，只需保留過去哪個摘要？**

- [ ] A. 過去最高價，因為最高價與今天差最多。
- [ ] B. 到昨天為止的最低價，因為它給出今天賣出的最佳買點。
- [ ] C. 全陣列最低價，即使它出現在今天之後也可買。

<details>
<summary>完成閉卷推導後再看解析</summary>

**答案：B。** 對今天這個賣出日，只比較之前的最低價即可。每步維持「已看過日期的最低價」和「目前最大非負收益」；這是前綴最小值，不需要固定長度或收縮條件的視窗。

</details>

### 3. 閉卷實作與測試

選一種語言從空白完成 `maxProfit(prices)`／`max_profit(prices)`。先跑預期，再對照實際：

| 類別 | `prices` | 預期收益 | 檢查點 |
| --- | --- | ---: | --- |
| 官方例 1 | `[7, 1, 5, 3, 6, 4]` | 5 | 非相鄰買賣日 |
| 官方例 2 | `[7, 6, 4, 3, 1]` | 0 | 可不交易 |
| 單日 | `[5]` | 0 | 無法賣出 |
| 全相同 | `[2, 2, 2]` | 0 | 不把 0 算正收益 |
| 價格遞增 | `[1, 2, 3]` | 2 | 第一日買、最後一日賣 |
| 最低點在高點後 | `[3, 8, 1, 2]` | 5 | 不可做逆時序的 `8 - 1` |
| 值域邊界 | `[0, 10000]` | 10000 | 允許 0 價格 |

**單選｜一趟掃描的成本何者正確？**

- [ ] A. 時間 `O(n)`、額外空間 `O(1)`：每個價格處理一次，只保留少量數值。
- [ ] B. 時間 `O(1)`：只保存兩個變數。
- [ ] C. 時間 `O(n²)`：每一天都重掃過去所有日子。

<details>
<summary>完成自己的 Big-O 後再看答案</summary>

**答案：A。** 暴力解的時間才是 `O(n²)`；兩種解法若不另外保存輸入副本，額外空間都可為 `O(1)`。

</details>

### 今日驗收

- [ ] 看 Stage B 前說出 brute force、重複工作及為何只需過去最低價。
- [ ] 閉卷完成第一版，保留原始失敗測資和修正紀錄。
- [ ] 測過單日、全跌、全相同、遞增與最低價出現在高價後。
- [ ] 能說出「買日必須早於賣日」如何由掃描順序保證。
- [ ] 自己推導時間 `O(n)`、額外空間 `O(1)`。

---

## Part 2｜React 主線：定義 Hook 契約（50 分鐘）

今天用搜尋框的 `useDebouncedValue` 做具體例子：使用者停止輸入指定時間後，才更新搜尋用的值。先定義呼叫者看得到的 API，再決定 Effect 如何同步計時器。參考 [React 的 custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) 與 [Effect dependency／cleanup](https://react.dev/reference/react/useEffect)。

### 今日 50 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | 定義 input／output | 函式簽名、初始值與呼叫範例 |
| 10–20 | 定義 dependency／contract | 哪些值變動要重設計時器、cleanup、邊界 |
| 20–35 | 閉卷實作 | Hook 與一個搜尋框呼叫端 |
| 35–45 | 驗證行為 | 快速輸入、改 delay、unmount、初始呈現 |
| 45–50 | 口述取捨 | 為何 debounce 值，不把衍生值放到多處維護 |

### 1. 先寫四欄契約

| 欄位 | 今天要決定的事 | `useDebouncedValue` 的目標 |
| --- | --- | --- |
| Input | 呼叫者傳什麼？有效範圍？ | `value: string`、`delayMs: number`；約定 `delayMs >= 0` |
| Output | 回傳什麼？初始值是什麼？ | 單一 `debouncedValue: string`；初次 render 等於輸入值 |
| Dependency | Effect 讀取哪些 reactive values？ | `value`、`delayMs` 變動時清除舊 timer 並重新排程 |
| Contract | 可觀察行為和失效條件？ | 連續輸入只採用最後一次值；unmount 清 timer；不負責發 API request |

先自己回答，再選：

**單選｜Hook 內 Effect 讀到 `value` 與 `delayMs` 時，dependency 應怎麼列？**

- [ ] A. `[]`，因為只想在 mount 執行一次。
- [ ] B. `[value, delayMs]`，兩者改變時重新同步並清掉舊 timer。
- [ ] C. `[debouncedValue]`，因為只要監控輸出。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** Dependency 由 Effect 使用的 reactive values 決定，不是用來任意指定執行次數；cleanup 要撤銷上次排程。

</details>

### 2. 閉卷實作題

先在自己的檔案寫 Hook 和最小呼叫端，接著測：

```tsx
const [query, setQuery] = useState("");
const debouncedQuery = useDebouncedValue(query, 300);
// 輸入框讀 query；搜尋條件讀 debouncedQuery。
```

**需驗證的行為**

- [ ] 初次 render 時，輸出與初始 `query` 相同。
- [ ] 300 ms 內連續輸入 `a`、`ab`、`abc`，最後只採用 `abc`。
- [ ] 將 `delayMs` 由 300 改為 500，舊 timer 先取消。
- [ ] 元件卸載時 timer 被清除，不留下後續更新。
- [ ] 搜尋 API 若由另一個 Effect 觸發，另外處理 request cancellation／過期結果；debounce 本身不保證回應順序。

<details>
<summary>完成自己版本後再看參考實作</summary>

```tsx
import { useEffect, useState } from "react";

function useDebouncedValue(value: string, delayMs: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
```

這個版本假設 `delayMs` 是非負且有限的毫秒數，供瀏覽器使用。初始值直接由 input 建立；每次值或延遲改變都撤銷上一個 timer，避免舊值較晚覆蓋新值。若產品要求「delay 改變就立即輸出」或「空字串立即清空搜尋結果」，要先改 contract 再改實作。

</details>

### React 今日驗收

- [ ] 不看參考實作，能先說清 input、output、dependency、contract 四欄。
- [ ] Hook 只封裝一個明確行為，呼叫端能看懂資料流。
- [ ] 用實際操作或測試驗證快速輸入、delay 變更與 cleanup。
- [ ] 能說出 debounce 計時器與 API request 的取消是兩個不同責任。

---

## Part 3｜收尾：卡點與週末補課（10 分鐘）

前 5 分鐘依證據選卡點；後 5 分鐘替未完成項選一個週末時段。排入補課不等於已完成，週末仍要驗收。

**今天最明確的卡點（依實際情況選一項）**

- [ ] 演算法：無法解釋為何只保留過去最低價。
- [ ] 演算法：程式在全跌或時間順序測資出錯。
- [ ] React：Hook 四欄契約未定義完整。
- [ ] React：快速輸入或 cleanup 行為未驗證。
- [ ] Database：index 尚未對應明確查詢。
- [ ] 今日無待補項目。

**未完成才排入週末補課（可複選）**

- [ ] 週六 30 分鐘：閉卷重寫 121，跑本頁 7 組測資並重述 invariant。
- [ ] 週六 25 分鐘：重寫 Hook 四欄契約，操作快速輸入與 unmount，驗證 timer cleanup。
- [ ] 週日 20 分鐘：重畫 users／orders 關係、寫出查詢，逐一解釋 index 欄位順序。
- [ ] 全部完成，無需補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：為 users／orders 畫 schema 與 index

情境：使用者可用 email 登入，並查看自己的最近 20 筆訂單；訂單明細與付款流程不在今日範圍。先寫查詢，再決定索引。資料庫語法以 PostgreSQL 為例；複合索引要對應實際篩選與排序，見 [PostgreSQL 多欄索引文件](https://www.postgresql.org/docs/current/indexes-multicolumn.html)。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 確認讀寫需求 | email 找 user、user 查最近 orders |
| 4–9 | 畫兩表與關係 | 主鍵、外鍵、必要欄位 |
| 9–13 | 為查詢選 index | 唯一 email、訂單列表複合索引 |
| 13–18 | 主動產出四選一 | 自畫圖、自算數字、自訂故障或口述 |
| 18–20 | 檢查取捨 | 寫入成本、熱點與失敗時的行為 |

### 1. 先選查詢，再看參考 schema

**單選｜「某使用者最近 20 筆訂單」最需要哪種索引？**

- [ ] A. 只在 `status` 建索引，因為每筆訂單都有狀態。
- [ ] B. 在 `(user_id, created_at DESC, id DESC)` 建複合索引，符合篩選及穩定排序。
- [ ] C. 只在 `created_at` 建索引，不管是哪個使用者。

<details>
<summary>自己畫完 schema 與查詢後再看參考版本</summary>

**答案：B。** 查詢先以 `user_id` 篩選，再依時間與 `id` 排序。`id` 可在同時間戳時提供穩定次序。是否值得建立仍應用資料量與實際查詢計畫驗證。

```sql
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL,
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_recent_idx
  ON orders (user_id, created_at DESC, id DESC);

SELECT id, status, total_cents, created_at
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

`users.id` 與 `orders.id` 的主鍵、`users.email` 的 UNIQUE 各自建立索引；`orders.user_id` 的外鍵不代表會自動替子表建立上述查詢索引。若 email 比對須忽略大小寫，要明定正規化或大小寫不敏感的儲存／索引策略。加索引會增加寫入與儲存成本；今天先有查詢與量測需求，不因「Scaling」就直接分片。

</details>

### 2. 主動產出：至少完成一項

範例只供核對，讀過不算完成。從下列四項選一項自己產出並保存。

#### [ ] 一張小圖

畫出 `users (id PK, email UNIQUE) 1 ── N orders (id PK, user_id FK, created_at)`，並在圖上標出 email 查詢與訂單列表使用的 index。

#### [ ] 三個數字

自行設定並標明**假設**：使用者數、每人平均訂單數、尖峰列表查詢 QPS。先算總訂單筆數，再說明哪個數字會影響索引大小、哪個會影響查詢壓力。例：100 萬位使用者、每人 20 筆，則約 2,000 萬筆訂單；尖峰 500 QPS 是另行假設，不能由筆數直接推得。

#### [ ] 一個 Failure Case

自己寫出：觸發條件 → 使用者看見什麼 → DB 指標如何變 → 限流／降級方式 → 恢復驗證。可用「大型促銷時，同一時段大量使用者查最近訂單，DB 連線池耗盡」作起點；不要只回答「加索引」。

#### [ ] 3 分鐘口述

```txt
0:00–0:40  需求與兩個主要查詢。
0:40–1:25  users／orders 主鍵、外鍵與欄位。
1:25–2:10  email 唯一索引、訂單列表複合索引與欄位順序。
2:10–3:00  一個流量假設、寫入代價與故障處理。
```

### 今日 System Design 驗收

- [ ] 自己畫出兩表的 1:N 關係與主鍵／外鍵。
- [ ] 每個 index 都能指出對應查詢，並說出寫入代價。
- [ ] 至少完成一項自己的小圖、三個數字、failure case 或 3 分鐘口述。
- [ ] 若尚未完成，已加入週末補課清單。

---

## 今日結束打卡

每列依實際證據選一個狀態；讀懂解析不等於已閉卷完成。

**LeetCode 121（單選）**

- [ ] 尚未開始／未完成。
- [ ] 看提示後完成，還需閉卷重做。
- [ ] 已閉卷實作、測試並寫 Big-O。

**React Hook 契約（單選）**

- [ ] 尚未開始／未完成。
- [ ] 已定義四欄，但尚未驗證行為。
- [ ] 已定義四欄並驗證快速輸入與 cleanup。

**Database Scaling Combo（單選）**

- [ ] 尚未開始／未完成。
- [ ] 已畫 schema 與 index，尚未主動產出。
- [ ] 已畫 schema 與 index，並完成至少一項主動產出。

**收尾（單選）**

- [ ] 尚未記錄卡點／補課。
- [ ] 已記錄卡點，未完成項已有明確週末時段與驗收方式。
- [ ] 今日全部完成，無需補課。

下次開始前，閉卷回答：為何 121 只要保留過去最低價？Hook 的 dependency 與 contract 分別決定什麼？最近 20 筆訂單的索引為何先放 `user_id`？
