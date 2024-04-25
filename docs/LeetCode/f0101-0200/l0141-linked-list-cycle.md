---
tags:
  - LeetCode
  - Easy
  - Linked List Cycle
  - javascript
  - Linked List
---

# [0141] Linked List Cycle

- 遍歷一個 linked list，並且給他一個 flag 註解是否有被遍歷過

## Javascript 解

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
