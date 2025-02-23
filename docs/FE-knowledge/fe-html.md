---
tags: 
    - HTML
    - Test
---

# [FE] HTML

## DOCTYPE有什麼作用
* 告訴瀏覽器要用哪種版本的HTML規範來渲染文件，如果不存在則會導致瀏覽器以`Quirks Mode` 呈現
* 模式
  * 標準模式（Standards Mode）
  * 混雜模式（Quirks Mode）

## HTML5 為什麼只需要寫`<!DOCTYPE HTML>`
* HTML 不基於SGML，因此不需要針對DTD進行引用
* HTML4，需要引用DTD。才能告知文件型別
```HTML
<!DOCTYPE HTML PUBLIC “-//W3C//DTD HTML 4.01//EN” “http://www.w3.org/TR/html4/strict.dtd”>
```

## 行內元素有哪些，塊級元素有哪些？
```
* 行內元素：a span img input select
* 塊級元素：div ul ol li h1 p
* 空元素：<br> <hr> <link> <meta>
```

## link vs @import
* link 除了載入CSS，還可以載入其他類檔案。@import 完全屬於CSS
* link 是在頁面載入時同時載入。@import 是在頁面載入之後，載入。
* link 可以使用JS去改變樣式。@import 無法
* link 權重高於 @import
* 屬性：link是HTML標籤。@import是CSS標籤
  * 加載順序：link是頁面加載時同時載入。@import是頁面載入完之後載入
  * 兼容性：link沒有兼容性問題。@import不兼容ie5以下
  * DOM可控性：link可以透過js去改變樣式。@import無法透過js改變樣式

## 無樣式內容閃爍
* 因為@import是文件載完之後，再載入的，所以中間會有空擋導致沒有樣式
* 解決方法：使用Link，因為link是順序載入，所以這樣等CSS載完之後再下載HTML，先佈局好就不會有FOUC問題

## 瀏覽器核心
* 渲染引擎
  * 取得網頁內容
  * 整理訊息
  * 計算網頁顯示方式
* JS引擎
  * 主要執行和解析JS動態效果

## 常見的瀏覽器核心
* Trident、Geckos、Presto、Webkit

## HTML 新增哪些元素，如何區分HTML & HTML5
* 新增
  * canvas
  * video audio
  * localStorage、SessionStorage
  * article、footer、Header、nav、section（主要也是為了讓搜尋引擎了解你的網頁架構）
  * Geolocation
  * calendar date email time url search
  * drag drop
* HTML vs HTML5
  * 主要依照DOCTYPE的宣告方式

## HTML5的檔案離線儲存怎麼使用
* 主要是使用 manifest
  * 第一次訪問，瀏覽器會根據manifest去下載相應的資源，並進行離線儲存。

## iframe
### 優點
* 能夠把網頁原封不動展現出來
* 如果有多個網頁引用iframe，那麼只需要修改iframe內容就可以達到換頁功能。  
### 缺點
* 搜尋引擎無法爬蟲讀取這種頁面
* iframe會增加server http 請求

## label
* 主要是定義表單控制元件間的關係，當使用者選擇該標籤時，瀏覽器會自動將焦點轉到和label相關的控制元件上。
* for：當點選其元件時，所連結的元件將獲得焦點。
* accesskey：幫使用者設定快捷鍵

### 請問在 HTML 中使用 `<label>` 的 for 屬性主要用途為何？
* 將 `<label>` 與特定的表單控件關聯，使點擊 `<label>` 時自動將焦點聚焦在該控件上。
* 讓使用者在點擊 `<label>` 時啟動對應的輸入控件（例如，勾選核取方塊或激活輸入框）。
* for 屬性必須與對應控件的 id 值匹配，若控件沒有設定 id，則 `<label>` 無法正確關聯。

```html
<label for="username">Username:</label>
<input type="text" id="username">
```

```html
<form>
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">

  <label for="password">Password:</label>
  <input type="password" id="password" name="password">

  <button type="submit">Submit</button>
</form>
```


## HTML5的自動完成功能
* 可以設定`form`的`autocomplete` on or off 來開啟輸入匡的自動完成功能
```html
<form autocomplete="on">
  <label for="username">使用者名稱:</label>
  <input type="text" id="username" name="username">
  <br>
  <label for="email">電子郵件:</label>
  <input type="email" id="email" name="email">
  <br>
  <button type="submit">送出</button>
</form>
```

## 如何實現瀏覽器中多個標籤頁內的通訊
* websocket
* localStorage：不過safari在無痕模式下，localStorage會丟出QuotaExceededError的異常

## websocket 如何相容低瀏覽器
* websocket.js
* Adobe flash socket

## 網頁驗證碼
* 區別使用者是計算機還是人
* 可以防止惡意破解密碼、刷票、論壇

## title vs h1、b vs strong、i vs em
* title只表示標題。h1有明確的層級標題，並且對爬蟲也有影響
* strong 加強語氣，b無意義的視覺表現
* em 強調文字。i無意義的視覺表現

## alt vs title
* alt：作為圖片的替代文字
* title：作為圖片的解釋文字

## meta
### description 網頁摘要
* `<meta name="description" content="摘要">`
  * 顯示於搜尋結果網頁標題下方
  * 應簡短扼要說明網站

### OG：open Graph Protocol

```html
<!-- facebook -->
<head>
    <meta property="og:type" content="type" />  
    <meta property="og:title" content="site_title" />
    <meta property="og:description" content="site_description" />
    <meta property="og:image" content="site_image" />
    <meta property="og:url" content="site_url" />
    <meta property="og:site_name" content="site_name" />
</head>
<!-- twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourtwitterusername">
<meta name="twitter:title" content="Your Page Title">
<meta name="twitter:description" content="Description of your page">
<meta name="twitter:image" content="URL to the image you want to display">

```

## HTML5語意標籤
優點：加強SEO、維護方便、使用友善
* `<header>`：網頁的標頭，通常放置網站標題。
* `<nav>`：網頁的選單或導覽列。
* `<main>`：網頁的主要內容。
* `<aside>`：網頁的側欄、附加內容。
* `<article>`：一篇文章內容。
* `<section>`：自訂的區塊。
* `<footer>`：網頁的頁尾。
* `<mark>`：強調一小塊內容。
* `<time>`：顯示日期時間。

## 如何修改input type=file的模樣
1. 隐藏默认的文件上传控件，然后创建自定义的样式，覆盖在上面：你可以使用 CSS 来隐藏默认的文件上传控件，然后创建一个自定义的样式，例如一个按钮或者带有背景图片的元素，使其看起来像一个文件上传按钮。然后，通过 JavaScript 来触发点击事件，以打开文件选择对话框。

2. 使用 label 元素关联文件上传控件：你可以使用 `<label>` 元素将文件上传控件和自定义的样式关联起来。这样当用户点击自定义的样式时，文件上传控件就会被触发。这种方法不需要 JavaScript，并且更加语义化。
```html
<label for="fileInput" class="custom-file-upload">
    Custom Upload Button
</label>
<input id="fileInput" type="file" style="display: none;">
```
```css
.custom-file-upload {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    cursor: pointer;
    display: inline-block;
    border-radius: 5px;
}

.custom-file-upload:hover {
    background-color: #0056b3;
}
```

