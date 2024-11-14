# 模型工具

ChatLuna 支持注册各种 [Tool](https://js.langchain.com/docs/concepts/tools/)，让模型可以调用这些 Tool 来完成一些任务。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都得新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        // 在 ready 事件中注册到 ChatLuna 服务
        plugin.registerToService()

        // 继续...
    })
}
```

> [!NOTE]
> 如果你的插件不需要注册模型适配器，`ChatLunaPlugin` 的构造函数需要传入 `false` 作为第四个参数。
> 该参数默认为 `true`，表示插件需要注册模型适配器。

## 创建 Tool

参考 [LangChain 文档](https://js.langchain.com/docs/concepts/tools/) 创建你的 Tool。

目前 ChatLuna 仍然使用较老的 API 创建 Tool，下面是一个示例：

```typescript
import { Tool } from '@langchain/core/tools'
import { Context } from 'koishi'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { randomUA } from 'koishi-plugin-chatluna/utils/request'
import { getMessageContent } from 'koishi-plugin-chatluna/utils/string'
import { Config } from '..'

export class RequestsPostTool extends Tool implements RequestTool {
    name = 'requests_post'

    maxOutputLength = Infinity

    constructor(
        private _plugin: ChatLunaPlugin,
        public headers: Headers = {},
        { maxOutputLength }: { maxOutputLength?: number } = {}
    ) {
        super({
            ...headers
        })

        this.maxOutputLength = maxOutputLength ?? this.maxOutputLength
    }

    /** @ignore */
    async _call(input: string) {
        try {
            const { url, data } = JSON.parse(input)
            const res = await this._plugin.fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            })
            const text = await res.text()
            return text.slice(0, this.maxOutputLength)
        } catch (error) {
            return `${error}`
        }
    }

    description = `Use this when you want to POST to a website.
  Input should be a json string with two keys: "url" and "data".
  The value of "url" should be a string, and the value of "data" should be a dictionary of
  key-value pairs you want to POST to the url as a JSON body.
  Be careful to always use double quotes for strings in the json string
  The output will be the text response of the POST request.`
}

```

## 注册 Tool

调用 `ChatLunaPlugin` 实例的 `registerTool` 方法注册 Tool：

```typescript
ctx.on('ready', async () => {
    plugin.registerToService()
        
    plugin.registerTool('requests_post', {
        selector(history) {
            return history.some((item) => fuzzyQuery(
                getMessageContent(item.content),
                [
                    'url',
                    'http',
                    'request',
                    '请求',
                    '网页',
                    'get'
                ]
            ))
        },
        alwaysRecreate: true,
        authorization(session) {
            return true
        },
        async createTool(params, session) {
            return new RequestsPostTool(plugin)
        }
    })
})

```

`registerTool` 方法接收两个参数：

- `name`: 工具名称
- `tool`: ChatLunaTool 实例

  - `selector`: 工具激活的选择器，根据历史聊天记录，判断是否需要激活工具。返回 `true` 则激活，返回 `false` 则不激活。
  - `alwaysRecreate`: 是否总是重新创建工具实例。此参数用于需要 `session` 参数的场景。
  - `createTool`: 创建工具实例的方法。返回 `Tool` 实例。
  - `authorization`: 授权方法，传入 `session` 参数，用于判断当前使用者是否可以调用该工具。
