---
tags:
  - javascript
  - Test
  - 前端效能優化
---

# [FE] 前端效能優化-5

[Web 前端效能優化大補帖筆記](https://www.books.com.tw/products/E050147683)

## DevTool Debugging & 節流
## 8-1 DevTool 
### Chrome DevTool Performance Tab
* 點選錄製按鈕，可以看到網頁的CPU、記憶體、Frame Rate等使用量與指標，適合監測頁面上的某些行為與功能
### FPS
* 畫面上方的紅色Bar：為FPS
* 如果出現粉紅色or紅色組成的bar，代表這頁面可能有掉偵的狀況，有可能導致動畫不平順甚至卡頓，嚴重影響使用者體案，是我們該避免的
* 正常約16.7ms
* 可以去看細部的rendering painting，來確認狀況
### CPU
* CPU主要要看到上方波浪部分
* 下方也有圓餅圖可以讓你知道狀況
1. System：瀏覽器內部的工作
2. Idle：Idle Time
3. Scripting：執行JS與事件處理
4. Painting：圖像處理、畫面繪製
5. Rendering：頁面樣式計算
6. Loading：載入與處理HTML

### Memory
* 點選上方的memory，可以看到JS Heap的狀況，也可以觀察大概是哪些操作導致記憶體用量飆升

### Frame
* 中間區塊的Frames Section顯示了頁面中每一次UI update的Screenshot，而每次UI update又可以被稱作一個「frame」。當UI長時間被卡住稱作Long Frame。
* 點選其中一個frames(要點時間條那邊)，會顯示該frames的詳細資訊。

### Timing
* DCL：DOM Content Loaded：HTML被載入且解析完畢的時間點
* FP：First paint：任何一個像素被繪製到頁面上的時間，例如頁面的background color
* FCP：First Contentful Paint：首次內容繪製：當瀏覽者到達網站之後，首次顯示網站內容需要的時間。因第二次有可能快取，所以測量第一次
* LCP：Largest Contentful Paint：計算網頁可視區域中最大元件的載入時間，也就是頁面的主要內容被使用者看到的時間，是速度指標
* L：onLoad：代表解析HTML後請求的資源都載入完成的時間點
* 最下方有Total Blocking Time：代表瀏覽器主執行緒的時間總和，我們會希望這個時間越短越好

### Experience
* 在這之中會有Layout Shift，也就是Core Web Vitals中大家在意的CLS

### Network
* 依照順序會顯示各個花費的時間和資源的依賴關係，如果點擊任一資源可以看到更詳細的資料。如：URL、Duration、Priority、Mime Type、Encoded Data、Decoded Body

### Main
* 呈現主要執行緒的CPU task，並且採用倒轉的火焰圖形式呈現。如果出現紅色的代表這裡可能執行時間過長。有時候點擊下去會指出是哪個程式過長，讓我們可以更快速debug找出淺在的問題

## 8-2 面對大流量需求，前端可以做什麼
### 作為後端的節流裝置
* 後端：開多台機器分流、資料庫採用讀寫分離架構來分散壓力。
* 前端：優化角度是從伺服器拿到網頁相關資源後，盡量降低頁面渲染時間、盡量達到較好的效能資源，並提供良好的使用者體驗，又或者像是頁面流暢度這種跟使用者比較有關的體驗

### 如何做到節流
* 靜態資源的合併與壓縮
* 盡量減少HTTP請求數量
* 利用各種Cache機制
* CDN
* 避免高頻請求
* Debounce：確保耗時的任務不會被頻繁觸發，而導致網頁效能停滯。設定一個時間區段，當使用者在輸入後過了該時段還沒有下一次事件時，才會呼叫對應的回呼函式
* Throttle：節流。減緩事件觸發的方法，確保某個函式在指定時間內只會被叫一次。離如無限滾動

## 防抖 vs 節流
* Debounce：防抖: n 秒內只運行一次，若在 n 秒內重覆觸發，只有一次生效。使用情境：輸入匡
* Throttle：節流: n 秒後在執行該事件，若在 n 秒內被重覆觸發，則重新計時。使用情境：無限滾動






