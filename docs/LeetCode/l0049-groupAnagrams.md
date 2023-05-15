---
tags:
  - LeetCode
  - Medium
  - groupAnagrams
  - Javascript
  - Array And Hashing
---

# [0049] groupAnagrams
題意：這題主要是在說，要把重組字的選項，變成陣列的群組
思路：
  1. 不管是使用 new Map or {}，都要先將文字作重組（bac -> abc）
  2. 一個if else 判斷，如果當前map or 物件內沒有此數值
  3. 目前沒有則map新增一個目前「字重組過後」的key，value為result.length
  4. 目前有則用map.get找到該key值的value（這個value因為當初是設定為result.length），所以可視為index
  5. 最後result[index].push(此次for循環的值)
## Javascript 解
```js
// 筆者解
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function(strs) {
  if(strs.length === 1){
    return [strs]
  }
  let anagramsObj = {}
  for(let i = 0, len = strs.length ; i < len ; i++){
    let sortStr = strs[i].split('').sort().join('')
    if(!anagramsObj[sortStr]){
      anagramsObj[sortStr] = [strs[i]]
    }else{
      anagramsObj[sortStr].push(strs[i])
    }
  }
  return Object.values(anagramsObj)
};
```

```js
// 最佳解
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
let groupAnagrams = function(strs) {
  if(strs.length === 1){
    return [strs]
  }
  let result = []
  let anagramsMap = new Map()
  for(let i = 0, len = strs.length ; i < len ; i++){
    let sortStr = strs[i].split('').sort().join('')
    if(anagramsMap.has(sortStr)){
      let index = anagramsMap.get(sortStr)
      result[index].push(strs[i])
    }else{
      anagramsMap.set(sortStr, result.length)
      result.push([strs[i]])
    }
  }
  return result
};
```


## test case
```js
const groupAnagrams = require("./leetcode.js");

test("基本測試-1", function () {
  expect(groupAnagrams(["eat","tea","tan","ate","nat","bat"])).toEqual([ 'eat', 'tea', 'ate' ], [ 'nat', 'tan' ], [ 'bat' ]);
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
