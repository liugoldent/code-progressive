---
sidebar_position: 1
sidebar_label: "Day 1"
slug: "/career-blueprint/week-04-day-01"
title: "第 4 週 Day 1：Two Sum II、React reducer transition 與四層快取"
description: "140 分鐘日課：Two Sum II 讀題與限制、暴力解與雙指標推導、閉卷實作與測試；以事件和狀態列出 React reducer transition；比較 browser、CDN、service 與 Redis cache。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Two Sum II", "Two Pointers", "React reducer", "state transition", "browser cache", "CDN cache", "service cache", "Redis cache", "Caching"]
---

# 第 4 週 Day 1：Two Sum II、React reducer transition 與四層快取

> 安排日期：2026-09-28；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 練習重點：演算法、前端工程與系統設計的共通能力  
> 本週 NC150 分類：Two Pointers  
> 本週 System Design 主題：Caching

接續 [第 3 週 Day 5](/docs/career-blueprint/week-03-day-05)。上週 Valid Palindrome 的兩端指標靠「跳過非英數字元」前進；今天 Two Sum II 要用**已排序**與目前和的大小，重新證明哪一端可以被排除。先留下自己的推導與第一版程式，再看題解。

作答方式：知識題先單選，再展開解析；進度題按實際證據勾選，沒有標準答案。以下 Markdown 清單不會在網站自動保存作答；請自行保存程式、測試輸出、transition 表與快取產出。「尚未完成／無需補課」不可和互相矛盾的完成項同時勾選。

## 今日完成定義

- [ ] **NeetCode 150｜60 分鐘**：Two Sum II 先讀題與 constraints，說出 brute force／Pattern，再閉卷實作、測 Edge Cases、寫 Big-O。
- [ ] **React 主線｜50 分鐘**：用事件與狀態列出 reducer transition，閉卷寫出 reducer 並驗證關鍵轉移。
- [ ] **收尾｜10 分鐘**：記錄卡點與明確的週末補課項目。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：比較 browser／CDN／service／Redis cache；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。未完成項排入週末補課，不占用下一個工作日主線。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:30 | Two Sum II | 題意、暴力解、指標排除理由、閉卷程式、測資與 Big-O |
| 21:30–22:20 | React reducer | 事件清單、狀態欄位、transition 表、reducer 與轉移驗證 |
| 22:20–22:30 | 收尾 | 具體卡點、週末時段與驗收方式 |
| 22:30–22:50 | Caching Combo | 四層比較與至少一項主動產出 |

---

## Part 1｜NeetCode 150：Two Sum II（60 分鐘）

完整三階段題解與 TypeScript／Python 練習放在 [LeetCode 167｜Two Sum II](/docs/algorithms/leetcode/f0101-0200/l0167-input-array-is-sorted)。先讀該頁 Stage A 的題目與測資；寫出自己的第一版後，才核對 Stage B。曾看過解答也要從空白閉卷重寫。

### 今日 60 分鐘執行節奏

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–8 | 讀題與 constraints | Input／Output、排序、唯一答案、索引與空間限制 |
| 8–16 | 手算範例與自訂測資 | 先寫預期值，不執行程式 |
| 16–24 | 說出 brute force | 正確性理由、比較次數與空間成本 |
| 24–31 | 推導 Two Pointers | 指標移動規則，以及每一步為何不漏解 |
| 31–45 | 閉卷實作 | 第一版 TypeScript 或 Python；另一語言有餘裕再做 |
| 45–54 | 測 Edge Cases | 官方 3 組與自訂至少 4 組，記錄失敗案例 |
| 54–60 | 寫 Big-O 並口述 | 最壞時間、額外空間、invariant、修改紀錄 |

### 1. 先確認題目契約

已排序的 `numbers` 中有唯一一組不同位置的兩個數，其和為 `target`。回傳**從 1 開始**且遞增的兩個位置；官方要求額外空間為常數。`2 <= numbers.length <= 3 * 10^4`；元素與 target 介於 `-1000` 與 `1000`。若處理未排序資料、沒有答案或多組答案，那是另一個契約，不要把自訂情況誤當官方測資。

**單選｜`numbers = [2, 3, 4]`、`target = 6` 要回傳什麼？**

- [ ] A. `[0, 2]`，因為程式陣列從 0 起算。
- [ ] B. `[1, 3]`，因為題目要從 1 起算的位置。
- [ ] C. `[2, 4]`，因為要回傳兩個數值。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 第一與第三個數為 `2 + 4 = 6`；回傳的是位置，不是數值。

</details>

### 2. Brute force → Pattern：自己說出排除理由

