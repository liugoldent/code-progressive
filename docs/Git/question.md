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

### <u>*git问题ERROR: Repository not found.的解决办法*</u>
[git问题ERROR: Repository not found.的解决办法](https://juejin.cn/post/6844903681104543758)
```shell
# Ans1
git remote set-url origin git@github.com:xxxxxx/xxxxxx.git

# Ans2
delete key in mac
```

