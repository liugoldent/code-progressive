---
slug: "/FE-knowledge/fe-websocket"
title: "WebSocket 入門：原理、Vue／React 實作與 Network 除錯"
description: "從 WebSocket 連線生命週期開始，實作 Vue composable 與 React hook，並學會用 Chrome DevTools Network 觀察握手、訊息、關閉與連線問題。"
tags:
  - Frontend
  - JavaScript
  - WebSocket
  - Vue
  - React
keywords: ["WebSocket 入門", "WebSocket 原理", "Vue WebSocket", "React WebSocket", "Chrome DevTools WebSocket", "Network WS", "WebSocket Messages", "WebSocket 除錯"]
---

# WebSocket 入門：原理、Vue／React 實作與 Network 除錯

如果只記一句話，可以先記住：

> WebSocket 是瀏覽器與伺服器建立的一條長連線；連線成功後，雙方都能主動傳送訊息，不必每次都重新發 HTTP request。

聊天室、即時報價、多人協作、遊戲狀態與通知中心，通常都需要伺服器在資料發生時立刻推送給前端，這正是 WebSocket 適合處理的場景。

## 先從 HTTP 的限制理解 WebSocket

一般 HTTP 的互動方向是：

```txt
瀏覽器發出 request → 伺服器回傳 response → 這次互動結束
```

如果前端想知道伺服器有沒有新資料，可以每隔幾秒詢問一次：

```txt
前端：有新訊息嗎？
後端：沒有。

前端：有新訊息嗎？
後端：沒有。

前端：有新訊息嗎？
後端：有，這是新訊息。
```

這種作法叫 polling（輪詢）。它容易實作，但即使沒有新資料，仍會產生 request、response 與延遲。

WebSocket 則是先建立連線，之後保持開啟：

```txt
瀏覽器 ←──────── 一條持續存在的連線 ────────→ 伺服器
         client 可以傳，server 也可以主動傳
```

這種「兩邊都能隨時傳送」叫做 full-duplex（全雙工）通訊。

## WebSocket、Polling、SSE 怎麼選？

| 方式 | 傳輸方向 | 適合情境 | 主要特性 |
| --- | --- | --- | --- |
| Polling | client 主動問 server | 更新頻率低、簡單後台狀態 | 最容易做，但會有多餘 request |
| SSE | server 持續推給 client | 通知、log、文字串流 | 單向推送，仍建立在 HTTP 上 |
| WebSocket | client 與 server 雙向 | 聊天、交易行情、多人協作 | 一條長連線，雙方都能主動送資料 |

不要因為 WebSocket 看起來比較即時，就把所有 API 都換成 WebSocket。登入、讀取文章、送出表單等一次性操作，通常仍適合 HTTP；真正需要低延遲、持續更新或雙向互動的部分，再交給 WebSocket。

## 一條 WebSocket 連線如何建立？

前端執行：

```js
const socket = new WebSocket("wss://example.com/ws");
```

接下來大致會經過四個階段：

```txt
1. Handshake：瀏覽器先向 server 要求建立 WebSocket
2. Open：server 接受，連線可以開始傳資料
3. Message：雙方在同一條連線上傳送多個 frame
4. Close：其中一方發起 closing handshake，連線結束
```

在常見的 HTTP/1.1 連線中，瀏覽器的握手 request 會包含：

```http
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: ...
Sec-WebSocket-Version: 13
Origin: https://example.com
```

伺服器接受時，通常會回：

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: ...
```

`101 Switching Protocols` 的意思不是「這個 request 一直沒有回應」，而是雙方同意從 HTTP 切換成 WebSocket。之後傳輸的是 WebSocket frame，不再是一般的 HTTP response。

網址常見兩種 scheme：

- `ws://`：未加密，類似 `http://`。
- `wss://`：經過 TLS 加密，類似 `https://`。

正式環境應使用 `wss://`。HTTPS 頁面連到不安全的 `ws://`，也通常會被瀏覽器當成 mixed content 阻擋。

