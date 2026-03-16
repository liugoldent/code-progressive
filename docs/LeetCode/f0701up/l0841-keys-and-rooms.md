---
title: "[0841] Keys and Rooms"
description: "[0841] Keys and Rooms 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Medium
  - Keys and Rooms
  - Javascript
keywords: ["0841", "Keys", "and", "Rooms", "LeetCode", "Javascript"]
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
