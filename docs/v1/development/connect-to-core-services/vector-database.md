# 向量数据库

同样的，ChatLuna 也支持接入向量数据库。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都得新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

// ---cut-start---
export interface Config extends ChatLunaPlugin.Config {}
// ---cut-end---

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        // 继续...
    })
}
```

> [!NOTE]
> 如果你的插件不需要注册模型适配器，`ChatLunaPlugin` 的构造函数需要传入 `false` 作为第四个参数。
> 该参数默认为 `true`，表示插件需要注册模型适配器。

## 配置 Schema

如果你的向量数据库需要连接 URL 等参数，则需要自行声明 Schema。

```typescript twoslash
// @noImplicitAny: false
// @strictNullChecks: false

import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export interface Config extends ChatLunaPlugin.Config {
    milvusUrl: string
    milvusUsername: string
    milvusPassword: string
}

export const Config: Schema<Config> = Schema.intersect([
    Schema.object({
        milvusUrl: Schema.string()
            .role('url')
            .default('http://127.0.0.1:19530'),
        milvusUsername: Schema.string().default(''),
        milvusPassword: Schema.string().role('secret').default('')
    })
]) as any
```

例如上面的 Schema 中，就声明了 Milvus 的连接 URL、用户名和密码。

## 实现 ChatLunaSaveableVectorStore 包装类

在注册向量数据库之前，你需要创建一个继承自 `ChatLunaSaveableVectorStore` 的包装类。

这个包装类负责包装 LangChain 的向量存储，并提供 ChatLuna 所需的特定功能。

### 创建包装类

以 Milvus 为例，创建一个包装类：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import {
    ChatLunaSaveableVectorDelete,
    ChatLunaSaveableVectorStore,
    ChatLunaSaveableVectorStoreInput
} from 'koishi-plugin-chatluna/llm-core/vectorstores'
import { Milvus } from '@langchain/community/vectorstores/milvus'
import crypto from 'crypto'
import { DocumentInterface } from '@langchain/core/documents'

export class MilvusVectorStore extends ChatLunaSaveableVectorStore<Milvus> {
    private _key: string
    private _createCollection: () => Promise<void>

    constructor(input: MilvusVectorStoreInput) {
        super(input)
        this._key = input.key
        this._createCollection = input.createCollection
    }

    addDocuments(
        documents: DocumentInterface[],
        options?: Parameters<Milvus['addDocuments']>[1]
    ): Promise<string[] | void> {
        let ids = options?.ids ?? []

        ids = documents.map((document, i) => {
            const id = ids[i] ?? document.id ?? crypto.randomUUID()

            document.id = id
            document.metadata = {
                source: 'unknown',
                ...document.metadata,
                raw_id: id
            }

            // Milvus 不支持 UUID 中的 '-' 字符，需要替换
            return id.replaceAll('-', '_')
        })

        return super.addDocuments(documents, {
            ...options,
            ids
        })
    }

    async delete(options: ChatLunaSaveableVectorDelete): Promise<void> {
        if (options.deleteAll) {
            // 删除整个集合和分区
            await this._store.client.releasePartitions({
                collection_name: 'chatluna_collection',
                partition_names: [this._key]
            })

            await this._store.client.releaseCollection({
                collection_name: 'chatluna_collection'
            })

            await this._store.client.dropPartition({
                collection_name: 'chatluna_collection',
                partition_name: this._key
            })

            await this._store.client.dropCollection({
                collection_name: 'chatluna_collection'
            })
            await super.delete(options)
            return
        }

        const ids: string[] = []

        if (options.ids) {
            ids.push(...options.ids.map((id) => id.replaceAll('-', '_')))
        }

        if (options.documents) {
            const documentIds = options.documents
                ?.map((document) => {
                    const id = document.metadata?.raw_id as string | undefined
                    return id != null ? id.replaceAll('-', '_') : undefined
                })
                .filter((id): id is string => id != null)

            ids.push(...documentIds)
        }

        if (ids.length > 0) {
            const deleteResp = await this._store.client.delete({
                collection_name: this._store.collectionName,
                partition_name: this._key,
                ids
            })

            if (deleteResp.status.error_code !== 'Success') {
                throw new Error(
                    `Error deleting data with ids: ${JSON.stringify(deleteResp)}`
                )
            }
        }

        await super.delete(options)
    }

    async similaritySearchVectorWithScore(
        query: number[],
        k: number,
        filter?: this['FilterType']
    ): Promise<[DocumentInterface, number][]> {
        // 检查集合是否存在，如果不存在则重新创建
        const hasColResp = await this._store.client.hasCollection({
            collection_name: this._store.collectionName
        })

        if (hasColResp.status.error_code !== 'Success') {
            throw new Error(`Error checking collection: ${hasColResp}`)
        }

        if (hasColResp.value === false) {
            console.warn(
                `Collection ${this._store.collectionName} does not exist, ensure all data and recreate collection.`
            )

            // 触发重新索引
            await this._createCollection()
        }

        return super.similaritySearchVectorWithScore(query, k, filter)
    }

    async save() {
        // Milvus 会自动保存数据，无需显式保存
    }
}

export interface MilvusVectorStoreInput
    extends ChatLunaSaveableVectorStoreInput<Milvus> {
    key: string
    createCollection: () => Promise<void>
}
```

