# 插件、运行时与数据

Cordis 管理插件与服务生命周期；配置、安装、会话持久化和业务索引各有所有者。理解这些边界，才能判断热更新、卸载、备份和恢复实际能保证什么。

## 清单如何装配服务

宿主先加载 Loader，再加载 include 等组合插件。Loader 提供条目与加载机制，不自行扫描业务 YAML。根清单由宿主选择，include 再组合业务清单和本地覆盖。

仓库默认 `cordis.yml` 是基础入口，`chatluna.yml` 组合业务插件。`chatluna.local.yaml` 是局部覆盖，不可当作根清单，否则会缺少基础设施。开发入口由 launcher 选择。

条目 `id` 是稳定标识，`name` 是包名，`config` 交给插件 Config schema，`disabled` 控制禁用。`group: true` 表示分组条目，其 config 是子条目列表，不是“所属分组”的字符串。

必需服务写进 `inject`，由 Cordis 等待依赖。服务存在不代表所有实现就绪：computer 不保证 docker kind 在场，MCP 不保证连接成功，模型运行时不保证 SDK 安装成功。

## 生命周期与所有权

工具、提示词块、监听器、路由、前端入口和定时器归属调用方 fiber，卸载时清理自己的资源。依赖服务被卸载也可能使依赖它的插件停用，因此 HMR 不是“其他运行一律不受影响”的保证。

Agent scoped context 注册的工具和提示词只合并到该 Agent。辅助函数接收调用方 ctx，不创建替代根 Context，不跨 fiber 保留失效 context，也不销毁别人的 fiber 来管理自己的资源。

## 独立包不等于可选依赖

| 层 | 职责 |
| --- | --- |
| agents / sessions / tools / prompt | 执行与记录 |
| conversations / chat / engines | 身份、业务 head 与引擎装配 |
| provider 注册与 SDK | 远端连接与协议转换 |
| persistence / storage | 会话与附件保存 |
| memory / schedule / computer / subagent | 各域扩展 |
| ui-server 与域 webui | 管理界面与实时数据 |

当前默认 Agent 的启动依赖包括 `trace`、`presets`、`tool_search`。移除可能令循环无法挂载，不只是少一个页面。以实际 `inject` 与组合清单为准。

## 配置事务

`ctx.chatluna_config` 返回普通条目视图，不把 Loader 内部 Entry/fiber 对象当作业务协议。

- `entries()` / `entry(id)`：读取视图。
- `change(input)` / `changeMany(inputs, options)`：修改条目。
- `reset` / `erase` / `reload`：重置、移除与重载，参数以导出契约为准。
- `transact`：将预设、权限和规则等非条目写入接入同一事务管线。

```ts
await ctx.chatluna_config.change({
  id: 'example-plugin',
  options: { config: { enabled: true } },
  by: 'settings',
  reason: 'enable example plugin',
})
```

流程为 snapshot → apply → audit；失败后恢复涉及文件并反向撤销本次 Loader 操作。Promise 成功结算表示已应用，没有另一个 `afterApply` 接口。

这是配置层事务，不撤回外部 API、云资源等全部副作用，不提供跨系统全局原子性。

## 快照、安装与恢复

正常经 Config schema 加载时，`snapshotsDir` 默认是 `data/chatluna/config-snapshots`（随 `CHATLUNA_DATA` 改变）；writer 保留默认 10 份。直接构造服务且不传目录时不写磁盘快照，这与清单加载的默认配置不同。变更前复制涉及文件，meta 记录原始路径。Loader 成功启动后可生成 `good: true` 的已知可用快照，daemon 将其作为恢复候选。

配置快照不是全量备份。数据库、Session blobs、记忆、机器密钥和外部工作区不自动包含。Supervisor、恢复模式与 dev 模式不同，HMR 不替代生产恢复。

`ctx.chatluna_installer` 位于 runtime-packages，与可选市场解耦。安装成功不等于挂载成功：还需要清单、依赖和有效配置。SDK 与插件是宿主进程内可执行代码；按需安装不提供沙箱，已加载 SDK 的版本变化可能需要重启。

运行时工具 off / inspect / full 限制模型管理宿主，不替代管理员、操作系统和部署边界。

## 数据分别归谁

| 数据 | 所有者 / 典型位置 | 备份关注点 |
| --- | --- | --- |
| 配置树与覆盖 | Loader / runtime-config | 全部 include 与覆盖 |
| entries 与 header | sessions + persistence | 数据库、附件 blobs |
| 当前 head 与列表索引 | conversations | 不替代 Session 真相 |
| 预设 | presets 托管目录 | 原文件、revision、审计 |
| 长期记忆 | memory 后端 | 默认 Markdown 主题、索引、历史、任务 |
| 用量与实验 | billing / trace 表 | 保留周期与敏感载荷 |
| 机器与技能加密值 | computer / skill | 密文与 SecretBox 密钥 |
| 临时后台输出 | background 内存缓冲 | 不承诺重启保留 |

默认 `CHATLUNA_DATA` 为 `./data/chatluna`，主数据库常在 `./data/chatluna.db`，位于该目录之外。只复制子目录可能漏掉数据库；实际路径按配置和工作目录核对。

恢复前停止写入或取得一致性备份，恢复到同版本隔离实例。检查配置、解密、会话、预设与记忆后，再开放平台和自动任务，不让两份实例同时使用同一机器人或执行同一日程。

继续阅读[插件开发](/development/plugins)、[会话与分支](/architecture/sessions)、[CLI 参考](/reference/cli)和[安全与权限](/guide/security)。
