# 记忆 (Memory)

通过 `ctx.memory` 服务（由 `@chatluna/memory` 提供），你可以统一管理长期记忆条目、存储后端以及提取与整理任务。

## 查询

你可以通过下列方法检索并获取已存储的记忆条目：

| 方法 | 作用 |
| --- | --- |
| `list(query)` | 分页列出条目 |
| `get(id, presetId)` | 获取单条记忆 |
| `search(scope, input)` / `searchAll(scopes, input)` | 检索记忆 |
| `topic(scope, topic)` | 按主题读取记忆 |
| `sources(id)` | 查看条目来源 |
| `history(id)` | 查看版本历史 |

## 写入

记忆服务提供了完整的写入接口，支持对条目进行增删改以及版本管理：

| 方法 | 作用 |
| --- | --- |
| `create(scope, inputs, { by? })` | 新增条目 |
| `update(id, patch)` | 修改条目 |
| `merge(presetId, ids, into)` | 合并条目 |
| `split(presetId, id, into)` | 拆分条目 |
| `archive(presetId, ids)` | 归档条目 |
| `remove(presetId, ids)` | 删除条目 |
| `revert(id, name)` | 回退到指定版本 |

## 后端

你可以通过自定义后端来扩展记忆的底层存储方式：

| 方法 | 作用 |
| --- | --- |
| `backend(id, factory)` | 注册后端 |
| `listBackends()` | 列出所有已注册的后端 |
| `backendIds(presetId, conversationId?)` | 解析当前生效的后端列表 |

内置后端 ID 为 `md`（Markdown 文件），也是默认值。注册同名后端会直接抛出错误。解析后端时，系统会先检查服务级的 `backends` 映射（按预设指定的后端列表），未命中时再回落到场景规则 `memory.backends`（默认为 `['md']`）。读取时会合并全部后端的数据，写入新记忆时则写入列表中的第一个后端。

## 任务

记忆服务还负责调度记忆的提取、整理任务以及配置管理：

| 方法 | 作用 |
| --- | --- |
| `onExtract(handler)` / `onDream(handler)` | 注册提取与整理处理器 |
| `presets()` / `scopes()` | 列出可用的预设与作用域 |
| `settings(conversationId?)` | 获取当前生效的配置 |
| `index(agent)` | 生成索引文本 |
| `export(presetId)` / `import(presetId, data)` | 导出与导入记忆数据 |

## 变量

记忆通过提示词变量注入上下文，主要包含索引、读取和画像，它们均属于上下文区。

## 继续阅读

- [长期记忆](/architecture/memory)
- [长期记忆（使用）](/manual/usage/memory)
