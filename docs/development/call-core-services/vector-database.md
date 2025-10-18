# 向量数据库

ChatLuna 提供了向量数据库的集成能力，用于高效存储和检索向量化的文本数据。

向量数据库是 LLM 应用的核心基础设施之一，它通过存储文本的向量表示，实现了基于语义的相似度搜索，为 LLM 提供外部知识库和记忆能力。

> [!TIP] 提示
> 创建向量数据库时还需要指定嵌入模型，请参考 [嵌入模型](/development/call-core-services/embedding-model)。

## 基于内存的向量数据库

如果只需要临时性的向量检索，可以创建内存中的向量数据库。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";
import { MemoryVectorStore } from 'koishi-plugin-chatluna/llm-core/vectorstores'

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

const store = await MemoryVectorStore.fromExistingIndex(embeddingsRef.value)
//    ^?
```

## 其他向量数据库

如果需要持久化的向量存储，则需要从 `PlatformService` 中创建支持持久化的向量数据库。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const embeddingsRef = await ctx.chatluna.createEmbeddings("openai/text-embedding-3-small")

const store = await ctx.chatluna.platform.createVectorStore(
    'faiss',
    {
        embeddings: embeddingsRef.value,
        key: "my-vector-store-key"
    }
)
```

`PlatformService` 的 `createVectorStore` 方法传递两个参数，第一个参数是向量数据库的类型，第二个参数是向量数据库的配置。

其中配置对象的属性如下：

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
// @noErrors
import { Context, Schema } from 'koishi'
const ctx = new Context()
import type {} from "koishi-plugin-chatluna/services/chat";
import { ChatLunaBaseEmbeddings } from 'koishi-plugin-chatluna/llm-core/platform/model'

// ---cut---
interface CreateVectorStoreParams {
    // 向量数据库的唯一标识
    key?: string
    // 嵌入模型
    embeddings: ChatLunaBaseEmbeddings
}
```

在使用持久化存储时，强烈建议设置 `key` 属性作为向量数据库的唯一标识符，这样可以在后续操作中准确检索到对应的向量数据库实例。

> [!TIP] 提示
> 需要注意，每种向量数据库类型都有其特定的数据存储位置和方式。
> 为了确保数据获取的一致性，建议在项目中统一使用同一种向量数据库类型。

## 获取可用的向量数据库

`PlatformService` 提供了 `getVectorStoreRetrievers` 方法来获取当前平台下所有可用的向量数据库。

> [!TIP] 提示
> `getVectorStoreRetrievers` 方法即将被弃用，请使用 `getVectorStores` 方法来替代。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const vectorStoresRef = ctx.chatluna.platform.vectorStores
const vectorStores = vectorStoresRef.value
//    ^?
```

## 从用户配置中创建

ChatLuna 的主插件中允许用户设置 [`defaultVectorStore`](../../guide/useful-configurations.md#defaultvectorstore) 配置项，用于指定默认的向量数据库。

开发者也可以直接使用这个配置项指定的向量数据库类型来创建向量数据库。

```ts twoslash
// @noImplicitAny: false
// @strictNullChecks: false
import { Context, Schema } from 'koishi'
import { computed } from "koishi-plugin-chatluna";

const ctx = new Context()

// ---cut---
import type {} from "koishi-plugin-chatluna/services/chat";

const embeddingsRef = await ctx.chatluna.createEmbeddings(ctx.chatluna.config.defaultEmbeddings)

const vectorStorePromise = computed(() => ctx.chatluna.platform.createVectorStore(
    ctx.chatluna.config.defaultVectorStore,
    {
        embeddings: embeddingsRef.value,
        key: "my-vector-store-key"
    }
))

// 在使用向量数据库，请总是 await
const vectorStore = await vectorStorePromise.value
//     ^?
```
