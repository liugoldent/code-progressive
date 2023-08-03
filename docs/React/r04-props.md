---
description: react Props
tags:
  - javascript
  - react
  - frontEnd
---

# [React] Props
## 概念
* 有時我們需要將數據傳給子組件，需要使用到props
## 基本程式
### 傳入子組件
```jsx
// ParentComponent.js
import React from 'react';
import ChildComponent from './ChildComponent';

function ParentComponent() {
  const data = '这是来自父组件的数据';

  const handleClick = () => {
    console.log('按钮被点击了！');
  };

  return (
    <div>
      <h1>React Props 示例</h1>
      {/* 将data和handleClick作为props传递给ChildComponent */}
      <ChildComponent data={data} handleClick={handleClick} />
    </div>
  );
}

export default ParentComponent;
```
### 子組件使用
```jsx
// ChildComponent.js
import React from 'react';

// 用法1：傳入props
function ChildComponent(props) {
  // 使用props中传递的data和handleClick
  const { data, handleClick } = props;

  return (
    <div>
      <p>来自父组件的数据：{data}</p>
      <button onClick={handleClick}>点击按钮</button>
    </div>
  );
}

export default ChildComponent;


// 用法2：直接解構
function ChildComponent({ data, handleClick }) {
  // 使用props中传递的data和handleClick

  return (
    <div>
      <p>来自父组件的数据：{data}</p>
      <button onClick={handleClick}>点击按钮</button>
    </div>
  );
}

export default ChildComponent;
```














