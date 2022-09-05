---
sidebar_position: 2
description: docSearch問題
tags:
  - Python
  - Flask
  - docSearch
---

# [Python]問題集
## docSearch
### <u>*zsh: command not found: jq*</u>

Ans：
```shell
brew install jq
```

## python
### <u>*Cannot install Lxml on Mac OS X 10.9*</u>
#### [Ans Link](https://stackoverflow.com/questions/19548011/cannot-install-lxml-on-mac-os-x-10-9)

Ans1：
```shell
xcode-select --install
```
Ans2：
```shell
 STATIC_DEPS=true pip install lxml
```

### <u>*ImportError: No module named*</u>
#### [Ans Link](https://stackoverflow.com/questions/19548011/cannot-install-lxml-on-mac-os-x-10-9)

Ans1：
```shell
xcode-select --install
```
Ans2：
```shell
 STATIC_DEPS=true pip install lxml
```

### <u>*ImportError: No module named*</u>
#### [Ans Link](https://blog.csdn.net/GungnirsPledge/article/details/107586458)

Ans：
使用sys  
主要是因為我們要去定義python從哪邊獲取那些modules  
而因為系統預設並沒有我們的modules
所以我們要自己去設定
```shell
|--- Stock
|   |- stockDetail.py
|   |- stockMainCrawler.py
```
```python
# 這邊引入sys去跟系統做對話
import sys
sys.path.append('/Users/guantingliu/Desktop/BackEnd/nightkin_py/modules/Stock')
# 然後這邊就可以引入我們的檔案做操作
from stockDetail import Square
```

