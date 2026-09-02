---
sidebar_position: 2
title: 前端效能優化
description: 《今晚，我想來點 Web 前端效能優化大補帖！》30 篇系列文精華整理。
---

# 前端效能優化

> 本文整理莫力全 Kyle Mo 的 iThome 鐵人賽系列《今晚，我想來點 Web 前端效能優化大補帖！》。內容改寫成「觀念、實務重點、複習問題」，方便快速複習；原系列發表於 2021 年，實際專案仍應確認瀏覽器支援度與最新指標定義。

## 一張圖記住整套優化思路

前端效能不是單點技巧，而是一條完整鏈路：

```text
先量測
  ↓
減少傳輸量與請求成本
  ↓
安排資源載入優先序
  ↓
降低渲染與主執行緒工作
  ↓
利用快取、CDN、HTTP 與邊緣運算縮短等待
  ↓
持續監控、除錯與防止退化
```

## 第一階段：先知道為什麼慢、慢在哪裡

### Day 01｜系列地圖

**精華：** 效能優化涵蓋資源體積、網路、瀏覽器渲染、JavaScript 執行、快取及架構。不要一開始便隨機套技巧，應先建立整體地圖。

**解答：** 採用固定流程：先以 Lighthouse、Performance panel 與真實使用者資料建立 baseline，再從傳輸、載入、渲染、執行、快取五層找最大瓶頸。一次只改一個變因，重新量測後才保留修改。

**複習：** 任何優化都要能回答：改善哪個指標、犧牲什麼、如何驗證？

[閱讀原文](https://ithelp.ithome.com.tw/articles/10264961)

### Day 02｜為什麼前端需要效能優化？

**精華：** 速度直接影響使用者體驗、留存、轉換與搜尋能見度。開發者的高階設備與網路容易掩蓋真實使用者的困境。

**解答：** 把效能寫成可驗收需求，例如限制首屏資源量、互動延遲與版面位移；測試時使用低階裝置、網路節流與冷快取，並蒐集真實使用者指標。這能避免只在開發者電腦上「感覺很快」。

**實務：** 測試時納入低階手機、慢速網路、冷快取及真實地區；將效能設為產品需求，而不是上線後才處理的美化工作。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10265891)

### Day 03｜Lighthouse 與自動化效能檢測

**精華：** Lighthouse 等工具把「感覺很快」轉成可追蹤的指標。Lab data 適合重現與除錯，真實使用者資料則反映實際環境，兩者不能互相取代。

**解答：** 本機用 Lighthouse 找問題與重現；CI 用 Lighthouse CI 設定門檻阻止退化；正式環境以 RUM 蒐集使用者資料。三者分別負責診斷、守門與驗證，不應只看一次 Lighthouse 分數。

**實務：** 在 CI 設定 performance budget，避免 bundle、圖片或關鍵指標在每次改版中悄悄退化。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10266656)

### Day 04｜Core Web Vitals 與 RAIL

**精華：** 指標應對應使用者感受：內容何時出現、互動是否即時、畫面是否穩定。RAIL 從 Response、Animation、Idle、Load 四個面向分配時間預算。

**解答：** 載入慢先檢查關鍵資源與伺服器回應；互動慢找主執行緒 long task；動畫卡頓減少每幀工作；CLS 高則為圖片、廣告與動態內容預留尺寸。依症狀處理對應階段，而不是為了總分亂改。

**複習：** 不要只追總分；先找出使用者正在等待、卡頓或被版面位移打斷的場景。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10267350)

## 第二階段：減少下載與資源浪費

### Day 05｜Minify 與 Uglify

**精華：** 移除空白、註解、冗長名稱可降低 JavaScript/CSS 傳輸量；混淆名稱主要是體積與可讀性處理，不等於安全保護。

**解答：** 啟用打包器 production mode，對 JavaScript/CSS minify，伺服器再啟用 Brotli 或 Gzip。部署 source map 到錯誤追蹤服務而非公開暴露敏感原始碼；密鑰與商業機密不能靠 uglify 保護。

**實務：** 由 production build 自動完成，保留 source map 供錯誤追蹤，並比較壓縮前後的 transfer size。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10268059)

### Day 06｜圖片最佳化

**精華：** 圖片通常是頁面最大宗資源。正確格式、尺寸、壓縮率與響應式圖片，比單純把原圖塞進 CSS 縮小有效得多。

