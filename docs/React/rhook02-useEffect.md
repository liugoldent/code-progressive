---
title: "React useEffect"
description: "react useEffect"
tags:
  - JavaScript
  - React
  - Frontend
keywords: ["React", "useEffect", "render", "commit", "state snapshot", "畫面更新流程", "使用", "類似生命週期的使用", "useEffect的async", "function"]
---




# [React] useEffect
## 概念
* `useEffect` 會在 React 將畫面更新提交（commit）之後執行。
* Effect 是 React 與「外部系統」同步的逃生口，例如 API、WebSocket、計時器、瀏覽器事件或第三方套件。
* 如果只是根據 props、state 計算畫面資料，通常不需要 `useEffect`，直接在 render 時計算即可。

> 想每天快速複習完整順序，可看：[React 畫面更新流程：每日複習](./r00-react-render-cycle.md)。

## React 畫面更新最基本的流程

先記最短版本：

```text
事件或外部通知
  → 呼叫 setState，將更新排入 queue
  → React 批次處理更新
  → Render：用新版 state snapshot 計算 JSX
  → Commit：把必要差異套用到 DOM
  → Browser paint：瀏覽器將結果畫到螢幕
  → useEffect：cleanup 舊同步，再 setup 新同步
```

一般可先把順序理解成上面這樣。更精確地說，非互動造成的 `useEffect` 通常會等瀏覽器 paint 後才執行；某些由使用者互動造成的 Effect，React 可能在 paint 前執行。如果邏輯一定要在 paint 前完成，例如量測並定位 tooltip，才考慮 `useLayoutEffect`。

### 每個名詞到底在做什麼？

| 名詞 | 意思 | 會不會直接改 DOM？ |
| --- | --- | --- |
| state update | `setState` 將更新排入 queue，要求 React 再 render | 不會 |
| snapshot | 某一次 render 所看見的固定 props、state、變數與 event handler | 不會 |
| render phase | React 呼叫元件函式，根據 snapshot 計算下一份 JSX | 不會 |
| commit phase | React 將本次計算出的必要差異套用到 DOM | 會 |
| browser paint | 瀏覽器把更新後的 DOM 畫到螢幕 | DOM 已經在 commit 更新 |
| `useEffect` | commit 後與 API、訂閱、計時器等外部系統同步 | 視 Effect 內容而定 |

一句話記憶：**render 負責算、commit 負責改、paint 負責顯示、Effect 負責同步外部系統。**

### State snapshot 是什麼？

React 將 state 保存在元件函式之外。每次 React 呼叫元件進行 render，`useState` 會提供「屬於那一次 render 的 state 值」，這個固定值就是 snapshot。

因此，呼叫 setter 不會修改目前 event handler 手上的 snapshot：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log("before:", count); // 0
    setCount(count + 1);           // 排入下一次 render
    console.log("after:", count); // 還是 0
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

這不是 React 更新失敗，而是 `handleClick` 屬於 `count = 0` 那次 render，所以函式內的 `count` 一直是該次 snapshot 的 `0`。下一次 render 才會得到 `count = 1` 的新 snapshot，並建立新版 JSX 與新版 event handler。

若下一個 state 依賴前一個 state，使用 updater function：

```jsx
setCount((currentCount) => currentCount + 1);
```

React 會在下一次 render 處理 updater queue。這也能避免同一批更新或非同步 callback 讀到舊 snapshot 所造成的錯誤。

### 一次點擊實際會發生什麼？

假設畫面目前顯示 `count = 0`：

1. 使用者點擊按鈕，執行 snapshot 0 建立的 `handleClick`。
2. `setCount` 將 state 更新排入 queue；目前的 `count` 仍然是 `0`。
3. event handler 執行完後，React 批次處理這一批 state updates。
4. React 開始 render，呼叫元件函式並取得 `count = 1` 的 snapshot。
5. 元件回傳新的 JSX；React 比較新舊結果，找出需要更新的部分。
6. React 進入 commit，將文字從 `0` 更新成 `1`。
7. 瀏覽器 paint，使用者看到 `1`。
8. 若 Effect 的 dependency 改變，React 先執行舊 snapshot 的 cleanup，再執行新 snapshot 的 Effect setup。

React 通常會等 event handler 結束才批次處理 state updates，所以連續寫三次 `setCount(count + 1)`，三次讀到的都是同一份 snapshot。若要累加三次，要使用 updater function：

```jsx
setCount((count) => count + 1);
setCount((count) => count + 1);
setCount((count) => count + 1);
```

### 用 console 觀察完整順序

```jsx
function Counter() {
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

  return <button onClick={handleClick}>{count}</button>;
}
```

先不考慮開發環境 Strict Mode，首次顯示大致是：

```text
render: 0
（commit 0 到 DOM）
（browser paint）
effect setup: 0
```

點擊一次後大致是：

