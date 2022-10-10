---
description: git 常用指令
  - git
  - github
---

# [Git] Git 常用指令
## Git Reset
### 往前幾個版本
```shell
git reset --hard HEAD  // =>回復到最新提交版本
git reset --hard HEAD~ // 等於 ~1 => 回復到上一個提交版本，數字表示移動到 HEAD後面第幾個
git reset --hard HEAD~n // n 等於往上第幾個提交版本 回復之前指定的提交版本
```

### 回到某版本
```shell
git reset --hard <commit id> // => 回復到指定的提交版本
```
