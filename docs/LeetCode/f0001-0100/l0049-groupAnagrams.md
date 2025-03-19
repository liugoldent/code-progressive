---
description: leetCode Group Anagrams js 解答, python 解答
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
    Group Anagrams,
    Group Anagrams js ans,
    Group Anagrams python ans,
  ]
---

# [0049] Group Anagrams

題意：這題主要是在說，要把重組字的選項，變成陣列的群組
思路：

1. 不管是使用 new Map or {}，都要先將文字作重組（bac -> abc）
2. 一個 if else 判斷，如果當前 map or 物件內沒有此數值
3. 目前沒有則 map 新增一個目前「字重組過後」的 key，value 為 result.length
4. 目前有則用 map.get 找到該 key 值的 value（這個 value 因為當初是設定為 result.length），所以可視為 index
5. 最後 result[index].push(此次 for 循環的值)

## Javascript 解

```js
// 筆者解
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function (strs) {
  if (strs.length === 1) {
    return [strs];
  }
  let anagramsObj = {};
  for (let i = 0, len = strs.length; i < len; i++) {
    let sortStr = strs[i].split("").sort().join("");
    if (!anagramsObj[sortStr]) {
      anagramsObj[sortStr] = [strs[i]];
    } else {
      anagramsObj[sortStr].push(strs[i]);
    }
  }
  return Object.values(anagramsObj);
};
```

```js
// 最佳解
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function (strs) {
  if (strs.length === 1) {
    return [strs];
  }
  let result = [];
  let anagramsMap = new Map();
  for (let i = 0, len = strs.length; i < len; i++) {
    let sortStr = strs[i].split("").sort().join("");
    if (anagramsMap.has(sortStr)) {
      let index = anagramsMap.get(sortStr);
      result[index].push(strs[i]);
    } else {
      anagramsMap.set(sortStr, result.length);
      result.push([strs[i]]);
    }
  }
  return result;
};
```

## Python 解

```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        if len(strs) == 1:
            return [strs]
        result = []
        anagramsMap = {}
        for s in strs:
            sortedStr = ''.join(sorted(s))
            if sortedStr in anagramsMap:
                anagramsMap[sortedStr].append(s)
            else:
                anagramsMap[sortedStr] = [s]
        return list(anagramsMap.values())
```

```python
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        from collections import defaultdict
        argument = defaultdict(list)

        for s in strs:
            key = ''.join(sorted(s))
            argument[key].append(s)
        
        return list(argument.values())
```

## test case

```js
const groupAnagrams = require("./leetcode.js");

test("基本測試-1", function () {
  expect(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])).toEqual(
    ["eat", "tea", "ate"],
    ["nat", "tan"],
    ["bat"]
  );
});

test("基本測試-2", function () {
  expect(groupAnagrams([""])).toEqual([[""]]);
});

test("基本測試-3", function () {
  expect(groupAnagrams(["a"])).toEqual([["a"]]);
});

test("基本測試-4", function () {
  expect(groupAnagrams(["abc", "bbb"])).toEqual([["abc"], ["bbb"]]);
});
```
