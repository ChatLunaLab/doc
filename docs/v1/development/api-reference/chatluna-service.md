# ChatLuna 服务

`ChatLunaService` 是 ChatLuna 在 Koishi 中注册的核心服务。安装主插件后，可以通过 `ctx.chatluna` 访问。

```ts
import type {} from "koishi-plugin-chatluna/services/chat";

ctx.chatluna.xxx();
```

## 类：ChatLunaService

### chatluna.installPlugin()

- **plugin**: `ChatLunaPlugin` 要注册的插件
- 返回值: `Promise<void>`

安装一个 ChatLuna 插件。如果同名平台已存在会抛出 `PLUGIN_ALREADY_REGISTERED`。

### chatluna.awaitLoadPlatform()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- **timeout**: `number` 超时时间，单位毫秒，默认 `30000`
- 返回值: `Promise<void>`

等待平台完成模型加载。常用于在插件启动后确保适配器已经刷新模型列表。

### chatluna.uninstallPlugin()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- 返回值: `void`

卸载平台插件并释放该平台关联的会话运行时缓存。

### chatluna.registerToolMaskResolver()

- **name**: `string` resolver 名称
- **resolver**: `ToolMaskResolver`
- 返回值: `() => void`

注册工具可见性解析器。聊天请求没有显式传入 `toolMask` 时，运行时会通过 resolver 动态决定当前会话可用工具。

```ts
ctx.effect(() =>
  ctx.chatluna.registerToolMaskResolver("group-safe", async ({ session }) => {
    if (!session.guildId) return;
    return { mode: "deny", allow: [], deny: ["admin-tool"] };
  }),
);
```

### chatluna.resolveToolMask()

- **arg**: `ToolMaskArg`
- 返回值: `Promise<ToolMask | undefined>`

按注册顺序调用 tool mask resolver，返回第一个非空结果。

### chatluna.getPlugin()

- **platformName**: `string` 平台名称
- 返回值: `ChatLunaPlugin | undefined`

获取指定平台名称的插件实例。

### chatluna.chat()

- **session**: `Session` Koishi 会话
- **conversation**: `ConversationRecord` ChatLuna 会话记录
- **message**: `Message` 输入消息
- **options**: `ChatOptions`
- 返回值: `Promise<Message>`

向指定 ChatLuna 会话发起一次聊天请求。

```ts
const result = await ctx.chatluna.chat(
  session,
  conversation,
  {
    content: "你好",
    name: session.username,
  },
  {
    stream: true,
    variables: { scene: "demo" },
    requestId: crypto.randomUUID(),
  },
);
```

`ChatOptions` 字段：

- `event?: ChatEvents`：LLM token、工具调用、用量等回调。
- `stream?: boolean`：是否使用流式输出。
- `variables?: Record<string, unknown>`：提示词变量。
- `postHandler?: PostHandler`：后处理器。
- `requestId?: string`：请求 ID，省略时自动生成。
- `toolMask?: ToolMask`：本次请求的工具可见性规则。
- `callbacks?: Callbacks`：LangChain callbacks。
- `signal?: AbortSignal`：外部取消信号。

### chatluna.registerCallbacksProvider()

- **provider**: `ChatCallbacksProvider`
- 返回值: `() => void`

注册 LangChain callback provider。provider 会在每次聊天请求前被调用，并与请求传入的 callbacks 合并。

### chatluna.resolveCallbacks()

- **input**: `ChatCallbackProviderInput`
- 返回值: `Promise<Callbacks | undefined>`

解析一次请求最终使用的 LangChain callbacks。通常由内部运行时调用。

### chatluna.clearCache()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<boolean>`

清除指定会话的聊天接口缓存。清空聊天历史请使用 `ctx.chatluna.conversationRuntime.clearConversationHistory(conversation)`。

### chatluna.createChatInterface()

- **conversation**: `ConversationRecord`
- 返回值: `Promise<ChatInterface>`

按会话配置创建底层 `ChatInterface`。普通插件一般不需要直接调用，优先使用 `chat()`。

### chatluna.createChatModel()

- **platformName**: `string`
- **modelName**: `string`
- 返回值: `Promise<ComputedRef<ChatLunaChatModel | undefined>>`

或：

- **fullModelName**: `string`，形如 `platform/model`
- 返回值: `Promise<ComputedRef<ChatLunaChatModel | undefined>>`

创建聊天模型响应式引用。当平台或模型不存在时，`ref.value` 可能是 `undefined`。

### chatluna.createEmbeddings()

- **platformName**: `string`
- **modelName**: `string`
- 返回值: `Promise<ComputedRef<Embeddings | undefined>>`

或：

- **fullModelName**: `string`，形如 `platform/model`
- 返回值: `Promise<ComputedRef<Embeddings | undefined>>`

创建嵌入模型响应式引用。平台不可用或模型不是 embeddings 时会回退到空 embeddings 实现。

### chatluna.createReranker()

- **platformName**: `string`
- **modelName**: `string`
- 返回值: `Promise<ComputedRef<ChatLunaReranker | undefined>>`

或：

- **fullModelName**: `string`，形如 `platform/model`
- 返回值: `Promise<ComputedRef<ChatLunaReranker | undefined>>`

创建 reranker 响应式引用。不可用时返回 `undefined`。

### chatluna.createAgent()

- **options**: `CreateChatLunaAgentOptions`
- 返回值: `Promise<ChatLunaAgent>`

创建高层 Agent 实例。常用参数包括 `model`、`embeddings`、`tools`、`preset`、`system`、`mode`、`maxSteps` 和 `toolMask`。

```ts
const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  model: "openai/gpt-5-nano",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  maxSteps: 8,
});

const result = await agent.generate({
  prompt: "搜索最近新闻并整理重点",
  session,
  conversationId: conversation.id,
});
```

完整 Agent API 见 [Agent API](./llm-core/agent.md)。

## 属性

### chatluna.platform

- **类型**: `PlatformService`

平台、模型、工具、向量存储和聊天链管理服务。

### chatluna.cache

- **类型**: `Cache<'chatluna/keys', string>`

ChatLuna 内部键缓存。

### chatluna.preset

- **类型**: `PresetService`

预设服务。

### chatluna.chatChain

- **类型**: `ChatChain`

聊天链入口。

### chatluna.messageTransformer

- **类型**: `MessageTransformer`

Koishi 元素到 ChatLuna 消息的转换器。

### chatluna.renderer

- **类型**: `DefaultRenderer`

ChatLuna 消息到 Koishi 元素的渲染器聚合。

### chatluna.promptRenderer

- **类型**: `ChatLunaPromptRenderService`

提示词模板渲染服务。

### chatluna.contextManager

- **类型**: `ChatLunaContextManagerService`

提示词上下文管线和注入管理服务。见 [Context Manager](./llm-core/context-manager.md)。

### chatluna.conversation

- **类型**: `ConversationService`

会话、绑定、约束、ACL、归档和导出服务。见 [Conversation Service](./conversation-service.md)。

### chatluna.conversationRuntime

- **类型**: `ConversationRuntime`

运行时请求、缓存、锁、压缩和停止请求管理。见 [Conversation Runtime](./conversation-runtime.md)。
