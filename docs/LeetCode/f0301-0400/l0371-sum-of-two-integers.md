---
description: 本文詳解 Leetcode 371 題「Sum of Two Integers」，不使用加減號運算，利用 XOR 和 AND 位元運算模擬加法過程，並附上 JavaScript 解法與流程說明。
tags: [Leetcode, JavaScript, 位元運算, XOR, AND, 加法模擬, 前端面試, Bitwise]
---

# [0371] Sum of Two Integers

## 題目說明

在不使用 `+` 和 `-` 的情況下，實作兩整數的加法。

> 📘 題目連結：[Leetcode 371 - Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/)

---

## ✅ 解題思路：使用位元運算模擬加法

這題的核心是模擬「位元加法器（bitwise adder）」的邏輯。兩個整數的加法可以拆解為：

1. 使用 **XOR (`^`)** 運算模擬「不進位的加法」
2. 使用 **AND (`&`)** 再左移一位 `<< 1` 取得「進位資訊」
3. 持續重複直到進位為 0

---

## ✨ JavaScript 解法

```js
var getSum = function(a, b) {
    while (b !== 0) {
        let carry = (a & b) << 1;  // 計算進位
        a = a ^ b;                 // 不進位加法
        b = carry;                // 設定新的 b 為進位值
    }
    return a;
};
