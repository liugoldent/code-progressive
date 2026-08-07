---
title: "[0704] Binary Search"
description: "[0704] Binary Search 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Binary Search
  - JavaScript
keywords: ["0704", "Binary", "Search", "LeetCode", "Javascript"]
---




# [0704] Binary Search

> 題號：**0704** | 難度：**Easy** | 主題：**Binary Search**

## JavaScript 解法
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
  if (nums.length === 1 && target !== nums[0]) {
    return -1;
  }
  let left = 0;
  let right = nums.length - 1;
  let mid = Math.floor((left + right) / 2);
  // 終止條件是<=
  while (left <= right) {
    if (target === nums[mid]) {
      return mid;
    }
    if (nums[mid] < target) {
      // 記得這邊要+1
      left = mid + 1;
    } else {
      // 記得這邊要-1
      right = mid - 1;
    }
    // 更新mid位子
    mid = Math.floor((left + right) / 2);
  }
  return -1;
};
```
