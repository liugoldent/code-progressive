---
description: react useMemo
tags:
  - javascript
  - react
  - frontEnd
---

# [React] useMemo

## 概念

- 當需要某種複雜的計算，並將數值保存起來時，可以使用 useMemo
- useMemo 接收兩個參數。分別是`Callback`與`Array`
- 記得執行時間：會在組件渲染時被呼叫
- 類似 Vue Computed

## 使用

- 第一個參數是 Callback，第二個參數可以設定想要監聽的變數

```jsx
const [users, setUsers] = React.useState([]);
const newUsers = React.useMemo(() => {}, [users]);
```

## 程式

因為類似 Vue Computed，所以這邊將兩者程式碼皆列出來

### 基本使用 React useMemo

```jsx
import React, { useState, useMemo } from "react";

const ExpensiveCalculation = () => {
  const [number, setNumber] = useState(0);

  // 使用 useMemo 緩存計算結果
  const squaredNumber = useMemo(() => {
    console.log("Calculating squared number...");
    return number ** 2;
  }, [number]);

  return (
    <div>
      <h1>Expensive Calculation Example</h1>
      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value))}
      />
      <p>Squared number: {squaredNumber}</p>
    </div>
  );
};

export default ExpensiveCalculation;
```

### 基本使用 - Vue3 Computed

```html
<template>
  <div>
    <p>數量: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
  import { ref, computed } from "vue";

  export default {
    setup() {
      const count = ref(0);

      // 使用computed計算屬性
      const doubledCount = computed(() => count.value * 2);

      // 定義一個函數來增加count
      const increment = () => {
        count.value++;
      };

      return {
        count,
        doubledCount,
        increment,
      };
    },
  };
</script>
```

## useEffect 與 useMemo 的替換

```jsx
useCallback(fn, deps) 等同於 useMemo(() => fn, deps)
```

## 文章參考

1. [終究都要學 React 何不現在學呢？ - React 進階 - useMemo - (13)](https://ithelp.ithome.com.tw/articles/10298447)
