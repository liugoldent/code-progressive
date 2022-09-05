---
description: javascript event loop 筆記
tags:
  - javascript
  - javascript
  - event loop
---

# [JS] Event Loop 筆記

## 參考文章
[[Note] Event loop, micro-task, macro-task, async JavaScript 筆記](https://pjchender.dev/javascript/note-event-loop-microtask/)

## 基本分類
:::note
在前端JS的Event Loop除了基本的call stack、queue以外，還可以再細分成 **Sync > Nanotask > micro-task > macro-task**
:::

* macroTask與瀏覽器或電腦底層有關，諸如：`setTimeout`、`setInterval`、I/O
* microTask與自定義之非同步有關，諸如：`Promise`、`process.nextTick`、`queueMicrotask`、`MutationObserver`
  * 對於promise而言，`.then()`之後的function會進入microTask
  * Promise內的視為同步
  * 第一個await之後的function會進入microTask

## 程式碼參考
[程式碼](https://pjchender.dev/javascript/note-event-loop-microtask/#promise-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%9C%83%E7%9B%B4%E6%8E%A5%E5%9F%B7%E8%A1%8C%E4%B8%8D%E6%9C%83%E9%80%B2%E5%85%A5-microtaskthen-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%89%8D%E6%9C%83%E9%80%B2-microtask)

















