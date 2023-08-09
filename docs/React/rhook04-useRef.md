---
description: react useRef
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useRef
## 概念
### Controlled vs Uncontrolled Components
* 資料受到React 控制 or 沒辦法受React控制的組件
* 表單資料交給 React 來處理的就稱作 Controlled Components，也就是受 React 控制的資料
* 不把表單資料交給 React，而是像過去一樣，選取到該表單元素後，才從該表單元素取出值的這種做法，就稱作 Uncontrolled Components，也就是不受 React 控制的資料。

### useRef使用時機與使用方法
* 有時會想要簡單的從表單取得某個值，或是想要操作DOM，可以這樣使用
* useRef 除了可以搭配 ref 指稱到某一 HTML 元素來使用之外，當我們在 React 組件中想要定義一些「變數」，但當這些變數改變時，又不需要像 state 一樣會重新導致畫面渲染的話，就很適合使用 useRef
* useRef會回傳一個物件
```jsx
const ref = React.useRef(0);
console.log(ref); // { current: 0 }
```
* 要對數值做操作需要使用`.current`
```jsx
const App = () => {
  let ref = React.useRef(0);

  React.useEffect(() => {
    ref.current += 1;
    console.log(ref); // { current: 1 }
  }, []);

  return (
    <div>
    </div>
  );
}
```
### 注意：不會觸發重新render
* useRef更改數值時，不會觸發重新render
## 程式
### 基本程式 - 使用ref綁定資料
```jsx
import React, { useRef } from 'react';

const RefExample = () => {
  // 使用 useRef 創建一個 ref
  const inputRef = useRef(null);

  const handleFocus = () => {
    // 使用 ref.current 來獲取 DOM 元素的引用
    inputRef.current.focus();
  };

  return (
    <div>
      <h1>useRef Example</h1>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
};

export default RefExample;

```
### 修改數據
```jsx
import React, { useRef } from 'react';

const RefExample = () => {
  const countRef = useRef(0);

  const handleIncrement = () => {
    // 修改 useRef 的 current 屬性
    countRef.current += 1;
    console.log('Updated count:', countRef.current);
  };

  return (
    <div>
      <h1>useRef Example</h1>
      <p>Count: {countRef.current}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
};

export default RefExample;

```


