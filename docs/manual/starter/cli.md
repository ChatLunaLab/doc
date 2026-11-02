# 命令行（CLI）

全局启动器 `chatluna` 负责在你本机的 `~/.chatluna/instances/` 目录下创建、运行与管理各个实例。

为了保障稳定性，启动器自身不直接加载插件，而是将每个实例交给独立的守护进程（supervisor）托管，具体的环境诊断与数据导出则由实例内置的 `@chatluna/cli` 完成。这种分层设计既能确保实例在异常时自动恢复，也便于在不同实例之间平滑切换。

## 安装

安装 ChatLuna 最直接的方式是通过 npm 全局安装启动器：

```sh
npm i -g chatluna
```

运行 ChatLuna 需要 Node.js 24 或更高版本。

这里的全局包名为 `chatluna`，而实例内部自带的命令行是 `@chatluna/cli`。全局的 `chatluna` 负责管理本机的所有实例，而 `@chatluna/cli` 负责在实例内部执行具体的诊断命令。安装完成后，你就可以在终端中直接调用 `chatluna` 命令了。

## 创建并启动

环境准备就绪后，只需两条命令即可完成实例的创建与启动：

```sh
chatluna create demo
chatluna start demo
```

当你需要初始化一个新的机器人实例时，可以使用 `create` 命令。该命令默认会拉取 `@chatluna/boilerplate` 模板；若因网络原因拉取失败，会自动降级使用内置骨架。创建完成后，本地将生成对应的实例目录与基础依赖。

创建实例时还支持以下选项：
- `--template`：指定自定义模板，支持 `npm 包名[@范围]` 或 `github:owner/repo[#ref]`。
- `--pm`：指定包管理器（支持 npm、pnpm、yarn、bun）。

实例创建完成后，运行 `chatluna start demo` 即可在守护进程下启动实例。如果直接执行不带参数的 `chatluna`，效果等同于 `start`：首次执行时会自动创建默认实例并启动。

如果希望让实例在后台运行，追加 `--detach` 选项即可将守护进程转入后台，日志会自动写入 `~/.chatluna/logs/<名字>.log`。启动成功后，终端或日志中会打印出带有登录口令的 Web 地址，默认是 `http://127.0.0.1:5028`。

::: warning
`--detach` 只是将进程转入后台，不会注册开机自启。如需开机运行，请自行配置 systemd、launchd 或容器编排。
:::

## 查看与控制

随着实例的增多，你可以随时查看它们的状态并控制运行进程：

```sh
chatluna list
chatluna list --plugins --instance demo
chatluna stop demo
chatluna restart demo
```

- `chatluna list`：查看本地所有实例的运行状态、版本与所在目录。
- `chatluna list --plugins --instance demo`：查看指定实例解析后的全部依赖。链接进来的本地包会带有专属标记，方便排查依赖问题。
- `chatluna stop demo`：停止运行中的实例。执行后会向对应实例发送终止信号并平稳退出。
- `chatluna restart demo`：重启实例。修改配置或完成更新后，可用此命令通知守护进程重启实例，终端将实时展示启动流程。

## 开发模式

在本地编写插件或排查底层问题时，推荐使用开发模式：

```sh
chatluna dev ./my-instance
```

当你需要调试某个目录下的源码或插件时，执行 `chatluna dev <路径>` 即可。

开发模式通过 oxc-node 直接加载 TypeScript 源码并启用热重载，保存代码即可立即生效。同时，开发模式下不会启用崩溃恢复与安全模式——这样在本地开发时，你可以直接看到真实的错误调用栈，而不会被系统的容灾机制自动拦截兜底。启动后，终端会实时输出热重载动态与报错信息。

## 插件管理

你可以直接通过命令行来管理实例的依赖与插件：

```sh
chatluna add @chatluna/tool-fs
chatluna remove @chatluna/tool-fs
chatluna link ../my-plugin
chatluna unlink chatluna-plugin-my
chatluna new plugin my --webui --service
```

