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
* 主要大多用途都是在於我們畫面 render 之後要做某些事情，其實也就是在跟 React 說等一下 render 後要記得執行裡面的某些事情
## 使用
### 基本使用
* 這個方法的參數中需要帶入一個函式，而這個函式會在畫面渲染完成「後」被呼叫
* 如果useEffect，第二個參數是空，則每次渲染後都會執行
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
### 類似監聽使用
```jsx
import React, { useState, useEffect } from 'react';

const NumberExample = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (count > 5) {
      setMessage('Count is greater than 5');
    } else {
      setMessage('Count is not greater than 5');
    }
  }, [count]); // 將 count 作為依賴數組

  return (
    <div>
      <h1>useEffect Example</h1>
      <p>Count: {count}</p>
      <p>{message}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
};

export default NumberExample;

```



## 類似生命週期的使用
### 模擬ComponentDidMount
* 第一次渲染時，因為dependencies的值剛被帶入，所以會做一次useEffect的函式
* 第二次畫面渲染完時，因為不會再次呼叫setCurrentWeather，如此避免掉無窮迴圈的問題
* 概念其實與 Vue 的 onMounted 的生命週期神似
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
* 動作順序：Component mounted -> 觸發 -> Component will unmount -> 畫面更新 -> Component mounted
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

## useEffect的async function
```jsx
useEffect(() => {
    // STEP 1：在 useEffect 中定義 async function 取名為 fetchData
    const fetchData = async () => {
      try {
        // STEP 2：使用 Promise.all 搭配 await 等待兩個 API 都取得回應後才繼續
        const response = await axios.get('https://api.example.com/data');
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
```

## useEffect 與 useCallback一起使用
[[Day 20 - 即時天氣] 在 useEffect 中使用呼叫需被覆用的函式 - useCallback 的使用](https://ithelp.ithome.com.tw/articles/10225504)
* 有些時候，如果我們的useEffect相依是function，而當我們沒有將此function設定為useCallback，會導致無窮迴圈
* 原因是：每次react在渲染時，useEffect執行，react會將其dependencies視為「不同的」物件（因為位址不同）
* 解決辦法：將使用到dependencies的function定義為useCallback（這樣位址就會相同了）
```jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.example.com/data');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching data');
  }
};

const DataFetching = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useCallback 包裹 getData 函式
  // 這樣可以確保每次組件渲染時 getData 的引用都是相同的，從而避免在 useEffect 的依賴數組中造成無限重渲染的問題。
  const getData = useCallback(async () => {
    try {
      const fetchedData = await fetchData();
      setData(fetchedData);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  // 在 useEffect 中使用 getData 函式作為依賴
  useEffect(() => {
    getData();
  }, [getData]); // 把 getData 放入依賴數組

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Data Fetching Example</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default DataFetching;

```




