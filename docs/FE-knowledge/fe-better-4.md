---
tags:
  - javascript
  - Test
  - 前端效能優化
---

# [FE] 前端效能優化-4

[Web 前端效能優化大補帖筆記](https://www.books.com.tw/products/E050147683)

## web workers & webAssembly

## 6-1 web workers

### 好處

- 等於開一條新的執行緒來執行 JS，兩條執行緒不會互相影響，並且可以透過 onMessage、postMessage 等 API 做訊息的溝通，達到平行運算能力

### webworkers 限制

- 不能存取 DOM、document、window、parent 等資源
- 主頁面與 workers 得資源不能共享
- 採用 share-nothing 模型，必須使用 postMessage & onMessage 等 API 來溝通
- 同源限制：workers 使用的 script 不能來自其他網站

### 資料的傳送

- 使用 postMessage
  - 可以傳送的資料包含 JS 的 object、Blob、ArrayBuffer 等二進位制資料
  - 這些資料會透過 Deep Copy 方式傳送
- SharedArrayBuffer：不同執行緒共享資料

### 使用場景

- 複雜的排序與 index
- 機器學習
- 加密與解密
- 圖片操作
- 遊戲開發
- Web AR/VR
- Long Polling
- WebAssembly

### Comlink

- 為 google 開發，讓使用 web Workers 更為方便且抽象的套件

## 6-2 WebAssembly

### 介紹

- 一種新的低階程式語言，可在今日的網頁瀏覽器中被執行。
  - 能以接近原生應用程式的效能執行，並提供 C/C++/Rust 等語言一個建構目標，使他們能在 web 上被執行，並也被設計可與 JS 共存，允許兩者一起工作

### 適用場景

- AR/VR
- 遊戲開發
- 數學計算
- IOT
- 區塊鏈
- 邊緣運算
- 圖片與影像的編輯操作

### Web 開發者的選擇

- AssemblyScript
- 會存成 wasm 檔案

### 快取 wasm 模組

- web Client 端使用 WebAssembly 模組時可以搭配快取將編譯後的 WebAssembly 模組存起來，如此一來就不需要每次都要重新下載與編譯，可加快網站效能
- 一般 localStorage、SessionStorage 是有容量大小限制，比較不適合
- 建議使用 indexedDB 來快取編譯過後的 webAssembly 模組

### 缺點

- 不容易 debug、檔案大小過大

## 7-1 認識 JS 的記憶體管理機制

- 因為瀏覽器可以迅速啟動與關閉，而且 JS 有垃圾回收機制，常讓前端開發者忽略 JS 的記憶體管理機制與記憶體洩漏帶來的危險性，有時應用的效能瓶頸可能就產生了

### 在 JS 中，資料是如何儲存的

#### 記憶體的生命週期

1. 分配程式需要用到的記憶體空間
2. 使用分配到的記憶體空間（讀寫操作）
3. 當不會再使用時要釋放被配置的記憶體空間

#### Stack & Heap

- JS 引擎會將記憶體分成兩個區塊
  - 程式碼空間
  - Stack & Heap

```js
const it_home = "ironman";
// it_home：存在程式碼空間的記憶體
// 'ironman' 會被存在stack & heap
```

- Primitive Type：放置於 stack 中（有變數，但是 value 是存 heap 的位置）
- Reference Type：放置於 heap 中（object 存在這裡）
- string：存在 Heap 中，且 V8 會維護一個字串的 hashMap，如果是相同的字串，就會引用相同的記憶體位置
- number：像 small Int 會存在於 stack 中，其他類型則存在 heap 中

### 為何不把所有資料存到 Stack？

- 如果 Stack 過於肥大，會影響 context switch 的執行效率，連帶影響整個程式
- 當 function 執行完，JS 引擎會執行環境切換，將指針移到下一層執行環境，也就是全域執行環境，會回收 function 執行環境和 stack memory

### Garbage Collector

- 追蹤記憶體分配的使用情況，以便自動釋放一些不再使用的記憶體空間
- MDN：GC 是盡量做到自動釋放記憶體的空間，這件事不可判定，也就是不能單純透過演算法來解決

### Garbage Collector 工作流程

- 依據不同執行環境、語言，只能盡量找出最適合 GC 演算法，以盡量達到最好的回收效果
- 在 V8 引擎中，heap 被分為兩個區域：`New Space` & `Old Space`。
  - New Space：存放存活時間較短的物件，這裡回收速度比較快，但空間比較小，大概只有 1~8MB 左右，存在這的物件叫做`Young Generation`
  - Old Space：放存活時間較久的物件，這些物件是在 New Space 中經過幾次 GC Cycle 並成功存活後才被移到 Old Space，在這邊做垃圾回收效率比較差，因此他執行 GC 的頻率相較於 New Space 較低，而在 Old Space 中的物件也被稱為`Old Generation`
  - Young Generation：Scavenge Collection 演算法
  - Old Generation：Mark-Sweep Collection 演算法

### Young Generation : Scavenge Collection 演算法

- 將 Young Generation 分為「物件區域」與「空閑區域」
- 新存入記憶體的物件會被放到物件區域，當物件區域快要 overflow 時，就得執行一次 GC。要做 GC 要先標記出哪些物件是應該要被回收的垃圾，標記出垃圾後才會正式進入記憶體清理階段，GC 會把仍然存活的物件 Copy 到空閒區域並且排序
- Copy & Sort 類似電腦的磁碟重組，是一種整理記憶體的行為
- to-know:
  - 每次執行 Young Generation 的垃圾回收都需要執行 Copy&Sort 這些相當耗時的操作，因此為了耗能，通常 Young Generation 的空間會分配較小
  - 而因為Young Generation分配的空間較小，物件區域容易被佔滿，並必須執行垃圾回收，這對效能有可能是個影響，所以通常將經歷兩次GC仍然存活的物件的移動到Old Generation

### Old Generation：Mark-Sweep 演算法
* 主要有兩種物件
  1. 從Young Generation轉移過來的物件
  2. 佔用記憶體空間較大的物件有機會直接被送到Old Generation
* 主要為「標記」&「清除」兩個步驟，標記就是只從根元素開始遞迴尋訪這組根元素。在這個過程中，有被造訪的就是仍然需要存活的物件，而沒有被造訪的元素則判定為垃圾數據，應該要被GC給清除。
* 標記之後，下一階段就是將垃圾給清除掉

### Mark-Compact
* Mark-Sweep缺點：清除之後，產生不連續且碎片化的空間
* 主要是在標記之後，將存活的物件往記憶體的其中一端去移動，整理出連續空間

### Incremental Marking
* GC是由主執行緒所負責，所以在執行垃圾回收時，主執行緒不能做其他事（會造成卡頓）
* V8透過Incremental Marking，交替執行GC與Script的方式來解決使用者覺得卡頓的問題

### 如何在JS中防止記憶體洩漏
* 正確移除事件監聽器
* 不當的全域變數（當全域變數成長到一個量體時，伺服器有可能因為記憶體使用量過多卻沒有正確釋放而影響效能）
* 在不使用前端框架的狀態下，有時候可能會把DOM Node存在像物件這樣的資料結構中
* 老舊的瀏覽器or 有缺陷的瀏覽器擴充套件
* chrome記憶體用量

## 7-2前端渲染架構
### CSR：Client Side Rendering（CSR）
* SPA，如今只會放入一個tag當作容器
* server回傳只包含容器的HTML。瀏覽器依據HTML下載JS Code。瀏覽器執行React Code。執行完畢後頁面才完整呈現與具有互動性
* 透過路由決定該渲染出哪些元素在畫面上或是該抓取哪些資料，而routing過程也不用再去重新抓取頁面造成頁面反白，使用者體驗大大提升
#### 問題：SEO分數低落
* 問題：因為HTML只有容器在那邊，所以爬蟲只會看到空空的HTML tag
* 優化：SPA的SEO優化。像是在web Server檢測request Agent是不是爬蟲，是就另外準備好HTML file給爬蟲程式。如果Agent不是搜尋引擎，爬蟲就回傳原本要給CSR的容器檔案，再到前端做渲染
* 優化：lambda@Edge或是cloudfare Wrokers這類的edge serverless服務做pre-rendering
* 優化：Google的Second wave of indexing(first wave of indexing是爬蟲)

### Server Side Render（SSR）
* 傳統的網站是透過在伺服器端處理好資料與邏輯，在直接編譯成HTML檔案，回傳時就是使用者看到完整的HTML
* 問題：換頁時會反白與閃爍，萬一效能又不好，使用者可能會直接離開
* 解法：Isomorphic SSR（混合式SSR）
* 流程：
  1. 在server端渲染出帶有基本資料的HTML，送到前端進行Hydration，讓網站可以有互動性。因為在Server端就先產生了基本的資料，SEO可以解決
* SSR不必等到JS執行完畢才能讓使用者看到畫面，在Server回傳HTML後使用者就能看到畫面，但因JS還沒好，所以不具有互動性。但讓使用者先看到畫面，再利用感知時間去load js，可以減少使用者的跳出率。
* 缺點：ssr有render server，而維護此伺服器是需要成本的，尤其遇到大流量時，對伺服器來說是負擔（但如果一直都要在server渲染畫面，而這畫面又不常更動，可以用SSG）

### Static Site Generation（SSG）
* 在build time時打包成一個有完整內容的HTML檔案，並在之後的Client Request共用這個HTML，這種方式也被稱作pre-rendering
* 有較好的快取機制，例如適合放到CDN上，當然因為事先產生好內容也有利於SEO。較適合內容不需要經常變換的頁面（如blog、形象網站），而當web app越來越大時，打包時間越來越長也是要考量的問題

### Incremental Site Rendering（ISR）
* 目的：提到SSG如果有幾千個頁面，一但資料有改動就要重打包，會很可怕，因此新的ISG架構就出現了
* 概念：混用SSR、SSG的技術
  * 一樣使用者在request時，會先回傳fallback畫面給使用者，同時也會去抓取需要的資料，等資料好後，完整的頁面可以拿到CDN做快取，就跟SSG一樣

### Streaming Server Sider Rendering & Selective Hydration
* SSR問題：
  * 在server端要拉取所有需要的APi才開始組裝HTML
  * 在client端必須載入完所有JS才能做hydration
  * 必須等所有的components都完成hydration之後頁面才可以互動
* 讓伺服器可以用streaming的方式傳送頁面內容，讓瀏覽器可以漸進式去接收chunks，當瀏覽器收到chunks Data時就可以開始進行渲染，不用等整份HTML渲染完成，因此會有比較快的FP、
FCP、TTI
* Selective Hydration：解決client端必須載入完所有JS才能做hydration。當某些元件的資料已經透過streaming傳送到client端時，就可以直接開始hydration

### 不同架構對網站效能與指標的影響
#### Time to First Byte（TTFB）
* 代表發出頁面請求後到接收到response的第一個byte時間總長度。這個過程包括DNS resolve、TCP connection、發出request到獲得response的第一個byte時間
#### First Paint
* 任何一個像素被瀏覽器繪製到頁面上的時間，例如background-color
#### First Contentful Paint
* 首次內容繪製，首次顯示網站內容需要的時間，也是瀏覽器第一次顯示文字或圖片的時間。第二次可能有快取所以不是這麼準
#### Time to Interactive
* 頁面從不能互動到可以互動性的時間

#### SSR
* 優：FP、FCP、TTI
* 缺：TTFB

#### CSR
* 缺：FCP、TTI

#### SSG
* 皆好

### 如何選擇架構
* 視情況
* CSR vs SSR：例如如果server處理事情太多，反倒會讓網頁的載入速度變慢，因此也建議只需要在server端處理對SEO相對重要的資料，其他的部分可以在client端用CSR渲染
* SSG vs SSR：SSG較好，因為他已經有產好的HTML檔案，但如果頁面會頻繁變動，就不適合SSG，此時用SSR去呼叫API產生內容會比較適合


