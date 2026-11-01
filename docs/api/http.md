# HTTP API

HTTP 服务由 `ctx.chatluna_server`（`@chatluna/server`）承载，负责鉴权、健康检查与统一的响应格式；`@chatluna/api` 在其上挂载会话与模型接口，各 WebUI 插件再按自己的生命周期挂载页面需要用到的路由。

::: tip
默认只放行 `/api/auth/login` 与 `/api/health` 两个路径，其余请求都要带有效凭据。放行清单可以通过服务插件的 `publicPaths` 调整。
:::

## 鉴权与健康检查

| 方法与路径 | 作用 |
| --- | --- |
| `POST /api/auth/login` | 用访问令牌换取会话凭据（默认放行） |
| `GET /api/auth/session` | 查询当前会话是否仍然有效 |
| `POST /api/auth/token` | 签发长期 Token，供外部程序调用 |
| `GET /api/health` | 存活检查（默认放行），启动器与诊断命令用它判断实例是否就绪 |

响应统一包在 `data` 字段里；失败时返回带 `error` 的对象。连续失败过多会触发限流。

## 会话与消息

| 方法与路径 | 作用 |
| --- | --- |
| `GET /api/agents` | 在线 Agent 分组 |
| `GET /api/sessions` | 会话列表，支持 `cursor` 与 `limit` |
| `POST /api/sessions` | 新建网页会话，返回 `201`；可带 `title`、`presetId`、`model` |
| `DELETE /api/sessions/:id` | 关闭网页会话，返回提示「会话日志保留，可在日志页回放」 |
| `GET /api/sessions/:id/messages` | 当前模型可见的消息，附带 `length` 与 `cacheBreaks`（前缀被打断的位置） |
| `POST /api/sessions/:id/messages` | 投递一条输入，返回 `202 accepted` |
| `GET /api/sessions/:id/request/:seq` | 按序号重建那一轮的请求快照 |

`POST /api/sessions` 与 `POST /api/sessions/:id/messages` 支持 `Idempotency-Key` 请求头：同一个键重复提交只会执行一次，可以用来安全重试。

`GET /api/sessions/:id/messages` 返回的是模型视图，不是原始条目；要看完整历史请用 `request/:seq` 或轨迹页。

## 实时流

| 方法与路径 | 作用 |
| --- | --- |
| `GET /api/sessions/:id/events` | SSE：会话事件流，可用 `Last-Event-ID` 或 `since` 续传 |
| `GET /api/sessions/:id/live` | 实时输出帧：`snapshot`、`agent/assistant-stream`、`agent/assistant-settled` |

实时帧不带持久的 SSE 标识，断线后需要先用 `/events` 补齐、再用 `snapshot` 对齐。

## 控制会话

| 方法与路径 | 作用 |
| --- | --- |
| `POST /api/sessions/:id/steer` | 插话：把文本以「立即合入」的方式投给 Agent |
| `POST /api/sessions/:id/cancel` | 中止当前生成，保留待处理输入 |
| `POST /api/sessions/:id/fork` | 从 `boundary` 指定的条目位置分叉，返回新会话 |
| `POST /api/sessions/:id/compact` | 手动压缩（未安装压缩服务时返回不可用），可传 `keep` |
| `POST /api/sessions/:id/model` | 切换会话模型，正文需要 `provider` 与 `model` |
| `GET /api/commands` | 当前实例注册的聊天命令 |

## 模型

| 方法与路径 | 作用 |
| --- | --- |
| `GET /api/models/providers` | 已注册的提供商 |
| `GET /api/models` | 可用模型 |
| `GET /api/models/catalog` | 模型目录；`?all=1` 返回未过滤的全量目录 |
| `POST /api/models/discover` | 向指定地址探测并同步模型，正文需要 `provider` 与 `baseURL` |
| `GET /api/sdk/capabilities` | 能力协商：实时流协议版本、流地址与帧类型 |

## 文件

| 方法与路径 | 作用 |
| --- | --- |
| `GET /files/:name` | 读取存储中的附件，返回时带长缓存；文件不存在或过期时 `404` |

## 页面插件挂载的接口

这些路由跟着插件走，插件卸载后一同消失：

| 路径 | 提供方 | 作用 |
| --- | --- | --- |
| `/api/presets`、`/api/presets/:id/download` | 预设页面 | 预设列表与下载 |
| `/api/interaction/pending`、`/api/interaction/answer` | 交互页面 | 待确认请求与回答 |
| `/api/usage/export.csv` | 用量页面 | 导出用量 CSV |
| `/api/console`、`/api/console/onboarding` | 控制台插件 | 控制台数据与引导 |
| `/api/koishi/entities` | API 实体目录 | 平台实体查询 |

## SDK

`@chatluna/api-sdk` 是给外部程序用的客户端。它握手的第一步是 `/api/sdk/capabilities`；除此之外它还会调用会话、路由与用量相关的 SDK 路径，这些路径是否可用取决于你部署的版本与插件组合，接入前请先用能力协商确认。

## 继续

- [CLI 参考](/api/cli)
- [API 与 SDK（架构）](/architecture/api-sdk)
