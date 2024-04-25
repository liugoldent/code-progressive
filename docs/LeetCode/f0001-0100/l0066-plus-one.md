---
tags:
  - LeetCode
  - Easy
  - Plus One
  - javascript
---

# [0066] Plus One

## Javascript 解

要注意到此題你如果用 js 的強制轉型，會導致溢位
所以正解要從最後一個 index 去做迴圈
然後判斷是否為 9
若為 9 則進位為 0
並且
若有下一位子，則繼續進位
若無則跳出迴圈 return 解構

```javascript
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function (digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    let lastDigit = digits[i];
    if (lastDigit < 9) {
      digits[i] += 1;
      return digits;
    }
    digits[i] = 0;
  }
  return [1, ...digits];
};
```

## Python 解

在這邊有比較特別的「reversed」語法
是我在 js 中比較沒有用到的
如果不想寫 reversed 也可以用 range 的方式寫起來

```python
def plusOne(digits):
    """
    :type digits: List[int]
    :rtype: List[int]
    """
    # range(len(digits) -1 , -1, -1)
    for i in reversed(range(len(digits))):
        lastDigits = digits[i]
        if lastDigits + 1 <= 9:
            digits[i] = digits[i] + 1
            return digits
        else:
            digits[i] = 0
    digits.insert(0, 1)
    return digits
```
