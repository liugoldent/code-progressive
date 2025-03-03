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
* 順序：
  * 第一階段：同步一次先執行完
  * 遇到await -> await 內執行完，才會執行await之後的程式
  * await 內遇到resolve才是執行完，不然不會往下執行



![eventLoop](https://camo.githubusercontent.com/0543b7e9ab5a20ebb98cedb05365abc3457902fdf6134b4d892f9859d7c8a656/68747470733a2f2f7374617469632e7675652d6a732e636f6d2f36653830653565302d376362382d313165622d383566362d3666616337376330633962332e706e67)
## 程式碼參考
[程式碼](https://pjchender.dev/javascript/note-event-loop-microtask/#promise-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%9C%83%E7%9B%B4%E6%8E%A5%E5%9F%B7%E8%A1%8C%E4%B8%8D%E6%9C%83%E9%80%B2%E5%85%A5-microtaskthen-%E4%B8%AD%E7%9A%84%E7%A8%8B%E5%BC%8F%E6%89%8D%E6%9C%83%E9%80%B2-microtask)


## gpt解釋
### 執行上下文與呼叫堆疊
當 JavaScript 程式開始執行時，所有同步程式碼會進入呼叫堆疊（Call Stack）執行，當前的函式和執行上下文會依序入棧、出棧。

### 異步任務與任務隊列
當執行非同步操作（例如 setTimeout、AJAX 請求、Promise 等）時，這些任務不會直接進入呼叫堆疊，而是由瀏覽器或 Node.js 的底層 API 處理，當操作完成後會將相應的回調放入任務隊列中：

* **宏任務（Macrotasks / Tasks）**：例如 setTimeout、setInterval、I/O 操作等。
* **微任務（Microtasks）**：例如 Promise.then、MutationObserver 回調等。微任務隊列的優先級高於宏任務隊列。
### 事件循環（Event Loop）的運作
當呼叫堆疊清空後，事件循環會先檢查微任務隊列，將所有等待的微任務依序執行完畢（即使在執行微任務期間又產生新的微任務，也會在開始宏任務前全部執行完畢）。微任務清空後，事件循環會從宏任務隊列中取出一個任務推入呼叫堆疊執行，這個過程不斷循環。

### 重要性
* 保證異步回調順序：通過微任務隊列優先執行，保證了 Promise 等回調在當前任務完成後能夠及時執行，從而影響到後續任務的順序。
* 保持非阻塞：即使 JavaScript 是單執行緒，事件循環機制讓我們可以在等待 I/O 或定時任務時，繼續執行其他代碼，從而保持整體系統非阻塞。

### 呼叫堆疊的概念
當一段同步程式碼執行時，每遇到一個函式調用，JavaScript 就會把該函式的執行上下文（包括變數環境、參數等）推入呼叫堆疊中。當該函式執行完畢，堆疊中的該上下文就會被彈出，控制權返回給呼叫它的那一層。

### 為什麼看起來是順序執行？
假設我們有一個主函式 A，它內部依次調用 B、C 等。

1. 當 A 開始執行時，A 被推入呼叫堆疊。
2. 當 A 執行到調用 B 的那一行時，B 的上下文被推入堆疊，然後 B 開始執行。
3. B 執行完畢後被彈出，控制權返回到 A，繼續執行接下來的語句。
4. 最終，A 執行完畢被彈出，程式結束。
儘管堆疊內部是 LIFO（即最後推入的先執行），但這個機制保證了「一個函式內的所有語句都會在返回給外層函式之前完全執行完畢」，從而使得最終整體執行的順序仍然符合程式碼的書寫順序。

## gpt 範例
```js
function A() {
  console.log('開始 A');
  B();
  console.log('結束 A');
}

function B() {
  console.log('執行 B');
}

console.log('程序開始');
A();
console.log('程序結束');

```

### 執行流程：
1. 先把 console.log('程序開始') 推入堆疊並執行，輸出：程序開始。
2. 接著調用 A()，把 A 的執行上下文推入堆疊：
3. 輸出：開始 A。
4. 調用 B()，把 B 的上下文推入堆疊：
5. 輸出：執行 B。
6. B 執行完畢，從堆疊中彈出，控制權返回 A。
7. A 繼續執行，輸出：結束 A。
8. A 執行完畢，從堆疊中彈出。
9. 最後執行 console.log('程序結束')，輸出：程序結束。
* 輸出順序：程序開始 → 開始 A → 執行 B → 結束 A → 程序結束
* 重點：`console.log()`也算是函數的一種，所以把他丟進去堆疊，他執行完就立刻出來了

雖然在 B 被調用時，它是最後進入堆疊的，但一旦 B 執行完畢，控制權又返回 A，所以最終輸出仍然是按照我們在程式中書寫的順序進行。

## 總結：
LIFO 的呼叫堆疊：確保內部函式調用完成後才返回外部函式。
同步執行順序：每個函式在調用時都會把新的執行上下文推入堆疊，執行完成後再返回，這樣整體流程依然按照程式碼的順序執行。














