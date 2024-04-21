---
tags: 
    - LeetCode
    - Medium
    - Javascript
    - Kth Smallest Element in a BST
    - Trees
---
# [0230] Kth Smallest Element in a BST

## Javascript 解

## 思路：
* 比較不正確的想法:先全部遍歷一遍後再sort，因為這樣會喪失BST的特性，左節點比右節點小
* 比較正確的是：先左邊全部遍歷完之後，push node.val，然後再右邊遍歷
* 這題其實就是遍歷完之後，不管怎麼跑，只要跑到全部的數字都出來，再排序過，或是依照特性不排序，返回值就ok了
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
var kthSmallest = function(root, k) {
  let result = []
  let dfs = (root) =>{
    if(!root) return null
    dfs(root.left)
    result.push(root.val)
    dfs(root.right)
  }
  dfs(root)
  
  return result[k-1]
};

```
