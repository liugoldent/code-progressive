---
title: "React 現場實戰題（第一回）：State / Effect / Realtime"
description: "十題 React 現場實戰：從 state snapshot、effect 邊界、stale closure、request race，一路練到 WebSocket dependency、StrictMode cleanup、batching 與安全重連。"
tags:
  - React
  - Hooks
  - Realtime
  - Interview
keywords: ["React 實戰題", "React state snapshot", "useEffect 邊界", "stale closure", "React request race", "WebSocket React", "React StrictMode", "WebSocket 重連", "React 面試題示範"]
sidebar_position: 16
---

import OrderBookExecutionDemo from "@site/src/components/OrderBookExecutionDemo";

# React 現場實戰題（第一回）：State / Effect / Realtime

:::tip 系列導覽

[回到系列總覽](./13-react-live-interview-series.md) · [入門篇：Props / State / Form / Effect](./15-react-foundations-live-demo.md) · **第一回：State / Effect / Realtime** · [第二回：Identity / Render / Concurrent UI](./14-react-render-identity-live-demo.md)

:::

這一頁不先講長篇理論，直接用題目建立 React 反射。每題照這個順序：

1. 先看題目，花 30 秒預測結果。
2. 再看答案，不要只比對語法。
3. 關掉答案，自己從空白重寫修正版。
4. 用最後的「面試口述」講一次。

如果 `render`、`commit`、browser paint 與 effect 的先後還不熟，先看 [React 一次畫面更新：Trigger → Render → Commit](./05-react-state-data.md)。

## 題目一：為什麼按一次不是加三？

### 題目

不要執行，先回答：第一次按下按鈕後，畫面與一秒後的 console 各是多少？

```tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  function handleAddThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);

    window.setTimeout(() => {
      console.log("delayed count:", count);
    }, 1000);
  }

  return <button onClick={handleAddThree}>count: {count}</button>;
}
```

### 答案

- 畫面變成 `count: 1`。
- 一秒後 console 印出 `delayed count: 0`。

`handleAddThree` 是在 `count = 0` 的那次 render 建立的。三次 `setCount(count + 1)` 都等同要求下一次 state 變成 `1`，不是依序在最新值上加一。

`setTimeout` callback 也捕捉了同一次 render 的 `count = 0`。時間經過不會自動把 closure 裡的值換成最新 state。

### 完整執行順序

第一次 render 時，React 呼叫 `Counter()`：

```txt
第一次 render
→ count = 0
→ 建立 handleAddThree
→ handleAddThree 記住這次 render 的 count = 0
→ JSX 顯示 count: 0
```

使用者按下按鈕後，執行的是第一次 render 所建立的 `handleAddThree`：

```txt
使用者點擊
→ 執行 handleAddThree
→ setCount(0 + 1)
→ setCount(0 + 1)
→ setCount(0 + 1)
→ 建立 setTimeout callback
→ callback 也記住這次 render 的 count = 0
```

這三次 setter 都是在要求 React「下一次請把 count 設成 1」。它們不會修改目前這個 handler 裡的 `count` 變數。

事件 handler 執行結束後，React 才處理排隊的更新：

```txt
事件執行結束
→ React 處理更新佇列
→ 三個更新要求都是把 count 設成 1
→ React 重新呼叫 Counter()
→ 新一輪 render 的 count = 1
→ 建立新一輪的 handleAddThree
→ 畫面顯示 count: 1
```

一秒後，先前排入 timer queue 的舊 callback 開始執行：

```txt
一秒後
→ 舊的 setTimeout callback 執行
→ 它仍引用第一次 render 的 count
→ 第一次 render 的 count 是 0
→ console 顯示 delayed count: 0
```

可以把兩次 render 想成建立了兩組不同的區域變數與 handler：

```tsx
// 第一次 render 的概念模型
const count_render_1 = 0;
const handleAddThree_render_1 = () => {
  // 這裡使用 count_render_1
};

// state 更新後，第二次 render 的概念模型
const count_render_2 = 1;
const handleAddThree_render_2 = () => {
  // 這裡使用 count_render_2
};
```

畫面更新後會使用第二次 render 產生的新 handler，但已經排入 `setTimeout` 的 callback 仍屬於第一次 render，不會被 React 換成第二次 render 的 callback。

所以這裡更精準的說法不是「timer 讀到該 tick 的 count」，而是：

> Timer callback 讀到建立它的那一次 render snapshot。

### 修正版

下一個 state 依賴前一個 state 時，使用 updater function：

```tsx
function handleAddThree() {
  setCount((previous) => previous + 1);
  setCount((previous) => previous + 1);
  setCount((previous) => previous + 1);
}
```

