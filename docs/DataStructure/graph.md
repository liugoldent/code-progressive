---
tags:
  - 資料結構 / 演算法
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