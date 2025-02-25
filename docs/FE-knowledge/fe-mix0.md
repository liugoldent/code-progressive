---
description: FE 面試
tags: 
    - JS
    - frontend
---

# [FE] Interview V1

## 請說明js的作用域?
### 全域作用域
* 全域作用域是指在整個 JavaScript 應用程式中可訪問的作用域。在全域作用域中聲明的變數和函式可以在程式碼的任何地方被訪問。
```js
var globalVariable = 42; // 全域作用域變數

function globalFunction() {
  console.log(globalVariable) // 42（let const var都一樣）
  // 在全域作用域中定義的函式
}
```
### 函數作用域
* 函數作用域是指在函式內部聲明的變數和函式，只能在該函式內部訪問。每次呼叫函式時，都會創建一個新的函數作用域。
```js
function localScopeExample() {
  var localVariable = 10; // 函數作用域變數
  console.log(localVariable); // 可以在這個函式內部訪問 localVariable
}
console.log(localVariable)
// localVariable is not defined
// 在這裡無法訪問 localVariable

```
### 塊級作用域
* 在es6中引入`let`和`const`關鍵字，與`var`不同，在大括號外不可讀取`let`、`const`
```js
if (true) {
  let blockScopedVar = 5; // 塊級作用域變數
}

// 這裡無法訪問 blockScopedVar
```

### 靜態作用域
* 在變數被創建時就確定好，而非執行時確定的

### 作用域鏈
* 編譯狀況：當js在遇到這個變量時，會先在這個作用域先找該變量，沒找到再往上找，以此類推直到找到全局作用域

