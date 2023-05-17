---
description: JS知識點
tags: 
    - JS
    - frontend
---

# FE-JS

## 用JS寫一個方法，使得結果映射到值[0-1]之間
```js
// 歸一化function
function normalizeValue(value, min, max){
    return (value- min) / (max-min)
}
```
```js
// demo
const arr = [10, 20, 30, 40];
const min = Math.min(...arr); // 获取数组中的最小值
const max = Math.max(...arr); // 获取数组中的最大值

const normalizedArr = arr.map(value => normalizeValue(value, min, max));
console.log(normalizedArr); // [0, 0.3333333333333333, 0.6666666666666666, 1]
```