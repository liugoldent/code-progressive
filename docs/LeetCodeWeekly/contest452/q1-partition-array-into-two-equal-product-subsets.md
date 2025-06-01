---
title: "Check Equal Partitions in JavaScript"
description: "JavaScript function to verify whether each element in an array divides a target and if the overall product equals the square of that target."
tags:
  - javascript
  - algorithm
  - partition
  - leetcode
---

## 思路
* 既然是會分成兩組，而兩組相乘都等於target，那麼就看乘起來是不是target的平方就好

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {boolean}
 */
var checkEqualPartitions = function(nums, target) {
    for(const num of nums){
        const res = target % num
        if(res !== 0) return false
    }
    let product = 1
    
    for(const num of nums){
        product = product * num
    }
    
    return product === (target * target)
};
```