# Reranker 模型

本页说明如何为 ChatLuna 接入新的 reranker 平台。

## 客户端类型

按平台能力选择客户端基类：

- `PlatformRerankerClient`: 只提供 reranker。
- `PlatformModelEmbeddingsAndRerankerClient`: 同时提供大语言模型、嵌入模型和 reranker。

```ts
import { PlatformRerankerClient } from 'koishi-plugin-chatluna/llm-core/platform/client'
import { ChatLunaReranker } from 'koishi-plugin-chatluna/llm-core/platform/rerank'
import { ModelType, type ModelInfo } from 'koishi-plugin-chatluna/llm-core/platform/types'
import { ChatLunaError, ChatLunaErrorCode } from 'koishi-plugin-chatluna/utils/error'

export class YourRerankerClient extends PlatformRerankerClient<ClientConfig> {
  platform = 'yourplatform'

  constructor(
    ctx: Context,
    private config: Config,
    private requester: YourRequester,
    plugin: ChatLunaPlugin,
  ) {
    super(ctx, plugin.platformConfigPool)
  }

  async refreshModels(): Promise<ModelInfo[]> {
    return [
      {
        name: 'rerank-large',
        type: ModelType.reranker,
        capabilities: [],
        maxTokens: 8192,
      },
    ]
  }

  protected _createModel(model: string): ChatLunaReranker {
    const info = this._modelInfos[model]
    if (!info) throw new ChatLunaError(ChatLunaErrorCode.MODEL_NOT_FOUND)

    return new ChatLunaReranker({
      client: this.requester,
      model,
      maxRetries: this.config.maxRetries,
      timeout: this.config.timeout,
    })
  }
}
```

## 实现 RerankerRequester

Requester 需要实现 `rerank()`。

```ts
import {
  ModelRequester,
  type RerankerRequester,
  type RerankerRequestParams,
  type RerankerResult,
} from 'koishi-plugin-chatluna/llm-core/platform/api'

export class YourRequester extends ModelRequester implements RerankerRequester {
  async rerank(params: RerankerRequestParams): Promise<RerankerResult[]> {
    const response = await this.post('rerank', {
      model: params.model,
      query: params.query,
      documents: params.documents,
      top_n: params.topN,
      max_chunks_per_doc: params.maxChunksPerDoc,
    }, {
      signal: params.signal,
    })

    const data = await response.json() as {
      results: { index: number; relevance_score: number }[]
    }

    return data.results.map((item) => ({
      index: item.index,
      relevanceScore: item.relevance_score,
    }))
  }
}
```

## 注册客户端

```ts
const plugin = new ChatLunaPlugin(ctx, config, 'yourplatform')

plugin.parseConfig((config) => config.apiKeys.map(([apiKey]) => ({
  apiKey,
  apiEndpoint: config.apiEndpoint,
})))

plugin.registerClient(() => {
  const requester = new YourRequester(ctx, plugin.platformConfigPool, config, plugin)
  return new YourRerankerClient(ctx, config, requester, plugin)
})

ctx.on('ready', () => plugin.initClient())
```

## 测试

```ts
const rerankerRef = await ctx.chatluna.createReranker('yourplatform/rerank-large')
const reranker = rerankerRef.value

const results = await reranker?.rerank(['a', 'b'], 'query')
```

## 相关 API

- [Reranker API](../api-reference/llm-core/reranker.md)
- [Platform Client](../api-reference/llm-core/platform-client.md)
