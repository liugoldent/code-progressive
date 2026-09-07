---
sidebar_position: 2
sidebar_label: "極致前端行動路線"
slug: "/frontend-interview/binance/frontend-mastery-action-plan"
title: "極致前端行動路線：瀏覽器深度、React 轉化與全端渲染"
description: "把瀏覽器底層、React 心智模型、WebSocket、Web Security、Nuxt 3 與 Next.js 整理成能實作、量測、口述的前端面試行動計畫。"
tags:
  - Interview
  - Frontend
  - React
  - Browser
  - WebSocket
  - SSR
keywords: ["極致前端", "前端面試行動計畫", "瀏覽器渲染", "React 心智模型", "Vue 轉 React", "WebSocket", "Web Security", "Nuxt 3", "Next.js", "Frontend-heavy Fullstack"]
---

# 極致前端行動路線

## 先判斷這三個建議

Gemini 提的三個方向是合理的，但不能平均用力，也不能只用「看過文章」當作完成。

對目前的目標而言，優先順序應該是：

1. **先把 React 練成可獨立交付**：這是 React 職缺最直接的門檻。
2. **同步深化瀏覽器與 realtime correctness**：這會把你和只會框架 API 的候選人拉開。
3. **最後補 Nuxt 3 / Next.js 的渲染與後端邊界**：目標是能做架構選擇，不是同時背兩套 API。

面試前可先用 **React 50%／前端底層 35%／全端渲染 15%** 分配時間。當 React 已達到不看範例也能完成中型功能後，再調成 40%／35%／25%。

## 什麼才算真的學會

每個主題都必須通過四層驗收：

| 層次 | 驗收方式 |
| --- | --- |
| 解釋 | 能在 3 分鐘內說清楚機制、適用情境與限制 |
| 實作 | 能從空白做出最小可運行範例，不靠複製完整答案 |
| Debug | 能用 DevTools、Profiler、測試或 log 找出問題證據 |
| 設計 | 能比較至少兩種方案，說明 correctness、效能與維護成本 |

只做到「看得懂」還不能當成面試能力。每週至少要留下一個可執行 demo、一份量測紀錄，以及一次不看稿口述。

## 主線一：前端深度

### 1. 網路與瀏覽器請求

要能從輸入網址一路講到畫面可互動：

- DNS、TCP / TLS、HTTP request / response。
- HTTP cache、CDN、壓縮、連線復用與資源優先級。
- cookie、authorization header、CORS 與 preflight 的成立條件。
- HTML parsing、CSSOM、JavaScript 執行與資源載入如何互相影響。

**行動題：**

- [ ] 用 DevTools Network 錄一個頁面首次載入與再次載入的 waterfall。
- [ ] 對每個主要資源標出 DNS、connection、TTFB、download 與 cache 結果。
- [ ] 解釋一個 render-blocking 資源，提出修改後再量一次。
- [ ] 手寫一張 `Cache-Control`、`ETag`、`Last-Modified` 的選擇表。

**面試驗收：**回答「頁面很慢，你會怎麼判斷是網路、主執行緒，還是 API 的問題？」時，要先分類並提出證據，不是直接列優化名詞。

### 2. Event Loop 與渲染管線

核心不是背 microtask 比 task 早，而是知道程式如何影響下一幀：

- call stack、task、microtask、rendering opportunity。
- `requestAnimationFrame`、timer、Promise callback 的執行位置。
- style calculation、layout、paint、composite。
- forced synchronous layout、layout thrashing、long task 與掉幀。

**行動題：**

- [ ] 寫一題同時包含 `Promise`、`setTimeout`、`requestAnimationFrame` 的執行順序題，先預測再驗證。
- [ ] 做一版反覆讀寫 layout property 的錯誤 demo，再改成批次讀、批次寫。
- [ ] 用 Performance panel 找出 long task、layout 與 paint，保留修改前後數據。
- [ ] 能說明 `transform` 動畫為何通常比改 `top` / `left` 更容易維持順暢，以及它不是絕對免費的原因。

延伸閱讀：[JavaScript / TypeScript 面試重點](/docs/frontend-interview/binance/javascript-typescript)與[效能 / 測試 / 前端系統設計](/docs/frontend-interview/binance/quality-performance-system)。

### 3. Memory Management

面試要談的是「物件為什麼仍然 reachable」，不是只說 JavaScript 有垃圾回收：

- closure、event listener、timer、observer、detached DOM、cache 的持有關係。
- React effect cleanup 與 Vue lifecycle cleanup。
- heap snapshot、allocation timeline 與重複操作後的記憶體趨勢。
- cache 必須有容量、淘汰與生命週期策略。

**行動題：**

- [ ] 做一個切換頁面後仍保留 listener 或 timer 的 memory leak。
- [ ] 用 Heap Snapshot 找到 retaining path，修正後重做相同步驟。
- [ ] 為 WebSocket、`AbortController`、observer、timer 寫出明確 cleanup。
- [ ] 回答「記憶體上升不等於 memory leak；你會如何證明它真的洩漏？」

