---
title: "Minimum Absolute Difference in Sliding Submatrix"
description: "JavaScript implementation using a simple BST (ignoring duplicate values) to compute the minimum absolute difference among any two distinct values in every k×k sliding submatrix of a given grid."
tags:
  - javascript
  - algorithm
  - bst
  - sliding-window
  - leetcode
---

## 思路
* 看到每個元素最小距離，會想到平衡二元樹
1. 輸入：一個 m×n 的整數矩陣 grid，和一個子矩陣邊長 k。

2. 輸出：一個尺寸 (m – k + 1) × (n – k + 1) 的二維陣列 ans，其中 ans[i][j] 表示「以 (i,j) 為左上角的 k×k 子矩陣裡，所有不同元素之間的最小絕對差」。

3. 關鍵步驟：
    - 枚舉每個合法的 (i,j) 放 k×k 子矩陣。
    - 把該子矩陣內的 k² 個元素抽出、排序。
    - 比較排序後相鄰兩個值之間的差值，取最小。若 k² 個值都相同，差值自然是 0。
    - 把結果存到 ans[i][j]。

```js
/**
 * 用 BST（Binary Search Tree）解 “Minimum Absolute Difference in Sliding Submatrix”
 * 這個版本會忽略相同的「數值」，只保留獨立的 value 再做排序與比對：
 *
 * 思路：
 * 1. 定義一個簡單的 BST，支援插入（不做自平衡），但在插入時如果遇到重複的數值，就跳過不再重複插入。
 * 2. 對於每個 k×k 子矩陣，將其中的元素依序插入 BST。BST 最終只會保留「每個 value 一次」。
 * 3. 取 BST 的中序遍歷結果（就是已排序的「唯一」值陣列）。如果該陣列長度 < 2，代表子矩陣裡所有值都相同 → 答案為 0。
 * 4. 否則掃描相鄰的兩個已排序值，計算差值取最小，即為該子矩陣的答案。
 */

class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    this.root = this._insertNode(this.root, val);
  }

  _insertNode(node, val) {
    if (node === null) {
      return new BSTNode(val);
    }
    if (val < node.val) {
      node.left = this._insertNode(node.left, val);
    } else if (val > node.val) {
      node.right = this._insertNode(node.right, val);
    }
    // val === node.val 的情況直接忽略（不重複插入）
    return node;
  }

  // 中序遍歷：只會把每個節點的 val 推進 arr 一次，保證唯一性
  inOrderCollect(node, arr) {
    if (!node) return;
    this.inOrderCollect(node.left, arr);
    arr.push(node.val);
    this.inOrderCollect(node.right, arr);
  }

  getSortedUniqueArray() {
    const arr = [];
    this.inOrderCollect(this.root, arr);
    return arr;
  }
}

/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var minimumDifference = function(grid, k) {
  const m = grid.length;
  const n = grid[0].length;
  const H = m - k + 1;
  const W = n - k + 1;
  const ans = Array.from({ length: H }, () => new Array(W).fill(0));

  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      // 用 BST 收集「唯一值」
      const tree = new BST();
      for (let di = 0; di < k; di++) {
        for (let dj = 0; dj < k; dj++) {
          tree.insert(grid[i + di][j + dj]);
        }
      }
        console.log(tree)
      // 取出已排序的唯一值陣列
      const sortedVals = tree.getSortedUniqueArray();

      // 如果只有一個值（或完全沒有），最小絕對差 = 0
      if (sortedVals.length < 2) {
        ans[i][j] = 0;
        continue;
      }

      // 計算相鄰兩值差值中的最小
      let minDiff = Infinity;
      for (let idx = 1; idx < sortedVals.length; idx++) {
        const diff = sortedVals[idx] - sortedVals[idx - 1];
        if (diff < minDiff) {
          minDiff = diff;
          if (minDiff === 0) break; // 理論上若 value 有重複就只會保留唯一，此處不太可能 0
        }
      }
      ans[i][j] = minDiff;
    }
  }

  return ans;
};

// 範例測試
console.log(minimumDifference([[1, 8], [3, -2]], 2));       // [[2]]
// console.log(minimumDifference([[3, -1]], 1));              // [[0, 0]]
// console.log(minimumDifference([[1, -2, 3], [2, 3, 5]], 2)); // [[1, 2]]
```