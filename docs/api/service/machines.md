# 机器 (Machines)

`ctx.computer`（`@chatluna/computer`）管理可执行命令与读写文件的机器：本地、SSH、容器、沙箱都走同一套接口。

## 注册与配置

| 方法 | 作用 |
| --- | --- |
| `kind(name, kind)` | 注册一种机器类型（`local` / `ssh` / `docker` / `e2b`…） |
| `kindNames()` / `kindConfigs()` | 已加载的类型与它们的配置 schema |
| `configure(config)` | 新增或更新一台机器的配置 |
| `list()` / `definitions()` | 机器列表与原始配置 |
| `bind(agent, name)` | 把某个 Agent 绑定到机器 |

`configure` 同时注册 `machine:<name>` 权限：`local` 等级 2，其他等级 4。

## 使用

| 方法 | 作用 |
| --- | --- |
| `of(agent?)` | 取该 Agent 当前使用的机器（绑定 → 路由默认 → `local`） |
| `usable(agent?)` | 过滤出路由白名单与权限都允许的机器 |
| `test(name)` | 试连；返回一个可用句柄 |
| `close(name, session?)` | 关闭机器（带 session 只关闭该会话的沙箱） |
| `useEnv(provider)` | 注册环境变量贡献者 |
| `encryptConfig(config)` / `plainConfig(name)` | 凭据加密与读取 |
| `path(machine, path)` / `contains(machine, path)` | 工作区路径解析与边界检查 |

## Machine 句柄

| 成员 | 作用 |
| --- | --- |
| `name` / `kind` / `os` / `root` / `isolated` | 基本属性 |
| `id` | 远程沙箱的重连标识（重启后用来找回） |
| `exec(request, signal?)` / `spawn(request)` | 执行命令 |
| `read` / `write` / `list` / `stat` / `remove` | 文件操作 |
| `watch?(path, listener)` | 文件变化订阅（可选） |

## 生命周期

会话作用域的机器记录在会话的 `computer/machine` 标记里，进程重启后按标记重连；共享作用域的机器在无人使用后按空闲时间暂停，再被引用时恢复。

## 继续

- [计算机使用](/architecture/computer)
- [机器（使用）](/manual/usage/machines)
