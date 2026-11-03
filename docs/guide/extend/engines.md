# 编写引擎

::: tip
引擎是「一整套行为」的封装：内置的对话、编码、伪装都是引擎。你也可以把提示词、工具、执行流程和停止条件打包成自己的引擎，供用户在场景规则中选用，挂载与卸载由路由自动管理。
:::

<!-- 开发指南，可以使用代码 -->

## 最小引擎

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

`defineEngine` 返回一个附带引擎元数据的普通插件，加载后自动出现在引擎列表中。

## 声明字段

| 字段 | 作用 |
| --- | --- |
| `id` | 引擎标识，用于路由匹配 |
| `label` / `description` | 选择器中的名称与描述 |
| `hidden` | 不出现在选择器中，但仍可被规则显式指定 |
| `config` | 引擎自己的配置结构 |
| `preset` / `presets` | 默认预设与支持的预设类型 |
| `tools` / `skills` | 工具过滤规则 |
| `toolMode` / `delegation` | 工具呈现方式与委派设置 |
| `activation` | 默认回复判定器 |
| `observe` / `merge` / `render` / `proactive` | 各子系统的默认配置 |
| `stopWhen` | 停止条件 |
| `prepareStep` | 每步执行前的调整钩子 |
| `apply` | 挂载时的插件逻辑 |
| `flow` | 自定义回合流程 |

大部分字段只是默认值，用户在场景规则中显式配置的值优先。

## 挂载上下文

`apply` 收到的上下文只对挂载了该引擎的 Agent 生效：

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

- `prompt`：注册提示词块，参数与 `ctx.prompt.block` 类似。
- `stopWhen`：满足条件时结束回合。
- `prepareStep`：每步开始前修改模型、工具、参数，或追加消息。
- `assemble`：包装整个提示词装配流程。
- `state`：当前会话的键值空间。
- `output`：把模型输出解析为动作。
- `flow`：接管回合流程。

这里注册的资源都会随挂载结束自动释放。

## 自定义回合

需要比一问一答更复杂的调度时，使用 `flow`：

```ts
ctx.engine.flow(async (run, next) => {
  run.state().set('phase', 'plan')
  await run.generate({ prompt: '先列出计划。' })
  run.state().set('phase', 'execute')
  return next()
})
```

`flow` 是一条执行链：做完前置工作后调用 `next()` 交给下一个流程，不调用则由你全权负责这一回合。

::: warning
`flow` 只在引擎被显式选择时执行。子代理未指定引擎时使用默认引擎，不继承父会话的 `flow`。
:::

## 配置

声明 `config` 后，用户可以在场景规则中修改：

```ts
config: Schema.object({
  prompt: Schema.string().label('补充提示词'),
  maxSteps: Schema.natural().default(8).label('最多几步'),
})
```

配置在引擎挂载时解析。切换引擎留下的旧字段会被清理，不会导致解析失败。

## 预设兼容性

```ts
presets: {
  accept: ['character'],
  check: (record) => record.data?.kind === 'special' ? '这个引擎不接受特殊预设' : undefined,
}
```

不兼容时，回合开始就会拒绝执行并给出原因。

## 工具

- `tools` / `skills`：收窄引擎可见的工具。
- `toolMode`：默认的工具呈现方式。
- `delegation`：是否支持「交给子代理」模式。

这些过滤与路由、权限等上层过滤叠加，可用范围只会进一步收窄。

## 事件

- `chatluna/engine-mount`：挂载完成，可获取配置与上下文。
- `chatluna/engine-unmount`：即将卸载。
- `chatluna/engine-turn`：每回合开始时并行广播。
- `chatluna/engine-state`：状态变化时触发。

## 测试

1. 挂载后检查最终提示词中是否有你注册的块。
2. 修改配置，确认下次挂载能读到新值。
3. 切到另一个引擎再切回，确认状态已清理。
4. 使用了 `flow` 时，确认不调用 `next()` 时回合被完全接管。

## 常见问题

**引擎没出现在选择器中**：检查 `hidden` 是否为 `true`，以及插件是否已启用。

**改了配置不生效**：引擎配置只在挂载时读取，新开会话或重新挂载即可。

**提示词块没出现**：检查块的 `id` 是否重复、`order` 是否在允许范围内，以及是否被其他独占块覆盖。

**flow 没执行**：确认 Agent 的引擎 `id` 与注册的一致，并检查前面的 `flow` 是否提前结束了流程。
