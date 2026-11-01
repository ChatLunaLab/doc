# 事件系统

::: tip
本节介绍事件 (Event) 系统的工作机制：事件的监听与触发方式，以及 `emit`、`serial`、`waterfall`、`bail` 四种事件调度模式。
:::

事件是 ChatLuna 扩展点的主要形态。通过上下文（Context），你可以注册事件监听器或主动触发事件。

## 监听与触发事件

你可以通过 `ctx.on()` 注册监听器，并通过 `ctx.emit()` 触发事件：

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

通过 `ctx.on()` 注册的监听器会自动绑定到当前的纤程 (Fiber)。当插件被卸载时，注册的监听器会被自动移除，你不需要手动调用注销方法。

### 事件命名约定与类型声明

事件名称通常遵循 `domain/verb` 格式并使用全小写。

如果需要实现跨包事件并获得类型提示，你可以通过 TypeScript 的模块增强 (Module Augmentation) 将事件和载荷类型声明到事件表中：

```ts
declare module 'cordis' {
  interface Events {
    'chatluna/memory-change': (event: MemoryChangeEvent) => void
    'chatluna/skill-change': () => void
  }
}
```

::: warning
事件名称必须保持全局唯一且语义明确。随意使用未规范命名的事件键可能导致事件冲突或难以追踪的副作用。
:::

## 四种事件调度模式

事件不仅仅用于单向广播。ChatLuna 提供四种不同的事件调度模式，决定了监听器是否可以影响执行流程或拦截结果：

| 模式 | 调度语义 | 典型用途与示例 |
| --- | --- | --- |
| `emit` | 广播触发，不等待返回值 | 单向通知：`session/event`、`agent/status` |
| `serial` | 串行等待所有监听器依次执行完毕 | 具有依赖顺序的副作用处理 |
| `waterfall` | 链式洋葱模型，需调用 `next()` 继续 | 拦截或改写载荷：`agent/pre-step`、`tools/pre-execute` |
| `bail` | 快速失败短路，任一监听器返回否决结果即停止 | 审批与前置校验：`chatluna/skill-check`、`chatluna/schedule-fire` |

### waterfall 模式

`waterfall` 是环绕链模式。监听器会接收到事件载荷以及一个 `next` 调度函数。你可以在调用 `next()` 之前或之后执行逻辑，从而实现对后续调用的拦截、修改载荷或后处理。

### bail 模式

`bail` 模式用于审批和校验类场景。系统按序调用监听器，只要其中一个监听器返回了否决结果（如 `false` 或具体错误），事件分发即刻短路并终止后续监听器的执行。

## 选择事件域

根据你的业务诉求选择正确的事件域 (Domain)：

- **会话事件**：以 `session/event` 为代表。持久事实会追加到日志并广播，适合需要在实例重载后继续存活的状态跟踪。
- **Agent 事件**：如 `chatluna/agent-*`。事件参数中携带当前运行时的活体 `Agent` 实例，适合观察或干预正在执行中的工作流。
- **能力事件**：如 `fs/*`、`tools/*`、`chatluna/*`。适合为底层特定能力挂载策略拦截器或适配器。

::: tip 选用建议
- 需要持久化存储与回放时，使用**会话事件**。
- 需要拦截改写执行中的数据流时，选用 **waterfall** 模式。
- 需要校验权限或执行条件时，选用 **bail** 模式。
:::

## 继续

- [插件与生命周期](./lifecycle)
- [服务与依赖](./service)
