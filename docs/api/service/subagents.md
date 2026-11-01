# 子代理 (Subagents)

`ctx.subagents` 服务由 `@chatluna/subagent` 提供，主要用于登记子代理档案并执行委派任务。

## 档案与后端

你可以通过子代理服务管理档案定义与外部执行后端：

| 方法 | 作用 |
| --- | --- |
| `define(profile)` | 注册一个子代理档案 |
| `list(agent?)` | 获取当前可用的档案列表（受路由白名单过滤） |
| `resolve(name)` | 根据名称获取指定档案 |
| `backend(name, backend)` | 注册外部执行后端 |
| `listBackends()` | 列出所有执行后端，其中 `default` 始终在内 |

档案支持配置以下字段：`name`、`description`、`backend`、`engine`、`tools`、`model`、`maxLevel`、`machine`、`mode`、`prompt`、`output`、`inherit`、`lifetime`。

注册 `backend` 时会同步注册权限项 `subagent:backend:<name>`，权限等级为 5，属于危险操作。

## 运行

你可以使用以下方法委派并管理运行中的任务：

| 方法 | 作用 |
| --- | --- |
| `run(target, task, options?)` | 启动一次运行，返回 `SubagentRun` 句柄 |
| `get(id, parent)` | 获取当前仍在运行中的实例 |
| `release(id)` | 释放指定的运行实例 |
| `discard(sessionId)` | 丢弃对应的会话 |

调用时，`options` 支持传入：`parent`、`lifetime`、`level`、`signal`、`delegationDepth`、`runtimeDepth`、`subject`、`routeId`、`machine`。

## 运行句柄

`SubagentRun` 提供了监控运行状态与控制生命周期的成员：

| 成员 | 作用 |
| --- | --- |
| `status` | 运行状态，为 `running` / `completed` / `failed` / `cancelled` 之一 |
| `result` | 返回 Promise，解析为 `{ status, result, usage? }` |
| `send(message)` | 仅会话型默认后端可继续对话 |
| `messages` | 运行到目前为止的消息列表 |
| `agent` | 默认后端的子 Agent（外部后端没有） |
| `dispose()` | 结束本次运行 |

## 约束

在使用子代理功能时，需满足以下调度约束：

- 委派深度取 `delegationDepth` 与 `runtimeDepth` 的较大者；达到 `depthLimit` 时将抛出 `DEPTH_EXCEEDED` 错误。
- 路由上配置的 `profiles`、`backends` 与 `depthLimit` 会进一步收窄当前可用的集合。
- 当档案通过 `output` 指定结构化交付时，子代理必须显式调用 `submit` 进行交付，否则结果将记为 `failed`。

## 继续

- [子代理](/architecture/subagent)
- [子代理（使用）](/manual/usage/subagents)
