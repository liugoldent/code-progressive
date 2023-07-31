---
description: TS - 基本型別
tags:
  - TS
  - TypeScript
---
# [TS] 基本型別

## 資料型別 - 總覽與基本型別
* 原始資料型別：String、number、Boolean、null、undefined
* 物件型別：object、arrays、function
* TS特有型別：any、unknown、void、never、union types、intersection types、literal types、tuple、enums
```ts
// any：表示允許賦值為任意型別。
let myVar: any = 7
myVar = 'abc'

// unknown：unknown 只能賦值給 any 和自己
let varS: unknown
varS = 8 // 如果unknown可以任意賦值
varS = 'seven' // 如果unknown可以任意賦值
let varS2: unknown = varS // 如果unknown可以任意賦值（包含變數為unknown型別）
let varS3: boolean = varS // 但是不可以賦值給指定型別
// Type 'unknown' is not assignable to type 'boolean'.

// void：代表沒有return 值
function alertName():void {
  console.log('123')
}

// never：表示不應該存在的型別，一般用於錯誤處理函式
function error(message: string): never {
  throw new Error(message)
}

// union types：使用 | 來代表定義的變數可以有多樣的型別
let varS: number | string = 2
varS = 'abc'

// intersection：表示其定義的值都必須符合多種型別。
interface Colorful {
  color: string
}
interface Circle {
  radius: number
}

type ColorfulCircle = Colorful & Circle

let c: ColorfulCircle = {
  color: 'red',
  radius: 2
}

// tuple：多元組。合併不同型別的陣列
let a: [string , number] = ['iris', 18]

// enum：列舉：可以用來管理多個系列的常數，作為狀態判斷使用
enum Days {
  Sun, Mon, Tue, Wed
}
console.log(Days["Sun"] === 0)
console.log(Days["Mon"] === 1)
```

## 資料型別 - 物件型別
### 物件
#### 基本型態
```ts
let person = {
  name: 'abc',
  age: 18
}
// 錯誤：Type 'string' is not assignable to type 'number'.
person.age = 'c' 

// 錯誤：Property 'job' does not exist on type '{ name: string; age: number; }'.
person.job = 'stock' 

// 錯誤：Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.
person = {
    name: "bb"  
}

// 錯誤
// Type '{ gender: string; job: string; }' is not assignable to type '{ name: string; age: number; }'.
// Object literal may only specify known properties, and 'gender' does not exist in type '{ name: string; age: number; }'.
person = {
    gender : "male",
    job : "在家躺"
}
```
引自[Day08:【TypeScript 學起來】物件型別 Object Types : object](https://ithelp.ithome.com.tw/articles/10269828)
* 覆寫的值需與屬性對應的型別相同
* 對物件整體覆寫，其覆寫的物件格式必須完全相同
* 不能隨意新增原先不存在該物件的屬性
* 不能覆寫整個物件時的格式錯誤（少一個 key / 新增 key / key所對應的值型別錯誤）
* 但如果 delete 屬性 TS 不會警告 ，還能夠進行刪除，不小心刪掉就GG (沒開嚴謹模式的時候)
* 補充：tsconfig 開啟嚴謹模式時，刪除屬性時 compiler 會報錯提醒。
#### 進階型態
```ts
// 定義為object後，無法針對單一屬性直接修改（但可以全部覆蓋）
let person2: object = {
    name: "iris",
    age: 18
};

person2.name = 'alex' // Property 'n' does not exist on type 'object'.

person2 = {
    name: "bb"   //ok
}

// ps.可手動定義屬性型別
let person3 : {name: string, age: number} = {
    name: "iris", 
    age: 18
}
```
* 無法單獨對該物件屬性做覆寫，即使相同型別的值也無法
* 無法單獨新增屬性
* 無法刪除屬性
* 可以完全覆寫整個物件（新增/減少屬性，即使型別完全不同都可以）


### Function
```ts
// 手動定義參數
const getUserInfo = (person4: { name: string, age: number }) => {
    console.log(` Hello, my name is ${person4.name}. I'm ${person4.age} years old.`);
}
//  Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.
getUserInfo({name: 'alex'}) // -> 注意這邊要傳物件進去


