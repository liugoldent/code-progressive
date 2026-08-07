---
sidebar_position: 17
title: "React 現場實戰題（第一回補強）：State / Effect / Async 組合題"
description: "六題 React 第一回補強題：用 state consistency、derived state、debounce、request race、subscription 與 WebSocket closure，練習一次處理兩個互相影響的問題。"
tags:
  - React
  - Hooks
  - Async
  - Interview
keywords: ["React 補強題", "React derived state", "React debounce cleanup", "React request race", "React stale closure", "React WebSocket functional updater"]
---

# React 現場實戰題（第一回補強）：State / Effect / Async 組合題

:::tip 系列導覽

[回到系列總覽](./13-react-live-interview-series.md) · [入門篇：Props / State / Form / Effect](./15-react-foundations-live-demo.md) · [第一回：State / Effect / Realtime](./11-react-state-effect-live-demo.md) · **第一回補強：State / Effect / Async 組合題** · [第二回：Identity / Render / Concurrent UI](./14-react-render-identity-live-demo.md)

:::

這一篇不是第三回。它把第一回已經出現的觀念兩兩組合，難度只提高一小階：不只找出單一錯誤，還要確認修正一個問題後，有沒有製造另一個問題。

每題先花 3 到 5 分鐘回答四件事：

1. 使用者會看到什麼？
2. 哪一次 render、effect 或 async callback 使用了哪份資料？
3. 最小修正是什麼？
4. 修正後還剩下什麼 edge case？

如果第一回還需要慢慢讀，可以先做前四題；第五、六題留到第二輪。

## 題目一：數量變成 2，為什麼金額仍然是 100？

### 題目

按下 `Double quantity` 後，請預測畫面上的 quantity 與 notional：

```tsx
import { useState } from "react";

export function OrderDraft() {
  const [quantity, setQuantity] = useState(1);
  const [notional, setNotional] = useState(100);
  const price = 100;

  function handleDouble() {
    setQuantity(quantity * 2);
    setNotional(quantity * price);
  }

  return (
    <>
      <p>quantity: {quantity}</p>
      <p>notional: {notional}</p>
      <button onClick={handleDouble}>Double quantity</button>
    </>
  );
}
```

再回答：把第二行改成 `setNotional(quantity * 2 * price)` 雖然能修好這個按鈕，為什麼仍不一定是最好的資料設計？

<details>
<summary>展開答案</summary>

第一次按下後，畫面是：

```txt
quantity: 2
notional: 100
```

這次 event handler 讀到的是同一次 render 的 snapshot：

```txt
目前 render：quantity = 1、notional = 100
→ setQuantity(2) 排入更新
→ quantity 這個區域變數仍然是 1
→ setNotional(1 * 100) 排入更新
→ 下一次 render：quantity = 2、notional = 100
```

Setter 不會在目前 handler 中直接修改 `quantity`。

如果 notional 永遠等於 `quantity * price`，它不是獨立資料，而是可以在 render 時計算的 derived value。最簡單的設計是只保存 quantity：

```tsx
export function OrderDraft() {
  const [quantity, setQuantity] = useState(1);
  const price = 100;
  const notional = quantity * price;

  return (
    <>
      <p>quantity: {quantity}</p>
      <p>notional: {notional}</p>
      <button onClick={() => setQuantity((value) => value * 2)}>
        Double quantity
      </button>
    </>
  );
}
```

這樣不需要記得在每個會改 quantity 或 price 的地方同步更新 notional，也不會出現兩份 state 暫時不一致。

只有當 notional 可以被使用者獨立修改，或後端回傳的 notional 不等於本地計算結果時，它才可能值得成為另一份 state。此時要先明確定義哪一份是 source of truth。

### 面試口述

> Event handler 讀到的是該次 render 的 state snapshot，setter 只會排程下一次 render。這裡更根本的問題是把可推導的 notional 也存成 state；我會只保存 quantity，在 render 時計算 notional，減少同步點與不一致狀態。

</details>

## 題目二：畫面金額已更新，送出的卻可能是上一筆金額？

### 題目

這個表單用 effect 維護 `total`。使用者把 quantity 從 `1` 改成 `2` 後，程式允許 quantity 與 total 暫時不一致：

