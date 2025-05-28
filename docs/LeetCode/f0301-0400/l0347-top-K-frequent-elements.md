---
description: leetCode Top K Frequent Elements js 解答, python 解答
tags:
  - LeetCode
  - Medium
  - javascript
  - python
  - interview
  - Hashing
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

```js
// bucket solution
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    const freq = new Map()
    for(const x of nums){
        freq.set(x, (freq.get(x) || 0) + 1)
    }
    const buckets = Array(nums.length + 1)
    .fill(null)
    .map(() => [])

    for(const [num, count] of freq.entries()){
        buckets[count].push(num)
    }

    const res = []
    for(let i = buckets.length - 1; i >= 0 && res.length < k ; i--){
        if(buckets[i].length > 0){
            res.push(...buckets[i])
        }
    }

    return res.slice(0, k)
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

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        frequency = {}
        for num in nums:
            frequency[num] = frequency.get(num, 0) + 1
        
        sortedItem = sorted(frequency.items(), key=lambda x:x[1] , reverse = True)

        return [item[0] for item in sortedItem[:k]]
```

1. `counter.keys()`: counter 是一個 Counter 對象，`counter.keys()` 返回了所有不重複的元素，也就是數組中的所有不同的元素。

2. `sorted(...)`: 這個函數用於對給定的可迭代對象進行排序。在這裡，我們使用 sorted 函數來對元素進行排序。

3. `key=lambda x: (-counter[x], x)`: 這是 sorted 函數的一個關鍵參數，用於指定排序的規則。在這裡，我們使用了一個匿名函數 lambda，它接受一個元素 x，並返回一個元組 `(-counter[x], x)`。這個元組包含兩個元素，第一個元素是 `-counter[x]`，表示元素 x 的出現頻率的負值（負值是為了讓頻率高的排在前面），第二個元素是 x 本身，表示元素的值。這樣的排序規則可以確保按照出現頻率降序排列，如果頻率相同，則按照元素值升序排列。

4. `[:k]`: 這個切片操作是用來取出排序後的前 k 個元素，這樣就得到了出現頻率前 k 高的元素。

### lambda 函式參考

[排序？index sort? lambda 又有你的事了？](https://ithelp.ithome.com.tw/articles/10218710)
**key：傳入是物件就拿value，傳入是陣列就拿第二個元素**
#### example
1. 排序學生分數
```python
students = [("Alice", 85), ("Bob", 90), ("Charlie", 80)]
sorted_students = sorted(students, key=lambda x: x[1], reverse=True)
print(sorted_students)  
# 輸出: [('Bob', 90), ('Alice', 85), ('Charlie', 80)]
# 會取得每個元組的第二個元素（即分數）去做排序
```

2. 排序字典項目
```python
students = [("Alice", 85), ("Bob", 90), ("Charlie", 80)]
sorted_students = sorted(students, key=lambda x: x[1], reverse=True)
print(sorted_students)  
# 輸出: [('Bob', 90), ('Alice', 85), ('Charlie', 80)]
# 會取得每個元組的第二個元素（即分數）去做排序
# 取得每個元組的 value（分數）
```

3. 排序二維列表
```python
data = [[1, 3], [2, 1], [3, 2]]
sorted_data = sorted(data, key=lambda x: x[1], reverse=True)
print(sorted_data)  
# 輸出: [[1, 3], [3, 2], [2, 1]]
# 因為傳入數組，故也是利用每個元素的第二個值做排序
```

4. 排序座標點（依 y 座標由大到小）
```python
points = [(1, 2), (3, 1), (2, 5), (4, 3)]
sorted_points = sorted(points, key=lambda x: x[1], reverse=True)
print(sorted_points)  
# 輸出: [(2, 5), (4, 3), (1, 2), (3, 1)]
```