---
description: FE 面試
tags:
  - JS
  - frontend
---

# [FE] Interview V3

## 簡單說明 SSR 原理

- 是一種網頁渲染的方法，其原理是在伺服器端生成完整的 HTML 頁面，然後再將這些 HTML 頁面發送到客戶端，以提供更快的頁面加載速度和更好的搜索引擎優化（SEO）。

### SSR 的原理可以簡要描述為以下步驟：

- 接收請求：當用戶訪問網站時，伺服器接收到請求。

- 生成 HTML：伺服器使用事先定義好的路由和頁面組件，動態地生成完整的 HTML 頁面。這包括呈現內容、資料提取和填充模板。

- 填充資料：在生成 HTML 頁面時，伺服器可能需要從資料庫或外部 API 獲取必要的數據，並將這些數據填充到頁面中。

- 發送 HTML：生成的 HTML 頁面被發送到客戶端的瀏覽器。

- 客戶端互動：瀏覽器接收到 HTML 頁面後，可以立即顯示內容，同時開始加載 JavaScript 代碼。一旦 JavaScript 加載完成，網站可以變得交互式，並與用戶互動。

- 注水（Hydration）：當客戶端的 JavaScript 加載完成後，它可以重新使用伺服器生成的 HTML，並將其轉換為可交互的應用程式。這個過程稱為“注水”，可以保持頁面的狀態並支援客戶端互動。

### 優缺點

#### 優點

- 主要優點是它可以提供更快的首次頁面加載時間，因為用戶可以立即看到伺服器生成的 HTML 內容，而不需要等待 JavaScript 的下載和執行。此外，SSR 也有助於提高搜索引擎對網站的索引能力，因為搜索引擎可以爬取伺服器生成的 HTML 頁面。

#### 挑戰

- 挑戰，例如伺服器的計算負載增加、複雜性增加以及客戶端和伺服器端代碼的一致性等。

## JS 中的 Promise 是什麼?

- 處理異步操作的一種機制，它可以更優雅地處理非同步的任務，例如 AJAX 請求、文件讀取、定時器等。Promise 通常用於處理需要時間來完成的操作，並且可以更好地控制代碼的流程和處理錯誤。
- then：then是實例狀態發生改變時的回調函數，第一個參數是resolved狀態的回調函數，第二個參數是rejected狀態的回調函數
### 基本用法

```js
const promise = new Promise(function (resolve, reject) {});
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

### Promise.all
* 該 Promise 實例在可迭代物件中的所有 Promise 實例**都成功解決（resolved）時才會解決**，並且解決值是一個包含所有 Promise 實例解決值的陣列。如果**可迭代物件中有任何一個 Promise 實例被拒絕（rejected），則返回的 Promise 實例會立即被拒絕**，並且拒絕值是第一個被拒絕的 Promise 實例的拒絕值
```js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // 输出结果为 [3, 42, 'foo']
});
```

### Promise.race
* 這個靜態方法接收一個可迭代物件，並返回一個新的 Promise 實例。該 Promise 實例在可迭代物件中的任何一個 Promise 實例率先解決或拒絕時解決或拒絕，其解決值或拒絕值與率先完成的 Promise 實例相同。
* 可用於請求超時
```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "two");
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 输出结果为 'two'
});
```
```js
Promise
.race([requestImg(), timeout()])
.then(function(results){
    console.log(results);
})
.catch(function(reason){
    console.log(reason);
});
```

### Promise.allSettled
* 這個靜態方法接收一個可迭代物件，並返回一個新的 Promise 實例。該 Promise 實例在可迭代物件中的**所有 Promise 實例都解決或拒絕後才會解決**，並且解決值是一個包含所有 Promise 實例解決狀態的陣列，每個元素都是一個物件，包含 status 屬性表示狀態（fulfilled 或 rejected）和 value 或 reason 屬性表示解決值或拒絕原因。
```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, "error");
});

Promise.allSettled([promise1, promise2]).then((results) => {
  console.log(results);
  // 输出结果为
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'error' }
  // ]
});
```
### Promise.resolve
* 這個靜態方法返回一個解決狀態的 Promise 實例，其解決值是給定的值。如果給定的值是一個 Promise 實例，則返回該 Promise 實例；如果給定的值是一個 thenable 物件（即具有 then 方法的物件），則返回一個新的 Promise 實例，其行為與該 thenable 物件相同；否則返回一個解決狀態的 Promise 實例，其解決值是給定的值。
```js
const resolvedPromise = Promise.resolve(42);

resolvedPromise.then((value) => {
  console.log(value); // 输出结果为 42
});