## 瀏覽器原生 WebSocket API

WebSocket 最常用的四個事件是：

```js
const socket = new WebSocket("wss://example.com/ws");

socket.addEventListener("open", () => {
  console.log("連線成功");
  socket.send(JSON.stringify({ type: "chat.join", roomId: "room-1" }));
});

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log("收到訊息", message);
});

socket.addEventListener("error", () => {
  // 瀏覽器通常不會在 error event 暴露完整的連線失敗細節。
  // 還要搭配 close event、Console、Network 與 server log 判斷。
  console.error("WebSocket 發生錯誤");
});

socket.addEventListener("close", (event) => {
  console.log("連線關閉", {
    code: event.code,
    reason: event.reason,
    wasClean: event.wasClean,
  });
});
```

### readyState：現在能不能 send？

`socket.readyState` 有四種狀態：

| 常數 | 數字 | 意義 |
| --- | ---: | --- |
| `WebSocket.CONNECTING` | 0 | 正在建立連線 |
| `WebSocket.OPEN` | 1 | 已連線，可以傳送 |
| `WebSocket.CLOSING` | 2 | 正在關閉 |
| `WebSocket.CLOSED` | 3 | 已關閉或建立失敗 |

不要在連線尚未 `OPEN` 時直接 `send()`：

```js
function sendJson(socket, data) {
  if (socket.readyState !== WebSocket.OPEN) {
    return false;
  }

  socket.send(JSON.stringify(data));
  return true;
}
```

### WebSocket 不會替你規定訊息格式

WebSocket 只負責傳遞文字或二進位資料，不知道什麼是「加入房間」或「聊天訊息」。前後端要自己約定 application protocol，例如：

```json
{
  "type": "chat.send",
  "requestId": "request-123",
  "payload": {
    "roomId": "room-1",
    "text": "你好"
  }
}
```

建議至少包含：

- `type`：訊息種類，讓接收端知道如何處理。
- `requestId` 或 `eventId`：追蹤、去重與除錯。
- `payload`：實際資料。
- `timestamp`、`sequence`：需要排序或偵測漏資料時使用。

不要假設收到的每一筆資料都是合法 JSON：

```js
socket.addEventListener("message", (event) => {
  try {
    const message = JSON.parse(event.data);
    handleMessage(message);
  } catch (error) {
    console.error("無法解析 WebSocket message", error);
  }
});
```

## Vue 3 怎麼使用 WebSocket？

最簡單的方式是在元件 `onMounted` 時連線、`onUnmounted` 時關閉。不過當多個元件都需要使用時，建議把生命週期與狀態包成 composable。

### 建立 `useWebSocket` composable

```ts title="composables/useWebSocket.ts"
import { onMounted, onUnmounted, ref, shallowRef } from "vue";

type SocketStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closing"
  | "closed";

export function useWebSocket(url: string) {
  const socket = shallowRef<WebSocket | null>(null);
  const status = ref<SocketStatus>("idle");
  const lastMessage = shallowRef<unknown>(null);
  const error = ref<string | null>(null);

  function connect() {
    const current = socket.value;

    if (
      current?.readyState === WebSocket.CONNECTING ||
      current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    status.value = "connecting";
    error.value = null;

    const ws = new WebSocket(url);
    socket.value = ws;

    ws.addEventListener("open", () => {
      if (socket.value !== ws) return;
      status.value = "open";
    });

    ws.addEventListener("message", (event) => {
      if (socket.value !== ws) return;

      try {
        lastMessage.value = JSON.parse(event.data);
      } catch {
        lastMessage.value = event.data;
      }
    });

    ws.addEventListener("error", () => {
      if (socket.value !== ws) return;
      error.value = "WebSocket 連線發生錯誤";
    });

    ws.addEventListener("close", () => {
      if (socket.value !== ws) return;
      socket.value = null;
      status.value = "closed";
    });
  }

  function send(data: unknown) {
    const ws = socket.value;

    if (ws?.readyState !== WebSocket.OPEN) {
      return false;
    }

    ws.send(JSON.stringify(data));
    return true;
  }

  function disconnect() {
    const ws = socket.value;

    if (!ws || ws.readyState >= WebSocket.CLOSING) {
      return;
    }

    status.value = "closing";
    ws.close(1000, "component disconnected");
  }

  onMounted(connect);

  onUnmounted(() => {
    const ws = socket.value;
    socket.value = null;

    if (ws && ws.readyState < WebSocket.CLOSING) {
      ws.close(1000, "component unmounted");
    }
  });

  return {
    status,
    lastMessage,
    error,
    connect,
    send,
    disconnect,
  };
}
```

