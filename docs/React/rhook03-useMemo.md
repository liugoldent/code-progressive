---
description: react useMemo
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useMemo

## 概念
* 當需要某種複雜的計算，並將數值保存起來時，可以使用useMemo
* 記得執行時間：會在組件渲染時被呼叫

## 程式
### 基本使用
```jsx
import React, { useState, useMemo } from 'react';

const ExpensiveCalculation = () => {
  const [number, setNumber] = useState(0);

  // 使用 useMemo 緩存計算結果
  const squaredNumber = useMemo(() => {
    console.log('Calculating squared number...');
    return number ** 2;
  }, [number]);

  return (
    <div>
      <h1>Expensive Calculation Example</h1>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <p>Squared number: {squaredNumber}</p>
    </div>
  );
};

export default ExpensiveCalculation;
```

## useEffect 與 useMemo的替換
```jsx
useCallback(fn, deps) 等同於 useMemo(() => fn, deps)
```



