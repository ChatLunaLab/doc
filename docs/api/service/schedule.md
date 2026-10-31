# 定时任务与后台任务

`ctx.schedule`（`@chatluna/schedule`）管理定时器、条件监视与唤醒；`ctx.background`（`@chatluna/background`）管理长任务的执行与通知。

## 定时任务

| 方法 | 作用 |
| --- | --- |
| `create(input)` | 新建任务 |
| `set(input & { key })` | 按 key 覆盖：同一会话同 key 只保留一个 |
| `update(id, patch)` / `remove(id)` | 修改与删除 |
| `cancel(id)` | 删除任务（`remove` 的别名） |
| `list(filter?)` | 列出任务 |
| `fire(id)` | 立即触发一次 |
| `runsOf(id, limit?)` | 历史执行记录 |
| `stats()` | 任务/监视/唤醒的计数 |
| `scope(name, provider)` | 注册监视条件的作用域 |

### 唤醒

| 方法 | 作用 |
| --- | --- |
| `wakeup(target, input)` | 安排一次唤醒 |
| `wakeupCount(key)` | 当前会话的唤醒数量 |
| `firesToday(key)` | 今日已触发次数 |

`input` 支持 `after`、`at`、`when`、`expires`、`fallback`、`times`、`gap`、`reason`、`key`、`cancelOn`。`cancelOn: 'reply'` 表示用户一回复就取消。

### 监视条件

`when` 是谓词表达式；`checkSource(source)` 会分析它用到了时间、消息还是模型调用，据此决定检查频率。监视任务按 `messages` 从上次触发开始计数。

## 后台任务

| 方法 | 作用 |
| --- | --- |
| `start(input)` | 启动一个后台任务 |
| `adopt(work, input)` | 接管已在运行的工作 |
| `get(id)` / `list({ owner? })` | 查询 |
| `listFor(agent)` / `itemFor(id, agent)` | 面向 Agent 的视图 |
| `consume(item)` / `touch(item)` | 标记已读与保活 |
| `deliver(item)` | 主动投递结果 |
| `prune()` | 清理过期任务 |

### BackgroundItem

| 成员 | 作用 |
| --- | --- |
| `log(line)` / `write(chunk, stream)` | 追加输出 |
| `setProgress(text)` | 更新进度 |
| `finish(status, value, error?)` | 结束（`completed` / `failed` / `cancelled`） |
| `cancel(reason?)` | 请求取消 |
| `wait({ timeout? })` / `snapshot()` | 等待与快照 |
| `read({ from?, stream? })` | 读取缓冲输出 |

结束后按配置的通知方式（唤醒、下一轮、静默）把结果交回会话。

## 继续

- [定时任务与后台任务](/architecture/schedule-background)
