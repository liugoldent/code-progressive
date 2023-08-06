---
description: TS - 指定型別
tags:
  - TS
  - TypeScript
---
# [TS] 指定型別的方式
## Type Inference
* 型別推斷：ts幫你推斷是什麼型別
```ts
let x = 3
x = 'string' // Type 'string' is not assignable to type 'number'.
```

## Type Annotation
* 型別註記：你在程式中就註記好了
let a:number = 18
let b:string = 'abc'

## Type Assertions
* 型別斷言：
* 錯誤例子：變數 obj 被 TypeScript 推斷為 {}，沒有屬性，所以是無法添加 age 或 name 屬性的。
```ts
let a = {}
a.name = 'nn' // Identifier expected.
a.age = 18
// Property 'name' does not exist on type '{}'.
// Property 'age' does not exist on type '{}'.
```
* 更正：使用interface
```ts
interface person {
  name: string,
  age: number
}
// 方法一
let a = {} as person
a.name = 'nn'
a.age = 18


let a = {
  name: 'nn',
  age: 18
} as person

// 方法二
interface Foo {
  age: number;
  name: string;
}

let foo: Foo = {
  name: 'abc',
  age: 18
}
```

## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)
