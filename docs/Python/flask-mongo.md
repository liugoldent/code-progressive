---
description: 介紹flask 如何使用與連接mongo
tags:
  - Python
  - Flask
  - MongoDB
---

# [MongoDB] 連接 Mongo DB（使用Python）

## MnogoDB教學文章
[使用Python操作MongoDB](https://juejin.cn/post/7044920044937019422)
## 創建MongoDB（Free）
### 參考影片
[MongoDB Crash Course With Python 2022](https://www.youtube.com/watch?v=qWYx5neOh2s)

### 連結程式碼
```python
from pymongo import MongoClient
import certifi
cluster = "mongodb+srv://<username>:<password>@cluster0.67gy5wa.mongodb.net/?retryWrites=true&w=majority"
# certifi很重要，沒有他無法連接
client = MongoClient(cluster, tlsCAFile= certifi.where())
```

## MongoDB 基本概念



