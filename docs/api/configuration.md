# 配置与数据目录

::: tip
ChatLuna 没有一张全局配置表：清单负责组织和挂载插件，插件用自己的 Cordis Schema 校验 `config`，场景规则和预设在各自的边界上独立校验。本页汇总常用默认值、数据位置和环境变量，完整字段以所安装插件导出的 Schema 为准。
:::

## 配置分层

| 层级 | 负责 | 注意 |
| --- | --- | --- |
| 启动器 `config.yml` | 默认实例、安装源、更新与修复偏好 | 不是机器人的运行清单 |
| 根清单与 include | 插件条目、依赖关系和分组 | 不会自动加载同目录下未引用的 YAML |
| 插件 `config` | 插件自己的配置，由其 Schema 校验 | 不同插件的同名字段互不相干 |
| 场景规则 | 按平台、用户、群等条件解析出的命名空间值 | 解析结果不一定写回清单 |
| 预设源文件 | 提示词模板、元信息和预设行为 | 不是实例级的配置入口 |
| 数据库与文件 | 会话、索引、凭据、记忆和运行记录 | 删改配置条目不会清理对应数据 |

插件通过 `apply(ctx, config)` 接收配置，不应自行读取未约定的环境变量，也不应跨包读文件拼配置。本页列出的环境变量只用于启动器、容器部署和诊断。

## 根清单与条目

启动器依次查找 `cordis.yml`、`cordis.yaml`、`chatluna.yml`、`chatluna.yaml`。源码部署中根清单通常用 `include` 引入业务清单；被修改的文件如果不在引用链上，改动不会生效。

```yaml
- id: example-greeting
  name: chatluna-plugin-greeting
  disabled: false
  config:
    greeting: Hello from greeting
```

- `id`：条目的持久标识。修改时保持不变，否则插件状态会丢失。
- `name`：包名或插件标识。安装依赖和在清单中挂载是两步独立的操作。
- `disabled`：启动时是否跳过该条目。
- `config`：插件自己的配置，由插件的 Schema 解释。
- `group: true`：声明为分组，此时 `config` 是子条目列表。

在 WebUI 中保存配置可能同时写文件和数据库，但不保证与模型服务、数据库和外部系统之间的事务一致。「保存成功」只代表本地已写入，不代表提供商、适配器或依赖服务已经就绪。

## 数据位置与备份

- `CHATLUNA_DATA`：运行时数据根目录，默认 `data/chatluna`，相对于主进程的工作目录解析。
- `CHATLUNA_HOME`：启动器目录，默认 `~/.chatluna`，与 `CHATLUNA_DATA` 互相独立。

| 资源 | 位置 |
| --- | --- |
| 认证状态 | `CHATLUNA_DATA/auth.json`，令牌哈希与签名密钥 |
| 机器凭据密钥 | `CHATLUNA_DATA/.secret-key`，解密机器凭据所需 |
| 预设 | `CHATLUNA_DATA/presets/` |
| 大对象 | `CHATLUNA_DATA/blobs/`，由 SQLite 插件的 `blobDir` 控制 |
| 配置快照 | `CHATLUNA_DATA/config-snapshots/` |
| 主数据库 | 由数据库插件配置决定，不一定在 `CHATLUNA_DATA` 中 |
| Docker | 官方 Compose 用命名卷挂载整个 `/data` |

备份要点：

1. 包含根清单及其 include 文件、`package.json` 与锁文件、数据库、整个 `CHATLUNA_DATA` 和其他工作区目录。
2. 不要直接复制运行中的数据库文件，用数据库自带的备份机制或停机后快照。
3. `.secret-key` 与数据库中的密文绑定，丢了它就无法解密机器凭据。
4. 不要把数据库、凭据或配置快照推到公开仓库。快照可能含敏感信息，也不能代替完整备份。

## 认证与 HTTP

`@chatluna/server` 负责路由鉴权和登录会话，端口监听由底层 Server 服务和部署配置决定。

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `protectedPrefixes` | `['/api', '/console']` | 需要登录或令牌的路由前缀 |
| `publicPaths` | `['/api/auth/login', '/api/health']` | 免鉴权的公开路径 |
| `token` | `''` | 访问令牌。先取非空的 `config.token`，再取非空的 `CHATLUNA_TOKEN`；选中的值不合规时直接回退到文件模式，不会再尝试另一来源 |
| `sessionTtlMs` | `2592000000` | 登录会话有效期（30 天） |
| `allowRemote` | `false` | 默认只接受本机请求，与端口映射和监听网卡无关 |

