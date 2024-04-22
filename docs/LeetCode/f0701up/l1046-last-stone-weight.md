---
tags: 
    - LeetCode
    - Easy
    - Last Stone Weight
    - Javascript
---
# [1046] Last Stone Weight
* 這題其實可以用Heap / Priority Queue去解
  不過因為這邊思路比較簡單，所以使用簡單解法去解決問題
```js
/**
 * @param {number[]} stones
 * @return {number}
 */
/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeight = function(stones) {
  while (stones.length > 1) {
    stones.sort((a, b) => b - a); // 將石頭重量降序排序
    var heaviestStone = stones[0];
    var secondHeaviestStone = stones[1];
    
    if (heaviestStone === secondHeaviestStone) {
      stones.splice(0, 2); // 如果兩塊石頭重量相同，則從陣列中刪除這兩塊
    } else {
      var newStone = heaviestStone - secondHeaviestStone; // 否則，新石頭的重量為兩塊石頭之差
      stones.splice(0, 2, newStone); // 將兩塊石頭替換為新石頭
    }
  }
  
  return stones.length === 1 ? stones[0] : 0; // 如果還剩下一塊石頭，則返回該石頭的重量，否則返回0
};
```
