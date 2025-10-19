# 大语言模型

ChatLuna 也提供 API，来接入其他的模型适配器。

## 使用脚手架创建适配器

我们强烈建议使用 ChatLuna 提供的脚手架来创建模型适配器插件，这将大大简化你的开发流程。

### 创建适配器插件

在你的 Koishi 项目根目录下运行：

::: code-group

```bash [npm]
npm init chatluna-plugin@latest
```

```bash [yarn]
yarn create chatluna-plugin
```

:::

在提示中选择 **ChatLuna 适配器** 模板：

```shell
检测到工作区目录: G:\projects\koishi_projects\koishi-dev
? 选择模板类型: » - Use arrow-keys. Return to submit.
    ChatLuna 插件（完全基于 ChatLuna）
    Koishi 插件（部分功能需要 ChatLuna）
>   ChatLuna 适配器
```

然后输入你的适配器名称（不包含 `koishi-plugin-chatluna-adapter-` 前缀）：

```shell
? 适配器名称: » example
```

脚手架会自动创建一个名为 `koishi-plugin-chatluna-adapter-example` 的插件，其中已经包含了完整的模板代码。

### 模板说明

模板默认实现了 OpenAI ChatCompletion API 格式，包含以下文件：

- `src/index.ts` - 插件入口和配置
- `src/client.ts` - 平台客户端实现
- `src/requester.ts` - API 请求处理
- `src/types.ts` - 类型定义
- `src/utils.ts` - 工具函数
- `src/locales/` - 国际化文件

## 实现核心功能

使用脚手架创建的模板已经包含了大部分代码，你只需要实现以下核心部分：

### 1. 配置模型列表

在 `src/client.ts` 的 `refreshModels()` 方法中配置你的平台支持的模型：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { ModelInfo, ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'

class YourPlatformClient {
// ---cut---
async refreshModels(): Promise<ModelInfo[]> {
    // 替换为你的平台实际支持的模型
    const rawModels = [
        ['gpt-4', 8192],
        ['gpt-3.5-turbo', 4096],
        // 添加更多模型...
    ] as [string, number][]

    return rawModels.map(([model, maxTokens]) => {
        return {
            name: model,
            type: ModelType.llm,
            capabilities: [],
            supportMode: ['all'],
            maxTokens
        } as ModelInfo
    })
}
// ---cut-after---
}
```

你可以选择以下实现方式：

- 硬编码模型列表（如上所示）
- 通过 `Requester` 调取 API 动态的获取模型列表

### 2. 配置 API 端点

在 `src/requester.ts` 的 `_post()` 方法中设置你的 API 端点：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import * as fetchType from 'undici/types/fetch'
import { ClientConfig, ClientConfigPool } from 'koishi-plugin-chatluna/llm-core/platform/config'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context } from 'koishi'

interface Config {
    apiEndpoint: string
}

class YourPlatformRequester {
    constructor(
        private _ctx: Context,
        private _configPool: ClientConfigPool<ClientConfig>,
        private _pluginConfig: Config,
        private _plugin: ChatLunaPlugin
    ) {}

    private _config: ClientConfig = {} as ClientConfig
    private _buildHeaders() { return {} }
// ---cut---
private _post(url: string, data: any, params: fetchType.RequestInit = {}) {
    const body = JSON.stringify(data)

    // 替换为你的平台的 API 基础 URL
    const apiEndpoint = this._pluginConfig.apiEndpoint || 'https://api.yourplatform.com'

    return this._plugin.fetch(`${apiEndpoint}/${url}`, {
        body,
        headers: this._buildHeaders(),
        method: 'POST',
        ...params
    })
}
// ---cut-after---
}
```

### 3. 调整请求格式（可选）

如果你的平台 API 格式与 OpenAI 不完全兼容，需要修改 `src/requester.ts` 中的 `completionStreamInternal()` 方法：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { ModelRequestParams, ModelRequester } from 'koishi-plugin-chatluna/llm-core/platform/api'
import { ChatGenerationChunk } from '@langchain/core/outputs'
import { ClientConfig, ClientConfigPool } from 'koishi-plugin-chatluna/llm-core/platform/config'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { ChatLunaError, ChatLunaErrorCode } from 'koishi-plugin-chatluna/utils/error'
import { Context } from 'koishi'
import * as fetchType from 'undici/types/fetch'

interface YourPlatformMessage {
    role: string
    content: string
}

function langchainMessageToYourPlatformMessage(input: any): YourPlatformMessage[] {
    return []
}

interface Config {}

class YourPlatformRequester extends ModelRequester {
    constructor(
        ctx: Context,
        _configPool: ClientConfigPool<ClientConfig>,
        public _pluginConfig: Config,
        _plugin: ChatLunaPlugin
    ) {
        super(ctx, _configPool, _pluginConfig, _plugin)
    }

    private _post(url: string, data: any, params: fetchType.RequestInit = {}) {
        return this._plugin.fetch(`https://api.yourplatform.com/${url}`, {
            body: JSON.stringify(data),
            method: 'POST',
            ...params
        })
    }
// ---cut---
async *completionStreamInternal(
    params: ModelRequestParams
): AsyncGenerator<ChatGenerationChunk> {
    await this.init()

    const messagesMapped = langchainMessageToYourPlatformMessage(
        params.input
    )

    try {
        const response = await this._post(
            'your/api/path',  // 修改为你的 API 路径
            {
                messages: messagesMapped,
                stream: true,
                // 根据你的平台调整参数
                temperature: params.temperature,
                // ...其他参数
            },
            {
                signal: params.signal
            }
        )

        // 处理流式响应...
    } catch (e) {
        if (e instanceof ChatLunaError) {
            throw e
        }
        throw new ChatLunaError(ChatLunaErrorCode.API_REQUEST_FAILED, e)
    }
}
// ---cut-after---
}
```

### 4. 修改认证方式（可选）

如果需要不同的认证方式，可以修改 `src/requester.ts` 的 `_buildHeaders()` 方法：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { ClientConfig } from 'koishi-plugin-chatluna/llm-core/platform/config'

class YourPlatformRequester {
    private _config: ClientConfig = {} as ClientConfig
// ---cut---
private _buildHeaders() {
    return {
        'Content-Type': 'application/json',
        // 根据你的平台修改认证头
        'Authorization': `Bearer ${this._config.value.apiKey}`,
        // 或使用其他认证方式
        // 'X-API-Key': this._config.value.apiKey,
    }
}
// ---cut-after---
}
```

### 5. 更新类型定义（可选）

如果你的平台使用不同的消息格式，需要修改 `src/types.ts`：

```ts twoslash
// @noImplicitAny: false
// ---cut-before---
export interface YourPlatformMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
    // 添加平台特定的字段
}

export interface YourPlatformRequest {
    messages: YourPlatformMessage[]
    temperature?: number
    // 添加其他请求字段
}
```

### 6. 更新配置文件

根据你的平台需求，在 `src/index.ts` 中添加额外的配置项：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Schema } from 'koishi'
// ---cut---
export interface Config extends ChatLunaPlugin.Config {
    apiKeys: [string, boolean][]
    apiEndpoint: string
    maxContextRatio: number
    temperature: number
    presencePenalty: number
    frequencyPenalty: number
    // 添加你的自定义配置
}

