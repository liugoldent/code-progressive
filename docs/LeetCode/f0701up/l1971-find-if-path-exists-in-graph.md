---
title: "[1971] Find if Path Exists in Graph"
description: "[1971] Find if Path Exists in Graph 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Find if Path Exists in Graph
  - Javascript
keywords: ["1971", "Find", "if", "Path", "Exists", "in", "Graph", "LeetCode"]
---

# [1971] Find if Path Exists in Graph

> 題號：**1971** | 難度：**Easy** | 主題：**Find if Path Exists in Graph**

## JavaScript 解法
```js
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number} source
 * @param {number} destination
 * @return {boolean}
 */
function validPath(n, edges, source, destination) {
  // 1. 建圖：鄰接表
  const graph = Array.from({ length: n }, () => [])

  for(const [u, v] of edges){
    graph[u].push(v)
    graph[v].push(u)
  }

  const visited = new Set()

  // 2. DFS 遍歷
  function dfs(node){
    if(node === destination) return true
    visited.add(node)

    for(const neighbor of graph[node]){
      if(!visited.has(neighbor)){
        if(dfs(neighbor)) return true
      }
    }

    return false
  }

  return dfs(source)
}
```
