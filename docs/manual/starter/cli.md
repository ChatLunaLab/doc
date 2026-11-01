# 命令行（CLI）

全局启动器 `chatluna` 负责在你本机的 `~/.chatluna/instances/` 目录下创建、运行与管理各个实例。

为了保障稳定性，启动器自身不直接加载插件，而是把每个实例交给独立的守护进程（supervisor）托管，具体的环境诊断与数据导出则由实例自带的 `@chatluna/cli` 完成。这种分层设计既保障了实例异常时的自动恢复，也便于在不同实例之间平滑切换。

## 安装

安装 ChatLuna 最直接的方式是通过 npm 安装全局启动器：

```sh
npm i -g chatluna
```

运行 ChatLuna 需要 Node.js 24 或更高版本。

这里的全局包名为 `chatluna`，而实例内部自带的命令行是 `@chatluna/cli`。全局的 `chatluna` 负责管理整机的所有实例，而 `@chatluna/cli` 负责在实例内部执行具体的诊断命令。安装完成后，终端便可以直接调用 `chatluna` 命令。

## 创建并启动

准备好环境后，通过两条命令即可完成实例的创建与启动：

```sh
chatluna create demo
chatluna start demo
```

当你需要初始化一个新的机器人实例时，使用 `create`。该命令默认从 `create-chatluna` 模板拉取骨架；若因网络原因拉取失败，会自动退回内置骨架。创建完成后，本地将生成对应的实例目录与基础依赖。

创建时还可以按需搭配选项：
- `--template`：指定自定义模板，支持 `npm 包名[@范围]` 或 `github:owner/repo[#ref]`。
- `--pm`：指定包管理器（支持 npm、pnpm、yarn、bun）。

实例建好后，运行 `chatluna start demo` 即可在守护进程下启动实例。事实上，直接执行不带参数的 `chatluna` 等同于 `start`：首次执行时会自动创建默认实例并启动。

如果希望转入后台运行，追加 `--detach` 选项即可将守护进程放入后台，日志自动写入 `~/.chatluna/logs/<名字>.log`。启动成功后，终端或日志中会打印出带有口令的登录地址，默认是 `http://127.0.0.1:5028`。

::: warning
`--detach` 只是把进程放到后台，不会注册开机自启。需要开机运行请自行配置 systemd、launchd 或容器编排。
:::

## 查看与控制

随着实例增多，你可以随时查看状态并控制进程：

```sh
chatluna list
chatluna list --plugins --instance demo
chatluna stop demo
chatluna restart demo
```

- `chatluna list`：想了解本地已有哪些实例及运行状态时使用，跑完后终端会以列表呈现每个实例的运行状态、版本与所在目录。
- `chatluna list --plugins --instance demo`：排查实例依赖时使用，加 `--plugins` 会列出该实例解析后的全部依赖，链接进来的本地包还会带上专属标记。
- `chatluna stop demo`：需要暂停运行实例时使用，执行后会向对应实例发送中止信号并平稳退出。
- `chatluna restart demo`：修改配置或更新后需要重新加载时使用，跑完会通知守护进程重启实例，终端刷新启动流程。

## 开发模式

本地编写插件或排查底层问题时，推荐使用开发模式：

```sh
chatluna dev ./my-instance
```

当你需要调试某个目录下的源码或插件时，使用 `chatluna dev <路径>`。

开发模式通过 tsx 直接加载 TypeScript 源码并开启热重载，保存代码即可即时生效。同时，开发模式下特意不启用崩溃恢复与安全模式——因为在本地开发时，你应该直接看到真实的错误调用栈，而不是被系统的容灾机制自动兜底。启动后，终端会实时输出热重载动态与报错信息。

## 插件管理

你可以直接通过命令行来管理实例依赖与插件：

```sh
chatluna add @chatluna/tool-fs
chatluna remove @chatluna/tool-fs
chatluna link ../my-plugin
chatluna unlink chatluna-plugin-my
chatluna new plugin my --webui --service
```

