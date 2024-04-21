---
description: 使用docSearch，搜尋你的內容
tags:
  - docsearch
  - Docusaurus
---
# [DocSearch] 基本配置

## 好文連結
[Docusaurus搭建个人博客](https://blog.csdn.net/kuizuo12/article/details/122642446)

## 相關指令複製
#### run by self -> 目的：讓自己去更新網路上爬蟲資料
```shell
docker run -it --env-file=.env -e "CONFIG=$(cat /Users/guantingliu/Desktop/FrontEnd/code-progressive/config.json | jq -r tostring)" algolia/docsearch-scraper
```
