# 日志 

Koishi 本身已经自带了好用的日志工具。

ChatLuna 基于其简易的封装了一下，主要是为了支持 [isLog](../../../guide/useful-configurations.md#islog) 配置。

这样当用户开启 `isLog` 配置时，`debug` 日志将会输出到 Koishi 日志中。

## 基础用法

```typescript
import { createLogger } from 'koishi-plugin-chatluna/utils/logger'

const logger = createLogger(ctx, 'MyLogger')
```

## API

### createLogger(ctx, name)

- **ctx**: `Context` Koishi 的上下文
- **name**: `string` 日志实例名称

创建一个日志实例。

### setLoggerLevel(level)

- **level**: `number` 日志级别

设置日志级别。
