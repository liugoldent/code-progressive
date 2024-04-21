---
description: python 套件 基本使用
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

## 管理套件
### freeze
freeze 將會把使用到的套件都丟入`requirement.txt`
```shell
pip3 freeze > requirement.txt
```

### -r 
安裝requirement.txt 套件
```shell
pip3 -r requirement.txt
```

