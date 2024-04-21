---
description: javascript event loop 筆記
tags:
  - javascript
  - event loop
---

# [JS] Event Loop 筆記

## 參考文章
[[Note] Event loop, micro-task, macro-task, async JavaScript 筆記](https://pjchender.dev/javascript/note-event-loop-microtask/)
[事件循環](https://github.com/febobo/web-interview/issues/73)
## 基本分類
:::note
在前端JS的Event Loop除了基本的call stack、queue以外，還可以再細分成 **Sync > Nanotask > micro-task > macro-task**
:::

* macroTask與瀏覽器或電腦底層有關，諸如：`setTimeout`、`setInterval`、I/O
* microTask與自定義之非同步有關，諸如：`Promise`、`process.nextTick`、`queueMicrotask`、`MutationObserver`
  * 對於promise而言，`.then()`之後的function會進入microTask
  * Promise內的視為同步
  * 第一個await之後的function會進入microTask
* 微任務：在當前宏任務結束之前去做。先進先出
* 同步任務：主線程。非同步任務：Event Queue


![eventLoop](https://camo.githubusercontent.com/0543b7e9ab5a20ebb98cedb05365abc3457902fdf6134b4d892f9859d7c8a656/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f36653830653565302d376362382d313165622d383566362d3666616337376330633962332e706e67)
## 程式碼參考
[程式碼](https://pjchender.dev/javascript/note-event-loop-microtask/#promise-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%9C%83%E7%9B%B4%E6%8E%A5%E5%9F%B7%E8%A1%8C%E4%B8%8D%E6%9C%83%E9%80%B2%E5%85%A5-microtaskthen-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%89%8D%E6%9C%83%E9%80%B2-microtask)

















