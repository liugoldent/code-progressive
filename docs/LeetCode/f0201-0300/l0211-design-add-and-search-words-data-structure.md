---
tags:
  - LeetCode
  - Medium
  - javascript
  - Tries
  - Design Add and Search Words Data Structure
---

# [0211] Design Add and Search Words Data Structure

## Javascript 解

- 主要講述 searchNode 的部分（insert 可以去 208 看）

```js
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

var WordDictionary = function () {
  this.root = new TrieNode();
};

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  let currentNode = this.root;

  for (let i = 0, len = word.length; i < len; i++) {
    let char = word[i];
    if (!currentNode.children.has(char)) {
      currentNode.children.set(char, new TrieNode());
    }
    currentNode = currentNode.children.get(char);
  }
  currentNode.isEndOfWord = true;
};

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  return this.searchNode(word, this.root);
};

WordDictionary.prototype.searchNode = function (word, node) {
  for (let i = 0, len = word.length; i < len; i++) {
    let char = word[i];
    // 如果遇到的字元為「.」
    if (char === ".") {
      // 去遍尋children的節點，如果有找到就是return true
      for (const childNode of node.children.values()) {
        if (this.searchNode(word.slice(i + 1), childNode)) {
          return true;
        }
      }
      // 都沒找到return false
      return false;
      // 如果不是「.」就找children是否有char
    } else if (!node.children.has(char)) {
      return false;
    }
    // 如果node.children -> 沒有get到東西，則return false
    if (!node.children.get(char)) {
      return false;
    } else {
      // 如果get到東西，則node網下
      node = node.children.get(char);
    }
  }
  // 如果跑完都過了，判斷是否整串字，返回isEndOfWord
  return node.isEndOfWord;
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
```
