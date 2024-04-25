---
tags:
  - LeetCode
  - Easy
  - Merge Strings Alternately
  - Javascript
---

# [1768] Merge Strings Alternately

## Javascript 解

```js
/**
 * @param {string} word1
 * @param {string} word2
 * @return {string}
 */
var mergeAlternately = function (word1, word2) {
  let index = 0;
  let result = "";
  let remainWords = "";
  // 首先先結合兩個字（要小於兩個length才可以while進去）
  while (index < word1.length && index < word2.length) {
    result = `${result}${word1[index]}${word2[index]}`;
    index = index + 1;
  }
  // 再來如果兩個length 不相等，則看哪個比較長，放進去比較長的後半段全部
  if (word1.length !== word2.length) {
    remainWords =
      word1.length > word2.length ? word1.slice(index) : word2.slice(index);
  }
  return `${result}${remainWords}`;
};
```
