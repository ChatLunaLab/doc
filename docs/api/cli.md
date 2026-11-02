# 命令行参考

ChatLuna 的命令行由两部分组成，分别用于不同的管理场景：

- **全局 Launcher (`chatluna`)**：负责选择、创建、维护和管理实例的完整生命周期。
- **实例内 CLI (`@chatluna/cli`)**：由实例内部提供，负责执行配置诊断、会话排查与日志导出。

::: tip
IM 聊天平台中的 `/new` 等交互指令属于聊天插件命令，不属于终端 Shell 命令。本文档基于当前版本编写；由于不同版本的参数可能存在差异，执行操作前请以当前版本的 `chatluna --help` 输出为准。
:::

---

## 实例选择机制

对于接受实例参数的管理命令，Launcher 会按以下优先级依次确定目标实例：

1. **显式 `--dir <path>`**：直接使用指定的目录，不再根据实例名推导路径。
2. **当前工作目录推导**：未指定实例名时，若当前工作目录同时包含 `package.json` 与受支持的清单文件，则直接使用当前工作目录。
3. **显式实例名或默认配置**：指定实例名，或读取 Launcher 配置文件中的 `default` 字段；若未配置则回退到 `default` 名称，并在受管实例目录中检索。

受管实例默认存放在 `~/.chatluna/instances/<name>` 目录下。

你可以通过环境变量 `CHATLUNA_HOME` 覆盖 Launcher 的根目录。该目录下的 `config.yml`、`logs/`、`cache/` 和 `instances/` 均为 Launcher 级别的运行资源，请勿与具体实例内部的业务数据混淆。

### 清单查找规则

在目标目录中查找根清单时，Launcher 会严格按以下文件名优先级选取第一个存在的文件：

1. `cordis.yml`
2. `cordis.yaml`
3. `chatluna.yml`
4. `chatluna.yaml`

如果目录中同时存在多个匹配的清单文件，文件名包含 `chatluna` 的清单不一定会被优先加载。此外，根清单还可以通过 `include` 进一步引入其他配置文件。

---

## 实例生命周期管理

通过全局 Launcher，你可以快速创建、启动并管理实例：

```sh
chatluna create demo
chatluna start demo
chatluna list
chatluna stop demo
```

### 命令列表与参数

| 命令 | 作用 | 关键参数 |
| --- | --- | --- |
| `chatluna` / `chatluna start [name]` | 启动指定的受管实例或目录工程。 | `--dir <path>` 指定目录；`-d`, `--detach` 启用后台运行。 |
| `chatluna create <name>` | 创建新的受管实例。 | `--template <tpl>` 选择模板；`--pm <pm>` 指定包管理器；`--dir <path>` 指定生成路径。 |
| `chatluna list` | 列出所有受管实例。 | `--plugins` 查看插件信息，需配合 `--instance <name>` 或 `--dir <path>` 使用。 |
| `chatluna stop [name]` | 向运行中的 supervisor 进程发送 `SIGTERM` 信号以平稳退出。 | `--dir <path>` 指定目录。 |
| `chatluna restart [name]` | 向 supervisor 进程发送 `SIGHUP` 信号以触发重载。 | `--dir <path>` 指定目录。 |
| `chatluna dev [dir]` | 以 oxc-node 即时转译并开启 HMR 启动当前或指定目录工程；不启用生产模式的恢复机制与安全模式。 | `[dir]` 目标目录。 |

### 运行限制与说明

- **实例自动创建边界**：在默认启动行为下（未显式提供有效目录时），Launcher 允许自动创建尚不存在的受管实例；但如果传入任意不存在或未初始化的 `--dir` 路径，系统不会自动将其初始化为有效工程。
- **开发模式环境要求**：`chatluna dev` 必须在已有 `package.json` 与根清单的有效工程中执行。该模式使用 `@oxc-node/core` 直接转译源码并开启热重载（HMR），不会启用崩溃恢复与安全模式。
- **后台运行定位**：`--detach` 仅表示将当前进程放入后台执行，并不等同于注册了系统级开机自启服务（如 systemd 服务）。
- **崩溃恢复边界**：Supervisor 的崩溃自动恢复机制仅负责重新拉起进程，不具备外围系统的事务回滚能力，既无法恢复外部脚本的执行现场，也无法撤回已经发送到聊天平台的消息。

