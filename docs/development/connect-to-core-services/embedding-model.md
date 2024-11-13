# 嵌入模型

ChatLuna 也提供 API，来接入其他的嵌入模型。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都需要新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name')

    ctx.on('ready', async () => {
        // 在 ready 事件中注册到 ChatLuna 服务
        plugin.registerToService()

        // 继续...
    })
}

```

## 配置 Schema

每个模型适配器都应该有自己的 Schema，可以配置模型名称、API Key 等参数。

并继承 `ChatLunaPlugin.Config` 接口。

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export interface Config extends ChatLunaPlugin.Config {
    apiKeys: [string, string][]
    maxTokens: number
    temperature: number
}

export const Config: Schema<Config> = Schema.intersect([
    ChatLunaPlugin.Config,
    Schema.object({
        apiKeys: Schema.array(
            Schema.tuple([
                Schema.string().role('secret'),
                Schema.string().default(
                    'https://generativelanguage.googleapis.com/v1beta'
                )
            ])
        ).default([['', 'https://generativelanguage.googleapis.com/v1beta']])
    }),
    Schema.object({
        maxTokens: Schema.number().min(16).max(2097000).step(16).default(8064),
        temperature: Schema.percent().min(0).max(2).step(0.1).default(0.8)
    })
]) as any
```

上面的 Schema 中，`apiKeys` 是 API Key 的配置，用于不同 API 的配置。

ChatLuna 自带负载均衡配置的支持，因此需要支持多个 API Key 的配置。

`maxTokens` 和 `temperature` 是模型适配器的参数，用于配置模型的具体请求参数。

### 解析 ClientConfig

在 ChatLuna 中，对于模型适配器，都需要一套 `ClientConfig`，也就是平台配置，其的接口定义如下：

```ts
export interface ClientConfig {
    apiKey: string;
    platform: PlatformClientNames;
    maxRetries: number;
    concurrentMaxSize: number;
    apiEndpoint?: string;
    timeout: number;
    chatLimit: Computed<Awaitable<number>>;
}
```

导入 `ClientConfig` 类型，并新建一个 `ChatLunaPlugin` 实例。其中两个泛型，第一个为当前插件的 Schema 配置接口，第二个为 `ClientConfig` 或其他的子类型。

传入构建参数的三个值，第一个为当前插件的 `Context`，第二个为当前插件的 Schema 配置实例，在后面可用于解析 `ClientConfig`。第三个为当前的平台名，这也是识别不同平台的关键参数。

`ClientConfig` 默认已经提供了 apiKey 等字段，我们无需继承该接口，直接使用即可。

```typescript
import { ChatLunaPlugin, ClientConfig } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'


export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name')
    
    // 如果不扩展自己的 ClientConfig，则可以省略泛型
    // const plugin = new ChatLunaPlugin<Config, ClientConfig>(ctx, config, 'your-plugin-name')

    ctx.on('ready', async () => {
        // 在 ready 事件中注册到 ChatLuna 服务
        plugin.registerToService()

        // 继续...
    })
}
```

我们需要将 `Config` 里的请求参数，解析到 `ClientConfig` 中。

```typescript
ctx.on('ready', async () => {
    // 在 ready 事件中注册到 ChatLuna 服务
    plugin.registerToService()

    // 解析 ClientConfig
    await plugin.parseConfig((config) => 
        config.apiKeys.map((apiKey) => {
            return { 
                apiKey, 
                // 平台名是唯一标识，不能重复
                platform: 'test', 
                chatLimit: config.chatTimeLimit, 
                timeout: config.timeout, 
                maxRetries: config.maxRetries, 
                concurrentMaxSize: config.chatConcurrentMaxSize, 
            } 
        }) 
    ) 
})
```

注意：`platform` 是唯一标识，不能重复。下面需要使用 `platform` 参数的地方，都应该是这个唯一标识。

## 实现 PlatformClient

在 ChatLuna 的模型适配器中， `Client` 即指 `BasePlatformClient` 及其子类。

ChatLuna 根据模型的不同用途，提供了几种 `Client`:

- `PlatformModelClient`: 用于和语言模型进行交互的 `Client`,可创建 `ChatLunaChatModel`，用于语言模型交互。
- `PlatformEmbeddingsClient`: 用于和嵌入模型进行交互的 `Client`,可创建 `ChatHubBaseEmbeddings`，用于嵌入模型交互。
- `PlatformModelAndEmbeddingsClient`: 前面两者的组合，可创建 `ChatHubBaseEmbeddings` 和 `ChatLunaChatModel`。

如需接入嵌入模型，则需要继承 `PlatformEmbeddingsClient`。

