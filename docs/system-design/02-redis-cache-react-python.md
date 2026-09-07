---
sidebar_position: 2
slug: "/system-design/redis-cache-react-python"
title: "Redis 與 Cache 入門：React 前端 × Python 後端"
description: "從快取命中、TTL、Cache Key 到 Cache Aside，以 React 與 Python FastAPI 範例理解 Redis 如何減少資料庫查詢，以及更新、故障與大流量的處理方式。"
tags:
  - System Design
  - Redis
  - Cache
  - React
  - Python
keywords: ["Redis", "Cache", "快取", "Cache Aside", "TTL", "FastAPI", "React", "Python", "快取失效"]
---

# Redis 與 Cache 入門：React 前端 × Python 後端

本篇是 [高流量網站架構](/docs/system-design/high-traffic-web-architecture) 的獨立延伸筆記。先用「很多人讀同一份商品介紹」理解快取，再看 React 與 Python 如何合作。

## 1. Cache 是概念，Redis 是可以實作它的工具

**Cache（快取）就是先保存一份可重用的結果，下一次需要時直接拿，減少重複查詢或計算。**

假設一千人查看同一項商品。如果每次都向資料庫查相同介紹，資料庫會重複做相似的工作。可以先將查詢結果保存三十秒，這段期間其他請求就使用快取中的結果。

這適合「讀取多、內容重複、允許短暫舊資料」的情境。商品庫存扣減、付款確認等要求當下正確的操作，仍要走具備一致性保證的資料庫交易或權威服務，不能直接相信介紹頁快取。

| 名稱 | 是什麼 | 本題的角色 |
| --- | --- | --- |
| Cache | 重用結果的設計概念 | 避免重複查商品介紹 |
| Redis | 可透過網路存取的資料服務，常用於快取，也提供其他資料結構與訊息功能 | 保存商品介紹的暫存副本 |
| Database | 保存正式資料的資料庫，例如 PostgreSQL | 商品介紹的權威來源 |
| React | 前端 UI 函式庫 | 呼叫 API，顯示資料與載入狀態 |
| Python 後端 | 執行 API 與資料處理邏輯的程式 | 決定查 Redis、查資料庫、設定過期與失效 |

**本篇的 Redis 資料可以由資料庫重建。** Redis 也能扮演其他角色，但不能把所有 Redis 資料都當成可隨意丟掉的快取。

## 2. React、Python、Redis 放在哪裡？

```txt
使用者瀏覽器
  React
    │ HTTP GET /api/products/1
    ▼
Python API（本篇用 FastAPI）
    │
    ├── 先問 Redis：有商品 1 的介紹嗎？
    │      └── 有 → 直接用快取結果回傳
    │
    └── 沒有 → 查 Database
                  ↓
              將結果放入 Redis，設定有效期限
                  ↓
              回傳 JSON 給 React
```

瀏覽器只呼叫 API，不需要安裝 Redis 套件，也不持有 Redis 帳密。Python 後端才連 Redis；驗證身分、檢查權限與快取策略也在後端執行。

Redis 是另一個服務，不是 Python 裡的一個普通變數。正式環境中的多個 Python 程序或多台 API，可以透過網路讀取同一份 Redis 快取。

```txt
React 使用者 A → Python API 1 ──┐
                               ├── 共用 Redis → 未命中時查 Database
React 使用者 B → Python API 2 ──┘
```

若只在 Python 的 `dict` 存資料，API 1 和 API 2 各有自己的記憶體，更新不會自動同步。共用 Redis 能讓兩者讀取同一套快取，但仍需要處理更新與並發競爭。

## 3. 先認識五個詞與四個指令

| 名詞 | 白話意思 | 本題範例 |
| --- | --- | --- |
| Key | 查找快取的名稱 | `demo:product:v1:1` |
| Value | 保存的內容 | 商品介紹的 JSON 字串 |
| TTL | 這份快取多久後過期 | 30 秒 |
| Cache Hit | 找到可用的快取 | 直接回傳商品介紹 |
| Cache Miss | 沒找到可用快取 | 查資料庫，填回快取 |

在 Redis CLI 中，基本操作如下：

```txt
SET demo:product:v1:1 '{"id":1,"name":"機械鍵盤"}' EX 30
GET demo:product:v1:1
TTL demo:product:v1:1
DEL demo:product:v1:1
```

