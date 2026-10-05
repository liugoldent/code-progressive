---
sidebar_position: 3
sidebar_label: "Day 3"
slug: "/career-blueprint/week-04-day-03"
title: "第 4 週 Day 3：Two Sum II 閉卷重現、reducer＋Context 與快取失效"
description: "140 分鐘日課：閉卷重寫 Two Sum II 並畫 sorted invariant；把相依 boolean 改成 reducer＋Context；設計 invalidation、TTL 與 version key。"
tags: [Career, Interview, NeetCode 150, React, System Design]
keywords: ["Two Sum II", "sorted invariant", "React reducer", "Context", "cache invalidation", "TTL", "version key"]
---

# 第 4 週 Day 3：Two Sum II 閉卷重現、reducer＋Context 與快取失效

> 安排日期：2026-09-30；實際練習以當日為準  
> 今日總時數：140 分鐘  
> 本週 NC150 分類：Two Pointers  
> 本週 System Design 主題：Caching

接續[第 4 週 Day 2](/docs/career-blueprint/week-04-day-02)。今天以**閉卷重現與畫圖**為主，不追新題數。下方範例供完成第一次作答後核對；勾選狀態和實測紀錄要依自己的結果填寫，不能因為讀過參考程式就標完成。

作答方式：知識題先單選，再展開解析；進度題依實際結果勾選，沒有標準答案。Markdown 勾選清單不會自動保存網站上的作答；程式、測試輸出與畫圖請另存為可回看的證據。

## 今日完成定義

- [ ] **NeetCode 150｜45 分鐘**：閉卷重寫 Two Sum II，畫出排序條件如何讓每次指標移動安全排除一批配對，跑測資並留下第一版。
- [ ] **React 實戰｜60 分鐘**：把多個相依 boolean 重構為 reducer＋Context，至少留下可執行程式、測試、Profiler 或 Debug 證據之一。
- [ ] **收尾｜15 分鐘**：用自己的話寫 5 句技術筆記，逐項標記未完成與補做動作。
- [ ] **每日 System Design × 高併發 Combo｜20 分鐘**：設計 invalidation、TTL 與 version key；一張小圖／三個數字／一個 failure case／3 分鐘口述，至少完成其中一項自己的產出。

