---
description: 關於this的考題
tags:
  - javascript
  - interview
keywords:
  [
    html,
    css,
    js,
    javascript,
    this,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
  ]
---

# 談談 this

## 解釋

- 指每一個 function 在執行時，所參照的 reference 環境

- 當在 JavaScript 中使用 `this` 關鍵字時，它指的是當前執行上下文中的對象。JavaScript 中的 `this` 是一個非常重要且容易混淆的概念，它的值取決於調用函數的方式。

- 在全局執行環境中，`this` 將引用全局對象，在瀏覽器環境中通常是 `window` 對象。

## 用法

1. 在函數內部，`this` 的值取決於函數的調用方式：

```js
function myFunction() {
  console.log(this); // 在瀏覽器中，將引用 window 對象
}
myFunction(); // 調用作為函數
```

2. 作為方法調用：當函數作為對象的方法調用時，`this` 將引用該對象。

```js
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // 將引用 obj 對象的 name 屬性
  },
};
obj.greet(); // 調用作為方法
```

3. 使用 `call()`、`apply()` 或 `bind()`：您可以使用 `call()`、`apply()` 或 `bind()` 方法來顯式設置函數的 `this` 值。

```js
function greet() {
  console.log(`Hello, ${this.name}`);
}
const person = { name: "John" };
greet.call(person); // 使用 call() 方法，將 this 設置為 person 對象
```

4. 作為構造函數調用：當函數作為構造函數使用時（使用 new 關鍵字），`this` 將引用新創建的對象。

```js
function Person(name) {
  this.name = name;
}
const john = new Person("John");
console.log(john.name); // 將輸出 'John'
```

5. 箭頭函數：箭頭函數不會創建自己的 `this` 上下文，而是繼承自外部作用域中的 `this` 值。

```js
const obj = {
  name: "John",
  greet: () => {
    console.log(this.name); // 將引用全局上下文的 name 屬性（如果存在）
  },
};
obj.greet(); // 取決於全局上下文中是否有 name 屬性
```

## 相關考題

### call vs apply vs bind

- 用意：改變執行時的 this 指向
- 差別在於傳遞參數方式
- apply 只允許傳進兩個參數

```javascript
fun.call(this, arg1, arg2) == fun.apply(this, arguments);
```

### 程式碼題目

- 題目-1

```js
const obj = {
  amount: 100,
  getAmount: function () {
    return this.amount;
  },
};

const ans = obj.getAmount;
console.log(ans()); // undefined 因為最後沒人呼叫ans()
// 解決辦法
const ans = obj.getAmount.bind(obj); // 輸出100
```

- 題目-2

```js
var amount = 1000(function () {
  const obj = {
    amount: 100,
    foo: function () {
      setTimeout(() => {
        console.log(this.amount);
      }, 0);
      setTimeout(function () {
        console.log(this.amount);
      }, 0);
    },
  };
  obj.foo();
})();
```

- 在第一個 setTimeout 函數中，使用了箭頭函數 () => {}，這導致內部的 this 始終指向 obj，因此 this.amount 訪問了 obj 的 amount 屬性，輸出為 100。
- 在第二個 setTimeout 函數中，使用了普通的匿名函數 function() {}，這導致內部的 this 指向全局範圍，因此 this.amount 訪問了全局範圍的 amount 變數，輸出為 1000。
