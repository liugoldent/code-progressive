---
tags: 
    - LeetCode
    - Easy
    - Tree
    - Javascript
    - Subtree of Another Tree
---

# [0572] Subtree of Another Tree
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
 * @param {TreeNode} subRoot
 * @return {boolean}
 */
var isSubtree = function(root, subRoot) {
    if(root === null && subRoot === null){
        return true
    }
    if(root === null || subRoot === null || !isSame(root, subRoot)){
        return false
    }

    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot)
};

var isSame = function(p, q){
    if(p === null && q === null){
        return true
    }
    if(p === null || q === null || p.val !== q.val){
        return false
    }
    return isSame(p.left, q.left) && isSame(p.right, q.right)
}
```
