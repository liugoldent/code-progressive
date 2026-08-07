# MultiLogin Server

這份筆記整理的是 `/Users/kt/Desktop/work/wow/multilogin/schedule` 這組排程服務的整體流程。

核心目的不是單一腳本，而是一個小型排程系統，負責：

- 從遠端 API 拉今天的 schedule
- 把 schedule 正規化後寫進本地 JSON
- 按時間執行對應的 Node 腳本
- 提供 HTTP API 讓外部手動觸發排程
- 提供一些 MultiLogin profile 管理 API

## 入口與怎麼啟動

這組服務的主要入口是：

- `schedule/apiServer.js`

在 `package.json` 裡已經有 script：

```json
"scripts": {
  "api:start": "node schedule/apiServer.js"
}
```

所以啟動方式就是在 multilogin 專案根目錄執行：

```bash
npm run api:start
```

本質上等同於：

```bash
node schedule/apiServer.js
```

## 啟動後的整體順序

`apiServer.js` 啟動後，會做這幾件事：

1. 建立 HTTP server，監聽 `API_HOST` 和 `API_PORT`
2. 先啟動 schedule sync service
3. 啟動時先倒數 10 秒
4. 去遠端抓 schedule
5. 把資料寫進本地 `scheduleRaw.json` 和 `schedule.json`
6. sync 完成後，再倒數 10 秒
7. 啟動 runner，開始每分鐘輪詢一次 `schedule.json`

也就是說，這組系統不是一啟動就直接跑 job，而是：

- 先把今天要跑的資料同步下來
- 再開始進入排程執行階段

## 三個核心檔案各自負責什麼

### 1. `apiServer.js`

它是整個服務的對外入口，負責：

- 開 HTTP API
- 驗證 API token
- 接手動排程觸發請求
- 接 profile 管理請求
- 啟動 schedule 同步與 runner

它的啟動主流程在這段：

```js
server.listen(PORT, HOST, () => {
  console.log(`[api] listening on http://${HOST}:${PORT}`);
  startScheduleSyncService()
    .then(() => countdown('runner start', 10000))
    .then(() => startPolling())
    .catch((err) => {
      console.error(`[api] startup sequence failed: ${err.message}`);
    });
});
```

這段很關鍵，代表整體 server lifecycle 是：

- server 先 listen
- schedule 先同步
- runner 再啟動

### 2. `scheduleSync.js`

它專門負責把遠端 schedule API 的資料抓回來並落地成檔案。

它做的事情包含：

- 用 `axios.get()` 呼叫遠端 schedule API
- 把原始 response 寫進 `scheduleRaw.json`
- 從 `response.data[].schedule.jobs` 拆出 jobs
- 統一補齊欄位，例如 `id`、`executeAt`、`executed`、`executedAt`
- 依照 `executeAt` 排序
- 寫進 `schedule.json`

也就是：

- `scheduleRaw.json` 是保留原始 API 回傳
- `schedule.json` 是 runner 真正會讀的標準化排程資料

### 3. `scheduleRunner.js`

它是實際執行 job 的地方。

它會：

- 讀取 `schedule.json`
- 找出還沒執行的 job
- 判斷哪些 job 到時間了
- 用 `child_process.spawn()` 執行對應 Node 腳本
- 執行成功後把該 job 標記成 `executed=true`
- 把 `executedAt` 寫回 `schedule.json`

這部分是整個排程系統真正的執行引擎。

## schedule 資料怎麼流

整體資料流可以理解成：

```text
遠端 schedule API
  -> scheduleSync.js 抓資料
  -> 寫入 scheduleRaw.json
  -> normalize jobs
  -> 寫入 schedule.json
  -> scheduleRunner.js 讀 schedule.json
  -> 到時間後執行對應腳本
  -> 更新 executed / executedAt
