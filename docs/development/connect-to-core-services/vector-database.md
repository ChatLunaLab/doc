# 向量数据库

同样的，ChatLuna 也支持接入向量数据库。

## 注册插件

所有需要接入功能到 ChatLuna 的插件，都得新建 `ChatLunaPlugin` 实例，并注册到 `ChatLuna` 服务中。

```typescript
import { ChatLunaPlugin } from 'koishi-plugin-chatluna/services/chat'
import { Context, Schema } from 'koishi'

export function apply(ctx: Context, config: Config) {
    const plugin = new ChatLunaPlugin(ctx, config, 'your-plugin-name', false)

    ctx.on('ready', async () => {
        // 在 ready 事件中注册到 ChatLuna 服务
        plugin.registerToService()

        // 继续...
    })
}
```

> [!NOTE]
> 如果你的插件不需要注册模型适配器，`ChatLunaPlugin` 的构造函数需要传入 `false` 作为第四个参数。
> 该参数默认为 `true`，表示插件需要注册模型适配器。

## 配置 Schema

如果你的向量数据库需要连接 URL 等参数，则需要自行声明 Schema。

```typescript
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

## 注册向量数据库

注册向量数据库非常简单，只需调用 `ChatLunaPlugin` 实例的 `registerVectorStore` 方法即可。

以 Milvus 为例，代码如下：

```typescript
const MilvusClass = await importMilvus()

plugin.registerVectorStore('milvus', async (params) => {
    const embeddings = params.embeddings

    const vectorStore = new MilvusClass(embeddings, {
        collectionName: 'chatluna_collection',
        partitionName: params.key ?? 'chatluna',
        url: config.milvusUrl,
        username: config.milvusUsername,
        password: config.milvusPassword,
        textFieldMaxLength: 3000
    })

    const testVector = await embeddings.embedDocuments(['test'])

    try {
        await vectorStore.ensureCollection(testVector, [
            {
                pageContent: 'test',
                metadata: {}
            }
        ])

        await vectorStore.ensurePartition()

        await vectorStore.similaritySearchVectorWithScore(testVector[0], 10)
    } catch (e) {
        try {
            await vectorStore.client.releasePartitions({
                collection_name: 'chatluna_collection',
                partition_names: [params.key ?? 'chatluna']
            })

            await vectorStore.client.releaseCollection({
                collection_name: 'chatluna_collection'
            })

            await vectorStore.client.dropPartition({
                collection_name: 'chatluna_collection',
                partition_name: params.key ?? 'chatluna'
            })

            await vectorStore.client.dropCollection({
                collection_name: 'chatluna_collection'
            })

            await vectorStore.ensureCollection(testVector, [
                {
                    pageContent: 'test',
                    metadata: {}
                }
            ])

            await vectorStore.ensurePartition()
        } catch (e) {
            logger.error(e)
        }
        logger.error(e)
    }

    const wrapperStore = new ChatLunaSaveableVectorStore<Milvus>(
        vectorStore,
        {
            async deletableFunction(store, options) {
                if (options.deleteAll) {
                    await vectorStore.client.releasePartitions({
                        collection_name: 'chatluna_collection',
                        partition_names: [params.key ?? 'chatluna']
                    })

                    await vectorStore.client.releaseCollection({
                        collection_name: 'chatluna_collection'
                    })

                    await vectorStore.client.dropPartition({
                        collection_name: 'chatluna_collection',
                        partition_name: params.key ?? 'chatluna'
                    })

                    await vectorStore.client.dropCollection({
                        collection_name: 'chatluna_collection'
                    })

                    return
                }

                const ids: string[] = []
                if (options.ids) {
                    ids.push(...options.ids)
                }

                if (options.documents) {
                    const documentIds = options.documents
                        ?.map((document) => {
                            return document.metadata?.raw_id as
                                | string
                                | undefined
                        })
                        .filter((id): id is string => id != null)

                    ids.push(...documentIds)
                }

                if (ids.length < 1) {
                    return
                }

                await store.delete({
                    ids
                })
            },
            async addDocumentsFunction(store, documents, options) {
                let ids = options?.ids ?? []

                ids = documents.map((document, i) => {
                    const id = ids[i] ?? crypto.randomUUID()

                    document.metadata = {
                            ...document.metadata,
                        raw_id: id
                    }

                    return id
                })

                await store.addDocuments(documents, {
                    ids
                })
            }
        }
    )

    return wrapperStore
})
```

在实现时需要注意以下几点：

1. registerVectorStore 方法的第一个参数是向量数据库的名称，ChatLuna 会根据这个名称来调用对应的向量数据库。
2. `params` 参数中，`embeddings` 是 Embeddings 实例，`key` 是数据库实例的唯一标识，可以用于区分不同的数据库实例。
3. 返回值是一个 `ChatLunaSaveableVectorStore` 实例，ChatLuna 会根据这个实例来保存和读取数据。
4. 需要自行实现 `ChatLunaSaveableVectorStore` 的 `deletableFunction` 和 `addDocumentsFunction` 方法，用于支持向量数据库的保存和删除功能。

## 资源参考

请参考 ChatLuna 官方的向量数据库服务插件 [chatluna-vector-store](https://github.com/ChatLunaLab/chatluna/blob/v1-dev/packages/vector-store-service)。
