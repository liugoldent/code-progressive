---
tags: 
    - LeetCode
    - Medium
    - Javascript
    - Tries
---
# [0208] Implement Trie (Prefix Tree)
## Javascript 解

## 思路：
[賈考博講解](https://www.youtube.com/watch?v=1gR5FfipQXM&ab_channel=%E8%B4%BE%E8%80%83%E5%8D%9A)
```javascript
class TrieNode {
    constructor() {
        this.children = new Map() // 每一個子層都是新的map（這樣可以保證只有一個key-value對）
        this.isEndOfWord = false // 是否為字的結尾
    }
}

var Trie = function() {
    this.root = new TrieNode()
};

/** 
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function(word) {
    let currentNode = this.root
    // 遍歷這個字
    for(let i = 0 , len = word.length ; i < len ; i++){
        let char = word[i]
        // 如果沒有這個字，就設定他，並將他設定為new TrieNode()
        if(!currentNode.children.has(char)){
            currentNode.children.set(char, new TrieNode())
        }
        // 節點往下
        currentNode = currentNode.children.get(char)
    }
    // 跑完後節點end為true
    currentNode.isEndOfWord = true
};

/** 
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function(word) {
    let currentNode = this.root

    for(let i = 0 , len = word.length ; i < len ; i++){
        let char = word[i]
        // 因為是找尋，所以路上沒有就return false
        if(!currentNode.children.has(char)){
            return false
        }
        // 如果過了，就往下一個節點前進
        currentNode = currentNode.children.get(char)
    }
    // 最後跑完就return 是否為字
    return currentNode.isEndOfWord
};

/** 
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function(prefix) {
    let currentNode = this.root

    for(let i = 0, len = prefix.length ; i < len ; i++){
        let char = prefix[i]
        // 當節點斷掉了，就return false
        if(!currentNode.children.has(char)){
            return false
        }
        // 往下一個節點
        currentNode = currentNode.children.get(char)
    }
    // 最後都沒有就是true（因為是startWith）
    return true
};

/** 
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
```
