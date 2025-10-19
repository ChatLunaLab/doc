# 嵌入模型

ChatLuna 也提供 API，来接入其他的嵌入模型。

## 使用脚手架创建适配器

我们强烈建议使用 ChatLuna 提供的脚手架来创建模型适配器插件。如果你还没有创建适配器项目，请先参考 [大语言模型](./language-model.md#使用脚手架创建适配器) 文档创建适配器项目。

## 实现 Embeddings 支持

如果你的平台同时支持大语言模型和嵌入模型，推荐在同一个适配器中实现两者。

### 1. 修改客户端基类

将 `src/client.ts` 中的基类从 `PlatformModelClient` 改为 `PlatformModelAndEmbeddingsClient`：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import {
    PlatformModelAndEmbeddingsClient
} from 'koishi-plugin-chatluna/llm-core/platform/client'
import { ClientConfig } from 'koishi-plugin-chatluna/llm-core/platform/config'
import {
    ChatHubBaseEmbeddings,
    ChatLunaChatModel,
    ChatLunaEmbeddings
} from 'koishi-plugin-chatluna/llm-core/platform/model'
import {
    ModelInfo,
    ModelType
} from 'koishi-plugin-chatluna/llm-core/platform/types'
import { Context } from 'koishi'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import {
    ChatLunaError,
    ChatLunaErrorCode
} from 'koishi-plugin-chatluna/utils/error'

interface Config {
    maxContextRatio: number
    frequencyPenalty: number
    presencePenalty: number
    timeout: number
    temperature: number
    maxRetries: number
}

class YourPlatformRequester {}
// ---cut---
export class YourPlatformClient extends PlatformModelAndEmbeddingsClient<ClientConfig> {
    platform = 'yourplatform'

    private _requester: YourPlatformRequester

    constructor(
        ctx: Context,
        private _config: Config,
        public plugin: ChatLunaPlugin
    ) {
        super(ctx, plugin.platformConfigPool)

        this._requester = new YourPlatformRequester(
            ctx,
            plugin.platformConfigPool,
            _config,
            plugin
        )
    }

    async refreshModels(): Promise<ModelInfo[]> {
        const rawModels = [
            // 语言模型
            ['gpt-4', 8192, ModelType.llm],
            ['gpt-3.5-turbo', 4096, ModelType.llm],
            // 嵌入模型
            ['text-embedding-3', 8192, ModelType.embeddings],
            ['text-embedding-small', 8192, ModelType.embeddings],
        ] as [string, number, ModelType][]

        return rawModels.map(([model, maxTokens, type]) => {
            return {
                name: model,
                type,
                capabilities: [],
                supportMode: ['all'],
                maxTokens
            } as ModelInfo
        })
    }

    protected _createModel(
        model: string
    ): ChatLunaChatModel | ChatHubBaseEmbeddings {
        const info = this._modelInfos[model]

        if (info == null) {
            throw new ChatLunaError(ChatLunaErrorCode.MODEL_NOT_FOUND)
        }

        // 根据模型类型创建不同的实例
        if (info.type === ModelType.llm) {
            return new ChatLunaChatModel({
                modelInfo: info,
                requester: this._requester,
                model,
                modelMaxContextSize: info.maxTokens,
                maxTokenLimit: Math.floor(
                    (info.maxTokens || 100_000) * this._config.maxContextRatio
                ),
                frequencyPenalty: this._config.frequencyPenalty,
                presencePenalty: this._config.presencePenalty,
                timeout: this._config.timeout,
                temperature: this._config.temperature,
                maxRetries: this._config.maxRetries,
                llmType: 'yourplatform'
            })
        }

        // 创建 Embeddings 模型实例
        return new ChatLunaEmbeddings({
            client: this._requester,
            model,
            maxRetries: this._config.maxRetries
        })
    }
}
```

### 2. 实现 EmbeddingsRequester 接口

在 `src/requester.ts` 中实现 `EmbeddingsRequester` 接口：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import {
    ModelRequester,
    ModelRequestParams,
    EmbeddingsRequester,
    EmbeddingsRequestParams
} from 'koishi-plugin-chatluna/llm-core/platform/api'
import {
    ClientConfig,
    ClientConfigPool
} from 'koishi-plugin-chatluna/llm-core/platform/config'
import * as fetchType from 'undici/types/fetch'
import { ChatGenerationChunk } from '@langchain/core/outputs'
import {
    ChatLunaError,
    ChatLunaErrorCode
} from 'koishi-plugin-chatluna/utils/error'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Logger } from 'koishi'

interface Config {
    maxRetries: number
}

const logger = {} as Logger
// ---cut---
export class YourPlatformRequester
    extends ModelRequester
    implements EmbeddingsRequester {

    constructor(
        ctx: Context,
        _configPool: ClientConfigPool<ClientConfig>,
        public _pluginConfig: Config,
        _plugin: ChatLunaPlugin
    ) {
        super(ctx, _configPool, _pluginConfig, _plugin)
    }

    // ... 其他方法（如 completionStreamInternal）

    async embeddings(
        params: EmbeddingsRequestParams
    ): Promise<number[] | number[][]> {
        await this.init()

        // 将单个字符串转换为数组
        if (typeof params.input === 'string') {
            params.input = [params.input]
        }

        try {
            const response = await this._post(
                'embeddings',  // API 路径
                {
                    input: params.input,
                    model: params.model
                },
                {
                    signal: params.signal
                }
            )

            const data = await response.text()
            const result = JSON.parse(data)

            // 根据你的 API 响应格式调整
            if (result.data && result.data.length > 0) {
                return result.data.map((item: any) => item.embedding)
            }

            throw new Error(
                'error when calling embeddings, Result: ' +
                JSON.stringify(result)
            )
        } catch (e) {
            if (e instanceof ChatLunaError) {
                throw e
            }

            const error = new Error(
                'error when calling embeddings: ' + e.message
            )
            error.stack = e.stack
            error.cause = e.cause
            logger.debug(e)

            throw new ChatLunaError(ChatLunaErrorCode.API_REQUEST_FAILED, error)
        }
    }

    private _post(url: string, data: any, params: fetchType.RequestInit = {}) {
        const body = JSON.stringify(data)
        const apiEndpoint = this._config.value.apiEndpoint || 'https://api.yourplatform.com'

        return this._plugin.fetch(`${apiEndpoint}/${url}`, {
            body,
            headers: this._buildHeaders(),
            method: 'POST',
            ...params
        })
    }

    private _buildHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this._config.value.apiKey}`
        }
    }

    get logger() {
        return logger
    }
}
```

### 3. 实现要点

#### 输入处理

`embeddings` 方法的 `params.input` 可以是：
- 单个字符串：`"hello world"`
- 字符串数组：`["hello", "world"]`

你需要统一处理这两种情况。

#### 返回值

根据输入类型返回不同格式：
- 如果输入是单个字符串，返回 `number[]`（一维向量）
- 如果输入是字符串数组，返回 `number[][]`（向量矩阵）

#### 示例响应处理

以 Gemini 为例：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { EmbeddingsRequestParams, EmbeddingsRequester } from 'koishi-plugin-chatluna/llm-core/platform/api'
import {
    ChatLunaError,
    ChatLunaErrorCode
} from 'koishi-plugin-chatluna/utils/error'
import { Logger } from 'koishi'

const logger = {} as Logger

class GeminiRequester implements EmbeddingsRequester {
    private async _post(url: string, data: any): Promise<Response> {
        return {} as Response
    }
// ---cut---
async embeddings(
    params: EmbeddingsRequestParams
): Promise<number[] | number[][]> {
    if (typeof params.input === 'string') {
        params.input = [params.input]
    }

    try {
        const response = await this._post(
            `models/${params.model}:batchEmbedContents`,
            {
                requests: params.input.map((input) => {
                    return {
                        model: `models/${params.model}`,
                        content: {
                            parts: [{ text: input }]
                        }
                    }
                })
            }
        )

        const data = await response.text()
        const result = JSON.parse(data)

        if (result.embeddings && result.embeddings.length > 0) {
            return result.embeddings.map((embedding) => {
                return embedding.values
            })
        }

        throw new Error(
            'error when calling gemini embeddings, Result: ' +
            JSON.stringify(result)
        )
    } catch (e) {
        const error = new Error(
            'error when calling gemini embeddings, Result: ' + e.message
        )
        error.stack = e.stack
        error.cause = e.cause
        logger.debug(e)

        throw new ChatLunaError(ChatLunaErrorCode.API_REQUEST_FAILED, error)
    }
}
// ---cut-after---
}
```

