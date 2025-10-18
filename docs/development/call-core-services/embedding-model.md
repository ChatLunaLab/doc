# 嵌入模型

ChatLuna 也能聚合和调用各种嵌入模型。

## 基本用法

使用 `chatluna` 服务中的 `createEmbeddings` 方法来创建一个 `Embeddings` 实例。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const modelRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

const vector = await modelRef.value.embedQuery("你好，世界!")
//      ^?


console.log(vector)
```

返回的模型继承自 [`Embeddings`](https://v03.api.js.langchain.com/classes/_langchain_core.embeddings.Embeddings.html),并和 LangChain 的其他 API 无缝衔接。

## 获取可用的模型

在 ChatLuna 中，实际掌握各类模型和平台的是 `PlatformService` 类。

如果你需要获取全部可用的嵌入模型列表，可以调用 `PlatformService` 的 `listAllModels` 方法。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'

const modelsRef = ctx.chatluna.platform.listAllModels(ModelType.embeddings)
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

目前支持的模型类型有:

- `llm`:大语言模型
- `embedding`:嵌入模型
- `all`:所有模型

## 从用户配置中创建

ChatLuna 的主插件中允许用户设置 [`defaultEmbeddings`](../../guide/useful-configurations.md#defaultembeddings) 配置项，用于指定默认的嵌入模型。

开发者也可以直接使用这个配置项指定的嵌入模型来创建嵌入模型实例。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { parseRawModelName } from 'koishi-plugin-chatluna/llm-core/utils/count_tokens'

const embeddings = await ctx.chatluna.createEmbeddings(ctx.chatluna.config.defaultEmbeddings)
//      ^?
```

## 获取详细模型信息

可参考 [大语言模型](./language-model.md#获取指定模型的信息) 中的 `获取指定模型的信息` 部分。

这里不再赘述。
