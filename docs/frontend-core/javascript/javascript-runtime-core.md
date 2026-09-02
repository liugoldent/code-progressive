---
sidebar_position: 1
title: "JavaScript 底層核心：執行環境、記憶體與非同步"
description: "從執行上下文、詞法環境、閉包、物件參照、原型鏈，到 Promise 與 Event Loop，建立能推導程式行為的 JavaScript 心智模型。"
tags: [JavaScript, Runtime, Event Loop]
keywords: ["JavaScript 底層原理", "執行上下文", "詞法環境", "閉包", "原型鏈", "Event Loop", "Promise"]
---

# JavaScript 底層核心：從執行模型理解程式行為

學 JavaScript 時，很容易記住許多分散的結論：`var` 會提升、閉包會保留變數、Promise 比 `setTimeout` 早執行。真正遇到新題目時，死背的規則卻常常不夠用。

比較穩定的理解方式，是先建立一條共同主線：

> JavaScript 引擎如何讀取程式、建立執行上下文、解析名稱、配置物件，再與瀏覽器提供的任務排程機制合作。

只要能沿著這條主線推導，多數作用域、`this`、原型與非同步問題就不必逐題背答案。

## 1. JavaScript、引擎與瀏覽器不是同一件事

JavaScript 的語言規則主要由 ECMAScript 規範定義，例如型別、函式、Promise 與模組。真正執行程式的是 JavaScript 引擎，例如 V8、SpiderMonkey 或 JavaScriptCore。

但 `document`、`fetch`、`setTimeout` 並不是 ECMAScript 語言本身，而是瀏覽器這個宿主環境提供的 Web API。Node.js 則提供另一組宿主 API。

```text
JavaScript 程式
  ├─ ECMAScript：型別、函式、物件、Promise、Module
  ├─ JavaScript 引擎：解析、編譯、最佳化、執行、GC
  └─ 宿主環境：DOM、fetch、timer、事件、檔案或網路 API
```

這能解釋一個常見疑問：JavaScript 可以是單執行緒，瀏覽器仍能同時等待計時器與網路。等待工作由宿主環境處理；回呼何時能執行，才由事件迴圈排程回 JavaScript 執行緒。

## 2. 從原始碼到執行：不是單純逐行直譯

現代引擎通常會先解析原始碼、產生抽象語法樹（AST），再產生 bytecode 或機器碼執行。頻繁執行的程式可能被最佳化編譯；若執行時的假設失效，也可能去最佳化。

因此「JavaScript 是直譯語言」只能算入門簡化說法。對日常開發更重要的是：引擎在執行某段程式前，已經知道其中有哪些宣告。這也是理解提升與暫時性死區的起點。

## 3. 執行上下文與 Call Stack

執行全域程式、呼叫函式或執行模組時，引擎會建立對應的執行上下文（Execution Context）。可以先把它理解成一次執行所需的資料集合，包含：

- 目前可見的變數與函式宣告；
- 外層詞法環境的連結；
- `this` 等執行資訊。

呼叫堆疊（Call Stack）記錄尚未完成的執行上下文。函式被呼叫時入棧，結束時出棧。

```js
function inner() {
  console.log("inner");
}

function outer() {
  inner();
}

outer();
```

執行 `console.log` 時，堆疊可簡化成：

```text
global → outer → inner → console.log
```

遞迴太深出現 `Maximum call stack size exceeded`，原因不是「有迴圈」，而是尚未返回的函式呼叫持續占用堆疊。

## 4. 詞法作用域：名稱由「寫在哪裡」決定

JavaScript 採用詞法作用域（Lexical Scope）。一個識別字能找到哪個宣告，主要由原始碼的巢狀位置決定，而不是函式從哪裡被呼叫。

```js
const label = "global";

function print() {
  console.log(label);
}

function run() {
  const label = "local";
  print();
}

run(); // global
```

`print` 定義在全域，因此找不到自己的 `label` 時，會沿著定義位置的外層環境尋找，不會跑到呼叫者 `run` 的區域作用域。

每個詞法環境可以想成「名稱到 binding 的對照表」，並保有指向外層環境的連結。解析名稱時，會從目前環境逐層往外找，直到找到 binding 或拋出 `ReferenceError`。

## 5. 宣告、提升與 TDZ

「提升」不是原始碼真的被搬到檔案頂端，而是引擎在執行敘述前，就先建立宣告所需的 binding。

| 宣告 | 作用域 | 進入作用域時的狀態 | 宣告前讀取 |
|---|---|---|---|
| `var` | 函式或全域 | 初始化為 `undefined` | 得到 `undefined` |
| `let` / `const` | 區塊 | binding 已建立但未初始化 | `ReferenceError` |
| function declaration | 函式或全域／區塊規則 | 通常已可呼叫 | 可在宣告前呼叫 |

```js
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;
```

從進入作用域到 `let`／`const` 宣告完成初始化之前，稱為暫時性死區（TDZ）。重點不是變數不存在，而是 binding 尚未允許存取。

### `const` 限制的是重新綁定

`const` 不會讓物件內容自動不可變，只是不允許同一個變數改指向另一個值。

