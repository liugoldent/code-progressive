---
description: react router v6 詳解
tags:
  - javascript
  - react
  - frontEnd
---
# [React] React Router v6 詳解

## 參考文章
[React Router 6 (React路由) 最详细教程](https://juejin.cn/post/7080210786076852231)
[新版 React router 怎麼用？ React-router-dom v6！](https://molly1024.medium.com/%E6%96%B0%E7%89%88-react-router-%E6%80%8E%E9%BA%BC%E7%94%A8-react-router-dom-v6-8c0624642fce)

## 詳解
### 什麼是react-router
* SPA：單頁面應用，通常只有一個`index.html`，所以我們控制著瀏覽器的網址，並且用js改變其內容。
* 特點
  * 只涉及一個頁面
  * 僅更改歷史紀錄
  * 用戶以為自己在不同頁面中切換

### 舊版的React router
```jsx
<switch>
    <route exact path='/' component={Home}/>
    <route path='/posts/:id' component={PostA}/>
    <route path='/posts'  component={PostC}/>
</switch>
```

### 常用react-router API
#### BrowserRouter
* 使用於最外層
* 內部實現是透過`history`、`React Context`來實現，所以當使用者前一頁後一頁時，`history`會紀錄這些歷史紀錄
```jsx
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
, document.getElementById('app))
```

#### Route
* 用來定義，路徑與組件之間的關係
```jsx
<Route path="/about" element={<About />} />
```

#### Routes
* 主要用於包住一系列的`Route`
```jsx
```

#### useLocation 獲取當前頁面資訊
* 狀況：當我們想要知道使用者當前路徑資訊是什麼時，可以使用此hook
* 其包含
  * hash
  * key
  * pathname
  * search
  * state
```jsx
import { useLocation } from 'react-router-dom'
const About = () =>{
  const location = useLocation()
  const { from , pathname } = location
  // from 代表之前路徑
  // pathname 代表目前路徑
}
```
#### useParams抓取動態參數
* ex：http://localhost:3000/list/child2/666
-> 666為動態參數，會被抓出來

#### useSearchParams抓取網址參數
```jsx
const [getParams, setParam] = useSearchParams()
// getParams取得網址參數
// setParams設定網址參數
```

#### useRoutes
可以將App元件底下的router包成一個值（像是Vue router預設使用情境）
```jsx
const routeConfig = [
  {path: '/', element={<XXX />}},
  {
    path: '/list',
    element: <List />,
    children: [
        { path: '/list/child1', element: <Child1 /> },
        { path: '/list/child2/:id', element: <Child2 /> },
    ],
  },
]
const element = useRoutes(routeConfig)
```

#### useHistory to useNavigate
* 過去的router為`useHistory`，v6後改為`useNavigate`
```jsx
import {useNavigate} from 'react-router-dom'
```

### 默認路徑
* 當使用者亂輸入，或是沒有此頁時，我們可以利用`*`來表示錯誤路徑
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<ErrorPage />} />
</Routes>
```

### 如何管理權限
#### React
* 可以使用`route`的`onEnter`
```jsx
<Route path="/home" component={App} onEnter={(nexState,replace)=>{
  if(nexState.location.pathname!=='/'){
    // 做出權限判斷
  }
}}>
```
