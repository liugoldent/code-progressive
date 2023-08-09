---
description: react useReducer
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useReducer
## 概念
* 算是`useState`的進階版
* 滿接近Redux的寫法、類似於Vuex、Pinia
* 不完全可以取代Redux
## 語法
```js
const [state, dispatch] = useReducer(reducer, initialState, init);
```

## 注意事項
* dispatch：傳入一個物件
```js
dispatch({ type: "decrement" })
```

## 程式
```jsx
import React, { useReducer } from 'react';

// reducer 函數，接受兩個參數：當前的 state 和 action，返回新的 state
const reducer = (state, action) => {
    // dispatch傳過來，會有type，會對應到action.type => 去做出相對應的動作
    switch (action.type) {
        case 'INCREMENT':
            return { count: state.count + 1 };
        case 'DECREMENT':
            return { count: state.count - 1 };
        default:
            return state;
    }
};

// 在外面定義好initialState
const initialState = { count: 0 };

const Counter = () => {
  // 使用 useReducer，傳入 reducer 函數和初始 state（reduce, initialState都在外部定義）
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      {/* dispatch一個物件 */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>Decrement</button>
    </div>
  );
};

export default Counter;
```

