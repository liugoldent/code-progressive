---
description: Git知識點
tags: 
    - Git
    - frontend
---

# FE-Git

## 請解釋Git 游離分支是什麼，以及怎麼解決
[Git 游離分之（圖解）](https://juejin.cn/post/6844903623017627661)
[q5390](https://github.com/haizlin/fe-interview/issues/5390)
- 游離分支：Detached HEAD 
    主因：是指當我們切換到某個commit時，我們的Head指針不是指向一個分支，而是指向該提交
- 這通常會發生在幾個以下狀況
    - 查看某提交的內容
    - 切換到某個特定提交
    - 在沒有創建分支下進行提交
- 當Head處於游離狀態下，任何新的提交都不會被記錄，這意味著我們所做的改動，都不會被記錄，除非我們手動創建一個分支來保存
- 如果我們不小心在這個狀態下進行提交，我們可能會丟失這些提交，因為他們沒有被記錄。
- 為了避免出現此狀態，我們可以使用`git checkout` 命令來切換分支，或創建新的一個分支，以確保更改都保存在一個分支內

## Git Log 與 Git reflog 區別在哪
[q5389](https://github.com/haizlin/fe-interview/issues/5389)
1. `git log` 用於查看提交紀錄、包括所有分支與標籤的提交紀錄。按照時間疊加紀錄，最上面的是最新的
2. `git reflog`用於查看Git的引用日誌，可以查看之前對Head的操作記錄，包含分支與標籤的變更。會顯示所有操作的完整紀錄，包括已經被刪除的提交，用於恢復丟失的提交or分支。  


