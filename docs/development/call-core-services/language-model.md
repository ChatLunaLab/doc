# 大语言模型

ChatLuna 的基本能力之一就是聚合和调用各种大语言模型。

## 基本用法

使用 `chatluna` 服务中的 `createChatModel` 方法来创建一个 `ChatLunaChatModel` 实例。

```typescript
import type {} from "koishi-plugin-chatluna/lib/services/chat";

// platform, model
const model = ctx.chatluna.createChatModel("openai", "gpt-4o-mini")

const message = await model.invoke("你好，世界！")

console.log(message)
```

`ChatLunaChatModel` 继承自 [`BaseChatModel`](https://v03.api.js.langchain.com/classes/_langchain_core.language_models_chat_models.BaseChatModel.html)，所以你可以直接使用 `BaseChatModel` 的所有方法。并和 LangChain 的其他 API 无缝衔接。

## 获取可用的模型

在 ChatLuna 中，实际掌握模型的是 `PlatformService` 服务。

如果你需要获取当前平台下可用的大语言模型列表，可以调用 `PlatformService` 的 `getAllModels` 方法。

```typescript
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'

const models = ctx.chatluna.platform.getAllModels(ModelType.llm)
```

`ModelType` 是一个枚举类型，定义了模型类型。目前支持的模型类型有：

- `llm`：大语言模型
- `embedding`：嵌入模型
- `all`：所有模型

## 获取详细模型信息

`getAllModels` 方法返回的是一系列模型的纯字符串数组，包含平台和模型名称。

例如：`["openai/gpt-4o-mini", "openai/gpt-4o", "gemini/gemini-1.5-flash"]`

因此我们需要将平台和模型名称分割开来。

```typescript
import { parseRawModelName } from 'koishi-plugin-chatluna/llm-core/utils/model'

const modelName = "openai/gpt-4o-mini"

const [platform, model] = parseRawModelName(modelName)
```

再获取指定平台里的所有模型，根据分割出的模型名称，获取模型的详细信息。

```typescript
const modelInfos = ctx.chatluna.platform.getModels(platform)

const modelInfo = modelInfos.find(info => info.name === model)

```

返回的是一个 `ModelInfo` 对象，包含了模型的详细信息。具体的定义如下：

```typescript
interface ModelInfo {
    // 模型名称
    name: string;
    // 模型类型
    type: ModelType;
    // 模型的最大上下文
    maxTokens?: number;
    // 是否支持函数调用
    functionCall?: boolean;
    // 支持的聊天模式（即将被弃用）
    supportMode?: string[];
}
```
