---
tags: 
    - NodeJs
    - Express
    - Heroku
    - PostgreSQL
---
# [PostgreSQL] Heroku PostgreSQL 設定
1. 首先要在電腦安裝postgresapp
    * [postgreapp](https://postgresapp.com/)

2. 再來安裝 postgre CLI tools
    * [postgreCLI](https://postgresapp.com/documentation/cli-tools.html)

3. 重新開啟terminal

4. 在terminal 打出：`psql -h localhost`

5. 如果你是Mac請參照
    * [postgresqlset](https://devcenter.heroku.com/articles/heroku-postgresql#set-up-postgres-on-mac)

6. 最後去heroku的DB setting 找到 Heroku CLI

7. 路徑如下
    * Resource > Add-ons > DATABASE > Manage Attachment
    * 點擊您的SQL名稱，會出現詳細資料
    * 進入DB後，找到Setting
    * click view Credentials
    * find Heroku CLI （like heroku pg:psql xxxxxxxxx --app xxxxxxxxxxxxxxx）
    * copy 然後，輸入進terminal

8. 完成

# 好文連結
[Getting started with Heroku Postgres in Node](https://blog.devgenius.io/getting-started-with-heroku-postgres-in-node-53f88c72429d)
