---
description: python 常見問題
tags:
  - Python
---

# [Python] 常見問題
## <u>**In Python, how do I convert all of the items in a list to floats?**</u>
如何將list內的item，都轉換為float()?
```python
my_list = ['0.49', '0.54', '0.54', '0.55', '0.55', '0.54', '0.55', '0.55', '0.54']
a = [float(i) for i in my_list]
```

## <u>**How to create a DataFrames in Python**</u>

[How to create a DataFrames in Python](https://www.javatpoint.com/how-to-create-a-dataframes-in-python)
如何在python創立一個dataFrame的資料格式
```python
import pandas as pd  
# 原本data要像是dictionary型態  
data = {'Name':['Renault', 'Duster', 'Maruti', 'Honda City'], 'Ratings':[9.0, 8.0, 5.0, 3.0]}  
# index是用來設定左方欄位
df = pd.DataFrame(data, index =['position1', 'position2', 'position3', 'position4'])  
print(df)  
```
```shell
               Name      Ratings
position1     Renault      9.0
position2      Duster      8.0
position3      Maruti      5.0
position4    Honda City      3.0
```

## <u>**How to Convert Pandas DataFrame into a List**</u>
[How to Convert Pandas DataFrame into a List](https://datatofish.com/convert-pandas-dataframe-to-list/)
* 直接使用`tolist()`
```python
import pandas as pd

data = {'product': ['Tablet','Printer','Laptop','Monitor'],
        'price': [250,100,1200,300]
        }

df = pd.DataFrame(data)

products_list = df.values.tolist()
print(products_list)
```

## <u>**Bokeh: ValueError: Out of range float values are not JSON compliant**</u>
[Bokeh: ValueError: Out of range float values are not JSON compliant](https://stackoverflow.com/questions/38821132/bokeh-valueerror-out-of-range-float-values-are-not-json-compliant)
* 如何去掉dataFrame中的`NaN` => 直接使用`fillna`
```python
df = pd.DataFrame(input, index= [ item['date'] for item in stock_history_info])  
b = SAR(df, 0.02, 0.2)
b = b.fillna('') #這邊直接使用fillna
```

## <u>**How to install python3 on ubuntu**</u>
[How To Install Python 3.10 on Ubuntu 20.04|18.04](https://computingforgeeks.com/how-to-install-python-on-ubuntu-linux-system/)
[Installing pip for Python 3](https://www.odoo.com/zh_TW/forum/bang-zhu-1/how-to-install-pip-in-python-3-on-ubuntu-18-04-167715)

順序：python3 > pip3

## 改變 ubuntu 預設python版本
[system cannot find alternative python3 versions on ubuntu 20.04](https://askubuntu.com/questions/1403759/system-cannot-find-alternative-python3-versions-on-ubuntu-20-04)

## <u>**Install Ta-lib**</u>
[TA-lib Install Guide for Linux/Ubuntu (Python library)](https://www.youtube.com/watch?v=AQFZMvYp2KA)

## 使用ngork，讓外網連接我們的電腦
```shell
brew install ngork
ngork http 8080
```
