# 指令一览

::: tip
本节列出的所有 `chatluna.*` 指令均通过 `ctx.command` 注册，由 Koishi 风格的命令解析器处理（支持参数、选项和别名），而非在聊天文本中进行正则或模糊关键词匹配。
:::

你可以在支持的聊天平台或 WebUI 聊天页中直接发送指令调用对应功能。

::: warning
多数管理与控制指令要求发送者具备主人（Owner）身份。若你尚未完成绑定，请先使用绑定指令获取权限。
:::

## 管理会话

用于控制对话生命周期、分支与上下文生成的指令如下：

| 指令 | 别名 | 作用 |
| --- | --- | --- |
| `chatluna.status` | 无 | 查看当前会话状态 |
| `chatluna.new` | `new`、`chatluna.clear`、`clear` | 开启新对话，保留历史记录 |
| `chatluna.session.fork` | 无 | 从当前会话创建分支 |
| `chatluna.stop` | `stop` | 停止正在生成的回复 |
| `chatluna.compact` | `compact` | 压缩当前会话上下文 |
| `chatluna.undo` | 无 | 撤销上一步操作 |
| `chatluna.routes` | 无 | 列出当前活跃路由（隐藏指令） |

## 配置与模型切换

用于设置运行环境、身份绑定及切换底层模型供应商：

| 指令 | 参数 / 格式 | 作用 |
| --- | --- | --- |
| `chatluna.model` | `chatluna.model [provider/model]` | 查看或切换当前路由的模型 |
| `chatluna.setup` | 无 | 进入初始化向导 |
| `chatluna.bind` | `chatluna.bind <code>` | 输入绑定码绑定主人身份 |
| `chatluna.creator` | 无 | 开启创作者模式 |
| `chatluna.creator.off` | 无 | 关闭创作者模式 |

## 管理定时任务

通过 `chatluna.schedule` 子命令管理自动化计划任务：

| 指令 | 参数 / 选项 | 作用 |
| --- | --- | --- |
| `chatluna.schedule list` | 无 | 列出全部定时任务 |
| `chatluna.schedule add` | `--at\|--every\|--cron\|--watch <...> --reason <说明>` | 新建定时任务 |
| `chatluna.schedule pause` | `chatluna.schedule pause <id>` | 暂停指定任务 |
| `chatluna.schedule resume` | `chatluna.schedule resume <id>` | 恢复已暂停的任务 |
| `chatluna.schedule fire` | `chatluna.schedule fire <id>` | 手动触发一次指定任务 |
| `chatluna.schedule remove` | `chatluna.schedule remove <id>` | 删除指定任务 |

## 查询帮助

若需在终端或聊天窗口中随时查阅指令帮助：

- 输入 `help` 列出当前可用的全部指令。
- 输入 `help <指令名>` 查看具体指令的参数定义与使用示例（例如 `help chatluna.schedule add`）。

::: tip
如果你正在编写自定义插件，可以直接通过上下文对象 `ctx.command('chatluna.<子指令>')` 注册扩展指令，所注册指令同样遵循 Koishi 风格内核的参数与选项解析规则。
:::

## 下一步

- 了解如何配置模型与 Provider
- 编写插件并注册自定义指令
