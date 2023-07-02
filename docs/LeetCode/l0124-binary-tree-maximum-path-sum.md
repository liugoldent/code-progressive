---
tags: 
    - LeetCode
    - Medium
    - Binary Tree Maximum Path Sum
    - Javascript
    - Trees
---
# [0124] Binary Tree Maximum Path Sum

## Javascript 解
思路
1. 首先要針對字串做全部改小寫與去掉所有特殊符號
2. 再來定義雙指針
3. 從頭與從尾端開始找尋
4. 如果都一樣就(左右指針往前進)並一直continue下去
5. 注意終止條件是 i < j（就是指針遍歷結束的概念）

```javascript
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
let maxPathSumValue = Number.NEGATIVE_INFINITY
var maxPathSum = function(root) {
    maxPathSumValue = Number.NEGATIVE_INFINITY; // 重置最大路径和为负无穷大(不重置可能導致結果錯誤)
    if(root === null){
        return 0
    }
    getMaxPathSum(root)

    return maxPathSumValue
};

var getMaxPathSum = function(root){
    if(root === null){
        return 0
    }
    // 遞歸計算右子樹的最大路徑和，如果為負數則設置為0
    let leftSum = Math.max(0, getMaxPathSum(root.left))
    let rightSum = Math.max(0, getMaxPathSum(root.right))

    // 更新最大路徑和，可能的情況有：只包含當前節點、當前節點加上左子樹、當前節點加上右子樹、當前節點加上左右子樹
    maxPathSumValue = Math.max(maxPathSumValue, root.val + leftSum + rightSum)

    // 返回以當前節點為起點的最大路徑和，可能的情況有：只包含當前節點、當前節點加上左子樹、當前節點加上右子樹
    return root.val + Math.max(leftSum, rightSum)
}
```
