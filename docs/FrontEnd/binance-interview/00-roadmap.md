---
title: "Binance 前端面試攻略總覽"
description: "依 Binance Front-end / Senior Front-end Developer 職缺要求整理的面試技能地圖與準備順序。"
tags:
  - Interview
  - Frontend
  - Binance
  - React
keywords: ["Binance", "Frontend Interview", "React", "Redux", "React Query", "JavaScript"]
sidebar_position: 1
---

# Binance 前端面試攻略總覽

## 目標職缺定位

這份筆記針對 Binance 前端工程師 / Senior Front-end Developer 類型職缺整理，尤其是職缺中反覆出現的要求：

- 3 年以上 production-level JavaScript 經驗。
- 熟 React，能說清楚 render、hooks、狀態與效能。
- 熟 Redux / Flux 類型的狀態管理模式。
- 熟 React Query 或同類 server state 工具。
- 能處理非同步資料、錯誤、快取、重試與即時更新。
- 能交付高品質、可維護、可擴展 UI。
- 能做 desktop / mobile responsive web application。
- 熟現代前端工具鏈與樣式方案，例如 Webpack、Tailwind CSS、styled-system。
- 有 CS / 工程背景，或能用實務經驗補足基礎能力。

> LinkedIn 職缺頁可能需要登入或會動態更新。這份攻略以你貼出的 Futures / Senior Front-end Developer requirements 為主，並用交易產品前端常見考點補強。

## 技能地圖

| 分類 | 面試官想確認 | 必會重點 |
| --- | --- | --- |
| JavaScript / TypeScript | 你能不能穩定寫 production code | event loop、closure、prototype、this、async/await、Promise、module、型別設計、泛型、narrowing |
| React | 你是否真的理解 React，而不只是會寫元件 | reconciliation、render 流程、hooks 規則、effect 時機、memoization、controlled component、錯誤邊界 |
| Redux / Flux | 你是否能管理複雜 UI 狀態 | single source of truth、action/reducer、selector、middleware、normalization、避免過度全域化 |
| React Query | 你是否能處理 API server state | query key、cache、stale time、invalidation、retry、mutation、optimistic update、pagination |
| 非同步與即時資料 | 交易產品的核心能力 | request cancellation、race condition、WebSocket、重連、節流、防抖、資料一致性 |
| UI / Responsive | 能不能交付精準、高品質畫面 | RWD、CSS layout、accessibility、表單、表格、狀態提示、Loading / Error / Empty |
| Tooling | 能不能維護大型前端專案 | Webpack / Vite、Babel、tree shaking、code splitting、ESLint、Prettier、CI |
| Performance | 能不能處理高頻更新 UI | render profiling、virtual list、memo、batching、bundle 優化、影像與字體載入 |
| Crypto Domain | 是否理解幣安交易產品場景 | order book、K 線、ticker、價格精度、數字格式、風控提示、網路延遲 |
| System Design | Senior 面試常考 | 狀態分層、資料流、模組邊界、可觀測性、錯誤恢復、feature flag |

## 準備優先級

### P0：一定要能回答

- React render 和 hooks 的運作方式。
- Redux 和 React Query 各自負責什麼，不要混用概念。
- 如果你原本寫 Vue，要能清楚比較 Vue reactivity 與 React render/state model。
- 如何避免 race condition、重複請求、過期資料覆蓋新資料。
- 如何設計一個即時價格 / order book / K 線元件。
- 如何讓 UI 在大量資料更新時仍然順。
- JavaScript event loop、Promise、async/await、closure。
- Responsive layout 怎麼從 desktop 改到 mobile。

### P1：能拉開差距

- 用 TypeScript 設計交易資料型別，避免把 price / quantity 都當普通 number。
- WebSocket 斷線重連、心跳、快照加增量同步。
- React Profiler 分析重渲染問題。
- 用 selector / memoized selector 降低 Redux 訂閱成本。
- bundle splitting、lazy route、vendor chunk、tree shaking。
- accessibility 與 keyboard 操作，尤其表單、modal、表格。

### P2：加分但不應取代基礎

- 微前端、Module Federation。
- SSR / hydration。
- 前端監控、Sentry、Web Vitals。
- Design system、token、styled-system 架構。
- e2e 測試策略。

## 30 天準備節奏

| 週次 | 目標 | 產出 |
| --- | --- | --- |
| 第 1 週 | 補齊 JS / TS / React 基礎 | 每天 3 題口述題，整理 1 篇 React Query vs Redux 筆記 |
| 第 2 週 | 深入狀態管理與非同步資料 | 做一個 mock trading dashboard，含 query cache、mutation、error state |
| 第 3 週 | 強化 UI 品質與效能 | 加上 order book / ticker 即時更新、virtual list、responsive layout |
| 第 4 週 | 面試實戰 | 練 system design、behavioral story、LeetCode 高频題、英文口說 |

## 面試回答框架

### 技術題回答

1. 先定義問題：這題在問 client state、server state、render performance，還是資料一致性？
2. 說核心原理：用 2 到 3 句把機制講清楚。
3. 補 production trade-off：錯誤處理、邊界情況、效能、可維護性。
4. 給實作例子：用你做過的功能或交易產品場景落地。

### 系統設計回答

1. 需求拆解：資料來源、更新頻率、互動行為、裝置尺寸。
2. 狀態分層：server state、global client state、local UI state。
3. 資料流：API / WebSocket 如何進入 cache / store。
4. UI 架構：container、presentational component、hook、selector。
5. 效能策略：節流、virtualization、memo、分頁、增量更新。
6. 可靠性：重連、錯誤、fallback、監控、降級。

## 相關專案內筆記

- [React 筆記](../react/fe-react.md)
- [React Hook 筆記](../react/fe-react-hook.md)
- [JavaScript event loop](../javascript/eventLoop.md)
- [TypeScript 基礎](../typescript/t01-basic.md)
- [Redux 筆記](../../React/r07-redux.md)
- [Vue 轉 React 生態面試題](./07-vue-to-react-ecosystem-qna.md)
- [React 術語中文對照與交易頁範例](./08-react-terms-code-examples.md)
