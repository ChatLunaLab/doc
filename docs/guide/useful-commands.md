# 指令列表

本章节介绍了 ChatHub 提供的所有命令，以及它们的用法和参数。

这些命令可以在聊天中使用，控制和配置 ChatHub 的各种功能。

你可以查看右侧的目录，快速找到你想要了解或使用的的命令。

## 交互式对话

交互式对话是用户和 ChatHub 交互的主要方式，用户可以通过输入文本来和 ChatHub 进行对话，ChatHub 会根据用户的输入和当前的聊天模式与模型，让模型生成回复，并发送给用户。

### 模型对话

```sh
chathub.chat <message:text>
```

和模型进行对话。

执行后会根据用户的输入和当前的聊天模式与模型，让模型生成回复，并发送给用户。如

```sh
chathub.chat 你是？
```

参数 `message`，表示要发送给模型的文本内容。如果文本内容为空或无效，会返回一个错误信息。

还有以下可选参数应用于此命令：

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 聊天模式，如 `chat`,`plugin`,`browsing` | 1  |
| -m \<model:string>    | 使用的模型，如 `openai/gpt-3.5-turbo`,`claude2/claude2`| 1  |

你也可以使用别名 `聊天` 命令来替代 `chathub.chat`。

### 语音输出对话

```sh
chathub.voice [model:string] <message:text>
```

和模型进行对话并输出为语音。

执行后会根据用户的输入和当前的聊天模式与模型，让模型生成回复，并调用语音服务将其转换为语音文件，发送给用户。如：

```sh
chathub.voice 芝士雪豹
```

该子命令有两个参数:

参数 `message`，表示要发送给模型的文本内容。如果文本内容为空或无效，会返回一个错误信息。
参数 `model`，表示要切换到的模型名称。如果不使用该参数，则使用设置的默认模型。

还有以下可选参数应用于此命令：

| 参数                    | 说明                         | 权限 |
|------------------------|----------------------------|----|
| -c \<chatMode:string>  | 选择聊天模式，同上  | 1  |
| -s \<speakerId:number> | 语音服务的目标人物的ID，如 114 | 1  |

你也可以使用别名 `语音聊天` 命令来替代 `chathub.voice`。

### 列出聊天模式

用于列出目前支持的聊天模式。如：

```sh
chathub.listchatmode
```

执行后会返回一个列表，显示所有可用的聊天模式及其简介。

你也可以使用别名 `聊天模式列表` 命令来替代 `chathub.listchatmode`。

::: tip
有关 ChatHub 的聊天模式，详见[聊天模式](/guide/chat-mode-and-output-mode)
:::

## 会话管理

会话管理是 ChatHub 的功能之一，它可以删除某个会话，重置会话聊天记录等。

有关 ChatHub 的会话，详见[会话，白名单，并发限制与聊天限额](/guide/session-whitelist-concurrency-limit)

### 查询会话

```sh
chathub.queryconverstion [model:string]
```

查询会话列表。如：

```sh
chathub.queryconverstion
```

执行后会显示所有与执行此命令的用户相关的会话及其信息。

参数 `model`，表示要查询的模型名称。如果不指定，则查询所有模型的会话。

还有以下可选参数应用于此命令：

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -m \<model:string>    | 目标模型，如 `openai/gpt-3.5-turbo`,`claude2/claude2`  | 1  |
| -c \<chatMode:string> | 目标聊天模式，如 `chat`,`plugin`,`browsing` | 1  |

你也可以使用别名 `会话列表` 命令用来替代 `chathub.queryconverstion`。

### 删除会话

```sh
chathub.deleteconverstaion [id:string]
```

删除会话。

执行后会根据指定的会话 ID，从数据库中删除对应的会话记录。如：

```sh
chathub.deleteconverstaion 3C404694-9F5C-1C6D-9F0F-9D6CA125D51E
```

参数 id 表示要删除的会话 ID。这是一个必须参数。

目前的会话 ID 使用 uuid v4 生成，因此会话 ID 的格式为 uuid v4 的格式，如 `3C404694-9F5C-1C6D-9F0F-9D6CA125D51E`。

你也可以使用 `删除会话` 命令来替代 `chathub.deleteconverstaion`。

### 删除所有会话

删除和执行此命令用户相关的所有会话。

执行后会从数据库中删除所有与当前用户相关的会话记录。如：

```sh
chathub.deleteallconverstaion
```

