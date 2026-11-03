# 接口与 SDK

::: tip
ChatLuna 可以脱离聊天平台运行，供外部程序调用。底层是标准的 HTTP 接口与实时流，官方 SDK 是它们的轻量封装。自带的控制台也只是这套接口的调用方之一，所以脚本、CI 或自建应用都能做同样的事：创建会话、发送消息、读取回复、统计用量、管理预设。
:::

<!-- 架构页，可以使用代码与配置示意 -->

## 认证

受保护的接口需要访问令牌，两种传递方式：

- **请求头**：直接在请求头中携带令牌。
- **会话**：先用令牌换取短期会话凭据，再附加到后续请求。

接口和管理界面的路径前缀默认受安全中间件保护，未认证的请求直接拒绝。

::: warning
令牌拥有和控制台相同的管理权限。不要写进前端代码、提交到公开仓库或发到聊天记录里。外部调用应在受信的服务端执行。
:::

## 会话接口

| 方法 | 路径 | 作用 |
| --- | --- | --- |
| GET | `/api/agents` | 列出可用的 Agent 分组 |
| GET | `/api/sessions` | 分页列出会话 |
| POST | `/api/sessions` | 创建会话 |
| DELETE | `/api/sessions/:id` | 删除会话 |
| GET | `/api/sessions/:id/messages` | 读取消息 |
| POST | `/api/sessions/:id/messages` | 发送消息 |
| POST | `/api/sessions/:id/steer` | 在回合中途补充输入 |
| POST | `/api/sessions/:id/cancel` | 取消当前回合 |
| POST | `/api/sessions/:id/fork` | 从当前会话分叉 |
| POST | `/api/sessions/:id/compact` | 压缩上下文 |
| POST | `/api/sessions/:id/model` | 切换会话模型 |
| GET | `/api/sessions/:id/request/:seq` | 重建某步请求快照 |
| GET | `/api/sessions/:id/events` | 事件流 |
| GET | `/api/sessions/:id/live` | 实时流 |
| GET | `/api/sdk/capabilities` | SDK 能力探测 |
| GET | `/api/models/providers` | 列出提供商 |
| GET | `/api/models` | 列出模型 |
| GET | `/api/models/catalog` | 模型目录 |
| GET | `/api/models/discover` | 模型发现 |
| GET | `/api/commands` | 列出可用命令 |

- **创建会话**：可以指定标题、预设和模型，不指定则使用全局默认值。
- **发送消息**：异步执行。接口返回只表示消息已接收，回复要通过实时流或事件流获取。
- **分页**：列表接口都用游标分页，数据变动时翻页也不会重复或遗漏。

## 实时流

- **事件流**：会话级的细粒度事件，包括状态变化、回合推进和工具调用。
- **实时流**：面向外部应用的简化流，适合轻量消费，能力较少。

流式接收不需要轮询，Token 一产生就能收到。连接会定期发送心跳，长时间无响应时服务端主动断开。

## 幂等

写接口都支持幂等键。重复提交同一个键时直接返回首次的结果，网络超时无法确认是否成功时可以安全重试。

## 错误

```json
{
  "code": "INVALID_ARGUMENT",
  "message": "invalid input: model"
}
```

成功响应不包额外的信封，返回体就是资源本身。

| 码 | 含义 |
| --- | --- |
| `INVALID_ARGUMENT` | 参数不合法 |
| `UNAUTHORIZED` | 未认证或令牌失效 |
| `FORBIDDEN` | 已认证但无权执行 |
| `NOT_FOUND` | 资源不存在 |
| `PRECONDITION_FAILED` | 状态不允许，例如插件未安装 |
| `CONFLICT` | 并发冲突，例如会话被别处修改 |
| `UNAVAILABLE` | 依赖的服务不可用，例如未安装压缩插件 |
| `RATE_LIMITED` | 触发速率限制 |
| `INTERNAL` | 服务器内部错误 |

HTTP 状态码反映传输层的成败，错误码说明具体的业务原因。

## SDK

```ts
const sdk = new ChatLunaSDK({
  baseUrl: 'http://127.0.0.1:5028',
  token: process.env.CHATLUNA_TOKEN,
})

const { sessionId } = await sdk.createConversation('脚本任务')
const result = await sdk.sendMessage(sessionId, '帮我总结一下这个文件')
const conversations = await sdk.listConversations()
const usage = await sdk.getUsage()
```

SDK 的对话方法走独立的轻量端点（如 `/api/sdk/conversations`、`/api/sdk/usage`），而不是上表的 `/api/sessions/*` 管理接口。它只负责拼接地址、附加令牌和统一解析错误，不维护隐藏状态，也没有本地缓存。

**能力探测**：调用前可以先查询服务端支持的能力（实时流协议版本、流地址、帧类型），据此选择路径。客户端声明的会话、路由、用量等方法，服务端是否真的提供取决于版本和启用的插件，接入前先通过能力探测确认。

## 典型用法

- **脚本与自动化**：在 CI 中运行测试对话检查输出，或定时触发总结并发送到下游服务。
- **自定义前端**：不用自带控制台，基于接口自建聊天界面，会话、消息和流式输出都已就绪。
- **桥接其他平台**：把其他平台的消息转进来、回复转出去。这会绕过原生适配器，编辑、撤回等平台特性需要自己实现。
- **数据导出**：读取会话记录、用量和轨迹，对接自有系统或制作报表。

## 安全

- 只在局域网或本机回环地址暴露接口。
- 公网访问必须经过反向代理和 HTTPS。
- 按最小权限管理令牌。
- 严格校验外部传入的会话 ID、文件名等参数，不要直接拼接路径。

::: warning
这套接口能创建会话、触发工具调用，不要当作只读 API 暴露给不可信的调用方。
:::

## 常见问题

**401**：令牌错误或过期。检查请求头格式和令牌来源（配置项、环境变量或数据目录中的凭证）。

**403**：已认证但无权执行。检查路径是否在受保护前缀下，以及动作是否被权限系统拒绝。

**创建会话失败**：检查预设和模型是否可用，相关插件是否正常加载。

**发消息后没有回复**：确认流连接已建立、该轮没有被中间件判为忽略，必要时看轨迹。

**收到重复消息**：写请求没带幂等键，重试被执行了多次。

**翻页出现重复**：用了偏移量页码而不是游标，改用服务端返回的游标。

## 下一步

- [控制台](./webui) — 接口的另一位使用者。
- [会话与消息](./sessions) — 会话模型。
- [引擎](./engine) — 外部调用时用哪个引擎。
- [HTTP API](/api/http) — 接口参考。
