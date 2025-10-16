# 伪装群友 (Character) <Badge type="warning" text="实验性插件" />

此插件基于 Prompt 工程，尝试让大语言模型在群内伪装成群友对话。

此插件仍处于实验性阶段，「AI 味」可能还过浓。不要将其直接放入大群中。

## 配置

* 前往插件市场，安装 `chatluna-character` 插件。

![alt text](../../public/images/image-63.png)

## 使用

完成后启用插件。在 [应用群组](#applygroup) 中输入你需要应用的群组 ID，并在 [模型配置](#model) 中配置模型。

此时即可和尝试和伪装对话。如果正常回复了，则说明配置成功。

如果你需要新增或修改预设，默认预设的文件夹位于 `<koishi-data-path>/chathub/character/preset` 。

你可以前往表情包文件夹，修改伪装使用的表情包。表情包文件夹位于 `<koishi-data-path>/chathub/character/sticker` 。
表情包文件夹按照表情包的情绪类型分类。

## 预设

伪装的预设相比 ChatLuna 的预设，减少了很多自定义选项。下面是一个预设例子：

::: details default.yml
<<< ../../public/resources/character_preset.yml
:::

整个预设被分为 `status` ， `mute_keyword` ， `system` ， `name` , `nick_name` , `input` 。

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

system 是整个预设的核心部分。在默认预设中，基于类 yaml 的格式分成了几个板块：

* 个人信息:

  角色的个人信息，性别等。

* 性格爱好:

  角色的具体的性格，兴趣爱好等。

* 聊天行为:

  角色的聊天行为，包括回复风格，回复习惯等。

* 名词解释:

  角色的名词解释，包括一些网络梗，词汇解释等。起到类似口头禅的作用，让你的角色更贴近网友的回复。

* 人物状态:
  在这里介绍角色的状态，包括心情、状态、记忆、动作等。

* 回复格式:
  角色的回复格式，包括文本、表情、图片等。

  目前伪装使用类 xml 格式来表达消息，一条标准的消息如下:

```xml
  <message>content</message>
  ```

  其中 name 为群友的昵称，id 为群友的 id，content 为消息内容。

  伪装也支持让模型 AT 某个人，格式如下：

```xml
  <message> <at name='name'>id</at> content </message>
  ```

  其中 name 为群友的昵称，id 为群友的 id，content 为消息内容。

  伪装还支持以下标签格式：

  ```xml
  <message> <voice>语音内容</voice> </message>
  <message> <sticker>表情包链接（单独发送表情包）</sticker> </message>
  <message> <img>图片链接（图文混排）</img> </message>
  ```


  在部分时候需要让角色不回复，则可以不填写 content 内容。

  如：

```xml
  <message></message>
  ```

  具体的规则参考上面预设的格式。

你也可以任意自定义你的 `system`  内容。但需要注意的是，请让模型生成的内容遵循上面的回复格式。

### input

input 会把最近群聊的聊天记录和状态等信息作为格式化输入，基于此处的内容，让模型生成回复。

大体也可以分为几个板块：

* 总结规则：

  此处可以插入 `{time}` 来引用当前时间，并总结模型回复需要遵循的规则。

* 消息历史：

  此处可以插入 `{history_new}` 来引用最近的聊天记录， `{history_last}` 来引用最后一条消息。

* 当前状态：

  此处可以插入 `{status}` 来引用角色的状态。

* 生成格式：

  此处为了让模型能够生成符合格式的回复，一般为如下格式:

```xml
  <status>
    // 更新后的状态
  </status>

  <think>
    // 角色视角的思考过程
  </think>

  <output>
     <message>回复内容(10-20字，如果需要发送多条消息，请输出多个message标签)</message>
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
* 默认值: `10`
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
* 默认值: `5000`
* 范围: `1024-42000`

聊天的最大 token 数。

#### image

* 类型: `boolean`
* 默认值: `false`

是否允许输入图片（注意表情包也会输入，目前仅支持原生多模态的模型）。

#### imageInputMaxCount

* 类型: `number`
* 默认值: `3`
* 范围: `1-15`

最大的输入图片数量。

#### imageInputMaxSize

* 类型: `number`
* 默认值: `3`
* 范围: `1-20`

最大的输入图片大小（MB）。

#### toolCalling

* 类型: `boolean`
* 默认值: `false`

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
* 默认值: `true`

是否允许 bot 艾特他人。

#### splitVoice

* 类型: `boolean`
* 默认值: `false`

是否分段发送语音。

#### splitSentence

* 类型: `boolean`
* 默认值: `true`

是否启用自分割发送消息。注意请确保你的预设和模型在使用时支持自分割消息，否则请不要关闭。

#### markdownRender

* 类型: `boolean`
* 默认值: `true`

是否启用 Markdown 渲染。关闭后可能会损失分割消息的精度。

#### messageInterval

* 类型: `number`
* 默认值: `14`
* 范围: `0-10000`

随机发送消息的最大间隔。

#### messageActivityScore

* 类型: `number`
* 默认值: `0.85`
* 范围: `0-1`，步进 `0.00001`

消息活跃度分数的阈值，当活跃度超过这个阈值则会发送消息。群越活跃，这个值就会越高。

#### coolDownTime

* 类型: `number`
* 默认值: `10`
* 范围: `1-1440`

冷却发言时间（秒）。

#### typingTime

* 类型: `number`
* 默认值: `440`
* 范围: `100-1500`

模拟打字时的间隔（毫秒）。

#### largeTextSize

* 类型: `number`
* 默认值: `300`
* 范围: `100-1000`

大文本消息的判断阈值（字符数）。

#### largeTextTypingTime

* 类型: `number`
* 默认值: `100`
* 范围: `10-1500`

大文本消息的固定打字间隔（毫秒）。

#### muteTime

* 类型: `number`
* 默认值: `60000`
* 范围: `1000-6000000`

闭嘴时的禁言时间（毫秒）。

#### modelCompletionCount

* 类型: `number`
* 默认值: `3`
* 范围: `0-6`

模型历史消息轮数，为 0 不发送之前的历史轮次。

#### sendStickerProbability

* 类型: `number`
* 默认值: `0.0`
* 范围: `0-1`，步进 `0.01`

发送表情的概率（即将废弃，将制作新的表情系统插件）。

#### defaultPreset

* 类型: `string`
* 默认值: `煕`

使用的伪装预设。

### 分群配置

#### configs

* 类型: `Record<string, GuildConfig>`
* 默认值: `{}`

分群配置，会覆盖上面的默认配置（键填写群号）。

支持的配置项包括：

* `maxTokens`: 使用聊天的最大 token 数
* `isAt`: 是否启用 @
* `splitVoice`: 是否分段发送语音
* `splitSentence`: 是否启用自分割发送消息
* `markdownRender`: 是否启用 Markdown 渲染
* `isNickname`: 允许 bot 配置中的昵称引发回复
* `isNickNameWithContent`: 是否允许在对话内容里任意匹配 bot 配置中的昵称来触发对话
* `isForceMute`: 是否启用强制禁言
* `messageInterval`: 随机发送消息的间隔
* `messageActivityScore`: 消息活跃度分数的阈值
* `toolCalling`: 是否启用工具调用功能
* `image`: 是否允许输入图片
* `imageInputMaxCount`: 最大的输入图片数量
* `imageInputMaxSize`: 最大的输入图片大小（KB）
* `coolDownTime`: 冷却发言时间（秒）
* `typingTime`: 模拟打字时的间隔（毫秒）
* `largeTextSize`: 大文本消息的判断阈值（每段分句的字符数）
* `largeTextTypingTime`: 大文本消息的模拟打字间隔（毫秒）
* `muteTime`: 闭嘴时的禁言时间（毫秒）
* `modelCompletionCount`: 模型历史消息轮数
* `sendStickerProbability`: 发送表情的概率
* `preset`: 使用的伪装预设