React 會依序把前一個 updater 的結果交給下一個 updater，最後得到 `3`。

### 面試口述

> React state 是每次 render 的 snapshot。Setter 會排程下一次 render，不會修改目前 handler 讀到的變數。如果下一個值依賴先前排隊的 state，我會用 functional updater；async callback 則要先確認需求要的是事件發生當下的 snapshot，還是 callback 執行時的最新值。

## 題目二：這個 `useEffect` 有必要嗎？

### 題目

下面是一個下單表單。請指出問題：

```tsx
import { useEffect, useState } from "react";

export function OrderForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [notional, setNotional] = useState(0);

  useEffect(() => {
    setNotional(Number(price) * Number(quantity));
  }, [price, quantity]);

  return (
    <form>
      <input value={price} onChange={(event) => setPrice(event.target.value)} />
      <input
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      />
      <output>{notional}</output>
    </form>
  );
}
```

### 答案

這段程式有 `useEffect` 仍然可以運作，但它是多餘的。核心問題不是「語法能不能跑」，而是：

> `notional` 是需要 React 獨立記住的 state，還是可以從現有 state 算出的 derived data？

這裡只有兩份真正需要保存的 state：

```txt
price
quantity
```

`notional` 永遠可以由它們算出：

```tsx
Number(price) * Number(quantity)
```

所以 `notional` 不是獨立的 source of truth，而是 derived data。

### 有 `useEffect` 時的完整執行順序

假設目前狀態是：

```txt
price = "10"
quantity = ""
notional = 0
```

接著使用者在 quantity input 輸入 `"2"`。

`onChange` 先執行：

```tsx
setQuantity("2");
```

這會要求 React 進行下一次 render。這次 render 讀到的是：

```txt
price = "10"
quantity = "2"
notional = 0
```

注意：`notional` 還是上一輪 state 裡的 `0`，因為 effect 還沒執行。因此這一次 JSX 暫時計算出：

```tsx
<output>{0}</output>
```

React commit 這次畫面後，才執行 effect：

```tsx
useEffect(() => {
  setNotional(Number(price) * Number(quantity));
}, [price, quantity]);
```

它現在等同於：

```tsx
setNotional(10 * 2);
setNotional(20);
```

`setNotional(20)` 又要求 React render 一次。第二次 render 才讀到：

```txt
price = "10"
quantity = "2"
notional = 20
```

畫面最後才顯示：

```tsx
<output>{20}</output>
```

目前流程是：

```txt
quantity 改變
→ 第一次 render：price = "10"、quantity = "2"、notional 還是 0
→ commit：output 暫時是 0
→ effect 執行 setNotional(20)
→ 第二次 render：notional = 20
→ commit：output 變成 20
```

這會產生多餘 render，也建立了可能不同步的第三份 state。

### 修正版

```tsx
export function OrderForm() {
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const notional = Number(price || 0) * Number(quantity || 0);

  return (
    <form>
      <input value={price} onChange={(event) => setPrice(event.target.value)} />
      <input
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      />
      <output>{notional}</output>
    </form>
  );
}
```

這個版本的執行順序是：

```txt
quantity 改變
→ React render
→ 讀到 price = "10"、quantity = "2"
→ render 當場算出 notional = 20
→ commit：output 直接顯示 20
```

只需要一次 render，而且 `notional` 永遠由同一輪 render 的 `price`、`quantity` 算出。

### 有沒有 effect 的差異

| 使用 effect 同步 `notional` | Render 時直接計算 |
| --- | --- |
| 保存三份 state | 只保存兩份真正的 state |
| 第一次 render 仍可能使用舊 `notional` | 同一輪 render 就得到正確結果 |
| Effect 再呼叫 setter | 不需要額外更新 |
| 通常產生 cascading render | 只需要一次 render |
| Dependency 寫錯可能不同步 | 永遠由最新 price / quantity 算出 |
| 其他程式可以把 `notional` 改成矛盾值 | 沒有第三份 state 可以被改壞 |

### 為什麼多存一份 state 可能不同步？

假設未來有人不小心漏掉 dependency：

```tsx
useEffect(() => {
  setNotional(Number(price) * Number(quantity));
}, [price]);
```

此時 quantity 改變不會重新執行 effect，`notional` 可能繼續顯示舊值。

或者其他程式意外執行：

```tsx
setNotional(999);
```

就可能產生互相矛盾的狀態：

```txt
price = "10"
quantity = "2"
notional = 999
```

如果改成 render 時直接計算：

```tsx
const notional = Number(price) * Number(quantity);
```

只要 `price = "10"`、`quantity = "2"`，`notional` 就一定是 `20`，不需要靠 effect 維持三份資料同步。

