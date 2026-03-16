---
title: "Graph"
description: "Graph 筆記，聚焦 技術筆記與核心概念整理。"
tags:
  - 資料結構 / 演算法
keywords: ["Graph", "DataStructure", "dfs"]
---




# Graph

## dfs
```js
function dfs(node){
  if(visited.has(node)) return
  visited.add(node)

  for(const neighbor of graph[node]){
    dfs(neighbor)
  }
}
```