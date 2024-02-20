---
tags: 
    - javascript
    - Test
---
# [FE] 程式基礎知識
## SOLID
* SRP -> 單一職責原則：讓一個類去做一件事，如果有要做更多事，請解構。降低單一功能或類別被「改變」所影響的機會。
* OCP -> 開放封閉原則：當新增需求的時候（功能變化），在不改變現有程式碼的前提之下，藉由增加新的程式碼來實作新的功能。
* LSP -> 李氏替換原則：透過繼承時子類別所造成的「行為變化」要如何設計，才不至於違反父類別介面的合約。
* ISP -> 介面隔離原則：針對不同的功能，提供不同的Adapter。透過Adapter，只開放功能所需的函數給它們。
* DIP -> 依賴反轉原則：使高層次的模組不依賴於低層次的模組，避免caller（上層程式）因為callee（底層程式）改變而被迫改變。

## GET vs post
* POST
  * 請求會把請求的資料放置在HTTP請求包的包體中
  * 瀏覽器先傳送header，返回100後，瀏覽器在傳送data出去，伺服器返回200
  * 兩個TCP包
* GET
  * GET請求 會把資料放在URL上（實際應用中資料不涉及到安全性，可用這個）
  * GET 產生的URL可以作為標籤或存於歷史記錄中
  * GET請求 會被主動cache
  * 請求會把header & data 送出去，返回200
  * 一個TCP包

## websocket
出現主要是為了解決server有連續變化時，client要得知很麻煩的問題
**也就是允許server端主動向client端推送數據**
* 在建立連線之後，可以實現 client 與 server 的雙向溝通機制，雙方可以即時的交換資訊，不用一直透過輪詢or一直request
* 數據輕量化
* 沒有同源限制
* 協議是ws，加密是wss

[JavaScript | WebSocket 讓前後端沒有距離](https://medium.com/enjoy-life-enjoy-coding/javascript-websocket-%E8%AE%93%E5%89%8D%E5%BE%8C%E7%AB%AF%E6%B2%92%E6%9C%89%E8%B7%9D%E9%9B%A2-34536c333e1b)


## 參考文章
[搞笑談軟工](http://teddy-chen-tw.blogspot.com/2014/04/solid.html)
[SOLID五大设计原则](https://juejin.cn/post/7015582644645675044)

