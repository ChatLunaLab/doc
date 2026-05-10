# Reranker

Reranker API 位于 `koishi-plugin-chatluna/llm-core/platform/rerank` 和 `koishi-plugin-chatluna/llm-core/platform/api`。

## 接口：ChatLunaRerankerParams

```ts
export interface ChatLunaRerankerParams extends AsyncCallerParams {
  timeout?: number
  maxRetries?: number
  client: RerankerRequester
  model?: string
  topN?: number
  maxChunksPerDoc?: number
}
```

## 类：ChatLunaReranker

`ChatLunaReranker` 继承自 LangChain `BaseDocumentCompressor`。

### new ChatLunaReranker()

- **fields**: `ChatLunaRerankerParams`

### reranker.rerank()

- **documents**: `(DocumentInterface | string | Record<string, string>)[]`
- **query**: `string`
- **options**: `{ model?: string; topN?: number; maxChunksPerDoc?: number }`
- 返回值: `Promise<{ index: number; relevanceScore: number }[]>`

按相关性返回文档下标和分数。

### reranker.compressDocuments()

- **documents**: `DocumentInterface[]`
- **query**: `string`
- 返回值: `Promise<DocumentInterface[]>`

返回重排后的文档，并在 `metadata.relevanceScore` 写入相关性分数。

## 接口：RerankerRequester

```ts
export interface RerankerRequester {
  rerank(params: RerankerRequestParams): Promise<RerankerResult[]>
}
```

## 接口：RerankerRequestParams

```ts
export interface RerankerRequestParams extends BaseRequestParams {
  query: string
  documents: string[]
  topN?: number
  maxChunksPerDoc?: number
}
```

## 接口：RerankerResult

```ts
export interface RerankerResult {
  index: number
  relevanceScore: number
}
```

## 相关 API

- `ChatLunaService.createReranker()`
- `ModelType.reranker`
- `PlatformRerankerClient`
- `PlatformModelEmbeddingsAndRerankerClient`
