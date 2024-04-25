---
tags:
  - LeetCode
  - Easy
  - Remove Duplicates from Sorted Array
  - javascript
---

# [0026] Remove Duplicates from Sorted Array

## Javascript 解

思路：

1. 因為不能再多使用一個空間來得出答案，所以只能對原陣列動手腳
2. 使用雙指針方法來解決

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function (nums) {
  if (nums == null || nums.length == 0) return 0;
  if (nums.length === 1) return 1;
  let pointer = 0;
  for (let i = 1, len = nums.length; i < len; i++) {
    if (nums[pointer] != nums[i]) {
      pointer++;
      nums[pointer] = nums[i];
    }
  }
  return pointer + 1;
};
```

[LeetCode 雙刀流： 26. Remove Duplicates from Sorted Array](https://ithelp.ithome.com.tw/articles/10270237)
[【第十天 - Two-pointer 介紹】](https://ithelp.ithome.com.tw/articles/10262277)
