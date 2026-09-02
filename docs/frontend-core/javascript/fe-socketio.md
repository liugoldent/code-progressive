---
slug: "/FE-knowledge/fe-socketio"
title: "Socket.IO 入門：原理、Vue／React 實作與 Network 除錯"
description: "從 Engine.IO、transport upgrade 與事件模型開始，實作 Vue composable、React hook 與 Node.js server，並比較 Socket.IO 和原生 WebSocket 的差異。"
tags:
  - Frontend
  - JavaScript
  - Socket.IO
  - WebSocket
  - Vue
  - React
keywords: ["Socket.IO 入門", "Socket.IO 原理", "Vue Socket.IO", "React Socket.IO", "Socket.IO WebSocket 差異", "Engine.IO", "Socket.IO Network 除錯", "Socket.IO rooms"]
---

# Socket.IO 入門：原理、Vue／React 實作與 Network 除錯

如果只記一句話，可以先記住：

> Socket.IO 是一套 client／server 即時通訊函式庫；它使用自己的協議，在底層透過 Engine.IO 管理 WebSocket、HTTP long-polling 或 WebTransport，並提供事件、ack、room、自動重連等高階能力。

Socket.IO 很常用來製作聊天室、通知中心、多人協作和即時狀態，但它**不是瀏覽器原生 WebSocket API 的別名**。建議先讀 [WebSocket 入門](./fe-websocket.md)，再用這篇理解 Socket.IO 多做了哪些工作。

## 為什麼有 WebSocket 之後，還需要 Socket.IO？

最重要的差別不是「誰比較新」，而是兩者處理的問題層級不同：

> WebSocket 解決「瀏覽器與伺服器如何維持一條全雙工連線」；Socket.IO 解決「產品如何可靠、方便地使用即時連線」。

更精確地說，Socket.IO **不是 WebSocket 的替代標準，也不等於 WebSocket**。它是一套 client／server 函式庫與專用協議，透過 Engine.IO 選擇 WebSocket、HTTP long-polling 或 WebTransport 作為底層 transport。因此，「Socket.IO 永遠建構在 WebSocket 上」也不完全正確：當環境不能使用 WebSocket 時，它仍可能使用其他 transport。

原生 WebSocket 建立連線後，主要只負責傳送文字或二進位 frame：

```js
const socket = new WebSocket("wss://example.com/ws");

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  if (message.type === "chat.message") {
    // 自己分派事件
  }
});
```

Socket.IO 的價值，就是把這些產品幾乎都會重做一次的通訊模式，整理成一致的 API 與協議。

### 1. Transport fallback：WebSocket 用不了時還有替代通道

原生 `WebSocket` 只有 WebSocket transport。如果企業 proxy、防火牆或反向代理設定阻擋 WebSocket handshake／upgrade，連線就會失敗，替代方案必須由應用自行實作。

Socket.IO 底層的 Engine.IO 可以使用 HTTP long-polling。預設流程通常先以 polling 建立連線，再嘗試升級為 WebSocket；升級失敗時，可以繼續使用 polling：

```txt
HTTP long-polling 建立連線
  → 探測 WebSocket
  → 成功：upgrade 到 WebSocket
  → 失敗：維持 long-polling
```

但這不代表連線「絕對不會斷」。server 掛掉、斷網、認證失敗或所有 transports 都不可用時仍會斷線；已升級的 WebSocket 壞掉後，也通常是透過重新連線、重新協商 transport，而不是保證原連線無縫降級。

### 2. 自動重連：把常見 retry 策略做成內建能力

原生 WebSocket 關閉後不會自動建立下一條連線。開發者通常要自行處理：

- 哪些斷線原因可以重試；
- exponential backoff 與隨機 jitter；
- 最大嘗試次數；
- 使用者登出或主動關閉時停止重連；
- 重連成功後重新認證、訂閱與同步資料。

Socket.IO client 內建自動重連與 backoff，能減少大量樣板程式。不過要分清楚：

```txt
reconnect 只代表「重新連上」
不代表「斷線期間的事件一定補回來」
```

聊天訊息、行情或協作狀態仍可能需要 message ID、sequence、snapshot、持久化或 connection state recovery，才能補回遺失資料。

### 3. Room 與 broadcast：不用每個專案重寫連線分組

WebSocket 只提供 client 與 server 的連線。群聊、訂閱某個商品行情或「通知除了自己以外的人」，都要由 server 自己維護連線集合與訂閱關係：

```txt
room-1 → socket A、socket B、socket C
BTC    → socket A、socket D
```

Socket.IO server 直接提供 room、broadcast 與 namespace：

```js
socket.join("room-1");
io.to("room-1").emit("chat.message", message);
socket.broadcast.emit("user.online", user);
```

Room 只是 server-side 分組工具，不是權限系統。client 要求加入房間時，server 仍必須驗證使用者是否有權限。

### 4. 具名事件與 ack：把裸 frame 變成應用層訊息

原生 WebSocket 收到的是文字或二進位資料。若要區分聊天、加入房間與已讀事件，團隊通常會自行定義 envelope，並在入口處解析和分派：

```json
{
  "type": "chat.send",
  "requestId": "request-123",
  "payload": { "roomId": "room-1", "text": "你好" }
}
```

Socket.IO 將它包成 EventEmitter 風格的具名事件，並處理常見資料的序列化：

