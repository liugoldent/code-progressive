---
tags: 
    - LeetCode
    - Medium
    - Longest Repeating Character Replacement
    - Javascript
---

# [0424] Longest Repeating Character Replacement
## Javascript 解

```js
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {
  const count = new Array(26).fill(0)
  let maxLength = 0
  let maxCount = 0
  let start = 0
  // 一個 for loop 跑完 s.length
  for(let end = 0; end < s.length ; end++){
    // 先取得charCode = (ex:67-65 = 第二個位置)
    const charCode = s.charCodeAt(end) - 'A'.charCodeAt(0)
    // 因為count是位置分佈，所以其位置++(該字母出現的次數++)
    count[charCode]++
    // 更新最頻繁出現的字母的次數
    maxCount = Math.max(maxCount, count[charCode])

    // 看左邊是否要縮小窗口
    // 如果右邊-左邊的長度，減掉最大的count，又大於k（代表超過所能替換總數）
    // 此時left(start)向左
    // 並且要扣掉一次左邊出現的字母次數
    if(end - start + 1 - maxCount > k){
      let leftCharCode = s.charCodeAt(start) - 'A'.charCodeAt(0)
      count[leftCharCode]--
      start++
    }
    maxLength = Math.max(maxLength, end-start+1)
  }
  return maxLength
};
```
