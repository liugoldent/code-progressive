---
tags:
  - LeetCode
  - Medium
  - Maximum Subarray
  - javascript
---

# [0053] Maximum Subarray

```js
function maxSubArray(nums) {
    let maxSum = nums[0]
    let currentSum = nums[0]

    for (let i = 1; i < nums.length; i++) {
        // 如果 currentSum 是負的，就從頭開始計算
        currentSum = Math.max(nums[i], currentSum + nums[i])
        maxSum = Math.max(maxSum, currentSum)
    }

    return maxSum
}

```