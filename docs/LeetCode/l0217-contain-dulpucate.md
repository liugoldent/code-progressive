---
tags: 
    - LeetCode
    - Easy
    - Javascript
    - Array And Hashing
---
# [0217] Contains Duplicate
## Javascript 解

## 思路：
首先我們可以用暴力解，做兩次for循環，其BigO = O(nlogn)
但是可以藉由放入hashSet的方式去解出這題
for迴圈內：
1. 如果這個hashSet有值了，就return true
2. 如果這個hashSet沒有值，就將這個值add 進入hashSet
3. 如果跑完都沒有return true
4. 最後return false
```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    if(nums.length === 0 || nums.length === 1){
        return false
    }
    let hashSet = new Set()
    for(let i = 0, len = nums.length ; i < len ; i++){
        if(hashSet.has(nums[i])){
            return true
        }else{
            hashSet.add(nums[i])
        }
    }
    return false
};
module.exports = containsDuplicate
```
```javascript
// test case
const containsDuplicate = require('./leetcode.js')


test('基本測試-1', function () {
    expect(containsDuplicate([1, 2, 3, 1])).toBe(true)
})
test('基本測試-2', function () {
    expect(containsDuplicate([1, 2, 3, 4])).toBe(false)
})
test('基本測試-3', function () {
    expect(containsDuplicate([])).toBe(false)
})
test('基本測試-4', function () {
    expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true)
})
test('基本測試-5', function () {
    expect(containsDuplicate([-1])).toBe(false)
})
```