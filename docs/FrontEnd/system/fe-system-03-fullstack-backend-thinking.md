---
slug: "/FE-knowledge/fe-system-03-fullstack-backend-thinking"
title: "前端轉全端：不要只把後端想成另一個語言的 CRUD"
description: "整理前端工程師轉 Full Stack 時需要補上的後端系統思維：API 分層、資料庫、transaction、cache、queue、報表與部署維運。"
tags:
  - Full Stack
  - Backend
  - System Design
  - Database
  - Cache
keywords: ["前端轉全端", "Full Stack", "Node.js", "Express", "後端系統", "資料庫", "Redis", "ORM", "Cache"]
---

# 前端轉全端：不要只把後端想成另一個語言的 CRUD

> 整理自 2026-05-17 PM13:50 社群討論：Lazarus 問「前端想學後端語言，是不是選 Node.js / Express.js 比較容易找到 Full Stack 工作？」

## 核心結論

前端想走 Full Stack，Node.js / Express.js 確實可以作為入門選項，因為語言成本低、跟前端 TypeScript / JavaScript 生態接近。

但真正的重點不是「選哪個後端語言」，而是：

> 是否理解後端系統怎麼好好活著。

Full Stack 不是「會前端 + 會開幾支 API」。

真正的門檻在於是否能理解：

- request 進到 server 之後會經過哪些流程。
- API validator / controller / service / repository 各自負責什麼。
- 資料何時可以進 DB。
- 權限與驗證該放在哪一層。
- transaction 怎麼包。
- retry 會不會造成重複寫入。
- cache 什麼時候能信、什麼時候不能信。
- queue 失敗怎麼補償。
- log / trace / error 怎麼追查。
- API version 怎麼相容。
- 部署環境裡 CORS / proxy / Docker / Nginx 怎麼處理。

一句話：

> 不要把後端想成只是另一個語言的 CRUD。

## Node.js / Express.js 可以學，但不要誤會它等於 Full Stack

Node.js / Express.js 可以作為前端入門後端的起點。

原因是：

- 語言轉換成本低。
- 生態熟悉。
- 適合快速理解 API server。
- 可以搭配 TypeScript、Drizzle、Prisma、NestJS 等工具。
- 對前端工程師較容易建立第一個完整服務。

但問題是：

> 會 Express 開 API，不等於會 Full Stack。

例如：

```ts
app.get("/orders", async (req, res) => {
  const orders = await db.query("SELECT * FROM orders");
  res.json(orders);
});
```

這種程度只能算是會做 API entry point。

真正工作上會遇到的是：

- 這個查詢會不會掃大表？
- index 有沒有吃到？
- 權限能不能看這些訂單？
- 回傳資料會不會暴露敏感欄位？
- 交易狀態是否一致？
- DB 查詢失敗是否可以 retry？
- retry 會不會重複寫入？
- 有沒有 transaction？
- cache 是不是髒的？
- 報表查詢會不會拖垮線上交易服務？

所以語言是入口，不是能力的全部。

## Full Stack 必須理解的 11 個問題

如果真的要被認可能做 Full Stack，至少要開始理解以下問題：

1. schema 怎麼設計。
2. primary key / index / composite index 怎麼下。
3. transaction 怎麼包，rollback 怎麼處理。
4. N+1 query 怎麼避免。
5. 權限驗證要放在哪一層。
6. cache invalidation 怎麼做。
7. 錯誤重試會不會造成重複寫入。
8. queue job 失敗怎麼補償。
9. log / trace / error 怎麼追查。
10. API version 怎麼相容。
11. 部署環境裡 header / CORS / proxy / Docker / Nginx 怎麼處理。

這些不是每一件事都要一個人獨立維護到專家級。

但至少要知道：

> 系統壞掉時，可能壞在哪裡。  
> 資料不一致時，要從哪裡查。  
> 流量上來時，哪裡會先撐不住。  
> 需求變成報表時，原本的資料模型能不能回答問題。

## Header / CORS / Nginx 的正確說法

前端可以自己加 request header。

但如果是跨域請求，custom header 可能會觸發 CORS preflight。這時 server / gateway / Nginx / proxy 必須允許對應的 `Access-Control-Allow-Headers`，否則瀏覽器會直接擋掉。

不是「前端加 header 必然需要 Nginx」，而是：

> 跨域情境下，前端加 custom header 時，後端或 proxy 層要正確設定 CORS allow headers。

