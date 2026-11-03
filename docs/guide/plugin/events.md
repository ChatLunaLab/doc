# 事件系统

::: tip
本节介绍事件 (Event) 系统的工作机制：事件的监听与触发方式，以及 `emit`、`serial`、`waterfall`、`bail` 四种事件调度模式。
:::

事件是 ChatLuna 扩展能力的核心机制。借助上下文 (Context)，你可以注册事件监听器，或向外触发事件，实现各模块之间的解耦与协作。

## 监听与触发事件

你可以通过 `ctx.on()` 注册监听器，通过 `ctx.emit()` 触发事件：

```ts
import type { Context } from 'cordis'

export function apply(ctx: Context) {
  // 注册事件监听器
  ctx.on('chatluna/memory-change', (event) => {
    // 处理内存变更逻辑
  })

  // 触发广播事件
  ctx.emit('chatluna/skill-change')
}
```

上面的代码中并没有显式注销监听器。通过 `ctx.on()` 注册的监听器会自动绑定到当前的 Fiber 与插件上下文。当插件停用或卸载时，框架会自动注销对应的监听器，无需手动清理。

### 事件命名约定与类型声明

ChatLuna 的事件名称通常遵循 `domain/verb` 格式，并全部使用小写字母，例如 `chatluna/memory-change`。

编写跨包插件时，如果需要完整的 TypeScript 类型提示，可以通过模块增强 (Module Augmentation) 将事件名与载荷类型合并到 Cordis 的 `Events` 接口中：

```ts
declare module 'cordis' {
  interface Events {
    'chatluna/memory-change': (event: MemoryChangeEvent) => void
    'chatluna/skill-change': () => void
  }
}
```

::: warning
事件名称在全局共享，请确保命名唯一且语义明确。不规范的事件名称不仅容易引发命名冲突，还可能带来难以排查的副作用。
:::

## 四种事件调度模式

除了单向广播，ChatLuna 还提供了四种不同的事件调度模式，用于控制监听器的执行流程以及是否拦截下游结果：

| 模式 | 调度语义 | 典型用途与示例 |
| --- | --- | --- |
| `emit` | 广播触发，不等待返回值 | 单向通知：`chatluna/agent-status`、`chatluna/session-start` |
| `serial` | 串行等待所有监听器依次执行完毕 | 具有先后依赖的副作用处理：`chatluna/tool-before`、`chatluna/schedule-fire` |
| `waterfall` | 洋葱模型，需调用 `next()` 继续 | 拦截或改写载荷：`chatluna/before-memory-write`、`chatluna/permission-check` |
| `bail` | 短路机制，任一监听器返回否决结果即终止 | 审批与前置校验：`chatluna/skill-check` |

### waterfall 模式

`waterfall` 采用洋葱模型。监听器除了接收事件载荷外，还会收到一个 `next` 函数。你可以在调用 `next()` 前修改载荷或做前置拦截，也可以在 `next()` 后处理返回结果。如果不调用 `next()`，流程将在此中断，不再向下传递。

### bail 模式

`bail` 模式常用于审批和前置校验。调度器会依次执行监听器，一旦某个监听器返回了否决结果（如 `false` 或具体错误），事件分发便会立即终止，不再调用后续的监听器。

## 选择事件域

在实际开发中，应根据业务需求选择合适的事件域 (Domain)：

- **会话事件**：以 `chatluna/session-start`、`chatluna/session-end`、`chatluna/session-branch` 为代表，用于跟踪会话生命周期与分叉状态。
- **Agent 事件**：如 `chatluna/agent-*`，事件参数直接包含当前运行时的 `Agent` 实例，用于实时观察或干预执行中的工作流。
- **能力事件**：如 `chatluna/fs-change`、`mcp/servers-change`、`chatluna/tool-before`，用于为特定能力挂载策略拦截器或扩展逻辑。

::: tip 选用建议
- 需要持久化存储与状态回放时，优先选用**会话事件**。
- 需要拦截并改写数据流时，选用 **waterfall** 模式。
- 需要进行权限审批或前置条件校验时，选用 **bail** 模式。
:::

## 继续

- [插件与生命周期](./lifecycle)
- [服务与依赖](./service)
