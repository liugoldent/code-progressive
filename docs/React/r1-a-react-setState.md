---
description: react setState 
tags:
  - javascript
  - react
  - frontEnd
---
# [React] React setState(x) x的差異性

## 參考文章
[Queueing a Series of State Updates](https://beta.reactjs.org/learn/queueing-a-series-of-state-updates?fbclid=IwAR3i7uS4P9NETuHiufK8MgoXXur2AN8KClMy1sbPJm2BRH11ojlSY6pn6vE)
[Functional setState is the future of React](https://medium.com/free-code-camp/functional-setstate-is-the-future-of-react-374f30401b6b)



## 範例
:::danger
先思考，setState狀態一但被改變，就決定了。  
另外`setState(x)` 優先於 `setState(n => n+1)`
:::
`setState(x)`主要是因為react在更新時，會壓縮其指令，讓它變成只輸出最後一個，不然VDOM要一直更新（決定作用）
`setState(n => n+1)`是因為拿舊值去相加，所以會再進行操作一次。（修飾作用）

### 範例1. `setNumber(number + 1)`
#### 輸出：2，只會加一次。  
就像餐廳點餐一樣，React只認最後一次的number+1
![waiter](https://beta.reactjs.org/images/docs/illustrations/i_react-batching.png)
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 2);
      }}>+3</button>
    </>
  )
}
```

### 範例2. `setNumber(n => n + 1)`
#### 輸出：3
因為每一次的`n => n+1`，最左方的n都是拿更新過後的值去+
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

### 範例3. 先state，後function
遇到`number+5`，丟出5被決定了。但是之後有接一個`n => n+1`讓丟出來的值續+1，所以輸出6
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}

```

### 範例4. 綜合題型
輸出42，因為最後的setNumber為最高優先級別。
```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```
