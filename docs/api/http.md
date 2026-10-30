# HTTP API

ChatLuna 的 HTTP 服务由底层服务 `ctx.server`（`@chatluna/server`）承载。`@chatluna/api` 负责提供面向外部调用的核心会话与模型接口；各 WebUI 插件则根据自身生命周期挂载独立的页面和业务路由。

::: tip
所有外部请求默认需要通过鉴权中间件。服务通过 `publicPaths` 配置放行白名单，默认仅放行 `/api/auth/login` 与 `/api/health`。
:::

## 鉴权与健康检查

所有认证相关的路由均挂载在 `/api/auth/*` 下。未登录用户可通过登录接口换取凭据，或使用签发的 API Token 调用外部接口。

| HTTP 方法与路径 | 功能说明 |
| --- | --- |
| `POST /api/auth/login` | 提交登录凭证，成功后返回会话凭据（白名单放行） |
| `GET /api/auth/session` | 查询当前请求的登录状态与会话信息 |
| `POST /api/auth/token` | 签发新的 API Token，供外部程序鉴权调用 |
| `GET /api/health` | 检查服务存活状态（白名单放行） |

## 会话管理 (`@chatluna/api`)

`@chatluna/api` 提供了与 Agent 对话、拉取历史记录、控制对话流程以及监听实时流的完整接口集合。

### 会话与消息交互

| HTTP 方法与路径 | 功能说明 | 补充参数/特性 |
| --- | --- | --- |
| `GET /api/agents` | 获取当前在线的 Agent 列表 | - |
| `GET /api/sessions` | 获取当前用户的会话列表 | - |
| `POST /api/sessions` | 创建新会话 | - |
| `GET /api/sessions/:id` | 获取指定会话的元数据与状态详情 | - |
| `GET /api/sessions/:id/messages` | 读取会话的历史消息记录 | 支持 cursor 分页 |
| `POST /api/sessions/:id/messages` | 向指定会话发送新消息并触发回复 | 请求头支持 `Idempotency-Key` 幂等标头 |
| `GET /api/sessions/:id/request/:seq` | 查询指定序列号 (`seq`) 的单条请求处理状态 | - |
| `GET /api/commands` | 获取当前会话环境中所有可用的斜杠命令 | - |

### 实时流监听

监听会话状态变化与模型输出支持 Server-Sent Events (SSE)：

| HTTP 方法与路径 | 功能说明 |
| --- | --- |
| `GET /api/sessions/:id/events` | 建立 SSE 事件流连接，接收会话全局事件通知 |
| `GET /api/sessions/:id/live` | 建立实时输出流，接收模型的流式生成片段 |

### 对话流程控制

你可以对正在进行的会话执行插话、取消生成、上下文分叉或历史压缩：

| HTTP 方法与路径 | 操作名称 | 功能说明 |
| --- | --- | --- |
| `POST /api/sessions/:id/steer` | 插话 (Steer) | 在当前上下文插入引导指令，调整模型后续生成方向 |
| `POST /api/sessions/:id/cancel` | 取消 (Cancel) | 中断当前正在处理或生成的请求 |
| `POST /api/sessions/:id/fork` | 分叉 (Fork) | 基于当前历史节点创建一条新的独立会话分支 |
| `POST /api/sessions/:id/compact` | 压缩 (Compact) | 触发上下文修剪与总结压缩，释放历史 Token 占用 |
| `POST /api/sessions/:id/model` | 换模型 | 变更当前会话所绑定的模型 |

## 模型查询与发现

提供商与模型相关的元数据接口由 `@chatluna/api` 提供：

| HTTP 方法与路径 | 功能说明 | 补充参数 |
| --- | --- | --- |
| `GET /api/models/providers` | 获取已注册的模型提供商列表 | - |
| `GET /api/models` | 枚举当前可用的模型列表 | - |
| `GET /api/models/catalog` | 获取全量模型目录 | 支持 `?all=1` 查询参数查看完整未过滤目录 |
| `POST /api/models/discover` | 触发上游模型服务的主动探测与同步 | - |

## SDK 接口适配

`@chatluna/api-sdk` 封装了专用的客户端通信接口，简化外部程序接入与能力协商：

| HTTP 方法与路径 | 功能说明 |
| --- | --- |
| `GET /api/sdk/capabilities` | 查询服务端支持的能力特性集合 |
| `GET /api/sdk/conversations` | 列出 SDK 会话列表 |
| `POST /api/sdk/conversations/send` | 通过 SDK 发送对话消息 |
| `GET /api/sdk/routes` | 查询 SDK 专用的路由端点映射 |

## WebUI 页面接口

各 WebUI 模块通过独立的插件提供服务。这些接口与页面处于同一生命周期，随对应插件的加载和卸载动态挂载到 `ctx.server`：

- `/api/presets*`：预设 (Preset) 模板与配置管理
- `/api/interaction/*`：用于用户交互授权与权限确认询问
- `/api/usage/export.csv`：导出 Token 与请求用量统计数据（CSV 格式）
- `/api/console*`：控制台管理界面专属接口
- `/api/koishi/entities`：Koishi 平台实体与关系查询接口

## 继续

- [CLI 参考](/api/cli)
- [会话与消息（架构）](/architecture/sessions)
