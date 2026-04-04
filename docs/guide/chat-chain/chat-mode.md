# 聊天模式

聊天模式决定了 ChatLuna 在一轮对话中的行为方式。不同的模式下，模型的能力范围不同。

目前 ChatLuna 支持以下几种聊天模式：

- **chat**：基础聊天模式。适用于普通对话，同时支持预设中的常见能力，如世界书、作者注释和长期记忆。
- **agent**：工具调用模式。模型可以在对话中调用工具、拆分任务和执行操作。
- **browsing**：联网检索模式。模型会先从外部获取信息，再结合检索结果进行回答。适用于查询最新信息或处理网页相关的轻量任务。

## 配置

### chat

`chat` 是主插件内置模式，无需额外安装。

### agent

`agent` 也是主插件内置模式。

该模式本身只提供"允许模型调用工具"的能力，工具需要另行安装。

:::tip 提示
ChatLuna 主插件不内置可供 `agent` 模式使用的工具。

一般需要安装 [`chatluna-plugin-common`](../../ecosystem/introduction.md) 或 [`chatluna-mcp-client`](../../ecosystem/plugin/mcp-client.md) 等插件来提供工具支持。
:::

### browsing

`browsing` 是官方维护的聊天模式，但未打包进主插件。

需要额外安装 `chatluna-search-service` 才能使用。安装方式参见 [生态介绍](../../ecosystem/introduction.md)。

## 修改聊天模式

ChatLuna 提供了多种方式来修改聊天模式，适用于不同场景。

### 新建会话时指定

在创建会话时通过 `-c` 参数直接指定聊天模式：

```powershell
chatluna.new [title:text] -c <chatMode:string>
```

<chat-panel>
  <chat-message nickname="User">chatluna.new 调试会话 -c plugin</chat-message>
  <chat-message nickname="Bot">已创建并切换到新会话 调试会话。</chat-message>
</chat-panel>

此操作只影响新建的会话，不会修改已有会话。

### 修改当前会话

在已有会话中切换聊天模式，使用 `chatluna.use.mode`：

```powershell
chatluna.use.mode <mode:string> -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `mode` | 目标聊天模式 |
| `-p` | 目标预设通道。仅在需要操作其他通道时指定 |

<chat-panel>
  <chat-message nickname="User">chatluna.use.mode browsing</chat-message>
  <chat-message nickname="Bot">已将当前会话切换为 browsing 模式。</chat-message>
</chat-panel>

如果存在多条预设通道，也可以单独修改其中一条：

```powershell
chatluna.use.mode plugin -p translator
```

### 修改当前作用域的默认模式

修改当前群聊或私聊作用域中，后续新建会话所使用的默认聊天模式，使用 `chatluna.rule.mode`：

```powershell
chatluna.rule.mode [mode:string] -f -c
```

| 参数 | 说明 |
| --- | --- |
| `mode` | 要设置的默认聊天模式 |
| `-f` | 与 `mode` 一起使用时，将该模式固定到当前作用域 |
| `-c` | 清除当前作用域上的模式规则 |

<chat-panel>
  <chat-message nickname="User">chatluna.rule.mode browsing</chat-message>
  <chat-message nickname="Bot">已将当前作用域的新会话默认模式设置为 browsing。</chat-message>
</chat-panel>

如需将模式锁定，防止被修改：

```powershell
chatluna.rule.mode plugin -f
```

:::warning 注意
单独使用 `-f` 没有实际效果。`-f` 只有与具体模式一起传入时才会生效。
:::

## 全局默认值

主插件配置中的 [`defaultChatMode`](../useful-configurations.md#defaultchatmode) 是全局层面的默认值：

- 当当前作用域没有额外规则时，新会话会使用该值
- 不会覆盖已有会话的设置
- 不会替代 `chatluna.rule.mode` 设置的规则

各层级的优先级如下：

| 层级 | 说明 |
| --- | --- |
| `defaultChatMode` | 整个插件的全局默认值 |
| `chatluna.rule.mode` | 当前作用域的默认值 |
| `chatluna.new -c` | 新建会话时的显式指定 |
| `chatluna.use.mode` | 当前会话的即时修改 |
