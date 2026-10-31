# 技能 (Skills)

`ctx.skills`（`@chatluna/skill`）汇总多个来源的技能目录，提供读取、脚本执行、环境变量与安装更新。

## 目录

| 方法 | 作用 |
| --- | --- |
| `list(agent?)` | 目录快照（名称、描述、来源） |
| `catalog(agent?)` | 仅条目列表 |
| `read(name, file?, agent?)` | 读取技能正文或包内文件 |
| `runScript(name, input, agent?)` | 运行技能脚本 |
| `source(source)` / `addSource(source, owner)` | 注册来源 |
| `disable(name, where, agent)` / `enable(...)` | 在全局或某个 Agent 上禁用/启用 |
| `isDisabled(name, agent?)` | 查询禁用状态 |
| `markDirty(agent?)` / `sync(agent?)` | 标记与刷新目录 |

`where` 取 `global` 或 `agent`。

## 环境变量

| 方法 | 作用 |
| --- | --- |
| `envForm(name, agent?)` | 技能声明的表单 |
| `setEnv(name, variable, value, agent?)` | 写入变量（需要 `skill:secrets` 权限） |

## 安装与更新

| 方法 | 作用 |
| --- | --- |
| `install(id, { by? })` | 从市场安装 |
| `update(name, { by? })` | 更新到最新 |
| `marketMeta(name)` / `marketCheck(name)` | 查询市场元数据与是否过期 |

## 来源优先级

工作区 > 内置（rank 600）> 宿主机目录（400）> 用户自定义（300）。同名技能按此顺序取第一个。

## 继续

- [技能](/architecture/skills)
- [技能（使用）](/manual/usage/skills)
