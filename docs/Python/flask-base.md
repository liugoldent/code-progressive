---
description: python套件管理相關指令
tags:
  - Python
  - Flask
keywords: [python, 套件管理, python3, os, pipenv]
---

# [Python] 基礎- Python 套件管理

## 好文連結
>>  [有效管理Python套件](https://www.learncodewithmike.com/2020/02/python-pip-and-pipenv.html)

>>  [Pipenv指令大全](https://medium.com/@hiimdoublej/pipenv%E6%8C%87%E4%BB%A4%E5%A4%A7%E5%85%A8-6e4415cc8a15)

## 相關指令
### 全域
#### 全域安裝
```shell
pip3 install twstock
```
#### 全域套件管理
```shell
pip3 list
```

### 虛擬環境
#### 建置環境
```shell
# 首先要先增加至虛擬環境
pip3 install pipenv
# 進入虛擬環境
pipenv shell
# 之後操作指令同上面安裝指令
```

### 安裝requiement.txt
```shell
pip3 install -r ./requirements.txt
```

