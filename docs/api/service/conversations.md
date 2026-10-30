# 会话 (Conversations)

`ctx.conversations`（`@chatluna/conversations`）维护「会话键 → 活会话」的索引，是会话的业务入口。底层 append-only 日志由 `ctx.sessions` 管。

## 常用 API

| 方法 | 作用 |
| --- | --- |
| `head(key, initial)` | 取/建会话当前 head |
| `open(input)` | 打开活会话 `LiveConversation` |
| `fork(key, {at, title})` | 从某点分叉 |
| `history(key)` / `list()` / `counts()` | 会话历史与索引 |
| `reset(key)` / `switch(key)` | 轮换 head / 切换 |
| `live` / `release` | 活会话句柄管理 |

会话键通常是 `platform:channel:user` 的三元组。一个会话键有一个轮转中的 head session；`/reset` 起新 head，`fork` 在某点复制历史。

## 与 sessions 的关系

`ctx.sessions`（`open/create/branch/list/head/delete`）是日志层；`ctx.conversations` 在之上做业务索引、缓存（`cacheSize` 1000、`maxLiveSessions` 200、空闲 30min 逐出）与 head 管理。持久化由可选 `ctx.session_store`（默认 SQLite）提供。

## 继续

- [会话、消息与分支](/architecture/sessions)