<br>

包装类需要实现以下关键方法：

1. `addDocuments`: 添加文档时，为每个文档生成唯一 ID 并存储在 metadata 中
2. `delete`: 支持删除指定文档或清空整个数据库
3. `similaritySearchVectorWithScore`: 最核心的相似度搜索
4. `save`: 保存向量数据库的状态（某些数据库如 Milvus 会在添加时就自动保存）

> [!WARNING]
> 不同的向量数据库可能有不同的限制和要求。例如 Milvus 不支持 UUID 中的 `-` 字符，需要替换为 `_`。

## 注册向量数据库

实现包装类后，就可以注册向量数据库了。

使用 `ChatLunaPlugin` 实例的 `registerVectorStore` 方法注册：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema, Logger } from 'koishi'
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'

const ctx = new Context()
let logger: Logger
let plugin: ChatLunaPlugin
interface Config {
    milvusUrl: string
    milvusUsername: string
    milvusPassword: string
}
let config: Config

// ---cut---
import { Milvus } from '@langchain/community/vectorstores/milvus'
import { MilvusVectorStore } from './base/milvus'
import { DataBaseDocstore } from 'koishi-plugin-chatluna/llm-core/vectorstores'
import { Document } from '@langchain/core/documents'
import { randomUUID } from 'crypto'
import {
    ChatLunaError,
    ChatLunaErrorCode
} from 'koishi-plugin-chatluna/utils/error'

