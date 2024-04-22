---
tags: 
    - LeetCode
    - Medium
    - Top K Frequent Elements
    - Javascript
    - Array And Hashing
---
# [0347]  Top K Frequent Elements
## Javascript 解
思路：
1. 首先一樣要做出key-value對（並且要計算個各元素出現次數）
2. 再來將map轉成陣列樣子
3. 再來將陣列去做排序（這樣count最高的數量就會排在最前面）
4. 最後用while迴圈去跑，因為最大的一定在頭，所以循序放近result即可
```js
var topKFrequent = function (nums, k) {
  let frequency = []
  let elementMap = {}

  for (let i = 0, len = nums.length; i < len; i++) {
    let initCount = elementMap[nums[i]] ? elementMap[nums[i]] : 0
    elementMap[nums[i]] = initCount + 1
  }
  Object.keys(elementMap).forEach((item) => {
    let frequencyIndex = elementMap[item] // frquency 的 index
    if (!frequency[frequencyIndex]) {
      frequency[frequencyIndex] = []
    }
    frequency[frequencyIndex].push(item)
  })
  let result = []
  for (let i = frequency.length - 1; i > 0; i--) {
    
    if (frequency[i]) {
      for (let j = 0, lenj = frequency[i].length; j < lenj; j++) {
        console.log(frequency[i][j])
        if(result.length < k){
          result.push(frequency[i][j])
        }
      }
    }
  }
};
```
```javascript
// 最佳解
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
  let map = new Map();
    // 先讓陣列跑完一次（要取得key-value map對）
  for(let i of nums) {
      let count = map.get(i) || 0;
      map.set(i, count + 1);
  }
  // 重點在這邊的map.entries（將map轉成陣列，並且將其由小到大做排列）
  let i = 0, result = [], values = [...map.entries()].sort((a,b) => b[1] - a[1]);
  // 在這邊，當result長度小於k時，就一直將結果丟進去result
  while(i < k) {
      result.push(values[i][0]);
      i++;
  }

  return result;
};
```