export const Config: Schema<Config> = Schema.intersect([
    ChatLunaPlugin.Config,
    Schema.object({
        apiKeys: Schema.array(
            Schema.tuple([
                Schema.string().role('secret').default(''),
                Schema.boolean().default(true)
            ])
        )
            .default([[]])
            .role('table'),
        apiEndpoint: Schema.string()
            .default('https://api.yourplatform.com')
            .role('link')
    }),
    // ...其他配置
]) as Schema<Config>
```

同时记得更新 `src/locales/` 下的国际化文件。

## 配置说明

模板中的配置已经继承了 `ChatLunaPlugin.Config`，自动提供以下功能：

- 负载均衡：`apiKeys` 支持多个 API Key 配置，ChatLuna 会自动进行负载均衡
- 并发控制：`chatConcurrentMaxSize` 可以控制同一个模型的最大并发请求数
- 重试机制：`maxRetries` 负责控制控制失败重试次数
- 超时设置：`timeout` 可以控制请求 API 的最大超时时间

## 测试适配器

完成实现后，在你的 Koishi 项目中测试：

1. 构建项目：

   ```bash
   yarn build
   ```

2. 在 Koishi 控制台中添加并启用你的适配器插件

3. 进入插件面板，配置 API Key 和其他参数

4. 测试模型调用

## 可选功能

### 支持 Embeddings 模型

如果你的平台同时支持 embeddings 模型，可以：

1. 将 `client.ts` 中的基类改为 `PlatformModelAndEmbeddingsClient`
2. 实现 `EmbeddingsRequester` 接口
3. 在 `refreshModels()` 中添加 embeddings 模型

参考 [嵌入模型](./embedding-model.md) 文档了解详情。

### 支持工具调用（Tool Calling）

如果你的平台支持工具调用：

- 在 `requester.ts` 中正确处理 `tools` 参数
- 在 `utils.ts` 中正确格式化工具定义
- 处理工具调用的响应

如果不支持，可以在请求中忽略 `tools` 参数。

## 其他资源

我们推荐你参考 `ChatLuna` 上已有的模型适配器，了解更具体的实现：

- [OpenAI](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/openai-adapter/src)
- [Gemini](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/gemini-adapter/src)
- [Ollama](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/ollama-adapter/src)
- [Wenxin](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/wenxin-adapter/src)
