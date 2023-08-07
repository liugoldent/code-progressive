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
* 記得props進去子組件是物件
## 基本程式
### 傳入資料到子組件
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

## React 的slot使用方式
### 1. 直接寫在tag內
```jsx
import React from 'react';

// 父元素
const Card = ({ header, content }) => {
  return (
    <div className="card">
      <div className="card-header">{header}</div>
      <div className="card-content">{content}</div>
    </div>
  );
};

// 使用父元素並傳遞子元素
const App = () => {
  return (
    <div>
      <Card
        header={<h2>Title</h2>}
        content={<p>This is the content of the card.</p>}
      />
    </div>
  );
};

export default App;

```
### 2. 寫在tag之間
```jsx
import React from 'react';

const MyComponent1 = ({ children }) => {
  return (
    <div className="my-component">
      {children}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <MyComponent1>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        <button type="button" className="btn btn-primary">儲存</button>
      </MyComponent1>
    </div>
  );
};

export default App;

```














