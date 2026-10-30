# Agent 与执行循环

Agent 将输入变成一轮或多轮模型调用，并在模型请求工具时继续执行。它不是模型 SDK 的别名，也不是数据库。平台入口、WebUI 和插件应向同一个在线 Agent 投递输入，不要分别打开会话快照并直接写入。

## turn、step 和单次调用

- **turn** 是运行时接纳一批输入并执行的轮次，可以被引擎或中间件跳过。
- **step** 包含一次模型请求及其引起的工具执行；一个 turn 可以有多个 step。
- `ctx.chatluna.chat()` 是单次模型调用，返回 `Run`，不会代替 Agent 完成工具循环。

默认循环位于 `@chatluna/agent` 内部，不需要独立的 agent-loop 包。`ctx.agents.runtime(name, runtime)` 可以注册其他运行时，但需要实现创建、启动、关闭等完整契约，不是简单替换一个请求函数。

## 输入何时被接纳

`agent.receive(message, { when })` 同步返回 `void`，不是一次回答的 Promise。

| when | 空闲时 | 正在执行时 |
| --- | --- | --- |
| `next`（默认） | 唤醒循环 | 等待后续 turn，不合入当前 turn 后续 step |
| `now` | 唤醒循环 | 在后续 step 边界合入，不中止已发出的请求 |
| `quiet` | 仅入队，不唤醒 | 可在后续 step 边界合入 |

`now` 不是硬中断；`quiet` 不是丢弃或隐藏。被接纳的 quiet 输入仍可成为模型消息。同一 message id 已在队列或处理中时不重复入队。

新 turn 先取 now/quiet 分组，再取常规输入，不能承诺跨组的严格全局 FIFO。

```ts
import { ChatMessage } from '@chatluna/message'

agent.receive(ChatMessage.user('请比较这两种部署方式'))
agent.receive(ChatMessage.notice('documentation', '补充：目标机器没有 Docker。'), {
  when: 'now',
})
await agent.idle()
```

这里的 agent 是调用方持有的在线实例。`idle()` 等待当前工作收敛，并跟随观察期间替换的工作；它不绑定某条输入，也不会仅因队列存在未唤醒的 quiet 输入就一直等待。执行失败可能使其拒绝。关联输入与结果应使用消息身份、条目和事件，不能把任意下一条助手回复当作专属结果。

## 单步执行边界

默认循环大致经过以下过程，具体输入提交位置由实现与中间件共同决定：

1. 领取当前边界允许的输入。
2. 构造提示词环境，渲染 system、prelude、context 和 input。
3. 计算可见工具，应用 prepareStep 贡献和模型参数。
4. 经 ingest 等处理提交输入、记录请求快照，通过 request 管线调用模型。
5. 处理流式草稿，提交助手输出与 usage、finish 等元数据。
6. 执行工具调用，写入结果。
7. 检查停止条件，必要时进入下一 step。

压缩、模型切换、工具发现和自定义引擎可以参与这些边界。最终请求以实际快照和中间件处理结果为准。

## 中间件各管什么

| 扩展点 | 适用范围 |
| --- | --- |
| ingest | 输入接纳和批次变换 |
| turn | 整轮控制，例如引擎流程 |
| step | 单步前后控制，例如提前压缩 |
| request | 请求派发、失败恢复和重试 |
| commit | 助手结果提交前整形 |
| prepareStep | 调整模型、system、工具和参数，贡献额外消息 |

prepareStep 不允许覆盖 messages。新增输入或上下文使用 contribute；改变历史使用明确的压缩操作。贡献者不能伪造 `source.kind === 'model'` 的消息，这是检查来源，不是名为 model 的 role。

注册使用调用方 ctx，跟随 fiber 释放。全局贡献与当前 Agent 局部贡献参与执行，其他 Agent 局部贡献不会自动继承给子代理。

## 创建与恢复

`ctx.agents.create(sessionId, options, at)` 创建，`open()` 恢复或复用同 id 的在线实例。options.config 包含实际 provider 和 model；局部注册放在 `at.apply(ctx, agent)`。

`ctx.agents.spawn({ model, prompt, tools, inherit, setup })` 是简短入口，model 必须为 `provider:model`。指定 tools 或 inherit 后会筛选工具集合，不绕过权限。

普通聊天优先走 `ctx.conversations.open()`，协调业务 head 与在线所有权。子任务使用 `ctx.subagents`，获得任务句柄、权限上限、后端与委派深度管理。手工递归 spawn 不会自动得到这些能力。

当前默认 Agent 要求以下服务：agents、chatluna、ai、tools、prompt、sessions、trace、presets、tool_search。后面三项虽然职责独立，目前仍是启动依赖；从组合中任意移除会报 missing required services，不能保证自动降级。

## 停止与资源释放

默认配置：

| 字段 | 默认 | 含义 |
| --- | --- | --- |
| maxStepsPerTurn | 60 | 默认轮次的步数停止条件 |
| maxParallelToolCalls | 10 | 工具调度并行度，还受工具 parallel trait 限制 |
| staleLimit | 8 | 冻结工具头允许保留的已不存在工具名称数量；新增工具或旧名称过多时刷新，不是重试次数 |

自定义停止条件、引擎或其他运行时可以有不同策略。

- `drop()` 丢弃仍在队列中的输入。
- `discard(messageId, reason)` 移除指定待处理输入，返回是否移除；messageId 使用 `MessageId`。
- `abort(reason, { keepPending })` 中止当前活动；默认丢弃待处理输入，keepPending 为 true 时保留。
- `exclusive(task)` 排在已有工作之后独占执行；task 接收 AbortSignal。它不是数据库事务。
- `close()` 关闭 Agent 并释放 fiber。关闭中和关闭后拒绝输入。

取消依赖下游响应 AbortSignal，不会回滚已写文件、已发消息或已完成远程调用。重试前核对外部状态和幂等性。

## 引擎的边界

引擎是装到 Agent fiber 的普通 Cordis 插件，通过 assemble 和 flow 等扩展行为。内置 agent、coding 与独立 character 引擎选择不同提示词和流程，但仍遵守会话提交、工具管线和生命周期边界。预设有 kind 和引擎接纳规则，不是任意预设都能用于任意引擎。

## 排错

| 现象 | 检查 |
| --- | --- |
| receive 后不回复 | quiet、引擎跳过、入口激活或权限拦截 |
| now 没立即改变输出 | 在 step 边界接纳，不撤销当前请求 |
| idle 等待超过一次问答 | 它观察整个 Agent，不绑定单条消息 |
| 调用报 Agent 已关闭 | 缓存了过期句柄，重新走在线入口 |
| 启动缺服务 | 对照当前依赖，不按旧计划删插件 |
| 重试产生重复写入 | 取消不等于回滚，核对工具幂等性 |

相关章节：[会话与分支](/architecture/sessions)、[上下文与压缩](/architecture/context-cache)、[插件开发](/development/plugins)。
