# 使用预设

本节将介绍如何管理和使用预设。

## 如何使用预设?

1. 前往 [presets](https://github.com/ChatHubLab/awesome-chathub-presets/tree/main/presets) 文件夹，浏览并下载你喜欢的预设文件。
2. 找到你的 Koishi 插件的安装目录，然后将下载的预设文件放入 `data/chathub/presets` 文件夹中。
3. 使用 [`chathub.listpreset`](#预设列表) 命令，查看你已经添加的预设。
4. 使用 [`chathub.setpreset`](#设置预设) 命令，设置你想要使用的预设。

> 我们即将推出官方的预设仓库 Koishi 插件，可直接搜索或下载你喜欢的预设，敬请期待。

## 预设系统

预设是一些包含了模型参数和对话设置的文件，它们存储在预设文件中。

你可以使用预设管理指令来列出、设置、重置、添加或删除预设。这些指令都以 `chathub` 开头，后面跟着子命令和参数。

你可以前往指令列表的 [预设管理](/guide/useful-commands.html#预设管理) 查看相关指令，也可以直接看本节指令介绍，两者基本相同。
