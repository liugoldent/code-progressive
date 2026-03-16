---
title: "[0027] Remove Element"
description: "[0027] Remove Element 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Remove Element
  - javascript
keywords: ["0027", "Remove", "Element", "LeetCode", "Javascript"]
---

# [0027] Remove Element

> 題號：**0027** | 難度：**Easy** | 主題：**Remove Element**

## JavaScript 解法
思路：

1. 因為不能再多使用一個空間來得出答案，所以只能對原陣列動手腳
2. 所以我們一樣設定一個 count，來計算說不為 val 的位子到哪了

```js
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let count = 0;
  for (let i = 0, len = nums.length; i < len; i++) {
    if (nums[i] !== val) {
      nums[count] = nums[i];
      count++;
    }
  }
  return count++;
};
```
