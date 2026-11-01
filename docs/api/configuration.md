# 配置与数据目录

ChatLuna 没有全局单一的配置表，而是采用分层分级的配置管理模式。清单文件负责插件的组织与挂载，插件自身的 Cordis Schema 负责校验并解析传入的 `config`，场景规则与预设文件则在各自的输入边界独立校验。

本文汇总了常用默认配置、数据存储分布及核心环境变量。具体插件的完整可用字段，请以所安装插件版本实际导出的 Schema 为准。

## 配置分层架构

ChatLuna 的配置体系划分为以下层级：

| 层级 | 职责范围 | 边界与注意事项 |
| --- | --- | --- |
| Launcher 的 `config.yml` | 管理默认受管实例、安装源、更新策略与修复偏好 | 不作为机器人业务运行时清单 |
| 根清单及 include 文件 | 声明待加载插件条目、依赖关系和配置分组 | 不会自动扫描或加载同目录下未引用的 YAML 文件 |
| 插件 `config` | 插件自身服务配置，受插件的 Config Schema 约束与校验 | 不同插件的同名字段互不相通，语义以各插件定义为准 |
| 场景规则 | 根据平台、用户、群组等上下文条件动态解析的命名空间值 | 动态解析结果不一定会写回根清单文件 |
| 预设源文件 | 提示词模板、元信息以及特定预设的行为配置 | 属于预设域配置，不是实例全局环境变量入口 |
| 数据库与文件数据 | 持久化存储会话、业务索引、凭据、记忆及运行记录 | 移除或修改配置条目不会自动级联清理对应存储数据 |

插件应当遵循标准的 Cordis 生命周期，通过 `apply(ctx, config)` 接收配置注入。请不要自行读取未约定的环境变量，也不要跨包读取文件构建隐式配置。本文后文列出的环境变量仅用于 Launcher、容器部署与诊断通信边界，不能作为业务插件直接读取全局环境的依据。

## 根清单与条目结构

启动时，Launcher 会按以下顺序查找第一个存在的根清单文件：

1. `cordis.yml`
2. `cordis.yaml`
3. `chatluna.yml`
4. `chatluna.yaml`

在源码部署中，根清单（如 `cordis.yml`）通常会使用 `include` 引入独立的业务清单文件。如果修改了被引用的清单文件，但根清单未包含该文件，所做的修改将不会生效。

下面是独立插件配置条目的结构示例（非完整启动清单）：

```yaml
- id: example-greeting
  name: chatluna-plugin-greeting
  disabled: false
  config:
    greeting: Hello from greeting
```

条目关键字段说明：

- `id`：条目的唯一持久标识。修改已有配置时应保持原有 ID 不变，避免生成随机标识导致插件状态丢失。
- `name`：待加载的包名或插件标识。在运行环境中安装依赖包与在清单中挂载条目是两项独立操作。
- `disabled`：布尔值，用于控制该插件条目在启动时是否被 Cordis 加载。
- `config`：插件自身的配置对象，由插件导出的 Schema 负责解释，请勿混入其他插件的配置项。
- `group: true`：声明当前条目为配置分组。设为 `true` 时，`config` 内部应为子插件条目列表，而非普通条目的分组名称字符串。

Web 控制台或配置界面在保存配置时，可能会同时涉及文件与数据库写入。配置写入并不保证跨模型服务商、数据库与外部系统的全局事务一致性；控制台提示保存成功，仅表示本地清单或记录已写入，并不代表远端 Provider、通信 Adapter 或依赖服务已全部就绪。实际状态请结合运行时诊断日志判定。

## 默认数据位置与备份策略

系统包含两套核心数据目录：

- `CHATLUNA_DATA`：运行时数据根目录，默认值为 `data/chatluna`。相对路径基于主进程当前工作目录（PWD）解析，工作目录变动会导致实际定位路径改变。
- `CHATLUNA_HOME`：Launcher 主目录，默认值为 `~/.chatluna`。该目录专供 Launcher 工具链使用，与 `CHATLUNA_DATA` 相互独立。

常见数据资源及其默认存储路径如下：

| 资源类别 | 默认位置及说明 |
| --- | --- |
| 认证状态 | `CHATLUNA_DATA/auth.json`，存储访问口令哈希与签名密钥 |
| 机器凭据密钥 | `CHATLUNA_DATA/.secret-key`，解密机器运行凭据的必须私钥 |
| 预设源文件 | `CHATLUNA_DATA/presets/` |
| 会话大对象存储 | `CHATLUNA_DATA/blobs/`，路径由 SQLite 持久化插件的 `blobDir` 选项控制 |
| 配置快照 | 通过标准 Schema 加载时默认落盘于 `CHATLUNA_DATA/config-snapshots/` |
| 主业务数据库 | 路径由具体数据库插件配置指定，不能预设其一定位于 `CHATLUNA_DATA` 之内 |
| Docker 挂载点 | 官方 Compose 部署通过命名卷挂载整个 `/data`，涵盖容器实例运行全量上下文 |