### 用 Vue 的 `computed` / `watch` 理解

這個需求在 Vue 比較接近 `computed`：

```ts
const notional = computed(() => {
  return Number(price.value) * Number(quantity.value);
});
```

而不是另外保存 state，再用 `watch` 同步：

```ts
watch([price, quantity], () => {
  notional.value = Number(price.value) * Number(quantity.value);
});
```

React 對應方式通常更直接：

```tsx
const notional = Number(price) * Number(quantity);
```

這個乘法很便宜，連 `useMemo` 都不需要。只有計算真的昂貴，而且已量測到 render 成本時，才考慮 memoization；即使使用 `useMemo`，它仍然是 render-time calculation，不是 effect。

### 哪些情況才是 effect？

Effect 適合 React 需要同步外部系統的情況，例如：

```tsx
// 同步瀏覽器提供的 document API
useEffect(() => {
  document.title = `${price} × ${quantity}`;
}, [price, quantity]);
```

其他例子：

- 建立 WebSocket，並在 cleanup 關閉連線。
- 訂閱 `window` / DOM event，並在 cleanup 移除 listener。
- 建立 timer，並在 cleanup 清除 timer。
- 把 React state 同步到第三方 chart、map 或非 React widget。
- 必要時自行處理 network request；大型專案通常會交給 server-state library 管理生命週期。

使用者按下 Submit 所造成的下單，通常應放在 submit handler 或 mutation，而不是先改一個 state，再讓 effect 猜測是否該送出請求。

### 判斷口訣

> 如果刪掉這份 state，仍能從其他 props / state 完整算出它，那它通常不需要 state，也不需要 effect。

正式金融計算仍要依產品精度規則使用 decimal library、整數最小單位或字串運算；這題先專注在 state 架構。

### 面試口述

> 能由目前 props 或 state 算出的值，我會在 render 直接推導，不會再建 state 並用 effect 同步。Effect 是同步 React 與外部系統的 escape hatch，不是 computed replacement。

## 題目三：Interval 為什麼永遠印出 0？

### 題目

```tsx
import { useEffect, useState } from "react";

export function AutoCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      console.log("count:", count);
      setCount(count + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return <p>{count}</p>;
}
```

請回答：

1. 畫面會怎麼變？
2. 為什麼？
3. 直接把 `count` 加進 dependency array 是最佳解嗎？

### 答案

第一次 interval 執行後畫面變成 `1`，之後持續要求 state 變成 `1`。console 也一直印 `0`。

空 dependency array 代表這個 effect 使用初次 render 建立的 callback；callback 捕捉的是初次 render 的 `count = 0`。

### 完整執行順序

第一次 render 時：

```txt
React 呼叫 AutoCounter()
→ count = 0
→ JSX 產生 <p>0</p>
→ React commit 畫面
→ useEffect 執行
→ 建立 interval callback
→ callback 記住第一次 render 的 count = 0
```

可以把第一次 render 建立的 interval 想成：

```tsx
const count_render_1 = 0;

const intervalCallback = () => {
  console.log("count:", count_render_1);
  setCount(count_render_1 + 1);
};
```

第一秒時，callback 執行：

```txt
console.log(0)
→ setCount(0 + 1)
→ setCount(1)
→ React 安排第二次 render
```

第二次 render 時：

```txt
React 再次呼叫 AutoCounter()
→ 新一輪 count = 1
→ JSX 產生 <p>1</p>
→ React commit
→ 畫面顯示 1
```

但是 dependency array 是空的：

```tsx
}, []);
```

所以第二次 render commit 後，React 不會重新執行這個 effect，也不會建立一個捕捉 `count = 1` 的新 interval。原本的 interval 仍屬於第一次 render。

此時可以想成同時存在兩個不同 render scope：

```tsx
// 第一次 render，舊 interval 使用這個 binding
const count_render_1 = 0;

// 第二次 render，目前畫面使用這個 binding
const count_render_2 = 1;
```

第二秒時，還是同一個舊 callback 執行：

```txt
舊 callback 讀 count_render_1
→ console.log(0)
→ setCount(0 + 1)
→ setCount(1)
```

目前 state 已經是 `1`，React 比較後通常會跳過這個相同值的更新。因此最後的現象是：

```txt
畫面：停在 1
console：每秒持續印出 0
```

完整時間線：

```txt
第一次 render：count = 0
→ 建立 interval，記住 count = 0

第一秒
→ console 0
→ setCount(1)
→ 第二次 render，畫面變成 1
→ effect 不重新建立

第二秒
→ 舊 interval 仍讀 count = 0
→ console 0
→ 再次 setCount(1)

第三秒
→ 舊 interval 仍讀 count = 0
→ console 0
→ 再次 setCount(1)
```

