---
description: leetCode Missing Number js 解答
tags:
  - LeetCode
  - Easy
  - Missing Number
  - javascript
---

# [0268] Missing Number

## 解法

* 使用等差數列去解
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
    const n = nums.length
    const excepteSum = (n * (n+1)) / 2
    const actualSum = nums.reduce((accu, cur) => accu + cur, 0)
    return excepteSum - actualSum
};
```