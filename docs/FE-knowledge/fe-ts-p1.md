---
tags: 
    - javascript
    - Test
    - typescript
---
# [FE] TypeScript - p1

## TS是什麼？
[说说你对 typescript 的理解？与 javascript 的区别？](https://github.com/febobo/web-interview/issues/245)
* 是JS類型的超集，支持ES6語法，支持物件導向的概念，像Class、Interface、extends這些概念
### TS特性
* 編譯時類型檢查
* 類型推斷
* 接口：在ts中用接口來定義物件類型
* 枚舉（enum）：用於取值被限定在一定範圍內的場景
* Mixin：
* 泛型：使用之後才指定的類型
* 元祖（tuple）：合併不同類型的物件

### 類型註記
```ts
function Add(left: number, right: number){

}
```
### 類型推論
如果沒有給類型，則ts自動推論
```ts
let name = 'string'
```

### 接口
* 描述物件的類型，物件的類型就是用接口來描述的
```ts
interface Person {
  name: string;
  age: number
}
let tom: Person = {
  name: 'Tom',
  age: 25
}
```

## TS的數據類型有哪些？
### 分類
* boolean
* number
* string
* array
* tuple：允許表示一個已知元素數量與類型的陣列，各元素類型不必相同
```ts
let tupleArr: [number, string, boolean];
tupleArr = [12, '34', true]
```
* enum
```ts
enum Color { Red, Green, Blue}
let c: Color = Color.Green
console.log(c) // 1
```
* any：在寫程式階段還不清楚類型可以使用、不希望類型檢查器對這些值進行檢查也可以使用這個
```ts
let num: any[] = [1, false, '123']
```
* null & undefined
  ＊ null：代表空值
  * undefined：代表未定義
* void：用於標示返回值的類型
```ts
function hello(): void{
  alert('hello')
}
```
* never：一般用來異常處理
* object
### 總結：
* ts上添加了`void`、`enum`、`tuple`、`any`、`never`等類型

## 說明對枚舉的理解
* 枚舉是一個物件所有可能值的集合
## 使用
```ts
enum xxx { ... }
let d: xxx;
```
### 數字枚舉
```ts
enum Direction {
  Up, 
  Down, 
  Left, 
  Right
}
console.log(Direction.Up === 0) // true
```
```ts
enum Direction {
  Up = 10,
  Down, 
  Left
}
console.log(Direction.Up === 10)
console.log(Direction.Down === 11) // 後面會自動加1，往下排序
```

### 字串枚舉
```ts
enum Direction {
  Up = 'Up',
  Down = 'Down'
}
console.log(Direction['Up'] === 'Up') // true
```
```ts
enum Direction {
  Up = 'Up',
  Down,
  Left
}
// 這個會報錯，因為第一個設定為字串之後，其他也要設定字串
```
### 異構枚舉
* 就是數字與字串混合，但是少用
```ts
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```
### 透過正反映射取值
```ts
enum Direction {
  Up,
  Down
}
console.log(Direction.Up === 0)
console.log(Direction[0])
```

### 合併操作
* 記得要有定義才可以合併
```ts
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}
enum Direction {
	Center = 1
}

console.log(Direction['Up']) // 'Up'
console.log(Direction.Up) // 'Up'
```

## 說明對接口的理解
* 一個接口是描述一個物件的屬性與方法，但並不提供具體創建此物件實例的方法
* 接口的作用是為這些類型命名和程式做約定
### 約定
```ts
interface User {
	name: string,
	age: number
}
// 選用屬性
interface User2 {
	name: string,
	age?: number
}
// 唯讀屬性
interface User3 {
  name: string,
  age: number,
  readonly isOnly: boolean
}

let ming = (user: User) => user.name

ming({name: 'Ming', age: 18})
```
### 繼承
```ts
interface Father {
  color: string
}
interface Mother {
  height: string

}
interface Son extends Father {
  name: string,
  age: number
}
interface Son2 extends Father, Mother {

}
```
```ts
interface Mother {
	color: string
}

interface Father {
	name: string
}

interface Gift extends Father, Mother{
	size?: number
}

let gift: Gift = {
	name: 'Hey',
	color: 'red'
}
```

## Class
* 定義類的關鍵字為`Class`，後面會跟著Class名稱，類中可以包含以下幾個成員
1. 字段：為類裡面的變量。字段表示物件的有關數據
2. 構造函數：為實例化時調用，可以為類的物件分配內存
3. 方法：為物件要執行的操作
* 類繼承之後，可以對父類的方法去重新定義，此稱為對方法的重寫
* 使用`super`關鍵字，對父類直接引用，該關鍵字可以引用父類的屬性與方法
```ts
class Car {
  // 字段
  engine: string
  // 構造函數
  constructor(engine: string){
    this.engine = engine
  }
  // 構造方法
  disp():void {
    console.log(`xxxxx`)
  }
}
class Animal {
  move(distanceInMeters: number = 0){
    console.log(`xxxx`)
  }
}
// 可以extends
class Dog extends Animal {
  bark(){
    console.log(`yyy`)
  }
}
```

### 修飾符
#### public：
* 可以自由訪問類中成員
#### private：
* 只可以在該類中被訪問，其他地方都不行
#### protect：
* 在類中可以訪問，但是在實例中不可訪問
#### readonly：
* 必須在聲明時或構造函數裡被初始化
```ts
class Car {
	readonly engine: string
	constructor(engine: string){
		this.engine = engine
	}
}

let ferrari = new Car('V7')
ferrari.engine = 'V8' // 會報錯，因為只能讀取
```
#### static：靜態屬性
* 代表此靜態屬性與靜態方法屬於類本身，而不是類的實例。也就是你可以直接通過類來訪問靜態屬性與靜態方法
```ts
class MyClass {
  static staticProperty: number = 10
  static staticMethod(): void {
    console.log(`xxxx`)
  }
}
console.log(MyClass.staticProperty)
console.log(MyClass.staticMethod())
```
### 抽象類
* 抽象類為類的基類使用，一般不會直接將其實例化，不同於接口，抽象類可以包含成員的實現細節
* 不能被實例化
* 可以包含抽象方法
* 可以包含具體方法
* 可以包含抽象屬性
* 也就是抽象的東西是專門拿來實踐的
```ts
abstract class Animal {
  abstract makeSound(): void;
  move():void {
    console.log('xxxx')
  }
}
// 因為抽象類不能被實踐，所以我們透過繼承去實踐出Animal
// 但要注意，抽象一定要被實踐
class Cat extends Animal {

}
```
```ts
abstract class Animal {
	abstract spark():string;
	move(): void {
		console.log('move')
	}
}

class Cat extends Animal {
	spark(): string {
		return 'soarkCat'
	}
}
```

## Function
* ts需要定義參數類型or聲明返回值類型
* ts添加可選參數讓使用者選擇
* ts增添函數重載功能，使用者只需要通過查看函數聲明的方式，即可知道函數傳遞的參數個數or類型
```ts
// 基礎
const add = (a: number, b: number) : number => a+b
// 可選
const add2 = (a: number, b?: number) => a+ (b ? b: 0)
// 剩餘類型
const add3 = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a+b), a)
// 函數重載
type add4Return = number | string
function add4(arg1: string | number, arg2: string | number): number | string {
  if(typeof arg1 === 'string' && typeof arg2 === 'string'){
    return arg1+ arg2
  }else if(typeof arg1 === 'number' && typeof arg2 === 'number'){
    return arg1 * arg2
  }
  throw new Error('Invalid input types');
}

console.log(add4(2, 3))
console.log(add4('add', 'test'))
console.log(add4(2, 'test'))
```