---

## 依赖与本地插件管理

针对特定实例，你可以管理其 npm 依赖包及本地扩展插件：

| 命令 | 用途 |
| --- | --- |
| `chatluna add <pkg...>` | 为所选实例安装依赖包。 |
| `chatluna remove <pkg...>` | 从所选实例中移除指定依赖。 |
| `chatluna link <path>` | 将本地已有的插件目录软链接接入实例。 |
| `chatluna unlink <name>` | 解除已链接的本地插件（参数标识以 CLI 实际帮助输出为准）。 |
| `chatluna new <kind> <name>` | 生成脚手架模板。`kind` 支持类型及参数以帮助为准，插件常用 `--webui`、`--service`。 |

上述命令均需通过 `--instance <name>` 或 `--dir <path>` 指明操作的目标实例。

::: warning
执行包与插件操作前，务必确认目标实例路径，防止本地开发配置或测试插件被直接写入生产环境。完成 npm 依赖安装、在根清单中挂载配置、依赖底层服务初始化就绪以及功能实际对外可用，属于四个独立的运行状态。
:::

```sh
# 示例：本地插件开发与接入流程
chatluna new plugin greeting --dir .
chatluna new plugin text-inspector --webui --dir .
chatluna link ./path/to/plugin --dir .
chatluna dev .
```

- **源码与依赖规范**：ChatLuna 仓库源码开发统一使用项目指定的 Yarn 规范，禁止混入其他包管理器的锁文件。
- **受管实例包管理**：独立受管实例使用的包管理器取决于实例创建选项及 `package.json` 元数据，严禁直接手动修改 `node_modules`。

---

## 更新、体检与修复

### 实例更新

`chatluna update [name]` 支持 `--dir <path>`、`--self`、`--plugins`、`--to <version>` 和 `--dry-run` 参数。

执行更新前，必须对以下关键资产建立完整备份：

- 根清单及其所有被 `include` 引入的文件
- `package.json` 与对应的包管理器锁文件
- 业务数据库文件
- 本地文件持久化数据
- 机器密钥

`--dry-run` 选项仅用于预演安装变更与依赖树差异，不具备备份功能，也不保证后续实际安装过程必然成功。

### 报告与修复

- `chatluna report [name]`：查看最新修复报告或 issue 草稿，支持 `--dir <path>`。
- `chatluna repair [name]`：执行实例修复操作，支持 `--dir <path>`。此操作会直接改动配置与代码，在启用了本地修复 Agent 策略时，执行后请务必仔细比对报告与代码、配置的差异。

::: danger
请勿将未经审阅的诊断报告包或日志文件公开发布到 Issue 等社区渠道。即使配置中的 Token 与密码已作遮蔽处理，运行日志中仍可能包含平台账号身份、本地系统绝对路径、业务会话内容以及外部 Tool 的原始调用输出。
:::

---

## 诊断排错与数据导出

Launcher 提供的 `doctor` 和 `export` 子命令会直接委托给目标实例内部的 `@chatluna/cli` 处理，支持通过 `--instance <name>` 和 `--dir <path>` 指定目标。

### 常用诊断命令

```sh
chatluna doctor config --dir .
chatluna doctor providers --dir .
chatluna doctor session <session-id> --dir .
chatluna doctor cache <session-id> --dir .
chatluna export <session-id> --dir .
```

::: tip
命令示例中的 `<session-id>` 为占位符，执行时请替换为真实会话 ID。子命令层级使用空格分隔（例如 `doctor config`），无需使用内部点分命名空间注册名。
:::

