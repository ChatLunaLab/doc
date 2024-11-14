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

- **code**: `number` 错误码，一般使用 `ChatLunaErrorCode` 枚举值。
- **originalError**: `Error` 原始错误，一个 `Error` 实例。

创建一个 ChatLuna 错误。

### enum ChatLunaErrorCode

枚举类，可用的错误码如下：

#### 基础错误 (1-99)

- **NETWORK_ERROR**: `1` - 网络错误
- **UNSUPPORTED_PROXY_PROTOCOL**: `2` - 不支持的代理协议
- **QUEUE_OVERFLOW**: `3` - 队列溢出
- **RENDER_ERROR**: `4` - 渲染错误
- **ABORTED**: `5` - 已中止
- **PLUGIN_ALREADY_REGISTERED**: `6` - 插件已注册
- **PLUGIN_NOT_FOUND**: `7` - 插件未找到

#### API 相关错误 (100-199)

- **API_KEY_UNAVAILABLE**: `100` - API 密钥不可用
- **API_REQUEST_RESOLVE_CAPTCHA**: `101` - API 请求需要解决验证码
- **API_REQUEST_TIMEOUT**: `102` - API 请求超时
- **API_REQUEST_FAILED**: `103` - API 请求失败
- **API_UNSAFE_CONTENT**: `104` - API 不安全内容

#### 模型相关错误 (300-399)

- **MODEL_ADAPTER_NOT_FOUND**: `300` - 模型适配器未找到
- **MODEL_NOT_FOUND**: `301` - 模型未找到
- **PREST_NOT_FOUND**: `302` - 预设未找到
- **MODEL_INIT_ERROR**: `303` - 模型初始化错误
- **EMBEDDINGS_INIT_ERROR**: `304` - 嵌入初始化错误
- **VECTOR_STORE_INIT_ERROR**: `305` - 向量存储初始化错误
- **CHAT_HISTORY_INIT_ERROR**: `306` - 聊天历史初始化错误
- **NOT_AVAILABLE_CONFIG**: `307` - 配置不可用
- **MODEL_CONVERSION_INIT_ERROR**: `308` - 模型转换初始化错误
- **MODEL_RESPONSE_IS_EMPTY**: `309` - 模型响应为空
- **MODEL_DEPOSE_ERROR**: `310` - 模型释放错误
- **PRESET_LOAD_ERROR**: `311` - 预设加载错误
- **LONG_MEMORY_INIT_ERROR**: `312` - 长期记忆初始化错误

#### 房间相关错误 (400-499)

- **MEMBER_NOT_IN_ROOM**: `400` - 成员不在房间中
- **ROOM_NOT_JOINED**: `401` - 未加入房间
- **ROOM_NOT_FOUND_MASTER**: `402` - 未找到房主
- **ROOM_TEMPLATE_INVALID**: `403` - 房间模板无效
- **THE_NAME_FIND_IN_MULTIPLE_ROOMS**: `404` - 在多个房间中找到相同名称
- **ROOM_NOT_FOUND**: `405` - 房间未找到
- **INIT_ROOM**: `406` - 初始化房间

#### 知识库相关错误 (500-599)

- **KNOWLEDGE_CONFIG_INVALID**: `500` - 知识库配置无效
- **KNOWLEDGE_DOC_NOT_FOUND**: `501` - 知识库文档未找到
- **KNOWLEDGE_LOOP_INCLUDE**: `502` - 知识库循环包含
- **KNOWLEDGE_UNSUPPORTED_FILE_TYPE**: `503` - 知识库不支持的文件类型
- **KNOWLEDGE_EXIST_FILE**: `504` - 知识库文件已存在
- **KNOWLEDGE_VECTOR_NOT_FOUND**: `505` - 知识库向量未找到

#### 用户相关错误 (600-699)

- **USER_NOT_FOUND**: `600` - 用户未找到
- **AUTH_GROUP_NOT_FOUND**: `601` - 权限组未找到
- **AUTH_GROUP_NOT_JOINED**: `602` - 未加入权限组
- **AUTH_GROUP_ALREADY_JOINED**: `603` - 已加入权限组

#### 其他错误

- **UNKNOWN_ERROR**: `999` - 未知错误
