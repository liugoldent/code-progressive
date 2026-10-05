---
sidebar_position: 8
title: "3-8 硬體加速：CSS GPU Acceleration"
description: "渲染流程優化：硬體加速：CSS GPU Acceleration 的原理、操作、判讀與練習。"
---

# 3-8 硬體加速：CSS GPU Acceleration

> 學習目標：知道 GPU 合成何時有益，以及如何辨認圖層太多的代價。

**核心觀念：** 某些元素可成為合成層，讓 transform／opacity 動畫減少反覆 layout 或 paint。圖層仍佔用記憶體與合成成本，will-change 只應有條件使用。

**實作與驗證：** 先確認動畫是否反覆 paint，再比較改動前後 frame time、paint 次數、layer 數量及記憶體。動畫結束後移除不再需要的 will-change。

**常見誤區：** 全站套 translateZ(0) 可能增加記憶體壓力並使掉幀更嚴重。

### 動畫優化實驗

先做兩個版本：A 改動 `left`、`top` 或尺寸；B 用 `transform: translate(...)`。在相同設備錄製動畫，看 layout、paint、composite 與 frame time。若 B 有改善，再決定是否真的需要短暫設定 `will-change`。

圖層過多可能增加 GPU 記憶體與合成負擔；頁面上若有很多卡片，不應對全部卡片永久加 `will-change: transform`。動畫結束後移除提示並再測記憶體。

延伸：[Day 13 原系列筆記](../../day-13.md)。

## 原理拆解

合成層像把某些元素先繪成可獨立處理的表面，適合部分 transform／opacity 動畫。提升圖層不是免費：表面需要記憶體，圖層越多也增加合成管理。`will-change` 是提示瀏覽器提前準備，若所有卡片永久宣告，可能因圖層太多而變慢。正確實驗要同時看動畫幀率、paint 次數與記憶體，並測低階設備。

## 從頭做一次

1. 挑一個動畫，錄製修改位置或尺寸時的 Layout／Paint；改成 transform／opacity 再錄一次。比較掉幀、paint 次數及 Layer 數量。
2. 若需要 will-change，只在動畫前短暫設定，結束後移除；再檢查記憶體是否維持穩定。
3. 對多個同時動畫的卡片做壓力測試。若圖層增多導致 GPU 記憶體或合成時間上升，就需要減少同時動畫或圖層數。

## 如何判斷做對了

`translateZ(0)` 不是通用加速開關；先有 paint 瓶頸的證據再引入。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 3-73～3-83

### 3-73～3-76：硬體加速是特定工作交給 GPU

書中從流暢動畫切入，提醒優先用 `transform` 而非頻繁改 `top`、`left`、`width`、`height`。GPU 擅長並行處理圖形工作，但「用了某個 CSS 屬性」不表示所有工作都由 GPU 執行。書中教讀者在 Chrome 設定與 `chrome://gpu` 查看硬體加速狀態，再檢查瀏覽器實際是否把相關繪製／合成工作交給 GPU。現代版本選單和資訊頁面可能不同，實測應以目前 Chrome 的工具為準。

### 3-77～3-79：合成層的代價與 `will-change`

書中用 `translate3d` 作促使元素獨立成層的舊式技巧，隨即指出大量建立圖層會增加記憶體，尤其在行動裝置可能得不償失。`will-change: transform` 的語意更明確：在即將變動前給瀏覽器提示，讓它有機會預作準備。書中提出三個限制：不要加在根本不會變動的元素；變動結束後可移除提示以釋放資源；持續動畫才考慮長時間保留。`will-change` 本身不是「強制 GPU 加速」開關。

### 3-80～3-83：用壞動畫與好動畫比較

案例建立大量表格列，點擊後重新排序。一版直接反覆改每列的 `style.top`，另一版用 `transform: translate(...)` 並對相關元素給 `will-change` 提示。書中提供 Bad／Good／Very Bad demo，強調若把 `will-change` 加到所有元素，可能因圖層與記憶體暴增使效能更差。驗證時應看 FPS、Layout/Paint/Composite 耗時與記憶體，不要只因 CSS 裡出現 `translate3d` 或 `will-change` 就認定改善。

## 問題與解答：GPU 加速的適用條件

**問題 1：何謂硬體加速，前端能直接命令 GPU 嗎？** 瀏覽器可將某些圖層的合成工作交由 GPU 執行；前端選擇較適合合成的動畫屬性，例如 `transform`、`opacity`，但是否建立圖層由瀏覽器決定。它不能消除所有 layout 或 paint。

**問題 2：`will-change: transform` 應該永久加在所有元素嗎？** 不應。它是可能即將變更的提示，可能增加圖層和記憶體。只對確實要動畫的元素短時間使用，動畫結束後移除；看 layer 數、記憶體和幀時間是否真的改善。

**問題 3：為何 `translateZ(0)` 不是萬用加速開關？** 強迫許多元素成層可能讓 GPU 記憶體不足、合成成本上升，甚至使掉幀更嚴重。先找有問題的動畫，再局部修改，與原版 trace 比較。

**問題 4：如何做公平的動畫實驗？** 在同一裝置、相同元素數與操作下錄製「改 `top`」與「改 `transform`」版本，檢查 FPS、長任務、Layout、Paint、圖層與記憶體。若只提高 FPS 但記憶體大量增加，仍須評估取捨。
