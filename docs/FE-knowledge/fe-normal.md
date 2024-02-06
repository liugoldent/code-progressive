---
description: 平常知識點
tags: 
    - normal
    - frontend
---

# [FE] Normal

## 當前端使用者併發多個請求，如果只送一個（例如防抖）
[q5394](https://github.com/haizlin/fe-interview/issues/5394)
### 原生js實現（debounce、防抖）
```js
// 指在一定的時間內，如果使用者一直點擊，則只會觸發最後一次（因為每一次都會清掉之前的timer
function debounce(func, delayTime){
  let timer
  return function(){
    clearTimer(timer)
    timer = setTimeout(()=>{
      func.apply(this, arguments)
    }, delayTime)
  }
}
```
```js
// call api 主程式
// request是一個防抖函數，他將在500ms之後執行，但是如果使用者在這500ms內再按一次，計時器會重新啟動，並且等待500ms。以確保只有一次觸發會發送請求
const request = debounce(()=>{
  // call api
}, 500)
```
### 原生js實現（節流）
```js
function throttle(func, delayTime){
  let timer
  return function(){
    if(!timer){
      timer = setTimeout(()=>{
        func.apply(this, arguments)
        timer = null
      }, delayTime)
    }
  }
}
```
```js
// call api 主程式
// request是一個節流函數，他將在500ms之後執行，可以確保使用者在一段時間內只執行一次func（因為return function內的if擋掉多次需求）
const request = debounce(()=>{
  // call api
}, 500)
```
### vue + axios
如果在Vue中使用Axios發送請求，可以使用axios的`cancelToken`來取消重複的請求，從而實現多個相同的請求只發送一個的效果。
#### 1. 創建cancelToken
```js
export default (){
  data() {
    return {
      // 首先在這邊要先創建一個cancelToken
      cancelToken: axios.CancelToken.source().token,
      // 然後要記住使用者最後呼叫的token
      lastRequestCancelToken: null
    }
  },
  methods: {
    fetchData() {
      // 在發送請求前，要先取消之前正在進行的相同請求。
      if (this.lastRequestCancelToken) {
        this.lastRequestCancelToken.cancel('取消重复的请求');
      }
      // 先讓最後一次的token = 此次呼叫的token
      this.lastRequestCancelToken = this.cancelToken;
      axios.get(url, {
        // 讓此次的token = cancelToken
        cancelToken: this.cancelToken
      }).then(response => {
        // 处理响应结果
      }).catch(error => {
        // 处理请求错误
      });
    }
  }
}

```
## 如何實現無感刷新token
[q5393](https://github.com/haizlin/fe-interview/issues/5393)
需要前後端的配合，詳細過程如下
1. 在用戶登陸時，server端返回一個token與過期時間
2. 前端將token保存在客戶端的localStorage or cookie，並設置一個timer，在token過期前一段時間（如5分鐘），自動向server發送一個請求，以取得新token
3. 在server端會判斷此token是否過期，若過期則返回新的token與時間，沒過期則返回原本的過期時間與token
4. 在client端，如果收到新的token與時間，就更新並重置定時器。

## 如何得到localStorage、sessionStorage的大小
[q5392](https://github.com/haizlin/fe-interview/issues/5392)
主要可以透過js `getItem`的方式取得localStorage、sessionStorage，而因為這兩者都是字串，所以可以用`JSON.stringify()`來獲取大小
```js
// 定義計算的function
function getStorageSize(storage) {
  var size = 0;
  
  for (var i = 0; i < storage.length; i++) {
    // 先取得key -> storage.key 為localStorage、sessionStorage專用
    var key = storage.key(i);
    // 再用getItem(key)取得value
    var value = storage.getItem(key);
    // 最後將兩者相加後，用JSON.stringify，取得其length
    var itemSize = JSON.stringify(key + value).length;
    // 加起來
    size += itemSize;
  }
  
  return size;
}

// 获取localStorage大小
var localStorageSize = getStorageSize(localStorage);

// 获取sessionStorage大小
var sessionStorageSize = getStorageSize(sessionStorage);
```

## 如何得到cookie的大小
[q5391](https://github.com/haizlin/fe-interview/issues/5391)
由于 cookie 可以包含多个键值对，所以需要将 cookie 字符串分割为单个 cookie 并计算它们的大小。
```js
function getCookieSize() {
  // 首先cookie可以從document.cookie取得，並且用split，將其分成陣列
  var cookies = document.cookie.split(';');
  var size = 0;
  // preferred_color_mode=dark; tz=Asia%2pei; _octo=GH1.1.696124849.16
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    // 當cookie的第一個字元為空時（如上面為空）
    while (cookie.charAt(0) === ' ') {
      // 則往後取得這串cookie文字
      cookie = cookie.substring(1);
    }
    // 最後把size加上去
    size += cookie.length;
  }
  
  return size;
}
```

## MD5
* Mesage Digest Algorithm 5
* 是一種常用的Hash Function，用於將數據轉為固定長度地散列值。常用於驗證數據的完整性，例如檢查下載文件是否被修改。然而由於安全問題，MD不再推薦用於密碼儲存or其他安全目的

## Base64
* 是一種二進制數據轉換為可打印字符的編碼方案。
* 其將數據分為固定大小的塊，並將每個塊轉換為可打印字符。
* Base64常用於不支援二進制數據傳輸的地方（如電子郵件）相關的傳輸or存儲

## MVC
* Model：模型（負責主要邏輯）
* View：視圖（負責顯示與用戶介面）
* Controller：控制器（控制器負責處理用戶輸入並協調模型&視圖之間的交互）

## Stored Procedure（儲存過程）
* 為一組預先編寫並儲存在資料庫的SQL代碼。可以被視為可重複使用的數據庫操作
* 通過調用儲存過程的名稱來執行相關代碼。可以提高數據庫性能、簡化數據庫操作&實現業務邏輯

## JSON
* 為一種輕量級的數據交換格式，常用在不同系統之間傳輸數據。
* 他以易於理解和生成的方式表示結構化數據，支援數組、物件、字串、數字、布林、空值等數據
* 並且為跨語言，因此在不同語言都有其內建的JSON解析與生成器。

## SPA 首屏加載速度慢怎麼解決
* First Contentful Paint：通過`DOMContentLoad` or `performance`來計算出首屏時間
### 加載慢的原因
* 網路延遲問題
* 資源文件體積過大
* 資源重複請求去加載
* 加載腳本時，渲染內容堵塞

### 解決方案
* 減少入口文件大小：例如懶加載，把不同路由對應的組件分割成不同的程式，等待路由被請求時再單獨打包路由
```js
routes:[ 
    path: 'Blogs',
    name: 'ShowBlogs',
    component: () => import('./components/ShowBlogs.vue')
]
```
* 靜態資源本地緩存
  * 後端
    * 採用HTTP緩存、設置Cache-control、Last-Modified
    * 採用Service Worker離線緩存
  * 前端
    * 採用LocalStorage
* UI框架按需要加載
* 圖片資源壓縮
* 組件重複打包
```js
// 設置webpack的CommonsChunkPlugin，會把使用3次以上的包抽離出來，放到公共依賴文件
minChunks: 3
```
* 開啟GZip壓縮
* 使用SSR



