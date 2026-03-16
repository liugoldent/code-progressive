---
date: 2025-06-18
title: "[0055] Jump Game"
description: "[0055] Jump Game 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags: [LeetCode, JavaScript, Greedy, Array, Jump Game, 面試題]
keywords: ["0055", "Jump", "Game", "LeetCode", "JavaScript", "Greedy", "Array", "面試題"]
---

# [0055] Jump Game

> **難度**：Medium  
> **題型**：陣列遍歷、貪婪可達性  
> **題目連結**：[LeetCode 55 – Jump Game](https://leetcode.com/problems/jump-game/)

---

## 📘 題目說明

給定整數陣列 `nums`，其中 `nums[i]` 表示  
> **從索引 `i` 最遠可以往右跳 `nums[i]` 步**。

請判斷是否 **能從索引 0 跳到最後一格**（`index = nums.length − 1`）。  
回傳 `true` / `false`。

---

### 🧪 範例

| Input | Output | 說明 |
|-------|--------|------|
| `[2,3,1,1,4]` | `true` | 0→1→4 |
| `[3,2,1,0,4]` | `false` | 跳不過 value=0 的坑 |

---

## 🧠 解題思路：1 趟 Greedy - 最遠覆蓋線

1. **`farthest` = 目前走過所有格子能覆蓋的最遠右端**。  
2. 由左而右掃描：  
   * 若 `i > farthest` → 掉坑，提早傳 `false`。  
   * 否則更新 `farthest = max(farthest, i + nums[i])`。  
3. 任何時點 `farthest ≥ lastIndex` 就可傳 `true`；掃描完沒掉坑也回 `true`。

> **為何正確？**  
> `farthest` 始終是 **目前所有可行跳法覆蓋的最右端**；  
> 若下一格超出覆蓋線，代表沒有跳法能到那格 ⇒ 遊戲失敗。

---

## Javascript 解

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;              // 掉坑
    farthest = Math.max(farthest, i + nums[i]);  // 延伸覆蓋線
    if (farthest >= nums.length - 1) return true; // 提前成功
  }
  return true;
};

```