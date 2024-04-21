---
description: 關於buffer的考題
tags:
  - javascript
  - interview
keywords:
  [
    html,
    css,
    js,
    javascript,
    buffer,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
  ]
---

# 談談 buffer

## 緣由

- `JavaScript`語言自身只有字符串資料類型，沒有二進制資料類型。
- 在處理像`TCP`流或文件流時，必須使用到二進制資料。因此在`Node.js`中，定義了一個`Buffer`類，該類用來建立一個專門存放二進制資料的緩存區。
- 在`Node.js`中，`Buffer`類是隨`Node`內核一起發布的核心庫。`Buffer`庫為`Node.js`帶來了一種存儲原始資料的方法，可以讓`Node.js`處理二進制資料，每當需要在`Node.js`中處理I/O操作中移動的資料時，就有可能使用`Buffer`庫。原始資料存儲在`Buffer`類的實例中。一個 `Buffer`類似於一個整數數組，但它對應於V8堆內存之外的一塊原始內存。

## 緩衝區
* 緩衝區（Buffer）在 Node.js 中用於處理二進制數據。它是一種固定大小的內存區域，用於存儲原始數據，例如字節（bytes）、整數、浮點數等。緩衝區提供了一系列方法來讀取、寫入和操作這些二進制數據。

### 主要用途包括

1. 文件操作：在文件讀取和寫入過程中，緩衝區用於處理文件的二進制數據，例如讀取圖片、視頻、文本文件等。
2. 網絡通信：在網絡通信過程中，緩衝區用於處理傳入和傳出的數據流，例如 TCP 和 UDP 通信中的數據包。
3. 加密解密：在加密和解密過程中，緩衝區用於存儲加密前後的數據，並進行相應的操作，例如對稱加密算法和非對稱加密算法。
4. 圖像處理：在圖像處理過程中，緩衝區用於存儲圖像的像素數據，並進行像素操作、圖像讀取和編碼解碼等操作。

## 方法
### alloc(size[, fill[, encoding]])	
* 返回一個指定大小的 Buffer 實例，如果沒有設置 fill，則默認填滿 0
### allocUnsafe(size)
* 返回一個指定大小的 Buffer 實例，但是它不會被初始化，所以它可能包含敏感的資料Buffer.allocUnsafeSlow(size)
### from(array)
* 返回一個被 array 的值初始化的新的 Buffer 實例（傳入的 array 的元素只能是數字，不然就會自動被 0 覆蓋）
#### from(arrayBuffer[, byteOffset[, length]])
* 返回一個新建的與給定的 ArrayBuffer 共享同一內存的 Buffer。
### from(buffer)
* 複製傳入的 Buffer 實例的資料，並返回一個新的 Buffer 實例
### from(string[, encoding])
* 返回一個被 string 的值初始化的新的 Buffer 實例

## 綜合程式碼


## 參考文章
[Node.js | Buffer(緩衝區)](https://morosedog.gitlab.io/nodejs-20200123-Nodejs-11/)
