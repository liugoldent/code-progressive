---
tags:
  - LeetCode
  - Easy
  - Best Time to Buy and Sell Stock
  - javascript
  - Sliding Window
---

# [0121] Best Time to Buy and Sell Stock

## Javascript 解

思路：

- 定義最小值與最大收益
- 跑一次 for loop 就好
- 然後每次要去計算現在是不是最小的
- 與收益用 Math.max 取得 profit && this item - minPrice 的

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let maxProfit = 0;
  let minPrice = Infinity;
  for (let i = 0, len = prices.length; i < len; i++) {
    minPrice = Math.min(minPrice, prices[i]);
    maxProfit = Math.max(maxProfit, prices[i] - minPrice);
  }
  return maxProfit;
};
```

思路 2：
試思考一左一右的買進價位
但是如果右邊大於左邊則計算 profit
如果左邊大於右邊，則左邊指針不動
跑完 if else 後，right++

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let left = 0;
  let right = 1;
  let maxProfit = 0;

  while (right < prices.length) {
    if (prices[left] < prices[right]) {
      let profit = prices[right] - prices[left];
      maxProfit = Math.max(profit, maxProfit);
    } else {
      left = right;
    }
    right++;
  }
  return maxProfit;
};
```
