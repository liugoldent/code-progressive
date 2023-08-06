---
description: TS - Type Predicates
tags:
  - TS
  - TypeScript
---
# [TS] Type Predicates - 型別斷言
## 概念
* 是一種用於運行時檢查類型的技巧，例如當變數聲明為聯合型別時，當要使用該變數特有屬性or方法時，TS編譯器會報錯。因為該變數的確切類型可能是多種可能之一
## 使用
### 語法1
```ts
variableName as TypeName
```

### 語法2
```ts
<typeName>variableName
```
#### 例子1
```ts
// 1. 建立一個聯合型別的變數
type MyUnionType = string | number;
const myVariable: MyUnionType = "hello";

// 2. 使用 'as' 斷言告訴 TypeScript 這個變數是字串類型
const myString: string = myVariable as string;

// 3. 使用 myString 變數，TypeScript 知道它是字串類型
console.log(myString.toUpperCase()); // 輸出 "HELLO"
```

### 語法3
```ts
parameterName is Type
// pet is Fish 就是 type predicate
// parameterName 必須要是函式中參數的名稱
// function 最後會回傳 true or false
```
#### 例子2
```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish { 
  return (pet as Fish).swim !== undefined;   //（pet as Fish）斷言 pet 為 Fish 型別 ， 所以 swim 不會是undefined 
}
```
## 文章來源
[前端是該來學一下 TypeScript 了](https://ithelp.ithome.com.tw/users/20131472/ironman/4100)

















