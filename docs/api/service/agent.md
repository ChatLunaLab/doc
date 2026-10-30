# Agent

`ctx.agents`（`@chatluna/agent`）是 Agent 的注册表与运行时入口。一个 `Agent` 绑定一条会话日志，驱动「输入 → 模型调用 → 工具执行」的循环。

## 创建与获取

| 方法 | 作用 |
| --- | --- |
| `create(sessionId, options, at)` | 创建 Agent |
| `open(sessionId, options, at)` | 恢复或复用在线实例 |
| `spawn({model, prompt, tools, inherit, setup})` | 简短入口，`model` 为 `provider:model` |
| `runtime(name, runtime)` | 注册其他运行时 |

## Agent 句柄

| 方法 | 作用 |
| --- | --- |
| `receive(message, {when})` | 投递输入：`next` / `now` / `quiet` |
| `drop()` / `discard(id, reason)` | 丢弃/移除排队输入 |
| `abort(reason, {keepPending})` | 中止当前活动 |
| `idle()` | 等工作收敛 |
| `exclusive(task)` | 独占执行 |
| `close()` | 关闭并释放 fiber |

## 中间件

`ingest` / `turn` / `step` / `request` / `commit` / `prepareStep` 各管一段边界；`prepareStep` 不能覆盖 messages，新增输入用 contribute。注册跟随调用方 fiber。

## 继续

- [Agent 与执行循环](/architecture/agents)
