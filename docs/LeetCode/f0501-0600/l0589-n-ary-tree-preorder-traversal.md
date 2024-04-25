---
tags:
  - LeetCode
  - Easy
  - Stack
  - javascript
  - N-ary Tree Preorder Traversal
---

# [0589] Next Greater Element I

## Javascript 解

```js
/**
 * // Definition for a Node.
 * function Node(val, children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node|null} root
 * @return {number[]}
 */
var preorder = function (root) {
  if (!root) return [];

  // 前序的前段都相同
  let result = [];
  let stack = [root];

  while (stack.length > 0) {
    // 一樣是把元素pop出來，丟入資料
    let node = stack.pop();
    result.push(node.val);

    // 再來要用「反序」丟入資料，直到沒有children，以確保出來是根 -> 左 -> 右
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }

  return result;
};
```
