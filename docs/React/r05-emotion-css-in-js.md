---
description: react CSS in JS
tags:
  - javascript
  - react
  - frontEnd
---

# [React] Css in JS
## 概念
* 傳統上大部分是將CSS 切出一個檔案
* CSS in JS則是

## 操作
### 1. 直接定義Style Component
1. 透過import 將 emotion 導入
2. 定義帶有styled的component
  * 要建立帶有樣式的`<div>`標籤時，只需要使用`styled.div`
  * 如果要建立`<button>`標籤，只需要使用`styled.button`
```js
import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

// 使用 css 定義全域樣式
const globalStyles = css`
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
  }
`;

// 使用 styled 定義具名稱的樣式組件
const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const App = () => {
  return (
    <>
      {/* 將全域樣式應用在此 */}
      <Global styles={globalStyles} />

      <div>
        <h1>Hello, CSS in JS with Emotion!</h1>
        <p>This is a simple example of CSS in JS using Emotion.</p>
        <StyledButton>Click Me!</StyledButton>
      </div>
    </>
  );
};

export default App;
```
3. 幫剛剛定義好帶有styled的Component放入JSX中

### 2. 為已經有的Component添加樣式
```jsx
// CloudyIcon -> Component
const Cloudy = styled(CloudyIcon)`
  /* 在這裡寫入 CSS 樣式 */
  flex-basis: 30%;
`;
```

## 透過Props傳資料
```jsx
// props 會是 {theme: "dark", children: "台北市"}
const Location = styled.div`
  ${props => console.log(props)}
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;
```

## 如果想將已經有的CSS樣式放入Component
```jsx
import { css } from '@emotion/react';

const buttonMixin = css`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledButton = styled.button`
  ${buttonMixin}
`;

const AnotherButton = styled.button`
  ${buttonMixin}
  font-size: 18px;
`;
```

















