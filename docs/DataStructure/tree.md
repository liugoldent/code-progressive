---
tags:
  - 資料結構 / 演算法
---
# Tree：樹

## 核心遍歷
```js
// 前序（Root → Left → Right）
function preorder(root: TreeNode | null, res: number[] = []): number[] {
    if(root === null) return res
    res.push(root.value)
    preorder(root.left, res)
    preorder(root.right, res)
    return res
}

// 中序（Left → Root → Right）
function inorder(root: TreeNode | null, res: number[] = []): number[] {
    if(root === null) return res
    inorder(root.left, res)
    res.push(root.value)
    inorder(root.right, res)
    return res
}

// 后序（Left → Right → Root）
function postorder(root: TreeNode | null, res: number[] = []): number[] {
    if(root === null) return res
    postorder(root.left, res)
    postorder(root.right, res)
    res.push(root.value)
}

// 廣度優先搜尋：BFS
function levelOrder(root: TreeNode | null): number[][] {
    if(!root) return []
    const queue = [root]
    const list = []
    while(queue.length > 0){
        const node = queue.shift()
        list.push(node.value)
        if(node.left) queue.push(node.left)
        if(node.right) queue.push(node.right)
    }
    return list 
}
```

## Leetcode題目
| 天   | 题号 & 主题                                | 难度     | 重点                 |
| --- | -------------------------------------- | ------ | ------------------ |
| Mon | 94. Binary Tree Inorder Traversal      | Easy   | 中序模板               |
| Tue | 144. Binary Tree Preorder Traversal    | Easy   | 前序模板               |
| Wed | 145. Binary Tree Postorder Traversal   | Easy   | 后序模板               |
| Thu | 102. Binary Tree Level Order Traversal | Easy   | 层序（BFS）            |
| Fri | 104. Maximum Depth of Binary Tree      | Easy   | 分治 + 返回 subtree 高度 |
| Sat | 226. Invert Binary Tree                | Easy   | 递归变形练手             |
| Sun | 110. Balanced Binary Tree              | Medium | 分治 + 早停 (剪枝)       |