```js
const socket = io("https://example.com");

socket.emit("chat.send", { roomId: "room-1", text: "你好" });

socket.on("chat.message", (message) => {
  console.log(message);
});
```

它也內建 acknowledgement 與 timeout：

```js
socket.timeout(5000).emit("chat.send", payload, (error, response) => {
  if (error) {
    console.error("server 未在時間內回覆");
    return;
  }

  console.log("server response", response);
});
```

ack 只代表接收端依約回覆，不自動等於資料已寫入資料庫，也不代表 exactly-once delivery。

### 5. Heartbeat：較快發現半開連線

手機進電梯、路由器中斷或裝置突然離線時，TCP／WebSocket 不一定立刻觸發 `close`，server 可能暫時保留一條實際上已失效的 half-open connection。

WebSocket 協議本身有 ping／pong control frame，但瀏覽器的原生 `WebSocket` JavaScript API 不提供主動送 protocol ping 的方法；若需要應用層心跳，前後端通常要另外約定訊息與 timeout。

Engine.IO 內建 heartbeat，會依 `pingInterval` 與 `pingTimeout` 判斷 client 是否仍存活，逾時後關閉連線，再交由重連機制處理。

### 這五點真正省下的是工程成本

```txt
WebSocket
  = 解決雙向傳輸

Socket.IO
  = transport 管理
  + reconnect
  + heartbeat
  + event / ack
  + room / broadcast / namespace
```

這些便利來自 Socket.IO 自己的 client、server 與協議，不是 WebSocket 標準突然多出的功能。代價是多一層封包與依賴，而且兩端通常都必須使用相容的 Socket.IO 實作。

## Socket.IO 和 WebSocket 快速怎麼選？

| 問題 | 原生 WebSocket | Socket.IO |
| --- | --- | --- |
| 是否為標準協議 | 是，RFC 6455 | 否，是建立在 Engine.IO 上的應用層協議 |
| 瀏覽器是否內建 client | 是，`new WebSocket()` | 否，需要 `socket.io-client` |
| server 是否可用任意 WebSocket 實作 | 可以 | 通常必須使用相容 Socket.IO server |
| event、ack、room | 自己定義 | 內建 API |
| 自動重連 | 自己實作 | client 內建 |
| transport fallback | 沒有 | 可使用 HTTP long-polling 等 transport |
| 額外協議與封包成本 | 較少 | 較多 |

選擇方向：

- 已有公開 WebSocket protocol、交易行情或跨語言標準介面：偏向原生 WebSocket。
- 想快速完成聊天室、room、broadcast、ack 與重連：偏向 Socket.IO。
- client／server 都由同一團隊控制，且接受綁定 Socket.IO 生態：Socket.IO 很方便。
- 只需 server 單向推播：也應比較 SSE，不必預設二選一。

後面會再做更完整的工程差異比較。

## Socket.IO 的兩層架構

Socket.IO 可以拆成兩層理解：

```txt
Application
  │ chat.send、order.updated、notification.read
  ▼
Socket.IO
  │ event、ack、room、namespace、broadcast、reconnection
  ▼
Engine.IO
  │ handshake、heartbeat、transport、upgrade、斷線偵測
  ▼
HTTP long-polling / WebSocket / WebTransport
```

### Engine.IO 負責低階連線

依目前 Socket.IO 4.x 官方文件，Engine.IO 內建的 transports 包含：

- HTTP long-polling；
- WebSocket；
- WebTransport。

這裡的 **transport** 可以理解成「實際負責把 Engine.IO 封包送過網路的通道」。上層仍然使用相同的 `socket.emit()`、`socket.on()`；差別在底層如何維持連線與收發資料。

#### HTTP long-polling：用一連串 HTTP request 模擬即時雙向通訊

一般 HTTP request 是 client 發出請求、server 回應後就結束。long-polling 則會讓接收資料用的 `GET` request 先保持等待：server 有新資料時才回應；client 收到回應後，立刻再發出下一個 `GET` 繼續等。client 要送資料給 server 時，則另外使用短時間的 `POST` request。

```txt
接收：GET  ──等待──> server 有資料後回應 ──> 再發下一個 GET
送出：POST ───────> server 收到資料後立即回應
```

它不是真的維持一條 WebSocket 連線，而是靠持續銜接的 HTTP requests 達到接近即時的效果。優點是相容性最好，通常也最容易通過既有 proxy、防火牆與企業網路；缺點是每輪請求都會重複攜帶 HTTP headers，request 數量與額外成本最高，因此通常作為初始連線或 fallback。

#### WebSocket：建立一條可持續雙向收發的連線

WebSocket 先透過 HTTP handshake 建立連線，成功後 client 與 server 就能在同一條持續存在的連線上主動傳送資料，不必為每次收發重新建立 HTTP request。

```txt
client <════════ 一條持續存在的雙向連線 ════════> server
```

它的額外封包成本比 long-polling 低，很適合聊天室、通知、即時協作等頻繁交換小訊息的場景，也是 Socket.IO 一般連線成功後主要使用的 transport。但某些 proxy、防火牆或錯誤的反向代理設定可能擋住 WebSocket upgrade，所以 Engine.IO 仍保留 long-polling 作為較可靠的起點與替代方案。

#### WebTransport：以 HTTP/3／QUIC 為基礎的新式傳輸

