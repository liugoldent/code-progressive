---
sidebar_position: 15
title: "React 現場實戰題（入門篇）：Props / State / Form / Effect"
description: "給 React 初學者的六題現場實戰：JSX event handler、唯讀 props、immutable state、controlled input、state owner 與 useEffect cleanup。"
tags:
  - React
  - Hooks
  - Beginner
  - Interview
keywords: ["React 初學者面試題", "React 入門考題", "React props state", "React controlled input", "React useEffect cleanup", "React 面試題"]
---

# React 現場實戰題（入門篇）：Props / State / Form / Effect

:::tip 系列導覽

[回到系列總覽](./13-react-live-interview-series.md) · **入門篇：Props / State / Form / Effect** · [第一回：State / Effect / Realtime](./11-react-state-effect-live-demo.md) · [第一回補強：State / Effect / Async 組合題](./16-react-state-effect-reinforcement.md) · [第二回：Identity / Render / Concurrent UI](./14-react-render-identity-live-demo.md)

:::

這一篇是給剛學 React 的你。六題的難度會從入門慢慢走到中階，不要求先懂 concurrent rendering、external store 或複雜 WebSocket。

先記住一條主線：

```txt
props / state
→ React 呼叫 component
→ component 回傳 JSX
→ 使用者觸發 event
→ event handler 更新 state
→ React 再呼叫 component
→ 畫面更新
```

每題請照這個順序練：

1. 先不要執行，預測畫面或錯誤。
2. 指出是哪一行造成問題。
3. 用自己的話解釋 React 為什麼這樣做。
4. 關掉答案，從空白寫一次修正版。

## 題目一：為什麼還沒點按鈕，就先執行下單？

### 題目

下面的按鈕希望在使用者點擊後才呼叫 `onBuy`：

```tsx
type BuyButtonProps = {
  onBuy: () => void;
};

export function BuyButton({ onBuy }: BuyButtonProps) {
  console.log("render BuyButton");

  return (
    <button onClick={onBuy()}>
      Buy
    </button>
  );
}
```

請回答：

1. `onBuy` 何時執行？
2. 使用者真的點按鈕時，還會不會執行？
3. TypeScript 為什麼可能在 `onClick` 顯示錯誤？

### 答案

`onBuy()` 會在 `BuyButton` render 時立刻執行，不是在 click 時執行。

JSX 的 `{}` 裡放的是 JavaScript expression：

```tsx
onClick={onBuy()}
```

React 呼叫 `BuyButton()` 建立 JSX 時，JavaScript 必須先算出 `onBuy()` 的結果，才能把結果交給 `onClick`。

假設 `onBuy` 沒有 return，執行結果就是 `undefined`：

```txt
React 呼叫 BuyButton()
→ console.log("render BuyButton")
→ 立刻呼叫 onBuy()
→ onBuy() 回傳 undefined
→ 實際變成 onClick={undefined}
```

所以使用者之後點按鈕時，沒有 function 可以執行。TypeScript 也會提醒你：`onClick` 需要 event handler function，但你傳進去的是 `void`。

如果 `onBuy()` 內又更新 parent state，還可能形成：

```txt
render
→ onBuy() 更新 state
→ 再 render
→ 又執行 onBuy()
→ 再更新 state
→ Too many re-renders
```

### 修正版一：直接傳 function

不需要額外參數時，直接把 function reference 交給 React：

```tsx
export function BuyButton({ onBuy }: BuyButtonProps) {
  return <button onClick={onBuy}>Buy</button>;
}
```

注意差別：

```tsx
onClick={onBuy}   // 把 function 交給 React，點擊時才呼叫
onClick={onBuy()} // 現在立刻呼叫，把結果交給 React
```

### 修正版二：需要傳參數

需要傳商品時，用另一個 function 包住：

```tsx
type BuyButtonProps = {
  symbol: string;
  onBuy: (symbol: string) => void;
};

export function BuyButton({ symbol, onBuy }: BuyButtonProps) {
  return (
    <button onClick={() => onBuy(symbol)}>
      Buy {symbol}
    </button>
  );
}
```

這裡 arrow function 只是在 render 時被建立；function body 要等 click 才執行。

同一個觀念也適用於 setter：

```tsx
// 錯誤：render 時立刻 setCount
<button onClick={setCount(count + 1)}>add</button>

// 正確：click 時才 setCount
<button onClick={() => setCount((count) => count + 1)}>add</button>
```

### 面試口述

> JSX event prop 要接收 function。寫 `onClick={handleClick}` 是傳 function reference；寫 `onClick={handleClick()}` 則會在 render 時立即呼叫，並把 return value 傳給 onClick。需要參數時，我會用 arrow function 包住呼叫。

