# 平台客户端

平台客户端负责声明平台能力、刷新模型列表并按模型名创建模型实例。

## 抽象类：BasePlatformClient

```ts
export abstract class BasePlatformClient<
  T extends ClientConfig = ClientConfig,
  R = ChatLunaChatModel | ChatLunaBaseEmbeddings | ChatLunaReranker,
>
```

### constructor()

- **ctx**: `Context`
- **configPool**: `ClientConfigPool<T>`

### client.platform

- **类型**: `PlatformClientNames`

平台名称。

### client.isAvailable()

- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<boolean>`

检查配置是否可用。内部会调用 `init()` 并按配置重试。

### client.getModels()

- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<ModelInfo[]>`

获取并缓存模型列表。模型会自动补齐 `ModelCapabilities.TextInput`，图片生成模型除外。

### client.init()

- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<void>`

默认调用 `getModels()`。

### client.refreshModels()

- **config**: `RunnableConfig | undefined`
- 返回值: `Promise<ModelInfo[]>`

子类必须实现，返回平台支持的模型列表。

### client.getFileHandlingConfig()

- 返回值: `FileHandlingConfig | null`

声明平台对内联文件输入的支持。默认返回 `null`。

### client.createModel()

- **model**: `string`
- 返回值: `R`

创建并缓存模型实例。实际创建逻辑由子类 `_createModel()` 实现。

## 子类

### PlatformModelClient

只提供语言模型，`createModel()` 返回 `ChatLunaChatModel`。

额外方法：

- `clearContext(): Promise<void>`

### PlatformEmbeddingsClient

只提供嵌入模型，`createModel()` 返回 `ChatLunaBaseEmbeddings`。

### PlatformModelAndEmbeddingsClient

同时提供语言模型和嵌入模型。

### PlatformRerankerClient

只提供 reranker，`createModel()` 返回 `ChatLunaReranker`。

### PlatformModelEmbeddingsAndRerankerClient

同时提供语言模型、嵌入模型和 reranker。

## 接口：FileHandlingConfig

```ts
export interface FileHandlingConfig {
  supportedMimeTypes: Set<string>
  maxTotalSizeBytes: number
  maxFileSizeBytes: number
  maxFileSizeBytesOverrides?: Record<string, number>
}
```

字段说明：

- `supportedMimeTypes`: 平台支持内联发送的 MIME 类型。
- `maxTotalSizeBytes`: 单次消息所有内联文件的最大总大小。
- `maxFileSizeBytes`: 单个文件默认最大大小。
- `maxFileSizeBytesOverrides`: 针对特定 MIME 类型的单文件大小覆盖。

## 接口：ModelInfo

```ts
export interface ModelInfo {
  name: string
  type: ModelType
  maxTokens: number
  capabilities: ModelCapabilities[]
}
```

`ModelType` 包含 `all`、`llm`、`embeddings`、`reranker`。

`ModelCapabilities` 包含 `TextInput`、`ToolCall`、`ImageInput`、`Thinking`、`ImageGeneration`、`AudioInput`、`VideoInput`、`FileInput`。
