# 事件系统

::: tip
本节介绍事件 (Event) 系统的工作机制：事件的监听与触发方式，以及 `emit`、`serial`、`waterfall`、`bail` 四种事件调度模式。
:::

事件是 ChatLuna 扩展能力的核心方式。借助上下文 (Context)，你可以轻松注册事件监听器，或者在合适的时机向外主动派发事件，实现各模块间的低耦合协作。

## 监听与触发事件

监听和派发事件非常直观。你可以通过 `ctx.on()` 注册监听器，并通过 `ctx.emit()` 触发事件：

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

代码中并没有显式调用注销方法。这是因为通过 `ctx.on()` 注册的监听器会自动绑定到当前的纤程 (Fiber) 与插件上下文。当插件被卸载或停用时，注册的监听器会被框架自动注销，完全不用担心内存泄漏的问题。

### 事件命名约定与类型声明

为了保持语义清晰，ChatLuna 的事件名称通常遵循 `domain/verb` 格式，并全部采用小写字母，例如 `chatluna/memory-change`。

如果你需要编写跨包插件并获得完整的 TypeScript 类型提示，可以通过模块增强 (Module Augmentation) 将事件名与载荷类型声明到 Cordis 的 `Events` 接口中：

```ts
declare module 'cordis' {
  interface Events {
    'chatluna/memory-change': (event: MemoryChangeEvent) => void
    'chatluna/skill-change': () => void
  }
}
```

::: warning
事件名称在全局范围内是共享的，因此请保持命名唯一且语义明确。随意使用不规范的事件键不仅容易造成事件冲突，还可能引发难以追踪的副作用。
:::

## 四种事件调度模式

事件不仅仅能用来单向广播。ChatLuna 提供了四种不同的事件调度模式，用于控制监听器是否能够影响执行流程或拦截下游处理结果：

| 模式 | 调度语义 | 典型用途与示例 |
| --- | --- | --- |
| `emit` | 广播触发，不等待返回值 | 单向通知：`session/event`、`agent/status` |
| `serial` | 串行等待所有监听器依次执行完毕 | 具有依赖顺序的副作用处理 |
| `waterfall` | 链式洋葱模型，需调用 `next()` 继续 | 拦截或改写载荷：`agent/pre-step`、`tools/pre-execute` |
| `bail` | 快速失败短路，任一监听器返回否决结果即停止 | 审批与前置校验：`chatluna/skill-check`、`chatluna/schedule-fire` |

### waterfall 模式

`waterfall` 采用了经典的洋葱圈环绕链模型。监听器除了接收事件载荷外，还会获得一个 `next` 调度函数。你可以在调用 `next()` 之前改写载荷或进行前置拦截，也可以在 `next()` 之后处理返回结果；如果不调用 `next()`，则流程不会继续向下传递。

### bail 模式

`bail` 模式专门用于审批和前置校验场景。调度器会按顺序依次执行监听器，只要其中任何一个监听器返回了否决结果（如 `false` 或具体错误），事件分发便会立即短路并终止，后续的监听器将不再被调用。

## 选择事件域

在实际开发中，你应该根据具体的业务诉求选择合适的事件域 (Domain)：

- **会话事件**：以 `session/event` 为代表。持久事实会追加记录到日志并广播，非常适合在实例重载后仍需保持状态跟踪的场景。
- **Agent 事件**：如 `chatluna/agent-*`。事件参数中直接携带当前运行时的活体 `Agent` 实例，适合实时观察或干预正在执行的工作流。
- **能力事件**：如 `fs/*`、`tools/*`、`chatluna/*`。适合为底层特定能力挂载策略拦截器或适配扩展。

::: tip 选用建议
- 需要持久化存储与状态回放时，优先使用**会话事件**。
- 需要拦截并改写执行中的数据流时，选用 **waterfall** 模式。
- 需要进行权限审批或前置条件校验时，选用 **bail** 模式。
:::

## 继续

- [插件与生命周期](./lifecycle)
- [服务与依赖](./service)
