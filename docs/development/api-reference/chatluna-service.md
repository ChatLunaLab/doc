# ChatLuna 服务

ChatLuna 服务是整个系统的核心，用于管理插件、对话、模型等资源。

## 类：ChatLunaService

### chatluna.installPlugin()

- **plugin**: `ChatLunaPlugin` 要注册的插件
- 返回值: `Promise<void>`

安装一个 ChatLuna 插件。如果同名插件已存在会抛出错误。插件通常会在构造函数中自动调用该方法。

### chatluna.awaitLoadPlatform()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- **timeout**: `number` 超时时间（毫秒），默认为 30000
- 返回值: `Promise<void>`

等待平台加载完成。如果超时会抛出错误。

### chatluna.uninstallPlugin()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- 返回值: `void`

卸载一个 ChatLuna 插件。如果插件未安装将被忽略。

### chatluna.getPlugin()

- **platformName**: `string` 平台名称
- 返回值: `ChatLunaPlugin | undefined`

获取指定平台名称的插件。

### chatluna.chat()

- **session**: `Session` 会话对象
- **room**: `ConversationRoom` 对话房间
- **message**: `Message` 消息对象
- **event**: `ChatEvents` 事件对象
- **stream**: `boolean` 是否使用流式响应，默认为 false
- **variables**: `Record<string, any>` 变量对象，默认为空对象
- **postHandler**: `PostHandler` 后处理函数（可选）
- **requestId**: `string` 请求 ID，默认自动生成
- 返回值: `Promise<Message>`

发起一个对话请求，返回最终回复消息。部分模型会附带 `additionalReplyMessages` 用于展示思考过程等扩展内容。

### chatluna.stopChat()

- **room**: `ConversationRoom` 对话房间
- **requestId**: `string` 请求 ID
- 返回值: `Promise<boolean | undefined>`

尝试停止指定请求 ID 的对话。当没有找到对应请求时返回 `false`，如果会话尚未创建则返回 `undefined`。

### chatluna.clearChatHistory()

- **room**: `ConversationRoom` 对话房间
- 返回值: `Promise<void>`

清除指定房间的对话历史。

### chatluna.clearCache()

- **room**: `ConversationRoom` 对话房间
- 返回值: `Promise<boolean>`

清除指定房间的缓存并同步触发 `chatluna/clear-chat-history` 事件。返回值表示是否成功移除缓存的聊天接口。

### chatluna.createChatModel()

- **platformName**: `string` 平台名称
- **model**: `string` 模型名称
- 返回值: `Promise<ComputedRef<ChatLunaChatModel | undefined>>`

创建一个聊天模型的计算引用。也支持直接传入 `platform/model` 组合字符串。

### chatluna.createEmbeddings()

- **platformName**: `string` 平台名称
- **modelName**: `string` 模型名称
- 返回值: `Promise<ComputedRef<Embeddings | undefined>>`

创建一个嵌入模型的计算引用。若模型不可用会回退为空嵌入实现。

### chatluna.createAgent()

- **options**: `CreateChatLunaAgentOptions`
- 返回值: `Promise<ChatLunaAgent>`

创建一个高层 Agent 实例。这是当前推荐的 Agent 入口。

最常用的参数只有几个：

- `model`: 必填，支持直接传 `platform/model`
- `tools`: 可选，传工具名数组即可
- `preset` 或 `system`: 二选一；前者复用预设，后者直接写系统提示词
- `mode`: 可选，默认 `tool-calling`
- `maxSteps`: 可选，限制最多调用多少轮工具

返回的 `ChatLunaAgent` 主要有 3 个方法：

- `generate(...)`: 普通调用
- `stream(...)`: 流式调用
- `asTool(...)`: 包成工具给别的 Agent 用

更完整的教程见：[`/development/call-core-services/agent`](/development/call-core-services/agent)

示例：

```ts
import type {} from "koishi-plugin-chatluna/services/chat";

const agent = await ctx.chatluna.createAgent({
  name: "researcher",
  model: "openai/gpt-5-nano",
  embeddings: "openai/text-embedding-3-small",
  tools: ["web-search", "web-browser"],
  preset: "sydney",
  mode: "tool-calling",
  maxSteps: 8,
});

const result = await agent.generate({
  prompt: "搜索 OpenAI 最近新闻并整理重点",
  session,
  conversationId: "conversation-id",
});

console.log(result.output);
```

### 属性

#### chatluna.platform

- **类型**: `PlatformService`
- **只读**

平台服务实例。

#### chatluna.cache

- **类型**: `Cache<'chathub/keys', string>`
- **只读**

缓存服务实例。

#### chatluna.preset

- **类型**: `PresetService`
- **只读**

预设服务实例。

#### chatluna.chatChain

- **类型**: `ChatChain`
- **只读**

对话链实例。

#### chatluna.messageTransformer

- **类型**: `MessageTransformer`
- **只读**

消息转换器实例。

#### chatluna.renderer

- **类型**: `DefaultRenderer`
- **只读**

默认渲染器实例。

#### chatluna.promptRenderer

- **类型**: `ChatLunaPromptRenderService`
- **只读**

提示词渲染服务实例。
