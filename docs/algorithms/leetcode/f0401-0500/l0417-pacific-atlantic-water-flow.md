---
date: 2025-06-18
title: "[0417] Pacific Atlantic Water Flow"
description: "[0417] Pacific Atlantic Water Flow 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - DFS
  - Graph
  - Matrix
  - Pacific Atlantic
  - Reverse DFS
  - Flood Fill
keywords: ["0417", "Pacific", "Atlantic", "Water", "Flow", "LeetCode", "JavaScript", "DFS"]
---




# [0417] Pacific Atlantic Water Flow

> 難度：Medium  
> 題型：圖論、矩陣走訪、DFS  
> 題目連結：[LeetCode 417 - Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)

## 題目描述
給定一個 `m x n` 的整數矩陣 `heights`，每個格子表示該地的**海拔高度**。  
水只能從**高處或等高**往**低處或等高**流，方向只能是上下左右。

- 太平洋（Pacific）位於矩陣的 **左邊與上邊**
- 大西洋（Atlantic）位於矩陣的 **右邊與下邊**

請找出所有格子 `(r, c)`，使得水能從該格流向**太平洋與大西洋兩者**

## 解題思路

### ✅ 反向思考

與其對每個格子模擬水是否能流向兩個海，不如反向操作：

> **從兩個海邊出發，逆向 DFS，標記所有海水能「灌上來」的格子**

### ✅ 操作流程

1. 使用兩個 `rows x cols` 的布林矩陣：
   - `pacific[r][c]`：水是否能從 Pacific 灌上來
   - `atlantic[r][c]`：水是否能從 Atlantic 灌上來

2. 從海邊格子做 DFS：
   - 只能往**相等或更高**的格子走（因為水只能從高地流）

3. 最後遍歷矩陣，找出 `(r,c)` 同時在兩者為 `true` 的格子

## 💻 JavaScript 解法（DFS）

```js
/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function(heights) {
    const rows = heights.length
    const cols = heights[0].length

    const pacific = Array.from({length: rows}, () => Array(cols).fill(false))
    const atlantic = Array.from({length: rows}, () => Array(cols).fill(false))

    const direction = [[1,0], [-1,0], [0,1], [0,-1]]

    function dfs(r, c, visited, prevHeight){
        if (
            r < 0 || c < 0 || r >= rows || c >= cols || 
            visited[r][c] || heights[r][c] < prevHeight
        ) return

        visited[r][c] = true

        for (let [dr, dc] of direction) {
            dfs(r + dr, c + dc, visited, heights[r][c])
        }
    }

    // 太平洋（左、上邊界）
    for (let c = 0; c < cols; c++) dfs(0, c, pacific, heights[0][c])
    for (let r = 0; r < rows; r++) dfs(r, 0, pacific, heights[r][0])

    // 大西洋（右、下邊界）
    for (let c = 0; c < cols; c++) dfs(rows - 1, c, atlantic, heights[rows - 1][c])
    for (let r = 0; r < rows; r++) dfs(r, cols - 1, atlantic, heights[r][cols - 1])

    const result = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (pacific[r][c] && atlantic[r][c]) {
                result.push([r, c])
            }
        }
    }

    return result
}
