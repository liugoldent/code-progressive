---
title: "Django安裝"
description: "python如何安裝django"
tags:
  - python
  - django
keywords: ["Django安裝", "Python", "簡易流程", "參考"]
---

# Django安裝

## 簡易流程
```shell
# 安裝
mkdir project_tsukuyomi && cd project_tsukuyomi
pipenv install django
# 啟動
pipenv shell
django-admin startproject app .
python3 manage.py runserver
# 離開
control+c
exit
```

## 參考
[參考文章1](https://python.plainenglish.io/setting-up-a-basic-django-project-with-pipenv-7c58fa2ec631)



