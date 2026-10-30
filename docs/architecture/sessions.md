# 会话、消息与分支

本章解释 ChatLuna v2 保存了什么，以及历史记录如何变成一次模型请求。需要定位「模型为什么收到这些内容」、实现聊天入口，或接入存储后端时，请先区分会话日志、对话入口和在线 Agent。

## 三个不同的职责

| 概念 | 服务 | 负责 | 不负责 |
| --- | --- | --- | --- |
| Session（会话） | `ctx.sessions` | 追加条目，派生模型可见历史，记录请求前缀与分支关系 | 决定群聊当前使用哪条会话、执行模型或工具 |
| Conversation（对话入口） | `ctx.conversations` | 将业务 key 映射到当前会话，管理历史索引与在线 Agent | 代替会话日志保存完整事实 |
| Agent（智能体） | `ctx.agents` | 接收输入，执行模型步骤和工具，提交运行结果 | 充当数据库、保证外部工具可确定性重放 |

同一聊天入口可以在重置后指向新 Session，旧 Session 仍可保留；分出一个 Session 不会自动改变入口指针。目录、在线运行状态和日志是三个不同层面。

## 日志只有三类条目

当前格式使用 `SessionEntry` 联合类型，区分字段是 `kind`。条目都有从 0 开始、连续递增的 `n` 和毫秒时间戳 `time`。`n` 是日志位置，不是消息数，也不是 turn 或 step 编号。

### `message`：已提交的消息

保存一个 `ChatMessage`。用户输入、助手回复和工具结果通过 `role`、内容块和元数据表达；工具调用可以是助手消息里的 `tool-call` 内容块。

turn、step、usage、finish、timing 等运行事实可以位于消息元数据。不要再假设一套 `turn/start`、`tool/result` 条目类型：它们不是当前 Session 的格式。

### `mark`：结构化旁证

mark 使用 `name` 和 `data` 保存事实。常见标记包括：

- `prompt`：模型配置、system、prelude、工具 schema，以及可选来源信息。
- `request/context`：提供方、模型和可选上下文窗口。
- `preset/selected`：预设与修订。
- `agent/input-enqueued`、`agent/input-admitted`、`agent/input-discarded`：输入的入队、接纳与丢弃。
- `turn-skip`：轮次未继续的原因。

mark 不直接变成模型消息。入队标记里有正文，不代表正文已经发送给模型；还要看实际接纳与 message 条目。`prompt` 则由请求重建逻辑读取，不能把「mark 不进入消息数组」理解成所有 mark 对请求毫无影响。

### `cut`：改变消息视图，不删除日志

cut 保存 `before`、`summary` 和 `reason`，也可保存提供方原生压缩条目及元数据。当前消息视图以最后一个 cut 的摘要开头，再接上 `n >= before` 的 message 条目。

`before` 是日志位置，不能用消息数组下标代替；mark 同样占位置。

```text
n=0  message  用户提出第一项任务
n=1  message  助手完成第一项任务
n=2  message  用户提出后续任务
n=3  mark     请求配置快照
n=4  cut      before=2，摘要覆盖第一项任务

entries()：n=0 到 n=4，原文仍在
messages()：摘要 + n=2 的用户消息
```

再次压缩后，视图使用最后一个 cut，不是把所有摘要相加。摘要是 cut 携带的 `ChatMessage[]`，不应预设成固定角色。

压缩减少后续请求中的历史，不是安全删除。原文仍可能在日志、备份、外部模型服务或工具记录中。涉及隐私删除时，必须分别处理相关存储，不能只执行压缩。

## 消息视图与流式草稿

- `session.entries()` 返回已提交条目的快照；`entries(from)` 从指定位置读取。
- `session.messages()` 返回应用最新 cut 后的消息视图，不包括 mark。
- `session.draft` 是独立的内存草稿。`setDraft()` 更新它，不增加日志长度。`commit()` 完成写入后清除草稿。

排查断线或中止时，区分浏览器是否收到流式内容、Agent 是否还有草稿、Session 是否提交助手消息，以及 store 是否持久保存。屏幕上出现部分文字，不意味着重启后一定恢复。

## 写入与并发

`push()` 追加消息；`commit()` 提交助手消息及运行元数据；`mark()` 追加标记；`compact()` 追加 cut；底层 `write()` 可提交一批输入。

顺序为：准备条目 → `store.put(id, expectedN, entries)` 成功 → 更新本对象内存视图 → 通知监听器。存储拒绝时，本次条目不会先出现在内存历史。该顺序不意味着所有独立读取者会自动同步，也不意味着草稿更新和数据库写入属于一个跨层事务。

同一个 Session 对象串行化写入。两个独立打开的对象是两个快照：它们都认为下一条是 n=10 时，先写成功者推进存储，另一方收到 `SessionConflictError`。