## 題目二：Child 可以直接修改 parent 傳進來的 props 嗎？

### 題目

Parent 保存一份訂單 state，再把整個 object 傳給 child：

```tsx
import { useState } from "react";

type Order = {
  symbol: string;
  price: string;
};

function PriceInput({ order }: { order: Order }) {
  return (
    <input
      value={order.price}
      onChange={(event) => {
        order.price = event.target.value;
      }}
    />
  );
}

export function OrderForm() {
  const [order] = useState<Order>({
    symbol: "BTCUSDT",
    price: "65000",
  });

  return <PriceInput order={order} />;
}
```

使用者輸入新價格時，這樣算是「已經修改 React state」嗎？畫面能可靠更新嗎？

### 答案

不算。這段程式直接改了 object，但沒有呼叫 React setter，因此 React 不知道要安排下一次 render。

Props 應視為唯讀資料。資料雖然是 object reference，child 在 JavaScript 層面確實有能力修改它，但這會破壞 React 的單向資料流：

```txt
OrderForm 擁有 order state
→ 透過 props 把 order 傳給 PriceInput
→ PriceInput 應該讀取 props
→ 想修改時，透過 callback 通知 owner
→ owner 呼叫 setter 建立新 state
```

錯誤版本只有：

```txt
直接修改 order.price
→ 沒有呼叫 setter
→ React 沒收到更新通知
→ controlled input 可能被舊畫面值拉回去
```

更麻煩的是，其他地方如果也持有這個 object reference，資料已經被偷偷修改，卻沒有清楚的更新時間點，debug 會很困難。

### 修正版：owner 更新，child 發出意圖

```tsx
type PriceInputProps = {
  price: string;
  onPriceChange: (price: string) => void;
};

function PriceInput({ price, onPriceChange }: PriceInputProps) {
  return (
    <input
      value={price}
      onChange={(event) => onPriceChange(event.target.value)}
    />
  );
}

export function OrderForm() {
  const [order, setOrder] = useState<Order>({
    symbol: "BTCUSDT",
    price: "65000",
  });

  function updatePrice(price: string) {
    setOrder((previous) => ({
      ...previous,
      price,
    }));
  }

  return (
    <PriceInput
      price={order.price}
      onPriceChange={updatePrice}
    />
  );
}
```

現在資料流很清楚：

```txt
input onChange
→ child 呼叫 onPriceChange(nextPrice)
→ parent 呼叫 setOrder(...)
→ React 重新 render parent 與 child
→ 新 price 透過 props 回到 input
```

Child 不是完全不能有 state。像是 dropdown 開關、focus、暫時 draft，都可能適合 local state；但不能不經 owner 同意，直接改 owner 傳下來的資料。

### 面試口述

> Props 是 parent 傳給 child 的唯讀輸入。直接 mutation 不會通知 React，也會破壞單向資料流。我會讓擁有 state 的 component 提供 callback，child 只描述使用者意圖，再由 owner 用 setter 建立下一份 state。

## 題目三：更新一個欄位，為什麼其他欄位消失或畫面沒變？

### 題目

下面是兩種常見寫法：

```tsx
type OrderDraft = {
  symbol: string;
  price: string;
  quantity: string;
};

const [draft, setDraft] = useState<OrderDraft>({
  symbol: "BTCUSDT",
  price: "65000",
  quantity: "1",
});

function wrongUpdatePrice(nextPrice: string) {
  draft.price = nextPrice;
  setDraft(draft);
}

function wrongUpdateQuantity(nextQuantity: string) {
  setDraft({ quantity: nextQuantity } as OrderDraft);
}
```

兩個 function 各有什麼問題？

### 答案

第一個問題是直接 mutation，接著把同一個 object reference 傳回 setter：

```tsx
draft.price = nextPrice;
setDraft(draft);
```

React state 前後可能是同一個 reference：

```tsx
Object.is(previousDraft, nextDraft); // true
```

React 可能跳過 render。即使因其他原因重新 render 後看到了被修改的內容，資料變化仍不是透過正確 state update 發生的。

第二個問題是誤以為 Hook setter 會自動合併 object：

```tsx
setDraft({ quantity: nextQuantity } as OrderDraft);
```

`useState` setter 是替換整個 state，不會像 class component 的某些 `setState` 用法那樣做 shallow merge。執行後只剩 `quantity`；`symbol` 與 `price` 都消失了。

`as OrderDraft` 只是叫 TypeScript 相信你，不會在 runtime 自動補欄位。這也是不應用 type assertion 隱藏資料錯誤的例子。

