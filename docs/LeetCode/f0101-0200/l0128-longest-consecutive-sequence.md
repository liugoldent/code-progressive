---
date: 2025-06-16
title: "[0128] Longest Consecutive Sequence"
description: "[0128] Longest Consecutive Sequence 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - Set
  - 陣列處理
  - 最長序列
  - 面試題
  - 哈希
keywords: ["0128", "Longest", "Consecutive", "Sequence", "LeetCode", "JavaScript", "Set", "陣列處理"]
---




# [0128] Longest Consecutive Sequence

> **Tags:** `HashSet`, `陣列`, `JavaScript`, `LeetCode`, `面試常考`, `連續子序列`  
> **難度：** Hard  
> **題目連結：** [LeetCode 128 - Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

## 題目描述
給定一個整數陣列 `nums`，請你找出其中最長的**連續元素序列**（順序可打亂），並回傳該序列的長度。

**你必須設計一個時間複雜度為 O(n)** 的演算法解決此問題。

## 解題思路

這題不能用排序（O(n log n)），我們可以使用 `Set` 搭配以下邏輯：

1. 先將所有元素存入 `Set`，以 O(1) 查找。
2. 針對每個元素 `num`：
   - 如果 `num - 1` **不存在於 Set 中**，代表這是序列的開頭。
   - 向後不斷查找 `num+1`、`num+2`... 直到序列中斷，記錄該序列長度。
3. 每次更新最大長度。

透過這種方式，每個數最多只被處理一次，達成 O(n)。

## ✅ JavaScript 實作

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if (!nums.length) return 0;

    const setNums = new Set(nums);
    let maxLength = 0;

    for (let num of setNums) {
        // 只有當 num 是序列起點時才進入
        if (!setNums.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;

            while (setNums.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }

            maxLength = Math.max(maxLength, currentLength);
        }
    }

    return maxLength;
};
