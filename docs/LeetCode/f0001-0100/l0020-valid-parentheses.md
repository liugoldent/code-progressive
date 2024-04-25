---
tags:
  - LeetCode
  - Easy
  - Valid Parentheses
  - javascript
  - Python
---

# [0020] Valid Parentheses

## Javascript 解 - 1

思路：

1. 先將反向括號設定成一個物件
2. 然後對 string 跑迴圈
3. 如果遇到正向括號就 push 進去
4. 如果遇到反向括號就 pop 出來（因為 pop 丟出來的是最後一個元素），然後看是否相等
5. 若不相等則 false
6. 最後迴圈跑完，若長度為 0，則代表全部相等

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  const strObj = {
    ")": 1,
    "]": 2,
    "}": 3,
  };
  const arr = [];
  for (let i = 0, len = s.length; i < len; i++) {
    if (s[i] === "(") {
      arr.push(1);
    } else if (s[i] === "[") {
      arr.push(2);
    } else if (s[i] === "{") {
      arr.push(3);
    } else {
      if (arr.pop() !== strObj[s[i]]) {
        return false;
      }
    }
  }
  return arr.length === 0;
};
```

## Javascript 解 -2

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  if (s.length % 2 !== 0) {
    return false;
  }
  const parentObj = {
    "(": ")",
    "{": "}",
    "[": "]",
  };
  let arr = [];
  for (let i = 0, len = s.length; i < len; i++) {
    if (s[i] === "[" || s[i] === "{" || s[i] === "(") {
      arr.push(s[i]);
    } else {
      if (arr.length === 0) {
        return false;
      }
      let top = arr.pop();
      if (parentObj[top] !== s[i]) {
        return false;
      }
    }
  }
  return arr.length === 0;
};
```

## Python 解

```python
class Solution:
    def isValid(self, s: str) -> bool:
        if (len(s) == 1): return False
        sObj = {
            ")": 1,
            "]": 2,
            "}": 3
        }
        ansArr = []
        for i in range(len(s)):
            if(s[i] == '('):
                ansArr.append(1)
            elif (s[i] == '['):
                ansArr.append(2)
            elif (s[i] == '{'):
                ansArr.append(3)
            else:
                # 注意這邊不可以讓陣列長度為0 所以要寫一個判斷式 判斷陣列長度若為0則跳錯
                if(len(ansArr) == 0 or ansArr.pop() != sObj[s[i]]):
                    return False

        return len(ansArr) == 0
```
