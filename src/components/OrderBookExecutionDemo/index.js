import React, { useState } from "react";

import styles from "./styles.module.css";

const SOURCE_LINES = [
  ["state", "const [levels, setLevels] = useState<Level[]>([]);"],
  ["effect", "useEffect(() => {"],
  ["clear", "  setLevels([]);"],
  ["connect", "  const socket = new WebSocket(makeDepthUrl(symbol));"],
  ["message", "  socket.onmessage = (event) => {"],
  ["parse", "    const delta = parseDepthDelta(event.data);"],
  ["merge", "    setLevels((previous) => mergeLevels(previous, delta));"],
  ["message-end", "  };"],
  ["cleanup", "  return () => {"],
  ["detach", "    socket.onmessage = null;"],
  ["close", "    socket.close();"],
  ["cleanup-end", "  };"],
  ["deps", "}, [symbol]);"],
  ["return", "return levels;"],
];

const BTC_FIRST = [{ price: "65,000", quantity: "0.40" }];
const BTC_SECOND = [
  { price: "65,001", quantity: "0.25" },
  { price: "65,000", quantity: "0.65" },
];
const ETH_FIRST = [{ price: "3,500", quantity: "1.20" }];

const STEPS = [
  {
    phase: "初次 render",
    title: "React 呼叫元件，Hook 先回傳空陣列",
    description:
      "useState 初始化 levels。useEffect 此時只被登記，還沒有建立 WebSocket。",
    activeLines: ["state", "effect", "return"],
    symbol: "BTCUSDT",
    levels: [],
    socket: "尚未建立",
    socketTone: "idle",
    render: 1,
  },
  {
    phase: "commit 後：effect setup",
    title: "清空資料、建立 BTC socket、綁定 onmessage",
    description:
      "setLevels([]) 放入新的空陣列；因為陣列 reference 不同，React 會排程下一次 render。",
    activeLines: ["effect", "clear", "connect", "message", "deps"],
    symbol: "BTCUSDT",
    levels: [],
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 1,
  },
  {
    phase: "state 更新後 render",
    title: "React 再 render 一次，畫面仍是空 order book",
    description:
      "symbol 沒變，所以 effect 不會重建。這次只是把新的空陣列 commit 到畫面。",
    activeLines: ["state", "deps", "return"],
    symbol: "BTCUSDT",
    levels: [],
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 2,
  },
  {
    phase: "WebSocket message #1",
    title: "第一筆 delta 到達，functional updater 取得 previous = []",
    description:
      "parseDepthDelta 先解析資料，再以 previous 作為合併基礎。setLevels 只排程更新，handler 裡不會立刻得到新 levels。",
    activeLines: ["message", "parse", "merge"],
    symbol: "BTCUSDT",
    levels: [],
    pending: BTC_FIRST,
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 2,
  },
  {
    phase: "message #1 後 render",
    title: "React 使用合併結果 render，畫面出現第一個價位",
    description:
      "effect dependency 仍是 BTCUSDT，因此不會 cleanup，也不會建立第二條 socket。",
    activeLines: ["state", "deps", "return"],
    symbol: "BTCUSDT",
    levels: BTC_FIRST,
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 3,
  },
  {
    phase: "WebSocket message #2",
    title: "第二筆 delta 到達，previous 是最新的第一筆結果",
    description:
      "這就是 functional updater 的重點：不是讀 effect 建立當下的 levels，而是由 React 傳入最新 queued state。",
    activeLines: ["message", "parse", "merge"],
    symbol: "BTCUSDT",
    levels: BTC_FIRST,
    pending: BTC_SECOND,
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 3,
  },
  {
    phase: "message #2 後 render",
    title: "React commit 最新的 BTC order book",
    description:
      "mergeLevels 的結果成為新 state，使用 Hook 的元件跟著重新 render。",
    activeLines: ["state", "return"],
    symbol: "BTCUSDT",
    levels: BTC_SECOND,
    socket: "BTC socket：OPEN",
    socketTone: "open",
    render: 4,
  },
  {
    phase: "symbol 改成 ETHUSDT",
    title: "先用新 symbol render，但 levels 還是上一輪 BTC state",
    description:
      "effect 要等 commit 後才執行，所以這個 render 可能短暫帶著 BTC levels。dependency 改變代表稍後必須 cleanup 與 setup。",
    activeLines: ["state", "effect", "deps", "return"],
    symbol: "ETHUSDT",
    levels: BTC_SECOND,
    socket: "BTC socket：仍在，等待 cleanup",
    socketTone: "warning",
    render: 5,
    stale: true,
  },
  {
    phase: "commit 後：舊 effect cleanup",
    title: "React 先拆掉 BTC subscription",
    description:
      "先把 onmessage 設為 null，再關閉舊 socket，避免舊 symbol 的訊息繼續更新 state。",
    activeLines: ["cleanup", "detach", "close", "cleanup-end"],
    symbol: "ETHUSDT",
    levels: BTC_SECOND,
    socket: "BTC socket：CLOSED",
    socketTone: "closed",
    render: 5,
    stale: true,
  },
  {
    phase: "commit 後：新 effect setup",
    title: "清空 levels，建立 ETH socket",
    description:
      "cleanup 完成後才執行新 setup。setLevels([]) 又排程一次 render；ETH socket 已開始等待訊息。",
    activeLines: ["effect", "clear", "connect", "message", "deps"],
    symbol: "ETHUSDT",
    levels: BTC_SECOND,
    pending: [],
    socket: "ETH socket：OPEN",
    socketTone: "open",
    render: 5,
    stale: true,
  },
  {
    phase: "清空 state 後 render",
    title: "React render 空的 ETH order book",
    description:
      "現在舊 BTC 資料已從畫面移除；effect dependency 沒再改變，因此 ETH socket 保持原連線。",
    activeLines: ["state", "deps", "return"],
    symbol: "ETHUSDT",
    levels: [],
    socket: "ETH socket：OPEN",
    socketTone: "open",
    render: 6,
  },
  {
    phase: "ETH WebSocket message",
    title: "ETH delta 到達，previous = []",
    description:
      "訊息經過 parse 與 merge 後排入 state update，流程和 BTC message 相同。",
    activeLines: ["message", "parse", "merge"],
    symbol: "ETHUSDT",
    levels: [],
    pending: ETH_FIRST,
    socket: "ETH socket：OPEN",
    socketTone: "open",
    render: 6,
  },
  {
    phase: "ETH message 後 render",
    title: "畫面 commit ETH order book",
    description:
      "Hook 回傳新的 levels，使用它的元件顯示 ETH 價位。",
    activeLines: ["state", "return"],
    symbol: "ETHUSDT",
    levels: ETH_FIRST,
    socket: "ETH socket：OPEN",
    socketTone: "open",
    render: 7,
  },
  {
    phase: "元件 unmount",
    title: "React 執行最後一次 cleanup",
    description:
      "元件不再存在，ETH onmessage 被移除、socket 被關閉；之後不會再有 state update。",
    activeLines: ["cleanup", "detach", "close", "cleanup-end"],
    symbol: "—",
    levels: [],
    socket: "ETH socket：CLOSED",
    socketTone: "closed",
    render: 7,
    unmounted: true,
  },
];

