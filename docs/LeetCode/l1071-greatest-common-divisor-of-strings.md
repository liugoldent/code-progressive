---
tags: 
    - LeetCode
    - Easy
    - Greatest Common Divisor of Strings
    - Javascript
---

# [1071] Greatest Common Divisor of Strings
## Javascript 解
```js
/**
 * @param {string} str1
 * @param {string} str2
 * @return {string}
 */
var gcdOfStrings = function(str1, str2) {
    // 如果兩者相加不一樣，必定為空
    if(str1 + str2 !== str2 + str1) {
        return ''
    }
    // 再來取gcd，為最大公因數遞迴函數
    const gcd = (a,b) => (b === 0 ? a: gcd(b, a % b))
    const len = gcd(str1.length , str2.length)
    return str1.substring(0, len)
};
```
