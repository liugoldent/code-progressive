---
title: "[0230] Kth Smallest Element in a BST"
description: "[0230] Kth Smallest Element in a BST 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - JavaScript
  - Kth Smallest Element in a BST
  - Tree
keywords: ["0230", "Kth", "Smallest", "Element", "in", "BST", "LeetCode", "Javascript"]
---




# [0230] Kth Smallest Element in a BST

> 題號：**0230** | 難度：**Medium** | 主題：**Kth Smallest Element in a BST, Trees**

## JavaScript 解法
## 解題思路
- 比較不正確的想法:先全部遍歷一遍後再 sort，因為這樣會喪失 BST 的特性，左節點比右節點小
- 比較正確的是：先左邊全部遍歷完之後，push node.val，然後再右邊遍歷
- 這題其實就是遍歷完之後，不管怎麼跑，只要跑到全部的數字都出來，再排序過，或是依照特性不排序，返回值就 ok 了

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
var kthSmallest = function (root, k) {
  let result = [];
  let dfs = (root) => {
    if (!root) return null;
    dfs(root.left);
    result.push(root.val);
    dfs(root.right);
  };
  dfs(root);

  return result[k - 1];
};
```