先口述最直接的做法：列舉每一組 `i < j` 並比對和。它正確，但最壞需檢查約 `n(n-1)/2` 組，時間 `O(n²)`、額外空間 `O(1)`。在最大 `n = 30,000` 時，約 4.5 億組比較；這是由規模推算的上界量級，不是實測耗時。

接著從兩端 `left = 0`、`right = n - 1` 開始。先在紙上回答：

1. 若 `numbers[left] + numbers[right] < target`，固定 `left` 再把 `right` 左移，和會變大嗎？哪一端才可排除？
2. 若和大於 target，固定 `right` 再把 `left` 右移，和會變小嗎？
3. 指標相遇前，尚可能的答案位於哪個範圍？

<details>
<summary>寫完三句推導後，再核對 Pattern</summary>

因為陣列非遞減，和太小時，固定 `left` 搭配目前 `right` 已經是它能得到的最大和；更靠左的 `right` 只會更小，所以排除 `left`，將它右移。和太大時，固定 `right` 搭配目前 `left` 已是它能得到的最小和；更靠右的 `left` 只會更大，所以排除 `right`，將它左移。尚未排除的候選保留在 `[left, right]`。每輪至少排除一個位置，因此最多線性輪數，且只需兩個指標。重複數值不破壞這個論證。

</details>

### 3. 閉卷實作與 Edge Cases

選一種語言從空白完成；不要把下方模板當答案。保留第一版，修正時另外記原因。

```ts
function twoSum(numbers: number[], target: number): number[] {
  // TODO：先寫兩端指標、移動規則與 1-indexed 回傳。
  throw new Error('尚未完成');
}
```

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    # TODO：閉卷實作；另一語言未完成時列入補課。
    raise NotImplementedError
```

| 測資 | 預期 | 驗證點 |
| --- | --- | --- |
| `[2, 7, 11, 15]`, `9` | `[1, 2]` | 官方例；答案靠左 |
| `[2, 3, 4]`, `6` | `[1, 3]` | 官方例；1-indexed |
| `[-1, 0]`, `-1` | `[1, 2]` | 官方例；最短長度 |
| `[-3, -1, 0, 2, 4]`, `1` | `[1, 5]` | 負數與正數 |
| `[1, 1, 3, 5]`, `2` | `[1, 2]` | 重複值、不同位置 |
| `[0, 0]`, `0` | `[1, 2]` | 零與最短長度 |
| `[-1000, 0, 1000]`, `0` | `[1, 3]` | 值域邊界 |

**Big-O 驗收：**寫下 brute force `O(n²)`／`O(1)` 與雙指標 `O(n)`／`O(1)`，並用一個測資逐輪指出被排除的位置。若先複製或排序陣列，空間與原始位置契約就要重新檢查。

- [ ] 已先寫題意、constraints、暴力解與排除理由，才看 Stage B。
- [ ] 已保存閉卷第一版與至少 7 組測試結果。
- [ ] 能說明重複值可選不同位置，以及為何答案要加 1。
- [ ] 能不看稿說出 invariant、Big-O 與一個曾修正的錯誤。

---

## Part 2｜React 主線：用事件與狀態列出 reducer transition（50 分鐘）

今天用「儲存自選股清單名稱」的小表單練習。`reducer(state, action)` 根據**目前狀態與事件**計算下一狀態；事件 handler 負責派送 action，非同步儲存仍在 handler 或與外部系統同步的程式中執行。React 的 [reducer 指南](https://react.dev/learn/extracting-state-logic-into-a-reducer)將它用來集中較複雜的狀態更新邏輯。

### 50 分鐘節奏

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–8 | 列出畫面狀態與使用者事件 | `name`、`status`、`error` 與 action 名稱 |
| 8–20 | 寫 transition 表 | 每列包含目前狀態、事件、守衛條件、下一狀態 |
| 20–35 | 閉卷寫 reducer | 純函式；不在 reducer 裡呼叫 API 或修改舊 state |
| 35–45 | 驗證四條轉移 | 空白提交、成功、失敗、失敗後重試 |
| 45–50 | 口述與核對 | 為何沒有額外存 `canSubmit`，何時值得用 reducer |

### 1. 先列事件，再決定 state

情境：使用者輸入清單名稱，按「儲存」後看到提交中、成功或錯誤。先列最小狀態：

```ts
type Status = 'editing' | 'saving' | 'saved' | 'error';
type State = { name: string; status: Status; error: string | null };
```

事件可以是 `nameChanged`、`saveRequested`、`saveSucceeded`、`saveFailed`。`canSubmit` 可從 `name.trim().length > 0 && status !== 'saving'` 計算，不必另存一份 state，避免失同步。

**練習：先遮住下一張表，自己填完四個事件的 transition。** 特別標出「空白名稱」與「正在儲存時再按一次」如何處理。

<details>
<summary>完成自己的 transition 表後再看參考</summary>

| 目前狀態 | 事件 | 守衛條件 | 下一狀態／效果 |
| --- | --- | --- | --- |
| `editing`／`error`／`saved` | `nameChanged(value)` | 未在送出中 | 更新 `name`，回到 `editing`，清除舊錯誤 |
| `saving` | `nameChanged(value)` | 送出期間停用輸入 | 保持原狀；等請求結束再編輯 |
| `editing`／`error`／`saved` | `saveRequested` | `name.trim()` 非空 | 進入 `saving`，清除舊錯誤；handler 發出請求 |
| `editing`／`error`／`saved` | `saveRequested` | 名稱為空 | 保持欄位，進入 `error` 並顯示驗證訊息；不發請求 |
| `saving` | `saveRequested` | 正在送出 | 保持原狀；避免同一請求重複送出 |
| `saving` | `saveSucceeded` | 對應目前請求 | 進入 `saved`，清除錯誤 |
| `saving` | `saveFailed(message)` | 對應目前請求 | 進入 `error`，保留名稱供重試 |

這張表是本次練習的**產品規則**，不是 React 內建行為。畫面在 `saving` 時也要停用輸入。若改成允許送出時繼續編輯，需要增加請求識別或版本檢查，避免舊回應覆蓋新輸入。

</details>

### 2. 閉卷實作：把狀態轉移集中

先不展開參考表，自己補 `switch`。每個分支回傳新 state；不直接修改 `state.name`，也不在 reducer 中呼叫 `fetch`。

```ts
type Action =
  | { type: 'nameChanged'; value: string }
  | { type: 'saveRequested' }
  | { type: 'saveSucceeded' }
  | { type: 'saveFailed'; message: string };

