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