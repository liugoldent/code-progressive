---
description: pymongo 基本使用
tags:
  - Python
  - mongodb
  - pymongo
---

# [Python] 基礎- Pymongo 套件使用

## 官方文件
[pymongo DOC](https://pymongo.readthedocs.io/en/stable/)

## 相關常用指令

### <u>*list_collection_names*</u>
#### 目的：取出collection 清單
```python
db = client['investor']
result = db.list_collection_names()
```



