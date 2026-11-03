# 事件 (Events)

事件是插件间解耦与功能扩展的主要形态。你可以使用 `ctx.on` 注册监听，使用 `ctx.emit` 触发广播。监听器的生命周期与当前 fiber 绑定，所在上下文销毁时会自动清理。

## 调度模式

Cordis 提供了多种事件调度方式，用以满足不同的控制流需求：

| API | 语义 |
| --- | --- |
| `ctx.on(event, listener)` | 注册监听器 |
| `ctx.emit(event, ...args)` | 广播事件，不等待执行结果 |
| `ctx.serial(event, ...args)` | 串行执行并等待所有监听器完成 |
| `ctx.waterfall(event, carrier)` | 链式环绕传递，通过调用 `next()` 继续 |
| `ctx.bail(event, ...args)` | 遇到首个有效返回值时立即中断并返回该值 |

其中：

- `waterfall` 的监听器签名为 `(carrier, next)`。你可以在修改 `carrier` 后调用 `next()`，借此实现前后环绕逻辑。
- `bail` 会在任一监听器返回非空结果（或否决判定）时立即短路，不再继续调用后续监听器。

## 声明事件类型

对于跨包调用的事件，建议通过 TypeScript 模块增强将其添加到事件表中，以便获得完善的类型推导与代码提示：

```ts
declare module 'cordis' {
  interface Events {
    'my/event': (payload: MyPayload) => void
  }
}
```

事件名通常约定采用小写的 `domain/verb` 格式。

## 常用事件域

常见的内置事件域分类如下：

- `chatluna/agent-*`：Agent 生命周期与运行状态
- `chatluna/skill-change`、`chatluna/skill-check`：技能变动与检查
- `chatluna/memory-change`、`chatluna/before-memory-write`：记忆变动与写入前拦截
- `chatluna/schedule-fire`、`chatluna/schedule-change`：定时任务触发与变更
- `chatluna/permission-*`：权限控制
- `chatluna/span-start`、`chatluna/span-end`：链路与轨迹追踪
- `mcp/servers-change`：MCP 服务变动

## 下一步

- [上下文 (Context)](./context)
