---
description: TS - 指定型別
tags:
  - TS
  - TypeScript
---
# 基本型別
## 資料型別
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