WebTransport 建立在 HTTP/3 與 QUIC 之上，原生能力包含多條單向／雙向 stream，以及不保證送達與順序的 datagram；在容易丟包的網路中，不同 stream 不必因其中一條等待重傳而全部卡住。

不過，**Engine.IO 的 WebTransport transport 使用的是一條可靠、有順序的 bidirectional stream** 來收發 Socket.IO 資料，並不是把 `socket.emit()` 自動改成不可靠的 datagram。它的潛在效率最好，但瀏覽器、server、proxy 與部署環境必須支援 HTTP/3／WebTransport，因此支援成熟度仍不如前兩者。

| Transport | 如何收發 | 優點 | 主要代價 |
| --- | --- | --- | --- |
| HTTP long-polling | 重複使用等待中的 `GET` 接收、`POST` 送出 | 相容性最好、容易作為 fallback | request 與 headers 成本最高 |
| WebSocket | 一條持續存在的雙向連線 | 支援廣、效能佳、額外成本低 | 可能被部分 proxy 或防火牆阻擋 |
| WebTransport | HTTP/3／QUIC 上的雙向 stream | 丟包環境下效率佳、具新式傳輸能力 | client 與部署環境支援度仍在發展 |

預設情況下，client 通常先使用 HTTP long-polling 建立可用連線，再嘗試升級到更合適的 transport。這是為了降低 WebSocket 被 proxy、防火牆或網路環境阻擋時的等待與失敗成本。

握手時 server 會提供類似資訊：

```json
{
  "sid": "engine-session-id",
  "upgrades": ["websocket"],
  "pingInterval": 25000,
  "pingTimeout": 20000,
  "maxPayload": 1000000
}
```

- `sid`：Engine.IO session ID；
- `upgrades`：可嘗試升級的 transports；
- `pingInterval`、`pingTimeout`：heartbeat 與斷線判斷；
- `maxPayload`：可接受的 packet 大小上限。

### Socket.IO 負責高階事件

Socket.IO 在 Engine.IO 之上提供：

- 具名事件與可序列化參數；
- acknowledgement；
- room 與 broadcast；
- namespace multiplexing；
- 自動重連與送出 buffer；
- 可選用的 connection state recovery。

Engine.IO 的 session ID 與 Socket.IO 的 `socket.id` 不是同一件事，不應拿短暫的 `socket.id` 當作使用者 ID。

## 一條 Socket.IO 連線如何建立？

前端安裝並建立 client：

```bash
npm install socket.io-client
```

```js
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  auth: {
    token: "short-lived-access-token",
  },
});
```

預設流程大致如下：

```txt
1. Engine.IO handshake
2. 先建立 polling transport
3. Socket.IO 連入 namespace
4. 嘗試升級為 WebSocket
5. 雙方 emit / on 傳送事件
6. Engine.IO heartbeat 檢查連線
7. 暫時斷線時自動重連
8. 手動 disconnect 或不可恢復錯誤時結束
```

Network 可能先看到：

```http
GET /socket.io/?EIO=4&transport=polling&t=...
```

再看到 WebSocket upgrade：

```http
GET /socket.io/?EIO=4&transport=websocket&sid=...
HTTP/1.1 101 Switching Protocols
```

所以看到 polling request 不代表「Socket.IO 沒有使用 WebSocket」。要繼續檢查是否出現 `transport=websocket`，以及 upgrade 是否成功。

## Socket.IO client API

### `connect`、`connect_error` 與 `disconnect`

```js
import { io } from "socket.io-client";

const socket = io("https://example.com", {
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket.IO connected", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO connection failed", {
    message: error.message,
    description: error.description,
    context: error.context,
  });
});

socket.on("disconnect", (reason, details) => {
  console.log("Socket.IO disconnected", { reason, details });
});

socket.connect();
```

`socket.connected` 可判斷 Socket.IO socket 是否已連線；`socket.active` 則表示 client 是否會在目前狀況下自動重連。

```js
socket.on("connect_error", (error) => {
  if (socket.active) {
    console.log("暫時性失敗，client 將自動重連");
  } else {
    console.log("server 拒絕連線，需要修正認證後手動 connect", error.message);
  }
});
```

手動呼叫 `socket.disconnect()` 後不會自動重連；要再次連線需呼叫 `socket.connect()`。

### `emit` 與 `on`

```js
socket.emit("chat.send", {
  roomId: "room-1",
  text: "你好",
});

function handleMessage(message) {
  console.log("new chat message", message);
}

socket.on("chat.message", handleMessage);

// 不再需要時移除同一個 handler。
socket.off("chat.message", handleMessage);
```

不要在每次 `connect` 時重複註冊一般資料事件：

```js
// 錯誤：每次 reconnect 都增加一個 chat.message listener。
socket.on("connect", () => {
  socket.on("chat.message", handleMessage);
});
```

應把長期 listener 註冊在 `connect` handler 外。`connect` 只處理每次連線成功後確實需要重做的工作。

### Acknowledgement 與 timeout

Socket.IO event 可以帶 ack callback：

```js
socket.timeout(5000).emit(
  "chat.send",
  { roomId: "room-1", text: "你好" },
  (error, response) => {
    if (error) {
      console.error("server 沒有在 5 秒內 ack");
      return;
    }

    console.log("message accepted", response.messageId);
  },
);
```

也可以使用 Promise 版本：

