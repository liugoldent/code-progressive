---
title: "React 畫面更新流程：每日複習"
description: "從初始渲染到使用者點擊，理解 setState、state snapshot、render、commit、paint 與 useEffect 的執行順序"
tags:
  - JavaScript
  - React
  - Frontend
keywords: ["React", "setState", "state snapshot", "render", "commit", "paint", "useEffect", "畫面更新流程", "每日複習"]
---

# [React] 畫面更新流程：每日複習

## 先背這個 30 秒版本

### 初始渲染

```text
觸發初始渲染
→ Render：React 呼叫元件，取得初始 state snapshot，計算 JSX
→ Commit：React 將 JSX 對應的 DOM 放進頁面
→ Paint：瀏覽器把 DOM 畫到螢幕
→ useEffect setup
```

### 使用者點擊後更新

```text
使用者點擊
→ 執行舊 snapshot 建立的 event handler
→ setState：將更新排入 queue，不會立刻改變目前的 state 變數
→ event handler 執行結束
→ Render：React 處理更新，取得新的 state snapshot，計算新 JSX
→ Commit：React 將必要差異更新到 DOM
→ Paint：瀏覽器顯示新畫面
→ useEffect：舊 cleanup → 新 setup（dependency 有改變時）
```

一句話口訣：

> **setState 排隊、snapshot 固定、render 負責算、commit 負責改、paint 負責顯示、Effect 負責同步。**

## 最重要的觀念：snapshot 不是一個獨立階段

`snapshot` 不是發生在 render 前後的另一個 phase。它是「某一次 render 所看見的固定 props 與 state」。

最簡單的心智模型是：

