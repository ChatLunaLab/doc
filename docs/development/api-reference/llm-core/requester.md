# Requester

模型请求器用于向不同平台发送模型推理或向量嵌入请求，并提供统一的参数定义与工具方法。

## 接口：BaseRequestParams

```typescript
export interface BaseRequestParams {
    timeout?: number
    signal?: AbortSignal
    model?: string
}
```

- **timeout**: 请求超时时间（毫秒）。
- **signal**: 用于取消请求的 `AbortSignal`。
- **model**: 指定的模型名称。

## 接口：ModelRequestParams

```typescript
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
}
```

在基础参数的基础上扩展了对话生成常用的采样、停止词、工具调用等配置，`input` 为必填的消息数组。`variables` 可在请求前传递额外的上下文变量。

## 接口：EmbeddingsRequestParams

```typescript
export interface EmbeddingsRequestParams extends BaseRequestParams {
    input: string | string[]
}
```

嵌入请求的输入既可以是单条文本，也可以是文本数组。

## 接口：BaseRequester

```typescript
export interface BaseRequester {
    init(): Promise<void>
    dispose(): Promise<void>
    logger: Logger
}
```

所有请求器都会暴露 Koishi 的 `Logger`，可用于输出调试信息。

## 抽象类：ModelRequester

`ModelRequester` 实现了 `BaseRequester` 并封装了通用的错误重试、HTTP 请求与结果聚合逻辑。

### modelRequester.completion()

- **params**: [`ModelRequestParams`](#接口modelrequestparams)
- 返回值: `Promise<ChatGeneration>`

调用 `completionStream()` 并将流式结果聚合为最终的 `ChatGeneration`。

### modelRequester.completionStream()

- **params**: [`ModelRequestParams`](#接口modelrequestparams)
- 返回值: `AsyncGenerator<ChatGenerationChunk>`

生成模型的流式响应。实现类需要覆写 `completionStreamInternal()` 以提供具体的请求逻辑。

### modelRequester.init()

- 返回值: `Promise<void>`

初始化请求器，默认实现为空，可在子类中扩展。

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

向当前平台发送 POST 请求，会自动补齐认证头并清理 `undefined` 字段。

### modelRequester.get()

- **url**: `string`
- **headers**: `Record<string, string> | undefined`
- **params**: `RequestInit`
- 返回值: `Promise<Response>`

发送 GET 请求并附加默认请求头。

### modelRequester.buildHeaders()

- 返回值: `Record<string, string>`

根据当前配置生成默认的 HTTP 头部信息。

### modelRequester.concatUrl()

- **url**: `string`
- 返回值: `string`

将相对地址拼接到平台配置的 `apiEndpoint`，自动补足 `/v1/` 前缀及斜杠。

## 接口：EmbeddingsRequester

```typescript
export interface EmbeddingsRequester {
    embeddings(params: EmbeddingsRequestParams): Promise<number[] | number[][]>
}
```

嵌入请求器需要实现 `embeddings()` 方法，以返回单条或批量的向量结果。
