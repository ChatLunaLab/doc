# Schema 工具

Schema 工具位于 `koishi-plugin-chatluna/utils/schema`，用于把 ChatLuna 当前可用资源同步到 Koishi Schema 下拉选项。

## modelSchema()

- **ctx**: `Context`
- **createNotification**: `boolean`，默认 `false`
- 返回值: `void`

监听语言模型变化并设置 `model` schema。

## embeddingsSchema()

- **ctx**: `Context`
- 返回值: `void`

监听嵌入模型变化并设置 `embeddings` schema。

## rerankerSchema()

- **ctx**: `Context`
- 返回值: `void`

监听 reranker 模型变化并设置 `reranker` schema。

## chatChainSchema()

- **ctx**: `Context`
- 返回值: `void`

监听聊天链变化并设置 `chat-mode` schema。

## vectorStoreSchema()

- **ctx**: `Context`
- 返回值: `void`

监听向量数据库变化并设置 `vector-store` schema。

## listModelNames()

- **service**: `PlatformService`
- **type**: `ModelType`，默认 `ModelType.llm`
- **includeNone**: `boolean`，默认 `false`
- 返回值: `ComputedRef<string[]>`

返回形如 `platform/model` 的模型名称列表。

```ts
import { listModelNames } from 'koishi-plugin-chatluna/utils/schema'
import { ModelType } from 'koishi-plugin-chatluna/llm-core/platform/types'

const rerankers = listModelNames(ctx.chatluna.platform, ModelType.reranker)
```
