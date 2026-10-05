---
slug: /react-job-bootcamp/frontend-performance
sidebar_position: 2
title: 前端效能優化
description: 《今晚，我想來點 Web 前端效能優化大補帖！》30 堂逐課筆記與實作地圖。
---

# 前端效能優化

這份筆記依照莫力全 Kyle Mo 的 [iThome 鐵人賽系列](https://ithelp.ithome.com.tw/users/20113277/ironman/3877)編排為 30 堂課。每堂保留原本的重點整理，並增加深入理解、實作與驗證、常見誤區。原系列發表於 2021 年；涉及指標、瀏覽器支援與工具行為時，請優先核對當前官方文件。

## 如何使用這套筆記

1. 先看 Day 01–04，建立量測基準與指標語言。
2. 按症狀選課：載入慢看資源、網路與快取；互動卡頓看渲染、JS 與 Worker；畫面跳動先查圖片尺寸及動態內容。
3. 每做一項修改，都留下測試條件、前後數字與副作用，避免只憑感覺判斷。

## 書籍版章節筆記

電子書實際分成 **8 章、31 小節**。如果你是跟著書讀，請從[書籍版章節地圖](./book/index.md)進入；下方 30 堂則是 iThome 原系列逐日整理。

## 30 堂課

| Day | 主題 |
| --- | --- |
| 01 | [系列地圖](./day-01.md) |
| 02 | [為什麼前端需要效能優化？](./day-02.md) |
| 03 | [Lighthouse 與自動化效能檢測](./day-03.md) |
| 04 | [Core Web Vitals 與 RAIL](./day-04.md) |
| 05 | [Minify 與 Uglify](./day-05.md) |
| 06 | [圖片最佳化](./day-06.md) |
| 07 | [Image Sprites](./day-07.md) |
| 08 | [瀏覽器架構與渲染管線](./day-08.md) |
| 09 | [Resource Hints 與非阻塞腳本](./day-09.md) |
| 10 | [Virtualized List](./day-10.md) |
| 11 | [Lazy Loading](./day-11.md) |
| 12 | [高效能 CSS](./day-12.md) |
| 13 | [CSS GPU Acceleration](./day-13.md) |
| 14 | [Code Splitting 與 Dynamic Import](./day-14.md) |
| 15 | [Tree Shaking](./day-15.md) |
| 16 | [差異化打包與檔案壓縮](./day-16.md) |
| 17 | [HTTP Cache](./day-17.md) |
| 18 | [Service Worker Cache](./day-18.md) |
| 19 | [Application Shell Architecture](./day-19.md) |
| 20 | [CDN](./day-20.md) |
| 21 | [升級 HTTP 連線](./day-21.md) |
| 22 | [Web Workers](./day-22.md) |
| 23 | [WebAssembly](./day-23.md) |
| 24 | [Web Rendering Architectures](./day-24.md) |
| 25 | [Edge-side Rendering](./day-25.md) |
| 26 | [JavaScript 記憶體管理](./day-26.md) |
| 27 | [Stale-While-Revalidate](./day-27.md) |
| 28 | [Runtime Performance Debugging](./day-28.md) |
| 29 | [高流量時前端能做什麼？](./day-29.md) |
| 30 | [系列總結](./day-30.md) |

## 整體診斷順序

```text
選定頁面／任務 → 記錄裝置、網路與快取條件 → 收集 lab 與真實使用者資料
→ 找最大的等待或卡頓來源 → 提出單一假設 → 修改 → 同條件重測 → 持續監控
```

**現行 Core Web Vitals：** LCP ≤ 2.5 秒、INP ≤ 200 毫秒、CLS ≤ 0.1 是「良好」門檻；應以真實使用者第 75 百分位分別檢查行動版與桌面版。實驗室檢測主要用於定位，不應把單次 Lighthouse 分數當成唯一成果。[官方定義](https://web.dev/articles/vitals)

## 最後複習清單

### 載入

- HTML、主圖、字型、CSS 及 JavaScript 的下載順序是否合理？
- 首屏主圖是否沒有被錯誤延遲載入？圖片是否提供尺寸、響應式來源與合適格式？
- 是否移除不需要的 JS，並對低頻功能做合理分割？
- 靜態資源是否使用內容 hash、壓縮、CDN 與長期快取？

### 互動與渲染

- 主要操作是否有長任務、強制同步 layout 或重複 paint？
- 大列表是否需要虛擬化？是否已驗證鍵盤操作與捲動體驗？
- CPU 密集工作是否適合切片、Worker 或 Wasm？

### 維運

- 是否保存基準值、trace、變更前後數據與測試環境？
- CI 是否設預算，正式環境是否監控真實使用者的 p75 指標？
- 高流量、離線或第三方失敗時，核心流程是否仍可用？

> UDN 線上閱讀器可確認書籍目錄，但完整書籍內文未逐頁核對。書籍版筆記依目錄編排，並以獨立的技術整理補充；30 天筆記則依 iThome 原系列整理。
