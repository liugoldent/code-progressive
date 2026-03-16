---
title: "[0543] Diameter of Binary Tree"
description: "[0543] Diameter of Binary Tree 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Tree
  - Diameter of Binary Tree
keywords: ["0543", "Diameter", "of", "Binary", "Tree", "LeetCode", "Javascript"]
---




# [0543] Diameter of Binary Tree

> 題號：**0543** | 難度：**Easy** | 主題：**Tree, Diameter of Binary Tree**

## JavaScript 解法
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
 * @return {number}
 */
var diameterOfBinaryTree = function(root) {
    let maxDiameter = 0

    function depth(node){
        if(!node) return 0
        const leftH = depth(node.left)
        const rightH = depth(node.right)
        // 經過當前節點的直徑 = 左高度 + 右高度
        maxDiameter = Math.max(maxDiameter, leftH + rightH);
        // 返回當前子樹的高度 = max(左高度, 右高度) + 1
        return Math.max(leftH, rightH) + 1;
    }

    depth(root)
    return maxDiameter
};

```