在日常开发与使用中，不同场景对应不同的命令：
- `chatluna add <包名>`：为实例安装新插件时使用，调用实例自带的包管理器直接修改依赖，跑完看到插件安装成功的提示。
- `chatluna remove <包名>`：移除不再需要的插件时使用，跑完从实例依赖中彻底删除指定包。
- `chatluna link <目录>`：本地开发插件想要接入实例测试时使用，以符号链接方式接入实例，改完代码重启即可生效；测试完毕后，使用 `chatluna unlink <包名>` 解除链接。
- `chatluna new plugin <名字>`：准备编写新插件时使用，在实例或项目的 `external/<名字>` 下生成标准骨架。

创建插件时，常用选项包括：
- `--webui`：同时生成浏览器前端页面与多语言文件。
- `--service`：同时生成服务（Service）模板骨架。
- `--scope`：指定发布时使用的 npm 作用域。

## 更新

ChatLuna 提供了安全的更新流程，避免升级意外导致实例损坏：

```sh
chatluna update demo --dry-run
chatluna update demo
chatluna update --self
chatluna update demo --plugins --to @chatluna/tool-fs@1.2.3
```

更新的核心策略是「先安全后执行」：更新时会先对配置拍下快照，再执行升级，最后做健康检查；一旦自检失败会自动回滚，确保服务不中断。

各个命令的使用时机与反馈如下：
- `chatluna update demo --dry-run`：正式升级前使用，`--dry-run` 只打印版本对比与更新计划，不实际变动任何文件。
- `chatluna update demo`：需要将实例升级到最新版本时使用，跑完自动完成快照、更新与健康检查并输出结果。
- `chatluna update --self`：CLI 启动器自身有了新版本时使用，`--self` 只更新全局启动器本身。
- `chatluna update demo --plugins --to @chatluna/tool-fs@1.2.3`：只想更新插件或锁定版本时使用，`--plugins` 只更新实例插件，`--to` 则用于将某个包钉在指定版本。

## 诊断与导出

排查异常或提取数据时，无需打开 Web 控制台，直接在终端即可完成：

```sh
chatluna doctor
chatluna doctor session <会话id>
chatluna doctor providers
chatluna export <会话id>
```

`doctor` 与 `export` 会把参数直接转交给实例内部的 `@chatluna/cli` 执行：
- `chatluna doctor`：检查整体状态时使用，跑完输出运行环境、核心依赖与配置的自检清单。
- `chatluna doctor session <会话id>`：排查特定会话是否受损时使用，直接读取本地数据库，实例未运行也可执行，跑完输出该会话的上下文健康状况。
- `chatluna doctor providers`：排查模型提供商连通性时使用，需要实例处于在线状态，跑完输出各提供商的延迟与连通性自检结果。
- `chatluna export <会话id>`：导出或备份某次会话记录时使用，同样直接读取本地数据库，无需启动实例，跑完输出该会话的完整结构化数据。

完整诊断判定规则见[命令行诊断](/cookbook/cli)。

## 修复与报告

当实例发生未知故障或无法正常拉起时，可以使用内置的修复与上报功能：

```sh
chatluna repair demo
chatluna report demo
```

- `chatluna repair demo`：实例启动失败或运行严重异常时使用，命令会自动收集现场错误信息，并调度本地 Agent 尝试执行一次自动修复，跑完输出修复诊断与尝试结果。
- `chatluna report demo`：自动修复未解决、需要提交反馈时使用，跑完在终端展示最近一次修复的完整报告，可以直接作为 Issue 或求助的问题草稿。

## 全局配置

启动器的全局配置存放在 `~/.chatluna/config.yml` 中。如果需要自定义配置目录，可以通过环境变量 `CHATLUNA_HOME` 进行重定向。

常用配置键说明如下：

| 配置键 | 说明 |
| --- | --- |
| `default` | 不带名字执行 `start` 时默认选中的实例 |
| `registry` | 安装与更新检查使用的 npm registry |
| `updateChannel` | 默认模板使用的发布标签（`latest`、`next` 等） |
| `update.check` | 是否在启动时检查更新 |
| `repair.agents` / `repair.agent` | 修复流程可用的本地 Agent 与首选 Agent |

## 下一步

到这里，你已经掌握了 ChatLuna 命令行的全部日常操作！接下来可以继续阅读：

- [快速上手](../quickstart) — 完成实例的首次配置
- [命令行诊断](/cookbook/cli) — 每个诊断子命令检查什么
- [命令行参考](/api/cli) — 全部子命令与参数
