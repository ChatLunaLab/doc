# 会话 (Conversations)

`ctx.conversations`（`@chatluna/conversations`）维护「会话键 → 活会话」的索引关系，是插件进行会话交互的业务入口。底层的只追加写入（append-only）日志由 `ctx.sessions` 统一管理。

## 常用 API

| 方法 | 作用 |
| --- | --- |
| `head(key, initial, { peer? })` | 获取或创建会话当前 head，返回 SessionId |
| `open(input)` | 打开活会话（必要时创建 Agent） |
| `fork(key, { at?, title? })` | 从指定切点分叉并把新会话设为 head |
| `reset(key, next)` | 释放旧 Agent，将 head 指向已存在的 `next` |
| `switch(key, to)` | 将 head 切换到已存在的会话 |
| `history(key, page)` | 查询该会话键的历史会话（游标分页） |
| `list(page)` / `counts()` | 全局列表查询与分组统计 |
| `peek(key)` | 只读访问内存缓存 |
| `live(key)` | 获取活会话句柄 |
| `lives()` | 列出当前实例承载的所有活会话 |
| `release(sessionId)` | 释放并关闭某个 Session 上的 Agent |

## 语义

- 一个会话键在同一时刻只允许存在一个活跃的 Agent；切换 head 时会先行 `release` 旧 Agent。
- `reset` 不会自动创建新会话：目标 `next` 需由调用方预先创建，该方法仅负责切换指向。
- `fork` 会复制父会话切点前的所有条目，并将生成的新会话设为当前 head。
- `previousSessionId` 仅用于链路溯源，不参与撤销操作。

## 与 sessions 的关系

`ctx.sessions`（提供 `open/create/branch/list/head/delete`）专注于底层日志管理；`ctx.conversations` 则在日志层之上封装了业务索引、内存缓存（`cacheSize` 1000、`maxLiveSessions` 200、空闲 30 分钟逐出）以及 head 管理。

只有当前实例主动打开过的 Agent 才会计入逐出管理；复用的活会话不重复计数。

## 继续

- [会话与活跃 Agent](/architecture/conversations)
- [会话、消息与分支](/architecture/sessions)
