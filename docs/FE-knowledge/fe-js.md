---
tags:
  - javascript
  - Test
---

# [FE] Javascript - 2

## Difference

### var、const、let

- var 為 function scope
- const let 為 block scope
- const 是常數一經宣告之後就要指定數值，不可再度被賦值
- var 在 function 內還是會暴露到 global 環境
- const let 則不會暴露出去

```javascript
var a = 1;
var b = 1;
var c = 1;

function test(a) {
  console.log(a); // undefined
  var b = 2;
  console.log(b); // 2
  if (true) {
    let c = 5;
    var d = 6;
    const e = 7;
  }
  console.log(c); // 1
  console.log(d); // 6
  console.log(e); // error
}

test();
```

### var、let、const 題目

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// 5
// 5
// 5
// 5
// 5
// 原因：var為function scope，當i被賦值時，不會被綁在for裡留下作用域，而迴圈又已經跑完，所以是5
```

### 淺拷貝 vs 深拷貝

#### 深拷貝使用

```javascript
JSON.parse(JSON.stringify());
```

#### 淺拷貝

##### object

```javascript
Object.assign(); // 只能完成第一層的淺層複製

let a = {
  text: 1,
  text2: {
    result: 2,
  },
};

let b = Object.assign({}, a);
let c = JSON.parse(JSON.stringify(a));
b["text"] = 2;
b["text2"]["result"] = 3;
b["text2"]["result2"] = 4;
console.log(a); // { text: 1, text2: { result: 3, result2: 4 } }
console.log(b); // { text: 2, text2: { result: 3, result2: 4 } }
console.log(c); // { text: 1, text2: { result: 2 } }
```

##### array

```js
const fxArrs = fxArr.slice(0); // slice
const fxArrs2 = fxArr.concat(); // concat
const fxArrs3 = [...fxArr]; // 拓展運算符
```

### 型別

#### 基本型別

- Boolean、Null、Undefined、Number、String、Symbol

#### 物件型別

- Object、Array、Function


### == vs ===

- == 會自動轉型
- === 要型別正確 & 資料正確 才會 true
- ==：
  - 兩個都為簡單類型，字符串和布爾值都會轉換成數值，再比較
  - 簡單類型與引用類型比較，對象轉化成其原始類型的值，再比較
  - 兩個都為引用類型，則比較它們是否指向同一個對象
  - null 和 undefined 相等
  - 存在 NaN 則返回 false

### map vs filter vs reduce

- map 遍歷陣列，然後返回新陣列
- filter 遍歷陣列，然後條件為 true 才會返回
- reduce 遍歷陣列，但可通過回調函數返回一個值

### callback vs promise

- callback 是將函數當作參數去給另一個函數存取，並透過另一個函式呼叫他。
- promise 則是該函數執行結束，使用`then`去做接續，其共有三個狀態
  - pending：初始狀態
  - fulfilled：完成狀態
  - reject：失敗狀態
- callback -> promise & generator -> async

### generator

- 每次调用 next() 方法时，生成器函数会执行到下一个 yield 关键字暂停的位置

```javascript
// generator 範例：記住yield會丟東西也會吃東西
// 取自Huli 網站
function* gen() {
  let arr = [];
  while (true) {
    arr.push(yield arr);
  }
}

var name = gen();
// 第一次呼叫name.next() -> 遇到yield -> 他會丟出arr出來 -> 而因為我們東西都還沒丟進去，所以返回為[]
console.log(name.next("init").value); //[]
// 第二次呼叫name.next('nick') -> yield把'nick'吃進去 -> arr.push 做完結束後 -> 再次回到yield -> yield再次把arr 丟出來 -> 得到 nick
console.log(name.next("nick").value); //["nick"]

console.log(name.next("peter").value); //["nick","peter"]
```

```js
function* generatorFunction() {
  yield "First";
  yield "Second";
  yield "Third";
}

const gen = generatorFunction();

