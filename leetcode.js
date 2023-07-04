
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class WordDictionary {
  constructor() {
    this.root = new TrieNode();
  }

  addWord(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
  }

  search(word) {
    return this.searchNode(word, this.root);
  }

  searchNode(word, node) {
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (char === '.') {
        for (const childNode of node.children.values()) {
          if (this.searchNode(word.slice(i + 1), childNode)) {
            return true;
          }
        }
        return false;
      } else if (!node.children.has(char)) {
        console.log(node.children)
        console.log('1')
        return false;
      }
      node = node.children.get(char);
      console.log(node)
    }
    return node.isEndOfWord;
  }
}

const wordDictionary = new WordDictionary();
wordDictionary.addWord("apple");
wordDictionary.addWord("banana");
wordDictionary.addWord("cat");

console.log(wordDictionary.search('rar'
))

