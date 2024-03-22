---
tags:
  - Docker
  - Test
---

# [FE] Docker

## 基本概念

- Docker File
- Image：類似程式
- Container：類似程式跑起來的 APP

## 做出自己的 DockerFile
[WebConf](https://azole.medium.com/webconf2023-docker-%E5%85%A5%E9%96%80-101-fae89170553a)
[前端 Vue3 範例](https://rurutseng.com/posts/docker/)
[後端 node.js 範例](https://larrylu.blog/step-by-step-dockerize-your-app-ecd8940696f4)

1. 新增 DockerFile
2. 上 Docker Hub 找到一個合適的 base image
3. copy 原始碼

```shell
# 看什麼環境，這邊只是node範例
FROM node:9.2.0
# 看什麼專案，這邊也只是範例
COPY index.js package.json /app/
```

4. 安裝 dependencies

```shell
# 切到app檔案夾
WORKDIR /app

RUN npm install && npm cache clean --force
```

5. 設定 initial command

```shell
# 只是範例（node.js）
CMD node index.js
# 如果是Vue之類的，就應該是
CMD npm run dev
```

6. build image

- 要將 image 產出，去做一個 container（平台出來）

```shell
# 只是範例
docker build -t simple-express-server .
```

7. 起一個 container

```shell
# docker run -port號 背景執行 對外port:內部port image名稱
docker run -p -d 3000:8080 simple-express-server
```

### vue 的 dockerFile

- 簡易範例

```shell
# FROM node:lts-alpine：指定了用作基础镜像的 Node.js 官方 Alpine 版本，其中 lts 表示长期支持版本，alpine 表示使用轻量级的 Alpine Linux 作为基础系统。
# as build-stage：为此阶段定义了一个别名，可以在后续阶段中引用。
FROM node:lts-alpine as build-stage

# WORKDIR 指令用于设置工作目录，这是在容器中执行命令时的当前目录。在此例中，工作目录被设置为 /app
WORKDIR /app

# 将项目根目录中的 package.json 和 package-lock.json（如果有的话）复制到容器中的工作目录
COPY package*.json ./

RUN npm install

# 将项目根目录中的所有文件复制到容器中的工作目录。这包括源代码、配置文件等
COPY . .

RUN npm run build

# 指定了用作生产阶段基础镜像的 Nginx 官方 Alpine 版本，stable-alpine 表示稳定版的 Alpine Linux
FROM nginx:stable-alpine as production-stage

COPY nginx/default.conf /etc/nginx/conf.d/

# 从之前的构建阶段中的别名为 build-stage 的阶段中拷贝静态文件（通常是构建产生的静态资源文件）到 Nginx 的默认静态文件目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 指定了容器将要监听的端口号，这样外部就可以通过此端口访问容器内的服务
EXPOSE 80

# 定义了容器启动时要执行的命令，这里是启动 Nginx 服务并以守护进程模式运行
CMD ["nginx", "-g", "daemon off;"]
```

## 流程述說

1. 先要有 dockerFile
2. 建立 image

```shell
docker build -t [你的image名稱] .
```

3. 建立 container

```shell
# d：在後台運行
# p：映射port
docker run -dp [你本機的端口]:[docker端口] [你的image名稱]
```

4. 看眾多 images

```shell
docker images
```

## 如果更改 dockerFile

- 因為在開發時，必定會一直更新程式，但不可能一直建立新的 container
- 用刪除刪掉舊 container

```shell
＃ 列出所有 Docker-container-id
docker ps

# 使用 Docker container id 暫停 docker（要先暫停才可以刪除）
docker stop [the-container-id]

# 使用 id 刪除 Docker container
docker rm [the-container-id]
```

