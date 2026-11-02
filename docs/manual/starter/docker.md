# Docker 部署

ChatLuna v2 提供了基于 Docker Compose 的容器化部署方案。运行时环境、数据持久化卷与端口映射均已在 Compose 配置文件中准备就绪，后续升级时只需拉取并替换镜像即可。

## 启动实例

你可以直接克隆官方源码仓库，并使用 Docker Compose 启动容器实例。

### 1. 获取源码并启动

克隆 [ChatLuna v2 源码仓库](https://github.com/ChatLunaLab/v2)，然后在仓库根目录下执行启动命令：

```sh
# 后台启动常规服务实例（必须显式指定服务名 chatluna）
docker compose -f docker/compose.yml up -d chatluna

# 跟踪查看容器启动日志
docker compose -f docker/compose.yml logs -f chatluna
```

::: warning 必须显式指定服务名
`docker/compose.yml` 中定义了多个不同的服务配置，启动时必须明确指定服务名称 `chatluna`。如果直接执行 `docker compose up`，可能会触发非预期的构建或依赖行为。
:::

### 2. 访问 WebUI

服务启动完成后，在浏览器中打开 `http://127.0.0.1:5028`，即可进入 ChatLuna 的 WebUI 界面。

## 首次登录与口令机制

ChatLuna v2 提供了两种访问认证方式：「文件口令模式」和「固定口令模式」。

### 文件口令模式（默认）

这是系统默认启用的认证方式。当环境变量 `CHATLUNA_TOKEN` 为空且数据卷内尚无认证文件时，ChatLuna 会在首次启动时随机生成初始口令，并在日志中打印一次性登录链接：

- **日志保密**：初始口令仅供管理员在可信终端中查看。请勿将包含初始口令的日志截图或文本随意发送到公开 Issue 或社区交流群中。
- **不可逆存储**：数据卷内的认证文件仅保存口令哈希与签名密钥，系统本身无法还原出明文口令。
- **口令遗失处理**：如果不慎遗失口令，请先确认当前使用的是固定口令模式还是文件口令模式，切勿直接删除数据卷导致数据丢失。具体的重置流程请参考 [排错指南](/cookbook/troubleshooting)。

### 固定口令模式

如果你希望手动指定固定的访问口令，可以通过环境变量 `CHATLUNA_TOKEN` 来设置。为了确保安全性，设置的口令必须满足以下强度要求：

- 长度至少为 12 个字符
- 不包含空白字符
- 同时包含大写字母、小写字母、数字和符号四类字符中的至少三类
- 包含至少 6 种不同的字符

::: warning 口令强度不足的后果
若设置的 `CHATLUNA_TOKEN` 未达到上述强度要求，系统会自动忽略该环境变量，并回退到文件口令模式。
:::

## 网络与存储配置

了解容器的存储与端口映射规则，有助于你更好地管理和维护实例。

### 持久化与映射规则

ChatLuna 容器运行时的默认映射如下：

- **容器镜像 (Image)**：`ghcr.io/chatlunalab/chatluna`，镜像版本标签由 `CHATLUNA_TAG` 控制（默认为 `latest`）。
- **命名数据卷 (Named Volume)**：命名卷 `chatluna` 会挂载至容器内的 `/data` 目录，用于持久化保存实例配置、用户数据与运行状态。
- **端口映射 (Port Mapping)**：容器内的 `5028` 端口默认映射至宿主机的 `127.0.0.1:5028`。如果端口已被占用，可通过修改 `CHATLUNA_PORT` 调整宿主机的监听端口。

::: warning 远程服务器访问限制
宿主机端口默认仅绑定在 `127.0.0.1` 本地回环地址上。如果服务部署在远程服务器上，直接在本地浏览器访问 `http://127.0.0.1:5028` 只会访问你当前的本地设备，而无法连上远程容器。

此时你需要通过 SSH 隧道转发本地端口访问，或者在服务器端配置带有身份验证的反向代理。ChatLuna WebUI 的插件市场支持执行安装包，切勿在没有鉴权保护的情况下直接将端口暴露到公网。详细配置请参考 [公网部署指南](/manual/recipe/server)。
:::

### 环境变量参考

你可以在启动前通过配置环境变量来调整容器参数：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `CHATLUNA_TAG` | `latest` | 容器镜像标签版本 |
| `CHATLUNA_PORT` | `5028` | 宿主机映射的监听端口 |
| `CHATLUNA_TOKEN` | 空 | 固定访问口令；留空时自动启用文件口令模式 |
| `TZ` | `Asia/Shanghai` | 容器内时区设置，影响定时任务的触发时间 |

## 启用沙箱执行服务（可选）

如果你需要让智能体 (Agent) 在独立的 Docker 容器内执行代码，可以切换到沙箱服务 `chatluna-sandbox`。

常规服务 `chatluna` 与沙箱服务 `chatluna-sandbox` 共用相同的数据卷与端口映射，**两者互斥，同一时刻只能运行其中一个**。

### 切换至沙箱服务

只需停止正在运行的常规服务，再启动沙箱服务即可：

```sh
# 停止正在运行的常规服务
docker compose -f docker/compose.yml stop chatluna

# 启用 sandbox 配置组并启动沙箱容器
docker compose -f docker/compose.yml --profile sandbox up -d chatluna-sandbox
```

::: danger 沙箱特权与安全风险
`chatluna-sandbox` 服务挂载了宿主机的 `/var/run/docker.sock`，该权限等价于直接获得宿主机的 root 控制权，容器本身的隔离边界无法消除此风险。

1. 请根据宿主机实际的 Docker 用户组 GID 设置正确的 `DOCKER_GID` 环境变量。
2. 遇到权限报错时，切勿全局放宽 `/var/run/docker.sock` 的权限（如执行 `chmod 777`）。
3. 启用沙箱服务前，请完整通读 [机器与工作区](/manual/usage/machines) 以及 [权限与安全](/manual/usage/permissions)。
:::

## 下一步

- [快速上手](../quickstart)：完成首次登录后的初始化模型配置
- [公网部署](/manual/recipe/server)：配置安全的反向代理与域名访问
- [机器与工作区](/manual/usage/machines)：了解执行环境与容器沙箱机制
- [权限与安全](/manual/usage/permissions)：配置安全策略与权限边界
- [排错指南](/cookbook/troubleshooting)：排查容器启动异常与口令问题
