---
tags:
  - LeetCode
  - Easy
  - javascript
  - Invert Binary Tree
  - Trees
---

# [0226] Invert Binary Tree

## Javascript 解

## 思路：

這題主要是做反轉 left / right 的節點
所以我們只要將 left 節點存起來
讓其等於 right 節點即可
（但是也要在注意往下反轉後會有遞迴，要重複 call 自己這個 function）

```javascript
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
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if (root === null) {
    return null;
  }

  // 因為要反轉，所以要先存起來（簡易的code對調）
  const temp = root.left;
  root.left = root.right;
  root.right = temp;

  // 往下判斷
  if (root.left !== null) {
    invertTree(root.left);
  }

  if (root.right !== null) {
    invertTree(root.right);
  }
  // root指向根節點
  return root;
};
```

```javascript
// demo
// 創建一棵樹
const root = new TreeNode(4);
root.left = new TreeNode(2);
root.right = new TreeNode(7);
root.left.left = new TreeNode(1);
root.left.right = new TreeNode(3);
root.right.left = new TreeNode(6);
root.right.right = new TreeNode(9);

// 反轉二元树
const invertedTree = invertTree(root);

// 輸出反轉後的二元樹
console.log(invertedTree);
```


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
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(!root) return null
    const left = invertTree(root.left)
    const right = invertTree(root.right)

    root.left = right
    root.right = left
    return root
};
```