這裡用 `shallowRef` 保存 socket，因為 `WebSocket` 是瀏覽器提供的外部物件，不需要讓 Vue 深度代理它。真正需要驅動畫面的資料，例如 `status`、`lastMessage`，才放進 reactive state。

### 在 Vue 元件使用

```vue title="ChatRoom.vue"
<script setup lang="ts">
import { ref } from "vue";
import { useWebSocket } from "@/composables/useWebSocket";

const draft = ref("");

const { status, lastMessage, error, send } = useWebSocket(
  "ws://localhost:8080",
);

function sendMessage() {
  const text = draft.value.trim();
  if (!text) return;

  const sent = send({
    type: "chat.send",
    payload: { text },
  });

  if (sent) draft.value = "";
}
</script>

<template>
  <section>
    <p>連線狀態：{{ status }}</p>
    <p v-if="error">{{ error }}</p>

    <form @submit.prevent="sendMessage">
      <input v-model="draft" placeholder="輸入訊息" />
      <button :disabled="status !== 'open'">送出</button>
    </form>

    <pre>{{ lastMessage }}</pre>
  </section>
</template>
```

如果 `url`、room ID 或交易對是 reactive 值，值改變時要先關閉舊連線或 unsubscribe，再連線／subscribe 新的目標，避免舊訊息寫入目前畫面。

## React 怎麼使用 WebSocket？

React 使用 `useEffect` 同步 WebSocket 這種外部系統，並在 effect cleanup 關閉舊連線。WebSocket instance 可放在 `useRef`，因為 ref 改變不需要直接造成 render。

### 建立 `useWebSocket` hook

```tsx title="hooks/useWebSocket.ts"
import { useCallback, useEffect, useRef, useState } from "react";

type SocketStatus =
  | "connecting"
  | "open"
  | "closing"
  | "closed";

export function useWebSocket(url: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("connecting");
    setError(null);

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      if (socketRef.current !== socket) return;
      setStatus("open");
    });

    socket.addEventListener("message", (event) => {
      if (socketRef.current !== socket) return;

      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        setLastMessage(event.data);
      }
    });

    socket.addEventListener("error", () => {
      if (socketRef.current !== socket) return;
      setError("WebSocket 連線發生錯誤");
    });

    socket.addEventListener("close", () => {
      if (socketRef.current !== socket) return;
      socketRef.current = null;
      setStatus("closed");
    });

    return () => {
      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (socket.readyState < WebSocket.CLOSING) {
        socket.close(1000, "effect cleaned up");
      }
    };
  }, [url]);

  const send = useCallback((data: unknown) => {
    const socket = socketRef.current;

    if (socket?.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(data));
    return true;
  }, []);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;

    if (!socket || socket.readyState >= WebSocket.CLOSING) {
      return;
    }

    setStatus("closing");
    socket.close(1000, "user disconnected");
  }, []);

  return { status, lastMessage, error, send, disconnect };
}
```

每個 event handler 都先確認 `socketRef.current === socket`，是為了避免舊連線較晚抵達的事件覆蓋新連線狀態。

### 在 React component 使用

