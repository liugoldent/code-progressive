---
description: react useEffect
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useEffect
## 概念
* 在組件「渲染之後」，做這個useEffect，因此也適合拿來做呼叫API後取得資料
* effect 指的是副作用，也就是與React本身無關，而需要被執行的動作稱作副作用，這些動作像是發送API請求資料
## 使用
### 基本使用
* 這個方法的參數中需要帶入一個函式，而這個函式會在畫面渲染完成「後」被呼叫
```jsx
const Component = () => {
  console.log('first')

  useEffect(() => {
    console.log('useEffect')
  })

  return (
    <>
      <div>
        {console.log('render')}
      </div>
    </>
  )
}
// first -> render -> useEffect
```
## 類似生命週期的使用
### 模擬ComponentDidMount
* 第一次渲染時，因為dependencies的值剛被帶入，所以會做一次useEffect的函式
* 第二次畫面渲染完時，因為不會再次呼叫setCurrentWeather，如此避免掉無窮迴圈的問題
```jsx
import React, { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    console.log('Component mounted');
    // 在這裡進行初始化操作或資料獲取
    return () => {
      console.log('Component will unmount');
      // 在這裡進行清理操作（如果有需要）
    };
  }, []);

  return <div>My Component</div>;
};
```
### 模擬ComponentDidUpdate
* 如果沒有給相依的參數，那麼就每次渲染完都會執行
```jsx
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will unmount');
      // 在這裡進行清理操作（如果有需要）
    };
  }, []);

  return <div>My Component</div>;
};

```

### 模擬 componentWillUnmount
* 內部return 一個function，該函式將在組件將要卸載時被調用，類似於 componentWillUnmount。
```jsx
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component will unmount');
      // 在這裡進行清理操作（如果有需要）
    };
  }, []);

  return <div>My Component</div>;
};
```