## 仅支持 Embeddings 的平台

如果你的平台只提供嵌入模型（不支持大语言模型），可以使用 `PlatformEmbeddingsClient`：

```ts twoslash
// @noImplicitAny: false
import type {} from 'koishi-plugin-chatluna'
import { PlatformEmbeddingsClient } from 'koishi-plugin-chatluna/llm-core/platform/client'
import { ClientConfig } from 'koishi-plugin-chatluna/llm-core/platform/config'
import {
    ChatHubBaseEmbeddings,
    ChatLunaEmbeddings
} from 'koishi-plugin-chatluna/llm-core/platform/model'
import {
    ModelInfo,
    ModelType
} from 'koishi-plugin-chatluna/llm-core/platform/types'
import { Context } from 'koishi'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import {
    ChatLunaError,
    ChatLunaErrorCode
} from 'koishi-plugin-chatluna/utils/error'

interface Config {
    maxRetries: number
}

class YourEmbeddingsRequester {}
// ---cut---
export class YourEmbeddingsClient extends PlatformEmbeddingsClient<ClientConfig> {
    platform = 'yourplatform'

    private _requester: YourEmbeddingsRequester

    constructor(
        ctx: Context,
        private _config: Config,
        public plugin: ChatLunaPlugin
    ) {
        super(ctx, plugin.platformConfigPool)
        this._requester = new YourEmbeddingsRequester(
            ctx,
            plugin.platformConfigPool,
            _config,
            plugin
        )
    }

    async refreshModels(): Promise<ModelInfo[]> {
        const rawModels = [
            ['embedding-model-1', 8192],
            ['embedding-model-2', 4096],
        ] as [string, number][]

        return rawModels.map(([model, maxTokens]) => {
            return {
                name: model,
                type: ModelType.embeddings,
                capabilities: [],
                supportMode: ['all'],
                maxTokens
            } as ModelInfo
        })
    }

    protected _createModel(model: string): ChatHubBaseEmbeddings {
        const info = this._modelInfos[model]

        if (info == null) {
            throw new ChatLunaError(ChatLunaErrorCode.MODEL_NOT_FOUND)
        }

        return new ChatLunaEmbeddings({
            client: this._requester,
            model,
            maxRetries: this._config.maxRetries
        })
    }
}
```

## 测试 Embeddings

完成实现后，可以通过以下方式测试：

1. 在 Koishi 控制台中启用你的适配器

2. 配置 API Key 和 embeddings 模型

3. 使用 ChatLuna 的嵌入模型 API 进行测试：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import type {} from 'koishi-plugin-chatluna/services/chat'
import { Context } from 'koishi'

const ctx = {} as Context
// ---cut---
const embeddingsRef = await ctx.chatluna.createEmbeddings("yourplatform/embedding-model")
const embeddings = embeddingsRef.value

// 测试单个文本
const vector = await embeddings.embedQuery("hello world")
console.log(vector)  // 应该输出一个数字数组

// 测试多个文本
const vectors = await embeddings.embedDocuments(["hello", "world"])
console.log(vectors)  // 应该输出一个二维数组
```

## 其他资源

我们推荐你参考 `ChatLuna` 上已有的实现了 embeddings 的适配器：

- [Gemini](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/gemini-adapter/src)
- [OpenAI](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/openai-adapter/src)