題單：[NeetCode 150](https://neetcode.io/practice/practice/neetcode150)。本頁的程式與數字是練習材料；自己的執行結果、截圖與口述紀錄請另存。

| 時間 | 任務 | 必須留下的證據 |
| --- | --- | --- |
| 20:30–21:15 | Two Sum II | 閉卷程式、指標圖、測試輸出與錯誤修正 |
| 21:15–22:15 | React reducer＋Context | 可執行程式、測試、Profiler 或 Debug 紀錄至少一項 |
| 22:15–22:30 | 收尾 | 自己寫的 5 句話、未完成項及補做時段 |
| 22:30–22:50 | Caching Combo | 小圖、三個數字、failure case 或口述至少一項 |

---

## Part 1｜Two Sum II：閉卷重現與 sorted invariant（45 分鐘）

題目契約與完整 TypeScript／Python 題解見 [LeetCode 167｜Two Sum II](/docs/algorithms/leetcode/f0101-0200/l0167-input-array-is-sorted)。本次先從空白寫，不開 Stage B。已排序的陣列中有唯一答案；回傳的是**從 1 開始的位置**，兩個位置不可相同。

| 分鐘 | 動作 | 證據 |
| ---: | --- | --- |
| 0–5 | 閉卷說出輸入、輸出、保證與 Big-O 目標 | 契約四句話 |
| 5–15 | 畫指標移動圖，解釋每次排除的配對 | 至少三輪，標 `left`、`right`、目前和 |
| 15–30 | 從空白寫第一版 | 程式與實際耗時，不覆蓋第一版 |
| 30–40 | 跑官方例與邊界測資，修正 | 預期／實際輸出、失敗原因 |
| 40–45 | 不看稿口述 invariant、時間與空間 | 一段自己的說明 |

### 先自己畫，再核對排除理由

以 `numbers = [2, 3, 4, 7, 11]`、`target = 9` 為例，從兩端開始。每輪在圖上寫 `numbers[left] + numbers[right]`，並把被排除的整排配對劃掉。

```txt
初始候選區間：[ left ................................ right ]
第 1 輪：left = ___，right = ___，sum = ___，排除 ___ 端的理由：___
第 2 輪：left = ___，right = ___，sum = ___，排除 ___ 端的理由：___
第 3 輪：left = ___，right = ___，sum = ___，答案位置：___
```

**每輪保持什麼（invariant）？** 若答案還沒找到，唯一答案的兩個位置仍在閉區間 `[left, right]` 內。當和太小，固定左值再換更靠左的右值，只會更小，所以可排除目前左端；和太大時，固定右值再換更靠右的左值，只會更大，所以可排除目前右端。每輪至少縮小一格，最後最多走 `n - 1` 輪。請先自己寫出這段證明，再展開核對。

**單選｜目前和小於 target，為什麼可以移動左指標？**

- [ ] A. 因為左端一定是陣列中最小的數，任何情況都不可能是答案。
- [ ] B. 因為陣列已排序，固定左端與目前右端之間任何位置配對，和都不會比目前更大。
- [ ] C. 因為右端已經測過一次，所以必須移動另一端。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** 這是排除目前左端所有剩餘配對的依據。若沒有排序，移動規則就不能這樣證明。

</details>

<details>
<summary>畫完圖、寫完第一版後核對</summary>

```txt
值：       2   3   4   7  11      target = 9
索引：     0   1   2   3   4
第 1 輪：  L               R      2 + 11 = 13 > 9；排除右端 11
第 2 輪：  L           R          2 + 7 = 9；回傳 [1, 4]
```

此例兩輪就找到答案；若自己的圖寫了第三輪，檢查是否在命中後忘了立即回傳。假設和為 `s < target`，任何 `j <= right` 都有 `numbers[left] + numbers[j] <= s`，所以 `left` 不可能參與答案；`s > target` 的證明對稱。排序是這個排除理由的前提，不能套用到未排序陣列。

```ts
function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  throw new Error('No solution under the expected contract');
}
```

時間 `O(n)`：每輪移動一個指標，兩指標總共至多移動 `n - 1` 次。額外空間 `O(1)`：只保存兩個索引與和；回傳的兩個位置大小固定。題目保證有解，最後的 `throw` 是練習時保護契約的分支。

</details>

| 測資 | 預期位置 | 要抓的錯誤 |
| --- | --- | --- |
| `[2, 7, 11, 15]`, `9` | `[1, 2]` | 一基索引 |
| `[2, 3, 4]`, `6` | `[1, 3]` | 排除右端 |
| `[-1, 0]`, `-1` | `[1, 2]` | 最短長度與負數 |
| `[0, 0, 3, 4]`, `0` | `[1, 2]` | 相同值、不同位置 |
| `[2, 3, 4, 7, 11]`, `9` | `[1, 4]` | 手畫圖與程式一致 |

紀錄：第一版位置／連結 `＿＿＿`；實際跑過的測資 `＿＿＿`；錯誤或卡點 `＿＿＿`；提示層級 `＿＿＿`。

---

## Part 2｜React 實戰：多個 boolean → reducer＋Context（60 分鐘）

情境：儲存自選股清單名稱。原先同時保存 `isEditing`、`isSaving`、`hasError`、`isSuccess`，容易出現「正在儲存但也顯示成功」等矛盾組合。把互斥階段收成單一 `status`，保留使用者輸入 `name` 和錯誤訊息 `error`；`canSubmit` 在 render 時推導，不另存一份。只有多個元件都要讀取或派送此狀態時，再用 Context 傳遞。React 官方示範了將 reducer 的 state 與 dispatch 放入兩個 Context 的做法：[Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)。

| 分鐘 | 動作 | 留下什麼 |
| ---: | --- | --- |
| 0–10 | 寫原 boolean 組合與不合法狀態 | 例：`isSaving && isSuccess` |
| 10–20 | 設計 state、action 與 transition 表 | `idle → saving → success/error` |
| 20–42 | 閉卷寫 reducer、Provider、兩個 consumer | 可以貼入 React 專案執行的程式 |
| 42–52 | 驗證空白、成功、失敗與重複提交 | 實際操作或測試輸出 |
| 52–60 | 用 Profiler 或 Debug 觀察一次更新，寫取捨 | 截圖、紀錄或文字；與程式證據擇一即可 |

| 目前狀態 | 事件 | 下一狀態／守衛 |
| --- | --- | --- |
| 任意非 `saving` | `nameChanged` | 更新名稱、清除舊錯誤，回 `idle` |
| `idle` 或 `error` | `saveRequested` | 名稱空白則留在 `error`；非空白進 `saving` |
| `saving` | 再次 `saveRequested` | 不轉移；handler 也要避免第二次 API 呼叫 |
| `saving` | `saveSucceeded` | 進 `success`，保留名稱 |
| `saving` | `saveFailed` | 進 `error`，保留名稱供重試 |

**單選｜哪個狀態設計能避免「儲存中且成功」同時為真？**

- [ ] A. 保留 `isSaving` 和 `isSuccess`，每個 handler 記得一起更新。
- [ ] B. 用單一 `status` 表示互斥階段，從 state 推導按鈕是否可提交。
- [ ] C. 用 Context 保存全部 boolean，矛盾組合就會自動消失。

<details>
<summary>選完再看答案與解析</summary>

**答案：B。** Reducer 集中管理合法轉移；Context 只負責向子元件提供資料，不會替狀態建立約束。

</details>

先自行完成，再展開可執行參考。這段示範用延遲模擬儲存，方便觀察 `saving`；正式專案把 `saveName` 換成 API 呼叫即可。Reducer 只計算下一狀態，不發請求。

<details>
<summary>自己實作與記錄後看 React 參考程式</summary>

將以下內容放進 React 專案的 `App.jsx` 即可執行；程式以 React 18 的 `.Provider` 寫法相容本專案。輸入 `fail` 可模擬失敗。

```jsx
import { createContext, useContext, useReducer, useRef } from 'react';

const StateContext = createContext(null);
const DispatchContext = createContext(null);
const initialState = { name: '', status: 'idle', error: '' };

function reducer(state, action) {
  switch (action.type) {
    case 'nameChanged':
      if (state.status === 'saving') return state;
      return { name: action.name, status: 'idle', error: '' };
    case 'saveRequested':
      if (state.status === 'saving') return state;
      if (!state.name.trim()) {
        return { ...state, status: 'error', error: '請輸入名稱' };
      }
      return { ...state, status: 'saving', error: '' };
    case 'saveSucceeded':
      return state.status === 'saving'
        ? { ...state, status: 'success' }
        : state;
    case 'saveFailed':
      return state.status === 'saving'
        ? { ...state, status: 'error', error: action.message }
        : state;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function FormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useFormState() {
  const state = useContext(StateContext);
  if (state === null) throw new Error('FormProvider is missing');
  return state;
}

function useFormDispatch() {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) throw new Error('FormProvider is missing');
  return dispatch;
}

async function saveName(name) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (name.trim().toLowerCase() === 'fail') throw new Error('模擬儲存失敗');
}

function NameEditor() {
  const state = useFormState();
  const dispatch = useFormDispatch();
  const inFlight = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    dispatch({ type: 'saveRequested' });
    if (!state.name.trim()) return;

    inFlight.current = true;
    try {
      await saveName(state.name);
      dispatch({ type: 'saveSucceeded' });
    } catch (error) {
      dispatch({ type: 'saveFailed', message: error.message });
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="list-name">清單名稱</label>
      <input
        id="list-name"
        value={state.name}
        disabled={state.status === 'saving'}
        onChange={(event) => dispatch({ type: 'nameChanged', name: event.target.value })}
      />
      <button disabled={state.status === 'saving'}>儲存</button>
    </form>
  );
}

function SaveStatus() {
  const { status, error } = useFormState();
  return <p role="status">{status === 'error' ? error : status}</p>;
}

export default function App() {
  return (
    <FormProvider>
      <NameEditor />
      <SaveStatus />
    </FormProvider>
  );
}
```

`inFlight` 是事件處理器的同步防重入鎖；按鈕停用和 reducer 守衛分別保護畫面及狀態。真實 API 若允許多筆並發，還要辨識回應屬於哪次請求。分離 state 與 dispatch Context 後，只讀 dispatch 的元件不必因 state 值變動而消費 state；但讀取同一個 state Context 的元件仍會隨該值改變而 render，不能把 Context 當作效能最佳化保證。

</details>

**驗證四條路徑：** 空白名稱顯示錯誤、不呼叫儲存；有效名稱經 `saving` 到 `success`；輸入 `fail` 經 `saving` 到 `error` 並保留名稱；連按提交只發一次請求。可以在 `saveName` 暫加 `console.count('saveName')` 作 Debug 證據，或用 React [Profiler](https://react.dev/reference/react/Profiler) 記錄提交前後的 commit。要記下**實際**觀察，不能把上列預期當成測試結果。

證據類型（擇一）`＿＿＿`；檔案／截圖／指令位置 `＿＿＿`；實際結果 `＿＿＿`；未通過路徑 `＿＿＿`。

---

## Part 3｜收尾：自己的五句技術筆記（15 分鐘）

先蓋住上文，用自己的話各寫一句；不要複製參考定義。每句都要有一個可檢查的因果關係或限制。

1. 排序如何讓 Two Sum II 的一次比較排除一整批配對？`＿＿＿＿＿＿`
2. 你的圖在哪一輪最容易移錯指標，為什麼？`＿＿＿＿＿＿`
3. 哪些 boolean 被一個 `status` 取代，少了哪種矛盾狀態？`＿＿＿＿＿＿`
4. Reducer、Context、事件處理器各負責什麼？`＿＿＿＿＿＿`
5. 快取的刪除、TTL、版本 key 各擋住哪一類舊資料風險？`＿＿＿＿＿＿`

| 未完成項 | 卡點 | 下次補做時段 | 完成證據 |
| --- | --- | --- | --- |
| `＿＿＿` | `＿＿＿` | `＿＿＿` | `＿＿＿` |

若全數完成，在第一格寫「無」，不要勾選不存在的證據。

---

## Part 4｜每日 System Design × 高併發 Combo：invalidation、TTL、version key（20 分鐘）

### 今日微題

熱門商品介紹由 DB 保存權威版本，Redis 用 cache-aside 加速讀取。請設計「資料更新後如何讓使用者讀到新版」，同時處理刪除失敗與舊讀取回填的競爭。先畫自己的流程，再對照 [Redis cache-aside 官方說明](https://redis.io/docs/latest/develop/use-cases/cache-aside/)及[專案快取筆記](/docs/system-design/redis-cache-react-python)。

| 分鐘 | 動作 | 產出 |
| ---: | --- | --- |
| 0–5 | 畫正常 read／write 與 `DEL` | 誰讀 DB、誰設 TTL、誰刪 key |
| 5–10 | 指定 TTL 和可接受的舊資料時間 | 明確數值與代價 |
| 10–15 | 加 version key，找出版本從哪裡取得 | 寫入與版本更新的順序 |
| 15–20 | 交付四選一並口述一個 failure case | 小圖／三個數字／failure case／3 分鐘口述 |

**設計要點：** DB 寫入成功後刪除固定 key，例如 `product:42`；下次 miss 查 DB 並以 TTL 回填。TTL 是刪除失敗時舊值的有限存活期，也會增加過期後回源流量，不能單獨保證更新後立即可見。若使用 `product:42:v7`，讀取端必須先取得**目前版本 `v7`**（例如 DB 中與商品寫入同一交易更新的版本，或可靠的版本元資料），才能組成正確 key；只把版本字串塞進 key、卻沒有可靠的目前版本來源，仍可能一直讀舊版。

**單選｜DB 已寫入 `v7`，但 Redis 刪除舊 key 失敗，哪個判斷正確？**

- [ ] A. 設了 TTL 就保證所有新請求立即看到 `v7`。
- [ ] B. 版本 key 一定有效，讀取端不必知道目前版本。
- [ ] C. 固定 key 可能短暫提供舊值；版本 key 的讀取端仍須可靠地取得 `v7`。

<details>
<summary>選完再看答案與解析</summary>

**答案：C。** TTL 限制舊值在該快取層的存活時間；版本 key 的正確性取決於目前版本的來源與更新順序。

</details>

<details>
<summary>自己畫完後核對參考小圖與 race</summary>

```txt
寫入：API → DB 更新商品與版本 v7（同一交易）→ DEL product:42:v6 → 回應
讀取：API → 取得目前版本 v7 → GET product:42:v7
                                  ├─ hit  → 回傳
                                  └─ miss → DB 讀 v7 → SET v7 key + TTL → 回傳
```

舊讀取可能先查到 DB 的 `v6`，接著寫入提交 `v7`，最後舊讀取才把 `v6` 回填。若讀取端每次都取可靠的目前版本，後續請求只會查 `v7` key，不會再用舊 `v6`；舊 key 等 TTL 到期清掉。這要求「目前版本」的來源足夠新；若它本身也被舊快取卡住，版本化就失效。已經開始的舊讀取仍可能回傳舊值；若要求寫入後每個讀取立即最新，還需更強的一致性設計或直接讀權威 DB。

</details>

**三個數字（自行演算，非實測）：** 假設 `2,000 reads/s`、命中率 `95%`、TTL `60 秒`，且每個 miss 查一次 DB。寫出平常每秒 DB 讀取量、全部 miss 時的短時 DB 讀取需求，以及只靠 TTL 時刪除失敗後舊值在這一層最多還可能留多久。核對值：`100 reads/s`、接近 `2,000 reads/s`、最多接近 `60 秒`（從剛設 TTL 算起）；其他快取層或正在進行的請求不在這個上界內。

**一個 failure case：** DB 已提交 `v7`，Redis `DEL` 失敗。固定 key 可能繼續提供 `v6` 直到 TTL 到期；記錄刪除失敗並重試，監控舊值持續時間、miss 率、DB QPS。若改用版本 key，要驗證讀取端已拿到 `v7`；舊 `v6` key 可以等待 TTL 清理。

**3 分鐘口述順序：** 權威資料與讀取路徑 → 寫入後失效 → TTL 數字與代價 → 版本來源 → 一個失敗或競爭情境。

- [ ] 自己畫一張含 DB、Redis、TTL 與 version key 的小圖。
- [ ] 自己算三個數字並標單位與假設。
- [ ] 自己寫一個 failure case，包含使用者現象、觀測和補救。
- [ ] 完成 3 分鐘口述並記下一個答不出的追問。

---

## 今日完成檢查

每列只選一種真實狀態；參考程式與示範答案不等於自己的實測。

| 項目 | 尚未完成 | 提示／參考後完成 | 獨立完成且有證據 |
| --- | :---: | :---: | :---: |
| Two Sum II 閉卷程式、sorted invariant 圖與測試 | [ ] | [ ] | [ ] |
| reducer＋Context 程式與至少一項可驗證證據 | [ ] | [ ] | [ ] |
| 自己寫的五句技術筆記與未完成項 | [ ] | [ ] | [ ] |
| 快取失效設計與至少一項主動產出 | [ ] | [ ] | [ ] |

### 未完成才加入的週末補課清單

- [ ] Two Sum II 尚未閉卷重現、畫圖或跑測資：週末保留 25 分鐘，先重畫指標軌跡，再從空白重寫並補測試輸出。
- [ ] React 尚無可驗證證據：週末保留 30 分鐘，執行空白、成功、失敗、連按四條路徑，留下程式、測試、Profiler 或 Debug 紀錄之一。
- [ ] 五句技術筆記或未完成標記尚未寫完：週末保留 10 分鐘，用自己的話補齊並寫下下一個最小動作。
- [ ] Caching Combo 尚無主動產出：週末保留 20 分鐘，補一張小圖、三個數字、一個 failure case 或 3 分鐘口述；**不影響下週主線**。
- [ ] 今日全部完成，無需補課。此項不可與上面任一補課項同時勾選。

明天開始前閉卷回答：和太小為何只能移左端？Context 解決哪一段資料傳遞？DB 已更新但 `DEL` 失敗時，TTL 與版本 key 分別能保證什麼？
