# 错误

ChatLuna 使用 `ChatLunaError` 携带统一错误码。建议适配器和扩展插件在可预期错误中抛出该类型。

## ChatLunaError

```ts
export class ChatLunaError extends Error {
  constructor(
    public errorCode: ChatLunaErrorCode = ChatLunaErrorCode.UNKNOWN_ERROR,
    public originError?: Error,
    public isTimeout: boolean = false,
  )
}
```

示例：

```ts
throw new ChatLunaError(
  ChatLunaErrorCode.API_REQUEST_FAILED,
  new Error('request failed'),
)
```

### setErrorFormatTemplate()

- **template**: `string | null`
- 返回值: `void`

设置错误消息模板。模板中 `%s` 会被替换为错误码。

## enum ChatLunaErrorCode

### 基础错误

- `NETWORK_ERROR = 1`
- `UNSUPPORTED_PROXY_PROTOCOL = 2`
- `QUEUE_OVERFLOW = 3`
- `RENDER_ERROR = 4`
- `ABORTED = 5`
- `PLUGIN_ALREADY_REGISTERED = 6`

### API 相关错误

- `API_KEY_UNAVAILABLE = 100`
- `API_REQUEST_RESOLVE_CAPTCHA = 101`
- `API_REQUEST_TIMEOUT = 102`
- `API_REQUEST_FAILED = 103`
- `API_UNSAFE_CONTENT = 104`

### 模型相关错误

- `MODEL_ADAPTER_NOT_FOUND = 300`
- `MODEL_NOT_FOUND = 301`
- `PRESET_NOT_FOUND = 302`
- `MODEL_INIT_ERROR = 303`
- `EMBEDDINGS_INIT_ERROR = 304`
- `VECTOR_STORE_INIT_ERROR = 305`
- `CHAT_HISTORY_INIT_ERROR = 306`
- `NOT_AVAILABLE_CONFIG = 307`
- `MODEL_CONVERSION_INIT_ERROR = 308`
- `MODEL_RESPONSE_IS_EMPTY = 309`
- `MODEL_DEPOSE_ERROR = 310`
- `PRESET_LOAD_ERROR = 311`
- `LONG_MEMORY_INIT_ERROR = 312`
- `VECTOR_STORE_NOT_ACTIVE = 313`
- `VECTOR_STORE_EMBEDDING_ERROR = 314`
- `VECTOR_STORE_EMBEDDING_DIMENSION_MISMATCH = 315`
- `RERANKER_INIT_ERROR = 316`

### 旧房间迁移相关错误

- `MEMBER_NOT_IN_ROOM = 400`
- `ROOM_NOT_JOINED = 401`
- `ROOM_NOT_FOUND_MASTER = 402`
- `ROOM_TEMPLATE_INVALID = 403`
- `THE_NAME_FIND_IN_MULTIPLE_ROOMS = 404`
- `ROOM_NOT_FOUND = 405`
- `INIT_ROOM = 406`

### 知识库相关错误

- `KNOWLEDGE_CONFIG_INVALID = 500`
- `KNOWLEDGE_DOC_NOT_FOUND = 501`
- `KNOWLEDGE_LOOP_INCLUDE = 502`
- `KNOWLEDGE_UNSUPPORTED_FILE_TYPE = 503`
- `KNOWLEDGE_EXIST_FILE = 504`
- `KNOWLEDGE_VECTOR_NOT_FOUND = 505`

### 其他错误

- `UNKNOWN_ERROR = 999`