### 修正版：建立新 object，保留其他欄位

```tsx
function updatePrice(nextPrice: string) {
  setDraft((previous) => ({
    ...previous,
    price: nextPrice,
  }));
}

function updateQuantity(nextQuantity: string) {
  setDraft((previous) => ({
    ...previous,
    quantity: nextQuantity,
  }));
}
```

逐行看：

```txt
setDraft(previous => ...)
→ React 把最新的 queued state 交給 previous
→ ...previous 複製 symbol、price、quantity
→ 後面的 price 或 quantity 覆蓋指定欄位
→ 回傳新的 object reference
→ React 安排下一次 render
```

Property 順序很重要：

```tsx
// 正確：nextPrice 最後覆蓋舊 price
({ ...previous, price: nextPrice })

// 錯誤：舊 price 最後又蓋掉 nextPrice
({ price: nextPrice, ...previous })
```

### Nested object 也要更新那一層

假設 state 多一層設定：

```tsx
type Draft = {
  price: string;
  settings: {
    postOnly: boolean;
    reduceOnly: boolean;
  };
};
```

不能直接改 `previous.settings.postOnly`。要沿著修改路徑建立新 object：

```tsx
setDraft((previous) => ({
  ...previous,
  settings: {
    ...previous.settings,
    postOnly: true,
  },
}));
```

不需要把所有未修改的深層資料都 clone；只要替換從 root 到被改欄位的那條路徑。資料很複雜時可以考慮 Immer，但仍要先懂 immutable update 的原因。

### 面試口述

> React state 應視為 immutable。直接 mutation 再傳回同一個 reference，React 可能無法辨識更新；而 useState setter 會替換整個值，不會自動 merge object。我會用 functional updater 讀最新 state，並沿著修改路徑建立新的 object 或 array。

## 題目四：為什麼數字 input 無法保持空白？

### 題目

下單數量必須是正數，所以程式一開始就把 input 轉成 number：

```tsx
import { useState } from "react";

export function QuantityInput() {
  const [quantity, setQuantity] = useState(1);

  return (
    <input
      type="number"
      min="0"
      value={quantity}
      onChange={(event) => {
        setQuantity(Number(event.target.value));
      }}
    />
  );
}
```

使用者全選內容後按 Backspace，想先清空再輸入別的數字。畫面可能發生什麼？

### 答案

Browser input event 的 `event.target.value` 即使來自 `type="number"`，仍然是 string。當欄位被清空時：

```tsx
event.target.value === "";
Number("") === 0;
```

程式立刻把空字串轉成 `0`，state 變成 number `0`。下一次 render 又把 `value={0}` 放回 input，所以使用者無法保留「正在編輯中的空白狀態」。

HTML 的 `min="0"` 也不代表 React state 自動通過業務驗證；它主要提供 browser 表單限制與 UI 行為。你仍要在提交前檢查數值是否合法。

### 修正版：編輯 draft 先保存 string

```tsx
import { useState } from "react";

export function QuantityInput() {
  const [quantity, setQuantity] = useState("1");

  const parsedQuantity = Number(quantity);
  const isValid =
    quantity.trim() !== "" &&
    Number.isFinite(parsedQuantity) &&
    parsedQuantity > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) return;

    submitOrder({ quantity: parsedQuantity });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        min="0"
        step="any"
        value={quantity}
        onChange={(event) => setQuantity(event.target.value)}
      />
      {!isValid && <p role="alert">請輸入大於 0 的數量</p>}
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}
```

這裡分成兩種資料語意：

- `quantity` string：使用者正在輸入的 UI draft，可以是 `""`。
- `parsedQuantity` number：通過驗證後，才交給 domain 或 API。

對金額與交易精度，production 通常也不能只依賴 JavaScript floating-point `number`；可能需要 decimal library、整數最小單位或後端規格。但那是下一層問題，先把 input draft 與 domain value 分開。

### Controlled 與 uncontrolled

上面的 input 是 controlled input：

```txt
value 來自 React state
onChange 把使用者輸入寫回同一份 state
```

如果只有 `value` 沒有 `onChange`，input 會接近唯讀。若使用 `defaultValue`，則只是提供初始值，後續主要由 DOM 保存目前內容，屬於 uncontrolled input。

表單題看到 `value` 時，先找它的 `onChange` 是否更新同一份 source of truth。

### 面試口述

> Input event value 是 string，包含使用者編輯中的空字串。若每次 onChange 都立刻 Number 轉換，空字串會變 0，造成 controlled input 難以編輯。我會先用 string 保存 draft，在顯示驗證或 submit boundary 再解析成 domain value。

