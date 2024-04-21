---
description: python SQL
tags:
  - Python
---

# [Python] SQL

## SQL

### RDBMS

- Relational Database Management System
- 關連式資料庫，通常欄位不會變動，適合儲存格式相對簡單與穩定

### NoSQL

- 非關連式資料庫
- 每次格式都不太固定
- 使用上簡單，但查訊速度較慢

## ORM

- 把想法轉變成 SQL 指令的 library
- 可以以物件導向的方式操作資料庫的技術

### 優點

- 通用、廣泛
  - 不同資料庫之間的 SQL 語法還是略有差異，但在 ORM 就沒有這個問題，只要把資料庫連線設定弄好，ORM 就會自動幫我們轉換成對應的 SQL 進行操作
- 安全：
  - 不是直接下 SQL 指令，可以避免到 SQL Injection 攻擊
- 簡化：
  - 使整體程式碼較好理解，也較容易維護

### Python 應用於 ORM

- 使用 SQLAlchemy

### 範例程式碼

```py3
# -*- coding: utf-8 -*-

# 导入 SQLAlchemy 库中需要的模块
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, JSON
from sqlalchemy.orm import sessionmaker

# 创建一个基类，所有的模型都将继承自该基类
Base = declarative_base()

# 定义数据库连接的 URL，这里使用的是 MySQL 数据库
```shell
engine_url = "mysql+pymysql://root:123456@127.0.0.1:3306/test"
```
# 创建数据库引擎，用于连接数据库
engine = create_engine(engine_url, echo=True)


# 定义一个名为 Test 的模型类，它继承自 Base 类
```py3
class Test(Base):
    __tablename__ = "test"  # 数据库表名
    id = Column(Integer, primary_key=True, autoincrement=True)  # 主键 id，自增长
    records = Column(JSON)  # JSON 类型的字段，存储记录数据
```

# 函数用于创建数据库表
def create_table():
    Base.metadata.create_all(engine)


# 函数用于删除数据库表
def drop_table():
    Base.metadata.drop_all(engine)


# 函数用于创建数据库会话
def create_session():
    Session = sessionmaker(bind=engine)  # 创建一个 Session 类
    session = Session()  # 实例化 Session 类，创建会话对象

    return session


# 主程序入口
if __name__ == '__main__':
    drop_table()  # 删除已存在的数据库表
    create_table()  # 创建数据库表

```

```py3
# 导入所需的模块
from sqlalchemy.orm import sessionmaker

# 創建對話
Session = sessionmaker(bind=engine)
session = Session()

# 创建一个 Test 对象并添加到会话中
# 先Test做連結
new_test_record = Test(records={"name": "Alice", "age": 30})
session.add(new_test_record)

# 提交事务
session.commit()

# 查询数据库中的所有记录
all_records = session.query(Test).all()
for record in all_records:
    print(record.id, record.records)

# 关闭会话
session.close()
```

## 索引原理比較

- BTree

- 传统数据库索引：在传统的关系数据库中，最常见的索引类型是 B 树索引（或其变种，如 B+ 树索引）。B 树是一种平衡的树形数据结构，它通过在每个节点中存储多个键值对，并通过按键值对进行排序来实现快速搜索。

### Hash 索引

- 哈希索引使用哈希函数将键值映射到存储桶中，每个存储桶包含一个或多个具有相同哈希值的键值对。哈希索引通常用于实现快速查找，尤其是在等值查询（例如 WHERE column = value）的情况下。
- 僅能使用等於`（=）`、其中`（IN）`、和不等於`<=>`
- 用 Hash 值來比較，所以不能用於範圍的過濾

### 選擇

- 當要做到排序和區間選擇，使用 BTree
- 對於唯一值較高，使用 Hash

## 索引類型

### 聚(叢)集索引：

- 聚(叢)集索引將資料表或檢視中的資料列依其索引鍵值排序與儲存
- 聚(叢)集索引決定了資料的儲存形態，所以一張表上只能有一個聚集索引
- 如果資料表沒有任何叢集索引，它的資料列就儲存在未排序的結構中，這個結構稱為堆積
- 通常會建立在 PRIMARY KEY 上
- B-Tree 結構（存 Key）

### 非聚(叢)集索引：

- 資料排序不會受非叢集索引影響(是根據聚(叢)集索引)
- 非叢集索引有一個與資料列完全分開的結構
- 非叢集索引包含非叢集索引鍵值，而每個索引鍵值項目都有一個指標，指向包含索引鍵值的資料列
- B-Tree 結構（存 Data）

### 兩者比較：

- 叢集索引插入資料時速度較慢(時間花費在「物理存儲的排序」上，要找到對的位置進行插入)
- 查詢資料速度: 叢集索引 > 非叢集索引
- 非叢集索引建立的先後順序並不是很重要，因為它們不會互相影響也不會對改變資料表中實際資料的排序，但是建立叢集索引會影響實際資料排列，也會影響已建立的非叢集索引

## where vs having

- where 用於分組前過濾、having 用於分組後排除紀錄
- where 不能包含聚合函數、having 可以（因為 where 運行順序在聚合函數前）
- where 在篩選時會用到 index、having 只是做一個表掃描（所以 where 效率較高）

## SQL 執行順序

- FROM：需要從哪個資料表檢索資料
- JOIN：合併表
- ON：合併表的條件
- WHERE：過濾表中資料
- GROUP BY：將上面過濾出的資料分組
- 聚合函數(AVG)：
- HAVING：對上面已經分組的資料進行過濾
- SELECT：檢視結果集中的哪個列，或列的計算結果
- DISTINCT：移除相同行資料
- ORDER BY：按照什麼樣的順序來檢視返回的資料
- LIMIT：返回幾筆資料

## join

[參考連結-1](https://www.tutorialspoint.com/sql/sql-right-joins.htm)
[參考連結-2](https://www.runoob.com/sql/sql-join-left.html)

- left join：
  - 左表要全有、右表看數量填上（如果右表有兩個對應到左表），則左表也要有兩個
