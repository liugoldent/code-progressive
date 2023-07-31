---
description: TS - Function 
tags:
  - TS
  - TypeScript
---
# [TS] Function - 函數的進階使用
## 基本用法
```ts
// 傳入message：string型態。傳出:never型態
function error(message: string): never {
  throw new Error(message)
}
// curry化
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}
 
function printToConsole(s: string) {
  console.log(s);
}
 
greeter(printToConsole); //Hello, World
```
## 進階用法
### Call Signatures
* 定義函數型別，這些函數型別可以用來描述函數的形狀、參數和返回值類型。
* Call Signatures 是 TypeScript 中函數型別的一種。
```ts
// 定義一個函數型別 AddFunction，描述接受兩個 number 參數並返回 number 的函數
type AddFunction = (a: number, b: number) => number;

// 定義一個函數 add，符合 AddFunction 型別
const add: AddFunction = (a, b) => {
  return a + b;
};

// 使用 add 函數
const result = add(5, 3); // 5 + 3 = 8
console.log(result); // 輸出 8
```

### Construct Signatures
* 當使用這個時，是在定義建構函數的型別。
* 建構函數是用來創建新物件的特殊函數，在JS中通常使用`new`關鍵字來呼叫建構函數
```ts
// 定義一個建構函數型別 CircleConstructor，描述接受一個 number 參數並返回 Circle 物件的建構函數
type CircleConstructor = new (radius: number) => Circle;

// 定義一個 Circle 類別
class Circle {
  constructor(public radius: number) {}

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

// 使用 CircleConstructor 建立新物件
const CircleClass: CircleConstructor = Circle;
const circleInstance = new CircleClass(5);

// 使用建構函數建立的物件
console.log(circleInstance.getArea()); // 輸出 78.53981633974483
```
### Optional Parameters 可選參數
* 在js中，如果沒有帶入函式參數會是undefined，且可以正常運作
* 但在ts中，所以參數預設都是必填的，沒填的話會compiler報錯
```ts
const getName = (firstName: string, lastName?: string) =>{
  return lastName ? `${firstName}${lastName}` : firstName
}
```
### 使用函數預設值
* 如果要使用預設值，要傳入undefined
```ts
const getName = (firstName = "Tom", lastName: string) =>{
  // to-do
}
getName(undefined, "Chen")
```
### Rest Parameters
* 如果想要拓展參數，可以使用關鍵字`...`
```ts
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n*x)
}
const a = multiply(10, 1, 2, 3, 4)
```
### Math.atan2的細節
```ts
// error
const args = [8, 5]
const angle = Math.atan2(...args) // 語法上會有問題，因為atan2接受兩個獨立參數

// correct
const args = [8, 5];
const [y, x] = args;
const angle = Math.atan2(y, x);
```

### Function Overloads（函式超載）
* 作法：在程式碼中，有著相同的函數名稱，但是輸出輸入各不相同
* 最後一個函數只是一個「實現簽名」，這個簽名不能直接調用，能調用的只有上面的重載簽名
```ts
// 以下我們function add 三個同名，但是輸入輸出各不相同
// 在框架中定義函數 add
//overload signatures 定義
function add(a: number, b: number): number;
function add(a: string, b: number): string;

//function implementation 實現
function add(a: string | number, b: number): string | number {
  if (typeof a === "string") {
    return a + b.toString();
  } else {
    return a + b;
  }
}
// js 編譯
"use strict";
function add(a, b) {
    if (typeof a === "string") {
        return a + b.toString();
    }
    else {
        return a + b;
    }
}
```
* 至少要兩個 or 以上的overload signatures
* 實際執行函式帶入的參數型別要兼容 overload signatures 的型別
```ts
// 錯誤
function fn(x: string): void; // 定義層

function fn() {
   console.log("hello"); // 實現層
}
fn(); 
//error: Expected 1 arguments, but got 0.
```
```ts
// 正確
function fn(x: string): void; // 定義層
function fn(): void; // 定義層
function fn() {
  console.log("hello"); // 實現層
}
fn();

```

## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)



















