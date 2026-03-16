---
date: 2025-06-18
title: "[0338] Counting Bits"
description: "[0338] Counting Bits 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - Bit Manipulation
  - DP
  - Dynamic Programming
  - 位元運算
  - Blind75
keywords: ["0338", "Counting", "Bits", "LeetCode", "JavaScript", "Bit", "Manipulation", "DP"]
---




# [0338] Counting Bits

> 難度：Easy  
> 題型分類：`位元操作（Bit Manipulation）` + `動態規劃（DP）`  
> 題目連結：[LeetCode 338 - Counting Bits](https://leetcode.com/problems/counting-bits/)

## 題目描述
給定一個非負整數 `n`，請建立一個陣列 `ans`，其中：

- `ans[i]` 表示整數 `i` 的**二進位表示中出現多少個 1**

### 🧪 範例

```txt
Input: n = 5
Output: [0,1,1,2,1,2]

解釋：
0 → 000 → 0 個 1
1 → 001 → 1 個 1
2 → 010 → 1 個 1
3 → 011 → 2 個 1
4 → 100 → 1 個 1
5 → 101 → 2 個 1
```

## 解題思路
### 為什麼可以用 DP？
因為我們可以從小的數字推出大的數字。
具體來說：dp[i] 可以從 dp[i >> 1]（也就是 i 的一半）演變出來！

## 📈 時間與空間複雜度分析

| 項目    | 複雜度             |
| ----- | --------------- |
| 時間複雜度 | O(n)（每個 i 計算一次） |
| 空間複雜度 | O(n)（儲存 dp 陣列）  |

## 💻 JavaScript 解法（O(n) 時間複雜度）

```js
/**
 * @param {number} n
 * @return {number[]}
 */
var countBits = function(n) {
    const dp = new Array(n + 1).fill(0); // 初始值：全為 0

    for (let i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }

    return dp;
};

```

## 延伸題目
```txt
191	Number of 1 Bits	位元計數（Brian Kernighan）
137	Single Number II	bit mask 狀態管理
136	Single Number	XOR 運算技巧
268	Missing Number	總和差與 XOR 比較
```
