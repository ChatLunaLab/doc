# 请求工具

ChatLuna 基于 `undici.fetch` 和 `ws` 封装了带代理支持的请求工具。

建议模型适配器优先使用 `ChatLunaPlugin.fetch()` 和 `ChatLunaPlugin.ws()`。

## FormData

`koishi-plugin-chatluna/utils/request` 会重新导出 `undici` 的 `FormData`。

## globalProxyAddress

- **类型**: `string | null`

当前全局代理地址。

## setGlobalProxyAddress()

- **address**: `string`
- 返回值: `void`

设置全局代理地址。支持 `http://`、`https://`、`socks://`、`socks4://`、`socks5://` 等代理协议。

## chatLunaFetch()

- **info**: `RequestInfo`
- **init**: `RequestInit | undefined`
- **proxyAddress**: `string | undefined`
- 返回值: `Promise<Response>`

发送 HTTP 请求。`proxyAddress` 默认使用 `globalProxyAddress`。传入字符串 `'null'` 表示本次请求不使用代理。

```ts
const response = await chatLunaFetch(
  "https://api.example.com/data",
  { method: "GET" },
  "http://127.0.0.1:7890",
);
```

## ws()

- **url**: `string`
- **options**: `ClientOptions | ClientRequestArgs | undefined`
- **proxyAddress**: `string | undefined`
- 返回值: `WebSocket`

创建 WebSocket 连接。`proxyAddress` 的语义与 `chatLunaFetch()` 相同。

## randomUA()

- 返回值: `string`

生成一个随机的 User-Agent。用于模拟浏览器请求。
