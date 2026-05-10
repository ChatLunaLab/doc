# Conversation Runtime

`ConversationRuntime` 负责会话运行时缓存、锁、请求停止和压缩。

可以通过 `ctx.chatluna.conversationRuntime` 获取实例。

## 类：ConversationRuntime

### conversationRuntime.ensureChatInterface()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<ChatInterface>`

确保会话对应的 `ChatInterface` 已创建并缓存。

### conversationRuntime.chat()

- **session**: `Session`
- **conversation**: `ConversationRecord`
- **message**: `Message`
- **options**: `ChatOptions | undefined`
- 返回值: `Promise<Message>`

执行一次完整聊天请求。内部会处理 tool mask、callbacks、AbortSignal 和自动回复消息。

### conversationRuntime.updateConversationRecord()

- **conversation**: `ConversationRecord`
- 返回值: `void`

更新缓存中的会话记录。

### conversationRuntime.getCachedConversations()

- 返回值: `[string, RuntimeConversationEntry][]`

返回当前缓存的会话与聊天接口。

### conversationRuntime.withConversationLock()

- **conversationId**: `string`
- **callback**: `() => Promise<T>`
- 返回值: `Promise<T>`

按会话 ID 加锁执行回调。

### conversationRuntime.withConversationSync()

- **conversation**: `ConversationRecord`
- **callback**: `() => Promise<T>`
- 返回值: `Promise<T>`

先停止当前会话中的活跃请求，再串行执行回调。

### conversationRuntime.withConversationAndPlatformLock()

- **conversation**: `ConversationRecord`
- **callback**: `(config: ClientConfig) => Promise<T>`
- 返回值: `Promise<T>`

同时对会话和平台模型请求加锁。

### conversationRuntime.registerRequest()

- **conversationId**: `string`
- **requestId**: `string`
- **chatMode**: `string`
- **platform**: `string`
- **abortController**: `AbortController`
- **session**: `Session`
- 返回值: `ActiveRequest`

登记一个活跃请求。

### conversationRuntime.completeRequest()

- **conversationId**: `string`
- **requestId**: `string`
- 返回值: `void`

### conversationRuntime.stopRequest()

- **requestId**: `string`
- 返回值: `boolean`

停止指定请求。

### conversationRuntime.stopConversationRequest()

- **conversationId**: `string`
- 返回值: `boolean`

停止指定会话下的当前请求。

### conversationRuntime.getRequestId()

- **session**: `Session`
- **conversationId**: `string`
- 返回值: `string | undefined`

### conversationRuntime.appendPendingMessage()

- **conversationId**: `string`
- **message**: `HumanMessage`
- 返回值: `Promise<void>`

追加等待发送的用户消息。

### conversationRuntime.clearConversationCache()

- **conversationId**: `string`
- 返回值: `Promise<void>`

清空聊天接口缓存。

### conversationRuntime.clearConversationHistory()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<void>`

清空会话历史。

### conversationRuntime.compressConversation()

- **conversation**: `ConversationRecord`
- **wrapper**: `ChatLunaLLMChainWrapper`
- 返回值: `Promise<CompressContextResult | undefined>`

压缩长上下文。

### conversationRuntime.clearConversationInterfaceLocked()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<void>`

### conversationRuntime.clearConversationInterface()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<boolean>`

### conversationRuntime.dispose()

- **platform**: `string | undefined`
- 返回值: `void`

清理运行时缓存和活跃请求。
