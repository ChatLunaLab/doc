# 平台服务

`PlatformService` 管理模型平台客户端、模型列表、工具、tool mask、向量数据库和聊天链。

你可以通过 `ctx.chatluna.platform` 获取实例。

## 类：PlatformService

### platform.registerClient()

- **name**: `PlatformClientNames`
- **createClientFunction**: `CreateClientFunction`
- 返回值: `() => void`

注册平台客户端工厂。

### platform.unregisterClient()

- **platform**: `PlatformClientNames`
- 返回值: `void`

移除平台客户端、模型缓存和创建函数，并触发对应的模型/嵌入/reranker 移除事件。

### platform.createClient()

- **platform**: `string`
- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<BasePlatformClient | undefined>`

创建并缓存平台客户端，然后刷新模型信息。

### platform.getClient()

- **platform**: `string`
- 返回值: `Promise<ComputedRef<BasePlatformClient | undefined>>`

确保客户端已创建，并以响应式引用返回。

### platform.refreshClient()

- **client**: `BasePlatformClient`
- **platform**: `string`
- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<void>`

检查客户端可用性并刷新模型列表。根据客户端类型触发：

- `chatluna/model-added`
- `chatluna/embeddings-added`
- `chatluna/reranker-added`

### platform.listPlatformModels()

- **platform**: `PlatformClientNames`
- **type**: `ModelType`
- 返回值: `ComputedRef<ModelInfo[]>`

返回指定平台和类型的模型列表。

### platform.findModel()

- **fullModelName**: `string`
- 返回值: `ComputedRef<ModelInfo | null>`

或：

- **platform**: `string`
- **name**: `string`
- 返回值: `ComputedRef<ModelInfo | null>`

查找模型信息，支持 `platform/model` 完整名称。

### platform.listAllModels()

- **type**: `ModelType`
- 返回值: `ComputedRef<PlatformModelInfo[]>`

汇总所有平台的模型信息。`ModelType` 当前包含：

- `ModelType.all`
- `ModelType.llm`
- `ModelType.embeddings`
- `ModelType.reranker`

## 工具

### platform.registerTool()

- **name**: `string`
- **toolCreator**: `ChatLunaTool`
- 返回值: `() => void`

注册工具，并触发 `chatluna/tool-updated`。注册时会为工具写入随机 `id`。

### platform.unregisterTool()

- **name**: `string`
- 返回值: `void`

移除工具，并触发 `chatluna/tool-updated`。

### platform.getTool()

- **name**: `string`
- 返回值: `ChatLunaTool`

获取工具定义。返回值中的 `createTool()` 会走内部缓存。

### platform.getTools()

- 返回值: `ComputedRef<string[]>`

返回所有工具名称。

### platform.getToolRegistry()

- 返回值: `Record<string, { name: string; description?: string; meta?: ChatLunaToolMeta }>`

返回轻量工具注册表，不包含 `createTool()`。

### platform.getFilteredTools()

- **mask**: `ToolMask`
- 返回值: `string[]`

按 `ToolMask` 过滤工具名称。

### platform.registerToolMaskResolver()

- **name**: `string`
- **resolver**: `ToolMaskResolver`
- 返回值: `() => void`

注册工具可见性解析器。

### platform.resolveToolMask()

- **arg**: `ToolMaskArg`
- 返回值: `Promise<ToolMask | undefined>`

按注册顺序调用 resolver。

### PlatformService.buildToolMask()

- **rule**: `{ mode?: 'inherit' | 'all' | 'allow' | 'deny'; allow?: string[]; deny?: string[] }`
- 返回值: `ToolMask`

把配置项转换为运行时 `ToolMask`。

## 向量数据库

### platform.registerVectorStore()

- **name**: `string`
- **vectorStoreRetrieverCreator**: `CreateVectorStoreFunction`
- 返回值: `() => void`

注册向量数据库创建函数，并触发 `chatluna/vector-store-added`。

### platform.unregisterVectorStore()

- **name**: `string`
- 返回值: `void`

移除向量数据库创建函数，并触发 `chatluna/vector-store-removed`。

### platform.createVectorStore()

- **name**: `string`
- **params**: `CreateVectorStoreParams`
- 返回值: `Promise<ChatLunaSaveableVectorStore>`

创建向量数据库实例。`params.key` 存在时会复用内部 LRU 缓存。

### platform.vectorStores

- **类型**: `ComputedRef<string[]>`

所有已注册的向量数据库名称。

## 聊天链

### platform.registerChatChain()

- **name**: `string`
- **description**: `Dict<string>`
- **createChatChainFunction**: `(params: CreateChatLunaLLMChainParams) => ChatLunaLLMChainWrapper`
- 返回值: `() => void`

注册聊天链，并触发 `chatluna/chat-chain-added`。

### platform.unregisterChatChain()

- **name**: `string`
- 返回值: `void`

移除聊天链，并触发 `chatluna/chat-chain-removed`。

### platform.createChatChain()

- **name**: `string`
- **params**: `CreateChatLunaLLMChainParams`
- 返回值: `ChatLunaLLMChainWrapper`

创建聊天链实例。

### platform.chatChains

- **类型**: `ComputedRef<ChatLunaChainInfo[]>`

所有已注册聊天链。

## 其他

### platform.dispose()

- 返回值: `void`

清理临时向量数据库、客户端、模型、工具和聊天链缓存。

## 类型

### ToolMask

```ts
export interface ToolMask {
  mode: "all" | "allow" | "deny";
  tools?: string[];
  allow: string[];
  deny: string[];
  toolCallMask?: ToolMask;
}
```

### ToolMaskArg

```ts
export interface ToolMaskArg {
  session: Session;
  conversation?: ConversationRecord;
  bindingKey?: string;
  source?: string;
}
```

### ToolMaskResolver

```ts
export type ToolMaskResolver = (
  arg: ToolMaskArg,
) => Awaitable<ToolMask | undefined>;
```

## 事件

- `chatluna/chat-chain-added`
- `chatluna/chat-chain-removed`
- `chatluna/model-added`
- `chatluna/model-removed`
- `chatluna/embeddings-added`
- `chatluna/embeddings-removed`
- `chatluna/reranker-added`
- `chatluna/reranker-removed`
- `chatluna/vector-store-added`
- `chatluna/vector-store-removed`
- `chatluna/tool-updated`
