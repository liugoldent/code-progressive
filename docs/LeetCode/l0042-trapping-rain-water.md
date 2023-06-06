---
tags:
  - LeetCode
  - Hard
  - Trapping Rain Water
  - Javascript
  - Two Pointers
---

# [0042] Trapping Rain Water
* 思路：
1. 基本：先設定left、right、leftMax、rightMax、totalWater
2. 流程：
  * 先雙指針while
  * 然後要確認if(height[left]< height[right])
  * 取得leftMax -> 使用Math.max取得leftMax與height[left]最大的
  * 然後取得totalWater，做累加（leftMax-height[left]）
  * 最後left++
  
```js
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let left = 0
    let right = height.length -1
    let leftMax = 0
    let rightMax = 0
    let totalWater = 0
    while(left < right){
      if(height[left] < height[right]){
        // 找出左邊最大值
        leftMax = Math.max(leftMax, height[left])
        // 左邊最大值，減掉當前元素，則為「空間值」->空間值再加上totalWater則為所有的水
        totalWater += leftMax - height[left]
        left++
      }else{
        rightMax = Math.max(rightMax, height[right])
        totalWater += rightMax - height[right]
        right--
      }
    }
    return totalWater
};
```
