---
description: leetCode two sum js 解答 python 解答
tags: 
    - LeetCode
    - Medium
    - Longest Substring Without Repeating Characters
    - Javascript
    - Two Pointer
---
# [0003] Longest Substring Without Repeating Characters
## Javascript 解
### 思路：
* 首先設定左指針、new Map、maxLen
* 再來for loop
* 判斷是否有出現過 -> 有出現過則left要位移
* 位移後去算i(看成右指針) - left(看成左指針) + 1(是長度)
* 最後map set值，以跑完for loop
[Ans Video](https://www.youtube.com/watch?v=fBiiKy8kwaY&t=205&ab_channel=%E8%B4%BE%E8%80%83%E5%8D%9A)
```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    if(s.length === 0){
      return 0
    }
    let sMap = new Map()
    let maxLen = 1
    let left = 0
    for(let i = 0, len = s.length ; i < len ; i++){
      let charS = s[i]
      // 如果sMap有值，則將left = Math.max(left, 取得charS的右邊一個位元)
      if(sMap.has(charS)){
        left = Math.max(left, sMap.get(charS)+ 1)
      }
      // i - left + 1 -> 代表最長的長度（i算是右指針，left算是左指針）
      if(i - left + 1 > maxLen){
        maxLen = i - left + 1
      }
      // 如果沒有則最後set進去Map中
      sMap.set(charS, i)
    }
    return maxLen
};


test("基本測試", () => {
  expect(lengthOfLongestSubstring('abcabcbb')).toEqual(3);
});

test("基本測試", () => {
  expect(lengthOfLongestSubstring('bbbbb')).toEqual(1);
});

test("基本測試", () => {
  expect(lengthOfLongestSubstring('pwwkew')).toEqual(3);
});
```