```js
try {
  const response = await socket
    .timeout(5000)
    .emitWithAck("chat.send", {
      roomId: "room-1",
      text: "你好",
    });

  console.log(response);
} catch {
  console.error("ack timeout");
}
```

ack 只能證明接收端有依協議回覆，不自動代表資料已永久保存。若業務要求「訊息一定寫入資料庫」，server 應在 transaction 成功後才 ack，client 還要處理 retry 與重複事件。

### Room 與 broadcast

Room 是 server-side 概念，用來把 sockets 分組：

```js
io.on("connection", (socket) => {
  socket.on("chat.join", async (roomId, ack) => {
    await socket.join(roomId);
    ack({ ok: true });
  });
});
```

對 room 中所有 client 廣播：

```js
io.to("room-1").emit("chat.message", message);
```

由某個 socket 發送，但排除自己：

```js
socket.to("room-1").emit("user.typing", {
  userId: socket.data.userId,
});
```

client 不應自行宣稱「我有權加入這個 room」。server 收到 join request 時仍要驗證使用者是否有該房間權限。

### Namespace 與 path 不要混淆

```js
const adminSocket = io("https://example.com/admin");
```

這裡的 `/admin` 通常是 Socket.IO namespace。底層 HTTP／WebSocket endpoint 預設仍是 `/socket.io/`。

如果調整 endpoint path，要讓兩端一致：

```js
// client
const socket = io("https://example.com", {
  path: "/realtime/",
});

// server
const io = new Server(httpServer, {
  path: "/realtime/",
});
```

把 namespace、URL pathname 與 Engine.IO `path` 混在一起，是常見的 404 與連線失敗原因。

## Vue 3 怎麼使用 Socket.IO？

Socket.IO client 是外部連線物件。和 WebSocket 一樣，可把 instance 放在 `shallowRef`，把狀態與訊息放入 reactive state，並在元件卸載時清理 listeners 與連線。

### 建立 `useSocketIO` composable

```ts title="composables/useSocketIO.ts"
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { io, type Socket } from "socket.io-client";

interface ChatMessage {
  id: string;
  roomId: string;
  text: string;
}

interface AckResponse {
  ok: boolean;
  messageId?: string;
  error?: string;
}

interface ServerToClientEvents {
  "chat.message": (message: ChatMessage) => void;
}

interface ClientToServerEvents {
  "chat.join": (
    roomId: string,
    ack: (response: AckResponse) => void,
  ) => void;
  "chat.send": (
    payload: { roomId: string; text: string },
    ack: (response: AckResponse) => void,
  ) => void;
}

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type SocketStatus = "idle" | "connecting" | "connected" | "disconnected";

export function useSocketIO(url: string, token: string) {
  const socket = shallowRef<ChatSocket | null>(null);
  const status = ref<SocketStatus>("idle");
  const messages = ref<ChatMessage[]>([]);
  const error = ref<string | null>(null);

  function connect() {
    if (socket.value) return;

    status.value = "connecting";
    error.value = null;

    const current = io<ServerToClientEvents, ClientToServerEvents>(url, {
      autoConnect: false,
      auth: { token },
    });

    socket.value = current;

    const handleConnect = () => {
      if (socket.value !== current) return;
      status.value = "connected";
    };

    const handleConnectError = (cause: Error) => {
      if (socket.value !== current) return;
      error.value = cause.message;
      status.value = "disconnected";
    };

    const handleDisconnect = () => {
      if (socket.value !== current) return;
      status.value = "disconnected";
    };

    const handleMessage = (message: ChatMessage) => {
      if (socket.value !== current) return;
      messages.value.push(message);
    };

    current.on("connect", handleConnect);
    current.on("connect_error", handleConnectError);
    current.on("disconnect", handleDisconnect);
    current.on("chat.message", handleMessage);
    current.connect();
  }

  function joinRoom(roomId: string) {
    return new Promise<AckResponse>((resolve) => {
      const current = socket.value;

      if (!current?.connected) {
        resolve({ ok: false, error: "尚未連線" });
        return;
      }

      current.timeout(5000).emit("chat.join", roomId, (timeoutError, response) => {
        if (timeoutError) {
          resolve({ ok: false, error: "加入房間逾時" });
          return;
        }

        resolve(response);
      });
    });
  }

  function sendMessage(roomId: string, text: string) {
    return new Promise<AckResponse>((resolve) => {
      const current = socket.value;

      if (!current?.connected) {
        resolve({ ok: false, error: "尚未連線" });
        return;
      }

      current.timeout(5000).emit(
        "chat.send",
        { roomId, text },
        (timeoutError, response) => {
          if (timeoutError) {
            resolve({ ok: false, error: "傳送逾時" });
            return;
          }

          resolve(response);
        },
      );
    });
  }

  function disconnect() {
    const current = socket.value;
    if (!current) return;

    current.removeAllListeners();
    current.disconnect();
    socket.value = null;
    status.value = "disconnected";
  }

  onMounted(connect);
  onUnmounted(disconnect);

  return {
    status,
    messages,
    error,
    joinRoom,
    sendMessage,
    connect,
    disconnect,
  };
}
```

此範例讓 composable 完整擁有 socket，所以 cleanup 使用 `removeAllListeners()`。如果 socket 是全站共用 singleton，不應由單一元件移除其他功能註冊的 listeners；那時應保存每個 handler，使用 `off(event, handler)` 精準清理。