例如：

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, X-Request-ID
```

這類問題對 Full Stack 很重要，因為很多人會以為：

> 前端有送 header，就代表 server 一定會收到。

但在瀏覽器環境中，如果 CORS preflight 沒過，請求根本不會進到真正的 API handler。

## Redis：先分清楚它在這筆資料中的角色

如果 Redis 是 cache，它不是資料真相來源。

cache miss 不代表 DB 沒資料。cache hit 也要考慮資料是否過期、是否 stale。

但如果 Redis 存的是 session、lock、rate limit、queue state 這類 runtime state，它在該資料上可能就是主要狀態來源。

所以重點不是「Redis 永遠不能信」，而是要分清楚：

> Redis 在這個資料上的角色是什麼？

常見角色包括：

- cache。
- session store。
- distributed lock。
- rate limit counter。
- pub/sub。
- queue state。
- temporary runtime state。
- idempotency key store。

如果 Redis 是 cache，DB 通常才是 source of truth。

如果 Redis 是 session store，那 session 狀態本身可能就以 Redis 為主。

## Cache invalidation：不要只會 set cache

快取真正難的不是寫入，而是失效。

例如：

```ts
const cached = await redis.get(key);

if (cached) {
  return JSON.parse(cached);
}

const data = await db.findById(id);

if (data) {
  await redis.set(key, JSON.stringify(data), "EX", 60);
}

return data;
```

這只是最基本的 cache-aside pattern。

真正工作上會遇到的是：

- DB 更新後 cache 要不要刪？
- cache 刪除失敗怎麼辦？
- 多個 key 指向同一份資料怎麼同步失效？
- 高併發下 cache miss 會不會造成 cache stampede？
- 是否需要 lock？
- 是否需要 write-through？
- 是否需要 event 通知其他服務清 cache？
- 是否需要反向索引管理 cache keys？

比較精準的說法是：

> DB 更新後，要設計 cache invalidation / refresh 策略，不然就會出現 stale cache。

## UPDATE 與 INSERT：不要把目前狀態當成所有歷史問題的答案

很多人一開始會覺得後端只是：

- INSERT 一筆訂單。
- UPDATE 訂單狀態。
- UPDATE 成交數量。
- UPDATE 付款狀態。

看起來很直覺。

但當資料表開始變多、資料量變大、報表需求變複雜，就會遇到問題。

報表通常不是只問：

> 這筆訂單現在是什麼狀態？

報表真正會問：

- 它什麼時候建立？
- 什麼時候 pending？
- 什麼時候 partial filled？
- 什麼時候 fully filled？
- 每次成交價格是多少？
- 每次成交量是多少？
- 哪個 maker / taker 造成的？
- 哪個商品當時成交量最高？
- 當時手續費是多少？
- 每個狀態停留多久？
- 歷史資料被修正後，報表要看修正前還是修正後？

如果你只一直 UPDATE 同一筆資料，很多歷史狀態會被覆蓋掉。

這時候報表查詢就只能大量 JOIN、掃大表、補條件、算時間區間、查 log，或從多張表還原事件順序。

這時候根本不是在查資料，而是在事後考古。

## Current state 與 event history 要分開

比較健康的設計通常會把「目前狀態」和「歷史事件」分開。

例如：

```txt
orders
- order_id
- user_id
- symbol
- status
- filled_amount
- remaining_amount
- updated_at
```

`orders` 適合回答：

> 這張訂單現在是什麼狀態？

但如果你要知道過程，就應該有事件表：

```txt
order_events
- id
- order_id
- event_type
- amount
- price
- maker_user_id
- taker_user_id
- fee
- created_at
```

`order_events` 適合回答：

> 這張訂單過程中發生過什麼？

簡單說：

> `orders` 是 current state。  
> `order_events` 是 history / timeline / audit / report source。

所以不是說 UPDATE 不能用。

而是：

> UPDATE 可以用來維護目前狀態。  
> INSERT 應該用來保存事件、歷史、流水、快照與報表來源。

## 為什麼很多時候 INSERT 就可以解決？

在交易所、金流、帳務、庫存、訂單、撮合系統裡，很多資料天然適合 append-only。

例如：

- 訂單事件。
- 成交明細。
- 帳務流水。
- 資金異動。
- 手續費紀錄。
- 風控事件。
- 使用者操作紀錄。
- 狀態轉換紀錄。

這些資料的重點不是「目前長什麼樣子」，而是「過程中發生過什麼」。

如果每次變化都 INSERT 一筆，報表可以直接從事件或流水查詢。

例如：

```sql
SELECT SUM(amount)
FROM order_events
WHERE event_type IN ('partial_filled', 'filled')
  AND created_at >= '2026-05-17 00:00:00'
  AND created_at < '2026-05-18 00:00:00';
