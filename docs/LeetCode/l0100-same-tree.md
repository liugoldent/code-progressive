---
tags:
  - LeetCode
  - Easy
  - Tree
  - Javascript
  - Same Tree
---

# [0100] Same Tree

## Javascript 解

思路：

- 先定義好一開始的條件
  - 如果兩邊都是 null -> 為 true
  - 然後判斷是否一邊為 null or 各自的 val 不同
  - 最後將.left & .right 去比較

```js
// 定义树节点
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// 判断两个二叉树是否相同
function isSameTree(p, q) {
  // 如果两个节点都为 null，则认为相同
  if (p === null && q === null) {
    return true;
  }

  // 如果只有一个节点为 null，或者节点的值不相等，则认为不相同
  if (p === null || q === null || p.val !== q.val) {
    return false;
  }

  // 递归判断左右子树是否相同
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// 示例
var p = new TreeNode(1);
p.left = new TreeNode(2);
p.right = new TreeNode(3);

var q = new TreeNode(1);
q.left = new TreeNode(2);
q.right = new TreeNode(3);

var result = isSameTree(p, q);
console.log(result); // 输出: true
```
