# Docker 部署

ChatLuna v2 提供了基于 Docker Compose 的容器化部署方案。运行时环境、数据卷持久化与端口映射均由 Compose 文件统一定义，后续升级只需拉取并替换镜像。

## 启动实例

你可以通过获取官方源码仓库，使用 Docker Compose 启动容器实例。

### 1. 获取源码并启动

克隆 [ChatLuna v2 源码仓库](https://github.com/ChatLunaLab/v2)，在仓库根目录下执行启动命令：

```sh
# 后台启动常规服务实例（必须显式指定服务名 chatluna）
docker compose -f docker/compose.yml up -d chatluna

# 跟踪查看容器启动日志
docker compose -f docker/compose.yml logs -f chatluna
```

::: warning 必须显式指定服务名
`docker/compose.yml` 中定义了多个服务配置，因此启动时必须明确指定服务名称 `chatluna`。如果省略服务名直接执行 `docker compose up`，可能会触发非预期的构建或依赖行为。
:::

### 2. 访问 WebUI

服务启动完成后，在浏览器中打开 `http://127.0.0.1:5028` 即可进入 WebUI 界面。

## 首次登录与口令机制

ChatLuna v2 支持「固定口令模式」与「文件口令模式」。

### 文件口令模式（默认）

当环境变量 `CHATLUNA_TOKEN` 为空且数据卷内尚无认证文件时，系统会在首次启动日志中随机生成初始口令，并打印一次性登录链接：

- **日志保密**：初始口令仅在可信终端中查看。切勿将包含初始口令的日志截图或文本复制发送到公开 Issue 或社区交流群。
- **不可逆存储**：数据卷内的认证文件仅保存口令哈希与签名密钥，系统无法找回明文口令。
- **口令遗失处理**：若遗失口令，请先确认当前使用的是固定口令模式还是文件模式，不要直接删除数据卷导致数据丢失。具体重置流程见[排错指南](/cookbook/troubleshooting)。

### 固定口令模式

若通过环境变量 `CHATLUNA_TOKEN` 指定了固定访问口令，口令必须严格满足以下强度要求：

- 长度至少为 12 个字符；
- 不得包含空白字符；
- 必须同时覆盖大写字母、小写字母、数字和符号四类字符中的至少三类；
- 包含至少 6 种不同的字符。

::: warning 口令强度不足的后果
若设置的 `CHATLUNA_TOKEN` 未达到上述强度要求，系统会自动忽略该环境变量，并回退到文件口令模式。
:::

## 网络与存储配置

### 持久化与映射规则

- **容器镜像 (Image)**：`ghcr.io/chatlunalab/chatluna`，镜像版本标签由 `CHATLUNA_TAG` 控制（默认为 `latest`）。
- **命名数据卷 (Named Volume)**：命名卷 `chatluna` 挂载至容器内的 `/data` 目录，用于持久化保存实例配置、用户数据与运行状态。
- **端口映射 (Port Mapping)**：容器内的 `5028` 端口默认映射至宿主机的 `127.0.0.1:5028`。可通过修改 `CHATLUNA_PORT` 调整宿主机监听端口。

::: warning 远程服务器访问限制
宿主机端口默认仅绑定至 `127.0.0.1` 本地回环地址。若部署在远程服务器上，直接在本地浏览器访问 `http://127.0.0.1:5028` 将指向你当前的本地电脑，无法连接到远程容器。

你需要通过 SSH 隧道转发本地端口访问，或者在服务器端配置带有身份验证的反向代理。ChatLuna WebUI 的插件市场支持执行安装包，切勿在未配置鉴权保护的情况下直接将端口暴露到公网。详细配置请参考[公网部署指南](/manual/recipe/server)。
:::

### 环境变量参考

你可以通过在启动前配置环境变量来调整容器参数：

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

运行以下命令停止常规服务并启动沙箱服务：

```sh
# 停止正在运行的常规服务
docker compose -f docker/compose.yml stop chatluna

# 启用 sandbox 配置组并启动沙箱容器
docker compose -f docker/compose.yml --profile sandbox up -d chatluna-sandbox
```

::: danger 沙箱特权与安全风险
`chatluna-sandbox` 服务挂载了宿主机的 `/var/run/docker.sock`，该权限等价于直接获得宿主机的 root 控制权，容器本身的隔离边界无法消除此项风险。

1. 请根据宿主机实际的 Docker 用户组 GID 设置正确的 `DOCKER_GID` 环境变量。
2. 遇到权限报错时，绝对不要全局放宽 `/var/run/docker.sock` 的权限（如执行 `chmod 777`）。
3. 启用沙箱服务前，请完整通读[机器与工作区](/manual/usage/machines)以及[权限与安全](/manual/usage/permissions)。
:::

## 下一步

- [快速上手](../quickstart)：完成首次登录后的初始化模型配置
- [公网部署](/manual/recipe/server)：配置安全的反向代理与域名访问
- [机器与工作区](/manual/usage/machines)：了解执行环境与容器沙箱机制
- [权限与安全](/manual/usage/permissions)：配置安全策略与权限边界
- [排错指南](/cookbook/troubleshooting)：排查容器启动异常与口令问题
