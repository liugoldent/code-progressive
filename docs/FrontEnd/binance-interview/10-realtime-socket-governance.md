---
title: "Realtime Socket Governance"
description: "Binance 交易頁在多分頁、高併發與即時行情下的 Socket governance、leader/follower、BroadcastChannel 與 refetch storm 設計。"
tags:
  - Binance
  - WebSocket
  - System Design
  - Realtime
keywords: ["Binance WebSocket", "Realtime Governance", "BroadcastChannel", "React Query", "Kline"]
sidebar_position: 11
---

# Realtime Socket Governance

## 為什麼 Binance 面試會問這題

交易頁不是只有「把 WebSocket 接起來」。在 Binance 這類高併發產品裡，前端本身也是系統成本和資料流治理的一部分。

常見追問：

- 使用者同時開多個 tab，每個 tab 都要連行情 socket 嗎？
- 哪個 tab 有資格吃 realtime tick？哪個 tab 只需要 history？
- CRUD 變更後，要怎麼避免所有視窗一起 refetch？
- K 線 history 和 realtime tick 要怎麼接，才不會 duplicate 或斷層？
- BroadcastChannel 應該廣播資料本體，還是只做協調訊號？

面試時不要只回答「用 WebSocket」。更好的回答是：我會把 realtime stream 當成需要治理的資源，限制 owner、分離 data plane / control plane，並用 policy 控制不同裝置與使用者場景。

## Baseline：每個分頁都有 runtime cost

如果每個分頁都獨立接 realtime，成本不只是 socket connection，還包含每個 tick 後面的整條處理鏈：

- App instance。
- Redux / Zustand / Pinia store。
- TanStack Query observer。
- Socket client。
- Chart instance。
- watcher / computed / render pipeline。

每個 tick 進來後可能觸發：

- JSON parse。
- schema validation。
- normalize。
- store update。
- selector / computed / watch invalidation。
- chart callback。
- render scheduling。
- GC pressure。

所以要省的不是單一 socket，而是每個 tick 在所有分頁上的重複處理成本。

## Capacity Thinking

這不是精準壓測報告，而是用來面試時說明容量思維的估算。

假設產品調查結果：

- 70% 使用者只開 1 個頁面，多半是 mobile。
- 25% 使用者開 2 個頁面，多半是 desktop。
- 5% 使用者開 5 個頁面，例如進階交易者。

平均頁面數：

```txt
0.70 * 1 + 0.25 * 2 + 0.05 * 5 = 1.45 pages/user
```

如果有 100,000 online users，每個分頁都連 realtime：

```txt
100,000 users * 1.45 pages/user = 145,000 page runtimes
```

如果 policy 設定 `maxRealtimeOwners = 1`：

```txt
145,000 streams - 100,000 owners = 45,000 streams avoided
45,000 / 145,000 ≈ 31% fewer realtime streams
```

同樣比例下：

| Online users | 避免的 realtime streams |
| --- | ---: |
| 100,000 | 45,000 |
| 800,000 | 360,000 |
| 1,000,000 | 450,000 |

面試回答可以說：我會先用這種簡化模型估算「可省掉的重複處理鏈」，再用 production metrics 驗證真正的 CPU、memory、render 和 socket 成本。

## Realtime Owner / Follower

核心概念：

- Realtime owner：可以直接連 `/quote`，消耗 realtime tick 的分頁。
- Follower：不連 `/quote`，只看 REST history，需要時再 request realtime ownership。
- Policy：系統決定同一個使用者最多允許幾個 realtime owners。
- Demo policy：`maxRealtimeOwners = 1`。
- Production policy：可以依 user、device、plan、product mode 調整。

面試口述版：

> 我不會讓每個 tab 都直接吃行情。每個 same-origin tab 先透過 BroadcastChannel 協調，選出 realtime owner；只有 owner 連 quote socket，follower 只看 history 或 stale snapshot。當 follower 變成 active tab 並需要操作時，才 request ownership，舊 owner release 後，新 owner 重新抓 history、reconnect socket、resubscribe，避免資料斷層。

## 方案比較

