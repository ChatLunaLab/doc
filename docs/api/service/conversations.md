# 会话 (Conversations)

`ctx.conversations`（`@chatluna/conversations`）维护「会话键 → 活会话」的索引，是会话的业务入口。底层 append-only 日志由 `ctx.sessions` 管。

## 常用 API

| 方法 | 作用 |
| --- | --- |
| `head(key, initial, { peer? })` | 取/建会话当前 head，返回 SessionId |
| `open(input)` | 打开活会话（可能创建 Agent） |
| `fork(key, { at?, title? })` | 从某点分叉并把新会话设为 head |
| `reset(key, next)` | 释放旧 Agent，把 head 指向已存在的 `next` |
| `switch(key, to)` | 把 head 切到已存在的会话 |
| `history(key, page)` | 该会话键的历史会话（游标分页） |
| `list(page)` / `counts()` | 全局列表与分组统计 |
| `peek(key)` | 只读内存缓存 |
| `live(key)` | 取活会话句柄 |
| `lives()` | 列出本实例承载的活会话 |
| `release(sessionId)` | 关闭某个 Session 上的 Agent |

## 语义

- 一个会话键同一时刻只允许一个活 Agent；换 head 时会先 `release` 旧的。
- `reset` 不创建新会话：`next` 由调用方先创建，它只负责切换。
- `fork` 会复制父会话切点前的条目，并把新会话设为 head。
- `previousSessionId` 只用于溯源，不参与撤销。

## 与 sessions 的关系

`ctx.sessions`（`open/create/branch/list/head/delete`）是日志层；`ctx.conversations` 在之上做业务索引、缓存（`cacheSize` 1000、`maxLiveSessions` 200、空闲 30 分钟逐出）与 head 管理。

只有本实例打开过的 Agent 才会参与逐出；复用的活会话不计数。

## 继续

- [会话与活跃 Agent](/architecture/conversations)
- [会话、消息与分支](/architecture/sessions)
