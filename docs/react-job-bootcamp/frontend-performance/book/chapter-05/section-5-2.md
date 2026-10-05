---
sidebar_position: 2
title: "5-2 Service Workers Cache"
description: "快取與網路機制：Service Workers Cache 的原理、操作、判讀與練習。"
---

# 5-2 Service Workers Cache

> 學習目標：能設計 Service Worker 的安裝、更新、離線與清理路徑。

**核心觀念：** Service Worker 能攔截請求並使用 Cache Storage 做離線或快取策略；與瀏覽器 HTTP cache 不同。install／activate／fetch 的生命週期和版本清理需設計清楚。

**實作與驗證：** 測首次安裝、更新、離線、網路失敗與舊 cache 清除。分別為靜態檔、HTML 和資料 API 設策略，提供離線 fallback。

**常見誤區：** 把個人化 HTML 或敏感 API 無條件 cache-first，可能導致舊資料與隱私問題。

### 先畫快取矩陣

| 資源 | 可用策略 | 必測失敗情境 |
| --- | --- | --- |
| 帶 hash 的 JS/CSS | precache 或 cache-first | 新部署後舊 cache 清理 |
| 公開且可容忍舊值的資料 | network-first 或 stale-while-revalidate | 離線與超時 |
| 個人化／敏感資料 | 通常走網路且審慎快取 | 登出後是否殘留 |

先在 Application 面板檢查 Service Worker 與 Cache Storage，再測正常更新、離線啟動和網路失敗。更新生命週期尤其容易讓舊頁面使用新資源或新頁面使用舊資源；部署版本需配套。

延伸：[Day 18 原系列筆記](../../day-18.md)。

## 原理拆解

Service Worker 是可程式化的網路代理，能攔截範圍內的請求並從 Cache Storage 取回回應。它與 HTTP cache 不同，可能同時存在；因此「我明明清了瀏覽器快取仍看到舊版」也可能與 Worker 有關。安裝與啟用不是同一瞬間，頁面在新版發布時可能仍由舊 Worker 控制。快取策略必須配合版本與資料敏感度設計，尤其要測離線、更新和登出。

## 從頭做一次

1. 列出哪些資源要 precache、哪些運行時請求可快取，以及哪些個人化資料不能共用。為每類資源選 cache-first、network-first 或 SWR。
2. 在 Application 面板檢查目前 Worker 與 Cache Storage。測第一次安裝、頁面開著時部署新版本、重新整理、離線重開，以及登入後登出。
3. 設定舊 cache 清理和離線 fallback。更新時確認舊頁面使用到的檔案仍存在，避免半新半舊的版本組合。

## 如何判斷做對了

Service Worker 與 HTTP cache 可能同時參與請求；排查舊版問題時必須兩邊都檢查。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 5-15～5-24

### 5-15～5-19：Service Worker 在瀏覽器與網路之間

書中說明 Service Worker 在獨立執行環境中工作，可攔截受其 scope 控制的頁面請求，但不能像一般頁面腳本直接操作 DOM；與頁面溝通可用 `postMessage`。註冊需要 HTTPS 或 localhost，並要留意註冊路徑決定的控制範圍。生命週期包括註冊、install、activate、閒置或被終止，之後遇到 fetch／message 事件可再次啟動。書中的 install 範例用 Cache API 預存 JS/CSS；若預存失敗，安裝可能失敗。Service Worker 的更新和控制頁面的時機要實測，不能假設註冊成功便立刻接管已開啟頁面。

### 5-19～5-21：攔截請求帶來更細的策略控制

書中示範 `fetch` 事件裡以 `event.respondWith(...)` 回傳快取或網路的 Response。與單靠 HTTP Cache 的回應標頭相比，這能依 URL、請求類型、使用者狀態設定不同策略，並提供離線頁面或離線資源。它也帶來更多維護責任：不能讓過期 API 資料被當成永久新鮮，也要處理更新與快取清理。

### 5-21～5-24：五種快取策略

書中列出：

| 策略 | 書中用途與主要代價 |
| --- | --- |
| Cache only | 完全從快取取，沒命中就失敗；適合確定預存且可離線的內容。 |
| Network only | 只向網路請求；適合不應使用舊快取的操作。 |
| Cache falling back to network | 先快取、未命中才上網；離線友好，但舊內容可能存在太久。 |
| Network falling back to cache | 先取最新內容，網路失敗才顯示舊版；新鮮度好，但慢網可能等很久。 |
| Cache then network | 先顯示可用的舊內容，同時上網更新；適合可接受短暫舊資料的高頻內容，需設計畫面如何通知更新。 |

書中最後把 Service Worker Cache 與 HTTP Cache 合用：兩層的目的和有效期要有意安排，避免其中一層長期回傳舊資源，讓另一層的更新策略失效。頁 5-24 有不同期限的示意表，其期限是說明配置方式的例子，不是所有資源應採用的預設值。書中亦提到 Workbox 可減少自行撰寫策略和生命週期程式碼的工作量。

## 問題與解答：Service Worker 快取策略

**問題 1：Service Worker 與一般 HTTP cache 有何不同？** 它可在瀏覽器端攔截特定請求，決定先走 Cache Storage、先走網路，或提供離線 fallback；HTTP cache 則主要按回應快取標頭運作。Service Worker 的自由度更高，也因此要自己管理生命週期與失效。

**問題 2：哪些資源適合 cache-first？** 帶版本 hash 的靜態資源較適合；個人化 HTML、權限或即時庫存通常不適合無條件先回舊值。依資源的更新頻率與過期後風險選策略，而不是整站套同一個模式。

**問題 3：network-first 和 stale-while-revalidate 如何取捨？** network-first 先求新資料，網路失敗才回退快取；stale-while-revalidate 先顯示舊資料，再背景更新，體感較快但短時間可能過時。關鍵決策資料需優先確保正確性，一般可容忍短暫陳舊的內容才適合後者。

**問題 4：如何測到真正的離線能力？** 測首次安裝、第二次造訪、更新 Service Worker、離線啟動、網路中斷和舊 cache 清理。若只在已暖機的開發機按一次 Offline，可能漏掉首次使用者完全沒有快取的情況。
