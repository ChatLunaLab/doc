# 定时任务与后台任务

`ctx.schedule`（由 `@chatluna/schedule` 提供）负责管理定时器、条件监视与会话唤醒；`ctx.background`（由 `@chatluna/background` 提供）则负责长任务的托管执行与状态通知。

## 定时任务

你可以通过 `ctx.schedule` 创建与调度定时任务。它支持单次执行、周期运行，以及按 key 去重覆写：

| 方法 | 说明 |
| --- | --- |
| `create(input)` | 创建新的定时任务 |
| `set(input & { key })` | 按 key 覆写任务：同一会话下相同的 key 仅保留一个 |
| `update(id, patch)` / `remove(id)` | 修改或删除指定任务 |
| `cancel(id)` | 取消指定任务（`remove` 的别名） |
| `list(filter?)` | 列出符合条件的任务列表 |
| `fire(id)` | 立即手动触发一次任务 |
| `runsOf(id, limit?)` | 获取指定任务的历史执行记录 |
| `stats()` | 获取任务、监视条件与唤醒的统计数据 |
| `scope(name, provider)` | 注册监视条件的作用域提供者 |

### 唤醒

唤醒机制用于在满足预设时机时，主动唤醒指定的会话：

| 方法 | 说明 |
| --- | --- |
| `wakeup(target, input)` | 安排一次会话唤醒 |
| `wakeupCount(key)` | 获取当前会话下指定 key 的唤醒任务数量 |
| `firesToday(key)` | 获取指定 key 今日已触发的次数 |

配置项 `input` 支持 `after`、`at`、`when`、`expires`、`fallback`、`times`、`gap`、`reason`、`key` 和 `cancelOn`。传入 `cancelOn: 'reply'` 时，一旦用户发送新回复，就会自动取消该唤醒任务。

### 监视条件

你可以通过 `when` 字段定义条件谓词表达式。`checkSource(source)` 会分析表达式依赖的来源（时间、消息或模型调用），并据此自动确定轮询检查频率。监视任务的消息计数会按 `messages` 从上次触发开始累计。

## 后台任务

如果某些长耗时操作无法在单个交互回合内同步完成，你可以将它们交给 `ctx.background` 托管：

| 方法 | 说明 |
| --- | --- |
| `start(input)` | 启动一个新的后台任务 |
| `adopt(work, input)` | 接管正在运行中的异步工作 |
| `get(id)` / `list({ owner? })` | 查询单个任务详情，或列出任务列表 |
| `listFor(agent)` / `itemFor(id, agent)` | 获取面向指定 Agent 的任务视图与条目 |
| `consume(item)` / `touch(item)` | 标记任务已读状态，或刷新心跳保活 |
| `deliver(item)` | 主动将任务执行结果投递给目标 |
| `prune()` | 清理已过期的历史后台任务 |

### BackgroundItem

后台任务实例 `BackgroundItem` 提供了控制生命周期与同步输出的接口：

| 成员 | 说明 |
| --- | --- |
| `log(line)` / `write(chunk, stream)` | 追加单行日志，或向指定数据流写入数据块 |
| `setProgress(text)` | 更新当前任务的执行进度描述 |
| `finish(status, value, error?)` | 标记任务结束（支持 `completed`、`failed`、`cancelled`） |
| `cancel(reason?)` | 向任务发送取消请求并记录原因 |
| `wait({ timeout? })` / `snapshot()` | 等待任务结束，或获取当前任务的状态快照 |
| `read({ from?, stream? })` | 读取任务缓冲区的输出日志或数据流 |

任务执行结束后，系统会根据配置的通知策略（如唤醒、合并至下一轮回复或静默记录）将结果回传给对应会话。

## 继续

- [定时任务与后台任务](/architecture/schedule-background)
