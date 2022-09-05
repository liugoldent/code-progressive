---
tags: 
    - LeetCode
    - Easy
    - Palindrome Number
    - Javascript
    - Python
---
# [0009] Palindrome Number
## Javascript 解
思路：雖然不是最佳解，但看大部分解法都是
1. 先轉型為String
2. 將頭尾做比較
3. 得出結果
```javascript
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if(x < 0) return false
    x = String(x)
    let finalIndex = x.length - 1
    for(let i = 0 , len = x.length ; i < len ; i++){
        if(x[i] === x[finalIndex]){
            finalIndex--
            continue
        }else{
            return false
        }
    }
    return true
};
```

## Python 解
思路相同
但是需要注意的點
1. 在python中，是return 大寫的 `True` or `False`
2. python 強制轉型使用 `str(xxx)`
3. 如果要得到字串長度則使用 `len(xxx)`
4. for固定迴圈數目 `for i in range(len(newStr)):`
```python
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if(x < 0):
            return False
        newStr = str(x)
        finalIndex = len(newStr) - 1
        for i in range(len(newStr)):
            if(newStr[i] == newStr[finalIndex]):
                finalIndex = finalIndex - 1
                continue
            else:
                return False
        return True
```
