---
description: Product of Array Except Self js 解,Product of Array Except Self python 解
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
    Product of Array Except Self,
    Product of Array Except Self js ans,
    Product of Array Except Self python ans,
  ]
---

# [0238] Product of Array Except Self

## Javascript 解

#### 演算法：「左右乘積」或「前綴和後綴」的演算法
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
var productExceptSelf = function (nums) {
  let result = new Array(nums.length).fill(1);
  let p;
  p = 1;
  for (let i = 0, len = nums.length; i < len; i++) {
    result[i] = result[i] * p; // 左到右的乘積（不包含頭尾）
    p = nums[i] * p; // 累積的product
  }
  p = 1;
  for (let j = nums.length - 1; j >= 0; j--) {
    result[j] = result[j] * p; // 右到左的乘積
    p = nums[j] * p; // 累積的product
  }
  return result;
};
```

## Python 解

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        result = [1] * n

        left_product = 1
        for i in range(n):
            result[i] = result[i] * left_product
            left_product = nums[i] * left_product

        right_product = 1
        for i in range(n-1, -1, -1):
            result[i] = result[i] * right_product
            right_product = nums[i] * right_product

        return result
```
