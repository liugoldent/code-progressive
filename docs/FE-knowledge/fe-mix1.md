---
description: FE 面試
tags:
  - JS
  - frontend
---

# [FE] Interview V2

## 說明 CSS 的層級

- !important
  權重為無限大

- 內聯樣式（Inline Styles）：
  內聯樣式是直接寫在 HTML 元素的 style 屬性中的樣式，具有最高的層級。每個內聯樣式都會被賦予 1000 的權重。

- ID 選擇器（ID Selectors）：
  ID 選擇器通過元素的 ID 屬性進行選擇，每個 ID 選擇器都會被賦予 100 的權重。

- 類別、屬性和偽類選擇器（Class, Attribute, and Pseudo-class Selectors）：
  這類選擇器選擇特定類別、屬性值或偽類，每個選擇器都會被賦予 10 的權重。

- 元素和偽元素選擇器（Type and Pseudo-element Selectors）：
  元素選擇器選擇 HTML 元素，偽元素選擇器選擇元素的特定部分（如 ::before 和 ::after）。每個選擇器都會被賦予 1 的權重。

## 說明 display:none 跟 visibility: hidden 的差異

### display: none：

- 這個屬性會將元素完全從渲染中移除，不佔據空間，並且不會對佈局產生影響。
- 隱藏的元素不會對頁面佈局和結構產生影響，其他元素會忽略這個元素的存在。
- 使用 display: none 會導致元素的高度、寬度和間距等都被設為零。
- 在頁面中不可見，也不會觸發任何與該元素相關的事件。

### visibility: hidden：

- 這個屬性將元素隱藏，但元素仍然佔據空間，佈局不會改變。
- 隱藏的元素對於頁面佈局和結構依然有影響，其他元素仍然會考慮這個元素的存在。
- 元素的高度、寬度和間距不會改變，所以它佔據的空間仍然存在。
- 在頁面中不可見，但仍然會觸發與該元素相關的事件。

## 說明 HTML5 的語意化標籤用意並舉出五個常用的例子

提供更好的可讀性和可訪問性，以及對搜索引擎優化

- `<header>` 標籤：
  用於定義網頁的頂部，通常包含網站的標題、標誌、導航等重要內容。

- `<nav>` 標籤：
  表示網站的導航區域，用於包含主導航或頁面間的連結。

- `<main>` 標籤：
  表示網頁的主要內容區域，每個頁面應該只有一個 `<main>` 標籤。

- `<article>` 標籤：
  用於包含獨立的、可獨自發布或重用的內容，如博客文章、新聞報導等。

- `<footer>` 標籤：
  用於定義網頁的底部，通常包含版權信息、聯絡方式、頁面導航等。

## 說明 RWD 跟 AWD 的差異

### Responsive Web Design（RWD）：

- 主要判別：RWD 為一個 CSS，透過`@media`切換版面呈現
- RWD 是一種設計方法，通過使用彈性佈局、媒體查詢和可縮放的圖像來自動調整和適應不同的螢幕尺寸和設備。
- 使用 RWD 的網頁會根據設備的螢幕寬度進行調整，無論是桌面、平板還是手機，網頁都會自動改變佈局和元素的大小。
- RWD 的優勢在於設計和開發的效率，因為只需維護一套代碼，可以在不同設備上提供一致的體驗。
- 缺點是可能需要在某些螢幕尺寸下進行一些妥協，以確保設計在所有情況下都正確呈現。

### Adaptive Web Design（AWD）：

- 主要判別：AWD 為多個 CSS，會預先寫好版面大小的呈現，有點客製化的感覺
- AWD 是一種設計方法，根據設備的屬性（如螢幕寬度、高度、分辨率等）和功能來提供不同的網頁版本。
- 使用 AWD 的網頁會根據設備的屬性提供特定的佈局和內容，這可以通過服務器端的檢測和客戶端的媒體查詢來實現。
- AWD 的優勢在於可以更精確地控制各種不同設備上的體驗，允許更多的定制化。
- 缺點是需要維護多套網頁版本，可能導致開發和維護成本增加。

## 解出以下題目

### 關於 setTimeout

```js
function foo() {
  console.log("foo start");
  setTimeout(() => {
    console.log("setTimeout in foo");
  }, 0);

  new Promise((resolve, reject) => {
    // 內部為同步，會先走
    console.log("promise in foo");
    resolve();
  }).then(() => {
    // 內部為非同步，後面走
    console.log("promise.then in foo");
  });
  console.log("foo end");
}

console.log("start");
foo();
console.log("end");

// start
// foo start
// promise in foo
// foo end
// end
// promise.then in foo
// setTimeout in foo
```

