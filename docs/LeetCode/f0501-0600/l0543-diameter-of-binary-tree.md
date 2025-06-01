---
tags:
  - LeetCode
  - Easy
  - Tree
  - Diameter of Binary Tree
---

# [0543] Diameter of Binary Tree

## Javascript 解

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