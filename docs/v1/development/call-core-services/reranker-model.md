# Reranker 模型

Reranker 用于对一组候选文档按查询相关性重新排序。

一般常用于 RAG：先用向量数据库召回较多候选，再用 reranker 选出最相关的片段。

## 基本用法

使用 `ctx.chatluna.createReranker()` 创建 reranker 响应式引用。

```ts
import type {} from "koishi-plugin-chatluna/services/chat";

const rerankerRef = await ctx.chatluna.createReranker("cohere/rerank-v3.5");
const reranker = rerankerRef.value;

if (!reranker) {
  throw new Error("reranker not available");
}

const results = await reranker.rerank(
  [
    "ChatLuna 是 Koishi 下的大语言模型聊天插件。",
    "Koishi 是一个跨平台聊天机器人框架。",
  ],
  "ChatLuna 是什么？",
  { topN: 2 },
);

console.log(results);
// [{ index: 0, relevanceScore: 0.98 }, ...]
```

也可以分开传平台名和模型名：

```ts
const rerankerRef = await ctx.chatluna.createReranker("cohere", "rerank-v3.5");
```

## 获取可用模型

```ts
import { ModelType } from "koishi-plugin-chatluna/llm-core/platform/types";

const modelsRef = ctx.chatluna.platform.listAllModels(ModelType.reranker);
const models = modelsRef.value;
```

## 作为 LangChain Compressor 使用

`ChatLunaReranker` 继承自 LangChain 的 `BaseDocumentCompressor`，可以直接接入需要 compressor 的检索链。

```ts
const rerankedDocs = await reranker.compressDocuments(documents, "用户问题");
```

`compressDocuments()` 会保留原始 document，并在 `metadata.relevanceScore` 写入相关性分数。

## 参数

`rerank(documents, query, options)` 支持：

- `model?: string`：覆盖本次调用使用的模型名。
- `topN?: number`：最多返回多少条结果。
- `maxChunksPerDoc?: number`：平台支持时限制单文档最大切块数。

## 相关 API

- [Reranker API](../api-reference/llm-core/reranker.md)
- [接入 Reranker 模型](../connect-to-core-services/reranker-model.md)
