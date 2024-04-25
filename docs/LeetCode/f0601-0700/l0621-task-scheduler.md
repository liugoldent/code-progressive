---
tags:
  - LeetCode
  - Medium
  - Heap / Priority Queue
  - javascript
  - Task Scheduler
---

# [0621] Task Scheduler

## 數字解

其實這題應該算是公式解，看別人的影片比較好理解
[贾考博 LeetCode 621. Task Scheduler
](https://www.youtube.com/watch?v=siNqiP6tk94&ab_channel=%E8%B4%BE%E8%80%83%E5%8D%9A)

```js
/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function (tasks, n) {
  const dict = new Array(26).fill(0);

  // 先將每個字元計數
  for (let i = 0; i < tasks.length; i++) {
    dict[tasks[i].charCodeAt(0) - "A".charCodeAt(0)]++;
  }

  let maxCount = 0;
  let maxCountSame = 0;

  for (let i = 0; i < dict.length; i++) {
    // 取出此次的累計值
    const num = dict[i];
    // 如果num > maxCount要先取代掉（也就是至少有一個會排最後）
    if (num > maxCount) {
      maxCount = num;
      maxCountSame = 1;
      // 如果遇到相同字母相同個數的，則maxCountSame++，因為最後會有兩個以上的字
    } else if (num === maxCount) {
      maxCountSame++;
    }
  }
  // 解答：maxCount代表最多個數的字母 / n 為slot間隔 / maxCountSame代表多少個字母相同
  const res = (maxCount - 1) * (n + 1) + maxCountSame;
  // 最後要取比較大的（因為有可能一堆亂數字母，然後只有兩個相同的）
  return Math.max(tasks.length, res);
};
```
