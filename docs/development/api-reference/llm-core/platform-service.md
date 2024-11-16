# 平台服务

ChatLuna 平台服务用于管理平台相关的配置、模型、工具等资源。

## 类：PlatformService

可以通过 `ctx.chatluna.platform` 访问到该类的实例。

### platform.registerClient()

- **name**: `PlatformClientNames` 平台名称
- **createClientFunction**: `(ctx: Context, config: ClientConfig) => BasePlatformClient` 创建客户端的函数
- 返回值: `() => void` 注销函数

注册一个平台客户端。

### platform.registerConfigPool()

- **name**: `string` 配置池名称
- **configPool**: `ClientConfigPool` 配置池实例

注册一个配置池。

### platform.registerTool()

- **name**: `string` 工具名称
- **toolCreator**: `ChatLunaTool` 工具创建器
- 返回值: `() => void` 注销函数

注册一个工具。

### platform.registerVectorStore()

- **name**: `string` 向量存储名称
- **vectorStoreRetrieverCreator**: `CreateVectorStoreFunction` 向量存储创建函数
- 返回值: `() => void` 注销函数

注册一个向量存储。

### platform.registerChatChain()

- **name**: `string` 对话链名称
- **description**: `Dict<string>` 描述
- **createChatChainFunction**: `(params: CreateChatLunaLLMChainParams) => Promise<ChatLunaLLMChainWrapper>` 创建对话链函数
- 返回值: `() => void` 注销函数

注册一个对话链。

### platform.getModels()

- **platform**: `PlatformClientNames` 平台名称
- **type**: `ModelType` 模型类型
- 返回值: `ModelInfo[]`

获取指定平台的模型列表。

### platform.getTools()

- 返回值: `string[]`

获取所有已注册的工具名称。

### platform.getConfigs()

- **platform**: `string` 平台名称
- 返回值: `ClientConfig[]`

获取指定平台的配置列表。

### platform.resolveModel()

- **platform**: `PlatformClientNames` 平台名称
- **name**: `string` 模型名称
- 返回值: `ModelInfo | undefined`

解析指定平台的模型信息。

### platform.getAllModels()

- **type**: `ModelType` 模型类型
- 返回值: `string[]`

获取所有平台的模型列表。

### platform.getVectorStores()

- 返回值: `string[]`

获取所有已注册的向量存储名称。

### platform.getChatChains()

- 返回值: `ChatLunaChainInfo[]`

获取所有已注册的对话链信息。

### platform.createVectorStore()

- **name**: `string` 向量存储名称
- **params**: `CreateVectorStoreParams` 创建参数
- 返回值: `Promise<ChatLunaSaveableVectorStore>`

创建一个向量存储实例。

### platform.randomConfig()

- **platform**: `string` 平台名称
- **lockConfig**: `boolean` 是否锁定配置
- 返回值: `Promise<ClientConfig | undefined>`

随机获取一个平台配置。

### platform.randomClient()

- **platform**: `string` 平台名称
- **lockConfig**: `boolean` 是否锁定配置
- 返回值: `Promise<BasePlatformClient | undefined>`

随机获取一个平台客户端。

### platform.getClient()

- **config**: `ClientConfig` 客户端配置
- 返回值: `Promise<BasePlatformClient>`

获取或创建一个平台客户端。

### platform.createClient()

- **platform**: `string` 平台名称
- **config**: `ClientConfig` 客户端配置
- 返回值: `Promise<BasePlatformClient>`

创建一个平台客户端。

### platform.createClients()

- **platform**: `string` 平台名称
- 返回值: `Promise<BasePlatformClient[]>`

创建指定平台的所有客户端。

### platform.getTool()

- **name**: `string` 工具名称
- 返回值: `ChatLunaTool | undefined`

获取指定名称的工具。

### platform.createChatChain()

- **name**: `string` 对话链名称
- **params**: `CreateChatLunaLLMChainParams` 创建参数
- 返回值: `Promise<ChatLunaLLMChainWrapper>`

创建一个对话链实例。
