function isValidSudoku(board) {
  let set = new Set()
  
  for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        const value = board[r][c]
        if(value !== '.'){
          const row = `${value} at row ${r}`
          const col = `${value} at col ${c}`
          const box = `${value} at box ${Math.floor(r/3)}, ${Math.floor(c/3)}`
          if(set.has(row) || set.has(col) || set.has(box)){
            return false
          }else{
            set.add(row)
            set.add(col)
            set.add(box)
          }
        }
      }
  }

  return true
};

oneSetValidSudoku([
["8","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]])
