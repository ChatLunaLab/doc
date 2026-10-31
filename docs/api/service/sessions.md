# 会话日志 (Sessions)

`ctx.sessions`（`@chatluna/session`）是 append-only 会话日志的底层入口。业务上更常用 [Conversations](/api/service/conversations)。

## 服务

| 方法 | 作用 |
| --- | --- |
| `open(id, { seed?, meta?, store? })` | 打开既有会话；不存在时按 `seed` 创建 |
| `create(id?, options)` | 新建会话，返回 `Session` |
| `branch(parent, at, options)` | 从父会话的某个条目位置分叉 |
| `list({ cursor?, limit? })` | 列出会话头 |
| `head(id, store?)` | 只读会话头（`header` + `length`） |
| `delete(id, store?)` | 删除会话 |
| `define(name, schema)` | 注册条目类型的载荷 schema |
| `releaseIfEphemeral(id)` | 释放临时会话 |

## Session 句柄

| 成员 | 作用 |
| --- | --- |
| `header` / `id` / `length` | 元信息 |
| `entries(from?)` / `messages()` | 读条目与展开后的消息 |
| `push(...)` / `commit(input)` / `write(inputs)` | 追加条目 |
| `compact(input)` | 写入压缩切点 |
| `branch(at, options)` | 分叉出新的 `Session` |
| `draft` / `setDraft(message)` | 未提交的草稿 |
| `reconstructRequest(at)` | 还原某位置的请求 |
| `checkInvariants()` | 诊断一致性（只检查，不修复） |
| `onEntry` / `onDraft` | 订阅结构变化 |

## 条目与存储

条目类型由 `define` 注册 schema；写入前会做 JSON 合法性校验。存储层使用 `put(id, expectedN, entries)` 做乐观并发：版本不符会冲突，而不是覆盖。

`header` 里包含 `parent`、`at`、`delegationDepth`、`title`、`origin` 等字段；分叉时复制切点之前的条目。

## 继续

- [会话、消息与分支](/architecture/sessions)
- [会话与活跃 Agent](/architecture/conversations)
