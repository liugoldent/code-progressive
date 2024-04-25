---
tags:
  - LeetCode
  - Medium
  - Valid Sudoku
  - javascript
---

# [0036] Valid Sudoku

[medium Ans](https://medium.com/codex/valid-sudoku-the-javascript-solution-2d1543f85410)

## Javascript 解

題意：主要在說，要判斷這是不是一個數獨  
思路：

1. 因為用到「重複」這關鍵字，所以一定是用 set
2. 然後必定要跑兩次回圈，才可以全部遍歷完整
3. 特殊的方法是`const box`：當遍歷到該 box(r,c)，可以去判斷之前是否已經有出現過
4. box 的概念是將遇到的每一個數字，變成一個大的坐標系
5. 例如第一個(row=0,col=0)->得到的 5，或是(row=2,col=2)得到的->8 同等於在整個圖形(0,0)的位置
6. 以此去判斷是否有出現在 box 中

```js
function isValidSudoku(board) {
  // 必定使用set
  let set = new Set();
  // 雙層遍歷找到元素
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const value = board[r][c];
      // 如果是.跳過
      if (value !== ".") {
        // 設定row col box的值
        const row = `${value} at row ${r}`;
        const col = `${value} at col ${c}`;
        const box = `${value} at box ${Math.floor(r / 3)}, ${Math.floor(
          c / 3
        )}`;
        // 如果set有就要return false
        if (set.has(row) || set.has(col) || set.has(box)) {
          return false;
        } else {
          // 如果沒有就add 進去
          set.add(row);
          set.add(col);
          set.add(box);
        }
      }
    }
  }

  return true;
}
```

## Python 解
```python
class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        for i in range(9):
            if not self.is_valid_unit(board[i]):
                return False

        for j in range(9):
            if not self.is_valid_unit(board[i][j] for i in range(9)):
                return False

        for i in range(0, 9, 3):
            for j in range(0, 9, 3):
                if not self.is_valid_unit([board[x][y] for x in range(i, i+3) for y in range(j, j+3)]):
                    return False

        return True

    def is_valid_unit(self, unit):
        seen = set()
        for num in unit:
            if num != '.':
                if num in seen:
                    return False
                seen.add(num)
        return True
            
```
