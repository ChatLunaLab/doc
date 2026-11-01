# 编写引擎

::: tip
引擎本质上是对「一整套行为」的高级封装。像内置的常规对话、代码编写、角色伪装等，其底层实现都是引擎。你也可以封装自己的引擎，将提示词、可用工具、执行流程以及停止条件统一打包，供用户在场景规则中按需选用。
:::

相比于编写普通插件，实现引擎虽然稍微多了一点结构约束，但带来的收益也非常直观：用户可以在控制台界面中针对不同聊天场景自由指定引擎，底层的路由机制会自动负责生命周期的挂载与卸载。

<!-- 开发指南，可以使用代码 -->

## 最小引擎

想要实现一个引擎非常简单，我们只需要调用 `defineEngine` 即可：

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

只需将 `myEngine` 作为普通插件进行加载，它就会自动注册到系统的引擎列表中。

细心的小伙伴可能会发现，`defineEngine` 返回的本质上就是一个标准的插件函数，同时其身上还附带了引擎所必需的元数据信息。

## 声明字段

在声明引擎时，你可以传入丰富的配置属性以控制其具体行为：

| 字段 | 作用 |
| --- | --- |
| `id` | 引擎标识，路由里用它 |
| `label` / `description` | 选择器里的展示 |
| `hidden` | 不出现在选择器里，但仍可被规则点名 |
| `config` | 自己的配置结构 |
| `preset` / `presets` | 默认预设与可接受的预设类型 |
| `tools` / `skills` | 工具过滤 |
| `toolMode` / `delegation` | 工具呈现方式 |
| `activation` | 默认唤醒判定器 |
| `observe` / `merge` / `render` / `proactive` | 对子系统的默认值 |
| `stopWhen` | 停止条件 |
| `prepareStep` | 每步前的调整 |
| `apply` | 挂载时的插件逻辑 |
| `flow` | 自定义回合流程 |

值得注意的是，上述大部分字段都仅代表「默认值」。如果用户在路由规则中进行了显式配置，用户的设置将会优先覆盖这里的默认值。

## 挂载上下文

在 `apply` 方法中注入的上下文具有作用域隔离特性，它仅对当前挂载该引擎的 Agent 生效：

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

挂载上下文主要提供了以下核心方法：

- **prompt**：注册提示词块，其参数形式与 `ctx.prompt.block` 类似。
- **stopWhen**：满足条件时结束回合。
- **prepareStep**：每步开始前修改模型、工具、参数，或贡献消息。
- **assemble**：包住整个提示词装配。
- **state**：当前会话的键值空间。
- **output**：把模型输出解析成动作。
- **flow**：接管回合。

所有在挂载上下文中注册的资源都会随挂载结束而自动释放，不需要手动清理。

## 自定义回合

如果你的引擎不是简单的「问一句答一句」，而是需要更复杂的交互调度，可以使用 `flow`：

```ts
ctx.engine.flow(async (run, next) => {
  run.state().set('phase', 'plan')
  await run.generate({ prompt: '先列出计划。' })
  run.state().set('phase', 'execute')
  return next()
})
```

`flow` 是一条链：你可以完全接管整个执行流程，也可以做完自己的前置工作后再交给下一个流程。

不调用 `next()` 就意味着这个回合由你负责到底。

::: warning
`flow` 只在引擎被显式选择时才会执行。

子代理没有指定引擎时会走默认引擎，不会继承父会话的 `flow`。
:::

## 配置

给引擎声明 `config` 配置结构后，用户就能在场景规则中修改对应的设置：

```ts
config: Schema.object({
  prompt: Schema.string().label('补充提示词'),
  maxSteps: Schema.natural().default(8).label('最多几步'),
})
```

配置会在引擎挂载时统一解析。切换引擎留下的旧字段会被自动修剪，不会导致解析失败。

## 预设兼容性

如果引擎对预设类型有特殊要求，可以用 `presets` 声明兼容规则：

```ts
presets: {
  accept: ['character'],
  check: (record) => record.data?.kind === 'special' ? '这个引擎不接受特殊预设' : undefined,
}
```

一旦检测到不兼容，系统在回合开始时就会拒绝执行并给出具体原因，而不是带着错误的预设继续运行。

## 工具与模式

你可以通过声明相关字段，精细控制引擎所能接触到的工具能力：

- `tools` / `skills`：收窄这个引擎能看到的工具列表。
- `toolMode`：指定默认的工具呈现方式。
- `delegation`：声明是否支持「交给子代理」模式。

这里的过滤规则会与路由、权限等上层过滤相互叠加，可用范围只会越来越窄。

## 事件

如果需要感知并响应引擎的挂载生命周期，可以监听以下事件：

- `chatluna/engine-mount`：挂载完成，拿到配置与上下文。
- `chatluna/engine-unmount`：即将卸载。
- `chatluna/engine-turn`：每回合开始，并行广播。
- `chatluna/engine-state`：状态发生变化。

## 测试

编写完引擎后，建议按以下步骤进行测试验证：

- 挂载引擎后，检查最终提示词里是否出现了你注册的块。
- 修改配置，确认下次挂载时能够正常读到新值。
- 切到另一个引擎再切回来，确认运行状态已被彻底清理。
- 对于使用了 `flow` 的引擎，确认不调用 `next()` 时回合确实被完全接管。

## 常见问题

**引擎不出现在选择器里。**
检查声明中的 `hidden` 是否被设为了 `true`；同时检查插件是否已正确启用。

**配置改了不生效。**
引擎配置只在挂载时读取。你可以发起新会话，或者重新挂载当前引擎。

**提示词块没出现。**
检查块的 `id` 是否重复、`order` 是否在允许范围内，以及是否被其他独占块所覆盖。

**flow 不执行。**
确认 Agent 的引擎 `id` 与注册的完全一致；排查是否有处于前置链条的 flow 提前结束了流程。
