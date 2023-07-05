class TrieNode {
  constructor(){
      this.children = new Map()
      this.word = null
  }
}

class Trie {
  constructor(){
      this.root = new TrieNode()
  }
  insert(word){
      let node = this.root
      for(const char of word){
          if(!node.children.has(char)){
              node.children.set(char, new TrieNode())
          }
          node = node.children
      }
      node.word = word
  }
}
/**
* @param {character[][]} board
* @param {string[]} words
* @return {string[]}
*/
const findWords = function(board, words) {
  const trie = new Trie()
  const result = []

  for(const word of words){
      trie.insert(word)
  }

  const dfs = function(node, row, col){
      const char = board[row][col]
      const currentNode = node.children.get(char)

      if(!currentNode){
          return
      }

      if(currentNode.word){
          result.push(currentNode.word)
          currentNode.word = null
      }

      board[row][col] = '#'

      if(row>0 && board[row-1][col] !== '#'){
          dfs(currNode, row-1, col)
      }

      if(row < board.length - 1 && board[row+1[col] !=='#']){
          dfs(currNode, row+1, col)
      }

      if(col > 0 && board[row][col-1]){
          dfs(currNode, row, col -1)
      }

      if(col < board[0].length && board[row][col+1]){
          dfs(currNode, row, col + 1)
      }

      board[row][col] = char
  }

  for(let i = 0, len = board.length ; i < len ; i++){
      for(let j = 0 , lenj = board[0].length ; j < lenj ; j++){
          dfs(trie.root, i,j)
      }
  }

  return result


};
