// 可選屬性
const getUserInfo2 = (person5: { name: string, age?: number }) =>{
    // 不過當沒傳入age時會undefined，要特別處理
    console.log(` Hello, my name is ${person5.name}. I'm ${person5.age} years old.`);
}
getUserInfo2({name: 'alex'}) // -> 注意這邊要傳物件進去 -> 結果：" Hello, my name is alex. I'm undefined years old." 

// 參數型別註譯
function greet(name: string){
  console.log("Hello, " + name.toUpperCase() + "!!")
}
greet(42) // Argument of type 'number' is not assignable to parameter of type 'string'.


// 返回值型別註譯
function getFavoriteNumber(): number {
  return 28
}

function greet(name: string): string{
  return 28
}
// Type 'number' is not assignable to type 'string'.
```
#### Function的定義
```ts
function sum(x:number , y:number): number {
  return x + y
}

let sum3 = (x: number, y: number): number => x+y
```

## 資料型別 - 特殊型別
### any
* 用途：如果我們不希望某些值出現型別檢查錯誤，可以使用`any`，他用來表示允許賦值成任意型別
```ts
let myVar: any = 'seven'
myVar = 7
```
* 未宣告型別的變數及參數也視為`any`
```ts
let somethinn;
something = 7
something = 'seven'
```
* 提醒使用了any：  
在tsConfig中，打開`noImplicitAny = true` or 打開`strict: true`
他就會提醒你any型別。

### unknown
* 可以接受任何型別賦值，有點類似`any`，但使用上比`any`安全
```ts
function f1(a: unknown) {
  a.b()
}
```
* 使用`unknown`會報錯，沒有b函式屬性。
* `unknown`和`any`都可以接受任何型別的賦值，但any可以賦值給任何型別，`unknown`只可以給`unknown` or `any`
```ts
let value: unknown;

let value1: unknown = value; // ok
let value2: any = value; // ok
let value3: boolean = value; // error
let value4: number = value; // error
let value5: string = value; // error
let value6: object = value; // error
let value7: any[] = value; // error
let value8: Function = value; // error
```
### void
* 表示空值的概念，在ts中代表沒有返回值
```ts
function alertName(): void {
  alert('xxx')
}
```
### never
* 表示不應該存在的狀態，一般用於錯誤處理
```ts
function error(message: string):never {
  throw new Error(message)
}
```
## 資料型別 － 特殊：Union / Intersection

### union 聯合型別
* 表示取值可以為多種型別中的其中一種。跟JS的||概念是一樣的
```ts
// 正常狀況下
function printId(id: number | string){
  console.log("your id is: " + id)
}
printId(101)
printId('202')

```
* 但是函數內部使用不同屬性，就會報錯
```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
}
// Property 'toUpperCase' does not exist on type 'string | number'.
// Property 'toUpperCase' does not exist on type 'number'.
```

### intersection Types（交集型別）
* 與`&&` 概念相同，必須同時符合兩種型別
* 錯誤例子
```ts
function printId(id: number & string) {
  console.log("Your ID is: " + id);
}
printId(101); //error
printId("202"); //error
```
* 主要用來組合現有的型別
```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

//用type aliases 宣告 ColorfulCircle 型別，需滿足 Colorful 及 Circle 型別
type ColorfulCircle = Colorful & Circle;