```text
handler before: 0
handler after: 0
render: 1
（commit 1 到 DOM）
（browser paint）
effect cleanup: 0
effect setup: 1
```

cleanup 顯示 `0`、新 setup 顯示 `1`，正是因為兩個函式分別捕捉了不同 render 的 snapshot。

### Initial render、更新與卸載的 Effect 順序

| 情境 | 流程 |
| --- | --- |
| 首次掛載 | trigger → render 初始 snapshot → commit → paint → Effect setup |
| dependency 改變 | state/props update → render 新 snapshot → commit → paint → 舊 Effect cleanup → 新 Effect setup |
| dependency 沒改變 | render → commit；跳過該 Effect 的 cleanup 與 setup |
| 元件卸載 | commit 將元件移除 → 執行最後一次 cleanup |

`useEffect(fn, [])` 仍然會在首次 commit 後 setup，只是後續 render 不會因 dependency 而重新同步；元件卸載時仍會 cleanup。

### Render 不等於畫面一定更新

Render 只是計算候選結果。若新舊 JSX 對應出的 DOM 沒有差異，commit 不需要修改該 DOM；在可中斷 rendering 中，React 也可能重新開始或放棄某次尚未 commit 的 render。因此 render 必須保持 pure：不要在元件函式頂層發 API、操作 DOM、啟動計時器或修改外部變數。

只有 commit 過的結果才會成為目前畫面，也只有 commit 過的 render 才會進入對應的 Effect 流程。

### Effect 裡 setState 會怎樣？

Effect 中呼叫 setter 會再排入一次更新，重新走完整循環：

```text
Effect → setState → Render → Commit → Paint → Effect
```

所以如果 Effect 每次執行都改變自己的 dependency，就會形成無限迴圈。若資料能直接由現有 props 或 state 算出，應在 render 計算，不要用 Effect 再存一份衍生 state。

### Strict Mode 為什麼讓 log 看起來更亂？

開發環境啟用 Strict Mode 時，React 會額外呼叫 render 來檢查元件是否 pure，也會對 Effect 多做一次 `setup → cleanup → setup` 壓力測試。因此開發環境的 console 可能看到重複訊息。這不是正式環境的一般執行順序，也不應靠關閉 Strict Mode 解決；應確保 render 沒有副作用，而且 cleanup 能完整撤銷 setup。

## 使用
### 基本使用
* 這個方法的參數中需要帶入一個函式，而這個函式會在畫面渲染完成「後」被呼叫
* 如果沒有傳入第二個參數，則每次畫面更新提交後都會執行
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

### dependency array 的差異

| 寫法 | 執行時機 |
| --- | --- |
| `useEffect(fn)` | 每次 commit 後執行 |
| `useEffect(fn, [])` | 元件掛載後執行；開發環境的 Strict Mode 會額外測試一次 setup 與 cleanup |
| `useEffect(fn, [a, b])` | 掛載後執行，之後 `a` 或 `b` 改變時再執行 |

React 使用 `Object.is` 比較 dependency 的前後值，所以每次 render 都重新建立的 object 或 function，會被視為不同的 dependency。

## 使用上需要注意什麼？

### 1. dependency 要誠實列完整

