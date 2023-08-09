---
description: react JSX
tags:
  - javascript
  - react
  - frontEnd
---

# [React] JSX
## 作用
* 結合 JavaScript 和 HTML： JSX 允許您在 JavaScript 中直接使用 HTML 標記。這樣，您可以在 React 元件中直接編寫結構化的使用者介面，而不需要在 JavaScript 中拼接字串或使用其他模板語言。

## 基本範例
```jsx
import React from 'react';

const MyComponent = () => {
  const name = 'John Doe';
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to my website.</p>
    </div>
  );
};

export default MyComponent;
```

```jsx
const word: string = 'React'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<h1>Hello, {word}!</h1>)
console.log(word)
```

## 包含邏輯的範例
```jsx
import React from 'react';

const MyComponent = () => {
  const isLoggedIn = true;
  const user = { name: 'John Doe', role: 'admin' };

  return (
    <div>
      {/* 使用條件判斷渲染元素 */}
      {isLoggedIn ? (
        <h1>Hello, {user.name}!</h1>
      ) : (
        <h1>Welcome Guest!</h1>
      )}

      {/* 使用條件判斷渲染不同的內容 */}
      {user.role === 'admin' ? (
        <p>You have admin privileges.</p>
      ) : (
        <p>You have regular user privileges.</p>
      )}
    </div>
  );
};

export default MyComponent;
```

## 使用ClassName
* 因為在React中Class屬於關鍵字，所以要定義類別要使用ClassName
```jsx
import React from 'react';

const MyComponent = () => {
  const count = 0;

  return (
    <div className="container">
      <h1 className="title">Counter: {count}</h1>
      <button className="button">Increment</button>
      <button className="button">Decrement</button>
    </div>
  );
};

export default MyComponent;

```

## 使用inline-style
* 記得style是用物件去包裹
### 固定數值
* 物件的屬性名稱會是 CSS 的屬性，但會用「小寫駝峰」來表示；屬性值則是 CSS 的值
```jsx
import React from 'react';

const MyComponent = () => {
  const count = 0;

  // 定義內嵌樣式的 JavaScript 物件
  const containerStyle = {
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '10px',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    marginRight: '10px',
    cursor: 'pointer',
  };

  const handleIncrement = () => {
    // 處理增加計數的邏輯
  };

  const handleDecrement = () => {
    // 處理減少計數的邏輯
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Counter: {count}</h1>
      <button style={buttonStyle} onClick={handleIncrement}>Increment</button>
      <button style={buttonStyle} onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default MyComponent;
```
### 變數Style
```jsx
import React, { useState } from 'react';

const MyComponent = () => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleMouseEnter = () => {
    setIsHighlighted(true);
  };

  const handleMouseLeave = () => {
    setIsHighlighted(false);
  };

  const divStyle = {
    padding: '20px',
    backgroundColor: isHighlighted ? 'yellow' : 'white',
    color: isHighlighted ? 'black' : 'blue',
    fontWeight: isHighlighted ? 'bold' : 'normal',
  };

  return (
    <div style={divStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <h1>React Hook变量样式示例</h1>
      <p>鼠标进入该区域，样式将会变化。</p>
    </div>
  );
}
```

## 元件命名
* 使用大寫開頭
```jsx
// 使用大寫
<Counter />

// 不能使用小寫，因為這樣會被當作一般HTML標籤
<counter />
```
## 資料邏輯
* 有時候我們會想在JSX上加一些邏輯，這時候會需要用到 `&&`、`||`
### && (AND 運算符)：當使用 && 運算符時，如果左邊和右邊的運算元都為真（truthy），則返回 true，否則返回 false。如果左邊的運算元為假（falsy），則不會評估右邊的運算元。
```jsx
// AND 運算符範例
const a = true;
const b = false;
const result1 = a && b; // false，因為 a 為真而 b 為假
const result2 = a && true; // true，因為 a 和 true 都是真
const result3 = false && b; // false，因為 false 為假，不評估 b
```

