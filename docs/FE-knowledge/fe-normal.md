---
description: 平常知識點
tags: 
    - normal
    - frontend
---

# FE-Normal

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


