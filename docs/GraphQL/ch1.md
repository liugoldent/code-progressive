---
description: graphQL是什麼
tags:
  - sql
  - interview
keywords:
  [
    hydration,
    html,
    css,
    js,
    javascript,
    interview,
    js 面試,
    js interview,
    前端面試題,
    frontend interview,
    フロントエンドの面接質問,
    프론트엔드 면접 문제,
    graphql
  ]
---

# GraphQL
## 介紹、好處
### 精確的數據檢索
* 使用GraphQL，客戶端可以根據其需求精確地指定所需的數據。這意味著客戶端可以從服務器端檢索其需要的數據，而無需檢索整個資源或多個端點返回的過剩數據。
### 減少多次請求
* 由於GraphQL允許客戶端在單個請求中指定多個數據需求，因此減少了不必要的多次請求。這可以提高應用程序的性能和效率。
### 自描述的架構
* GraphQL具有自描述的特性，因此可以輕鬆了解可用的數據模式。這使得開發人員可以更容易地理解和使用API，並且可以自動生成文檔。
### 彈性和擴展性
* GraphQL允許服務器端提供具有彈性的API，因為它可以根據客戶端的需求動態生成數據。這使得應用程序更容易進行擴展和演進。
### 客戶端控制
* GraphQL讓客戶端有更多的控制權，他們可以指定他們需要的數據結構，而不是受限於服務器端提供的固定結構。
### 行動裝置普及
* 資料傳遞速度嚴重影響效能
* 不同平台所需的資料數量、格式都不同
### Domain Knowledge & Business Logic 越來越複雜
* Schema 設計越來越複雜
* 前後端溝通難度增加
* Legacy API 難以處理
### Micro service 崛起
* 需要一個統一的介面 (接口) 來協助整合



## 生態
* GraphQL Client, GateWay, GraphQL Server, Datbase-to-GraphQL Server

### 1. graphQL Client
* 客戶端
* 組織 query 並將 query 傳送去 server 的函式庫
* 支援 GraphQL 的 Declarative data fetching
* client 端只需寫好 query ，函式庫會幫你處理其餘工作如 query 解析、 FrameWork 整合、錯誤處理、 建置時間優化、快取等等

### 2. 閘道器 GraphQL Gateway
* 處於 GraphQL Client 與 GraphQL Server 之間的一個服務
* 支援路由導向、效能紀錄、資料收集等等功能

### 3. 後端伺服器 GraphQL BackEnd Server
* 負責接受前端來的 Query 並回應資料的函式庫
* 實際處理資料的地方
* 可實作 Schema Stitching (可將不同服務的 GraphQL Schema 整合成一個 Schema)
* 組成一個 GraphQL BackEnd Server 需
  * GraphQL Schema Definition + Resolver Functions (開發者的資料設計)
  * GraphQL 執行引擎 (負責實現 GraphQL 功能，本標題重點)
  * Network Layer (路由處理，如 NodeJS 的 express)

### 4. 資料庫對 GraphQL 伺服器端 Database-to-GraphQL server
* 負責 Database 與 GraphQL 之間的溝通
* 有些會以 ORM (如 mongoose 對 mongodb) 的方式提供服務
* 將 Database 轉換成 GraphQL API
* 可以取代 GraphQL Server 直接與 Client 端溝通


## 基本

### query vs schema
* Query 是 client side 是符合 schema 規定的查詢語言格式 ;
* Schema 是 server side 定義整體資料結構格式。
