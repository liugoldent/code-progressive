---
tags: 
    - LeetCode
    - East
    - Valid Palindrome
    - Javascript
    - two Pointers
---
# [0125] Valid Palindrome

## Javascript 解
思路
1. 首先要針對字串做全部改小寫與去掉所有特殊符號
2. 再來定義雙指針
3. 從頭與從尾端開始找尋
4. 如果都一樣就(左右指針往前進)並一直continue下去
5. 注意終止條件是 i < j（就是指針遍歷結束的概念）

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
  let alphanumericString = s.replace(/[^0-9A-Za-z]/g, '').toLocaleLowerCase();
  if (alphanumericString.length === 0) {
    return true
  }
  let i = 0
  let j = alphanumericString.length - 1
  while (i < j) {
    if (alphanumericString[i] === alphanumericString[j]) {
      i++
      j--
    } else {
      return false
    }
  }
  return true
};


test("基本測試", () => {
  expect(isPalindrome('A man, a plan, a canal: Panama')).toBeTruthy();
});

test("基本測試", function () {
  expect(isPalindrome('aa')).toBeTruthy()
});

test("基本測試", function () {
  expect(isPalindrome('0P')).toBeFalsy()
});

test("基本測試", function () {
  expect(isPalindrome('aaa')).toBeTruthy()
});
```
