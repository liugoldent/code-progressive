---
title: "[0155] Min Stack"
description: "[0155] Min Stack 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Min Stack
  - JavaScript
  - Binary Search
keywords: ["0155", "Min", "Stack", "LeetCode", "Javascript"]
---




# [0155] Min Stack

> 題號：**0155** | 難度：**Medium** | 主題：**Min Stack, Binary Search**

## JavaScript 解法
```js
/**
 * initialize your data structure here.
 */
var MinStack = function () {
  this.stack = [];
  this.minStack = []; // 最小堆疊用於跟踪最小值
};

/**
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
  this.stack.push(x);
  // 如果 x 是最小值，則將其推入最小堆疊
  if (
    this.minStack.length === 0 ||
    x <= this.minStack[this.minStack.length - 1]
  ) {
    this.minStack.push(x);
  }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
  // 首先將this.stack.pop() -> 注意這邊已經pop
  // === 條件後，是說如果剛好this.stack.pop出來的值，兩個相等，則minStack也要pop
  if (this.stack.pop() === this.minStack[this.minStack.length - 1]) {
    this.minStack.pop();
  }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
  // top 單純，就直接把stack的top丟出來
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
  // 最小值必為minStack頂層
  return this.minStack[this.minStack.length - 1];
};
```
