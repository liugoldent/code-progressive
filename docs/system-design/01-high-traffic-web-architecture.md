---
sidebar_position: 1
slug: "/system-design/high-traffic-web-architecture"
title: "高流量網站架構：從單機 PM2 到水平擴充"
description: "理解高流量網站如何透過 CDN、負載平衡、PM2、Redis、資料庫副本與訊息佇列逐步擴充。"
tags:
  - System Design
  - High Traffic
  - Load Balancing
  - PM2
  - Redis
keywords: ["系統設計", "高流量網站", "CDN", "Nginx", "PM2", "負載平衡", "Redis", "Queue", "水平擴充"]
---

# 高流量網站架構：從單機 PM2 到水平擴充

## 核心觀念

高流量網站通常不是單純「開更多 port」，而是把流量處理拆成多層，並讓每一層都能獨立擴充。

```text
使用者
   ↓
DNS
   ↓
CDN / WAF（Cloudflare、CloudFront）
   ├─ 圖片、JS、CSS：直接從 CDN 回傳
   └─ API / SSR
          ↓
負載平衡器（Nginx、ALB）
          ↓
   ┌──────┼──────┐
   ↓      ↓      ↓
主機 A   主機 B   主機 C
6 worker 6 worker 6 worker
   └──────┼──────┘
          ↓
Redis / Database / Message Queue
```

這個架構的核心不是使用了哪些產品，而是以下幾個原則：

- 能在邊緣節點回答的請求，不要送回源站。
- 應用程式保持無狀態，任何副本都能處理任何請求。
- 使用負載平衡器把請求分散到多個應用副本。
- 使用快取保護資料庫。
- 把耗時且不必即時完成的工作交給背景任務。
- 透過監控及壓力測試找出真正的瓶頸。

## 一次請求怎麼走

假設使用者請求：

```text
https://example.com/products
```

一次請求可能經過以下流程：

1. CDN 檢查是否已有可用快取。
2. 如果命中快取，CDN 直接回傳，不進入源站。
3. 如果沒有命中，請求才進入負載平衡器。
4. 負載平衡器選擇一台健康的應用主機。
5. 如果主機內使用 PM2 Cluster，Node.js Cluster 再將連線分配給其中一個 worker。
6. Worker 視需要讀取 Redis、Database 或其他服務。
7. 結果沿原路回傳給使用者；符合條件時也可能被 CDN 快取。

因此，使用多台主機搭配 PM2 時，可能同時存在兩層負載分配：

```text
第一層：Nginx / 雲端 Load Balancer
決定請求要進入哪一台主機或容器

第二層：PM2 / Node.js Cluster
決定連線要由該主機內的哪一個 worker 處理
```

負載平衡通常是分配「請求或連線」，不是把一位使用者永久綁在某個 worker 上。

## 第一層：使用 CDN 減少源站流量

高流量網站很重要的一步，是讓不必進入 Node.js 的請求停在 CDN。

適合放在 CDN 的內容包括：

- 圖片、影片、字型。
- JavaScript 與 CSS。
- 下載檔案。
- 可以短時間快取的 API。
- 可以快取的 HTML 頁面。

假設每秒有 10,000 個請求，CDN 快取命中率為 90%：

```text
使用者請求：       10,000 RPS
CDN 直接處理：      9,000 RPS
真正進入源站：      1,000 RPS
```

在這個例子中，後端需要承受的請求量直接減少九成。實際命中率取決於資料是否可快取、TTL、Cache Key 與更新策略。

## 第二層：從單台主機擴充到多個副本

單台主機使用 6 個 PM2 worker，可以使用多個 CPU 核心，但仍然存在單點故障：

```text
主機斷線 → 主機內 6 個 worker 一起消失
```

需要更高可用性與容量時，可以增加應用主機：

```text
Load Balancer
  ├─ Server A：6 workers
  ├─ Server B：6 workers
  └─ Server C：6 workers
```

如果 Server A 故障，負載平衡器應停止把新流量送往 A，改由 B、C 承接。

容器架構也採用相同概念：

```text
Load Balancer
  ├─ Container 1
  ├─ Container 2
  ├─ Container 3
  └─ Container 4
```

容器環境常使用「一個容器一個 Node.js 程序」，由 Kubernetes、ECS 等平台增加容器副本；不一定會在每個容器裡再啟動多個 PM2 worker。

