---
tags:
  - javascript
  - Test
---

# [FE] Javascript - 1

## typeof vs instanceof

### typeof

- 回傳一個字符串（都是小寫）

```js
typeof 1; // 'number'
typeof "1"; // 'string'
typeof undefined; // 'undefined'
typeof true; // 'boolean'
typeof Symbol(); // 'symbol'
typeof null; // 'object'
typeof []; // 'object'
typeof {}; // 'object'
typeof console; // 'object'
typeof console.log; // 'function'
```

### instanceof

- 用於檢測構造函數的 prototype 屬性是否出現在某個實例物件的原形鏈上

```js
// 定義建構函數
let Car = function () {};
let benz = new Car();
benz instanceof Car; // true
let car = new String("xxx");
car instanceof String; // true
let str = "xxx";
str instanceof String; // false
```

### 區別

- typeof 與 instanceof 都是判斷數據類型的方法，區別如下：
  - typeof 會返回一個變量的基本類型，instanceof 返回的是一個布爾值
  - instanceof 可以準確地判斷覆雜引用數據類型，但是不能正確判斷基礎數據類型
  - 而 typeof 也存在弊端，它雖然可以判斷基礎數據類型（null 除外），但是引用數據類型中，除了 function 類型以外，其他的也無法判斷

## new 建構子

[new 建構子](https://github.com/febobo/web-interview/issues/69)

- 在 js 中，new 操作符用於創建一個構造函數的實例物件

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayName = function () {
  console.log(this.name);
};
const person1 = new Person("Tom", 20);
console.log(person1); // Person {name: "Tom", age: 20}
t.sayName(); // 'Tom'
```

- 流程
  - 創建一個新的對象 obj
  - 將對象與構建函數通過原型鏈連接起來
  - 將構建函數中的 this 綁定到新建的對象 obj 上
  - 根據構建函數返回類型作判斷，如果是原始值則被忽略，如果是返回對象，需要正常處理

## ajax 原理是什麼

- AJAX：Async Javascript and XML
- 指說可以在不重新載入整個網頁的情況下，與服務器交換數據，並且更新部分網頁

### 流程

- 實現 Ajax 異步交互需要服務器邏輯進行配合，需要完成以下步驟：
  1. 創建 Ajax 的核心對象 XMLHttpRequest 對象
  2. 通過 XMLHttpRequest 對象的 open() 方法與服務端建立連接
  3. 構建請求所需的數據內容，並通過 XMLHttpRequest 對象的 send() 方法發送給服務器端
  4. 通過 XMLHttpRequest 對象提供的 onreadystatechange 事件監聽服務器端你的通信狀態
  5. 接受並處理服務端向客戶端響應的數據結果
  6. 將處理結果更新到 HTML 頁面中

## DOM 常見操作有哪些

### 創建

```js
// 創建新元素
const divEl = document.createElement("div");
// 創建文本節點
const textEl = document.createTextNode("content");
// 創建文擋碎片
const fragment = document.createDocumentFragment();
// 創建屬性節點
const dataAttribute = document.createAttribute("custom");
console.log(dataAttribute);
```

### 查詢（獲取節點）

```js
document.querySelector(".element");
document.querySelector("#element");
document.querySelector("div");
document.querySelector('[name="username"]');
document.querySelector("div + p > span");
const notLive = document.querySelectorAll("p");
```

### 更新

```js
// innerHTML
// 获取<p id="p">...</p >
var p = document.getElementById("p");
// 设置文本为abc:
p.innerHTML = "ABC"; // <p id="p">ABC</p >
// 设置HTML:
p.innerHTML = 'ABC <span style="color:red">RED</span> XYZ';
// <p>...</p >的内部结构已修改

// innerText、textContent
// 获取<p id="p-id">...</p >
var p = document.getElementById("p-id");
// 设置文本:
p.innerText = '<script>alert("Hi")</script>';
// HTML被自动编码，无法设置一个<script>节点:
// <p id="p-id">&lt;script&gt;alert("Hi")&lt;/script&gt;</p >
```

### 添加

- innerHTML
- appendChild：
- insertBefore：把子節點插到指定位子

```js
parentElement.insertBefore(newElement, referenceElement);
```

- setAttribute

```js
const div = document.getElementById("id");
div.setAttribute("class", "white"); //第一个参数属性名，第二个参数属性值。
```

### 刪除

- 刪除節點

```js
// 拿到待删除节点:
const self = document.getElementById("to-be-removed");
// 拿到父节点:
const parent = self.parentElement;
// 删除:
const removed = parent.removeChild(self);
removed === self; // true
```

## BOM

### DOM vs BOM

- DOM：把文擋 HTML 當一個一棵樹的模型。頂級物件是 document。主要操作頁面元素
- BOM：把瀏覽器當一個 JS 物件，包含瀏覽器的一些屬性與方法。頂級物件是 window。主要操作與瀏覽器窗口交互的物件。

### BOM

- 常用物件：
  - window：setTimeout
  - navigator
  - location
  - history

## 大文件上傳如何切割

- 拿到文件，保存文件唯一性標識，切割文件，分段上傳，每次上傳一段，根據唯一性標識判斷文件上傳進度，直到文件的全部片段上傳完畢
- 流式上傳：將文件轉換為流（Stream）的形式進行上傳，而不是將整個文件讀取到內存中然後再上傳。這樣可以降低內存使用量，特別是對於大文件來說。

### 讀取文件內容

```js
const input = document.querySelector("input");
input.addEventListener("change", function () {
  var file = this.files[0];
});
// 標記為唯一性
const md5code = md5(file);
```

### 開始分割

```js
var reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.addEventListener("load", function (e) {
  //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
  var slice = e.target.result.slice(0, 10 * 1024 * 1024);
});
```

### 上傳

```js
const formdata = new FormData();
formdata.append("0", slice);
//这里是有一个坑的，部分设备无法获取文件名称，和文件类型，这个在最后给出解决方案
formdata.append("filename", file.filename);
var xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
  //xhr.responseText
});
xhr.open("POST", "");
xhr.send(formdata);
xhr.addEventListener("progress", updateProgress);
xhr.upload.addEventListener("progress", updateProgress);