function reducer(state: State, action: Action): State {
  // TODO：依自己的 transition 表寫出每一條轉移。
  throw new Error('尚未完成');
}
```

對照 [React `useReducer` 文件](https://react.dev/reference/react/useReducer)：reducer 應是純函式，接收目前 state 與 action 並回傳下一個 state；`dispatch` 會安排下一輪更新，當前 handler 讀到的 state 仍是本輪快照。

**單選｜按下「儲存」後，哪個分工符合上面的設計？**

- [ ] A. Reducer 直接呼叫 API，完成後直接改 `state.status`。
- [ ] B. Handler 判斷可提交後派送 `saveRequested`、呼叫 API，再依結果派送 `saveSucceeded`／`saveFailed`。
- [ ] C. 把 `canSubmit` 存成另一個 state，每次輸入時手動同步。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 非同步呼叫放在 reducer 外；reducer 只決定下一個 state。提交中也要防止重複請求；若有多筆並發，還需識別回應屬於哪次提交。

</details>

### 3. 用轉移測試驗證，而不是只看畫面

逐項記錄「起始 state → action → 預期 state → 實際結果」：

- [ ] 空白名稱送出：顯示驗證錯誤，沒有發 API 請求。
- [ ] 有名稱送出：進入 `saving`；成功後進入 `saved`。
- [ ] 請求失敗：進入 `error`，保留名稱與錯誤訊息。
- [ ] 修改名稱後重試：清掉舊錯誤，再次進入 `saving`。
- [ ] `saving` 時重複按送出：沒有第二筆請求。

### 4. 完整範例：儲存自選股清單名稱

先完成上面的閉卷練習，再展開對照。以下是一個可放進 React + TypeScript 專案的元件；`saveListName` 用延遲模擬 API，輸入「失敗」就會模擬請求失敗，改成其他名稱再送出即可觀察重試。它不會真的儲存到伺服器。

<details>
<summary>展開完整 TSX 範例</summary>

```tsx
import { useReducer, useRef, type FormEvent } from 'react';

type Status = 'editing' | 'saving' | 'saved' | 'error';
type State = { name: string; status: Status; error: string | null };
type Action =
  | { type: 'nameChanged'; value: string }
  | { type: 'saveRequested' }
  | { type: 'saveSucceeded' }
  | { type: 'saveFailed'; message: string };