### PM2 在架構中的位置

單台主機可以使用 PM2 Cluster 啟動多個 Node.js worker：

```js
module.exports = {
  apps: [
    {
      name: "pc-web",
      script: "./server/index.mjs",
      exec_mode: "cluster",
      instances: 6,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
```

外部 Nginx 只需要代理到共同的入口：

```text
Nginx → 127.0.0.1:3000 → PM2 Cluster → 6 workers
```

不需要為同一個 PM2 Cluster worker 分別建立 `3001` 到 `3006`。如果每個程序本來就是不同服務、容器或主機，才通常由 Nginx upstream 或雲端 Load Balancer 負責分配。

## 實戰案例：閱讀 PM2 Monit 高負載畫面

下面是一個 `pc-web` 使用 PM2 Cluster 運行 6 個 Node.js worker 的實際監控畫面。

![PM2 Monit 顯示六個 pc-web worker 的 CPU、記憶體、日誌與延遲指標](/img/system-design/pm2-monit-high-load.png)

從畫面可以推測，請求大致經過以下路徑：

```text
一般網站使用者
       ↓
CDN / Nginx
       ↓
pc-web：PM2 Cluster
 ├─ worker 0
 ├─ worker 1
 ├─ worker 2  ← 畫面目前選取
 ├─ worker 3
 ├─ worker 4
 └─ worker 5
       ↓
呼叫其他後端服務
 ├─ social-server
 ├─ search-server
 └─ center-server
       ↓
組合資料 / SSR 渲染
       ↓
回傳 HTML 或 API 結果
```

瀏覽器網址中的 PM2 proxy 路徑，是讓維運人員透過瀏覽器查看終端監控畫面，不是一般網站使用者的請求路徑。

### 左上：Process List

```text
[0] pc-web
[1] pc-web
...
[5] pc-web
```

這表示同一個 `pc-web` 程式啟動了 6 個程序：

| 欄位 | 代表意義 |
| --- | --- |
| `[0]` 到 `[5]` | PM2 Process ID |
| `pc-web` | 應用程式名稱 |
| `Mem` | 該程序目前使用的記憶體 |
| `CPU` | 該程序的 CPU 使用率 |
| `online` | 程序仍在運作 |

畫面中 6 個 worker 的記憶體合計約為：

```text
631 + 592 + 832 + 704 + 789 + 610
= 4,158 MB
≈ 4.16 GB
```

這還沒有計算作業系統、Nginx 和同一台主機上的其他服務。

6 個 worker 的 CPU 都接近或超過 100%。不同系統的 CPU 統計方式可能允許單一程序顯示超過 100%，但真正重要的是：所有 worker 同時接近滿載，代表這台主機的 Node.js 處理能力在截圖當下很可能已接近極限。

### 右上：pc-web Logs

右上是應用程式輸出的即時日誌。例如：

```text
POST https://search-server.../Search/Social/Query
Status: 200
Duration: 4166ms
```

它代表 `pc-web` 呼叫 `search-server`，約 4.16 秒後收到成功回應。

`Status: 200` 只表示請求成功，不表示速度正常：

```text
Status 200 + 150ms  → 成功且快
Status 200 + 9.31s  → 成功但非常慢
```

畫面中可看到的部分耗時如下：

```text
一般 Social API：     約 100～800ms
Recommend API：       約 3.7～3.9s
Search Query：        約 4.1s
Video 頁面：          約 4.75s
MainPage/Text 頁面：  約 9.31s
```

日誌同時出現頁面開始與結束紀錄，並在中間呼叫多個服務。這暗示 `pc-web` 可能不只是靜態檔案伺服器，而是 SSR 或 BFF：收到頁面請求後，先向多個下游服務取得資料，再組合資料或渲染 HTML。只要其中一個下游服務變慢，整個頁面就可能被拖慢。

### 左下：Custom Metrics

左下顯示的是目前選取的 `[2] pc-web` worker，不是 6 個 worker 的總和。

#### Heap Size、Used Heap Size 與 Heap Usage

```text
Heap Size：       672.48 MiB
Used Heap Size：  614.57 MiB
Heap Usage：      91.39%
```

三者的關係大致是：

```text
614.57 ÷ 672.48 ≈ 91.39%
```

