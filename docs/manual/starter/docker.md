# Docker 部署

::: tip
ChatLuna v2 提供 Docker Compose 部署方案。运行环境、数据卷和端口映射都已在 Compose 文件中配好，升级时只需换镜像。
:::

## 启动实例

克隆 [ChatLuna v2 源码仓库](https://github.com/ChatLunaLab/v2)，在仓库根目录执行：

```sh
# 后台启动（必须显式指定服务名 chatluna）
docker compose -f docker/compose.yml up -d chatluna

# 查看启动日志
docker compose -f docker/compose.yml logs -f chatluna
```

::: warning
`docker/compose.yml` 中定义了多个服务，必须指定服务名 `chatluna`。直接执行 `docker compose up` 可能触发非预期的构建或依赖行为。
:::

启动后在浏览器中打开 `http://127.0.0.1:5028` 进入 WebUI。

## 首次登录

访问认证有两种模式。

**文件口令模式**（默认）：`CHATLUNA_TOKEN` 为空且数据卷中没有认证文件时，首次启动会生成随机口令，并在日志中打印一次登录链接。

- 认证文件只保存口令哈希和签名密钥，无法还原明文。
- 不要把含有口令的日志发到公开 Issue 或群里。
- 口令丢了不要直接删数据卷，重置方法见 [排错指南](/cookbook/troubleshooting)。

**固定口令模式**：通过环境变量 `CHATLUNA_TOKEN` 指定口令。口令必须满足：

- 至少 12 个字符，不含空白字符。
- 大写字母、小写字母、数字、符号四类中至少包含三类。
- 至少 6 种不同的字符。

::: warning
`CHATLUNA_TOKEN` 强度不够时会被忽略，系统回退到文件口令模式。
:::

## 存储与端口

- **镜像**：`ghcr.io/chatlunalab/chatluna`，标签由 `CHATLUNA_TAG` 控制。
- **数据卷**：命名卷 `chatluna` 挂载到容器的 `/data`，保存配置、用户数据和运行状态。
- **端口**：容器的 `5028` 映射到宿主机的 `127.0.0.1:5028`，可用 `CHATLUNA_PORT` 修改宿主机端口。

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `CHATLUNA_TAG` | `latest` | 镜像标签 |
| `CHATLUNA_PORT` | `5028` | 宿主机端口 |
| `CHATLUNA_TOKEN` | 空 | 固定口令；留空使用文件口令模式 |
| `TZ` | `Asia/Shanghai` | 容器时区，影响定时任务的触发时间 |

::: warning
宿主机端口默认只绑定 `127.0.0.1`。部署在远程服务器上时，本地浏览器访问 `127.0.0.1:5028` 连不到容器，需要用 SSH 隧道，或在服务器上配置带认证的反向代理。WebUI 的插件市场可以安装软件包，不要在没有认证的情况下把端口暴露到公网，详见 [反向代理与网络接入](/cookbook/deployment)。
:::

## 沙箱服务（可选）

需要让智能体在独立的 Docker 容器中执行代码时，改用沙箱服务 `chatluna-sandbox`。它与 `chatluna` 共用数据卷和端口，两者同一时刻只能运行一个：

```sh
docker compose -f docker/compose.yml stop chatluna
docker compose -f docker/compose.yml --profile sandbox up -d chatluna-sandbox
```

::: danger
`chatluna-sandbox` 挂载了宿主机的 `/var/run/docker.sock`，等同于宿主机的 root 权限，容器隔离无法消除这一风险。

1. 按宿主机 Docker 用户组的 GID 设置 `DOCKER_GID`。
2. 遇到权限报错时，不要全局放宽 `/var/run/docker.sock` 的权限（如 `chmod 777`）。
3. 启用前请读完 [机器与工作区](/manual/usage/machines) 和 [权限与安全](/manual/usage/permissions)。
:::

## 下一步

- [快速上手](../quickstart) — 登录后配置模型。
- [反向代理与网络接入](/cookbook/deployment) — 反向代理与域名访问。
- [机器与工作区](/manual/usage/machines) — 执行环境与容器沙箱。
- [排错指南](/cookbook/troubleshooting) — 容器启动和口令问题。
