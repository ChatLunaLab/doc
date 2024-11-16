# ChatLuna 服务

ChatLuna 服务是整个系统的核心，用于管理插件、对话、模型等资源。

## 类：ChatLunaService

### chatluna.registerPlugin()

- **plugin**: `ChatLunaPlugin` 要注册的插件
- 返回值: `Promise<void>`

注册一个 ChatLuna 插件。如果插件已注册则会抛出错误。

### chatluna.awaitLoadPlatform()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- **timeout**: `number` 超时时间（毫秒），默认为 30000
- 返回值: `Promise<void>`

等待平台加载完成。如果超时会抛出错误。

### chatluna.unregisterPlugin()

- **plugin**: `ChatLunaPlugin | string` 插件实例或平台名称
- **withError**: `boolean` 是否在插件不存在时抛出错误，默认为 true
- 返回值: `void`

注销一个 ChatLuna 插件。

### chatluna.getPlugin()

- **platformName**: `string` 平台名称
- 返回值: `ChatLunaPlugin`

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
- 返回值: `Promise<void>`

发起一个对话请求。

### chatluna.stopChat()

- **room**: `ConversationRoom` 对话房间
- **requestId**: `string` 请求 ID
- 返回值: `Promise<void>`

停止指定请求 ID 的对话。

### chatluna.clearChatHistory()

- **room**: `ConversationRoom` 对话房间
- 返回值: `Promise<void>`

清除指定房间的对话历史。

### chatluna.clearCache()

- **room**: `ConversationRoom` 对话房间
- 返回值: `Promise<void>`

清除指定房间的缓存。

### chatluna.createChatModel()

- **platformName**: `string` 平台名称
- **model**: `string` 模型名称
- 返回值: `Promise<ChatLunaChatModel>`

创建一个聊天模型实例。

### chatluna.createEmbeddings()

- **platformName**: `string` 平台名称
- **modelName**: `string` 模型名称
- 返回值: `Promise<ChatHubBaseEmbeddings>`

创建一个嵌入模型实例。

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