- `Heap Size`：V8 目前配置給 JavaScript Heap 的空間。
- `Used Heap Size`：JavaScript 物件實際使用的 Heap。
- `Heap Usage`：已使用 Heap 佔配置 Heap 的比例。

`91.39%` 偏高，可能使垃圾回收 GC 更頻繁。GC 會消耗 CPU，也可能增加 Event Loop 延遲，但單次看到高 Heap 不足以判定記憶體洩漏，應觀察 GC 後能否下降：

```text
正常：
記憶體上升 → GC → 明顯下降 → 再上升

可能洩漏：
記憶體持續上升 → GC 後仍降不回去
```

左上顯示的 `Mem 832 MB` 比 `Used Heap 614 MB` 大，是因為整個 Node.js 程序還包含 Buffer、Native Module、程式碼、Thread Stack 等非 JavaScript Heap 記憶體。

#### Active Requests 與 Active Handles

```text
Active requests：11
Active handles： 53
```

`Active requests` 是這個 worker 當下仍在進行的請求或短期操作，不能直接解讀成 11 位登入使用者。一位使用者可能同時發出多個請求；停留在頁面但沒有操作的使用者，也不一定被計入。

`Active handles` 是讓 Node.js Event Loop 繼續運作的長期資源，例如 TCP Socket、HTTP Server、資料庫連線、Timer 或 WebSocket。數字 53 本身不一定有問題，重點是它是否持續增加且不會下降。

#### Event Loop Latency

```text
Event Loop Latency：      18.22ms
Event Loop Latency p95： 170.06ms
```

Event Loop Latency 可以理解成：Node.js 原本應該執行下一個工作，但因為主執行緒忙碌，延後了多久才執行。

`p95 = 170ms` 表示在統計窗口裡，約 95% 的觀測值不超過 170ms，仍有約 5% 更慢。這個數字偏高，常見原因包括：

- SSR 渲染太重。
- 大型 JSON 解析或序列化。
- 同步迴圈或其他阻塞程式。
- 壓縮、加密等 CPU 密集工作。
- 大量同步日誌輸出。
- Heap 壓力造成 GC 頻繁。
- 整台主機的 CPU 已接近滿載。

#### HTTP Mean 與 P95 Latency

```text
HTTP Mean Latency： 220ms
HTTP P95 Latency：  約 6306ms（6.3 秒）
```

平均回應時間 220ms 看起來不算太差，但平均值很容易隱藏少數非常慢的請求。P95 約 6.3 秒代表尾端請求非常慢，大約有 5% 的請求比 6.3 秒更久。

平均值與 P95 差距很大，可能代表大部分請求很快，少部分 SSR 頁面或下游 API 特別慢；也可能是兩項指標的取樣窗口不同，仍需搭配依路由分類的監控確認。

#### HTTP Requests per Minute

```text
HTTP：24.42 req/min
```

這是目前選取 worker 在統計窗口內量測到的 HTTP 頻率，不是在線使用者數，也不是 CDN 與 6 個 worker 的網站總流量。自動監控還可能只涵蓋真正進入這個 Node.js HTTP Server 的請求。

### 右下：Metadata

| 欄位 | 畫面值 | 意義 |
| --- | --- | --- |
| App Name | `pc-web` | PM2 應用名稱 |
| Namespace | `default` | PM2 的應用分組 |
| Version | `0.0.0` | 套件或部署版本資訊 |
| Restarts | `0` | 啟動後沒有被 PM2 重啟 |
| Uptime | `14m` | 這批程序啟動約 14 分鐘 |
| Script path | `/app/server/index.mjs` | 實際執行的 Node.js 入口 |
| Interpreter | `/usr/local/bin/node` | 使用 Node.js 執行 |
| Exec mode | `cluster` | 使用 Cluster 多程序模式 |
| Node.js version | `22.14.0` | Node.js 執行版本 |

`Restarts: 0` 表示目前沒有崩潰重啟，是好現象；但 `Uptime: 14m` 也表示觀察時間還很短，可能才剛部署完成。

### 這張圖透露的健康狀況

正常的部分：

- 6 個 worker 都是 `online`。
- 沒有重啟紀錄。
- 多數下游 API 回傳 `200`。
- Cluster 模式確實有運作。

需要注意的部分：

```text
所有 worker CPU 約 100%
Heap Usage 91.39%
Event Loop p95 約 170ms
HTTP p95 約 6.3 秒
部分頁面耗時 4～9 秒
```

