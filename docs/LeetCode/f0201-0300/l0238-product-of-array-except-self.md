---
tags: 
    - LeetCode
    - Easy
    - Product of Array Except Self
    - Javascript
    - Array And Hashing
---
# [0238] Product of Array Except Self
## Javascript 解

題意：找出除了自己以外的乘積
[參考文章](https://englishandcoding.pixnet.net/blog/post/34138027-leetcode-%E7%AD%86%E8%A8%98%EF%BC%8D238.-product-of-array-except-self)  
1. 這題可以經由特殊的由左往右做積累與由右往左做積累
2. 重複一遍即可得到解答  
3. 圖解：  
![step1](https://pic.pimg.tw/englishandcoding/1617012618-673295502-g_n.png)
![step2](https://pic.pimg.tw/englishandcoding/1617012835-27634056-g_n.png)
![step3](https://pic.pimg.tw/englishandcoding/1617012901-1785488147-g_n.png)
```javascript
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
      let result = new Array(nums.length).fill(1)
  let p 
  p = 1
  for (let i = 0, len = nums.length; i < len; i++) {
    result[i] = result[i] * p // 左到右的乘積（不包含頭尾）
    p = nums[i] * p // 累積的product
  }
  p = 1
  for (let j = nums.length - 1 ; j >= 0 ; j-- ) {
    result[j] = result[j] * p // 右到左的乘積
    p = nums[j] * p // 累積的product
  }
  return result
};
```