手动设置的令牌必须至少 12 个字符、不含空白、覆盖至少三类字符、至少 6 种不同字符，否则会被忽略并回退到 `auth.json` 的文件模式。文件模式下可以在 WebUI 中修改令牌；固定令牌必须改它的来源，只删 `auth.json` 没用。

::: tip
官方 Docker 镜像在容器内监听 `0.0.0.0`，Compose 把映射端口限制在宿主机的 `127.0.0.1:5028`。容器内的宽松网络不等于公网安全，本地源码运行的默认值也不能套用到容器部署。
:::

## Agent、会话与模型

默认 Agent 循环由 `@chatluna/agent` 驱动，没有单独的 `agent-loop` 包。它依赖 `trace`、`presets`、`tool_search` 等服务，从默认套件中去掉它们会导致流程异常。

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| Agent `staleLimit` | `8` | 保留的历史旧工具名上限，不是重试次数 |
| Agent `maxStepsPerTurn` | `60` | 单轮内模型的最大步数，不是消息条数 |
| Agent `maxParallelToolCalls` | `10` | 并发工具调用上限，仍受工具的 traits 和顺序约束 |
| conversations `cacheSize` | `1000` | 会话 Head 的 LRU 缓存上限 |
| conversations `flushMs` | `1000 ms` | 目录元数据的写入合并窗口 |
| conversations `pageSize` | `50` | 目录查询的默认分页 |
| conversations `maxLiveSessions` | `200` | 内存中活跃会话的上限 |
| conversations `idleEvictMs` | `1800000 ms` | 活跃会话空闲淘汰时间（30 分钟） |
| AI runtime `idleTimeoutMs` | `180000 ms` | 模型连接空闲超时；`0` 只关闭这项检测 |
| SQLite `spillThresholdBytes` | `65536` | 大对象外置到 blobs 的阈值（64 KiB） |
| API `maxReplayEvents` | `2000` | SSE 单次重放事件上限，超出时标记 truncated |
| API `defaultPageSize` | `50` | API 默认分页，具体接口可以更小 |
| subagent `depthLimit` | `4` | 子代理嵌套的最大层数 |
| subagent `defaultModel` | `@medium` | 未指定时子代理使用的模型角色 |

## 工具、权限与机器

工具策略和权限模式是两个独立的维度：权限模式回答「当前用户允许做什么」，工具策略（`auto` / `ask` / `off`，由 `@chatluna/tool-policy` 提供）回答「这个工具默认直接执行、先询问还是禁用」。`runtime:config` 等管理能力作为权限动作参与判定，不经过工具策略。

- **权限**：`permission mode` 默认 `files`；`askTimeout` 默认 `60000 ms`；自动审核模型 `reviewer` 默认 `@decide`。平台角色默认映射为 `owner` = 4、`admin` = 3、`member` = 1，主人和显式授权另行管理。
- **工具搜索**：`tool-search mode` 默认 `auto`；工具总数**超过** `threshold`（默认 `20`）时启用搜索，等于时不启用；`limit` 默认 `5`（范围 1–20）。`autoDefer` 默认 `['mcp__*']`，显式的常驻和延迟规则优先于自动模式。是否使用模型原生的工具定义，取决于提供商能力和 Agent 的工具挂载模式。
- **机器**：`computer` 服务协调执行环境，`kind` 由后端插件注册。`Docker` 类型必须指定 `image`，工作区 `root` 默认 `/work`，空闲休眠 `idle` 默认 `600000 ms`。暂停只是 Pause 容器以节省 CPU，不会删除容器。

## 长期记忆

记忆插件的 Config 与场景规则中的 `memory` 命名空间是两套配置。默认使用 Markdown 主题后端（`md`），不依赖向量或图数据库。

