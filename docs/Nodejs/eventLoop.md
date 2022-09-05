---
description: node.js event loop 圖解
tags:
  - Node.js
  - event loop
---

# [Node.js] Event Loop 筆記

[完整圖解Node.js的Event Loop(事件迴圈)](https://notes.andywu.tw/2020/%E5%AE%8C%E6%95%B4%E5%9C%96%E8%A7%A3node-js%E7%9A%84event-loop%E4%BA%8B%E4%BB%B6%E8%BF%B4%E5%9C%88/#2)


## 參考文章
![node.js event loop](https://notes.andywu.tw/wp-content/uploads/2020/12/nodejs.jpg)

## 基本知識
node.js在run file時，會先跑過一遍，把所有同步function先跑過，再分門別類將非同步丟到不同Queue中
### <u>同步指令</u>
`promise()`、一切正常function
### <u>（非同步指令）2個高優先執行的Queue</u>
#### nextTick Queue 
`process.nextTick()`，優先於timer，以及其他queue
#### microTask Queue
當`promise`有狀態從pending轉為resolve or reject，這個resolve or reject會放在這裡面執行。

### <u>（非同步指令）6個普通執行的Queue</u>
#### Timers
諸如`setTimeout`、`setInterval`，當設定的時間結束，計時器的cb會被丟到這邊等待執行
#### Pending callbacks
給作業系統層級使用，例如TCP errors
#### Idle, prepare
for node.js 內部使用
#### Polling
給新的I/O做使用，例如串流用到的`.on('data', callback)`
#### Check
`setImmediate()`
#### Close callbacks
關閉連線or關閉檔案的操作，例如`socket.on('close', cb)`











