```tsx title="ChatRoom.tsx"
import { FormEvent, useState } from "react";
import { useWebSocket } from "./hooks/useWebSocket";

export function ChatRoom() {
  const [draft, setDraft] = useState("");
  const { status, lastMessage, error, send } = useWebSocket(
    "ws://localhost:8080",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const sent = send({
      type: "chat.send",
      payload: { text },
    });

    if (sent) setDraft("");
  }

  return (
    <section>
      <p>連線狀態：{status}</p>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="輸入訊息"
        />
        <button disabled={status !== "open"}>送出</button>
      </form>

      <pre>{JSON.stringify(lastMessage, null, 2)}</pre>
    </section>
  );
}
```

開發模式使用 React Strict Mode 時，可能在 Network 看到「連線 → cleanup 關閉 → 再連線」的流程。這是 React 在 development 額外執行一次 setup／cleanup 來檢查 effect 是否能正確清理；production 不會因 Strict Mode 做這次額外檢查。不要為了隱藏這個現象而移除 cleanup。

## 建立一個本機 WebSocket server 練習

前端不能自己完成 WebSocket 通訊，還是需要一個支援 WebSocket 的 server。可以用 Node.js 的 `ws` 套件快速做 echo server。

先安裝：

```bash
npm install ws
```

建立 `server.mjs`：

```js title="server.mjs"
import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 8080 });

server.on("connection", (socket) => {
  socket.send(
    JSON.stringify({
      type: "server.welcome",
      payload: { text: "WebSocket 已連線" },
    }),
  );

  socket.on("message", (rawData) => {
    const message = JSON.parse(rawData.toString());

    socket.send(
      JSON.stringify({
        type: "server.echo",
        payload: message,
      }),
    );
  });
});

console.log("WebSocket server: ws://localhost:8080");
```

啟動：

```bash
node server.mjs
```

接著把 Vue 或 React 範例的 URL 設成 `ws://localhost:8080`，就能在本機實際傳送與接收訊息。`ws` 是 Node.js server 套件；瀏覽器端直接使用原生的 `WebSocket`，不需要把 `ws` import 進 Vue 或 React。

## 如何在 Chrome Network 觀察 WebSocket？

### 1. 開啟 Network 並重新建立連線

1. 開啟 Chrome DevTools：macOS 使用 `Command + Option + I`，Windows／Linux 使用 `F12` 或 `Control + Shift + I`。
2. 切到 **Network**。
3. 點選上方的 **WS** filter。
4. 重新整理頁面，或執行會建立 WebSocket 的操作。
5. 點選列表中的 WebSocket URL。

DevTools 只會記錄開啟之後發生的網路活動。如果 WebSocket 早已建立而列表中看不到，請保持 DevTools 開啟並重新整理頁面。需要跨頁保留紀錄時，可勾選 **Preserve log**。

### 2. 在 Headers 看握手

點開連線後，在 **Headers** 檢查：

- **Request URL**：是否連到正確的 `ws://` 或 `wss://` 網址。
- **Status Code**：HTTP/1.1 握手成功時通常是 `101 Switching Protocols`。
- **Upgrade: websocket**：表示要求切換協定。
- **Origin**：server 可用它檢查允許的網站來源。
- **Sec-WebSocket-Protocol**：如果有使用 subprotocol，確認 server 選到的值是否正確。
- Cookie 或 query string：確認認證資料是否有送出，但分享截圖前要遮蔽 token。

如果握手只拿到 `400`、`401`、`403`、`404` 或 `500`，WebSocket 還沒有真正建立，應該先查 URL、登入狀態、Origin 驗證、反向代理與 server log。

### 3. 在 Messages 看雙向資料

切到 **Messages**，可以看到連線上送出與收到的 WebSocket message。Chrome 目前的顏色大致是：

- 淺綠色：前端送出的文字訊息。
- 白色：server 傳入的文字訊息。
- 淺黃色：binary、ping、pong、close 等 opcode。
- 淺紅色：錯誤。

重點欄位：