這些指標合在一起看，應用當下可能處於高負載、GC 壓力較大，而且有部分 SSR 或下游服務很慢。不過單張截圖只能證明當時很忙，還不能直接斷定流量過大或存在記憶體洩漏。

等待下游 API 本身屬於非同步 I/O，通常不會單獨讓所有 CPU 滿載。因此如果慢 API、CPU 滿載、Heap 使用率高同時出現，還應調查 SSR、JSON 處理、壓縮、同步程式與 GC 等因素。

### 建議的調查順序

1. 先觀察 5～15 分鐘，確認高 CPU、Heap 與延遲是持續問題還是瞬間尖峰。
2. 依路由統計 RPS、p95、p99，先找出最慢且流量大的頁面。
3. 將 `pc-web` 自己的運算時間與等待下游 API 的時間分開記錄。
4. 檢查 CPU Profile，確認時間花在 SSR、JSON、壓縮、日誌還是 GC。
5. 觀察 Heap 經過 GC 後能否回落，必要時比較 Heap Snapshot。
6. 調查 `search-server` 為何有部分請求需要 3～4 秒。
7. 使用壓力測試找出 RPS 增加時，CPU 與 p95 開始明顯惡化的轉折點。

如果主機的 CPU 核心已被 6 個 worker 用滿，繼續增加 worker 通常不會改善問題。合理方向是：

```text
優化慢路由 / SSR / 下游服務
        ＋
增加適當的 CDN 或 Redis 快取
        ＋
必要時增加另一台應用主機
```

監控畫面會暴露內部服務名稱、路由、使用者識別資訊和效能狀態。正式環境應限制在公司內網、VPN、身分驗證或 IP Allowlist 之後，不應直接公開。

## 第三層：讓應用程式保持無狀態

水平擴充的前提，是任何 worker 或主機都能處理任何使用者的下一個請求。

不適合的設計：

```text
登入 Session 只存在 worker 0 的記憶體
```

下一個請求若被分配到 worker 3，worker 3 就可能不知道使用者已登入。

常見設計是把共享狀態放到所有副本都能存取的位置：

```text
Session       → Redis
帳號與訂單    → Database
圖片與檔案    → Object Storage
可重建的快取  → Redis / CDN
```

JWT 可以讓每個 worker 自行驗證身分，但撤銷、更新與權限狀態仍需依實際安全需求設計。

WebSocket 建立後通常會持續連在接手的應用副本。如果不同副本需要互相推播，可以使用 Redis Pub/Sub、訊息系統或對應框架的跨節點 adapter。

## 第四層：使用 Redis 保護資料庫

入門延伸：[Redis 與 Cache：React 前端 × Python 後端](/docs/system-design/redis-cache-react-python)。獨立介紹快取觀念、讀寫流程、FastAPI 與 React 範例，以及大流量時的失效與故障處理。

熱門而且允許短暫不一致的資料，不必每次都查資料庫：

```text
請求商品資料
    ↓
Redis 有資料？── 是 → 直接回傳
    │
    否
    ↓
查 Database
    ↓
寫入 Redis（設定過期時間）
    ↓
回傳
```

假設原本每秒有 5,000 次資料庫查詢，快取命中率為 95%：

```text
Redis GET：       5,000 次（另有未命中後填入快取的 SET）
命中並省下 DB 查詢：4,750 次
Database 查詢：     250 次
```

導入快取時也必須設計：

- 資料何時過期。
- 資料更新後如何讓舊快取失效。
- Redis 故障時是否允許直接查資料庫。
- 大量 key 同時過期時如何避免瞬間打爆資料庫。

Redis 不一定只是 cache，也能作為 Session Store、Rate Limit Counter、分散式鎖或 Pub/Sub；必須先確認它在該筆資料中的角色。

## 第五層：逐步擴充資料庫

資料庫經常比應用程式更早成為瓶頸。常見演進方向如下：

```text
第一階段：單一資料庫
第二階段：Primary + Read Replicas
第三階段：依服務或領域拆分資料
第四階段：Partitioning 或 Sharding
```

例如：

```text
寫入訂單 → Primary
查詢商品 → Read Replica
熱門商品 → Redis
商品搜尋 → Elasticsearch / OpenSearch
```