### 在 Vue 元件使用

```vue title="ChatRoom.vue"
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useSocketIO } from "@/composables/useSocketIO";

const roomId = "room-1";
const draft = ref("");
const submitError = ref<string | null>(null);

const { status, messages, error, joinRoom, sendMessage } = useSocketIO(
  "http://localhost:8080",
  "demo-token",
);

onMounted(async () => {
  // 正式實作可在 connect event 或 watch(status) 後 join。
  // 這裡只示意呼叫方式，joinRoom 會檢查是否已連線。
});

async function submit() {
  const text = draft.value.trim();
  if (!text) return;

  const response = await sendMessage(roomId, text);

  if (!response.ok) {
    submitError.value = response.error ?? "傳送失敗";
    return;
  }

  draft.value = "";
  submitError.value = null;
}
</script>

<template>
  <section>
    <p>連線狀態：{{ status }}</p>
    <p v-if="error">{{ error }}</p>
    <p v-if="submitError">{{ submitError }}</p>

    <button
      :disabled="status !== 'connected'"
      @click="joinRoom(roomId)"
    >
      加入房間
    </button>

    <form @submit.prevent="submit">
      <input v-model="draft" placeholder="輸入訊息" />
      <button :disabled="status !== 'connected'">送出</button>
    </form>

    <ul>
      <li v-for="message in messages" :key="message.id">
        {{ message.text }}
      </li>
    </ul>
  </section>
</template>
```

實際產品要在每次 `connect`／reconnect 後確認 room 狀態。若 server 啟用了 connection state recovery 且 `socket.recovered === true`，room 可能已恢復；否則要重新 join 或抓 snapshot。

## React 怎麼使用 Socket.IO？

React 使用 `useEffect` 管理連線的 setup／cleanup，socket instance 放進 `useRef`。事件 handler 必須在 cleanup 使用同一個 function reference 移除。

### 建立 `useSocketIO` hook

```tsx title="hooks/useSocketIO.ts"
import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface ChatMessage {
  id: string;
  roomId: string;
  text: string;
}

interface AckResponse {
  ok: boolean;
  messageId?: string;
  error?: string;
}

interface ServerToClientEvents {
  "chat.message": (message: ChatMessage) => void;
}

interface ClientToServerEvents {
  "chat.join": (
    roomId: string,
    ack: (response: AckResponse) => void,
  ) => void;
  "chat.send": (
    payload: { roomId: string; text: string },
    ack: (response: AckResponse) => void,
  ) => void;
}

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type SocketStatus = "connecting" | "connected" | "disconnected";

export function useSocketIO(url: string, token: string) {
  const socketRef = useRef<ChatSocket | null>(null);
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io<ServerToClientEvents, ClientToServerEvents>(url, {
      auth: { token },
    });

    socketRef.current = socket;

    function handleConnect() {
      if (socketRef.current !== socket) return;
      setStatus("connected");
      setError(null);
    }

    function handleConnectError(cause: Error) {
      if (socketRef.current !== socket) return;
      setStatus("disconnected");
      setError(cause.message);
    }

    function handleDisconnect() {
      if (socketRef.current !== socket) return;
      setStatus("disconnected");
    }

    function handleMessage(message: ChatMessage) {
      if (socketRef.current !== socket) return;
      setMessages((current) => [...current, message]);
    }

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat.message", handleMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat.message", handleMessage);
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [url, token]);

  const joinRoom = useCallback((roomId: string) => {
    return new Promise<AckResponse>((resolve) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        resolve({ ok: false, error: "尚未連線" });
        return;
      }

      socket.timeout(5000).emit("chat.join", roomId, (timeoutError, response) => {
        resolve(
          timeoutError
            ? { ok: false, error: "加入房間逾時" }
            : response,
        );
      });
    });
  }, []);

  const sendMessage = useCallback((roomId: string, text: string) => {
    return new Promise<AckResponse>((resolve) => {
      const socket = socketRef.current;

      if (!socket?.connected) {
        resolve({ ok: false, error: "尚未連線" });
        return;
      }

      socket.timeout(5000).emit(
        "chat.send",
        { roomId, text },
        (timeoutError, response) => {
          resolve(
            timeoutError
              ? { ok: false, error: "傳送逾時" }
              : response,
          );
        },
      );
    });
  }, []);

  return { status, messages, error, joinRoom, sendMessage };
}
```

### 在 React component 使用

```tsx title="ChatRoom.tsx"
import { FormEvent, useState } from "react";
import { useSocketIO } from "./hooks/useSocketIO";

export function ChatRoom() {
  const roomId = "room-1";
  const [draft, setDraft] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { status, messages, error, joinRoom, sendMessage } = useSocketIO(
    "http://localhost:8080",
    "demo-token",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const response = await sendMessage(roomId, text);

    if (!response.ok) {
      setSubmitError(response.error ?? "傳送失敗");
      return;
    }

    setDraft("");
    setSubmitError(null);
  }

  return (
    <section>
      <p>連線狀態：{status}</p>
      {error && <p>{error}</p>}
      {submitError && <p>{submitError}</p>}

      <button
        disabled={status !== "connected"}
        onClick={() => joinRoom(roomId)}
      >
        加入房間
      </button>

      <form onSubmit={handleSubmit}>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="輸入訊息"
        />
        <button disabled={status !== "connected"}>送出</button>
      </form>

      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
    </section>
  );
}
```

