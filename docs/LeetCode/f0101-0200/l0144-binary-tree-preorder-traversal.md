---
tags:
  - LeetCode
  - Easy
  - Binary Tree Preorder Traversal
  - javascript
  - Binary Search
  - Stack
---

# [0144] Binary Tree Preorder Traversal

- 知識：
  - 前序排列：根節點 -> 左節點 -> 右節點
  - 中序排列：左節點 -> 根節點 -> 右節點
  - 後序排列：左節點 -> 右節點 -> 根節點

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
 * @return {number[]}
 */
var preorderTraversal = function (root) {
  if (!root) {
    return [];
  }
  let result = [];
  let stack = [root];
  // 當stack.length > 0 代表裡面還有節點
  while (stack.length > 0) {
    // pop就可以把節點取出
    let node = stack.pop();
    result.push(node.val);

    // .left放後面是因為是前序排列
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
};
```
