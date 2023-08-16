---
description: react router Lazy Loading
tags:
  - javascript
  - react
  - frontEnd
---

# [React] React router Lazy Loading
## Lazy Loading
* React 應用程式變得越來越大時，包含多個組件和頁面，你可能會遇到應用程式啟動時的性能問題。Lazy loading（延遲加載）是一種技術，用於優化應用程式的初始加載時間，通過僅在需要時動態加載組件或模組，而不是一次性加載所有內容。
* 在fallback中，可以接收一個元件
```jsx
import React, { lazy, Suspense } from 'react';

// 使用 React.lazy 延遲加載組件
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <h1>Lazy Loading Example</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

export default App;

```




