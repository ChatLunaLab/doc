# 工具 (Tools)

`ctx.tools`（由 `@chatluna/tool` 提供）是工具的注册表与执行器。插件可以通过 `defineTool` 注册工具；智能体 (Agent) 在每一步执行循环中，会根据可见性规则过滤可用工具，再提供给语言模型调用。

::: tip
通过 `ctx.tools` 注册的所有工具都会绑定到调用方的生命周期 (Fiber)。当插件卸载时，注册的工具会自动注销并回收，无需手动清理。
:::

## 注册工具

在插件的 `apply` 函数中，调用 `ctx.tools.define` 即可声明工具的名称、参数模式与执行逻辑：

```ts
import type { Context } from 'cordis'
import { Schema } from '@chatluna/schema'

export function apply(ctx: Context) {
  ctx.tools.define({
    name: 'weather_lookup',
    description: '查询城市天气',
    args: Schema.object({
      city: Schema.string(),
    }),
    traits: {
      effect: 'read',
    },
    run: async ({ city }) => {
      // 执行天气查询逻辑
      return `查询到 ${city} 的天气数据`
    },
  })
}
```

各配置项说明如下：

- `name`：工具的唯一标识，格式需匹配正则表达式 `^[a-zA-Z0-9_-]{1,64}$`。同一 owner 下不可重复。
- `args`：使用 Cordis Schema 定义的参数模式，系统会自动转换为模型侧使用的 JSON Schema。
- `traits`：工具特性声明。
  - `effect`：副作用类型，可选 `'read'`、`'write'` 或 `'exec'`。
  - `parallel`：是否允许并发执行。
  - `timeout`：单次执行的同步等待超时时间。加载 `@chatluna/background` 时默认为 `180s`，超时后任务会转入后台托管；若为 `background: false`，超时则直接中止。
  - `deferred`：是否为延迟加载工具。
- `permission`：声明执行该工具所需的权限，接入 `ctx.permissions` 权限管理系统。
- `render.call` / `render.result`：自定义在控制台中展示该工具调用过程与执行结果的视图。

## 常用 API

`ctx.tools` 提供了以下常用方法，用于管理和调度工具：

| 方法 | 说明 |
| --- | --- |
| `define(definition)` | 向注册表注册工具（内部会校验名称并转换 Schema）。 |
| `list(agent)` / `catalog(agent)` | 获取对指定 Agent 可见的工具列表或目录条目。 |
| `filter({ include, exclude })` | 在当前 Fiber 作用域内收窄工具的可见范围。 |
| `visibility(rule)` | 注册动态可见性规则。 |
| `use(middleware, { order })` | 注册工具执行中间件，支持配置执行顺序 `order`。 |
| `execute(input)` | 手动触发并执行一次工具调用。 |

## 配置可见性与搜索机制 (tool-search)

当环境内可用工具数量超出阈值（默认值为 `20`）时，系统会自动启用工具搜索 (tool-search) 模式：

1. 系统先向模型提供 `tool_search` 元工具，隐藏庞大的全量工具定义。
2. 模型检索命中目标工具后，系统再按需展开该工具的完整参数规范 (spec)。
3. 配置项 `autoDefer`（默认包含 `['mcp__*']`）会匹配工具名称，对命中的工具预先延迟展开。
4. 配置项 `limit`（默认值为 `5`）用于限制单轮直接提供给模型的工具数量上限。

::: warning
如果注册的工具过多且未启用搜索降级，模型上下文会因携带全量 JSON Schema 而迅速膨胀，可能导致上下文超出限制或响应变慢。
:::

## 配置工具调用策略

你可以借助 `@chatluna/tool-policy` 按工具名称配置调用策略。在 `chatluna.yml` 文件的 `tools.policy` 下进行配置：

```yaml
tools:
  policy:
    weather_lookup: auto
    dangerous_command: ask
    debug_tool: off
```

可选的策略值如下：

- `auto`：允许 Agent 直接调用该工具。
- `ask`：每次调用前向用户请求确认。
- `off`：对 Agent 隐藏该工具，既不可见也不可执行。

## MCP 工具投影

通过 `ctx.mcp` 连接外部 MCP (Model Context Protocol) 服务器时，远程服务器提供的工具会自动投影到本地工具注册表中，命名格式为 `mcp__<server>__<tool>`。

所有投影的 MCP 工具都会复用本地的过滤规则、`tool-search` 延迟展开机制以及 `@chatluna/tool-policy` 权限管线。

## 继续

- [能力扩展总览](/manual/usage/capabilities)
- [编写工具（指南）](/guide/extend/tools)