```

但如果你只剩 `orders.status = 'filled'` 和 `orders.updated_at`，報表就很難知道中間過程。

這就是為什麼有 DBA / SRE 經驗的人會說：

> 很多時候 INSERT 就可以解決，不懂為什麼要一直 UPDATE 和 JOIN。

他真正想表達的是：

> 不要把所有歷史問題都丟給一張只記得「現在」的表去回答。

## 報表資料不一定要每次都從原始表現算

如果每次報表都從原始交易表、訂單表、使用者表、權限表、商品表、手續費表重新 JOIN 和 GROUP BY，資料量一大就會很痛。

常見做法是拆出：

- event table。
- history table。
- ledger table。
- snapshot table。
- summary table。
- materialized view。
- read model。
- OLAP / warehouse / reporting DB。
- read replica。

例如：

```txt
orders
目前訂單狀態。

order_events
訂單生命週期事件。

trades
每次成交明細。

ledger_entries
帳務流水，append-only。

daily_trade_summary
每日成交量彙總。

account_snapshots
每日帳戶資產快照。
```

這樣做的目的不是為了讓資料看起來複雜，而是為了讓不同問題由不同資料模型回答。

```txt
現在狀態：查 current table
歷史過程：查 event/history table
帳務稽核：查 ledger
報表統計：查 summary/snapshot/read model
```

## 前端 step data 與後端 order_events 的類比

前端流程頁有一個類比：

> 前端在第一步 API 拿到資料，第二步刷卡、第三步確認訂單都會用到。如果後端沒有在下一步 API 補完整 step data，前端也沒有把必要資料保存起來，後面就只能重新 query，甚至從別的 API 拼資料。

這和後端事件表不是同一層東西，但有共同點：

> 後面會用到的關鍵上下文，如果前面沒有留下來，後面就只能重新查、反推、補資料，甚至查不到。

比較精準地說：

> 前端流程如果沒有保存 step context，後面就要重查。  
> 後端資料如果沒有保存 event context，報表就要考古。

所以 `order_events` 不是多餘。

它的價值是把「過程」保存下來。

## ORM 可以用，但不要誤會成換 DB 無痛

ORM 可以降低：

- model / schema mapping 成本。
- 基本 CRUD 成本。
- migration 管理成本。
- 型別對接成本。
- 一般查詢封裝成本。
- 重複 SQL 撰寫成本。

但 ORM 不能保證：

- 換 DB 無痛。
- 不需要懂 SQL。
- 不需要懂 index。
- 不需要看 query plan。
- 不需要理解 transaction。
- 不需要理解 lock。
- 不需要理解 DB-specific behavior。

只要碰到以下東西，不同 DB 的差異仍然很大：

- transaction isolation。
- lock 行為。
- JSON / array 欄位。
- upsert 語法。
- index strategy。
- full-text search。
- window function。
- materialized view。
- partitioning。
- read replica。
- query planner。
- 大量報表聚合查詢。

所以更正確的說法是：

> ORM 是工具，不是資料庫替身。  
> 你可以用 ORM，但你要知道它最後產出的 SQL 在 DB 裡怎麼跑。

## Drizzle / Prisma / TypeORM 的重點不是名字

如果 Lazarus 問：

> Drizzle ORM 可以嗎？

可以回答：

> 可以。Drizzle 偏 type-safe SQL builder，對 TypeScript 工程師友善。但重點不是 Drizzle、Prisma、TypeORM 哪個，而是你要知道 ORM 產出的 SQL 長什麼樣子，以及這個 SQL 在資料量變大後會怎麼跑。

要能看：

- SQL 是否合理。
- index 有沒有吃到。
- query plan 長怎樣。
- 是否掃大表。
- 是否有 N+1。
- 是否有過度 JOIN。
- 是否該拆 summary table。
- 是否該用 raw SQL。
- 是否該移到 reporting DB / OLAP。

## UNIQUE、FOREIGN KEY、idempotency：INSERT 不是無腦新增

如果開始用 INSERT 記事件、流水、歷史紀錄，就更要想清楚哪些資料不能重複。

例如交易系統裡：

- 同一筆成交不能被 retry 寫入兩次。
- 同一筆帳務流水不能重複入帳。
- 同一個 order event 不能被重複消費。
- 同一個 idempotency key 只能成功一次。
- 某筆 trade 必須對應到存在的 order / account / symbol。

常見設計包括：

```txt
UNIQUE(idempotency_key)
UNIQUE(order_id, event_seq)
UNIQUE(trade_id)
UNIQUE(ledger_entry_id)
INDEX(created_at)
INDEX(symbol_id, created_at)
INDEX(user_id, created_at)
INDEX(order_id, created_at)
```

大方向是：

- UNIQUE 防止重複寫入。
- FOREIGN KEY 保證關聯存在。
- INDEX 支援查詢路徑。
- event_seq / created_at 保證事件順序。
- idempotency_key 對抗 retry 重複執行。
- snapshot / summary 避免每次報表都從原始事件重算。

但 FOREIGN KEY 也有現實邊界。

在單體或中小型系統中，FK 很有幫助。

但在分庫分表、跨服務資料、超高寫入場景，有些團隊會選擇不用 DB FK，而改用 application-level constraint。

重點不是永遠要不要 FK，而是：

> 關聯約束一定要存在某一層。不是 DB 保證，就是 application / service / event pipeline 要保證。

## Session 與 permission 不一定要綁在同一個 Redis key

如果權限更新、角色異動、組織異動時，只能清 session，那就會導致使用者被登出。

比較常見會拆成：

```txt
session:{sessionId}
保存登入狀態，例如 userId、expiresAt、deviceId。

