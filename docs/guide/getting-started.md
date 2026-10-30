# 安装与启动

ChatLuna v2 是基于 Cordis 4 的独立应用，目前处于 alpha 阶段。它不是在现有 Koishi 实例中更新 v1 插件就能得到的新版本。初次体验推荐使用官方 Docker Compose；需要修改框架或开发插件时，选择源码工作区。已有 v1 用户请先查阅[迁移指南](/guide/migration)。

## 选择部署方式

| 方式 | 适合场景 | 环境要求与前置准备 |
| --- | --- | --- |
| Docker Compose | 本机快速体验、独立服务器生产试运行 | Docker Engine / Desktop 与 Compose，可信的镜像来源 |
| 全局 Launcher | 单机管理多个独立实例 | Node.js 24+，已安装当前 v2 版本的 `chatluna` launcher 与可用实例模板 |
| 源码工作区 | 插件开发、调试框架底层 | Node.js 24+，仓库声明的 Yarn 4 与源码 |

> **版本说明**：alpha 文档中引用的 npm 包名与镜像标签并不保证已在所有公共源或所有体系架构镜像中同步发布。生产试运行必须锁定经过验证的具体版本；更新前做好全量备份，切勿直接在生产实例上测试未知插件。

---

## Docker Compose 部署

获取 [ChatLuna v2 源码](https://github.com/ChatLunaLab/v2)，在仓库根目录执行部署命令：

```sh
docker compose -f docker/compose.yml up -d chatluna
docker compose -f docker/compose.yml logs -f chatluna
```

此处必须明确指定启动服务 `chatluna`。

### 网络与存储结构

- **镜像与数据卷**：默认使用镜像 `ghcr.io/chatlunalab/chatluna:latest`，命名卷 `chatluna` 会挂载至容器内部的 `/data` 目录，用于持久化保存实例配置与运行数据。
- **端口映射**：默认宿主端口映射为 `127.0.0.1:5028`。部署在本地机器时，通过浏览器打开 `http://127.0.0.1:5028` 即可访问。
- **网络隔离边界**：容器内部监听所有网卡并接受容器网络访问；而宿主端口默认仅发布到 `127.0.0.1` 回环地址。这是两层独立的配置，不能将其概括为“任何部署都默认只监听本机”。当部署在远程服务器时，本地浏览器访问 `127.0.0.1:5028` 指向的是客户端本地电脑而非服务器；应使用安全 SSH 隧道访问，或参考后文与安全指南配置受保护的反向代理。

### 环境变量参考

| Compose 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `CHATLUNA_TAG` | `latest` | 容器镜像标签，实际可用标签以官方发布记录为准 |
| `CHATLUNA_PORT` | `5028` | 宿主机映射端口 |
| `CHATLUNA_TOKEN` | 空 | 可选的固定访问口令；留空时自动进入文件口令模式 |
| `TZ` | `Asia/Shanghai` | 容器时区，影响本地时间解析与定时任务调度 |

### 首次登录认证

当未设置固定强口令且数据卷内尚无认证文件时，启动日志会随机生成并在控制台一次性输出初始访问口令及登录链接。

- **日志保密**：请只在可信终端查看该日志，切勿将包含口令或 Token 的日志完整粘贴至公开 Issue 或技术社区中。
- **哈希存储**：认证文件持久化保存口令的哈希值与签名密钥，不支持找回明文。
- **口令复杂度要求**：若通过环境变量或配置手动指定固定口令，口令必须满足：长度至少 12 个字符、不含空白符、包含大写字母/小写字母/数字/特殊符号四类字符中的至少三类，且至少包含六种不同字符。若提供的固定口令强度不足，系统会忽略该口令并在启动诊断中告警，同时自动回退至文件模式。
- 若遗忘口令，请先根据[排错指南](/guide/troubleshooting)核对当前属于环境变量固定模式还是文件模式，不可随意删除整个数据卷。

### 可选 Docker 执行后端（沙箱环境）

常规服务 `chatluna` 与沙箱服务 `chatluna-sandbox` 共用宿主端口和数据卷，**两者互斥，同一时刻只能运行其中一个**。只有在需要由 Agent 在独立 Docker 工作容器中执行代码与任务时才启用后者，启用前必须通读[机器与工作区](/guide/machines)以及[安全与权限](/guide/security)。

从普通服务切换至沙箱服务的命令：

```sh
docker compose -f docker/compose.yml stop chatluna
docker compose -f docker/compose.yml --profile sandbox up -d chatluna-sandbox
docker compose -f docker/compose.yml logs -f chatluna-sandbox
```

> **风险警示**：`chatluna-sandbox` 挂载了宿主机的 Docker socket，具备接管宿主机控制权的潜在能力，容器隔离本身无法抵消这一风险。不要为了解决连接报错而盲目放宽 `/var/run/docker.sock` 的全局读写权限，应按宿主环境核对并设置正确的 `DOCKER_GID`。此外，默认完整镜像包含浏览器、Python、Go 等执行运行时；lite 变体镜像主要仅含 Node.js 环境，具体镜像产物与内容以发布为准。

---

## 全局 Launcher 部署

当全局环境中安装了当前 v2 版本的 CLI 工具时，可利用 Launcher 创建并管理实例：

```sh
chatluna create demo
chatluna start demo
chatluna list
```

- **目录结构**：实例默认位于 `~/.chatluna/instances/demo`。
- **包名区分**：全局 Launcher 的 npm 包名为 `chatluna`，它与实例内部运行的 `@chatluna/cli` 属于不同层级。安装时务必指定匹配 v2 的发布版本与模板，避免与历史同名工具版本冲突。
- **进程模式**：使用 `chatluna start demo --detach` 仅表示将进程置于后台执行，并不等同于在操作系统中注册开机自启服务（如 systemd）。
- **停止实例**：执行 `chatluna stop demo`。详细参数与多目录选项见[命令行参考](/reference/cli)。

---

## 源码工作区运行

本地开发与调试框架需要在 v2 仓库根目录中使用仓库声明的 Yarn 4 环境：

```sh
yarn install
yarn build
yarn chatluna start
```

### 构建要求与清单结构

- **编译产物**：在拉取新包或依赖发生变更后，必须先执行 `yarn build`。代码类型检查（typecheck）通过并不代表已编译生成运行时所需的 `lib` 产物。
- **配置组合**：源码默认使用根清单 `cordis.yml` 装配基础设施，并在其内部 `include` 业务清单 `chatluna.yml`。系统运行于单一实例内，并非分别针对两份文件启动两个独立进程。

### 本地开发模式

使用以下命令启动开发模式：

```sh
yarn chatluna dev .
```

- **执行特征**：`dev` 命令遵循与生产相同的根清单查找逻辑，并在运行期特异性激活配置清单中 `id: dev` 的配置组。开发命令不会自动加载未声明的 `cordis.dev.yml`。
- **机制差异**：开发模式启用 tsx 即时转译与热重载（HMR），但会关闭生产 supervisor 的恢复逻辑与安全模式。严禁直接使用包含生产机密的共享清单进行本地调试，更不得将包含个人 Token 或凭据的配置文件提交到仓库中。

### 配置诊断

检查当前目录下的清单配置有效性：

```sh
yarn chatluna doctor config --dir .
```

- **本地覆盖规则**：若使用了本地扩展配置文件，必须由实际被加载的根清单显式 `include`。任意命名的 `chatluna.local.yaml` 不会被系统隐式自动读取。
- **控制台端口区分**：Cordis 框架控制台（默认端口通常为 6140，默认处于关闭状态）与 ChatLuna WebUI（端口 5028）是两个独立的入口，两者的端口和访问路径不能互相混淆或直接替代。

---

## 远程访问与数据备份

### 远程访问安全链

暴露远程访问涉及多个相互耦合的安全层次，包含：绑定监听地址、宿主机映射端口、清单中的 `allowRemote` 项、HTTPS 反向代理配置以及访问口令认证。

任何情况下都不能仅改动某一项就全盘关停其他安全检查。特别注意：绝对不要将暴露有插件与依赖包安装权限的底层 `/console` 入口未经鉴权开放至公网。完整网络配置准则见[安全与权限](/guide/security)。

### 备份规范

- 普通的重启或停止操作（如 `docker compose stop`）不会删除持久化数据。不要为了排查普通启动故障随意运行带有 `-v`（卷删除）标记的销毁命令。
- 在升级版本前，请完整备份：
  1. 根清单文件及所有被 include 的子配置文件；
  2. `package.json` 与对应的锁文件（如 `yarn.lock`）；
  3. 数据库文件或导出转储（在数据库服务运行中直接对文件进行文件级拷贝无法保证数据一致性）；
  4. 专用数据持久化目录与密钥存储文件。
- 实例各路径定位详见[配置参考](/reference/configuration)。

完成部署并能正常访问界面后，请根据[首次配置指南](/guide/configuration)完成初始化流程：优先跑通至少一个实际模型接口测试，随后连接目标平台并设置主人身份，最后在会话中发送消息完成端到端对话验证。
