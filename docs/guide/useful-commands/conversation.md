# 会话指令

本页列出与会话直接相关的命令。

如果需要了解会话、路由、预设通道等概念，请先阅读 [会话系统](../session-related/conversation.md)。

## 创建新会话

使用 `chatluna.new` 创建一段全新的上下文。

```powershell
chatluna.new [title:text] -p <preset:string> -m <model:string> -c <chatMode:string>
```

| 参数 | 说明 |
| --- | --- |
| `title` | 可选，会话标题 |
| `-p` | 新会话初始使用的预设 |
| `-m` | 新会话初始使用的模型 |
| `-c` | 新会话初始使用的聊天模式 |

<chat-panel>
  <chat-message nickname="User">chatluna.new 翻译临时线 -p translator -c browsing</chat-message>
  <chat-message nickname="Bot">已创建并切换到新会话 翻译临时线。</chat-message>
</chat-panel>

:::warning 注意
`chatluna.clear` 是 `chatluna.new` 的别名。

它不是清空当前会话，而是新建一条会话并切换过去。
:::

## 切换会话

使用 `chatluna.switch` 在当前路由下的多条会话之间切换。

```powershell
chatluna.switch <conversation:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。支持列表序号、会话 ID 或会话标题 |

<chat-panel>
  <chat-message nickname="User">chatluna.switch 2</chat-message>
  <chat-message nickname="Bot">已切换到会话 2。</chat-message>
</chat-panel>

:::warning 注意
标题和纯数字都可能产生歧义。

建议先执行 `chatluna.list` 获取列表序号；如需精确操作，使用会话 ID。
:::

## 列出会话

使用 `chatluna.list` 查看当前路由下的会话列表。

```powershell
chatluna.list -p <page:number> -l <limit:number> -a --all
```

| 参数 | 说明 |
| --- | --- |
| `-p` | 页码，默认 `1` |
| `-l` | 每页数量，默认 `5` |
| `-a` | 包含已归档会话 |
| `--all` | 同 `-a` |

<chat-panel>
  <chat-message nickname="User">chatluna.list -l 3</chat-message>
  <chat-message nickname="Bot">以下是当前路由下的会话列表...</chat-message>
</chat-panel>

:::tip 提示
`-a` 和 `--all` 效果相同。
:::

## 查看当前活跃会话

使用 `chatluna.current` 查看当前正在使用的会话。

```powershell
chatluna.current -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `-p` | 查看指定预设通道中的当前会话 |

<chat-panel>
  <chat-message nickname="User">chatluna.current -p translator</chat-message>
  <chat-message nickname="Bot">当前通道 translator 的活跃会话如下...</chat-message>
</chat-panel>

## 重命名会话

使用 `chatluna.rename` 修改当前会话的标题。

```powershell
chatluna.rename <title:text> -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `title` | 新的会话标题 |
| `-p` | 定位到指定预设通道中的当前会话后再重命名 |

<chat-panel>
  <chat-message nickname="User">chatluna.rename 需求拆解临时会话</chat-message>
  <chat-message nickname="Bot">已重命名当前会话。</chat-message>
</chat-panel>

:::warning 注意
此命令修改的是当前会话（或 `-p` 指定通道中的当前会话），不支持指定任意会话。
:::

## 归档会话

使用 `chatluna.archive` 将会话归档，保留数据但不再占用活跃位置。

```powershell
chatluna.archive [conversation:string] -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。不传时默认归档当前会话 |
| `-p` | 在指定预设通道中解析目标 |

<chat-panel>
  <chat-message nickname="User">chatluna.archive</chat-message>
  <chat-message nickname="Bot">已归档当前会话。</chat-message>
</chat-panel>

## 恢复会话

使用 `chatluna.restore` 将已归档的会话恢复为活跃状态。

```powershell
chatluna.restore [conversation:string] -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。不传时默认按当前上下文解析 |
| `-p` | 在指定预设通道中解析目标 |

<chat-panel>
  <chat-message nickname="User">chatluna.restore 3</chat-message>
  <chat-message nickname="Bot">已恢复会话 3，并切换到该会话。</chat-message>
</chat-panel>

## 导出会话

使用 `chatluna.export` 将会话内容导出为文件，用于备份或分享。

```powershell
chatluna.export [conversation:string] -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。不传时默认导出当前会话 |
| `-p` | 在指定预设通道中解析目标 |

<chat-panel>
  <chat-message nickname="User">chatluna.export</chat-message>
  <chat-message nickname="Bot">已导出当前会话，并发送 Markdown 文件。</chat-message>
</chat-panel>

## 压缩会话

使用 `chatluna.compress` 对会话历史进行压缩，适用于 Infinite Context 场景。

```powershell
chatluna.compress [conversation:string] -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。不传时默认压缩当前会话 |
| `-p` | 在指定预设通道中解析目标 |

<chat-panel>
  <chat-message nickname="User">chatluna.compress</chat-message>
  <chat-message nickname="Bot">已执行历史压缩。</chat-message>
</chat-panel>

:::tip 提示
压缩历史不等于清空会话。它将旧聊天记录进行摘要和收缩处理。
:::

## 删除会话

使用 `chatluna.delete` 永久删除会话。

```powershell
chatluna.delete [conversation:string] -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `conversation` | 目标会话。不传时默认删除当前会话 |
| `-p` | 在指定预设通道中解析目标 |

