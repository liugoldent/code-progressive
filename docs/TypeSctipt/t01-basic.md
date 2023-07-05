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

```

