---
tags:
  - LeetCode
  - Medium
  - Sliding Window
  - javascript
  - Find All Anagrams in a String
---

# [0438] Find All Anagrams in a String

## Javascript 解

```js
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    const sLen = s.length
    const pLen = p.length
    const res = []
    if(sLen < pLen) return res

    const need = new Array(26).fill(0)
    for(let i = 0; i < pLen; i++){
        need[p.charCodeAt(i) - 97]++
    }

    const window = new Array(26).fill(0)
    let left = 0, right = 0

    while(right < sLen){
        const idxR = s.charCodeAt(right) - 97
        window[idxR]++
        right++

        if(right - left === pLen){
            let match = true
            for(let i = 0; i < 26; i++){
                if(window[i] !== need[i]){
                    match = false
                    break
                }
            }

            if(match){
                res.push(left)
            }

            const idxL = s.charCodeAt(left) - 97
            window[idxL]--
            left++
        }
    }
    return res
};
```
