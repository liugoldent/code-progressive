---
description: TS - Narrowing 
tags:
  - TS
  - TypeScript
---
# [TS] Narrowing - 型別狹義化
## 概念
* 可以做為「當型別為...才...的操作」
* 主要有種限縮的感覺
* 指的是在特定程式碼區塊中收窄（縮小）變數的類型範圍，減少聯合型別（union type）變數的可能類型，從而提供更精確的類型資訊。
## 使用
### 概念程式
```ts
function padRight(padding: number | string, input: string){
  return new Array(padding+1).join(" ") + input
}
// 主要因為如果padding是number，會造成無法join，ts會幫你判斷
// Operator '+' cannot be applied to types 'string | number' and 'number'.
```
* 修正後程式：使用narrowing  
我們這邊主要使用narrowing的方式，先去判斷`typeof`的型別
```ts
function padRight(padding: number | string, input: string){
  if(typeof padding === 'number'){
    return new Array(padding+1).join(" ")+ input
  }
  return padding + input
}
console.log(padRight("22", 'tt')) // "22tt"
console.log(new Array(2).join(" ")) // " "
```
### typeof 可以取得的「值」
* 取得值如下：`string`,`number`,`boolean`,`symbol`,`undefined`,`object`,`function`

### Equality narrowing
```ts
function printAll(strs: string | string[] | null){
  if(strs !== null){
    if(typeof strs === 'object'){
      // ...
    }
  }else if(type of strs === 'string'){
    // ...
  }
}

```

### 使用`value in x`
* 使用`"value" in x` 的概念，value為string literal，x為聯合型別（animal）
```ts
console.clear()

type Fish = { swim: () => number}
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if("swim" in animal) {
    return animal.swim()
  }
  return animal.fly()
}
// 注意這邊是一個物件
const fish: Fish = {
    swim: () =>{
        return 10
    }
}
// 注意這邊是一個物件
const bird: Bird = {
    fly: () => {
        console.log('fly ing')
    }
}
console.log(move(bird))
// fly ing
// undefined
```
### 使用`instanceof`
* 可以使用`instanceof`來檢查某個值，是否為某個constructor。
* 舉例：
  * 如果是Date，可以用`toUTCString`
  * 如果是字串，可以用`toUpperCase`
```ts
function logValue(x: Date | string) {
  if (x instanceof Date) { 
    console.log(x.toUTCString());       
    //(parameter) x: Date 
  } else {
    console.log(x.toUpperCase());
    //(parameter) x: string
  }
}

const dateTest: Date = new Date()
const stringTest: string = "hello world"

logValue(dateTest) // "Sat, 29 Jul 2023 07:48:51 GMT" 
logValue(stringTest) // HELLO WORLD
```
## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)

















