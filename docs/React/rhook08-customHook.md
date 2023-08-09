---
description: react customHook
tags:
  - javascript
  - react
  - frontEnd
---

# [React] customHook
## 概念
* 可以利用react hook 來自行組合封裝成新的hook

## 基本程式
### 定義 useCounter
```jsx
import { useState } from 'react';

function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount(count + step);
  };

  const decrement = () => {
    setCount(count - step);
  };

  return {
    count,
    increment,
    decrement,
  };
}

export default useCounter;
```

### 使用它
1. import hook之後，再解構，再來就可以使用
```jsx
import React from 'react';
import useCounter from './useCounter';

function App() {
  const { count, increment, decrement } = useCounter(0, 2);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default App;

```


















