# ChatLuna 事件

> [!TIP] 提示
> 参见 [Koishi 事件](https://koishi.chat/zh-CN/guide/basic/events.html)

ChatLuna 也提供一些事件，用于监听和处理一些复杂的功能。

## 通用事件

ChatLuna 的通用会话事件。

### 事件：chatluna/before-check-sender

- **session**: `Session` 会话
- **返回值**: `boolean` 是否继续处理
- **触发方式**: serial

在 ChatLuna 处理会话之前，触发该事件。

当返回值为 `true`，ChatLuna 将不会处理该会话。

## 聊天事件

ChatLuna 的聊天流程事件。

### 事件：chatluna/before-chat

- **conversationId**: `string` 会话 ID
- **message**: `HumanMessage` 用户发送的消息
- **promptVariables**: `ChainValues` 当前可用的提示词变量
- **chatInterface**: `ChatInterface` 当前聊天接口实例
- **session**: `Session` 会话
- **触发方式**: parallel

在开始调用模型之前触发，可用于检查输入、动态修改提示词变量、注入提示词或提前拦截聊天流程。

### 事件：chatluna/after-chat

- **conversationId**: `string` 会话 ID
- **sourceMessage**: `HumanMessage` 原始用户消息
- **responseMessage**: `AIMessage` 模型返回的消息
- **promptVariables**: `ChainValues` 调用时携带的提示词变量，包含 `chatCount` 等信息
- **chatInterface**: `ChatInterface` 当前聊天接口实例
- **session**: `Session` 会话
- **触发方式**: parallel

在模型生成回复后触发，可用于对回复进行记录、二次处理或推送至其他系统。

### 事件：chatluna/clear-chat-history

- **conversationId**: `string` 会话 ID
- **chatInterface**: `ChatInterface` 当前聊天接口实例
- **触发方式**: parallel

当会话历史被清空时触发，方便同步清理缓存、外部存储或关联上下文。

### 事件：chatluna/after-chat-error

- **error**: `Error` 对话过程中捕获的异常对象
- **conversationId**: `string` 会话 ID
- **sourceMessage**: `HumanMessage` 原始用户消息
- **promptVariables**: `ChainValues` 调用时的提示词变量
- **chatInterface**: `ChatInterface` 当前聊天接口实例
- **chain**: `ChatLunaLLMChainWrapper` 触发错误的链路实例（可选）
- **触发方式**: parallel

当聊天流程出现异常时触发，可用于日志上报、兜底回复或通知维护者。

## 生命周期事件

ChatLuna 的生命周期事件，监听某些模型或者工具的变化。

### 事件：chatluna/chat-chain-added

- **service**: `PlatformService` 平台服务
- **chain**: `ChatLunaChainInfo` 聊天链信息
- **触发方式**: emit

当一个聊天链（聊天模式）被添加时，触发该事件。

### 事件：chatluna/chat-chain-removed

- **service**: `PlatformService` 平台服务
- **chain**: `ChatLunaChainInfo` 聊天链信息
- **触发方式**: emit

当一个聊天链（聊天模式）被移除时，触发该事件。

### 事件：chatluna/tool-updated

- **service**: `PlatformService` 平台服务
- **触发方式**: emit

当有工具被添加或移除时，触发该事件。

### 事件：chatluna/model-added

- **service**: `PlatformService` 平台服务
- **platform**: `PlatformClientNames` 被添加的平台
- **client**: `BasePlatformClient | BasePlatformClient[]` 被添加的平台 Client 实现
- **触发方式**: emit

当有模型（适配器）被添加时，触发该事件。

### 事件：chatluna/model-removed

- **service**: `PlatformService` 平台服务
- **platform**: `PlatformClientNames` 被移除的平台
- **client**: `BasePlatformClient | BasePlatformClient[]` 被移除的平台 Client 实现
- **触发方式**: emit

当有模型（适配器）被移除时，触发该事件。

### 事件：chatluna/embeddings-added

- **service**: `PlatformService` 平台服务
- **platform**: `PlatformClientNames` 被添加的平台
- **client**: `BasePlatformClient | BasePlatformClient[]` 被添加的平台 Client 实现
- **触发方式**: emit

当有嵌入模型（适配器）被添加时，触发该事件。

### 事件：chatluna/embeddings-removed

- **service**: `PlatformService` 平台服务
- **platform**: `PlatformClientNames` 被移除的平台
- **client**: `BasePlatformClient | BasePlatformClient[]` 被移除的平台 Client 实现
- **触发方式**: emit

当有嵌入模型（适配器）被移除时，触发该事件。

### 事件：chatluna/vector-store-added

- **service**: `PlatformService` 平台服务
- **name**: `string` 向量存储数据名称
- **触发方式**: emit

当有向量存储数据库被添加时，触发该事件。

### 事件：chatluna/vector-store-removed

- **service**: `PlatformService` 平台服务
- **name**: `string` 向量存储数据名称
- **触发方式**: emit

当有向量存储数据库被移除时，触发该事件。

