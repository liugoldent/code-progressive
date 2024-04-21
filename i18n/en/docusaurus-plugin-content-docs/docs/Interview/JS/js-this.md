---
description: About this
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

- Refers to the reference environment that each function refers to when executed.
- When using the this keyword in JavaScript, it refers to the object in the current execution context. The value of this in JavaScript depends on how the function is called.
- In the global execution environment, this will reference the global object, typically the window object in a browser environment.

## 用法

1. Inside a function, the value of `this` depends on how the function is called:

```js
function myFunction() {
  console.log(this); // In a browser, will reference the window object
}
myFunction(); // Called as a function
```

2. As a method call: When a function is called as a method of an object, `this` will reference that object.

```js
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // References the name property of the obj object
  },
};
obj.greet(); // Called as a method
```

3. Using `call()`, `apply()`, or `bind()`: You can explicitly set the value of `this` for a function using the `call()`, `apply()`, or `bind()` methods.

```js
function greet() {
  console.log(`Hello, ${this.name}`);
}
const person = { name: "John" };
greet.call(person); // Sets this to the person object using the call() method
```

4. As a constructor call: When a function is used as a constructor (with the `new` keyword), this will reference the newly created object.

```js
function Person(name) {
  this.name = name;
}
const john = new Person("John");
console.log(john.name); // Outputs 'John'
```

5. Arrow functions: Arrow functions do not create their own `this` context but inherit the `this` value from the outer scope.

```js
const obj = {
  name: "John",
  greet: () => {
    console.log(this.name); // References the name property of the global context (if exists)
  },
};
obj.greet(); // Depends on whether there is a name property in the global context
```

## 相關考題

### call vs apply vs bind

- Purpose: To change the context of `this` during execution.
- Difference lies in how parameters are passed.
- `apply` allows only two parameters to be passed.

```javascript
fun.call(this, arg1, arg2) == fun.apply(this, arguments);
```

### 程式碼題目

- Question-1

```js
const obj = {
  amount: 100,
  getAmount: function () {
    return this.amount;
  },
};

const ans = obj.getAmount;
console.log(ans()); // undefined because ans() is not called by anyone
// Solution
const ans = obj.getAmount.bind(obj); // Outputs 100
```

- Question-2

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

- In the first setTimeout function, an `arrow function () => {}` is used, which causes the inner this to always reference obj, so this.amount accesses the amount property of obj and outputs 100.
- In the second setTimeout function, a regular anonymous function `function() {}` is used, which causes the inner this to refer to the global scope, so this.amount accesses the amount variable in the global scope and outputs 1000.
