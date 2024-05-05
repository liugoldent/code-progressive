---
description: leetCode Valid Anagram js 解答, python 解答
tags:
  - LeetCode
  - Easy
  - javascript
  - python
  - interview
  - Array And Hashing
keywords:
  [
    facebook,
    amazon,
    apple,
    netflix,
    google,
    faang interview,
    leetCode,
    js,
    javascript,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
    software engineer,
    Valid Anagram,
    Valid Anagram js ans,
    Valid Anagram python ans,
  ]
---

# [0242] Valid Anagram

## Javascript 解

思路：
題意：問題是說，兩個字串是否是重組字

1. 所以就會代表說，兩個字串長度不同，一定不是重組
2. 如果相同

- 先將兩個字串都跑 for 迴圈
- 組成 HashSet 對，如：`{a:3,b:2}`，表示 a 字母有三個，b 字母有兩個
- 最後跑 HashSet 對，看兩邊字母出現次數是否相同

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) {
    return false;
  }
  let sObj = {};
  let tObj = {};

  for (let i = 0, len = s.length; i < len; i++) {
    sObj[s[i]] = (sObj[s[i]] ? sObj[s[i]] : 0) + 1;
    tObj[t[i]] = (tObj[t[i]] ? tObj[t[i]] : 0) + 1;
  }
  for (item in sObj) {
    if (sObj[item] !== tObj[item]) {
      return false;
    }
  }
  return true;
};
module.exports = isAnagram;
```

## Python 解

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        return sorted(s) == sorted(t)


class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        s_obj = {}
        t_obj = {}

        for i in range(len(s)):
            s_obj[s[i]] = s_obj.get(s[i], 0) + 1
            t_obj[t[i]] = t_obj.get(t[i], 0) + 1

        for key in s_obj:
            if s_obj[key] != t_obj.get(key, 0):
                return False
        return True
```

```javascript
// test code
const isAnagram = require("./leetcode.js");

test("基本測試-1", function () {
  expect(isAnagram("anagram", "nagaram")).toBe(true);
});

test("基本測試-2", function () {
  expect(isAnagram("cat", "rat")).toBe(false);
});

test("基本測試-3", function () {
  expect(isAnagram("catr", "rat")).toBe(false);
});

test("基本測試-4", function () {
  expect(isAnagram("a", "c")).toBe(false);
});

test("基本測試-5", function () {
  expect(isAnagram("acc", "cca")).toBe(true);
});
```
