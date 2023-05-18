---
description: JS知識點
tags: 
    - JS
    - frontend
---

# FE-JS

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