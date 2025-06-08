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
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // 用來記錄每個字元上次出現的位置
    let sMap = new Map()

    // 左邊界初始在 index 0
    let left = 0

    // 最大長度結果
    let maxLen = 0

    // 右邊界 i 從頭走到尾
    for (let i = 0; i < s.length; i++) {
        const charS = s[i]

        // 如果這個字元之前出現過，且位置在目前視窗內
        if (sMap.has(charS)) {
            const prev = sMap.get(charS)
            // 把左邊界推到「重複字元的下一個位置」與目前 left 中較大的那一個
            // 避免倒退回去（保證 left 單調不減）
            left = Math.max(left, prev + 1)
        }

        // 更新該字元在 map 中最後出現的位置為目前的 i
        sMap.set(charS, i)

        // 計算目前視窗長度（i - left + 1）
        maxLen = Math.max(maxLen, i - left + 1)
    }

    return maxLen
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