這就是 stale closure：不是 state 又變回 `0`，而是長生命週期 callback 一直引用舊 render 的變數。

把 `count` 放進 dependency array 可以取得新值，但每次 count 改變都會清除並重建 interval，timer 會一直重新計時。這題只需要根據前值加一，因此 updater 更符合語意。

### 修正版

```tsx
useEffect(() => {
  const timerId = window.setInterval(() => {
    setCount((previous) => previous + 1);
  }, 1000);

  return () => window.clearInterval(timerId);
}, []);
```

這次 interval callback 不需要讀取外層 render 的 `count`。React 會在處理 state update 時，把最新 queued state 傳給 updater：

```txt
第一秒：previous = 0 → 1
第二秒：previous = 1 → 2
第三秒：previous = 2 → 3
```

如果想觀察 count commit 後的值，可以用另一個 effect：

```tsx
useEffect(() => {
  console.log("count changed:", count);
}, [count]);
```

完整職責分工是：

```tsx
export function AutoCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCount((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    console.log("count changed:", count);
  }, [count]);

  return <p>{count}</p>;
}
```

- 第一個 effect：建立與清除 timer。
- Functional updater：根據最新 queued state 更新。
- 第二個 effect：在 count 對應的 UI commit 後觀察新值。

如果 callback 真的必須讀取最新 state，又不希望每次重新訂閱，可以把最新值同步到 ref：

```tsx
const latestCountRef = useRef(count);

useEffect(() => {
  latestCountRef.current = count;
}, [count]);

useEffect(() => {
  const timerId = window.setInterval(() => {
    console.log(latestCountRef.current);
  }, 1000);

  return () => window.clearInterval(timerId);
}, []);
```

不要把 ref 當成萬用解法。若數值改變後畫面也要更新，真正的 UI source of truth 仍然應該是 state。

### 最短記法

```txt
[] 讓 effect 只建立一次
→ interval callback 屬於第一次 render
→ 第一次 render 的 count 永遠是 0
→ 直接讀 count 會形成 stale closure
→ 根據最新 state 更新時使用 functional updater
```

### 面試口述

> 這是 stale closure。Interval callback 捕捉了 initial render 的 count。若操作只是根據前值更新，我會使用 functional updater；若長生命週期 subscription 必須讀最新值，我會評估 ref；若 dependency 改變就應重新訂閱，才把它放進 effect dependencies。

## 題目四：快速切交易對，為什麼顯示錯資料？

### 題目

假設 BTC request 很慢、ETH request 很快。使用者先選 BTC，立刻切到 ETH：

```tsx
type Ticker = {
  symbol: string;
  price: string;
};

export function TickerPanel({ symbol }: { symbol: string }) {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    fetch(`/api/ticker?symbol=${symbol}`)
      .then((response) => response.json())
      .then((data: Ticker) => setTicker(data));
  }, [symbol]);

  return <p>{ticker?.price ?? "Loading..."}</p>;
}
```

請回答：為什麼最後可能顯示 BTC？

### 答案

Effect 的順序正確，不代表 response 的回來順序正確：

```txt
發出 BTC request
→ 發出 ETH request
→ ETH response 回來，畫面顯示 ETH
→ 舊 BTC response 最後回來，又覆蓋成 BTC
```

這是 async race condition。Dependency array 只能決定何時啟動 effect，不能自動取消上一個 async operation。

### 修正版

```tsx
type LoadState =
  | { status: "loading" }
  | { status: "success"; ticker: Ticker }
  | { status: "error"; message: string };

export function TickerPanel({ symbol }: { symbol: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadTicker() {
      setState({ status: "loading" });

      try {
        const response = await fetch(`/api/ticker?symbol=${symbol}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const ticker = (await response.json()) as Ticker;

        if (active) {
          setState({ status: "success", ticker });
        }
      } catch (error) {
        if (!active || controller.signal.aborted) return;

        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    void loadTicker();

    return () => {
      active = false;
      controller.abort();
    };
  }, [symbol]);

  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>{state.message}</p>;
  return <p>{state.ticker.price}</p>;
}
```

實務專案若使用 TanStack Query，應讓 query key 包含 `symbol`，並把 query library 提供的 abort signal 傳給 fetch；不要在每個 component 重複手寫完整 request lifecycle。

### 面試口述

> Dependency 正確不代表 async response 順序正確。Symbol 改變時，我會取消上一個 request，並防止已失效的 callback commit state。使用 server-state library 時，symbol 必須進 query key，讓 cache identity 和 request lifecycle 正確隔離。

## 題目五：這個 WebSocket Hook 有哪些 bug？

### 題目

```tsx
type Level = {
  price: string;
  quantity: string;
};

