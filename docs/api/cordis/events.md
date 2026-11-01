# 事件 (Events)

事件是插件间解耦与功能扩展的主要形态。你可以使用 `ctx.on` 注册监听，使用 `ctx.emit` 触发广播；监听器的生命周期与当前 fiber 绑定，并在销毁时自动清理。

## 调度模式

Cordis 提供了多种事件调度方式，以支持不同的执行流控制需求：

| API | 语义 |
| --- | --- |
| `ctx.on(event, listener)` | 注册监听 |
| `ctx.emit(event, ...args)` | 广播，不等待 |
| `ctx.serial(event, ...args)` | 串行等待所有监听 |
| `ctx.waterfall(event, carrier)` | 链式环绕，监听 `next()` 继续 |
| `ctx.bail(event, ...args)` | 任一否决即停 |

其中 `waterfall` 的监听器签名是 `(carrier, next)`，支持在修改 `carrier` 后调用 `next()`，以实现前后环绕逻辑；`bail` 的监听器只要返回否决结果，便会立即短路并中断后续调用。

## 声明

对于跨包事件，建议通过 TypeScript 模块增强将其声明到事件表中，以获得类型推导支持：

```ts
declare module 'cordis' {
  interface Events {
    'my/event': (payload: MyPayload) => void
  }
}
```

事件名通常约定采用小写的 `domain/verb` 格式。

## 常用事件域

常见内置事件域的分类如下：

- `chatluna/agent-*`：Agent 生命周期与工作
- `chatluna/skill-change`、`chatluna/skill-check`：技能
- `chatluna/memory-change`、`chatluna/before-memory-write`：记忆
- `chatluna/schedule-fire`、`chatluna/schedule-change`：定时任务
- `chatluna/permission-*`：权限
- `chatluna/span-start`/`span-end`：轨迹
- `mcp/servers-change`：MCP

## 继续

- [上下文 (Context)](./context)
