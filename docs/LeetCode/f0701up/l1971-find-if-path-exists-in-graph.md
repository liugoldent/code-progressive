---
tags:
  - LeetCode
  - Easy
  - Find if Path Exists in Graph
  - Javascript
---

# [1971] Find if Path Exists in Graph

## Javascript 解
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
