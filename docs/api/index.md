# API 参考

ChatLuna 的 API 分三层：核心服务（`ctx.*`，插件代码用的）、Cordis 上下文（生命周期/事件/构型）、以及外围参考（CLI、配置目录、HTTP 端点）。

## 核心服务

| 服务 | 提供方 | 作用 |
| --- | --- | --- |
| `ctx.conversations` | `@chatluna/conversations` | 会话键 → 活会话索引、fork/history |
| `ctx.sessions` | `@chatluna/session` | append-only 会话日志 |
| `ctx.agents` | `@chatluna/agent` | Agent 注册与运行时 |
| `ctx.ai` | `@chatluna/ai-runtime` | 模型运行时、provider 注册 |
| `ctx.chatluna` | `@chatluna/core` | 动词挂载面（ask/chat/…） |
| `ctx.chatluna_providers` | `@chatluna/provider-registry` | 提供商 recipe 目录 |
| `ctx.tools` | `@chatluna/tool` | 工具注册与执行管线 |
| `ctx.skills` | `@chatluna/skill` | 技能目录与加载 |
| `ctx.mcp` | `@chatluna/mcp` | MCP 服务器管理 |
| `ctx.subagents` | `@chatluna/subagent` | 子代理后端与委派 |
| `ctx.computer` | `@chatluna/computer` | 机器/工作区 |
| `ctx.prompt` | `@chatluna/prompt` | 提示词分区 |
| `ctx.presets` | `@chatluna/preset` | 预设管理 |
| `ctx.permissions` | `@chatluna/permission` | 权限判定 |
| `ctx.memory` | `@chatluna/memory` | 长期记忆 |
| `ctx.schedule` | `@chatluna/schedule` | 定时任务 |
| `ctx.background` | `@chatluna/background` | 后台任务 |
| `ctx.trace` | `@chatluna/trace` | 轨迹 span |
| `ctx.routing` | `@chatluna/routing` | 场景规则 |
| `ctx.chat` | `@chatluna/chat` | 消息管线 |
| `ctx.koishi` | `@chatluna/koishi` | Koishi 风格内核 |

## Cordis 上下文

[Context](./cordis/context) / [Events](./cordis/events) / [Service](./cordis/service) / [Schema](./cordis/schema)。

## 其他参考

[命令行](./cli) · [配置与数据目录](./configuration) · [HTTP API](./http) · [术语表](./glossary)