console.log(gen.next().value); // 输出: 'First'
console.log(gen.next().value); // 输出: 'Second'
console.log(gen.next().value); // 输出: 'Third'
console.log(gen.next().value); // 输出: undefined
```

[[Javascript] ES6 Generator 基礎](http://huli.logdown.com/posts/292331-javascript-es6-generator-foundation)

### callback promise generator async/await

- Promise 和 async/await 是專門用於處理非同步操作的。

- Generator 不是為了處理非同步操作而設計的，它還有其他功能（例如對象迭代、控制輸出、部署 Iterator 接口等）。

- 相較於 Promise，使用 Generator 或 async/await 编写的代码更为复杂，且可读性稍差。

- Generator 和 async/await 需要與 Promise 對象搭配處理非同步情況。

- async/await 實質上是 Generator 的語法糖，相當於會自動執行 Generator 函数。

- async/await 使用上更為簡潔，將非同步代碼以同步的形式進行編寫，是處理非同步編程的最終方案。

### event bubbling vs event capture and stopPropagation

- bubbling 為向上傳遞
- capture 為向下捕捉
- 舉例：
  - 當我們點下一個按鈕時，其走法是從 window 一路往下 capture 元素，直到該元素
  - 找到元素之後，就一路 bubbling 上來，直到 windows
- 若要取消 bubbling，則可以使用`event.stopPropagation`
- event delegation：意思是若今天有多個元素需要綁定，那我們盡量把事件綁在父元素上，以減少大量子事件
- 傳遞順序原則
  - 先捕獲，再冒泡
  - 到了 target 本身，沒有分捕獲或冒泡
- stopPropagation：意思是中斷下一個連結，但是同層會繼續跑
- preventDefault：取消預設行為，但是會繼續往下跑

```javascript
// 第一個參數：事件名稱
// 第二個參數：事件處理器
// 第三個參數：true / false : 捕獲 / 冒泡
xxx.addEventListener(
  "click",
  function () {
    // e.eventPhase 若等於1：CAPTURING_PHASE
    // e.eventPhase 若等於2：AT_TARGET
    // e.eventPhase 若等於3：BUBBLING_PHASE
    console.log("list_item_link bubbling", e.eventPhase);
  },
  true
);
```

[DOM 的事件傳遞機制：捕獲與冒泡](https://blog.huli.tw/2017/08/27/dom-event-capture-and-propagation/)
[重新認識 JavaScript: Day 14 事件機制的原理](https://ithelp.ithome.com.tw/articles/10191970)

## what is ?

### scope

- 指某變數在程式中，能被讀取的範圍，可分為區域變數、全域變數

### closure

- 指內部函式捕捉了外部函式變數，其包含一個函式，以及函式被建立時的環境

### hoisting

- 指變數或 function 被提升，舉例來說

```javascript
// in js 程式
var a = "1";
var b = "2";
console.log("5");
function c() {
  console.log("xxx");
}

// js 內部解讀為
function c() {
  console.log("xxx");
}
var a;
var b;
a = "1";
b = "2";
console.log("5");
```

1. 如果提早 `console.log(a)`會出現 undefined
2. 題外話，`let`、`const` 會出現 TDZ 暫時性死區

### Event Loop
- 程式在跑時，遇到非同步的會丟入Web API，然後先執行完的再放到Callback Queue。
- Event Loop 指的就是這一整個循環，當 Call Stack 被清空則會檢視 Callback Queue，並將其放入 Call Stack，就這樣不斷的循環，達成一個不阻塞的機制
- 因為 js 是單一執行緒，所以遇到同步與非同步時，瀏覽器機制不同。

1. 當 js 執行到該行時，會進入 Call Stack（後進結果先出）

```js
function func1() {
  console.log("func1");
}

function func2() {
  console.log("func2");
  func1();
}

function func3() {
  console.log("func3");
  func2();
}

func3();
```

2. 然後遇到 cb 時，cb 進入 Web API 等待
3. 然後 Web API 得到結果時，將這個 cb 丟給 Queue（先進先出）

```js
// 定義一個定時器，每隔一秒觸發一次
const timerId = setInterval(() => {
  console.log("Timer fired!");
}, 1000);

