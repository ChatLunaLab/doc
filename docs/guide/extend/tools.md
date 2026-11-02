# 工具开发

::: tip
本节介绍如何编写一个工具 (Tool)：包括工具的声明与注册、参数定义、权限校验、执行特征配置，以及工具的过滤与检索机制。
:::

## 注册工具

在 ChatLuna 中，工具是可以被模型调用并执行特定逻辑的单元。你可以使用 `@chatluna/tool` 导出的 `defineTool` 定义工具，并调用 `ctx.tools.define` 将其注册到上下文 (`Context`) 中：

```ts
import type { Context } from 'cordis'
import { defineTool } from '@chatluna/tool'
import { Schema } from '@chatluna/schema'

export function apply(ctx: Context) {
  ctx.tools.define(defineTool({
    name: 'weather',
    description: '查询天气',
    args: Schema.object({
      city: Schema.string().required().description('城市名'),
    }),
    run: async (args, call) => {
      return { text: `${args.city}：晴 26℃` }
    },
  }))
}
```

定义工具时需遵循以下约束：

- **名称规范**：`name` 字段必须匹配正则表达式 `^[a-zA-Z0-9_-]{1,64}$`。
- **参数声明**：`args` 使用 Cordis Schema 声明。框架会自动基于该 Schema 生成供模型推断的 JSON Schema，同时用于生成 WebUI 中的调试表单。
- **执行逻辑**：`run(args, call)` 接收解析后的参数对象 `args` 及当前调用上下文 `call`，执行后返回处理结果。

## 声明与控制权限

每个工具在注册后都会关联权限判定。默认情况下，工具的权限标识为 `tool:<name>`。

如果你需要根据传入的参数动态指定判定目标，可以在工具定义中提供 `permission` 函数：

```ts
ctx.tools.define(defineTool({
  name: 'deploy',
  description: '执行部署任务',
  args: Schema.object({
    env: Schema.string().required().description('部署环境'),
  }),
  permission: (args) => ({ name: 'deploy:run', target: args.env }),
  run: async (args, call) => {
    // 执行部署逻辑
    return { text: `已触发 ${args.env} 环境部署` }
  },
}))
```

权限判定流程由 `ctx.permissions.authorize` 执行，其最终判定结果为 `allow`、`ask` 或 `deny`。

除了静态与前置判定外，你也可以在 `run` 函数执行期间根据业务逻辑主动拦截调用：

- 调用 `call.ask(reason)` 挂起当前执行并向用户请求授权。
- 调用 `call.deny(reason)` 直接拒绝本次调用并返回错误。

## 配置执行特征与超时 (traits)

在工具定义中添加 `traits` 字段，你可以向执行调度器描述工具的运行特征：

```ts
ctx.tools.define(defineTool({
  name: 'fetch_data',
  description: '抓取远程数据',
  traits: {
    parallel: true,           // 允许与同轮对话中的其他兄弟调用并行执行
    effect: 'read',           // 执行副作用类型，可选 'read' | 'write' | 'exec'
    timeout: 30000,           // 超时时间，单位毫秒（默认 180s）
    background: true,         // 超时后是否允许被后台任务收编（默认为 true）
  },
  args: Schema.object({}),
  run: async (args, call) => {
    // 执行数据抓取
    return { status: 'success' }
  },
}))
```

::: warning
当工具调用的执行耗时超过 `timeout` 时，系统会自动通过 `ctx.background` 将其转入后台任务继续执行。如果你不希望长时间运行的工具转入后台，请显式将 `background` 设为 `false`。
:::

## 控制工具可见性与按需检索

当工具数量较多时，直接将所有工具定义注入上下文会导致 Token 消耗过大。你可以通过以下机制控制工具的可见性与加载策略：

### 过滤工具可见范围

你可以使用 `ctx.tools.filter({ include, exclude })` 在指定范围内筛选工具，也可以在定义中使用 `visibility()` 动态判断某个会话是否可见当前工具。

### 按需检索模式

当工具注册或运行时的 `mode` 设置为 `'search'` 时，工具定义不会全量提供给模型，而是先以精简摘要的形式呈现。模型判断需要调用该工具时，会先通过内置的 `tool_search` 检索并拉取完整的工具定义，以此节省上下文窗口消耗。

## 继续

- [服务与依赖](../plugin/service)
- [提示词分区](./prompts)
