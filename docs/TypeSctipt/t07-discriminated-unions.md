---
description: TS - Discriminated unions 
tags:
  - TS
  - TypeScript
---
# [TS] Discriminated Unions - 可辨識聯合
## 概念
* 是一種使用聯合型別和特定的共同屬性（discriminant property）來區別不同變數類型的技巧。
* 通常會為`type`加上`kind`關鍵字
* 可以使用在response時候（參考[Narrowing Part 2](https://ithelp.ithome.com.tw/articles/10277022)）
## 使用
### 使用type aliases
```ts
// 定義一個表示圓形和矩形的聯合型別 Shape
type Shape = {
  kind: "circle";
  radius: number;
} | {
  kind: "rectangle";
  width: number;
  height: number;
};

// 函數依據 shape.kind 進行不同處理
// 輸入型別為Shape，輸出為number
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript 知道 shape 是圓形類型，可以直接訪問 radius 屬性
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TypeScript 知道 shape 是矩形類型，可以直接訪問 width 和 height 屬性
      return shape.width * shape.height;
    default:
      // TypeScript 會檢測所有的 case 都處理了，因此不會報錯
      return 0;
  }
}

// 建立兩個不同的形狀
const circle: Shape = { kind: "circle", radius: 5 };
const rectangle: Shape = { kind: "rectangle", width: 4, height: 6 };

console.log(calculateArea(circle));     // 輸出圓形面積：78.53981633974483
console.log(calculateArea(rectangle));  // 輸出矩形面積：24

```
### 使用 interface
```ts
// 定義一個表示圓形的接口
interface Circle {
  kind: "circle";
  radius: number;
}

// 定義一個表示矩形的接口
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

// 定義一個表示形狀的聯合型別 Shape
type Shape = Circle | Rectangle;

// 函數依據 shape.kind 進行不同處理
function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript 知道 shape 是圓形類型，可以直接訪問 radius 屬性
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      // TypeScript 知道 shape 是矩形類型，可以直接訪問 width 和 height 屬性
      return shape.width * shape.height;
    default:
      // TypeScript 會檢測所有的 case 都處理了，因此不會報錯
      return 0;
  }
}

// 建立兩個不同的形狀
const circle: Circle = { kind: "circle", radius: 5 };
const rectangle: Rectangle = { kind: "rectangle", width: 4, height: 6 };

console.log(calculateArea(circle));     // 輸出圓形面積：78.53981633974483
console.log(calculateArea(rectangle));  // 輸出矩形面積：24

```
## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)
