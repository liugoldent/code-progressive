---
description: Flask Blueprint 操作
tags:
  - Python
  - Flask
---

# [Flask] router - Blueprint 操作

## 連結
[Python Web Flask — Blueprints 解決大架構的網站](https://medium.com/seaniap/python-web-flask-blueprints-%E8%A7%A3%E6%B1%BA%E5%A4%A7%E6%9E%B6%E6%A7%8B%E7%9A%84%E7%B6%B2%E7%AB%99-1f9878312526)

## 目的
當網站的架構日益漸增，我們需要blueprint（藍圖），為我們「依功能」所切分的folder做管理

## 舉例
### 架構
```
project
│   app.py
└─── modules
|    └─── stock
|      └─── a.py
|    └─── ptt
|      └─── pttCrawler.py
```


### 程式碼
```python
# pttCrawler.py

# 步驟1. 先引入Blueprint
from flask import jsonify, Blueprint
# 步驟2. 註冊一個名稱，到時候讓app.py可以引入
ptt_blueprints = Blueprint('ownere', __name__)

# 步驟3. 在這邊使用@做route分配
@ptt_blueprints.route('/')
def api():
    # return in JSON format. (For API)
    return jsonify({"message": "Hello from Flask!"})


@ptt_blueprints.route('/add')
def api2():
    # return in JSON format. (For API)
    return jsonify({"message": "Hello from Flask add!"})
```



```python
# app.py
from flask import Flask

app = Flask(__name__)
# 步驟4.「從」module（pttCrawler）（檔案），然後import 該檔案所標記的blueprint
from modules.Ptt.pttCrawler import ptt_blueprints

# 步驟5. 在主檔案中，註冊register_blueprint(在檔案中定義的prints, 以及前綴字)
app.register_blueprint(ptt_blueprints, url_prefix='/ptt')
```



