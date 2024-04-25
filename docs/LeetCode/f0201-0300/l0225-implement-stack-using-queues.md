---
tags:
  - LeetCode
  - Easy
  - javascript
  - Implement Stack using Queues
  - Stack
  - Queue
---

# [0225] Implement Stack using Queues

## Javascript 解

這題個人覺得是觀念而已，所以基本上只直接 array 原生的方法去解出

```js
var MyStack = function () {
  this.queue = [];
};

/**
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function (x) {
  // 先看size多大（這是要reverse的size）
  const size = this.queue.length;
  // push進去後，因為size只會跑到push之前，所以可以push
  this.queue.push(x);
  // 最後將queue的前半部分reverse，就完成了
  for (let i = 0, len = size; i < len; i++) {
    this.queue.push(this.queue.shift());
  }
};

/**
 * @return {number}
 */
MyStack.prototype.pop = function () {
  return this.queue.shift();
};

/**
 * @return {number}
 */
MyStack.prototype.top = function () {
  return this.queue[0];
};

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function () {
  return this.queue.length === 0;
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
```