但在大部分平台下，同时支持大语言模型和嵌入模型，因此推荐继承 `PlatformModelAndEmbeddingsClient`。

以 `GeminiClient` 为例：

```typescript
import { Context } from "koishi";
import { PlatformModelClient } from "koishi-plugin-chatluna/llm-core/platform/client";
import { ClientConfig } from "koishi-plugin-chatluna/llm-core/platform/config";
import {
    ChatHubBaseEmbeddings,
    ChatLunaChatModel,
    ChatLunaEmbeddings
} from 'koishi-plugin-chatluna/llm-core/platform/model'
import { ModelInfo } from "koishi-plugin-chatluna/llm-core/platform/types";
import { Config } from ".";

export class GeminiClient extends PlatformModelAndEmbeddingsClient {
    platform = 'gemini'

    private _requester: GeminiRequester

    private _models: Record<string, ModelInfo>

    constructor(
        ctx: Context,
        private _config: Config,
        clientConfig: ClientConfig,
        plugin: ChatLunaPlugin
    ) {
        super(ctx, clientConfig)

        this._requester = new GeminiRequester(clientConfig, plugin)
    }

    async init(): Promise<void> {
        await this.getModels()
    }

    async refreshModels(): Promise<ModelInfo[]> {
        try {
            const rawModels = await this._requester.getModels()

            if (!rawModels.length) {
                throw new ChatLunaError(
                    ChatLunaErrorCode.MODEL_INIT_ERROR,
                    new Error('No model found')
                )
            }

            return rawModels
                .map((model) => model.replace('models/', ''))
                .map((model) => {
                    return {
                        name: model,
                        maxTokens: ((model) => {
                            if (model.includes('gemini-1.5-pro')) {
                                return 1048576
                            }
                            if (model.includes('gemini-1.5-flash')) {
                                return 2097152
                            }
                            if (model.includes('gemini-1.0-pro')) {
                                return 30720
                            }
                            return 30720
                        })(model),
                        type: model.includes('embedding')
                            ? ModelType.embeddings
                            : ModelType.llm,
                        functionCall: !model.includes('vision'),
                        supportMode: ['all']
                    }
                })
        } catch (e) {
            throw new ChatLunaError(ChatLunaErrorCode.MODEL_INIT_ERROR, e)
        }
    }

    async getModels(): Promise<ModelInfo[]> {
        if (this._models) {
            return Object.values(this._models)
        }

        const models = await this.refreshModels()

        this._models = {}

        for (const model of models) {
            this._models[model.name] = model
        }
    }

    protected _createModel(
        model: string
    ): ChatLunaChatModel | ChatHubBaseEmbeddings {
        const info = this._models[model]

        if (info == null) {
            throw new ChatLunaError(ChatLunaErrorCode.MODEL_NOT_FOUND)
        }

        if (info.type === ModelType.llm) {
            return new ChatLunaChatModel({
                modelInfo: info,
                requester: this._requester,
                model,
                modelMaxContextSize: info.maxTokens,
                maxTokenLimit: this._config.maxTokens,
                timeout: this._config.timeout,
                temperature: this._config.temperature,
                maxRetries: this._config.maxRetries,
                llmType: 'gemini'
            })
        }

        return new ChatLunaEmbeddings({
            client: this._requester,
            model,
            maxRetries: this._config.maxRetries
        })
    }
}

```

可以看到，`Client` 需要实现 `init` , `getModels` , `refreshModels` 和 `_createModel` 方法。

- `init` 方法用于 `PlatformModelClient` 的初始化，通常直接调用 `getModels` 方法获取模型信息。
- `getModels` 方法用于获取模型信息，如果有缓存，则直接返回缓存，否则调用 `refreshModels` 方法获取模型信息。
- `refreshModels` 方法用于刷新模型信息，通常调用模型提供商的 API 获取模型信息。
- `_createModel` 方法用于创建 `ChatLunaChatModel` 或 `ChatLunaEmbeddings` 实例。

注意 `_createModel`中， `ChatLunaChatModel` 和 `ChatLunaEmbeddings` 都需要一个 `requester` 参数。这个 `requester` 就是真正实现模型请求的类。

## 实现 Requester

`Requester` 用于实现模型请求，通常需要继承 `ModelRequester` 类。

如果需要实现嵌入模型请求，则需要实现 `EmbeddingsRequester` 接口。

让我们继续以 `GeminiRequester` 为例：

