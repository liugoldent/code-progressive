---
tags: 
    - LeetCode
    - Easy
    - Tree
    - Subtree of Another Tree
---

# [0572] Subtree of Another Tree
## Javascript 解
* 這題要使用到LeetCode 100的Same Tree
* 首先判斷如果root是null就跳出
* 再來判斷將根節點與子節點丟進去是否相同
* 最後分別||判斷左節點是否等於子樹 or 右節點是否是子樹
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
    if (root === null) {
        return false;
    }
    if (isSame(root, subRoot)) {
        return true;
    }

    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};

var isSame = function(p, q) {
    if (p === null && q === null) {
        return true;
    }
    if (p === null || q === null || p.val !== q.val) {
        return false;
    }
    return isSame(p.left, q.left) && isSame(p.right, q.right);
};
```