在日常开发与使用中，你可以根据不同场景使用对应的命令：
- `chatluna add <包名>`：为实例安装新插件。该命令会调用实例自带的包管理器直接修改依赖，安装成功后终端会给出相应提示。
- `chatluna remove <包名>`：移除不再需要的插件，并从实例依赖中彻底删除指定包。
- `chatluna link <目录>`：在本地开发插件并接入实例调试时使用。插件会以符号链接的形式接入实例，修改代码后重启实例即可生效；测试完成后，执行 `chatluna unlink <包名>` 即可解除链接。
- `chatluna new plugin <名字>`：创建新插件。该命令会在实例或项目的 `external/<名字>` 目录下生成标准骨架。

创建插件时，常用选项包括：
- `--webui`：同时生成浏览器前端页面与多语言文件。
- `--service`：同时生成服务（Service）模板骨架。
- `--scope`：指定发布时使用的 npm 作用域。

## 更新

ChatLuna 提供了安全的更新机制，以避免升级意外导致实例损坏：

```sh
chatluna update demo --dry-run
chatluna update demo
chatluna update --self
chatluna update demo --plugins --to @chatluna/tool-fs@1.2.3
```

更新的核心策略是「先安全后执行」：更新时会先为配置创建快照，再执行升级，最后进行健康检查；一旦自检失败会自动回滚，确保服务不中断。

常用更新命令及使用场景如下：
- `chatluna update demo --dry-run`：正式升级前预览变更。追加 `--dry-run` 只会打印版本对比与更新计划，不会实际修改任何文件。
- `chatluna update demo`：将实例升级到最新版本。执行后会自动完成快照、更新与健康检查，并输出更新结果。
- `chatluna update --self`：当全局启动器自身发布了新版本时使用，`--self` 仅更新全局启动器本体。
- `chatluna update demo --plugins --to @chatluna/tool-fs@1.2.3`：仅更新插件或锁定版本。`--plugins` 仅更新实例插件，`--to` 则用于将指定包固定在某个版本。

## 诊断与导出

排查异常或提取数据时，无需打开 Web 控制台，在终端中即可直接完成：

```sh
chatluna doctor
chatluna doctor session <会话id>
chatluna doctor providers
chatluna export <会话id>
```

`doctor` 与 `export` 会将参数直接转交给实例内部的 `@chatluna/cli` 执行：
- `chatluna doctor`：检查整体状态。执行后会输出运行环境、核心依赖与配置的自检清单。
- `chatluna doctor session <会话id>`：排查特定会话是否受损。该命令直接读取本地数据库，无需运行实例即可执行，执行后会输出该会话的上下文健康状况。
- `chatluna doctor providers`：排查模型提供商的连通性。需要实例处于在线状态，执行后会输出各提供商的延迟与连通性自检结果。
- `chatluna export <会话id>`：导出或备份某次会话记录。同样直接读取本地数据库，无需启动实例，执行后会输出该会话的完整结构化数据。

完整诊断判定规则见 [命令行诊断](/cookbook/cli)。

## 修复与报告

当实例发生未知故障或无法正常启动时，可以使用内置的修复与上报功能：

```sh
chatluna repair demo
chatluna report demo
```

- `chatluna repair demo`：在实例启动失败或运行严重异常时使用。该命令会自动收集现场错误信息，并调用本地 Agent 尝试执行一次自动修复，执行后会输出诊断与修复尝试结果。
- `chatluna report demo`：自动修复未解决问题、需要提交反馈时使用。执行后会在终端输出最近一次修复的完整报告，可以直接作为反馈 Issue 或求助的问题草稿。

## 全局配置

启动器的全局配置存放在 `~/.chatluna/config.yml` 中。如果需要自定义配置目录，可以通过环境变量 `CHATLUNA_HOME` 进行重定向。

常用配置项说明如下：

| 配置项 | 说明 |
| --- | --- |
| `default` | 不指定名称执行 `start` 时默认选中的实例 |
| `registry` | 安装与更新检查使用的 npm registry |
| `updateChannel` | 默认模板使用的发布标签（`latest`、`next` 等） |
| `update.check` | 是否在启动时检查更新 |
| `repair.agents` / `repair.agent` | 修复流程可用的本地 Agent 与首选 Agent |

## 下一步

到这里，你已经掌握了 ChatLuna 命令行的全部日常操作！接下来可以继续阅读：

- [快速上手](../quickstart) — 完成实例的首次配置
- [命令行诊断](/cookbook/cli) — 每个诊断子命令检查什么
- [命令行参考](/api/cli) — 全部子命令与参数
