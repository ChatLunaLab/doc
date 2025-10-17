# 使用 ChatLuna API

ChatLuna 在 Koishi 上提供了统一的大语言模型接入方案。

通过 ChatLuna API，你可以轻松地在插件中集成大语言模型能力，而无需关心不同平台模型的接入细节。

## 创建插件

### 从零开始

如果你没有一个已开发的插件，希望从零开始开发的话，可以运行我们的脚手架，创建一个 Koishi 插件。

需要注意的是，请确保在运行我们的脚手架时，当前所在的目录为 [Koishi 项目](https://koishi.chat/zh-CN/guide/develop/config.html#%E5%BA%94%E7%94%A8%E7%9B%AE%E5%BD%95) 的根目录。

::: code-group

```bash [npm]
npm init chatluna-plugin@latest
```

```bash [yarn]
yarn create chatluna-plugin
```

:::

执行后会进入一系列创建流程，基于提示即可：

1. 插件名称

    ```shell
    检测到工作区目录：G:\projects\koishi_projects\koishi-dev
    ? 插件名称：» koishi-plugin-chatluna-example
    ```

    你可以输入你自定义的插件名称。需要注意的是，这个名称必须以 `koishi-plugin-` 开头。

2. 插件类型

    ```shell
    ? 选择模板类型：» - Use arrow-keys. Return to submit.
    >   ChatLuna 插件（完全基于 ChatLuna）
        Koishi 插件（部分功能需要 ChatLuna）
    ```

    根据你的插件类型，选择对应的模板。

    > [!TIP] 注意
    > 当选择 ChatLuna 插件时，整个插件都会把 ChatLuna 作为必须依赖。这意味着当 ChatLuna 插件被重启时，新的插件将跟随重启。
    >
    >
    > 当选择 Koishi 插件时，创建的插件内会包含 `chatluna.ts`。
    >
    > 请在此处编写你依赖于 ChatLuna 的插件功能。
    >
    > 当 ChatLuna 插件被重启时，只会影响到 `chatluna.ts` 中的功能。

3. 安装依赖

    ```shell
    ✓ 插件已创建于 G:\projects\koishi_projects\koishi-dev\external\chatluna-example
    ? 现在安装依赖吗？» (Y/n)
    ```

    大多数情况下，选择 Y 即可。

完成后，现在就可以到新插件目录下的 `index.ts` 文件，编写你的插件逻辑啦。

### 已有插件集成

如果你已经开发了 Koishi 插件，并希望为插件引入 ChatLuna 提供 AI 能力，可以运行我们的脚手架，将 ChatLuna 依赖添加进你的插件中。

让我们假设你创建了一个 `example` 插件，你的 Koishi 项目的目录结构应该为：

```sh
root
├── external
│   └── example
│       ├── src
│       │   └── index.ts
│       └── package.json
├── koishi.yml
└── package.json
```

确保你在执行我们的脚手架时，所在的目录为 `/external/example/`。

::: code-group

```bash [npm]
npm init chatluna-plugin@latest
```

```bash [yarn]
yarn create chatluna-plugin
```

:::

执行后会进入一系列创建流程，基于提示即可：

1. 是否包含 `chatluna.ts`

    ```shell
    检测到插件目录：G:\projects\koishi_projects\koishi-dev
    ? 是否包含 chatluna.ts 文件？（用于编写 ChatLuna 插件的功能）» (Y/N)
    ```

    大多数情况下，选择 Y 即可。

2. 安装依赖

    ```shell
    ✓ ChatLuna dependencies added
    ? 现在安装依赖吗？» (Y/n)
    ```

    大多数情况下，选择 Y 即可。

完成后，就可以到新插件目录下的 `chatluna.ts` 文件，编写你的依赖于 ChatLuna 的插件逻辑啦。

> [!TIP] 注意
> 在默认情况下，脚手架不会修改你插件的 `index.ts`，让它自动加载 `chatluna.ts`。
> 你需要引入下面的代码来手动加载 `chatluna.ts`，就像加载其他 Koishi 插件一样：
>
> ```typescript
> import * as chatluna from './chatluna'
> // 省略很多代码
> // 插件入口
> export function apply(ctx: Context) {
>   // 加载子插件    
>   ctx.plugin(chatluna)
>}
> ```

## 基础使用

现在你可以开始使用 ChatLuna 提供的 API 了。下面是一个简单的示例：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false

import { Context, Schema } from 'koishi'
import type { ChatLunaService } from "koishi-plugin-chatluna/services/chat"
import { getMessageContent } from 'koishi-plugin-chatluna/utils/string'

export function apply(ctx: Context) {
    ctx.command('example')
        .action(async ({ session }) => {
        // 创建一个 ChatLunaModel 实例
        const model = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
    
        // 发送消息并获取回复
        const message = await model.value.invoke("你好，世界！")
        return getMessageContent(message.content)
    })
}
```

> [!TIP] 提示
> ChatLuna 的模型实例基于 LangChain 的 [`ChatModel`](https://js.langchain.com/docs/concepts/chat_models)，可以无缝集成 LangChain 生态系统的各种工具和功能。

## 动态模型选择

在实际应用中，我们不建议在代码中硬编码使用特定的模型，因为以下几点：

- 硬编码的模型在用户使用的环境中可能不存在
- 用户希望能选择其他模型

更好的做法是使用 [`Schema.dynamic`](https://koishi.chat/zh-CN/schema/advanced/dynamic.html) 让用户自主选择使用的模型：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false

import { modelSchema } from 'koishi-plugin-chatluna/utils/schema'
import type {} from "koishi-plugin-chatluna/services/chat"
import { getMessageContent } from 'koishi-plugin-chatluna/utils/string'
import { Context, Schema } from 'koishi'

export interface Config {
    model: string
}

export const Config: Schema<Config> = Schema.object({
    model: Schema.dynamic("model")
})

export function apply(ctx: Context, config: Config) {
    modelSchema(ctx)

    ctx.command('example')
        .action(async ({ session }) => {
        // 创建一个 ChatLunaModel 实例
        const model = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
    
        // 发送消息并获取回复
        const message = await model.value.invoke("你好，世界！")
        return getMessageContent(message.content)
    })
}

```

上述代码展示了如何让用户动态选择模型，并监听模型列表的变化以动态更新可用的模型列表。

## 总结

恭喜！你已经掌握了 ChatLuna API 的基本用法。

通过上述配置和代码示例，你的插件已经具备了调用各类大语言模型的能力。