**解答：** 照片輸出 WebP/AVIF 並保留相容 fallback，圖示優先 SVG；依顯示尺寸產生多個版本，用 `srcset`/`sizes` 讓瀏覽器選擇。首屏主圖正常或高優先載入，其餘 `loading="lazy"`，所有圖片指定寬高避免 CLS。

**實務清單：**

- 依用途選 SVG、WebP/AVIF、JPEG 或 PNG。
- 使用 `srcset`、`sizes` 提供適合裝置的尺寸。
- 指定寬高或 aspect ratio，預留版面空間。
- 首屏關鍵圖優先載入，非首屏圖片延遲載入。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10268776)

### Day 07｜Image Sprites

**精華：** Sprite 將多張小圖合併，藉此減少 HTTP 請求；透過 background position 顯示其中一塊。

**解答：** 若專案仍有大量不常變動的小型點陣圖，可合成 sprite 並以 `background-position` 顯示；現代圖示則優先使用 SVG sprite 或元件。先從 Network 面板確認請求數真的是瓶頸，再決定是否採用。

**取捨：** HTTP/2 之後多請求成本下降，加上 SVG icon、字型圖示與元件化工具成熟，Sprite 不再是所有專案的預設答案。它仍適合大量固定小圖，但會增加維護與快取失效成本。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10269639)

## 第三階段：理解瀏覽器，安排載入與渲染

### Day 08｜瀏覽器架構與渲染管線

**精華：** HTML 形成 DOM、CSS 形成 CSSOM，接著建立 render tree，進行 layout、paint 與 composite。JavaScript 長任務與同步腳本會阻塞主執行緒。

**解答：** 用 Performance panel 找 style、layout、paint 或 script 中成本最高者。避免交錯讀寫 layout 資訊；先集中讀取尺寸，再批次修改 DOM。把大任務切片，動畫盡量只改 `transform` 與 `opacity`。

**複習：** 修改幾何位置容易觸發 layout；只改 transform/opacity 通常較容易交給合成階段處理，但仍需量測。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10270187)

### Day 09｜Resource Hints 與非阻塞腳本

**精華：** `preconnect`、`dns-prefetch`、`preload`、`prefetch` 用來提示瀏覽器未來需要的資源；`async` 與 `defer` 則改變腳本下載及執行時機。

**解答：** 應用主程式通常使用 `defer`；完全獨立的分析腳本可用 `async`。只 preload 首屏確定會使用的字型、樣式或主圖，跨來源資源搭配正確 `crossorigin`；下一頁可能使用的低優先資源才用 prefetch。

**判斷：**

- `defer`：依文件順序執行，適合依賴 DOM 的一般應用腳本。
- `async`：下載完立即執行，適合彼此獨立的腳本。
- `preload`：本次導覽確定需要的高優先資源。
- `prefetch`：未來可能使用，優先度較低。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10271044)

### Day 10｜Virtualized List

**精華：** 長列表不應一次建立所有 DOM。Windowing 只渲染可視區及少量 overscan，以占位高度維持捲動感。

**解答：** 計算目前 scroll offset 對應的起訖索引，只 render 可視資料加少量 overscan，外層保留完整總高度，內容以位移放到正確位置。實務上優先選用 `react-window` 等套件，並為每列提供穩定 key。

**實務：** 處理固定／動態列高、鍵盤焦點、捲動位置與無障礙；React 可使用成熟虛擬列表套件，不必每次重造輪子。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10271764)

### Day 11｜Lazy Loading

**精華：** 「等到真的需要才載入」可套用到圖片、iframe、資料及程式碼。Infinite scroll 解決資料下載量，virtualization 解決已下載資料造成的 DOM 與記憶體成本，兩者互補。

**解答：** 非首屏圖片使用 `loading="lazy"`；需要自訂提前量時以 Intersection Observer 監看 sentinel，接近 viewport 時抓下一頁。請求進行中與沒有下一頁時禁止重複觸發，卸載時取消 observer 與過期請求。

**實務：** 使用 `loading="lazy"` 或 Intersection Observer；不要延遲首屏關鍵圖，並用尺寸或 placeholder 避免版面位移。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10272251)

### Day 12｜高效能 CSS

**精華：** CSS 效能不只取決於 selector；更大的成本常來自大量 DOM、頻繁 style recalculation、layout 與 paint。

**解答：** 減少無用 DOM 與影響範圍過大的樣式變更；事件中先讀取所有尺寸，再一次寫入 class/style，避免 read → write → read 造成強制同步 layout。動畫用 class 切換並優先採用 transform/opacity。

