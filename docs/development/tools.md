# 开发模型工具

工具将模型生成的结构化调用连接到底层业务能力。在实现具体动作之前，必须先定义输入契约、声明副作用类别与权限规则。切勿将模型输出的 JSON 结构直接视为已执行成功的业务结果。

## 一个完整的只读工具

在已有插件的 `src/index.ts` 中注册工具：

```ts
import { Context, Schema } from '@chatluna/utils/cordis'
import type {} from '@chatluna/tool'

export const Config = Schema.object({})
export const name = 'chatluna-text-tools'
export const inject = ['tools']

export function apply(ctx: Context) {
  return ctx.tools.define({
    name: 'text_length',
    description: 'Count Unicode code points in the supplied text.',
    args: Schema.args({
      text: Schema.string().description('Text to count.'),
    }),
    result: Schema.object({
      length: Schema.number().required(),
    }),
    traits: { effect: 'read', parallel: true },
    run({ text }: { text: string }) {
      return { length: Array.from(text).length }
    },
  })
}
```

- **字符处理规范**：示例中通过 `Array.from(text).length` 统计 Unicode code points（码点数），而非字节数、Token 数量或用户感知字符簇（Grapheme Clusters）。
- **契约声明**：使用 `Schema.args` 定义工具调用参数，`result` 描述输出的结构化结果。
- **生命周期**：示例为同步执行，无需标记 `async`。`ctx.tools.define` 返回的 Disposer 函数直接由插件生命周期托管。
- **调用可用性**：注册成功的工具不会无条件进入单次请求的上下文，其可用性仍受路由机制、允许列表、可见性控制、当前工具模式（Tool Mode）以及冻结请求头影响。建议在管理界面的工具页确认注册状态，并在目标会话中审查实际请求载荷与返回结果。

## 定义契约

`ToolDefinition<A>` 的核心字段定义：

| 字段 | 职责说明 |
| --- | --- |
| `name` / `description` | 工具在当前注册层内唯一的调用名与功能说明。不得编写未经证实的安全性承诺。 |
| `args` | Cordis Schema，用于校验并约束模型传入的参数。 |
| `result` | 可选，描述工具输出的结构化结果 Schema。 |
| `traits` | 声明副作用（`effect`）、并发安全性（`parallel`）、同步等待超时及后台策略。 |
| `permission` | 细粒度权限能力名，或根据传入参数动态计算的鉴权目标。 |
| `run(args, call)` | 工具实际执行的业务逻辑函数。 |
| `forward` | 工具转发场景下的目标工具解析规则。 |
| `render.call` / `render.result` | 面向前台界面的展示描述配置，不参与执行实现。 |

> **契约约束**：不得使用 `parameters`、`execute` 或 `input` 等非标准 DSL 替代上述属性。常规工具调用由运行时统一执行校验、拦截与日志记录；在插件内直接调用 `run` 函数会绕过公共管线，导致鉴权与审计日志失效。

## 副作用与并发特性

工具必须通过 `traits` 显式声明其实际行为特征：

- **副作用类别 (`traits.effect`)**：
  - `'read'`：仅读取既有数据，不改变系统状态。注意：标为 `read` 不代表数据无敏感性，读取密钥等凭据仍需独立的权限控制。
  - `'write'`：修改本地文件、数据库记录或远端资源状态。声明为 `write` 不会自动获取对应资源的写入授权。
  - `'exec'`：执行 Shell 命令、动态脚本或外部程序代码。
  - **默认值**：若未显式声明，`effect` 默认为 `'exec'`。
- **并发控制 (`traits.parallel`)**：
  - 默认为 `true`（允许并发执行）。
  - 设置为 `parallel: false` 时，运行时会在此工具前后建立串行执行屏障。对顺序敏感、相互冲突的写入应禁用并发；非幂等本身不代表不同目标间不能并发。
- **批次调度保证**：批次执行工具时，运行时会严格维护调用标识（Call ID）与执行结果的映射关系，绝不会将先返回的异步结果错误指派给首个调用项。

## 调用上下文

执行函数签名为 `run(args, call)`，其中 `call` 参数提供运行时元数据：

- **上下文属性**：包含调用 ID、根请求 ID (`rootId`)、取消信号 (`signal: AbortSignal`)、调用者标识 (`caller`)，以及当前可用的 Agent、权限主体与路由身份。若业务依赖其他服务，应使用 `call.caller` 或显式传递外部传入的 `ctx`，切勿自行构造独立的 `Context` 实例。
- **取消信号传播**：对于长耗时操作，必须将 `call.signal` 向下传递给支持取消机制的底层 API。需要注意：
  - 收到取消信号仅代表终止后续任务，运行时无法自动回滚已提交的远端写入或已持久化的文件。
  - 退出前应清理临时状态，并在异常捕获中明确报告部分完成的情况，严禁在中断发生后谎报无副作用。
- **会话控制与输出**：
  - `call.note(message)`：向流程附加诊断或过程信息。
  - `call.end()`：提前终止后续控制流。上述方法均不得用于绕过鉴权或伪造用户确认。
  - **结果传递规范**：`run` 的返回值应为可序列化数据，不限于对象。大型文件或二进制附件应交由专用存储服务分发，不得拼接为超长字符串直接返回。

