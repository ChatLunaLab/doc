# 配置项

本节介绍了主插件 (`chatluna`) 可用的配置项。对于其他插件的配置项，请前往 [生态](../ecosystem/introduction.md) 参考对应的文档。

## Bot 配置

### botName

- 类型：`string`
- 默认值：`香草`

Bot 的昵称，该昵称可用于下方的 [关键词唤醒](#isnickname) 对话。

### isNickName

- 类型：`boolean`
- 默认值：`false`

是否可从昵称唤醒对话。当开启后，如发出的消息开头含有 [botName](#botname) 属性，将自动触发对话。

## 对话行为选项

### allowPrivate

- 类型：`boolean`
- 默认值：`true`

是否能在私聊中调用 ChatLuna，开启后将可以在私聊中通过命令调用 ChatLuna。

### allowAtReply

- 类型：`boolean`
- 默认值：`true`

当 @Bot 时是否响应回复，开启后将会在 @Bot 时触发回复。

### isReplyWithAt

- 类型: `boolean`
- 默认值：`false`

Bot 回复时是否引用原消息回复。开启后 Bot 的回复都会引用原触发消息。

### isForwardMsg

- 类型: `boolean`
- 默认值：`false`

是否让消息以转发消息的形式发送。开启后，当 Bot 回复时，将会回复一个转发消息组。

:::warning 警告
目前支持该功能的聊天平台可能很少或接近没有，在未来我们可能会删除该配置项。
:::

### privateChatWithoutCommand

- 类型：`boolean`
- 默认值：`false`

是否能直接不调用任何命令在私聊里和 Bot 对话。

开启后，在私聊里的其他非命令调用都会被识别成和 Bot 对话，触发对话。

### allowChatWithRoomName

- 类型：`boolean`
- 默认值：`false`

是否允许使用房间名前缀触发对话。注意：启用此选项可能会显著影响 ChatLuna 的性能，建议配合过滤器仅在特定群组中启用。

### randomReplyFrequency

- 类型：`number`
- 默认值：`0.0`
- 最大值：`1.0`

随机回复频率。

插件会对每条消息，生成一个随机数，当该随机数小于该频率时，会触发随机回复。

## 对话响应选项

### sendThinkingMessage

- 类型：`boolean`
- 默认值：`true`

当模型生成耗时过长时发送一条消息。

可用于提示用户模型正在生成回复，同时也能知道前方队列的排队情况。

### sendThinkingMessageTimeout

- 类型：`number`
- 默认值：`15000`
- 单位：毫秒（ms）

当经过该时间后模型仍在生成文本时，基于[`sendThinkingMessage`](#sendthinkingmessage) 选项的状态发送一条消息。

### msgCooldown

- 类型：`number`
- 默认值：`5`
- 最小值：`1`
- 最大值：`3600`
- 单位：`秒(s)`

全局冷却时间，开启后，在该时间内，Bot 不会响应任何消息。

### showThoughtMessage

- 类型：`boolean`
- 默认值：`false`

在使用插件模式时，是否显示模型调用工具的过程。

## 消息渲染选项

### outputMode

- 类型：`'raw'|'text'|'image'|'voice'|'mixed-image'|'mixed-voice'`
- 插件会把模型生成的回复文本基于选中的输出格式进行渲染。下面是每个选项的介绍:
  - `raw`：输出模型生成的原始文本。
  - `text`：将模型生成的文本渲染成 Koishi 支持的 Markdown 格式后发送
  - `image`：将模型生成的文本渲染成图片后发送（图片里为模型原文本）

    该选项需要你的 Koishi 在运行提供了 puppeteer 服务的插件。我们需要 puppeteer 渲染 html 文件。

  - `voice`：将模型生成的文本转化成语音后发送（语音里为模型原文本）

    该选项需要你的 Koishi 在运行提供了 vits 服务的插件。我们需要 vits 服务将文本转化成语音文件。

  - `mixed-image`: 基于 Markdown 语法识别，对于某些 Markdown 语法（如列表，代码块）会渲染图片，其他的某些 Markdown 语法（如纯文本的自然段）会直接作为文本发送。

    和 `image` 选项一样，该选项需要你的 Koishi 在运行提供了 puppeteer 服务的插件。

  - `mixed-voice`: 将模型生成的文本同时渲染成 Markdown 格式和语音后发送。

    和 `voice` 选项一样，该选项需要你的 Koishi 在运行提供了 vits 服务的插件。

- 默认值：`'text'`

::: warning 警告
如你开启了 [流式传输](#streamresponse)，那么输出格式请直接选择默认的 `text`。
否则可能出现意想不到的渲染结果。
:::

### splitMessage

- 类型：`boolean`
- 默认值：`false`

切割消息发送。

开启后会将模型生成的文本基于 Markdown 语法切割成多个文本块，发送成多条消息。
配合[流式传输](#streamresponse)使用，可实现更优的体验。

::: tip 提示
本选项开启后，[outputMode](#outputmode) 选项只推荐设置为 `text`。
并且引用消息回复可能会无效。
:::

### censor

- 类型：`boolean`
- 默认值：`false`

文本审核。

开启后会对模型生成的文本进行文本审核，基于 Koishi 的 [censor](https://censor.koishi.chat) 服务。

### streamResponse

- 类型: `boolean`
- 默认值: `false`

流式响应。开启后将使用流式响应，类似 ChatGPT 的打字机效果。对于不支持的平台，会自动进行分句多段发送。

## 黑名单选项

### blackList

- 类型：`koishi 条件属性`
- 默认值：``

黑名单列表。可以选择对群，用户或平台开启。只需在满足对于条件的分支上打开开关即可。

该列表为全局机制，进入该名单的用户或平台将无法使用 ChatLuna 的各项功能。（扩展插件除外）


## 历史记录选项

### messageCount

- 类型: `number`
- 默认值：`40`
- 最小值: `10`
- 最大值: `100`

数据库里存储的单个对话的最大消息数量，超出后会自动删除最久远的历史聊天消息。

### historyMode

- 类型: `default` | `summary`
- 默认值: `default`

历史聊天的模式，可选：

- default: 默认模式，将历史消息原封不动的发送给模型。
- summary: 摘要模式，只发送一条历史消息，其内容为模型总结的历史消息的摘要。

使用 `summary` 模式时更能节省 token，但是也可能会遇到未知的 bug，连续对话效果不好。
使用 `default` 模式时对话效果更佳，兼容性也最好。

### autoDelete

- 类型: `boolean`
- 默认值: `false`

开启后将自动删除久远未使用的历史消息。

### autoDeleteTimeout

- 类型: `number`
- 默认值: `30`
- 单位: 秒(s)

设置自动删除久远未使用历史消息的时间。

## 模型选项

### defaultEmbeddings

ChatLuna 默认使用的嵌入向量模型。

可用于长期记忆，知识库。

### defaultVectorStore

ChatLuna 默认使用的向量数据库。

用于长期记忆，知识库。

## 模版房间选项

### autoCreateRoomFromUser

- 类型: `boolean`
- 默认值: `false`

是否默认为每个用户隔离创建私有房间。
当开启后，每个用户将默认在和 Bot 聊天时自动创建一个私有房间。
此选项用于隔离用户之间的对话。

### defaultChatMode

- 类型: `chat` | `browsing` | `plugin` ...
- 默认值: `chat`

模版克隆房间里默认使用的聊天模式。

由于 ChatLuna 扩展开放了该接口，因此任何插件都可以编写自己的聊天模式相关链接入到 ChatLuna 中。
下面只介绍 ChatLuna 内置的几个聊天模式：

- chat: 普通聊天模式，支持预设和长期记忆，没有联网权限。
- browsing: 浏览模式，支持预设和长期记忆，可以通过与用户的聊天内容从网络上搜索信息。
- plugin: 插件模式，不完全支持预设，不支持长期记忆，模型可以调用各种工具如网络搜索插件，可以自主获取网络上的消息和执行某些操作。

### defaultModel

模版克隆房间里默认使用的模型。

如想接入模型，可以查看目录里的 [模型平台](../guide/configure-model-platform/introduction.md)。

### defaultPreset

模版克隆房间里默认使用的预设。

如需了解预设，可查看 [预设](../guide/preset-system/introduction.md)。

## 杂项

### authSystem <Badge type="warning" text="实验性" />

- 类型: `boolean`
- 默认值: `false`

配额组和其相关的用户系统。

如需了解，可查看 [配额组和用户系统](../guide/session-related/concurrency-limit.md)。

### isProxy

- 类型: `boolean`
- 默认值: `false`

是否开启代理模式。

开启后所有 ChatLuna 相关的请求都会通过设置的代理服务器进行转发。

推荐所有国内用户开启该配置项配置代理。

### voiceSpeakId

- 类型: `number`
- 默认值: `0`

设置 vits 服务默认使用的发音人。

### isLog

- 类型: `boolean`
- 默认值: `false`

调试模式。

开启后将会输出更多的调试 log。

## 代理设置

### proxyAddress

- 类型: `string`

代理地址。需要附上端口信息。

目前支持 HTTP(s) / SOCKS5 代理。

请注意格式，填写好地址。如 `http://127.0.0.1:7890`。
