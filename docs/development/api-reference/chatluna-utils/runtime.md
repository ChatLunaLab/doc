# 运行时工具

本页收录 ChatLuna 暴露的常用运行时辅助工具。

## Promise 工具

导入路径：`koishi-plugin-chatluna/utils/promise`

### withResolver()

- 返回值: `{ promise, resolve, reject }`

创建一个外部可 resolve/reject 的 Promise。

### runAsync()

- **func**: `() => Promise<void>`
- 返回值: `void`

执行异步函数并把错误重新抛出。

### runAsyncTimeout()

- **func**: `Promise<T>`
- **timeout**: `number`
- **defaultValue**: `T | null`
- 返回值: `Promise<T>`

为 Promise 增加超时兜底。

## ObjectLock

导入路径：`koishi-plugin-chatluna/utils/lock`

### new ObjectLock()

- **timeout**: `number`，默认 3 分钟

### lock.lock()

- 返回值: `Promise<() => void>`

获取锁，返回释放锁的函数。

### lock.runLocked()

- **func**: `() => Promise<T>`
- 返回值: `Promise<T>`

自动加锁、执行并释放。

### lock.isLocked

- **类型**: `boolean`

## RequestIdQueue

导入路径：`koishi-plugin-chatluna/utils/queue`

用于按 key 管理请求队列。

### queue.add()

- **key**: `string`
- **requestId**: `string`
- 返回值: `Promise<void>`

### queue.remove()

- **key**: `string`
- **requestId**: `string`
- 返回值: `Promise<void>`

### queue.wait()

- **key**: `string`
- **requestId**: `string`
- **maxConcurrent**: `number`
- **timeout**: `number`
- 返回值: `Promise<void>`

### queue.getQueueLength()

- **key**: `string`
- 返回值: `Promise<number>`

### queue.getQueueStatus()

- **key**: `string`
- 返回值: `Promise<{ length: number; items: { requestId: string; age: number }[] }>`

## Pagination

导入路径：`koishi-plugin-chatluna/utils/pagination`

### new Pagination()

- **input**: `PaginationInput<T>`

### pagination.push()

- **items**: `T[]`
- **key**: `string`
- 返回值: `Promise<void>`

### pagination.getPage()

- **page**: `number`
- **limit**: `number`
- **key**: `string`
- 返回值: `Promise<T[]>`

### pagination.formatItems()

- **items**: `T[]`
- **page**: `number`
- **limit**: `number`
- **total**: `number | undefined`
- 返回值: `Promise<string>`

### pagination.getFormattedPage()

- **page**: `number`
- **limit**: `number`
- **key**: `string`
- 返回值: `Promise<string>`

### pagination.searchPage()

- **find**: `(value: T) => boolean`
- 返回值: `Promise<string>`

### pagination.updateFormatString()

- **formatString**: `PaginationInput<T>['formatString']`

### pagination.updateFormatItem()

- **formatItem**: `PaginationInput<T>['formatItem']`

### pagination.getTotalPages()

- **key**: `string`
- 返回值: `number`

### pagination.hasPage()

- **page**: `number`
- **key**: `string`
- 返回值: `boolean`
