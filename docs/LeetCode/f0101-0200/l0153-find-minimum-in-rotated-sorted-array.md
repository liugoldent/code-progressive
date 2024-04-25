---
tags:
  - LeetCode
  - Medium
  - Find Minimum in Rotated Sorted Array
  - javascript
  - Binary Search
---

# [0153] Find Minimum in Rotated Sorted Array

## Javascript 解

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  // 設定左右邊界
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    // 先算出中間
    const mid = left + Math.floor((right - left) / 2);
    // 如果右邊大於等於中間，則要讓右邊變成中間
    if (nums[right] >= nums[mid]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return nums[left];
};
```
