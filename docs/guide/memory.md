# 长期记忆

长期记忆保存跨回合仍有价值的信息，不等于对话历史，也不是把全部消息永久拼进提示词。默认后端使用 Markdown 主题文件：模型先收到目录通知，再按需搜索、读取正文。

## 三种数据分别管理

| 数据 | 内容 | 进入请求的方式 |
| --- | --- | --- |
| 会话日志 | 消息、请求标记、压缩切点 | 会话视图 |
| 角色状态与 memo | 心情、好感度、近期便签 | 角色能力注入 |
| 长期记忆 | 人物、偏好、事实、计划、群资料 | 目录通知、工具读取或主动回忆 |

新建对话不清除长期记忆，压缩会话不是记忆提取，归档记忆也不删除来源消息。处理敏感信息时，要分别考虑日志、主题、来源、历史与备份。

## 范围与可见性

记忆按 `presetId` 分区，`*` 表示共享。`scopesOf(agent)` 计算 shared → preset → guild → user → conversation 的范围栈；具体层级依赖聊天身份与 observer 提供的信息。群聊还可能纳入近期发言者的 user 层，不能把个人条目理解为仅在私聊中可见。

| 范围 | 用途 | 注意 |
| --- | --- | --- |
| shared | 实例共同知识 | 跨人格，不放个人私密信息 |
| preset | 人格共同背景 | 可能跨多个聊天范围 |
| guild | 群规则、名词、成员公共资料 | 核对平台与群身份 |
| user | 用户偏好、个人记录 | 不代表只能在该用户私聊读取 |
| conversation | 当前对话的局部事项 | 不替代访问控制 |

`memory.isolation` 支持 `preset` 和 `conversation`。当前实现的 conversation 模式会收窄自动注入目录，但 `memory_search` 仍使用上述可见范围栈搜索。因此它不是所有读取路径的统一隔离开关，更不是数据库多租户或操作系统安全边界。上线前用两个真实身份核对目录、搜索与读取结果。

## 文件与目录

默认根目录为 `data/chatluna/memory`，人格级主题结构如下：

```text
data/chatluna/memory/<preset>/
  MEMORY.md
  topics/<topic>.md
  .history/
```

群、用户、会话层增加范围子目录，路径段经过编码。默认后端以文件为数据来源，外部编辑通过 watcher 进入后续读取。备份整个目录，不只备份 `MEMORY.md`。

目录按 token 预算作为记忆通知进入请求，正文不全量自动注入 system。模型看到目录项不代表已读正文；回答遗漏时先核查搜索与读取，不盲目扩大上下文窗口。

## 提取、回忆与整理

以下字段属于场景规则的 `memory` namespace：

| 字段 | 默认 | 作用 |
| --- | --- | --- |
| `enabled` | false | 自动提取 |
| `extractWindow` | 30 | 每多少条新消息提取一次 |
| `gate` | false | 提取前判断是否值得记忆 |
| `indexBudget` | 1500 | 目录 token 预算 |
| `recall.enabled` | false | 主动回忆 |
| `recall.interval` | 10 | 回忆消息间隔 |
| `dream.enabled` | true | 允许整理 |
| `dream.idleAfter` | 1800000 ms | 空闲整理阈值 |
| `dream.nightly` | true | 夜间整理 |
| `dream.cron` | `0 4 * * *` | 夜间表达式 |
| `dream.maxActive` | 300 | 活跃条目触发阈值 |

整理会更新、合并、拆分与归档，不只是生成摘要。非手动整理在新增记忆不足 10 条时跳过。开关为 true 不保证任务已触发，还取决于插件、调度、数据量、权限和模型。

提取、整理、回忆默认使用 `@small`，gate 使用 `@decide`，会产生额外调用。先小范围启用提取并审核质量，再决定是否开启主动回忆和更多自动任务。

## 手动读取与修改

读取工具为 `memory_search`、`memory_read`、`memory_sources`；写入工具为 `memory_create`、`memory_update`、`memory_merge`、`memory_split`、`memory_delete`。写入经过 `memory:write`，shared/preset 范围默认询问。

人物记录使用 identity 类型与 people 主题；群资料可有 members、glossary、memes、stickers。结构存在不意味着已经自动获取平台的全量成员。

条目可以保留来源消息。审核正文、结构化字段与来源，不让推测变成事实。模型说“记住了”不是凭证，以实际工具返回和记忆页数据为准。

## 历史、撤销与恢复

`memory_delete` 是归档，不是物理抹除。归档默认保留 7 天，每主题默认保留 10 个历史版本。历史、来源与备份仍可能含敏感信息。

提取与整理任务保存状态、统计及条目级 before/after diff，可按任务撤销整批变更。有数据库时记录于 `chatluna_memory_job`；重启后遗留 running 标为 failed，不假装任务仍在继续。

恢复时包含主题、目录、历史和相关数据库，核对范围与来源后再恢复自动提取。远端或自定义后端的保证由其实现决定，不能套用默认 Markdown 的文件布局。

## 排错

- 没有新记忆：核对 enabled、窗口、gate、模型角色、审批与任务错误。
- 存在但没用上：核对人格、范围栈、目录预算、工具调用与 recall。
- 对话串扰：检查 shared/preset、群聊 user 层和搜索路径，不只改会话归属。
- 整理没运行：检查调度、触发条件、数据量和任务状态。
- 记忆有错：编辑并复核来源，必要时撤销工作流；新建聊天不会移除错误条目。

继续阅读[场景规则](/guide/rules)、[预设与角色](/guide/presets)及[轨迹与用量](/guide/observability)。
