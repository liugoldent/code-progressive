---
title: "[0013] Roman to Integer"
description: "[0013] Roman to Integer 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Roman to Integer
  - javascript
  - Python
keywords: ["0013", "Roman", "to", "Integer", "LeetCode", "Javascript", "Python"]
---

# [0013] Roman to Integer

> 題號：**0013** | 難度：**Easy** | 主題：**Roman to Integer**

## JavaScript 解法
思路：製作出一個 for loop

1. 若左邊的數字 >= 右邊的數字則將**加上**此 index 數字
2. 若左邊的數字 < 右邊的數字則將**減掉**此 index 數字
3. 若跑到最後一個英文字母，則無條件加上最後一個 index 數字

```js
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function (s) {
  const symbolObj = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0, len = s.length; i < len; i++) {
    // 若左邊的數字 >= 右邊的數字則將**加上**此index數字
    if (symbolObj[s[i]] >= symbolObj[s[i + 1]] || i === len - 1) {
      total = symbolObj[s[i]] + total;
    } else {
      // 若左邊的數字 < 右邊的數字則將**減掉**此index數字
      total = total - symbolObj[s[i]];
    }
  }
  return total;
};
```

## Python 解法
```python
class Solution:
    def romanToInt(self, s: str) -> int:
        symbolObj = {
            "I": 1,
            "V": 5,
            "X": 10,
            "L": 50,
            "C": 100,
            "D": 500,
            "M": 1000
            }
        total = 0
        # 注意這邊是使用range(len(s))
        for i in range(len(s)):
            # 這邊是 i == len(s)-1
            if (i == len(s)-1 or symbolObj[s[i]] >= symbolObj[s[i + 1]]):
                total = symbolObj[s[i]] + total
            else:
                total = total - symbolObj[s[i]]
        return total

```
