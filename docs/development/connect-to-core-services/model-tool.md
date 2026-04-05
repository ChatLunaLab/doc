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
  - `meta`: 工具元数据（推荐填写）
    - `source`: 工具来源
      - 常见值：`core`、`extension`、`mcp`、`action`
    - `group`: 工具所属分组
      - 如：`search`、`plugin-common`
    - `tags`: 工具标签列表
      - 用于分类、筛选和展示
    - `defaultAvailability`: 工具的默认可用性配置
      - `enabled`: 是否默认启用
      - `main`: 是否在主聊天模式中默认可用
      - `chatluna`: 是否在 ChatLuna 主能力中默认可用
      - `characterScope`: 是否在伪装插件中默认可用
        - `all`: 群聊和私聊都默认可用
        - `group`: 仅群聊默认可用
        - `private`: 仅私聊默认可用
        - `none`: 默认不在伪装插件中启用

### 工具元数据

当前 ChatLuna 的工具注册，通常都会补充 `meta` 字段。虽然它不是强制项，但推荐在开发插件时始终填写，便于工具系统、配置界面和其他上层功能正确识别工具来源、分组与默认启用范围。

示例：

```ts
plugin.registerTool('web_search', {
    description: SEARCH_TOOL_DESCRIPTION,
    selector() {
        return true
    },
    createTool(params) {
        return new SearchTool(...)
    },
    meta: {
        source: 'extension',
        group: 'search',
        tags: ['search', 'web'],
        defaultAvailability: {
            enabled: true,
            main: true,
            chatluna: true,
            characterScope: 'all'
        }
    }
})
```

如果你的工具是为伪装插件的回复流程服务的，建议你明确设置 `characterScope`，避免工具默认暴露到不合适的会话范围。

## 为伪装插件的回复工具挂载自定义字段

[chatluna-character](../../ecosystem/other/character.md) 伪装插件支持一种实验性的「工具调用回复」模式。在该模式下，模型不再通过 XML 块输出回复内容，而是通过调用一个名为 `character_reply` 的工具来完成状态更新、消息发送、触发条件设置等操作。

外部插件可以通过 `ctx.chatluna_character.registerReplyToolField()` 方法，向 `character_reply` 工具注册额外的自定义参数字段。

> [!TIP] 最佳实践
> 建议只在此处注册与消息交互有关的能力，如：戳一戳、撤回消息等，因为它们几乎不需要模型查看工具返回的结果，并且更适合在模型完成消息回复时一起操作。

当模型调用 `character_reply` 时，伪装插件会自动将这些自定义字段连同内置字段一起传递给模型，并在工具被调用时执行对应的回调。

### CharacterReplyToolField 接口

注册的字段需要符合 `CharacterReplyToolField` 接口：

```ts
interface CharacterReplyToolField {
    /** 字段名称，将作为 character_reply 工具的参数名 */
    name: string

    /** JSON Schema，描述该字段的类型与结构 */
    schema: Record<string, unknown>

    /**
     * 可用性检查（可选）。
     * 返回 false 时，该字段不会出现在工具参数中，也不会被调用。
     */
    isAvailable?: (
        ctx: Context,
        session: Session,
        config: Config | GuildConfig | PrivateConfig
    ) => boolean

    /**
     * 工具被调用时的回调。
     * 当模型在调用 character_reply 时传入了该字段的值，此回调会被执行。
     */
    invoke?: (
        ctx: Context,
        session: Session,
        value: unknown,
        config: Config | GuildConfig | PrivateConfig
    ) => Promise<void> | void

    /**
     * 渲染回调。
     * 将工具调用的结果转换为 XML 字符串，插入到 <action> 块中。
     * 用于将工具调用的输出回写到对话历史中，以便模型在后续轮次中看到之前的操作。
     */
    render?: (
        ctx: Context,
        session: Session,
        value: unknown,
        config: Config | GuildConfig | PrivateConfig
    ) => string | string[] | undefined
}
```

### 注册字段

调用 `ctx.chatluna_character.registerReplyToolField()` 注册字段。该方法返回一个注销函数，调用后可移除已注册的字段。

```ts
import { Context } from 'koishi'
import type {} from 'koishi-plugin-chatluna-character'

export function apply(ctx: Context) {
    // 注册一个自定义字段
    const dispose = ctx.chatluna_character.registerReplyToolField({
        name: 'poke',

        schema: {
            type: 'string',
            description: 'Platform user ID to poke.'
        },

        // 仅在非私聊的 OneBot 平台上可用
        isAvailable(ctx, session) {
            return !session.isDirect && session.platform === 'onebot'
        },

        // 模型调用 character_reply 并传入 poke 字段时执行
        async invoke(ctx, session, value) {
            if (typeof value !== 'string') return
            // 执行戳一戳操作……
        },

        // 将工具调用结果渲染为 XML，写入对话历史
        render(ctx, session, value) {
            if (typeof value !== 'string') return undefined
            return `<poke user_id="${value}" />`
        }
    })

    // 插件卸载时自动注销
    ctx.on('dispose', dispose)
}
```

### 工作流程

注册的字段会参与以下流程：

1. **构建工具参数**：伪装插件在创建 `character_reply` 工具时，遍历所有已注册字段，对通过 `isAvailable` 检查的字段，将其 `schema` 添加到工具的参数定义中。
2. **执行回调**：当模型调用 `character_reply` 并传入了某个自定义字段的值时，伪装插件会调用该字段的 `invoke` 回调。
3. **渲染到历史**：在将工具调用结果写入对话历史时，伪装插件会调用每个字段的 `render` 回调，将返回的 XML 字符串插入到 `<action>` 块中，使模型在后续轮次中可以看到之前的操作记录。