plugin.registerVectorStore('milvus', async (params) => {
    const embeddings = params.embeddings
    const key = sanitizeMilvusName(params.key ?? 'chatluna')

    const databaseDocstore = new DataBaseDocstore(ctx, key)

    logger.debug(`Loading milvus store with partition: %c`, key)

    const testVector = await embeddings.embedQuery('test')

    if (testVector.length === 0) {
        throw new ChatLunaError(
            ChatLunaErrorCode.VECTOR_STORE_EMBEDDING_DIMENSION_MISMATCH,
            new Error(
                'Embedding dimension is 0. Try changing the embeddings model.'
            )
        )
    }

    const vectorStore = new Milvus(embeddings, {
        collectionName: 'chatluna_collection',
        partitionName: key,
        url: config.milvusUrl,
        autoId: false,
        username: config.milvusUsername,
        password: config.milvusPassword,
        textFieldMaxLength: 3000
    })

    const createCollection = async () => {
        // 清理旧集合
        await vectorStore.client.releasePartitions({
            collection_name: 'chatluna_collection',
            partition_names: [key]
        })

        await vectorStore.client.releaseCollection({
            collection_name: 'chatluna_collection'
        })

        await vectorStore.client.dropPartition({
            collection_name: 'chatluna_collection',
            partition_name: key
        })

        await vectorStore.client.dropCollection({
            collection_name: 'chatluna_collection'
        })

        // 创建新集合时使用测试文档确定字段类型
        let documents: Document[] = [
            new Document({
                pageContent: 'A',
                id: randomUUID(),
                metadata: {
                    raw_id: 'z'.repeat(100),
                    source: 'z'.repeat(100),
                    expirationDate: 'z'.repeat(100),
                    createdAt: 'z'.repeat(100),
                    updateAt: 'z'.repeat(100),
                    time: 'z'.repeat(100),
                    user: 'z'.repeat(100),
                    userId: 'z'.repeat(100),
                    type: 'z'.repeat(100),
                    importance: 0
                }
            })
        ]

        await vectorStore.ensureCollection([testVector], documents)
        await vectorStore.ensurePartition()

        // 从 docstore 恢复所有文档
        documents = await databaseDocstore.list()

        await vectorStore.addDocuments(documents)
    }

    try {
        const sampleDoc = new Document({
            pageContent: 'test',
            metadata: {
                raw_id: 'z'.repeat(100),
                source: 'z'.repeat(100),
                expirationDate: 'z'.repeat(100),
                createdAt: 'z'.repeat(100),
                updateAt: 'z'.repeat(100),
                time: 'z'.repeat(100),
                user: 'z'.repeat(100),
                userId: 'z'.repeat(100),
                type: 'z'.repeat(100),
                importance: 0
            }
        })

        await vectorStore.ensureCollection([testVector], [sampleDoc])
        await vectorStore.ensurePartition()
        await vectorStore.similaritySearchVectorWithScore(testVector, 1)
    } catch (e) {
        logger.warn(
            'Error occurred when initializing milvus collection. Will recreate collection.'
        )
        logger.debug(e)

        try {
            await createCollection()
        } catch (e) {
            logger.error(e)
            throw new ChatLunaError(
                ChatLunaErrorCode.VECTOR_STORE_INIT_ERROR,
                new Error('Failed to initialize Milvus collection')
            )
        }
    }

    const wrapperStore = new MilvusVectorStore({
        store: vectorStore,
        docstore: databaseDocstore,
        key,
        createCollection,
        embeddings
    })

    return wrapperStore
})

function sanitizeMilvusName(name: string) {
    let s = name.replace(/[^A-Za-z0-9_]/g, '_')
    if (!/^[A-Za-z]/.test(s)) s = `p_${s}`
    return s.slice(0, 255)
}
```

<br>

注册向量数据库时，需要完成以下步骤：

1. 获取嵌入模型和唯一标识: 从 `params` 中获取 `embeddings` 和 `key`
2. 创建 `DataBaseDocstore`: 用于持久化存储文档内容
3. 初始化向量存储: 创建 LangChain 的向量存储实例
4. 定义重建索引函数: `createCollection` 函数负责在集合损坏或嵌入维度变化时重建索引
5. 初始化检查: 测试向量存储是否正常工作
6. 创建包装实例: 使用自定义的包装类包装向量存储

> [!TIP] 提示
> `DataBaseDocstore` 会持久化存储所有文档的内容。当向量数据库集合损坏或嵌入模型维度发生变化时，可以从 `DataBaseDocstore` 恢复所有文档并重新索引。

### 重新索引

你需要在实现的代码内手动检查以下的情况：

- 嵌入模型的维度发生变化
- 向量数据库的配置发生变化

当检测到这些情况时，你需要手动调用之前实现的重建索引函数。

注意，重建索引时，你需要从 `DataBaseDocstore` 中读取所有已保存的文档，使用新的嵌入模型重新生成向量并存储。

## 资源参考

请参考 ChatLuna 官方的向量数据库服务插件 [chatluna-vector-store](https://github.com/ChatLunaLab/chatluna/blob/v1-dev/packages/vector-store-service)，获取更多实现样例。
