# 机器 (Machines)

`ctx.computer`（`@chatluna/computer`）负责统一管理可执行命令与读写文件的运行环境。无论是本地进程、SSH、容器还是云端沙箱，均通过统一接口进行交互。

## 注册与配置

| 方法 | 作用 |
| --- | --- |
| `kind(name, kind)` | 注册一种机器类型（如 `local`、`ssh`、`docker`、`e2b` 等） |
| `kindNames()` / `kindConfigs()` | 获取已加载的类型列表及其配置 Schema |
| `configure(config)` | 新增或更新指定机器的配置 |
| `list()` / `definitions()` | 获取机器列表与对应的原始配置定义 |
| `bind(agent, name)` | 将指定的 Agent 绑定到对应机器 |

调用 `configure()` 时会自动注册 `machine:<name>` 权限。其中 `local` 的权限等级为 2，其他类型为 4。

## 使用

| 方法 | 作用 |
| --- | --- |
| `of(agent?)` | 获取该 Agent 当前使用的机器（按「绑定 → 路由默认 → `local`」顺序解析） |
| `usable(agent?)` | 过滤出路由白名单与用户权限均允许调用的机器 |
| `test(name)` | 测试机器连通性，并返回可用的机器句柄 |
| `close(name, session?)` | 关闭机器实例；传入 `session` 时仅关闭该会话对应的沙箱 |
| `useEnv(provider)` | 注册环境变量提供者 |
| `encryptConfig(config)` / `plainConfig(name)` | 加密存储配置凭据或读取解密后的明文配置 |
| `path(machine, path)` / `contains(machine, path)` | 解析工作区路径或检查目标路径是否在安全边界内 |

## Machine 句柄

| 成员 | 作用 |
| --- | --- |
| `name` / `kind` / `os` / `root` / `isolated` | 机器基本属性 |
| `id` | 远程沙箱的重连标识，用于进程重启后找回已有实例 |
| `exec(request, signal?)` / `spawn(request)` | 执行命令或创建进程 |
| `read` / `write` / `list` / `stat` / `remove` | 工作区文件与目录操作 |
| `watch?(path, listener)` | 监听工作区文件变化（可选） |

## 生命周期

会话作用域的机器状态会保存在会话的 `computer/machine` 标记中，进程重启后将依据标记自动重连；共享作用域的机器在无人使用后会在达到空闲超时时暂停，当再次被调用时恢复。

## 继续

- [计算机使用](/architecture/computer)
- [机器（使用）](/manual/usage/machines)