### 4. WebSocket 高頻資料

高頻資料的第一要求是**正確**，第二才是順暢：

- snapshot + delta、sequence number、重複與亂序訊息。
- sequence gap detection、重新同步與 stale 狀態。
- reconnect、exponential backoff、jitter、heartbeat。
- producer 比 consumer 快時的 buffer、sampling、coalescing 與 backpressure。
- authoritative data 與 UI render cadence 分離。

**行動題：**

- [ ] 完成一個 mock order book，先抓 snapshot，再套用 delta。
- [ ] 測試 duplicate、out-of-order、gap、disconnect、symbol switch 五種情境。
- [ ] 將每筆訊息直接 render 的版本改成 buffer + 固定節奏更新 UI。
- [ ] 記錄更新頻率、commit 次數、掉幀與恢復時間，不只寫「優化很多」。

完整設計題可看 [Realtime Socket Governance](/docs/frontend-interview/binance/realtime-socket-governance)。

### 5. Web Security

至少要能用資料流與信任邊界解釋：

- XSS 的 source、sink、contextual escaping、sanitization 與 CSP。
- CSRF 何時成立，以及 SameSite cookie、CSRF token、Origin 檢查的角色。
- cookie session 與 bearer token 的攻擊面取捨。
- CORS 不是認證或伺服器端存取控制。
- 第三方 script、依賴套件、source map、敏感 log 與 secret 的風險。
- 金額、地址、網路與簽名意圖必須讓使用者能確認，前端不持有私鑰。

**行動題：**

- [ ] 為登入、下單或轉帳流程畫一張簡單的 trust boundary。
- [ ] 列出資產、入口、攻擊方式、影響、控制措施與殘餘風險。
- [ ] 準備 XSS、CSRF、CORS 各一個「常見錯誤說法 → 正確說法」。

## 主線二：從 Vue 轉成 React 原生思考

Vue 經驗應該拿來加速理解，不要把每個 Vue API 機械式翻成一個 Hook。React 面試真正想確認的是，你能否用 React 的資料流做正確決策。

### 必須形成反射的決策

| 看到的需求 | 第一個判斷 |
| --- | --- |
| 可由 props / state 算出的值 | 直接在 render 推導，不建立同步用的第二份 state |
| 使用者操作 | 放在 event handler，不因為「狀態變了」就改放 effect |
| 與外部系統同步 | 使用 effect，並處理 dependency、cleanup 與 race |
| 不影響畫面的可變資料 | 考慮 ref，不用 state 強迫 render |
| 複雜狀態轉移 | 用 reducer 或 state machine 表達事件與 transition |
| API cache | 用 server-state 工具，不把 loading / cache 全塞進 Redux |
| 多處共享的 client state | 先 colocate；確實跨區域共享再考慮 Context / Redux |
| render 很多 | 先用 Profiler 找原因，再決定是否 memoize |

### 三階段練法

#### 階段 A：語法與資料流

- [ ] 閉卷完成 counter、受控表單、filter list、modal、分頁列表。
- [ ] 每題說出 source of truth、誰觸發 render、state 應放在哪一層。
- [ ] 能比較 Vue `computed` / `watch` 與 React derived value / effect，但不說它們完全等價。

#### 階段 B：effect 與非同步

- [ ] 修正 stale closure、漏 cleanup、重複 request、舊 response 覆蓋新資料。
- [ ] 完成一個帶取消、retry、loading / error / empty 的資料頁。
- [ ] 能判斷哪些 effect 應刪除，而不是只會補 dependency array。

#### 階段 C：production architecture

- [ ] 用 React Query 管 server state，用 local state / reducer 管互動，用 Redux 管真正跨區域的 client state。
- [ ] 寫至少 5 個以使用者行為為中心的 integration tests。
- [ ] 用 Profiler 找一次真實 render 問題，記錄修改前後，而不是預先到處加 `memo`。
- [ ] 寫一頁 Architecture Decision Record，說明狀態分層、元件邊界與失敗處理。

練習順序使用 [React 基礎：Vue 對照版](/docs/frontend-interview/binance/react-basics-vue-comparison) → [React 反射訓練](/docs/frontend-interview/binance/react-reflex-drills) → [React 現場實戰題系列](/docs/frontend-interview/binance/react-live-interview-series) → [React / Redux / React Query](/docs/frontend-interview/binance/react-state-data)。

## 主線三：Frontend-heavy Fullstack

這條線的目標不是把自己包裝成後端專家，而是能負責「從瀏覽器到前端專用後端邊界」：渲染策略、資料取得、認證、安全、cache 與部署行為。

### 先學共同機制，再學框架 API

必須能畫出並解釋這條路徑：

