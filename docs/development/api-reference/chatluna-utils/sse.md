# SSE 工具

ChatLuna 提供了 Server-Sent Events (SSE) 工具。

## 基础用法

```typescript
import { sse, sseIterable } from 'koishi-plugin-chatluna/utils/sse'


const response = await chatLunaFetch('https://api.example.com/sse')

await sse(response, async (rawData) => {
    console.log('收到数据:', rawData)
})

for await (const event of sseIterable(response)) {
    if (event === '[DONE]') {
        console.log('SSE 传输完成')
        break
    }
    console.log('收到事件:', event)
}

```

## API

### sse(response, onEvent, cacheCount)

- **response**: `Response | ReadableStreamDefaultReader<string>` SSE 响应对象
- **onEvent**: `(rawData: string) => Promise<string | boolean | void>` 事件处理回调函数
- **cacheCount**: `number` 缓存计数，默认为 0
- 返回值: `Promise<void>`

处理 SSE 响应流，通过回调函数处理每个事件数据。当 `cacheCount` 大于 0 时，将累积指定数量的事件后一次性调用回调函数。

### sseIterable(response)

- **response**: `Response | ReadableStreamDefaultReader<string>` SSE 响应对象
- 返回值: `AsyncGenerator<string, '[DONE]', unknown>`

将 SSE 响应转换为异步迭代器，每次迭代返回一个事件数据。当所有事件处理完成时，返回 `'[DONE]'`。

### rawSeeAsIterable(response, cacheCount)

- **response**: `Response | ReadableStreamDefaultReader<string>` SSE 响应对象
- **cacheCount**: `number` 缓存计数，默认为 0
- 返回值: `AsyncGenerator<string, void, unknown>`

将 SSE 响应转换为原始数据的异步迭代器。当 `cacheCount` 大于 0 时，将累积指定数量的原始数据后一次性产出。

> [!IMPORTANT] 注意
> `rawSeeAsIterable` 返回的是未经解析的原始 SSE 数据流，而 `sseIterable` 返回的是经过解析的事件数据。
