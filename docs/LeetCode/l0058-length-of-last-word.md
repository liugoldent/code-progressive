---
tags: 
    - LeetCode
    - Easy
    - Length of Last Word
    - Javascript
    - Python
---
# [0058] Length of Last Word
## Javascript 解
題解：請解出最後一個單字的長度
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
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
