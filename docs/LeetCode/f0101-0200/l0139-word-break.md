---
date: 2025-06-18
title: "[0139] Word Break"
description: "[0139] Word Break 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - Dynamic Programming
  - 字串切割
  - HashSet
  - Blind75
keywords: ["0139", "Word", "Break", "LeetCode", "JavaScript", "Dynamic", "Programming", "字串切割"]
---




# [0139] Word Break

> 題目難度：**Medium**  
> 題型分類：`動態規劃（DP）`、`字串處理`、`HashSet 優化`  
> 題目連結：[LeetCode 139 - Word Break](https://leetcode.com/problems/word-break/)

## 題目描述
給定一個字串 `s` 與字典陣列 `wordDict`，判斷 `s` 是否可以被切成多個空格分隔的單字，這些單字皆存在於字典中。  
可重複使用字典中的單字。

## 解題思路

### ✅ 狀態定義：
- `dp[i]`：表示 `s[0...i-1]` 這段子字串是否可以被切分成功。
- 初始值：`dp[0] = true` → 空字串可被切分

### ✅ 狀態轉移邏輯：
```js
dp[i] = true ⟺ 存在 j，使得 dp[j] == true 且 s.slice(j, i) ∈ wordDict
```

## JavaScript 解法
```js
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict)
    const dp = new Array(s.length + 1).fill(false)
    dp[0] = true

    for(let i = 1; i <= s.length ; i++){
        for(let j = 0; j < i; j++){
            const word = s.slice(j, i)
            if(dp[j] && wordSet.has(word)){
                dp[i] = true
                break
            }
        }
    }

    return dp[s.length]
};
```
