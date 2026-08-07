# Puppeteer

根據實際用過的兩支腳本整理：

- `keepAccountByDuration.js`
- `createPost.js`

這裡記錄的是在 Instagram 自動化裡實際用到的 Puppeteer 技術，不特別寫成面試回答，比較偏實作筆記。

## 使用場景

這兩支腳本主要在做：

- 連到既有瀏覽器 profile
- 進 Instagram 做頁面巡覽
- 開啟貼文 modal
- 按讚 / 發文
- 上傳圖片
- 輸入 caption
- 做等待、重試、重連與收尾

## 1. 使用 `puppeteer-core` 連外部瀏覽器

不是用 `puppeteer.launch()` 開新的 Chromium，而是透過 `puppeteer.connect()` 接 MultiLogin 提供的 websocket endpoint。

```js
return puppeteer.connect({
  browserWSEndpoint: freshWs,
  defaultViewport: null
});
```

這種模式適合：

- 要沿用既有登入狀態
- 要接指紋瀏覽器
- 瀏覽器生命週期由外部系統管理

相關觀察：

- 這裡實際用的是 browser session 連線，不是本機啟一個全新的 browser
- ws endpoint 斷掉時要準備重連

## 2. page 初始化與 timeout 設定

拿到 page 之後，會先設定預設 timeout：

```js
page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT_MS);
page.setDefaultTimeout(NAVIGATION_TIMEOUT_MS);
```

導航時用：

```js
await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: NAVIGATION_TIMEOUT_MS
});
```

這邊的重點：

- `waitUntil` 沒用到最重的 `networkidle`，而是先以 `domcontentloaded` 為主
- timeout 全域設定好，避免流程卡死
- 導航失敗時另外包 retry

## 3. 常用 selector 操作

基本操作還是以 selector 為主：

```js
const fileInput = await page.$('input[type="file"]');
await page.waitForSelector('div[role="dialog"]', { visible: true, timeout: 8000 });
```

常見用途：

- 找 upload input
- 確認 dialog 是否開啟
- 等待元素出現 / 消失

在這些腳本裡，selector 大多拿來做：

- modal 判斷
- Like / Unlike / Close 按鈕判斷
- 發文輸入框查找

## 4. `page.evaluate()` 處理 DOM 與頁面邏輯

大量邏輯不是只靠 selector，而是進 browser context 做。

例如抓目前畫面上的貼文連結：

```js
const hrefs = await page.evaluate(() => {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  return anchors
    .map((a) => a.getAttribute('href') || '')
    .filter((href) => href.includes('/p/') || href.includes('/reel/'));
});
```

還有這些用途：

- 在頁面內比對 URL 後點指定貼文
- 從 modal 讀 permalink 與 caption
- 取得 `scrollY`
- 呼叫 `window.scrollBy()`

這類操作適合用在：

- 需要一次掃整批 DOM
- 要在頁面裡跑條件判斷
- 需要拿到 selector 不容易直接描述的資料

## 5. `evaluateHandle()` 找文字按鈕

`createPost.js` 裡有用 `page.evaluateHandle()` 依文字找按鈕。

```js
const handle = await page.evaluateHandle((keywords, scope) => {
  const roots = scope
    ? Array.from(document.querySelectorAll(scope))
    : [document];

  for (const root of roots) {
    const nodes = Array.from(root.querySelectorAll('button, [role="button"], a'));
    const found = nodes.find((el) => {
      const text = (el.innerText || el.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      return keywords.some((keyword) => text === keyword || text.includes(keyword));
    });
    if (found) return found;
  }

  return null;
}, targets, scopeSelector);
```

這種做法比直接寫死 selector 更耐用，原因是：

- 不同語系按鈕文字不同
- button 結構可能變
- dialog 內容常常動態生成

實際上有處理：

- `create`
- `next`
- `share`
- 中文 / 英文版本按鈕

## 6. click / keyboard / type 這類互動操作

這兩支腳本不只抓資料，也有做互動操作。

```js
await createBtn.click();
await nextBtn.click();
await page.keyboard.press('Escape');
await page.keyboard.press('Backspace');
await page.keyboard.type(POST_TEXT, { delay: 35 });
```

還有清空文字框：

```js
await page.keyboard.down(modKey);
await page.keyboard.press('KeyA');
await page.keyboard.up(modKey);
```

實際用途：

- 開啟貼文
- 關閉 modal
- 清空 caption 欄位
- 輸入新的貼文內容

補充：

- `type(..., { delay })` 有刻意加一點 delay，互動節奏比較自然
- 清空欄位時有考慮 macOS / 非 macOS 的 modifier key 差異

## 7. 檔案上傳

`createPost.js` 有兩種上傳方式。

### 1. `waitForFileChooser()`

```js
const [chooser] = await Promise.all([
  page.waitForFileChooser({ timeout: 5000 }),
  selectBtn.click()
]);
await chooser.accept([uploadImagePath]);
```

