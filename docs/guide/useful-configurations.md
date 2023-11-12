# 配置项

本节介绍了主插件(`chatluna`)可用的配置项。对于其他插件或适配器的配置项，请参考对应的文档。

## Bot 配置

### botName

- 类型：`string`
- 默认值：`香草`

Bot 的昵称，该昵称可用于下方的[关键词唤醒](#isnickname)对话。

### isNickName

- 类型：`boolean`
- 默认值：`false`

是否可从昵称唤醒对话。当开启后，如发出的消息开头含有 [botName](#botname) 属性，将自动触发对话。

## 回复选项

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

### msgCooldown

- 类型：`number`
- 默认值：`5`
- 最小值：`1`
- 最大值：`3600`
- 单位：`秒(s)`

全局冷却时间，开启后，在该时间内，Bot 不会响应任何消息。

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
如你开启了[流式传输](#bot-配置)，那么输出格式请直接选择默认的 `text`。
否则可能出现意想不到的渲染结果。
:::

### splitMessage

- 类型：`boolean`
- 默认值：`false`

切割消息发送。

开启后会将模型生成的文本基于 Markdown 语法切割成多块文本和，发送成多条消息。
配合[流式传输](#bot-配置)使用，可实现更优的体验。

::: tip 提示
本选项开启后，[outputMode](#outputmode) 选项只推荐设置为 `text`。
并且引用消息回复可能会无效。
:::

### censor

- 类型：`boolean`
- 默认值：`false`

文本审核。

开启后会对模型生成的文本进行文本审核，基于 Koishi 的 [censor](https://censor.koishi.chat)服务。

### sendThinkingMessage

- 类型：`boolean`
- 默认值：`true`

当模型生成耗时过长时发送一条消息。

这能提示用户模型正在生成回复，同时也能知道前方队列的排队情况。

### sendThinkingMessageTimeout

- 类型：`number`
- 默认值：`15000`
- 单位：毫秒（ms）

当经过该时间后模型仍在生成时，基于[`sendThinkingMessage`](#sendthinkingmessage) 选项的开启发送一条消息。

消息的内容基于下面[`thinkingMessage`](#thinkingmessage)设定的内容。

### thinkingMessage

- 类型：`string`
- 默认值：`我还在思考中，前面还有 {count} 条消息等着我回复呢，稍等一下哦~`

耗时过长的消息发送提示内容。

对于 `{count}` 占位符，会自动替换成当前队列中等待回复的消息数量。

### randomReplyFrequency

- 类型：`number`
- 默认值：`0.0`
- 最大值：`1.0`

随机回复频率。

插件会对每条消息，生成一个随机数，当该随机数小于该频率时，会触发随机回复。
