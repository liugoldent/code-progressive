---
description: react useCallback
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useCallback
## 概念
* 回傳（緩存）（暫存）記憶的函式
* useMemo：回傳記憶的值 = 回傳記憶、暫存或緩存的值
* useCallback：回傳記憶的函式 = 回傳記憶、暫存或緩存的函式
* 我們使用 useCallback 來儲存 handleClick 回調函數，以確保它在組件重新渲染時不會重新創建。有助於避免不必要的子組件重新渲染，因為如果每次重新渲染時都重新創建 handleClick，則 ChildComponent 將會被認為是新的，即使實際上它的內容並未變化。

## 程式
```js
import React, { useState, useCallback } from 'react';

const ChildComponent = React.memo(({ onClick }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onClick}>Click Me</button>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // 使用 useCallback 來儲存 callback 函數，以避免在重新渲染時重新創建函數
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  console.log('ParentComponent rendered');

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Count: {count}</p>
      <ChildComponent onClick={handleClick} />
    </div>
  );
};

export default ParentComponent;
```