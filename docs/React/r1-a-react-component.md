---
description: react Component
tags:
  - javascript
  - react
  - frontEnd
---
# [React] React Component
## Class Component
### 基本程式
* props放在constructor中
* 狀態要加上this
* onClick也要加上this
#### 生命週期
1. constructor(props): 初始化組件的狀態，並設置初始的count為0。
2. componentDidMount(): 在組件已插入到DOM中後被調用，這是進行初始資料請求或訂閱的好時機。
3. componentDidUpdate(prevProps, prevState): 在組件更新後被調用，可以用來處理更新後的操作。在這裡，我們比較了前一個狀態和當前狀態的count值。
4. componentWillUnmount(): 在組件將要從DOM中移除之前被調用，這是進行清理操作（例如取消訂閱）的好時機。
```jsx
import React, { Component } from 'react';

class LifecycleExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
    console.log('Constructor');
  }

  componentDidMount() {
    console.log('Component Did Mount');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component Did Update');
    console.log('Previous State:', prevState.count);
    console.log('Current State:', this.state.count);
  }

  componentWillUnmount() {
    console.log('Component Will Unmount');
  }

  increaseCount = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    console.log('Render');
    return (
      <div>
        <h1>Class Component with Lifecycle</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increaseCount}>Increase Count</button>
      </div>
    );
  }
}

export default LifecycleExample;

```
## Function Component 
```jsx
import React, { useState, useEffect } from 'react';

const FunctionComponentWithHooks = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component Did Mount');
    return () => {
      console.log('Component Will Unmount');
    };
  }, []);

  useEffect(() => {
    console.log('Component Did Update');
    console.log('Count:', count);
  }, [count]);

  const increaseCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  console.log('Render');

  return (
    <div>
      <h1>Function Component with Hooks</h1>
      <p>Count: {count}</p>
      <button onClick={increaseCount}>Increase Count</button>
    </div>
  );
};

export default FunctionComponentWithHooks;

```

