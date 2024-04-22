---
tags: 
    - LeetCode
    - Medium
    - Word Search
    - Javascript
    - Backtracking
---
# [0079] Word Search
```js
/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
  const m = board.length; // 矩陣的行數
  const n = board[0].length; // 矩陣的列數
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 右、下、左、上四個方向
  let visited = Array.from(Array(m), () => Array(n).fill(false)); // 用於標記是否已訪問過的二維數組

  // 定義DFS函數
  const dfs = (i, j, index) => {
    // 若index等於word的長度，表示已找到符合條件的單詞，返回true
    if (index === word.length) return true;
    // 若i、j超出範圍、已訪問過、或當前字符不等於word的當前字符，返回false
    if (i < 0 || i >= m || j < 0 || j >= n || visited[i][j] || board[i][j] !== word[index]) return false;

    // 標記當前字符已訪問
    visited[i][j] = true;
    // 遍歷四個方向，進行DFS遞歸
    for (const [dx, dy] of directions) {
      if (dfs(i + dx, j + dy, index + 1)) return true;
    }
    // 若DFS遞歸未找到符合條件的單詞，取消標記當前字符的訪問狀態
    visited[i][j] = false;
    return false;
  };

  // 遍歷矩陣的所有字符
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // 對每個字符進行DFS搜索，若找到符合條件的單詞，返回true
      if (dfs(i, j, 0)) return true;
    }
  }

  // 若遍歷完矩陣後未找到符合條件的單詞，返回false
  return false;
};

```
