# Context Manager

`ChatLunaContextManagerService` 负责 Prompt 上下文管线、注入和聚合。它通常通过 `ctx.chatluna.contextManager` 访问。

## 类：ChatLunaContextManagerService

### contextManager.pipeline()

- **stage**: `PromptPipelineStage`
- **middleware**: `PromptPipelineMiddleware`
- **priority**: `number`
- 返回值: `() => void`

注册一个完整 pipeline stage 的中间件。

### contextManager.runPipeline()

- **runtime**: `PromptContextRuntime`
- 返回值: `Promise<void>`

运行所有已注册的 pipeline 中间件。

### contextManager.intercept()

- **name**: `string`
- **middleware**: `PromptContextMiddleware`
- **priority**: `number`
- 返回值: `() => void`

注册一个单项注入中间件。

### contextManager.replace()

- **name**: `string`
- **middleware**: `PromptContextMiddleware`
- 返回值: `() => void`

替换指定名称的注入链。

### contextManager.has()

- **name**: `string`
- 返回值: `boolean`

### contextManager.inject()

- **options**: `InjectPromptContextOptions`
- 返回值: `void`

向某个会话注入上下文。可按 `conversationId` 持久保存，也可一次性注入。

### contextManager.removeInjection()

- **conversationId**: `string`
- **injectionId**: `string`
- 返回值: `boolean`

### contextManager.collectInjections()

- **options**: `CollectPromptContextOptions`
- 返回值: `PromptContextInjectionCollection`

收集当前消息之前和之后应该插入的注入内容。

### contextManager.applyInjections()

- **injections**: `AnchoredInjection[]`
- **runtime**: `PromptContextRuntime`
- 返回值: `Promise<PromptContextRuntime>`

### contextManager.clearConversation()

- **conversationId**: `string`
- 返回值: `void`

清除指定会话的所有注入。

### contextManager.clearAll()

- 返回值: `void`

清空所有注入和队列。

### contextManager.registerSkillProvider()

- **provider**: `unknown`
- 返回值: `() => void`

注册一个 skill provider 供 prompt 管线使用。

## 内置 helper

### toMessages()

- **input**: `unknown`
- 返回值: `BaseMessage[]`

把字符串、消息或数组统一转换为 `BaseMessage[]`。