**實務：** 降低 DOM 複雜度、避免 layout thrashing、批次讀寫 DOM、動畫優先使用 transform/opacity，並以 DevTools Performance 驗證瓶頸。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10272938)

### Day 13｜CSS GPU Acceleration

**精華：** 瀏覽器可把某些元素提升到獨立 compositor layer，使動畫不必反覆 layout/paint。`transform: translateZ(0)` 等技巧不是免費加速器。

**解答：** 對確定會做 transform/opacity 動畫的元素可適量使用 `will-change`，動畫結束後移除；不要全站強制提升 layer。用 Layers/Performance 檢查合成層數、paint 次數與 GPU 記憶體是否真的改善。

**取捨：** 過多 layer 會增加記憶體、上傳紋理與合成成本。只在確認 repaint 是瓶頸時使用，並檢查 Layers 與 FPS。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10273656)

## 第四階段：只交付真正需要的 JavaScript

### Day 14｜Code Splitting 與 Dynamic Import

**精華：** 將大型 bundle 依路由或功能切割，讓使用者先下載當下需要的程式碼。`import()` 會建立非同步 chunk，React 可搭配 `lazy` 與 `Suspense`。

**解答：** 以路由、大型編輯器、圖表或低頻功能作為切割邊界：`const Page = lazy(() => import('./Page'))`，外層提供 `Suspense` fallback。避免每個小元件都切 chunk；高機率下一步會用到的功能可在閒置或 hover 時預載。

**取捨：** 切得太碎會增加請求、瀑布與 loading 狀態。應依使用路徑切割，並預載高機率即將使用的 chunk。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10274467)

### Day 15｜Tree Shaking

**精華：** 打包器透過 ES module 的靜態結構移除未使用輸出。它依賴 production optimization、可分析的 import/export，以及正確的 side-effects 標記。

**解答：** 使用 ESM 的具名匯入，避免引入整個大型函式庫；套件若沒有頂層副作用，在 `package.json` 正確標示 `sideEffects`。最後用 bundle analyzer 確認未使用模組確實消失。

**實務：** 避免整包匯入大型函式庫；用 bundle analyzer 驗證，而不是只因為程式碼「沒有呼叫」便假設它已被移除。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10274978)

### Day 16｜差異化打包與檔案壓縮

**精華：** 現代瀏覽器不需要為舊環境下載所有 polyfill 與轉譯結果。差異化輸出可避免不必要的程式碼；Brotli/Gzip 則壓縮實際傳輸內容。

**解答：** 先定義瀏覽器支援矩陣，再由 browserslist/Babel 決定轉譯與按需 polyfill；不要無條件載入完整 polyfill 套件。靜態文字資源在 CDN/伺服器開 Brotli，並保留 Gzip fallback。

**實務：** 依 browserslist 與產品支援矩陣決定目標；伺服器提供壓縮並搭配正確 `Content-Encoding`，不要重複壓縮本來就高度壓縮的格式。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10275720)

## 第五階段：快取與快速交付

### Day 17｜HTTP Cache

**精華：** `Cache-Control` 決定 freshness，ETag/Last-Modified 用於重新驗證。檔名帶內容 hash 的靜態資源可長期快取，HTML 則通常需要較短策略或重新驗證。

**解答：** 內容 hash 的 JS/CSS/圖片設 `public, max-age=31536000, immutable`；入口 HTML 使用短 TTL 或 `no-cache`，確保能取得指向新版資源的新文件。API 依資料敏感度使用短快取、重新驗證或 `no-store`。

**複習：** `no-cache` 是「可存，但使用前需驗證」；`no-store` 才是不保存。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10276125)

### Day 18｜Service Worker Cache

**精華：** Service Worker 位在應用與網路之間，可攔截請求，實作 cache-first、network-first 等策略，支援離線體驗。

**解答：** 版本化 precache；靜態資源用 cache-first，頻繁更新資料用 network-first，能接受舊資料者用 stale-while-revalidate。`activate` 時刪除舊 cache，為離線與網路失敗提供 fallback，避免快取帶驗證資訊的敏感回應。

**風險：** 更新生命週期、舊 cache 清理及錯誤快取很容易造成「使用者永遠拿到舊版」。版本管理與 fallback 必須先設計。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10276666)

### Day 19｜Application Shell Architecture

**精華：** 先快取並呈現應用程式固定骨架，再載入動態內容，讓使用者更早看到可辨識的 UI。常與 PWA、Service Worker 及 client-side routing 結合。

