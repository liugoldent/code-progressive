---
description: leetCode two sum js 解答 python 解答
tags: 
    - LeetCode
    - Easy
    - Two Sum
    - Javascript
    - Python
    - Array And Hashing
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

## cpp 解
```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        std::unordered_map<int, int> numMap;

        for(int i = 0; i< nums.size(); i++){
            int complement = target - nums[i];
            // 如果在 map 中找到了 complement，说明找到了两个数的和为 target
            if(numMap.find(complement) != numMap.end()){
                return {numMap[complement], i};
            }

            numMap[nums[i]] = i;
        }
        // 如果没有找到符合条件的两个数，返回一个空的 vector
        return {};
    }
};
```

## test case
```js
const twoSum = require("./leetcode.js");

test("基本測試-1", function () {
  expect(twoSum([1, 2, 3, 4], 6)).toEqual([1,3]);
});

test("基本測試-2", function () {
  expect(twoSum([2, 7, 11, 15], 9)).toEqual([0,1]);
});

test("基本測試-3", function () {
  expect(twoSum([3, 3], 6)).toEqual([0,1]);
});

test("基本測試-4", function () {
  expect(twoSum([3, 2, 4], 6)).toEqual([1,2]);
});

```
