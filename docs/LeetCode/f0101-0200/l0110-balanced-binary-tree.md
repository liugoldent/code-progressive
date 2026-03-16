---
title: "[0110] Balanced Binary Tree"
description: "[0110] Balanced Binary Tree 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Tree
  - JavaScript
  - Balanced Binary Tree
keywords: ["0110", "Balanced", "Binary", "Tree", "LeetCode", "Javascript"]
---




# [0110] Balanced Binary Tree

> 題號：**0110** | 難度：**Medium** | 主題：**Tree, Balanced Binary Tree**

## JavaScript 解法
思路：

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
    function check(node) {
        if (!node) return 0;
        const left = check(node.left);
        if (left === -1) return -1;
        const right = check(node.right);
        if (right === -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return Math.max(left, right) + 1;
    }
    return check(root) !== -1;
};
```