```tsx
import { useEffect, useState } from "react";

type Props = {
  price: number;
  submitOrder: (order: { quantity: number; total: number }) => void;
};

export function OrderForm({ price, submitOrder }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(price);

  useEffect(() => {
    setTotal(quantity * price);
  }, [quantity, price]);

  function handleSubmit() {
    submitOrder({ quantity, total });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="number"
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value))}
      />
      <p>Total: {total}</p>
      <button type="submit">Submit</button>
    </form>
  );
}
```

請找出這個設計的兩個問題，並改成不需要 effect 的版本。

<details>
<summary>展開答案</summary>

`total` 是 `quantity` 與 `price` 的同步計算結果，不需要透過 effect 再存成 state。這個寫法會造成：

1. quantity 更新後，React 先以新 quantity 與舊 total render；effect 執行後才再更新 total，多了一次 render。
2. 程式存在「quantity 已是新值、total 仍是舊值」的中間狀態。其他 event、layout effect 或測試若在這個邊界讀資料，可能拿到不一致的 order。

瀏覽器的一般人類點擊通常會發生在 effect flush 之後，所以不能武斷說每次手動操作都一定送出舊 total；真正的問題是資料模型允許不一致，而且提交正確性依賴 effect 何時完成。

直接在 render 推導 total，提交時也從同一份 source of truth 建立 payload：

```tsx
export function OrderForm({ price, submitOrder }: Props) {
  const [quantityDraft, setQuantityDraft] = useState("1");
  const quantity = Number(quantityDraft);
  const isValid = Number.isFinite(quantity) && quantity > 0;
  const total = isValid ? quantity * price : 0;

  function handleSubmit() {
    if (!isValid) return;
    submitOrder({ quantity, total });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        type="number"
        value={quantityDraft}
        onChange={(event) => setQuantityDraft(event.target.value)}
      />
      <p>Total: {total}</p>
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
```

這個版本也保留了 input 的空字串 draft，直到送出前才轉成 domain number。

### 面試口述

> Effect 是同步外部系統，不是用來補做每個純計算。total 可以從 quantity 與 price 推導，我會在 render 直接計算，並在提交時用同一份資料建立 payload，避免額外 render 與短暫不一致狀態。

</details>

## 題目三：已經 debounce，搜尋結果為什麼仍可能跳回舊關鍵字？

### 題目

這個搜尋框會在停止輸入 300ms 後送 request：

```tsx
import { useEffect, useState } from "react";

type Product = { id: string; name: string };

async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
  return response.json();
}

export function ProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const timerId = window.setTimeout(async () => {
      const nextProducts = await searchProducts(query);
      setProducts(nextProducts);
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [query]);

  return (
    <>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </>
  );
}
```

使用者停在 `bit` 超過 300ms，request A 已送出；接著輸入 `bitcoin`，request B 也送出。B 先完成，A 後完成。最後畫面會顯示哪一份結果？為什麼 `clearTimeout` 沒有保護到這裡？

<details>
<summary>展開答案</summary>

最後可能顯示 request A 的 `bit` 結果：

```txt
bit 的 timer 到期
→ request A 開始，timer 已經完成
→ query 變成 bitcoin，cleanup 呼叫 clearTimeout(A 的 timer)
→ 但 request A 已經在網路上，clearTimeout 不能取消它
→ request B 開始並先完成，顯示 bitcoin
→ request A 晚到，覆蓋成 bit
```

Debounce 只減少 request 啟動次數，不自動解決已送出 request 的回應順序。

如果 API 支援 `AbortSignal`，可以同時清除 timer 與中止 fetch：

```tsx
useEffect(() => {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    setProducts([]);
    return;
  }

  const controller = new AbortController();

  const timerId = window.setTimeout(async () => {
    try {
      const response = await fetch(
        `/api/products?q=${encodeURIComponent(normalizedQuery)}`,
        { signal: controller.signal },
      );
      const nextProducts: Product[] = await response.json();
      setProducts(nextProducts);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error(error);
    }
  }, 300);

  return () => {
    window.clearTimeout(timerId);
    controller.abort();
  };
}, [query]);
```

Production 中還要處理 loading 與非 abort error。即使底層工作不能真的取消，也至少要用 cleanup flag 或 request id 忽略過期結果，確保只有目前 query 的 request 可以更新畫面。

### 面試口述

