---
title: "[2864] Maximum Odd Binary Number"
description: "[2864] Maximum Odd Binary Number 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Maximum Odd Binary Number
  - String
  - Javascript
keywords: ["2864", "Maximum", "Odd", "Binary", "Number", "LeetCode", "Javascript"]
---

# [2864] Maximum Odd Binary Number

> 題號：**2864** | 難度：**Easy** | 主題：**Maximum Odd Binary Number, String**

## JavaScript 解法
```js
/**
 * @param {string} s
 * @return {string}
 */
var maximumOddBinaryNumber = function (s) {
  let count = 0;
  for (e of s) {
    if (e === "1") {
      count++;
    }
  }
  // 因為最後要補1，所以count - 1
  // 中間都補0
  // 最後再補1
  return "1".repeat(count - 1) + "0".repeat(s.length - count) + "1";
};
```
