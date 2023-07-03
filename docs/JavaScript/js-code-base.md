---
description: javascript base 
tags:
  - javascript
---

# [JS] JS 運算子

## 算數運算子

### + 
* 加法
```js
x = y + 2 
console.log(x) // 7
console.log(y) // 5
```

### -
* 減法
```js
x = y - 2 
console.log(x) // 3
console.log(y) // 5
```

### *
* 乘法
```js
x = y * 2 
console.log(x) // 2.5
console.log(y) // 5
```


### /
* 除法
```js
x = y / 2 
console.log(x) // 2.5
console.log(y) // 5
```

### %
* 取餘數
```js
x = y % 2 
console.log(x) // 1
console.log(y) // 5
```

### ++
* 自增
```js
// init y = 5
// 先回傳值，再自己加自己
x = y++
console.log(x) // 5
console.log(y) // 6

// 先自己加自己，再回傳值
x = ++y
console.log(x) // 6
console.log(y) // 6
```


### --
* 自減
```js
// init y = 5
// 先回傳值，再自己減自己
x = y--
console.log(x) // 5
console.log(y) // 4

// 先自己減自己，再回傳值
x = --y
console.log(x) // 4
console.log(y) // 4
```

## import export
* 有default 的，在import時直接import，並且只能存在一個
* 沒有 default，要解構
```js
// a.js
export default function A(){
  // 預設function
}

export function B(){
  // 非預設 function
}
```
```js
// b.js
import A, { B } from './a.js'
```

## 判斷物件中是否有該key
```js
!("key" in obj) //结果為false，表示不包含；否則表示包含

obj.hasOwnProperty("key") //obj表示物件，结果為false表示不包含；否則表示包含
```
