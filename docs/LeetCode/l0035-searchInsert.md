---
tags:
  - LeetCode
  - Easy
  - Search Insert Position
  - Javascript
  - Python
---

# [0035] Search Insert Position

## Javascript 解

1. 最容易想的方法：跑一個 for loop 看何時nums[i] >= target 就是答案了

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  if (target > nums[nums.length - 1]) return nums.length
  let cursor
  for (let i = 0, len = nums.length; i < len; i++) {
    if (target <= nums[i]) {
      cursor = i
      break
    }
  }
  return cursor
}
```

2. 二分搜尋法

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
 var searchInsert = function(nums, target) {
  let left = 0, right = nums.length -1
  while(left <= right){
    const middle = Math.floor((left+right)/2)
    if(nums[middle] === target){
      return middle
    }else if(nums[middle] > target){
      right = middle -1
    }else if(nums[middle] < target){
      left = middle + 1
    }
  }
  // 如果target找不到則有可能是
  // 1. 在right更右邊
  // 2. 在陣列內未找到時，left 必定 大於 right ，所以回傳答案必定為right+1
  return right + 1
};
```


## Python 解

```python
class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
      left, right = 0, len(nums) -1
      while(left <= right):
        mi = (left + right) // 2
        if nums[mi] == target:
          return mi
        elif nums[mi] > target:
          right = mi -1
        elif nums[mi] < target:
          left = mi + 1
      return right + 1
```
