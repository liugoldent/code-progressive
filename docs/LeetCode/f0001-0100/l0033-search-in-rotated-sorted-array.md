---
description: "LeetCode 33：Search in Rotated Sorted Array 題解與 JavaScript 解法。學會如何在旋轉過的排序陣列中應用二分搜尋（Binary Search），包含完整程式碼與錯誤陷阱解析。"
date: 2025-06-18
tags: [LeetCode, Binary Search, Rotated Array, JavaScript, 搜尋演算法, Blind75]
---

# [0033] Search in Rotated Sorted Array

> 題目難度：**Medium**  
> 題型：**二分搜尋變形（Binary Search in Rotated Array）**  
> 題目連結：[LeetCode 33 - Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

---

## 📘 題目描述

給定一個整數陣列 `nums`，該陣列為升序排序後被旋轉過一次（可能是部分陣列被移動到最前面），再給一個整數 `target`。請在陣列中搜尋 `target`，若存在，返回其索引，否則返回 `-1`。

- 時間複雜度要求：`O(log n)`。

---

## 🧠 解題思路：二分搜尋法 + 區段判斷

雖然整體陣列已被旋轉，但每次切一半時，仍能保證「**一半一定是有序的**」。

### 判斷邏輯：

- 如果 `nums[left] <= nums[mid]`，表示 **左半段有序**
- 否則，右半段有序

接著依照 `target` 是否在有序區間內，決定往左或往右搜尋。

---

## ⚠ 常見陷阱

> 🔥 `while (left < right)` ❌ 錯誤！  
> ✅ 應使用 `while (left <= right)`，否則會漏檢最後一個元素。

---

## 💻 JavaScript 解法

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) return mid;

        // 左半段是有序的
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 右半段是有序的
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
};
