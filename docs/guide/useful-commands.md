# 指令列表

本文列举了目前主插件可用的全部指令，你可以随时查阅此文档来了解相关指令用法。

## 聊天

### 基础用法

输入 `chathub.chat` + 内容就可以开始和模型聊天了。

你也可以使用`聊天`命令来代替`chathub.chat`命令。

例如:

``` txt
chathub.chat 你好
```

:::warning
使用基础的聊天命令时你需要设置一个默认模型平台，否则插件将会报错。

可以先使用 [列出模型列表](#列出模型列表) 命令来查看目前插件支持的模型。
再使用 [设置默认模型](#设置默认模型) 命令来设置默认模型。
:::

### 指定模型平台

使用 `-m` 或 `--model` 参数来指定模型平台。例如：

``` txt
chathub.chat -m openai/gpt3.5-turbo 你好
```

### 设置聊天模式

使用 `-c` 或 `--chat-mode` 参数来指定聊天模式。例如:

``` txt
chathub.chat -c browsing 搜一下蔡徐坤和鸡你太美有什么关系？
```

关于聊天模式，你可以查看 [聊天模式](/guide/useful-configurations/#聊天模式) 章节来了解。

### 语音聊天

这里的语音聊天也就是让插件所发送消息为语音消息，也就是把模型生成的文本转语音后发送。

使用 `chathub.voice` + 内容就可以开始和模型语音聊天了。
你也可以使用`语音聊天`命令来代替`chathub.voice`命令。例如:

``` txt
chathub.voice 你好
```

需要注意，此命令的其他可选参数和`chathub.chat`命令相同。

## 预设

关于预设系统的详细解释请查看 [预设系统](/guide/preset-system) 章节。
此处只列出预设系统相关的指令。

### 列出预设列表

输入 `chathub.listpresets` 就可以列出目前插件已经加载的全部预设。
你也可以使用`预设列表`命令来代替`chathub.listpresets`命令。例如：

``` txt
chathub.listpresets
```

### 切换预设

输入 `chathub.setpreset` + 预设名就可以切换预设了。
你也可以使用`切换预设`命令来代替`chathub.setpreset`命令。例如：

``` txt
chathub.setpreset chatgpt
```

### 切换默认预设

## 模型

### 列出模型列表

### 设置默认模型

## 会话

### 列出全部会话

### 删除会话
