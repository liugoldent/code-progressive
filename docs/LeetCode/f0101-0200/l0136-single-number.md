---
description: leetCode Single Number js 解答, python 解答
tags:
  - LeetCode
  - Medium
  - javascript
  - python
  - interview
  - Hashing
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

# [0136] Single Number

## Javascript 解

1. 這題可以直接用XOR的邏輯去解
2. XOR：不同為1。相同為0

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    return nums.reduce((accu, cur) => accu ^ cur, 0)
};
```