// 等待 5 秒後停止定時器
setTimeout(() => {
  clearInterval(timerId); // 停止定時器
  console.log("Timer stopped after 5 seconds.");
}, 5000);
```

4. 最後當 stack 都清空時，Queue 的資料或 function 會進入 Call Stack 執行

### prototype

- 因為在 JS 中，沒有 CLASS，所以我們可以透過「原型」繼承，來讓原本沒有某個屬性的物件，去存取其他物件的屬性

```javascript
// 使用setPrototypeOf(a, b)來去繼承。a為想要被繼承的人，b為其他原型物件。
Object.setPrototypeOf(rockman, cutman);
// 但是要注意到，一個物件無法指定兩個其他原型物件。
// 所以我們必須讓 b先繼承c，然後a再去繼承b，藉此達到原型鍊的概念。
```

- 若我們要找尋與原本物件同屬性的方法時，js 會先去找尋自己的方法，若沒有才會向上找尋
- 如果向上找有找到屬性，且屬性描述 writable 為 true，則會為此物件實體新增一個對應的方法。若為 false，同樣新增一個唯讀屬性。
- 若要查找是否為物件本身所有，則可以使用`hasOwnProperty`

### cookie vs localStorage vs SessionStorage

[cookie vs localStorage vs SessionStorage](https://liugoldent.gitbook.io/workspace/conceptual-analysis/http/http-cookie-storage)

### indexedDB
* 瀏覽器內置的 NoSQL 數據庫，用於在瀏覽器中存儲大量的結構化數據。它提供了一個客戶端存儲解決方案，允許 Web 應用程序在用戶的瀏覽器中保存數據，而不需要使用額外的服務器

* 客戶端數據存儲：IndexedDB 允許 Web 應用程序在客戶端存儲大量的結構化數據，這些數據可以是 JSON 對象、二進制數據等。這對於需要在離線狀態下工作或需要快速存取數據的應用程序非常有用。

* 離線應用程序：IndexedDB 是一個客戶端數據庫，允許 Web 應用程序在離線狀態下繼續工作，並在恢復在線連接後將數據同步到服務器。這對於需要離線使用的應用程序（如離線閱讀器、離線編輯器等）非常有用。

* 本地緩存：IndexedDB 可以用作瀏覽器的本地緩存，允許 Web 應用程序將數據保存在用戶的瀏覽器中，從而減少對服務器的請求次數，提高性能。

* 離線數據同步：IndexedDB 允許 Web 應用程序將數據保存在用戶的瀏覽器中，並在恢復在線連接後將數據同步到服務器。這可以實現離線數據同步的功能，使得用戶在任何時間、任何地點都能夠訪問最新的數據。

* 儲存量理論上沒有限制。所有操作都是非同步的。原生支持JS物件。

* 缺點：操作繁瑣、本身有門檻

```js
// 打開或創建一個名為 myDB 的數據庫，並指定數據庫的版本號為 1
var request = indexedDB.open('myDB', 1);

// 當數據庫打開成功時執行
request.onsuccess = function(event) {
  var db = event.target.result;
  // 創建一個事務（Transaction），並指定對象存儲為 myStore
  var transaction = db.transaction(['myStore'], 'readwrite');
  var store = transaction.objectStore('myStore');

  // 對 myStore 執行一些操作，例如增加數據、刪除數據等
  var data = { id: 1, name: 'John Doe', age: 30 };
  var request = store.add(data);

  // 當操作成功時執行
  request.onsuccess = function(event) {
    console.log('Data added successfully');
  };

  // 當操作失敗時執行
  request.onerror = function(event) {
    console.error('Error adding data:', event.target.error);
  };
};

// 當數據庫版本升級時執行
request.onupgradeneeded = function(event) {
  var db = event.target.result;
  // 創建一個對象存儲為 myStore，用於存儲數據
  var store = db.createObjectStore('myStore', { keyPath: 'id' });
};

```

### 用 JS 寫一個方法，使得結果映射到值[0-1]之間

```js
// 歸一化function
function normalizeValue(value, min, max) {
  return (value - min) / (max - min);
}
```

```js
// demo
const arr = [10, 20, 30, 40];
const min = Math.min(...arr); // 获取数组中的最小值
const max = Math.max(...arr); // 获取数组中的最大值

