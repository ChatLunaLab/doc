# 日志

ChatLuna 对 Koishi `Logger` 做了轻量封装，用于统一调试开关和本地日志管理。

## createLogger()

- **ctx**: `Context`
- **name**: `string`，默认 `chatluna`
- 返回值: `Logger`

创建或复用日志实例。

```ts
import { createLogger } from "koishi-plugin-chatluna/utils/logger";

const logger = createLogger(ctx, "my-plugin");
```

## setLoggerLevel()

- **level**: `number`
- 返回值: `void`

设置所有已创建 ChatLuna logger 的日志级别。

## clearLogger()

- 返回值: `void`

清空内部 logger 缓存。主插件销毁时会调用。

## trackLogToLocal()

- **tag**: `string`
- **output**: `string`
- **logger**: `Logger`
- 返回值: `Promise<void>`

异步把调试内容写入系统临时目录的 `chatluna/logs` 下，并清理 7 天前的旧日志。
