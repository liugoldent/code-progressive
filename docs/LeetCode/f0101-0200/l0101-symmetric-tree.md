---
tags:
  - LeetCode
  - Easy
  - Symmetric Tree
  - javascript
---

# [0101] Symmetric Tree

- 這題主要在說，看一個 tree 是否為鏡像（所以.left 要等於.right）

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
var isSymmetric = function (root) {
  if (!root) {
    return false;
  }
  return isMirror(root.left, root.right);
};

function isMirror(left, right) {
  // 左節點等於右節點，則true
  if (!left && !right) {
    return true;
  }
  // 如果左邊獨有 或是 右邊獨有 或是 左邊值不等於右邊值，則返回false
  if (!left || !right || left.val !== right.val) {
    return false;
  }
  return isMirror(left.left, right.right) && isMirror(left.right, right.left);
}
```