### 备份要点与风险控制

1. **备份范围**：应同时包含根清单文件及其全部 `include` 引用文件、`package.json` 与依赖锁文件、业务数据库、整个 `CHATLUNA_DATA` 数据目录以及各附加工作区目录。
2. **数据库一致性**：直接对运行中的数据库进行文件拷贝可能导致数据损坏。请调用数据库原生备份机制，或在停机后执行快照备份。
3. **密钥关联性**：`.secret-key` 与数据库中的密文数据强绑定。若丢失 `.secret-key`，仅凭数据库文件将无法还原已加密的机器凭据。
4. **安全隔离**：切勿将持久化缓存、数据库文件、本地凭据或配置快照推送到公开代码仓库。配置快照可能包含敏感信息，且快照本身不能替代完整的系统数据备份。

## 认证与 HTTP 服务

`@chatluna/server` 负责路由鉴权与认证会话保护，底层的物理端口监听与协议传输由底层 Server 服务及外部部署配置共同驱动。

| 配置字段 | 默认值 | 语义与约束 |
| --- | --- | --- |
| `protectedPrefixes` | `['/api', '/console']` | 需要通过登录会话或 Token 校验的受保护路由前缀 |
| `publicPaths` | `['/api/auth/login', '/api/health']` | 豁免鉴权的公开接口白名单 |
| `token` | `''` | 访问口令。先选择非空 config.token，否则选择非空 CHATLUNA_TOKEN；所选值不合规时直接回到文件模式，不继续尝试另一来源 |
| `sessionTtlMs` | `2592000000` | 签名会话有效期，单位毫秒（默认 30 天） |
| `allowRemote` | `false` | 来源 IP 访问控制。默认仅接受本机请求；该行为独立于端口映射与监听网卡 |

### 口令规则与模式退化

当配置字段或环境变量提供的口令未达到强口令标准时，系统会忽略该输入并退化回 `auth.json` 维护的文件模式。手工口令必须满足以下条件：

- 长度至少 12 个字符；
- 不含空白字符；
- 至少覆盖三类字符集；
- 至少包含 6 种不同的独立字符。

在文件模式下，可以直接在管理后台修改口令。若使用配置或环境变量注入固定口令，修改时必须直接更新对应的注入源；仅删除 `auth.json` 并不能清除已生效的固定口令配置。

> **网络环境注意**：官方 Docker 镜像在容器内默认监听全部网卡（`0.0.0.0`）并允许容器网络互联，官方 Compose 默认将映射端口限制在宿主机环回地址（`127.0.0.1:5028`）。容器内的网络宽松策略不等于公网安全保障，本地源码运行默认值亦不可套用于容器化部署拓扑。

## Agent、会话与模型配置

默认 Agent 循环直接由 `@chatluna/agent` 驱动，系统不存在独立的 `agent-loop` 额外依赖包。Agent 的正常运转强依赖 `trace`、`presets`、`tool_search` 等核心服务协同工作，从默认套件中剥离依赖会导致流程异常。

| 服务组件 / 配置字段 | 默认值 | 语义与运行约束 |
| --- | --- | --- |
| Agent: `staleLimit` | `8` | 允许保留的历史旧工具名称上限，非模型请求重试次数 |
| Agent: `maxStepsPerTurn` | `60` | 单次交互轮次内模型执行的最大步骤数，非用户交互消息条数 |
| Agent: `maxParallelToolCalls` | `10` | 允许并发调用的工具数量上限，仍受限于各工具定义 traits 及顺序屏障 |
| conversations: `cacheSize` | `1000` | 会话 Head 指针在内存中的 LRU 缓存上限 |
| conversations: `flushMs` | `1000 ms` | 业务目录元数据写入合并防抖窗口，非全量 Session 内容的全局落盘周期 |
| conversations: `pageSize` | `50` | 目录查询分页默认拉取条数 |
| conversations: `maxLiveSessions` | `200` | 内存中驻留的活跃会话对象上限 |
| conversations: `idleEvictMs` | `1800000 ms` | 活跃会话对象空闲淘汰阈值（默认 30 分钟） |
| AI runtime: `idleTimeoutMs` | `180000 ms` | 模型连接空闲超时。设为 `0` 仅关闭此项检测，不覆盖底层网络传输超时 |
| SQLite: `spillThresholdBytes` | `65536` | 大对象外置落盘至 Blobs 目录的阈值（默认 64 KiB） |
| API: `maxReplayEvents` | `2000` | SSE 单次历史重放事件数量上限，超限时触发截断标记（truncated） |
| API: `defaultPageSize` | `50` | API 查询默认分页大小，具体 API 接口可自行施加更小限制 |
| subagent: `depthLimit` | `4` | 子代理嵌套调用的最大委派递归层数 |
| subagent: `defaultModel` | `@medium` | 未指定模型角色时，子代理默认绑定的模型路由标识 |

