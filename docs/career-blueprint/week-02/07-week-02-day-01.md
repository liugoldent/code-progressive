---
sidebar_position: 1
sidebar_label: "Day 1"
slug: "/career-blueprint/week-02-day-01"
title: "第 2 週 Day 1：Group Anagrams、state／ref／普通變數與網路請求路徑"
description: "140 分鐘日課：Group Anagrams 閉卷練習、React state／ref／普通變數跨 render 比較、週末補課清單，以及 DNS→TCP→TLS→HTTP 圖解與故障分析。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Group Anagrams", "Arrays & Hashing II", "state", "useRef", "render", "DNS", "TCP", "TLS", "HTTP"]
---

# 第 2 週 Day 1：Arrays & Hashing II

> 安排日期：2026-09-14；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing II  
> 本週 System Design 主題：網路與請求路徑

接續 [第 1 週 Day 5](/docs/career-blueprint/week-01-day-05)。日期依既有 [一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01) 的安排，完成狀態依實際練習勾選。

作答方式：知識題標示單選，先選再展開解析；進度與經歷題依事實勾選，沒有標準答案；「尚未完成／無需補課」不可與互相矛盾的完成項同時勾選。這些是 Markdown 勾選清單，可在筆記中勾選或口頭選答案；不必寫填空，也不代表網站會自動保存作答。原有程式實作與口述練習仍依各節執行。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Group Anagrams 先讀題與 constraints，說出 brute force／Pattern，再閉卷實作、測 Edge Cases、寫 Big-O。
- [ ] **React 主線｜50 分鐘**：整理 state、ref、普通變數跨 render 的差異，完成預測輸出與操作驗證。
- [ ] **收尾｜10 分鐘**：記錄卡點與明確的週末補課項目。
- [ ] **System Design × 高併發｜20 分鐘**：畫 DNS → TCP → TLS → HTTP；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項放進週末補課，不推遲下週主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Group Anagrams | 暴力解、Pattern 推導、閉卷程式、測資、Big-O |
| 21:30–22:20 | React 跨 render 比較 | 比較表口述、預測輸出、實際操作 |
| 22:20–22:30 | 收尾 | 卡點、週末時段與可驗收的補課動作 |
| 22:30–22:50 | System Design | 請求路徑與至少一項主動產出 |

---

## Part 1｜NeetCode 150：Group Anagrams（60 分鐘）

完整三階段題解沿用 LeetCode 專區：

**[開始 LeetCode 49｜Group Anagrams 練習](/docs/algorithms/leetcode/f0001-0100/l0049-groupAnagrams)**

該頁包含 Stage A 解題前、Stage B 解題分析、Stage C 工程遷移，以及 TypeScript＋Python 的初版模板、暴力解、最佳化解與可執行測試。今天依下表計時，完成自己的版本前先停在 Stage A，不展開提示或往下讀解答；已預習過也要關閉答案重寫。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 讀題與 constraints | 說清楚輸入、輸出、順序與重複資料規則 |
| 5–15 | 自訂測資、提出 brute force | 正確性理由與時間／空間預估 |
| 15–25 | 找重複工作、推導 Pattern | 三句解題計畫，不能只報演算法名稱 |
| 25–40 | 閉卷實作 | TypeScript 與 Python；未完成語言標記補課 |
| 40–50 | 執行測試 | 官方範例與至少四組自訂邊界測資 |
| 50–60 | 回看 Stage B、口述 Big-O | 每輪狀態、成本來源與一個修正點 |

### 1. 先選契約，再寫自己的計畫

**單選｜輸入含重複字串時，哪個契約正確？**

- [ ] A. 相同字串只留一份，回傳所有不同字串。
- [ ] B. 每筆都要保留；同組字串能互相重排，組別與組內順序不限。
- [ ] C. 只要字串長度相同，就一定要放同組。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 分組不等於去重；字母出現次數也必須吻合。題目契約與官方範例見連結筆記的 Stage A。

