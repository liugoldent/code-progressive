---
tags: 
    - LeetCode
    - Easy
    - Implement Queue using Stacks
    - Javascript
    - Python
---
# [0232] Longest Common Prefix
## Javascript 解
思路：這題主要是說，你只能用stack去做出Queue
```javascript

var MyQueue = function() {
    this.stack = []
    this.helpStack = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function(x) {
    this.stack.push(x)
};

/**
 * @return {number}
 */
MyQueue.prototype.pop = function() {
    if(this.helpStack.length === 0){
        while(this.stack.length > 0){
             this.helpStack.push(this.stack.pop())
        }
    }
    return this.helpStack.pop()
};

/**
 * @return {number}
 */
MyQueue.prototype.peek = function() {
    if(this.helpStack.length === 0){
        while(this.stack.length > 0){
             this.helpStack.push(this.stack.pop())
        }
    }
    return this.helpStack[this.helpStack.length - 1]
};

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function() {
    return this.stack.length === 0 && this.helpStack.length === 0
};

/** 
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
```

## stack
入口等於出口
1. stack.push(k) -> 把 k 放到最上層（放到入口）
2. stack.pop() -> 把最上層的東西拿走（注意是拿走！）從出口取出一個元素
3. stack.peek() -> 用於檢索或獲取Stack的第一個元素或位於Stack頂部的元素。檢索到的元素不會被刪除或從堆棧中刪除。（不會刪除元素！！！

## queue
入口不等於出口
1. queue.push(k) -> 把 k 放到最後面（放到入口）
2. queue.pop() -> 把最前面的東西拿走（注意是拿走！）從出口取出一個元素

## 文章推薦
[Stack — 堆疊和Queue — 佇列](https://medium.com/coding-hot-pot/%E8%B3%87%E6%96%99%E7%B5%90%E6%A7%8B-stack-%E5%A0%86%E7%96%8A%E5%92%8Cqueue-%E4%BD%87%E5%88%97-e270e5075ae1)
[LeetCode 232. Implement Queue using Stacks
](https://skyyen999.gitbooks.io/-leetcode-with-javascript/content/questions/232md.html)
