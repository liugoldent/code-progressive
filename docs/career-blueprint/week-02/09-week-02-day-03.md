---
sidebar_position: 3
sidebar_label: "Day 3"
slug: "/career-blueprint/week-02-day-03"
title: "第 2 週 Day 3：Group Anagrams 閉卷重現、React 計時器與 CDN 快取"
description: "140 分鐘日課：閉卷重寫 Group Anagrams 與 frequency key、React 計時器與 DOM focus、修正 mutation 與不穩定 key、五句技術筆記，以及 CDN edge／origin 與 cache hit 圖解。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Group Anagrams", "frequency key", "useRef", "timer", "DOM focus", "mutation", "React key", "CDN", "cache hit", "origin"]
---

# 第 2 週 Day 3：閉卷重現與 React 實戰

> 安排日期：2026-09-16；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Arrays & Hashing II  
> 本週 System Design 主題：網路與請求路徑  
> 今日原則：**閉卷重現、先畫圖、不追新題數，實作必須留下證據。**

接續 [第 2 週 Day 2](/docs/career-blueprint/week-02-day-02)。作答方式沿用前三天：知識題先單選再展開解析，進度依事實勾選。「尚未完成／無需補課」不可與矛盾項同時勾選。Markdown 勾選不代表網站自動保存；閱讀參考答案不等於完成自己的練習。

## 今日完成定義

- [ ] **NeetCode 150｜45 分鐘**：閉卷重寫 Group Anagrams，整理 frequency key，畫出字串到群組的資料流，不增加新題。
- [ ] **React 實戰｜60 分鐘**：做計時器＋DOM focus，修正 mutation 與不穩定 key；留下可執行程式、測試、Profiler 或 Debug 證據至少一項。
- [ ] **收尾｜15 分鐘**：用自己的話寫五句技術筆記，標記未完成項與下一步。
- [ ] **System Design × 高併發｜20 分鐘**：畫 CDN edge／origin 與 cache hit；小圖／三個數字／failure case／3 分鐘口述，至少完成一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。System Design 未完成就加入週末補課，不影響下週主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | Group Anagrams 閉卷重現 | 第一版、frequency key 圖、測資與 Big-O |
| 21:15–22:15 | React 計時器與列表 | 可執行程式／測試／Profiler／Debug 至少一項 |
| 22:15–22:30 | 收尾 | 自己寫的五句筆記、未完成標記 |
| 22:30–22:50 | CDN 快取 | 至少一項主動產出 |

---

## Part 1｜NeetCode 150：Group Anagrams 閉卷重現（45 分鐘）

今天關閉解答，從空白重寫。完整三階段題解沿用 **[LeetCode 49｜Group Anagrams](/docs/algorithms/leetcode/f0001-0100/l0049-groupAnagrams)**；完成第一版後才回看 Stage B，不必重新讀整篇。

### 1. 今日 45 分鐘節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 閉卷重述契約 | 輸入、群組規則、順序與字元範圍 |
| 5–20 | 寫熟悉語言版本 | 從空白完成，不貼舊程式 |
| 20–30 | 跑測資並修正 | 保留失敗案例與原因 |
| 30–40 | 畫圖、整理 frequency key | 字元計數 → 穩定 key → 群組 |
| 40–45 | 口述與回看 | Invariant、Big-O、是否用了提示 |

今日先完成一種語言的閉卷重現；有餘裕才補另一種，不壓縮畫圖與驗證時間。

### 2. 閉卷任務卡

1. 輸入為小寫英文字串陣列，把互為 anagram 的字串放在同組；輸出群組與組內順序不限。
2. 空字串、重複字串都要保留，不能用 Set 把相同輸入刪掉。
3. 本次練習不修改輸入。先說排序 key 如何做，再實作 frequency key。
4. 解釋兩個方向：互為 anagram 為何得到相同 key？相同 key 為何能推回每個字母數量相同？

| 測資 | 驗收重點 |
| --- | --- |
| `["eat", "tea", "tan", "ate", "nat", "bat"]` | 三組，不能只比長度 |
| `[""]` | 一個群組，包含一個空字串 |
| `["", ""]` | 同組保留兩個空字串 |
| `["a", "a", "b"]` | 重複輸入不遺失 |
| `["ab", "ba", "aa"]` | 前兩個同組，第三個分開 |
| `["aab", "abb"]` | 字母集合相同，頻率不同 |
| `["aaaaaaaaaaab", "abbbbbbbbbbb"]` | 檢查計數序列化是否有歧義 |

