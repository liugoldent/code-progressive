---
description: react CRA - create React App
tags:
  - javascript
  - react
  - frontEnd
---
# [React] React CRA - create React App
## 概念、關鍵字
### CRA
* CRA：create react app

### StrictMode
* 如果開啟strictMode，程式會執行兩次
* StrictMode的效果
  * 發現擁有不安全生命週期的 component
  * 警告使用了 legacy string ref API
  * 警告使用到了被棄用的 findDOMNode
  * 偵測意想不到的副作用
  * 偵測 legacy context API
  * 確保可重用的 state
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // 假設 App 是您的主要應用程式組件
import { StrictMode } from 'react';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

```

### reportWebVitals
```js
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
// 這些就是關於google網站的核心指標
```











ㄒ
