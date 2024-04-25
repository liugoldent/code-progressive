---
tags:
  - LeetCode
  - Easy
  - Longest Common Prefix
  - javascript
  - Python
---

# [0014] Longest Common Prefix

## Javascript 解

思路：雖然不是最佳解，但看大部分解法都是

1. 先取出第一個元素
2. 跑一個 for loop 比較「每一個元素的第 i 個項目」是否等於「第一個元素的第 i 個項目」

```javascript
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
  if (strs.length === 0) return "";
  let comPre = "";
  for (let i = 0, len = strs[0].length; i < len; i++) {
    if (strs.every((item) => item[i] === strs[0][i])) {
      comPre = comPre + strs[0][i];
    } else {
      break;
    }
  }
  return comPre;
};
```

## Python 解

思路相同
但是需要注意的點

1. 在 python 中，是 return 大寫的 `True` or `False`
2. python 強制轉型使用 `str(xxx)`
3. 如果要得到字串長度則使用 `len(xxx)`
4. for 固定迴圈數目 `for i in range(len(newStr)):`

```python
class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if len(strs) == 0 :
            return ""
        compre = ""
        for i in range(len(strs[0])):
            # 由於第一個拿來當範本，所以從第二個開始搜尋就好
            for j in range(1, len(strs)):
                # 如果這個第一個元素的長度已經大於第二個元素 or 兩者字母不同，則return
                if i >= len(strs[j]) or strs[0][i] != strs[j][i]:
                    return compre
            # 當這個for 迴圈跑完，代表其所有字母相同，所以加上去
            compre = compre + strs[0][i]
        return compre

```
