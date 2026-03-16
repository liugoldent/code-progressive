---
title: "[0094] Binary Tree Inorder Traversal"
description: "[0094] Binary Tree Inorder Traversal 題解，整理中序遍歷的核心觀念、遞迴與疊代解法，以及時間空間複雜度分析。"
tags:
  - LeetCode
  - Easy
  - Tree
  - JavaScript
keywords: ["0094", "Binary Tree", "Inorder Traversal", "LeetCode", "JavaScript", "DFS"]
---

# [0094] Binary Tree Inorder Traversal

> 題號：**0094** | 難度：**Easy** | 主題：**Tree**

## 題目描述

給你一棵二元樹的根節點 `root`，請回傳它的中序遍歷（inorder traversal）結果。

中序遍歷的順序是：

1. 先走左子樹
2. 再處理目前節點
3. 最後走右子樹

也就是常看到的順序：

`left -> root -> right`

## 先理解什麼是中序遍歷

假設有這棵樹：

```text
    1
     \
      2
     /
    3
```

中序遍歷的過程會是：

1. 先看 `1` 的左邊，沒有
2. 訪問 `1`
3. 往右到 `2`
4. 先走 `2` 的左邊到 `3`
5. 訪問 `3`
6. 回到 `2`
7. 訪問 `2`

所以答案是：

```js
[1, 3, 2]
```

這題本質上不難，重點是要搞懂 traversal 順序，以及為什麼疊代版需要 stack。

## 解題思路

這題有兩個最常見解法：

- 遞迴 DFS
- 疊代 + stack

### 為什麼遞迴很直覺

因為二元樹本身就是遞迴結構。

對每個節點來說，只要做三件事：

1. 遞迴處理左子樹
2. 把自己放進答案
3. 遞迴處理右子樹

這剛好就是中序遍歷的定義。

### 為什麼疊代版要用 stack

因為遞迴本質上也在用 call stack。

如果我們不用遞迴，就要自己維護一個 stack 來記住「還沒處理完的祖先節點」。

中序遍歷的策略是：

- 一路往左走，把經過的節點都先丟進 stack
- 走到不能再左為止，表示目前 stack 最上面就是下一個該處理的節點
- pop 出來後記錄它的值
- 再轉去處理它的右子樹

這就是為什麼程式裡會一直看到：

```js
while (curr !== null) {
  stack.push(curr);
  curr = curr.left;
}
```

因為你是在模擬遞迴「先把左邊走到底」的過程。

## 解法一：遞迴 DFS

這是最直覺的版本，也通常是第一個應該想到的寫法。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *   this.val = val === undefined ? 0 : val;
 *   this.left = left === undefined ? null : left;
 *   this.right = right === undefined ? null : right;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const result = [];

  function dfs(node) {
    if (node === null) return;

    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
};
```

### 遞迴版怎麼想

每次進入一個節點：

- 先處理左邊
- 再處理自己
- 再處理右邊

這樣自然就符合 inorder traversal。

### 複雜度

- 時間複雜度：`O(n)`
  每個節點只會被走訪一次。
- 空間複雜度：`O(h)`
  `h` 是樹高，來自遞迴呼叫堆疊。

最差情況如果樹退化成 linked list，會到 `O(n)`。

## 解法二：疊代 + Stack

這題的面試價值通常在這個版本，因為它比較能看出你是否真的理解 traversal。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *   this.val = val === undefined ? 0 : val;
 *   this.left = left === undefined ? null : left;
 *   this.right = right === undefined ? null : right;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const result = [];
  const stack = [];
  let curr = root;

  while (curr !== null || stack.length > 0) {
    while (curr !== null) {
      stack.push(curr);
      curr = curr.left;
    }

    curr = stack.pop();
    result.push(curr.val);
    curr = curr.right;
  }

  return result;
};
```

### 疊代版流程拆解

以這棵樹為例：

```text
    4
   / \
  2   6
 / \ / \
1  3 5  7
```

一開始：

- `curr = 4`
- `stack = []`

一路往左：

- push `4`
- push `2`
- push `1`
- 再往左是 `null`，停下來

這時候：

- `stack = [4, 2, 1]`

接著：

- pop `1`，加入答案
- `curr = 1.right`，也就是 `null`

之後再 pop `2`：

- 加入答案
- `curr = 2.right`，也就是 `3`

再對 `3` 做同樣流程。

你會發現整體順序就是：

`1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7`

### 為什麼這樣不會漏節點

因為每個節點都只會經歷兩件事：

- 被 push 進 stack 一次
- 被 pop 出來處理一次

而我們只有在：

- 左子樹處理完後才處理自己
- 處理完自己才去右子樹

所以順序剛好就是 inorder。

### 複雜度

- 時間複雜度：`O(n)`
- 空間複雜度：`O(h)`

和遞迴版相同，只是這次空間來自我們自己維護的 stack。

## 常見陷阱

### 1. 忘記外層 while 要同時檢查 `curr` 與 `stack`

如果只寫：

```js
while (curr !== null) {}
```

當 `curr` 變成 `null` 時，程式就提早結束了，但 stack 裡可能還有節點沒處理。

正確寫法是：

```js
while (curr !== null || stack.length > 0) {}
```

### 2. 以為 pop 出來後就結束

pop 出當前節點後，還要記得：

```js
curr = curr.right;
```

否則右子樹根本不會被遍歷。

### 3. 不清楚三種遍歷順序差在哪

二元樹 DFS 常見三種：

- preorder：`root -> left -> right`
- inorder：`left -> root -> right`
- postorder：`left -> right -> root`

這題是 inorder，所以一定是「左邊走到底，再回來處理自己」。

## 什麼時候用遞迴，什麼時候用疊代

- 如果只是寫題、快速表達思路：遞迴通常最直覺
- 如果面試官追問非遞迴版本：就改成 stack
- 如果擔心樹很深造成 call stack 過深：疊代版更穩

## 總結

這題是二元樹 traversal 的基本題，重點其實不是 code 多難，而是你有沒有真的理解：

- inorder traversal 的順序是 `left -> root -> right`
- 遞迴版是在利用 call stack
- 疊代版是在自己模擬 call stack

如果這題想熟，最好的方法不是背程式，而是拿一棵小樹手動畫出 stack 變化。你一旦能自己推一次，preorder / postorder 也會一起通。
