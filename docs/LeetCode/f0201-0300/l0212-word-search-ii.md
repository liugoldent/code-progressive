---
tags:
  - LeetCode
  - Medium
  - javascript
  - Tries
  - Word Search II
---

# [0212] Word Search II

```js
// 一樣先定義字典樹的節點
class TrieNode {
  constructor() {
    this.children = new Map();
    this.word = null;
  }
}

class Trie {
  constructor() {
    // 讓root = 字典樹
    this.root = new TrieNode();
  }

  // 製造出insert
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.word = word;
  }
}

const findWords = function (board, words) {
  // trie => 製造節點
  const trie = new Trie();
  const result = [];

  // 建構樹
  for (const word of words) {
    trie.insert(word);
  }

  // 深度優先搜尋
  const dfs = function (node, row, col) {
    // 不過這邊變成row/col一起下去找
    const char = board[row][col];
    const currNode = node.children.get(char);

    // 如果沒找到則繼續往下找（因為雙層for會跑完全部節點）
    if (!currNode) {
      return;
    }

    // 如果字存在了（找到了字），先push進result。再將word設定成null
    if (currNode.word) {
      result.push(currNode.word);
      currNode.word = null; // 避免重复添加到结果集
    }

    // 如果都沒事，代表可能中間而已，需要進行標記
    board[row][col] = "#";

    // 搜索相鄰的row * col => 至關重要，上下左右都要找
    if (row > 0 && board[row - 1][col] !== "#") {
      dfs(currNode, row - 1, col);
    }
    if (row < board.length - 1 && board[row + 1][col] !== "#") {
      dfs(currNode, row + 1, col);
    }
    if (col > 0 && board[row][col - 1] !== "#") {
      dfs(currNode, row, col - 1);
    }
    if (col < board[0].length - 1 && board[row][col + 1] !== "#") {
      dfs(currNode, row, col + 1);
    }

    // 恢復當前此格的文字
    board[row][col] = char;
  };

  // 遍歷整個網格
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      dfs(trie.root, i, j);
    }
  }

  return result;
};
```


```js
/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */

 function buildTrie(words) {
  const root = {};

  for (const word of words) {
    let node = root;
    for (const char of word) {
      if (!node[char]) {
        node[char] = {};
      }
      node = node[char];
    }
    node.word = word; // 在單字結尾儲存完整單字
  }

  return root;
}

var findWords = function(board, words) {
    const result = []
    const trie = buildTrie(words)
    const rows = board.length
    const cols = board[0].length

    const dfs = (i, j, node) => {
        const char = board[i][j]
        if(!node[char]) return

        const nextNode = node[char]

        if(nextNode.word){
            result.push(nextNode.word)
            nextNode.word = null
        }

        board[i][j] = '#'

        const directions = [[1,0],[0,1],[-1,0],[0,-1]];

        for(const [dx, dy] of directions) {
            const ni = i + dx
            const nj = j + dy
            if(ni >= 0 && nj >= 0 && ni < rows && nj < cols && board[ni][nj] !== '#'){
                dfs(ni, nj, nextNode)
            }
        }

        board[i][j] = char
    }

    for(let i = 0 ; i < rows; i++){
        for(let j = 0; j < cols; j++){
            dfs(i, j, trie)
        }
    }

    return result
};
```
