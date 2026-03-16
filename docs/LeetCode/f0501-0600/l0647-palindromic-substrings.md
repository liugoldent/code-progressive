---
date: 2025-06-16
title: "[0647] Palindromic Substrings"
description: "深入解析 LeetCode 647 - Palindromic Substrings 題目，提供 JavaScript 中心擴展法與 DP 動態規劃雙解法，含時間空間複雜度、圖解與 SEO 關鍵字，幫助你快速掌握回文子字串技巧。"
tags:
  - LeetCode
  - JavaScript
  - 回文
  - 演算法
  - 中心擴展法
  - 動態規劃
  - 字串處理
keywords: ["0647", "Palindromic", "Substrings", "LeetCode", "JavaScript", "回文", "演算法", "中心擴展法"]
---




# [0647] Palindromic Substrings

> 題號：**0647** | 主題：**回文, 演算法, 中心擴展法**

在這篇文章中，我們將用 **JavaScript** 解出 [LeetCode 647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)，並介紹兩種常見且有效的解法：

- ✅ 中心擴展法（Expand Around Center） → 時間效率好、程式簡潔  
- 🧠 動態規劃（Dynamic Programming） → 系統化紀錄回文狀態

## 題目描述
> **題目名稱：** LeetCode 647 - Palindromic Substrings  
> **難度等級：** Medium  
> **題目敘述：**

給定一個字串 `s`，請你回傳其中所有**回文子字串（palindromic substring）** 的個數。  
回文是指 **正著念和反著念都一樣** 的字串。

- 每個單一字元本身就是一個回文。
- 子字串必須是**連續的**，例如 `"abc"` 中 `"a"`、`"b"`、`"c"` 都是，但 `"ac"` 不是。

## 🔍 解法一：中心擴展法（Expand Around Center）【推薦】

### 💡 解題思路：

每個回文都有一個「中心」。我們以每個字元為中心，從中心向兩側擴展，找到所有可能的回文子字串。

- 奇數長度回文 → 以 `s[i]` 為中心
- 偶數長度回文 → 以 `s[i]` 和 `s[i+1]` 為雙中心

### ✅ JavaScript 實作：

```js
var countSubstrings = function(s) {
    let count = 0;

    const expandAroundCenter = (left, right) => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            count++;
            left--;
            right++;
        }
    };

    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);     // 奇數長度
        expandAroundCenter(i, i + 1); // 偶數長度
    }

    return count;
};
