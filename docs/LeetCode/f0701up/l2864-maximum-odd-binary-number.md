---
tags: 
    - LeetCode
    - Easy
    - Maximum Odd Binary Number
    - String
    - Javascript
---
# [2864] Maximum Odd Binary Number
## Javascript 解
```js
/**
 * @param {string} s
 * @return {string}
 */
var maximumOddBinaryNumber = function(s) {
    let count = 0
    for(e of s){
        if(e === '1'){
            count++
        }
    }
    // 因為最後要補1，所以count - 1
    // 中間都補0
    // 最後再補1
    return '1'.repeat(count - 1)+'0'.repeat(s.length - count) + '1'
};
```