function OrderBookTable({ levels, pending, stale }) {
  return (
    <div className={styles.book}>
      <div className={styles.bookHeading}>
        <span>price</span>
        <span>quantity</span>
      </div>
      {levels.length === 0 ? (
        <p className={styles.empty}>目前是空陣列 []</p>
      ) : (
        levels.map((level) => (
          <div className={styles.level} key={level.price}>
            <span>{level.price}</span>
            <span>{level.quantity}</span>
          </div>
        ))
      )}
      {stale ? <p className={styles.stale}>這一刻仍是 BTC 舊資料</p> : null}
      {pending ? (
        <div className={styles.pending}>
          <strong>等待 React 處理的更新</strong>
          <code>{JSON.stringify(pending)}</code>
        </div>
      ) : null}
    </div>
  );
}

export default function OrderBookExecutionDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];

  const goPrevious = () => setStepIndex((current) => Math.max(0, current - 1));
  const goNext = () =>
    setStepIndex((current) => Math.min(STEPS.length - 1, current + 1));

  return (
    <section className={styles.demo} aria-label="useOrderBook 完整執行流程">
      <div className={styles.toolbar}>
        <div>
          <span className={styles.eyebrow}>逐步執行器</span>
          <strong>
            第 {stepIndex + 1} / {STEPS.length} 步
          </strong>
        </div>
        <div className={styles.controls}>
          <button disabled={stepIndex === 0} onClick={goPrevious} type="button">
            上一步
          </button>
          <button
            className={styles.resetButton}
            disabled={stepIndex === 0}
            onClick={() => setStepIndex(0)}
            type="button"
          >
            重來
          </button>
          <button
            className={styles.nextButton}
            disabled={stepIndex === STEPS.length - 1}
            onClick={goNext}
            type="button"
          >
            下一步
          </button>
        </div>
      </div>

      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className={styles.currentStep} aria-live="polite">
        <span>{step.phase}</span>
        <h4>{step.title}</h4>
        <p>{step.description}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.runtimePanel}>
          <h4>目前 runtime 狀態</h4>
          <dl className={styles.facts}>
            <div>
              <dt>symbol</dt>
              <dd>{step.symbol}</dd>
            </div>
            <div>
              <dt>render 次數</dt>
              <dd>{step.unmounted ? "已卸載" : `#${step.render}`}</dd>
            </div>
            <div>
              <dt>socket</dt>
              <dd className={styles[step.socketTone]}>{step.socket}</dd>
            </div>
          </dl>
          <OrderBookTable
            levels={step.levels}
            pending={step.pending}
            stale={step.stale}
          />
        </div>

        <div className={styles.codePanel}>
          <h4>這一步執行到哪一行？</h4>
          <pre>
            <code>
              {SOURCE_LINES.map(([id, source], index) => (
                <span
                  className={
                    step.activeLines.includes(id) ? styles.activeLine : undefined
                  }
                  key={id}
                >
                  <span className={styles.lineNumber}>{index + 1}</span>
                  {source}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <ol className={styles.timeline}>
        {STEPS.map((item, index) => (
          <li
            className={
              index === stepIndex
                ? styles.currentTimelineItem
                : index < stepIndex
                  ? styles.completedTimelineItem
                  : undefined
            }
            key={`${item.phase}-${index}`}
          >
            <button onClick={() => setStepIndex(index)} type="button">
              <span>{index + 1}</span>
              {item.phase}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