比較結果時，可先排序各組，再排序群組以消除順序差異；不能只比較群組數量。空陣列可當本機延伸測試，但不把它宣稱為官方 constraints 內測資。

### 3. 完成第一版後才展開：frequency key 圖解

<details>
<summary>參考圖、碰撞陷阱與成本</summary>

```text
固定座標        a b c d e ... t ... z
"eat" ─計數─→ [1,0,0,0,1,...,1,...,0] ─序列化─→ K1
"tea" ─計數─→ [1,0,0,0,1,...,1,...,0] ─序列化─→ K1
"tan" ─計數─→ [1,0,0,0,0,...]         ─序列化─→ K2

Map
K1 → ["eat", "tea"]
K2 → ["tan"]
```

圖中省略號只是畫圖簡寫，真正 key 必須包含固定順序的完整 26 格。TypeScript 可用 `counts.join('#')`，Python 可用 `tuple(counts)`。

不能直接把數字黏起來：前兩格 `[1, 11]` 與 `[11, 1]` 都會變成 `111`。加分隔符可區分 `1#11` 與 `11#1`。JavaScript 的陣列作 Map key 依物件身分比較，新建的兩個同內容陣列不會自動同組；Python list 則不可雜湊。

Invariant：處理完前 i 個字串後，每個字串恰好進入自己的 frequency key 群組，且同群組所有字母計數一致。每次為新字串建立或清空計數陣列，避免累加到上一個字串。

令 n 為字串數、L 為所有字元總數、k 為最大字串長度。固定 26 字母、一般雜湊假設下，計數與 key 建立共 O(L + 26n)，常簡寫 O(nk + n)。排序 key 則常記為 O(nk log k + n)。計數暫存為 26 格，群組 key 與輸出索引也需要空間，不能說整個演算法只用 O(1)；固定字母表及題目字串長度上限下，額外儲存可記 O(n)。

</details>

**單選｜frequency key 必須滿足哪個條件？**

- [ ] A. 只要字串長度相同，key 就應相同。
- [ ] B. 固定字母座標、完整計數、無歧義的序列化。
- [ ] C. 每個字串隨機產生唯一 ID。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 長度不足以辨識群組；隨機 ID 無法把同群組歸在一起。Frequency key 保存的是字母次數，而不是字元出現順序。

</details>

### 4. 今日驗收

- [ ] 從空白完成第一版，記下有無使用提示。
- [ ] 跑過七組測資，確認重複輸入與空字串不遺失。
- [ ] 自己畫出至少三個字串如何進入兩個群組。
- [ ] 能說明分隔符與 JavaScript 陣列 key 的陷阱。
- [ ] 能由實際工作量推導時間與空間，而非只背 O(nk)。

---

## Part 2｜React 實戰：計時器＋DOM focus（60 分鐘）

### 1. 今日目標與節奏

做一個練習計時器：開始、暫停、歸零、聚焦備註輸入框、儲存紀錄、反轉紀錄、標記完成。列表每列有自己的草稿，讓你觀察 key 是否讓狀態跟著正確資料走。

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–10 | 畫 state／ref／effect 的責任 | 秒數、啟動狀態、DOM 節點、timer 清理 |
| 10–30 | 實作計時器與 focus | 開始／暫停／歸零及聚焦 |
| 30–45 | 加紀錄並修 mutation／key | 不可變更新、穩定 ID |
| 45–55 | 操作驗收 | 重複啟動、卸載、反轉與草稿歸屬 |
| 55–60 | 留證據與口述 | 至少一種實際產出 |

### 2. 先決定資料放哪裡

| 資料／動作 | 放哪裡 | 理由 |
| --- | --- | --- |
| seconds、running、輸入文字 | state | 畫面要隨它改變 |
| 已掛載的 input 節點 | ref | 事件中呼叫 `focus()` |
| interval ID | effect 區域變數 | 本例只由該 effect 建立與清理，不需額外 state |
| 紀錄陣列 | state | 反轉、標記時產生新資料 |
| 格式化秒數 | render 推導 | 不必再存一份同步 state |

