---
description: react router Hook
tags:
  - javascript
  - react
  - frontEnd
---

# [React] React router Hook
## useLoaction
* 如果我們想要取得Link內的參數時，可以使用useLocation來取得相關訊息
* location.pathname: 當前路由的路徑。
* location.search: 查詢字串，可以包含查詢參數，例如 ?name=John。
* location.hash: 片段標識，例如 #section。
* location.state: 狀態資訊，通過路由導航時傳遞的狀態物件。
```jsx
<Link to={{
    pathname: '/products',
    search: 'q=ray',
    hash: '#products',
  }}
  state={{
    products: {
      id: '1',
      name: 'QQ 產品'
    }
  }}>
  產品詳細
</Link>
```
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function CurrentLocation() {
  const location = useLocation();

  return (
    <div>
      <h2>Current Location</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search}</p>
      <p>Hash: {location.hash}</p>
      <p>State: {location.state && location.state.from}</p>
    </div>
  );
}

export default CurrentLocation;
```
## useParams
* 想要取得route上的參數時可以使用，例如說以下路徑想要取得:id的數值
```shell
# route => /products/:id
```
```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function UserDetails() {
  const { id } = useParams();

  return (
    <div>
      <h2>User Details</h2>
      <p>User ID: {id}</p>
    </div>
  );
}
export default UserDetails;
```

## useNavigate
* 用於重新導向
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavigationExample() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    // 使用 useNavigate 進行程式性的路由導航
    navigate('/about');
  };

  return (
    <div>
      <h2>Navigation Example</h2>
      <button onClick={handleNavigation}>Go to About</button>
    </div>
  );
}
export default NavigationExample;
```
## useRoutes
* 有點像vue-router，將路由都寫在檔案中
```jsx
import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

function Home() {
  return <div>Home Page</div>;
}

function About() {
  return <div>About Page</div>;
}

function NotFound() {
  return <div>Page Not Found</div>;
}

const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

function App() {
  const routing = useRoutes(routes);

  return (
    <Router>
      <div>
        {routing}
      </div>
    </Router>
  );
}

export default App;

```




















