# 模型工具

ChatLuna 也能动态的注册和使用 [`Tool`](https://js.langchain.com/docs/concepts/tools/)。

## 基础用法

从 `PlatformService` 中获取 `ChatHubTool` 实例：

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";

const chatlunaTool = ctx.chatluna.platform.getTool('web-search')
```

返回的是一个如下的实例：

```typescript
import { ChatLunaChatModel, ChatHubBaseEmbeddings } from 'koishi-plugin-chatluna/llm-core/platform/model'
import { Session } from 'koishi'

interface CreateToolParams {
    model: ChatLunaChatModel
    embeddings: ChatHubBaseEmbeddings
    conversationId?: string
    preset?: string
    userId?: string
}

interface ChatHubTool {
    createTool: (
        params: CreateToolParams,
        session?: Session
    ) => Promise<StructuredTool>
    selector: (history: BaseMessage[]) => boolean
    authorization?: (session: Session) => boolean
    alwaysRecreate?: boolean
}
```

其中:

- `createTool` 方法用于创建一个 `StructuredTool` 实例。
- `selector` 方法用于判断当前的对话是否需要使用该工具。
- `authorization` 方法用于判断当前的会话是否需要使用该工具。
- `alwaysRecreate` 方法用于判断是否每次都重新创建工具。如果调用的工具需要 `session`，则设置为 `true`。

每个 `ChatHubTool` 所需要传递的参数都不同，具体需要参考你使用的工具。

大部分情况下，你只需要传递 `model` 和 `embeddings` 参数。`model` 参数用于工具需要大语言模型调用场景时使用的模型，`embeddings` 参数用于工具需要文本向量化时使用的 Embeddings。

其余的参数一般只在 ChatLuna 内部使用，请自行研究。

于是，我们就可以这样创建一个 `web-search` 工具：

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";

// platform, model
const model = ctx.chatluna.createChatModel("openai", "gpt-4o-mini")
const embeddings = ctx.chatluna.createEmbeddings("openai", "text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-search')

const tool = await chatlunaTool.createTool({ model, embeddings })

console.log(await tool.invoke("OpenAI 最近新闻"))
```

## 获取可用的工具

从 `PlatformService` 中获取可用的工具列表：

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";

const tools = ctx.chatluna.platform.getTools()

// ['web-search', ...]
```

## 常用工具的用法

`ChatHubTool` 的 `createTool` 方法返回的是一个 [`StructuredTool`](https://js.langchain.com/docs/concepts/tools/#structured-tools) 实例。

但不同的工具需要不同的参数，`StructuredTool` 在调用时的具体传参需要参考你使用的工具。

这里我们介绍几个常用工具的用法。

### web-search

`web-search` 工具用于在互联网上搜索信息。

直接调用即可，传入的参数即为搜索的关键词。

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";

// platform, model
const model = ctx.chatluna.createChatModel("openai", "gpt-4o-mini")
const embeddings = ctx.chatluna.createEmbeddings("openai", "text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-search')

const tool = await chatlunaTool.createTool({ model, embeddings })

console.log(await tool.invoke("OpenAI 最近新闻"))
```

### web-browser

`web-browser` 工具基于 `puppeteer` 实现，用于在浏览器中打开网页并进行交互。

使用时需要按照特定格式传入参数：`action params`。

支持的操作包括：

- `open [url]`: 打开一个网页（必须作为第一个操作）
- `summarize [search_text?]`: 简单总结当前页面内容，可选择性地指定搜索文本
- `text [search_text?]`: 获取当前页面的文本内容，可选择性地指定搜索文本
- `select [selector]`: 使用选择器获取特定 div 的内容
- `previous`: 返回上一页
- `get-html`: 获取当前页面的 HTML 内容
- `get-structured-urls`: 获取当前页面的结构化 URL 列表

使用示例：

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";

const model = ctx.chatluna.createChatModel("openai", "gpt-4o-mini")
const embeddings = ctx.chatluna.createEmbeddings("openai", "text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-browser')

const tool = await chatlunaTool.createTool({ model, embeddings })


console.log(await tool.invoke("open https://example.com"))

console.log(await tool.invoke("summarize"))


console.log(await tool.invoke("select .main-content"))
```

需要注意的是，必须先使用 `open` 操作打开网页，才能进行其他操作。
