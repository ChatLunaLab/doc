# 使用 ChatLuna API

ChatLuna 在 Koishi 上提供了统一的大语言模型接入方案。通过 ChatLuna API，你可以轻松地在插件中集成大语言模型能力，而无需关心不同模型的接入细节。

## 添加依赖

首先，需要在你的 Koishi 插件的 `package.json` 文件中添加必要的依赖：

```json
{
    "peerDependencies": {
        "koishi": "^4.15.6",
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
import type {} from "koishi-plugin-chatluna/lib/services/chat";
import { ChatLunaChatModel } from 'koishi-plugin-chatluna/llm-core/platform/model'

export const inject = ['chatluna']
```

## 基础使用

现在你可以开始使用 ChatLuna 提供的 API 了。下面是一个简单的示例：

```typescript
export function apply(ctx: Context) {
    // 创建一个 ChatModel 实例
    const model = ctx.chatluna.createChatModel("openai", "gpt-4-mini") as ChatLunaChatModel
    
    // 发送消息并获取回复
    const message = await model.invoke("你好，世界！")
    console.log(message)
}
```

> 提示：ChatLuna 的模型实例基于 langchain 的 [`ChatModel`](https://js.langchain.com/docs/concepts/chat_models)，可以无缝集成 langchain 生态系统的各种工具和功能。

## 动态模型选择

在实际应用中，我们不建议在代码中硬编码使用特定的模型，因为以下几点：

- 你硬编码的模型在用户使用的环境中可能不存在
- 用户希望能选择其他模型

更好的做法是使用 [`Schema.dynamic`](https://koishi.chat/zh-CN/schema/advanced/dynamic.html) 让用户自主选择使用的模型：

```typescript
import { parseRawModelName } from 'koishi-plugin-chatluna/llm-core/utils/count_tokens'
import { ChatLunaChatModel } from 'koishi-plugin-chatluna/llm-core/platform/model'
import type {} from "koishi-plugin-chatluna/lib/services/chat";

export interface Config {
    model: string
}

export const Config: Schema<Config> = Schema.object({
    model: Schema.dynamic("model")
})

export function apply(ctx: Context, config: Config) {
    listenModel(ctx)

    ctx.on('ready', async () => {
        // 解析模型信息
        const [platform, modelName] = parseRawModelName(config.model)
        
        // 等待模型的加载
        await ctx.chatluna.awaitLoadPlatform(platform)

       
        const model = await ctx.chatluna.createChatModel(
            platform,
            modelName
        ) as ChatLunaChatModel

        const message = await model.invoke("你好，世界！")
        console.log(message)
    })
}


function listenModel(ctx: Context) {
    const getModelNames = (service: PlatformService) => 
        service.getAllModels(ModelType.llm).map((m) => Schema.const(m))

    ctx.on('chatluna/model-added', (service) => {
        ctx.schema.set('model', Schema.union(ctx.chatluna.getModelNames(service)))
    })

    ctx.on('chatluna/model-removed', (service) => {
        ctx.schema.set('model', Schema.union(ctx.chatluna.getModelNames(service)))
    })

    ctx.on('ready', () => {
        ctx.schema.set(
            'model',
            Schema.union(getModelNames(ctx.chatluna.platform))
        )
    })
}
```

恭喜！你已经掌握了 ChatLuna API 的核心用法。

通过上述配置和代码示例，你的插件已经具备了调用各类大语言模型的能力。