const initialState: State = { name: '', status: 'editing', error: null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'nameChanged':
      if (state.status === 'saving') return state;
      return { name: action.value, status: 'editing', error: null };

    case 'saveRequested':
      if (state.status === 'saving') return state;
      if (!state.name.trim()) {
        return { ...state, status: 'error', error: '請輸入清單名稱' };
      }
      return { ...state, status: 'saving', error: null };

    case 'saveSucceeded':
      if (state.status !== 'saving') return state;
      return { ...state, status: 'saved', error: null };

    case 'saveFailed':
      if (state.status !== 'saving') return state;
      return { ...state, status: 'error', error: action.message };
  }
}

async function saveListName(name: string): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  if (name === '失敗') throw new Error('模擬儲存失敗，請修改名稱後重試');
}

export default function WatchlistNameForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // ref 會同步更新，擋住 React 下一次 render 前連續觸發的提交。
  const submittingRef = useRef(false);
  const isSaving = state.status === 'saving';
  const canSubmit = state.name.trim().length > 0 && !isSaving;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || submittingRef.current) return;

    dispatch({ type: 'saveRequested' });
    if (!canSubmit) return; // 空白名稱由 reducer 設定驗證錯誤；不發請求。

    submittingRef.current = true;
    try {
      await saveListName(state.name.trim());
      dispatch({ type: 'saveSucceeded' });
    } catch (error) {
      dispatch({
        type: 'saveFailed',
        message: error instanceof Error ? error.message : '儲存失敗，請稍後再試',
      });
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="watchlist-name">自選股清單名稱</label>
      <input
        id="watchlist-name"
        value={state.name}
        disabled={isSaving}
        onChange={(event) =>
          dispatch({ type: 'nameChanged', value: event.target.value })
        }
      />
      <button type="submit" disabled={isSaving}>
        {isSaving ? '儲存中…' : '儲存'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.status === 'saved' && <p role="status">儲存成功</p>}
    </form>
  );
}
```

這裡沒有用 `canSubmit` 停用空白名稱的按鈕，因為本練習要讓空白提交走到 `saveRequested`，由 reducer 顯示驗證錯誤。`saving` 時則停用輸入和按鈕，handler 用 `submittingRef` 防止同一輪 render 內的連續提交；reducer 再以 `status` 守衛狀態轉移。真正接 API 時，只需替換 `saveListName`，請求仍留在 handler。

</details>

口述題：事件是「發生了什麼」；transition 是「目前狀態遇到該事件後如何變」。如果只有一個獨立布林值，`useState` 往往已足夠；當多個事件改動同一組相依狀態，reducer 與 transition 表讓規則集中而可核對。

---

## Part 3｜收尾：卡點與週末補課（10 分鐘）

前 4 分鐘只記真正卡住的位置；後 6 分鐘把每一項改成「日期與時長＋動作＋可驗收結果」。看過參考答案或完成閱讀，不等於閉卷實作與測試。

| 卡點 | 今天的證據 | 週末可執行動作 |
| --- | --- | --- |
| Two Sum II 排除理由說不清 | 哪組數字、哪一步移錯指標 | 週六 25 分鐘：手畫 3 組指標軌跡，再閉卷口述每次排除的理由 |
| 程式或測資未完成 | 第一版、失敗輸入與輸出 | 週六 30 分鐘：閉卷重寫，跑上表 7 組並寫 Big-O |
| Reducer transition 漏了狀態 | 缺哪個事件／守衛 | 週日 25 分鐘：重畫 transition 表並驗證 5 條轉移 |
| 四層快取無法比較 | 分不清哪層保存、誰能讀 | 週日 20 分鐘：補畫請求路徑與失效方式，口述一次 failure case |

**本週末補課安排（只勾確實未完成的項目）：**

- [ ] 週六 25 分鐘：補 Two Sum II 排除理由，留下 3 組逐輪軌跡。
- [ ] 週六 30 分鐘：閉卷重寫 Two Sum II，跑 7 組測資並寫 Big-O。
- [ ] 週日 25 分鐘：重畫 reducer transition 表，驗證 5 條轉移。
- [ ] 週日 20 分鐘：補四層快取比較與至少一項主動產出。
- [ ] 今天都有對應證據，無需補課。

---

## Part 4｜每日 System Design × 高併發 Combo（20 分鐘）

### 今日微題：比較 browser／CDN／service／Redis cache

沿用自選股 Watchlist。先問要快取的是**公開且多數使用者相同**的股價摘要，還是**每位使用者不同**的自選清單；兩者的共享範圍與資料更新要求不同。

| 層 | 典型位置與誰能讀 | 適合的資料 | 更新與主要風險 |
| --- | --- | --- | --- |
| Browser HTTP cache | 使用者裝置；通常只供該使用者重用 | 靜態資源、允許短暫重用的個人回應 | 由 HTTP 標頭控制新鮮度／驗證；舊回應可能仍被重用 |
| CDN cache | 靠近使用者的共享邊緣節點；可供多位使用者 | 版本化 JS／CSS、公開且可共用的回應 | TTL、重新驗證或 purge；個人資料錯誤共享會洩漏 |
| Service in-process cache | 單一服務實例記憶體 | 小型熱門設定或可重建的資料 | 每台各有副本；部署與擴容後會冷啟動，跨台失效困難 |
| Redis cache | 服務共用的外部快取 | 高重複讀取、容許明確失效策略的資料 | 需設 key、TTL、寫入失效與 miss 保護；故障時要定義 fallback |

Browser 與 CDN 屬 HTTP 快取路徑；個人化回應若允許瀏覽器保存，須用 `private` 防止共享快取保存，`no-cache` 代表重用前驗證，`no-store` 才是不得儲存。這些語意可核對 [MDN HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching) 與 [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control)。Service in-process 與 Redis 是應用自行管理的資料快取；Redis cache-aside 常在 miss 時查主資料庫、回填並設 TTL，寫入後刪除對應 key，見 [Redis 官方 cache-aside 文件](https://redis.io/docs/latest/develop/use-cases/cache-aside/)。

### 20 分鐘節奏與主動產出

| 分鐘 | 任務 | 產出 |
| ---: | --- | --- |
| 0–5 | 畫一次讀取路徑 | 標出 browser、CDN、service、Redis、DB |
| 5–10 | 比較共享範圍與失效 | 哪些回應可共享；個人資料如何隔離 |
| 10–15 | 自算三個數字 | 原始 QPS、命中後回源 QPS、失效尖峰 |
| 15–20 | 選一種方式交付 | 小圖／三數字／failure case／3 分鐘口述，至少一項 |

**一張小圖（請先自己畫）：**

```txt
Browser ──→ CDN ──→ Service ──→ Redis ──→ DB
  私有/本機    公開共享      單台記憶體     多台共用    權威資料
