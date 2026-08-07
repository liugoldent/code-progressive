---
title: "React 現場實戰題系列"
description: "集中整理 React 現場 debug 與面試實戰題；每回六題，從預測輸出、定位根因、修正程式到面試口述。"
tags:
  - React
  - Interview
  - Debugging
keywords: ["React 現場題", "React 面試實戰題", "React debug 題", "React Hooks 面試", "React 前端面試"]
sidebar_position: 14
---

# React 現場實戰題系列

這個系列把需要「讀程式、預測行為、找出根因、提出修正」的 React 面試題放在一起。每一回固定六題；不要把它當文章從頭讀到尾，而要真的停下來作答。

## 建議練法

每題最多先給自己 3 到 5 分鐘：

1. 不執行程式，先寫下畫面、console 或 render 次數的預測。
2. 圈出你認為有問題的 state、effect、closure、identity 或資料邊界。
3. 說明「為什麼」，不要只背修正版 API。
4. 從空白重寫一次，再用 30 到 60 秒完成面試口述。

如果第一次答錯很正常；隔天能不看答案重新推導，才算真的建立反射。

## 題目索引

| 回次 | 六題範圍 | 適合先練什麼 |
| --- | --- | --- |
| [入門篇：Props / State / Form / Effect](./15-react-foundations-live-demo.md) | event handler、唯讀 props、immutable state、controlled input、state owner、effect cleanup | 剛學 React 時先建立正確資料流與基本除錯順序 |
| [第一回：State / Effect / Realtime](./11-react-state-effect-live-demo.md) | state snapshot、derived state、stale closure、request race、WebSocket cleanup、order book batching | 建立 Hooks 與即時資料的基本 correctness |
| [第二回：Identity / Render / Concurrent UI](./14-react-render-identity-live-demo.md) | list key、prop 初始化 state、memo reference、Context render、external store、Transition | 看懂「程式沒報錯，但 UI 狀態或效能不對」的進階問題 |

剛開始學 React，建議不要依建立日期作答；先做入門篇，再進第一回，最後才做第二回。

## 三回的觀念地圖

| 遇到的症狀 | 優先檢查 |
| --- | --- |
| 頁面一 render 就立刻執行點擊邏輯 | JSX event prop 傳的是 function，還是 function 的執行結果 |
| 改 object state 後沒更新，或其他欄位消失 | 是否直接 mutation；Hook setter 是否誤以為會自動 merge |
| 兩個元件顯示不同步 | 是否各自保存了同一概念的 state；state 是否該提升 |
| 事件觸發多次，或 callback 一直讀舊 props | effect 是否 cleanup；dependency 是否完整 |
| setter 後讀到舊值、timer 一直拿舊資料 | render snapshot、closure、functional updater、ref |
| API 或 WebSocket 顯示上一個交易對 | effect cleanup、request identity、sequence correctness |
| 排序後輸入框內容跑到別列 | `key` 是否代表穩定的資料 identity |
| prop 已更新，但表單 draft 沒重設 | state owner、初始化與同步需求是否混在一起 |
| 加了 `React.memo` 仍一直 render | object、array、function prop 的 reference 是否穩定 |
| 只用 theme 的元件被 ticker 拖著更新 | Context 的責任與更新頻率是否混在一起 |
| React 不會跟著外部 mutable store 更新 | 是否透過 `useSyncExternalStore` 建立正式訂閱邊界 |
| 包了 `startTransition`，輸入仍然卡 | 重計算發生在哪裡；Transition 是否只標記了更新優先級 |

## 完成標準

做完三回後，應該能在沒看到標準答案時完成這四件事：

- 先定義哪一份資料是 source of truth，以及誰擁有它。
- 沿著 render、commit、effect、async callback 的時間順序找 bug。
- 分辨 correctness 問題與 performance 問題，不用 memo 掩蓋錯誤資料流。
- 說清楚修正方案的限制，例如 key reset 會丟掉 local state、Transition 不等於 debounce。

第一次請照「入門篇 → 第一回 → 第二回」；下一次複習可以倒著做，換一個順序確認自己不是只記住答案位置。
