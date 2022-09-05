---
description: leetCode two sum js 解答 python 解答
tags: 
    - LeetCode
    - Easy
    - Two Sum
    - Javascript
    - Python
---
# [0002] Two Sum
## Javascript 解
```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // 建立一個新map
    let newMap = new Map()
    // 將這些資料全部放進map內
    for(let i = 0 , len = nums.length ; i < len ; i++){
        newMap.set(nums[i],i)
    }
    // 再跑一次數列迴圈
    for(let j = 0 , lenj = nums.length ; j < lenj ; j++){
        // 設定目標值
        let goal = target - nums[j]
        // 如果map內有這目標值 && 這個位置與map內目標的位置不同則得解
        if(newMap.has(goal) && j !== newMap.get(goal)){
            return [j, newMap.get(goal)]
        }
    }
};
```

## Python 解
```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hashtable = {}
        for i in range(len(nums)):
            hashtable[nums[i]] = i
        for i in range(len(nums)):
            if target - nums[i] in hashtable:
                if hashtable[target - nums[i]] != i:
                    return [i, hashtable[target - nums[i]]]
        return 
```