export function useOrderBook(symbol: string) {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const socket = new WebSocket(makeDepthUrl(symbol));

    socket.onmessage = (event) => {
      const delta = JSON.parse(event.data) as Level[];
      setLevels(mergeLevels(levels, delta));
    };
  }, [symbol]);

  return levels;
}
```

至少找出三個問題。

### 答案

1. `levels` 是 effect 建立時的 snapshot，`onmessage` 可能一直拿舊陣列合併。
2. 沒有 cleanup；unmount 或切 symbol 後舊 socket 仍可能繼續工作。
3. 每個 message 都 setState，高頻資料可能造成過多 render。
4. 沒處理 socket error、close、reconnect 與 stale UI。
5. 真實 order book 不能只合併陣列，還要先取得 snapshot、檢查 sequence、發現 gap 時重新同步。
6. `JSON.parse` 的 TypeScript assertion 不是 runtime validation。

### 最小正確修正版

這個版本先修 stale closure 與 cleanup，尚未處理 snapshot / sequence / batching：

```tsx
export function useOrderBook(symbol: string) {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    setLevels([]);

    const socket = new WebSocket(makeDepthUrl(symbol));

    socket.onmessage = (event) => {
      const delta = parseDepthDelta(event.data);
      setLevels((previous) => mergeLevels(previous, delta));
    };

    return () => {
      socket.onmessage = null;
      socket.close();
    };
  }, [symbol]);

  return levels;
}
```

`setLevels(previous => ...)` 讓每個 delta 都套在 React 提供的最新 queued state 上；cleanup 則避免舊 symbol 的 socket 繼續更新。

### 完整執行順序：一行一行看 React 做了什麼

先抓住一個最重要的分界：**render 階段只會呼叫 Hook 並回傳目前的 `levels`；`useEffect` 裡的連線程式要等 commit 之後才執行。**

下面的逐步執行器使用 BTC 初次載入、收到兩筆 delta、切換成 ETH、最後 unmount 的完整情境。按「下一步」時，同時觀察目前 state、socket 狀態與右側亮起的程式碼。

<OrderBookExecutionDemo />

把上面的過程壓成主線，就是：

```txt
初次 render：levels = []，回傳 []
→ commit 後執行 effect setup
→ setLevels([])、建立 BTC socket、綁定 onmessage
→ BTC message 到達
→ parse delta
→ functional updater 收到最新 previous
→ mergeLevels(previous, delta)
→ React 用合併結果重新 render
→ symbol 改成 ETH，先 render 一次；這時 levels 仍可能是 BTC 資料
→ commit 後先 cleanup 舊 BTC effect
→ 移除 BTC onmessage、關閉 BTC socket
→ 再 setup 新 ETH effect
→ 清空 levels、建立 ETH socket
→ React render 空畫面
→ ETH message 到達後再 merge、render
→ 元件 unmount 時執行最後一次 cleanup
```

注意 `setLevels([])` 放在 effect 裡，因此切換 `symbol` 的那一次 render，仍可能先讀到上一個商品的 `levels`。等 effect setup 執行 `setLevels([])` 後，React 才再 render 空陣列。這不是 cleanup 沒有執行，而是 effect 本來就發生在 commit 之後。

另外，初次 effect 執行時的 `setLevels([])` 也建立了一個新的陣列 reference。即使內容同樣為空，React 仍可能因此多 render 一次；若只需要在切換商品時清空，可以進一步調整 state 的建模方式，但不能因此省略 socket cleanup。

:::note React 18 開發環境

若應用程式開啟 `StrictMode`，React 會在開發環境額外做一次 `setup → cleanup → setup`，用來檢查 effect 是否能正確清理。因此你可能看到第一次 mount 時 WebSocket 先連線、立刻關閉、再連線一次。上面的逐步執行器呈現一般 production lifecycle；正式環境不會因 StrictMode 做這次額外檢查。

:::

### 面試口述

> 我會先修正 subscription lifecycle 與 stale closure，再補 production correctness。Order book 必須由 REST snapshot 加上具 sequence 的 delta 建立；發現 gap 就停止相信本地狀態並重新同步。效能優化不能犧牲 delta 完整性。

## 題目六：只保留最新一筆，適合 ticker 還是 order book？

### 題目

下面的 Hook 把一個 animation frame 內的多筆訊息合成一次 render：

```tsx
type Ticker = {
  symbol: string;
  price: string;
};