按鈕聚焦既有 input 可直接在事件中呼叫 ref 的 `focus()`；不可在 render 中操作 DOM。參考 [React：Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)。

### 3. 先找錯，再寫自己的版本

```jsx
// 錯誤練習片段，勿與下方正確版本同時執行。
useEffect(() => {
  setInterval(() => setSeconds(seconds + 1), 1000);
}, []);

function reverseRecords() {
  records.reverse();
  setRecords(records);
}

// 列內有草稿 state，且允許反轉。
records.map((record, index) => <RecordRow key={index} record={record} />);
```

先口述三個問題：callback 捕捉哪次 seconds？誰清掉 interval？反轉後 state 參考與每列身分發生什麼事？

<details>
<summary>完成自己的版本後再看：可執行參考程式</summary>

在既有 React 練習環境將以下存成 `App.jsx` 並由入口掛載。沿用專案原本的啟動指令，不需新增套件。元件使用 React 18 可用的 API。

```jsx
import { useEffect, useRef, useState } from 'react';

function RecordRow({ record, onToggle }) {
  const [draft, setDraft] = useState(record.label);
  return (
    <li>
      <span>{record.label}：{record.seconds} 秒 </span>
      <input
        aria-label={`${record.label} 草稿`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <button onClick={() => onToggle(record.id)}>
        {record.done ? '已完成' : '標記完成'}
      </button>
    </li>
  );
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState('');
  const [records, setRecords] = useState([]);
  const inputRef = useRef(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  function saveRecord() {
    const id = nextId.current++;
    const record = {
      id,
      label: label.trim() || `紀錄 ${id}`,
      seconds,
      done: false,
    };
    setRecords((previous) => [...previous, record]);
    setLabel('');
    inputRef.current?.focus();
  }

  function toggleRecord(id) {
    setRecords((previous) => previous.map((record) =>
      record.id === id ? { ...record, done: !record.done } : record
    ));
  }

  return (
    <section>
      <h2>練習計時器</h2>
      <p>{seconds} 秒（{running ? '計時中' : '已暫停'}）</p>
      <button disabled={running} onClick={() => setRunning(true)}>開始</button>
      <button disabled={!running} onClick={() => setRunning(false)}>暫停</button>
      <button onClick={() => { setRunning(false); setSeconds(0); }}>歸零</button>
      <label>
        備註
        <input ref={inputRef} value={label}
          onChange={(event) => setLabel(event.target.value)} />
      </label>
      <button onClick={() => inputRef.current?.focus()}>聚焦備註</button>
      <button onClick={saveRecord}>儲存紀錄</button>
      <button onClick={() => setRecords((previous) => [...previous].reverse())}>
        反轉紀錄
      </button>
      <ul>
        {records.map((record) => (
          <RecordRow key={record.id} record={record} onToggle={toggleRecord} />
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  const [visible, setVisible] = useState(true);
  return (
    <main>
      <button onClick={() => setVisible((previous) => !previous)}>
        {visible ? '卸載計時器' : '掛載計時器'}
      </button>
      {visible && <Timer />}
    </main>
  );
}
```

這是練習用 tick 計數器，不是精準碼表；背景分頁或忙碌時 callback 可能延遲。若要實際經過時間，應記錄起點與累積時間，以時間差計算，interval 只負責刷新畫面。

ID 在新增紀錄的事件中產生，於這次列表生命週期內唯一；持久化或跨裝置的資料要另有持久 ID。每列草稿故意放在子元件 state，方便檢查重新排序後身分是否保持。

</details>

### 4. 修正的理由與操作驗收

