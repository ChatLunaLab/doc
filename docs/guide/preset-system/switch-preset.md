# 使用预设

预设是一种方便的方式，可以让你快速地设置模型的初始对话和对话风格。

你可以使用预设来切换不同的角色、场景、语言等。

本节将介绍如何管理和使用预设。

## 如何使用预设?

1. 前往 [presets](https://github.com/ChatHubLab/awesome-chathub-presets/tree/main/presets) 文件夹，浏览并下载你喜欢的预设文件。
2. 找到你的 Koishi 插件的安装目录，然后将下载的预设文件放入 `data/chathub/presets` 文件夹中。
3. 使用 `chathub.listpreset` 命令，查看你已经添加的预设。
4. 使用 `chathub.setpreset` 命令，设置你想要使用的预设。

> 我们即将推出官方的预设仓库 Koishi 插件，可直接搜索或下载你喜欢的预设，敬请期待。

## 预设系统

预设是一些包含了模型参数和对话设置的文件，它们存储在预设文件中。

你可以使用预设管理指令来列出、设置、重置、添加或删除预设。这些指令都以 `chathub` 开头，后面跟着子命令和参数。

你可以前往指令列表的 [预设管理](/guide/useful-commands.html#预设管理) 查看相关指令，也可以直接看本节指令介绍，两者基本相同。

## 预设列表

要列出所有目前支持的预设，你可以使用以下指令：

```sh
chathub.listpreset
```

或者

```sh
预设列表
```

执行后会返回一个列表，显示所有可用的预设的名称和描述。

## 设置预设

要设置当前群聊或私聊默认使用的预设，你可以使用以下指令：

```sh
chathub.setpreset <preset:string>
```

或者

```sh
切换预设 <preset:string>
```

其中 `<preset:string>` 是要切换到的预设名称。如果不存在该名称的预设，会返回一个错误信息。

例如：

```sh
chathub.setpreset 猫娘
```

执行后会根据指定的预设名称，切换到 `猫娘` 预设。

还有以下可选参数应用于此命令:

| 参数 | 说明 | 权限 |
| --- | --- | --- |
| -c <chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1 |
| -m <model:string> | 切换的目标模型，可以是 `chatgpt`、`chatgpt2` 或 `chatgpt3` | 1 |
| -g | 也设置为全局会话默认的预设？如果指定了该参数，则所有新建的会话都会使用该预设 | 1 |

## 重置预设

要重置为默认使用的预设（`chatgpt` 预设），你可以使用以下指令：

```sh
chathub.resetpreset [model:string]
```

或者

```sh
重置预设 [model:string]
```

其中 `[model:string]` 是可选参数，表示要重置为的模型名称。如果不指定，则默认为 `chatgpt`。

例如：

```sh
chathub.resetpreset chatgpt3
```

执行后会重置为 `chatgpt3` 预设。

还有以下可选参数应用于此命令:

| 参数 | 说明 | 权限 |
| --- | --- | --- |
| -c <chatMode:string> | 选择聊天模式，可以是 `Balanced`、`Creative` 或 `Precise` | 1 |

## 添加预设

要添加一个新的预设，你可以使用以下指令：

```sh
chathub.addpreset <preset:string>
```

或者

```sh
添加预设 <preset:string>
```

其中 `<preset:string>` 是要添加的预设名称。如果已存在同名的预设，会返回一个错误信息。

例如：

```sh
chathub.addpreset 丁真
```

执行后插件会要求用户发送预设内容，当插件接收到了预设内容后，会将其保存到配置文件中。

## 删除预设

要删除一个已有的预设，你可以使用以下指令：

```sh
chathub.deletepreset <preset:string>
```

或者

```sh
删除预设 <preset:string>
```

其中 `<preset:string>` 是要删除的预设名称。如果不存在该名称的预设，会返回一个错误信息。

例如：

```sh
chathub.deletepreset 丁真
```

执行后会根据指定的预设名称，从配置文件中删除对应的预设。