**解答：** 將 header、navigation、基礎 CSS 與路由外框做成小型 shell 並 precache；啟動後立即顯示骨架，再請求頁面資料。骨架尺寸貼近內容，失敗時呈現離線或重試狀態，而不是空白頁。

**取捨：** Shell 不能大到變成另一個阻塞 bundle；骨架與真實內容尺寸要接近，避免跳動。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10277153)

### Day 20｜CDN

**精華：** CDN 從靠近使用者的節點提供內容，降低 RTT 並分擔 origin 流量。靜態資源最容易受益，動態內容則取決於可快取性與邊緣能力。

**解答：** 把 hash 靜態資源放 CDN 並設定長 TTL；HTML/API 依可快取程度設定 cache key、`s-maxage` 與 purge。確認 query、cookie、語系等是否需要進 cache key，避免不同使用者拿到錯誤內容。

**實務：** 設定 cache key、TTL、purge、版本化與 fallback；壓縮、HTTP 版本、TLS 與圖片轉換通常也可由 CDN 協助。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10277764)

### Day 21｜升級 HTTP 連線

**精華：** HTTP/2 的 multiplexing、header compression 與單連線並行改善 HTTP/1.1 的阻塞與連線成本。效能策略因此不再一味追求 domain sharding 或合併所有資源。

**解答：** 在伺服器/CDN 啟用 HTTP/2 或更新協定與現代 TLS；移除為 HTTP/1.1 設計的過度 domain sharding。保留合理 code splitting，並以 waterfall 檢查是否仍有串行依賴、慢 TTFB 或第三方連線成本。

**實務：** 協定升級不是萬靈丹；仍需減少無用位元組、避免過長依賴瀑布，並透過 Network waterfall 驗證。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10278186)

## 第六階段：移開主執行緒工作，選擇正確架構

### Day 22｜Web Workers

**精華：** Worker 在背景執行緒處理 CPU 密集任務，避免阻塞 UI；透過 `postMessage` 傳遞資料，不能直接操作 DOM。

**解答：** 把純計算封裝進 Worker，主執行緒只傳入資料並接收結果；大量二進位資料用 transferable objects 避免完整複製。Worker 內回報進度與錯誤，元件卸載或任務取消時呼叫 `terminate()`。

**適合：** 大量計算、資料解析、影像處理。短小工作可能不值得支付啟動與序列化成本；大型資料可研究 transferable objects。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10278559)

### Day 23｜WebAssembly

**精華：** WebAssembly 提供緊湊的二進位格式與接近原生的執行能力，適合把既有 C/C++/Rust 或計算密集模組帶到 Web。

**解答：** 只將可隔離且計算密集的核心（編解碼、影像、壓縮、科學運算）編譯成 Wasm，UI 與 DOM 協調留在 JavaScript。先基準測試 JS 版本，再計入模組下載、初始化與跨邊界呼叫成本比較。

**取捨：** DOM 密集、一般商業邏輯不會因改成 Wasm 自動變快；JS/Wasm 邊界、下載、初始化與除錯都有成本。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10279068)

### Day 24｜Web Rendering Architectures

**精華：** CSR、SSR、SSG、hydration 各自在首屏速度、互動時間、伺服器成本、快取與資料新鮮度間取捨。

**解答：** 靜態且可預先生成的內容用 SSG；需要 SEO 與即時個人化首屏可用 SSR；登入後高度互動、SEO 不重要的區域可 CSR。不要整站只用一種模式，並控制 hydration 所需 JavaScript。

**選擇方式：** 依頁面類型混用，而不是整站信仰同一模式：行銷內容偏靜態，個人化頁面可能 SSR，登入後高度互動區域可偏 CSR。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10279519)

### Day 25｜Edge-side Rendering

**精華：** 把渲染或部分計算移到靠近使用者的 edge，可縮短伺服器回應等待並保留動態內容能力。

**解答：** 適合在 edge 做地區導向、A/B 判斷、輕量個人化與可快取頁面渲染；資料也應在附近或有快取。先測端到端 TTFB，若每次仍需跨洲查主資料庫，應先改善資料位置與快取。

**取捨：** Edge runtime 有 API、執行時間、套件及資料存取限制；若資料庫仍在遙遠區域，渲染搬到 edge 不一定改善整體延遲。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10279929)

## 第七階段：記憶體、快取策略與除錯

### Day 26｜JavaScript 記憶體管理

**精華：** Garbage collector 只能回收「不可達」物件。意外保留參考的 closure、全域集合、事件監聽、timer、DOM 節點與 cache，會形成記憶體洩漏。