> Debounce 只取消尚未開始的 timer，不能取消已經送出的 request，所以仍可能有 response race。我會在 effect cleanup 同時清 timer 與 abort request；若工作不可取消，就用 request identity 忽略過期結果。

</details>

## 題目四：切換商品後，舊 request 的 `finally` 為什麼關掉新商品的 loading？

### 題目

這段程式已經用 `ignore` 防止舊 response 寫入 product，但 loading 仍偶爾提早消失：

```tsx
import { useEffect, useState } from "react";

type Product = { id: string; name: string };

declare function fetchProduct(id: string): Promise<Product>;

export function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetchProduct(productId)
      .then((nextProduct) => {
        if (!ignore) setProduct(nextProduct);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  return <p>{product?.name ?? "No product"}</p>;
}
```

請排出這個時序：A request 開始 → 切到 B → A 完成 → B 完成。問題出在哪一行？

<details>
<summary>展開答案</summary>

`ignore` 只保護了 `setProduct`，沒有保護 `finally` 裡的 `setLoading(false)`：

```txt
A 開始 → loading = true
切到 B → A cleanup：ignoreA = true
B 開始 → loading = true
A 完成 → 不寫 product，但仍執行 setLoading(false)
B 還在等待，畫面卻已經不是 Loading
B 完成 → 寫入 B，再設 loading = false
```

最小修正是讓舊 request 不能更新任何屬於目前 request 的狀態：

```tsx
useEffect(() => {
  let ignore = false;
  setLoading(true);

  fetchProduct(productId)
    .then((nextProduct) => {
      if (!ignore) setProduct(nextProduct);
    })
    .catch((error) => {
      if (!ignore) console.error(error);
    })
    .finally(() => {
      if (!ignore) setLoading(false);
    });

  return () => {
    ignore = true;
  };
}, [productId]);
```

還可以在新 request 開始時先 `setProduct(null)`，但要看產品需求：保留舊內容搭配 loading indicator，與清空內容顯示 skeleton，都是合理 UI，必須明確選擇。

若資料存取更複雜，React Query 等 server-state library 可以幫忙管理 query identity、cache 與 stale result；但仍要理解這題的 request ownership，才能正確設定 query key。

### 面試口述

> 過期 request 不只不能寫 data，也不能改目前 request 的 loading 或 error。這裡 A 的 finally 會關掉 B 的 loading；我會以同一個 ignore flag 或 request id 保護這個 request 的所有狀態更新。

</details>

## 題目五：快捷鍵沒有重複註冊，為什麼仍一直使用舊模式？

### 題目

按 `D` 可以切換 dark mode。為了只註冊一次 listener，effect 使用空 dependency：

```tsx
import { useEffect, useState } from "react";

export function ThemeShortcut() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "d") {
        setDark(!dark);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <p>theme: {dark ? "dark" : "light"}</p>;
}
```

連按三次 `D`，畫面依序會如何變化？直接把 `dark` 加進 dependency 可以修正嗎？有沒有更貼近這個需求的寫法？

<details>
<summary>展開答案</summary>

三次都會執行第一次 render 建立的 handler，其中 `dark` 永遠是 `false`：

```txt
第一次 D → setDark(true) → dark
第二次 D → setDark(true) → 仍是 dark
第三次 D → setDark(true) → 仍是 dark
```

把 `dark` 加進 dependency 可以得到正確結果。每次 dark 改變時，React 會先用舊 handler reference cleanup，再註冊新 handler；這在低頻 state 與單一 listener 的情境通常完全可接受。

但這個 callback 的需求只是「根據前一個 state 反轉」，不需要讀特定 render 的 dark。Functional updater 更直接，也能讓 subscription 保持一次：

```tsx
useEffect(() => {
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key.toLowerCase() === "d") {
      setDark((currentDark) => !currentDark);
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```

不要為了維持空 dependency 就任意漏掉 reactive value。這題能使用 `[]`，是因為改寫後的 effect 確實不再讀 dark。

### 面試口述

> 空 dependency 讓 listener 捕捉第一次 render 的 dark，所以每次都要求設成 true。若 callback 只需要依前值切換，我會用 functional updater，讓 effect 不再讀 dark；若 callback 的邏輯真的依賴目前 dark，就把它列入 dependency 並正確 cleanup。

</details>

