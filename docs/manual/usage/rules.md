# 场景规则

::: tip
本节介绍「场景规则」页面：通过配置规则，决定特定消息由哪个引擎、预设与模型处理。
:::

场景规则 (Routing) 是 ChatLuna 的消息分发中枢。实例接收到的每条消息都会依次进行规则匹配，所有命中规则的 `values` 将合并为该消息的最终生效配置，包括使用的引擎、预设、模型、渲染格式与权限模式。

## 规则的基本结构

一条场景规则由以下核心属性组成：

- **filter**：匹配条件，定义该规则生效的消息范围。你可以按平台、群组、频道、用户以及是否私聊等维度进行组合，支持 `and`、`or`、`not` 逻辑嵌套。
- **values**：命中规则后写入的配置项，按命名空间划分，例如 `chat.model`、`chat.engine`、`chat.preset`、`render`、`permissions`。
- **priority**：规则优先级。当一条消息同时匹配多条规则时，系统按优先级从低到高合并配置，高优先级规则会覆盖低优先级规则中的同名字段。
- **enabled**：是否启用该规则。

## 规则配置示例

以下是一个典型的规则集配置：

```yaml
rules:
  - id: global            # 兜底规则：所有消息默认走 character 引擎
    filter: { kind: 'true' }
    values:
      chat.engine: { id: character }
      chat.preset: { preset: murasame }
      chat.model: { model: 'azurekiln1:deepseek-v4.1-flash' }

  - id: mute-some-groups  # 静音规则：在指定群组内关闭机器人响应
    filter:
      kind: scope
      field: guild
      values: ['391122026', '872966382']
    values:
      chat.engine: { id: off }

  - id: setup             # 引导规则：私聊且未完成初始化时走 setup 引擎
    filter:
      kind: and
      operands:
        - kind: direct
        - kind: custom
          id: chatluna.setup-needed
    values:
      chat.engine: { id: setup }
    priority: 100
```

### 匹配条件说明

在上述示例中，使用了以下几种过滤器 (Filter)：

- `kind: 'true'`：始终匹配所有消息，通常用于基础兜底规则。
- `kind: scope`：作用域匹配，通过 `field` 指定匹配维度（如 `guild` 代表群组，也可指定平台或用户），并在 `values` 中列出匹配的目标标识符。
- `kind: direct`：匹配私聊会话。
- `kind: custom`：匹配自定义扩展条件（如 `chatluna.setup-needed` 检测是否需要初始化）。
- `kind: and`：逻辑与操作，当其 `operands` 列表中的所有子条件均满足时判定为命中。

::: warning
当多条规则同时命中时，系统完全依据 `priority` 数值决定覆盖顺序。请确保精细规则（如特定群聊或私聊引导）的优先级高于全局兜底规则，避免配置被意外覆盖。
:::

## 引擎配置

`chat.engine.id` 用于指定处理消息的目标引擎。不同的引擎具备不同的运行循环与内置工具集，常见取值如下：

- `character`：角色对话引擎。
- `agent`：Agent 任务执行引擎。
- `coding`：代码编写与辅助引擎。
- `setup`：初始化向导引擎。
- `off`：停用响应，机器人将忽略该范围内的消息。

## 下一步

- [角色与预设](./characters) — 配置 `chat.preset` 引用的预设内容
- [模型与提供商](./models) — 配置 `chat.model` 引用的模型服务
- [权限与安全](./permissions) — 查看 `permissions.mode` 及相关权限策略配置
