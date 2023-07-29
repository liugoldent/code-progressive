---
description: TS - Interface vs Type Aliases 用法與差別
tags:
  - TS
  - TypeScript
---
# Interface vs Type Aliases 用法與差別
## 文章來源
[Day15: 【TypeScript 學起來】Interface VS Type Aliases 用法與差別](https://ithelp.ithome.com.tw/articles/10275208)
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


