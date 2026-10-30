# HTTP 和实时协议

本文描述当前 v2 版本的应用 HTTP 与实时通信 API，供本地集成与自定义客户端开发使用。接口随 alpha 阶段演进；在集成前，请先调用 `GET /api/sdk/capabilities` 确认支持特性，并核对运行实例版本。请勿将旧版 v1 服务接口或 WebUI 的私有内部状态视为同一套公开协议。

## 认证与通用响应

`/api` 与 `/console` 路由默认受访问口令保护；登录入口 `POST /api/auth/login` 与健康检查 `GET /api/health` 默认公开。受保护接口通过请求头传递凭证：

```http
Authorization: Bearer <credential>
```

请通过 HTTPS 或受信任的本机回路（loopback）传输凭证，严禁将 token 写入公开 URL、命令历史记录或示例代码仓库。

- **登录鉴权**：`POST /api/auth/login` 的请求体为 `{"token": "..."}`，输入的是应用访问口令；成功响应中的会话凭据可用于后续认证。访问口令、签名会话凭据与模型供应商 API key 是不同概念。
- **访问控制**：来源 IP 地址限制（`allowRemote` 配置）与身份认证属于两套独立的检查逻辑，通过登录鉴权并不等同于解除远程访问限制。

### 响应格式规范

- **成功响应**：直接返回对应的数据实体，**不使用**通用的 `{ ok, data }` 包装层；部分仅需确认执行状态的动作接口会直接返回 `{ ok: true }`，但不能将此行为泛化至所有数据接口。
- **错误响应**：统一返回包含 `{ code, message, details? }` 的 JSON 对象。

错误代码与 HTTP 状态码对照表：

| 错误代码 (`code`) | HTTP 状态码 | 典型场景 |
| --- | --- | --- |
| `INVALID_ARGUMENT` | 400 | 请求体缺失字段、格式错误、序列号非法 |
| `UNAUTHORIZED` / `FORBIDDEN` | 401 / 403 | 凭证缺失或无效 / 来源 IP 限制未放行 |
| `NOT_FOUND` | 404 | 会话未加载、序列号对应请求不存在 |
| `CONFLICT` / `PRECONDITION_FAILED` | 409 / 412 | 状态冲突、前置检查失败 |
| `RATE_LIMITED` | 429 | 请求频率超限 |
| `UNAVAILABLE` / `NOT_IMPLEMENTED` / `INTERNAL` | 503 / 501 / 500 | 依赖组件（如 compaction）未就绪 / 功能未实现 / 内部异常 |

## 会话目录与管理

| 方法与路径 | 说明 | 约束与前置条件 |
| --- | --- | --- |
| GET `/api/agents` | 获取当前 Agent 分组列表 | - |
| GET `/api/sessions` | 获取当前已知会话的分页列表 | 支持游标分页 |
| POST `/api/sessions` | 创建 WebBot 对话会话 | 需要已加载 web adapter |
| DELETE `/api/sessions/:id` | 移除 Web 会话映射 | 仅解绑映射，底层的持久化日志予以保留 |

### 创建会话

- **请求体**：支持包含 `title`、`presetId`、`model`（对象，包含 `provider` 与 `model` 两个独立字段）。
- **成功响应**：返回 HTTP 201 及实体 `{ id, title, createdAt }`。
- **注意**：内部寻址模型格式为 `provider:model`，此处请求体内必须传入包含 `provider` 与 `model` 键的对象，不要误传预设文件（Preset）中使用的 `provider/model` 复合字符串。

### 会话分页与查找机制

- **分页逻辑**：`GET /api/sessions` 按 `createdAt`/`id` 降序排列；`limit` 默认值为 50，单次上限为 200。分页游标 `cursor` 是服务端生成的 opaque 字符串，客户端不得直接将数值型偏移量（offset）作为游标传入。
- **寻址定位（`api.locate`）**：后续多数会话操作接口依赖内部的 `api.locate` 寻找**当前已加载到内存**的 Agent 实例。数据库中存在该 `sessionId` 并不代表其当前处于活跃加载状态。若接口返回 `session does not exist or is not loaded`，需优先区分是底层存储不存在该会话，还是会话未在当前实例中激活打开。

## 输入控制与生命周期管理

| 方法与路径 | 输入参数 / 结果 | 执行边界与约束 |
| --- | --- | --- |
| POST `/api/sessions/:id/messages` | `text` 或受支持的结构化 `content`；成功返回 HTTP 202 Accepted | 表示 WebBot 已接受消息并进入分发流程，**不代表**大模型已完成回复 |
| POST `/api/sessions/:id/steer` | `{"text": "..."}`；成功返回 HTTP 202 Accepted | 即时介入（receive now），于当前步骤边界（step boundary）合入，不会强制中断正在进行的网络请求 |
| POST `/api/sessions/:id/cancel` | 成功返回 `{"ok": true}` | 中断当前流程（abort），保留 pending 状态，不撤回或回滚已经发生的工具副作用 |
| POST `/api/sessions/:id/fork` | `{ boundary?: number }`（可省略 boundary）；成功返回 HTTP 201 及子会话对象 | 基于历史边界分叉日志条目，**不承诺**自动将业务主线（head）切换至新会话 |
| POST `/api/sessions/:id/compact` | `{ keep?: number }`（可省略 keep） | 会话压缩接口；若实例未加载 compaction 扩展，直接返回 HTTP 503 |
| POST `/api/sessions/:id/model` | `{"provider": "...", "model": "..."}` | 校验参数合法性并写入会话模型选择配置，**不证明**向远端供应商的推理测试已通过 |

