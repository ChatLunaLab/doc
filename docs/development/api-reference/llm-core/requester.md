# Requester

Requester 用于封装模型、嵌入和 reranker 的底层 API 请求。适配器通常继承 `ModelRequester`，并按需要实现 `EmbeddingsRequester` 或 `RerankerRequester`。

## 接口：BaseRequestParams

```ts
export interface BaseRequestParams {
  timeout?: number
  signal?: AbortSignal
  model?: string
}
```

- `timeout`: 请求超时时间，单位毫秒。
- `signal`: 用于取消请求的 `AbortSignal`。
- `model`: 模型名称。

## 接口：ModelRequestParams

```ts
export interface ModelRequestParams extends BaseRequestParams {
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  n?: number
  logitBias?: Record<string, number>
  user?: string
  stop?: string[] | string
  input: BaseMessage[]
  id?: string
  tools?: StructuredTool[]
  variables?: Record<string, any>
  overrideRequestParams?: Record<string, any>
}
```

`overrideRequestParams` 用于在单次请求中透传平台特定参数。

## 接口：EmbeddingsRequestParams

```ts
export interface EmbeddingsRequestParams extends BaseRequestParams {
  input: string | string[]
}
```

## 接口：RerankerRequestParams

```ts
export interface RerankerRequestParams extends BaseRequestParams {
  query: string
  documents: string[]
  topN?: number
  maxChunksPerDoc?: number
}
```

## 接口：BaseRequester

```ts
export interface BaseRequester {
  init(): Promise<void>
  dispose(): Promise<void>
  logger: Logger
}
```

## 抽象类：ModelRequester

`ModelRequester` 实现了通用的配置刷新、错误计数、HTTP 请求和流式结果聚合逻辑。

### modelRequester.completion()

- **params**: `ModelRequestParams`
- 返回值: `Promise<ChatGeneration>`

调用 `completionStream()` 并聚合最终结果。

### modelRequester.completionStream()

- **params**: `ModelRequestParams`
- 返回值: `AsyncGenerator<ChatGenerationChunk>`

流式生成结果。子类需要实现 `completionStreamInternal()`。

### modelRequester.completionStreamInternal()

- **params**: `ModelRequestParams`
- 返回值: `AsyncGenerator<ChatGenerationChunk>`

具体平台请求逻辑。

### modelRequester.init()

- 返回值: `Promise<void>`

初始化请求器，默认实现为空。

### modelRequester.dispose()

- **model**: `string | undefined`
- **id**: `string | undefined`
- 返回值: `Promise<void>`

释放请求器资源，默认实现为空。

### modelRequester.post()

- **url**: `string`
- **data**: `any`
- **params**: `RequestInit`
- 返回值: `Promise<Response>`

向当前平台发送 POST 请求，自动附加默认 headers 并清理 `undefined` 字段。

### modelRequester.get()

- **url**: `string`
- **headers**: `Record<string, string> | undefined`
- **params**: `RequestInit`
- 返回值: `Promise<Response>`

向当前平台发送 GET 请求。

### modelRequester.buildHeaders()

- 返回值: `Record<string, string>`

生成默认请求头。默认使用 Bearer Token，可在子类覆盖。

### modelRequester.concatUrl()

- **url**: `string`
- 返回值: `string`

把相对路径拼接到当前配置的 `apiEndpoint` 后面。该方法只处理斜杠，不会自动添加 `/v1`。

## 接口：EmbeddingsRequester

```ts
export interface EmbeddingsRequester {
  embeddings(params: EmbeddingsRequestParams): Promise<number[] | number[][]>
}
```

## 接口：RerankerRequester

```ts
export interface RerankerRequester {
  rerank(params: RerankerRequestParams): Promise<RerankerResult[]>
}
```

## 接口：RerankerResult

```ts
export interface RerankerResult {
  index: number
  relevanceScore: number
}
```
