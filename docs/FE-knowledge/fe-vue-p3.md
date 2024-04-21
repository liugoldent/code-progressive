---
description: vue 面試常見問題
tags:
  - javascript
  - Test
  - Vue
---

# [FE] Vue - p3

## slot

### 使用場景

- 如果一個組件在不同地方有極少量的更改，可以通過`slot`來達成內部指定內容

### 分類

- 默認插槽

```html
<!-- 子component -->
<template>
  <!-- <div>默认插槽</div>   -->
</template>

<!-- 父component -->
<Child>
  <div>默认插槽</div>
</Child>
```

- 具名插槽

```html
<!-- 子component -->
<template>
  <slot>插槽后备的内容</slot>
  <slot name="content">插槽后备的内容</slot>
</template>
<!-- 父component -->
<child>
  <template v-slot:default>具名插槽</template>
  <!-- 具名插槽⽤插槽名做参数 -->
  <template v-slot:content>内容...</template>
</child>
```

- 作用域插槽
* 插槽上的 name 是一个 Vue 特别保留的 attribute，不会作为 props 传递给插槽
* 子組件可以將數據傳給父組件
```html

<template>
  <slot name="footer" testProps="子组件的值">
    <h3>没传footer插槽</h3>
  </slot>
</template>
<child>
  <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
  <template v-slot:default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
  <template #default="slotProps">
    来⾃⼦组件数据：{{slotProps.testProps}}
  </template>
</child>
```