```

## `scheduleRaw.json` 跟 `schedule.json` 的差別

### `scheduleRaw.json`

它保留遠端 API 原始資料，格式大概像：

- `data[]`
- 每個 item 裡有 `schedule`
- `schedule.jobs` 才是真正的排程工作

例如一個 job 會有：

- `id`
- `executeAt`
- `profileId`
- `file`
- `postImg`
- `postMsg`
- `keepAccountTags`
- `description`
- `executed`
- `executedAt`

### `schedule.json`

這是 runner 用的平面化 job 陣列，例如：

```json
[
  {
    "id": "job2",
    "executeAt": 1773756327000,
    "executed": true,
    "profileId": "59c288d8-c6d1-4edc-b924-747ded81dc99",
    "file": "/Instagram/keepAccountByDuration.js",
    "executedDuration": 1,
    "keepAccountTags": ["f1"],
    "executedAt": 1773758531038
  }
]
```

也就是 runner 不直接吃複雜 API response，而是吃整理好的 job list。

## 啟動後 schedule sync 怎麼跑

`startScheduleSyncService()` 做了兩種同步：

### 1. 啟動後同步一次

系統啟動後不會立刻呼叫遠端 API，而是先倒數 `STARTUP_SYNC_DELAY_MS = 10000`，也就是 10 秒，之後同步一次。

### 2. 每天固定時間同步

每天固定在：

- `00:30`

再同步一次。

程式裡是用：

- `setTimeout()` 排到下一次 00:30
- 之後再用 `setInterval(..., DAY_MS)` 每 24 小時跑一次

所以它是一個：

- 啟動先同步
- 之後每日定時同步

的設計。

## runner 怎麼執行 job

`scheduleRunner.js` 有兩種模式。

### 1. 輪詢模式 `startPolling()`

這是 server 啟動後預設走的模式。

它會：

- 先執行一次 `executeDueJobs()`
- 再每 `POLL_MS = 60000` 毫秒，也就是每 1 分鐘掃一次

`executeDueJobs()` 的邏輯是：

- 讀 `schedule.json`
- 篩出 `executed === false && executedAt === null` 的 pending jobs
- 找出 `executeAt <= now` 的 due jobs
- 逐一執行

適合背景服務常駐執行。

### 2. 規劃式模式 `executePlannedJobsFromNow()`

這是 API 手動觸發 `/schedule/run` 時會用的模式。

它不是只跑「現在到期」的 job，而是：

- 把目前所有 pending jobs 都抓出來
- 依 `executeAt` 排序
- 若時間還沒到，就 `await wait(waitMs)`
- 時間到了再執行

可以理解成：

- `executeDueJobs()` 比較像定期掃描
- `executePlannedJobsFromNow()` 比較像一次把從現在開始的排程全部接手跑完

## job 真正執行時做了什麼

每個 job 會從 `file` 或 `executedFile` 取出要跑的腳本，例如：

- `/Instagram/login.js`
- `/Instagram/keepAccountByDuration.js`
- `/Instagram/likePostWithTag.js`
- `/Instagram/createPost.js`

runner 會把路徑轉成專案內絕對路徑，然後用：

```js
spawn(process.execPath, [scriptPath], {
  cwd: PROJECT_ROOT,
  env: {
    ...process.env,
    ...envOverrides
  }
});
```

也就是用目前 Node 執行環境去跑子腳本。

## job 的環境變數是怎麼帶進去的

`buildJobEnv(job)` 會把 job 欄位轉成腳本可用的 env。

例如：

- `profileId` -> `MLX_PROFILE_ID`
- `postImg` -> `CREATE_POST_IMAGE_PATH`、`IMAGE_PATH`
- `postMsg` -> `CREATE_POST_TEXT`、`POST_TEXT`
- `keepAccountTags` -> `KEEP_ACCOUNT_TAGS`
- `executedDuration` / `executedDutation` -> `KEEP_ACCOUNT_RUN_DURATION_MINUTES`

這個設計很實用，因為排程系統本身不需要知道 Instagram 腳本的細節，只要把 job 參數轉成 env 即可。

也就是：

- schedule 負責描述任務
- runner 負責執行任務
- 子腳本自己從 env 讀設定

## job 執行成功後怎麼收尾

如果 job 裡所有 `file` 都跑成功：

- 將該 job 標記為 `executed = true`
- 將 `executedAt = Date.now()`
- 寫回 `schedule.json`

如果失敗：

- 記錄 error
- 該 job 不會被標記 executed

所以失敗的 job 之後理論上還是可能再被掃到，除非外部另有處理。

## 為什麼有 `isRunning`

`scheduleRunner.js` 裡有 `isRunning` 旗標，目的很明確：

- 避免輪詢重疊執行
- 避免 API 手動觸發和背景 runner 同時搶同一份 schedule

如果正在跑，就直接回：

- `skipped: true`
- `reason: 'runner-busy'`

這是避免同一批 job 重複執行的基本保護。

## API Server 提供哪些能力

### 1. 健康檢查

```http
GET /health
```

回傳：

```json
{ "ok": true, "at": "..." }
```

### 2. 手動觸發 schedule

```http
POST /schedule/run
```

它不直接同步 schedule，而是把一個 task 放進 queue，然後執行：

- `executePlannedJobsFromNow()`

回傳會給：

- `taskId`
- `status`
- `statusUrl`

之後可以查：

```http
GET /schedule/tasks/:taskId
```

看目前是：

- `queued`
- `running`
- `completed`
- `failed`

### 3. MultiLogin profile 管理 API

還有幾個跟排程周邊有關的 API：

- `POST /multilogin/profile/create`
- `POST /multilogin/profile/create-by-clone`
- `POST /multilogin/profile/list`
- `POST /multilogin/profile/edit-name`

這些是把排程系統和 profile 管理放在同一個 server 裡。

## queue 的作用

`apiServer.js` 裡用一個 Promise queue 來串 task：

```js
let queue = Promise.resolve();
```

目的就是讓多次 `/schedule/run` 不會並行亂跑，而是：

- 一個 task 跑完
- 下一個 task 再接著跑

這跟 runner 裡的 `isRunning` 一起構成基本的併發保護。

## 我會怎麼描述這套流程

如果要簡單描述，我會說：

> 這組 MultiLogin server 的入口是 `schedule/apiServer.js`。服務啟動後會先開 HTTP API，然後先去遠端 schedule API 同步當天的排程資料，把原始資料寫到 `scheduleRaw.json`，再把 jobs 正規化後寫到 `schedule.json`。接著 runner 會每分鐘掃一次 `schedule.json`，找出到時間但還沒執行的 job，透過 `child_process.spawn()` 去執行對應的 Instagram 腳本，並把像 `profileId`、`postImg`、`postMsg`、`keepAccountTags` 這些欄位轉成環境變數傳進去。腳本成功後就把 job 標記為 `executed=true` 並記錄 `executedAt`。除此之外，API 也支援手動觸發排程，以及一些 MultiLogin profile 的建立、複製與查詢功能。

## 用一句話總結架構

這套系統本質上是：

> `API Server + Schedule Sync + Job Runner + MultiLogin Script Executor`

也就是一個會先同步資料、再定時執行腳本、並且可由 API 手動介入的輕量排程服務。
