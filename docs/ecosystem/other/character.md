# 伪装群友 (Character) <Badge type="warning" text="实验性插件" />

此插件基于 Prompt 工程，尝试让大语言模型在群内伪装成群友对话。

此插件仍处于实验性阶段，若预设不够完善或使用的模型能力不足，「AI 味」可能还过浓。不要将其直接放入大群中。

## 配置

* 前往插件市场，安装 `chatluna-character` 插件。

![alt text](../../public/images/image-63.png)

## 使用

完成后启用插件。在 [应用群组](#applygroup) 中输入你需要应用的群组 ID，并在 [模型配置](#model) 中配置模型。

此时即可和尝试和伪装对话。如果正常回复了，则说明配置成功。

如果你需要新增或修改预设，默认预设的文件夹位于 `<koishi-data-path>/chathub/character/presets` 。

## 预设

伪装的预设相比 ChatLuna 的预设，减少了很多自定义选项。下面是一个预设例子，其开头的注释部分也提供了基本配置指引：

::: details default.yml
<<< ../../public/resources/character_preset.yml
:::

当前默认预设是一个「模板预设」，包含较多注释和占位符（具体见开头的注释）。使用前请先按你的群环境替换这些内容。

整个预设被分为 `name`、`nick_name`、`input`、`system`、`status`、`mute_keyword` 六个核心字段。

让我们一步步来理解这些配置项。

### status

status 即为角色的状态，包括心情、状态、记忆、动作。
在预设的 `status` 中，只是初始的角色状态，具体状态的填充和生成，还需要 `input` 中进行。

### mute_keyword

mute_keyword 为禁用词。如果用户发送的消息中包含这些关键词并且配置了 [isForceMute](#isforcemute)，则会触发禁言。在群内不再响应，具体不响应时间由 [muteTime](#mutetime) 决定。

### name

name 指定为预设的名称。会在 [defaultPreset](#defaultpreset) 中显示。

### nick_name

nick_name 为角色的昵称，可以设置多个数组。开启 [isNickName](#isnickname) 后，当用户输入的开头匹配到 nick_name 中的任意一个时，将会触发伪装回复。

### system

system 是整个预设的核心部分。在默认预设中，基于 Markdown 格式分成了几个板块：

* 基本设定 / 详细设定：
  角色身份、背景信息、边界与行为基线。

* 发言风格 / 特定情境应对指南：
  回复风格、常见场景处理、主动触发策略（如 `next_reply`、`wake_up_reply`）等。

* 消息格式与交互规范：
  回复长度、分句规则、是否使用 Markdown、表情/语音/引用等约束。

* 工具使用指南：
  如长期记忆、禁言、撤回等工具的调用策略与限制。

* 角色资料补充区：
  如群友信息、共同特点、名词解释、`<status></status>` 格式定义等。

目前伪装使用类 XML 格式来表达消息，一条标准消息如下：

```xml
  <message>content</message>
  ```

支持 AT 的示例如下（但不建议开启 AT ，容易造成困扰）：

```xml
  <message> <at name='name'>id</at> content </message>
  ```

另外也支持如下标签：

```xml
<message><voice>语音内容</voice></message>
  ```

```xml
<message><face name='name'>face_id</face></message>
  ```

```xml
<message><sticker>图片链接（单独发送图片）</sticker>文本内容</message>
  ```

```xml
<message><img>图片链接（图文在同一条消息中发送）</img>文本内容</message>
  ```

在部分时候需要让角色不回复，则可以输出空消息。

例如：

```xml
  <message></message>
  ```

具体规则以预设中“消息格式与交互规范”的要求为准。

你也可以自定义 `system` 内容，但请确保模型输出仍遵循可解析的消息格式。

### input

input 会把最近群聊的聊天记录和状态等信息作为格式化输入，基于此处的内容，让模型生成回复。

大体也可以分为几个板块：

* 背景信息：

  此处可插入 `{time}`、`{trigger_reason}`。

* 消息历史：

  此处可插入 `{history_new}`（最近消息）、`{history_last}`（最后一条消息）。

* 当前状态：

  此处可插入 `{status}` 来引用角色当前状态。

* 长期记忆：

  可插入 `{long_memory('guild')}` 以纯文本形式全量注入群组长期记忆。

* 生成格式：

  当前模板要求模型按以下结构输出（包含空行）：

```xml
  <status>
  更新后的状态
  </status>

  <think>
  角色视角的思考过程
  </think>

  <action>
  本次要进行的操作
  </action>

  <output>
  <message>消息1</message>
  <message>消息2</message>
  </output>
  ```

  遵循上面的标准格式，伪装才能正常解析模型的回复。

## 配置项

此处列举了伪装插件的配置项。

### 基础配置

#### applyGroup

* 类型: `string[]`
* 默认值: `[]`

应用到的群组。

#### maxMessages

* 类型: `number`
* 默认值: `40`
* 范围: `3-100`

存储在内存里的最大消息数量。

#### disableChatLuna

* 类型: `boolean`
* 默认值: `true`

在使用此插件的群聊里，是否禁用 ChatLuna 主功能。

不建议关闭此选项，可能会导致 ChatLuna 和伪装同时回复。

#### whiteListDisableChatLuna

* 类型: `string[]`
* 默认值: `[]`

在使用此插件时，不禁用 ChatLuna 主功能的群聊列表。

### 模型配置

#### model

* 类型: `string`
* 默认值: ``

使用的模型。

#### modelOverride

* 类型: `{groupId: string, model: string}[]`
* 默认值: `[]`

针对某个群的模型设置，会覆盖上面的配置。

#### maxTokens

* 类型: `number`
* 默认值: `42000`
* 范围: `1024-42000`

聊天的最大 token 数。

#### image

* 类型: `boolean`
* 默认值: `false`

是否允许输入图片（注意表情包也会输入，目前仅支持原生多模态的模型）。

#### imageInputMaxCount

* 类型: `number`
* 默认值: `9`
* 范围: `1-15`

最大的输入图片数量。

#### imageInputMaxSize

* 类型: `number`
* 默认值: `20`
* 范围: `1-20`

最大的输入图片大小（MB）。

#### toolCalling

* 类型: `boolean`
* 默认值: `true`

是否启用工具调用功能。

### 对话设置

#### isNickname

* 类型: `boolean`
* 默认值: `true`

允许 bot 配置中的昵称引发回复。

#### isNickNameWithContent

* 类型: `boolean`
* 默认值: `false`

是否允许在对话内容里任意匹配 bot 配置中的昵称来触发对话。

#### isForceMute

* 类型: `boolean`
* 默认值: `true`

是否启用强制禁言（当聊天涉及到关键词时则会禁言，关键词需要在预设文件里配置）。

#### isAt

* 类型: `boolean`
* 默认值: `false`

是否允许 bot 艾特他人。

#### splitVoice

* 类型: `boolean`
* 默认值: `false`

是否分段发送语音。

#### splitSentence

* 类型: `boolean`
* 默认值: `false`

是否启用自分割发送消息。（仅旧版预设需要开启）

#### enableMessageId

* 类型: `boolean`
* 默认值: `true`

向模型暴露平台消息 ID，以允许发送引用消息。

#### markdownRender

* 类型: `boolean`
* 默认值: `false`

是否启用 Markdown 渲染。关闭后可能会损失分割消息的精度。（仅旧版预设需要开启）

#### messageInterval

* 类型: `number`
* 默认值: `20`
* 范围: `0-10000`

随机发送消息的最大间隔。

#### enableLongWaitTrigger

* 类型: `boolean`
* 默认值: `false`

是否启用空闲触发。

#### idleTriggerIntervalMinutes

* 类型: `number`
* 默认值: `180`
* 范围: `1-10080`

空闲触发间隔（分钟）：当超过该时间未收到新消息时，将自动触发一次回复请求。

#### idleTriggerRetryStyle

* 类型: `'exponential' | 'fixed'`
* 默认值: `'exponential'`

空闲触发重试风格。`exponential` 为指数退避，`fixed` 为固定间隔重试。

#### enableIdleTriggerMaxInterval

* 类型: `boolean`
* 默认值: `true`

是否启用空闲触发最大间隔限制。

#### idleTriggerMaxIntervalMinutes

* 类型: `number`
* 默认值: `1440`
* 范围: `1-43200`

空闲触发最大间隔（分钟）：仅在 `idleTriggerRetryStyle = 'exponential'` 时生效。

#### enableIdleTriggerJitter

* 类型: `boolean`
* 默认值: `true`

是否启用空闲触发随机抖动。开启后每轮触发时间会随机提前或延后 5%-10%。

#### messageActivityScoreLowerLimit

* 类型: `number`
* 默认值: `0.85`
* 范围: `0-1`，步进 `0.00001`

消息活跃度分数下限阈值。初始状态或长时间无人回复后，会使用此阈值判断是否响应。

#### messageActivityScoreUpperLimit

* 类型: `number`
* 默认值: `0.85`
* 范围: `0-1`，步进 `0.00001`

消息活跃度分数上限阈值。每次响应后，判断阈值会向此值靠拢；十分钟内无人回复时，会自动回退到下限。

#### coolDownTime

* 类型: `number`
* 默认值: `0`
* 范围: `0-1440`

冷却发言时间（秒）。当上一条消息发送完成后的 n 秒内发出的请求将被丢弃。

#### typingTime

* 类型: `number`
* 默认值: `200`
* 范围: `100-1500`

模拟打字时的间隔（毫秒）。

#### largeTextSize

* 类型: `number`
* 默认值: `100`
* 范围: `100-1000`

大文本消息的判断阈值（字符数）。

#### largeTextTypingTime

* 类型: `number`
* 默认值: `10`
* 范围: `10-1500`

大文本消息的固定打字间隔（毫秒）。

#### muteTime

* 类型: `number`
* 默认值: `60000`
* 范围: `1000-6000000`

闭嘴时的禁言时间（毫秒）。

#### modelCompletionCount

* 类型: `number`
* 默认值: `1`
* 范围: `0-6`

模型历史消息轮数，为 0 不发送之前的历史轮次。

#### defaultPreset

* 类型: `string`
* 默认值: `CHARACTER`

使用的伪装预设。

### 分群配置

#### configs

* 类型: `Record<string, GuildConfig>`
* 默认值: `{}`

分群配置，会覆盖上面的默认配置（键填写群号）。

支持的配置项包括：

* `maxTokens`: 使用聊天的最大 token 数
* `enableMessageId`: 向模型暴露平台消息 ID，以允许发送引用消息
* `isAt`: 是否启用 @
* `splitVoice`: 是否分段发送语音
* `splitSentence`: 是否启用自分割发送消息
* `markdownRender`: 是否启用 Markdown 渲染
* `isNickname`: 允许 bot 配置中的昵称引发回复
* `isNickNameWithContent`: 是否允许在对话内容里任意匹配 bot 配置中的昵称来触发对话
* `isForceMute`: 是否启用强制禁言
* `messageInterval`: 随机发送消息的间隔
* `enableLongWaitTrigger`: 是否启用空闲触发
* `idleTriggerIntervalMinutes`: 空闲触发间隔（分钟）
* `idleTriggerRetryStyle`: 空闲触发重试风格
* `enableIdleTriggerMaxInterval`: 是否启用空闲触发最大间隔限制
* `idleTriggerMaxIntervalMinutes`: 空闲触发最大间隔（分钟）
* `enableIdleTriggerJitter`: 是否启用空闲触发随机抖动
* `messageActivityScoreLowerLimit`: 消息活跃度分数下限阈值
* `messageActivityScoreUpperLimit`: 消息活跃度分数上限阈值
* `toolCalling`: 是否启用工具调用功能
* `image`: 是否允许输入图片
* `imageInputMaxCount`: 最大的输入图片数量
* `imageInputMaxSize`: 最大的输入图片大小（MB）
* `coolDownTime`: 冷却发言时间（秒）
* `typingTime`: 模拟打字时的间隔（毫秒）
* `largeTextSize`: 大文本消息的判断阈值（每段分句的字符数）
* `largeTextTypingTime`: 大文本消息的模拟打字间隔（毫秒）
* `muteTime`: 闭嘴时的禁言时间（毫秒）
* `modelCompletionCount`: 模型历史消息轮数
* `preset`: 使用的伪装预设