**解答：** 建立可重現操作，分別拍攝前後 Heap Snapshot，比較 retained size 與 detached DOM tree；沿 retaining path 找到仍持有物件的監聽器、timer、closure 或集合。於生命週期結束時解除監聽、取消訂閱並限制 cache 大小。

**實務：** 使用 Heap Snapshot、Allocation Timeline 比較操作前後；元件卸載時清理訂閱、監聽與計時器，並為 cache 設上限。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10280288)

### Day 27｜Stale-While-Revalidate

**精華：** 先立即回傳舊快取內容，同時在背景重新驗證並更新快取，兼顧回應速度與資料新鮮度。

**解答：** HTTP 可設定 `Cache-Control: max-age=..., stale-while-revalidate=...`；前端資料層則先顯示 cache，背景 fetch，成功後替換並通知 UI。權限、付款、即時庫存等不能容忍舊值的資料不要使用此策略。

**適合：** 能容忍短暫舊資料的內容；價格、庫存、權限等敏感資料須謹慎。UI 端也常以相同概念實作資料快取。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10280724)

### Day 28｜Runtime Performance Debugging

**精華：** 用 DevTools Performance 錄製真實操作，從長任務、call tree、bottom-up、layout、paint、FPS 與記憶體找證據。

**解答：** 先關閉不相關擴充功能並固定裝置／網路條件，錄製一次最小重現；由 Main thread 找超過一幀預算的 task，再用 Bottom-up 找最耗時函式。若時間在 layout/paint，回查造成失效的 DOM；若在 script，切片、減量或移出主執行緒。

**除錯流程：**

1. 建立穩定重現步驟。
2. 在一致環境錄製 baseline。
3. 找最長的主執行緒工作與依賴來源。
4. 一次改一項並重新量測。
5. 把結果加入持續監控或 performance budget。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10281074)

### Day 29｜高流量時前端能做什麼？

**精華：** 前端無法取代後端擴展，但能大幅降低 origin 壓力：CDN 與快取、靜態化、減少重複請求、請求去重、退避重試、載入降級及避免輪詢風暴。

**解答：** 靜態資源與可公開內容交給 CDN；相同 API 請求去重並設短期 cache；失敗重試採 exponential backoff 加 jitter，避免所有客戶同時重打。關閉非核心功能、降低圖片品質或更新頻率，保住登入、搜尋、結帳等主流程。

**實務：** 設計 graceful degradation；非核心圖片、推薦、動畫或第三方服務失敗時，主要流程仍應可用。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10281389)

### Day 30｜系列總結

**精華：** 效能優化應形成循環，而不是一次性專案：量測 → 找瓶頸 → 設預算 → 做最小有效修改 → 驗證 → 持續監控。

**解答：** 建立效能責任制度：PR/CI 檢查 bundle 與 Lighthouse budget，上線後監測真實使用者指標與錯誤，定期檢查第三方腳本及熱門路徑。發現退化時以相同測試案例定位到變更，修正後留下自動化守門條件。

**最重要的結論：** 不要為了「看起來很進階」而加技術。最佳解取決於使用者、裝置、網路、內容、架構與維護成本。

[閱讀原文](https://ithelp.ithome.com.tw/articles/10281701)

## 最後複習清單

### 載入階段

- 是否壓縮、切割並移除了不需要的 JavaScript？
- 首屏資源優先序是否正確？有沒有錯誤 lazy-load LCP 圖？
- 圖片是否使用正確格式、尺寸與響應式來源？
- 靜態資源是否有內容 hash、長期快取、CDN 與壓縮？

### 執行階段

- 主執行緒是否存在 long task？
- 長列表是否需要 virtualization，資料是否能 lazy load？
- DOM 是否過多？動畫是否反覆觸發 layout/paint？
- CPU 密集工作是否適合切片、Worker 或 Wasm？

### 架構與維運

- CSR、SSR、SSG、Edge 的選擇是否符合頁面需求？
- 是否同時具備 lab test 與真實使用者監控？
- CI 是否有 performance budget 防止退化？
- 高流量或第三方服務故障時，是否能降級而不中斷核心流程？

## 系列來源

- [今晚，我想來點 Web 前端效能優化大補帖！](https://ithelp.ithome.com.tw/users/20113277/ironman/3877)
- 作者：莫力全 Kyle Mo
- 2021 iThome 鐵人賽 Modern Web 系列，共 30 篇。