### || (OR 運算符)：當使用 || 運算符時，如果左邊或右邊的運算元中有一個為真（truthy），則返回 true，否則返回 false。如果左邊的運算元為真（truthy），則不會評估右邊的運算元。
```jsx
// OR 運算符範例
const a = true;
const b = false;
const result1 = a || b; // true，因為 a 為真，不評估 b
const result2 = a ||
```
## onClick的寫法
### 在onClick內的參數需要為：「函數」
```jsx
onClick={handleIncrement} // v

onClick={handleClick('increment')} // handleClick('increment')，代表執行，會立即執行！！
```
### 如果想要function()的方式
```jsx
const handleClick = (type) => {
  return function(){
    if(type === 'a'){
      // ...
    }
    if(type === 'b'){
      // ...
    }
  }
}
```
### prevent事件
* 在vue中，我們可以`@click.prevent`，在react只能自己寫
```jsx
const App = () => {
  const sayHi = (e) => {
    e.preventDefault()
    window.alert('Hello！');
  }

  return (
    <div>
      <a href="https://israynotarray.com/" onClick={ sayHi }>點我</a>
    </div>
  )
}
```
### 常見的on事件
* onClick：button點擊
* onChange：select、input、textarea
* onSubmit：主要用於form表單上
* onKeyDown：鍵盤上按下什麼案件
* onFocus：常見於輸入匡，只要我們關注那個欄位就會觸發事件
* onBlur：離開關注時，會出發

## JSX中要使用表達式（Expression Statements）
### 表達式
* 經過一些符號結合上下語句並運算回傳結果
```js
 <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
    }}
  >
    {counters.map((item) => (
      <Counter />
    ))}
  </div>
```
### 陳述式
* 用於命令執行指定的一系列操作，最大的特徵是不會回傳結果
* 它只會靜靜躺在那邊等你呼叫，最大特徵在於不會回傳任何的結果，但是陳述式必定會先執行過一次
```js
var a = 1
const b = 2
```

## In React - 一個 JSX 元素只能有一個最外層元素 : `React Fragment or <>`
```jsx
// React.Fragment
const Counter = () => {
  <React.Fragment>
    <div>
      ....
      </div>
    <div>
      </div>
  </React.Fragment>
}

// <> => 其限制在於，如果跑迴圈，不可以用<>空的tag
const Counter = () => {
  <>
    <div>
      ....
      </div>
    <div>
      </div>
  </>
}
```
## Input 內的 onChange
```jsx
import React, { useState } from 'react';

function MyComponent() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <h1>React Hook onChange 示例</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
      <p>输入的内容：{inputValue}</p>
    </div>
  );
}

export default MyComponent;
```
## 不可使用Hook的狀況
* 不能在條件式（conditions）、迴圈（loops）、嵌套函式中呼叫Hooks
* 在條件式、迴圈或嵌套函式中呼叫Hooks會導致React在後續渲染中出現錯誤或不一致的狀態。
### 條件式
```jsx
import React, { useState } from 'react';

function ConditionalExample() {
  const [count, setCount] = useState(0);

  if (count === 0) {
    // 这里不能调用useState，因为这是一个条件式中
    // 此处调用useState会导致React无法正确跟踪状态的变化
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
### 迴圈
```jsx
import React, { useState } from 'react';

function LoopExample() {
  const [count, setCount] = useState(0);

  for (let i = 0; i < 5; i++) {
    // 这里不能调用useState，因为这是一个循环中
    // 此处调用useState会导致React无法正确跟踪状态的变化
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
### 嵌套函式
```jsx
import React, { useState } from 'react';

function NestedFunctionExample() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    // 这里不能调用useState，因为这是一个嵌套函数中
    // 此处调用useState会导致React无法正确跟踪状态的变化
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```
## JSX的Key值寫法
* key 其實主要是幫助 React 識別這個元件是否被調整或刪除等行為，來決定是否重新渲染
```jsx
import React from 'react';

const MyComponent = () => {
  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    // Add more data items as needed
  ];

  return (
    <div>
      <h1>My List</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComponent;

```

## Props的預設為True
* 在JSX中，如果我們沒給Props值，那麼預設的值就是True
```jsx
import React from 'react';

const MyComponent = ({ isEnabled = true }) => {
  return (
    <div>
      <p>Component is {isEnabled ? 'enabled' : 'disabled'}</p>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <MyComponent /> {/* 使用預設值 */}
      <MyComponent isEnabled={false} /> {/* 傳遞自定義值 */}
    </div>
  );
};

export default App;
```

## 忽略特定型別
* 如果要輸出Boolean、null之類的，就要用String()
```jsx
const App = () => {
  return (
  <div>
    <div>Boolean：{ true }</div>
    <div>Boolean：{ String(true) }</div>
    
    <div>Boolean：{ false }</div>
    <div>Boolean：{ String(false) }</div>
 
    <div>Null：{ null }</div>
    <div>Null：{ String(null) }</div>

    <div>Undefined：{ undefined }</div>
    <div>Undefined：{ String(undefined) }</div>
  </div>
  )
}
const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
```


















