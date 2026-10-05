---
sidebar_position: 3
sidebar_label: "Day 3"
slug: "/career-blueprint/week-03-day-03"
title: "第 3 週 Day 3：Set／Map 閉卷重寫、React Effect 修復與 Session 擴展"
description: "140 分鐘日課：閉卷重寫兩題並畫圖比較 Set／Map；修復 React timer、subscription、fetch 的 stale closure 與 cleanup；寫五句技術筆記；設計 stateless 或 shared store session。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Set", "Map", "Contains Duplicate", "Two Sum", "stale closure", "cleanup", "timer", "subscription", "fetch", "session", "shared store", "水平擴展", "負載平衡"]
---

# 第 3 週 Day 3：Set／Map 閉卷重寫、React Effect 修復與 Session 擴展

> 安排日期：2026-09-23；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing III／Two Pointers  
> 本週 System Design 主題：水平擴展與負載平衡

接續 [第 3 週 Day 2](/docs/career-blueprint/week-03-day-02)。今天以**閉卷重現與畫圖**為主，不追新題數。先保存自己的第一次版本與預測，再看對照內容；範例程式是練習材料，不是已完成的個人證據。

作答方式：知識題先選再展開解析；進度依實際完成情況勾選。Markdown 勾選不會自動保存作答，程式、測試、圖或 Debug 紀錄要另外留存。

## 今日完成定義

- [ ] **NeetCode 150｜45 分鐘**：閉卷重寫兩題，先畫資料流，再比較 `Set`／`Map` 保存什麼資訊；保留第一次程式、測資與 Big-O。
- [ ] **React 實戰｜60 分鐘**：修好 timer、subscription、fetch 的 stale closure／漏 cleanup；留下可執行程式、測試、Profiler 或 Debug 證據至少一項。
- [ ] **收尾｜15 分鐘**：用自己的話寫五句技術筆記，標記未完成項與下一個動作。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：把 session 改成 stateless 或 shared store；小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。今天建議重寫已練過的 [217 Contains Duplicate](/docs/algorithms/leetcode/f0201-0300/l0217-contain-duplicate) 與 [1 Two Sum](/docs/algorithms/leetcode/f0001-0100/l0001-two-sum)，因為前者只問存在、後者要回傳位置。若這兩題已能秒答，可以把 217 換成 [128 Longest Consecutive Sequence](/docs/algorithms/leetcode/f0101-0200/l0128-longest-consecutive-sequence)，仍維持**兩題**。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | 兩題閉卷重寫 | 手畫資料流、兩份第一次程式、測資、`Set`／`Map` 比較 |
| 21:15–22:15 | React 三種 Effect 修復 | 可執行程式或測試／Profiler／Debug 紀錄，標明修正前後 |
| 22:15–22:30 | 五句技術筆記 | 五句自己的話、未完成項與補做動作 |
| 22:30–22:50 | Session 擴展 | 自畫圖／自算三數字／自寫 failure case／口述至少一項 |

---

## Part 1｜NeetCode 150：閉卷重寫兩題並比較 Set／Map（45 分鐘）

### 1. 先畫圖，再碰程式

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 選兩題，關閉舊解與提示 | 題號、語言與開始時間 |
| 5–10 | 各畫一張最小資料流 | 每輪「查什麼 → 存什麼 → 何時回傳」 |
| 10–25 | 第一題閉卷實作並手跑測資 | 第一版程式與至少三個預期結果 |
| 25–40 | 第二題閉卷實作並手跑測資 | 第一版程式與至少三個預期結果 |
| 40–45 | 執行測試、對照與寫 Big-O | 錯誤原因、資料結構比較、下次修正動作 |

第 40 分鐘以前不看 Stage B 或舊程式。若卡住，先在紙上追最小輸入；看過提示後完成，要標「提示後完成」，保留閉卷原稿。

**先閉卷回答：**

1. 217 問「這個值以前出現過嗎？」需要保存值以外的資訊嗎？
2. 1 Two Sum 問「哪兩個 index？」若只保存 `Set`，缺了什麼？
3. 每輪應先查還是先存？用 `[3, 3]`、target `6` 畫出差別。
4. 兩題的整體時間與額外空間各是多少？說明雜湊查找的平均成本前提。

