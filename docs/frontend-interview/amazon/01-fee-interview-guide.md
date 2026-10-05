---
sidebar_position: 1
title: "Amazon Front-End Engineer 面試準備總覽"
description: "對照 Amazon 官方 FEE 面試說明與公開 AI 工程題庫，整理前端工程師應優先準備的 coding、前端系統設計與 Leadership Principles。"
tags:
  - Interview
  - Amazon
  - Frontend
keywords: ["Amazon FEE", "Amazon 前端面試", "Front-End Engineer", "Leadership Principles", "前端系統設計"]
---

# Amazon Front-End Engineer 面試準備總覽

## 先確認職務範圍

這份筆記以 Amazon 的 **Front-End Engineer（FEE）與以前端為主的 SDE** 公開資料為範圍。內容依 [Amazon 官方 FEE 面試說明](https://www.amazon.jobs/content/en/how-we-hire/fee-interview-prep)整理；[公司別 AI 工程面試題庫](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)則是觀察 AI／全端題型的參考來源。該題庫的 Amazon 段落主要涵蓋 Applied Scientist、MLE、AI/ML SDE、AI Solutions Architect 等職務，因此須依角色篩選。公開經驗彙整不能保證某題會出現。

## 官方流程與考察方向

Amazon 的[官方 FEE 準備頁](https://www.amazon.jobs/content/en/how-we-hire/fee-interview-prep)描述：申請後可能有線上測驗、技術電話面試及 interview loop。頁面所列線上測驗包含兩題技術題、系統設計情境與工作風格問卷；電話面試包含前端 coding 與 Leadership Principles；loop 涵蓋技術與行為能力。**這是官方準備頁所述流程，實際安排仍以 recruiter 和當次職缺通知為準。**

官方對 FEE 特別指出：寫可執行且語法正確的程式碼、處理 edge cases、測試與維護性；前端系統設計會考慮 usability、performance、user experience、accessibility、security、scalability。行為題則用過去經驗說明你做了什麼、為什麼這樣做及結果，官方建議用 STAR。[官方 FEE 準備頁](https://www.amazon.jobs/content/en/how-we-hire/fee-interview-prep)

## 依現有筆記準備，不另背一份題庫

| 主線 | 要練到能說或能寫的程度 | 現有筆記 |
| --- | --- | --- |
| 演算法與 coding | 讀清需求與限制，說出方法和複雜度，寫可執行程式並測邊界 | [LeetCode 首月計畫](../../career-blueprint/06-leetcode-month-01.md)、[演算法筆記](../../algorithms/leetcode/f0301-0400/l0347-top-K-frequent-elements.md) |
| 前端基礎與實作 | JS/TS、HTML/CSS、React 狀態與非同步、元件邊界、測試與效能 | [React 練習](../../react-job-bootcamp/react-30-drills.md)、[前端效能](../../react-job-bootcamp/frontend-performance/index.md) |
| 前端系統設計 | 先釐清使用者、裝置、流量與限制，再談資料流、快取、可用性、安全、無障礙及量測 | [高流量網站架構](../../system-design/01-high-traffic-web-architecture.md)、[工程品質與系統](../binance/04-frontend-core/03-quality-performance-system.md) |
| 行為面試 | 從真實經歷整理 STAR，明確交代自己的行動、取捨、指標與反省 | [Ownership 練習](../../career-blueprint/week-02/11-week-02-day-05.md)、[Customer Obsession 練習](../../career-blueprint/week-03/16-week-03-day-05.md) |

### 三個可立即練習的模擬題

以下是**依官方考察方向設計的練習題，不是已證實的 Amazon 原題**。

1. **Coding：** 寫一個「事件列表取出出現次數最多的 K 種事件」函式。先做有限陣列版本，補上空輸入、同頻率和大量資料的處理，再解釋若事件串流無限增長，原解法會遇到什麼限制。AI 題庫的 [Amazon 段落](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)也收錄類似 top-K 事件題；用來練資料結構與邊界即可。
2. **前端系統設計：** 設計跨裝置的即時告警頁。先問更新頻率、使用者規模、可接受延遲與離線行為；畫出 API／推播／前端狀態流程；說明長列表效能、重連、重複事件、無障礙提示、安全與監控。用[即時資料筆記](../binance/05-trading-system-design/02-realtime-socket-governance.md)做一次口述。
3. **行為題：** 說一個你主動處理跨組問題的真實案例。用 Situation／Task／Action／Result 展開，回答「你親自做了什麼」「為何採這個方案」「結果如何量測」「重做會改什麼」。可同時練 Ownership、Dive Deep、Deliver Results，但故事與數字都必須是真實經歷。[Leadership Principles 官方說明](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)

## 公開題庫：依未來職務選題

| 題庫內容 | FEE／前端導向 SDE | AI／全端職缺延伸 |
| --- | --- | --- |
| Top-K 事件、串流與規模限制 | 納入 coding 延伸；先寫有限資料版本，再談記憶體與分散式取捨 | 同樣適用，追加串流與大規模資料處理 |
| 推薦系統、A/B 測試 | 若產品有個人化或實驗平台，準備使用者體驗與前端量測 | 補推薦架構、指標與線上／離線差異 |
| Bedrock 推論成本、KV cache、模型訓練與 GPU | 了解問題在解什麼；除非 JD 要求，不列為 FEE 核心 | 依 JD 選模型服務成本、延遲或 ML 基礎題深入 |

**優先練的三個題庫追問：**

1. [Amazon 段落的 Top-K 事件題](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)：有限輸入怎麼解？若資料是跨機器且無限增長的串流，精確計數需要多少記憶體？可接受近似時怎麼取捨？先連到自己的 [Top K Frequent Elements 筆記](../../algorithms/leetcode/f0301-0400/l0347-top-K-frequent-elements.md)。
2. [Amazon 段落的推薦系統題](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)：若書籍推薦放到首頁，前端如何處理載入、空結果、快取、曝光與點擊量測？若職缺是 AI／ML，再補模型與推薦品質評估。
3. [Amazon 段落的推論成本題](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)：若現有產品加入 AI 摘要，先估算每次請求的 token、延遲與使用量；哪些摘要可以快取或批次處理？只有目標職缺要求模型服務時，才深入 GPU／KV cache。

這份題庫作為**未來題型的持續輸入**：更新此頁時先核對題庫新增什麼、對應哪種職務，再把選中的問題轉成可實作或可口述的練習；不要整頁照搬。[來源：公司別 AI 工程面試題庫的 Amazon 段落](https://github.com/pallavi-shekhar/ai-engineering-interview-questions-company-wise#amazon-aws)

## 練習完成標準

- Coding：能在沒有 IDE 提示的情況下寫出可執行解法，自己列出至少三個邊界測資並說明時間／空間複雜度。
- 前端設計：能在 3～5 分鐘內說明需求、核心資料流、主要取捨與一個故障情境；涵蓋效能、無障礙、安全與可用性。
- 行為題：至少準備幾段可重用的**真實** STAR 素材，每段標明個人貢獻、可核對的結果和學到的事，再依職缺與追問調整。

投遞時先讀當期 JD；若它明確要求 AI 產品經驗，再接回 [RAG 入門](../../system-design/03-rag-basics.md)及[精選 AI 題目](../../resources/learning-resources.md#ai-工程面試先挑與全端作品有關的題目)。
