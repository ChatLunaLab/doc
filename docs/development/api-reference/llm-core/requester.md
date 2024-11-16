# Requester

ChatLuna 提供了模型请求器，用于请求模型。

## 接口：BaseRequestParams

```typescript
export interface BaseRequestParams {
    timeout?: number
    signal?: AbortSignal
    model?: string
}
```

### timeout

- **类型**: `number | undefined`

请求超时时间。

### signal

- **类型**: `AbortSignal | undefined`

用于取消请求的信号。

### model

- **类型**: `string | undefined`

要使用的模型名称。

## 接口：ModelRequestParams

继承自 `BaseRequestParams`。

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
}
```

### temperature

- **类型**: `number | undefined`

采样温度。

### maxTokens

- **类型**: `number | undefined`

生成的最大令牌数。设置为 -1 时将在提示和模型最大上下文大小的限制下返回尽可能多的令牌。

### topP

- **类型**: `number | undefined`

每一步要考虑的令牌的总概率质量。

### frequencyPenalty

- **类型**: `number | undefined`

根据频率对重复的令牌进行惩罚。

### presencePenalty

- **类型**: `number | undefined`

对重复的令牌进行惩罚。

### n

- **类型**: `number | undefined`

为每个提示生成的完成数。

### logitBias

- **类型**: `Record<string, number> | undefined`

用于调整特定令牌生成概率的字典。

### user

- **类型**: `string | undefined`

代表最终用户的唯一字符串标识符，可帮助监控和检测滥用。

### stop

- **类型**: `string[] | string | undefined`

生成时使用的停止词列表。

### input

- **类型**: `BaseMessage[]`

用于模型完成的输入消息。

### id

- **类型**: `string | undefined`

请求的唯一标识符。

### tools

- **类型**: `StructuredTool[] | undefined`

可用的工具列表。

## 接口：EmbeddingsRequestParams

继承自 `BaseRequestParams`。

```typescript
export interface EmbeddingsRequestParams extends BaseRequestParams {
    input: string | string[]
}
```

### input

- **类型**: `string | string[]`

要嵌入的输入文本。

## 接口：BaseRequester

```typescript
export interface BaseRequester {
    init(): Promise<void>
    dispose(): Promise<void>
}
```

基础请求器接口。

## 抽象类：ModelRequester

实现了 `BaseRequester` 接口。

### modelRequester.completion()

- **params**: [`ModelRequestParams`](#接口modelrequestparams)
- 返回值: `Promise<ChatGeneration>`

执行模型完成请求。

### modelRequester.completionStream()

- **params**: [`ModelRequestParams`](#接口modelrequestparams)
- 返回值: `AsyncGenerator<ChatGenerationChunk>`

执行流式模型完成请求。

## 接口：EmbeddingsRequester

```typescript
export interface EmbeddingsRequester {
    embeddings(params: EmbeddingsRequestParams): Promise<number[] | number[][]>
}
```

嵌入请求器接口。

### embeddingsRequester.embeddings()

- **params**: [`EmbeddingsRequestParams`](#接口embeddingsrequestparams)
- 返回值: `Promise<number[] | number[][]>`

执行嵌入请求。
