# 命令行（CLI）

全局启动器 `chatluna` 用于在你本机的 `~/.chatluna/instances/` 目录下创建并管理实例。你可以通过它在单台机器上运行一个或多个互相独立的 ChatLuna 实例。

## 安装 CLI

在终端中执行以下命令全局安装启动器：

```sh
npm i -g chatluna
```

运行 ChatLuna CLI 需要 Node.js 24 或更高版本。

::: tip
全局启动器的包名是 `chatluna`，而实例内部运行的命令行是 `@chatluna/cli`，两者属于不同层级。安装时请认准 v2 发布版本，避免与历史同名工具冲突。
:::

## 创建并启动实例

你可以通过 `create` 命令从模板初始化一个新实例，并使用 `start` 命令启动它：

```sh
# 从默认模板创建名为 demo 的实例
chatluna create demo

# 启动 demo 实例
chatluna start demo
```

- `chatluna create` 会在 `~/.chatluna/instances/demo` 路径下生成实例。默认使用 `@chatluna/boilerplate` 模板，你也可以指定 `github:owner/repo` 形式的私有模板。
- `chatluna start` 会在进程守护程序 (Supervisor) 下启动该实例。Supervisor 负责运行健康检查 (Health Check)、崩溃重启以及安全模式 (Safe Mode)。
- 如果直接运行不带参数的 `chatluna`，其行为等价于 `chatluna start`：在首次执行时，它会自动创建名为 `default` 的实例并启动。

实例启动后，在浏览器中打开 `http://127.0.0.1:5028` 即可进入 Web 控制台 (WebUI)。

## 管理实例生命周期

你可以使用以下命令查看当前所有实例的状态，或控制实例的运行状态：

```sh
# 列出全部实例
chatluna list

# 列出全部实例并展示各实例安装的插件
chatluna list --plugins

# 停止指定的实例
chatluna stop demo

# 重启指定的实例
chatluna restart demo

# 在后台启动实例
chatluna start demo --detach
```

::: warning
`--detach` 参数仅将当前实例进程放入后台执行，不会向操作系统注册开机自启服务（如 systemd）。如果需要在系统启动时自动运行实例，请自行配置对应的系统服务。
:::

## 管理实例插件

你可以通过 CLI 直接为指定实例安装、移除或链接插件 (Plugin)：

```sh
# 为当前实例安装插件
chatluna add <插件名>

# 从当前实例移除插件
chatluna remove <插件名>

# 将本地目录以符号链接形式接入实例作为插件（用于本地开发）
chatluna link <路径>

# 解除本地插件链接
chatluna unlink <名字>

# 在实例的 external/ 目录下脚手架一个新插件项目
chatluna new plugin <名字>
```

## 诊断与导出数据

诊断与导出命令由实例内部包含的 `@chatluna/cli` 负责解析执行：

```sh
# 检查当前实例的组合清单与包契约（包含安全检查）
chatluna doctor

# 检查指定会话的不变量与数据完整性
chatluna doctor session <会话id>

# 检查模型提供商 (Provider) 的网络连通性（需要实例进程正在运行）
chatluna doctor providers

# 将指定会话的数据全量导出为 JSONL 文件
chatluna export <会话id>
```

::: tip
读取会话的子命令（如 `doctor session` 和 `export`）支持完全离线工作。它们直接读取本地 SQLite 数据库文件，不依赖正在运行的实例进程。
:::

## 修改全局配置

全局启动器的配置文件位于 `~/.chatluna/config.yml`。你可以通过设置 `CHATLUNA_HOME` 环境变量更改配置目录路径。

配置文件支持以下字段：

| 配置键 | 说明 |
| --- | --- |
| `default` | 执行 `chatluna start` 未指定实例名称时默认选取的实例 |
| `registry` | 执行安装与更新检查时使用的 npm registry 地址 |
| `updateChannel` | 执行 `chatluna update` 时使用的发布通道 |

## 下一步

- 前往[快速上手](../quickstart)完成实例的基本配置
- 查看[命令行参考](/api/cli)获取全部子命令与参数列表