## 可见性、策略与能力授权

- **作用域隔离**：工具可注册在全局上下文，或特定的 Agent Scoped Context。当前 Agent 仅合并全局注册与自身作用域内的工具，无法访问其他 Agent 的局部工具；同一注册层内重名会抛出错误，Agent 局部层可以覆盖同名全局定义。
- **展示与拦截管线**：
  - `ctx.tools.filter`：从源头过滤模型可见的候选工具列表。
  - `visibility`：控制工具在不同场景下的暴露与调用规则。
  - `use`：为工具挂载通用的执行中间件。
  - *注意*：可见性仅代表是否将工具信息暴露给模型，不等于执行授权；模型即使通过提示词猜出工具名，未授权时仍会被拦截。
- **执行策略决策**：
  - 业务策略分为 `auto`（直接执行）、`ask`（等待人工确认）、`off`（禁用）。
  - 授权判定短路机制：若权限策略评估为 `deny`，调用立即终止；评估为 `ask` 时转入审批流。
  - 切勿将“工具已被模型看见”、“用户在上一轮会话中已批准”或“后台任务完成通知”作为本次高风险操作的授权依据。

## 工具模式

底层运行时工具模式分为：
- **`native`**：将筛选后的工具清单完整冻结并注入模型上下文。
- **`search`**：延迟载入非驻留工具，按需检索注入。
- **`code`**：仅保留代码执行入口与关键驻留工具，引导模型编写代码调用其他工具。

外层聊天引擎可能进一步扩展出如 `delegate` 等装配策略，系统不支持任意扩展未实现的模式枚举。此外，当前默认 Agent 高度依赖 `tool_search` 服务；即便某次会话指定为 `native` 模式，也不得在依赖列表或启动配置中剔除 `tool_search`。

冻结机制请参考 [Agent 执行](/architecture/agents)。

## 超时与后台任务

当系统中安装了后台任务服务（`background`）时：

- **同步等待机制**：同步等待调用结果的默认超时上限为 `180000` ms（3 分钟），可通过 `traits.timeout` 进行配置。
- **后台转移策略**：
  - 若调用耗时超过上限且未显式禁用后台化，原任务将被转移至 `background` 队列继续执行，本次同步调用将向模型返回包含任务标识的占位凭证。此占位凭证仅代表任务已转入后台，不代表业务执行成功。
  - 若显式配置 `traits.background: false`，超时触发时将直接中止任务（发出 Abort 信号），不转入后台。
- **环境要求与实现边界**：
  - 在未安装 `background` 服务的基础运行环境中，内核不提供超时自动接管保证。
  - 外部服务若本身不支持中断，即便超时取消，外部实际操作仍可能执行完毕。
  - 严禁单纯为了规避超时而无限调大 `traits.timeout`。对于长周期任务，必须提供明确的任务跟踪、进度汇报机制及持久化策略，详见 [定时与后台任务](/guide/automation)。

## 文件和命令工具的额外边界

- **统一抽象接入**：涉及宿主机或虚拟环境操作的工具，必须统一接入 `ctx.computer` 提供的 Machine 读写与执行接口，确保文件写入路径与 Shell 执行命令运行在同一目标机器实例中。
- **隔离环境差异**：`local`、`ssh`、`docker` 与 `e2b` 各种驱动的安全边界与文件所有权隔离级别完全不同。
- **安全边界提醒**：限定工作区（Workspace）目录路径并不等同于实现 Shell 沙箱隔离。子进程仍可能访问其环境可见的凭据与系统资源；挂载 Docker Socket 可能赋予宿主级控制能力，并非安全的默认设置。配置限制请参阅 [机器与工作区](/guide/machines)。

## 测试清单

在发布或集成工具前，需覆盖以下场景：

1. **输入参数**：验证合法参数、必填参数缺失、非法类型输入时的 Schema 校验反馈。
2. **输出约束**：验证 `result` 定义的 Schema 与实际返回值严格匹配。
3. **并发安全**：验证多工具并行执行时，`parallel: false` 能否正确阻塞后续工具。
4. **鉴权管线**：验证策略为 `deny` 时的短路拦截，以及 `ask` 状态下的审批挂起。
5. **异常与取消**：触发 `call.signal` 中断，验证长耗时操作能否退出并妥善清理资源。
6. **后台超时**：验证达到 `timeout` 后能否正确生成占位凭据并挂入后台队列。
7. **生命周期**：验证插件卸载后，`ctx.tools.define` 返回的 Disposer 是否正确注销工具。

> **测试方法提示**：验证时必须至少接入一次真实 `tools` 执行管线，切勿仅在单测中直接调用 `run(args, call)` 函数，避免因跳过 Schema 校验与安全中间件而遗漏缺陷。在评估调用行为时，需明确区分**模型返回 Tool Call**、**运行时执行工具**与**平台向用户渲染最终消息**这三个独立的阶段。

---

相关内容查阅：
- [插件生命周期](/development/plugins)
- [安全与权限](/guide/security)
- [HTTP 和实时协议](/development/api-reference)
