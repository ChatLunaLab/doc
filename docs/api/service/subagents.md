# 子代理 (Subagents)

`ctx.subagents`（`@chatluna/subagent`）登记子代理档案、执行委派任务。

## 档案与后端

| 方法 | 作用 |
| --- | --- |
| `define(profile)` | 注册一个子代理档案 |
| `list(agent?)` | 当前可用的档案（受路由白名单过滤） |
| `resolve(name)` | 按名取档案 |
| `backend(name, backend)` | 注册外部执行后端 |
| `listBackends()` | 列出后端，`default` 始终在内 |

档案字段：`name`、`description`、`backend`、`engine`、`tools`、`model`、`maxLevel`、`machine`、`mode`、`prompt`、`output`、`inherit`、`lifetime`。

`backend` 同时会注册 `subagent:backend:<name>` 权限，等级 5，属于危险操作。

## 运行

| 方法 | 作用 |
| --- | --- |
| `run(target, task, options?)` | 启动一次运行，返回 `SubagentRun` |
| `get(id, parent)` | 取仍在运行中的实例 |
| `release(id)` | 释放实例 |
| `discard(sessionId)` | 丢弃对应会话 |

`options` 可传 `parent`、`lifetime`、`level`、`signal`、`delegationDepth`、`runtimeDepth`、`subject`、`routeId`、`machine`。

## 运行句柄

| 成员 | 作用 |
| --- | --- |
| `status` | `running` / `completed` / `failed` / `cancelled` |
| `result` | Promise，解析为 `{ status, result, usage? }` |
| `send(message)` | 仅会话型默认后端可继续对话 |
| `messages` | 到目前为止的消息 |
| `agent` | 默认后端的子 Agent（外部后端没有） |
| `dispose()` | 结束运行 |

## 约束

- 委派深度取 `delegationDepth` 与 `runtimeDepth` 的较大者，达到 `depthLimit` 抛 `DEPTH_EXCEEDED`。
- 路由上的 `profiles` / `backends` / `depthLimit` 会进一步收窄可用集合。
- `output` 指定结构化交付时，子代理必须调用 `submit` 交付，否则结果为 `failed`。

## 继续

- [子代理](/architecture/subagent)
- [子代理（使用）](/manual/usage/subagents)
