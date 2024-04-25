---
tags:
  - LeetCode
  - Medium
  - Input Array Is Sorted
  - javascript
  - two pointers
---

# [0167] Input Array Is Sorted

## Javascript 解

思路：
跟 two sum 很像
基本上也是給定目標值，你去取得相對應的位置
另外這題 keyword 可以用 two pointer 去解
雙指針，一個從頭出發，一個從尾出發
condition1：當總和比目標值大則 j--
condition2：當總和比目標值小則 i++

```javascript
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    }
    if (sum > target) {
      right--;
    } else {
      left++;
    }
  }
};

test("基本測試", () => {
  expect(twoSum([2, 7, 11, 15], 9)).toMatchObject([1, 2]);
});

test("基本測試", () => {
  expect(twoSum([-1, 0], -1)).toMatchObject([1, 2]);
});

test("基本測試", () => {
  expect(twoSum([2, 3, 4], 6)).toMatchObject([1, 3]);
});
```

## 好文連結

[【第十一天 - Two-pointer 題目分析】](https://ithelp.ithome.com.tw/articles/10262608)
