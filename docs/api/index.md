# API 参考

::: tip
API 参考分三部分：插件直接调用的核心服务（`ctx.*`），Cordis 的上下文、事件与 Schema，以及命令行、配置和 HTTP 接口。
:::

## 核心服务

| 服务 | 提供方 | 作用 |
| --- | --- | --- |
| [`ctx.conversations`](./service/conversations) | `@chatluna/conversations` | 会话键 → 活跃会话索引、fork/history |
| [`ctx.sessions`](./service/sessions) | `@chatluna/session` | append-only 会话日志 |
| [`ctx.agents`](./service/agent) | `@chatluna/agent` | Agent 注册与运行时 |
| [`ctx.ai`](./service/models) | `@chatluna/ai-runtime` | 模型运行时、provider 注册 |
| `ctx.chatluna` | `@chatluna/core` | 动词挂载面（ask/chat/…） |
| `ctx.chatluna_providers` | `@chatluna/provider-registry` | 提供商 recipe 目录 |
| [`ctx.tools`](./service/tools) | `@chatluna/tool` | 工具注册与执行管线 |
| [`ctx.skills`](./service/skills) | `@chatluna/skill` | 技能目录与加载 |
| [`ctx.mcp`](./service/mcp) | `@chatluna/mcp` | MCP 服务器管理 |
| [`ctx.subagents`](./service/subagents) | `@chatluna/subagent` | 子代理后端与委派 |
| [`ctx.computer`](./service/machines) | `@chatluna/computer` | 机器与工作区 |
| [`ctx.prompt`](./service/prompt) | `@chatluna/prompt` | 提示词分区 |
| [`ctx.presets`](./service/presets) | `@chatluna/preset` | 预设管理 |
| [`ctx.permissions`](./service/permissions) | `@chatluna/permission` | 权限判定 |
| [`ctx.memory`](./service/memory) | `@chatluna/memory` | 长期记忆 |
| [`ctx.schedule`](./service/schedule) | `@chatluna/schedule` | 定时任务 |
| [`ctx.background`](./service/schedule) | `@chatluna/background` | 后台任务 |
| [`ctx.trace`](./service/trace) | `@chatluna/trace` | 轨迹 span |
| [`ctx.telemetry`](./service/trace) | `@chatluna/telemetry` | 用量统计 |
| [`ctx.routing`](./service/routing) | `@chatluna/routing` | 场景规则 |
| [`ctx.chatluna_adapters`](./service/adapters) | `@chatluna/adapter-webui` | 平台适配器目录 |
| `ctx.chat` | `@chatluna/chat` | 消息管线 |
| `ctx.koishi` | `koishi`（打过补丁的 `@koishijs/core`） | Koishi 兼容层：命令、中间件与过滤器 |

## Cordis 上下文

[Context](./cordis/context) · [Events](./cordis/events) · [Service](./cordis/service) · [Schema](./cordis/schema)

## 其他参考

[命令行](./cli) · [配置与数据目录](./configuration) · [HTTP API](./http) · [术语表](./glossary)
