# 记忆 (Memory)

通过 `ctx.memory` 服务（由 `@chatluna/memory` 提供），你可以统一管理长期记忆条目、存储后端以及提取与整理任务。

## 查询

你可以通过下列方法检索并获取已存储的记忆条目：

| 方法 | 作用 |
| --- | --- |
| `list(query)` | 分页列出条目 |
| `get(id, presetId)` | 取单条 |
| `search(scope, input)` / `searchAll(scopes, input)` | 检索 |
| `topic(scope, topic)` | 按主题读取 |
| `sources(id)` | 条目来源 |
| `history(id)` | 版本历史 |

## 写入

记忆服务提供了完整的写入接口，支持对条目进行增删改以及版本管理：

| 方法 | 作用 |
| --- | --- |
| `create(scope, inputs, { by? })` | 新增条目 |
| `update(id, patch)` | 修改 |
| `merge(presetId, ids, into)` | 合并 |
| `split(presetId, id, into)` | 拆分 |
| `archive(presetId, ids)` | 归档 |
| `remove(presetId, ids)` | 删除 |
| `revert(id, name)` | 回退到某版本 |

## 后端

你可以通过自定义后端来扩展记忆的底层存储方式：

| 方法 | 作用 |
| --- | --- |
| `backend(id, factory)` | 注册后端 |
| `listBackends()` | 列出后端 |
| `backendId(presetId, conversationId?)` | 解析当前后端 |

默认后端是 Markdown。需要注意的是，注册同名后端会抛出错误。

## 任务

记忆服务还负责调度记忆的提取、整理任务及配置管理：

| 方法 | 作用 |
| --- | --- |
| `onExtract(handler)` / `onDream(handler)` | 注册提取/整理处理器 |
| `presets()` / `scopes()` | 列出可用的预设与作用域 |
| `settings(conversationId?)` | 当前生效的配置 |
| `index(agent)` | 生成索引文本 |
| `export(presetId)` / `import(presetId, data)` | 导出与导入 |

## 变量

记忆通过提示词变量进入上下文，主要包含索引、读取和画像，它们都属于上下文区。

## 继续

- [长期记忆](/architecture/memory)
- [长期记忆（使用）](/manual/usage/memory)
