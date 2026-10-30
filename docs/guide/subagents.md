# 子代理

子代理把边界明确的工作交给另一个执行单元，例如只读查找、代码任务或结构化分析。模型、工具、机器、权限、上下文继承和生命周期都要分别确定，不能把它当成主模型无限复制自己的开关。

## Profile 与一次任务

profile 定义可复用方案：名称、`backend`、模型、工具过滤、机器、权限模式、提示词、输出 schema、继承方式与 lifetime。run 是它的一次执行，状态为 running、completed、failed 或 cancelled。

具名 profile 可按场景限制可见列表，外部 backend 也有路由白名单。已注册不等于当前会话可调用。不要只在描述里写「只读」，要实际限制工具与权限模式。

## 默认模型不继承主聊天

默认模型为 `@medium`，profile 可指定 `provider:model` 或角色。最终选择由默认模型、显式值、调用时 level 与 maxLevel 共同决定。small/medium/large 是模型档位，不是权限 level 1–5。

主聊天选 A、`@medium` 指向 B 时，子代理可能用 B。控制成本应检查角色指向、任务数量与输入体积，而不只降低主聊天输出上限。

默认委派深度上限为 4，限制递归层级，不等于并行任务预算或总 token 上限。

## 内部与外部 backend

| 项目 | default 内部 backend | 外部 CLI backend |
| --- | --- | --- |
| 执行 | ChatLuna 子 Agent 与引擎 | Machine.spawn 启动外部进程 |
| 会话 | 有内部 Agent 会话 | 不伪造内部 Agent |
| 工具 | 内部工具与权限管线 | 外部程序与机器权限共同决定 |
| 继续任务 | 活着的 session lifetime 可 send | 一次性，不支持 continuation |
| 输出 | 文本或 submit 结构化结果 | backend 支持时可使用输出 schema |

当前提供 opencode、codex、claude、pi CLI backend 插件。使用前在目标机器安装程序、检查 PATH 并完成它要求的登录。主 ChatLuna 的 provider key 不等于外部 CLI 已登录。外部 backend 属于高权限能力，要单独审查机器和凭据。

字段名为 `backend`，不是旧 `runtime`。

## 继承上下文

默认子会话是独立根会话，任务说明应包含目标、允许修改范围、已有证据、验收方式与输出格式。

- `none`：只传任务与 profile 输入，不代表机器文件系统隔离。
- `summary`：通过 compaction 摘要器压缩父上下文，有损且可能额外调用模型。缺少 compaction 时当前实现告警并退为不继承。
- `fork`：引用父会话的用户/assistant 文本，不复制完整工具状态或外部环境，也不是 Session 存储分支。
- `files`：类型中接受此值，但当前默认 backend 的消息装配没有专门的文件继承实现，按只传任务处理。需要的文件应明确提供并核对机器访问范围。

不要传无关私聊、密钥或整段历史来代替明确任务说明。

## 生命周期与结果

`once` 用于一次性工作，`session` 用于需要继续沟通的内部任务。只有仍存活的 default-backend session run 可以继续发送消息，完成的一次性任务不能任意恢复。

句柄提供 result Promise、status、send 和 dispose。Promise 已结算仍需检查结果 status，不代表成功。取消传播中止，不自动回滚已完成的文件写入和远端请求。

后台通知是任务事件，不是用户确认或新增授权。主代理要核对结果与证据后再整合，不能把辅助模型的自信表述当作验证。

## 推荐使用方式

- 先用只读 profile 定位跨文件事实，再由主代理决定改动。
- 只委派能独立执行且验收清楚的工作；已知目标的小查找直接完成。
- 避免多个写任务同时改同一文件；机器隔离不等于 Git 合并隔离。
- 在阶段边界结束冗长任务，用事实交接替代无限 continuation。
- 需要结构化结果时声明 schema；失败应保留错误，不用默认值掩盖。

## 排错

| 现象 | 检查 |
| --- | --- |
| 找不到 profile | 注册、路由允许列表与当前主体 |
| 模型不符 | profile.model、defaultModel、角色指向与 maxLevel |
| 无法继续 | backend、lifetime、状态与 Agent 是否存活 |
| 外部 CLI 起不来 | 机器、PATH、安装、登录、输出协议与退出码 |
| 无权使用机器/backend | 路由白名单、capability 与主体权限 |
| 继承信息不足 | inherit、摘要与任务输入；files 不会自动复制文件 |

继续阅读[机器与工作区](/guide/machines)、[后台任务](/guide/automation)和[Agent 执行循环](/architecture/agents)。
