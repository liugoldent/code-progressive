---
tags: 
    - LeetCode
    - Medium
    - Tree
    - Javascript
    - Construct Binary Tree from Preorder and Inorder Traversal
---
# [0105] Construct Binary Tree from Preorder and Inorder Traversal

## Javascript 解
思路： 
* 一樣使用遞迴去找最深的深度
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    if(!preorder.length || !inorder.length){
        return null
    }
    // 先將preorder的第0個設定為root
    const root = preorder[0]
    // 再來新增一個tree
    const newTree = new TreeNode(root)
    // 再來找到root會在哪個index裏面
    const root_index = inorder.indexOf(root)

    // 最後將.left & .right子樹補上
    // 注意preorder目標範圍與inorder目標範圍
    newTree.left = buildTree(preorder.slice(1, root_index+1), inorder.slice(0, root_index))
    newTree.right = buildTree(preorder.slice(root_index +1), inorder.slice(root_index+1))

    return newTree
};
```
## 參考思考
[個人解法筆記](https://www.wongwonggoods.com/all-posts/interview_prepare/python_leetcode/leetcode-python-105/#%E9%A1%8C%E7%9B%AE%E5%87%BA%E8%99%95)