Read Replica 可能存在複寫延遲，因此剛完成寫入、必須立即讀到最新資料的流程，不一定適合馬上改讀 Replica。

分庫與 Sharding 會增加查詢、交易、一致性和維運成本，不應只因為預期未來可能有流量就提前導入。先透過慢查詢分析、索引、快取與讀寫分離解決已確認的問題。

## 第六層：把耗時工作交給背景任務

寄信、產生報表、圖片處理等工作通常不必阻塞 HTTP 回應：

```text
使用者建立訂單
       ↓
API 驗證並儲存訂單
       ↓
將後續工作寫入 Queue
       ↓
立即回覆使用者
       ↓
背景 Worker 寄信、產生發票
```

常見元件包括 Redis Queue、RabbitMQ、Kafka 與 SQS。

導入 Queue 之後還需要考慮：

- Job 失敗如何重試。
- 重試是否會造成重複扣款、寄信或寫入。
- 超過重試次數後放到哪裡。
- 如何監控積壓量與最久等待時間。

## 不同規模的合理架構

### 小型網站

```text
Cloudflare
    ↓
Nginx
    ↓
PM2 Cluster（單台主機）
    ↓
Database
```

這個階段重點是簡單、可監控、可備份，不需要一次引入所有大型系統元件。

### 中型網站

```text
CDN / WAF
    ↓
Load Balancer
    ↓
多台應用主機或容器
    ↓
Redis + Database + Object Storage
```

這個階段開始消除單點故障，並將應用程式設計成可以水平擴充。

### 大型或跨區域網站

```text
全球 CDN
    ↓
多區域流量管理 / Load Balancer
    ↓
自動擴縮容的容器或服務
    ↓
Redis Cluster、Queue、搜尋服務
    ↓
資料庫副本、分區與跨區備援
```

跨區域架構還需要額外處理資料一致性、故障切換、延遲、成本與法規問題，不是單純多部署幾台主機。

## 如何判斷下一步該擴充哪裡

不要只看使用者人數，也不要先猜需要幾個 worker。應在壓力測試和真實流量中觀察：

- RPS（每秒請求數）。
- p50、p95、p99 回應時間。
- 錯誤率及 Timeout 數量。
- 每台主機與每個 worker 的 CPU、記憶體。
- Node.js Event Loop 延遲。
- 資料庫慢查詢、連線池與鎖等待。
- Redis 命中率與記憶體。
- Queue 積壓量。
- CDN 快取命中率與回源流量。

例如：

```text
CPU 長時間滿載、資料庫正常
→ 優化 CPU 工作或增加應用副本

CPU 很低、API 仍很慢、DB 連線池已滿
→ 瓶頸在資料庫，不是 PM2 worker 數量

記憶體持續上升且無法下降
→ 調查記憶體洩漏，不能只靠增加 RAM

大量流量都是圖片與靜態檔案
→ 優先改善 CDN，而不是增加 Node.js worker
```

## 從 PM2 單機開始的演進路線

```text
起點：
Nginx → 一台主機 → PM2 6 workers → Database

流量成長：
CDN → Load Balancer → 多台應用主機 → Redis / Database

需要非同步處理：
應用服務 → Queue → 背景 Workers

需要更高可用性：
多可用區應用副本 → 資料庫副本與備援
```

在同一台主機上無限制增加 worker 或 port，最終仍會受到該主機的 CPU、記憶體、網路與磁碟限制。真正的水平擴充，是增加彼此獨立的應用副本，並把狀態移到可以共享或可靠保存的服務。

## 設計檢查清單

- [ ] 靜態資源是否經由 CDN？
- [ ] 應用服務是否無狀態？
- [ ] Session 是否能被所有副本存取？
- [ ] 負載平衡器是否有健康檢查？
- [ ] 單台主機故障時是否仍能服務？
- [ ] 熱門資料是否有合理快取？
- [ ] 快取失效與故障降級是否有設計？
- [ ] 資料庫是否有索引、慢查詢與連線池監控？
- [ ] 耗時工作是否能改由 Queue 處理？
- [ ] Queue Job 是否具備重試與冪等性？
- [ ] 是否監控 RPS、延遲、錯誤率與資源使用？
- [ ] 是否定期進行壓力測試、備份與還原演練？

## 延伸閱讀

- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [NGINX HTTP Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [Cloudflare CDN documentation](https://developers.cloudflare.com/cache/)
