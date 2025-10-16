# 冲爆 AI (Smash or Pass AI)

此插件提供了基于大语言模型的图片评价和判断功能。

## 配置

前往插件市场，安装 `chatluna-smash-or-pass-ai` 插件。

完成后启用插件即可。注意还需要配置使用的模型。

## 使用

使用 `fuckluna` 命令配合图片，让模型对图片进行评价和判断。

可以直接发送图片，或者使用 @ 提及用户获取其头像进行评价。

## 命令

### 评价图片

对图片进行评价和判断。

以下为命令格式：

```powershell
fuckluna <message:text>
```

以下为参数说明：

- `message`: 可以是图片，或者 @ 用户。如果引用消息，则会评价引用消息中的图片。

以下为例子：

<chat-panel>
  <chat-message nickname="User">fuckluna [图片]</chat-message>
  <chat-message nickname="Bot">冲爆结果：冲<br>冲爆评分：8/10<br><br>冲爆理由：这张图片真不错...</chat-message>
</chat-panel>

<chat-panel>
  <chat-message nickname="User">fuckluna @某用户</chat-message>
  <chat-message nickname="Bot">冲爆结果：不冲<br>冲爆评分：3/10<br><br>冲爆理由：操***，不行。</chat-message>
</chat-panel>

## 配置项

此处列举了插件的配置项。

### 基础配置

#### model

- 类型: `string`
- 默认值: `无`

使用的模型。建议使用支持视觉能力的多模态模型。

#### prompt

- 类型: `string`
- 默认值: 见下方

主要判断提示词。此提示词会发送给模型，用于指导模型如何进行判断。

默认提示词会要求模型以 JSON 格式返回结果，包含：

- `verdict`: 判断结果，`冲` 或 `不冲`
- `rating`: 评分，1-10
- `explanation`: 详细解释

#### safeModePrompt

- 类型: `string`
- 默认值: 见下方

安全模式提示词。开启安全模式后，此提示词会附加到主提示词后面，用于过滤不当内容。

默认提示词会要求模型对违规词语进行替换处理，确保输出内容符合安全标准。

#### messageForward

- 类型: `boolean`
- 默认值: `true`

是否启用合并转发。开启后会将模型回复以合并转发形式发送。

#### safeMode

- 类型: `boolean`
- 默认值: `true`

是否启用安全模式。开启后会附加安全模式提示词，过滤不当内容。

#### imageOutput

- 类型: `boolean`
- 默认值: `true`

是否在回复中输出原图片。开启后会在回复中包含原始图片。

#### replyTemplate

- 类型: `string`
- 默认值: 见下方

回复的模板。支持以下占位符：

- `{verdict}`: 判断结果
- `{rating}`: 评分
- `{explanation}`: 详细解释

默认模板：

```
冲爆结果：{verdict}
冲爆评分：{rating}/10

冲爆理由：{explanation}
```