</details>

先口述「新字串來時，我如何決定放哪一組」，再估算最多要比較多少次。保留第一個版本與失敗測資；自己的想法不必和參考解一樣。

### 2. Edge Cases 驗收

先手算，之後再執行；比較群組時可排序正規化，但不能去重，否則會掩蓋資料遺失。

| 自訂輸入 | 預期分組之一 | 驗證重點 |
| --- | --- | --- |
| `["ab", "ba", "ab"]` | `[["ab", "ba", "ab"]]` | 保留重複字串 |
| `["aab", "abb"]` | `[["aab"], ["abb"]]` | 長度與種類相同仍可能不同組 |
| `["", ""]` | `[["", ""]]` | 空字串也是資料 |
| `["a", "b", "c"]` | `[["a"], ["b"], ["c"]]` | 全部各自成組 |

另跑題解中的三個官方範例。空陣列不在官方輸入範圍；如額外測試，標記成防禦性擴充。

### 3. 實作後才做的口述驗收

- [ ] 能指出暴力解到底重複了哪個比較。
- [ ] 能解釋自己的群組代表為何不會混淆兩種不同資料。
- [ ] 已測官方範例、重複、空字串、次數不同與全部不同組。
- [ ] 已分別定義字串數量與字串長度，再推導 Big-O。
- [ ] 已把產生代表值、查詢與回傳群組的成本算進去。
- [ ] 能解釋每輪處理後，已讀資料應保持什麼條件。

Stage C 的商品標籤分組案例留作延伸：重點是從「每筆逐組找」改成可直接定位群組，並檢查重複、順序與輸入修改的規則；延伸閱讀不算已完成今日閉卷練習。

---

## Part 2｜React 主線（50 分鐘）

### 今日目標與節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | 比較三種資料 | 不看稿說出跨 render 保存與更新畫面的差異 |
| 10–25 | 預測並操作範例 | 兩次點擊的 console 與畫面結果 |
| 25–40 | 改寫與情境判斷 | 純 ref 點擊、再觸發 render、重新掛載 |
| 40–50 | 單選與口述 | 三題答案、一分鐘複習卡 |

### 1. 每次 render 都重新呼叫元件，資料放在哪裡才是關鍵

此處「普通變數」指元件函式內的區域變數。React 為同一個持續掛載的元件保存 state 與 ref；區域變數則在每次函式執行時重新建立。state 提供這次 render 的快照；ref 提供可變物件，修改 `current` 不會要求 React 更新畫面。[React：Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)

| 比較 | state | ref | 元件內普通變數 |
| --- | --- | --- | --- |
| 宣告 | `useState(0)` | `useRef(0)` | `let count = 0` |
| 下次 render | React 提供保存的狀態快照 | 取得同一個 ref 物件 | 重新執行初始化 |
| 更新方式 | 呼叫 setter 排入更新 | 指派 `ref.current` | 普通 JS 指派 |
| 指派後會要求 render 嗎？ | setter 排入更新；相同值可能跳過 | 不會 | 不會 |
| 適合放什麼？ | 畫面需要的可變資料 | timer ID、DOM、非畫面用的可變記錄 | 當次推導資料、迴圈中間值 |

元件內 `const total = price * quantity` 每次重算通常很合理，不需要因為「普通變數不保存」就改成 state。模組頂層變數則可能被多個元件實例共用，不能把它當成每個元件各自的記憶。

### 2. 先預測，再執行

把下面元件放進既有 React 練習環境，開啟 console。每次點完、等畫面更新後再點下一次；中間不要插入其他操作。

```jsx
import { useRef, useState } from "react";

export default function RenderMemoryLab() {
  let localCount = 0;
  const refCount = useRef(0);
  const [count, setCount] = useState(0);

  function handleClick() {
    localCount += 1;
    refCount.current += 1;
    setCount(c => c + 1);
    console.log({ localCount, refCount: refCount.current, count });
  }

  return <button onClick={handleClick}>state: {count}</button>;
}
```

