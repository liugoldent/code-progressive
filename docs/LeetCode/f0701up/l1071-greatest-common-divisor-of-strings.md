---
title: "[1071] Greatest Common Divisor of Strings"
description: "[1071] Greatest Common Divisor of Strings 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Greatest Common Divisor of Strings
  - Javascript
keywords: ["1071", "Greatest", "Common", "Divisor", "of", "Strings", "LeetCode", "Javascript"]
---

# [1071] Greatest Common Divisor of Strings

> 題號：**1071** | 難度：**Easy** | 主題：**Greatest Common Divisor of Strings**

## JavaScript 解法
```js
/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
var gcdOfStrings = function (str1, str2) {
  // 如果兩者相加不一樣，必定為空
  if (str1 + str2 !== str2 + str1) {
    return "";
  }
  // 再來取gcd，為最大公因數遞迴函數
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const len = gcd(str1.length, str2.length);
  return str1.substring(0, len);
};
```
