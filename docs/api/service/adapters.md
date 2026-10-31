# 平台适配 (Adapters)

`ctx.chatluna_adapters`（`@chatluna/adapter-webui`）管理聊天平台适配器的目录、启用状态与机器人实例。

## 目录

| 方法 | 作用 |
| --- | --- |
| `list()` | 内置适配器描述（id、平台、包名、配置 schema） |
| `register(descriptor)` | 注册额外的适配器描述 |
| `states()` / `state(id)` | 带状态的完整视图 |
| `bots(platform?)` | 各适配器当前在线的机器人 |

## 状态

| 方法 | 作用 |
| --- | --- |
| `save(id, input, by)` | 保存配置（凭据单独加密） |
| `enable(id, by)` / `disable(id, by)` | 启用与停用 |
| `remove(id, by)` | 卸载 |

`AdapterState` 里包含 `installed`、`present`、`enabled`、`credentials`、`configSource`、`bots`、`issue`：分别表示依赖是否安装、配置文件条目是否存在、是否启用、凭据是否齐全、schema 来源（已安装优先于内置）、机器人状态与配置问题。

## 与其他层的关系

- 真正的平台连接由 Satori 适配器包提供；本服务只负责目录、配置与状态。
- 凭据保存后只返回「已配置 / 缺失 / 不可用」，不回显明文。

## 继续

- [适配器与消息入口](/architecture/adapters)
- [聊天平台（使用）](/manual/usage/adapters)
