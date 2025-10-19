# 模型工具

ChatLuna 支持注册各种 [Tool](https://js.langchain.com/docs/concepts/tools/)，让模型可以调用这些 Tool 来完成一些任务。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都得新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

// ---cut-start---
export interface Config extends ChatLunaPlugin.Config {}
// ---cut-end---

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        // 继续...
    })
}
```

> [!NOTE]
> 如果你的插件不需要注册模型适配器，`ChatLunaPlugin` 的构造函数需要传入 `false` 作为第四个参数。
> 该参数默认为 `true`，表示插件需要注册模型适配器。

## 创建 Tool

参考 [LangChain 文档](https://js.langchain.com/docs/concepts/tools/) 创建你的 Tool。

ChatLuna 目前仍使用较老的 API 创建 Tool，下面是一个示例（使用 `BuiltUserToastTool`）：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Tool } from '@langchain/core/tools'
import { Context } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat"
import type { ChatLunaToolRunnable } from 'koishi-plugin-chatluna/llm-core/platform/types'

export class BuiltUserToastTool extends Tool {
    name = 'built_user_toast'

    description = `Use this tool to notify the user about task changes, progress updates, or new developments during task execution. This is specifically for informational updates and notifications.

When to use:
- Task status has changed or progressed
- New developments or findings during execution
- Intermediate results that don't require user response
- Progress notifications during long-running tasks
- Completion notifications

Do NOT use this tool when:
- You need user input or confirmation (use built_user_confirm instead)
- You need user to choose between options (use built_question instead)
- Sending final results that end the conversation`

    constructor(private ctx: Context) {
        super()
    }

    /** @ignore */
    async _call(input: string, _, config: ChatLunaToolRunnable) {
        const session = config.configurable.session

        try {
            const elements = (
                await this.ctx.chatluna.renderer.render({
                    content: input
                })
            ).flatMap((message) => {
                const elements = message.element
                if (elements instanceof Array) {
                    return elements
                } else {
                    return [elements]
                }
            })

            await session.send(elements)
            return 'Message sent successfully. '
        } catch (error) {
            return 'An error occurred while sending your message. Please try again.'
        }
    }
}
```

## 注册 Tool

调用 `ChatLunaPlugin` 实例的 `registerTool` 方法注册 Tool：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context } from 'koishi'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Tool } from '@langchain/core/tools'
import type { ChatLunaToolRunnable } from 'koishi-plugin-chatluna/llm-core/platform/types'

const ctx = new Context()

export class BuiltUserToastTool extends Tool {
    name = 'built_user_toast'
    description = 'A tool for sending toast messages'
    constructor(private ctx: Context) { super() }
    async _call(input: string, _, config: ChatLunaToolRunnable) { return 'ok' }
}

// ---cut-start---
export interface Config extends ChatLunaPlugin.Config {}
// ---cut-end---

// ---cut---
export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        plugin.registerTool('built_user_toast', {
            selector(history) {
                // 总是激活此工具（根据历史聊天记录判断）
                return true
            },

            authorization(session) {
                // 授权检查，返回 true 则允许使用
                return true
            },

            createTool(params) {
                // 创建工具实例
                return new BuiltUserToastTool(ctx)
            }
        })
    })
}
```

<br>

`registerTool` 方法接收两个参数：

- `name`: 工具名称（字符串）
- `tool`: ChatLunaTool 配置对象
  - `selector`: 工具激活的选择器函数
    - 参数：`history` - 历史聊天记录数组
    - 返回：`boolean` - `true` 激活工具，`false` 不激活
    - 用途：根据对话历史判断是否需要此工具
  - `authorization`: 授权检查函数
    - 参数：`session` - 当前会话对象
    - 返回：`boolean` - `true` 允许使用，`false` 拒绝使用
    - 用途：判断当前用户是否有权限使用该工具
  - `createTool`: 工具实例创建函数
    - 参数：
      - `params` - 工具参数
      - `session` - 当前会话对象
    - 返回：`Tool` 实例
    - 用途：创建并返回工具的实例