| 方案 | 優點 | 代價 |
| --- | --- | --- |
| 每頁都連 socket | 最簡單，沒有跨 tab 協調 | 後端連線數與前端更新成本高 |
| Ticker Bus | 只需要一條 socket | tick 仍分發到所有分頁，背景 UI 仍可能消耗 parse / normalize / store / chart / render |
| Realtime Owner | 能控制誰可以吃 realtime | 需要 leader election、handoff、resume |
| Policy-based owners | 支援多螢幕與專業交易場景 | 後端要提供 user / session / device quota |

結論：一般使用者可以限制為 1 個 owner；多螢幕桌機或專業交易者可依 plan / device / product mode 放寬。

## BroadcastChannel：Control Plane，不是 Data Plane

BroadcastChannel 適合同 origin 分頁之間做協調，但不應該拿來廣播所有行情 tick。

適合 BroadcastChannel 負責：

- leader election。
- realtime ownership 狀態。
- request / release realtime owner。
- CRUD 後的 resource invalidation。
- refetch jitter 調整。
- follower apply snapshot 或 request sync。

不適合 BroadcastChannel 負責：

- 廣播每筆 K 線 tick。
- 廣播每筆 ticker。
- 讓所有 follower 都同步跑 chart update。
- 把高頻 data plane 搬到每個背景 tab。

面試關鍵句：

> BroadcastChannel 應該傳 control message，而不是傳高頻 market data。行情 tick 留在 owner tab 或專門的 worker；其他 tab 只接收權限、失效、同步這類低頻控制訊號。

## Leader / Follower Active Reclaim

同 origin 分頁可以用 BroadcastChannel 協調 leader：

- 必須是 leader 才連 `/quote`。
- follower 不開 realtime socket。
- 單一分頁短暫 hidden / blur 不一定要立刻 release，避免 DevTools 或短暫切換造成無謂斷線。
- 其他 visible tab 需要操作時，透過 request / release 取得 realtime ownership。
- 新 owner 取得權限後要 reload history、reconnect socket、resubscribe。
- 要處理 single point of failure，例如 leader crash、stale takeover、heartbeat timeout。

可靠 handoff 流程：

```txt
active tab request realtime ownership
  -> old owner release leader
  -> old owner disconnect quote socket
  -> new leader announcement with new term
  -> new owner GET latest history
  -> new owner connect quote socket
  -> new owner subscribe current symbol / interval
  -> realtime tick resumes
```

## Kline History 接 Realtime

K 線資料要分成 history 和 realtime 兩段：

- history：REST `getBars` / `GET Klines`。
- realtime：quote socket `subscribeBar` / realtime tick。
- 同一個 timestamp 的 candle 要 overwrite，不是 append duplicate。
- resume / reconnect 後要 reload history，避免資料斷層。
- 後端可以把 unclosed tick emit 到 `/quote`；closed kline upsert DB 後成為 history。

前端合併邏輯：

```ts
type Kline = {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
};

function mergeRealtimeKline(history: Kline[], next: Kline): Kline[] {
  const last = history.at(-1);

  if (last?.time === next.time) {
    return [...history.slice(0, -1), next];
  }

  return [...history, next];
}
```

面試口述版：

> 我會先用 REST 拿 history，再用 socket 更新最新一根 candle。判斷 key 是 candle timestamp：相同 timestamp 就 replace，新的 timestamp 才 append。斷線或 owner 切換後不直接相信本地資料，而是重新抓 latest history，再重新 subscribe realtime，避免中間漏 tick。

## CRUD 變更與 Refetch Storm

CRUD 後最容易犯的錯，是讓所有 tab 或所有使用者同時打 refetch，形成 QPS 尖峰。

比較穩的流程：

```txt
resource changed
  -> emit committed invalidation signal
  -> owner mark stale immediately
  -> keyed dedupe + jitter
  -> refetch authoritative snapshot
  -> publish updated snapshot
  -> follower apply snapshot or request sync
```

重點：

- `callUpdate` 不是資料本體，只是「某個 resource 已變更」的控制訊號。
- 收到 signal 後先 local invalidation，不要所有 tab 立刻打 API。
- network refetch 要 keyed dedupe，避免同一個 key 重複請求。
- refetch 要加 jitter，避免跨使用者同時 refetch 造成 QPS 尖峰。
- 最終 UI 以 authoritative snapshot 校正。

React Query 回答方式：

