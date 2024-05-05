---
description: leetCode Contains Duplicate js 解答, python 解答
tags:
  - LeetCode
  - easy
  - javascript
  - python
  - interview
  - Array
  - And
  - Hashing
keywords:
  - facebook
  - amazon
  - apple
  - netflix
  - google
  - faang interview
  - leetCode
  - js
  - javascript
  - interview
  - js 面試
  - js interview
  - 前端面試題
  - frontend interview
  - フロントエンドの面接質問
  - 프론트엔드 면접 문제
  - software engineer
  - Contains Duplicate
  - Contains Duplicate js ans
  - Contains Duplicate python ans
---

# [0217] Contains Duplicate

## Javascript 解

首先我們可以用暴力解，做兩次 for 循環，其 BigO = O(nlogn)
但是可以藉由放入 hashSet 的方式去解出這題

- 步驟

1. 先設定一個 set
   for 迴圈內：
1. 如果這個 hashSet 有找到重複值了，就 return true
1. 如果這個 hashSet 沒有值，就將這個值 add 進入 hashSet
1. 如果跑完都沒有 return true
1. 最後 return false

```javascript
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function (nums) {
  if (nums.length === 0 || nums.length === 1) {
    return false;
  }
  let hashSet = new Set();
  for (let i = 0, len = nums.length; i < len; i++) {
    if (hashSet.has(nums[i])) {
      return true;
    } else {
      hashSet.add(nums[i]);
    }
  }
  return false;
};
module.exports = containsDuplicate;
```

## Python 解

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        visit=set()
        for n in nums:
            if n in visit:
                return True
            visit.add(n)
        return False
```

## 測試程式

```javascript
// test case
const containsDuplicate = require("./leetcode.js");

test("基本測試-1", function () {
  expect(containsDuplicate([1, 2, 3, 1])).toBe(true);
});
test("基本測試-2", function () {
  expect(containsDuplicate([1, 2, 3, 4])).toBe(false);
});
test("基本測試-3", function () {
  expect(containsDuplicate([])).toBe(false);
});
test("基本測試-4", function () {
  expect(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])).toBe(true);
});
test("基本測試-5", function () {
  expect(containsDuplicate([-1])).toBe(false);
});
```

## 相關連結
[[l0002-two-sum]]