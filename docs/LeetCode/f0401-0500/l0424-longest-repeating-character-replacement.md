---
title: "[0424] Longest Repeating Character Replacement"
description: "[0424] Longest Repeating Character Replacement 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Sliding Window
  - javascript
  - Longest Repeating Character Replacement
keywords: ["0424", "Longest", "Repeating", "Character", "Replacement", "LeetCode", "Javascript"]
---

# [0424] Longest Repeating Character Replacement

## Javascript 解

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function (s, k) {
  const count = new Array(26).fill(0);
  let maxLength = 0;
  let maxCount = 0;
  let start = 0;
  for (let end = 0; end < s.length; end++) {
    const charCode = s.charCodeAt(end) - "A".charCodeAt(0);
    count[charCode]++;
    maxCount = Math.max(maxCount, count[charCode]);

    if (end - start + 1 - maxCount > k) {
      let leftCharCode = s.charCodeAt(start) - "A".charCodeAt(0);
      count[leftCharCode]--;
      start++;
    }
    maxLength = Math.max(maxLength, end - start + 1);
  }
  return maxLength;
};
```