Effect 內讀到的 props、state，以及元件內宣告的變數或函式，都屬於 reactive value，原則上要放入 dependency array。不要用停用 `react-hooks/exhaustive-deps` 規則來硬壓警告，否則 Effect 可能持續讀到舊值（stale closure）。

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    return () => connection.disconnect();
  }, [roomId]); // Effect 使用了 roomId，所以要列入
}
```

若 dependency 太多，應先調整程式結構，而不是直接刪除 dependency。例如將只供 Effect 使用的 object 或 function 移到 Effect 裡面，或把不會隨 render 改變的值移到元件外。

### 2. 建立外部資源時要記得 cleanup

訂閱事件、計時器、WebSocket、Observer 等資源若未清除，可能造成記憶體洩漏、重複監聽或使用舊資料。cleanup 不只在 unmount 時執行；dependency 改變時，React 也會先使用舊值執行 cleanup，再使用新值執行 setup。

```jsx
useEffect(() => {
  const id = setInterval(() => {
    setCount((currentCount) => currentCount + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);
```

這裡使用 state updater `setCount(currentCount => currentCount + 1)`，就不需要將 `count` 加入 dependency，也不會每秒清除並重建計時器。

### 3. 小心 Effect 造成無限迴圈

常見條件是：Effect 更新 state → 元件重新 render → dependency 改變 → Effect 再更新 state。尤其 object 與 function 若在 render 中建立，每次都會產生新的參照。

```jsx
// ❌ options 每次 render 都是新 object，Effect 會反覆執行
const options = { roomId };

useEffect(() => {
  setConnection(createConnection(options));
}, [options]);

// ✅ 只依賴真正會影響同步結果的 primitive value
useEffect(() => {
  const connection = createConnection({ roomId });
  connection.connect();

  return () => connection.disconnect();
}, [roomId]);
```

不要一看到 function dependency 就一律加 `useCallback`。優先考慮把函式移入 Effect、移到元件外，或把該邏輯移回真正觸發它的 event handler；確實需要穩定函式參照時才用 `useCallback`。

### 4. Effect callback 不要直接標記為 async

Effect callback 只能回傳 cleanup function 或不回傳任何值；`async function` 一定會回傳 Promise，因此要在 Effect 內另外宣告 async function。抓取資料時也要處理競態：較早送出的請求可能較晚回來，覆蓋掉新結果。

```jsx
useEffect(() => {
  const controller = new AbortController();

  async function fetchUser() {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      });
      const user = await response.json();
      setUser(user);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  }

  fetchUser();

  return () => controller.abort();
}, [userId]);
```

實際專案若使用支援資料抓取的 framework 或 query library，通常可交由它處理快取、SSR、競態與重試，不必每個元件都手寫 fetch Effect。

### 5. 開發環境執行兩次不一定是 bug

啟用 Strict Mode 時，React 在開發環境會額外執行一次 `setup → cleanup → setup`，用來檢查 cleanup 是否完整。不要用 `useRef` 阻止第二次執行來掩蓋問題；應讓 setup 可以安全重跑，並讓 cleanup 完整撤銷 setup 的操作。正式環境不會執行這次額外檢查。

### 6. 不是所有邏輯都該放進 Effect

以下情況通常不需要 Effect：

* 根據 props 或 state 算出顯示資料：直接在 render 時計算，昂貴計算再考慮 `useMemo`。
* 因按鈕點擊、表單送出而執行的動作：放在 event handler，因為 handler 最清楚是哪個互動觸發。
* 為了讓兩份 state 保持同步：盡量只保留一份 state，其餘用計算取得，或將 state 提升到共同父層。

```jsx
function NumberExample() {
  const [count, setCount] = useState(0);

  // ✅ message 可由 count 直接推導，不需要另一份 state 與 Effect
  const message = count > 5
    ? "Count is greater than 5"
    : "Count is not greater than 5";

  return (
    <>
      <p>Count: {count}</p>
      <p>{message}</p>
      <button onClick={() => setCount((value) => value + 1)}>
        Increment Count
      </button>
    </>
  );
}
```

### 7. 需要在瀏覽器繪製前量測版面時才用 useLayoutEffect

大部分副作用應使用 `useEffect`，避免阻塞瀏覽器繪製。只有 tooltip 定位、元素尺寸量測等必須在畫面 paint 前完成，且使用 `useEffect` 會明顯閃爍時，才考慮改用 `useLayoutEffect`。

### 8. Hook 只能在頂層呼叫

不能把 `useEffect` 放在 `if`、迴圈、巢狀函式或 event handler 裡。若只想在特定條件下執行，仍在元件頂層呼叫 Hook，再把條件判斷寫進 Effect。

```jsx
useEffect(() => {
  if (!enabled) return;

  const connection = connect();
  return () => connection.disconnect();
}, [enabled]);
```

### 不要把 useEffect 當成一般監聽器
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

上例雖然可以運作，但 `message` 完全能從 `count` 推導，會多一次不必要的 render。較好的寫法請參考上方「不是所有邏輯都該放進 Effect」。Effect 的核心心智模型應該是「與外部系統同步」，而不是「監聽任何值的變化」。



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
    console.log('Runs after every commit');
    return () => {
      console.log('Cleanup before the next Effect or unmount');
    };
  });

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

注意：API 參數若來自 props 或 state，要加入 dependency；同時應透過 cleanup 忽略舊回應或用 `AbortController` 取消舊請求，避免競態。完整範例請參考上方「Effect callback 不要直接標記為 async」。

## useEffect 與 useCallback 一起使用
[[Day 20 - 即時天氣] 在 useEffect 中使用呼叫需被覆用的函式 - useCallback 的使用](https://ithelp.ithome.com.tw/articles/10225504)
* 元件內的 function 會在每次 render 重新建立；若把它當成 dependency，Effect 也會因此重新執行。
* `useCallback` 可以穩定 function 的參照，但不是預設解法。若函式只被 Effect 使用，直接在 Effect 內宣告通常更簡單。
* 只有 Effect 同時更新 state、使 dependency 再次改變時才會形成無限迴圈；function 參照改變本身只代表 Effect 會重新執行。
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

## 文章參考

1. [React 官方文件：useEffect](https://react.dev/reference/react/useEffect)
2. [React 官方文件：You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
3. [React 官方文件：Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
4. [React 官方文件：Render and Commit](https://react.dev/learn/render-and-commit)
5. [React 官方文件：State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
6. [React 官方文件：Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