### 诊断行为说明

- **`doctor config`**：校验清单语法、配置项完整度与依赖定义。此项检查通过仅代表静态配置合规，不能保证外部远端服务（如第三方 LLM API）的网络连通性正常。
- **`doctor providers`**：向正在运行的应用进程发起调用以检索 Provider 状态。
  - 默认连接目标：`http://127.0.0.1:5028`
  - 覆盖连接地址：设置环境变量 `CHATLUNA_BASE`
  - 鉴权信息传递：设置环境变量 `CHATLUNA_TOKEN`（请勿在共享终端历史或公开脚本中泄露其实际值）
- **`doctor session` / `doctor cache`**：读取指定会话的日志与缓存物理结构。检查仅做静态解析，不会触发关联工具或副作用流程的二次执行。
- **`export <session-id>`**：导出指定会话的历史记录。具体输出目标路径与文件格式参见命令帮助。导出的数据文件仅供归档分析，不保证能够无损导入至其他不同版本的实例中，也不等同于重放调用模型（Replay）。
- **`CHATLUNA_DB_PATH`**：可通过该环境变量临时指定诊断工具读取的 SQLite 或业务数据库路径。该变量仅供诊断 CLI 读取数据，不会改变运行中实例原本挂载的数据库插件配置。

---

## IM 平台聊天命令

IM 聊天中的指令并非终端命令。平台实际生效的指令集合取决于当前实例加载的插件、权限注册以及配置。你可以在 Web 管理界面中查询，或通过 HTTP 接口 `GET /api/commands` 获取完整注册列表。

当前核心聊天插件（Chat Plugin）提供的基础命令如下：

| 命令 | 别名 | 功能说明 |
| --- | --- | --- |
| `chatluna.status` | 无 | 查看当前会话的状态、条目数与当前模型。 |
| `chatluna.model [ref]` | 无 | 查看当前模型；传入 `provider/model` 切换模型。 |
| `chatluna.session.fork` | 无 | 从当前会话创建分支，并把后续消息切到新会话。 |
| `chatluna.stop` | `stop` | 中止当前正在生成的回复，保留待处理输入。 |
| `chatluna.new` | `new`, `clear`, `chatluna.clear` | 开启新对话，旧会话完整保留。 |
| `chatluna.compact` | `compact` | 手动压缩当前会话（需要压缩服务在场）。 |
| `chatluna.bind <code>` | `bind` | 在平台私聊中认领向导生成的绑定码。 |
| `chatluna.setup` | 无 | 在主人私聊中进入人设访谈流程。 |
| `chatluna.schedule [action] [arg]` | 无 | 定时与关注任务：list / add / remove / pause / resume / fire。 |
| `chatluna.undo` | 无 | 撤销最近一次文件修改；`--turn` 撤销本轮全部改动，`--force` 忽略哈希守卫。 |
| `chatluna.routes` | 无 | 隐藏命令：列出当前活跃路由。 |

### 使用限制与注意点

1. **触发前缀**：命令在 IM 端是否需要带有 `/` 前缀（例如 `/new`），由实例中的指令解析配置决定。
2. **命令注册性质**：`/bind` 和 `/setup` 均为系统正式注册的匹配命令，不是依靠监听全局消息内容并进行关键词扫描实现的。
3. **权限判定**：在聊天中能够看到命令帮助或自动补全，并不代表发送账号具备执行权限。
4. **状态隔离**：调用 `chatluna.new` 开启新对话不会清理该用户的全局长期记忆（Long-term Memory）；调用 `chatluna.stop` 仅停止当前模型响应，已执行完成的外部工具副作用（如已发出的网络请求、已写入的数据）无法被自动撤销。

---

## 相关文档

- [配置参考](/api/configuration)：查看清单配置项说明与默认参数。
- [排错指南](/cookbook/troubleshooting)：定位常见运行时异常与服务连接错误。
