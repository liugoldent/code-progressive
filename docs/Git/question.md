---
description: git 常見問題
  - git
  - github
---

# [Git] Git 常見問題

## Git 初始化
### <u>*Q1：Reinitialized existing Git repository Made a mistake*</u>

```shell
# Question
>> git init
>> Reinitialized existing Git repository in xxxxx

# Ans
>> rm -rf .git
>> git init
```


