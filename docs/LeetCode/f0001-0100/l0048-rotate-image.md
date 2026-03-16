---
date: 2025-06-18
title: "[0048] Rotate Image"
description: "[0048] Rotate Image 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags: [LeetCode, JavaScript, Matrix, In-place, Rotate, 轉置矩陣, 面試題]
keywords: ["0048", "Rotate", "Image", "LeetCode", "JavaScript", "Matrix", "In-place", "轉置矩陣"]
---

# [0048] Rotate Image

> **難度**：Medium  
> **題型**：矩陣操作、原地演算法  
> **題目連結**：[LeetCode 48](https://leetcode.com/problems/rotate-image/)

---

## 📘 題目說明

給定一個 `n × n` 的整數矩陣 `matrix`，**請原地（in-place）將矩陣順時針旋轉 90°**。  
不允許使用另一個 2D 陣列來儲存結果。

### 📥 範例輸入

```txt
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
```

## 🧠 解題思路：**轉置 + 水平反轉**

1. **轉置矩陣**：將 `matrix[i][j]` 與 `matrix[j][i]` 交換（對主對角線鏡射）。  
2. **水平反轉**：對每一列執行 `reverse()`，即可完成 90° 旋轉。

> 直覺對照  
> `原始 → 轉置 → 每列反轉 = 順時針 90°`

---
## 💻 JavaScript 參考實作

```js
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function (matrix) {
  const n = matrix.length;

  // Step 1: 轉置
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Step 2: 水平反轉
  for (const row of matrix) {
    row.reverse();
  }
};