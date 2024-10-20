# 使用预设

本节将介绍如何管理和使用预设。

## 如何使用预设?

在此之前，你需要将你的预设文件放入 Koishi 的数据目录中。

1. 前往 [presets](https://github.com/ChatLunaLab/awesome-chatluna-presets/tree/main/presets) 文件夹，浏览并下载你喜欢的预设文件。

   你也可以从其他任意地方获取预设文件。

2. 找到你的 Koishi 数据目录，将下载的预设文件放入 `<Koishi 数据目录>/data/chathub/presets` 文件夹中。

3. 查看下面的章节，了解如何切换预设。

### 对于某个房间

1. 使用 [`chatluna.preset.list`](../useful-commands.md#预设列表) 命令，查看你已经添加的预设。
2. 使用 [`chatluna.room.set -p <preset>`](../useful-commands.md#设置预设) 命令，对当前你所在的房间切换为你想要使用的预设。

### 对于模版克隆房间

1. 执行一次 [`chatluna.preset.list`](../useful-commands.md#列出预设列表) 命令，查看你已经添加的预设。
2. 前往 Koishi 控制台，找到 ChatLuna 的配置项，在 [`defaultPreset`](../useful-configurations.md#defaultpreset) 选项里选择你需要使用的预设即可。