```

### Promise.reject
* 這個靜態方法返回一個拒絕狀態的 Promise 實例，其拒絕原因是給定的原因。
```js
const rejectedPromise = Promise.reject('error');

rejectedPromise.catch((reason) => {
  console.log(reason); // 输出结果为 'error'
});

```

### 主要特點

- 狀態管理：Promise 有三種狀態：待定（pending）、已實現（resolved）和已拒絕（rejected）。初始時處於待定狀態，之後可以變為已實現或已拒絕。這使得我們可以追蹤操作的進度和結果。

- 鏈式調用：Promise 允許你通過 .then() 方法來註冊在操作成功後執行的函數，以及通過 .catch() 方法來處理操作失敗時的錯誤。

- 解決回調地獄：Promise 的鏈式調用可以幫助避免回調地獄（callback hell），使代碼更容易理解和維護。

- 支援並行操作：Promise 可以組合多個異步操作，以同時執行它們，並在它們都完成後執行後續操作。

- 錯誤處理：Promise 允許你使用 .catch() 方法來處理操作中可能出現的錯誤，使得錯誤處理更加優雅。而錯誤會一直傳遞下去，直到被捕獲為止

```js
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = "Hello, Promise!";
      if (data) {
        resolve(data); // 操作成功
      } else {
        reject("Error: Data not available."); // 操作失敗
      }
    }, 1000);
  });
};

fetchData()
  .then((result) => {
    console.log(result); // 成功時輸出 "Hello, Promise!"
  })
  .catch((error) => {
    console.error(error); // 失敗時輸出錯誤信息
  });
