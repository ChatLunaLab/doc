# 配置项

本章节介绍了 ChatHub 插件的配置项，包括它们的含义、类型、默认值和可选值。

有关配置项，可查看 [配置插件](https://koishi.chat/zh-CN/manual/console/market.html#%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6)

配置项可以在 Koishi 控制台的插件配置中设置，也可以在资源管理器的 [YAML](https://en.wikipedia.org/wiki/YAML) 配置文件中使用 `chathub` 字段进行设置，例如：

```yaml
# Koishi.yml
# 全局设置
host: localhost
port: 5140

# 插件列表
plugins:
  # ...
  # 这里是 chathub 插件
  @dingyi222666/chathub:
    # 在这里写入配置项
    # 以缩进的方式显示插件的配置项
    botName: 香草
    isNickname: true
    # ...

```

## bot 配置

这一部分的配置项主要涉及到 bot 配置的基本信息和新闻。

| 配置项 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `botName` | `string` | `'香草'` | bot 的姓名，用于在回复中显示或引发回复 |
| `isNickname` | `boolean` | `true` | 是否允许 bot 配置中的昵称引发回复 |

## 回复选项

这一部分的配置项主要涉及到插件的回复方式和效果。

| 配置项 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `allowPrivate` | `boolean` | `true` | 是否允许私聊 |
| `allowAtReply` | `boolean` | `true` | 是否允许 at 回复 |
| `isReplyWithAt` | `boolean` | `false` | 是否在回复时引用原消息 |
| `isForwardMsg` | `boolean` | `false` | 是否将消息以转发消息的形式发送 |
| `privateChatWithoutCommand` | `boolean` | `false` | 是否允许私聊不调用命令直接和 bot 聊天 |
| `msgCooldown` | `number` (秒) | `5` | 全局消息冷却时间，防止适配器调用过于频繁 |
| `outputMode` | `'raw' \| 'text' \| 'image' \| 'voice' \| 'mixed-image' \| 'mixed-voice'`  | `'text'`  | 消息回复的渲染输出模式，具体含义如下： <ul><li>`raw`: 原始（直接输出，不做任何处理）</li><li>`text`: 文本（把回复当成 markdown 渲染）</li><li>`image`: 图片（需要 puppeteer 服务）</li><li>`voice`: 语音（需要 vits 服务）</li><li>`mixed-image`: 混合（图片和文本）</li><li>`mixed-voice`: 混合（语音和文本）</li></ul> |
| `splitMessage` | `boolean`  | `false`  | 是否分割消息发送（看起来更像普通水友（并且会不支持引用消息），不支持原始模式和图片模式） |
| `sendThinkingMessage`  | `boolean`  | `true`  | 是否发送思考中的消息 |
| `sendThinkingMessageTimeout`  | `number`(毫秒)  | `15000`  | 当请求多少毫秒后未响应时发送思考中的消息 |
| `thinkingMessage`  | `string`  | `'我还在思考中呢，稍等一下哦~'`  | 思考中的消息内容 |
| `randomReplyFrequency`  | 百分比 (`0-1`)  | `0.0`  | 随机回复频率 |

## 对话选项

这一部分的配置项主要涉及到 bot 的对话模式和历史。

| 配置项   | 类型                                    | 默认值                                       | 含义                                                                                                                                    |
|--- |---------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| chatMode   | `chat \| plugin          \| browsing` | `chat`                                    | 默认的聊天模式，具体含义如下： <ul><li>`chat`: 聊天模式（只使用聊天模型回复）</li><li>`plugin`: 插件模式 （基于 LangChain）</li><li>`browsing`: 增强的聊天模式，模型支持联网搜索 </li></ul> |
| longMemory   | `boolean`                             | `false`                                   | 是否开启长期记忆（需要提供向量数据库和 Embeddings 服务的支持）                                                                                                 |
| conversationIsolationGroup   | `string[]`                            | `[]`                                      | 对话隔离群组，开启后群组内对话将隔离到个人级别（填入群组在 Koishi 里的 ID）                                                                                           |
| blackList   | `boolean` \| `any` (隐藏)               | `false`                                   | 黑名单列表 (请只对需要拉黑的用户或群开启，其他（如默认）请不要打开，否则会导致全部聊天都会被拉黑无法回复)                                                                                |
| blockText   | `string`                              | `'哎呀(ｷ｀ﾟДﾟ´)!!，你怎么被拉入黑名单了呢？要不你去问问我的主人吧。'` | 黑名单回复内容                                                                                                                               |
| censor   | `boolean`                             | `false`                                   | 是否开启文本审核服务（需要安装 censor 服务)                                                                                                            |
| historyMode   | `'default' \| 'summary'`              | `'default'`                               | 聊天历史模式，具体含义如下： <ul><li>`default`: 保存最近几轮的对话</li><li>`summary`: 保存对话的摘要</li></ul>                                                      |

## 模型选项

这一部分的配置项主要涉及到插件使用的嵌入模型和向量数据库（即为 [嵌入模型和向量数据库管理](/guide/useful-commands#嵌入模型和向量数据库管理) 命令的可视化管理）。

| 配置项 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| defaultEmbeddings | `'embeddings'` | 无 | 默认使用的嵌入模型 |
| defaultVectorStore | `'vector-store'` | 无 | 默认使用的向量数据库 |

## 杂项

这一部分的配置项主要涉及到插件些其他设置。

| 配置项 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| isProxy | `boolean` | `false` | 是否使用代理，开启后会为相关插件的网络服务使用代理 |
| isLog | `boolean` | `false` | 是否开始调试模式输出 Log，调试用 |

## 代理设置

如果需要使用代理，可在这一部分进行设置。

::: tip
请注意，这一部分的配置项只有在 `isProxy` 设置为 `true` 时才会生效。
:::

| 配置项 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| proxyAddress | `string` | 空字符串 (`''`) | 插件网络请求的代理地址，填写后 chathub 相关插件的网络服务都将使用该代理地址。如不填写会尝试使用 Koishi 的全局配置里的代理设置。 |