| 欄位 | 可以觀察什麼 |
| --- | --- |
| Data | JSON 內容、subscribe 參數、錯誤訊息 |
| Length | payload 大小，是否傳了過大的資料 |
| Time | 訊息時間、更新頻率、是否突然中斷 |

一個聊天功能的正常順序可能是：

```txt
→ {"type":"chat.join","roomId":"room-1"}
← {"type":"chat.joined","roomId":"room-1"}
→ {"type":"chat.send","payload":{"text":"你好"}}
← {"type":"chat.message","payload":{"text":"你好"}}
```

如果握手成功卻收不到資料，就在 Messages 確認：

1. 前端是否真的送出 subscribe／join message。
2. message 的 `type`、欄位名稱與資料型別是否符合後端協議。
3. server 是否有回 ack 或資料。
4. 資料停止前是否先出現 error 或 close frame。

Chrome 的 Messages 表格只顯示最近一部分訊息，因此高頻資料除錯時不要把它當成完整的永久 log。需要長時間追蹤時，應在應用程式與 server 增加有 `eventId`、時間與連線 ID 的結構化 log。

### 4. 用 Initiator 找出誰建立連線

Network 列表的 **Initiator** 可以協助找到是哪一段 JavaScript 建立 WebSocket。當畫面意外出現兩條相同連線時，可用它檢查：

- Vue composable 是否被多個元件各呼叫一次。
- React effect 是否因 dependency 改變而重新執行。
- 舊元件 unmount 時是否忘記 cleanup。
- 開發環境是否正在執行 React Strict Mode 的額外檢查。

### 5. 長時間 pending 是正常的

一般 HTTP request 長時間 pending 可能代表 API 卡住；WebSocket 本來就是長連線，所以在 Network 顯示 pending 並不一定有問題。真正要看的是：

- Messages 是否仍持續進來。
- UI 的連線狀態是否為 open。
- 是否出現 close code、長時間沒有 heartbeat 或資料過期。

## 常見的 Network 除錯情境

| 現象 | 常見原因 | 檢查方向 |
| --- | --- | --- |
| WS 列表完全沒有連線 | 程式沒執行、DevTools 太晚開、filter 錯誤 | 開啟 DevTools 後 reload，檢查 Console 與 Initiator |
| 握手回 401／403 | token、cookie、Origin 或權限問題 | Headers、登入狀態、server auth log |
| HTTPS 頁面連不上 `ws://` | mixed content | 改成有效憑證的 `wss://` |
| 成功 101，但立刻 close | 驗證、subprotocol、server exception | Messages、close code／reason、server log |
| 連線正常但沒訊息 | 忘了 subscribe，或訊息格式不符 | 比對 outgoing message 與後端協議 |
| 同一頁出現多條連線 | 重複 mount、effect 重跑、缺少共用連線層 | Initiator、Vue／React cleanup |
| 切換 room 後仍收到舊資料 | 沒 unsubscribe 或舊連線仍在寫 state | room ID、connection ID、cleanup |
| 訊息很多時畫面卡頓 | 每筆 message 都更新 UI | buffer 後批次更新、縮小訂閱範圍 |

常見 close code：

| Code | 意義 |
| ---: | --- |
| `1000` | 正常關閉 |
| `1006` | 異常斷線；這是接收端觀察到的保留值，不能拿來送 close frame |
| `1008` | 違反 server policy，例如權限或訊息不符合規則 |
| `1011` | server 發生未預期錯誤 |

## 從 Demo 到正式環境還缺什麼？

前面的 Vue／React 範例刻意保持簡單。正式環境通常還要補以下能力。

### 1. 自動重連

不要斷線後立刻無限重連，否則 server 故障時，大量 client 會一起製造 reconnect storm。通常使用 exponential backoff 加 jitter：

```txt
第 1 次失敗：約 1 秒後
第 2 次失敗：約 2 秒後
第 3 次失敗：約 4 秒後
第 4 次失敗：約 8 秒後
每次再加入少量隨機時間 jitter
```