function updateProgress(event) {
  if (event.lengthComputable) {
    //进度条
  }
}
```

## 如何判斷一個元素是否在可是區域中

### offsetTop、scrollTop

- offsetTop：是相對於其最近的已定位（positioned）祖先元素的垂直偏移量的屬性
- scrollTop：表示元素的垂直滾動條的位置屬性。scrollTop=0：會回到原本位置
- scrollWidth 和 scrollHeight 主要用於確定元素內容的實際大小
- scrollLeft 和 scrollTop 屬性既可以確定元素當前滾動的狀態，也可以設置元素的滾動位置

### getBoundingClientRect

- DOMRect 对象，拥有 left, top, right, bottom, x, y, width, 和 height 属性

```js
function isInViewPort(element) {
  const viewWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const { top, right, bottom, left } = element.getBoundingClientRect();

  return top >= 0 && left >= 0 && right <= viewWidth && bottom <= viewHeight;
}
$(window).on("scroll", () => {
  console.log("scroll !");
  $targets.each((index, element) => {
    if (isInViewPort(element)) {
      $(element).css("background-color", "yellow");
    }
  });
});
```

### Intersection Observer

- 會去判斷兩個元素是否重疊，因此不用進行事件監聽，性能比 getBounding 好

```js
const options = {
  // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
  // 1 表示完全被包含
  threshold: 1.0,
  root: document.querySelector("#scrollArea"), // 必须是目标元素的父级元素
};

const observer = new IntersectionObserver(callback, options);