> 我會把 resource changed 當成 invalidation signal，而不是直接把資料透過 BroadcastChannel 灌給每個 tab。owner 先把 query 標成 stale，再用 query key 做 dedupe，並延遲一個 jitter window 後 refetch authoritative snapshot。refetch 成功後，再把 snapshot 發給 follower 或讓 follower 需要時 request sync。

## Store Governance

不要把所有資料都塞進同一個 store。不同資料的 owner 不一樣：

| 管理者 | 適合管理的狀態 |
| --- | --- |
| Redux / Zustand / Pinia | leader role、socket state、目前訂閱狀態 |
| TanStack Query | trading-pairs REST data、balances、open orders、metadata |
| Kline loader / REST API | K 線 history |
| Quote socket / owner tab | realtime tick |
| Control coordinator / socket | `callUpdate` control signal |
| BroadcastChannel | cross-tab coordination |

面試可以補一句：

> 分層的目的不是追求架構漂亮，而是讓不同更新頻率、可靠性要求和資料來源有清楚 owner。REST snapshot、realtime tick、local UI state、cross-tab control message 不應該混在同一個 store 裡。

## Production Policy

Demo 可以寫死 `maxRealtimeOwners = 1`，但 production 不應該所有情境都鎖死一個 owner。

後端可依這些欄位下發 policy：

- userId。
- sessionId。
- anonymous deviceId。
- paid plan。
- device type。
- product mode。

TypeScript 型別例子：

```ts
type ReclaimMode = "manual" | "auto";
type BackgroundMode = "keep" | "release-on-hidden";

type RealtimePolicy = {
  maxRealtimeOwners: number;
  reclaimMode: ReclaimMode;
  backgroundMode: BackgroundMode;
};
```

策略例子：

- 手機使用者：`maxRealtimeOwners = 1` 通常足夠。
- 桌機多螢幕：可放寬到 3 到 5。
- 專業交易者：可依付費方案或產品模式給更高 quota。
- 背景分頁：依 policy 決定 keep 或 release-on-hidden。

面試關鍵句：

> 重點不是所有分頁都無腦限制，也不是所有情境都鎖死一個 owner，而是後端具備 policy 能力，能根據使用者、裝置和產品模式控制 realtime 資源。

## 系統設計回答模板

如果面試官問：「如何設計 Binance 交易頁的多分頁 realtime 架構？」

可以這樣回答：

> 我會先把行情資料分成 history 和 realtime。history 由 React Query 透過 REST 管，realtime 由 quote socket 管。多分頁時不讓每個 tab 都連 socket，而是用 BroadcastChannel 做 control plane，選出 realtime owner。只有 owner 連 quote socket、解析 tick、更新目前可見交易頁；follower 只看 history 或 snapshot，需要操作時 request ownership。owner 切換時，新 owner 先抓 latest history，再 reconnect / resubscribe，避免資料斷層。CRUD 更新時，我不會讓所有 tab 直接 refetch，而是發 invalidation signal，owner 做 keyed dedupe 和 jitter 後 refetch authoritative snapshot，再同步 follower。production 上再由後端根據 user、device、plan、product mode 下發 `maxRealtimeOwners` policy。

## 高機率追問

### 為什麼不把 tick 全部丟 BroadcastChannel？

因為 BroadcastChannel 會讓所有分頁都吃到高頻 market data，背景 tab 仍會做 parse、normalize、store update、chart callback 和 render scheduling。這只是把 socket 數量降下來，沒有真正控制前端 runtime cost。

### owner 切換時如何避免資料斷層？

新 owner 不應該只接續舊 owner 的本地狀態。它取得 ownership 後要重新抓 latest history，再 connect socket、resubscribe 當前 symbol / interval，並用 timestamp / sequence 做校正。

### CRUD 後為什麼要 jitter？

因為相同 resource 變更可能讓大量使用者或多個 tab 同時 refetch。local invalidation 可以立即標示 stale，但 network refetch 應該 keyed dedupe 並加 jitter，避免瞬間 QPS 尖峰。

### policy 為什麼要由後端決定？

因為不同使用者和裝置的合理 realtime owner 數不同。手機可能一個就夠，桌機多螢幕可能需要多個，專業交易者可能有更高需求。後端 policy 能讓資源限制和商業場景對齊。
