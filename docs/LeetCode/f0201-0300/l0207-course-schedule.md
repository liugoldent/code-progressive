---
date: 2025-06-12
robots: index, follow
canonical: "https://yourdomain.com/leetcode/207-course-schedule"
image: "https://yourdomain.com/assets/leetcode-course-schedule.png"
title: "[0207] Course Schedule"
description: "使用 DFS 深度優先搜尋判斷有向圖中是否存在環。LeetCode 207 Course Schedule 題目完整解析，含 JavaScript 程式碼與圖解。"
tags:
  - LeetCode
  - 演算法
  - Graph
  - DFS
  - JavaScript
  - 拓樸排序
keywords: ["0207", "Course", "Schedule", "LeetCode", "演算法", "Graph", "DFS", "JavaScript"]
---




# [0207] Course Schedule

> 題號：**0207** | 主題：**演算法, Graph, DFS**

這題是典型的 **圖論 DFS 判環** 問題。給定課程與先修課程的配對，判斷是否可以完成所有課程（即圖中**不能有循環**）。

## 題目描述
你需要修 `numCourses` 門課，`prerequisites` 是先修課程的陣列，每個 `[a, b]` 表示要修課程 `a` 之前必須先修 `b`。  
請判斷是否能完成所有課程？

```js
// Input: numCourses = 2, prerequisites = [[1,0]]
// Output: true
var canFinish = function(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => [])
  const visited = new Array(numCourses).fill(0) // 0=未訪問, 1=訪問中, 2=已完成

  // 建圖
  for (const [course, pre] of prerequisites) {
    graph[pre].push(course)
  }

  // 深度優先搜尋
  function dfs(course) {
    if (visited[course] === 1) return false // 發現環
    if (visited[course] === 2) return true  // 已處理過

    visited[course] = 1 // 標記為訪問中

    for (const next of graph[course]) {
      if (!dfs(next)) return false
    }

    visited[course] = 2 // 標記為已完成
    return true
  }

  // 檢查所有課程
  for (let i = 0; i < numCourses; i++) {
    if (!dfs(i)) return false
  }

  return true
}
```
