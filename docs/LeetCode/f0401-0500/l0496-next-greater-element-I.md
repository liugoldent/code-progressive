---
tags:
  - LeetCode
  - Easy
  - Stack
  - javascript
  - Next Greater Element I
---

# [0496] Next Greater Element I

## Javascript 解

```js
var nextGreaterElement = function (nums1, nums2) {
  const stack = [];
  const map = new Map();
  // 首先要先製造出一個比此數字大的map
  for (const num of nums2) {
    // 第二步條件為，如果stack.length 大於0，再去while迴圈找到num > stack最後的數值
    while (stack.length && stack[stack.length - 1] < num) {
      // 如果找到就設定key值為stack.pop()，value為num
      map.set(stack.pop(), num);
    }
    // 第一步先去push數值
    stack.push(num);
  }

  const result = [];
  // 最後再遍歷num1，與一個result即可解答
  for (const num of nums1) {
    result.push(map.get(num) || -1);
  }

  return result;
};

// 示例用法
const nums1 = [4, 1, 2];
const nums2 = [1, 3, 4, 2];
console.log(nextGreaterElement(nums1, nums2)); // 输出：[-1, 3, -1]
```