**單選｜連點兩次且每次之間已完成更新，console 依序是？欄位順序為 local／ref／state。**

- [ ] A. 第一次 `1／1／1`；第二次 `2／2／2`。
- [ ] B. 第一次 `1／1／0`；第二次 `1／2／1`。
- [ ] C. 第一次 `1／1／0`；第二次 `1／1／0`。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 第一次 handler 讀到的 state 是 0；setter 不會改寫這個閉包中的快照。更新後 React 再呼叫元件，建立新的 `localCount = 0` 與 handler，但 ref 物件保留。第二次 handler 所屬的 render 讀到 state 1，所以印出 `1／2／1`。畫面依序顯示 state 1、state 2。[React：State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)

</details>

### 3. 三個操作，驗證真正理解的地方

- [ ] 先跑原版，確認上題 console 與按鈕文字。
- [ ] 暫時移除 `setCount`，重新掛載元件後再按兩次。
- [ ] 恢復原版，再讓父元件改變此元件的 `key`，觀察重新掛載後資料。

<details>
<summary>完成操作後核對</summary>

移除 setter 後，在沒有其他 render 的條件下，兩次 console 是 `1／1／0`、`2／2／0`，畫面仍為 0。同一個 handler 的閉包持續保存並修改該次 render 的區域變數；「普通變數每次點擊歸零」是錯誤說法，它是在元件重新執行時重新初始化。

改變 key 造成重新掛載後，state 與 ref 都重新初始化。跨 render 保存不等於跨卸載、重新掛載或重新整理頁面保存。

</details>

