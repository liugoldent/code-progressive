---
date: 2025-06-18
title: "[0057] Insert Interval"
description: "[0057] Insert Interval 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags: [LeetCode, JavaScript, Interval, Greedy, Insert Interval, 面試題]
keywords: ["0057", "Insert", "Interval", "LeetCode", "JavaScript", "Greedy", "面試題", "📘"]
---

# [0057] Insert Interval

> **難度**：Medium  
> **題型**：區間合併、線性掃描  
> **題目連結**：[LeetCode 57](https://leetcode.com/problems/insert-interval/)

---

## 📘 題目摘要

給定一個**已排序（起點升冪）且互不重疊**的區間陣列 `intervals = [[s₁,e₁], …]`，  
以及一個新區間 `newInterval = [ns, ne]`，  
將其插入並把所有重疊區間合併，輸出**新的不重疊、升冪**區間列表。

---

### 範例

| Input | Output | 說明 |
|-------|--------|------|
| `[[1,3],[6,9]], [2,5]` | `[[1,5],[6,9]]` | 1–3 與 2–5 合併為 1–5 |
| `[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]` | `[[1,2],[3,10],[12,16]]` | 4–8 覆蓋中間三段 |

---

## 🧠 思路：三種情況一次掃描

| Case | 條件 | 動作 |
|------|------|------|
| **左側** | `curr.end < ns` | 直接 push |
| **右側** | `curr.start > ne` | 先 push `newInterval`（若尚未），再 push `curr` |
| **重疊** | 其他情況 | 擴張合併：`<br>`ns = min(ns, curr.start)`<br>`ne = max(ne, curr.end)` `|

因原陣列已排序且無重疊，線性掃描即可。

---

## 💻 JavaScript 程式碼

```js
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function (intervals, newInterval) {
  const res = [];
  let [ns, ne] = newInterval;
  let inserted = false;

  for (const [s, e] of intervals) {
    if (e < ns) {
      // Case 1: 在左邊
      res.push([s, e]);
    } else if (s > ne) {
      // Case 2: 在右邊
      if (!inserted) {
        res.push([ns, ne]);
        inserted = true;
      }
      res.push([s, e]);
    } else {
      // Case 3: 重疊 → 擴張 newInterval
      ns = Math.min(ns, s);
      ne = Math.max(ne, e);
    }
  }

  // 若 newInterval 在最右邊仍未插入
  if (!inserted) res.push([ns, ne]);

  return res;
};
