---
description: react useRef
tags:
  - javascript
  - react
  - frontEnd
---
# [React] useContext
## 概念
* 由於Props是單向資料流，並且要一步一步往下傳，但傳遞太深會稍嫌麻煩，所以會使用到useContext
* useContext具有跨元件溝通的技巧
* 用於在組件間共享狀態。透過 useContext，你可以在不同的組件中存取同一個上下文（context）的數據，避免了逐層傳遞 props。
## 程式
* 要使用useContext，必須先要createContext()
* 並且useContext只能接受ContextObject
### 用法
1. 首先在最頂層組件提供上下文
2. 再來在我們要使用的組件使用useContext
```jsx
import React, { createContext, useContext, useState } from 'react';

// 創建一個上下文（context）
const CountContext = createContext();

// 在需要共享的狀態最頂層的組件提供上下文
const CountProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  React.useEffect(()=>{
    console.log('render again')
  })
  
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  );
};

const Counter = () => {
  const { count, setCount } = useContext(CountContext);

   // ❌ Error！不符合 useContext 用法
  const data = useContext('DataContext');

  // ❌ Error！不符合 useContext 用法
  const data = useContext();

  // ❌ Error！不符合 useContext 用法
  const data = useContext(DataContext.Provider);


  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

const App = () => {
  return (
    <CountProvider>
      <div>
        <h1>App</h1>
        <Counter />
      </div>
    </CountProvider>
  );
};

export default App;

```


### createContext 用法
#### Provider
* 傳遞資料用，會搭配value屬性
#### Consumer
* 接收資料，會搭配一個value屬性，但這個實際上會被useContext取代