React Strict Mode 在 development 會額外執行一次 effect setup／cleanup，因此 Network 可能看見先連線、清理、再連線。只要 cleanup 完整，這是開發期檢查，不是 production 會固定建立兩條連線。

## 建立一個本機 Socket.IO server 練習

安裝 server：

```bash
npm install socket.io
```

建立 `server.mjs`：

```js title="server.mjs"
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (token !== "demo-token") {
    next(new Error("not authorized"));
    return;
  }

  socket.data.userId = "demo-user";
  next();
});

io.on("connection", (socket) => {
  console.log("connected", {
    socketId: socket.id,
    recovered: socket.recovered,
  });

  socket.on("chat.join", async (roomId, ack) => {
    if (typeof roomId !== "string" || !/^room-[a-z0-9-]+$/i.test(roomId)) {
      ack({ ok: false, error: "invalid room" });
      return;
    }

    // 正式服務還要查詢 socket.data.userId 是否有房間權限。
    await socket.join(roomId);
    ack({ ok: true });
  });

  socket.on("chat.send", (payload, ack) => {
    const roomId = payload?.roomId;
    const text = payload?.text?.trim();

    if (
      typeof roomId !== "string" ||
      typeof text !== "string" ||
      text.length === 0 ||
      text.length > 1000 ||
      !socket.rooms.has(roomId)
    ) {
      ack({ ok: false, error: "invalid message" });
      return;
    }

    const message = {
      id: randomUUID(),
      roomId,
      text,
      userId: socket.data.userId,
      createdAt: new Date().toISOString(),
    };

    io.to(roomId).emit("chat.message", message);
    ack({ ok: true, messageId: message.id });
  });
});

httpServer.listen(8080, () => {
  console.log("Socket.IO server: http://localhost:8080");
});
```

啟動：

```bash
node server.mjs
```

Socket.IO server 不是原生 WebSocket server。以下 client 不能直接連上它：

```js
// 錯誤方向：原生 WebSocket 不理解 Socket.IO protocol。
new WebSocket("ws://localhost:8080");
```

要使用 `socket.io-client`：

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  auth: { token: "demo-token" },
});
```

## 如何在 Chrome Network 觀察 Socket.IO？

### 1. 同時觀察 Fetch/XHR 與 WS

1. 開啟 Chrome DevTools。
2. 切到 **Network** 並保持錄製。
3. 重新整理頁面或重新呼叫 `socket.connect()`。
4. 先在 **Fetch/XHR** 找 `transport=polling`。
5. 再切到 **WS** 找 `transport=websocket`。

因為 Socket.IO 可能先 polling 再 upgrade，只看 WS filter 容易漏掉握手前半段。

### 2. 檢查 Engine.IO request

常見 query parameters：

| 欄位 | 意義 |
| --- | --- |
| `EIO=4` | Engine.IO protocol revision |
| `transport=polling` | 目前使用 HTTP long-polling |
| `transport=websocket` | 正在建立／使用 WebSocket transport |
| `sid=...` | 這次 Engine.IO session ID |
| `t=...` | 避免 polling request 被 cache 的值 |

如果所有 request 都停在 polling，功能仍可能可用，但代表 WebSocket upgrade 沒成功。要檢查 proxy upgrade headers、網路環境與 server transport 設定。

### 3. 在 Messages 看 Socket.IO packet

升級到 WebSocket 後，Messages 可能看到：

```txt
2probe
3probe
5
40
42["chat.join","room-1"]
42["chat.message",{"id":"...","text":"你好"}]
2
3
```

常見片段可用兩層協議理解：

```txt
4  → Engine.IO message packet
2  → Socket.IO EVENT packet