// 上段代码中被省略的 callback
const callback = function (entries, observer) {
  entries.forEach((entry) => {
    entry.time; // 触发的时间
    entry.rootBounds; // 根元素的位置矩形，这种情况下为视窗位置
    entry.boundingClientRect; // 被观察者的位置举行
    entry.intersectionRect; // 重叠区域的位置矩形
    entry.intersectionRatio; // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
    entry.target; // 被观察者
  });
};

const target = document.querySelector(".target");
observer.observe(target);
```

## 如何實現上拉加載、下拉刷新

```js
// scrollTop：滾動視窗的高度距離window頂部的距離，會隨著往上滾動而不斷增加，初始值是0，是一個變化值
// clientHeight：定值，為螢幕可視區域
// scrollHeight：表示body所有元素的長度
// scrollTop + clientHeight >= scrollHeight
container.addEventListener("scroll", function () {
  // 判斷是否到達底部
  if (container.scrollTop + container.clientHeight >= list.clientHeight) {
    // 如果沒有正在加載中，則加載更多項目
    if (!isLoading) {
      isLoading = true;
      loadMoreItems();
    }
  }

  // 判斷是否到達頂部，並且滾動距離足夠長才觸發下拉刷新
  if (container.scrollTop <= 0 && container.scrollTop > -100) {
    refresh();
  }
});

// 加載更多項目
function loadMoreItems() {
  // 模擬加載更多項目的操作
  setTimeout(function () {
    var items = "";
    for (var i = 0; i < 10; i++) {
      items += "<li>項目 " + (list.children.length + 1) + "</li>";
    }
    list.innerHTML += items;
    isLoading = false;
  }, 1000);
}

// 下拉刷新
function refresh() {
  // 模擬下拉刷新的操作
  setTimeout(function () {
    var items = "";
    for (var i = 0; i < 10; i++) {
      items += "<li>新項目 " + (i + 1) + "</li>";
    }
    list.innerHTML = items + list.innerHTML;
    // 恢復滾動位置
    container.scrollTop = 100;
  }, 1000);
}
```

## 如何實現單點登入：SSO

### 理論

1. 身份驗證服務提供者（Identity Provider，IdP）：建立一個身份驗證服務提供者，用於驗證使用者的身份並生成令牌（token）。常見的 IdP 包括 Okta、Auth0、Keycloak 等。你也可以通過自己的服務來實現。

2. 服務提供者（Service Provider，SP）：在需要實現單點登入的應用程式中，配置身份驗證服務提供者的相關信息，如 IdP 的端點 URL、客戶端 ID、客戶端密鑰等。

3. 協議：選擇一種單點登入協議，如 OAuth 2.0、OpenID Connect 等。這些協議定義了 IdP 和 SP 之間的通信方式和流程。

4. 驗證流程：用戶訪問應用程式時，應用程式將重定向用戶到 IdP，由 IdP 要求用戶登入並授予權限。一旦用戶成功登入，IdP 將發送一個身份驗證令牌給 SP。

5. 單點登入會話：一旦用戶在其中一個應用程式中登入成功，他們將在其他相關的應用程式中保持登入狀態，直到他們登出或者會話過期。

6. 令牌驗證：SP 在收到身份驗證令牌後，應該驗證令牌的有效性、用戶的權限等信息，以確保安全性。

7. 單點登出：提供用戶在任何一個應用程式中登出後，所有相關應用程式都同步登出的功能，以確保用戶的安全性和隱私。

### localStorage 實作

1. 可以選擇將 Session ID or token 保存到 localStorage 中，讓前端每次向後端發送請求時，主動將 localStorage 數據傳給服務端
2. 可以通過特殊手段將它寫入多個其他域下的 LocalStorage 中

```js
// 获取 token
var token = result.data.token;

// 动态创建一个不可见的iframe，在iframe中加载一个跨域HTML
var iframe = document.createElement("iframe");
iframe.src = "http://app1.com/localstorage.html";
document.body.append(iframe);
// 使用postMessage()方法将token传递给iframe
setTimeout(function () {
  iframe.contentWindow.postMessage(token, "http://app1.com");
}, 4000);
setTimeout(function () {
  iframe.remove();
}, 6000);

