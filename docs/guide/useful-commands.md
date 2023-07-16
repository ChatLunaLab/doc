# 指令列表

本章节介绍了 `chathub` 模块提供的所有命令，以及它们的用法和参数。这些命令可以在聊天中使用，以控制聊天链的行为和配置。

## chathub

```sh 
chathub 
```

该命令用于查看所有子命令，需要至少 1 级权限。该命令有以下子命令，可以用来控制不同的聊天功能和配置。

::: tip 用户权限
基于 Koishi 内部默认的 [权限系统](https://koishi.chat/zh-CN/manual/usage/permission.html#%E7%94%A8%E6%88%B7%E6%9D%83%E9%99%90)，它为每个用户赋予了一个权限等级。
:::

### 交互式对话

- [`chathub.chat`](/guide/useful-commands.html#chathub-chat): 开始和模型进行对话
- [`chathub.voice`](/guide/useful-commands.html#chathub-voice): 和模型进行对话并输出为语音

### 会话管理

- [`chathub.queryconverstion`](/guide/useful-commands.html#chathub-queryconverstion): 查询会话列表
- [`chathub.deleteconverstaion`](/guide/useful-commands.html#chathub-deleteconverstaion): 删除会话
- [`chathub.deleteallconverstaion`](/guide/useful-commands.html#chathub-deleteallconverstaion): 删除和你相关的所有会话
- [`chathub.reset`](/guide/useful-commands.html#chathub-reset): 重置会话记录

### 模型管理

- [`chathub.listmodel`](/guide/useful-commands.html#chathub-listmodel): 列出所有目前支持的模型
- [`chathub.setmodel`](/guide/useful-commands.html#chathub-setmodel): 设置当前默认使用的模型

### 嵌入模型和向量存储管理

- [`chathub.listembeddings`](/guide/useful-commands.html#chathub-listembeddings): 列出所有目前支持的嵌入模型
- [`chathub.setembeddings`](/guide/useful-commands.html#chathub-setembeddings): 设置默认使用的嵌入模型
- [`chathub.listvectorStore`](/guide/useful-commands.html#chathub-listvectorstore): 列出所有目前支持的向量数据库
- [`chathub.setvectorstore`](/guide/useful-commands.html#chathub-setvectorstore): 设置默认使用的向量数据库

### 预设管理

- [`chathub.listpreset`](/guide/useful-commands.html#chathub-listpreset): 列出所有目前支持的预设
- [`chathub.setpreset`](/guide/useful-commands.html#chathub-setpreset): 设置当前使用的预设
- [`chathub.resetpreset`](/guide/useful-commands.html#chathub-resetpreset): 重置为默认使用的预设 (chatgpt 预设)
- [`chathub.addpreset`](/guide/useful-commands.html#chathub-addpreset): 添加一个预设
- [`chathub.deletepreset`](/guide/useful-commands.html#chathub-deletepreset): 删除一个预设

### 数据管理

- [`chathub.wipe`](/guide/useful-commands.html#chathub-wipe): 清空 chathub 的所有使用数据
- [`chathub.listchatmode`](/guide/useful-commands.html#chathub-listchatmode): 列出目前支持的聊天模式

## chathub 子命令

### 交互式对话

#### chathub.chat

```sh
chathub.chat <message:text>
```

该子命令用于发送文本消息给模型，并接收模型的回复，需要至少 1 级权限。执行后会根据当前的聊天模式和模型，生成一条回复消息，并显示在聊天界面上。

该子命令有一个必选参数 `<message:text>`，表示要发送给模型的文本内容。如果文本内容为空或无效，会返回一个错误信息。

该子命令还有以下可选参数:

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1  |
| -m \<model:string>    | 选择聊天模型，可以是 `chatgpt`、`chatgpt2` 或 `chatgpt3` | 1  |

该子命令还有一个别名 `聊天`，可以用来替代 `chathub.chat`。

#### chathub.voice

```sh
chathub.voice [model:string] <message:text>
```

该子命令用于发送文本消息给模型，并接收模型的回复，并将回复转换为语音，需要至少 1
级权限。执行后会根据当前的聊天模式和模型，生成一条回复消息，并调用语音服务将其转换为语音文件，并播放在聊天界面上。

该子命令有两个参数:

- `[model:string]`:表示要切换到的模型名称。如果不指定，则保持当前模型不变。如果指定了该参数，则必须在其后加上一个空格，然后再输入文本内容。
- `<message:text>`:表示要发送给模型的文本内容。如果没有指定 model 参数，则使用 message 参数作为消息内容。如果文本内容为空或无效，会返回一个错误信息。

该子命令还有以下可选参数:

| 参数                     | 说明                         | 权限 |
|------------------------|----------------------------|----|
| -c \<chatMode:string>  | 选择聊天模式（目前还不可用）             | 1  |
| -s \<speakerId:number> | 语音服务的目标人物的ID，可以是 0、1、2 或 3 | 1  |

该子命令还有一个别名 `转语音聊天`，可以用来替代 `chathub.voice`。

### 会话管理

#### chathub.queryconverstion

```sh
chathub.queryconverstion [model:string]
```

该子命令用于查询会话列表，需要至少 1 级权限。执行后会返回一个列表，显示所有与当前用户相关的会话及其信息。

该子命令有一个可选参数 `[model:string]`，表示要查询的模型名称。如果不指定，则查询所有模型的会话。

该子命令还有以下可选参数:

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -m \<model:string>    | 选择模型，可以是 `chatgpt`、`chatgpt2` 或 `chatgpt3`   | 1  |
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1  |

该子命令还有一个别名 `会话列表`，可以用来替代 `chathub.queryconverstion`。

#### chathub.deleteconverstaion

```sh
chathub.deleteconverstaion <id:string>
```

该子命令用于删除会话，需要至少 1 级权限。执行后会根据指定的会话 ID，从数据库中删除对应的会话记录，并重置聊天状态。

该子命令有一个必选参数 `<id:string>`，表示要删除的会话 ID。如果不存在该 ID 的会话，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `删除会话`，可以用来替代 `chathub.deleteconverstaion`。

#### chathub.deleteallconverstaion

```sh
chathub.deleteallconverstaion
```

该子命令用于删除和你相关的所有会话，需要至少 3 级权限。执行后会从数据库中删除所有与当前用户相关的会话记录，并重置聊天状态。

该子命令没有参数。

该子命令还有一个别名 `删除所有会话`，可以用来替代 `chathub.deleteallconverstaion`。

#### chathub.reset

```sh
chathub.reset [model:string]
```

该子命令用于重置会话记录（注意不会清除长期记忆），需要至少 1 级权限。执行后会清空当前会话的聊天历史，并重新初始化聊天链的状态。

该子命令有一个可选参数 `[model:string]`，表示要重置为的模型名称。如果不指定，则保持当前模型不变。

该子命令还有以下可选参数:

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1  |

该子命令还有一个别名 `重置会话`，可以用来替代 `chathub.reset`。

### 模型管理

#### chathub.listmodel

```sh
chathub.listmodel
```

该子命令用于列出所有目前支持的模型，需要至少 1
级权限。模型是聊天链的核心组件，负责生成聊天内容。目前支持的模型有 `chatgpt`、`chatgpt2` 和 `chatgpt3`。

该子命令没有参数，执行后会返回一个列表，显示所有可用的模型及其简介。

该子命令还有一个别名 `模型列表`，可以用来替代 `chathub.listmodel`。

#### chathub.setmodel

```sh
chathub.setmodel <model>
```

该子命令用于设置当前群聊/私聊默认使用的模型，需要至少 1 级权限。执行后会根据指定的模型名称，修改聊天链的配置，并重置聊天状态。

该子命令有一个必选参数 `<model>`，表示要切换到的模型名称。如果不存在该名称的模型，会返回一个错误信息。

该子命令还有以下可选参数:

| 参数 | 说明                                     | 权限 |
|----|----------------------------------------|----|
| -g | 也设置为全局会话默认的模型？如果指定了该参数，则所有新建的会话都会使用该模型 | 1  |

该子命令还有一个别名 `切换模型`，可以用来替代 `chathub.setmodel`。

### 嵌入模型和向量存储管理

#### chathub.listembeddings

```sh
chathub.listembeddings
```

该子命令用于列出所有目前支持的嵌入模型，需要至少 1
级权限。嵌入模型是一种将文本转换为向量的方法，可以用来计算文本之间的相似度或语义关系。目前支持的嵌入模型有 `bert`、`word2vec`
和 `fasttext`。

该子命令没有参数，执行后会返回一个列表，显示所有可用的嵌入模型及其简介。

该子命令还有一个别名 `嵌入模型列表`，可以用来替代 `chathub.listembeddings`。

#### chathub.listvectorStore

```sh
chathub.listvectorStore
```

该子命令用于列出所有目前支持的向量数据库，需要至少 1
级权限。向量数据库是一种存储和查询向量的工具，可以用来快速检索与给定向量最相似的向量。目前支持的向量数据库有 `faiss`、`annoy`
和 `nmslib`。

该子命令没有参数，执行后会返回一个列表，显示所有可用的向量数据库及其简介。

该子命令还有一个别名 `向量数据库列表`，可以用来替代 `chathub.listvectorStore`。

#### chathub.setembeddings

```sh
chathub.setembeddings <embeddings:string>
```

该子命令用于设置默认使用的嵌入模型，需要至少 1 级权限。执行后会根据指定的嵌入模型名称，修改聊天链的配置，并重置聊天状态。

该子命令有一个必选参数 `<embeddings:string>`，表示要切换到的嵌入模型名称。如果不存在该名称的嵌入模型，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `设置嵌入模型`，可以用来替代 `chathub.setembeddings`。

#### chathub.setvectorstore

```sh
chathub.setvectorstore <vectorStore:string>
```

该子命令用于设置默认使用的向量数据库，需要至少 1 级权限。执行后会根据指定的向量数据库名称，修改聊天链的配置，并重置聊天状态。

该子命令有一个必选参数 `<vectorStore:string>`，表示要切换到的向量数据库名称。如果不存在该名称的向量数据库，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `设置向量数据库`，可以用来替代 `chathub.setvectorstore`。

### 预设管理

#### chathub.listpreset

```sh
chathub.listpreset
```

该子命令用于列出所有目前支持的预设，需要至少 1 级权限。预设是一组聊天链的参数，包括聊天模式、模型名称等，可以方便地切换不同的聊天场景。

该子命令没有参数，执行后会返回一个列表，显示所有可用的预设及其对应的参数。

该子命令还有一个别名 `预设列表`，可以用来替代 `chathub.listpreset`。

#### chathub.setpreset

```sh
chathub.setpreset <preset:string>
```

该子命令用于设置当前使用的预设，需要至少 1 级权限。执行后会根据指定的预设名称，修改聊天链的参数，并重置聊天状态。

该子命令有一个必选参数 `<preset:string>`，表示要切换到的预设名称。如果不存在该名称的预设，会返回一个错误信息。

该子命令还有以下可选参数:

| 参数                    | 说明                                            | 权限 |
|-----------------------|-----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise`  | 1  |
| -m \<model:string>    | 切换的目标模型，可以是 `chatgpt`、`chatgpt2` 或 `chatgpt3` | 1  |
| -g                    | 也设置为全局会话默认的预设？如果指定了该参数，则所有新建的会话都会使用该预设        | 1  |

该子命令还有一个别名 `切换预设`，可以用来替代 `chathub.setpreset`。

#### chathub.resetpreset

```sh
chathub.resetpreset [model:string]
```

该子命令用于重置为默认使用的预设（chatgpt预设），需要至少 1 级权限。执行后会将聊天链的参数恢复为默认值，并重置聊天状态。

该子命令有一个可选参数 `[model:string]`，表示要重置为的模型名称。如果不指定，则默认为 `chatgpt`。

该子命令还有以下可选参数:

| 参数                    | 说明                                           | 权限 |
|-----------------------|----------------------------------------------|----|
| -c \<chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1  |

该子命令还有一个别名 `重置预设`，可以用来替代 `chathub.resetpreset`。

#### chathub.addpreset

```sh
chathub.addpreset <preset:string>
```

该子命令用于添加一个预设，需要至少 1 级权限。执行后会根据当前聊天链的参数，创建一个新的预设，并保存到配置文件中。

该子命令有一个必选参数 `<preset:string>`，表示要添加的预设名称。如果已存在同名的预设，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `添加预设`，可以用来替代 `chathub.addpreset`。

#### chathub.deletepreset

```sh
chathub.deletepreset <preset:string>
```

该子命令用于删除一个预设，需要至少 1 级权限。执行后会根据指定的预设名称，从配置文件中删除对应的预设，并重置聊天状态。

该子命令有一个必选参数 `<preset:string>`，表示要删除的预设名称。如果不存在该名称的预设，会返回一个错误信息。

该子命令没有可选参数。

该子命令还有一个别名 `删除预设`，可以用来替代 `chathub.deletepreset`。

### 数据管理

#### chathub.wipe

```sh
chathub.wipe
```

该子命令用于清空 chathub 的所有使用数据，需要至少 3 级权限。执行后会删除数据库中的所有会话记录、预设配置、长期记忆等数据，并重置聊天状态。

该子命令没有参数。

该子命令还有一个别名 `双清 chathub`，可以用来替代 `chathub.wipe`。

#### chathub.listchatmode

```sh
chathub.listchatmode
```

该子命令用于列出目前支持的聊天模式，需要至少 1
级权限。聊天模式是一种控制聊天链行为的方式，可以影响聊天内容的风格和质量。目前支持的聊天模式有:

- `Balanced`:平衡模式，适合大多数场景，既不太创造性也不太精确。
- `Creative`:创造性模式，适合寻求新奇和惊喜的场景，更加灵活和有趣，但可能不太准确。
- `Precise`:精确模式，适合寻求准确和专业的场景，更加严谨和合理，但可能不太有趣。

该子命令没有参数，执行后会返回一个列表，显示所有可用的聊天模式及其简介。

该子命令还有一个别名 `聊天模式列表`，可以用来替代 `chathub.listchatmode`。
