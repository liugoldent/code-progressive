---
sidebar_position: 6
title: "3-6 延遲載入 Lazy Loading"
description: "渲染流程優化：延遲載入 Lazy Loading 的原理、操作、判讀與練習。"
---

# 3-6 延遲載入 Lazy Loading

> 學習目標：能為圖片、iframe、資料和程式碼分別選擇延遲載入策略。

**核心觀念：** 圖片、iframe、資料及低頻功能都可以延遲載入。非首屏圖片可用 loading=lazy；分頁資料可由 IntersectionObserver 監看 sentinel，需防止重複請求與處理結束狀態。

**實作與驗證：** 測冷快取初次頁面與捲到底部的等待。確保首屏 LCP 資源沒有被 lazy load，非首屏圖片則有尺寸預留和錯誤 fallback。

**常見誤區：** 延得太晚會讓使用者看到空白；延得太早又失去節省傳輸的效果。

### 無限載入的狀態機

至少區分 `idle`、`loading`、`error`、`done`。IntersectionObserver 觸發後先檢查是否正在載入或已無下一頁，再送請求；請求失敗要能重試，元件卸載時要停止觀察與取消過期請求。

```js
if (status === 'loading' || status === 'done') return;
status = 'loading';
// 請求下一頁；成功後合併資料並更新 done/idle，失敗時設 error。
```

另測很快捲動、網路斷線及空頁回應，避免同一頁被抓兩次或永遠停在載入中。

延伸：[Day 11 原系列筆記](../../day-11.md)。

## 原理拆解

Lazy loading 的核心是把尚不需要的成本移到較後面，但「需要」的時機由使用者體驗決定。圖片可以交給瀏覽器原生懶載入，資料分頁則需自己管理觀察器與狀態；大型功能程式碼可動態匯入。無限捲動應確保請求去重、最後一頁判斷、錯誤重試和鍵盤可用性。若預載距離太短，使用者快速捲動會看到空白；太長則提前下載大量資源。

## 從頭做一次

1. 在首頁列出首屏、接近首屏及完全離屏的資源；優先確保 LCP 主圖沒有 lazy load。對離屏圖片先使用原生 loading=lazy，預留尺寸。
2. 無限資料列表用 IntersectionObserver 監看底部 sentinel；加入 loading、error、done 狀態，以及重複請求防護與取消。
3. 測慢速網路下快速捲動，看是否出現長時間空白；測請求失敗與下一頁為空，確認有重試或完成狀態。

## 如何判斷做對了

懶載入節省的是目前不需要的資源；若延後高機率立即需要的內容，可能增加使用者可見等待。

## 自我檢查

- 我能否指出這個技巧改善的是傳輸、載入、主執行緒、渲染、記憶體，還是資料新鮮度？
- 我是否保存相同條件下的改動前後證據，並檢查副作用？

[返回本章目錄](./index.md) · [返回書籍版總覽](../index.md)

## 書籍逐頁核對｜紙本頁 3-47～3-62

### 3-47～3-49：延遲載入的對象不只有圖片

書中把 Lazy Loading 的核心表述為「等真正需要時再載入」。資料列表可等使用者接近底部再取下一批；圖片可等接近 viewport 再下載。這與上一節的 Virtualized List 分工不同：前者決定**何時取得資料／資源**，後者決定**目前在 DOM 中保留多少列**。書中舉 Imgur 滾動載入圖片，並介紹原生 `<img loading="lazy">` 與 iframe 的相同屬性。`auto` 交由瀏覽器決定、`lazy` 延後、`eager` 提早；首屏或 LCP 圖不能盲目設為 lazy。

### 3-50～3-51：Placeholder 與載入距離

延遲載入圖片仍要事先保留空間，否則下載完成後可能推開內容，造成 CLS。書中示範 `width`／`height`、模糊低解析預覽，以及 SVG 類的低品質預覽概念。若等圖片真正進入 viewport 才開始下載，慢網用戶可能看到明顯空白；可在接近 viewport 一段距離時提前載入。提前距離要依資源大小、網路與滾動速度調整，越早載入也會消耗越多非當下必要的流量。

### 3-52～3-57：Intersection Observer 的判斷條件

書中用一個畫面下方的方塊示範 Intersection Observer：先建立 observer，給 callback，再 `observe` 目標元素；當元素進入或離開觀察區，callback 收到 entries，可看 `isIntersecting`。比每次 scroll 都同步讀 `getBoundingClientRect()` 更適合做可見度觀察。選項中的 `root` 指定觀察容器，預設是 viewport；`rootMargin` 可擴大觸發區以提早載入；`threshold` 控制交疊比例，還可給多個門檻形成不同階段的回呼。目標不需再觀察時，書中示範 `unobserve` 移除。

### 3-58～3-62：無限滾動與 Windowing 合用

案例是作者的文章閱讀清單：用 Intersection Observer 監看最後一篇或列表尾端，接近底部時帶著最後一筆 id 請求下一頁資料；載入中和已無資料時要避免重複呼叫。這只處理下一批資料的取得；當清單長到很多篇後，仍可能有過多 DOM 節點，所以再搭配 Virtualized List。書中用 DevTools 的 Frame Rate 與 Memory 指標做前後比較：直接渲染大量元素時滾動卡頓、渲染耗時較高；Windowing 版本的幀率、記憶體與初始渲染時間較好。這些數字是書中那個 demo 的量測，不可直接當成所有網站的收益保證。

## 問題與解答：延遲載入不能延遲體驗

**問題 1：哪些內容可以 lazy load？** 遠離視窗的圖片、iframe、低頻功能和下一頁資料都可評估。首屏 LCP 圖、立即要用的互動程式則不應因延遲策略而更晚出現。先標出使用者進站後第一個任務，再決定載入邊界。

**問題 2：`loading="lazy"` 就夠了嗎？** 對一般非首屏圖片常是簡單起點，但仍要設定尺寸避免 CLS，並測從接近視窗到真正顯示的等待。資料載入與複雜元件可能需要 Intersection Observer 或明確的使用者觸發。

**問題 3：Intersection Observer 看的是什麼？** 它回報目標元素與指定 root 的交會狀態，可用 `rootMargin` 提前載入、用 `threshold` 控制交會比例。若 sentinel 進入視窗便取下一頁，要有 loading、hasMore 和錯誤狀態，避免重複請求或無限觸發。

**問題 4：延遲太早或太晚如何判斷？** 太早會在使用者永遠看不到前就消耗流量；太晚會留下空白或 spinner。測慢網路快速捲動時的等待，調整 `rootMargin`，並記錄首次載入位元組和真正用到內容的等待時間。
