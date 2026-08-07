---
title: "[0024] Swap Nodes in Pairs"
description: "[0024] Swap Nodes in Pairs 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Swap Nodes in Pairs
  - JavaScript
keywords: ["0024", "Swap", "Nodes", "in", "Pairs", "LeetCode", "Javascript", "大師圖文講解"]
---




# [0024] Swap Nodes in Pairs

> 題號：**0024** | 難度：**Medium** | 主題：**Swap Nodes in Pairs**

## JavaScript 解法
其實此題重點在於，不可改變節點的值
只能改變節點
所以理所當然就是 Linked List 操作來操作去的

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
var swapPairs = function (head) {
  if (head === null || head.next === null) {
    return head;
  }
  // 一樣先設定最前面的firstNode
  let firstNode = new ListNode(0);

  // 將firstNode.next 指向input head
  firstNode.next = head;

  // 先定義好 prev / cur
  let prev = firstNode;
  let cur = head;

  let keepNode;

  while (cur !== null && cur.next !== null) {
    // 保存好keepNode 為下一次的操作對象
    keepNode = cur.next.next;
    // 將cur/prev開始對調
    cur.next.next = cur;
    prev.next = cur.next;

    // 將cur.next 移向保存好的節點
    cur.next = keepNode;

    // 因為要開始操作下一循環對象，所以將跑到後面的cur，賦予給prev
    prev = cur;
    // 然後cur往下走一格
    cur = cur.next;
  }
  return firstNode.next;
};
```

## 大師圖文講解

[24. Swap Nodes in Pairs 圖文參考](https://skyyen999.gitbooks.io/-leetcode-with-javascript/content/questions/24md.html)
