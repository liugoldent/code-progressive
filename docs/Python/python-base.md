---
description: pymongo 基本使用
tags:
  - Python
  - mongodb
  - pymongo
---

# [Python] 基礎- 常用相關套件指令

## os
### 取出所有環境變數
```python
print(os.environ)
```
### 取出特定變數
```python
# 1
print(os.environ['HOME'])

# 2
os.environ.has_key('HOME')  # Check an existing env. variable
```

### 刪除特定變數
```python
del os.environ['HOME']
```