```

## Typescript 是什麼

- TypeScript 是一種開源的程式語言，它是 JavaScript 的超集，由 Microsoft 開發和維護。TypeScript 旨在提供更強大的靜態類型檢查，讓開發者能夠在編寫程式碼時捕捉到更多的錯誤，並提供更好的程式碼結構和可讀性。

- TypeScript 與 JavaScript 的主要區別在於它引入了靜態類型系統，這意味著在編寫程式碼時，你需要定義變數、函數、物件等的類型。這些類型註釋在編譯時進行類型檢查，可以幫助開發者在早期發現並解決潛在的錯誤。

- 儘管 TypeScript 強調靜態類型，但它仍然可以編譯成普通的 JavaScript 代碼，這意味著你可以在現有的 JavaScript 項目中逐步引入 TypeScript，並且也可以使用許多現有的 JavaScript 函數庫和工具。

## 請說明 Browser 中的 process thread 各自扮演什麼角色?

### Process（進程）：

在傳統的操作系統中，"進程" 是指一個正在運行的程序實例，它擁有自己的記憶體空間和資源。在瀏覽器環境中，每個標籤頁或窗口通常都會在自己的進程中運行，這樣可以確保一個標籤頁或窗口的當前內容不會影響到其他標籤頁或窗口。這種隔離可以提高安全性和穩定性。

### 每個瀏覽器進程通常包含以下主要組件：

- 渲染引擎（Rendering Engine）：負責處理和渲染網頁內容，將 HTML、CSS 和 JavaScript 轉換成可見的網頁。
- JavaScript 引擎（JavaScript Engine）：負責解析並執行 JavaScript 代碼。
- 網絡層（Network Layer）：處理網絡請求和響應，使網頁能夠載入外部資源。

### Thread（線程）：

在瀏覽器環境中，"線程" 是指在進程內部執行的輕量級執行單元。一個進程可以包含多個線程，每個線程可以獨立執行不同的任務。不同的線程可以同時進行，這樣可以實現多任務處理。

在瀏覽器中，主要有以下類型的線程：

- 主線程（Main Thread）：主要處理網頁的渲染、事件處理和 JavaScript 的執行。這個線程也稱為 UI 線程，因為它處理與用戶界面相關的操作。
- 網絡線程（Network Thread）：處理網絡請求和響應，以及執行一些網絡相關的任務。
- 渲染線程（Rendering Thread）：負責處理網頁的渲染工作，將 HTML 和 CSS 轉換成畫面。
- JavaScript 引擎線程（JavaScript Engine Thread）：負責解析和執行 JavaScript 代碼。
- 工作線程（Worker Thread）：這是一個獨立的線程，用於執行後台計算或處理大量的數據，從而不影響主線程的性能。

## Browser 中的 GPU 硬件加速作用是什麼?

- 通過將某些計算工作轉移到圖形處理器上，從而提高網頁和應用程式的性能和效能。傳統上，瀏覽器主要使用中央處理器（CPU）來處理網頁渲染、動畫、影像處理等任務，但是這些任務可能會對 CPU 造成負擔，導致性能下降。GPU 硬件加速的主要作用包括：

### 加速網頁渲染：

瀏覽器中的網頁元素，如 HTML、CSS、圖片等，需要被渲染成實際的畫面。使用 GPU 可以加速這些渲染過程，使畫面更快地顯示在屏幕上。

### 提高動畫效能：

動畫和過渡效果可以更流暢地運行，因為 GPU 能夠處理複雜的圖形變換和動態效果。

### 加速影像處理：

圖片的處理和壓縮、影像的濾鏡效果等工作可以交給 GPU 處理，從而減輕 CPU 的負擔。

### 運行 3D 和虛擬現實內容：

在瀏覽器中運行 3D 遊戲、虛擬現實內容或者其他需要大量圖形運算的應用程式，GPU 硬件加速能夠提供更高的幀率和更好的遊戲體驗。

### 解放 CPU 資源：

通過將圖形處理交給 GPU，可以釋放 CPU 的資源，讓 CPU 專注於處理其他任務，從而提高整體系統性能。

## 如何在 Browser 中使用 GPU 應用在畫面上

### WebGL（Web Graphics Library）：

WebGL 是一個基於 OpenGL 的 Web API，它允許你在瀏覽器中使用 GPU 進行 3D 圖形渲染和計算。你可以使用 JavaScript 和 GLSL（OpenGL Shading Language）來編寫 WebGL 應用程式。這對於開發瀏覽器中的遊戲、可視化工具和其他需要複雜圖形處理的應用非常有用。

### GPU.js：

GPU.js 是一個基於 JavaScript 的庫，它允許你在瀏覽器中使用 GPU 進行通用計算。你可以使用 GPU.js 來編寫並行運算的 JavaScript 代碼，並利用 GPU 進行高效的數值運算。

### WebAssembly（Wasm）：

WebAssembly 是一個二進制格式，可以在瀏覽器中運行高性能的代碼。你可以使用 WebAssembly 來編譯其他語言（如 C++、Rust 等）的代碼，並在瀏覽器中運行，從而利用 GPU 進行計算密集型的任務。

### 使用 CSS 3D 轉換：

CSS 3D 轉換可以讓你在瀏覽器中創建具有 3D 效果的元素。你可以使用 CSS 3D 轉換屬性，如 transform 和 perspective，來實現一些簡單的 3D 效果，而這些效果通常會利用 GPU 進行硬件加速。

### 使用 Canvas API：

Canvas API 允許你在瀏覽器中使用 JavaScript 繪製圖形。儘管不直接使用 GPU，但 Canvas API 可以利用瀏覽器的硬體加速功能來更高效地渲染圖形。

## 什麼是 Web worker?

- 一個瀏覽器提供的技術，它允許你在後台運行一個獨立的線程，以執行一些計算密集型的任務，而不會阻塞主線程（UI 線程）。這對於處理大量數據、執行複雜計算或其他需要長時間運行的操作非常有用，因為它可以提高網頁的反應速度和性能。

### 獨立線程：

Web Worker 在瀏覽器中運行在一個獨立的線程中，與主線程分開。這意味著它可以在後台執行，而不會對主線程的運行造成影響，從而確保用戶界面的順暢運行。

### 無阻塞：

主線程和 Web Worker 之間的通信是基於消息的，主線程可以將任務發送給 Web Worker，而 Web Worker 可以獨立執行這些任務，同時回傳結果或更新消息。這樣可以避免主線程在計算密集型操作期間被阻塞。

### 不共享內存：

Web Worker 與主線程之間的數據是通過複製消息的方式進行的，而不是共享內存。這意味著 Web Worker 不能直接訪問主線程的變數，需要透過消息進行數據交換。

### 支援腳本：

Web Worker 支援運行 JavaScript 腳本，這使得它可以執行計算、數據處理和其他需要程式邏輯的操作。

### 多線程處理：

瀏覽器通常支援多個 Web Worker 實例，這使得你可以同時運行多個後台線程來處理不同的任務。

### web-worker範例
```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>Web Worker 範例</title>
</head>
<body>
  <h1>Web Worker 範例</h1>
  <button id="startWorker">啟動 Worker</button>
  <p id="result">結果顯示在這裡</p>

  <script>
    // 建立 worker 物件，並指向 worker.js 檔案
    const worker = new Worker('worker.js');

    // 當 Worker 傳回訊息時，接收並更新畫面
    worker.onmessage = function(event) {
      document.getElementById('result').textContent = 'Worker 回傳: ' + event.data;
    };

    // 當按下按鈕時，向 Worker 傳送訊息，啟動背景運算
    document.getElementById('startWorker').addEventListener('click', function() {
      worker.postMessage('開始計算');
    });
  </script>
