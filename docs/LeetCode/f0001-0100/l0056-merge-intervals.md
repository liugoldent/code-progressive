---
date: 2025-06-18
title: "[0056] Merge Intervals"
description: "[0056] Merge Intervals 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - JavaScript
  - Interval
  - Greedy
  - Sorting
  - 面試題
keywords: ["0056", "Merge", "Intervals", "LeetCode", "JavaScript", "Interval", "Greedy", "Sorting"]
---




# [0056] Merge Intervals

> **難度**：Medium  
> **題型**：區間合併、排序、貪婪  
> **題目連結**：[LeetCode 56](https://leetcode.com/problems/merge-intervals/)

## 題目描述
給定一系列區間 `intervals = [[s₁,e₁], [s₂,e₂], …]`（保證 `sᵢ ≤ eᵢ`），  
若兩區間 **重疊**（`next.start ≤ curr.end`），必須把它們合併為  
`[min(start), max(end)]`。  
請輸出合併後的區間陣列，**要求：**

1. 各區間互不重疊  
2. 按起點升冪排序  

### 🧪 範例

| Input | Output | 解釋 |
|-------|--------|------|
| `[[1,3],[2,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` | `1–3` 與 `2–6` 重疊，合併為 `1–6` |
| `[[1,4],[4,5]]` | `[[1,5]]` | `4` 與 `4` 相接也視為重疊 |

## 解題思路

1. **先依起點 `start` 升冪排序**（保證掃描時區間順序遞增）。  
2. 準備結果陣列 `merged`，逐一處理區間：  
   * 若 `merged` 為空 *或* `curr.start > merged[-1].end` → 無交集，直接 push 新區間。  
   * 否則交集 → 更新尾端：  
     `merged[-1].end = max(merged[-1].end, curr.end)`  
     等同把兩段合成較長的一段。  
3. 掃描完即得到最終不重疊序列。

## 💻 JavaScript 實作

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (!intervals.length) return [];

  // 1️⃣ 按起點升冪排序
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [];
  for (const [start, end] of intervals) {
    if (!merged.length || start > merged[merged.length - 1][1]) {
      // 無交集：直接加入
      merged.push([start, end]);
    } else {
      // 有交集：更新區間尾
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        end
      );
    }
  }
  return merged;
};