> **Render = React 重新執行一次 Function Component，並使用這次執行取得的 props/state snapshot 計算 JSX。**

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 每次執行到這裡，就是一次 render。
  // count 是這次 render 所看見的 state snapshot。

  return <div>{count}</div>; // 這次 render 算出的 JSX
}
```

可以用下面這組對照記憶：

```text
Render   = React 重新執行 Function Component 的動作
Snapshot = 這次執行所看見的固定 props/state
JSX      = 這次執行計算出的結果
Commit   = React 把必要差異更新到 DOM
```

所以「render」本身不是狀態；render 是重新執行函式的動作，snapshot 才是這次執行所看見的狀態。

React 呼叫元件函式進行 render 時，會把當次的 state snapshot 提供給元件。元件回傳的 JSX、event handler 與 Effect callback，都是使用這份 snapshot 建立的。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("before:", count); // 0

    setCount(count + 1); // 排入下一次 render

    console.log("after:", count); // 還是 0
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`setCount` 不會修改目前 event handler 手上的 `count`。這個 handler 是在 `count = 0` 的 render 建立的，所以從開始到結束都只看得到 `0`。下一次 render 才會取得 `count = 1` 的新 snapshot。

## 六個名詞各自負責什麼？

| 名詞 | 它真正做的事 |
| --- | --- |
| `setState` | 將 state update 排入 queue，請求 React 進行下一次 render |
| state snapshot | 某一次 render 所看見的固定 props、state、變數和函式 |
| render | 呼叫元件函式，用 snapshot 計算 JSX；這時不應操作 DOM 或執行副作用 |
| commit | 將 render 結果的必要差異套用到真實 DOM |
| paint | 瀏覽器把更新後的 DOM 畫到螢幕上 |
| `useEffect` | commit 後與 API、計時器、事件訂閱等外部系統同步 |

## 完整範例：從第一次顯示到點擊一次

```jsx
import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  console.log("render:", count);

  useEffect(() => {
    console.log("effect setup:", count);

    return () => {
      console.log("effect cleanup:", count);
    };
  }, [count]);

  function handleClick() {
    console.log("handler before:", count);
    setCount((currentCount) => currentCount + 1);
    console.log("handler after:", count);
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### 第一次顯示

先不考慮開發環境的 Strict Mode：

```text
1. Render
   render: 0

2. Commit
   React 建立 button DOM，內容是 Count: 0

3. Paint
   使用者看到 Count: 0

4. Effect
   effect setup: 0
```

### 使用者點擊一次

```text
1. Event handler 使用舊 snapshot 0
   handler before: 0

2. setCount 將 +1 排入 queue

3. Event handler 繼續使用舊 snapshot 0
   handler after: 0

4. Render 使用新 snapshot 1
   render: 1

5. Commit
   React 將 button 文字更新成 Count: 1

6. Paint
   使用者看到 Count: 1

7. Effect（因為 dependency count 從 0 變成 1）
   effect cleanup: 0
   effect setup: 1
```

cleanup 讀到 `0`，因為它是 snapshot 0 那次 render 建立的函式；新 setup 讀到 `1`，因為它是 snapshot 1 那次 render 建立的函式。

## 為什麼連續三次 setState 不一定加三次？

```jsx
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
```

同一個 event handler 內的三個 `count` 都來自同一份 snapshot。假設目前是 `0`，上面三行等同於連續要求 React「設成 `1`」。

需要以上一次排隊結果繼續計算時，改用 updater function：

```jsx
setCount((count) => count + 1);
setCount((count) => count + 1);
setCount((count) => count + 1);
```

React 依序處理 updater queue：`0 → 1 → 2 → 3`。

## useEffect 在流程中的位置

### dependency 改變

```text
Render 新 snapshot
→ Commit 新畫面
→ Paint
→ cleanup 舊 snapshot 的 Effect
→ setup 新 snapshot 的 Effect
```

### dependency 沒改變

```text
Render → Commit → Paint
→ 跳過這個 Effect 的 cleanup 與 setup
```

### 元件卸載

```text
Commit：從 DOM 移除元件
→ 執行最後一次 Effect cleanup
```

### Effect 裡又呼叫 setState

會再開始一輪更新：

```text
Effect
→ setState
→ Render
→ Commit
→ Paint
→ Effect
```

如果 Effect 每次都改變自己的 dependency，就會形成無限迴圈。

## 三個容易誤會的地方

### 1. Render 不等於更新 DOM

Render 只是計算新 JSX，commit 才會操作 DOM。React 也可能重新執行或放棄一個尚未 commit 的 render，所以 render 必須保持 pure。

### 2. Commit 不等於 paint

Commit 是 React 修改 DOM；paint 是瀏覽器把 DOM 畫出來。兩者不是同一件事。

### 3. useEffect 通常在 paint 後，但不是絕對保證

日常心智模型可以先記成 `commit → paint → useEffect`。更精確地說，某些由使用者互動造成的 Effect，React 可能在 paint 前執行。若程式一定要在 paint 前量測或修改版面，才使用 `useLayoutEffect`。

## Strict Mode 為什麼會看到重複 log？

開發環境啟用 Strict Mode 時，React 可能額外呼叫 render 來檢查它是否 pure，並對 Effect 執行額外的：

```text
setup → cleanup → setup
```

這是開發環境的檢查，不是正式環境的一般流程。不要為了消除 log 而關閉 Strict Mode；應讓 render 沒有副作用，並讓 cleanup 完整撤銷 setup。

## 每日 20 秒自我測驗

1. `setState` 會立刻修改目前函式中的 state 嗎？
2. snapshot 是獨立於 render 的一個 phase 嗎？
3. render 和 commit 哪一個會修改 DOM？
4. 為什麼 Effect cleanup 可能讀到舊 state？
5. Effect 裡更新自己的 dependency 會發生什麼？

<details>
<summary>查看答案</summary>

1. 不會；它會將更新排入下一次 render。
2. 不是；snapshot 是某一次 render 所看見的固定 state 與 props。
3. commit；render 只計算 JSX。
4. cleanup 是由舊 snapshot 那次 render 建立的函式。
5. 再次 render 並執行 Effect，可能形成無限迴圈。

</details>

## 官方參考

1. [React：Render and Commit](https://react.dev/learn/render-and-commit)
2. [React：State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
3. [React：Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
4. [React：Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
