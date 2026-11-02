# 编写引擎

::: tip
引擎本质上是对「一整套行为」的高级封装。内置的常规对话、代码编写、角色伪装等功能，底层实现都是引擎。你也可以封装自己的引擎，将提示词、可用工具、执行流程与停止条件打包在一起，供用户在场景规则中按需选用。
:::

相比编写普通插件，实现引擎虽然多了一些结构约束，但使用起来更灵活：用户可以在控制台中为不同的聊天场景指定引擎，底层的路由机制会自动管理其挂载与卸载生命周期。

<!-- 开发指南，可以使用代码 -->

## 最小引擎

实现一个引擎很简单，调用 `defineEngine` 即可：

```ts
import { defineEngine } from '@chatluna/engine'

export const myEngine = defineEngine({
  id: 'my-engine',
  label: { zh: '我的引擎', en: 'My Engine' },
  description: '一个尽量简单的示例。',
  apply(ctx, config) {
    ctx.engine.prompt('my-engine:style', '回答保持简短。', { order: 100 })
  },
})
```

将 `myEngine` 作为普通插件加载，它就会自动注册到系统的引擎列表中。

`defineEngine` 返回的本质上是一个标准插件，同时附带了引擎所需的元数据。

## 声明字段

声明引擎时，你可以传入以下配置属性来控制它的行为：

| 字段 | 作用 |
| --- | --- |
| `id` | 引擎标识，用于路由匹配 |
| `label` / `description` | 在选择器中展示的名称与描述 |
| `hidden` | 不出现在选择器中，但仍可被规则显式指定 |
| `config` | 引擎自身的配置结构 |
| `preset` / `presets` | 默认预设与支持的预设类型 |
| `tools` / `skills` | 工具过滤规则 |
| `toolMode` / `delegation` | 工具呈现方式与委派设置 |
| `activation` | 默认唤醒判定器 |
| `observe` / `merge` / `render` / `proactive` | 各子系统的默认配置 |
| `stopWhen` | 停止条件 |
| `prepareStep` | 每步执行前的调整钩子 |
| `apply` | 挂载时的插件逻辑 |
| `flow` | 自定义回合流程 |

需要注意的是，上述大部分字段都仅作为「默认值」。如果用户在路由规则中显式配置了对应项，将优先使用用户的配置。

## 挂载上下文

在 `apply` 方法中注入的上下文具有作用域隔离特性，仅对当前挂载该引擎的 Agent 生效：

```ts
apply(ctx, config) {
  ctx.engine.prompt('a', '...')
  ctx.engine.stopWhen(({ step }) => step >= 5)
  ctx.engine.prepareStep(async (input) => {
    if (input.stepNumber !== 1) return undefined
    return { model: config.model }
  })
  ctx.engine.state().set('started', Date.now())
}
```

挂载上下文提供了以下核心方法：

- `prompt`：注册提示词块，参数形式与 `ctx.prompt.block` 类似。
- `stopWhen`：满足条件时结束回合。
- `prepareStep`：每步开始前修改模型、工具、参数，或追加消息。
- `assemble`：封装整个提示词装配流程。
- `state`：访问当前会话的键值空间。
- `output`：将模型输出解析为具体动作。
- `flow`：接管回合执行流程。

所有在挂载上下文中注册的资源都会随挂载结束自动释放，无需手动清理。

## 自定义回合

如果你的引擎需要更复杂的交互调度，而不仅是一问一答，可以使用 `flow`：

```ts
ctx.engine.flow(async (run, next) => {
  run.state().set('phase', 'plan')
  await run.generate({ prompt: '先列出计划。' })
  run.state().set('phase', 'execute')
  return next()
})
```

`flow` 是一条执行链：你可以完全接管流程，也可以在完成前置工作后交给下一个流程。

若不调用 `next()`，则表示当前回合由你全权负责。

::: warning
`flow` 仅在引擎被显式选择时才会执行。

子代理未指定引擎时将使用默认引擎，不会继承父会话的 `flow`。
:::

## 配置

在引擎中声明 `config` 配置结构后，用户即可在场景规则中修改对应的设置：

```ts
config: Schema.object({
  prompt: Schema.string().label('补充提示词'),
  maxSteps: Schema.natural().default(8).label('最多几步'),
})
```

配置会在引擎挂载时统一解析。切换引擎留下的旧字段会被自动清理，不会导致解析失败。

## 预设兼容性

如果引擎对预设类型有特殊要求，可以使用 `presets` 声明兼容规则：

```ts
presets: {
  accept: ['character'],
  check: (record) => record.data?.kind === 'special' ? '这个引擎不接受特殊预设' : undefined,
}
```

一旦检测到不兼容，系统在回合开始时就会拒绝执行并提示原因，避免带着错误的预设继续运行。

## 工具与模式

你可以通过声明以下字段，精细控制引擎可使用的工具能力：

- `tools` / `skills`：收窄当前引擎可见的工具列表。
- `toolMode`：指定默认的工具呈现方式。
- `delegation`：声明是否支持「交给子代理」模式。

这里的过滤规则会与路由、权限等上层过滤叠加生效，可用范围只会被进一步收窄。

## 事件

如果需要监听引擎的挂载生命周期，可以注册以下事件：

- `chatluna/engine-mount`：挂载完成，可获取配置与上下文。
- `chatluna/engine-unmount`：引擎即将卸载。
- `chatluna/engine-turn`：每回合开始时触发，并行广播。
- `chatluna/engine-state`：状态发生变化时触发。

## 测试

编写完引擎后，建议按以下步骤进行测试验证：

1. 挂载引擎后，检查最终提示词中是否包含了你注册的块。
2. 修改配置项，确认下次挂载时能正常读取新值。
3. 切换到另一个引擎后再切回，确认运行状态已被彻底清理。
4. 若使用了 `flow`，确认不调用 `next()` 时回合确实被完全接管。

## 常见问题

**引擎未出现在选择器中**
检查声明中的 `hidden` 是否被设为 `true`，并确认插件已正确启用。

**修改配置后不生效**
引擎配置仅在挂载时读取。你可以发起新会话，或者重新挂载当前引擎。

**提示词块未出现**
检查块的 `id` 是否重复、`order` 是否在允许范围内，以及是否被其他独占块覆盖。

**flow 未执行**
确认 Agent 的引擎 `id` 与注册的完全一致，并排查前置链路中是否有其他 `flow` 提前结束了流程。