```

圖中的箭頭代表 miss 或需要回源時繼續往下走。實際 API 可以繞過 CDN 快取，或根本不使用某一層；先畫清楚**哪個資料**經過哪層，再決定是否快取。

**三個數字（練習假設，非實測）：**公開股價摘要有 `2,000 requests/s`，CDN 命中率 `80%`；剩下的請求到 Service，其中 Redis 命中率 `75%`。請先自己算：

<details>
<summary>算完再看參考數字</summary>

1. 到 Service：`2,000 × (1 - 0.80) = 400 requests/s`。
2. 到 DB：`400 × (1 - 0.75) = 100 requests/s`，假設 Redis miss 都查一次 DB。
3. 若 CDN 與 Redis 同時失效、且沒有其他保護，DB 可能瞬間面對接近 `2,000 requests/s`，約為原估算的 20 倍。這是簡化的瞬間負載估算，不是保證會成功處理的量。

</details>

**一個 failure case：**某個熱門 key 同時到期，許多服務實例一起 miss 並查 DB，造成 cache stampede。說出使用者現象（延遲、逾時）、應觀測的數據（命中率、DB QPS、p95、錯誤率）以及一項保護策略（例如請求合併、錯峰 TTL、短暫降級）。若是個人自選清單，還要確認 key 含正確的使用者身分，且 CDN 沒把私人回應當公開資料共享。

**3 分鐘口述順序：**資料類型與新鮮度要求 → 四層各由誰保存與共享 → 三個數字 → 一個失效情境及恢復方式。至少自己完成下列一項：

- [ ] 畫一張標出資料、共享範圍與 miss 路徑的小圖。
- [ ] 重算三個數字並標註命中率假設與單位。
- [ ] 寫一個 failure case，包含使用者現象、觀測數據與保護動作。
- [ ] 完成 3 分鐘口述，記錄一個答不清的追問。

---

## 今日完成檢查

每列依實際結果選一個狀態；「理解參考解」不等於閉卷完成。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| Two Sum II 推導、程式、測試與 Big-O | [ ] | [ ] | [ ] |
| React 事件、transition 表與 reducer 驗證 | [ ] | [ ] | [ ] |
| 卡點紀錄與週末補課安排 | [ ] | [ ] | [ ] |
| 四層快取比較與至少一項主動產出 | [ ] | [ ] | [ ] |

明天開始前閉卷回答：Two Sum II 的和太小時，為何能排除左端？哪個事件讓表單從 `saving` 進入 `error`？個人自選清單能否被 CDN 共享？熱門 Redis key 同時到期時，DB 會看到什麼變化？