## 題目五：Input 已更新，Summary 為什麼沒有一起變？

### 題目

兩個 sibling components 各自保存 quantity：

```tsx
import { useState } from "react";

function QuantityEditor({ initialQuantity }: { initialQuantity: string }) {
  const [quantity, setQuantity] = useState(initialQuantity);

  return (
    <input
      value={quantity}
      onChange={(event) => setQuantity(event.target.value)}
    />
  );
}

function OrderSummary({
  initialQuantity,
  price,
}: {
  initialQuantity: string;
  price: string;
}) {
  const [quantity] = useState(initialQuantity);
  const total = Number(quantity) * Number(price);

  return <p>Total: {total}</p>;
}

export function TradingPanel() {
  return (
    <>
      <QuantityEditor initialQuantity="1" />
      <OrderSummary initialQuantity="1" price="65000" />
    </>
  );
}
```

使用者把 input 從 `1` 改成 `2`，為什麼 Summary 還是 `65000`？

### 答案

兩個 component 各自呼叫 `useState`，所以它們得到的是兩份完全不同的 state：

```txt
QuantityEditor instance → 自己的 quantity state
OrderSummary instance   → 自己的 quantity state
```

相同的初始字串 `"1"` 不會讓兩份 state 自動連線。Editor 呼叫自己的 setter，只會安排 Editor 所在資料流的更新；Summary 沒收到新 prop，也沒有自己的 setter 被呼叫。

這是典型的 state owner 問題。當兩個 sibling 都需要同一份資料時，通常把 state 提升到它們最近的共同 parent。

### 修正版：Lifting state up

```tsx
type QuantityEditorProps = {
  quantity: string;
  onQuantityChange: (quantity: string) => void;
};

function QuantityEditor({
  quantity,
  onQuantityChange,
}: QuantityEditorProps) {
  return (
    <input
      value={quantity}
      onChange={(event) => onQuantityChange(event.target.value)}
    />
  );
}

function OrderSummary({
  quantity,
  price,
}: {
  quantity: string;
  price: string;
}) {
  const total = Number(quantity) * Number(price);
  return <p>Total: {total}</p>;
}

export function TradingPanel() {
  const [quantity, setQuantity] = useState("1");
  const price = "65000";

  return (
    <>
      <QuantityEditor
        quantity={quantity}
        onQuantityChange={setQuantity}
      />
      <OrderSummary quantity={quantity} price={price} />
    </>
  );
}
```

現在只有一份 quantity：

```txt
TradingPanel 擁有 quantity state
├─ QuantityEditor 讀 quantity，透過 callback 要求修改
└─ OrderSummary 讀同一份 quantity，計算 total
```

使用者輸入時：

```txt
QuantityEditor onChange
→ setQuantity(next)
→ TradingPanel render
→ 新 quantity 同時傳給兩個 children
→ Editor 與 Summary 顯示一致資料
```

`total` 不需要另一個 state，也不需要 effect，因為每次 render 都能從 `quantity` 與 `price` 算出來：

```tsx
const total = Number(quantity) * Number(price);
```

### State 不是越高越好

Lifting state up 的目標是放到「需要共享它的最近共同 owner」，不是把所有 state 都塞進 app root 或 global store。

- 只有單一 input 使用：留在 input 附近。
- Siblings 需要共享：提升到最近共同 parent。
- URL 必須反映：可能由 router/search params 擁有。
- 後端 cache 資料：可能交給 server-state library。

先找 owner，再選工具。

### 面試口述

> 兩個 component 各自 useState 會建立兩份獨立資料，不會因初始值相同就同步。當 sibling 需要相同 quantity，我會把 state 提升到最近共同 parent，透過 props 傳值、callback 傳意圖；total 這類可計算資料則直接在 render 推導，不另存 state。

## 題目六：為什麼快捷鍵觸發兩次，而且一直送出舊商品？

### 題目

下單頁想監聽 `Ctrl + Enter`：

```tsx
import { useEffect } from "react";

type QuickOrderProps = {
  symbol: string;
  onSubmit: (symbol: string) => void;
};

export function QuickOrder({ symbol, onSubmit }: QuickOrderProps) {
  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        onSubmit(symbol);
      }
    });
  }, []);

  return <p>Current symbol: {symbol}</p>;
}
```

請找出至少兩個問題：

1. Component unmount 後會怎樣？
2. `symbol` 從 BTC 切到 ETH 後，快捷鍵可能送出哪一個商品？
3. 為什麼開發環境有時更容易看到重複監聽？

### 答案

第一個問題是沒有 cleanup。`addEventListener` 把 listener 註冊到 React 外面的 browser system；component unmount 不會自動幫你移除。

