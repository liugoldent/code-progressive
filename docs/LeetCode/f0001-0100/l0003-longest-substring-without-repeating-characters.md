---
description: leetCode two sum js 解答 python 解答
tags:
  - LeetCode
  - Medium
  - Longest Substring Without Repeating Characters
  - javascript
  - Two Pointer
---

# [0003] Longest Substring Without Repeating Characters

## Javascript 解

### 思路：

- 首先設定左指針、new Map、maxLen
- 再來 for loop
- 判斷是否有出現過 -> 有出現過則 left 要位移
- 位移後去算 i(看成右指針) - left(看成左指針) + 1(是長度)
- 最後 map set 值，以跑完 for loop
  [Ans Video](https://www.youtube.com/watch?v=fBiiKy8kwaY&t=205&ab_channel=%E8%B4%BE%E8%80%83%E5%8D%9A)

```js
var lengthOfLongestSubstring = function(s) {
  let sMap = new Map();  // 记录每个字符上一次出现的索引
  let left = 0;          // 滑动窗口左边界
  let maxLen = 0;        // 记录最大窗口长度

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    // 如果之前出现过这个字符，就尝试把 left 移到 "上一次出现位置 + 1"
    if (sMap.has(charS)) {
      // prev = 上次出现的索引
      const prev = sMap.get(charS);
      // left 不能后退，所以要取 max
      left = Math.max(left, prev + 1);
    }

    // 更新当前字符最新出现的位置为 i
    sMap.set(charS, i);

    // 计算当前窗口长度 = i - left + 1，更新 maxLen
    maxLen = Math.max(maxLen, i - left + 1);
  }

  return maxLen;
};


test("基本測試", () => {
  expect(lengthOfLongestSubstring("abcabcbb")).toEqual(3);
});

test("基本測試", () => {
  expect(lengthOfLongestSubstring("bbbbb")).toEqual(1);
});

test("基本測試", () => {
  expect(lengthOfLongestSubstring("pwwkew")).toEqual(3);
});
```
