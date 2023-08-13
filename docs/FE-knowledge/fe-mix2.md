---
description: FE 面試
tags: 
    - JS
    - frontend
---

# [FE] Interview V3

## 簡單說明SSR原理
* 是一種網頁渲染的方法，其原理是在伺服器端生成完整的 HTML 頁面，然後再將這些 HTML 頁面發送到客戶端，以提供更快的頁面加載速度和更好的搜索引擎優化（SEO）。

### SSR 的原理可以簡要描述為以下步驟：

* 接收請求：當用戶訪問網站時，伺服器接收到請求。

* 生成 HTML：伺服器使用事先定義好的路由和頁面組件，動態地生成完整的 HTML 頁面。這包括呈現內容、資料提取和填充模板。

* 填充資料：在生成 HTML 頁面時，伺服器可能需要從資料庫或外部 API 獲取必要的數據，並將這些數據填充到頁面中。

* 發送 HTML：生成的 HTML 頁面被發送到客戶端的瀏覽器。

* 客戶端互動：瀏覽器接收到 HTML 頁面後，可以立即顯示內容，同時開始加載 JavaScript 代碼。一旦 JavaScript 加載完成，網站可以變得交互式，並與用戶互動。

* 注水（Hydration）：當客戶端的 JavaScript 加載完成後，它可以重新使用伺服器生成的 HTML，並將其轉換為可交互的應用程式。這個過程稱為“注水”，可以保持頁面的狀態並支援客戶端互動。

### 優缺點
#### 優點
* 主要優點是它可以提供更快的首次頁面加載時間，因為用戶可以立即看到伺服器生成的 HTML 內容，而不需要等待 JavaScript 的下載和執行。此外，SSR 也有助於提高搜索引擎對網站的索引能力，因為搜索引擎可以爬取伺服器生成的 HTML 頁面。

#### 挑戰
* 挑戰，例如伺服器的計算負載增加、複雜性增加以及客戶端和伺服器端代碼的一致性等。


## JS中的Promise是什麼?
* 處理異步操作的一種機制，它可以更優雅地處理非同步的任務，例如 AJAX 請求、文件讀取、定時器等。Promise 通常用於處理需要時間來完成的操作，並且可以更好地控制代碼的流程和處理錯誤。

### 主要特點
* 狀態管理：Promise 有三種狀態：待定（pending）、已實現（resolved）和已拒絕（rejected）。初始時處於待定狀態，之後可以變為已實現或已拒絕。這使得我們可以追蹤操作的進度和結果。

* 鏈式調用：Promise 允許你通過 .then() 方法來註冊在操作成功後執行的函數，以及通過 .catch() 方法來處理操作失敗時的錯誤。

* 解決回調地獄：Promise 的鏈式調用可以幫助避免回調地獄（callback hell），使代碼更容易理解和維護。

* 支援並行操作：Promise 可以組合多個異步操作，以同時執行它們，並在它們都完成後執行後續操作。

* 錯誤處理：Promise 允許你使用 .catch() 方法來處理操作中可能出現的錯誤，使得錯誤處理更加優雅。

```js
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = "Hello, Promise!";
      if (data) {
        resolve(data); // 操作成功
      } else {
        reject("Error: Data not available."); // 操作失敗
      }
    }, 1000);
  });
};

fetchData()
  .then(result => {
    console.log(result); // 成功時輸出 "Hello, Promise!"
  })
  .catch(error => {
    console.error(error); // 失敗時輸出錯誤信息
  });

```






















