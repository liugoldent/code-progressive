---
date: 2025-06-18
title: "[0039] Combination Sum"
description: "[0039] Combination Sum 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags: [LeetCode, JavaScript, Backtracking, Recursion, 組合問題, Blind75]
keywords: ["0039", "Combination", "Sum", "LeetCode", "JavaScript", "Backtracking", "Recursion", "組合問題"]
---

# [0039] Combination Sum

> 題目難度：**Medium**  
> 題型分類：`回溯法（Backtracking）`、`組合問題`  
> 題目連結：[LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

---

## 📘 題目說明

給定一個**無重複的整數陣列** `candidates` 和一個整數 `target`，請找出所有組合，使這些數的總和等於 `target`。

- 每個數字可以被「無限次使用」
- 組合中的數字可以按任意順序出現

---

## 🧠 解題思路：回溯法（Backtracking）

這是一道標準的「組合總和」問題，我們用回溯法（DFS）來探索所有可能的組合：

### 核心策略：
- 對每個數字有「選或不選」的分支
- 因為可以重複使用元素 → 遞迴時 **仍從當前 index 開始**（`i` 而不是 `i + 1`）
- 若總和超過 `target` 就立即剪枝 return

---

## ❗ 常見錯誤解析

錯誤寫法：

```js
backtrack(target - num, path, i) // ❌ 錯：每次都從原始 target 減
```
## 💻 JavaScript 解法

```js
var combinationSum = function(candidates, target) {
    const result = [];

    const backtrack = (remaining, path, start) => {
        if (remaining === 0) {
            result.push([...path]);
            return;
        }

        for (let i = start; i < candidates.length; i++) {
            const num = candidates[i];
            if (num > remaining) continue; // 剪枝
            path.push(num);
            backtrack(remaining - num, path, i); // ❗ 正確地使用剩餘值
            path.pop(); // 回溯
        }
    };

    backtrack(target, [], 0);
    return result;
};

```