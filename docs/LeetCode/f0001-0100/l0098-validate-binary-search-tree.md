---
tags:
  - LeetCode
  - Medium
  - Validate Binary Search Tree
  - javascript
  - Tree
---

# [0098] Validate Binary Search Tree

- 驗證是否為 BST
  - 首先我們需要一個輔助函數來做遞迴
  - 輔助函數：
    - 1. 如果 root 為空則 true
    - 2. 測試左子樹：如果`max(上一個節點val) <= node.val(下一個節點.val)`
    - 3. 測試右子樹：如果`min(上一個節點val) >= node.val(上一個節點.val)`
    - 則為 false

```js
/**
 * Definition for a binary tree node.
 */
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root) {
  return valid(root, null, null, "root");
};

var valid = function (node, min, max, status) {
  if (node === null) {
    return true;
  }
  // 1. min 有值（代表往右尋找）+ node.val 為子樹節點，如果min（給的是上一個node.val）大於子樹節點則錯誤
  // 2. max 有值（代表往左尋找）+ node.val 為子樹節點，如果node.val >= 上一個節點則為錯誤
  // node.val -> 此次節點
  // min or max 皆為父層節點
  if ((min !== null && node.val <= min) || (max !== null && node.val >= max)) {
    return false;
  }
  // 驗證左子樹 && 驗證右子樹
  return (
    valid(node.left, min, node.val, "left") &&
    valid(node.right, node.val, max, "right")
  );
};

// 示例二叉树
//        5
//       / \
//      3   7
//     / \   \
//    2   4   8

var tree = new TreeNode(5);
tree.left = new TreeNode(3);
tree.right = new TreeNode(7);
tree.left.left = new TreeNode(2);
tree.left.right = new TreeNode(4);
tree.right.right = new TreeNode(8);
```