## 工具、权限与计算实例

工具的自动调用策略（`auto` / `ask` / `off`）与权限模式（Permission Mode）属于解耦字段，不可混为一谈。

### 权限与调用拦截

- **权限配置**：`permission mode` 默认值为 `files`；调用询问超时 `askTimeout` 默认值为 `120000 ms`；自动仲裁模型 `reviewer` 默认为 `@decide`。
- **角色映射**：平台群组角色与权能的默认数值映射为：`owner` = 4，`admin` = 3，`member` = 1。应用认证的全局 Master 与显式授权记录由系统独立治理。
- **工具策略**：每个工具的调用策略是 `auto` / `ask` / `off`（由 `@chatluna/tool-policy` 提供），与权限模式是两个独立维度：权限模式回答「这个人允许做什么」，工具策略回答「这个工具默认直接执行、先问还是关闭」。管理类能力（例如 `runtime:config`）作为权限动作参与判定，不经过工具策略。

### 工具搜索与延迟加载

- **检索规则**：`tool-search mode` 默认值为 `auto`；匹配阈值 `threshold` 默认值为 `20`（当前可用工具总数**严格超过**此值时激活检索，达到此值不触发）；`limit` 默认检索条数为 `5`（支持范围：1–20）。
- **延迟加载**：`autoDefer` 默认声明为 `['mcp__*']`。显式声明的常驻规则与延迟加载规则拥有更高优先级，可覆盖自动模式。
- **生效前提**：是否最终启用模型原生工具定义机制，取决于底层模型 Provider 的接口能力以及 Agent 当前的工具挂载模式。

### Computer 服务与沙盒

- `computer` 基础服务统一协调计算容器/环境实例，其底层执行环境的具体 `kind` 由后端适配插件注册支持。
- 当 `kind` 为 `Docker` 时：必须指定 `image` 字段；容器默认工作区路径 `root` 为 `/work`；空闲休眠超时 `idle` 默认值为 `600000 ms`。
- 系统暂停实例仅将容器置于 Pause 状态以节省 CPU 开销，**不等于**销毁或删除容器。

## 长期记忆系统

记忆系统的插件级 Config 与场景规则（Namespace 为 `memory`）采用双轨隔离设计。系统默认使用 Markdown 主题后端（`md`），不强制依赖向量数据库或图数据库支撑。

场景规则 `memory` 命名空间默认参数：

| 规则字段 | 默认值 | 语义与运行逻辑 |
| --- | --- | --- |
| `backend` | `md` | 记忆持久化后端类型 |
| `isolation` | `preset` | 可选 preset 或 conversation，限定自动索引范围 |
| `enabled` | `false` | 自动提取聊天记忆的开关，不控制所有手动读写与索引功能 |
| `gate` | `false` | 是否开启准入判定门禁 |
| `indexBudget` | `1500 token` | 记忆索引构建的最大 Token 预算上限 |
| `extractWindow` | `30` | 触发提取评估的新消息增量条数 |
| `recall.enabled` | `false` | 交互过程中的上下文自动召回开关 |
| `recall.interval` | `10` | 自动召回检测步长（每 10 条交互消息触发一次） |
| `dream.enabled` | `true` | 空闲整理机制总开关 |
| `dream.idleAfter` | `1800000 ms` | 触发空闲整理的非活跃静默时间（默认 30 分钟） |
| `dream.nightly` | `true` | 是否启用每日深整理定时作业 |
| `dream.cron` | `0 4 * * *` | 每日深整理的 Cron 表达式（默认每天凌晨 4 点） |
| `dream.maxActive` | `300` | 触发整理的活跃条目数阈值 |