42["chat.send", {...}]
││
│└── Socket.IO EVENT
└─── Engine.IO message
```

`2`／`3` 也可能是 Engine.IO ping／pong；不要只看第一個數字就把所有 packet 當成業務 JSON。除錯時優先從應用層 event name 找訊息。

### 4. 檢查 `connect_error` 與 server `connection_error`

client：

```js
socket.on("connect_error", (error) => {
  console.log(error.message);
  console.log(error.description);
  console.log(error.context);
});
```

server：

```js
io.engine.on("connection_error", (error) => {
  console.log({
    code: error.code,
    message: error.message,
    context: error.context,
  });
});
```

Network 告訴你 request／frame 發生什麼事，Socket.IO error event 與 server log 才更容易說明為什麼。

### 5. 用 Initiator 找出重複連線

同一頁有多條 `/socket.io/` 連線時，檢查：

- Vue composable 是否被多個元件各建立一次；
- React effect dependency 是否不穩定；
- listener cleanup 是否漏掉；
- 是否同時有 singleton socket 和元件內 socket；
- React development Strict Mode 是否正在測試 setup／cleanup。

如果整個 SPA 只需要一條共享連線，可在 app provider／store 層管理；但仍要清楚定義誰負責 connect、disconnect、listener 註冊與使用者切換。

## 常見的 Network 除錯情境

| 現象 | 常見原因 | 檢查方向 |
| --- | --- | --- |
| 完全沒有 `/socket.io/` request | client 沒執行、URL 錯誤、太晚開 DevTools | Console、Initiator、reload |
| polling 回 404 | server path 與 client path 不一致 | 雙方 `path`、proxy route |
| `Unsupported protocol version` | client／server major version 或 EIO 不相容 | package versions、`EIO` |
| `Session ID unknown` | 多節點沒有 sticky session，或 session 過期 | load balancer、sticky session、server log |
| 一直 polling、沒有 WS | upgrade 被 proxy／防火牆阻擋 | WS filter、Upgrade headers、proxy config |
| `connect_error: not authorized` | middleware 拒絕 token 或權限 | `auth` payload、server middleware |
| 連線固定時間後斷掉 | proxy timeout 小於 heartbeat 範圍 | `pingInterval + pingTimeout`、proxy timeout |
| reconnect 後事件觸發多次 | 在 `connect` 裡重複 `on()` | listener 註冊位置與 `off()` cleanup |
| room 收不到資料 | 沒 join、權限失敗、事件送到其他節點 | join ack、adapter、room 名稱 |
| client 直接連原生 WS server 失敗 | 協議不相容 | 兩端都使用 Socket.IO，或改用原生 WS client |

快速確認 server endpoint 是否存在：

```bash
curl "http://localhost:8080/socket.io/?EIO=4&transport=polling"
```

正常時會取得包含 `sid`、`upgrades`、`pingInterval` 等資訊的 Engine.IO open packet。這只能確認 endpoint 與 handshake，不能取代完整的 browser、認證與 event 測試。

## 從 Demo 到正式環境還缺什麼？

### 1. 自動重連不等於資料恢復

Socket.IO client 會針對部分暫時性斷線自動重連，但重連成功後，client 仍可能漏掉斷線期間的 server events。

server 可選擇啟用 connection state recovery：

```js
const io = new Server(httpServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false,
  },
});
```

重連時檢查：

```js
socket.on("connect", () => {
  if (socket.recovered) {
    console.log("暫時斷線期間的狀態與 packets 已恢復");
  } else {
    console.log("重新同步 rooms、snapshot 與漏掉的資料");
  }
});
```

recovery 不保證每次成功，仍需要完整 resync 路徑。

### 2. 預設 delivery guarantee 是 at most once

Socket.IO 會維持事件順序，但預設到達保證是 **at most once**：事件可能送達一次，也可能在斷線時遺失，不會自動變成「一定送達」。

client → server 可搭配 retry 與 ack timeout：

```js
const socket = io("https://example.com", {
  retries: 3,
  ackTimeout: 10000,
});
```

但 retry 可能產生重複處理，所以業務事件需要 idempotency key：

```js
socket.emit("payment.confirm", {
  requestId: crypto.randomUUID(),
  orderId: "order-123",
});
```

server → client 若要求補送，通常需要 event ID、持久化 event log、client offset 與 reconnect 後 replay。Socket.IO 不能替業務資料庫自動完成 exactly-once。

### 3. 認證、授權與輸入驗證

- 連線 middleware 驗證身分；
- 每個 event 仍要檢查 payload schema、資料大小與權限；
- 加入 room 前檢查資源存取權；
- 不信任 client 傳來的 user ID、角色或價格；
- 對高頻事件加 rate limit；
- `auth` 中使用短效 credential，避免在 log 暴露 secret；
- 登出或 token 失效時，清理連線與本地狀態。

Socket.IO 的 CORS 設定只處理瀏覽器 HTTP long-polling 等 HTTP requests；WebSocket 本身不受瀏覽器 CORS 機制以相同方式限制。server 仍應透過認證、`allowRequest` 或其他策略驗證允許的來源與連線。

### 4. Reverse proxy 與 path

proxy 必須正確轉發 WebSocket upgrade。以 nginx 為例，核心設定會包含：

```nginx
location /socket.io/ {
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
  proxy_pass http://socketio_backend;
}
```

proxy read timeout 應大於 Socket.IO 的 `pingInterval + pingTimeout`，否則連線可能被 proxy 提前關閉。

### 5. 多節點部署

Socket.IO server 擴展到多個 process／pod 後，需要處理兩件事：

1. **Sticky session**：使用 polling transport 時，同一個 Engine.IO session 的 successive HTTP requests 要抵達同一節點。
2. **Compatible adapter**：room 與 broadcast 要跨節點傳遞，例如依架構選用 Redis 等 adapter。

只在 load balancer 後面多開幾台 server，不會自動讓 room 成為跨節點共享狀態。

如果強制只用 WebSocket，可以降低 polling 對 sticky session 的需求：

```js
const socket = io("https://example.com", {
  transports: ["websocket"],
});
```

但會失去 polling fallback，必須先確認所有目標網路、proxy 與 client 都可靠支援。

### 6. 高頻事件與 UI 更新

Socket.IO 提供 transport 和事件 API，不會自動解決畫面渲染壓力：

- 合併或節流 typing、cursor、行情事件；
- 使用較小的 room／subscription 範圍；
- 不要每個 event 都重建大型陣列；
- 對可丟棄的即時狀態考慮 volatile event；
- 記錄 payload size、event rate、ack latency 與 reconnect 次數。

## WebSocket 與 Socket.IO 完整差異

### 協議與相容性

```txt
原生 WebSocket client
  ── RFC 6455 frames ──> WebSocket server

Socket.IO client
  ── Socket.IO packets
  ── Engine.IO packets
  ── polling / WebSocket / WebTransport ──> Socket.IO server