如果頁面離開又回來，每次 mount 都可能多留一個 listener：

```txt
第一次 mount → listener A
unmount       → A 沒移除
第二次 mount → listener B
按快捷鍵      → A、B 都執行
```

第二個問題是 stale closure。Dependency array 是 `[]`，effect 只使用第一次 render 建立的 callback。那個 callback 捕捉了第一次 render 的 `symbol` 與 `onSubmit`：

```txt
第一次 render：symbol = BTCUSDT
→ effect 建立 listener
→ listener 記住 BTCUSDT

之後 render：symbol = ETHUSDT
→ [] 使 effect 不重新同步
→ 舊 listener 仍使用 BTCUSDT
```

第三個問題是 React Strict Mode 在開發環境會用額外的 setup / cleanup 流程檢查 effect 是否能正確清理。正確 effect 應能安全地：

```txt
setup → cleanup → setup
```

如果沒有 cleanup，開發時更容易暴露重複訂閱；這正是在提醒 lifecycle 有 bug。

### 修正版：同一個 handler setup，也用同一個 handler cleanup

```tsx
export function QuickOrder({ symbol, onSubmit }: QuickOrderProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === "Enter") {
        onSubmit(symbol);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [symbol, onSubmit]);

  return <p>Current symbol: {symbol}</p>;
}
```

當 dependency 改變時，順序是：

```txt
symbol: BTC → ETH
→ React render ETH 畫面
→ cleanup 上一次 effect，移除 BTC handler
→ setup 新 effect，註冊 ETH handler
```

`removeEventListener` 必須收到當初註冊的同一個 function reference。下面看起來很像，但移除不了舊 listener：

```tsx
window.addEventListener("keydown", () => submit());
window.removeEventListener("keydown", () => submit());
```

兩個 arrow functions 是不同 reference。因此修正版把 `handleKeyDown` 保存於同一次 effect scope，cleanup 能取得同一個 function。

### Dependency 要怎麼判斷？

Effect 內讀到的 reactive values 原則上都要列出：

```tsx
onSubmit(symbol);
```

所以 dependency 包含：

```tsx
[symbol, onSubmit]
```

若 parent 每次 render 都建立新的 `onSubmit`，effect 會安全地 cleanup 再 setup；這首先是正確的。確認真的有不必要成本後，parent 才考慮用 `useCallback` 穩定 function，不能為了少跑 effect 就故意漏 dependency。

### 什麼情況才需要 effect？

這題需要 effect，因為要讓 React component 與 browser 的 `window` event system 保持同步。

如果只是按 React button 執行下單，直接使用 event handler：

```tsx
<button onClick={() => onSubmit(symbol)}>Submit</button>
```

不需要先把 click 轉成 state，再用 effect 觀察 state。Effect 主要用來同步 React 外部系統，例如 DOM API、timer、network connection、第三方 widget 或 subscription。

### 面試口述

> Effect 用來同步 React 與外部系統。註冊 window listener 時，我會回傳 cleanup，使用同一個 function reference 移除它，並把 effect 讀到的 symbol 與 callback 放進 dependencies。否則會留下 subscription leak，或因 closure 持續使用第一次 render 的舊 props。

## 六題完成後，檢查是否真的會了

先關掉答案，用自己的話回答：

1. `onClick={handleClick}` 和 `onClick={handleClick()}` 差在哪裡？
2. Child 想改 props 時，正確資料流怎麼走？
3. 為什麼不能直接 mutation state？`useState` setter 會自動 merge object 嗎？
4. 為什麼數字 input 的 draft 經常先保存 string？
5. 兩個 siblings 需要相同資料時，state 應放在哪裡？
6. Effect listener 的 setup、cleanup、dependencies 分別解決什麼？

### 自我評分

| 狀態 | 判準 | 下一步 |
| --- | --- | --- |
| 還不熟 | 看答案才知道錯在哪一行 | 隔天重新預測六題，不要先背修正版 |
| 基礎通過 | 能修正程式，也能解釋 props / state owner | 進入第一回的 state snapshot 與 effect 題 |
| 接近中階 | 能主動畫資料流，並說明為何不用另一種方案 | 加做測試：interaction、validation、cleanup |

## 下一步

- 下一關是 [React 現場實戰題第一回](./11-react-state-effect-live-demo.md)，會加入 snapshot、stale closure、API race 與 WebSocket。
- 某個名詞仍不熟時，先查 [React 術語中文對照與交易頁範例](./02-react-terms-code-examples.md)。
- 想用更多短題反覆練習：前往 [Vue 轉 React：30 次反射訓練](./02-react-reflex-drills.md)。