## JS生命週期
* [文章參考](https://github.com/febobo/web-interview/issues/63)
* 上下文：分成全域以及函數
* 創建階段 -> 執行階段 -> 回收階段
* 創建階段：
  1. this binding
  2. 詞法環境（用於儲存函數聲明、let const綁定）被創建：
    1. 分為全局環境與函數環境
  3. 變量環境（儲存變量）被創建

## 請說明什麼是提升(Hoisting)?
涉及變數和函式聲明在執行期間被移動到它們所在作用域的頂部。儘管在程式碼中變數和函式聲明似乎是按照它們的實際位置進行執行的，但實際上它們在執行之前會被“提升”到它們所在作用域的頂部。

### 變數提升
* 在 JavaScript 中，使用 var 關鍵字聲明的變數會被提升到其所在的作用域的頂部，但變數的賦值不會提升，只有聲明部分會被提升。
* let 和 const 關鍵字聲明變數，提升的行為有所不同，為TDZ死區
* 因為js在創建時期，會將var會在變量環境聲明為undefined，但let const在創建在詞法環境時沒被賦值（uninitialized），所以是TDZ
```js
console.log(myVar); // 結果為 undefined
var myVar = 42;
```

### 函式提升
```js
myFunction(); // 正確執行，因為函式被提升

function myFunction() {
  console.log("Hello, world!");
}
```

## 請說明什麼是閉包並給出一個實例
1. 內部函式可以訪問外部函式的變數和參數。
2. 外部函式的變數不會被垃圾回收，只要內部函式存在，它們就會被保留。
3. 使用場景
  * 創建私有變量：類似悠遊卡除值（個人有個人的變量）
  * 延長變量生命週期
  * 柯里化
4. 閉包在處理速度與內存消耗方面對程式具有負面影響
```js
function outerFunction() {
  var outerVar = "I am from outer";

  function innerFunction() {
    console.log(outerVar); // 內部函式訪問外部函式的變數
  }

  return innerFunction; // 返回內部函式
}

var closureExample = outerFunction(); // 獲取內部函式（閉包）
closureExample(); // 調用閉包中的內部函式
```

```js
function buyItem() {
    var myMoney = 1000;
    return function (price) {
      myMoney = myMoney - price;
      return myMoney;
    }
  }
  var balance = buyItem(); 
  balance(100);  // ? 900
  balance(100);  // ? 800
  balance(100);  // ? 700
```

## cookies session localStorage 這三個的差異
### Cookies（瀏覽器 cookie）
* Cookies 是小型的文本數據，通常由網站服務器在用戶瀏覽器中存儲。
* 可以設定過期時間，可以在指定時間內保持持久性。
* 每次發送 HTTP 請求時，**cookies 會自動包含在請求中**，因此可以在客戶端和服務器之間進行數據交換。
* 主要用於存儲會話信息、用戶偏好設置、身份驗證等。
* 有大小限制（通常約 4KB）。
### Session Storage（會話存儲）：
* Session Storage 是 HTML5 新增的 Web Storage 技術之一。
* 數據只在同一個會話（瀏覽器窗口或選項卡）中有效，當會話結束時數據會被清除。
* **不會在每次 HTTP 請求中自動傳遞**，僅在客戶端保存。
* 主要用於臨時存儲，例如用戶填寫表單的數據、暫時的應用狀態等。
* 大小限制相對較大（通常至少 5MB）。
### Local Storage（本地存儲）：
* Local Storage 也是 HTML5 新增的 Web Storage 技術之一。
* 數據在瀏覽器中保持持久性，不會隨著會話結束而清除。
* **不會在每次 HTTP 請求中自動傳遞**，僅在客戶端保存。
* 主要用於長期存儲，例如用戶設置、應用配置、本地數據庫等。
* 大小限制相對較大（通常至少 5MB）。


## 請說明什麼是同步異步?也可提供一個生活上的例子
### JS
* 為單一執行緒，同步語言
### 同步 Synchronous
* 同步表示程式碼按順序執行，每個任務在前一個任務完成後才執行，確保順序性。
* 程式會等待當前的任務完成，然後再執行下一個任務。
* 這種方式容易理解和控制，但可能會導致程式在等待某些耗時任務完成時出現延遲。
* ex：上菜時需要確保每道菜都被客人吃完後才上下一道菜。這就是一個同步的例子，每道菜的上菜時間是按順序的，並且需要等待前一道菜的動作完成。

### 非同步 Asynchronous
* 異步表示程式碼執行不一定按順序，可以同時執行多個任務。
* 程式不會等待當前的任務完成，而是繼續執行下一個任務，並在需要時返回之前的任務。
* 這種方式可以提高效率和性能，特別是在處理網路請求、檔案操作等耗時任務時。
* 生活中的例子：想像您在等待咖啡，而咖啡機正在沖泡咖啡。您不需要一直等著咖啡完成，可以先去做其他事情，當咖啡準備好時，您會被通知。這就是一個異步的例子，您可以在咖啡準備的同時進行其他活動。

## 如何實現一個深拷貝
```js
function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  let copy;

  if (obj instanceof Array) {
    copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i]);
    }
  } else {
    copy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
  }

  return copy;
}

const originalObject = {
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Cityville',
  },
};

const copiedObject = deepCopy(originalObject);


// or
* 但注意會忽略`undefined`、`symbol`、`函數`
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
```
## 從url進入到網站時到網站渲染完畢其中過程為何
1. DNS 解析：
瀏覽器首先需要將輸入的網站域名解析為對應的 IP 地址，這是通過域名系統（DNS）來實現的。

2. 建立 TCP 連接：
一旦瀏覽器知道了網站的 IP 地址，它將建立與網站服務器的 TCP 連接，以便後續的數據交換。
#### 三次握手
```shell
1. 客户端发送 SYN 包（SYN=1，ACK=0）：客户端向服务器发送一个带有 SYN 标志的包，表示客户端请求建立连接。同时客户端会进入 SYN_SENT 状态。

2. 服务器发送 SYN-ACK 包（SYN=1，ACK=1）：服务器收到客户端的 SYN 包后，会向客户端发送一个带有 SYN 和 ACK 标志的包，表示服务器已经收到客户端的请求，并同意建立连接。同时服务器会进入 SYN_RCVD 状态。

3. 客户端发送 ACK 包（ACK=1）：客户端收到服务器的 SYN-ACK 包后，会向服务器发送一个带有 ACK 标志的包，表示客户端也同意建立连接。同时客户端和服务器都进入 ESTABLISHED 状态，建立好了连接。
```
3. 發送 HTTP 請求：
瀏覽器向網站服務器發送 HTTP 請求，請求網站的資源（HTML、CSS、JavaScript、圖片等）。

4. 伺服器處理請求：
網站服務器收到請求後，根據請求的 URL 和其他相關信息，處理並生成響應數據。

5. 返回 HTTP 響應：
網站服務器將生成的響應數據以 HTTP 響應的形式返回給瀏覽器。

6. 瀏覽器接收響應：
瀏覽器接收到 HTTP 響應後，開始處理響應數據，並根據響應中的資源 URL 開始下載相關資源。

7. 渲染 HTML：
瀏覽器解析 HTML，構建 DOM（文檔對象模型），並開始渲染網頁的基本結構。

8. 處理 CSS：
瀏覽器下載和解析 CSS，並應用樣式到 DOM 元素，進行視覺渲染。

9. 處理 JavaScript：
瀏覽器下載並執行網頁中的 JavaScript 代碼。JavaScript 的執行可能會修改 DOM、發起更多的請求（例如 AJAX 請求），並添加交互性和動態效果。

10. 渲染完成：
網站的主要內容和資源已經完全下載、解析並渲染，網站完成渲染。

### 渲染流程
1. 讀取HTML產生DOM Tree
2. 讀取CSS Link Tag生成CSSOM Tree
3. DOM Tree與CSSOM Tree生成Render tree
4. 根據render tree生成Layout Tree，再產生Layer Tree，負責各元素大小與位置的計算
5. 最後paint 畫面
6. 產生tree之後的流程：layout（回流Reflow） -> paint（重繪Repaint） -> Composite（Translate）。只要動一次回流，後面都會動，所以成本很大
7. 這也就是為何css動畫建議用transform的原因
```css
transform: translate(xxx, yyy); // 這邊是屬於composition層級
```
8. 註：compositing：是在compositor thread & raster thread執行，而不會佔用主執行緒
![優化](https://image.slidesharecdn.com/techtalk-howbrowserswork002-170410093945/95/how-browsers-work-36-638.jpg?cb=1491817536)
### Composition
1.  把各layer分別作Rasterize（柵格化），並在Compositor Thread把各個經過柵格化的圖層組合起來
2. Compositor Thread 會再將一個Layer切分成更小的單位-tile（柵格化的最小單位），並把這些tiles送到真正負責柵格化的Raster Threads，Raster Threads將tiles柵格化後會放到瀏覽器的GPU儲存空間裡
3. tiles被柵格化後，Compositor Thread會匯聚成被稱作Draw Quads的資訊，來產生Compositor Frame
4. summary：layer -> 切分成 -> tile -> 送到 -> raster threads -> 將tiles -> 放入GPU儲存空間 -> compositor threads 匯聚成 Draw Quads -> 產生 Compositor Frame 



## 說明對於虛擬DOM的理解
### 運作原理：
當網頁需要進行更新時，瀏覽器的虛擬 DOM 會計算出實際 DOM 的差異（稱為「差異比對」或「調和」），並僅更新需要更改的部分。這樣可以避免不必要的實際 DOM 操作，從而提高性能。

### 性能優勢：
直接操作實際 DOM 是相對昂貴的操作，因為它涉及對瀏覽器的重排和重繪。虛擬 DOM 可以將多次 DOM 更新操作合併成一次，最小化實際 DOM 操作，從而提高效能。

### 優化響應速度：
虛擬 DOM 能夠在內存中進行快速計算，比直接操作實際 DOM 更快。這使得應用能夠更快地響應用戶的操作和事件。

### 框架整合：
虛擬 DOM 常常與前端框架一起使用，例如 React。React 使用虛擬 DOM 來管理和更新 DOM，開發者只需定義網頁元件的狀態，然後框架會自動處理 DOM 的更新，使程式碼更易於維護。

### 易於開發：
使用虛擬 DOM 可以幫助開發者專注於應用的邏輯和功能，而不必過多擔心 DOM 操作的性能和複雜性。

## 說明對如何理解瀏覽器的重繪(repaint)以及重排(reflow)
### 重繪（Repaint）：
當 DOM 元素的可見樣式（如顏色、背景、陰影等）發生變化，但佈局（layout）並未改變時，瀏覽器將執行重繪操作。重繪僅更新影響外觀而不影響佈局的部分。瀏覽器會計算出新的外觀，然後重新繪製相應的區域，以反映變化。

### 重排（Reflow）：
當 DOM 的佈局發生變化，例如元素的尺寸、位置、邊距等發生變化，瀏覽器需要重新計算並更新所有相關元素的佈局。這個過程稱為重排。重排的代價比重繪更高，因為它需要重新計算元素的佈局，然後重新繪製整個畫面。

### 理解重繪和重排的區別對於優化網頁性能至關重要：

* 減少重繪和重排的次數：通過減少樣式變化和佈局更改，可以減少不必要的重繪和重排操作，從而提高性能。

* 使用 CSS Transitions 和 Animations：使用 CSS 過渡和動畫可以優化動畫效果，因為它們可以利用硬件加速，最小化重繪和重排。

* 批量更新 DOM：如果需要進行多個變更，可以通過在單次操作中進行批量更新，然後將其應用到 DOM，以減少多次重繪和重排。

* 使用虛擬 DOM：前端框架（如 React）使用虛擬 DOM 來最小化 DOM 的實際變更，只更新必要的部分，從而減少重繪和重排。

* 如何避免多餘的reflow & repaint
  * 避免用多個statement修改style，建議使用新增或移除class的方式
  * 先一次讀取完，再一次修改（全部讀取完，不要一次讀取完修改一個）
  * 參考csstrigger.com，來觀察各種屬性改變會觸發渲染的階段

## 說明OSI網路模型有哪七層 / TCP主要的運作方式
###  OSI 網路模型的七層
* 物理層（Physical Layer）：
負責傳輸比特流，將數據在物理媒介上進行傳輸，如電纜、光纖等。

* 數據鏈路層（Data Link Layer）：
提供點對點連接的傳輸，負責將比特流組織成幀（Frame），並進行錯誤檢測和修復。

* 網路層（Network Layer）：
處理數據包的路由和轉發，實現不同網路之間的通信，並確保數據包能夠正確到達目標。

* 傳輸層（Transport Layer）：
提供端到端的通信和數據分割、重組，同時處理錯誤檢測和修復。

* 會話層（Session Layer）：
負責管理和協調數據交換，建立、維護和終止會話。

* 表示層（Presentation Layer）：
處理數據的格式轉換、編解碼，確保不同系統的數據能夠互相理解。

* 應用層（Application Layer）：
提供應用程序與網路之間的接口，包括應用程式、通訊服務和網路服務。

### TCP 是 OSI 模型中的傳輸層協議
* 連接導向：
TCP 在通信之前，需要建立一個連接。通過三次握手確立連接，然後進行數據傳輸，最後使用四次握手結束連接。

* 可靠性：
TCP 提供可靠的數據傳輸，通過序號、確認和重傳機制確保數據正確到達目的地。

* 流量控制：
TCP 使用滑動窗口（Sliding Window）機制來控制數據的流量，避免過多的數據堆積在網路中。

* 擁塞控制：
TCP 使用擁塞控制算法來監測網路的擁塞情況，並調整數據的傳輸速率，以避免網路過載。

* 面向字節：
TCP 將數據劃分為字節流，進行傳輸和確認，而不需要應用程序考慮數據的結構。

## HTTP做了什麼
1. 建立連接：客戶端和服務器之間通過 TCP/IP 建立連接，以便進行數據傳輸。這個連接通常是持久的，可以在多個請求之間保持打開狀態，以減少連接建立的開銷。

2. 發送請求：客戶端向服務器發送 HTTP 請求，請求中包含請求的方法（GET、POST、PUT、DELETE 等）、請求的資源地址（URL）、請求頭部等信息。例如，當用戶在瀏覽器中輸入網址並按下回車鍵時，瀏覽器會發送一個 HTTP GET 請求來獲取對應的網頁。

3. 處理請求：服務器接收到客戶端的請求後，根據請求的方法和資源地址來處理請求。服務器可能會執行一些邏輯，如查詢數據庫、生成動態內容等，並準備好響應。

4. 發送響應：服務器向客戶端發送 HTTP 響應，響應中包含響應的狀態碼、響應頭部和響應體等信息。響應體包含了請求所請求的資源內容。例如，如果是 HTML 頁面，響應體中就是 HTML 標記和內容。

5. 關閉連接：一旦響應發送完畢，服務器關閉連接，HTTP 會話結束。在持久連接中，連接可能會保持打開狀態以等待後續請求，直到客戶端或服務器決定關閉連接。
