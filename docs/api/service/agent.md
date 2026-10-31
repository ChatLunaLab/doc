# Agent

`ctx.agents`（`@chatluna/agent`）是 Agent 的注册表与运行时入口。一个 Agent 绑定一条会话日志，驱动「输入 → 模型调用 → 工具执行」的循环。

## 创建与获取

| 方法 | 作用 |
| --- | --- |
| `create(sessionId, options, at?)` | 创建 Agent（要求会话不存在） |
| `open(sessionId, options, at?)` | 恢复或复用在线实例；不存在时创建 |
| `spawn({ model, tools?, inherit?, prompt?, title?, id?, setup? })` | 简短入口，`model` 必填（`provider:model`） |
| `get(sessionId)` | 取在线实例 |
| `list()` | 列出所有在线 Agent |
| `groupByRoot()` | 按根会话分组（子代理会挂在根下） |
| `closeSession(id)` / `closeRoot(id)` | 关闭单个/整棵会话树 |
| `runtime(name, runtime)` | 注册其他运行时实现 |

`options` 里常见字段：`config: { provider, model }`、`engine`、`toolMode`、`presetId`、`conversationKey`、`location`、`permissions`。

## Agent 句柄

| 成员 | 作用 |
| --- | --- |
| `receive(message, { when })` | 投递输入：`next` / `now` / `quiet`；同步返回 `void` |
| `drop()` | 丢弃尚未接纳的排队输入 |
| `discard(messageId, reason)` | 移除指定消息，返回是否移除 |
| `abort(reason, { keepPending })` | 中止当前活动 |
| `idle()` | 等待排队与执行收敛 |
| `close()` | 关闭并释放 fiber |
| `status` / `pending` | 当前状态与待处理输入 |
| `session` / `options` | 绑定的会话与创建选项 |

## 中间件

| 注册 | 边界 |
| --- | --- |
| `ingest(mw)` | 输入被接纳前 |
| `turn(mw)` | 整个回合 |
| `step(mw)` | 单步前后 |
| `request(mw)` | 模型请求派发 |
| `shapeCommit(fn)` | 助手结果写回前的整形 |
| `prepareStep(fn, opts)` | 每步开始前调整模型/工具/参数并贡献消息 |
| `stopWhen(conditions)` | 停止条件 |

注册跟随调用方 fiber，插件卸载时自动释放。

`prepareStep` 不能覆盖整个 `messages` 数组，也不能伪造模型来源的消息；新增输入用 `contribute`。

## 手动驱动

需要自己控制循环时（例如自定义引擎的 flow），可以逐个调用：

- `runIngest` → `runTurn` → `runStep` → `runRequest`。

它们不会自动重复；循环由调用方负责。

## 继续

- [Agent 与执行循环](/architecture/agents)
- [引擎](/architecture/engine)