### 消息发送与幂等性

- 发送消息的成功凭据是后续产生的会话持久化日志、终态事件与下游投递记录，HTTP 202 仅代表请求已入队并被接收。
- **重试机制**：网络重试必须携带相同的 `Idempotency-Key` 请求头；若发起新的业务动作，必须生成并使用全新的 key。
- **幂等表规则**：服务端幂等表按 `actor`/`action`/`key` 维度在内存中合并并发调用。成功调用的结果默认在内存中保留 10 分钟；执行失败的记录会被即时移除。由于幂等表纯内存存储，实例重启即失效，无法提供跨进程持久化的 exactly-once 保证。严禁对内容不同的消息复用相同的 key。

### 会话分叉（Fork）边界

`POST /api/sessions/:id/fork` 的 `boundary` 参数指定日志序号 $n$ 的上限，实际复制范围为左闭右开区间 $[0, \text{boundary})$。分叉日志历史、重置当前业务主线（head）与在运行环境中拉起新 Agent 属于三阶段独立操作，客户端切勿从 fork 调用的成功响应单方面推断三项操作已同时就绪。

## 视图查询与请求上下文重建

### 消息视图查询

`GET /api/sessions/:id/messages` 返回对象包含：
- `sessionId`: 会话 ID
- `messages`: 当前组装完毕供模型消费的消息视图列表
- `length`: 会话底层原始日志的总条目数（Entry Count）
- `cacheBreaks`: 缓存断点标识列表

**注意**：`messages` 列表的长度与 `length` 代表的日志条目数通常**不相等**，前者经过了系统过滤、折叠或上下文裁剪。

### 请求上下文重建

`GET /api/sessions/:id/request/:seq` 根据指定条目重建当时的推理请求结构。
- `seq` 严格对应日志条目的序号 $n$，**不是**前端消息数组的索引下标，必须为非负整数。
- 参数非法返回 HTTP 400；由于上下文丢失等原因无法完成重建时返回 HTTP 404。
- 成功返回 `{ seq, request }`。该操作仅纯粹重构上下文载荷，**不会**调用模型 API，也**不会**执行任何工具。
- 重建结果的准确性依赖该节点保存的 prompt mark、历史条目和上下文截断切点（cut）；客户端切勿试图用当前的会话模板直接套用替代。

## 持久化事件流（Durable Events SSE）

通过 `GET /api/sessions/:id/events` 建立 Server-Sent Events 连接，用于读取已提交（committed）的日志条目并实时接收后续追加。

### 协议规范与帧格式

- **SSE `id` 格式**：`sessionId:n`（$n$ 为日志自增序号）。
- **SSE `event` 名称**：
  - 类型为 `message` 与 `cut` 的日志，其事件名直接为对应的日志类型（`message`、`cut`）。
  - 类型为 `mark` 的条目，其事件名为标记的具体名称（`mark.name`），**不会**统一命名为 `mark`。
- **SSE `data` 载荷**：直接包含原始日志条目对象 `entry`，并附带两个兼容字段：`seq: n` 与 `type: eventName`。

### 断线重连与流控回放

- **重连恢复**：断线后优先读取标准请求头 `Last-Event-ID`，若未提供则读取 URL 查询参数 `?since=<seq>`。服务端将从 `since + 1` 开始向客户端回放。
- **回放截断（Truncated）**：单次历史回放默认上限为 2000 条。若断线落后数量超出该上限，服务端会先推送一条 `event: truncated` 事件（载荷包含 `dropped`、`from` 和 `hint` 信息），随后仅推送保留在缓冲区内的尾部数据。
- **客户端处理**：收到 `truncated` 事件后，客户端**严禁**直接将接收到的尾部数据视作完整连续历史，必须按照 `hint` 调用 `GET /api/sessions/:id/messages` 拉取完整快照来重构当前消息状态。若需获取包含系统控制位在内的全部底层条目，必须使用专用的持久化日志导出通道，不可将消息快照当做日志备份。

> **概念边界**：“已提交（committed）”在此处仅指会话上下文管理器已接受该追加操作；只有配置了持久化插件，才具备相应存储实现提供的保存保证；具体崩溃与断电行为仍取决于数据库和部署。在未配置持久化层时，不可将 SSE 协议中的 durable 命名当做物理持久化保障。

