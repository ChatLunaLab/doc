# 术语表

::: tip
控制台和日常交流中，同一个中文词可能对应完全不同的实现。排查故障、编写插件或调用接口时，以本表的语义为准。
:::

## 配置与运行时

| 术语 | 含义 | 不等于 |
| --- | --- | --- |
| **instance / 实例** | 独立的运行环境，有自己的 `package`、根清单和运行时数据 | 单个机器人账号或浏览器标签页 |
| **launcher** | 全局 `chatluna` 命令，负责实例选择、进程、依赖和故障恢复 | 业务服务本身 |
| **manifest / 清单** | Cordis 加载的插件配置树，可用 `include` 引入其他文件 | 环境变量集合或运行时数据库 |
| **entry / 配置条目** | 清单中带固定 `id` 的插件或分组 | 会话日志中的 `SessionEntry` |
| **fiber** | Cordis 中一次插件挂载的生命周期与资源归属边界 | 系统线程或容器级隔离 |
| **inject** | 插件声明依赖服务、并按依赖挂载子树的机制 | 运行时轮询服务是否可用 |
| **HMR** | 开发时的热重载，只卸载受影响的插件并重建其生命周期 | 所有执行上下文都不受中断 |
| **config transaction** | 配置写入、校验并应用到运行时的完整流程 | 跨数据库或跨节点的分布式事务 |
| **safe mode / 安全模式** | supervisor 提供的最小化恢复环境，用于排查启动故障 | 抵御恶意插件的沙箱 |

## 对话与执行

| 术语 | 含义 |
| --- | --- |
| **conversation** | 面向用户或路由的逻辑会话，索引、主线切换和活跃执行由 `conversations` 服务负责 |
| **head** | 当前对话指向的 `Session` 引用，不是日志条目的快照 |
| **Session** | 有序、仅追加的会话日志与视图，持久化由 `SessionStore` 负责 |
| **SessionEntry** | `Session` 的条目，分为 `message`、`cut`、`mark` 三类；`n` 是递增的绝对序号 |
| **message** | 已提交的聊天消息，不包括流式生成中的临时文本 |
| **cut** | 上下文截断点与摘要，只改变之后构建上下文的视图，不删除历史 |
| **mark** | 带名称的状态标记，只在系统内部流转，不作为消息发给模型 |
| **draft** | 正在生成、尚未提交的内容，不保证落盘 |
| **committed** | 已被 `Session` 追加的条目，落盘时机取决于 store 实现 |
| **Agent** | 有独立状态、输入队列和驱动循环的执行体，不同于存储中的 `Session` |
| **turn** | Agent 的一次执行轮次，可包含多次推理和工具调用 |
| **step** | 一次模型推理请求及其前后的上下文处理 |
| **Run** | 一次 chat 推理的流式传输与结果封装，不包括工具调用的完整闭环 |
| **receive next** | 新输入进入待处理队列，当前轮结束后在下一轮执行 |
| **receive now** | 在当前 step 的边界插入新输入，不会打断正在等待的外部请求 |
| **receive quiet** | 只写入日志、不唤醒空闲的 Agent，不能作为输入已被处理的凭证 |
| **abort** | 请求中断当前执行；已发出的请求、写入或消息无法撤回 |
| **branch / fork** | 从某个日志位置派生新的 `Session`；不会自动切换 `head`，需要上层 conversation 切换 |
| **lane** | 路由层划分消息流向的逻辑通道，不同于 `Session.branch`，也不提供安全隔离 |
| **compaction** | 生成摘要并插入 `cut` 来缩减上下文，与供应商的 prompt cache 无关 |

::: tip
日志序号 `n` 不等于页面上的消息下标：`mark`、`cut` 和界面合并都会造成偏移。HTTP 参数 `seq`、SSE 的 `id`、前端的 `revision` 和数据库主键不能混用。
:::

## 模型

