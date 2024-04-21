---
description: react Redux
tags:
  - javascript
  - react
  - frontEnd
---

# [React] 「React Redux」
## 概念 - React Redux
* redux：可以讓我們在不同頁面或是不同元件之間共享狀態
* useReducer：只能在同一個元件之間共享狀態
* 官方建議使用react-redux，而不是使用redux
    * redux：安裝複雜，要太多的相依套件
## 程式

### src/index.js
* 在這邊記得要用Provider包住App
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```


### src/store.js
* 使用了 Redux Toolkit 的 createSlice 函數來定義一個 todos slice，其中包含新增、切換完成狀態和刪除待辦事項的操作。
* configureStore 函數用於創建 Redux store，並使用 todosSlice.reducer 作為 reducer。
* initialState 跟 reducers 為必要
    * initialState：為初始狀態
    * reducers：為一個物件，裡面包含所有物件
```jsx
import { configureStore, createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push({ id: Date.now(), text: action.payload, completed: false });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action) => {
      return state.filter(todo => todo.id !== action.payload);
    }
  }
});

// 這邊是export todosSlice的actions
export const { addTodo, toggleTodo, removeTodo } = todosSlice.actions;

// 這邊是輸出store，記得寫法，輸出reducer
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer
  }
});

export default store;
```

### src/App.js
* 使用 useSelector 鉤子來獲取待辦事項的列表，並使用 useDispatch 鉤子來獲取 dispatch 函數。我們使用 addTodo、toggleTodo 和 removeTodo 操作來更新狀態。

```jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, removeTodo } from './store';

function App() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo) {
      dispatch(addTodo(newTodo));
      setNewTodo('');
    }
  };

  return (
    <div>
      <h1>Todo App with Redux Toolkit</h1>
      <div>
        <input type="text" value={newTodo} onChange={e => setNewTodo(e.target.value)} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            {todo.text}
            <button onClick={() => dispatch(removeTodo(todo.id))}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

