//帶入的參數需滿足 ColorfulCircle 型別
function draw(circle: ColorfulCircle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

draw({ color: "blue", radius: 42 });// ok
draw({ color: "red", raidus: 42 }); //error
```

## 資料型別 - 特殊：Literal Types（字面值型別）
### Literal
* 值的表現方式，某些特殊的"值"可以當作"型別"來使用
```ts
let x: "hello" = "hello";
x = "hello"; //ok
x = "howdy"; // Type '"howdy"' is not assignable to type '"hello"'.
```
### number literal types
```ts
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```
### non-literal types
```ts
interface Options {
  width: number
}

function configure(x: Options | 'auto'){
  console.log(x)
}
configure({ width: 10})
configure('auto')
configure('autoatic') 
// Argument of type '"autoatic"' is not assignable to parameter of type 'Options | "auto"'.
```

## 資料型別 - 特殊：Tuple（元祖）
### Tuple 優點
* 確保固定結構： Tuple 允許您指定陣列中每個位置的元素型別，因此可以確保在開發過程中不會隨意增減元素或改變元素型別。這在需要明確且不可變的數據結構時非常有用，以避免錯誤。
* 保持順序： Tuple 保留元素的順序，這對於某些特定情況下很重要。例如，當您需要表示座標 (x, y) 時，Tuple 可以很方便地表示
```ts
let point: [number, number] = [10, 20];
```
* 提供特定索引的含義：Tuple 的每個位置都有特定的含義，例如在表示日期時，可以使用 Tuple 表示 (年份, 月份, 日)：
```ts
let date: [number, number, number] = [2023, 7, 31];
```
* 性能優化： Tuple 在某些情況下可以提供比使用陣列更好的性能。由於 Tuple 的元素數目和型別固定，因此在某些特定情況下，編譯器和運行時可以對 Tuple 做出更有效的優化。
### 使用
* 表示具有固定元素數目且每個元素可以是不同型別的陣列。
```ts
const iris: [string, number] = ['iris', 18]

let tom: [string, number];
tom = ['tom', 18]
tom[0] = 'tom'
tom[1] = 25

tom = ['tom chen']
// Type '[string]' is not assignable to type '[string, number]'.Source has 1 element(s) but target requires 2.
tom.push(true)
// Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```
```ts
let person: [string, number, boolean];
person = ["John Doe", 30, true];
```

## 資料型別 - 特殊：enums（列舉）
* enum 是一種用於定義命名常數集合的機制。它可以幫助您在程式碼中更清晰地表示某些特定值，而不是使用數字或字串。
* 當有一組固定且相關聯的值時，使用 enum 可以提供更好的可讀性和維護性。
### Enum 基本語法
```ts
enum EnumName {
  Member1,
  Member2,
  Member3,
  // ...
}
```
### Enum 優點
* 可讀性和可維護性： 使用 enum 可以為數字或字串值賦予有意義的名稱，從而增加程式碼的可讀性。當您閱讀程式碼時，直觀地知道變數是哪個具體的狀態或類型，而不需要直接查看具體的數字或字串值。
* 避免錯誤： enum 使程式碼更具有明確性，減少了手動輸入數字或字串值時可能出現的錯誤。如果在程式碼中使用具體的數字或字串值，容易出現拼寫錯誤或數值不一致的問題，而 enum 可以解決這個問題。
* 節省記憶體和優化性能： enum 在編譯時會轉換為對應的 JavaScript 物件，並且支援反向查找（由值獲取對應的名稱）。這樣做可以減少在記憶體中儲存多個相同的數字或字串值，並且對於一些特定情況下可以提高性能。
### Numeric Enums
```ts
//宣告一個名為Week的Enum type變數，並讓其包含一周的星期
enum Week {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}
//將today定義為Week中的Friday 
var today = Week.Friday;
//用Week.Friday作為判斷能讓程式碼更一目瞭然
if (today == Week.Friday) console.log("Today is Friday!");

// 注意下面這邊，列舉可以讓使用數字得到"Friday"
// 可以使用"Friday" 得到5
console.log(Week[5]);        //return "Friday"
console.log(Week["Friday"]); //return 5
```
* 注意如果重新定義index，會導致編譯的不同
```ts
//宣告一個名為Week的Enum type變數，並讓其包含一周的星期
enum Week {
    Sunday = 8,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}
//將today定義為Week中的Friday 
var today = Week.Friday;
//用Week.Friday作為判斷能讓程式碼更一目瞭然
if (today == Week.Friday) console.log("Today is Friday!");
console.log(Week[5]);        //return undefined
console.log(Week[12]);        //return "Thursday"
console.log(Week["Friday"]); //return 5
```
### String Enums
* 注意字串是沒有index可以找的
```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

console.log(Direction[0])
// Element implicitly has an 'any' type because expression of type '0' can't be used to index type 'typeof Direction'. Property '0' does not exist on type 'typeof Direction'.
console.log(Direction["Up"])
// 然後key是，"Up"
```
* 上面程式編譯之後
```ts
var Direction;
(function (Direction) {
    Direction["Up"] = "UP";
    Direction["Down"] = "DOWN";
    Direction["Left"] = "LEFT";
    Direction["Right"] = "RIGHT";
})(Direction || (Direction = {}));
```
### Computed and constant members
* 計算所得列舉
```ts
enum Color {Red, Green, Blue = "blue".length};
console.log(Color.Blue); //4
```
### 常數列舉
* 這種列舉在編譯時，會被刪掉
```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```
* 編譯之後
```js
"use strict";
let directions = [0 /* Directions.Up */, 1 /* Directions.Down */, 2 /* Directions.Left */, 3 /* Directions.Right */];
```

### 外部列舉
* 使用declare enum 定義的列舉型別
* 一樣編譯之後，列舉被刪掉
```ts
declare enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

```
* 編譯之後
```js
var directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

## 資料型別 - 特殊：Interface（介面）
### Interface 的基本
* 定義一個介面，接著定義其內容與內容型別
* 不論多或少皆不被允許
* 允許我們定義物件應該具有哪些屬性，以及每個屬性的型別
* 可以幫助團隊成員在協作時更清楚地了解彼此的物件結構
```ts
interface IPerson {
  name: String;
  age: number;
}

const alex: IPerson = {
  name: 'Iris',
  age: 18
}
```
* 可以接受`?`，但一樣不可以刪除或新增未定義的屬性
```ts
interface IPerson {
  name: String;
  age?: number;
}
```
* 如果對未來有不確定性，該怎麼新增
```ts
interface IPerson {
  name: String;
  age: number;
  [propName: string]: string | number | undefined
}
const alex2: IPerson = {
  name: 'Iris',
  gender: 'female'
}
```

### 新增任意屬性的方法
#### 使用index Signatures新增
* 可以利用`[propNmae: key]: value`定義了任意屬性
* key：通常為`string`型別
* value：可以為任意你想處理的型別
```ts
interface IPerson {
  name: string;
  age?: number;
  [propName: string]: string | number | undefined
}
```
* 唯讀屬性：readonly
```ts
interface IPerson {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

const iris: IPerson = {
  id: 89777,
  name: 'Iris',
  [propName: string]: any;
}

iris[id] = 9999 // error
```

* 運用於function中
```ts
const greetPerson = (person: IPerson) => {
  console.log('xxxx')
}
```
* Extending Types 擴展：讓interface被擴展(也可被拓展多個)
```ts
interface Basic {
  name?: string;
}

interface More extends Basic {
  unit: string;
}
```

* 但注意index Signature，其value指定的型別，需要都在已經有的型別中
```ts
// error example
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok
  name: string; // 這裏index signature的value為number，但是name出現string會報錯，因為index signature沒有此型別
}

// ok example
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```
* 使用readonly
```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = {
  1: 'a',
  2: 'b'
}

myArray[2] = 'bbb' // error：因為readonly
```
### String Literal & Mapped Types
* String Literal：代表某些特殊值可以當型別來使用
* Mapped Types是應用`in`在`index`跑迴圈的概念
* 在新增屬性時，屬性只能是`index`定義的值
```ts
//String Literal Type
type Index = 'a' | 'b' | 'c';

// Mapped Types 
type FromIndex = { 
    [k in Index]?: number 
};

const good: FromIndex = { 
    b: 1, 
    c: 2 
};

const bad: FromIndex = {
    b:1,
    c:2,
    d:3  // 這邊會報錯，主要是因為當初定義時沒有定義
};
```
### Interface的多態
在下面範例中，創建了兩個類別 Circle 和 Rectangle，它們都實現了 Shape 介面。printArea 函式接受一個 Shape 類型的參數，這使我們可以使用 Circle 和 Rectangle 的實例作為參數，因為它們都符合 Shape 的定義。這種多態性允許我們以一致的方式處理不同的物件，並且讓程式碼更加靈活和可擴展。
```ts
interface Shape {
  getArea(): number;
}

class Circle implements Shape {
  constructor(private radius: number) {}

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  getArea(): number {
    return this.width * this.height;
  }
}

function printArea(shape: Shape) {
  console.log("Area:", shape.getArea());
}

const circle = new Circle(5);
const rectangle = new Rectangle(4, 6);

printArea(circle); // Output: "Area: 78.53981633974483"
printArea(rectangle); // Output: "Area: 24"

```

## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)



