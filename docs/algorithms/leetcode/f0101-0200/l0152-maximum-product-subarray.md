---
date: 2025-06-18
title: "[0152] Maximum Product Subarray"
description: "[0152] Maximum Product Subarray 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - Dynamic Programming
  - Subarray
  - Sliding Window
  - Blind75
keywords: ["0152", "Maximum", "Product", "Subarray", "LeetCode", "JavaScript", "Dynamic", "Programming"]
---




# [0152] Maximum Product Subarray

> 題目難度：**Medium**  
> 題型：**動態規劃 + 數學邏輯**  
> 題目連結：[LeetCode 152 - Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/)

## 題目描述
給定一個整數陣列 `nums`，找出其中「**乘積最大**」的連續子陣列（subarray），並回傳該乘積的值。

與 LeetCode 53（Maximum Subarray）不同，本題需處理負數與 0 的影響。

## 解題思路

當我們處理乘積時，會遇到這些特性：

- 正數 × 正數 → 更大
- 負數 × 正數 → 更小
- **負數 × 負數 → 可能變成最大值！**
- 任何數 × 0 = 0 → 要重新開始

### 👉 所以我們同時追蹤：
- `maxSoFar`：目前為止最大的乘積
- `minSoFar`：目前為止最小的乘積（可能變最大）

## JavaScript 解法
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
    if (!nums.length) return 0;

    let maxSoFar = nums[0];
    let minSoFar = nums[0];
    let result = nums[0];

    for (let i = 1; i < nums.length; i++) {
        let curr = nums[i];

        // 如果是負數，最大與最小會互換
        if (curr < 0) [maxSoFar, minSoFar] = [minSoFar, maxSoFar];

        maxSoFar = Math.max(curr, maxSoFar * curr);
        minSoFar = Math.min(curr, minSoFar * curr);

        result = Math.max(result, maxSoFar);
    }

    return result;
};
