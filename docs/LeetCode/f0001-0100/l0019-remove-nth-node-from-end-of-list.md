---
tags:
  - LeetCode
  - Medium
  - Remove Nth Node From End of List
  - javascript
  - Linked List
---

# [0019] Remove Nth Node From End of List

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
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function (head, n) {
  // 先建立一個假節點
  const dummy = new ListNode(0);
  dummy.next = head;

  // 用快慢指針去指向假節點
  let fast = dummy;
  let slow = dummy;

  // 先用快指針去找到結束節點
  for (let i = 0; i < n; i++) {
    fast = fast.next;
  }

  // 當快指針next 為 null時代表到底了
  while (fast.next !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  // 接下來將slow.next替換兩個
  slow.next = slow.next.next;

  // 得到解答
  return dummy.next;
};
```
