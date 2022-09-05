---
tags: 
    - LeetCode
    - Easy
    - Implement strStr()
    - Javascript
---
# [0028] Implement strStr()
## Javascript 解
解釋：主要是說要找出needle位在haystack內的哪個地方（起始位置）
而我們可以直接使用indexOf去找出first index
```javascript
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
      return haystack.indexOf(needle)
};
```