## 活跃流式生成（Live Assistant SSE）

`GET /api/sessions/:id/live` 用于订阅大模型尚未提交完成的流式输出增量。

### 流状态与生命周期

- 根据当前 `capability`，流中包含 `snapshot`、`agent/assistant-stream`、`agent/assistant-settled`，以及落后异常通知 `lagged`。
- **快照数据**：首帧或重置帧 `snapshot` 包含 `sessionId`、`streamEpoch` 与 `attempt`（在未开始推理时可为空）。其中 `revision` 字段仅表示该活跃流在本次生命周期中的内部版本，**不得**作为历史持久化恢复的游标。
- **缓冲区约束**：服务端在推理进行中仅在内存中保留有限的增量历史（当前限制最多 256 个 parts）。客户端断线后不可依赖 live 流完整补齐已丢失的 token。
- **连接特征**：live SSE 连接中**不携带** durable SSE id。

### 完整状态恢复时序

当自定义客户端需要精确恢复当前 UI 状态时，必须遵循以下标准顺序：
1. 先通过 `GET /api/sessions/:id/events`（或拉取 `/messages` 快照）恢复所有已提交（committed）的历史状态。
2. 随后建立 `GET /api/sessions/:id/live` 连接取得 `snapshot`，根据返回的协议规范处理当前的未完成 `attempt`。
3. 连接正常关闭并不直接等同于回复执行成功；前端出现临时流式文字，也**不代表**对应的 assistant 最终消息已经持久化并提交至会话。

## WebUI 状态与动作协议（State & Action）

WebUI 管理面板不使用上述面向业务集成方的 SSE 管道，而是使用独立的已认证 WebSocket 分发状态快照：
- **动作执行**：WebUI 页面向 `POST /api/action/:name` 提交动作。
- **客户端接入**：基于 `@chatluna/ui-client` 提供的 `useLive` 与 `useAction` 实现绑定。
- **机制隔离**：每个浏览器标签页拥有独立的 WebSocket 链路，其内部包含的状态 Hash 校验与背压控制逻辑专供控制台页面同步，不属于 Session 核心业务事件的恢复机制。
- **页面扩展**：为管理控制台新增页面时，应注册带强类型约束的 Typed States 和 Actions，不得自行私建同名协议。具体规范参见[开发管理页面](/development/webui)。

## 模型目录与系统指令

| 接口与路径 | 功能说明 | 限制与敏感说明 |
| --- | --- | --- |
| GET `/api/models/providers` | 获取当前已挂载的模型供应商（Provider）列表 | 依赖对应平台或模型插件的加载状态 |
| GET `/api/models` | 获取可用的模型选项列表 | - |
| GET `/api/models/catalog?all=1` | 获取全局模型目录定义 | 包含全部静态声明的模型条目 |
| POST `/api/models/discover` | 根据 `provider`、`baseURL`、`apiKey` 动态探测供应商服务 | 请求体包含高危鉴权凭据，**严禁**在日志或调试器中记录该请求的完整原文 |
| GET `/api/commands` | 获取当前实例实际注册的指令、参数及选项元数据 | 命令集合由加载的插件动态决定，客户端**切勿硬编码**固定的命令字典 |

- **健康状态边界**：模型存在于目录中，仅表明其配置或声明已加载，不等于远端服务当前可用且健康；执行 `POST /api/models/discover` 成功仅证明鉴权与端点探测通过，并不代表实际的大模型对话推理链路已测试完毕。
- **挂载依赖**：若相关 API 服务或其所依赖的功能域插件未在系统中挂载，上述模型及命令接口可能返回 HTTP 404。

## 客户端验收测试清单

在正式部署自定义客户端前，必须对以下边界与异常场景完成覆盖验收：

- [ ] **认证与网络**：口令失效返回 401；`allowRemote` 未放行返回 403 来源限制。
- [ ] **SSE 断线恢复**：正常断线使用 `Last-Event-ID` 回传自增恢复；落后数据量超过 2000 条接收到 `truncated` 事件后，降级通过快照拉取 `/messages` 全量同步。
- [ ] **会话寻址机制**：处理会话底层存在但未在内存中激活打开导致的未加载错误。
- [ ] **幂等与并发控制**：在网络重试时使用相同的 `Idempotency-Key`；发起新操作时正确重置 key。
- [ ] **操作生命周期**：处理取消（cancel）后保留的 pending 状态；正确断言 HTTP 202 不等于推理终态。
- [ ] **异常与故障**：外部工具执行失败处理；远端模型返回错误处理；宿主通信平台（Adapter）发送失败处理。
- [ ] **数据脱敏**：客户端在导出调试日志或向外汇报前，全面脱敏认证凭据（Authorization）、平台账号身份（Platform IDs）、用户私有对话内容及工具调用输出。

深入了解底层运行机制，请继续阅读：
- [会话机制](/architecture/sessions)
- [Agent 执行](/architecture/agents)
- [轨迹与用量](/guide/observability)
