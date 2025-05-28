---
tags:
  - LeetCode
  - Medium
  - Heap / Priority Queue
  - javascript
  - Top K Frequent Words
---

# [0692] Top K Frequent Words

## js 解

```js
/**
 * @param {string[]} words
 * @param {number} k
 * @return {string[]}
 */
var topKFrequent = function(words, k) {
    // 1. 统计频率
    const freq = new Map()

    for(const word of words){
        freq.set(word, (freq.get(word) || 0) + 1)
    }

    // 2. 拿到所有不重复单词列表
    const uniques = Array.from(freq.keys())

    // 3. 排序：先按频次降序；若相同则按字典序升序
    uniques.sort((a,b) => {
        const diff = freq.get(b) - freq.get(a)
        if(diff !== 0) return diff
        return a < b ? -1 : a > b ? 1 : 0
    })

    // 4. 截取前 k
    return uniques.slice(0, k)
};
```
