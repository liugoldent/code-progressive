---
tags: 
    - LeetCode
    - Easy
    - Binary Search
    - Javascript
---
# [0704] Binary Search
## Javascript 解
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    if(nums.length === 1 && target !== nums[0]){
        return -1
    }
    let left = 0
    let right = nums.length - 1
    let mid = Math.floor((left + right) / 2)
    // 終止條件是<=
    while(left <= right){
        if(target === nums[mid]){
            return mid
        }
        if(nums[mid] < target){
            // 記得這邊要+1
            left = mid + 1
        }else{
            // 記得這邊要-1
            right = mid - 1
        }
        // 更新mid位子
        mid = Math.floor((left + right) / 2)
    }
    return -1
};
```