```txt
217：目前值 → 查「已見過？」→ 已見過就回傳；否則保存目前值
 1 ：目前值 → 算需要的補數 → 查「補數在哪個舊 index？」
                  → 找到就回傳兩個 index；否則保存目前值與 index
```

### 2. 一個容易混淆的測資

**單選｜`nums = [3, 3]`、`target = 6`，Two Sum 逐輪掃描時，哪個順序正確？**

- [ ] A. 先把當前 `3` 放進 `Map`，立刻查到同一個位置並回傳 `[0, 0]`。
- [ ] B. 先查補數是否在先前位置，找不到才保存當前值；第二輪查到 index `0`，回傳 `[0, 1]`。
- [ ] C. `Set` 和 `Map` 都不能處理重複值。

<details>
<summary>閉卷完成兩題後再看解析</summary>

**答案：B。** 查詢放在保存當前值之前，才不會把同一位置用兩次。`Map` 的 value 存 index，符合題目輸出契約；217 只要回答有無，`Set` 就夠。雜湊操作平均 `O(1)` 時，兩題皆為平均 `O(n)` 時間、最差額外 `O(n)` 空間。

</details>

### 3. 今日驗收

- [ ] 兩題都有閉卷第一版；沒有用看過的解答覆蓋原稿。
- [ ] 每題至少測：一般例子、重複值、最小或無解方向（依題目契約）。
- [ ] 圖能指出每輪的查詢、保存與回傳時機。
- [ ] 能用一句話說明 `Set` 保存「是否存在」，`Map` 保存「key 對應的額外資訊」。
- [ ] Big-O 有說明 `n` 與平均雜湊查找前提。

---

## Part 2｜React 實戰：修 timer、subscription、fetch（60 分鐘）

### 1. 先預測故障

| 分鐘 | 任務 | 留下什麼 |
| ---: | --- | --- |
| 0–8 | 讀三段故障情境，預測 stale 值與殘留資源 | 預測表 |
| 8–20 | 修 timer | 暫停／重啟、卸載後不再 tick 的紀錄 |
| 20–35 | 修 subscription | 切換條件後舊 listener 移除、新 listener 生效 |
| 35–50 | 修 fetch | 快速切換 user 時舊回應不蓋新資料 |
| 50–60 | 執行、截取 Debug 證據並解釋 | 程式／測試／Profiler／Debug 至少一項 |

| 情境 | 常見錯誤 | 修正方向 | 操作驗證 |
| --- | --- | --- | --- |
| Timer | interval 捕捉第一次 render 的 `seconds`；暫停後仍在跑 | 用 functional updater，並在 Effect cleanup 清 interval | 計數連續增加；暫停後等兩秒不變 |
| Subscription | listener 讀到舊 state；條件變了舊 listener 還在 | 依賴正確列出，使用相同 handler 取消訂閱 | 切換頻道後只有新頻道事件生效 |
| Fetch | 舊 request 晚回來覆蓋新 user；卸載後仍嘗試更新 | 依賴 `userId`，cleanup abort 並忽略舊結果 | 快速切換 ID，畫面只顯示最後選定者 |

