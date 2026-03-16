---
date: 2025-06-18
title: "[0300] Longest Increasing Subsequence"
description: "[0300] Longest Increasing Subsequence 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags: [LeetCode, JavaScript, DP, Dynamic Programming, Longest Increasing Subsequence, LIS, 演算法, 子序列, 面試題, 資料結構]
keywords: ["0300", "Longest", "Increasing", "Subsequence", "LeetCode", "JavaScript", "DP", "Dynamic"]
---

# [0300] Longest Increasing Subsequence

> 難度：中等 類型：動態規劃（DP） / 演算法經典題

## 題目描述
給定一個整數陣列 `nums`，找出其中最長的 **嚴格遞增子序列（Longest Increasing Subsequence, LIS）** 的長度。

子序列不需要是連續的，但元素的順序必須保持一致。

### 範例：

```js
Input: nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4
Explanation: 最長遞增子序列為 [2, 3, 7, 101]
```

## ✅ 解法一：動態規劃 DP（O(n^2)）

### 狀態定義：

* `dp[i]` 表示「以 `nums[i]` 為結尾」的最長遞增子序列長度。

### 初始值：

* 每個位置預設為 1（每個數自己至少可組成一個長度為 1 的序列）

### 狀態轉移：

```js
if (nums[i] > nums[j]) {
  dp[i] = Math.max(dp[i], dp[j] + 1)
}
```

### 🔁 完整程式碼：

```js
var lengthOfLIS = function(nums) {
    const dp = Array(nums.length).fill(1);

    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
};
```

### 🧾 範例流程拆解：

```js
nums = [10, 9, 2, 5, 3, 7, 101, 18]
dp   = [ 1, 1, 1, 1, 1, 1, 1,  1 ]

# i = 3 (nums[3]=5)
j=2 → nums[2]=2 < 5 → dp[3]=2

# i = 4 (nums[4]=3)
j=2 → nums[2]=2 < 3 → dp[4]=2

...
```

## ❌ 為何不能用 Sliding Window？

因為 LIS 是 **子序列（不需連續）** 問題，而 sliding window 適合處理 **連續子陣列或子字串**，例如最長子陣列和、重複字元等場景。

## 📌 延伸解法（二分搜尋優化至 O(n log n)）

這裡只求長度而不還原路徑，可使用 tails\[] 陣列與 binary search 優化。

若需，歡迎補充優化版本！

## 📚 總結

| 技巧            | 時間複雜度      | 空間複雜度 | 可回溯序列 |
| ------------- | ---------- | ----- | ----- |
| DP            | O(n^2)     | O(n)  | ✅     |
| Binary Search | O(n log n) | O(n)  | ❌     |

這題屬於經典 DP 題，常出現在演算法與面試筆試中。