### 2. 直接對 `input[type="file"]` 上傳

```js
await fileInput.uploadFile(uploadImagePath);
```

這裡的設計是：

- 先走比較貼近實際 UI 的 file chooser
- 如果 chooser 沒成功，再 fallback 到 file input

另外，圖片來源不一定是本地檔案，也可能先從遠端 URL 下載到 tmp 檔後再上傳。

## 8. `waitForFunction()` 做條件式等待

有些條件不是看某個 selector，而是看整個頁面狀態。

例如確認發文成功訊息：

```js
await page.waitForFunction(
  (targets) => {
    const text = (document.body?.innerText || '').replace(/\s+/g, ' ').toLowerCase();
    return targets.some((t) => text.includes(t));
  },
  { timeout: timeoutMs },
  sharedTexts
);
```

例如等待頁面載入到出現貼文卡片：

```js
await page.waitForFunction(() => {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  return anchors.some((a) => {
    const href = a.getAttribute('href') || '';
    return href.includes('/p/') || href.includes('/reel/');
  });
});
```

適用情境：

- SPA 頁面
- 成功提示沒有穩定 selector
- 需要等業務條件成立，不只是元素出現

## 9. 滾動與分批處理頁面內容

`keepAccountByDuration.js` 會反覆往下滑並處理當前畫面內容：

```js
await page.evaluate(() => window.scrollBy(0, Math.floor(window.innerHeight * 0.9)));
```

搭配的流程：

- 先抓畫面上的貼文連結
- 做去重
- 隨機抽幾篇
- 點進 modal
- 停留
- 按讚
- 關閉
- 繼續往下滑

這裡比較像長流程巡覽型腳本，不是單一步驟。

## 10. 多 selector / 多語系兼容

像按讚按鈕不是只找一種 selector：

```js
const likeButton =
  (await page.$('svg[aria-label="Like"]')) ||
  (await page.$('button[aria-label="Like"]')) ||
  (await page.$('svg[aria-label="讚"]')) ||
  (await page.$('button[aria-label="讚"]'));
```

關閉按鈕也做了類似處理。

這樣做的原因：

- Instagram 可能有不同語系
- 同一功能可能落在不同標籤
- UI 結構有時會調整

這種寫法雖然土法煉鋼，但在實務自動化常常很有效。

## 11. modal 操作

在 `keepAccountByDuration.js` 裡，貼文不是直接跳頁，而是先點卡片、等 dialog 出現，再操作 modal 內元素。

相關步驟：

- 點擊指定貼文卡片
- `waitForSelector('div[role="dialog"]')`
- 在 modal 中找 permalink / caption / like button
- 關閉 modal 或送 `Escape`

這類流程要注意：

- modal 和主頁元素容易混在一起
- selector scope 最好限制在 dialog
- 關閉失敗時要有鍵盤 fallback

## 12. 穩定化處理

這兩支腳本除了流程本身，還有一堆穩定化設計。

### 1. 連線恢復

如果已有 ws endpoint 連不上：

```js
if (existingWs) {
  try {
    return await puppeteer.connect({
      browserWSEndpoint: existingWs,
      defaultViewport: null
    });
  } catch (err) {
    const msg = err?.message || '';
    if (!msg.includes('ECONNREFUSED')) throw err;
  }
}
```

之後改成重新啟動 MultiLogin profile，再 connect。

### 2. navigation retry

`gotoWithRetry()` 會在導航失敗時重試，不是直接整支腳本中斷。

### 3. proxy / socks error recovery

`keepAccountByDuration.js` 另外處理：

- `ERR_SOCKS_CONNECTION_FAILED`
- `ERR_PROXY_CONNECTION_FAILED`

碰到這類錯誤時會等一段時間後重連 browser session。

### 4. cleanup

流程結束時會做：

- `browser.close()`
- 失敗時 `browser.disconnect()`
- stop Multilogin profile
- 清理暫存圖片檔

## 13. 這兩支腳本裡可歸納的 Puppeteer 重點

- `puppeteer-core` + `connect()` 連外部 browser
- `goto()`、default timeout、navigation timeout
- `page.$()`、`waitForSelector()`
- `page.evaluate()`、`page.evaluateHandle()`
- `click()`、`keyboard.press()`、`keyboard.type()`
- `waitForFileChooser()`、`uploadFile()`
- `waitForFunction()`
- modal 處理
- scroll + 去重 + 分批巡覽
- retry / reconnect / cleanup

## 補充

從這兩支腳本來看，Puppeteer 在這裡扮演的角色不是單純「爬頁面資料」，而是：

- 瀏覽器流程控制
- UI 自動化
- 動態 DOM 判斷
- 與外部 browser profile 系統整合

比較接近「可長時間執行的自動化腳本」，不是單次 demo。
