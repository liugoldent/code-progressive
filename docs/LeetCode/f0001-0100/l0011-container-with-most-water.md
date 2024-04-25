---
tags:
  - LeetCode
  - Medium
  - Container With Most Water
  - javascript
  - two pointers
---

# [0011] Container With Most Water

## Javascript 解

- 思路：同樣使用雙指針去找尋最大的面積

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  // 初始設定數值
  let maxA = 0;
  let left = 0;
  let right = height.length - 1;
  // 雙指針開始尋找
  while (left < right) {
    // 用Math.max去找尋最大的面積
    // 記得後面算面積要用較低的高度去計算
    maxA = Math.max(
      maxA,
      [right - left] * Math.min(height[left], height[right])
    );
    // 然後在這邊，如果左邊大於右邊，就代表左邊已經是最大，最大就定住，讓右邊--
    if (height[left] > height[right]) {
      right--;
    } else {
      left++;
    }
  }
  return maxA;
};

test("基本測試", () => {
  expect(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])).toEqual(49);
});

test("基本測試", () => {
  expect(maxArea([1, 1])).toEqual(1);
});
```
