---
description: Git知識點
tags:
  - Git
  - frontend
---

# [FE] Git

## 請解釋 Git 游離分支是什麼，以及怎麼解決

[Git 游離分之（圖解）](https://juejin.cn/post/6844903623017627661)
[q5390](https://github.com/haizlin/fe-interview/issues/5390)

- 游離分支：Detached HEAD
  主因：是指當我們切換到某個 commit 時，我們的 Head 指針不是指向一個分支，而是指向該提交
- 這通常會發生在幾個以下狀況
  - 查看某提交的內容
  - 切換到某個特定提交
  - 在沒有創建分支下進行提交
- 當 Head 處於游離狀態下，任何新的提交都不會被記錄，這意味著我們所做的改動，都不會被記錄，除非我們手動創建一個分支來保存
- 如果我們不小心在這個狀態下進行提交，我們可能會丟失這些提交，因為他們沒有被記錄。
- 為了避免出現此狀態，我們可以使用`git checkout` 命令來切換分支，或創建新的一個分支，以確保更改都保存在一個分支內

## Git Log 與 Git reflog 區別在哪

[q5389](https://github.com/haizlin/fe-interview/issues/5389)

1. `git log` 用於查看提交紀錄、包括所有分支與標籤的提交紀錄。按照時間疊加紀錄，最上面的是最新的
2. `git reflog`用於查看 Git 的引用日誌，可以查看之前對 Head 的操作記錄，包含分支與標籤的變更。會顯示所有操作的完整紀錄，包括已經被刪除的提交，用於恢復丟失的提交 or 分支。

## fork

- 指將一個遠程存儲庫的完整拷貝複製到自己的 GitHub 賬戶下
- 這是別人的專案，然後如果我們 commit 到最後 push 了，則可到對方專案點擊`pull request`，看對方是否接受

## clone

- 是從遠程存儲庫中複製一份完整的存儲庫（包括所有分支和歷史記錄）到本地計算機上。

## branch

- Git 中用於管理代碼版本的分支機制

## Git

- 分布式版本控制系統
  - 將專案鏡像複製下來。這麼一來任何一處協作的 server 發生故障，事後都可以用任何一個鏡像出來的本地端恢復。

## Git status

- modified：已修改
- staged：暫存
- committed：提交

## Git 初始化

### Reinitialized existing Git repository Made a mistake

```shell
# Question
>> git init
>> Reinitialized existing Git repository in xxxxx

# Ans
>> rm -rf .git
>> git init
```

### ERROR: Repository not found.的解决办法

[git 问题 ERROR: Repository not found.的解决办法](https://juejin.cn/post/6844903681104543758)

```shell
# Ans1
git remote set-url origin git@github.com:xxxxxx/xxxxxx.git

# Ans2
delete key in mac
```

## 常用指令

### 基本操作

- git init 初始化倉庫，默認為 master 分支
- git add . 提交全部文件修改到緩存區
- git add `<具體某個文件路徑+全名>` 提交某些文件到緩存區
- git diff 查看當前代碼 add 後，會 add 哪些內容
- git diff --staged 查看現在 commit 提交後，會提交哪些內容
- git status 查看當前分支狀態
- git pull `<遠程倉庫名>` `<遠程分支名>` 拉取遠程倉庫的分支與本地當前分支合並
- git pull `<遠程倉庫名>` `<遠程分支名>:<本地分支名>` 拉取遠程倉庫的分支與本地某個分支合並
- git commit -m `<注釋>` 提交代碼到本地倉庫，並寫提交注釋
- git commit -v 提交時顯示所有 diff 信息
- git commit --amend `[file1]` `[file2]` 重做上一次 commit，並包括指定文件的新變化

### commit 信息格式

- feat: 新特性，添加功能
- fix: 修改 bug
- refactor: 代碼重構
- docs: 文檔修改
- style: 代碼格式修改, 注意不是 css 修改
- test: 測試用例修改
- chore: 其他修改, 比如構建流程, 依賴管理

### 分支操作

- git branch 查看本地所有分支
- git branch -r 查看遠程所有分支
- git branch -a 查看本地和遠程所有分支
- git merge `<分支名>` 合並分支
- git merge --abort 合並分支出現沖突時，取消合並，一切回到合並前的狀態
- git branch `<新分支名>` 基於當前分支，新建一個分支
- git checkout --orphan `<新分支名>` 新建一個空分支（會保留之前分支的所有文件）
- git branch -D `<分支名>` 刪除本地某個分支
- git push `<遠程庫名> :<分支名>` 刪除遠程某個分支
- git branch `<新分支名稱> <提交 ID>` 從提交歷史恢覆某個刪掉的某個分支
- git branch -m `<原分支名> <新分支名>` 分支更名
- git checkout `<分支名>` 切換到本地某個分支
- git checkout `<遠程庫名>/<分支名>` 切換到線上某個分支
- git checkout -b `<新分支名>` 把基於當前分支新建分支，並切換為這個分支

### 獲得最新遠端資料

- git fetch [remote] 下載遠程倉庫的所有變動
- git remote -v 顯示所有遠程倉庫
- git pull [remote] [branch] 拉取遠程倉庫的分支與本地當前分支合並
- git fetch 獲取線上最新版信息記錄，不合並
- git push [remote] [branch] 上傳本地指定分支到遠程倉庫
- git push [remote] --force 強行推送當前分支到遠程倉庫，即使有沖突
- git push [remote] --all 推送所有分支到遠程倉庫

### 往前幾個版本

- git checkout [file] 恢覆暫存區的指定文件到工作區
- git checkout [commit] [file] 恢覆某個 commit 的指定文件到暫存區和工作區
- git checkout . 恢覆暫存區的所有文件到工作區
- git reset [commit] 重置當前分支的指針為指定 commit，同時重置暫存區，但工作區不變
- git reset --hard 重置暫存區與工作區，與上一次 commit 保持一致
- git reset [file] 重置暫存區的指定文件，與上一次 commit 保持一致，但工作區不變
- git revert [commit] 後者的所有變化都將被前者抵消，並且應用到當前分支

### 暫時儲存

正在進行項目中某一部分的工作，里面的東西處於一個比較雜亂的狀態，而你想轉到其他分支上進行一些工作，但又不想提交這些雜亂的代碼，這時候可以將代碼進行存儲

- git stash 暫時將未提交的變化移除
- git stash pop 取出儲藏中最後存入的工作狀態進行恢覆，會刪除儲藏
- git stash list 查看所有儲藏中的工作
- git stash apply `<儲藏的名稱>` 取出儲藏中對應的工作狀態進行恢覆，不會刪除儲藏
- git stash clear 清空所有儲藏中的工作
- git stash drop `<儲藏的名稱>` 刪除對應的某個儲藏

## HEAD、工作樹、索引

- 工程師在工作樹上工作，然後將工作樹的索引保存到數據庫上
- HEAD 指針通常指向我們所在的分支，當我們在某個分支上創建新的提交時，分支指針總是會指向當前分支的最新提交
- 工作樹是查看和編輯的（源）文件的實際內容
- 索引是放置你想要提交給 git 倉庫文件的地方，如工作樹的代碼通過 git add 則添加到 git 索引中，通過 git commit 則將索引區域的文件提交到 git 倉庫中

### HEAD

- HEAD 指针 ——–> 分支指针 ——–> 最新提交

## fetch pull

### 相同點

- 在作用上他們的功能是大致相同的，都是起到了更新代碼的作用

### 不同點

- git pull 是相當於從遠程倉庫獲取最新版本，然後再與本地分支 merge，即 git pull = git fetch + git merge
  相比起來，git fetch 更安全也更符合實際要求，在 merge 前，我們可以查看更新情況，根據實際情況再決定是否合並

## stash

- git stash: 這個命令將你當前的工作目錄中的修改保存到一個臨時存儲區中，並將工作目錄恢復到乾淨的工作狀態。
- git stash save: 這個命令與 git stash 相同，它用於將當前的工作目錄中的修改保存到臨時存儲區中。
- git stash list: 這個命令用於列出當前存儲的所有 stash，它顯示 stash 的編號以及相關的描述信息。
- git stash pop: 這個命令將最近的 stash 應用於當前的工作目錄中，同時從 stash 列表中刪除該 stash。
- git stash apply: 這個命令與 git stash pop 類似，但它不會從 stash 列表中刪除 stash，而只是將 stash 應用到當前的工作目錄。

- git stash show: 這個命令用於顯示 stash 中的更改。它會顯示 stash 中的文件列表以及文件的修改內容。
- git stash drop: 這個命令用於從 stash 列表中刪除指定的 stash。
- git stash clear: 這個命令用於刪除所有的 stash，將 stash 列表清空。

## merge & rebase

### merge

- git merge 命令將兩個分支的歷史合併在一起，創建一個新的合併提交。這個合併提交包含了來自兩個分支的所有更改，將它們合併到一個新的共同基礎上。
- 合併操作創建了一個新的合併提交，保留了來自各個分支的提交歷史。因此，合併操作不會改變提交的歷史線。
- 是一種非破壞性的操作，對現有分支不會以任何方式被更改，但是會導致歷史記錄相對複雜

### rebase：重新定位

- 主要的好處是歷史記錄更加清晰，是在原有提交的基礎上將差異內容反映進去，消除了 git merge 所需的不必要的合並提交
- git rebase 命令的主要目的是將一個分支的歷史重新定位到另一個分支的最新提交上。這意味著它會將當前分支的提交應用到目標分支的最新提交上，然後把當前分支指向這個新的提交，這樣看起來就好像是在目標分支上提交的。換句話說，它會改變提交的歷史線，使得整個歷史看起來更線性。
- 使用 rebase 可以使得提交歷史保持整潔、線性，減少不必要的合併提交。
- 由於重新定位提交歷史可能會改變提交的哈希值，因此不建議在公共分支上使用 rebase，因為這可能會破壞其他開發人員的提交歷史。

## git reset git revert

### reset

- 命令用於移動 HEAD 指針和分支引用，以將當前分支的狀態重置為指定的提交
- `soft reset`: 移動 HEAD 指針到指定的提交，但保留修改的文件在暫存區中，這意味著將修改重新放回暫存區，你可以重新提交這些更改。
- `mixed reset`: 除了將 HEAD 指針移動到指定的提交外，它還會取消暫存區中的更改，但是保留這些更改在工作目錄中，這意味著你需要再次將這些更改添加到暫存區後再提交。
- `hard reset`: 移動 HEAD 指針到指定的提交，同時重置暫存區和工作目錄，這意味著將取消暫存區和工作目錄中的所有更改，恢復到指定提交的狀態。

### revert

- `git revert`：命令用於創建一個新的提交，該提交的內容是撤銷指定提交引入的更改。它不會改變提交歷史，而是通過創建一個新的撤銷提交來撤銷之前的提交。這意味著，即使提交已經被推送到遠程庫，也可以使用 git revert 進行撤銷。
- `git revert`：生成一個新的提交，將指定提交的更改取消掉，這樣原來的提交歷史保持不變，但引入了一個新的提交來表示撤銷操作。
