---
title: "[0141] Linked List Cycle"
description: "[0141] Linked List Cycle 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Linked List Cycle
  - JavaScript
  - Linked List
keywords: ["0141", "Linked", "List", "Cycle", "LeetCode", "Javascript"]
---




# [0141] Linked List Cycle

> 題號：**0141** | 難度：**Easy** | 主題：**Linked List Cycle, Linked List**

- 遍歷一個 linked list，並且給他一個 flag 註解是否有被遍歷過

## JavaScript 解法
```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

var mergeKLists = function (lists) {
  let mainArray = [];
  // 2. 這邊做list to Array的轉換
  const addLinkedListToMainArray = function (subList) {
    mainArray.push(subList.val);

    if (subList.next !== null) {
      addLinkedListToMainArray(subList.next);
    }
  };
  // 1. 在這邊將list整理成Array
  for (let i = 0, len = lists.length; i < len; i++) {
    if (lists[i] !== null) {
      addLinkedListToMainArray(lists[i]);
    }
  }
  // 3. 將Array 排序
  mainArray = mainArray.sort((a, b) => a - b);

  // 4. 將其變為ListNode形式
  let newList = null;
  for (let i = mainArray.length - 1; i >= 0; i--) {
    newList = new ListNode(mainArray[i], newList);
  }
  return newList;
};
```
