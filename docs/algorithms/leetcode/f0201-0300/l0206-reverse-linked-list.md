---
title: "[0206] Reverse Linked List"
description: "[0206] Reverse Linked List 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - JavaScript
  - Linked List
keywords: ["0206", "Reverse", "Linked", "List", "LeetCode", "Javascript", "思路："]
---




# [0206] Reverse Linked List

> 題號：**0206** | 難度：**Easy** | 主題：**Linked List**

## JavaScript 解法
## 解題思路
[it 邦幫忙解答](https://ithelp.ithome.com.tw/articles/10271920)

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  // 1. 要記得一個prev的元素
  let prev = null;
  // 當head還有時，就一直往下
  while (head) {
    // 先將next記錄下來
    let next = head.next;
    // 因為是reverse，所以要讓head.next = prev
    head.next = prev;
    // 將prev更新為head（因為已經更新過了
    prev = head;
    // head 更新成下一個節點
    head = next;
  }
  return prev;
};
```
