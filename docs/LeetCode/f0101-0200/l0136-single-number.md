---
title: "[0136] Single Number"
description: "[0136] Single Number 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - javascript
  - python
  - interview
  - Hashing
keywords: ["0136", "Single", "Number", "LeetCode", "Javascript"]
---

# [0136] Single Number

> 題號：**0136** | 難度：**Medium** | 主題：**Hashing**

## JavaScript 解法
1. 這題可以直接用XOR的邏輯去解
2. XOR：不同為1。相同為0

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    return nums.reduce((accu, cur) => accu ^ cur, 0)
};
```
