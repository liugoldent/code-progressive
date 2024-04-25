---
tags:
  - LeetCode
  - Easy
  - Binary Tree Inorder Traversal
  - javascript
---

# [0094] Binary Tree Inorder Traversal

- [參考網誌](https://www.shubo.io/iterative-binary-tree-traversal/)
- 中文敘述：中序遍歷
  - 先拜訪左子節點，再拜訪父節點，最後拜訪右子節點。我們需要盡量往左子節點前進，而途中經過的父節點們就先存在一個 stack 裡面，等到沒有更多左子節點時，就把 stack 中的父節點取出並拜訪其右子節點

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
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let curr = root;

  while (curr !== null || stack.length !== 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left; // 盡可能一直拜訪左節點
    }

    curr = stack.pop(); // 當上面curr結束後，所以stack最後一個點就是最左的最子節點
    result.push(curr.val); // 這時候把.val取出放進result就是第一個子節點
    curr = curr.right; // 因為把左子節點放進去了，所以現在換右子節點
  }
  return result;
};
```
