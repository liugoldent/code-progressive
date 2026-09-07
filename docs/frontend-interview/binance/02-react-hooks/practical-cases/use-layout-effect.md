---
sidebar_position: 7
slug: "/frontend-interview/binance/practical-cases/use-layout-effect"
title: "useLayoutEffect"
description: "用交易按鈕 Tooltip 定位案例理解 DOM commit 後、browser paint 前的同步量測。"
tags: [React, Hooks, useLayoutEffect, DOM, Interview]
---

# useLayoutEffect

## 實際情境：把風險提示定位在下單按鈕上方

Tooltip 的內容可能換行，因此第一次 render 前無法知道實際高度。它必須先加入 DOM、完成量測，再往上移動自身高度；如果用一般 `useEffect`，使用者可能先看到錯誤位置再跳動。

[在 OneCompiler 操作完整範例](https://onecompiler.com/react#draft-8xxa)

```tsx
import { useLayoutEffect, useRef, useState } from "react";

function RiskTooltip({ onMeasure }) {
  const tooltipRef = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const rect = tooltipRef.current.getBoundingClientRect();

    // 在 browser paint 前同步完成第二次 render
    setHeight(rect.height);
    onMeasure(rect.height);
  }, [onMeasure]);

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        left: "50%",
        top: -height - 12,
        transform: "translateX(-50%)",
        width: 220,
        padding: 16,
        color: "white",
        background: "#1f2937",
        borderRadius: 10,
      }}
    >
      市價單可能因滑價以不同價格成交
    </div>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(null);

  return (
    <main style={{ fontFamily: "sans-serif", padding: 80 }}>
      <h1>BTC 市價單</h1>

      <div style={{ position: "relative", display: "inline-block" }}>
        {show && <RiskTooltip onMeasure={setMeasuredHeight} />}

        <button onClick={() => setShow(value => !value)}>
          {show ? "隱藏風險提示" : "顯示風險提示"}
        </button>
      </div>

      <p>
        測量結果：
        {measuredHeight === null ? "尚未測量" : `${measuredHeight}px`}
      </p>
    </main>
  );
}
```

## 實際執行順序

```text
第一次 render：height = 0
  → React commit DOM，tooltipRef.current 有值
  → useLayoutEffect 量到實際高度
  → setHeight，立即進行第二次 render / commit
  → browser paint，使用者只看到正確位置
```

## 為什麼不是 `useEffect`？

`useEffect` 不提供「一定在 paint 前完成」的保證。若第一版錯位會被看見，就使用 `useLayoutEffect`；如果只是 API request、listener 或不影響首幀的位置同步，優先使用不阻塞 paint 的 `useEffect`。

## 面試回答

> `useLayoutEffect` 在 DOM commit、ref attach 之後同步執行，但 browser 尚未 paint。它適合必須在首幀前完成的 DOM measurement、position correction 或 scroll 調整。因為會阻塞 paint，我只把小而必要的同步工作放在裡面。

[回到 Effect / Memo 六題練習](/docs/frontend-interview/binance/react-effect-memo-hooks-drills#uselayouteffectdom-已-commitbrowser-尚未-paint)
