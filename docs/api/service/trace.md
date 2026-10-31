# 追踪与用量

`ctx.trace`（`@chatluna/trace`）记录调用树；`ctx.telemetry`（`@chatluna/telemetry`）统计用量与运行指标。

## 追踪

| 方法 | 作用 |
| --- | --- |
| `span(ctx, input)` | 开一个 span；当前 ctx 已有 span 时作为子节点 |
| `current(ctx)` | 取当前 ctx 上的 span |

`input` 包含 `name`、`kind`（`verb` / `chat` / `embed` / `tool` 等）、`attributes`、`session`、`startTime`。调用方插件名与用量配置（用途、标签）会自动写进属性。

### Span

| 成员 | 作用 |
| --- | --- |
| `id` / `traceId` / `parentId` | 标识 |
| `name` / `spanKind` / `status` | 名称、类别、状态 |
| `startTime` / `endTime` | 时间 |
| `attributes` / `error` / `session` | 属性、失败信息、会话 |
| `span(input)` | 开子 span |
| `end({ status?, error? })` | 结束 |
| `usage(usage)` | 记录 token 用量 |
| `set(key, value)` | 追加属性 |
| `bind(ctx)` | 把 span 挂到 ctx 上，后续 span 都以它为父 |

`chatluna/span-start` 与 `chatluna/span-end` 事件可被其他插件订阅；记录保留天数由 `retentionDays` 控制（默认 90 天）。

## 用量

| 方法 | 作用 |
| --- | --- |
| `snapshot()` | 当前统计快照 |
| `preview()` | 上报前的预览载荷 |
| `count(name, by?)` | 计数一个 `<域名>.<事件>` |
| `recordTurn(engineId)` | 记一次引擎回合 |

用量按引擎、模型、用途分桶；`/usage` 页面读的就是这里的快照与计费表。

## 继续

- [追踪与用量](/architecture/trace-usage)
- [观测（使用）](/manual/usage/observability)
