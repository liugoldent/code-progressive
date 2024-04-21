---
tags: 
    - LeetCode
    - Easy
    - Valid Anagram
    - Javascript
    - Python
    - Array And Hashing
---
# [0243] Valid Anagram
## Javascript 解
思路：
題意：問題是說，兩個字串是否是重組字
1. 所以就會代表說，兩個字串長度不同，一定不是重組
2. 如果相同
  - 先將兩個字串都跑for迴圈
  - 組成HashSet對，如：`{a:3,b:2}`，表示a字母有三個，b字母有兩個
  - 最後跑HashSet對，看兩邊字母出現次數是否相同
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
    if(sObj[item] !== tObj[item]){
      return false
    }
  }
  return true
};
// console.log(isAnagram("anagram", "nagaram"))
module.exports = isAnagram


```

```javascript
// test code
const isAnagram = require('./leetcode.js')


test('基本測試-1', function () {
    expect(isAnagram('anagram', 'nagaram')).toBe(true)
})

test('基本測試-2', function () {
  expect(isAnagram('cat', 'rat')).toBe(false)
})

test('基本測試-3', function () {
  expect(isAnagram('catr', 'rat')).toBe(false)
})

test('基本測試-4', function () {
  expect(isAnagram('a', 'c')).toBe(false)
})

test('基本測試-5', function () {
  expect(isAnagram('acc', 'cca')).toBe(true)
})
```
