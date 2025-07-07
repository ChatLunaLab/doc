# 扩展 ChatLuna 能力

另外一个常见的需求是扩展 ChatLuna 的能力。

ChatLuna 支持插件聊天模式 (Plugin Chat Mode)，允许其他插件定义 [Tool](https://js.langchain.com/docs/concepts/tools/)，让模型可以调用这些 Tool 来完成一些任务。

## 添加依赖

首先，需要在你的 Koishi 插件的 `package.json` 文件中添加必要的依赖：

```json
{
    "peerDependencies": {
        "koishi": "^4.18.0",
        "koishi-plugin-chatluna": "^1.0.0-beta.119"
    },
    "devDependencies": {
        "koishi-plugin-chatluna": "^1.0.0-beta.119"
    },
    "dependencies": {
        "@langchain/core": "^0.3.2"
    },
    "koishi": {
        "service": {
            "required": ["chatluna"]
        }
    }
}
```

运行 `npm install` 或 `yarn install` 安装依赖后，在插件的主入口文件中引入并声明 ChatLuna 服务：

```typescript
import type {} from "koishi-plugin-chatluna/services/chat";
import { ChatLunaChatModel } from 'koishi-plugin-chatluna/llm-core/platform/model'

export const inject = ['chatluna']
```

## 注册工具

现在，你就可以注册一个 Tool 到 ChatLuna 了。下面是一个简单的示例：

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Tool } from '@langchain/core/tools'
import {
    fuzzyQuery,
    getMessageContent
} from 'koishi-plugin-chatluna/utils/string'

export function apply(ctx: Context) {
    const plugin = new ChatLunaPlugin(ctx, config, 'plugin-echo', false)

    ctx.on('ready', async () => {
        plugin.registerToService()
        registerTools(ctx, plugin)
    })
}

function registerTools(ctx: Context, plugin: ChatLunaPlugin) {
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
        alwaysRecreate: true,

        async createTool(params, session) {
            return new EchoTool(session)
        }
    })
}

export class EchoTool extends Tool {
    name = 'echo'

    constructor(
        public session: Session,
    ) {
        super({})
    }

    /** @ignore */
    async _call(input: string) {
        try {
            await this.session.send(input)

            return `Successfully call echo with result ${input}`
        } catch (e) {
            return `Echo with input ${input} execution failed, because ${e.message}`
        }
    }

    description = `This tool echoes the input. Call this tool when the user needs to say something.`
}


```

下面的代码注册了一个名为 `echo` 的 Tool。当聊天记录符合 `selector` 的匹配条件时，会调用 `createTool` 方法创建一个 `EchoTool` 实例。

更详细的工具注册方法，请参考 [模型工具](./development/connect-to-core-services/model-tool)。

此时模型则可以选择调用 `EchoTool` 来回复用户。

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