## 題目六：修好 stale closure 後，WebSocket 為什麼每筆訊息都重連？

### 題目

最初的程式會一直遺失先前的 trades：

```tsx
import { useEffect, useState } from "react";

type Trade = { id: string; price: number };

export function RecentTrades({ symbol }: { symbol: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const socket = new WebSocket(`/ws/trades?symbol=${symbol}`);

    socket.onmessage = (event) => {
      const trade: Trade = JSON.parse(event.data);
      setTrades([...trades, trade].slice(-20));
    };

    return () => socket.close();
  }, [symbol]);

  return <p>{trades.map((trade) => trade.price).join(", ")}</p>;
}
```

同事看到 lint 提醒後，把 dependency 改成 `[symbol, trades]`。請說明：

1. 原版為什麼會遺失 trades？
2. 加入 trades 後為什麼每筆訊息都重連？
3. 如何同時修好 closure 與 connection lifecycle？

<details>
<summary>展開答案</summary>

原版 effect 建立 socket 時，`onmessage` 捕捉當次 render 的 trades。初次通常是空陣列，因此每一筆訊息都在做：

```tsx
setTrades([...[], trade].slice(-20));
```

畫面只留下最新一筆。

加入 trades dependency 後，每次 message 更新 trades 都會觸發 render；dependency 改變使 effect cleanup 舊 socket、建立新 socket。資料事件反過來控制 connection lifecycle，形成每筆訊息重連。

這個更新只需要「React 目前排隊中的最新 trades」，適合 functional updater：

```tsx
useEffect(() => {
  const socket = new WebSocket(`/ws/trades?symbol=${symbol}`);

  socket.onmessage = (event) => {
    const trade: Trade = JSON.parse(event.data);
    setTrades((currentTrades) => [...currentTrades, trade].slice(-20));
  };

  return () => socket.close();
}, [symbol]);
```

Effect 現在只讀 symbol，因此 socket 只在 symbol 改變時重建。切換 symbol 時是否要立即 `setTrades([])` 是另一個產品決策；如果舊 symbol 的 trades 不應留在畫面，可以在 effect setup 開始時清空，或在更上層依 symbol 管理 cache。

Production 還要驗證訊息格式、處理 error、重連與晚到事件。這一題的核心先保持單純：subscription dependency 描述連線身份，functional updater 處理由訊息累積的 React state。

### 面試口述

> 原版 onmessage 捕捉了建立 socket 時的 trades；把 trades 加進 dependency 雖修正 closure，卻讓每次資料更新都重建連線。我會用 functional updater 取得最新佇列，讓 effect dependency 只保留真正決定連線身份的 symbol。

</details>

## 六題完成後，檢查是否真的會了

先關掉答案，用一分鐘回答每題：

1. 什麼資料應在 render 推導，而不是另外保存成 state？
2. 為什麼用 effect 同步 derived state 會產生額外 render 與不一致窗口？
3. Debounce 已經清 timer，為什麼還需要處理 request race？
4. 為什麼過期 request 的 `finally` 也不能任意更新 loading？
5. 什麼時候用 effect dependency 重新訂閱，什麼時候用 functional updater？
6. 如何讓 WebSocket 的 connection lifecycle 不被每筆 message state 綁住？

### 自我評分

| 狀態 | 判準 | 下一步 |
| --- | --- | --- |
| 還在熟悉 | 能看懂答案，但自己只能找到一個 bug | 回第一回重做對應題，再回來補第二個 edge case |
| 補強通過 | 六題中至少四題能說出「結果 → 時序 → 修法」 | 開始第二回前兩題，先練 identity 與 state reset |
| 可以進階 | 能指出修法的限制，也能提出測試案例 | 進入第二回完整六題 |

不需要等到每題都能背出完整程式碼。能從 state owner、render snapshot 與 effect lifecycle 重新推導，才是這篇的通過標準。

## 下一步

- 想繼續挑戰 identity、render 與 concurrent UI：前往 [React 現場實戰題第二回](./14-react-render-identity-live-demo.md)。
- Request race 或 WebSocket 還卡住：回到 [React 現場實戰題第一回](./11-react-state-effect-live-demo.md) 的題目四、五、七。
- 想多練短題：前往 [Vue 轉 React：30 次反射訓練](./02-react-reflex-drills.md)。