// 在这个iframe所加载的HTML中绑定一个事件监听器，当事件被触发时，把接收到的token数据写入localStorage
window.addEventListener(
  "message",
  function (event) {
    localStorage.setItem("token", event.data);
  },
  false
);
```


## Streaming JSPlayer
### 選擇流媒體協議： 選擇適合你需求的流媒體協議，常見的有 HLS、MPEG-DASH、RTMP 等。
#### HLS
* HTTP Live Streaming
* 工作原理： HLS 是由蘋果開發的流媒體傳輸協議，通過將整個媒體文件切分為小的 MPEG-TS 片段，並使用 HTTP 協議將這些片段分發給客戶端。客戶端會根據網絡條件和設備性能選擇最適合的碼率和分辨率的片段進行播放。

* 支持情況： HLS 在 iOS 設備、macOS、Safari 瀏覽器以及許多其他流行的移動設備和瀏覽器上都有很好的支持。它也可以通過多種服務（如亞馬遜雲服務、Wowza 等）實現服務器端支持。

* 使用場景： HLS 主要用於在 Web 和移動設備上播放流媒體，例如實時直播、在線視頻播放等場景。

#### MPEG-DASH
* Dynamic Adaptive Streaming over HTTP
* 工作原理： MPEG-DASH 是一種由 MPEG 制定的開放標準，類似於 HLS，它也將媒體文件切分為小的片段，並使用 HTTP 協議進行分發。與 HLS 不同的是，MPEG-DASH 使用一組描述文件（manifest）來描述媒體文件的不同版本（如不同的分辨率、碼率等），客戶端根據網絡條件和設備性能從描述文件中選擇合適的片段進行播放。

* 支持情況： MPEG-DASH 的支持逐漸增加，在許多現代瀏覽器和設備上都有很好的支持，包括 Chrome、Firefox、Edge 等。

* 使用場景： MPEG-DASH 通常用於在線視頻服務、OTT（Over-The-Top）服務等場景。

#### RTMP
* 工作原理： RTMP 是一種實時消息傳輸協議，最初由 Macromedia 開發，用於實時數據傳輸，如音頻、視頻等。RTMP 使用 TCP 連接進行數據傳輸，並可以實現低延遲的流媒體傳輸。

* 支持情況： RTMP 在過去廣泛用於流媒體傳輸，但由於不斷增長的 Web 標準和安全性要求，現在在 Web 瀏覽器中的支持逐漸減弱。

* 使用場景： RTMP 曾經用於實時直播、視頻會議等場景，但現在在 Web 上的使用已經受到限制，主要用於專業的視頻流媒體服務和軟件中。

### HLS vs MPEG-DASH
* 編碼格式：MPEG-DASH 允許使用任何編碼標準。HLS 則不然，這要求使用 H.264 或 H.265。
* 裝置支援：HLS 是唯一受 Apple 裝置支援的格式。iPhone、MacBook 和其他 Apple 產品無法播放透過 MPEG-DASH 傳遞的視訊。

### 編寫 HTML 頁面： 
* 在 HTML 頁面中包含播放器所需的基本結構，通常是一個 `<video>` 或 `<audio>` 標簽，以及用於控制播放器的按鈕或進度條等元素。

### 引入播放器庫： 
* 選擇一個適合的 JavaScript 播放器庫（如 Video.js、JW Player 等），並在 HTML 頁面中引入該庫。

### 配置播放器： 
* 根據播放器庫的文檔，配置播放器以使用你選擇的流媒體協議，並設置其他播放器參數（如尺寸、自動播放等）。

### 添加樣式： 
* 根據需要，添加 CSS 樣式來美化播放器的外觀。

### 測試和調試： 
* 在不同的瀏覽器和設備上測試播放器，並進行調試以確保其正常工作。