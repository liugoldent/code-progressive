---
tags:
  - LeetCode
  - Medium
  - Lowest Common Ancestor of a Binary Search
  - javascript
  - Tree
---

# [0235] Lowest Common Ancestor of a Binary Search

## Javascript 解

目的：找到兩個節點的最低共同節點
名詞：LCA（在樹結構中，每個節點都有一個父節點（除了根節點）。根據樹的定義，從根節點開始，可以通過父節點指針沿著路徑向上或向下移動。給定樹中的兩個節點，它們的最近公共祖先是指在樹中同時作為這兩個節點的後代的最深節點。）

```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  while (true) {
    let val = root.val;
    if ((p.val <= val && val <= q.val) || (p.val >= val && val >= q.val)) {
      // 如果值在p & q 之間，則return root
      return root;
    } else if (p.val >= val && q.val >= val) {
      // 如果值大於val，因為是二元樹，則往右找
      root = root.right;
    } else {
      // 如果值小於val，因為是二元樹，則往左找
      root = root.left;
    }
  }
};
```