</body>
</html>
```
```js
// worker.js：在 Worker 中接收主線程傳來的訊息
self.onmessage = function(event) {
  console.log('Worker 收到訊息: ' + event.data);
  
  // 模擬一個計算密集型的任務（例如計算 0 到 1億的累加和）
  let result = 0;
  for (let i = 0; i < 100000000; i++) {
    result += i;
  }
  
  // 完成計算後，將結果傳回主線程
  self.postMessage(result);
};

```


## 如何優化動畫?

### 使用 CSS Transform 和 Transition：

在許多情況下，使用 CSS 的 transform 和 transition 屬性可以實現更平滑的動畫，同時減少對 CPU 和 GPU 的負荷。這些屬性可以幫助你改變元素的位置、大小、旋轉等，而不會對文檔流造成重大影響。

### 避免大量的變換：

儘量避免在動畫中大量變換屬性值，特別是影響文檔流的屬性（如 left、top 等）。這可能會觸發瀏覽器進行回流（Reflow），導致性能下降。使用 transform 屬性進行變換可以緩解這個問題。

### 使用 GPU 加速：

如前所述，使用 transform 屬性和 CSS 3D 轉換可以利用 GPU 加速進行硬件渲染，從而提高性能。然而，過度使用 GPU 加速可能導致過多的 GPU 資源使用，因此要平衡使用。

### 使用 requestAnimationFrame：

使用 requestAnimationFrame 方法來執行動畫，這可以確保在瀏覽器的下一個重繪時執行動畫，以達到更流暢的效果。

### 限制更新頻率：

對於某些情況，可以通過限制動畫的更新頻率，例如使用 setTimeout 或 setInterval 來控制動畫的播放速度，從而減少性能壓力。

### 使用 CSS 动画性能工具：

瀏覽器的開發者工具中通常會提供有關動畫性能的相關信息。你可以使用這些工具來評估動畫的性能，並進行優化。

### 優化動畫時間線：

確保動畫的時間線和曲線設計得合理，避免過快或過慢的動畫運行。

## 記憶體洩漏（Memory Leak）

- 是一種在計算機程式中常見的錯誤，它指的是程式在執行過程中分配的記憶體區域（例如，堆（heap）中的對象或資源）在不再需要時未能被正確地釋放，導致這些記憶體區域被浪費或占用，最終可能導致系統的記憶體消耗逐漸增加，直至程式運行耗盡可用的記憶體，最終可能導致程式崩潰或系統性能下降。

- 記憶體洩漏通常發生在以下情況下

### 未正確釋放記憶體：

當程式在分配記憶體後忘記或未能正確釋放該記憶體時，就會導致記憶體洩漏。這可能是因為開發人員忽略了調用釋放記憶體的函數（例如，C++ 中的 delete 或 C 中的 free）。

### 引用計數問題：

在使用引用計數技術管理記憶體時，如果對象的引用計數未能正確地增加或減少，可能會導致該對象的記憶體無法正確地釋放。

### 循環引用：

當兩個或多個對象相互引用，且它們之間的引用關係形成了循環，這可能導致這些對象的記憶體無法被垃圾回收系統正確地回收。

### 全局變數：

在某些情況下，全局變數或靜態變數的記憶體可能無法被正確釋放，導致記憶體洩漏。

## js 基礎型別有哪些

### 數字（Number）：

用於表示數值，包括整數和浮點數。例如：42、3.14。

### 字符串（String）：

用於表示文本數據，被包裹在單引號 ' 或雙引號 " 中。例如："Hello, World!"。

### 布爾（Boolean）：

用於表示真（true）或假（false）的值，用於邏輯運算。例如：true、false。

### 未定義（Undefined）：

用於表示未賦值的變數。如果變數聲明但未賦值，則其值為 undefined。

### 空（Null）：

用於表示空值或空對象。例如，null 用於指示變數沒有值。

### 對象（Object）：

用於表示複雜的數據結構，可以包含多個鍵值對（屬性和方法）。例如：`{ name: "John", age: 30 }`。

### 數組（Array）：

用於表示有序的元素列表，可以包含多種數據型別。例如：[1, 2, 3]。

### 函數（Function）：

用於表示可重複使用的程式碼塊，可以執行特定任務。在 JavaScript 中，函數被視為一種特殊的對象。例如：
`unction add(a, b) { return a + b; }`。

### 日期（Date）：

用於表示日期和時間。JavaScript 提供了 Date 對象來處理日期和時間相關的操作。

### 正則表達式（RegExp）：

用於表示文本模式，可以用於搜索和操作字符串。例如：/pattern/。

### 符號（Symbol）：

用於表示唯一的識別符，可以用作對象的屬性鍵。
