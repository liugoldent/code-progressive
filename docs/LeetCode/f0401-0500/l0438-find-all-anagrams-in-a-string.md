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
    const res = []
    const n = s.length
    const m = p.length
    if(n < m) return res

    // 1. 準備 need 與 window 兩個長度 26 的陣列
    const need = new Array(26).fill(0)
    const window = new Array(26).fill(0)

    // 2. 將 p 中的頻率寫入 need
    for(let i = 0; i < m; i++){
        need[p.charCodeAt(i) - 97]++
    }

    let left = 0, right = 0
    let matches = 0 // 代表 window 中有多少字母已經符合 need

    for(let i = 0; i < 26; i++){
        if(need[i] === 0){
            matches++
        }
    }

    // 3. 開始滑動窗口
    while(right < n){
        const idxR = s.charCodeAt(right) - 97
        window[idxR]++

        // 如果目前 window[idxR] 剛好等於 need[idxR]，代表這個字母達成對應頻率
        if(window[idxR] === need[idxR]){
            matches++
        // 如果 window[idxR] 剛好比 need[idxR] 多 1，代表之前是符合但現在超過了，要扣回 matches
        }else if(window[idxR] === need[idxR] + 1){
            matches--
        }
        right++

        // 只要窗口長度已經 ≥ m，就嘗試收縮左邊
        while(right - left >= m){
            if(matches === 26){
                res.push(left)
            }
            const idxL = s.charCodeAt(left) - 97
            // 收縮前：如果窗内這字母正好等於 need，收縮後就不滿足，需要 matches--
            if (window[idxL] === need[idxL]) {
                matches--
            }
            // 如果窗口中這字母原本比 need 多 1，扣掉後剛好相等，需要 matches++
            else if (window[idxL] === need[idxL] + 1) {
                matches++
            }

            window[idxL]--
            left++
        }
    }

    return res
};
```
