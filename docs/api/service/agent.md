# Agent

`ctx.agents`（由 `@chatluna/agent` 提供）是 Agent 的核心注册表与运行时入口。每个 Agent 实例都会绑定一条会话日志，负责驱动「输入 → 模型调用 → 工具执行」的生命周期循环。

## 创建与获取

| 方法 | 作用 |
| --- | --- |
| `create(sessionId, options, at?)` | 创建新的 Agent 实例（要求对应会话尚不存在） |
| `open(sessionId, options, at?)` | 恢复并复用已有的在线实例；若会话不存在则自动创建 |
| `spawn({ model, tools?, inherit?, prompt?, title?, id?, setup? })` | 快速创建 Agent 的便捷入口，其中 `model` 为必填项（格式为 `provider:model`） |
| `get(sessionId)` | 根据会话 ID 获取在线实例 |
| `list()` | 列出当前所有在线的 Agent 实例 |
| `groupByRoot()` | 按根会话进行分组（子代理会挂载在对应的根会话下） |
| `closeSession(id)` / `closeRoot(id)` | 关闭单个会话实例或整棵会话树 |
| `runtime(name, runtime)` | 注册自定义的运行时实现 |

在 `options` 配置项中，常见的字段包括 `config: { provider, model }`、`engine`、`toolMode`、`presetId`、`conversationKey`、`location` 和 `permissions`。

## Agent 句柄

| 成员 | 作用 |
| --- | --- |
| `receive(message, { when })` | 投递输入：支持 `next`、`now` 或 `quiet` 调度时机；同步返回 `void` |
| `drop()` | 丢弃队列中尚未被接纳的排队输入 |
| `discard(messageId, reason)` | 移除指定的排队消息，返回布尔值表示是否移除成功 |
| `abort(reason, { keepPending })` | 中止当前的执行活动 |
| `idle()` | 等待排队任务与执行流程收敛并进入空闲状态 |
| `close()` | 关闭当前 Agent 并释放其占用的 fiber 资源 |
| `status` / `pending` | 获取当前运行状态与待处理的输入列表 |
| `session` / `options` | 获取绑定的会话实例与创建时传入的配置选项 |

## 中间件

| 注册 | 边界 |
| --- | --- |
| `ingest(mw)` | 输入被接纳前执行 |
| `turn(mw)` | 拦截并包裹单个完整回合 |
| `step(mw)` | 单步执行的前后阶段 |
| `request(mw)` | 向模型派发请求阶段 |
| `shapeCommit(fn)` | 助手回复写回会话前的结果整形 |
| `prepareStep(fn, opts)` | 在每步开始前调整模型、工具与参数，并可按需贡献输入消息 |
| `stopWhen(conditions)` | 注册单步或回合的提前停止条件 |

所有注册操作都会跟随调用方的 fiber 生命周期，当插件卸载时会自动释放。

需要注意的是，`prepareStep` 不能直接覆盖整个 `messages` 数组，也不允许伪造来源为模型的历史消息；若需新增输入，请通过 `contribute` 注入。

## 手动驱动

如果你需要完全控制执行循环（例如在自定义引擎中实现特定的 flow），也可以逐个调用底层的执行步骤：

- `runIngest` → `runTurn` → `runStep` → `runRequest`

这些方法在执行后不会自动重试或重复调用，后续的推进循环需要由调用方自行负责。

## 继续

- [Agent 与执行循环](/architecture/agents)
- [引擎](/architecture/engine)