正在运行的会话应通过现有 Agent/Conversation 入口投递输入，不要另开快照直接写。冲突后先确认在线所有者和最新状态，不能只把旧快照的 expectedN 改大后重试。

## 从日志重建模型请求

`session.reconstructRequest(atN)`：

1. 找到目标位置及之前的最新 `prompt` mark；没有快照则报错。
2. 在历史前缀应用当时存在的 cut。
3. 把 prompt 的 prelude 转成消息，放在历史之前。
4. 返回配置、system、工具 schema 和消息。

如果 `atN` 指向助手消息，该输出不会被放进生成它的请求；其他类型包含该位置为止的历史。检查回答时优先定位该回答的 message 条目。

下面是只使用内存的最小示例。实际聊天由 Agent 写记录，业务插件不需要手工复制整个过程。

```ts
import { ChatMessage } from '@chatluna/message'
import { Session } from '@chatluna/session'
import { ModelId, ProviderId } from '@chatluna/symbol'

const session = new Session('documentation-example')
await session.push(ChatMessage.user('请解释当前部署方式'))
await session.mark('prompt', {
  config: {
    provider: ProviderId('example'),
    model: ModelId('example-chat'),
  },
  system: 'Explain deployment facts accurately.',
})
const answer = await session.commit({
  assistant: ChatMessage.assistant('可以使用容器或源码运行。', {
    provider: ProviderId('example'),
    model: ModelId('example-chat'),
  }),
})

const request = session.reconstructRequest(answer.n)
console.log(request.system)
console.log(request.messages.length) // 1，不包含这次助手回答
```

这重建的是 ChatLuna 标准化请求，不是提供方 HTTP 报文的逐字节存档。适配器继续转换请求；凭据、外部文件、远端服务状态不由此完整保存。重发可能有费用、得到不同答案；重新执行工具还可能重复产生副作用。查看、重建和执行是不同操作。

## 分支边界是半开区间

`session.branch(at)` 继承父会话 `[0, at)` 的条目。省略 `at` 继承当前全部条目；`at=0` 不继承历史；`at` 必须是 0 到日志长度之间的整数。

```ts
const branch = await session.branch(answer.n, { title: '换一种回答方式' })
```

此例保留回答之前的输入和 prompt mark，不保留回答本身。分支记录 `parent` 和 `at`，子分支后续写入不改变父会话。

内置内存和 SQLite store 通过父前缀关系避免创建时复制全部行。删除父会话时，先将子分支仍引用的前缀物化，避免悬空引用。自定义 store 必须明确实现分支及删除语义，不能只保存子会话新增行而忽略父链。

Session 分支本身不切换聊天入口。`ctx.conversations.fork(key, { at, title })` 会创建分支并移动该入口 head；不要由此推断分支创建与 head 写入是一个数据库原子事务。

## 持久化与备份

`@chatluna/session` 没有 `session_store` 服务时使用内存 store。能聊天不等于已经持久化。默认产品组合通过 `@chatluna/session-persistence-sqlite` 保存 header 和 entry。

表名为 `chatluna_session_header`、`chatluna_session_entry`，写入在事务中检查 expectedN。超过阈值的大载荷转存到 blob 目录，使用内容哈希引用；`spillThresholdBytes` 默认 65536 字节。路径由插件配置与实例目录解析，不能推断一切都在单个数据库文件里。

备份要一致覆盖数据库、blob 目录和实例数据。只复制数据库而遗漏 blob，可能得到有引用却无正文的备份。先停止写入或使用适合数据库的快照方式，不要随意拼接不同时间点的文件。

Conversation 的 head 和目录有独立数据表、缓存与刷新行为，不替代 SessionStore；修复索引与修改历史要分别评估。

## 自定义 mark

插件可通过模块扩展 `Marks`，再用 `ctx.sessions.define(name, schema)` 注册 Cordis Schema 运行时校验。类型声明只负责编译期。注册跟随插件生命周期释放。

mark 适合诊断和来源，不适合绕过消息接纳。模型需要看到的内容应走提示词贡献或明确的消息路径。不要把 API key 或登录口令写进会话标记。

## 排错

| 现象 | 先检查 |
| --- | --- |
| 消息数与日志长度不一致 | mark、cut 占日志位置；messages() 应用了压缩 |
| 重启后历史消失 | 持久化插件是否加载、数据库和 blob 路径是否改变 |
| 输入已显示但不在请求里 | 是草稿、入队标记还是已接纳 message；轮次是否跳过 |
| 分支少了目标回答 | branch(at) 不含 at 条目，需要包含时使用 at+1 |
| 无法重建请求 | n 是否存在、之前是否有 prompt mark、历史是否完整 |
| expectedN 冲突 | 独立快照或多个运行者同时写同一 Session |
| 压缩后仍有原文 | cut 本来就不是数据擦除 |

继续阅读[上下文、缓存与压缩](/architecture/context-cache)和[Agent 与执行循环](/architecture/agents)。
