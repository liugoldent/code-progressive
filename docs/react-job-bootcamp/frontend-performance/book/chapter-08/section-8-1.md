---
sidebar_position: 1
title: "8-1 Runtime Performance Debugging"
description: "DevTools Debugging 與前端節流：Runtime Performance Debugging 的原理、操作、判讀與練習。"
---

# 8-1 Runtime Performance Debugging

> 學習目標：能留下可重現、可驗收的效能除錯紀錄。

**核心觀念：** 以具體症狀錄製 Performance trace。載入問題結合 Network 和 LCP；互動問題看事件、長任務與下一次 paint；動畫問題看 frame、layout、paint。

**實作與驗證：** 固定操作起終點與測試條件，保存 baseline trace；用 Bottom-up 找昂貴函式、Call tree 找呼叫來源。一次改一個因素並重錄。

**常見誤區：** trace 是診斷工具，最終仍需在真實裝置或 RUM 驗證。

### 一次除錯紀錄應能回答四個問題

症狀何時發生？哪個資源或函式佔時間？修改了什麼？同條件下結果如何？例如搜尋輸入卡頓，trace 顯示每次 keypress 都同步過濾並重繪 5000 筆；可先限制渲染項目、延後非必要計算，重錄同一輸入序列。

DevTools 錄製本身有開銷，trace 用來定位相對瓶頸；最終以真實設備或 RUM 確認。保留原始紀錄，避免只有『感覺比較順』的結論。

延伸：[Day 28 原系列筆記](../../day-28.md)。

## 原理拆解

效能除錯應像科學實驗：先定義一個可重現的症狀，保存基準紀錄，提出單一假設，再只修改一個主要因素。Network waterfall 主要看等待與依賴，Performance flame chart 主要看主執行緒花費，Bottom-up 統計總耗時函式，Call tree 追呼叫來源。結果要包含測試設備、資料量與快取狀態，否則前後數字不可比。DevTools trace 用於定位，正式效果仍需真實設備或 RUM 確認。

## 從頭做一次

1. 定義症狀與操作步驟：例如搜尋框輸入特定 10 個字、展開列表、捲動到底。固定設備、資料量、網路和快取條件。
2. 保存 baseline trace，依症狀查看 Network、Main thread、Bottom-up、Call tree、Layout shifts。寫出最昂貴的資源／函式及其來源。
3. 一次只改一個因素，同條件重錄，記下前後數字與副作用。最後以 RUM 或真實設備確認使用者是否受益。

## 如何判斷做對了

只貼一張 Lighthouse 分數截圖不足以解釋根因，也不足以防止下一次退化。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 8-2～8-20

### 8-2～8-4：從可重現操作開始錄製

本節關心的是 **Runtime Performance**：網頁已載入後，點擊、捲動與動畫是否仍流暢。書中用一個字元格切換的範例網站示範，先在 Chrome DevTools 的 Performance 面板錄製操作；可以按錄製後手動操作、停止，也可以用「錄製並重新整理」檢查載入過程。範例還用 CPU slowdown 模擬較慢裝置，使卡頓更容易重現。錄製前要固定操作、裝置、網路和快取條件，否則兩次 trace 不適合直接比較。

錄製結果上方可先看 FPS、CPU、NET 總覽。FPS 低或紅色長條提示幀可能來不及完成；CPU 圖則告訴你忙碌區段在哪裡。把游標移到有問題的時間點，可對照畫面截圖與主執行緒工作，避免只憑一個 FPS 數字猜原因。

### 8-5～8-10：Summary、Memory 與 Frames

選定時間範圍後，Summary 圖可比較 Loading、Scripting、Rendering、Painting、System 和 Idle 所佔時間。範例先發現 CPU 長時間有工作，再檢查網站動畫；書中提醒 CPU 忙碌本身不等於必然造成使用者問題，應對照實際掉幀或操作延遲。

Memory 曲線可以觀察 JS heap 等記憶體用量。曲線上升後經 GC 降回，不足以單獨證明洩漏；應用第 7 章的方法看多輪操作後的基線。Frames 區能逐幀檢查畫面截圖、Duration、FPS 與 CPU Time；超過一幀預算的 frame 比單看平均 FPS 更容易定位特定動畫或互動的卡頓。

