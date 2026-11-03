# 权限服务 (Permissions)

`ctx.permissions`（由 `@chatluna/permission` 提供）是 ChatLuna 的统一权限服务。它负责定义系统能力、按主体求值、发起用户交互询问，以及维护规则与角色映射。工具 (Tool)、机器 (Machine)、子代理 (Subagent) 等运行时模块均通过该服务判定最终执行策略（`allow | ask | deny`）。

## 核心概念

权限系统基于等级、模式、效果与交互答复四项核心概念运行：

- **权限等级 (Level 0–5)**：数值越大，权限越高。
  - `0–2`：只读级别能力。
  - `3–4`：自动化执行能力。
  - `5`：完全控制能力。
  - 主体的最终等级由平台角色 (`platformRole`)、用户记录以及会话层面的收窄规则共同计算得出。
- **运行模式 (Mode)**：可选值为 `read-only | files | auto | allow`。模式由全局引擎默认值、路由规则和 Agent 覆盖配置逐层收窄。
- **判定效果 (Effect)**：最终的求值结果，包含三种状态：
  - `allow`：直接放行执行。
  - `ask`：暂停并挂起，向用户发起权限确认询问。
  - `deny`：拒绝执行。
- **用户答复 (Answer)**：当判定效果为 `ask` 时，用户可以通过不同范围进行授权：`once | turn | session | always | reject | never`。其中 `always` 和 `never` 会被持久化为生效规则。

::: tip
权限判定始终遵循最小权限原则：模式 (Mode) 只能逐层收窄，不能越级放宽。
:::

## 规则管线与求值流程

权限求值按照主体信息匹配规则，并在需要交互时发起询问：

1. **匹配与求值**：规则管线优先匹配 `user`、`role` 与 `subject` 标识，结合当前 `mode` 计算出目标能力的 `effect`。你也可以通过 `sources` 扩展外部规则源（例如路由场景规则）。
2. **挂起与询问**：若求值结果为 `ask`，系统将调用通过 `asker()` 注册的询问通道（例如 Web 控制台或聊天平台消息），等待操作者答复。
3. **规则固化**：如果操作者回复了 `always` 或 `never`，系统会自动将该答复固化为持久规则，后续匹配将直接返回 `allow` 或 `deny`。

### 请求能力授权

调用 `ctx.permissions.authorize` 对主体进行求值，并在必要时发起询问：

```ts
import type { Context } from 'cordis'

export async function executeMachineTask(ctx: Context, userId: string, platform: string) {
  // 请求执行 machine:docker 能力的授权
  const outcome = await ctx.permissions.authorize('machine:docker', {
    subject: { user: userId, platform },
    reason: '在容器里执行测试',
  })

  // 授权未通过时中断执行并返回原因
  if (!outcome.ok) {
    return outcome.reason
  }

  // 执行具体业务逻辑
}
```

::: warning
当判定进入 `ask` 状态时，`authorize` 会处于异步等待状态，直到操作者答复或超时。请避免在需要高频即时返回的循环中直接调用 `authorize`。
:::

## 常用 API

`ctx.permissions` 提供了以下方法，用于注册能力、求值以及维护授权规则：

| 方法 | 说明 |
| --- | --- |
| `define(name, definition)` | 定义一项新能力。支持配置 `level`、`grant`、`target` schema 和 `dangerous` 标记。 |
| `provide(name, check)` | 为指定能力挂载主体校验函数。 |
| `check(name, input)` | 仅求值并返回 `Verdict`，不发起交互询问。 |
| `authorize(name, input)` | 求值并在返回 `ask` 时发起询问，返回包含最终状态的 `Outcome`。 |
| `rule(input, { persist })` | 创建单条权限规则。可通过 `persist` 指定是仅在当前会话有效，还是写入持久存储。 |
| `grant(userId, ...names)` | 直接向指定用户授予一项或多项能力。 |
| `revoke(userId, ...names)` | 回收指定用户的一项或多项能力。 |
| `asker(fn, { order })` | 注册交互询问通道（例如 Web 控制台弹窗、聊天平台交互消息）。 |
| `pending()` | 获取当前所有等待答复的询问项列表。 |
| `answer(id, answer, subject)` | 提交对特定挂起询问的答复，并传入操作主体信息。 |
| `test(names, session)` | 传入 Satori 会话上下文，批量测试一组能力的判定状态。 |

## 模块集成机制

其他运行时模块可以通过声明能力名接入统一权限面，无需自行实现鉴权逻辑：

- **工具 (Tools)**：在 `ToolDefinition.permission` 中声明所需能力标识。执行工具前，执行器会自动调用 `ctx.permissions.authorize`。
- **机器环境 (Machines)**：以 `machine:<name>` 命名空间注册为独立能力（例如 `machine:docker`），调用机器资源前必须先通过权限求值。
- **子代理 (Subagents)**：子代理派生时会依据配置的等级 (Level) 确定可用能力范围，超出权限等级的操作会被自动拦截。
- **定时调度 (Schedules)**：定时触发器以 `schedule` 命名空间注册能力，并接受规则管控。

## 继续

- [权限模式（手册）](/manual/usage/permissions)
