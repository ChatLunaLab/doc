# 命令行参考

::: tip
命令行分两部分：全局启动器 `chatluna` 负责实例的选择、创建和生命周期；实例内的 `@chatluna/cli` 负责配置诊断、会话排查和导出。参数可能随版本变化，以 `chatluna --help` 为准。
:::

## 实例选择

接受实例参数的命令按以下优先级确定目标：

1. **`--dir <path>`**：直接使用该目录。
2. **当前目录**：未指定实例名，且当前目录同时有 `package.json` 和受支持的清单时，使用当前目录。
3. **实例名或默认实例**：使用指定的实例名，或启动器配置中的 `default`（未配置时为 `default`），在受管目录中查找。

受管实例位于 `~/.chatluna/instances/<name>`。`CHATLUNA_HOME` 可以覆盖启动器根目录，其下的 `config.yml`、`logs/`、`cache/` 和 `instances/` 都属于启动器，与实例的业务数据无关。

在目标目录中，依次查找 `cordis.yml`、`cordis.yaml`、`chatluna.yml`、`chatluna.yaml`，取第一个存在的作为根清单。根清单可以通过 `include` 引入其他文件。

## 生命周期

| 命令 | 作用 | 关键参数 |
| --- | --- | --- |
| `chatluna` / `chatluna start [name]` | 启动受管实例或目录 | `--dir <path>`；`-d`, `--detach` 后台运行 |
| `chatluna create <name>` | 创建受管实例 | `--template <tpl>`、`--pm <pm>`、`--dir <path>` |
| `chatluna list` | 列出受管实例 | `--plugins` 需配合 `--instance <name>` 或 `--dir <path>` |
| `chatluna stop [name]` | 向 supervisor 发送 `SIGTERM` | `--dir <path>` |
| `chatluna restart [name]` | 向 supervisor 发送 `SIGHUP` | `--dir <path>` |
| `chatluna dev [dir]` | oxc-node 即时转译并开启 HMR，不启用恢复和安全模式 | `[dir]` |

- 默认启动时可以自动创建不存在的受管实例；但 `--dir` 指向不存在或未初始化的目录时，不会自动初始化。
- `chatluna dev` 必须在已有 `package.json` 和根清单的目录中执行。
- `--detach` 只是后台运行，不会注册开机自启。
- supervisor 只负责重新拉起进程，不会回滚外部脚本，也撤不回已经发到聊天平台的消息。

## 依赖与本地插件

| 命令 | 作用 |
| --- | --- |
| `chatluna add <pkg...>` | 安装依赖 |
| `chatluna remove <pkg...>` | 移除依赖 |
| `chatluna link <path>` | 软链接本地插件目录 |
| `chatluna unlink <name>` | 解除链接 |
| `chatluna new <kind> <name>` | 生成脚手架，插件常用 `--webui`、`--service` |

这些命令都通过 `--instance <name>` 或 `--dir <path>` 指定目标。

```sh
chatluna new plugin greeting --dir .
chatluna new plugin text-inspector --webui --dir .
chatluna link ./path/to/plugin --dir .
chatluna dev .
```

::: warning
操作前确认目标实例，避免把开发中的插件写进生产环境。安装了 npm 包、在清单中挂载、依赖的服务就绪、功能真正可用，是四个独立的状态。
:::

仓库源码开发统一用 Yarn，不要混入其他包管理器的锁文件。受管实例的包管理器由创建选项和 `package.json` 决定，不要手动修改 `node_modules`。

## 更新与修复

`chatluna update [name]` 支持 `--dir <path>`、`--self`、`--plugins`、`--to <version>` 和 `--dry-run`。更新前请备份：

- 根清单及其 `include` 的文件。
- `package.json` 与锁文件。
- 业务数据库和本地持久化数据。
- 机器密钥。

`--dry-run` 只预演依赖变化，不做备份，也不保证实际安装一定成功。

- `chatluna report [name]`：查看最近的修复报告或 Issue 草稿。
- `chatluna repair [name]`：修复实例，会直接修改配置和代码。启用了本地修复 Agent 时，执行后请比对报告与实际改动。

::: danger
不要把未经审阅的报告或日志公开发布。即使令牌和密码已被遮蔽，日志中仍可能有平台账号、本地绝对路径、会话内容和工具的原始输出。
:::

## 诊断与导出

`doctor` 和 `export` 委托给实例内的 `@chatluna/cli`，用 `--instance <name>` 或 `--dir <path>` 指定目标：

```sh
chatluna doctor config --dir .
chatluna doctor providers --dir .
chatluna doctor session <session-id> --dir .
chatluna doctor cache <session-id> --dir .
chatluna export <session-id> --dir .
```

- **`doctor config`**：校验清单语法、配置完整度和依赖。只代表静态配置合规，不代表远端服务可用。
- **`doctor providers`**：请求运行中的实例查询提供商状态。默认连接 `http://127.0.0.1:5028`，用 `CHATLUNA_BASE` 覆盖地址，用 `CHATLUNA_TOKEN` 传递令牌。
- **`doctor session` / `doctor cache`**：静态解析会话日志和缓存结构，不会重新执行工具。
- **`export`**：导出会话历史，仅供归档分析，不保证能导入其他版本，也不是重放。
- **`CHATLUNA_DB_PATH`**：临时指定诊断读取的数据库路径，不影响运行中实例的数据库配置。

## 聊天指令

聊天中的指令不是终端命令，实际可用的指令取决于加载的插件、权限和配置，可以在 WebUI 中查看，或通过 `GET /api/commands` 获取。核心聊天插件提供：

| 命令 | 别名 | 说明 |
| --- | --- | --- |
| `chatluna.status` | — | 当前会话的状态、条目数和模型 |
| `chatluna.model [ref]` | — | 查看模型；传入 `provider/model` 切换 |
| `chatluna.session.fork` | — | 从当前会话分叉，后续消息进入新会话 |
| `chatluna.stop` | `stop` | 中止正在生成的回复，保留待处理输入 |
| `chatluna.new` | `new`, `clear`, `chatluna.clear` | 开启新对话，旧会话完整保留 |
| `chatluna.compact` | `compact` | 手动压缩当前会话（需要压缩服务） |
| `chatluna.bind <code>` | `bind` | 在私聊中认领绑定码 |
| `chatluna.setup` | — | 在主人私聊中进入人设访谈 |
| `chatluna.schedule [action] [arg]` | — | 定时与关注任务：list / add / remove / pause / resume / fire |
| `chatluna.undo` | — | 撤销最近一次文件修改；`--turn` 撤销本轮全部，`--force` 忽略哈希检查 |
| `chatluna.routes` | — | 隐藏命令，列出当前活跃路由 |

- 是否需要 `/` 前缀由指令配置决定。
- `/bind` 和 `/setup` 是正式注册的指令，不是靠扫描消息内容实现的。
- 能看到帮助或补全，不代表有执行权限。
- `chatluna.new` 不会清除长期记忆；`chatluna.stop` 只停止模型响应，已经执行的工具副作用无法撤销。

## 下一步

- [配置参考](/api/configuration) — 清单配置项与默认值。
- [排错与诊断](/cookbook/troubleshooting) — 常见运行异常。
