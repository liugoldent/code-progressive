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
var reorderList = function(head) {
  if(!head || !head.next){
    return head
  }

  let slow = head
  let fast = head
  // 先找到中間節點(使用快慢指針)
  while(fast.next && fast.next.next){
    slow = slow.next
    fast = fast.next.next
  }

  let prev = null
  let curr = slow.next
  // 反轉後半部份linked list
  while(curr){
    let next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  }
  // 把前半段的最後截斷變成null
  slow.next = null


  let p1 = head
  let p2 = prev

  while(p2){
    let next1 = p1.next
    let next2 = p2.next
    p1.next = p2
    p2.next = next1
    p1 = next1
    p2 = next2
  }

  return head
};


// test("基本測試", () => {
//   expect(findMin([1, 2, 3, 4, 5, 6])).toEqual(1);
// });

// test("基本測試", () => {
//   expect(lengthOfLongestSubstring('bbbbb')).toEqual(1);
// });

// test("基本測試", () => {
//   expect(lengthOfLongestSubstring('pwwkew')).toEqual(3);
// });

// test("基本測試", () => {
//   expect(threeSum([-1,2,3,-5,6,-7])).toMatchObject([[ -5, -1, 6 ], [ -5, 2, 3 ]]);
// });