- **Timer**：用 updater 取得前一個 pending state；effect 依 running 啟停，cleanup 清理舊 interval。開發模式 Strict Mode 的額外 setup／cleanup 是檢查清理是否對稱，不要關掉它掩蓋問題。[React：Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- **Mutation**：`reverse()` 改原陣列，先複製再反轉；改某一列也要建立新的列物件。僅複製陣列後修改舊物件仍會改到舊 state。
- **Key**：使用資料的穩定 ID。Index 在反轉時會把列內 state 留在原位置；每次 render 用隨機 key 會讓元件重建、草稿重設。穩定 key 保持身分，不保證跳過 render。[React：Rendering Lists](https://react.dev/learn/rendering-lists)

| 操作 | 預期結果 | 能驗證什麼 |
| --- | --- | --- |
| 開始後再按開始 | 按鈕停用，不加開 timer | 重複啟動防護 |
| 暫停後等待兩秒 | 秒數維持暫停值 | cleanup |
| 再開始、歸零 | 恢復累加；歸零後維持 0 | 啟停與重設 |
| 按聚焦備註 | 游標進入 input | DOM ref |
| 存 A、B，將 A 草稿改成 A-edit，再反轉 | A-edit 仍屬於 A | 穩定 key |
| 標記 A 完成 | 只有 A 變更，舊物件不被修改 | 不可變更新 |
| 計時中卸載，再掛載 | 舊 interval 清掉，新元件初始為 0 且暫停 | 卸載清理 |

Debug 時可在 effect setup、cleanup 加配對 log，或在 callback 放 breakpoint 檢查卸載後是否仍執行。只看重新掛載後畫面為 0，不能證明沒有 timer 洩漏。

**單選｜把陣列複製後執行 `copy[0].done = true`，是否已避免 mutation？**

- [ ] A. 是，外層陣列不同就足夠。
- [ ] B. 否，第一個物件仍與舊陣列共用，應替換該物件。
- [ ] C. 加上隨機 key 即可解決。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 淺複製只複製外層，內部物件仍指向相同參考。以 map 與物件展開建立改變的列即可。

</details>

### 5. 今日證據與驗收

下面至少完成一項，不能把本頁提供的程式當作自己已執行的證據：

- [ ] 可執行程式：保存自己的版本、啟動指令與操作結果。
- [ ] 測試：驗證開始／暫停／卸載清理與反轉後草稿歸屬，留下執行結果。
- [ ] Profiler：錄製儲存與反轉，說明哪些元件更新；不把 render 次數當 timer 洩漏證據。
- [ ] Debug：留下 setup／cleanup 或 breakpoint 紀錄，解釋修正前後差異。
- [ ] 尚未留下證據，列入補課（不可與完成項同時勾選）。

完成後閉卷說明：為何 seconds 用 state、DOM 用 ref？Interval ID 為何在本例可留在 effect 區域？為何 key 會影響草稿歸屬？

---

## Part 3｜收尾：五句技術筆記（15 分鐘）

前 10 分鐘關閉範例，用自己的話實際寫五句；後 5 分鐘標記未完成項。下面是寫作提示，不是可以直接勾選代替的答案。

| 句子 | 要回答的問題 |
| --- | --- |
| 第 1 句 | Frequency key 保存什麼？為什麼不直接拼接數字？ |
| 第 2 句 | 畫面 state、DOM ref、timer handle 如何分工？ |
| 第 3 句 | Interval callback 如何讀更新值，誰負責清理？ |
| 第 4 句 | 今天哪個 mutation 被修正？新建了哪一層資料？ |
| 第 5 句 | 反轉列表時，穩定 key 如何保住草稿？用實際操作解釋。 |

- [ ] 已寫滿五句自己的話，至少一句引用今天實際失敗的例子或驗證結果。
- [ ] 已標記「獨立完成／提示後完成／未完成」，沒有把看懂當完成。
- [ ] 每個未完成項都有一個週末可直接執行的動作。

### 未完成才加入的週末補課清單

- [ ] 30 分鐘：閉卷重寫 Group Anagrams、跑七組測資，重畫 frequency key。
- [ ] 25 分鐘：補完 timer／focus，用 Debug 確認卸載清理。
- [ ] 20 分鐘：重現 index key 的草稿錯位，再修成穩定 ID；補不可變更新。
- [ ] 15 分鐘：補齊五句自己的技術筆記，各附一個例子。
- [ ] 20 分鐘：完成下節 CDN 的一項主動產出；Combo 結束後才決定是否勾選。
- [ ] 無需補課（不可與補課項同時勾選）。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：畫 CDN edge／origin 與 cache hit

情境：使用者載入公開商品圖片。先假設內容可被共享快取，瀏覽器這次確實向 CDN 發請求；不把個人資料 API 混進來。

| 分鐘 | 任務 |
| ---: | --- |
| 0–5 | 認識 edge、origin、hit、miss 與 TTL |
| 5–10 | 畫出 hit／miss 兩條路徑 |
| 10–15 | 算數字或分析一個故障 |
| 15–20 | 關閉範例，完成至少一項自己的產出 |

### 1. 名詞先換成白話

| 名詞 | 白話意思 |
| --- | --- |
| CDN | 分散在多個地點，協助交付內容與轉送請求的服務 |
| Edge | 接收使用者請求的邊緣節點，可保存快取副本 |
| Origin | 提供原始內容的伺服器或物件儲存 |
| Cache key | 用來查快取的識別，實際組成受 URL、變體與設定影響 |
| Cache hit | 找到可直接用來回應這次請求的快取內容 |
| Cache miss | 找不到可用內容，需向上游取得；本圖上游直接是 origin |
| TTL | 快取維持新鮮的時間預算；過期不等於立即從儲存中刪除 |

共享快取要遵守回應政策與請求條件；`no-store` 不允許儲存，`private` 不允許共享快取保存，`no-cache` 則是使用前須驗證，並非禁止儲存。參考 [MDN：HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)。

### 2. 主動產出：至少完成一項

#### [ ] 一張小圖：cache hit 與 miss

```text
假設：同一張公開圖片、相同 cache key、edge 直接連 origin

Cache hit（副本仍新鮮且允許使用）
Browser ──GET──→ CDN edge [圖片副本]
Browser ←─200─── CDN edge
                  不必向 origin 取圖

Cache miss（沒有副本）
Browser ──GET──→ CDN edge ──GET──→ Origin
Browser ←─200─── CDN edge ←─200─── Origin
                  符合快取政策才保存副本

過期副本的另一種可能：
Edge ──條件請求──→ Origin
Edge ←─304─────── Origin（內容未改，可沿用原 body）
```

304 路徑仍有回源請求，不能當成完全沒有 origin 負載。圖中不含多層 CDN 或 origin shield；加入它們後，edge miss 未必每次直接抵達 origin。請關閉範例，自畫並標出回應方向。

#### [ ] 三個數字：回源負載

練習假設：圖片請求全部到達此 CDN、沒有其他快取層、每個 miss 對應一次回源，暫不計重新驗證與重試。

```text
到達 CDN：10,000 requests/s
命中率：90%
回源流量：10,000 × (1 − 0.90) = 1,000 requests/s
```

自己把命中率改成 50% 重算，並解釋 origin 為何承受原來五倍負載。這是容量假設，不是真實量測；request hit ratio 也不等於 byte hit ratio，圖片大小不同會影響流量成本。

#### [ ] 一個 Failure Case：大量快取同時失效

| 面向 | 今天的情境 |
| --- | --- |
| 觸發 | 熱門圖片同時失效或被大量 purge，miss 突增 |
| 使用者影響 | 回源排隊、載入變慢，嚴重時出現錯誤 |
| 偵測 | 命中率下降、origin QPS／延遲／錯誤率同時升高 |
| 處理 | 同 key 的回源合併、分散到期時間、限制回源並保護 origin |
| 有條件降級 | 內容允許且有對應政策時短暫供應 stale；不能一律忽略過期規則 |
| 恢復驗收 | 快取重新建立、命中率回升、origin 負載恢復可承受範圍 |

快取不是永久保存的。每份快取都有 TTL，也可能被主動清除。最常見的情況是大量圖片被設定成同一時間過期。

例如網站在 12:00 快取了 10,000 張熱門圖片，TTL 都是 1 小時：

```text
12:00：10,000 張圖片進入 CDN
13:00：10,000 張圖片同時過期
13:00：使用者繼續請求圖片
       → CDN 找不到可用快取
       → 大量 Cache Miss
       → 大量請求同時回源
```

原本：

```text
10,000 requests/s
CDN 命中 9,000
Origin 只處理 1,000
```

大量失效後可能變成：

```text
10,000 requests/s
CDN 幾乎都未命中
Origin 接近處理 10,000
```

這就是「快取雪崩」。大量快取同時失效的常見原因包括：

- **TTL 設成相同時間：** 大量快取在同一秒或同一分鐘到期。
- **大量 Purge：** 管理員或部署程序一次清除整批 CDN 快取。
- **Cache Key 改變：** 例如部署後圖片 URL 從 `v1` 全部變成 `v2`，新 key 都還沒有快取。
- **CDN 節點重啟或故障：** 節點上的記憶體快取消失。
- **快取空間不足：** 大量內容被 CDN 提前淘汰。
- **熱門活動開始：** 新的圖片第一次被大量使用者同時請求，快取還沒建立。

`purge` 是主動要求 CDN 刪除快取。例如圖片換了，但 URL 沒改：

```text
舊圖片已存在 CDN
→ 管理員執行 purge
→ CDN 刪除舊圖片
→ 下一次請求變成 miss
→ CDN 回源取得新圖片
```

真正危險的是「大量」與「同時」：

```text
一張圖片失效 → 通常影響不大
10,000 張熱門圖片同時失效 → Origin 瞬間承受大量請求
```

常見改善方式：

- TTL 加入隨機差值，讓圖片分散過期。
- 不要在沒有必要時 purge 整個快取。
- 發布前預熱熱門圖片。
- 同一個 key 同時 miss 時，只允許一個請求回源，其餘等待結果。
- 在規則允許時，短暫回傳 stale 舊內容。

例如不要把全部 TTL 都設成剛好一小時：

```text
全部 TTL = 3600 秒
```

可以分散成：

```text
TTL = 3600 秒 ± 隨機 300 秒
```

如此快取會陸續失效，不會集中在同一時刻把 Origin 壓垮。

說清楚代價：供應舊圖片換取可用性，適不適用取決於內容。個人頁面不能直接套用公開圖片的共享快取政策。

#### [ ] 3 分鐘口述

```text
0:00–0:30  說明公開圖片情境與可共享快取的假設
0:30–1:20  畫 hit／miss，指出 edge 與 origin 責任
1:20–2:00  用請求量與命中率算回源 QPS
2:00–2:40  大量失效如何偵測與保護 origin
2:40–3:00  說明過期、重新驗證與舊內容的取捨
```

**單選｜CDN 有一份內容，是否一定不需回源？**

- [ ] A. 是，儲存過就永遠可以直接回應。
- [ ] B. 否，還要看是否新鮮、是否符合這次請求及快取政策；可能需要驗證。
- [ ] C. 否，每一次都必須重新下載完整 body。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 有副本不等於可以直接使用。條件驗證可能收到 304，省下 body 傳輸，但依然發生回源。[MDN：HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

</details>

### 3. 今日 System Design 驗收

- [ ] 能區分 CDN edge 與 origin。
- [ ] 能畫出 hit 與 miss 的請求、回應方向。
- [ ] 知道「有副本」「可直接使用」「重新驗證」不同。
- [ ] 已完成小圖／三個數字／failure case／3 分鐘口述至少一項自己的產出。
- [ ] 尚未產出，已加入週末補課（不可與上一項同時勾選）。

未完成只加入週末補課，不影響下週主線。

---

## 今日結束打卡

**Group Anagrams（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 提示後完成，還需閉卷重寫。
- [ ] 已閉卷完成、跑測資並自畫 frequency key。

**React 實戰（依實際情況單選）**

- [ ] 尚未完成。
- [ ] 看懂範例，但尚未留下可驗證證據。
- [ ] 已完成計時器、focus、mutation 與 key 修正，並留下至少一項證據。

**五句技術筆記（依實際情況單選）**

- [ ] 尚未寫滿五句。
- [ ] 已寫滿，但主要依賴抄寫範例。
- [ ] 已用自己的話寫五句，能結合今日操作解釋。

**System Design（依實際情況單選）**

- [ ] 尚未閱讀。
- [ ] 已閱讀，尚未主動產出。
- [ ] 已完成至少一項自己的產出。

**本次學習時間（依實際情況單選）**

- [ ] 少於原定時間。
- [ ] 約等於原定時間。
- [ ] 超過原定時間。
- [ ] 未計時。

明天開始前閉卷回答：frequency key 為何不會把不同計數混在一起？誰清掉 interval？反轉後草稿跟著誰？命中率下降時 origin QPS 如何變化？

[回到一個月 LeetCode 預習索引](/docs/career-blueprint/leetcode-month-01)
