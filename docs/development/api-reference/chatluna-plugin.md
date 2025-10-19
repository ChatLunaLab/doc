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

构造函数会在上下文 `ready` 时自动安装插件，并在上下文销毁时自动卸载，无需额外调用注册方法。

### parseConfig()

- **f**: `(config: T) => R[]` 配置解析函数
- 返回值: `void`

解析插件配置并添加到配置池中。

```typescript
plugin.parseConfig(config => [{
  apiKey: config.apiKey,
  baseURL: config.baseURL
}])
```

### initClient()

- 返回值: `Promise<void>`

初始化当前平台的客户端。如果创建过程中发生错误会回滚安装流程并抛出异常。

### dispose()

销毁插件，清理所有注册的资源。

### supportedModels

- 返回值: `readonly string[]`

获取当前插件可用的模型名称列表，形式为 `platform/model`。

### platformConfigPool

- 返回值: `ClientConfigPool<R>`

访问插件的配置池，可用于自定义负载均衡策略或读取已解析的配置。

### registerClient()

- **func**: `() => BasePlatformClient` 客户端创建函数
- **platformName**: `string` 平台名称（可选，默认为插件的 platformName）
- 返回值: `void`

注册一个平台客户端。

```typescript
plugin.registerClient(() => new MyPlatformClient(ctx, plugin.platformConfigPool))
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
- **func**: `(params: CreateChatLunaLLMChainParams) => ChatLunaLLMChainWrapper` 对话链创建函数
- 返回值: `void`

注册一个对话链提供者。

### registerRenderer()

- **name**: `string` 渲染器名称
- **renderer**: `(ctx: Context, config: Config) => Renderer` 渲染器工厂函数
- 返回值: `void`

注册一个响应渲染器。

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
