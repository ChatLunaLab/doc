# 请求工具

ChatLuna 基于 `fetch` 和 `ws` 封装了请求工具，添加了代理支持。

默认情况下，代理会被设置为 [这里](../../../guide/useful-configurations.md#proxyaddress) 的配置。

> [!TIP] 提示
> 我们更推荐模型适配器的实现者使用 `ChatLunaPlugin` 提供的 `fetch` 和 `ws` 方法。
> 参考 [ChatLunaPlugin](../api-reference/chatluna-plugin)。

## 基础用法

```typescript
import { chatLunaFetch, ws, randomUA } from 'koishi-plugin-chatluna/utils/request'

const response = await chatLunaFetch('https://api.example.com/data', {
    method: 'GET',
}, "http://localhost:7890")

const wsClient = ws('wss://api.example.com/ws', {
    withCredentials: true,
}, "http://localhost:7890")

const ua = randomUA()
```

## API

### chatLunaFetch(url, init, proxy)

- **url**: `string` 请求 URL
- **init**: `RequestInit` 请求配置
- **proxy**: `string?` 代理地址
- 返回值: `Promise<Response>`

建立一个 `fetch` 请求。

> [!TIP] 注意
> 如果 `proxy` 参数传递为 'null'(注意是纯文本的 `null`，不是 `null` 变量)，则不会使用代理。

### ws(url, init, proxy)

- **url**: `string` 请求 URL
- **init**: `WebSocketConstructorInit` 请求配置
- **proxy**: `string?` 代理地址
- 返回值: `WebSocket`
建立一个 `ws` 请求。

> [!TIP] 注意
> 如果 `proxy` 参数传递为 'null'(注意是纯文本的 `null`，不是 `null` 变量)，则不会使用代理。

### randomUA()

- 返回值: `string`

生成一个随机的 User-Agent。用于模拟浏览器请求。
