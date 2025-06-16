---
description: "LeetCode 200 - Number of Islands JavaScript 題解，使用 DFS 深度優先搜索與 Grid 圖遍歷技巧，教你一步步計算島嶼數量。適合面試圖論與遞迴常見題目準備。"
date: 2025-06-16
tags: [LeetCode, JavaScript, DFS, Graph, Grid Traversal, Flood Fill, 遞迴, 面試題]
---

# [0200] Number of Islands

> Tags: `DFS`, `Graph`, `Grid Traversal`, `Flood Fill`, `LeetCode`, `JavaScript`, `面試常見題`
> 難度：中等  
> 類型：圖論 + 遞迴深度優先搜索（DFS）  

---

## 🧠 題目描述（Number of Islands）

給定一個由 `'1'`（陸地）和 `'0'`（水域）組成的 2D 網格，請你計算總共有多少個「島嶼」。

一個島嶼是由**水平或垂直相鄰**的 `'1'` 所構成的區塊（不能斜角），且四周都被水包圍。

---

## ✅ 解題思路（使用 DFS）

1. 從網格中每個 cell 開始走，當遇到 `'1'` 時表示找到一塊新的島嶼。
2. 呼叫 DFS 遍歷該島嶼相連的所有 `'1'`，並在訪問過後將其改成 `'0'`，避免重複計數。
3. 每找到一個新島嶼，就增加計數器。

---

## 💻 JavaScript 程式碼

```js
/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  // 深度優先搜索，將所有連通的 '1' 標記為 '0'
  function dfs(r, c) {
    if (
      r < 0 || r >= rows || 
      c < 0 || c >= cols || 
      grid[r][c] === '0'
    ) return;

    // 訪問過的格子標記為 '0'（相當於沉島）
    grid[r][c] = '0';

    // 向上下左右四個方向遞迴
    dfs(r + 1, c); // 下
    dfs(r - 1, c); // 上
    dfs(r, c + 1); // 右
    dfs(r, c - 1); // 左
  }

  // 主迴圈：掃描整個 grid
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islandCount++;
        dfs(r, c);
      }
    }
  }

  return islandCount;
}
