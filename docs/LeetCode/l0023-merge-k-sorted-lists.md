---
tags: 
    - LeetCode
    - Hard
    - Merge k Sorted Lists
    - Linked List
    - Javascript
---
# [0023] Merge k Sorted Lists
[LeetCode problem #23–Merge k sorted lists (JavaScript)](https://duncan-mcardle.medium.com/leetcode-problem-23-merge-k-sorted-lists-javascript-59d9bb998fd)
[Leetcode No.23(Merge k Sorted Lists) 心得(Hard)](https://medium.com/@ChYuan/leetcode-no-23-merge-k-sorted-lists-%E5%BF%83%E5%BE%97-hard-495d0991c99a)
## Javascript 解
* 思考：
    * 在這邊我們先將Linked List改成Array形式
    * 然後對Array進行排序之後
    * 再倒序(畫圖就知道為何倒序了)排列成新的new ListNode
```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

var mergeKLists = function (lists) {
  let mainArray = []

  const addLinkedListToMainArray = function(subList){
    mainArray.push(subList.val)

    if(subList.next !== null){
      addLinkedListToMainArray(subList.next)
    }
  }

  for(let i = 0, len = lists.length ; i < len ; i++){
    if(lists[i] !== null){
      addLinkedListToMainArray(lists[i])
    }
  }

  mainArray = mainArray.sort((a, b) => a - b);

  let newList = null
  for(let i = mainArray.length -1; i >=0 ; i--){
      newList = new ListNode(mainArray[i], newList)
  }
  return newList
};
```