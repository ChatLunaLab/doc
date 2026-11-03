# 追踪与用量

`ctx.trace`（`@chatluna/trace`）用于记录模型与工具调用的调用树；`ctx.telemetry`（`@chatluna/telemetry`）负责统计用量与运行指标。

## 追踪

| 方法 | 作用 |
| --- | --- |
| `span(ctx, input)` | 创建一个 span；当前 `ctx` 已存在 span 时自动作为其子节点 |
| `current(ctx)` | 获取当前 `ctx` 上关联的活跃 span |

`span()` 接收的 `input` 参数包含 `name`、`kind`（如 `verb`、`chat`、`embed`、`tool` 等）、`attributes`、`session` 与 `startTime`。调用方插件名与用量配置（用途、标签）会自动写入属性中。

### Span

| 成员 | 作用 |
| --- | --- |
| `id` / `traceId` / `parentId` | 标识信息（Span ID、链路 Trace ID 与父节点 ID） |
| `name` / `spanKind` / `status` | Span 名称、类别与执行状态 |
| `startTime` / `endTime` | 起始与结束时间戳 |
| `attributes` / `error` / `session` | 属性集合、失败异常信息与关联会话 |
| `span(input)` | 创建并开启子 span |
| `end({ status?, error? })` | 结束当前 span，可传入最终状态与错误信息 |
| `usage(usage)` | 记录 Token 用量 |
| `set(key, value)` | 向当前 span 追加自定义属性 |
| `bind(ctx)` | 将 span 挂载到指定 `ctx` 上，后续创建的 span 将默认以它为父节点 |

插件可以订阅 `chatluna/span-start` 与 `chatluna/span-end` 事件，监听 span 的生命周期变化。历史追踪记录的保留天数由 `retentionDays` 控制（默认 90 天）。

## 用量

| 方法 | 作用 |
| --- | --- |
| `snapshot()` | 获取当前用量统计快照 |
| `preview()` | 获取数据上报前的预览载荷 |
| `count(name, by?)` | 按 `<域名>.<事件>` 格式累加计数 |
| `recordTurn(engineId)` | 记录指定引擎执行的一次完整回合 |

用量数据按引擎、模型与用途分桶统计。控制台 `/usage` 页面会直接读取此处的统计快照与计费表完成展示。

## 继续

- [追踪与用量](/architecture/trace-usage)
- [观测（使用）](/manual/usage/observability)
