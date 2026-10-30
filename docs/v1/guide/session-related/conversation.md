# 会话系统

ChatLuna 的核心概念是"会话"，而非旧版本中的"房间"。

一条消息进入 ChatLuna 后，会依次经过三个层级：路由、预设通道、会话。

路由决定当前消息的触发者，应该使用哪一个会话，是否需要共享。

预设通道会将同一路由拆分为多条并行的会话，在同一个路由内可以分开多条预设。

会话则是实际承载上下文的单元。

如果目标位置上还没有活跃会话，ChatLuna 会在首次使用时自动创建。

## 会话

会话是一段完整的上下文，包含聊天历史、当前模型、当前预设、当前聊天模式和当前状态（如活跃、已归档）。

使用 `chatluna.new` 可以创建一段新的上下文。

:::tip 提示
`chatluna.clear` 是 `chatluna.new` 的别名，不是清空当前会话，而是新建一条会话并切换过去。
:::

## 路由

路由决定了谁共享同一组会话。

共享路由下，同一个群的成员共用同一组会话，适用于公共助手、项目群协作，以及需要多人接续上一轮上下文的场景。

个人路由下，同一个群的每个成员各自拥有独立的会话集合，适用于群内同时运行多个独立任务，或用户希望保持互不干扰的上下文。

:::tip 提示
私聊始终使用个人路由。`defaultGroupRouteMode` 只影响群聊，可选值为 `shared` 和 `personal`。
:::

## 预设通道

预设通道可以将同一路由拆分为多条并行工作线。例如一个群中可以同时存在默认通道（用于普通聊天）、`translator` 通道（用于翻译）和 `reviewer` 通道（用于润色）。每条通道独立维护自己的当前会话。

选择通道有两种方式。一是通过命令的 `-p <preset>` 参数显式指定：

```powershell
chatluna.current -p translator
chatluna.use.mode plugin -p reviewer
```

二是发送一条以预设别名开头的普通消息，ChatLuna 会将其路由到对应通道。

:::tip 提示
如果整条消息只有别名本身，且消息为纯文本，ChatLuna 通常会展示该通道当前的会话信息，而非发起新一轮聊天。
:::

## 自动创建会话

首次在某条路由上聊天，或首次向某条预设通道发送消息时，ChatLuna 会自动创建会话。自动创建时使用的默认值来自 `defaultModel`、`defaultPreset`、`defaultChatMode` 以及当前作用域上的路由规则。

:::warning 注意
这些默认值只影响后续新建的会话，不会覆盖已有会话。
:::

## 当前会话设置与路由规则

`chatluna.use.*` 系列命令修改的是当前会话正在使用的配置，包括 `chatluna.use.model`（切换模型）、`chatluna.use.preset`（切换预设）和 `chatluna.use.mode`（切换聊天模式）。

`chatluna.rule.*` 系列命令修改的是当前作用域（群聊或私聊）后续创建会话时的默认行为，包括：

- `chatluna.rule.model`：设置新会话默认模型，或固定模型
- `chatluna.rule.preset`：切换活跃预设通道，或设置新会话默认预设
- `chatluna.rule.mode`：设置新会话默认聊天模式，或固定模式
- `chatluna.rule.share`：查看或切换共享路由 / 个人路由
- `chatluna.rule.lock`：锁定当前作用域上的会话管理操作

## 聊天模式的修改方式

聊天模式的修改涉及多个层级，详见 [聊天模式](../chat-chain/chat-mode.md)。

`chatluna.use.mode` 修改当前会话，`chatluna.new -c` 在新建会话时指定，`chatluna.rule.mode` 修改当前作用域后续新会话的默认模式，`defaultChatMode` 是全局默认值。

## 会话生命周期

ChatLuna 提供了一组会话管理命令：`chatluna.new`（创建）、`chatluna.switch`（切换）、`chatluna.rename`（重命名）、`chatluna.archive`（归档）、`chatluna.restore`（恢复）、`chatluna.export`（导出）、`chatluna.compress`（压缩历史，非清空）和 `chatluna.delete`（删除）。

详细用法参见 [会话指令](../useful-commands/conversation.md)。

## 指定目标会话

许多命令支持手动指定目标会话，接受列表序号、会话 ID 或会话标题三种写法。建议先执行 `chatluna.list` 获取列表，日常使用列表序号，需要精确定位时使用会话 ID。仅在确认标题唯一时使用标题。

## 常见使用场景

将 `defaultGroupRouteMode` 设为 `shared`，同一群的成员将默认共用同一路由；设为 `personal`，每个成员拥有独立的路由和会话集合。

如需多条工作线并行，为预设配置清晰的别名，将不同任务分配到不同通道即可。也可以发送以预设别名开头的普通消息，将内容路由到对应通道。

如需统一某个群后续新会话的默认聊天模式，使用 `chatluna.rule.mode browsing`。如需锁定防止修改，追加 `-f` 参数。

## 迁移说明

新版本启动时，旧的 `room` 数据会自动迁移到会话系统。`chatluna.admin.purge-legacy` 用于清理迁移后的旧数据，不负责执行迁移本身。
