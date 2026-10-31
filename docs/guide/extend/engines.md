# 编写引擎

::: tip
引擎是「一套行为」的封装。内置的对话、编码、伪装都是引擎；你也可以写一个，把提示词、工具、流程、停止条件打包成一个可在场景规则里选择的东西。
:::

写引擎比写普通插件多一点结构，但换来的是：用户可以在界面上按群选择它，路由会负责挂载与卸载。

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

把 `myEngine` 作为插件加载，它就会注册到引擎列表里。

`defineEngine` 返回的是一个插件函数，同时带有引擎的元数据。

## 声明字段

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

大部分字段是「默认值」：用户在路由里配置的值会覆盖它。

## 挂载上下文

`apply` 拿到的上下文只对这个 Agent 生效：

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

- **prompt**：注册提示词块，参数与 `ctx.prompt.block` 类似。
- **stopWhen**：满足条件时结束回合。
- **prepareStep**：每步开始前修改模型、工具、参数，或贡献消息。
- **assemble**：包住整个提示词装配。
- **state**：当前会话的键值空间。
- **output**：把模型输出解析成动作。
- **flow**：接管回合。

所有注册都随挂载释放，不需要手动清理。

## 自定义回合

如果你的引擎不是「问一句答一句」，用 flow：

```ts
ctx.engine.flow(async (run, next) => {
  run.state().set('phase', 'plan')
  await run.generate({ prompt: '先列出计划。' })
  run.state().set('phase', 'execute')
  return next()
})
```

`flow` 是一条链：你可以完全接管，也可以做完自己的事再交给下一个。

不调用 `next()` 就意味着这个回合由你负责到底。

::: warning
flow 只在引擎被显式选择时运行。

子代理没指定引擎时走默认引擎，不会继承父会话的 flow。
:::

## 配置

给引擎声明配置结构，用户就能在场景规则里改：

```ts
config: Schema.object({
  prompt: Schema.string().label('补充提示词'),
  maxSteps: Schema.natural().default(8).label('最多几步'),
})
```

配置会在挂载时解析。切换引擎留下的旧字段会被修剪，不会导致解析失败。

## 预设兼容性

如果引擎对预设类型有要求，用 `presets` 声明：

```ts
presets: {
  accept: ['character'],
  check: (record) => record.data?.kind === 'special' ? '这个引擎不接受特殊预设' : undefined,
}
```

不兼容时，回合开始会拒绝并给出原因，而不是带着错误的预设运行。

## 工具与模式

- `tools` / `skills`：收窄这个引擎能看到的工具。
- `toolMode`：默认的呈现方式。
- `delegation`：声明支持「交给子代理」模式。

过滤会与路由、权限的过滤叠加，只会越来越窄。

## 事件

如果需要响应挂载生命周期：

- `chatluna/engine-mount`：挂载完成，拿到配置与上下文。
- `chatluna/engine-unmount`：即将卸载。
- `chatluna/engine-turn`：每回合开始，并行广播。
- `chatluna/engine-state`：状态变化。

## 测试

- 挂载引擎后，检查提示词里出现了你注册的块。
- 改配置，确认挂载时读到新值。
- 切到另一个引擎再切回来，确认状态被清理。
- 用 flow 的引擎，确认不调用 `next()` 时回合确实被接管。

## 常见问题

**引擎不出现在选择器里。**
检查 `hidden` 是否为 true；检查插件是否启用。

**配置改了不生效。**
配置在挂载时读取。换新会话，或重新挂载。

**提示词块没出现。**
检查块的 id 是否重复、order 是否在允许范围、是否被独占块覆盖。

**flow 不执行。**
确认 Agent 的引擎 id 与注册一致；确认没有其他 flow 提前结束。
