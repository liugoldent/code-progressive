---
tags:
  - LeetCode
  - Easy
  - Tree
  - javascript
  - Maximum Depth of Binary Tree
---

# [0104] Maximum Depth of Binary Tree

## Javascript 解

思路：

- 一樣使用遞迴去找最深的深度

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
var maxDepth = function (root) {
  if (root === null) {
    return 0;
  } else {
    // +1 代表如果節點有左or右節點 -> 至少就有深度1
    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
  }
};
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
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) return 0;
  let queue = [root];
  let depth = 0;
  while (queue.length) {
    const qLen = queue.length;

    for (let i = 0, len = qLen; i < len; i++) {
      const curr = queue.shift();

      if (curr.right) queue.push(curr.right);
      if (curr.left) queue.push(curr.left);
    }
    depth++;
  }
  return depth;
};
```

```js
// demo code
// 創建一顆二元樹
const root = new TreeNode(3);
root.left = new TreeNode(9);
root.right = new TreeNode(20);
root.right.left = new TreeNode(15);
root.right.right = new TreeNode(7);

// 計算二元樹的最大深度
const depth = maxDepth(root);

// 輸出最大深度
console.log(depth);
```

## python 解

```python
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
var maxDepth = function(root) {
    if(!root) return 0
    let queue = [root]
    let depth = 0
    while(queue.length){
        const qLen = queue.length

        for(let i = 0 , len = qLen ; i < len ; i++){
            const curr = queue.shift()

            if(curr.right) queue.push(curr.right)
            if(curr.left) queue.push(curr.left)
        }
        depth++
    }
    return depth
};
```
