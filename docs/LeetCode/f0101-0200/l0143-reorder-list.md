---
tags:
  - LeetCode
  - Medium
  - Reorder List
  - javascript
  - Linked List
---

# [0143] Reorder List

這題大致分三個程序

1. 先用快慢指針找到中間點
2. 再將 linked list reverse
3. 將兩個 linked list merge

## Javascript 解

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
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function (head) {
  if (!head || !head.next) {
    return head;
  }

  let slow = head;
  let fast = head;
  // 先找到中間節點(使用快慢指針)
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let prev = null;
  let curr = slow.next;
  // 反轉後半部份linked list
  while (curr) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // 確認：把前半段的最後截斷變成null
  slow.next = null;

  let p1 = head;
  let p2 = prev;

  while (p2) {
    let next1 = p1.next;
    let next2 = p2.next;
    p1.next = p2;
    p2.next = next1;
    p1 = next1;
    p2 = next2;
  }
  return head;
};
```
