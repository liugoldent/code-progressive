---
title: "[0028] Implement strStr()"
description: "[0028] Implement strStr() 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Implement strStr()
  - JavaScript
keywords: ["0028", "Implement", "strStr", "LeetCode", "Javascript"]
---




# [0028] Implement strStr()

> 題號：**0028** | 難度：**Easy** | 主題：**Implement strStr()**

## JavaScript 解法
解釋：主要是說要找出 needle 位在 haystack 內的哪個地方（起始位置）
而我們可以直接使用 indexOf 去找出 first index

```js
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  return haystack.indexOf(needle);
};
```
