# ChatLuna 插件

ChatLuna 提供了一个基础类，用于结合 ChatLuna 开发插件。

## 类：ChatLunaPlugin

```typescript
export class ChatLunaPlugin<
    R extends ClientConfig = ClientConfig,
    T extends ChatLunaPlugin.Config = ChatLunaPlugin.Config
>
```

- **R**: 继承自 `ClientConfig` 的客户端配置类型
- **T**: 继承自 `ChatLunaPlugin.Config` 的插件配置类型

### new ChatLunaPlugin(ctx, config, platformName, createConfigPool)

- **ctx**: `Context` Koishi 上下文
- **config**: `T` 插件配置
- **platformName**: `PlatformClientNames` 平台名称
- **createConfigPool**: `boolean` 是否创建配置池（默认为 `true`）

### parseConfig()

- **f**: `(config: T) => R[]` 配置解析函数
- 返回值: `Promise<void>`

解析插件配置并添加到配置池中。

```typescript
await plugin.parseConfig(config => [{
  apiKey: config.apiKey,
  baseURL: config.baseURL
}])
```

### initClients()

- 返回值: `Promise<void>`

初始化平台客户端。该方法会：

1. 注册配置池
2. 创建所有客户端
3. 更新支持的模型列表

### registerToService()

注册插件到 ChatLuna 服务中。通常在插件初始化时调用。

### dispose()

销毁插件，清理所有注册的资源。

### registerClient()

- **func**: `(ctx: Context, config: R) => BasePlatformClient` 客户端创建函数
- **platformName**: `string` 平台名称（可选，默认为插件的 platformName）
- 返回值: `void`

注册一个平台客户端。

```typescript
plugin.registerClient((ctx, config) => new MyPlatformClient(ctx, config))
```

### registerVectorStore()

- **name**: `string` 向量存储名称
- **func**: `CreateVectorStoreFunction` 向量存储创建函数
- 返回值: `void`

注册一个向量存储。

### registerTool()

- **name**: `string` 工具名称
- **tool**: `ChatLunaTool` 工具实例
- 返回值: `void`

注册一个工具。

### registerChatChainProvider()

- **name**: `string` 对话链名称
- **description**: `Dict<string>` 多语言描述
- **func**: `(params: CreateChatLunaLLMChainParams) => Promise<ChatLunaLLMChainWrapper>` 对话链创建函数
- 返回值: `void`

注册一个对话链提供者。

### fetch()

- **info**: `RequestInfo` 请求信息
- **init**: `RequestInit` 请求配置（可选）
- 返回值: `Promise<Response>`

根据插件配置的代理模式发送 HTTP 请求。

支持三种代理模式：

- `system`: 使用系统代理
- `off`: 不使用代理
- `on`: 使用指定代理地址

### ws()

- **url**: `string` WebSocket 地址
- **options**: `ClientOptions | ClientRequestArgs` 连接选项（可选）
- 返回值: `WebSocket`

根据插件配置的代理模式创建 WebSocket 连接。

支持与 fetch 相同的代理模式。