```js
const user = { name: "Ada" };
user.name = "Grace"; // 可以：修改物件內容
user = {}; // TypeError：不能重新指定 binding
```

## 6. 閉包：函式保留需要的詞法環境

函式建立時會記住其外層詞法環境。即使外層函式已返回，只要內層函式仍可被存取，它需要的 binding 就不能被回收。這個組合稱為閉包（Closure）。

```js
function createCounter() {
  let count = 0;
  return function increment() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
counter(); // 1
counter(); // 2
```

閉包保留的是 binding，不是建立當下數值的快照。因此下列 `var` 版本共用同一個 `i`：

```js
for (var i = 1; i <= 3; i += 1) {
  setTimeout(() => console.log(i), 0);
}
// 4、4、4
```

`let` 在 `for` 迴圈中會為每次 iteration 建立新的 binding：

```js
for (let i = 1; i <= 3; i += 1) {
  setTimeout(() => console.log(i), 0);
}
// 1、2、3
```

閉包本身不是記憶體洩漏。只有當不再需要的閉包仍被 listener、timer 或長生命週期容器引用時，相關資料才會無法被垃圾回收。

## 7. 值、binding、物件參照與複製

JavaScript 的參數傳遞一律是 pass-by-value。差別在於：原始值的 value 就是資料本身；物件變數中的 value 是指向物件的參照。

```js
function update(profile) {
  profile.name = "Grace"; // 經由參照修改同一個物件
  profile = { name: "Linus" }; // 只改區域變數的 binding
}

const user = { name: "Ada" };
update(user);
console.log(user.name); // Grace
```

展開語法、`Object.assign`、`slice` 都只建立淺拷貝；巢狀物件仍共用參照。

```js
const original = { settings: { theme: "dark" } };
const copied = { ...original };
copied.settings.theme = "light";
console.log(original.settings.theme); // light
```

需要支援循環參照、`Date`、`Map`、`Set`、TypedArray 等資料時，可考慮 `structuredClone()`。它仍不能複製函式與 DOM node。

`JSON.parse(JSON.stringify(value))` 是 JSON 序列化往返，不是通用深拷貝：它會遺失 `undefined`、Symbol、函式，無法處理循環參照，並改變部分物件型別。

## 8. 型別、裝箱與相等比較

ECMAScript 的原始型別包含 `undefined`、`null`、Boolean、String、Symbol、Number、BigInt；其餘皆屬 Object。

```js
typeof null; // "object"，歷史相容結果
typeof []; // "object"
typeof function () {}; // "function"，typeof 的特殊結果
Array.isArray([]); // true
```

字串等原始值看似能呼叫方法，是因為存取屬性時會發生暫時的裝箱行為，不代表它永久變成物件。

寬鬆相等 `==` 會依 Abstract Equality Comparison 規則進行轉換，組合後容易產生反直覺結果。一般業務程式優先使用 `===`。

```js
0 == false; // true
"" == 0; // true
null == undefined; // true
NaN === NaN; // false
Object.is(NaN, NaN); // true
```

物件轉成原始值時，會經過 `Symbol.toPrimitive`、`valueOf`、`toString` 等規則；這也是 `[] == false` 等結果的來源。

## 9. 物件、原型鏈與 `new`

JavaScript 物件除了自己的屬性，還有一個內部 `[[Prototype]]` 連結。讀取屬性時，引擎先找物件自身；找不到才沿原型鏈向上，直到 `null`。

```js
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  },
};

const dog = Object.create(animal);
dog.name = "Mochi";
dog.speak(); // Mochi makes a sound
```

原型鏈是查找委派，不是把 `animal` 的屬性複製進 `dog`。

對可建構函式執行 `new Constructor(...args)`，可簡化為四步：

1. 建立新物件；
2. 將新物件的 `[[Prototype]]` 指向 `Constructor.prototype`；
3. 以新物件作為 `this` 呼叫建構函式；
4. 若建構函式明確回傳物件，使用該物件，否則使用新物件。

`class` 提供較清晰的語法與額外限制，但實例方法仍透過 prototype 共用。`value instanceof Ctor` 檢查的核心則是 `Ctor.prototype` 是否出現在 `value` 的原型鏈上。

## 10. `this` 由呼叫方式決定

一般函式的 `this` 不是由定義位置決定，而是由呼叫方式決定：

```js
const user = {
  name: "Ada",
  greet() {
    return this.name;
  },
};

user.greet(); // this 是 user
const greet = user.greet;
greet(); // strict mode 下 this 是 undefined
```

可依下列順序判斷：

1. `new Fn()`：`this` 是新物件；
2. `fn.call(value)`／`apply`／`bind`：明確指定；
3. `object.fn()`：`this` 是點號左側的 base object；
4. 單獨 `fn()`：strict mode 為 `undefined`。

箭頭函式沒有自己的 `this`，它沿用定義位置外層環境的 `this`。因此適合 callback，通常不適合當需要動態 receiver 的物件方法。

## 11. 垃圾回收看的是可達性

垃圾回收器會從 root（例如目前執行上下文、全域物件）出發，標記仍可到達的物件，回收不可達物件。

