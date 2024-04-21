---
description: 介紹useCookie
tags:
  - nuxt
  - composable
keywords:
  [
    nuxt,
    js,
    javascript,
    composable,
    composable api,
    useCookie,
    seo,
    nuxt useCookie,
  ]
---

# useCookie

## 概念

- 這個函數可以幫助您讀取、設置和刪除 cookie，並且方便地在組件中使用。

## 注意事項

- 僅在`setup`或`Lifecycle Hooks`期間有效
- 會自動將`cookie`序列化與反序列化為 JSON

## 範例

### composable part

```js
const cookie_uuid = useCookie("uuid", { maxAge: expiresTime });
const cookie_token = useCookie("token", { maxAge: expiresTime });
const cookie_id = useCookie("id", { maxAge: expiresTime });
const user = useCookie("userInfo", {
  default: () => ({ score: -1 }),
  watch: false,
});
```

### vue part

```html
<template>
  <div>
    <h1>Counter: {{ counter || '-' }}</h1>
    <button @click="counter = null">reset</button>
    <button @click="counter--">-</button>
    <button @click="counter++">+</button>
  </div>
</template>

<script setup>
  const counter = useCookie("counter");
  counter.value = counter.value || Math.round(Math.random() * 1000);
</script>
```

## 選項參數

### maxAge

- 選項用於設置 cookie 的過期時間，以秒為單位。例如，maxAge: 3600 表示 cookie 將在創建後的 3600 秒（即一小時）後過期。通過設置適當的過期時間，可以控制 cookie 的生命週期，從而確保用戶數據的安全性和隱私。

### expires

- 用於設置 cookie 的到期日期。您可以將其設置為一個日期對象，表示 cookie 的到期日期。與 maxAge 不同，expire 選項接受一個日期對象而不是秒數。這使得您可以更精確地指定 cookie 的到期日期和時間。

### httpOnly

- 如果設置了 httpOnly 選項，則該 cookie 將無法通過客戶端腳本訪問。這意味著該 cookie 只能通過 HTTP 或 HTTPS 協議傳輸，並且無法通過 JavaScript 腳本進行訪問。這有助於防止跨站腳本攻擊（XSS 攻擊），因為即使攻擊者成功注入惡意腳本，也無法訪問包含 httpOnly 標記的 cookie，從而保護了用戶的敏感信息

### secure

- 如果設定成 true，該 cookie 只會在使用 HTTPS 協議時進行傳輸。這意味著它只能在安全的加密連接中被傳輸，從而保證了數據在傳輸過程中的安全性。這對於保護 cookie 中包含的敏感信息是非常重要的，因為透過 HTTPS 傳輸可以防止數據被竊取或篡改

### domain

- 預設情況下，不會設定任何`domain`，大部分的使用者只會希望將`cookie`設置於現在的 domain
- 通常情況下，`cookie` 只能在設置它們的網站的域名下使用。但是，您可以使用 `domain` 選項來指定 `cookie` 的域名，使其可以在指定的域名及其子域名下使用。這允許您在多個相關的網站之間共享 cookie，或者在子域名之間共享 cookie，從而提供了更大的靈活性。

### path

- 預設情況下，該路徑被設定為預設路徑
- 默認情況下，cookie 只能在設置它們的網頁路徑下使用。使用 path 選項，您可以指定 cookie 的有效路徑，從而限制 cookie 在指定路徑及其子路徑下使用。這使您可以更細粒度地控制 cookie 的範圍，使其只在特定的網頁或路徑下使用。

### sameSite

- `true`：將該`SameSite`屬性設定`Strict`為嚴格的同站點強制執行。
- `false`：不會設定該`SameSite`屬性。
- `lax`：將該`SameSite`屬性設定`Lax`為寬鬆的同站點實作。
- `none`：會將`SameSite`屬性設定`None`為明確跨站點 cookie。
- `strict`：將該`SameSite`屬性設定`Strict`為嚴格的同站點強制執行。

### encode

- 指定用於對`cookie`編碼的函數。由於 cookie 值具有有限的字元集，因此可以使用此函數將編碼為適合`cookie`值的字串
- 預設編碼器為`JSON.stringify`+`encodeURIComponent`

### decode

- 解碼 cookie 值。
- 預設解碼器是`decodeURIComponent`+destr
- 如果此函數拋出錯誤，則原始、未解碼的`cookie`值將作為`cookie`值傳回。

### default

＊設定一個 function，來 return cookie 的預設值

### readonly

- 讓 cookie 不得被改

### watch

- `true`：偵測`cookie`是否有改變
- `shallow`：只會偵測第一層的屬性
- `false`：將不會偵測`cookie`改變