```

就算 Socket.IO 強制設定 `transports: ["websocket"]`，frame 裡仍是 Engine.IO + Socket.IO packet，不會變成原生 WebSocket protocol。

因此：

```js
// 不能直接互通
const nativeClient = new WebSocket("wss://socketio.example.com");

// 應使用相容 client
const socketIOClient = io("https://socketio.example.com");
```

### 工程能力比較

| 面向 | 原生 WebSocket | Socket.IO |
| --- | --- | --- |
| 定位 | 標準雙向傳輸協議 | 即時通訊函式庫與專用協議 |
| client | 瀏覽器原生 `WebSocket` | `socket.io-client` |
| server | 任意相容 WebSocket server | 相容 Socket.IO server |
| 底層 transport | WebSocket | polling、WebSocket、WebTransport |
| 訊息模型 | text／binary frame | 具名 event + arguments |
| JSON 格式 | 自己定義 | library 負責序列化常見資料 |
| Acknowledgement | 自己設計 request ID | 內建 ack callback／Promise |
| Room | 自己維護訂閱集合 | server 內建 room API |
| Namespace | 自己設計 | 內建 multiplexing |
| Broadcast | 自己遍歷連線 | `io.emit()`、`io.to().emit()` |
| Heartbeat | server／app 自己設計 | Engine.IO 內建 |
| 自動重連 | 自己實作 | client 內建 backoff／重連 |
| 暫時斷線恢復 | 自己實作 | 可選 connection state recovery，仍需 fallback resync |
| 預設到達保證 | 協議本身不保證業務事件持久送達 | at most once，進階保證仍由應用實作 |
| 協議 overhead | 較低 | 多一層 Engine.IO／Socket.IO packet |
| 跨語言／公開協議 | 標準、彈性較高 | 需要相容實作與版本 |
| 多節點部署 | 自行處理 pub/sub、連線路由 | 有 adapters，但 polling 常需 sticky session |

### 選擇原生 WebSocket 的情境

- 對接已存在的標準 WebSocket API；
- 公開 API 希望讓不同語言與 client 容易實作；
- 對 wire format、封包成本與 protocol 有明確控制需求；
- 團隊已有成熟的重連、訂閱、ack 與狀態恢復層；
- 系統不需要 Socket.IO 的 room、fallback 或 namespace。

### 選擇 Socket.IO 的情境

- client／server 都能採用 Socket.IO；
- 需要快速建立聊天室、room、broadcast 與 ack；
- 希望內建自動重連、heartbeat 與 transport fallback；
- 願意接受專用協議、額外套件和部署規則；
- 團隊更重視開發效率，而不是暴露最精簡的標準 wire protocol。

### 常見誤解

| 誤解 | 正確觀念 |
| --- | --- |
| Socket.IO 就是 WebSocket 套件包裝 | 它有自己的 Engine.IO 與 Socket.IO protocol |
| Socket.IO client 能連任何 WebSocket server | 兩端協議必須相容 |
| 使用 `transports: ["websocket"]` 就變原生 WS | 只是底層 transport 改成 WebSocket，packet 仍是 Socket.IO |
| 自動 reconnect 後資料一定完整 | 斷線期間事件可能遺失，仍要 recovery／resync |
| 有 ack 就是 exactly-once | ack、retry、持久化與 idempotency 是不同問題 |
| Room 是 client 可相信的權限系統 | Room 是 server 分組工具，加入前仍要做授權 |
| Socket.IO 多節點只要加 load balancer | polling 需 sticky session，跨節點 broadcast 需 adapter |

## 最後整理

學 Socket.IO 時，可以依這條主線理解：

```txt
io(url)
  → Engine.IO handshake
  → polling 建立連線
  → 嘗試 upgrade 到 WebSocket
  → Socket.IO namespace connect
  → emit / on / ack
  → room / broadcast
  → heartbeat + disconnect detection
  → reconnect
  → recovered 或重新同步狀態
```

Vue 與 React 的重點仍是生命週期管理：

- socket instance 不需要放進深度 reactive state；
- event listeners 要使用同一個 handler 精準清理；
- 不要在每次 reconnect 時重複註冊資料 listener；
- token、URL 或使用者切換時要關閉舊連線；
- 共用連線要明確定義所有權，不讓單一元件誤刪全站 listeners。

Chrome DevTools 的觀察順序則是：

```txt
Network
  → Fetch/XHR 看 polling handshake
  → WS 看 upgrade
  → Headers 看 EIO、transport、sid、path
  → Messages 看 Engine.IO / Socket.IO packets
  → connect_error + connection_error + server log 定位原因
```

## 延伸閱讀

- [本站：WebSocket 入門：原理、Vue／React 實作與 Network 除錯](./fe-websocket.md)
- [Socket.IO：Introduction](https://socket.io/docs/v4/)
- [Socket.IO：How it works](https://socket.io/docs/v4/how-it-works/)
- [Socket.IO：Client API](https://socket.io/docs/v4/client-api/)
- [Socket.IO：Protocol](https://socket.io/docs/v4/socket-io-protocol/)
- [Socket.IO：Delivery guarantees](https://socket.io/docs/v4/delivery-guarantees/)
- [Socket.IO：Connection state recovery](https://socket.io/docs/v4/connection-state-recovery/)
- [Socket.IO：Troubleshooting connection issues](https://socket.io/docs/v4/troubleshooting-connection-issues/)
- [Socket.IO：Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/)
