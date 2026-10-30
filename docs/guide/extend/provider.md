# 模型提供商

::: tip
本节介绍如何为 ChatLuna 接入新的模型后端。接入流程分为两部分：定义**提供商配方 (ProviderRecipe)** 以及实现**运行时提供商 (Provider)**。
:::

接入模型提供商采用分层架构：

- **配方 (Recipe)**：描述提供商的元信息、支持的模态以及配置项结构。用户在「提供商」页面添加该提供商的实例。
- **提供商 (Provider)**：负责底层的网络请求与模型调用逻辑。运行时会将用户的配置解析并实例化为可调用的 Provider 对象。

## 注册提供商配方 (ProviderRecipe)

要让提供商出现在控制台「提供商」页面的可添加列表中，你需要在插件中通过 `ctx.chatluna_providers.register` 注册一个 `ProviderRecipe`：

```ts
import type { Context } from '@chatluna/utils/cordis'

export function apply(ctx: Context) {
  ctx.chatluna_providers.register({
    id: 'my-provider',
    displayName: '我的提供商',
    modalities: ['chat', 'embed'],
    packageName: '@ai-sdk/openai-compatible',
    kind: 'aisdk',
    config: myConfigSchema,
  })
}
```

配置字段说明：

- `id`：提供商的唯一标识符。
- `displayName`：在控制台界面显示的名称。
- `modalities`：该提供商支持的模态列表。
- `packageName`：依赖的驱动包名（例如按需安装的 `@ai-sdk/*` 驱动包）。
- `kind`：驱动类型，支持以下三种取值：
  - `native`：完全自定义请求实现。
  - `aisdk`：复用 AI SDK 驱动，系统会根据 `packageName` 按需加载对应的适配包。
  - `composite`：复合驱动，单个端点可复用多路协议（如 chat、responses、anthropic、gemini）。
- `config`：提供给用户在界面填写的配置 Schema。

## 实现与注册运行时提供商 (Provider)

运行时提供商负责具体模态的请求调用。一个 Provider 可以按需实现以下七种模态之一或组合：

- `chat`：对话生成
- `embed`：向量嵌入
- `rerank`：重排
- `draw`：图像生成
- `speak`：文本转语音 (TTS)
- `listen`：语音转文本 (STT)
- `decide`：决策与结构化判断

使用 `ctx.ai.provide(id, provider)` 将实现注入到运行时：

```ts
import type { Context } from '@chatluna/utils/cordis'

export function apply(ctx: Context) {
  ctx.ai.provide('my-provider', {
    // 实现对话模态
    chat: (id) => myChatModel(id),
    // 实现向量模态
    embed: (id) => myEmbedModel(id),
  })
}
```

### 模型地址与能力查询

系统统一使用 `provider:model` 格式的地址引用模型（例如 `my-provider:gpt-4o`）。

如果你的模型支持高级特性，可以通过 `caps(address)` 暴露其能力参数。能力参数包含工具调用、图像输入、深度推理、上下文窗口大小等。系统在调度任务时，会根据 `caps(address)` 的返回结果决定该模型是否可以参与工具调用或视觉等特定任务。

## 下一步

- [服务与依赖](../plugin/service)
- [工具开发](./tools)