- **provider**：接入协议或供应商的适配实现。配好密钥只代表凭据就绪，不代表端点可用。
- **model address**：模型地址，运行时写作 `provider:model`；部分预设元数据也接受 `provider/model`。
- **role / 模型角色**：`@small`、`@medium`、`@large`、`@decide` 等用途绑定，不对应特定品牌、价格或绝对能力。
- **modality / 模态**：`chat`、`embed`、`rerank`、`draw`、`speak`、`listen`、`decide`。`decide` 是专用于结构化裁决的模态，不同于普通的 JSON 输出。
- **verb / 动词**：模型调用的入口：`ask`、`chat`、`extract`、`embed`、`rerank`、`draw`、`speak`、`listen`、`decide`、`decideOne`、`judge`。
- **resolve / bind / call**：一次调用的三个阶段：确定目标模型、绑定到适配器、发起请求。前两个阶段同样可能失败。
- **generation**：提供商适配器重新挂载时递增的代际编号，不是提示词缓存的 epoch。
- **usage**：标准化的 Token 用量。供应商返回的输入、缓存读写和推理 Token 之间可能有包含关系，不能直接相加。

## 上下文与缓存

- **preset / 预设**：系统管理的 Markdown 源文件及其元数据、片段和配置。「伪装」只是预设的一种用法，不是独立的协议。
- **prompt zones**：提示词分为 `system`、`context`、`input` 三区。`system` 放稳定前缀以利用缓存，`context` 放动态数据和历史。分区只是结构，不是可信与不可信内容的安全边界。
- **mutable variable**：每轮都可能变化的变量。用在 `system` 区会直接抛出 `MutableVariableError`，不会静默降级。
- **epoch**：提示词或工具定义前缀的缓存边界，不是会话分叉，也不是模型版本。
- **cache break**：向供应商声明的缓存断点，是否命中和计费优惠由供应商决定。
- **memory scope**：长期记忆的作用域，包括全局、预设、群、用户和对话。群聊中可能合并近期发言者的用户记忆。
- **memory index**：自动注入上下文的主题摘要，不是记忆全文。会话隔离只收窄自动注入的范围，不限制有权限的 `memory_search` 检索其他范围。

## 能力与权限

| 术语 | 含义 |
| --- | --- |
| **tool** | 注册给模型的动作，有 `args` 和 `run`。模型看到 schema 不代表调用已被批准 |
| **tool search** | 按需发现并延迟挂载工具以缩小提示词，不能绕过权限 |
| **MCP** | Model Context Protocol，连接外部工具和资源；对端的安全、凭据和连通性需要单独配置 |
| **skill** | 可检索、可激活的操作说明或能力资源，加载它不会带来额外权限 |
| **tool auto / ask / off** | 工具策略：自动运行（仍受权限约束）、需要审批、禁用。与 `permission mode` 是不同维度 |
| **permission mode** | 权限求值策略，如 `read-only`、`files`、`auto`、`allow`，结果由身份、规则和操作等级共同决定 |
| **machine** | `computer` 服务管理的执行后端，如 `local`、`ssh`、`docker`、`e2b` |
| **sandbox** | 执行环境提供的隔离，取决于 machine 后端，不会因为「启用工具」自动获得 |
| **background** | 异步任务的调度与追踪，进程崩溃后不保证恢复未完成的任务 |
| **subagent** | 父任务派生的子执行体。`inherit none` 只隔离上下文，不提供系统或文件层面的隔离 |
| **settled** | 执行进入终态，包括失败和取消，不等于成功 |

## 诊断与协议

- **trace / 轨迹**：基于日志和执行上下文生成的诊断视图，不是第二套状态数据。
- **reconstruct / 请求重建**：在本地还原当时的请求结构，不调用模型，不执行工具。
- **replay / 重放**：基于历史边界重新调用模型，会真实计费，但不重新执行工具，也不修改原 `Session`。
- **durable SSE**：推送已提交的 `Session` 条目，可用 `sessionId:n` 游标断线续传。内存模式下不能抵御进程崩溃。
- **live SSE**：推送未提交的生成快照和增量。其中的 `revision` 只用于前端同步，不能作为 durable SSE 的续传游标。
- **state / action**：WebUI 使用的强类型状态快照和操作协议，与对话 SSE 相互独立。
- **access token / 访问令牌**：登录实例用的令牌，不是模型供应商的密钥；登录后签发的会话凭据是另一回事。
- **owner / 主人**：经确认的平台管理身份，单独设置的权限等级以权限记录为准。WebUI 没有多用户账号体系，统一使用实例的访问令牌认证。
- **idempotency / 幂等**：防止重复提交。HTTP 层的幂等记录在内存中，有时间窗口，重启后丢失，不保证跨进程的 exactly-once。

更多底层机制见 [架构总览](/architecture/)。
