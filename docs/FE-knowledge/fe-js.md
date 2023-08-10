---
description: JS知識點
tags: 
    - JS
    - frontend
---

# [FE] JS

## 用JS寫一個方法，使得結果映射到值[0-1]之間
```js
// 歸一化function
function normalizeValue(value, min, max){
    return (value- min) / (max-min)
}
```
```js
// demo
const arr = [10, 20, 30, 40];
const min = Math.min(...arr); // 获取数组中的最小值
const max = Math.max(...arr); // 获取数组中的最大值

const normalizedArr = arr.map(value => normalizeValue(value, min, max));
console.log(normalizedArr); // [0, 0.3333333333333333, 0.6666666666666666, 1]
```

## 請使用createNodeIterator寫一個方法遍歷頁面中所有的元素
[q5386](https://github.com/haizlin/fe-interview/issues/5386)
```js
function traverseAllElements() {
  const rootNode = document.documentElement;
  const iterator = document.createNodeIterator(rootNode, NodeFilter.SHOW_ELEMENT);

  let node;
  while ((node = iterator.nextNode())) {
    console.log(node.tagName);
  }
}
// createNodeIterator 方法会返回一个迭代器对象 iterator
// 該迭代器以rootNode作為節點
// 以NodeFilter.SHOW_ELEMENT過濾掉文本節點，迭代出每個節點，並將tag名稱輸出到控制台
```

## js的map與Object差在哪
* key的特性：在Object中，key必定要string or symbol。在Map中，key可以為任何類型
* key的順序：object沒有特定順序。Map保留插入key的順序。
* 大小與性能：Map在儲存大量鍵值時且需要頻繁增刪操作時，有較好的性能。而Object在資料量較小時，比較簡單與高效。
* 迭代與遍歷：Map使用for..of。Object使用for..in。並且需要手動檢查屬性的可枚舉性。
* key的唯一性：在物件中，後者增加的key會覆蓋掉前面的。而在map中會是唯一的鍵值。
* 如果對需要順序儲存、鍵值操作靈敏、性能較高可以使用map
* 如果只是簡單地將key-value儲存起來，並且對key-value順序沒有要求，可以使用object


