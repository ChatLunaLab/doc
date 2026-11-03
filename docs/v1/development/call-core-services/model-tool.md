# 模型工具

ChatLuna 支持动态注册和使用 [Tool](https://js.langchain.com/docs/concepts/tools/)。

## 基础用法

从 `PlatformService` 中获取 `ChatLunaTool` 实例:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const chatlunaTool = ctx.chatluna.platform.getTool('web-search')
//      ^?
```

<br>

返回的是一个 `ChatLunaTool` 实例，其定义如下:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
const ctx = new Context()
import type {} from "koishi-plugin-chatluna/services/chat";
import { ChatLunaBaseEmbeddings } from 'koishi-plugin-chatluna/llm-core/platform/model'
import { StructuredTool } from '@langchain/core/tools'
import { BaseMessage } from '@langchain/core/messages'
import { Session } from 'koishi'

// ---cut---
interface CreateToolParams {
    embeddings: ChatLunaBaseEmbeddings
}

interface ChatLunaTool {
    createTool: (params: CreateToolParams) => StructuredTool
    selector: (history: BaseMessage[]) => boolean
    authorization?: (session: Session) => boolean
    name?: string
    id?: string
}
```

其中:

- `createTool` 方法用于创建一个 `StructuredTool` 实例
- `selector` 方法用于判断当前的对话历史是否需要使用该工具
- `authorization` 方法用于判断当前的会话是否有权限使用该工具
- `name` 为工具的名称
- `id` 为工具的唯一标识

创建工具时，需要传递 `embeddings` 参数。该参数用于工具在需要文本向量化时使用。

创建 `web-search` 工具的示例:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-search')

const tool = chatlunaTool.createTool({ embeddings: embeddingsRef.value })

const result = await tool.invoke("OpenAI 最近新闻")
```

<br>

## 获取可用的工具

从 `PlatformService` 中获取可用的工具列表:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const toolsRef = ctx.chatluna.platform.getTools()
const tools = toolsRef.value
//    ^?
```

## 常用工具的用法

`ChatLunaTool` 的 `createTool` 方法返回的是一个 [StructuredTool](https://js.langchain.com/docs/concepts/tools/#structured-tools) 实例。

不同的工具在调用时需要不同的参数。这里介绍几个常用工具的用法。

### web-search

`web-search` 工具用于在互联网上搜索信息。

直接调用即可，传入的参数即为搜索的关键词。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-search')

const tool = chatlunaTool.createTool({ embeddings: embeddingsRef.value })

const result = await tool.invoke("OpenAI 最近新闻")
```

### web-browser

`web-browser` 工具基于 `puppeteer` 实现，用于在浏览器中打开网页并进行交互。

使用时需要按照特定格式传入参数 `action`、`params` 和 `url`。

支持的操作包括:

- `open [url]`: 打开一个网页 (必须作为第一个操作)
- `summarize [search_text?]`: 简单总结当前页面内容，可选择性地指定搜索文本
- `text [search_text?]`: 获取当前页面的文本内容，可选择性地指定搜索文本
- `select [selector]`: 使用选择器获取特定 div 的内容
- `previous`: 返回上一页
- `get-html`: 获取当前页面的 HTML 内容
- `get-structured-urls`: 获取当前页面的结构化 URL 列表

使用示例:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")
const chatlunaTool = ctx.chatluna.platform.getTool('web-browser')

const tool = chatlunaTool.createTool({ embeddings: embeddingsRef.value })

const openResult = await tool.invoke({
    action: "open",
    url: "https://example.com"
})

const summaryResult = await tool.invoke({
    action: "summarize",
    url: "https://example.com"
})

const selectResult = await tool.invoke({
    action: "select",
    params: "main-content",
    url: "https://example.com"
})
```