const normalizedArr = arr.map((value) => normalizeValue(value, min, max));
console.log(normalizedArr); // [0, 0.3333333333333333, 0.6666666666666666, 1]
```

### 請使用 createNodeIterator 寫一個方法遍歷頁面中所有的元素

[q5386](https://github.com/haizlin/fe-interview/issues/5386)

```js
function traverseAllElements() {
  const rootNode = document.documentElement;
  const iterator = document.createNodeIterator(
    rootNode,
    NodeFilter.SHOW_ELEMENT
  );

  let node;
  while ((node = iterator.nextNode())) {
    console.log(node.tagName);
  }
}
// createNodeIterator 方法会返回一个迭代器对象 iterator
// 該迭代器以rootNode作為節點
// 以NodeFilter.SHOW_ELEMENT過濾掉文本節點，迭代出每個節點，並將tag名稱輸出到控制台
```

### js 的 map 與 Object 差在哪

- key 的特性：在 Object 中，key 必定要 string or symbol。在 Map 中，key 可以為任何類型
- key 的順序：object 沒有特定順序。Map 保留插入 key 的順序。
- 大小與性能：Map 在儲存大量鍵值時且需要頻繁增刪操作時，有較好的性能。而 Object 在資料量較小時，比較簡單與高效。
- 迭代與遍歷：Map 使用 for..of。Object 使用 for..in。並且需要手動檢查屬性的可枚舉性。
- key 的唯一性：在物件中，後者增加的 key 會覆蓋掉前面的。而在 map 中會是唯一的鍵值。
- 如果對需要順序儲存、鍵值操作靈敏、性能較高可以使用 map
- 如果只是簡單地將 key-value 儲存起來，並且對 key-value 順序沒有要求，可以使用 object

## 模塊觀念

[文章](https://github.com/febobo/web-interview/issues/43)

- 優點：抽象、封裝、復用、依賴管理
- 如果沒有模塊化：
  - 變量、方法不易維護，容易污染全局作用域
  - 加載資源的方式通過 script 標籤從上到下
  - 依賴環境的主觀邏輯偏重，代碼較多會比較複雜
  - 大項目難以維護

### CommonJS AMD CMD

#### AMD：Asynchronous ModuleDefinition

- 是實例狀態發生改變時的回調函數，第一個參數是 resolved 狀態的回調函數，第二個參數是 rejected 狀態的回調函數異步模塊定義，采用異步方式加載模塊。所有依賴模塊的語句，都定義在一個回調函數中，等到模塊加載完成之後，這個回調函數才會運行

```js
/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    jquery: "jquery.min", //实际路径为js/lib/jquery.min.js
    underscore: "underscore.min",
  },
});
// 执行基本操作
require(["jquery", "underscore"], function ($, _) {
  // some code here
});
```

#### CommonJS

```js
// a.js
module.exports = { foo, bar };

// b.js
const { foo, bar } = require("./a.js");
```

### ES6 模塊

#### 輸出

```js
// profile.js
var firstName = "Michael";
var lastName = "Jackson";
var year = 1958;

export { firstName, lastName, year };
```

#### 輸入

```js
import { firstName, lastName, year } from "./profile.js";
```

## Decorator

- 代碼可讀性變強，裝飾器相當於一個注譯
- 在不改變原有程式之下，對原本功能進行擴展

```js
function log(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === "function") {
    descriptor.value = function (...args) {
      console.log(`Calling ${name} with arguments: ${args}`);
      return original.apply(this, args);
    };
  }
  return descriptor;
}

class MyClass {
  @log
  myMethod(a, b) {
    return a + b;
  }
}

const instance = new MyClass();
console.log(instance.myMethod(1, 2)); // Output: Calling myMethod with arguments: 1,2
```

#### 裝飾器洋蔥

- 外層裝飾器@dec(1)先進入，但是內層裝飾器@dec(2)先執行

```js
function dec(id) {
  console.log("evaluated", id);
  return (target, property, descriptor) => console.log("executed", id);
}

