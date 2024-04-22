---
description: 關於blob的考題
tags:
  - javascript
  - interview
keywords:
  [
    html,
    css,
    js,
    javascript,
    blob,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
  ]
---

# 談談 blob

## 解釋

- Binary Large Object：「二進位類型」大型物件
- 最早是應用於資料庫管理中，用於儲存影音、大型文件或圖檔。這些大型檔案，無法儲存於一般常規資料庫中，因此有了Blob資料型態，用以儲存大量的非結構化物件資料
- 為一個不可變、相當於檔案（原始資料）的類檔案物件。對前端最大貢獻為：分片上傳、圖檔預覽。

## 屬性
### size
- 返回 Blob 對象的大小（以字節為單位）。
### type
- 返回 Blob 對象的 MIME 類型。例如，對於圖像文件，可能是 `image/png`、`image/jpeg` 等。
### lastModified
- 返回 Blob 對象的最後修改時間（時間戳）。
### 程式碼
```js
const blob = new Blob(["Hello, world!"], { type: "text/plain" });

console.log(blob.size); // 輸出：13（"Hello, world!" 的字節數）
console.log(blob.type); // 輸出：text/plain
console.log(blob.lastModified); // 輸出：當前時間的時間戳
```

## 方法
### slice(start, end, contentType)
* 返回一個新的 Blob 對象，其中包含原始 Blob 對象的指定部分。參數 start 和 end 分別指定了開始和結束的字節索引（不包括 end），可選的參數 contentType 可以指定新 Blob 對象的 MIME 類型。
* 由於File繼承自Blob，可用在開發上傳檔案的分片上傳，就是利用此方式分割檔案。
### arrayBuffer()
* 返回一個 Promise，用於異步獲取 Blob 對象的 ArrayBuffer 格式表示。可以通過 await 或 then 方法獲取結果。
### text()
* 返回一個 Promise，用於異步獲取 Blob 對象的文本內容。可以通過 await 或 then 方法獲取結果。包含blob所有内容UTF-8格式的 USVString
### stream()
* 返回一個 ReadableStream 對象，可以用於以流的方式讀取 Blob 對象的數據。
### 程式碼
```js
const blob = new Blob(["Hello, world!"], { type: "text/plain" });

// 獲取 Blob 對象的 ArrayBuffer 格式表示
blob.arrayBuffer().then(buffer => {
  console.log(buffer)
  // ArrayBuffer {
  //  [Uint8Contents]: <48 65 6c 6c 6f 2c 20 77 6f 72 6c 64 21>,
  //  byteLength: 13
  // }
  console.log(new Uint8Array(buffer)); // 輸出：[72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]
});

// 獲取 Blob 對象的文本內容
blob.text().then(text => {
  console.log(text); // 輸出：Hello, world!
});
```

## 綜合程式碼
```js
// 前端讀取：Blob -> Array Buffers -> Buffer
const getMessages = async (event: any) => {
  const blob: Blob = event.data
  const buffer = await blob.arrayBuffer() // 使用 arrayBuffer() 方法『將 Blob 對象轉換為 ArrayBuffer』，以便進一步處理二進制數據
  const { msgId, data } = unpackMsg(Buffer.from(buffer))
  // 「Buffer.from」：它的作用是將 『ArrayBuffer 或類數組對象轉換為 Node.js 中的 Buffer 對象』
  // 方法通常用於處理從其他地方獲取的二進制數據，例如通過 WebSocket 或文件系統等方式獲取的數據
  // 在瀏覽器中通常不會使用 Buffer 對象，而是直接使用 ArrayBuffer 或 TypedArray。而在 Node.js 中，Buffer 對象是用於處理二進制數據的常用工具。
}

const unpackMsg = (msg: Buffer) => {
  if (msg.length < 2) {
    return { msgId: null, data: new Uint8Array() }
  }

  const msgId = msg.readUInt16BE(0)
  // readUInt16BE() 方法用於從『給定的 Buffer 或 TypedArray 中讀取無符號的 16 位整數值，並且默認按照大端字節順序（Big Endian）進行解析』。大端字節順序意味著較高的有效字節位於內存的較低地址處。
  // 在處理網絡通信或二進制數據時，通常需要考慮數據的字節順序。大多數網絡協議都使用大端字節順序進行數據傳輸，因此在解析這些數據時，需要使用 readUInt16BE() 方法來確保正確地解析整數值。
  const data = new Uint8Array(msg).slice(2)
  // 將消息的剩余部分提取出來，可能用於進一步處理消息中的數據。
  return { msgId, data }
}


const sendMessages = (msgId: number, messageContent: Uint8Array) => {
  const content = Buffer.from(messageContent)
  // Buffer.from創建一個新的Buffer實例。messageContent是一個Unit8Array型的字節數組，因此被轉換為Buffer實例。主要是因為Websocket發送的是二進制數據，需要將內容轉換為Buffer
  const sendData = pkgMsg(msgId, content)

  send(sendData)
}

const pkgMsg = (msgId: number, data: Buffer) => {
  const buf = Buffer.alloc(2 + data.length)
  // 返回一個指定大小的 Buffer 實例，如果沒有設置 fill，則默認填滿 0
  buf.writeUInt16BE(msgId, 0)
  // 將msgId寫入Buffer開頭。
  data.copy(buf, 2)
  // 使用上面這行，將數據複製到Buffer中，從偏移量為2的位置開始
  return buf
}

```

## 參考文章
[DAY12 - 檔案類的物件關係釐清(1) - File, FileList, Blob](https://ithelp.ithome.com.tw/articles/10271735)
[微信小程序websocket使用protobuf，发送arraybuffer](https://blog.csdn.net/qq_31754591/article/details/130995991)
[WebSocket系列之JavaScript字符串如何与二进制数据间进行互相转换](https://juejin.cn/post/6844903585528954894)
[WebSocket系列之二进制数据设计与传输](https://juejin.cn/post/6844903585969340424#heading-6)

