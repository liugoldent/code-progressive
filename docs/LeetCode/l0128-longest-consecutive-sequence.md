---
tags: 
    - LeetCode
    - Medium
    - Longest Consecutive Sequence
    - Javascript
    - hashSet
---
# [0128] Longest Consecutive Sequence

## Javascript 解

[0128 youtube](https://www.youtube.com/watch?v=rc2QdQ7U78I&ab_channel=HuaHua)  
1. 主要也是使用hashSet去解
2. 對hashSet做遍歷
3. 如果存在著比現在item還小的數字，則代表不是左邊界->繼續去找
4. 若找到後，給予現在curNum & curMax大小
5. 做while迴圈，如果一直有找到curNum+1的數值，則++
6. 最後更新max值

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    if(nums.length === 0) return 0
    let hashSet = new Set(nums)
    let max = 0
    for (const item of hashSet) {
      // 若存在著比現在item小1的數字，則代表他還不是左邊界，則continue
      if(hashSet.has(item -1)){
        continue
      }
      // 找到也許是左邊界的值，重新設定條件
      let currNum = item
      let currMax = 1
      while(hashSet.has(currNum+1)){
        currNum++
        currMax++
      }
      // update max
      max = Math.max(max, currMax)
    }
    return max
};
```
