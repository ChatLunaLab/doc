# 模型与请求运行时

接入模型时，先确认提供商登记、地址、协议与能力，再排查 Agent。模型列表里出现一个名称，不意味着密钥、额度和工具调用能力已经通过远端验证。

## 三层接口

| 层 | 包 / 服务 | 作用 |
| --- | --- | --- |
| 模型契约 | `@chatluna/ai` | 与 Cordis 无关的消息、分片、能力和模型接口 |
| 模型运行时 | `@chatluna/ai-runtime` / `ctx.ai` | 注册提供方、解析地址、绑定代次、拦截、协议守卫 |
| 易用动词 | `@chatluna/ai-runtime/ops` / `ctx.chatluna` | ask、chat、extract 与其他模态调用 |

`@chatluna/core` 提供动词挂载点，实际实现由 ops 插件注册。存在 ctx.chatluna，不代表所有动词都已加载。

## 模型地址与角色

- `provider:model` 是精确地址；provider 是实例登记名，不必等于厂商名。
- `@chat` 等角色由解析器选择地址，可以链式解析并检查循环。
- 无前缀名称按 alias 处理，或在唯一 provider 等条件下解析；歧义时用精确地址。

`@small`、`@medium`、`@large`、`@decide` 是记忆、判断与子代理等功能可能引用的角色，不是安装后自动拥有的模型。检查其实际解析结果与回退配置。登记 provider 也不会自动把已有群聊切到它。

## 注册与绑定代次

`ctx.ai.provide(id, provider)` 返回 ProviderHandle，可 replace 或 dispose。注册归属调用方 fiber，卸载和 HMR 只清理自己的实例。

Model 是晚绑定句柄。`bind({ signal, scope })` 解析当前提供方与能力并固定相应代次；已绑定调用不会中途切到新配置。Bound.call 只能执行一次，重复调用抛 ProtocolError。新绑定才读取更新后的登记。

`ctx.ai.generation` 随注册表变化推进，不是提示词缓存 epoch，也不是远端模型版本号。

## 七种模态

| 模态 | 用途 | 常用动词 |
| --- | --- | --- |
| chat | 对话、多模态输入和工具调用声明 | ask、chat、extract |
| embed | 向量表示 | embed |
| rerank | 文档相关性重排 | rerank |
| draw | 图像生成 | draw |
| speak | 语音合成 | speak |
| listen | 音频识别 | listen |
| decide | 对状态提出结构化判断问题 | decide、decideOne、judge |

不是每个 provider 都支持全部模态。decide 是独立契约，不能当作任意 chat 模型的别名。

## Run 是单次调用，不是 Agent

```ts
const run = ctx.chatluna.ask({
  model: 'example:example-chat',
  prompt: '解释会话日志与消息视图的区别。',
  maxOutputTokens: 800,
})
const result = await run
console.log(result.text)
console.log(result.finish)
```

example 是占位登记名。ask、chat、extract 返回 Run，可 await、异步迭代或读取 stream；广播缓冲使不同消费者不互相抢分片。abort() 传播取消。

单次 chat 不执行工具循环。只传 `tools: ['name']` 不会在该层读取工具注册表，而是生成最小 ToolSpec，返回 tool-spec-unresolved warning。完整 schema 用 toolSpecs；自动执行工具并继续模型步骤用 Agent。

ChatOptions.stopWhen 由 Agent 循环消费，不能让一次底层 chat 自动变成多步。低层调用也不自动获得聊天入口的路由、预设、权限主体和持久会话。

## 失败边界

```text
resolve / bind → before → around → 协议守卫与提供方 → after
```

before 调整参数与能力降级；around 承载重试、缓存或账本；after 用于归一和观测。

- resolve、bind、before 失败可能直接抛出。
- 提供方 chat 流异常归一为 `finish` 分片，其 `reason.kind` 为 error；取消为 aborted。
- 非 chat 提供方错误以 ModelError 拒绝。
- 拦截器自身错误不因提供方守卫而全部被吞掉。
- after 失败隔离并告警。

流结束不等于成功，要检查 finish。协议守卫处理流闭合、唯一终态、usage 顺序与空闲超时。idleTimeoutMs 默认 180000，0 关闭空闲限制，不是整个请求的总时长限制。

## AI SDK 与复合提供商

`@chatluna/provider-aisdk` 统一翻译 AI SDK 模型，按需安装 SDK，不预装全部厂商依赖。配置包括 id、packageName、factoryName、apiKey、baseURL、settings。`$credential` 引用在 loader 边界解析，不能将它泛化成「所有凭据已加密」。

适配保留可序列化 provider metadata，例如推理签名与 providerExecuted。提供方已执行的工具不在本地重复执行；缺少结果配对仍可能报错。

Responses、Chat Completions、Anthropic、Gemini 是不同协议。base URL 可达不表示协议选对。原生工具延迟、压缩、推理内容与媒体 URL 支持以具体能力为准。

composite recipe 可在一个登记名下组合 chat、responses、anthropic、gemini、decide 端点，并逐模型覆盖格式。手工模型表不被目录刷新覆盖。显式提供模型表时 setup 可跳过远程探测，所以保存成功不证明 key 有效，仍要做真实请求。模型目录的价格和窗口也不是连通性检测。

安装失败的回滚限于本次流程涉及的配置和新安装包，不撤销此前外部操作。已加载 SDK 升级后，按要求重启，不假设 Node 模块缓存全部热更新。

## 用量与排错

区分未缓存输入、缓存读取、缓存写入、输出和推理用量。ChatLuna 归一 AI SDK v3/v4 usage 时，`inputTokens` 取未缓存输入：优先读取 noCache，否则从 total 扣除缓存读写。这不表示 SDK 原始 total 不含缓存。归一的输出总数可能已经包含推理，不要再把 reasoningTokens 重复相加。缺失字段保持缺失，不伪造为测得的 0。估价依赖目录，最终以厂商账单为准。

排查顺序：精确地址 → 模型登记 → 协议 → 凭据和额度 → 能力 → 参数与 warning → finish/failure → 上层 Agent 规则。AUTH 不等于模型不存在；反复重试不能解决额度耗尽。

继续阅读[Agent](/architecture/agents)、[上下文](/architecture/context-cache)和[配置模型](/guide/models)。
