---
description: react router
tags:
  - javascript
  - react
  - frontEnd
---

# [React] React router

## 概念
* 基本上的SPA，我們都是對「index.html」做操作
* 所以像是網址後面接/xx /bb，這種其實都還是index.html，要達到這樣的結果，就是使用react router

## HashRouter
1. 引入HashRouter，將他包住App
```jsx
import React from 'react'
import { HashRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
```

## 使用 path elment
* 使用 path 屬性指定路由的路徑
* 使用 element 屬性來指定渲染的元件。
* 記得Link 要放routes外面
```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';

function App() { 
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
                {/* Link按鈕 */}
                <Link to="/">Home</Link>
            </li>
            <li>
                {/* Link按鈕 */}
                <Link to="/about">About</Link>
            </li>
            <li>
                {/* Link按鈕 */}
                <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <Routes>
            {/* 實際渲染的地方 */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

```

## 使用 巢狀路由
```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link, Outlet } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import SubPage from './SubPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />}>
          <Route path="subpage" element={<SubPage />} />
        </Route>
        <Route path="/contact" element={<Contact />} />
      </div>
    </Router>
  );
}

export default App;


```

## Link to 屬性
### 基本使用的to
```jsx
<Link to="/about">Go to About</Link>
```
### 進階物件
* pathname: 目標路由的路徑。
* search: 查詢字串，可以包含查詢參數，例如 ?name=John。
* hash: 片段標識，例如 #section。
* state: 可選的狀態物件，用於在路由之間傳遞數據。
```jsx
<Link
  to={{
    pathname: "/about",
    search: "?name=John",
    hash: "#section",
    state: { from: "home" }
  }}
>
  Go to About
</Link>
```
路由就會變成以下狀態
```jsx
http://example/#/??name=John#section
```
#### after React Router V6
state寫在外面
```jsx
<Link
  to={{
    pathname: "/about",
    search: "?name=John",
    hash: "#section",
  }}
  state= {{
    products: {
        id: '1',
        name: 'Al'
    }
  }}
>
  Go to About
</Link>
```
### 路由之後的頁面取值：使用useLocation
```jsx
const { state } = useLocation();
  
useEffect(() => {
  console.log(state); // { products: { id: '1', name: 'Al' } }
},[]);
```
## NavLink
* 與Link不同是，他在激活時，會有一個active的class
* React router 6 之後，棄用`activeClassName`
```jsx
<NavLink
  to="/"
  className={({ isActive }) => 
    [
      'border p-3 hover:bg-indigo-600 duration-500',
      isActive ? 'router-link-active' : null
    ].join(' ')
  }
>
  Home
</NavLink>
```




