class Example {
  @dec(1)
  @dec(2)
  method() {}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

## set & map

- 另外有 weakSet & weakMap，都只是對 set map 的引用，沒有對應方法

### set

- 集合：其中元素各不相同，不會有重複的
- 型態：[value, value]
- add()、has()、delete()、clear()
- keys()、values()、entries()、forEach()

#### 去重

```js
// 数组
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]

// 字符串
let str = "352255";
let unique = [...new Set(str)].join(""); // ""
```

#### 並集、交集、差集

```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter((x) => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter((x) => !b.has(x)));
// Set {1}
```

### map

- 字典：元素的集合，每個元素有一個 key，不同元素 key 不同
- 型態：[key, value]
- size()、set()、get()、has()、delete()、clear() => 都是對 key 做操作
- keys()、values()、entries()、forEach()

## setTimeout setInterval

### setTimeout

- 用於在指定的時間後執行一次指定的函數或代碼片段

```js
setTimeout(() => {
  console.log("This will be executed after 2000 milliseconds.");
}, 2000);
```

- 取消：

```js
const timeoutId = setTimeout(() => {
  console.log("This will be executed after 2000 milliseconds.");
}, 2000);

// 在需要的時候取消定時器
clearTimeout(timeoutId);
```

### setInterval

- 在指定的時間間隔內重複執行指定的函數或代碼片段

```js
setInterval(() => {
  console.log("This will be executed every 1000 milliseconds.");
}, 1000);
```

- 需要重複執行的情況，如定期更新介面或執行周期性任務
- 取消

```js
const intervalId = setInterval(() => {
  console.log("This will be executed every 1000 milliseconds.");
}, 1000);

// 在需要的時候取消定時器
clearInterval(intervalId);
```

## JSON.parse 有什麼限制？

- JSON.parse 只能拷貝序列化對象（無法對函數、正則表達式、Data 物件）使用

## 如何讓物件丟失原型鍊

- object.create(null)

## 對空數組.every 會怎麼樣

- true

```js
const emptyArray = [];
const result = emptyArray.every((item) => item > 0);
console.log(result); // 输出: true
```

## object.preventExtensions、seal、freeze

### object.preventExtensions()

- 对象不可扩展, 即不可以新增属性或方法, 但可以修改/删除

### object.seal()

- 不可刪除，但可以改

### object.freeze()

- 对象所有属性只读, 不可修改

## 0.2+0.1 === 0.3
* 使用math.js
* 為 false
* 正確解法
```js
console.log((0.1 + 0.2).toFixed(1) === 0.3.toFixed(1)); // 输出: true
```

## 位元運算子
```js
console.log(9 << 2) // 36
console.log(9 >> 2) // 2
```

## js陣列的中斷方法
### for loop：break
```js
const array = [1, 2, 3, 4, 5];
for (let i = 0; i < array.length; i++) {
    if (array[i] === 3) {
        break; // 中斷循環
    }
    console.log(array[i]);
}
```
### forEach：false
```js
const array = [1, 2, 3, 4, 5];
array.forEach(element => {
    if (element === 3) {
        return false; // 中斷循環，但是4 5 還是會繼續
    }
    console.log(element);
});
```
### some：true
```js
const array = [1, 2, 3, 4, 5];
array.some(element => {
    if (element === 3) {
        return true; // 中斷循環
    }
    console.log(element);
});
```
### every：false
```js
const array = [1, 2, 3, 4, 5];
array.every(element => {
    if (element === 3) {
        return false; // 中斷循環
    }
    console.log(element);
    return true; // 繼續循環
});
```
### for...of for...in：break
```js
const array = [1, 2, 3, 4, 5];
for (const element of array) {
    if (element === 3) {
        break; // 中斷循環
    }
    console.log(element);
}
const object = { a: 1, b: 2, c: 3 };
for (const key in object) {
    if (key === 'b') {
        break; // 中斷循環
    }
    console.log(object[key]);
}

```

## 請寫出執行結果
```js
var abc1='123';
 function show(){
var abc2='456'; 
alert(abc1+' & '+abc2);
}
show(); 
alert(abc1+'&'+abc2);

// 123 & 456
// ERROR!
```

```js
var b = 1;
function print() {
  var b = a = 2;
  console.log(a,b);
}
print();
console.log(a,b);
// 2 2
// 2 1
```


## 考古題文章

[javascript-questions.md](https://github.com/h5bp/Front-end-Developer-Interview-Questions/blob/main/src/questions/javascript-questions.md)
[Daily-Interview-Question](https://github.com/Advanced-Frontend/Daily-Interview-Question)
[Amazon front end interview questions](https://www.frontendinterviewhandbook.com/companies/amazon-front-end-interview-questions/)
[Software Engineer interviews: Everything you need to prepare](https://www.techinterviewhandbook.org/software-engineering-interview-guide/)

## 觀念文章

[前端工程師一定要會的 JS 觀念題-中英對照之上篇](https://medium.com/starbugs/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8A%E7%AF%87-3b0a3feda14f#ff68)
[前端工程師一定要會的 JS 觀念題-中英對照之下篇](https://medium.com/hannah-lin/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8B%E7%AF%87-fd46292e374b)
