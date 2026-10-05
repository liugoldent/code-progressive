---
sidebar_position: 2
title: "3-2 瀏覽器渲染引擎的運作機制"
description: "渲染流程優化：瀏覽器渲染引擎的運作機制 的原理、操作、判讀與練習。"
---

# 3-2 瀏覽器渲染引擎的運作機制

> 學習目標：根據渲染管線判斷樣式變更會造成 layout、paint 或 composite。

**核心觀念：** HTML 與 CSS 解析後形成可供渲染的資料，接著進行 style、layout、paint、composite。不同屬性變更觸發不同工作；寫入樣式後立刻讀取幾何資訊，可能迫使瀏覽器同步 layout。

**實作與驗證：** 錄製卡頓場景，辨認 Recalculate Style、Layout、Paint 的時間。將尺寸讀取放在前、DOM 寫入放在後，比較 frame time。

**常見誤區：** 不要推斷所有 transform 動畫都零成本；獨立圖層與繪製仍需檢查。

### 強制同步 Layout 的典型形狀

```js
// 容易反覆觸發同步量測
items.forEach((item) => {
  item.style.width = `${container.offsetWidth}px`;
});

// 先讀，再批次寫
const width = container.offsetWidth;
items.forEach((item) => { item.style.width = `${width}px`; });
```

實際效益仍看 DOM 規模與瀏覽器最佳化。改寫後應比較 Layout 總時間及掉幀情況，而不是只看程式碼看起來較整齊。

延伸：[Day 08 原系列筆記](../../day-08.md)。

## 原理拆解

瀏覽器通常先解析 HTML／CSS，再計算樣式、幾何布局、繪製像素和合成畫面。改元素尺寸會影響周圍節點，常需要 layout；改背景色常需要 paint；改 transform／opacity 常可用合成處理。這些是常見路徑，不是每個瀏覽器與每個頁面都固定如此。同步讀取幾何值會要求瀏覽器給出最新答案，若前面有未處理的樣式寫入，就可能立即執行 layout，形成 layout thrashing。

## 從頭做一次

1. 製作一個會移動元素的小實驗，先用 left/top，再改用 transform。各錄一份 trace，比較 Layout、Paint 與 Composite Layers。
2. 檢查程式是否在 style 寫入之後立即讀 offsetWidth、scrollHeight 或 getBoundingClientRect。將幾何讀取集中後再修改樣式，減少強制同步 layout。
3. 若大型列表每次更新都使多數節點重算，先縮小更新範圍或使用虛擬化。用 frame time 和 dropped frames 驗證，而非只數 DOM 行數。

## 如何判斷做對了

transform/opacity 常較容易由合成處理，但仍可能需要新圖層與記憶體；不能保證完全沒有成本。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 3-9～3-21

### 3-9～3-12：Renderer 程序與站點隔離

書中先教讀者從 Chrome 工作管理員觀察不同程序，再說明跨來源 iframe 可能被放入獨立 Renderer，這是 Site Isolation 的一部分。接著補充「每個分頁獨立程序」不是絕對規則：同站點的頁面在某些情況可能共用程序。此處要區分站點、來源與程序配置三件事；程序數不是前端應用可以簡單指定的效能參數。

### 3-12～3-14：從 HTML、CSS 到 Layout 與 Layer

頁面導航取得 HTML 後，Renderer 解析 HTML 得到 DOM，解析 CSS 得到 CSSOM，兩者共同形成供渲染使用的樹，再計算元素幾何位置與尺寸。書中用簡化流程圖把 DOM、CSSOM、Render Tree、Layout、Paint 串起來；頁 3-13～3-14 進一步說明瀏覽器會依繪製與合成需求產生 Layer Tree。Layer 並非「每個 DOM 節點各一層」，而是依瀏覽器策略分層。

### 3-15～3-16：光柵化與合成

書中將 Paint 後的步驟拆開：瀏覽器產生繪製指令，光柵化把相關區域轉成像素，Compositor 組合圖層並把結果交由 GPU 顯示。它也解釋 viewport 與較大頁面：瀏覽器不一定每次把整張長頁面全部重新光柵化，而可能分區處理。這讓讀者理解為何某些動畫可在合成階段完成，另一些卻會引發主執行緒的版面或繪製工作。

### 3-17～3-19：Reflow、Repaint、Compositing 的成本層級

書中把變動大致分成三類：

- 改 `width`、`height`、`position`、`left`、`top` 等幾何屬性，常需重新計算 Layout，後續 Paint 與合成也可能跟著執行。
- 改顏色等外觀屬性而不改幾何，通常可跳過 Layout，但仍要 Paint 與合成。
- `transform: translate(...)` 等變動在合適情況下可由合成階段處理，避開 Layout 與 Paint。

這是理解成本的模型，不是每個 CSS 屬性在每個瀏覽器都必然走完全相同路徑；要以 DevTools trace 驗證。

### 3-19～3-21：避免強迫同步排版

書中建議批次修改 style，並把需要的尺寸讀取集中在寫入之前。頁 3-20～3-21 的例子反覆讀元素高度、立刻寫入另一元素，造成多次 Reflow；改成先讀完全部高度再一起寫，可顯著減少 Layout 次數。這不是說「只准讀一次 DOM」，而是要避免讀寫交錯導致瀏覽器反覆同步計算。書中也引導讀者查 CSS trigger 清單、在 DevTools Performance 中觀察 Layout 次數與耗時。

## 問題與解答：渲染流水線

**問題 1：瀏覽器拿到 HTML 後為何不能立刻畫出畫面？** 還需解析 HTML 和 CSS、計算樣式、決定元素幾何位置，再繪製與合成。某些資源也會影響流程。不同階段的時間要在 Performance trace 中分開看，才能知道是 CSS、Layout、Paint 還是 JS 拖慢。

**問題 2：改 `top` 和改 `transform` 有什麼差別？** 改幾何位置可能觸發 layout、paint 和 composite；適合的 `transform` 動畫有機會主要走合成階段。但圖層管理也有成本，不能不量測就宣稱所有 transform 都免費。

**問題 3：什麼是強迫同步排版？** 程式先修改樣式，接著立即讀取 `offsetHeight`、`getBoundingClientRect()` 等幾何資訊，瀏覽器可能不得不當場完成尚未處理的 layout。若在迴圈裡反覆「寫→讀」，成本會放大。把讀取集中在前、寫入集中在後，再比較 Layout 時間。

**問題 4：Compositing 為何不等於完全沒有成本？** 圖層可能需要額外記憶體、光柵化與合成工作。若太多元素各自成層，記憶體與 GPU 負擔會上升。要同時檢查 frame time、paint 和 layer 數。
