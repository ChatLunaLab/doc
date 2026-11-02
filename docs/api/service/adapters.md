# 平台适配 (Adapters)

服务 `ctx.chatluna_adapters`（由 `@chatluna/adapter-webui` 提供）用于管理聊天平台适配器的目录、启用状态及机器人实例。

## 目录

| 方法 | 作用 |
| --- | --- |
| `list()` | 获取内置适配器描述（包含 id、平台、包名及配置 schema） |
| `register(descriptor)` | 注册额外的适配器描述 |
| `states()` / `state(id)` | 获取适配器的完整状态视图 |
| `bots(platform?)` | 获取各适配器当前在线的机器人实例 |

## 状态

| 方法 | 作用 |
| --- | --- |
| `save(id, input, by)` | 保存适配器配置（凭据单独加密存储） |
| `enable(id, by)` / `disable(id, by)` | 启用或停用指定的适配器 |
| `remove(id, by)` | 移除指定的适配器配置 |

`AdapterState` 包含以下字段：

- `installed`：依赖是否已安装
- `present`：配置文件中是否存在对应条目
- `enabled`：是否已启用
- `credentials`：凭据是否齐全
- `configSource`：schema 来源（已安装版本优先于内置版本）
- `bots`：机器人运行状态
- `issue`：当前配置存在的问题

## 与其他层的关系

- 实际的平台连接由底层的 Satori 适配器提供，本服务仅负责维护目录清单、配置及生命周期状态。
- 凭据保存后仅返回「已配置 / 缺失 / 不可用」状态，不会回显明文。

## 继续

- [适配器与消息入口](/architecture/adapters)
- [聊天平台（使用）](/manual/usage/adapters)