```text
request
  → server route / middleware
  → server-side data fetching
  → HTML（可能 streaming）
  → browser parse and paint
  → JavaScript load
  → hydration
  → client navigation and revalidation
```

需要掌握的共同問題：

- CSR、SSR、預先產生、按需再驗證各自解決什麼問題。
- server-only code 與 client code 的邊界，什麼資料可以序列化到瀏覽器。
- hydration mismatch 如何發生，如何從 server / client output 找證據。
- route-level data fetching、request waterfall、parallel fetching 與 streaming。
- public cache、private cache、使用者資料與失效策略。
- cookie、session、middleware、BFF 與 API authorization 的責任邊界。
- 錯誤頁、loading boundary、redirect、SEO metadata 與 observability。

### Nuxt 3 / Next.js 實作順序

不要同一週從零做兩個完整專案。先用較熟的 Nuxt 3 做出基準，再把一個垂直切片移植到 Next.js：

1. **Nuxt 3 基準版**：商品或交易對列表、detail route、server data fetching、登入狀態與一個 mutation。
2. **刻意製造問題**：hydration mismatch、序列 request waterfall、錯誤 cache 使用、server secret 誤傳到 client。
3. **修正並留下證據**：記錄 HTML、Network waterfall、server log 與修正原則。
4. **移植到 Next.js**：只移植 list → detail → mutation 這條垂直切片。
5. **寫比較表**：比較相同問題在兩個框架中的責任邊界與 API，不爭論哪個框架絕對比較好。

### 完成標準

- [ ] 能依內容更新頻率、個人化程度、SEO 與成本選擇渲染策略。
- [ ] 能找出 hydration mismatch，不用以關閉 SSR 當作預設解法。
- [ ] 能說明 server fetch 與瀏覽器 fetch 在 cookie、secret、latency、cache 上的差異。
- [ ] 能完成安全的 cookie-based session 流程，且不把 server secret 打進 client bundle。
- [ ] 能回答「為什麼需要 BFF？什麼情況其實不需要？」

## 六週落地安排

這張表是[總覽中的 30 次訓練](../00-roadmap.md#適合目前程度的-30-次訓練)的深化版，不需要再額外做一套互不相干的課表。

| 週次 | 主線 | 實作產出 | 面試產出 |
| --- | --- | --- | --- |
| 第 1 週 | React 資料流 | 6 個閉卷小元件 | Vue / React 比較與 5 題口述 |
| 第 2 週 | Event Loop、render、memory | layout thrashing 與 memory leak lab | Performance / Memory 證據各一份 |
| 第 3 週 | React 非同步與狀態分層 | REST dashboard + tests | race、cache、state ownership 回答 |
| 第 4 週 | WebSocket correctness 與效能 | snapshot + delta order book | realtime system design 口述 |
| 第 5 週 | Security 與 SSR 邊界 | threat model + Nuxt 垂直切片 | XSS / CSRF / hydration 問答 |
| 第 6 週 | Next.js 移植與模擬面試 | 移植一條 list → detail → mutation | 3 次 coding、3 次 debug、3 次 system design |

每週五只做驗收：不看筆記重做核心題、錄一次 10 分鐘口述、整理錯誤清單。未通過就減少下週新主題，不用用更多閱讀掩蓋無法輸出的問題。

## 最小作品：Realtime Trading Dashboard

三條主線可以收斂成同一個作品，不必各做一個玩具專案。

### 必要功能

- 交易對列表、搜尋、detail route。
- REST snapshot + WebSocket delta。
- sequence gap、斷線、重連、stale 與錯誤狀態。
- order book / ticker 的固定節奏 UI 更新。
- RWD、keyboard 操作與 loading / error / empty。
- React Query + local state / reducer；只有確實需要時才加入 Redux。
- integration test 與至少一個 reconnect / race test。
- SSR detail page，以及不洩漏 secret 的 server-side request。

### 作品不能只展示畫面

README 或面試簡報至少要放：

1. 架構圖與狀態分層。
2. snapshot + delta 的 correctness 規則。
3. 一次效能量測前後比較。
4. 一次 memory 或 async race 的 debug 紀錄。
5. threat model 與安全邊界。
6. 一項刻意不採用的方案及理由。

## 每週面試檢查表

- [ ] 我能不用稿講清楚本週主題，而不是只會念定義。
- [ ] 我有一個可重現的錯誤版本與修正版本。
- [ ] 我保留了 Network、Performance、Memory、Profiler 或 test 的客觀證據。
- [ ] 我能說出方案的限制與替代方案。
- [ ] 我能把答案連回做過的產品，而不是假裝有未做過的 production 經驗。

走完這條路線後，履歷與面試的定位不應只是「會 Vue，也學過 React」，而是：**能用 React 交付、理解瀏覽器與 realtime correctness，並能負責 SSR / BFF 邊界的前端工程師**。
