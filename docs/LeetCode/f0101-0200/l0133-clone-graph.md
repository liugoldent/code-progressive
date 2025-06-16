---
description: "使用 JavaScript 解 LeetCode 133 Clone Graph，採用 DFS 遞迴實作圖的深拷貝，含完整程式碼與解說"
tags: [LeetCode, JavaScript, Graph, DFS, Clone Graph, 深拷貝, 資料結構]
---

# [0133] Clone Graph

> 使用 DFS 遞迴演算法實作無向圖的深層複製，這題目是典型的圖遍歷應用。支援有環的圖，避免重複拷貝。

---

## 題目簡述

Clone an undirected graph. Each node contains a `val` and a list of `neighbors`.

傳入圖的一個節點，請回傳該圖的深拷貝副本（複製整張圖的所有節點與連線）。

---

## 解題思路（DFS）

- 使用 `Map` 儲存已訪問過的節點，避免進入死循環（處理有環的圖）。
- 每次遇到一個新節點，就建立新節點的實例。
- 然後對其每個鄰居遞迴進行深拷貝，並加入新節點的 `neighbors` 陣列。

---

## JavaScript 實作

```javascript
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function(node) {
    if (!node) return null;

    const visited = new Map();

    function dfs(curr) {
        // 如果已經複製過了，直接回傳該 clone 節點
        if (visited.has(curr)) {
            return visited.get(curr);
        }

        // 建立新的 clone 節點（淺層，不含鄰居）
        const copy = new Node(curr.val);
        visited.set(curr, copy);

        // 遞迴複製所有鄰居
        for (const neighbor of curr.neighbors) {
            copy.neighbors.push(dfs(neighbor));
        }

        return copy;
    }

    return dfs(node);
};