```typescript

export class GeminiRequester
    extends ModelRequester implements EmbeddingsRequester
{
    constructor(
        private _config: ClientConfig,
        private _plugin: ChatLunaPlugin
    ) {
        super()
    }

    async *completionStream(
        params: ModelRequestParams
    ): AsyncGenerator<ChatGenerationChunk> {
        ...
    }


    async getModels(): Promise<string[]> {
       ...
    }

    async embeddings(
        params: EmbeddingsRequestParams
    ): Promise<number[] | number[][]> {
       ...
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _post(url: string, data: any, params: fetchType.RequestInit = {}) {
        const requestUrl = this._concatUrl(url)

        for (const key in data) {
            if (data[key] === undefined) {
                delete data[key]
            }
        }

        const body = JSON.stringify(data)

        return this._plugin.fetch(requestUrl, {
            body,
            headers: this._buildHeaders(),
            method: 'POST',
            ...params
        })
    }

    private _get(url: string) {
        const requestUrl = this._concatUrl(url)

        return this._plugin.fetch(requestUrl, {
            method: 'GET',
            headers: this._buildHeaders()
        })
    }

    private _concatUrl(url: string) {
        const apiEndPoint = this._config.apiEndpoint

        // match the apiEndPoint ends with '/v1' or '/v1/' using regex

        if (apiEndPoint.endsWith('/')) {
            return apiEndPoint + url + `?key=${this._config.apiKey}`
        }

        return apiEndPoint + '/' + url + `?key=${this._config.apiKey}`
    }

    private _buildHeaders() {
        return {
            /*  Authorization: `Bearer ${this._config.apiKey}`, */
            'Content-Type': 'application/json'
        }
    }

    async init(): Promise<void> {}

    async dispose(): Promise<void> {}
}

```

> [!NOTE]
> 当需要网络请求时，请使用 `plugin.fetch` 或 `plugin.ws` 方法。
> 这可以让用户自行配置代理

对于嵌入模型，通常只需要实现 `embeddings` 方法。

- `getModels` 需要实现获取模型信息的方法，返回的是可用的模型列表数组。
- `embeddings` 方法用于实现嵌入模型请求。

下面是一个完全的 `embeddings` 实现（以 Gemini 为例）：

```typescript
async embeddings(
    params: EmbeddingsRequestParams
): Promise<number[] | number[][]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: CreateEmbeddingResponse | string

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
                            parts: [
                                {
                                    text: input
                                }
                            ]
                        }
                    }
                })
            }
        )

        data = await response.text()

        data = JSON.parse(data) as CreateEmbeddingResponse

        if (data.embeddings && data.embeddings.length > 0) {
            return data.embeddings.map((embedding) => {
                return embedding.values
            })
        }

        throw new Error(
            'error when calling gemini embeddings, Result: ' +
            JSON.stringify(data)
        )
    } catch (e) {
        const error = new Error(
            'error when calling gemini embeddings, Result: ' +
                JSON.stringify(data)
        )

        error.stack = e.stack
        error.cause = e.cause
        logger.debug(e)

        throw new ChatLunaError(ChatLunaErrorCode.API_REQUEST_FAILED, error)
    }
}
```

一般的 `embeddings` 实现，需要经过几个步骤：

1. 构建请求
2. 调用模型提供商的 API 获取响应。
3. 将响应转换为 `number[] | number[][]` 格式。

   如果 input 只为单个字符串，返回 `number[]` 向量。
   如果 input 为多个字符串，返回 `number[][]` 矩阵。

## 实例化 Client

最后，我们需要将创建 `Client` 的函数，注册到 `ChatLuna` 服务中：

```typescript
ctx.on('ready', async () => {
    // 在 ready 事件中注册到 ChatLuna 服务
    plugin.registerToService()

    // 解析 ClientConfig
    await plugin.parseConfig((config) => 
        config.apiKeys.map((apiKey) => {
            return { 
                apiKey, 
                // 平台名是唯一标识，不能重复
                platform: 'test', 
                chatLimit: config.chatTimeLimit, 
                timeout: config.timeout, 
                maxRetries: config.maxRetries, 
                concurrentMaxSize: config.chatConcurrentMaxSize, 
            } 
        }) 
    ) 

      plugin.registerClient(
            (_, clientConfig) =>
                // 在此处创建 Client 实例
                new TestClient(ctx, config, clientConfig, plugin)
        )

    // 初始化所有 Client
    await plugin.initClients()
})
```

## 其他资源

我们推荐你阅读 `ChatLuna` 上已有的模型适配器，了解更具体的实现。

- [OpenAI](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/openai-adapter/src)
- [Gemini](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/gemini-adapter/src)
- [Ollama](https://github.com/ChatLunaLab/chatluna/tree/v1-dev/packages/ollama-adapter/src)