export function useBatchedTicker(symbol: string) {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const latestTickRef = useRef<Ticker | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    setTicker(null);

    const socket = new WebSocket(makeTickerUrl(symbol));

    socket.onmessage = (event) => {
      latestTickRef.current = parseTicker(event.data);

      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;

        if (latestTickRef.current !== null) {
          setTicker(latestTickRef.current);
        }
      });
    };

    return () => {
      socket.close();

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = null;
      latestTickRef.current = null;
    };
  }, [symbol]);

  return ticker;
}
```

請回答：同樣做法能不能直接拿來處理 order book delta？

### 答案

Ticker 通常可以採 latest-value-wins：畫面在下一個 frame 顯示這段期間的最新價即可。

Order book delta 通常不能只保留最後一筆。前面的 delta 可能包含不同 price level 的新增、更新、刪除；丟掉其中一筆會讓本地 order book 錯誤，甚至破壞 sequence continuity。

Order book 應保存一個 delta queue，在下一個 frame 一次套用全部 delta：

```tsx
const pendingDeltasRef = useRef<DepthDelta[]>([]);
const frameRef = useRef<number | null>(null);

socket.onmessage = (event) => {
  const delta = parseAndValidateDepthDelta(event.data);
  pendingDeltasRef.current.push(delta);

  if (frameRef.current !== null) return;

  frameRef.current = window.requestAnimationFrame(() => {
    frameRef.current = null;

    const pending = pendingDeltasRef.current;
    pendingDeltasRef.current = [];

    setBook((previous) => {
      return pending.reduce(applyDepthDelta, previous);
    });
  });
};
```

這裡 batching 的是 React commit 次數，不是隨意丟棄 authoritative data。若 sequence 不連續，仍應放棄本地結果並重新抓 snapshot。

### 面試口述

> 我會先區分資料語意。Ticker 可以 latest-value-wins；order book delta 則必須依序完整套用。兩者都能用 requestAnimationFrame 降低 UI 更新頻率，但 order book 要 queue and fold，而不是只保存最後一筆。效能策略必須建立在資料正確性之上。

## 題目七：把 `levels` 加進 dependency，為什麼每筆訊息都讓 Socket 重連？

### 題目

題目五的 stale closure 被 dependency linter 抓到後，有人把 `levels` 補進 dependency array：

```tsx
export function useOrderBook(symbol: string) {
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const socket = new WebSocket(makeDepthUrl(symbol));

    socket.onmessage = (event) => {
      const delta = parseDepthDelta(event.data);
      setLevels(mergeLevels(levels, delta));
    };

    return () => socket.close();
  }, [symbol, levels]);

  return levels;
}
```

Dependency 已經完整，為什麼這仍是嚴重 bug？直接把 `levels` 從 dependency 移除可以嗎？

### 答案

每筆訊息都會產生新的 `levels` 陣列，接著觸發 render。React 比較 dependency 時發現 `levels` reference 改變，因此執行：

```txt
收到 delta
→ setLevels(newArray)
→ render
→ levels dependency 改變
→ cleanup 舊 socket
→ 建立新 socket
```

結果是每筆資料都重連，可能漏掉重連空窗期的 delta，也會增加 server 與瀏覽器負擔。

但直接刪掉 `levels` 也不對。Effect 仍讀取 `levels`，卻宣稱它沒有這個 dependency，`onmessage` 就會永遠使用建立連線時的舊 snapshot。

正確方向不是欺騙 linter，而是改寫程式，讓 subscription 不再需要讀 render scope 的 `levels`。

### 修正版

```tsx
useEffect(() => {
  const socket = new WebSocket(makeDepthUrl(symbol));

  socket.onmessage = (event) => {
    const delta = parseDepthDelta(event.data);
    setLevels((previous) => mergeLevels(previous, delta));
  };

  return () => {
    socket.onmessage = null;
    socket.close();
  };
}, [symbol]);
```

Functional updater 把「取得最新 queued state」交給 React。Effect 只剩真正決定 subscription identity 的 `symbol`，因此只有 symbol 改變才重連。

### 面試口述

> Dependency 完整只代表 effect 與它讀取的 reactive values 同步，不代表架構一定正確。把高頻 state 放進 subscription dependency，會讓每筆訊息都重新訂閱；我會用 functional updater 移除不必要的 state read，而不是關掉 linter 或硬刪 dependency。

## 題目八：只改篩選條件，WebSocket 為什麼也重連？

### 題目

```tsx
type StreamOptions = {
  market: "spot" | "futures";
  throttleMs: number;
};

