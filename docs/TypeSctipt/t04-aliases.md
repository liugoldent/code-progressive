---
description: TS - Interface vs Type Aliases 用法與差別
tags:
  - TS
  - TypeScript
---
# [TS] Interface vs Type Aliases 用法與差別

## 基本運用
* 使用`type`進行宣告
```ts
const printId = (id: number | string) => {
    console.log(`my id is ${id}`)
}
const sayHi = (person: {name: string, id: number | string}) => {
    console.log(`hi, ${person.name}! your id is ${id}.`)
}
```
* 但因為看到有些重複的地方，所以可以使用`Type Aliases`來簡化
```ts
type StringOrNum = string | number;
type objWithName = {name: string, id:StringOrNum}

const printId = (id:StringOrNum) =>{
    console.log(`print ${id}`)
}
const sayHi = (person: objWithName) => {
    console.log(`person ${person}`)
}
```
## Type Aliases的用途
* Type Aliases（型別別名）是一個用來創建型別別名的機制。它允許您給現有的型別指定一個自訂的名稱，從而簡化複雜型別的使用，提高程式碼的可讀性和可維護性。Type Aliases 不會創建新的型別，它們只是現有型別的別名
```ts
// 定義型別別名
type Point = {
  x: number;
  y: number;
};

type Rectangle = {
  topLeft: Point;
  bottomRight: Point;
};

// 使用型別別名
function getRectangleArea(rect: Rectangle): number {
  const { topLeft, bottomRight } = rect;
  const width = bottomRight.x - topLeft.x;
  const height = bottomRight.y - topLeft.y;
  return width * height;
}

const rect: Rectangle = {
  topLeft: { x: 0, y: 0 },
  bottomRight: { x: 10, y: 5 },
};

const area = getRectangleArea(rect);
console.log(area); // Output: 50

```
## 差別與相同
### 相同：都可定義物件（object, function, array）
#### interface
```ts
// object
interface IUser {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any
}

// function
interface SetPoint {
    (x: number, y: number): void;
}

// array
interface NumberArray  {
    [index: number]: number
}
```
### type aliases
```ts
// object
type TUser = {
    // 與IUser相同...
}

// function
type SetPoint = (x: number, y:number) => void;

// array
type NumberArray = {
    [index: number]: number
}
```
### 相同處：都可以extend
#### interface
```ts
interface Animal {
    name: string
}

interface Bear extends Animal {
    honey: boolean
}
```
#### type Aliases
```ts
type Animal = {
    name: string
}

type Bear = Animal & {
    honey: boolean
}
```
### 不同處：interface名稱可以重複定義並且合併，type不行
#### interface
```ts
interface Window {
    title : string
}

interface Window {
    size: number
}
```
#### type aliases
```ts
type Window = {
    title: string
}

type Window = {
    size: number
}
// Duplicate identifier 'Window'.
```
### 不同處：type可以描述primitive type、tuple、union type。interface無法

## 常用於
### Interface
* 定義物件結構： Interface 適用於定義物件的結構，它用於描述物件的屬性名稱、型別及其對應的值。當您需要創建物件，並且希望強制要求物件具有特定的屬性時，Interface 是一個更合適的選擇。

* 實現類別的合約： Interface 可以用於描述類別的合約，它們定義了類別應該實現的屬性和方法，從而確保符合某種特定的介面標準。

* 擴展性： Interface 可以進行擴展，讓一個 Interface 繼承另一個 Interface，從而在需要更多特性時保持程式碼的可擴展性
### type Aliases
* 定義複雜型別： 當您需要定義複雜的型別，例如聯合型別、交叉型別、函式型別或泛型型別，Type Aliases 提供了更靈活的方式。它可以用來組合現有的型別，創建更具通用性的型別。
```ts
type Status = "pending" | "approved" | "rejected";

function getStatusMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "Your request is pending approval.";
    case "approved":
      return "Your request has been approved.";
    case "rejected":
      return "Your request has been rejected.";
    default:
      return "Invalid status.";
  }
}

const pendingMessage = getStatusMessage("pending");
console.log(pendingMessage); // Output: "Your request is pending approval."
```
* 組合型別： Type Aliases 可用於將現有的型別組合在一起，創建出更複雜且具體的型別。
```ts
type Person = {
  name: string;
  age: number;
};

type Employee = {
  empID: string;
  department: string;
};

type EmployeeRecord = Person & Employee;

const employee: EmployeeRecord = {
  name: "John Doe",
  age: 30,
  empID: "12345",
  department: "IT",
};

```
* 泛型型別： 如果需要使用泛型參數，Type Aliases 提供了更簡潔的方式來定義泛型型別。
```ts
type Pair<T, U> = {
  first: T;
  second: U;
};

function swap<T, U>(pair: Pair<T, U>): Pair<U, T> {
  return { first: pair.second, second: pair.first };
}

const originalPair: Pair<number, string> = { first: 10, second: "hello" };
const swappedPair = swap(originalPair);
console.log(swappedPair); // Output: { first: "hello", second: 10 }

```
## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)
