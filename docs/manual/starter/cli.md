# 命令行（CLI）

全局启动器 `chatluna` 负责在你本机的 `~/.chatluna/instances/` 下创建、运行与管理实例。它自己不加载插件，而是把每个实例交给一个守护进程（supervisor）托管，再由实例内部自带的 `@chatluna/cli` 完成诊断与导出。

## 安装

```sh
npm i -g chatluna
```

需要 Node.js 24 或更高版本。全局包名是 `chatluna`，实例内部的命令行是 `@chatluna/cli`，两者属于不同层级：前者管实例，后者在实例里执行诊断命令。

## 创建并启动

```sh
chatluna create demo
chatluna start demo
```

- `create` 默认从 `create-chatluna` 模板拉取骨架；拉取失败时退回内置骨架。也可以用 `--template` 指定 `npm 包名[@范围]` 或 `github:owner/repo[#ref]`，`--pm` 指定包管理器（npm、pnpm、yarn、bun）。
- `start` 在守护进程下运行实例。直接执行不带参数的 `chatluna` 等同于 `start`：第一次执行会创建默认实例并启动。
- 加 `--detach` 让守护进程转入后台，日志写到 `~/.chatluna/logs/<名字>.log`。

启动后日志里会打印带口令的登录地址，默认是 `http://127.0.0.1:5028`。

::: warning
`--detach` 只是把进程放到后台，不会注册开机自启。需要开机运行请自行配置 systemd、launchd 或容器编排。
:::

## 查看与控制

```sh
chatluna list
chatluna list --plugins --instance demo
chatluna stop demo
chatluna restart demo
```

`list` 显示每个实例的运行状态、版本与目录；加 `--plugins` 则列出某个实例解析后的依赖，链接进来的包会带上标记。`stop` 发送中止信号，`restart` 通知守护进程重启。

## 开发模式

```sh
chatluna dev ./my-instance
```

以开发模式运行某个目录：走 tsx 直接加载源码、开启热重载，并且不启用崩溃恢复与安全模式——开发时你应该看到真实的错误，而不是被自动兜底。

## 插件管理

```sh
chatluna add @chatluna/tool-web-search
chatluna remove @chatluna/tool-web-search
chatluna link ../my-plugin
chatluna unlink chatluna-plugin-my
chatluna new plugin my --webui --service
```

- `add` / `remove` 调用实例自己的包管理器，直接改依赖。
- `link` 把本地目录以符号链接方式接入实例，改完代码重启即生效；`unlink` 解除链接。
- `new plugin` 在实例或项目的 `external/<名字>` 下生成插件骨架。常用选项：`--webui` 同时生成浏览器端与语言文件，`--service` 生成服务骨架，`--scope` 指定发布作用域。

## 更新

```sh
chatluna update demo --dry-run
chatluna update demo
chatluna update --self
chatluna update demo --plugins --to @chatluna/tool-web-search@1.2.3
```

更新会先拍配置快照、再升级、最后做健康检查，失败自动回滚。`--self` 只更新启动器，`--plugins` 只更新实例插件，`--to` 用于把某个包钉在指定版本，`--dry-run` 只打印计划。

## 诊断与导出

```sh
chatluna doctor
chatluna doctor session <会话id>
chatluna doctor providers
chatluna export <会话id>
```

`doctor` 与 `export` 会把参数转交给实例内的 `@chatluna/cli`。读取会话的子命令直接读本地数据库，不需要实例在运行；`doctor providers` 需要实例在线才能测连通性。完整规则见[命令行诊断](/cookbook/cli)。

## 修复与报告

```sh
chatluna repair demo
chatluna report demo
```

`repair` 在实例启动失败时收集现场，给出一次本地 Agent 辅助修复的尝试；`report` 展示最近一次修复报告，可以直接作为问题草稿使用。

## 全局配置

启动器的配置在 `~/.chatluna/config.yml`，目录可以用环境变量 `CHATLUNA_HOME` 改变。

| 配置键 | 说明 |
| --- | --- |
| `default` | 不带名字执行 `start` 时默认选中的实例 |
| `registry` | 安装与更新检查使用的 npm registry |
| `updateChannel` | 默认模板使用的发布标签（`latest`、`next` 等） |
| `update.check` | 是否在启动时检查更新 |
| `repair.agents` / `repair.agent` | 修复流程可用的本地 Agent 与首选 Agent |

## 下一步

- [快速上手](../quickstart) — 完成实例的首次配置
- [命令行诊断](/cookbook/cli) — 每个诊断子命令检查什么
- [命令行参考](/api/cli) — 全部子命令与参数
