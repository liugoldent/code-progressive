---
tags:
  - LeetCode
  - Easy
  - Implement strStr()
  - javascript
---

# [0028] Implement strStr()

## Javascript 解

解釋：主要是說要找出 needle 位在 haystack 內的哪個地方（起始位置）
而我們可以直接使用 indexOf 去找出 first index

```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function (haystack, needle) {
  return haystack.indexOf(needle);
};
```
