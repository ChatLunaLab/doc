# ChatLuna 事件

> [!TIP] 提示
> 参见 [Koishi 事件](https://koishi.chat/zh-CN/guide/basic/events.html)

ChatLuna 使用 Koishi 事件总线暴露会话、模型、工具、向量数据库和聊天生命周期变化。

## 通用事件

### 事件：`chatluna/before-check-sender`

- **session**: `Session`
- **返回值**: `boolean`
- **触发方式**: `serial`

在 ChatLuna 处理会话前触发。返回 `true` 表示跳过后续处理。

### 事件：`chatluna/check-passive-trigger`

- **session**: `Session`
- **content**: `string`
- **返回值**: `boolean`
- **触发方式**: `serial`

用于判断被动触发消息是否应该继续进入 ChatLuna。

## 聊天事件

### 事件：`chatluna/before-chat`

- **conversationId**: `string`
- **message**: `HumanMessage`
- **promptVariables**: `ChainValues`
- **chatInterface**: `ChatInterface`
- **session**: `Session`
- **触发方式**: `parallel`

在调用模型前触发，可用于修改变量、注入上下文或提前打断流程。

### 事件：`chatluna/after-chat`

- **conversationId**: `string`
- **sourceMessage**: `HumanMessage`
- **responseMessage**: `AIMessage`
- **promptVariables**: `ChainValues`
- **chatInterface**: `ChatInterface`
- **session**: `Session`
- **触发方式**: `parallel`

在模型返回后触发。

### 事件：`chatluna/clear-chat-history`

- **conversationId**: `string`
- **chatInterface**: `ChatInterface`
- **触发方式**: `parallel`

当会话历史被清空时触发。

### 事件：`chatluna/after-chat-error`

- **error**: `Error`
- **conversationId**: `string`
- **sourceMessage**: `HumanMessage`
- **promptVariables**: `ChainValues`
- **chatInterface**: `ChatInterface`
- **chain**: `ChatLunaLLMChainWrapper | undefined`
- **requestId**: `string`
- **触发方式**: `parallel`

聊天流程异常时触发。

### 事件：`chatluna/before-conversation-create`

- **conversation**: `ConversationRecord`
- **bindingKey**: `string`
- **触发方式**: `parallel`

在创建会话前触发，可用于修改会话数据或阻止创建。

### 事件：`chatluna/after-conversation-create`

- **conversation**: `ConversationRecord`
- **bindingKey**: `string`
- **触发方式**: `parallel`

会话创建完成后触发。

### 事件：`chatluna/before-conversation-switch`

- **bindingKey**: `string`
- **conversation**: `ConversationRecord`
- **previousConversation**: `ConversationRecord | null | undefined`
- **触发方式**: `parallel`

切换会话前触发，可用于阻止切换或执行清理操作。

### 事件：`chatluna/after-conversation-switch`

- **bindingKey**: `string`
- **conversation**: `ConversationRecord`
- **previousConversation**: `ConversationRecord | null | undefined`
- **触发方式**: `parallel`

会话切换完成后触发。

### 事件：`chatluna/after-binding-update`

- **binding**: `BindingRecord`
- **previousConversationId**: `string | null | undefined`
- **触发方式**: `parallel`

绑定关系更新后触发。

### 事件：`chatluna/after-constraint-update`

- **constraint**: `ConstraintRecord`
- **触发方式**: `parallel`

约束条件更新后触发。

### 事件：`chatluna/before-conversation-archive`

- **conversation**: `ConversationRecord`
- **触发方式**: `parallel`

会话归档前触发。

### 事件：`chatluna/after-conversation-archive`

- **conversation**: `ConversationRecord`
- **archive**: `ArchiveRecord`
- **path**: `string`
- **触发方式**: `parallel`

会话归档完成后触发。

### 事件：`chatluna/before-conversation-restore`

- **conversation**: `ConversationRecord`
- **archive**: `ArchiveRecord`
- **触发方式**: `parallel`

会话恢复前触发。

### 事件：`chatluna/after-conversation-restore`

- **conversation**: `ConversationRecord`
- **archive**: `ArchiveRecord`
- **触发方式**: `parallel`

会话恢复完成后触发。

### 事件：`chatluna/before-conversation-delete`

- **conversation**: `ConversationRecord`
- **触发方式**: `parallel`

会话删除前触发。

### 事件：`chatluna/after-conversation-delete`

- **conversation**: `ConversationRecord`
- **触发方式**: `parallel`

会话删除完成后触发。

### 事件：`chatluna/before-conversation-clear-history`

- **conversation**: `ConversationRecord`
- **chatInterface**: `ChatInterface`
- **触发方式**: `parallel`

会话历史清空前触发。

### 事件：`chatluna/after-conversation-clear-history`

- **conversation**: `ConversationRecord`
- **chatInterface**: `ChatInterface`
- **触发方式**: `parallel`

会话历史清空完成后触发。

### 事件：`chatluna/before-conversation-cache-clear`

- **conversation**: `ConversationRecord`
- **chatInterface**: `ChatInterface | undefined`
- **触发方式**: `parallel`

会话缓存清空前触发。

### 事件：`chatluna/after-conversation-cache-clear`

- **conversation**: `ConversationRecord`
- **触发方式**: `parallel`

会话缓存清空完成后触发。

### 事件：`chatluna/conversation-compressed`

- **conversation**: `ConversationRecord`
- **result**: `CompressContextResult`
- **触发方式**: `parallel`

会话上下文压缩完成后触发。

## 生命周期事件

### 事件：`chatluna/chat-chain-added`

- **service**: `PlatformService`
- **chain**: `ChatLunaChainInfo`
- **触发方式**: `emit`

### 事件：`chatluna/chat-chain-removed`

- **service**: `PlatformService`
- **chain**: `ChatLunaChainInfo`
- **触发方式**: `emit`

### 事件：`chatluna/tool-updated`

- **service**: `PlatformService`
- **触发方式**: `emit`

### 事件：`chatluna/model-added`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient | BasePlatformClient[]`
- **触发方式**: `emit`

### 事件：`chatluna/model-removed`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient | BasePlatformClient[]`
- **触发方式**: `emit`

### 事件：`chatluna/embeddings-added`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient | BasePlatformClient[]`
- **触发方式**: `emit`

### 事件：`chatluna/embeddings-removed`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient | BasePlatformClient[]`
- **触发方式**: `emit`

### 事件：`chatluna/reranker-added`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient | BasePlatformClient[]`
- **触发方式**: `emit`

### 事件：`chatluna/reranker-removed`

- **service**: `PlatformService`
- **platform**: `PlatformClientNames`
- **client**: `BasePlatformClient`
- **触发方式**: `emit`

### 事件：`chatluna/vector-store-added`

- **service**: `PlatformService`
- **name**: `string`
- **触发方式**: `emit`

### 事件：`chatluna/vector-store-removed`

- **service**: `PlatformService`
- **name**: `string`
- **触发方式**: `emit`