常見的非預期保留來源包括：

- 未移除的事件監聽器；
- 未停止的 timer；
- 持續增長的快取；
- closure 捕捉到大型物件；
- 已從 DOM 移除、但仍被 JavaScript 變數引用的節點。

「設成 `null`」只有在它切斷最後一條必要參照時才有意義。判斷記憶體問題的核心仍是：從 root 到該物件還存在哪條參照路徑。

## 12. Event Loop：排程任務，不讓 JavaScript 平行執行

瀏覽器中的 JavaScript 通常在一個 event loop 上一次執行一個 task。同步程式先一路執行到 call stack 清空，稱為 run-to-completion。

可以先用這個簡化模型推導：

1. 執行一個 task（初始 script、click callback、timer callback）；
2. task 結束、call stack 清空；
3. 清空 microtask queue；
4. 瀏覽器可能進行 rendering；
5. 進入下一個 task。

Promise reaction、`queueMicrotask` 通常進 microtask queue；`setTimeout` callback 在時間條件滿足後排入 task queue。延遲時間是「最快何時可排程」，不是保證精準執行時間。

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
queueMicrotask(() => console.log("D"));
console.log("E");
// A、E、C、D、B
```

`C` 在 `D` 前面，因為兩個 microtask 依加入 queue 的順序執行。`B` 要等目前 task 與所有 microtask 完成。

microtask 可以繼續加入 microtask；若無限產生，瀏覽器可能一直沒有機會 rendering 或處理下一個 task，形成 microtask starvation。

## 13. Promise 與 async/await

Promise 代表未來結果，狀態只會從 pending 轉為 fulfilled 或 rejected，完成後不可再次改變。

`.then()` 不會修改原 Promise，而會立刻回傳新 Promise。callback 的回傳方式決定它如何完成：

- 回傳一般值：新 Promise fulfilled；
- `throw`：新 Promise rejected；
- 回傳 Promise／thenable：新 Promise 採用其最終狀態。

`async` 函式一定回傳 Promise。執行到 `await expression` 時，會先以 Promise 語意解析 expression，暫停該 async 函式；其 continuation 之後透過 microtask 繼續。

```js
async function run() {
  console.log(1);
  await null;
  console.log(2);
}

console.log(0);
run();
console.log(3);
// 0、1、3、2
```

`await` 暫停的是該 async 函式，不會阻塞整條執行緒。把 async/await 說成 Generator 的語法糖可作早期類比，但規範中它們是不同機制。

兩個互不依賴的工作可同時啟動：

```js
const [user, products] = await Promise.all([
  fetchUser(),
  fetchProducts(),
]);
```

`Promise.all` 失敗得快，但不會自動取消其他工作。若需要取消，要搭配 API 支援，例如 `fetch` 的 `AbortController`。

## 14. DOM 事件為什麼能委派

事件路徑大致分為 capture、target、bubble。多數事件從外層捕獲到 target，再由 target 冒泡回外層，因此父元素能處理後來才建立的子元素事件。

```js
document.querySelector(".list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button || !event.currentTarget.contains(button)) return;
  console.log(button.dataset.id);
});
```

- `event.target`：事件最初指向的節點；
- `event.currentTarget`：目前執行 listener 的節點；
- `preventDefault()`：取消可取消的預設行為；
- `stopPropagation()`：停止事件繼續走傳遞路徑；
- `stopImmediatePropagation()`：連同目前節點後續 listener 也停止。

事件委派不只減少 listener，也能集中管理動態子元素；但 `focus`、`mouseenter` 等事件的傳遞特性不同，使用前要確認。

## 15. ES Module 不只是拆檔案

ES Module 具備自己的 module scope、預設 strict mode，以及可靜態分析的 import/export 結構。import 得到的是 live binding，不是匯入當下的值複製。

```js
// counter.js
export let count = 0;
export function increment() {
  count += 1;
}

// app.js
import { count, increment } from "./counter.js";
increment();
console.log(count); // 1
```

CommonJS 與 ES Module 的載入、循環依賴和 binding 語意不同，不應只理解成 `require` 換成 `import`。

## 16. 程式碼題的推導順序

看到一段 JavaScript，可以固定問：

1. 建立了哪些作用域與 binding？它們初始化了嗎？
2. 函式定義在哪裡，因此外層詞法環境是誰？
3. 呼叫如何發生，因此一般函式的 `this` 是誰？
4. 屬性在物件自身還是原型鏈上？
5. 物件是否共用參照？淺拷貝切斷了哪一層？
6. 同步 call stack 何時清空？加入了哪些 microtask 與 task？
7. 哪些 root 仍參照物件，它真的能被 GC 嗎？

這套順序比背單一題目的輸出更有價值，因為它能推導沒看過的程式。

## 延伸閱讀

- [Event Loop：任務、微任務與執行順序](./eventLoop.md)
- [`this`、call、apply 與 bind](./interview-js-this.md)
- [JavaScript 綜合觀念整理](./fe-js.md)
- [JavaScript 與瀏覽器 API 實務](./fe-js-1.md)