:::warning
此命令需要执行者拥有 3 级的 [用户权限](https://koishi.chat/zh-CN/manual/usage/permission.html#%E7%94%A8%E6%88%B7%E6%9D%83%E9%99%90)。
:::

你也可以使用别名 `删除所有会话` 命令来替代 `chathub.deleteallconverstaion`。

### 重置会话

```sh
chathub.reset [model:string]
```

重置当前使用会话记录。如：

```sh
chathub.reset
```

::: tip
此命令不会重置长期记忆。
:::

参数 `model`，表示要重置的会话的模型名称。如果不使用，则保持当前默认的模型。

还有以下可选参数，这些参数用于约束所重置的会话的范围：

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 目标聊天模式，如 `chat`,`plugin`,`browsing`  | 1  |

你也可以使用别名 `重置会话` 命令来替代 `chathub.reset`。

## 模型管理

模型管理是 ChatHub 的功能之一，它可以列出所有支持的模型，切换当前使用的模型等。

有关模型，详见[模型平台](/guide/configure-model-platform/introduction)

### 模型列表

列出所有目前支持的模型。

执行后会返回一个列表，显示所有可用的模型。如：

```sh
chathub.listmodel
```

你也可以使用别名 `模型列表`，来替代 `chathub.listmodel`。

### 设置模型

```sh
chathub.setmodel <model>
```

设置当前群聊/私聊默认使用的模型，如：

```sh
chathub.setmodel openai/gpt-3.5-turbo
```

执行后会根据指定的模型名称，修改默认模型配置。

参数 `model` 表示要切换到的模型名称。如果不存在该名称的模型，会返回错误信息。

还有以下可选参数应用于此命令:

| 参数 | 说明                                     | 权限 |
|----|----------------------------------------|----|
| -g | 也设置为全局默认的模型。如果指定了该参数，则所有新建的会话都会使用该模型 | 1  |

你也可以使用别名 `切换模型`，来替代 `chathub.setmodel`。

## 嵌入模型和向量数据库管理

嵌入模型和向量数据库是 ChatHub 的功能之一，它可以列出所有支持的嵌入模型和向量数据库，切换当前使用的嵌入模型和向量数据库等。

有关嵌入模型和向量数据库，详见[嵌入模型](/guide/configure-embedding-model/introduction)和[向量数据库](/guide/configure-vector-store/introduction)

### 列出嵌入模型

列出所有目前支持的嵌入模型，如：

```sh
chathub.listembeddings
```

执行后会返回一个列表，显示所有可用的嵌入模型及其简介。

你也可以使用别名 `嵌入模型列表`，来替代 `chathub.listembeddings`。

### 列出向量数据库

列出所有目前支持的向量数据库，如：

```sh
chathub.listvectorStore
```

执行后会返回一个列表，显示所有可用的向量数据库及其简介。

你也可以使用别名 `向量数据库列表`，来替代 `chathub.listvectorStore`。

### 设置默认嵌入模型

```sh
chathub.setembeddings <embeddings:string>
```

设置默认使用的嵌入模型，如：

```sh
chathub.setembeddings openai/text-embedding-ada-002
```

执行后会根据指定的嵌入模型名称，修改默认使用的嵌入模型，并重启插件完成更改。

参数 `embeddings`，表示要切换到的嵌入模型名称。如果不存在该名称的嵌入模型，会返回一个错误信息。

你也可以使用别名 `设置嵌入模型`，来替代 `chathub.setembeddings`。

### 设置默认向量数据库

```sh
chathub.setvectorstore <vectorStore:string>
```

设置默认使用的向量数据库，如：

```sh
chathub.setvectorstore faiss
```

执行后会根据指定的向量数据库名称，修改默认使用的向量数据库，并重启插件完成更改。

参数 `vectorStore`，表示要切换到的向量数据库名称。如果不存在该名称的向量数据库，会返回一个错误信息。

你也可以使用别名 `设置向量数据库`，来替代 `chathub.setvectorstore`。

## 预设管理

预设用于设置模型的初始对话，模型的对话风格等。

有关预设，详见[预设系统](/guide/preset-system/introduction)

### 预设列表

列出所有目前支持的预设，如：

```sh
chathub.listpreset
```

执行后会返回一个列表，显示所有可用的预设。

你也可以使用别名 `预设列表`，来替代 `chathub.listpreset`。

### 设置预设

```sh
chathub.setpreset <preset:string>
```

设置当前群聊/私聊默认使用的预设，如：

```sh
chathub.setpreset 猫娘
```

执行后会根据指定的预设名称，切换预设。

参数 `preset`，表示要切换到的预设名称。如果不存在该名称的预设，会返回一个错误信息。

还有以下可选参数应用于此命令:

| 参数                    | 说明                                            | 权限 |
|-----------------------|-----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise`  | 1  |
| -m \<model:string>    | 切换的目标模型，可以是 `chatgpt`、`chatgpt2` 或 `chatgpt3` | 1  |
| -g                    | 也设置为全局会话默认的预设？如果指定了该参数，则所有新建的会话都会使用该预设        | 1  |

你也可以使用别名 `切换预设`，来替代 `chathub.setpreset`。

### 重置预设

```sh
chathub.resetpreset [model:string]
```

用于重置为默认使用的预设（chatgpt预设）。

如：

```sh
chathub.resetpreset
```

参数 `model`，表示要重置为的模型名称。如果不指定，则默认为 `chatgpt`。

该子命令还有以下可选参数:

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1  |

你也可以使用别名 `重置预设`，来替代 `chathub.resetpreset`。

### 添加预设

添加一个预设，如：

```sh
chathub.addpreset 丁真
```

执行后会插件会要求用户发送预设内容，当插件接收到了预设内容后，会将其保存到配置文件中。

参数 `<preset:string>`，表示要添加的预设名称。如果已存在同名的预设，会返回一个错误信息。

你也可以使用别名 `添加预设`，来替代 `chathub.addpreset`。

### 删除预设

用于删除一个预设。如：

```sh
chathub.deletepreset 丁真
```

执行后会根据指定的预设名称，从配置文件中删除对应的预设。

该子命令有一个必选参数 `<preset:string>`，表示要删除的预设名称。如果不存在该名称的预设，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `删除预设`，来替代 `chathub.deletepreset`。

## 数据管理

### 双清

```sh
chathub.wipe
```

该子命令用于清空 chathub 的所有使用数据，需要至少 3 级权限。执行后会删除数据库中的所有会话记录、预设配置、向量数据库等数据，并重置聊天状态。

该子命令还有一个别名 `双清 chathub`，来替代 `chathub.wipe`。
## 参考

- [权限系统](https://koishi.chat/zh-CN/manual/usage/permission.html#%E7%94%A8%E6%88%B7%E6%9D%83%E9%99%90)
