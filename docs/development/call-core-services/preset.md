# 预设

ChatLuna 提供了强大的预设系统，可以为模型定义不同的角色和行为模式。

## 基本用法

使用 `chatluna` 服务中的 `preset` 属性来获取预设。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const presetRef = ctx.chatluna.preset.getPreset("chatgpt")
const preset = presetRef.value
//      ^?


console.log(preset)
```

返回的预设是一个 `PresetTemplate` 对象，包含了预设的所有信息。

## 获取可用的预设

在 ChatLuna 中，预设由 `PresetService` 类管理。

如果你需要获取全部可用的预设列表，可以调用 `PresetService` 的 `getAllPreset` 方法。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const presetsRef = ctx.chatluna.preset.getAllPreset()
const presets = presetsRef.value
//    ^?


console.log(presets)
```

<br>

`getAllPreset` 方法接受一个可选参数:

- `concatKeyword`: 是否将触发关键词拼接为字符串，默认为 `true`

当 `concatKeyword` 为 `true` 时，返回的是触发关键词拼接的字符串数组（如 `["chatgpt, gpt"]`）。

当 `concatKeyword` 为 `false` 时，返回的是第一个触发关键词的数组（如 `["chatgpt"]`）。

## 获取默认预设

ChatLuna 允许获取默认预设（通常是 `sydney`），如果没有找到则返回第一个加载的预设。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const defaultPresetRef = ctx.chatluna.preset.getDefaultPreset()
const defaultPreset = defaultPresetRef.value
//      ^?


console.log(defaultPreset)
```

## 基于预设创建聊天链

预设是聊天链的核心组成部分。你可以使用预设来创建聊天提示词，然后创建聊天链。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { ChatLunaChatPrompt } from 'koishi-plugin-chatluna/llm-core/chain/prompt'
import { computed } from 'koishi-plugin-chatluna'

const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
const presetRef = ctx.chatluna.preset.getPreset('chatgpt')

const prompt = computed(() => {
    const model = modelRef.value
    return new ChatLunaChatPrompt({
        preset: presetRef,
        tokenCounter: (text) => model.getNumTokens(text),
        sendTokenLimit: model.getModelMaxContextSize(),
        promptRenderService: ctx.chatluna.promptRenderer
    })
})

const chain = computed(() => prompt.value.pipe(modelRef.value))
```

<br>

`ChatLunaChatPrompt` 接受以下参数:

- `preset`: 预设的计算引用
- `tokenCounter`: Token 计数函数，用于计算文本的 Token 数量
- `sendTokenLimit`: 发送消息的 Token 限制
- `promptRenderService`: 提示词渲染服务

## 创建简单的对话链

使用预设和模型创建一个完整的对话链示例。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { ChatLunaChatPrompt } from 'koishi-plugin-chatluna/llm-core/chain/prompt'
import { computed } from 'koishi-plugin-chatluna'
import { HumanMessage } from '@langchain/core/messages'

const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
const presetRef = ctx.chatluna.preset.getPreset('sydney')

const prompt = computed(() => {
    const model = modelRef.value
    return new ChatLunaChatPrompt({
        preset: presetRef,
        tokenCounter: (text) => model.getNumTokens(text),
        sendTokenLimit: model.getModelMaxContextSize(),
        promptRenderService: ctx.chatluna.promptRenderer
    })
})

const chain = computed(() => prompt.value.pipe(modelRef.value))

const response = await chain.value.invoke({
    input: new HumanMessage("你好，请介绍一下自己"),
    // 历史对话记录
    chat_history: [],
    // 预设变量
    variables: {}
})

console.log(response.content)
```

<br>

调用 `invoke` 方法时传入的参数包含:

- `input`: 用户输入的消息（HumanMessage 实例）
- `chat_history`: 历史对话记录数组
- `variables`: 用于渲染预设模板的变量对象

## 与 Agent 结合使用

预设也可以与 Agent 框架结合使用，为 Agent 提供角色定位和行为指导。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { createAgentExecutor, createToolsRef } from 'koishi-plugin-chatluna/llm-core/agent'
import { ChatLunaChatPrompt } from 'koishi-plugin-chatluna/llm-core/chain/prompt'
import type { ChatLunaTool } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { computed } from 'koishi-plugin-chatluna'

const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")
const presetRef = ctx.chatluna.preset.getPreset('sydney')

const enabledTools = ['web-search', 'web-browser']
const toolsRef = computed(() =>
    enabledTools.map(
        (toolName) => ctx.chatluna.platform.getTool(toolName) satisfies ChatLunaTool
    )
)

const toolsRefCreated = createToolsRef({
    tools: toolsRef,
    embeddings: embeddingsRef.value
})

const prompt = computed(() => {
    const model = modelRef.value
    return new ChatLunaChatPrompt({
        preset: presetRef,
        tokenCounter: (text) => model.getNumTokens(text),
        sendTokenLimit: model.getModelMaxContextSize(),
        promptRenderService: ctx.chatluna.promptRenderer
    })
})

const executorRef = createAgentExecutor({
    llm: modelRef,
    tools: toolsRefCreated.tools,
    prompt: prompt.value,
    agentMode: 'tool-calling',
    returnIntermediateSteps: true,
    handleParsingErrors: true
})
```

## 预设模板变量

预设中可以使用模板变量来动态生成内容。常用的变量包括:

- `{name}`: 机器人名称
- `{date}`: 当前日期
- `{time}`: 当前时间
- `{weekday}`: 当前星期几
- `{user}`: 用户昵称
- `{user_id}`: 用户 ID
- `{bot_id}`: 机器人 ID
- `{is_group}`: 是否为群聊
- `{is_private}`: 是否为私聊

这些变量会在渲染预设时被替换为实际值。

更多关于预设系统的信息，请参考 [预设系统](../../guide/preset-system/introduction.md)。

需要注意的是，你需要手动传入这些变量进去。