不要把 `ref.current` 直接放進 JSX 當主要顯示值，也不要為了計數而在 render 中改它；若資料需要驅動畫面，使用 state。這份實驗只在事件處理器讀寫 ref。[React：useRef](https://react.dev/reference/react/useRef)

### 4. 情境選擇與面試追問

**單選｜搜尋欄位的文字要立即反映在 UI，清除 debounce timer 又需要保存 ID，應如何分配？**

- [ ] A. 文字放 state、timer ID 放 ref。
- [ ] B. 文字放 ref、timer ID 放 state，兩者都會自動更新畫面。
- [ ] C. 全放元件內普通變數，下次 render 一定保留。

<details>
<summary>選完再看答案與解析</summary>

**答案：A。** 文字影響畫面，timer ID 用於事件或 effect 中取消排程。實作 debounce 時仍須清除舊 timer 與卸載時的 timer；ref 只保存 ID，不會自動清理資源。

</details>

**單選｜同一個 handler 裡呼叫兩次 `setCount(count + 1)`，初值為 0，最後通常是？**

- [ ] A. 2，setter 每呼叫一次就改寫當前 count。
- [ ] B. 1，兩次都根據同一份 count 快照計算。
- [ ] C. 0，React 不允許連續 setter。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 若需求是累加兩次，改用兩次 `setCount(c => c + 1)`，讓更新依序根據前一個結果計算。不要把「非同步」當成全部解釋，要說出這個 handler 捕捉的是哪次 render 的值。

</details>

### 5. 一分鐘複習卡與驗收

口述順序：需要反映在畫面的可變資料用 state；跨 render 保存但不驅動畫面的資料用 ref；當次可算出的值用普通變數。接著用上面的兩次點擊解釋 state 快照與閉包，最後說明重新掛載會重置。

- [ ] 能不看稿重建比較表。
- [ ] 能區分事件再次執行與元件再次 render。
- [ ] 能說出 ref 改變不觸發 render，以及為何不適合當顯示資料的主要來源。
- [ ] 已實際執行原版與移除 setter 的版本。
- [ ] 能說明一般 re-render 與改 key 重新掛載的差異。

---

## Part 3｜收尾（10 分鐘）

前 4 分鐘勾選卡點，後 6 分鐘選出具體補課動作。沒有完成的項目就保留，不因為看過解析而勾成獨立完成。

### 今日卡點紀錄（可複選）

- [ ] Group Anagrams：輸出順序或重複字串規則不清楚。
- [ ] Group Anagrams：能想到暴力解，但說不出如何減少重複工作。
- [ ] Group Anagrams：程式可跑，但邊界測資或 Big-O 不完整。
- [ ] React：把跨 render 保存、閉包保存與更新畫面混為一談。
- [ ] React：不確定 state 快照或 functional updater 的差別。
- [ ] System Design：記得順序，但說不出各階段的輸入與輸出。
- [ ] System Design：故障時直接怪 API，沒有先分層定位。
- [ ] 目前沒有卡點。

### 明確的週末補課項目（依卡點複選）

- [ ] 週六 30 分鐘：從空白重寫 Group Anagrams，跑三個官方範例與四個自訂測資，再口述 Big-O。
- [ ] 週六 20 分鐘：補完另一種演算法語言，以相同測資核對結果。
- [ ] 週六 20 分鐘：重新操作 React 範例三個版本，逐次核對 console 與畫面。
- [ ] 週日 20 分鐘：重畫請求路徑，標註快取／連線重用與 TLS 終止點。
- [ ] 週日 10 分鐘：用一個憑證錯誤案例重錄 3 分鐘口述，說清偵測與恢復。
- [ ] 無需補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：畫 DNS → TCP → TLS → HTTP

先聲明範圍：今天畫 HTTPS、HTTP/1.1 或 HTTP/2、沒有可重用連線的初次請求。DNS 可能命中快取；後續請求可能重用連線。HTTP/3 使用 QUIC，不能直接套成先建立 TCP。[MDN：How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 說明協定與快取假設 | 初次連線／重用連線的差別 |
| 4–10 | 畫四階段 | 各階段在回答什麼問題 |
| 10–16 | 數字或故障分析 | 明確假設與可驗證結果 |
| 16–20 | 關閉筆記重畫或口述 | 至少一項自己的主動產出 |

### 1. 一張小圖

```text
瀏覽器要讀取 https://example.com/products
  │
  ├─ DNS：查快取；必要時詢問 resolver → 取得目標 IP
  │          resolver 必要時向其他 DNS 伺服器查詢
  │
  ├─ TCP：向目標 IP:443 建立可靠的位元組傳輸連線
  │          Client ── SYN ─────→ Server
  │          Client ←─ SYN-ACK ─ Server
  │          Client ── ACK ─────→ Server
  │
  ├─ TLS：協商金鑰／加密參數，驗證伺服器憑證與主機名
  │
  └─ HTTP：傳送 GET /products → 收到 status、headers、body
                  │
             CDN／反向代理（可能在這裡終止 TLS）
                  │ 快取未命中，才需往後查
                  ▼
              API → Service → DB
```

DNS 找到的 IP 可能是 CDN 或負載平衡器；不是保證直接指向應用程式。TLS 若在邊緣終止，邊緣到 origin 是另一段連線，是否再使用 TLS 要另外交代。

TCP 的三次握手是三個訊息，不是三個 RTT；RTT 是封包往返一次的時間。[MDN：TCP handshake](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake)

### 2. 三個數字：先聲明假設，再估算

以下是練習假設，不是實測或所有網站的固定值：DNS 已命中快取，RTT = 40 ms，TCP 連線尚未建立，使用 TLS 1.3 完整握手、不使用 0-RTT，忽略丟包與伺服器處理時間。

| 階段 | 簡化成本 | 估算 |
| --- | --- | ---: |
| TCP 建立 | 約 1 RTT，到 client 可以開始下一步 | 40 ms |
| TLS 1.3 握手 | 約 1 RTT，到可送一般應用請求 | 40 ms |
| HTTP 請求至首個回應位元組 | 約 1 RTT，另加伺服器處理 | 40 ms |

總計約 120 ms 才收到第一個回應位元組，這不是整頁完成時間；若 DNS 未命中、伺服器需處理 30 ms 或資源很多，還要另計。TLS 的工作是協商安全連線與驗證身份，不能把 TCP 建立完成當成 HTTPS 已可用。[MDN：TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS)

高併發時，重用連線能減少反覆握手的延遲與伺服器工作，但開著的連線也占資源。討論容量時要分開看「目前連線數」「每秒新連線數」「每秒 HTTP 請求數」，三者不是同一個數字。

### 3. 一個 failure case：TLS 憑證到期

情境：DNS 能解析，TCP 也連上，但瀏覽器拒絕 HTTPS。此時 API 沒有存取紀錄，不代表沒有使用者嘗試造訪；請求可能在進入 HTTP 前就失敗。

| 步驟 | 說明 |
| --- | --- |
| 偵測 | 查看瀏覽器憑證錯誤、TLS 終止點的握手錯誤與憑證期限 |
| 使用者狀態 | 看見連線安全錯誤；一般站內 React 錯誤頁此時可能還沒下載 |
| 恢復 | 更新正確的憑證鏈，確認主機名與期限；在不同邊緣節點重新驗證 |
| 不採取的修復 | 不停重試 API、不要求使用者忽略憑證驗證 |
| 後續 | 加入到期監控與續期驗證，確認部署覆蓋所有終止 TLS 的節點 |

**單選｜DNS 成功且 TCP 已連線，但 TLS 驗證失敗，哪個下一步合理？**

- [ ] A. 先增加 DB connection pool。
- [ ] B. 直接判斷 React state 沒更新。
- [ ] C. 檢查憑證、主機名與 TLS 終止點，確認 HTTP 是否尚未發出。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** 先定位卡住的階段，再看該層的證據。DNS、TCP、TLS、HTTP 各自成功與否，不能互相代替。

</details>

### 4. 三分鐘口述骨架

```text
0:00–0:30  聲明 HTTPS、HTTP/1.1 或 HTTP/2、初次連線假設
0:30–1:20  DNS 找 IP、TCP 建傳輸、TLS 建安全連線、HTTP 傳需求
1:20–2:00  RTT 假設與三個數字，區分首位元組與整頁完成
2:00–2:40  TLS 憑證到期：如何發現、在哪修復、使用者看到什麼
2:40–3:00  高併發時連線重用的收益與資源代價
```

### 5. 今日主動產出（至少一項，依實際完成勾選）

- [ ] 已關閉範例，自己畫出四階段與 TLS 終止點。
- [ ] 已自行重算三個數字，標明假設，不直接抄表。
- [ ] 已用自己的話描述一個 failure case、偵測與恢復。
- [ ] 已完成 3 分鐘口述錄音。
- [ ] 尚未產出，已加入週末補課。

---

## 今日結束打卡

這是進度自評，沒有標準答案；每組選一個符合實際結果的狀態。選對知識題不等於完成實作或錄音。

**Group Anagrams（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 看解析後完成，還需閉卷重寫。
- [ ] 已獨立實作、執行測試並口述 Big-O。

**React 跨 render 差異（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 能看表解釋，但尚未操作驗證。
- [ ] 已操作範例並閉卷解釋 state、ref、普通變數。

**System Design 請求路徑（依實際情況單選）**

- [ ] 尚未開始／未完成。
- [ ] 已閱讀，但尚未完成自己的主動產出。
- [ ] 已完成至少一項主動產出並說明假設。

**本次學習時間（依實際情況單選）**

- [ ] 少於原定時間。
- [ ] 約等於原定時間。
- [ ] 超過原定時間。
- [ ] 未計時。

**週末補課安排（依實際情況單選）**

- [ ] 已在 Part 3 選定時段、動作與驗收條件。
- [ ] 尚未安排，今天收尾仍未完成。
- [ ] 今日已驗收完成，無需補課。
