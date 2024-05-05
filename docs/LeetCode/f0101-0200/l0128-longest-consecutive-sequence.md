---
description: leetCode Longest Consecutive Sequence js 解答, python 解答
tags:
  - LeetCode
  - Medium
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
    Longest Consecutive Sequence,
    Longest Consecutive Sequence js ans,
    Longest Consecutive Sequence python ans,
  ]
---

# [0128] Longest Consecutive Sequence

## Javascript 解

[0128 youtube](https://www.youtube.com/watch?v=rc2QdQ7U78I&ab_channel=HuaHua)

1. 主要也是使用 hashSet 去解
2. 對 hashSet 做遍歷
3. 如果存在著比現在 item 還小的數字，則代表不是左邊界->繼續去找
4. 若找到後，給予現在 curNum & curMax 大小
5. 做 while 迴圈，如果一直有找到 curNum+1 的數值，則++
6. 最後更新 max 值

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
const longestConsecutive = function (nums) {
  if(nums.length === 0){
      return 0
  }
  let setNums = new Set(nums)
  let maxLength = 0
  for(let num of setNums){
      if(!setNums.has(num - 1)){
          let currentNum = num
          let currentLength  = 1
          while(setNums.has(currentNum  + 1)){
              currentNum++
              currentLength++
          }
          maxLength = Math.max(maxLength, currentLength)
      }
  }
  return maxLength
}
```

## Python解
```python
class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if len(nums) == 0 or not nums:
            return 0
        
        setNums = set(nums)
        maxLength = 0
        
        for num in setNums:
            if num-1 not in setNums:
                currentNum = num
                currentLength = 1
                
                while currentNum+1 in setNums:
                    currentNum += 1
                    currentLength += 1
                maxLength = max(currentLength, maxLength)
        
        return maxLength
```