| 规则字段 | 默认值 | 说明 |
| --- | --- | --- |
| `backends` | `['md']` | 读取时合并全部后端，新记忆写入第一个 |
| `isolation` | `preset` | `preset` 或 `conversation`，限定自动索引范围 |
| `enabled` | `false` | 自动提取开关，不影响手动读写和索引 |
| `gate` | `false` | 是否启用准入判定 |
| `indexBudget` | `1500 token` | 索引的 Token 预算 |
| `extractWindow` | `30` | 触发提取评估的新消息条数 |
| `recall.enabled` | `false` | 自动召回开关 |
| `recall.interval` | `10` | 每多少条消息检测一次召回 |
| `dream.enabled` | `true` | 空闲整理总开关 |
| `dream.idleAfter` | `1800000 ms` | 静默多久后触发整理（30 分钟） |
| `dream.nightly` | `true` | 是否每日深度整理 |
| `dream.cron` | `0 4 * * *` | 每日深度整理的时间（凌晨 4 点） |
| `dream.maxActive` | `300` | 触发整理的活跃条目阈值 |

- `extract`、`dream`、`recall` 默认使用 `@small`，`gate` 默认使用 `@decide`。
- 归档默认保留 7 天，每个主题最多保留 10 份历史快照。
- `dream` 与自动提取 `enabled` 互相独立。`isolation` 为 `conversation` 时，自动注入索引的范围与工具搜索的范围不同，详见 [长期记忆](/manual/usage/memory)。

## 定时任务

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `minIntervalMs` | `300000 ms` | 周期任务的最小间隔（5 分钟），更低需要审批 |
| `maxJobsPerConversation` | `20` | 每个会话的任务上限 |
| `maxWakeupsPerConversation` | `5` | 每个会话的唤醒订阅上限 |
| `maxFiresPerDay` | `100` | 每个会话每日的触发上限 |
| `judgeModel` | `@decide` | 条件判定使用的模型角色 |
| `judgeMinIntervalMs` | `30000 ms` | 判定调用的最小间隔 |
| `judgeDailyBudget` | `200` | 全局每日判定次数预算 |
| `watchCheckMs` | `10000 ms` | 关注条件的检测周期 |
| `maxArmMs` | `86400000 ms` | 单次关注的最长有效期（24 小时） |
| `graceMs` | `3600000 ms` | 错过触发后的补发宽限（1 小时） |

- 间隔小于 `minIntervalMs` 的 `every` 任务或高频 `check` 需要显式审批。
- 延迟超过 `graceMs` 的触发直接放弃，不会堆积补发。
- 唤醒任务的 `messages` 只包含上次触发以来的新消息。
- 内存中的后台执行句柄与数据库中的任务记录生命周期不同，重启后无法恢复未完成的执行。详见 [定时与后台任务](/manual/usage/automation)。

## 配置快照与环境变量

通过 Config Schema 正常加载运行时配置时，自动保存快照：`snapshotsDir` 默认为数据目录下的 `config-snapshots`，`writer` 默认保留最近 10 份，`hotReload` 默认 `true`。在代码中直接构造服务且不传快照路径时不会写盘，这只是测试用法，不是清单的默认行为。

| 环境变量 | 用途 |
| --- | --- |
| `CHATLUNA_HOME` | 启动器根目录 |
| `CHATLUNA_DATA` | 实例数据根目录，默认 `data/chatluna` |
| `CHATLUNA_TOKEN` | 固定访问令牌，也供 `doctor providers` 使用 |
| `CHATLUNA_BASE` | `doctor providers` 连接的地址 |
| `CHATLUNA_DB_PATH` | 会话诊断读取的 SQLite 路径，不影响主服务 |
| `CHATLUNA_TAG` | 官方 Compose 的镜像标签 |
| `CHATLUNA_PORT` | 官方 Compose 映射到宿主机的端口 |
| `TZ` | 容器时区，如 `Asia/Shanghai` |
| `CHATLUNA_HOST` | 启动器覆盖监听地址 |
| `CHATLUNA_ALLOW_REMOTE` | 启动器开启远程访问 |

配置不生效时，按顺序核对：启动目录 → 实际加载的根清单 → include 链 → 场景规则 → 插件就绪状态。不要直接删除数据目录。命令见 [命令行参考](/api/cli)，常见问题见 [排错与诊断](/cookbook/troubleshooting)。
