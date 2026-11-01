# 会话日志 (Sessions)

`ctx.sessions`（由 `@chatluna/session` 提供）是仅追加（append-only）会话日志的底层服务入口。在处理常规业务逻辑时，通常更推荐使用上层的 [Conversations](/api/service/conversations)。

## 服务

你可以通过 `ctx.sessions` 调用以下服务级方法：

| 方法 | 作用 |
| --- | --- |
| `open(id, { seed?, meta?, store? })` | 打开既有会话；若不存在则按 `seed` 创建 |
| `create(id?, options)` | 新建会话并返回 `Session` 实例 |
| `branch(parent, at, options)` | 从父会话的指定条目位置创建分支 |
| `list({ cursor?, limit? })` | 分页列出会话头 |
| `head(id, store?)` | 读取会话头信息（`header` 与 `length`） |
| `delete(id, store?)` | 删除指定会话 |
| `define(name, schema)` | 注册条目类型的载荷 schema |
| `releaseIfEphemeral(id)` | 释放指定的临时会话 |

## Session 句柄

通过 `open` 或 `create` 获取到 `Session` 实例后，可以访问以下属性和方法：

| 成员 | 作用 |
| --- | --- |
| `header` / `id` / `length` | 会话元信息与当前长度 |
| `entries(from?)` / `messages()` | 读取日志条目及展开后的消息列表 |
| `push(...)` / `commit(input)` / `write(inputs)` | 追加日志条目 |
| `compact(input)` | 写入历史压缩切点 |
| `branch(at, options)` | 从当前会话分叉出新的 `Session` 实例 |
| `draft` / `setDraft(message)` | 访问或更新未提交的消息草稿 |
| `reconstructRequest(at)` | 还原指定位置的历史请求 |
| `checkInvariants()` | 诊断会话数据一致性（仅做检查，不修复） |
| `onEntry` / `onDraft` | 订阅条目追加与草稿变更事件 |

## 条目与存储

所有条目类型均需通过 `define` 注册载荷 schema，在实际写入前会进行 JSON 合法性校验。底层存储使用 `put(id, expectedN, entries)` 实现乐观并发控制：当版本不匹配时将抛出冲突错误，以避免无意覆盖。

会话的 `header` 包含了 `parent`、`at`、`delegationDepth`、`title`、`origin` 等关键元数据；在执行会话分叉时，系统会复制指定切点之前的所有历史条目。

## 继续

- [会话、消息与分支](/architecture/sessions)
- [会话与活跃 Agent](/architecture/conversations)
