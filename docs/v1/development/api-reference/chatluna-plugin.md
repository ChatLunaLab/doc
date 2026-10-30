# ChatLuna 插件

`ChatLunaPlugin` 是开发 ChatLuna 扩展、模型适配器、向量数据库、工具和渲染器时使用的基础类。

## 类：ChatLunaPlugin

```ts
export class ChatLunaPlugin<
  R extends ClientConfig = ClientConfig,
  T extends ChatLunaPlugin.Config = ChatLunaPlugin.Config,
>
```

- **R**: 继承自 `ClientConfig` 的客户端配置类型。
- **T**: 继承自 `ChatLunaPlugin.Config` 的插件配置类型。

### new ChatLunaPlugin()

- **ctx**: `Context`
- **config**: `T`
- **platformName**: `PlatformClientNames`
- **createConfigPool**: `boolean`，默认 `true`

构造函数会在 `ready` 时自动安装插件，在 `dispose` 时自动卸载插件。

如果你只是扩展工具、渲染器或消息能力，不需要注册模型平台适配器时，请将 `createConfigPool` 设为 `false`。

```ts
const plugin = new ChatLunaPlugin(ctx, config, "my-extension", false);
```

### plugin.parseConfig()

- **f**: `(config: T) => R[]`
- 返回值: `void`

解析插件配置并加入 `platformConfigPool`。

```ts
plugin.parseConfig((config) =>
  config.apiKeys.map(([apiKey]) => ({
    apiKey,
    apiEndpoint: config.apiEndpoint,
  })),
);
```

### plugin.initClient()

- 返回值: `Promise<void>`

创建并刷新当前平台客户端。初始化失败时会卸载插件并取消当前 scope。

### plugin.supportedModels

- **类型**: `readonly string[]`

当前插件已加载的语言模型完整名称，格式为 `platform/model`。

### plugin.platformConfigPool

- **类型**: `ClientConfigPool<R>`

平台配置池，用于负载均衡、失败标记和读取平台配置。

### plugin.registerToService()

已废弃。当前插件会自动安装，不需要也不应该再手动调用该方法。

### plugin.registerClient()

- **func**: `() => BasePlatformClient`
- **platformName**: `string`，默认当前插件平台名
- 返回值: `void`

注册平台客户端工厂。实际 disposer 会交给 `ctx.effect()` 管理。

```ts
plugin.registerClient(
  () => new MyPlatformClient(ctx, plugin.platformConfigPool),
);
```

### plugin.registerVectorStore()

- **name**: `string`
- **func**: `CreateVectorStoreFunction`
- 返回值: `void`

注册向量数据库创建函数。

### plugin.registerTool()

- **name**: `string`
- **tool**: `ChatLunaTool`
- 返回值: `void`

注册 Agent 工具。

### plugin.registerChatChainProvider()

- **name**: `string`
- **description**: `Dict<string>`
- **func**: `(params: CreateChatLunaLLMChainParams) => ChatLunaLLMChainWrapper`
- 返回值: `void`

注册聊天链提供者。

### plugin.registerRenderer()

- **name**: `string`
- **renderer**: `(ctx: Context, config: Config) => Renderer`
- 返回值: `void`

注册回复渲染器。

### plugin.fetch()

- **info**: `RequestInfo`
- **init**: `RequestInit | undefined`
- **proxy**: `string | undefined`
- 返回值: `Promise<Response>`

按插件配置代理模式发送 HTTP 请求。

显式传入 `proxy` 时会覆盖插件代理模式。

传入字符串 `'null'` 表示本次请求不走代理。

### plugin.ws()

- **url**: `string`
- **options**: `ClientOptions | ClientRequestArgs | undefined`
- 返回值: `WebSocket`

按插件配置代理模式创建 WebSocket 连接。

## 命名空间：ChatLunaPlugin.Config

适配器插件配置通常继承 `ChatLunaPlugin.Config`。

```ts
export interface Config extends ChatLunaPlugin.Config {
  apiKeys: [string, boolean][];
  apiEndpoint: string;
}
```

内置字段：

- `chatConcurrentMaxSize?: number`
- `chatTimeLimit?: Computed<Awaitable<number>>`
- `timeout?: number`
- `configMode: string`
- `maxRetries: number`
- `proxyMode: string`
- `proxyAddress: string`