### 8-11～8-15：Timing、Network、Main 與呼叫堆疊

Timing 軌呈現載入里程碑，例如 DCL、FP、FCP、LCP 和 load；Summary 裡也可能顯示 Total Blocking Time。Experience 軌可協助檢查 Layout Shift。Network 軌可查看資源請求的先後和耗時，點選請求後看 URL、Duration、Priority、MIME Type、編碼與解碼大小。這些資料有助於分辨「等待網路」與「資源到齊後仍忙於計算」。

Main flame chart 呈現主執行緒的 task 與巢狀函式呼叫。書中示範先找長任務，再展開耗時區段，查看其函式與來源；點選任務可跳到 Sources 中對應的原始碼位置。除了 Main，trace 也可能有 iframe 或 Worker 軌，不能把它們都當成主執行緒。Summary、Call Tree、Bottom-Up 可分別用來看區間摘要、呼叫來源與累積耗時。

### 8-16～8-20：動畫卡頓案例的完整推理

範例網頁的格子動畫錄製後，CPU 分佈顯示 Rendering 和 Painting 占比高，Main 上有長任務。原始碼在按鈕事件後，對許多格子逐一修改 `style.top`；這種位置變更可能反覆引發 layout 與 paint。作者把動畫改成 `transform: translate(...)`，再設定適當的 `will-change: transform`，重錄同一操作。修改版的 trace 顯示較多 Idle 時間、較少繁重的渲染工作，畫面流暢度改善。

可把案例整理成一套可重複的診斷程序：

1. 固定操作，錄製「修改前」trace，選出掉幀時間段。
2. 在 FPS、CPU、Frames 中確認症狀；到 Main 與 Summary 找 Rendering／Painting／Scripting 的真正成本。
3. 展開長任務，沿函式來源找到引起動畫更新的程式碼。
4. 只改動畫實作，重錄「修改後」trace；同時檢查樣式、可互動性與記憶體副作用。

書中也提醒，Lighthouse 分數不能替代特定操作的 Runtime Performance 除錯。`will-change` 也不是愈多愈好：只對確實即將動畫的元素使用，避免不必要的圖層與記憶體成本。書中截圖的 DevTools 面板名稱和指標位置屬出版時介面，操作時應以目前瀏覽器的實際介面為準。

## 問題與解答：用 DevTools 找出卡頓原因

**問題 1：使用者說動畫卡，Performance 面板先看哪裡？** 固定重現操作並錄製，先在 FPS、CPU、Frames 對齊掉幀時間，再框選那段看 Summary 的 Scripting、Rendering、Painting 比例。若只看平均 FPS，可能漏掉某幀突然超時。

**問題 2：CPU 忙碌是否一定就是使用者感受到的問題？** 不一定。要看忙碌是否落在點擊、捲動或動畫關鍵時段，並對照畫面截圖與長任務。非關鍵背景計算可能佔 CPU，卻未必拖慢當下操作；反過來短但剛好擋住輸入的工作也可能明顯卡頓。

**問題 3：Main flame chart 出現長任務，如何找到原始碼？** 展開任務看巢狀函式，使用 Call Tree 追呼叫來源、Bottom-Up 找累積耗時，再點選對應項目跳到 Sources。若有 sourcemap，較容易回到原始檔；同時確認是不是 iframe、Worker 或第三方腳本的工作。

**問題 4：書中的動畫案例如何推論出 `top` 是問題？** trace 顯示 Rendering／Painting 時間高，Main 有長任務；追到按鈕事件逐一修改多個格子的 `style.top`，可能反覆觸發排版與繪製。改以 `transform` 後，用同樣操作重錄，確認渲染工作減少、Idle 增加與幀率改善。

**問題 5：Lighthouse 分數為何不夠除錯？** 它可提示載入問題，但書中的卡頓出現在頁面載入後的特定互動。需要保存可重現的 Performance trace，找到慢的時間段、函式與畫面，再比較修改前後；最終仍應用真實裝置或使用者資料確認。
