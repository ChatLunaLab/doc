# 模型提供商

::: tip
本节介绍如何为 ChatLuna 接入新的模型后端。整个接入流程分为两部分：定义**提供商配方 (ProviderRecipe)** 与实现**运行时提供商 (Provider)**。
:::

在 ChatLuna 中，接入模型提供商采用了分层架构：

- **配方 (Recipe)**：用于描述提供商的元信息、支持的模态以及配置项结构。用户可以在控制台的「提供商」页面中添加该提供商的配置实例。
- **提供商 (Provider)**：负责底层的网络请求与模型调用逻辑。运行时会解析用户的配置，并将其动态实例化为可调用的 Provider 对象。

## 注册提供商配方 (ProviderRecipe)

要让你的提供商出现在控制台「提供商」页面的可添加列表中，首先需要在插件中调用 `ctx.chatluna_providers.register` 注册一个 `ProviderRecipe`：

```ts
import type { Context } from 'cordis'

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

配置对象的各字段含义如下：

- `id`：提供商的唯一标识符。
- `displayName`：在控制台界面中展示的可读名称。
- `modalities`：该提供商支持的模态列表。
- `packageName`：依赖的底层驱动包名（例如按需安装的 `@ai-sdk/*` 适配包）。
- `kind`：驱动类型，支持以下三种取值：
  - `native`：完全自定义请求实现。
  - `aisdk`：复用 AI SDK 驱动，系统会根据 `packageName` 按需加载对应的适配包。
  - `composite`：复合驱动，允许单个端点同时复用多路协议（如 chat、responses、anthropic、gemini）。
- `config`：提供给用户在控制台表单中填写的配置 Schema。

## 实现与注册运行时提供商 (Provider)

运行时提供商负责具体模态的请求调用与执行。一个 Provider 可以根据实际能力按需实现以下七种模态之一或其任意组合：

- `chat`：对话生成
- `embed`：向量嵌入
- `rerank`：文本重排
- `draw`：图像生成
- `speak`：文本转语音 (TTS)
- `listen`：语音转文本 (STT)
- `decide`：决策与结构化判断

完成实现后，调用 `ctx.ai.provide(id, provider)` 即可将该提供商注册到运行时中：

```ts
import type { Context } from 'cordis'

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

在调用时，系统统一使用 `provider:model` 格式的地址来定位具体模型（例如 `my-provider:gpt-4o`）。

如果你的模型支持高级特性，还可以通过 `caps(address)` 显式暴露其能力参数。能力参数涵盖了工具调用、图像输入、深度推理以及上下文窗口大小等信息。系统在调度任务时，会基于 `caps(address)` 的返回结果自动决定该模型能否参与工具调用或视觉理解等特定任务。

## 下一步

- [服务与依赖](../plugin/service)
- [工具开发](./tools)
