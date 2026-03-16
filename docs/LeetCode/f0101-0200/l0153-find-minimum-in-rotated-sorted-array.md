---
title: "[0153] Find Minimum in Rotated Sorted Array"
description: "[0153] Find Minimum in Rotated Sorted Array 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Find Minimum in Rotated Sorted Array
  - JavaScript
  - Binary Search
keywords: ["0153", "Find", "Minimum", "in", "Rotated", "Sorted", "Array", "LeetCode"]
---




# [0153] Find Minimum in Rotated Sorted Array

> 題號：**0153** | 難度：**Medium** | 主題：**Find Minimum in Rotated Sorted Array, Binary Search**

## JavaScript 解法
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  // 設定左右邊界
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    // 先算出中間
    const mid = left + Math.floor((right - left) / 2);
    // 如果右邊大於等於中間，則要讓右邊變成中間
    if (nums[right] >= nums[mid]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return nums[left];
};
```
