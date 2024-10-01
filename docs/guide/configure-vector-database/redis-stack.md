# Redis Stack

## 介绍

Redis Stack 是 Redis 的扩展版本，集成了多个模块，提供更强大的功能，适用于复杂的应用场景。除了保留 Redis 的高性能和低延迟特点，Redis Stack 通过内置的 RediSearch、RedisJSON、RedisTimeSeries、RedisGraph 和 RedisBloom 模块，支持全文搜索、JSON 数据操作、时间序列处理、图数据库查询以及概率数据结构。这些扩展使 Redis Stack 具备更丰富的数据存储和处理能力，满足实时搜索、监控分析、大规模数据过滤和复杂查询等多种需求。它依然保持了 Redis 的简单易用性，同时为开发者提供了灵活的工具和高可用性方案，使其成为适合现代复杂应用的强大数据平台。

在这里，我们使用 Redis Stack 的向量数据库功能以支持长期记忆。

## 安装

::: tip
如果您想简单且呼吸顺畅的使用 Redis Stack，那么请选择 Docker 为安装方式。
:::

### 环境准备

#### 安装 Koishi 插件

前往插件市场，搜索 `chatluna-vector-store-service` 勾选`apache-arrow`依赖并安装。

#### 安装 Redis Stack

##### Docker

如何使用 Docker 安装 Redis Stack

要开始使用 Docker 安装 Redis Stack，首先需要选择一个 Docker 镜像：

- **redis/redis-stack** 包含 Redis Stack 服务器和 Redis Insight。该容器非常适合本地开发，因为您可以使用内置的 Redis Insight 来可视化数据。
- **redis/redis-stack-server** 仅提供 Redis Stack 服务器。该容器适合用于生产部署。

###### redis/redis-stack-server
要使用 `redis-stack-server` 镜像启动 Redis Stack 服务器，请在终端中运行以下命令：

```bash
docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

###### redis/redis-stack
要使用 `redis-stack` 镜像启动 Redis Stack 容器，请在终端中运行以下命令：

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

上面的 `docker run` 命令还将 Redis Insight 暴露在 8001 端口。您可以在浏览器中访问 `localhost:8001` 来使用 Redis Insight。

###### 在 Docker 中持久化
要将目录或文件挂载到 Docker 容器中，可以使用 `-v` 来配置本地卷。以下命令将所有数据存储在本地目录 `local-data` 中：

```bash
docker run -v /local-data/:/data redis/redis-stack:latest
```

###### 端口
如果您想在不同的端口上暴露 Redis Stack 服务器或 Redis Insight，请更新 `-p` 参数左侧的端口号。以下命令将 Redis Stack 服务器暴露在 10001 端口，Redis Insight 暴露在 13333 端口：

```bash
docker run -p 10001:6379 -p 13333:8001 redis/redis-stack:latest
```

###### 环境变量
要传递任意的配置更改，可以设置以下环境变量：

- **REDIS_ARGS**：传递给 Redis 的额外参数
- **REDISEARCH_ARGS**：用于搜索和查询功能（RediSearch）的参数
- **REDISJSON_ARGS**：用于 JSON 数据处理（RedisJSON）的参数
- **REDISTIMESERIES_ARGS**：用于时间序列（RedisTimeSeries）的参数
- **REDISBLOOM_ARGS**：用于概率数据结构（RedisBloom）的参数

例如，使用 **REDIS_ARGS** 环境变量传递 `requirepass` 指令给 Redis：

```bash
docker run -e REDIS_ARGS="--requirepass redis-stack" redis/redis-stack:latest
```

设置 Redis 持久化的示例：

```bash
docker run -e REDIS_ARGS="--save 60 1000 --appendonly yes" redis/redis-stack:latest
```

设置时间序列保留策略的示例：

```bash
docker run -e REDISTIMESERIES_ARGS="RETENTION_POLICY=20" redis/redis-stack:latest
```

##### Linux

如何在 Linux 上安装 Redis Stack

可以通过官方 APT 仓库、RPM 源、Snap 或 AppImage 来在 Linux 上安装 Redis Stack。

###### 从官方 Ubuntu/Debian APT 仓库安装
1. 添加 Redis 仓库并更新：
   ```bash
   sudo apt-get install lsb-release curl gpg
   curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
   sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
   echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
   sudo apt-get update
   sudo apt-get install redis-stack-server
   ```

2. 启用并启动 Redis：
   ```bash
   sudo systemctl enable redis-stack-server
   sudo systemctl start redis-stack-server
   ```

###### 从官方 Red Hat/Rocky RPM 源安装
1. 创建 `/etc/yum.repos.d/redis.repo` 文件，内容如下：
   ```ini
   [Redis]
   name=Redis
   baseurl=https://packages.redis.io/rpm/rhel9
   enabled=1
   gpgcheck=1
   ```
2. 运行以下命令：
   ```bash
   curl -fsSL https://packages.redis.io/gpg > /tmp/redis.key
   sudo rpm --import /tmp/redis.key
   sudo yum install epel-release
   sudo yum install redis-stack-server
   ```

3. 启用并启动 Redis：
   ```bash
   sudo systemctl enable redis-stack-server
   sudo systemctl start redis-stack-server
   ```

###### 使用 Snap 在 Ubuntu 上安装
1. 下载最新的 Redis Stack Snap 包并安装：
   ```bash
   sudo apt update
   sudo apt install redis-tools
   sudo snap install --dangerous --classic <snapname.snap>
   ```

2. 启动 Redis Stack：
   ```bash
   sudo snap run redis-stack-server
   ```

3. 若需要集成到 systemd 中，创建 `/etc/systemd/system/redis-stack-server.service` 文件，添加如下内容：
   ```ini
   [Unit]
   Description=Redis Stack Server
   After=network.target

   [Service]
   ExecStart=/usr/bin/snap run redis-stack-server
   Restart=always
   User=root
   Group=root

   [Install]
   WantedBy=multi-user.target
   ```

4. 运行以下命令：
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start redis-stack-server
   sudo systemctl enable redis-stack-server
   ```

###### 使用 AppImage 在 Ubuntu 上安装
1. 安装 Fuse：
   ```bash
   sudo apt update
   sudo apt install fuse
   ```

2. 下载 Redis Stack AppImage 并执行以下命令：
   ```bash
   sudo apt update
   sudo apt install redis-tools
   chmod a+x <AppImageFile>
   ./<AppImageFile>
   ```

3. 创建 `/etc/systemd/system/redis-appimage.service` 文件，添加如下内容：
   ```ini
   [Unit]
   Description=Redis Server (AppImage)
   After=network.target

   [Service]
   ExecStart=/path/to/your/<AppImageFile> --daemonize no
   Restart=always
   User=redis-user
   Group=redis-group

   [Install]
   WantedBy=multi-user.target
   ```

4. 运行以下命令：
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start redis-appimage
   sudo systemctl enable redis-appimage
   ```

###### 使用 systemctl 启动和停止 Redis Stack
在后台启动 Redis 服务器：
```bash
sudo systemctl start redis-stack-server
```

停止服务：
```bash
sudo systemctl stop redis-stack-server
```

#### 在 Koishi 中配置 Redis Stack

将 Redis Stack 的连接地址填入`vector-database-service`中的`redisUrl`中即可。