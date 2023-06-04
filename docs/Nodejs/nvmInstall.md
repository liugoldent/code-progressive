---
description: 在Mac上安裝nvm
tags:
  - Node.js
  - nvm
---

# 如何在Mac 上安裝nvm

1. 安裝Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安裝nvm
```bash
brew install nvm
```

3. 配置環境變數
```bash
nano ~/.zshrc
```

4. 如果 ~/.zshrc為空，則貼上這些程式（定義其路徑）
* 注意：路徑是可以改變的，要確定路徑上有nvm
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

5. 退出shell，再重新進入shell，輸入
```bash
source ~/.zshrc  # 如果使用的是 Zsh
```

6. 安裝node
```bash
nvm install node
nvm install 16.16.0 #此為node.js版本號
```

