---
description: leetCode Top K Frequent Elements js 解答, python 解答 
tags:
  - LeetCode
  - Medium
  - javascript
  - python
  - interview
  - Array And Hashing
keywords:
  [
    facebook,
    amazon,
    apple,
    netflix,
    google,
    faang interview,
    leetCode,
    js,
    javascript,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
    software engineer,
    Top K Frequent Elements,
    Top K Frequent Elements js ans,
    Top K Frequent Elements python ans,
  ]
---

# [0347] Top K Frequent Elements

## Javascript 解

思路：

1. 首先一樣要做出 key-value 對（並且要計算個各元素出現次數）
2. 再來將 map 轉成陣列樣子
3. 再來將陣列去做排序（這樣 count 最高的數量就會排在最前面）
4. 最後用 while 迴圈去跑，因為最大的一定在頭，所以循序放近 result 即可

```js
var topKFrequent = function (nums, k) {
  let frequency = [];
  let elementMap = {};

  for (let i = 0, len = nums.length; i < len; i++) {
    let initCount = elementMap[nums[i]] ? elementMap[nums[i]] : 0;
    elementMap[nums[i]] = initCount + 1;
  }
  Object.keys(elementMap).forEach((item) => {
    let frequencyIndex = elementMap[item]; // frquency 的 index
    if (!frequency[frequencyIndex]) {
      frequency[frequencyIndex] = [];
    }
    frequency[frequencyIndex].push(item);
  });
  let result = [];
  for (let i = frequency.length - 1; i > 0; i--) {
    if (frequency[i]) {
      for (let j = 0, lenj = frequency[i].length; j < lenj; j++) {
        console.log(frequency[i][j]);
        if (result.length < k) {
          result.push(frequency[i][j]);
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
var topKFrequent = function (nums, k) {
  let map = new Map();
  // 先讓陣列跑完一次（要取得key-value map對）
  for (let i of nums) {
    let count = map.get(i) || 0;
    map.set(i, count + 1);
  }
  // 重點在這邊的map.entries（將map轉成陣列，並且將其由小到大做排列）
  let i = 0,
    result = [],
    values = [...map.entries()].sort((a, b) => b[1] - a[1]);
  // 在這邊，當result長度小於k時，就一直將結果丟進去result
  while (i < k) {
    result.push(values[i][0]);
    i++;
  }

  return result;
};
```

## Python 解

```python
from collections import Counter

def topKFrequent(nums, k):
    # 使用 Counter 統計每個元素的出現頻率
    counter = Counter(nums) # {1: 4, 2: 3, 3: 1}

    # 將字典中的元素按照出現頻率進行排序，並取出前 k 個元素
    frequent_elements = sorted(counter.keys(), key=lambda x: (-counter[x], x))[:k]

    return frequent_elements

# 測試
# nums = [1, 1, 1, 1, 2, 2, 2, 3]
# k = 2
# print(topKFrequent(nums, k))  # Output: [1, 2]
```

1. `counter.keys()`: counter 是一個 Counter 對象，`counter.keys()` 返回了所有不重複的元素，也就是數組中的所有不同的元素。

2. `sorted(...)`: 這個函數用於對給定的可迭代對象進行排序。在這裡，我們使用 sorted 函數來對元素進行排序。

3. `key=lambda x: (-counter[x], x)`: 這是 sorted 函數的一個關鍵參數，用於指定排序的規則。在這裡，我們使用了一個匿名函數 lambda，它接受一個元素 x，並返回一個元組 `(-counter[x], x)`。這個元組包含兩個元素，第一個元素是 `-counter[x]`，表示元素 x 的出現頻率的負值（負值是為了讓頻率高的排在前面），第二個元素是 x 本身，表示元素的值。這樣的排序規則可以確保按照出現頻率降序排列，如果頻率相同，則按照元素值升序排列。

4. `[:k]`: 這個切片操作是用來取出排序後的前 k 個元素，這樣就得到了出現頻率前 k 高的元素。

### lambda 函式參考

[排序？index sort? lambda 又有你的事了？](https://ithelp.ithome.com.tw/articles/10218710)