function TickerPanel({ symbol }: { symbol: string }) {
  const [minimumQuantity, setMinimumQuantity] = useState(0);

  const options: StreamOptions = {
    market: "spot",
    throttleMs: 100,
  };

  const ticker = useTickerStream(symbol, options);

  return (
    <>
      <input
        type="number"
        value={minimumQuantity}
        onChange={(event) => setMinimumQuantity(Number(event.target.value))}
      />
      <TickerView ticker={ticker} minimumQuantity={minimumQuantity} />
    </>
  );
}

function useTickerStream(symbol: string, options: StreamOptions) {
  useEffect(() => {
    const socket = new WebSocket(makeTickerUrl(symbol, options));
    // 綁定事件……

    return () => socket.close();
  }, [symbol, options]);
}
```

使用者只修改本地篩選條件 `minimumQuantity`，為什麼 socket 仍會重連？

### 答案

每次 `TickerPanel` render 都會建立新的 `options` object。即使欄位內容相同，JavaScript 仍把兩次建立的 object 視為不同 reference：

```tsx
Object.is(
  { market: "spot", throttleMs: 100 },
  { market: "spot", throttleMs: 100 },
); // false
```

`minimumQuantity` 改變造成 parent render，新的 `options` 傳進 Hook；React 發現 `[symbol, options]` 中的 `options` 不同，便 cleanup 舊連線再建立新連線。

### 修正版

讓 effect dependency 直接表達真正影響連線的 primitive values，並在 effect 內建立設定 object：

```tsx
function useTickerStream(symbol: string, options: StreamOptions) {
  const { market, throttleMs } = options;

  useEffect(() => {
    const socket = new WebSocket(
      makeTickerUrl(symbol, { market, throttleMs }),
    );
    // 綁定事件……

    return () => socket.close();
  }, [symbol, market, throttleMs]);
}
```

若這些設定是固定常數，也可以移到 component 外。`useMemo` 有時能穩定 object reference，但這題更重要的是先讓 effect 的輸入模型清楚；不要把 memo 當作掩蓋錯誤 dependency 的工具。

### 面試口述

> React 用 `Object.is` 比較 dependencies。Render 內新建的 object 或 function 每次都是不同 identity，可能造成不必要的重新訂閱。我會優先讓 effect 依賴真正有語意的 primitive values，或把 object 移到 effect 內建立。

## 題目九：StrictMode 為什麼讓 Socket 連兩次？可以用 ref 擋掉嗎？

### 題目

開發環境看到 WebSocket 執行 `connect → disconnect → connect`，有人用 ref 阻止第二次 setup：

```tsx
export function useTicker(symbol: string) {
  const didConnectRef = useRef(false);

  useEffect(() => {
    if (didConnectRef.current) return;
    didConnectRef.current = true;

    const socket = new WebSocket(makeTickerUrl(symbol));
    return () => socket.close();
  }, [symbol]);
}
```

這個修正有什麼問題？

### 答案

在 root `StrictMode` 下，React 開發環境會額外執行一次 effect 的 `setup → cleanup → setup`，用來檢查 cleanup 是否完整。這不是 production 多連一次，而是 lifecycle 壓力測試。

上面的 ref 會讓流程變成：

```txt
第一次 setup：didConnectRef = true，建立 socket A
→ 測試 cleanup：關閉 socket A
→ 第二次 setup：因 ref 已是 true，直接 return
→ 元件留在畫面上，卻沒有任何有效連線
```

它也會破壞 `symbol` 改變時的重新同步：ref 已經是 `true`，新 symbol 不會建立新連線。

### 修正版

讓每一次 setup 都能被同一次 effect 回傳的 cleanup 完整復原：

```tsx
export function useTicker(symbol: string) {
  useEffect(() => {
    const socket = new WebSocket(makeTickerUrl(symbol));

    socket.onmessage = handleTickerMessage;

    return () => {
      socket.onmessage = null;
      socket.close();
    };
  }, [symbol]);
}
```

理想狀態是使用者無法分辨「只 setup 一次」與「setup → cleanup → setup」。如果第二次 setup 會壞掉，通常代表 cleanup 不對稱、資源不是可重建的，或把本該由使用者事件觸發的交易操作錯放進 effect。

像「送出訂單」這類不可因 remount 重複執行的 mutation，應放在 click / submit handler 或 mutation layer，不應靠 mount effect 加 ref 旗標去假裝只執行一次。

### 面試口述

> StrictMode 在開發環境重跑 effect，是為了驗證 setup 與 cleanup 是否對稱。我不會用 ref 擋掉第二次 setup，因為那只隱藏 lifecycle bug，還可能讓 cleanup 後沒有有效資源。連線 effect 應可安全地建立、清除、再建立。

## 題目十：離開頁面後，WebSocket 為什麼又自己連回來？

### 題目

```tsx
export function useReconnectingTicker(symbol: string) {
  useEffect(() => {
    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(makeTickerUrl(symbol));

      socket.onmessage = handleTickerMessage;
      socket.onclose = () => {
        window.setTimeout(connect, 1000);
      };
    }

    connect();

    return () => {
      socket.close();
    };
  }, [symbol]);
}
```

請找出 lifecycle bug，並說明切換 symbol 或 unmount 後會發生什麼事。

### 答案

Cleanup 呼叫 `socket.close()` 後，`onclose` 仍會執行並排入新的 reconnect timer。這個 timer 沒有被保存，也無法取消，因此一秒後舊 effect 又建立 socket。

切換 symbol 時，舊 closure 還記住舊 `symbol`，所以可能同時存在：

```txt
新 effect 建立 ETH socket
＋
舊 BTC effect 的 timer 建立 BTC socket
```

此外，固定一秒重試沒有 backoff；server 長時間不可用時，大量 client 可能同步形成 reconnect storm。

### 修正版

```tsx
export function useReconnectingTicker(symbol: string) {
  useEffect(() => {
    let disposed = false;
    let socket: WebSocket | null = null;
    let retryTimerId: number | null = null;
    let attempt = 0;

    function scheduleReconnect() {
      if (disposed || retryTimerId !== null) return;

      const baseDelay = Math.min(1000 * 2 ** attempt, 30_000);
      const delayWithJitter = baseDelay * (0.8 + Math.random() * 0.4);
      attempt += 1;

      retryTimerId = window.setTimeout(() => {
        retryTimerId = null;
        connect();
      }, delayWithJitter);
    }

    function connect() {
      if (disposed) return;

      const currentSocket = new WebSocket(makeTickerUrl(symbol));
      socket = currentSocket;

      currentSocket.onopen = () => {
        if (disposed || socket !== currentSocket) return;
        attempt = 0;
      };

      currentSocket.onmessage = (event) => {
        if (disposed || socket !== currentSocket) return;
        handleTickerMessage(event);
      };

      currentSocket.onclose = () => {
        if (disposed || socket !== currentSocket) return;
        scheduleReconnect();
      };
    }

    connect();

    return () => {
      disposed = true;

      if (retryTimerId !== null) {
        window.clearTimeout(retryTimerId);
      }

      if (socket !== null) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.close();
      }
    };
  }, [symbol]);
}
```

這個版本建立三道邊界：

1. `disposed` 阻止已失效 effect 再建立資源或處理訊息。
2. `retryTimerId` 確保最多只有一個待執行 timer，而且 cleanup 可取消。
3. `socket === currentSocket` 防止舊 socket 的晚到事件影響目前連線。

正式產品還要加入網路狀態、頁面可見性、認證更新、最大重試策略與監控。Backoff 的目的是避免故障期間持續壓垮 server；jitter 則避免大量 client 同一時間重試。

### 面試口述

> Reconnect timer 也是 effect 建立的外部資源，必須能被 cleanup 取消。我會用 disposed flag 阻止舊 closure 復活、保存 timer id、忽略非目前 socket 的晚到事件，並用 exponential backoff 加 jitter 避免 reconnect storm。

## 十題完成後，檢查是否真的會了

不看上面的答案，回答：

1. 為什麼 setter 後立刻讀 state 會讀到舊值？
2. 哪兩類程式通常不需要 effect？
3. Functional updater 與 ref 分別解決什麼問題？
4. Effect dependency 正確，為什麼仍可能有 request race？
5. Symbol 切換時 WebSocket cleanup 要做什麼？
6. 為什麼 ticker 可以只留最新值，order book delta 不行？
7. 為什麼把 `levels` 放進 dependency 會造成每筆訊息都重連？
8. 為什麼內容相同的 options object 仍可能觸發 effect？
9. StrictMode 的 `setup → cleanup → setup` 在檢查什麼？
10. Reconnect timer 為什麼也必須納入 cleanup？

如果任何一題需要翻答案，隔天先重寫那一題，不要急著往更多第三方 Hooks 前進。

## 下一步

- 想接著挑戰 identity、render 與 concurrent UI：前往 [React 現場實戰題第二回](./14-react-render-identity-live-demo.md)。
- 想繼續練 React 基礎判斷：回到 [Vue 轉 React：30 次反射訓練](./02-react-reflex-drills.md)。
- 想深入 snapshot + delta：閱讀 [交易產品前端情境題](./08-crypto-product-case.md)。
- 想深入高併發、多分頁與 refetch storm：回到 [Realtime Socket Governance](./10-realtime-socket-governance.md)。
