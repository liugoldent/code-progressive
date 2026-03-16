---
title: "[0067] Add Binary"
description: "[0067] Add Binary 題解，整理解題思路、JavaScript 實作與複雜度分析，方便面試與刷題複習。"
tags:
  - LeetCode
  - Easy
  - Add Binary
  - javascript
  - Python
keywords: ["0067", "Add", "Binary", "LeetCode", "Javascript"]
---

# [0067] Add Binary

> 題號：**0067** | 難度：**Easy** | 主題：**Add Binary**

## JavaScript 解法
### 解 1：傳統邏輯

兩個小重點

1. 記得 carry 值：是用 /2 去取得
2. 真正的 res：是用 %2 去取得
3. 因為有長短問題，所以 val 的那行要使用 || 0

```js
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let lena = a.length;
  let lenb = b.length;
  let maxLength = Math.max(lena, lenb);
  let carry = 0;
  let res = "";
  let val = 0;

  for (let i = 0; i < maxLength; i++) {
    val = Number(a[lena - 1 - i] || 0) + Number(b[lenb - 1 - i] || 0) + carry;
    carry = Math.floor(val / 2);
    res = (val % 2) + res;
  }

  if (carry) res = 1 + res;

  return res;
};
```

### 解 2. 轉型

```js
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let num1 = BigInt("0b" + a);
  let num2 = BigInt("0b" + b);

  let num3 = num1 + num2;
  return num3.toString(2);
};
```
