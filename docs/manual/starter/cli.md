# 命令行（CLI）

::: tip
全局启动器 `chatluna` 在 `~/.chatluna/instances/` 下创建、运行和管理实例。
:::

启动器自身不加载插件，而是把每个实例交给独立的守护进程（supervisor）托管；诊断和导出由实例内置的 `@chatluna/cli` 完成。这样实例出错时能自动恢复，多个实例之间也互不影响。

## 安装

ChatLuna 需要 Node.js 24 或更高版本。用 npm 全局安装启动器：

```sh
npm i -g chatluna
```

注意区分两个包：全局的 `chatluna` 管理本机所有实例，实例内部的 `@chatluna/cli` 执行具体的诊断命令。

## 创建并启动

```sh
chatluna create demo
chatluna start demo
```

`create` 默认拉取 `@chatluna/boilerplate` 模板，拉取失败时使用内置骨架。可选参数：

- `--template`：自定义模板，支持 `npm 包名[@范围]` 或 `github:owner/repo[#ref]`。
- `--pm`：包管理器，可选 npm、pnpm、yarn、bun。

`start` 在守护进程下启动实例。不带参数执行 `chatluna` 等同于 `start`，首次执行时会自动创建并启动默认实例。

追加 `--detach` 转入后台运行，日志写入 `~/.chatluna/logs/<名字>.log`。启动后终端或日志中会打印带登录令牌的地址，默认是 `http://127.0.0.1:5028`。

::: warning
`--detach` 不会注册开机自启。需要开机运行时，请自行配置 systemd、launchd 或容器编排。
:::

## 查看与控制

```sh
chatluna list
chatluna list --plugins --instance demo
chatluna stop demo
chatluna restart demo
```

- `list`：所有实例的状态、版本和目录。
- `list --plugins --instance demo`：指定实例解析后的全部依赖，链接进来的本地包会单独标出。
- `stop`：停止实例。
- `restart`：通知守护进程重启实例，常用于改完配置或更新后。

## 开发模式

```sh
chatluna dev ./my-instance
```

开发模式通过 oxc-node 直接加载 TypeScript 源码并启用热重载，保存即生效。它不启用崩溃恢复和安全模式，出错时能直接看到真实的调用栈。

## 插件管理

```sh
chatluna add @chatluna/tool-fs
chatluna remove @chatluna/tool-fs
chatluna link ../my-plugin
chatluna unlink chatluna-plugin-my
chatluna new plugin my --webui --service
```

- `add` / `remove`：用实例的包管理器安装或移除插件。
- `link` / `unlink`：以符号链接接入本地插件目录，改完代码重启实例即可生效。
- `new plugin <名字>`：在 `external/<名字>` 下生成插件骨架。`--webui` 同时生成前端页面和多语言文件，`--service` 生成服务模板，`--scope` 指定发布用的 npm 作用域。

## 更新

```sh
chatluna update demo --dry-run
chatluna update demo
chatluna update --self
chatluna update demo --plugins --to @chatluna/tool-fs@1.2.3
```

更新时先为配置创建快照，再升级，最后做健康检查；检查失败则自动回滚。

- `--dry-run`：只打印版本对比和更新计划，不改任何文件。
- `--self`：只更新全局启动器。
- `--plugins`：只更新实例插件；`--to` 把指定包固定到某个版本。

## 诊断与导出

```sh
chatluna doctor
chatluna doctor session <会话id>
chatluna doctor providers
chatluna export <会话id>
```

`doctor` 与 `export` 把参数转交给实例内的 `@chatluna/cli`：

- `doctor`：运行环境、核心依赖和配置的自检清单。
- `doctor session`：检查会话是否损坏。直接读本地数据库，实例不必运行。
- `doctor providers`：各模型提供商的连通性和延迟。需要实例在线。
- `export`：导出会话的完整结构化数据。直接读本地数据库，实例不必运行。

各项检查的判定规则见 [命令行诊断](/cookbook/cli)。

## 修复与报告

```sh
chatluna repair demo
chatluna report demo
```

- `repair`：实例起不来或严重异常时，收集现场错误信息，调用本地 Agent 尝试修复。
- `report`：输出最近一次修复的完整报告，可以直接作为 Issue 或求助的草稿。

## 全局配置

启动器的全局配置在 `~/.chatluna/config.yml`，可以用环境变量 `CHATLUNA_HOME` 改变配置目录。

| 配置项 | 说明 |
| --- | --- |
| `default` | 不指定名称时 `start` 启动的实例 |
| `registry` | 安装与检查更新使用的 npm registry |
| `updateChannel` | 默认模板使用的发布标签（`latest`、`next` 等） |
| `update.check` | 启动时是否检查更新 |
| `repair.agents` / `repair.agent` | 修复流程可用的本地 Agent 与首选 Agent |

## 下一步

- [快速上手](../quickstart) — 完成实例的首次配置。
- [命令行诊断](/cookbook/cli) — 每个诊断子命令检查什么。
- [命令行参考](/api/cli) — 全部子命令与参数。