`SET ... EX 30` 一次完成儲存與三十秒過期設定；`GET` 讀取；`TTL` 查看剩餘秒數；`DEL` 刪除。過期後，下次讀取會未命中，不會自動查資料庫或自動刷新，這要由 Python 實作。[Redis SET 官方文件](https://redis.io/docs/latest/commands/set/)

TTL 是快取存活時間，不是每三十秒輪詢一次，也不是保證商品資料永遠只落後三十秒：若資料來源已舊、讀寫競爭或其他快取層保留舊資料，還要一起考慮。

## 4. Cache Aside：由 Python 決定何時查與何時存

這種「先查快取，未命中再查資料庫並填回」的流程稱為 **Cache Aside**。Redis 不會自動攔截你的 SQL；是應用程式自己寫出這些步驟。[官方 Cache Aside 說明](https://redis.io/docs/latest/develop/use-cases/cache-aside/)

```txt
第 1 個請求：Redis 沒有 → 查資料庫 → 存 Redis → 回傳
第 2 個請求：Redis 有   → 回傳
第 3 個請求：Redis 有   → 回傳
有效期限過後：Redis 沒有 → 再查資料庫 → 再存 Redis
```

假設每秒五千個請求都需要一次商品查詢，且快取命中率為 95%：

```txt
Python API：仍接收 5,000 個請求／秒
Redis：約 5,000 次 GET／秒，另有未命中後的 SET
命中：4,750 個請求不用查資料庫
未命中：250 個請求需要查資料庫
```

所以快取主要減少這部分資料庫讀取工作；前端請求量、API 驗證與 JSON 回傳的工作仍存在。不能把「命中的 4,750 次」誤認成 Redis 總共只處理 4,750 次。

## 5. Python 範例：FastAPI + redis-py

以下提供一個可獨立練習的讀取 API。為了聚焦快取流程，`read_product_from_db()` 用固定資料與延遲模擬資料庫；它不是正式資料庫，也不支援跨程序寫入。正式專案把該函式換成資料庫查詢即可。

將以下內容另存成練習目錄中的 `main.py`。本範例使用非同步 Redis 客戶端，並在 FastAPI 的 lifespan 建立與關閉客戶端，重用其連線池，而不是每個請求都建立新客戶端。[redis-py 非同步用法](https://redis.io/docs/latest/develop/clients/redis-py/async/)、[FastAPI lifespan](https://fastapi.tiangolo.com/advanced/events/)

```python
import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager

import redis.asyncio as redis
from redis.exceptions import RedisError
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)
CACHE_TTL_SECONDS = 30


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.cache = redis.from_url(
        os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        decode_responses=True,
        socket_connect_timeout=0.2,
        socket_timeout=0.2,
    )
    try:
        yield
    finally:
        await app.state.cache.aclose()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    expose_headers=["X-Cache"],
)


async def read_product_from_db(product_id: int):
    # 教學替身：正式版本改成真正的非同步資料庫查詢。
    await asyncio.sleep(0.1)
    if product_id != 1:
        return None
    return {"id": 1, "name": "機械鍵盤", "description": "有線鍵盤，繁體中文鍵帽"}


@app.get("/api/products/{product_id}")
async def get_product(product_id: int, request: Request, response: Response):
    if product_id < 1:
        raise HTTPException(status_code=400, detail="商品編號必須大於 0")

    # 關閉 HTTP 快取，讓練習時每次請求都能觀察後端 Redis 的行為。
    response.headers["Cache-Control"] = "no-store"
    cache = request.app.state.cache
    key = f"demo:product:v1:{product_id}"
    cache_status = "MISS"
    can_write_cache = True

    try:
        cached = await cache.get(key)
    except RedisError:
        logger.warning("Redis read failed; using database")
        cached = None
        cache_status = "BYPASS"
        can_write_cache = False

    if cached is not None:
        try:
            product = json.loads(cached)
        except json.JSONDecodeError:
            logger.warning("Invalid cached JSON; rebuilding")
        else:
            response.headers["X-Cache"] = "HIT"
            return product

    product = await read_product_from_db(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="找不到商品")

    if can_write_cache:
        try:
            await cache.set(
                key,
                json.dumps(product, ensure_ascii=False),
                ex=CACHE_TTL_SECONDS,
            )
        except RedisError:
            logger.warning("Redis write failed; returning database result")
            cache_status = "BYPASS"

    response.headers["X-Cache"] = cache_status
    return product
```

`X-Cache` 是本範例自訂的教學標頭：`HIT` 表示用了 Redis 結果，`MISS` 表示需查資料庫，`BYPASS` 表示 Redis 操作失敗而使用資料庫結果。回傳資料的 JSON 格式一致，React 不必因來源不同寫兩套 UI。

範例允許 Redis 故障時回源資料庫，適合展示「快取是可重建副本」。**大量流量下不能無限制回源**，否則 Redis 故障可能連帶壓垮資料庫；正式版本需要容量限制、逾時預算、重試上限與降級策略。範例也沒有實作熱門 key 的並發重建協調。

### 本機練習方式

以下是可自行執行的教學指令，不需要修改這個筆記網站的 Python 環境。假設已安裝 Python 3.10+；若使用 Docker 啟動 Redis，需先安裝並啟動 Docker。

```bash
mkdir redis-cache-demo
cd redis-cache-demo
python3 -m venv .venv
source .venv/bin/activate
python -m pip install fastapi 'uvicorn[standard]' redis
```

把前面的程式存為 `main.py`，若沒有本機 Redis，可啟動一個只供本機連線的練習容器：

```bash
docker run --rm --name redis-cache-demo -p 127.0.0.1:6379:6379 redis:7-alpine
```

這個終端保持執行 Redis；另一個終端進入相同練習目錄並啟用虛擬環境，再執行：

```bash
uvicorn main:app --reload --port 8000
```

接著在第三個終端依序測試：

```bash
curl -i http://localhost:8000/api/products/1
curl -i http://localhost:8000/api/products/1
```

在 key 原本不存在、沒有其他流量且依序執行時，第一次應看到 `x-cache: MISS`，三十秒內第二次是 `HIT`。過期後再請求是 `MISS`；若連不到 Redis，範例會回傳 `BYPASS`。同時發出的首次請求可能全部未命中，這正是後面要處理的並發問題。

可用以下指令檢查或刪除練習 key，再觀察下一次請求：

```bash
docker exec redis-cache-demo redis-cli TTL demo:product:v1:1
docker exec redis-cache-demo redis-cli DEL demo:product:v1:1
```

## 6. React 範例：照常呼叫 Python API

將以下元件放進既有 React 開發專案。範例假設前端在 `http://localhost:5173`；若實際 port 不同，要同步調整 Python 的 CORS 允許來源。正式部署可用相同網域下的 `/api` 代理到 Python，避免把本機 URL 寫入正式網站。

```jsx
import { useEffect, useState } from "react";

export default function ProductCard() {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState({ loading: true, product: null, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, product: null, error: "" });

    async function load() {
      try {
        const response = await fetch("http://localhost:8000/api/products/1", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error(`讀取失敗（${response.status}）`);
        const product = await response.json();
        if (!controller.signal.aborted) {
          setState({ loading: false, product, error: "" });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({ loading: false, product: null, error: error.message });
        }
      }
    }

    load();
    return () => controller.abort();
  }, [reloadCount]);

  return (
    <section>
      <button disabled={state.loading} onClick={() => setReloadCount(n => n + 1)}>
        重新讀取
      </button>
      {state.loading && <p>載入中…</p>}
      {state.error && <p role="alert">{state.error}</p>}
      {state.product && (
        <article>
          <h2>{state.product.name}</h2>
          <p>{state.product.description}</p>
        </article>
      )}
    </section>
  );
}
```

清理 Effect 時取消請求，避免舊請求結果在元件離開或重新讀取後繼續更新畫面。開發環境 Strict Mode 可能多執行一輪 Effect，因此觀察確定的首次 MISS／第二次 HIT，先用前面的序列 `curl`。[React Effect 資料讀取與清理](https://react.dev/learn/synchronizing-with-effects#fetching-data)

打開瀏覽器 Network 查看 `X-Cache` 就能觀察命中情況。`fetch` 的 `cache: "no-store"` 控制的是瀏覽器 HTTP 快取，**不會跳過 Python 裡的 Redis**；按「重新讀取」仍可能拿到 Redis 中尚未過期的資料。

## 7. 資料更新後，快取怎麼辦？

假設商品介紹改了，但 Redis 還存著舊介紹。基礎做法是：**先成功提交資料庫更新，再刪除對應快取，讓下一次讀取重建。**

```txt
React 送出修改
    ↓
Python 驗證身分與修改權限
    ↓
資料庫交易成功提交
    ↓
DEL demo:product:v1:1
    ↓
回傳資料庫確認的新資料
    ↓
React 更新畫面；若有前端查詢快取，也要更新或使它失效
```

這個流程是設計說明，前面的可執行範例只提供 GET，沒有提供未驗證身分的修改 API。

刪 Redis key 不會自動更新 React 畫面，也不會清除每個人的前端查詢快取。前端可使用修改 API 的回傳資料更新本地狀態，再安排重新讀取。

### 先更新資料庫再刪快取，仍不是強一致性保證

可能發生這個交錯順序：

```txt
讀取 A：快取未命中，查到資料庫舊值，但還沒寫入 Redis
修改 B：提交新值，刪除 Redis key
讀取 A：把稍早查到的舊值寫回 Redis
```

因此簡單 Cache Aside 仍可能短暫讀到舊資料。刪除快取也可能因 Redis 故障而失敗，需要可觀測的重試或可靠失效通知；TTL 是補救的一部分。若需求必須立即讀到新值，就要另設一致性方案，例如關鍵讀取查權威來源，或使用有明確競爭處理的版本化策略，而不是只縮短 TTL。

## 8. Cache Key 要包含會影響結果的條件

```txt
公開商品介紹：demo:product:v1:1:zh-TW
分類清單：   demo:products:v1:category=keyboard:page=1:sort=name
個人清單：   demo:watchlist:v1:tenant=acme:user=42
```

語言、頁碼、排序與租戶可能讓結果不同，要避免錯用同一個 key。`v1` 可用來區分回應結構版本，改結構時避免解析到舊格式。

個人資料的 user／tenant 必須來自後端已驗證的身分；**即使命中快取，也必須檢查權限**。不能只靠前端傳來的 user ID 決定讀誰的快取。

## 9. 高流量下常見的快取問題

| 問題 | 具體情境 | 處理方向 |
| --- | --- | --- |
| 熱門 key 同時未命中（stampede，常稱擊穿） | 商品剛過期，一千個請求一起查資料庫 | 合併同 key 的重建工作；多程序需跨程序協調，鎖的期限、釋放與等待也要設計 |
| 大量 key 同時過期（常稱雪崩） | 一批商品都在整點到期 | TTL 加隨機差值，分散重建時間；它不能單獨解決一個熱門 key 的並發 |
| 反覆查不存在資料（常稱穿透） | 不斷請求不存在的商品 | 輸入驗證、限流；需要時短暫快取「不存在」，新增資料時也要失效 |
| Redis 故障 | 全部請求突然回源 | 限制資料庫並發、設定逾時與降級；不能假設 DB 承受得住原始流量 |
| 記憶體滿 | 太多或太大的快取內容 | 設容量預算與淘汰策略，控制 key 數量與 value 大小 |
| 熱門 key／網路成為瓶頸 | Redis 仍承受大量 GET 或大 JSON 傳輸 | 量測後評估應用內短暫快取、公開資料的 CDN 快取或資料拆分 |

TTL 是因時間過期；eviction（淘汰）是容量壓力下依策略移除資料，兩者不同。Redis 的記憶體上限與淘汰策略需要依資料角色設定；可重建快取和不能任意丟棄的資料不應草率混用同一套策略。[Redis 記憶體與淘汰官方文件](https://redis.io/docs/latest/develop/reference/eviction/)

至少量測命中率、API p95 延遲、Redis 操作延遲／錯誤、DB 查詢量、Redis 記憶體與淘汰數。快取命中率高仍可能回傳過期資料，所以還要檢查更新後多久能被讀到。

## 10. React 快取、Redis Cache、Pub/Sub 是不同層次

| 機制 | 放在哪裡 | 做什麼 | 不會自動做到什麼 |
| --- | --- | --- | --- |
| React state／前端查詢快取 | 使用者的頁面 | 重用已取得的資料，減少重複 API 請求 | 不會和其他人的頁面共用，也不會自動刪 Redis key |
| 瀏覽器 HTTP／CDN 快取 | 瀏覽器或邊緣節點 | 依 HTTP 規則重用回應 | 不等於 Python 的 Redis 快取 |
| Redis Cache | 後端共用服務 | 重用資料庫查詢或計算結果 | 不會自動推播到 React |
| Redis Pub/Sub | 後端訊息通道 | 把新訊息送給已訂閱的服務 | 不會自動保存最新 snapshot 或補送離線期間的訊息 |

兩者可以合作：Redis Cache 保存可讀取的最新資料，Pub/Sub 通知 Gateway 有更新，再由 WebSocket 傳給 React。但保存與通知的順序、版本及失敗恢復仍需設計，不能把 `SET` 和 `PUBLISH` 當成自動保證端到端一致性的操作。

行情分送的完整入門例子見 [Day 1 的 Redis Pub/Sub 筆記](/docs/career-blueprint/week-01-day-01)，訊息傳遞限制可查 [Redis Pub/Sub 官方文件](https://redis.io/docs/latest/develop/pubsub/)。本篇先掌握「React 呼叫 Python；Python 查快取，沒命中再查資料庫」，再進一步學推送與分散式一致性。

## 11. 自我驗收

- [ ] 我能解釋 Cache 是概念、Redis 是工具。
- [ ] 我能畫出 React → Python → Redis／Database 的讀取流程。
- [ ] 我能說明 HIT、MISS、TTL 與 key 的用途。
- [ ] 我知道五千次 API 請求不會因為加入 Redis 就消失。
- [ ] 我知道修改資料後，要同時考慮後端與前端快取失效。
- [ ] 我能說出 Redis 故障、熱門 key 過期時，資料庫可能承受什麼壓力。
- [ ] 我能區分快取讀取與 Pub/Sub 推送。