只有非使用者主動關閉、且錯誤可恢復時才重連；登出、權限失敗或元件卸載不應盲目重連。

### 2. 重連後恢復資料

重新連線成功不代表資料自動接回來，通常還要：

```txt
reconnect
  → authenticate
  → resubscribe room / symbol
  → 重新抓 snapshot
  → 根據 sequence 接續增量資料
```

聊天室可以用最後一筆 message ID 補訊息；交易 order book 常用 REST snapshot 加 WebSocket delta，發現 sequence gap 時重新抓 snapshot。

### 3. Heartbeat

網路中斷時，瀏覽器不一定能立刻收到 close event。應依 server 協議設計 heartbeat 或資料逾時判斷。

瀏覽器原生 WebSocket API 不能讓 JavaScript 自己送 WebSocket protocol 的 ping frame；如果應用需要主動 heartbeat，常見做法是傳送 application-level 訊息，例如 `{ "type": "ping" }`，再等待 server 回 `{ "type": "pong" }`。

### 4. Backpressure 與高頻更新

原生 WebSocket API 不會自動替 UI 解決高頻資料壓力。傳送端可觀察 `socket.bufferedAmount`，接收端則可使用 buffer、`requestAnimationFrame` 或固定 interval 批次更新畫面，不要每收到一筆行情就立刻 `setState` 或修改大量 reactive data。

### 5. 認證與安全

- 正式環境使用 `wss://`。
- server 必須驗證 `Origin`，不要把「不是標準 CORS request」誤解成不需防跨站連線。
- 瀏覽器的 `new WebSocket()` 不能像 `fetch` 一樣任意加入 `Authorization` header；可依架構使用安全 cookie、短效一次性 ticket 或 server 支援的 subprotocol，避免在 URL 放長效 secret。
- server 仍要做身分驗證、訊息 schema 驗證、權限檢查、大小限制與 rate limit。
- 不要把 client 傳來的 `userId`、角色或價格直接視為可信資料。

### 6. Socket.IO 不完全等於 WebSocket

Socket.IO 是建立在 Engine.IO 之上的即時通訊函式庫，提供 event、room、ack、fallback 與重連等功能，但它不是「原生 WebSocket server 的直接替代協議」。Socket.IO client 通常要搭配 Socket.IO server；不能期待 `new WebSocket()` 直接理解 Socket.IO 的封包。

在 Network 中，Socket.IO 可能先出現 polling request，再升級為 WS；Messages 看到的資料也會包含 Socket.IO 自己的封包格式。

## 最後整理

學 WebSocket 時，可以依這條主線理解：

```txt
new WebSocket(url)
  → handshake
  → open
  → send / message
  → error / close
  → 必要時 backoff reconnect
  → resubscribe + snapshot recovery
```

Vue 與 React 並沒有另一套 WebSocket 協議，底層都使用瀏覽器原生 API。框架主要幫你處理的是：

- 把連線狀態轉成畫面能使用的 reactive state。
- 元件卸載、URL 或訂閱目標改變時清理舊連線。
- 避免舊連線事件覆蓋新畫面。
- 將連線邏輯抽成 composable 或 hook 重複使用。

而 Chrome DevTools 的核心觀察順序是：

```txt
Network → WS → 選擇連線
  → Headers 看握手
  → Messages 看雙向資料
  → Initiator 找建立來源
  → close code + server log 判斷斷線原因
```

## 延伸閱讀

- [MDN：Writing WebSocket client applications](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications)
- [Chrome DevTools：Analyze the messages of a WebSocket connection](https://developer.chrome.com/docs/devtools/network/reference/#websocket)
- [Vue：Composables 與 side effect cleanup](https://vuejs.org/guide/reusability/composables.html#side-effects)
- [React：useEffect 與外部系統的 setup／cleanup](https://react.dev/reference/react/useEffect)
