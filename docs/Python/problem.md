---
sidebar_position: 2
description: 安裝python套件遇到的問題
tags:
  - Python
  - Flask
---
# [Python] 問題

## Q: Cannot install Lxml on Mac OS X 10.9
### [Ans Link](https://stackoverflow.com/questions/19548011/cannot-install-lxml-on-mac-os-x-10-9)

Ans1：
```shell
xcode-select --install
```
Ans2：
```shell
 STATIC_DEPS=true pip install lxml
```


