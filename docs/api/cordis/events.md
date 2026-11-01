# 事件 (Events)

事件是扩展点的主要形态。`ctx.on` 监听、`ctx.emit` 触发，注册跟随 fiber 自动清理。

## 调度模式

| API | 语义 |
| --- | --- |
| `ctx.on(event, listener)` | 注册监听 |
| `ctx.emit(event, ...args)` | 广播，不等待 |
| `ctx.serial(event, ...args)` | 串行等待所有监听 |
| `ctx.waterfall(event, carrier)` | 链式环绕，监听 `next()` 继续 |
| `ctx.bail(event, ...args)` | 任一否决即停 |

`waterfall` 的监听器签名是 `(carrier, next)`：改 `carrier` 再 `next()`，在 `next()` 前后做事。`bail` 的监听器返回否决即短路。

## 声明

跨包事件用模块增强声明到事件表：

```ts
declare module 'cordis' {
  interface Events {
    'my/event': (payload: MyPayload) => void
  }
}
```

事件名约定小写 `domain/verb`。

## 常用事件域

- `chatluna/agent-*`：Agent 生命周期与工作
- `chatluna/skill-change`、`chatluna/skill-check`：技能
- `chatluna/memory-change`、`chatluna/before-memory-write`：记忆
- `chatluna/schedule-fire`、`chatluna/schedule-change`：定时任务
- `chatluna/permission-*`：权限
- `chatluna/span-start`/`span-end`：轨迹
- `mcp/servers-change`：MCP

## 继续

- [上下文 (Context)](./context)
