# 大语言模型

ChatLuna 的基本能力之一就是聚合和调用各种大语言模型。

## 基本用法

使用 `chatluna` 服务中的 `createChatModel` 方法来创建一个 `ComputedRef<ChatLunaChatModel>` 实例。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const model = await ctx.chatluna.createChatModel("openai/gpt-5-nano")
//      ^?


const message = await model.value?.invoke("你好，世界！")
console.log(message)
    //          ^?
 

```

> [!TIP] 提示
> 自 ChatLuna 1.3.0 开始，ChatLuna 开始深度整合 vue 的响应式系统。如果返回的值为 `ComputedRef<T>`，则代表此值是可以根据其他配置改动进行变化的。
>
> 请先创建这个值并保存到类或者其他地方里面，在需要的时候调用 `ref.value` 来获取真正的值。

> [!WARNING] 警告
> 响应式获取的 `value` 可能会 `undefined`。
> 如果返回空值，则说明当前获取的模型或者其他值不存在。你需要提取判断并告知用户，需要的模型或者其他参数不存在。

`ChatLunaChatModel` 继承自 [`BaseChatModel`](https://v03.api.js.langchain.com/classes/_langchain_core.language_models_chat_models.BaseChatModel.html)。

你可以直接使用 `BaseChatModel` 的所有方法，并和 LangChain 的其他 API 无缝衔接。

## 获取可用的模型

在 ChatLuna 中，实际掌握各类模型和平台的是 `PlatformService` 类。

如果你需要获取全部可用的语言模型列表，可以调用 `PlatformService` 的 `listAllModels` 方法。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'

const modelsRef = ctx.chatluna.platform.listAllModels(ModelType.llm)
const models = modelsRef.value
//    ^?
```

<br>

`ModelType` 是一个枚举类型，定义了模型类型:

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
const ctx = new Context()
import type {} from "koishi-plugin-chatluna/services/chat";
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'
type Prettify<T> = never | { [K in keyof T]: T[K] };

// ---cut---
type PureModelType = Prettify<typeof ModelType>
//        ^?
```
  
<br><br><br><br><br><br>

目前支持的模型类型有：

- `llm`：大语言模型
- `embedding`：嵌入模型
- `all`：所有模型

<br>

## 获取指定模型的信息

`listAllModels` 方法返回的是一系列模型信息数组。

我们可以获取指定模型的信息。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
const ctx = new Context()
import type {} from "koishi-plugin-chatluna/services/chat";
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'
type Prettify<T> = never | { [K in keyof T]: T[K] };

// ---cut---
const modelInfo = ctx.chatluna.platform.findModel("openai/gpt-5-nano")

type ModelInfo = Prettify<typeof modelInfo.value>
//   ^?

```

<br><br><br><br><br><br>

返回的是一个 `ModelInfo` 对象，包含了模型的详细信息。具体的定义如下：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
const ctx = new Context()
import type {} from "koishi-plugin-chatluna/services/chat";
import { ModelType, ModelCapabilities } from 'koishi-plugin-chatluna/llm-core/platform/types'
type Prettify<T> = never | { [K in keyof T]: T[K] };

// ---cut---
interface ModelInfo {
    // 模型名称
    name: string
    // 模型类型
    type: ModelType
    // 模型的上下文大小
    maxTokens: number
    // 模型支持的能力 (多模态，工具调用等)
    capabilities: ModelCapabilities[]
}

type PureCapabilities = Prettify<typeof ModelCapabilities>
```