React 在依賴改變時會先執行舊 cleanup、再執行新 setup；卸載時也會 cleanup。開發模式 Strict Mode 會額外執行一次 setup／cleanup 來檢查兩者是否對稱。[React `useEffect` 官方說明](https://react.dev/reference/react/useEffect)。

### 2. 可執行對照：一個 `App.jsx` 完成三項操作

先自己修，再展開。把下面內容貼到現有 React 專案的 `App.jsx`；它只用 React 與瀏覽器 API。`fetch` 使用公開測試 API，若離線請改成自己的 mock endpoint，仍須測舊回應競態。

<details>
<summary>完成自己的修正後，再看可執行參考程式</summary>

```jsx
import { useEffect, useState } from 'react';

function Timer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSeconds(previous => previous + 1), 1000);
    console.log('timer setup');
    return () => {
      clearInterval(id);
      console.log('timer cleanup');
    };
  }, [running]);

  return <section><h2>Timer: {seconds}s</h2>
    <button onClick={() => setRunning(value => !value)}>
      {running ? 'Pause' : 'Start'}
    </button></section>;
}

function Subscription() {
  const [channel, setChannel] = useState('A');
  const [hits, setHits] = useState(0);

  useEffect(() => {
    const onMessage = event => {
      if (event.detail === channel) setHits(previous => previous + 1);
    };
    window.addEventListener('practice-message', onMessage);
    console.log('subscribe', channel);
    return () => {
      window.removeEventListener('practice-message', onMessage);
      console.log('unsubscribe', channel);
    };
  }, [channel]);

  return <section><h2>Channel {channel}: {hits} hits</h2>
    <button onClick={() => setChannel(value => value === 'A' ? 'B' : 'A')}>
      Switch channel
    </button>
    <button onClick={() => window.dispatchEvent(
      new CustomEvent('practice-message', { detail: channel })
    )}>Send to current channel</button></section>;
}

function UserFetch() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setUser(null);
    setStatus('loading');

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (active) { setUser(data); setStatus('success'); }
      })
      .catch(error => {
        if (active && error.name !== 'AbortError') setStatus('error');
      });

    return () => {
      active = false;
      controller.abort();
      console.log('fetch cleanup', userId);
    };
  }, [userId]);

  return <section><h2>User {userId}</h2>
    <button onClick={() => setUserId(value => value === 1 ? 2 : 1)}>
      Switch user
    </button>
    <p>{status === 'loading' ? 'Loading…' : status === 'error'
      ? 'Request failed' : user?.name}</p></section>;
}

export default function App() {
  const [show, setShow] = useState(true);
  return <main><button onClick={() => setShow(value => !value)}>
    {show ? 'Unmount' : 'Mount'} examples
  </button>{show && <><Timer /><Subscription /><UserFetch /></>}</main>;
}
```

</details>

`AbortController` 可取消 fetch，但單靠它仍要考慮已完成的非同步步驟與其他不支援取消的工作；上面的 `active` 讓舊 Effect 的結果不再更新畫面。這個小範例用來練習 Effect 生命週期，正式專案若有快取、去重、SSR 或重新驗證需求，應依架構選資料層。[React 官方：在 Effect 中取得資料](https://react.dev/reference/react/useEffect#fetching-data-with-effects)。

### 3. Debug 證據與驗收

| 動作 | 預期可觀察結果 | 自己的證據 |
| --- | --- | --- |
| Start → 等 3 秒 → Pause → 等 2 秒 | 約增加 3，暫停後不再增加；log 有 timer cleanup | [ ] 已記錄 |
| A 發事件 → 切 B → B 發事件 | 每次只加 1；log 有 unsubscribe A、subscribe B | [ ] 已記錄 |
| 連按 Switch user、再 Unmount | 最後畫面只對應當前 ID；卸載時有 fetch cleanup | [ ] 已記錄 |

- [ ] 三個情境都能說出 closure 捕捉了哪次 render 的值，以及 cleanup 清掉什麼。
- [ ] 至少保存一項：可執行程式、測試、Profiler 截圖或 Console／breakpoint Debug 紀錄。
- [ ] 若用上面參考程式，只算對照；要保留自己的修正與操作結果才算實戰完成。

---

## Part 3｜收尾：五句自己的技術筆記（15 分鐘）

前 10 分鐘關掉對照內容，用自己的話寫**剛好五句**，每句只講一個因果；後 5 分鐘核對證據並標記未完成項。下面是主題提示，不是可直接照抄的答案。

1. `Set` 適合回答什麼問題？
2. `Map` 比 `Set` 多保留了哪種資訊，今天哪題需要它？
3. Timer 的 closure 為什麼可能讀到舊 state？
4. Subscription／fetch 的 cleanup 分別避免什麼錯誤？
5. Session 存在單機記憶體時，負載平衡後會發生什麼事？

**五句筆記完成狀態**

- [ ] 已寫五句自己的話，且至少兩句附自己的測試或畫圖觀察。
- [ ] 少於五句，或主要照抄參考內容；需補寫。

**未完成項：只勾實際欠缺的部分，並選一個最小補做動作**

- [ ] 兩題閉卷版／測試未完成：週末 25 分鐘重寫缺的題並跑三組測資。
- [ ] React 程式或操作證據未完成：週末 25 分鐘補一個可重現的前後對照。
- [ ] 五句筆記未完成：週末 10 分鐘關頁面重寫。
- [ ] Session 主動產出未完成：週末 15 分鐘補圖、數字、failure case 或口述。
- [ ] 今日四項均完成，無需補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：把 session 改成 stateless／shared store

延續本週的 Watchlist 服務：原本 session 放在 Service A 的記憶體，Load Balancer 把下一個請求送到 Service B，B 查不到登入狀態。Sticky session 可以暫時減少跨機切換，但 A 故障或重啟後 session 仍會遺失，也讓流量分配受限。今天在**自包含且可驗證的 token**與**共用 session store**之間選一個，說明故障時會怎樣。

### 這個標題到底在問什麼？

使用者登入時，請求可能由 Service A 處理；下一次請求卻可能被負載平衡器送到 Service B。今天要解決的問題是：**B 怎麼知道這個使用者已登入？**

- **Session（登入工作階段）**：服務用來辨認「這個請求屬於誰、是否已登入」的資訊。若只存在 A 的記憶體，B 看不到。
- **Stateless（服務無狀態）**：A 不把登入資訊只留在自己的記憶體。常見做法是讓瀏覽器每次帶一個有簽章和有效期的 token，A 或 B 都能自行驗證。代價是 token 若要在到期前立即失效，例如登出所有裝置，需要額外設計撤銷機制。
- **Shared store（共用儲存）**：把登入資訊放在 A、B 都能查的地方。瀏覽器帶 session ID；請求到哪一台，那台就用 ID 查同一份資料。代價是共用儲存變慢或故障時，登入驗證也可能受影響。

一句話記：**stateless 是每台自行驗證憑證；shared store 是每台查同一份登入資料。** 這裡的 stateless 指服務實例不依賴自己的登入記憶體，不表示使用者資料或 Watchlist 不需要儲存。

### 先把英文名詞翻成白話

先記住這條路徑：**瀏覽器送出請求 → 負載平衡器選一台服務 → 服務確認「你是誰」→ 才讀取你的自選清單**。以下名詞都在描述這條路徑上的角色、資料或故障。

| 英文名詞 | 中文與白話意思 | 放進今天的例子 |
| --- | --- | --- |
| System Design | 系統設計：決定多台服務、資料儲存與故障處理如何合作 | 設計「登入後查看 Watchlist」在擴成多台時仍可運作 |
| High concurrency | 高併發：同一段時間有很多請求一起進來 | 許多人同時開啟自選清單，而非只有一人操作 |
| Horizontal scaling | 水平擴展：增加同類服務的台數來分攤流量 | 從 Service A 增加到 A、B、C；共用資料庫的容量要另外評估 |
| Browser / request | 瀏覽器／請求：使用者端與它送出的單次存取要求 | 瀏覽器送出「取得我的 Watchlist」請求 |
| Service / instance | 服務／實例：處理請求的程式；instance 是其中一個正在執行的副本 | A 和 B 是同一種服務的兩個獨立程序，各有自己的記憶體 |
| Load Balancer（LB） | 負載平衡器：在可接流量的服務實例中，選一台轉送請求 | 第一次送 A、第二次可能送 B；它不會自動同步兩台記憶體 |
| Watchlist | 自選清單：使用者保存的股票代碼清單 | 驗證身分後，服務才能讀取屬於該使用者的清單 |
| Session | 登入工作階段：服務用來辨認使用者登入狀態的資訊 | 可放單機記憶體、共用儲存，或改用自包含 token |
| Session ID | 工作階段識別碼：指向伺服器端 session 的一串不透明代碼 | 瀏覽器帶著 ID，A 或 B 再用它查共用儲存；ID 本身不應包含可直接信任的身分資料 |
| Sticky session | 黏性連線／黏性分流：盡量把同一使用者送回同一台服務 | 可暫時讓使用者一直到 A，但 A 下線時仍會失去只存在 A 的 session |

兩條修正路徑的差異，重點在於**驗證登入狀態需要去哪裡找資料**：

| 英文名詞 | 中文與白話意思 | 今天應記住的界線 |
| --- | --- | --- |
| Shared store / session store | 共用儲存／工作階段儲存：A、B 都能讀寫的同一份 session 資料 | 每台拿 session ID 查 store；store 變慢會影響所有需要驗證的請求 |
| Stateless service | 無狀態服務：單一實例不依賴自己記憶體裡的使用者登入資料 | A 下線後 B 仍能驗證請求；不代表整個系統沒有資料庫 |
| Token / signed token | 權杖／帶簽章的權杖：瀏覽器每次附上的憑證；簽章讓服務檢查內容有沒有被竄改 | A、B 可各自驗證，但**簽章不是加密**，不要把敏感內容當成保密資料直接塞入 token |
| Verify key | 驗證金鑰：用來檢查 token 簽章的金鑰材料 | 對稱簽章使用共享密鑰；非對稱簽章可用公開金鑰驗證；各台都要拿到正確版本 |
| Expiration / revocation | 到期／撤銷：前者是憑證過了期限失效，後者是在期限前主動讓它失效 | 短效 token 較快自然失效，但「立刻登出所有裝置」仍需另設計 |
| Refresh | 續發：短效 token 快到期時，用受保護的流程取得新 token | 要規劃 refresh 憑證保存、輪替與失效，不能無限續發 |

**用一個請求串起來：**使用者登入後，若走 shared store 路線，瀏覽器保存 session ID；下一次請求即使被 LB 送到 B，B 仍能查 store 找到登入資訊。若走 stateless token 路線，瀏覽器帶 signed token，B 驗證簽章和到期時間後辨認使用者。兩條路線都要保護憑證，也都要定義登出與撤銷行為。

後面的數字和故障題還會用到這些字：

| 英文名詞 | 中文與白話意思 | 本頁怎麼讀 |
| --- | --- | --- |
| Peak / requests/s | 尖峰／每秒請求數：最忙時每秒進來多少個請求 | `1,000 requests/s` 是每秒 1,000 次請求，不是 1,000 個使用者 |
| Reads/s | 每秒讀取次數：一秒內向儲存系統查詢幾次 | `800 reads/s` 是 session store 的查詢壓力，不等於服務的請求數 |
| Latency / p95 | 延遲／第 95 百分位延遲：請求花多久；p95 表示約 95% 的觀測值不超過該時間 | store p95 升高，代表慢查詢影響的範圍擴大；也要看逾時率 |
| Timeout / bounded retry | 逾時／有限次重試：等待超過上限就停止；重試要限制次數與總時間 | store 故障時避免每個請求無止境等待或重試 |
| Failure case / bottleneck | 故障情境／瓶頸：具體失敗過程／限制整體能力的環節 | A、B 都查同一 store，store 可能成為共同瓶頸 |
| Authentication error | 身分驗證錯誤：無法確認使用者是誰 | 「session 無效」和「store 暫時查不到」原因不同，不應一律說使用者已登出 |

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–4 | 畫出原本失敗路徑 | A、B、LB、session 所在位置 |
| 4–9 | 選 stateless 或 shared store | 資料放哪裡、每台如何驗證、過期或撤銷方式 |
| 9–14 | 完成一項主動產出 | 小圖／三數字／failure case／口述 |
| 14–20 | 口頭檢查故障與取捨 | A 下線、store 變慢、token 失效時的行為 |

**單選｜A 有登入 session、B 沒有；LB 下一次把請求送到 B，最直接的問題是什麼？**

- [ ] A. LB 一定會自動複製 A 的記憶體到 B。
- [ ] B. B 無法辨識這個 session，可能把使用者當成未登入。
- [ ] C. `Set` 會自動跨服務程序同步登入資訊。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 單機記憶體只屬於該 instance。若用 shared store，每台以 session ID 查同一份資料；若用 stateless token，每台驗證簽章與有效期。兩者都仍要設計憑證保護、過期與撤銷策略。

</details>

### 1. 一張小圖：選一條路徑自己重畫

```txt
Shared store：Browser -- session ID --> LB --> Service A / B --> Session Store
Stateless  ：Browser -- signed token -> LB --> Service A / B -- verify key
```

**Service A／B 怎麼知道使用者資料？** LB 只負責轉送請求；無論送到 A 或 B，服務都先確認使用者身分，再視需要讀取資料庫。

| 做法 | Service A／B 收到請求後 |
| --- | --- |
| Shared store | 從 Cookie 取出 session ID → 到共用 Session Store 查 session → 得到 `userId` 等登入資訊 → 需要姓名、權限等資料時再查資料庫。 |
| Stateless token | 從請求取出 signed token → 用驗證金鑰確認簽章與有效期限 → 從 token 的 `sub` 取得 `userId` → 需要完整或最新資料時再查資料庫。 |

例如使用者 ID 是 `123`：session 可以存 `{ userId: 123 }`；token 可以帶 `sub: "123"`。**Stateless 只表示驗證登入時不必查共用 session，不表示服務不能查資料庫。** 若權限可能變動，需查最新權限，或接受 token 內權限在到期前可能不是最新的。

在自己的圖上標出：登入時誰發 session／token、一般請求誰驗證、登出或撤銷如何生效。不要把「stateless」誤解成整個系統不保存任何資料：Watchlist 本身仍要存資料庫；即使 token 可獨立驗證，也可能需要保存撤銷資訊。

### 2. 三個數字：估 shared store 的讀取壓力

練習假設：尖峰 `1,000 requests/s`、其中 `80%` 需要 session、每次驗證查 store 一次。先自己算，再展開。

<details>
<summary>算完再看三個數字</summary>

需要 session 的比例是 **80%**；session store 讀取約 `1,000 × 0.8 = 800 reads/s`；若任一台服務只可處理 `200 requests/s`，不考慮餘裕時至少要 `ceil(1,000 / 200) = 5` 台服務。五台服務不會把共用 store 的 800 reads/s 消掉；實際容量還要留故障餘裕並量測延遲。

</details>

### 3. 一個 Failure Case：共用 store 逾時

```txt
觸發：session store 延遲升高，A、B 都查不到 session。
使用者現象：已登入請求變慢，或收到暫時無法驗證的錯誤。
風險：服務重試放大 store 負載；錯誤地把驗證失敗當成未登入。
處理：設查詢逾時與有界重試、限制流量，區分「store 故障」與「session 無效」。
驗證：觀察 store p95、逾時率、認證錯誤率與重試量。
恢復條件：查詢延遲及錯誤率回到可接受範圍，登入狀態重新可驗證。
```

若選 stateless token，改寫成「簽章金鑰輪替或 token 遭撤銷」的 failure case，說明每台如何拿到新金鑰，以及舊 token 何時失效。自包含 token 的優點是一般驗證不必每次查 session store；代價是即時撤銷較複雜，短效期與 refresh 流程也要設計。

### 4. 3 分鐘口述與驗收

```txt
0:00–0:35  原本的跨機 session 故障。
0:35–1:20  自己選的方案與圖上資料流。
1:20–2:00  容量或延遲假設，指出共用瓶頸。
2:00–2:40  一個故障：現象、處理、可觀察指標。
2:40–3:00  選擇的代價與改選條件。
```

- [ ] 自己完成小圖／三個數字／failure case／3 分鐘口述至少一項；只閱讀範例不算。
- [ ] 能說明多台服務如何驗證同一個使用者的登入狀態。
- [ ] 能說出所選方案的一個故障與一個代價。
- [ ] 沒有把擴增 Service 台數說成 session store 或資料庫也自動擴容。

---

## 今日結束打卡

每列依實際結果選一個狀態；「看懂參考解」不等於閉卷完成或留下操作證據。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| 兩題閉卷與 Set／Map 比較 | [ ] | [ ] | [ ] |
| React 三情境修復 | [ ] | [ ] | [ ] |
| 五句自己的技術筆記 | [ ] | [ ] | [ ] |
| Session 微題與主動產出 | [ ] | [ ] | [ ] |

最後核對：今天是否留下兩份第一次程式、React 至少一項可驗證證據、五句自己的話，以及 Session 的一項主動產出？欠缺者依 Part 3 標記補做，不把閱讀範例勾成完成。