user_permissions:{userId}
保存使用者權限快取。

permission_version:{userId}
保存權限版本。

session 裡只記 userId / permissionVersion。
```

當權限異動時，可以：

- 清 permission cache。
- 提高 permissionVersion。
- 讓下一次請求重新載入權限。
- 不一定要砍掉 session。

所以比較好的理解是：

> session、permission、cache 如果生命週期不同，通常不要綁得太死。不然清一個會牽動另一個。

## 給前端轉 Full Stack 的學習路線建議

如果你是前端，想從 Node.js / Express.js 開始，可以這樣練：

### 第一階段：API 與基本資料庫

- Express / NestJS / Fastify 擇一。
- PostgreSQL / MySQL 擇一。
- Drizzle / Prisma 擇一。
- 基本 CRUD。
- schema design。
- migration。
- validation。
- error handling。

### 第二階段：權限與交易一致性

- auth。
- session / JWT / refresh token。
- role / permission。
- transaction。
- idempotency key。
- retry safety。
- optimistic / pessimistic locking。

### 第三階段：查詢效能

- index。
- composite index。
- N+1。
- pagination。
- query plan。
- slow query。
- JOIN 成本。
- read model。

### 第四階段：cache 與 queue

- Redis cache。
- cache invalidation。
- session store。
- rate limit。
- job queue。
- retry / dead letter queue。
- event-driven design。

### 第五階段：報表與歷史資料

- current state vs event history。
- ledger。
- snapshot。
- summary table。
- materialized view。
- OLTP vs OLAP。
- reporting DB / read replica。

### 第六階段：部署與維運

- Docker。
- Nginx / reverse proxy。
- CORS。
- environment variables。
- logging。
- monitoring。
- tracing。
- backup / restore。
- migration rollback。

## 可以貼給初學者的收斂版

```txt
Node.js / Express.js 可以當入門，因為前端轉過去語言成本低。

但 Full Stack 的重點不是你會哪個後端語言，而是你能不能理解後端系統怎麼運作。

會開 API 不等於會後端。

真的進工作會遇到 schema、index、transaction、權限、cache invalidation、retry、queue、log、API version、CORS、proxy、Docker、報表查詢、資料一致性這些問題。

尤其資料進 DB 之後，不是 INSERT / UPDATE 就結束。

UPDATE 適合維護目前狀態，但歷史、報表、審核、統計很多時候要靠 event / history / ledger / snapshot / summary table。

不然資料量一大，報表就會變成大量 JOIN、掃大表、補條件、算時間區間，最後不是查資料，是在現場考古。

所以 Node 可以學，但不要只學 Express CRUD。
要練的是一個資料從請求進來、驗證、寫入、快取、佇列、查詢、報表、部署到維運的完整生命週期。
```

## 金句版

> 不是要學某個後端語言才能轉全端。是要學後端系統怎麼好好活著。

> 不要把後端想成只是另一個語言的 CRUD。

> 會 Express 開 API，不等於會 Full Stack。

> ORM 是工具，不是資料庫替身。

> UPDATE 維護目前狀態，INSERT 保存歷史事件。

> orders 回答「現在是什麼狀態」，order_events 回答「過程中發生過什麼」。

> 報表不能靠猜，也不能靠事後考古。

> 如果後端資料沒有保存 event context，報表就要考古。

> 想當 Full Stack，請先把系統當成一個隨時會崩潰的分散式環境來敬畏。

## 最終總結

這次討論的重點不是「Node.js、PHP、C#、Java 哪個比較好」。

真正的重點是：

> Full Stack 的價值不是多會一個語言，而是能理解系統從請求、驗證、權限、交易、快取、佇列、資料庫、報表到部署維運的整條生命週期。

Node.js 可以是入口。

Express 可以是第一步。

ORM 可以是工具。

但如果只會 CRUD，就只是前端多寫了一層 API。

真正的 Full Stack，要開始理解資料怎麼流、狀態怎麼變、錯誤怎麼補、歷史怎麼留、報表怎麼查、系統怎麼在壓力下不炸。
