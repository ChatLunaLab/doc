# MCP

`ctx.mcp`（`@chatluna/mcp`）管理 MCP 服务器、连接状态与工具投影。

## 服务器

| 方法 | 作用 |
| --- | --- |
| `registerServer(spec)` | 注册服务器（id 重复会抛错） |
| `servers()` / `getServer(id)` | 读取配置 |
| `listServers()` | 带状态的列表 |
| `reconnect(id)` | 重新连接 |
| `probe(spec, signal?)` | 试连并返回工具清单 |

服务器状态包括 `disabled`、`connecting`、`ready`、`unavailable` 等；失败原因记录在状态里。

## 传输方式

| 方法 | 作用 |
| --- | --- |
| `registerTransport(type, handler)` | 注册 `stdio` 或 `http` 处理器 |
| `transportsAvailable()` | 当前可用的传输方式 |

传输方式由其他插件提供；未安装对应传输时连接会失败。

## 工具

| 方法 | 作用 |
| --- | --- |
| `listTools(id, signal?)` | 某服务器的工具 |
| `listAllTools()` | 全部工具 |
| `callTool(id, name, args, signal?)` | 直接调用 |

对外暴露给模型时统一加上 `mcp__<id>__<name>` 前缀；名称会清洗到 64 字符以内。

## 事件

`mcp/servers-change` 在服务器增删或状态变化时触发；`chatluna/tool-change` 在工具集合变化时触发，用来让 Agent 刷新工具列表。

## 继续

- [MCP](/architecture/mcp)
