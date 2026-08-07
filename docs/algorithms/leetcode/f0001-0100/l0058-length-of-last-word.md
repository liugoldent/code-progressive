---
title: "[0058] Length of Last Word"
description: "[0058] Length of Last Word 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Length of Last Word
  - JavaScript
  - Python
keywords: ["0058", "Length", "of", "Last", "Word", "LeetCode", "Javascript"]
---




# [0058] Length of Last Word

> 題號：**0058** | 難度：**Easy** | 主題：**Length of Last Word**

## JavaScript 解法
題解：請解出最後一個單字的長度

```js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function (s) {
  // 直接先trim過前後的空格，再分成array
  let newS = s.trim().split(" ");
  return newS[newS.length - 1].length;
};
```

```python
def lengthOfLastWord(s):
    """
    :type s: str
    :rtype: int
    """
    s = s.strip().split(' ')
    return len(s[len(s) - 1])
```
