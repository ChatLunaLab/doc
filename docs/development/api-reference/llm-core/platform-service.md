# 平台服务

ChatLuna 平台服务负责管理平台客户端、模型、工具、向量存储以及对话链等资源，并通过响应式的方式向外暴露当前可用的数据。

可以通过 `ctx.chatluna.platform` 获取到 `PlatformService` 的实例。

## 类：PlatformService

### platform.registerClient()

- **name**: `PlatformClientNames` 平台名称
- **createClientFunction**: `CreateClientFunction` 创建客户端的工厂函数
- 返回值: `() => void`

注册一个平台客户端工厂函数，返回的卸载函数用于移除该客户端。

### platform.unregisterClient()

- **platform**: `PlatformClientNames` 平台名称

移除平台客户端，并触发相关的模型、嵌入事件。

### platform.createClient()

- **platform**: `string` 平台名称
- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<BasePlatformClient | undefined>`

根据已注册的工厂函数创建并缓存平台客户端，同时刷新模型信息。

### platform.getClient()

- **platform**: `string` 平台名称
- 返回值: `Promise<ComputedRef<BasePlatformClient | undefined>>`

确保客户端已创建，并以 `ComputedRef` 的形式返回客户端引用。

> [!TIP]
> 平台服务广泛使用 Vue 的响应式 `ComputedRef`，当底层数据发生变化时会自动更新。

### platform.refreshClient()

- **client**: `BasePlatformClient` 客户端实例
- **platform**: `string` 平台名称
- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<void>`

刷新客户端模型列表，并根据客户端类型触发相应的更新事件。

### platform.registerTool()

- **name**: `string` 工具名称
- **toolCreator**: `ChatLunaTool` 工具描述
- 返回值: `() => void`

注册一个工具，并触发 `chatluna/tool-updated` 事件。工具在注册时会被赋予随机 `id`。

### platform.unregisterTool()

- **name**: `string` 工具名称

移除已注册的工具，并触发 `chatluna/tool-updated` 事件。

### platform.getTool()

- **name**: `string` 工具名称
- 返回值: `ChatLunaTool`

获取已注册的工具，并对 `createTool` 方法进行包装以缓存实际创建的 `StructuredTool` 实例。

### platform.getTools()

- 返回值: `ComputedRef<string[]>`

以响应式数组的形式返回当前可用的工具名称列表。

### platform.registerVectorStore()

- **name**: `string` 向量存储名称
- **vectorStoreRetrieverCreator**: `CreateVectorStoreFunction` 创建函数
- 返回值: `() => void`

注册一个向量存储创建函数，并触发 `chatluna/vector-store-added` 事件。

### platform.unregisterVectorStore()

- **name**: `string` 向量存储名称

移除向量存储创建函数，并触发 `chatluna/vector-store-removed` 事件。

### platform.createVectorStore()

- **name**: `string` 向量存储名称
- **params**: `CreateVectorStoreParams`
- 返回值: `Promise<ChatLunaSaveableVectorStore>`

根据名称创建向量存储实例，支持通过 `params.key` 对创建结果进行缓存并复用。

### platform.vectorStores

- 返回值: `ComputedRef<string[]>`

获取所有已注册的向量存储名称（响应式）。

### platform.registerChatChain()

- **name**: `string` 对话链名称
- **description**: `Dict<string>` 对话链描述
- **createChatChainFunction**: `(params: CreateChatLunaLLMChainParams) => ChatLunaLLMChainWrapper`
- 返回值: `() => void`

注册一个对话链，并触发 `chatluna/chat-chain-added` 事件。

### platform.unregisterChatChain()

- **name**: `string` 对话链名称

移除对话链，触发 `chatluna/chat-chain-removed` 事件。

### platform.createChatChain()

- **name**: `string` 对话链名称
- **params**: `CreateChatLunaLLMChainParams`
- 返回值: `ChatLunaLLMChainWrapper`

根据名称创建对话链实例，未注册时会抛出错误。

### platform.listPlatformModels()

- **platform**: `PlatformClientNames` 平台名称
- **type**: `ModelType`
- 返回值: `ComputedRef<ModelInfo[]>`

按类型筛选指定平台的模型列表，返回排序后的响应式数组。

### platform.findModel()

- **fullModelName**: `string`
- 返回值: `ComputedRef<ModelInfo | null>`

或

- **platform**: `string`
- **name**: `string`
- 返回值: `ComputedRef<ModelInfo | null>`

查找模型信息，支持传入形如 `platform/name` 的完整模型名。

### platform.listAllModels()

- **type**: `ModelType`
- 返回值: `ComputedRef<PlatformModelInfo[]>`

汇总所有平台的模型信息，并在返回值中追加 `platform` 与 `toModelName()`。

### platform.chatChains

- 返回值: `ComputedRef<ChatLunaChainInfo[]>`

以响应式数组形式返回已注册的对话链信息。

### platform.dispose()

- 返回值: `void`

清理内部缓存并重置服务状态。

## 事件

平台服务会通过 Koishi 事件总线广播资源变动，可监听以下事件进行扩展：

- `chatluna/chat-chain-added`
- `chatluna/chat-chain-removed`
- `chatluna/model-added`
- `chatluna/model-removed`
- `chatluna/embeddings-added`
- `chatluna/embeddings-removed`
- `chatluna/vector-store-added`
- `chatluna/vector-store-removed`
- `chatluna/tool-updated`

监听函数会收到 `PlatformService` 实例以及相关的资源信息。
