---
description: react useState
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useState
## 概念
* useState 是 React 中的一個 Hook，用於在 Function Component 中添加狀態（state）。它允許您在無需使用類別組件的情況下，在 Function Component 中添加內部狀態
* 使用 useState，您可以在 Function Component 中儲存和更新狀態，並根據狀態的變化重新渲染元件。
* 在React中，看到use開頭的，就是`Hook`
* 在 React 中講到「狀態（state）」時，一般你可以直接把它成「資料（data）」來理解。
### 操作
* useState會回傳一個陣列，通常我們會使用陣列解構取出兩個變數，第一個當作渲染，第二個是告知React資料有變化，要重新re-render

## 基本程式
### 正常會更新的寫法
#### 更新原則
* setCount 被呼叫到
* count 的值確實有改變
```jsx
import React, { useState } from 'react';

const MyComponent = () => {
  // 使用 useState 定義狀態變數 count，並設置初始值為 0
  const [count, setCount] = useState(0);

  // 這是一個處理按鈕點擊事件的函式
  const handleIncrement = () => {
    setCount(count + 1); // 使用 setCount 更新狀態 count
  };

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default MyComponent;
```
### 不會更新的寫法
#### 1. 沒有使用setCount 改變變數
#### 2. 有使用setCount，但是變數狀態沒有改變

## useState的物件型別使用
### 物件
```jsx
const Form = () => {
  // 使用 useState 定義一個包含多個屬性的物件狀態
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  // 更新物件狀態時，需要使用 spread operator (...) 來複製原有的物件
  const handleInputChange = event => {
    const { name, value } = event.target;
    // prevFormData 記得也要放入這個prev...的，這樣react才可以知道舊資料有哪些
    setFormData(prevFormData => ({
      // 注意這邊要使用...，不能只set一個值
      ...prevFormData,
      [name]: value,
    }));
  };
}
```
### 陣列
```jsx
import React, { useState } from 'react';

const ArrayExample = () => {
  const [numbers, setNumbers] = useState([1, 2, 3]);

  const handleAddNumber = () => {
    // 使用展開運算子創建新陣列，並在末尾添加新的數字
    setNumbers([...numbers, 4]);
  };

  return (
    <div>
      <h1>Array Example</h1>
      <ul>
        {numbers.map((number, index) => (
          <li key={index}>{number}</li>
        ))}
      </ul>
      <button onClick={handleAddNumber}>Add Number</button>
    </div>
  );
};

export default ArrayExample;

```
