---
title: "[0209] Minimum Size Subarray Sum"
description: "[0209] Minimum Size Subarray Sum 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Sliding Window
keywords: ["0209", "Minimum", "Size", "Subarray", "Sum", "LeetCode", "Javascript", "思路："]
---




# [0209] Minimum Size Subarray Sum

> 題號：**0209** | 難度：**Medium** | 主題：**Sliding Window**

## JavaScript 解法
## 解題思路
```js
/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    let n = nums.length
    let minLen = Infinity
    let sum = 0
    let left = 0

    // 首先定義右邊界，右邊界會一直往右邊滑
    for(let right = 0; right < n ; right++){
        sum = sum + nums[right]

        // 當找到之後，更新最小值
        // 再來左邊開始相減後 -> 內縮
        while(sum >= target){
            minLen = Math.min(minLen, right - left + 1)
            sum = sum - nums[left]
            left++
        }
    }
    // 最後返回minLen
    return minLen === Infinity ? 0 : minLen
};
```
