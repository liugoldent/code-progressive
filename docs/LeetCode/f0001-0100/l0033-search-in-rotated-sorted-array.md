---
tags: 
    - LeetCode
    - Medium
    - Search in Rotated Sorted Array
    - Javascript
    - Binary Search
---
# [0033] Search in Rotated Sorted Array
## Javascript 解
解釋：在一個旋轉過的Array，去找是否有其數值
因為一樣是有序的序列，所以也可以用Binary Search去找尋
[Ans](https://duncan-mcardle.medium.com/leetcode-problem-33-search-in-rotated-sorted-array-javascript-71cb7f38b563)
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function (nums, target) {
    // 如果length === 1 && nums[0]不等於目標值，直接返回-1
  if (nums.length === 1 && nums[0] !== target) {
    return -1;
  }
  let left = 0;
  let right = nums.length;
  // 終止條件是left > right
  while (left < right) {
    // 先求出中間點位
    const mid = Math.floor((right - left) / 2);
    // 如果中間點位=目標值，直接返回mid
    if(nums[mid] === target) return mid
    // 如果left < mid，代表要往右邊找
    if(nums[left] <= nums[mid]){
        // 進一步判斷target是比left大與比mid小 -> 則right移動到mid端點
      if(nums[left] <= target && target < nums[mid]){
        right = mid
      }else{
        left = mid + 1
      }
    }else{
      if(nums[mid] < target && target <= nums[right]){
        left = mid + 1
      }else{
        right = mid
      }
    }
  }
  return nums[left] === target ? left : -1
};
```
