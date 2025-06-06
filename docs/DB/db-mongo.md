# MongoDB

## 三大概念
1. Database（資料庫）：包含多個 collections

2. Collection（集合）：類似關聯式資料庫裡的 Table，用來存放一組「同類型」的文件

3. Document（文件）：以 BSON（Binary JSON）格式儲存的單筆資料，相當於關聯式資料庫裡的「一列（row）」

## 但在 Mongoose（Node.js 的 ODM）裡，「Model」是什麼？
1. Model = Schema + Collection 的組合

* Schema（結構定義）：你用 Mongoose 定義一個 `new Schema({...})`，告訴 Mongoose「這個 collection 底下的 document 應該長什麼樣子？有哪些欄位？欄位型別、預設值、是否必填、索引策略等等」。

* Collection（集合名稱）：你在呼叫 mongoose.model(name, schema, collectionName) 時，第三個參數 collectionName 就是要對應到真實資料庫裡的那個 collection。

* 當你把這兩個參數提供給 Mongoose 之後，Mongoose 會回傳一個 Model 類別（實質上是一個「可操作該 collection」的 class），讓你可以對應到「具有該 Schema 約束的文件集合」。

* Mongoose（幫你包了一層），就會出現「先定義 Schema → 產生 Model → 用 Model 去操作 collection」的慣用流程

## 為什麼要用 Model
* MongoDB 本身是 schema‐less，也就是說「collection 裡的 document 可以長得不一樣」。雖然很靈活，但若你的應用程式需要保證「所有文件都要有 title: String、content: String、createdAt: Date」這些欄位，就要在程式層面自己去檢查。如果沒用 Mongoose，每次寫入都要手動做 if (!doc.title) throw new Error("...")
* 這樣就不用每次都在程式裡寫一堆 if else 檢查，有助於程式維護、避免不合法文件被寫入資料庫

## Model 的意義：
1. 結構管理：把文件結構寫進 code，統一驗證。
2. 方便操作：封裝了 CRUD、聚合、hooks、virtual 等功能。
3. 記憶體 cache：`conn.models[name]` 存一份現成的 Model，重複取得不需重複註冊。
4. 型別整合（若用 TypeScript）：可以把 interface IMemo 綁到 `Model<IMemo>`，讓 IDE 幫你做靜態檢查。