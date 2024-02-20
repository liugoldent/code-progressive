---
tags: 
    - Node.js
    - Test
---
# [FE] Node.js

## 直接風格 vs CPS風格
```javascript
//直接風格
function func(x) {
  return x
}
```

```javascript
function func(x, cb) {
  cb(x)
}
```
## 為何一定要用CPS
* 非阻塞的I/O處理，只有CPS可以這樣作。
* 有些I/O或事件類的函式，用直接風格會造成阻塞，所以要寫成異步的回調函式，也就是一定要用CPS

## Node.js錯誤優先的回調函數
Node.js使用error-first(以錯誤為主)的CPS風格，因為考慮到callback(回調)要處理錯誤不容易，所以要優先處理錯誤，它的主要原則如下:

* callback的第一個參數保留給Error(錯誤)，當錯誤發生時，它將會以第一個參數回傳。
* callback的第2個參數保留給成功回應的資料。當沒有錯誤發生時，error(即第一個參數)會設定為null，然後將成功回應的資料傳入第二個參數。

```javascript
// 第一個參數留給err，第二個給正確的資料
fs.readFile('foo.txt', 'utf8', function(err, data) {
   if(err) {
    console.log('Unknown Error');
    return;
  }
  console.log(data);
});
```

[Callback(回調)](https://eyesofkids.gitbooks.io/javascript-start-from-es6/content/part4/callback.html)

## node.js的EventEmitter
* 有點類似js 的 addEventListener

```javascript
//event.js 文件
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
// event.on 註冊一個事件
event.on('some_event', function() { 
    console.log('some_event 事件触发'); 
}); 
setTimeout(function() { 
    // 註冊事件之後，由emit去做觸發執行 -> emit 名稱之後，然後event.on 會做他的callback
    event.emit('some_event'); 
}, 1000); 
```


## 相關面試題
[Junior 後端工程師面試技術題](https://medium.com/johnny%E7%9A%84%E8%BD%89%E8%81%B7%E5%B7%A5%E7%A8%8B%E5%B8%AB%E7%AD%86%E8%A8%98/junior-%E5%BE%8C%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E9%9D%A2%E8%A9%A6%E6%8A%80%E8%A1%93%E9%A1%8C-ef39b902eda8)


