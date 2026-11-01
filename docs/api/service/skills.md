# 技能 (Skills)

`ctx.skills` 服务（由 `@chatluna/skill` 提供）负责汇总来自多个来源的技能目录，提供技能读取、脚本执行、环境变量配置与安装更新等能力。

## 目录

你可以通过以下方法检索技能目录并控制其可用状态：

| 方法 | 作用 |
| --- | --- |
| `list(agent?)` | 获取技能目录快照（包含名称、描述与来源） |
| `catalog(agent?)` | 仅获取条目列表 |
| `read(name, file?, agent?)` | 读取技能正文或包内文件 |
| `runScript(name, input, agent?)` | 运行技能脚本 |
| `source(source)` / `addSource(source, owner)` | 注册技能来源 |
| `disable(name, where, agent)` / `enable(...)` | 在全局或指定 Agent 上禁用或启用技能 |
| `isDisabled(name, agent?)` | 查询指定技能的禁用状态 |
| `markDirty(agent?)` / `sync(agent?)` | 标记脏状态并刷新技能目录 |

其中 `where` 参数可取 `'global'` 或 `'agent'`，分别表示在全局生效或仅对特定 Agent 生效。

## 环境变量

| 方法 | 作用 |
| --- | --- |
| `envForm(name, agent?)` | 获取技能声明的环境变量表单 |
| `setEnv(name, variable, value, agent?)` | 写入环境变量（需要 `skill:secrets` 权限） |

## 安装与更新

| 方法 | 作用 |
| --- | --- |
| `install(id, { by? })` | 从市场安装指定技能 |
| `update(name, { by? })` | 更新指定技能至最新版本 |
| `marketMeta(name)` / `marketCheck(name)` | 查询市场元数据与检查是否过期 |

## 来源优先级

当不同来源存在同名技能时，系统将按以下优先级选取第一个匹配的技能：

工作区 > 内置（rank 600）> 宿主机目录（400）> 用户自定义（300）。

## 继续

- [技能](/architecture/skills)
- [技能（使用）](/manual/usage/skills)