- **模型路由默认值**：信息抽取 `extract`、整理 `dream`、召回 `recall` 默认映射至 `@small` 角色模型；准入门禁 `gate` 默认使用 `@decide` 模型。
- **生命周期策略**：归档数据默认保留 7 天，单个主题的历史快照保留上限为 10 份。
- **边界说明**：dream 是否启用与自动提取 enabled 是不同设置；不要将整理开关理解成每轮都会自动提取。isolation 为 conversation 时，自动注入索引的范围与工具搜索范围也不等同，详见[长期记忆](/manual/usage/memory)。

## 定时任务与后台关注

调度器的生命周期和执行频度受安全约束配置保护，防止资源耗尽。

| Schedule Config 字段 | 默认值 | 说明与约束 |
| --- | --- | --- |
| `minIntervalMs` | `300000 ms` | 周期性作业的最小调度间隔（默认 5 分钟，更低间隔需提权） |
| `maxJobsPerConversation` | `20` | 单个会话允许注册的调度任务（Job）最大数量 |
| `maxWakeupsPerConversation` | `5` | 单个会话允许挂起的被动唤醒订阅（Wakeup）最大数量 |
| `maxFiresPerDay` | `100` | 单个会话每日最大触发次数 |
| `judgeModel` | `@decide` | 评估条件触发与前置判定的模型角色 |
| `judgeMinIntervalMs` | `30000 ms` | 判定模型调用的最小防抖冷却间隔 |
| `judgeDailyBudget` | `200` | 全局每日判定模型调用预算次数限制 |
| `watchCheckMs` | `10000 ms` | 监听与轮询条件的检测周期（默认 10 秒） |
| `maxArmMs` | `86400000 ms` | 单次监听的最长有效激活期（默认 24 小时） |
| `graceMs` | `3600000 ms` | 错过预期触发时间后的追溯容忍宽限期（默认 1 小时） |

运行约束：

- 尝试注册小于 `minIntervalMs` 的 `every` 周期任务或高频 `check` 检查必须经过显式审批。
- 任务触发若延迟时间超出 `graceMs`，系统将直接放弃补发，不会无限制累积或并发风暴式触发。
- 唤醒作业中传入给模型的 `messages` 仅覆盖上一轮触发至本次唤醒之间的增量记录。
- 内存中持有的后台异步执行句柄与数据库持久化的 Job 记录在系统停机后具有不同生命周期，进程重启不承诺无缝恢复未完成的内存执行句柄。详见[定时与后台任务](/manual/usage/automation)。

## 配置快照与环境变量

### 配置快照机制

当运行时配置（Runtime Config）通过常规 Config Schema 正常加载时，系统自动接管快照：

- `snapshotsDir`：默认落盘于数据根目录下的 `config-snapshots` 目录。
- `writer`：快照轮转记录默认保留最近 10 份。
- `hotReload`：支持热重载监听，默认值为 `true`。

> 若通过代码直接初始化构造服务且在开发 API 入参中留空快照路径，系统将抑制写盘行为。该特定 API 测试行为不代表常规配置清单的生产默认机制。

### 环境变量矩阵

| 环境变量 | 职责范畴与消费边界 |
| --- | --- |
| `CHATLUNA_HOME` | Launcher 基础设施主目录，解析基座与 CLI 级缓存 |
| `CHATLUNA_DATA` | 业务与实例持久化数据根目录，未显式声明时回退至 `data/chatluna` |
| `CHATLUNA_TOKEN` | 固化访问凭据；同时兼作 `doctor providers` 命令的通信输入 |
| `CHATLUNA_BASE` | 诊断工具（如 `doctor providers`）发起回环校验的目标地址 |
| `CHATLUNA_DB_PATH` | 提供给会话诊断命令读取的 SQLite 路径；不用于全局变更主服务连接 |
| `CHATLUNA_TAG` | 官方 Docker Compose 编排指定的容器镜像版本标签 |
| `CHATLUNA_PORT` | 官方 Docker Compose 编排映射到宿主机的物理暴露端口 |
| `TZ` | 容器部署的时区定义（通常指定为 `Asia/Shanghai` 等） |
| `CHATLUNA_HOST` | 现有 Launcher 用于部署层级的接口监听覆盖，按稳定标识注入 |
| `CHATLUNA_ALLOW_REMOTE` | 现有 Launcher 用于快速关闭只允许本地回环限制的部署覆盖 |

排查配置异常时，应按序核对：实例启动目录 -> 实际加载的根清单 -> `include` 拓扑 -> 场景命名空间规则 -> 插件内部就绪状态。严禁在遇到配置未生效问题时，盲目尝试删除整个数据目录。具体排查指令参考 [CLI 参考](/api/cli)，系统错误征兆排查见[排错](/cookbook/troubleshooting)。