#### setTimeout

```js
function resolveAfter(x) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add1(x) {
  const a = await resolveAfter(20);
  const b = await resolveAfter(30);
  return x + a + b;
}

add1(10).then((v) => {
  console.log(v); // 幾秒後印出? v?
});
```

### 傳址

```js
let a = {};
let b = a;
b.x = 1;
console.log(a.x);
```

### 關於 async await
* await 會阻擋後面的程式碼。（即加入微任务队列）
```js
const result = () => {
  setTimeout(() => {
    console.log("1");
  }, 0);
  console.log(12);

  const foo = async () => {
    console.log(15);
    await Promise.resolve();
    console.log(40);
  };

  console.log(23);
  foo();
  console.log(7);
};

result();

// 12 23 15 7 40 1
```

## 請用 JS 寫出簡單的 quick short

- 在 quickSort 函數中，我們選擇第一個元素作為基準（pivot），然後將數組劃分成比基準小的左子數組和比基準大的右子數組。接著，我們遞歸地對左右子數組進行快速排序，最後將排序好的子數組和基準組合起來。

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

const unsortedArray = [5, 2, 9, 1, 5, 6];
const sortedArray = quickSort(unsortedArray);
console.log(sortedArray);
```

## 簡單介紹一下你所認識的原型鏈是什麼

- [參考文章](https://github.com/febobo/web-interview/issues/59)

- 原型鏈（Prototype Chain）是 JavaScript 中一個重要的概念，用於實現對象之間的繼承和屬性查找。在 JavaScript 中，每個物件都有一個連接到另一個物件的鏈，這個連接被稱為原型鏈。這個連接的目的是允許對象繼承其它物件的屬性和方法。

- 每個 JavaScript 物件（包括函數）都有一個 `__proto__` 屬性，它指向該物件的原型（prototype）。當我們訪問一個物件的屬性或方法時，如果該物件本身沒有這個屬性或方法，JavaScript 引擎會沿著原型鏈往上搜索，直到找到對應的屬性或方法，或者達到原型鏈的頂端，即 Object.prototype。

- 例如，如果我們創建一個物件 obj，並訪問一個屬性 obj.prop，如果 obj 本身沒有這個屬性，JavaScript 將在 obj 的原型尋找，然後在原型的原型上尋找，直到找到屬性或達到 Object.prototype。

- 每個物件的`__proto__`會指向某個原型物件的`prototype`

- 繼承

  1. 把子構造函數`Child`的`__proto__`指向父構造函數`Parent`
  2. 把子實例的`Child.prototype.__proto__`指向父類 parent 的原型對象`Parent.prototype`

- [圖例](https://camo.githubusercontent.com/0b465545fa4e4cd8175067bac398b1ec3eb699647a6080fbdbd93e763862ab21/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f36303832356161302d373235652d313165622d383566362d3666616337376330633962332e706e67)

```js
Person.__proto__ === Function.prototype; // 建構出來的原型上面是Function，而prototype的__proto__才是Object.prototype
```

```js
// 創建一個物件 person
const person = {
  name: "John",
  greet: function () {
    console.log(`Hello, my name is ${this.name}`);
  },
};

// 創建一個物件 student，並將其原型設置為 person
const student = Object.create(person);
student.name = "Alice";

// 訪問 student 的屬性和方法
console.log(student.name); // 輸出 "Alice"
student.greet(); // 輸出 "Hello, my name is Alice"
```

## PWA 是什麼?他的特色是?

- 可離線使用：PWA 可以在離線狀態下運行，通過使用瀏覽器的快取機制來存儲資源，使用戶可以在網絡連接不可用時仍然訪問應用程式。

- 快速加載：PWA 使用了一些優化技術，例如服務器工作者（Service Workers）和資源預緩存，以實現快速的頁面加載速度，提供更好的性能體驗。

- 優質的用戶體驗：PWA 提供了與原生應用程式相似的用戶體驗，包括流暢的動畫、平滑的滾動和直觀的界面。

- 可安裝性：PWA 可以通過用戶的瀏覽器安裝到桌面或主屏幕，而無需經過應用商店的審查和安裝過程，方便用戶快速訪問。

- 設備功能訪問：PWA 可以訪問設備的一些功能，例如地理位置、攝像頭、麥克風等，使得應用程式可以更好地與用戶互動。

- 即時更新：PWA 可以實現即時更新，當網站有新的版本時，用戶重新訪問時可以自動更新到最新版本，無需手動操作。

- 安全性：由於使用了 HTTPS 來訪問，PWA 提供了更高的安全性，可以保護用戶的數據和隱私。
