---
description: javascript array from  
tags:
  - javascript
---
# [JS] Array From 常用語法
## 介紹
* arrayLike：必傳參數，想要轉換成數組的偽數組對象或可迭代對象
* mayFunction：可選參數，是將每個項目調用的函數。返回值將插入回集合中
* thisArg：可選參數，執行回調函數mayFunction時this對象。這個參數少使用
```js
Array.from(arrayLike[, mapFunction[, thisArg]])
```
```js
// '0'~'1' 為第一個or第二個參數
// length：代表長度為2
const someNumbers = { '0': 10, '1': 15, length : 2};
console.log(Array.from(someNumbers, value => value * 2)); // => [20, 30]
```

## 用途1：將類數組轉換成數組
```js
function sumArguments() {
    return Array.from(arguments).reduce((sum, num) => sum + num);
}

sumArguments(1, 2, 3); // => 6
```
```js
Array.from('Hello');                   // => ['H', 'e', 'l', 'l', 'o']
Array.from(new Set(['one', 'two', 'one'])); // => ['one', 'two']

const map = new Map();
map.set('one', 1)
map.set('two', 2);
Array.from(map); // => [['one', 1], ['two', 2]]
```
## 淺拷貝數組
```js
const numbers = [6, 9, 12];
const numbersCopy = Array.from(numbers);

numbers === numbersCopy; // => false
```
```js
function recursiveClone(val) {
    return Array.isArray(val) ? Array.from(val, recursiveClone) : val;
}

const numbers = [[0, 1, 2], ['one', 'two', 'three']];
const numbersClone = recursiveClone(numbers);

numbersClone; // => [[0, 1, 2], ['one', 'two', 'three']]
numbers[0] === numbersClone[0] // => false
```
## 填充數組
### 使用數值
```js
const length = 3
const init = 0
// 使用Array.from
const result = Array.from({length}, () => init) // 輸出：[0,0,0]

// 使用array.fill()
const result = Array(length).fill(init) // 輸出：[0,0,0]
```
### 使用物件
```js
const length = 3
const resultA = Array.from({length}, () => ({})) // 其物件為獨立，代表給定的值填充該數組
const resultB = Array.from(length).fill({}) // 這個用同一個物件，填充該數組

resultA; // => [{}, {}, {}]
resultB; // => [{}, {}, {}]

resultA[0] === resultA[1]; // => false
resultB[0] === resultB[1]; // => true
```

## 生成數字範圍
```js
function range(end) {
    return Array.from({ length: end }, (_, index) => index);
}

range(4); // => [0, 1, 2, 3]
```

## 陣列去重
```js
function unique(array) {
  return Array.from(new Set(array));
}

unique([1, 1, 2, 3, 3]); // => [1, 2, 3]
```

## 總結
Array.from() 方法接受類數組對象以及可迭代對象，它可以接受一個 map 函數，並且，這個 map 函數不會跳過值為 undefined 的數值項。這些特性給 Array.from() 提供了很多可能。
如上所述，你可以輕松的將類數組對象轉換為數組，克隆一個數組，使用初始化填充數組，生成一個範圍，實現數組去重。

## 文章出處
[Array.from() 五个超好用的用途](https://juejin.cn/post/6844903926823649293)
