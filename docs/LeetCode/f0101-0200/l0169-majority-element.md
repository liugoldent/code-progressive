---
tags:
  - LeetCode
  - Easy
  - Majority Element
  - javascript
---

# [0169] Majority Element

## Javascript 解

- 此題以一般迴圈很好解，但有另一個「摩爾投票法」可以應用於此
- [圖解算法](https://cloud.tencent.com/developer/article/1600607)

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
  let count = 0;
  let candidate = null; // 記得一開始候選人為null

  for (let num of nums) {
    if (count === 0) {
      candidate = num; // 如果是0時，這就是新的候選人
    }
    if (num === candidate) {
      count = count + 1; // 同時要count+1
    } else {
      count = count - 1;
    }
  }

  return candidate;
};
```
