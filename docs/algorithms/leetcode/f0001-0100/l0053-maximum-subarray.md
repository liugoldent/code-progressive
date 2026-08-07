---
title: "[0053] Maximum Subarray"
description: "[0053] Maximum Subarray 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Maximum Subarray
  - JavaScript
keywords: ["0053", "Maximum", "Subarray", "LeetCode"]
---




# [0053] Maximum Subarray

> 題號：**0053** | 難度：**Medium** | 主題：**Maximum Subarray**

```js
function maxSubArray(nums) {
    let maxSum = nums[0]
    let currentSum = nums[0]

    for (let i = 1; i < nums.length; i++) {
        // 如果 currentSum 是負的，就從頭開始計算
        currentSum = Math.max(nums[i], currentSum + nums[i])
        maxSum = Math.max(maxSum, currentSum)
    }

    return maxSum
}

```