<chat-panel>
  <chat-message nickname="User">chatluna.delete 4</chat-message>
  <chat-message nickname="Bot">已删除会话 4。</chat-message>
</chat-panel>

:::warning 注意
删除是永久操作。如不确定，建议先使用 `chatluna.archive`。
:::

## 修改当前会话设置

以下命令修改的是当前会话正在使用的配置。

如需修改当前作用域后续新会话的默认规则，参见下方的 [修改路由规则](#修改路由规则)。

### 切换模型

```powershell
chatluna.use.model <model:string> -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `model` | 目标模型名称 |
| `-p` | 目标预设通道 |

<chat-panel>
  <chat-message nickname="User">chatluna.use.model openai/gpt-4.1-mini</chat-message>
  <chat-message nickname="Bot">已切换当前会话使用的模型。</chat-message>
</chat-panel>

### 切换预设

```powershell
chatluna.use.preset <preset:string> -p <lane:string>
```

| 参数 | 说明 |
| --- | --- |
| `preset` | 新的预设值 |
| `-p` | 目标通道 |

<chat-panel>
  <chat-message nickname="User">chatluna.use.preset translator -p reviewer</chat-message>
  <chat-message nickname="Bot">已切换 reviewer 通道当前会话使用的预设。</chat-message>
</chat-panel>

:::warning 注意
`-p` 指定的是要操作的通道，不是新的预设值。新的预设值是位置参数 `<preset>`。
:::

### 切换聊天模式

```powershell
chatluna.use.mode <mode:string> -p <preset:string>
```

| 参数 | 说明 |
| --- | --- |
| `mode` | 目标聊天模式 |
| `-p` | 目标预设通道 |

<chat-panel>
  <chat-message nickname="User">chatluna.use.mode browsing</chat-message>
  <chat-message nickname="Bot">已切换当前会话使用的聊天模式。</chat-message>
</chat-panel>

## 修改路由规则

以下命令修改的是当前作用域（群聊或私聊）后续创建会话时的默认行为。

需要注意：`chatluna.use.*` 作用于当前会话，而 `chatluna.rule.*` 作用于当前作用域。

### 模型规则

```powershell
chatluna.rule.model [model:string] -f -c
```

| 参数 | 说明 |
| --- | --- |
| 不带参数 | 查看当前规则 |
| `model` | 设置新会话默认模型 |
| `-f` | 与模型名一起使用时，将该模型固定到当前作用域 |
| `-c` | 清除规则 |

<chat-panel>
  <chat-message nickname="User">chatluna.rule.model openai/gpt-4.1-mini</chat-message>
  <chat-message nickname="Bot">已设置当前作用域的新会话默认模型。</chat-message>
</chat-panel>

### 预设规则

```powershell
chatluna.rule.preset [preset:string] -f -n -c
```

| 参数 | 说明 |
| --- | --- |
| 不带参数 | 查看当前规则 |
| `preset` | 切换当前作用域的活跃预设通道 |
| `-n` | 将该预设设为后续新会话的默认预设 |
| `-f` | 命令接受该参数，但当前版本中尚不能作为可靠的"固定预设"功能使用 |
| `-c` | 清除活跃通道和默认预设规则 |

<chat-panel>
  <chat-message nickname="User">chatluna.rule.preset translator</chat-message>
  <chat-message nickname="Bot">已切换当前作用域的活跃预设通道。</chat-message>
</chat-panel>

### 模式规则

```powershell
chatluna.rule.mode [mode:string] -f -c
```

| 参数 | 说明 |
| --- | --- |
| 不带参数 | 查看当前规则 |
| `mode` | 设置新会话默认聊天模式 |
| `-f` | 与模式名一起使用时，将该模式固定到当前作用域 |
| `-c` | 清除规则 |

:::warning 注意
单独使用 `-f` 没有实际效果，需与具体模式一起传入。
:::

<chat-panel>
  <chat-message nickname="User">chatluna.rule.mode plugin -f</chat-message>
  <chat-message nickname="Bot">已固定当前作用域的新会话聊天模式。</chat-message>
</chat-panel>

### 共享模式

```powershell
chatluna.rule.share [mode:string]
```

| 参数 | 说明 |
| --- | --- |
| `mode` | 可选值：`shared`、`personal`、`reset` |
| 不带参数 | 查看当前模式 |

<chat-panel>
  <chat-message nickname="User">chatluna.rule.share shared</chat-message>
  <chat-message nickname="Bot">已将当前作用域切换为共享路由。</chat-message>
</chat-panel>

### 锁定会话管理

```powershell
chatluna.rule.lock [state:string]
```

| 参数 | 说明 |
| --- | --- |
| `state` | 可选值：`reset`、`true`、`on`、`lock`、`false`、`off`、`unlock`、`toggle` |
| 不带参数 | 按 `toggle` 处理 |

<chat-panel>
  <chat-message nickname="User">chatluna.rule.lock on</chat-message>
  <chat-message nickname="Bot">已锁定当前作用域上的会话管理动作。</chat-message>
</chat-panel>
