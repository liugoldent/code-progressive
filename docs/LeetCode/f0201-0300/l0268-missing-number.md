---
title: "[0268] Missing Number"
description: "[0268] Missing Number 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Missing Number
  - javascript
keywords: ["0268", "Missing", "Number", "LeetCode", "解法"]
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