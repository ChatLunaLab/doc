# 扩展 ChatLuna 能力

另外一个常见的需求是扩展 ChatLuna 的能力。

ChatLuna 支持 Agent 模式，允许其他插件定义 [工具](https://js.langchain.com/docs/concepts/tools/)。

模型可以调用这些工具来完成各种任务。

## 创建插件

阅读 [创建插件](./getting-started.md#创建插件) 以了解更多。

## 注册工具

现在，你就可以注册一个 Tool 到 ChatLuna 了。下面是一个简单的示例：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false

import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Tool } from '@langchain/core/tools'
import {
    fuzzyQuery,
    getMessageContent
} from 'koishi-plugin-chatluna/utils/string'
import { ChatLunaToolRunnable } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { Context, Schema } from 'koishi'

export function apply(ctx: Context, config: Config) {
    // 必须创建一个 ChatLuna 插件实例
    const plugin = new ChatLunaPlugin(ctx, config, 'plugin-echo', false)

    ctx.on('ready', async () => {
        registerTools(ctx, plugin)
    })
}

function registerTools(ctx: Context, plugin: ChatLunaPlugin) {
    // 注册工具
    plugin.registerTool('echo', {
        selector(history) {
            return history.some((item) => fuzzyQuery(
                getMessageContent(item.content),
                [
                    'echo',
                    '说话',
                    '说',
                ]
            ))
        },
        createTool(params) {
            return new EchoTool()
        }
    })
}

export class EchoTool extends Tool {
    name = 'echo'

    constructor() {
        super({})
    }

    async _call(input: string, _,  config: ChatLunaToolRunnable) {
        try {
            const session = config.configurable.session

            await session.send(input)

            return `Successfully call echo with result ${input}`
        } catch (e) {
            return `Echo with input ${input} execution failed, because ${e['message']}`
        }
    }

    description = `This tool echoes the input. Call this tool when the user needs to say something.`
}

interface Config extends ChatLunaPlugin.Config {}

```

上面的代码注册了一个名为 `echo` 的 Tool。

当聊天记录符合 `selector` 的匹配条件时，会调用 `createTool` 方法创建一个 `EchoTool` 实例。

更详细的工具注册方法，请参考 [模型工具](./development/connect-to-core-services/model-tool)。

注册完成后，模型在需要的时候会调用 `EchoTool` 来回复用户。

## 测试

将当前房间的聊天模式设置为 Agent 模式，并确保上面的工具已经注册到 ChatLuna 服务。

尝试让模型调用你的工具，如成功，则说明你已经掌握了如何为 ChatLuna 添加自定义工具。

<chat-panel>
  <chat-message nickname="User">chatluna.chat.text 调用 echo 工具输出 Hello, World!</chat-message>
  <chat-message nickname="Bot">
   {<br>
    &nbsp;&nbsp;tool: 'echo',<br>
    &nbsp;&nbsp;arg: '{input: "Hello, World!"}'<br>
  }
  </chat-message>
  <chat-message nickname="Bot">Hello, World!</chat-message>
  <chat-message nickname="Bot">已经为你调用 echo 工具，输出 Hello, World!</chat-message>
</chat-panel>
