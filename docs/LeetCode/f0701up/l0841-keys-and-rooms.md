---
tags:
  - LeetCode
  - Medium
  - Keys and Rooms
  - Javascript
---

# [0841] Keys and Rooms

## Javascript 解
```js
/**
 * @param {number[][]} rooms
 * @return {boolean}
 */
var canVisitAllRooms = function(rooms) {
    const visited = new Set()

    function dfs(room){
        if(visited.has(room)) return
        visited.add(room)
        for(let key of rooms[room]){
            dfs(key)
        }
    }

    dfs(0)

    return visited.size === rooms.length
};
```
