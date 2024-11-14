# 错误

ChatLuna 内置了 `ChatLunaError` 类，继承自 `Error`，并添加了 `code` 属性。

建议在插件中使用 `ChatLunaError` 类抛出错误。

## 构建错误

```typescript
import { ChatLunaError, ChatLunaErrorCode } from 'koishi-plugin-chatluna/utils/error'

const error = new ChatLunaError(ChatLunaErrorCode.NETWORK_ERROR, new Error('Original error'))
```

## API

### new ChatLunaError(code, originalError)

- *code*: `number` 错误码，一般使用 `ChatLunaErrorCode` 枚举值。
- *originalError*: `Error` 原始错误，一个 `Error` 实例。

### enum ChatLunaErrorCode

枚举类，可用的错误码如下：

#### 基础错误 (1-99)

- `NETWORK_ERROR`: 网络错误 (1)
- `UNSUPPORTED_PROXY_PROTOCOL`: 不支持的代理协议 (2)
- `QUEUE_OVERFLOW`: 队列溢出 (3)
- `RENDER_ERROR`: 渲染错误 (4)
- `ABORTED`: 已中止 (5)
- `PLUGIN_ALREADY_REGISTERED`: 插件已注册 (6)
- `PLUGIN_NOT_FOUND`: 插件未找到 (7)

#### API 相关错误 (100-199)

- `API_KEY_UNAVAILABLE`: API 密钥不可用 (100)
- `API_REQUEST_RESOLVE_CAPTCHA`: API 请求需要解决验证码 (101)
- `API_REQUEST_TIMEOUT`: API 请求超时 (102)
- `API_REQUEST_FAILED`: API 请求失败 (103)
- `API_UNSAFE_CONTENT`: API 不安全内容 (104)

#### 模型相关错误 (300-399)

- `MODEL_ADAPTER_NOT_FOUND`: 模型适配器未找到 (300)
- `MODEL_NOT_FOUND`: 模型未找到 (301)
- `PREST_NOT_FOUND`: 预设未找到 (302)
- `MODEL_INIT_ERROR`: 模型初始化错误 (303)
- `EMBEDDINGS_INIT_ERROR`: 嵌入初始化错误 (304)
- `VECTOR_STORE_INIT_ERROR`: 向量存储初始化错误 (305)
- `CHAT_HISTORY_INIT_ERROR`: 聊天历史初始化错误 (306)
- `NOT_AVAILABLE_CONFIG`: 配置不可用 (307)
- `MODEL_CONVERSION_INIT_ERROR`: 模型转换初始化错误 (308)
- `MODEL_RESPONSE_IS_EMPTY`: 模型响应为空 (309)
- `MODEL_DEPOSE_ERROR`: 模型释放错误 (310)
- `PRESET_LOAD_ERROR`: 预设加载错误 (311)
- `LONG_MEMORY_INIT_ERROR`: 长期记忆初始化错误 (312)

#### 房间相关错误 (400-499)

- `MEMBER_NOT_IN_ROOM`: 成员不在房间中 (400)
- `ROOM_NOT_JOINED`: 未加入房间 (401)
- `ROOM_NOT_FOUND_MASTER`: 未找到房主 (402)
- `ROOM_TEMPLATE_INVALID`: 房间模板无效 (403)
- `THE_NAME_FIND_IN_MULTIPLE_ROOMS`: 在多个房间中找到相同名称 (404)
- `ROOM_NOT_FOUND`: 房间未找到 (405)
- `INIT_ROOM`: 初始化房间 (406)

#### 知识库相关错误 (500-599)

- `KNOWLEDGE_CONFIG_INVALID`: 知识库配置无效 (500)
- `KNOWLEDGE_DOC_NOT_FOUND`: 知识库文档未找到 (501)
- `KNOWLEDGE_LOOP_INCLUDE`: 知识库循环包含 (502)
- `KNOWLEDGE_UNSUPPORTED_FILE_TYPE`: 知识库不支持的文件类型 (503)
- `KNOWLEDGE_EXIST_FILE`: 知识库文件已存在 (504)
- `KNOWLEDGE_VECTOR_NOT_FOUND`: 知识库向量未找到 (505)

#### 用户相关错误 (600-699)

- `USER_NOT_FOUND`: 用户未找到 (600)
- `AUTH_GROUP_NOT_FOUND`: 权限组未找到 (601)
- `AUTH_GROUP_NOT_JOINED`: 未加入权限组 (602)
- `AUTH_GROUP_ALREADY_JOINED`: 已加入权限组 (603)

#### 其他错误

- `UNKNOWN_ERROR`: 未知错误 (999)
