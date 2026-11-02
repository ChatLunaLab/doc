# MCP

`ctx.mcp`（由 `@chatluna/mcp` 提供）负责管理 MCP 服务器的生命周期、连接状态与工具投影。

## 服务器

| 方法 | 说明 |
| --- | --- |
| `registerServer(spec)` | 注册服务器（若 `id` 重复将抛出错误） |
| `servers()` / `getServer(id)` | 获取全部配置或指定 `id` 的配置 |
| `listServers()` | 获取包含当前连接状态的服务器列表 |
| `reconnect(id)` | 重新连接指定的服务器 |
| `probe(spec, signal?)` | 测试连接并返回该服务器的工具清单 |

服务器状态包括 `disabled`、`connecting`、`ready` 与 `unavailable` 等。连接失败时，具体的失败原因会保存在状态对象中。

## 传输方式

| 方法 | 说明 |
| --- | --- |
| `registerTransport(type, handler)` | 注册 `stdio` 或 `http` 传输处理器 |
| `transportsAvailable()` | 查询当前环境中可用的传输方式列表 |

具体的传输方式由其他插件提供。尝试连接时若未安装对应的传输处理器，连接将会失败。

## 工具

| 方法 | 说明 |
| --- | --- |
| `listTools(id, signal?)` | 获取指定服务器提供的工具列表 |
| `listAllTools()` | 获取全部服务器提供的工具列表 |
| `callTool(id, name, args, signal?)` | 直接调用指定服务器的特定工具 |

工具对外暴露给模型时会统一添加 `mcp__<id>__<name>` 前缀，工具名称会自动清洗至 64 字符以内。

## 事件

- `mcp/servers-change`：在服务器增删或状态变化时触发。
- `chatluna/tool-change`：在工具集合变化时触发，用于通知 Agent 及时刷新工具列表。

## 继续

- [MCP](/architecture/mcp)
