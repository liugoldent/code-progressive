---
description: python 問題集
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
### <u>*1. Cannot install Lxml on Mac OS X 10.9*</u>
#### [Ans Link](https://stackoverflow.com/questions/19548011/cannot-install-lxml-on-mac-os-x-10-9)

Ans1：
```shell
xcode-select --install
```
Ans2：
```shell
 STATIC_DEPS=true pip install lxml
```

### <u>*2. ImportError: No module named*</u>
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

### <u>*3. PyMongo [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate*</u>

#### [Ans Link](https://stackoverflow.com/questions/68123923/pymongo-ssl-certificate-verify-failed-certificate-verify-failed-unable-to-ge)

可以使用`certifi()`去解決
```python
client = MongoClient(cluster, tlsCAFile= certifi.where())
```

### <u>*4. pymongo.cursor.Cursor object at xxxxxxx*</u>
#### [Ans Link](https://stackoverflow.com/questions/28968660/how-to-convert-a-pymongo-cursor-cursor-into-a-dict)  

代表其print出的東西為物件，故解決辦法：
```python
array = list(col.find())
print(array)
```

### <u>*5. pymongo - "dnspython" module must be installed to use mongodb+srv:// URIs*</u>
#### [Ans Link](https://stackoverflow.com/questions/52930341/pymongo-dnspython-module-must-be-installed-to-use-mongodbsrv-uris)

主要是要安裝 `mongo+srv`
```shell
# 這邊記得要用[srv]，不然無法安裝
pip3 install 'pymongo[srv]'
```

### <u>*6. Extracting lxml xpath for html table*</u>

#### [Ans Link](https://stackoverflow.com/questions/5586296/extracting-lxml-xpath-for-html-table)
```python
# 記得tbody要拿掉！因為瀏覽器會對html文本進行一定的規範化
buyDetail = htmlTree.xpath('//table[@class="t01"] /tr/td/text()')
```

### <u>*7. TypeError: ObjectId('') is not JSON serializable*</u>
#### [Ans Link](https://stackoverflow.com/questions/16586180/typeerror-objectid-is-not-json-serializable)
```python
# 最主要觀念就是要先將list用json_util.dumps轉為json_str格式，最後再json.loads()，就可以確保其丟給mongo的為Json檔案
buyList = json.loads(json_util.dumps(buyAndSellList['buyList']))
```


