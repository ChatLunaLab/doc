# Agent

ChatLuna 提供了 Agent 的简易框架，可以让模型自主选择和调用工具。

## 创建 Agent Executor

使用 `createAgentExecutor` 函数创建 Agent 执行器:

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

const prompt = new ChatLunaChatPrompt({
    preset: ctx.chatluna.preset.getPreset('sydney'),
    tokenCounter: (text) => modelRef.value.getNumTokens(text),
    promptRenderService: ctx.chatluna.promptRenderer,
    sendTokenLimit: modelRef.value.getModelMaxContextSize()
})

const executorRef = createAgentExecutor({
    llm: modelRef,
    tools: toolsRefCreated.tools,
    prompt: prompt,
    agentMode: 'tool-calling',
    returnIntermediateSteps: true,
    handleParsingErrors: true
})
```

<br>

`createAgentExecutor` 接受以下参数:

- `llm`: 语言模型的计算引用
- `tools`: 工具列表的计算引用
- `prompt`: 聊天提示词对象
- `agentMode`: Agent 模式，可选 `'tool-calling'` 或 `'react'`
- `returnIntermediateSteps`: 是否返回中间步骤
- `handleParsingErrors`: 是否处理解析错误
- `instructions`: ReAct 模式下的额外指令 (可选)

## 调用 Agent

创建 Agent Executor 后，可以通过 `invoke` 方法调用:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
import { HumanMessage, AIMessageChunk } from '@langchain/core/messages'
import { createAgentExecutor, createToolsRef } from 'koishi-plugin-chatluna/llm-core/agent'

const ctx = new Context()
let executor: ReturnType<typeof createAgentExecutor>

// ---cut---
const response = await executor.value.invoke({
    input: new HumanMessage("搜索 OpenAI 的最新新闻"),
    chat_history: [],
    variables: {}
})

const message = new AIMessage(response['output'])

```

<br>

调用后返回的结果包含:

- `output`: Agent 的最终输出
- `intermediateSteps`: 中间步骤 (如果 `returnIntermediateSteps` 为 `true`)

## Agent 模式

ChatLuna 支持两种 Agent 模式:

### tool-calling 模式

使用模型的原生工具调用能力，适用于支持 Tool Calling 的模型 (如 GPT-5, Claude 等)。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { createAgentExecutor } from 'koishi-plugin-chatluna/llm-core/agent'

const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

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

const prompt = new ChatLunaChatPrompt({
    preset: ctx.chatluna.preset.getPreset('sydney'),
    tokenCounter: (text) => modelRef.value.getNumTokens(text),
    promptRenderService: ctx.chatluna.promptRenderer,
    sendTokenLimit: modelRef.value.getModelMaxContextSize()
})

// ---cut---
const executorToolCallingRef = createAgentExecutor({
    llm: modelRef,
    tools: toolsRefCreated.tools,
    prompt,
    agentMode: 'tool-calling',
    returnIntermediateSteps: true
})
```

### react 模式

使用 ReAct (Reasoning and Acting) 模式，通过提示词引导模型进行推理和行动。

适用于不支持原生工具调用的模型。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { createAgentExecutor } from 'koishi-plugin-chatluna/llm-core/agent'
import { computed } from 'koishi-plugin-chatluna'

const modelRef = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

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

const prompt = new ChatLunaChatPrompt({
    preset: ctx.chatluna.preset.getPreset('sydney'),
    tokenCounter: (text) => modelRef.value.getNumTokens(text),
    promptRenderService: ctx.chatluna.promptRenderer,
    sendTokenLimit: modelRef.value.getModelMaxContextSize()
})

// ---cut---
const executorReactRef = createAgentExecutor({
    llm: modelRef,
    tools: toolsRefCreated.tools,
    prompt,
    agentMode: 'react',
    handleParsingErrors: true,
    instructions: computed(() => undefined)
})
```

## 创建工具引用

使用 `createToolsRef` 函数创建响应式的工具引用。

工具引用配合 Agent 执行器的引用，可以实现工具的动态选择和 Agent 执行器的动态重建。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()
let session: Session

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { createToolsRef } from 'koishi-plugin-chatluna/llm-core/agent'
import { computed } from 'koishi-plugin-chatluna'
import type { ChatLunaTool } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { HumanMessage } from '@langchain/core/messages'

import { Session } from 'koishi'

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

// 创建指定工具的引用
/* const toolsRef = computed(() => {
    const searchTool = ctx.chatluna.platform.getTool('web-search')
    const browserTool = ctx.chatluna.platform.getTool('web-browser')
    return [searchTool, browserTool]
}) */

// 创建全部工具的引用
const toolsNameRef = await ctx.chatluna.platform.getTools()
const toolsRef = computed(() => {
    return toolsNameRef.value.map((toolName) => {
        return ctx.chatluna.platform.getTool(toolName) satisfies ChatLunaTool
    })
})

const toolsRefCreated = createToolsRef({
    tools: toolsRef,
    embeddings: embeddingsRef.value
})


const messages = [new HumanMessage("你好")]

toolsRefCreated.update(session, messages)
```

<br>

`createToolsRef` 会根据工具的 `selector` 和 `authorization` 方法，自动筛选出当前对话历史下可用的工具。

调用 `update` 方法可以更新工具列表。