## object.freeze
[vue利用 object.freeze 提升列表渲染性能](https://www.cnblogs.com/goloving/p/13969685.html)
* 只需要純粹的數據展示，不會有任何改變，就不需要vue透過`object.defineProperty`來劫持數據
* 這時候就使用object.freeze
* `const`和`Object.freeze()`并不同，const是防止变量重新分配，而Object.freeze()是使对象具有不可变性。
```js
export default {
  data: () => ({
    users: {}
  }),
  async created() {
    const users = await axios.get("/api/users");
    // this.users = users;
    this.users = Object.freeze(users);
} };
```

## 什麼是虛擬DOM
### 原理
* 它主要是在內存中「以 JavaScript 物件的形式表示 DOM 樹的一個拷貝」，而不是實際的 DOM 元素。虛擬 DOM 的出現是為了解決直接操作 DOM 所帶來的性能問題。
### 解決什麼
* 在傳統的 Web 開發中，當數據改變時，我們會直接更新真實的 DOM。然而，這種操作非常昂貴，因為 DOM 操作通常是一項耗時的操作。當數據發生改變時，直接操作 DOM 可能會導致多次重排（Reflow）和重繪（Repaint），進而降低應用程序的性能。
* 當數據改變時，我們首先在虛擬 DOM 上進行更新操作，然後將虛擬 DOM 與實際 DOM 進行比較，找出需要更新的部分，最後只更新這些部分，從而避免了不必要的 DOM 操作，提高了性能。

### 工作流程
1. 應用程序狀態（數據）發生改變。
2. 使用虛擬 DOM 庫創建一個新的虛擬 DOM 樹。
3. 將這個新的虛擬 DOM 樹與之前的虛擬 DOM 樹進行比較，找出需要更新的部分。
4. 只更新這些部分到實際 DOM。
5. 更新後，如果應用程序繼續觸發狀態改變，則從步驟 1 重複。

## vue的diff演算法
[diff演算法](https://github.com/febobo/web-interview/issues/24)
### 雙端比較
* Vue 的 diff 演算法同時比較新虛擬 DOM 樹的子節點和舊虛擬 DOM 樹的子節點，從而減少了比較的時間複雜度。

### 同層比較
* Vue 在比較虛擬 DOM 時，會遵循同層比較的原則，即在比較兩個樹的節點時，只會比較同層級的節點，不會跨層級比較，這樣可以減少比較的時間複雜度。

### Key 值
* Vue 在虛擬 DOM 中使用 Key 值來標識節點，從而幫助 Vue 更準確地找出新舊虛擬 DOM 樹中對應的節點，從而避免出現錯誤的差異比較。

## 如何封裝axios
[封裝Axios](https://github.com/febobo/web-interview/issues/25)
### 是什麼
* 是一種清亮的HTTP客戶端
### 特性
* 在瀏覽器中創建XMLHttpRequests
* 從node.js創建https請求
* 支持promise api
* 攔截請求與響應
* 轉換請求數據和響應數據
* 取消請求
* 自動轉換JSON數據
* 客戶端支持防禦XSRF
### 使用
```js
axios({        
  url:'xxx',    // 地址
  method:"GET", // 方法
  params:{      // get请求使用params进行参数凭借,如果是post请求用data
    type: '',
    page: 1
  }
}).then(res => {  
  // res为后端返回的数据
  console.log(res);   
})
```



### 如何封裝
* 可以針對幾點去做封裝
  * header
  * 狀態碼：根據接口返回不同的status，來執行不同的任務，需與後端約定好
  * 請求方法：根據get or post再進行一次封裝，使用起來更便利
  * 請求攔截器：根據請求的請求頭設定，來決定哪些請求可以訪問
  * 響應攔截器：根據後端返回的狀態來決定不同的任務
### 設置接口前綴
* 用環境變數來做判斷，用來區分開發、測試、生產環境
```js
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://dev.xxx.com'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'http://prod.xxx.com'
}
```
### 設置超時時間、header
```js
const service = axios.create({
    timeout: 30000,  // 请求 30s 超时
	  headers: {
        get: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        post: {
          'Content-Type': 'application/json;charset=utf-8'
        }
  },
})
```
### 請求攔截器
```js
import axios from 'axios';

// 添加請求攔截器
axios.interceptors.request.use(
  function(config) {
    // 在請求發送之前做些什麼
    console.log('Request Interceptor:', config);
    // 例如，可以在這裡添加授權 token，修改 headers 等
    return config;
  },
  function(error) {
    // 對請求錯誤做些什麼
    return Promise.reject(error);
  }
);

// 發送一個 GET 請求
axios.get('https://api.example.com/data')
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 響應攔截器
```js
// 响应拦截器
axios.interceptors.response.use(response => {
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (response.status === 200) {
    if (response.data.code === 511) {
      // 未授权调取授权接口
    } else if (response.data.code === 510) {
      // 未登录跳转登录页
    } else {
      return Promise.resolve(response)
    }
  } else {
    return Promise.reject(response)
  }
}, error => {
  // 我们可以在这里对异常状态作统一处理
  if (error.response.status) {
    // 处理请求失败的情况
    // 对不同返回码对相应处理
    return Promise.reject(error.response)
  }
})
```

### axios 取消請求
* 使用cancelTokenSource.cancel
```js
import axios from 'axios';

// 創建一個 CancelToken
const cancelTokenSource = axios.CancelToken.source();

// 發送請求
axios.get('https://api.example.com/data', {
  cancelToken: cancelTokenSource.token
})
  .then(response => {
    // 請求成功的處理邏輯
    console.log('Response:', response.data);
  })
  .catch(error => {
    // 請求失敗的處理邏輯
    if (axios.isCancel(error)) {
      // 如果是由於取消請求而導致的錯誤，則不做任何處理
      console.log('Request was cancelled:', error.message);
    } else {
      // 其他錯誤處理邏輯
      console.error('Error:', error);
    }
  });

// 取消請求
cancelTokenSource.cancel('Request cancelled by the user.');
```

## 說一下vue的項目結構，如果是大型項目你該怎麼劃分結構與組件
### 基本原則
* 文件夾與內部文件的語意一致
  * 如pages底下的文件，應該對應著router的index.js
* 單一入口/出口
  * 例如有多個apis的檔案，但應該要做成單一入口index.js
* 就近原則，緊耦合的文件應該要放一起，且應該要以相對路徑引用
  * 例如引入scss，這種緊耦合的使用相對路徑
* 公共文件應該以絕對路徑的方式從根目錄引用
  * 例如components這種，要使用絕對路徑
* `/src`外的文件不該被引入


## 權限該怎麼做
### 接口權限
* 通常意思是認證、授權、權限管理、限流、安全傳輸、監控和日誌紀錄
* 一般採用jwt來做驗證，沒有通過會返回401，跳轉到登錄頁面重新驗證
```js
axios.interceptors.request.use(config => {
    config.headers['token'] = cookie.get('token')
    return config
})
axios.interceptors.response.use(res=>{},{response}=>{
    if (response.data.code === 40099 || response.data.code === 40098) { //token过期或者错误
        router.push('/login')
    }
})
```
### 按鈕權限
* v-if：但多處都需要
* 通過自訂義指令
```html
<el-button @click='editClick' type="primary" v-has>编辑</el-button>
```
### 路由、菜單權限
* 登陸後，獲取用戶的權限信息，然後篩選有權限訪問的路由，利用addRoutes添加路由
* 或是利用beforeEach，在路由上标记相应的权限信息，跳轉前去做驗證


## 跨域是什麼
* 跨域本質是瀏覽器同源政策的安全手段
* 同源有三個相同點
  * 協議相同（protocol）
  * 主機相同（host）
  * 端口相同（port）
### 如何解決
### JSONP
### CORS
### Proxy - vue.config.js
* proxy：這裡配置了一個代理，用於解決跨域問題。當前端應用需要向 /api 目標發送請求時，代理將這些請求轉發到 http://xxx.xxx.xx.xx:8080 這個目標地址。具體來說，代理將 /api 替換為空字符串，這意味著 /api/getData 將被代理到 http://xxx.xxx.xx.xx:8080/getData。
```js
module.exports = {
    devServer: {
        host: '127.0.0.1', // 本地主機
        port: 8084,
        open: true,// vue项目启动时自动打开浏览器
        proxy: {
            '/api': { // '/api'是代理标识，用于告诉node，url前面是/api的就是使用代理的
                target: "http://xxx.xxx.xx.xx:8080", //目标地址，一般是指后台服务器地址
                changeOrigin: true, //是否跨域
                pathRewrite: { // pathRewrite 的作用是把实际Request Url中的'/api'用""代替
                    '^/api': "" 
                }
            }
        }
    }
}
axios.defaults.baseURL = '/api'
```
### Proxy - nginx
```shell
server {
    listen    80;
    # server_name www.josephxia.com;
    location / {
        root  /var/www/html;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass  http://127.0.0.1:3000;
        proxy_redirect   off;
        proxy_set_header  Host       $host;
        proxy_set_header  X-Real-IP     $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```

## 為什麼vue會出現404
* 因為nginx在設定時，其實只設定到index.html
```shell
server {
  listen  80;
  server_name  www.xxx.com;

  location / {
    index  /data/dist/index.html;
  }
}
```
* hash沒有問題，是因為雖然hash在URL中，但不會被包括在HTTP請求中，對服務端沒有影響，因此改變hash不會重新加載頁面
* history系統解決方案
1. 修改nginx
* $uri：這個變量表示當前請求的 URI。
* $uri/：這個變量表示當前請求的 URI 後跟一個斜杠的情況。
* /index.html：這是 try_files 指令的最後一個參數，指定了當前請求找不到對應文件時應該返回的文件。在這個配置中，如果找不到符合 $uri 或 $uri/ 的文件，則返回 /index.html
```shell
server {
  listen  80;
  server_name  www.xxx.com;

  location / {
    index  /data/dist/index.html;
    try_files $uri $uri/ /index.html;
  }
}
```
```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

## 怎麼處理vue中遇到的錯誤
### 全局處理：errorHandler
```js
Vue.config.errorHandler = function (err, vm, info) {
  // 在這裡處理錯誤，例如記錄錯誤日誌或顯示錯誤提示
  console.error('Global Error Handler:', err, vm, info);
};
```
### 組件處理：errorCaptured
```js
export default {
  data() {
    return {
      error: null
    };
  },
  errorCaptured(err, vm, info) {
    // 在這裡處理錯誤，例如將錯誤存儲到組件數據中，以便在模板中顯示錯誤信息
    this.error = err;
    return false; // 如果希望錯誤繼續向上冒泡，返回 false；否則返回 true
  }
};
```
### promise處理：catch
```js
someAsyncFunction()
  .then(response => {
    // 正常處理響應
  })
  .catch(error => {
    // 處理錯誤
    console.error('Promise Error:', error);
  });

```
### axios處理：response
```js
import axios from 'axios';

axios.interceptors.response.use(response => {
  // 正常處理響應
  return response;
}, error => {
  // 處理錯誤
  console.error('Axios Error:', error);
  return Promise.reject(error);
});

```
